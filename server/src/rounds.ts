import { pool } from "./db";
import type { PoolClient } from "pg";

export const ROUND_DURATION_MS = 5 * 60 * 1000;
export const REWARD = 200;

// `delta` is added to the live price to form each question's target.
// `id` is the CoinGecko id used in the price API.
const CRYPTOS = [
  { crypto: "BTC", id: "bitcoin", delta: 1000 },
  { crypto: "ETH", id: "ethereum", delta: 100 },
  { crypto: "SOL", id: "solana", delta: 10 },
  { crypto: "DOGE", id: "dogecoin", delta: 0.01 },
  { crypto: "ADA", id: "cardano", delta: 0.1 },
  { crypto: "BNB", id: "binancecoin", delta: 10 },
  { crypto: "POL", id: "polygon-ecosystem-token", delta: 0.1 },
  { crypto: "XRP", id: "ripple", delta: 0.1 },
] as const;

type PriceMap = Record<string, number>;

// Throws on any failure or missing price — callers must never settle money on bad data.
async function fetchPrices(): Promise<PriceMap> {
  const ids = CRYPTOS.map((c) => c.id).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CoinGecko returned ${res.status}`);
  }
  const data = (await res.json()) as Record<string, { usd: number }>;

  const prices: PriceMap = {};
  for (const c of CRYPTOS) {
    const usd = data[c.id]?.usd;
    if (typeof usd !== "number") {
      throw new Error(`missing price for ${c.id}`);
    }
    prices[c.id] = usd;
  }
  return prices;
}

async function openRound(client: PoolClient, prices: PriceMap): Promise<number> {
  const roundResult = await client.query(
    `INSERT INTO rounds (expiry_time, status)
     VALUES (now() + ($1::bigint * interval '1 millisecond'), 'open')
     RETURNING id`,
    [ROUND_DURATION_MS]
  );
  const roundId = roundResult.rows[0].id;

  for (const c of CRYPTOS) {
    const target = prices[c.id] + c.delta;
    await client.query(
      `INSERT INTO questions (round_id, crypto, target_price)
       VALUES ($1, $2, $3)`,
      [roundId, c.crypto, target]
    );
  }
  return roundId;
}

export async function ensureOpenRound(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const existing = await client.query(
      "SELECT id FROM rounds WHERE status = 'open' LIMIT 1 FOR UPDATE"
    );
    if (existing.rowCount && existing.rowCount > 0) {
      await client.query("ROLLBACK");
      return;
    }
    const prices = await fetchPrices();
    const id = await openRound(client, prices);
    await client.query("COMMIT");
    console.log(`Opened initial round ${id}`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function resolveExpiredRounds(): Promise<void> {
  const due = await pool.query(
    "SELECT id FROM rounds WHERE status = 'open' AND expiry_time <= now()"
  );
  if (due.rowCount === 0) return;

  // Fetch once per tick; on failure resolve nothing and retry next tick.
  let prices: PriceMap;
  try {
    prices = await fetchPrices();
  } catch (err) {
    console.error("Price fetch failed; skipping resolution this tick:", err);
    return;
  }

  for (const row of due.rows) {
    await resolveOneRound(row.id, prices);
  }
}

async function resolveOneRound(roundId: number, prices: PriceMap): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Re-check status under a row lock so overlapping ticks can't pay out twice.
    const lock = await client.query(
      "SELECT status FROM rounds WHERE id = $1 FOR UPDATE",
      [roundId]
    );
    if (lock.rowCount === 0 || lock.rows[0].status !== "open") {
      await client.query("ROLLBACK");
      return;
    }

    const questions = await client.query(
      "SELECT id, crypto, target_price FROM questions WHERE round_id = $1",
      [roundId]
    );

    for (const q of questions.rows) {
      const meta = CRYPTOS.find((c) => c.crypto === q.crypto);
      if (!meta) continue;

      const targetPrice = Number(q.target_price);
      const correctAnswer = prices[meta.id] >= targetPrice ? "yes" : "no";

      await client.query(
        "UPDATE questions SET correct_answer = $1 WHERE id = $2",
        [correctAnswer, q.id]
      );

      await client.query(
        `UPDATE predictions
            SET status = CASE WHEN answer = $1 THEN 'correct' ELSE 'wrong' END
          WHERE question_id = $2 AND status = 'pending'`,
        [correctAnswer, q.id]
      );

      await client.query(
        `UPDATE users u
            SET coins = coins + $1
           FROM predictions p
          WHERE p.user_id = u.id
            AND p.question_id = $2
            AND p.status = 'correct'`,
        [REWARD, q.id]
      );
    }

    await client.query(
      "UPDATE rounds SET status = 'resolved' WHERE id = $1",
      [roundId]
    );

    const nextId = await openRound(client, prices);

    await client.query("COMMIT");
    console.log(`Resolved round ${roundId}, opened round ${nextId}`);
  } catch (err) {
    // Swallow per-round: one bad round must not abort the others in this tick.
    await client.query("ROLLBACK");
    console.error(`Failed to resolve round ${roundId}:`, err);
  } finally {
    client.release();
  }
}
