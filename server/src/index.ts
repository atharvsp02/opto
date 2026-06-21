import "dotenv/config";
import express from "express";
import cors from "cors";
import cron from "node-cron";
import { pool, query } from "./db";
import { requireAuth } from "./authMiddleware";
import { ensureOpenRound, resolveExpiredRounds } from "./rounds";

const PREDICTION_COST = 100;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    const result = await query("SELECT now()");
    res.json({ status: "ok", dbTime: result.rows[0].now });
  } catch (err) {
    console.error("Health check failed:", err);
    res.status(500).json({ status: "error", message: "database unreachable" });
  }
});

app.get("/me", requireAuth, async (req, res) => {
  try {
    const result = await query(
      `INSERT INTO users (id, display_name, email)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name
       RETURNING id, display_name, email, coins, created_at`,
      [req.uid, req.displayName ?? null, req.email ?? null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("/me failed:", err);
    res.status(500).json({ error: "could not load profile" });
  }
});

app.get("/round/current", async (_req, res) => {
  try {
    const roundResult = await query(
      "SELECT id, expiry_time FROM rounds WHERE status = 'open' ORDER BY id DESC LIMIT 1"
    );
    if (roundResult.rowCount === 0) {
      return res.status(404).json({ error: "no open round" });
    }
    const round = roundResult.rows[0];

    const questionsResult = await query(
      "SELECT id, crypto, target_price FROM questions WHERE round_id = $1 ORDER BY id",
      [round.id]
    );

    res.json({
      roundId: round.id,
      expiryTime: round.expiry_time,
      questions: questionsResult.rows,
    });
  } catch (err) {
    console.error("GET /round/current failed:", err);
    res.status(500).json({ error: "could not load round" });
  }
});

app.get("/me/predictions", requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT p.id,
              p.answer,
              p.status,
              p.created_at,
              q.crypto,
              q.target_price,
              q.correct_answer,
              q.round_id
         FROM predictions p
         JOIN questions q ON q.id = p.question_id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC
        LIMIT 50`,
      [req.uid]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /me/predictions failed:", err);
    res.status(500).json({ error: "could not load predictions" });
  }
});

app.post("/predictions", requireAuth, async (req, res) => {
  const { questionId, answer } = req.body ?? {};

  if (!Number.isInteger(questionId)) {
    return res.status(400).json({ error: "questionId must be an integer" });
  }
  if (answer !== "yes" && answer !== "no") {
    return res.status(400).json({ error: "answer must be 'yes' or 'no'" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      "SELECT coins FROM users WHERE id = $1 FOR UPDATE",
      [req.uid]
    );
    if (userResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "user not found" });
    }
    const coins = userResult.rows[0].coins;

    const questionResult = await client.query(
      `SELECT r.status, r.expiry_time
         FROM questions q
         JOIN rounds r ON r.id = q.round_id
        WHERE q.id = $1`,
      [questionId]
    );
    if (questionResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "question not found" });
    }
    const round = questionResult.rows[0];
    if (round.status !== "open" || new Date(round.expiry_time) <= new Date()) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "round is closed" });
    }

    if (coins < PREDICTION_COST) {
      await client.query("ROLLBACK");
      return res.status(402).json({ error: "not enough coins" });
    }

    await client.query(
      "UPDATE users SET coins = coins - $1 WHERE id = $2",
      [PREDICTION_COST, req.uid]
    );

    const insertResult = await client.query(
      `INSERT INTO predictions (user_id, question_id, answer)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, question_id) DO NOTHING
       RETURNING id`,
      [req.uid, questionId, answer]
    );
    if (insertResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "already predicted on this question" });
    }

    await client.query("COMMIT");

    res.status(201).json({
      predictionId: insertResult.rows[0].id,
      coins: coins - PREDICTION_COST,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("POST /predictions failed:", err);
    res.status(500).json({ error: "could not place prediction" });
  } finally {
    client.release();
  }
});

cron.schedule("* * * * *", () => {
  resolveExpiredRounds().catch((err) =>
    console.error("Round resolver tick failed:", err)
  );
});

const port = process.env.PORT || 4000;
app.listen(port, async () => {
  console.log(`OPTO backend listening on http://localhost:${port}`);
  try {
    await ensureOpenRound();
  } catch (err) {
    console.error("Failed to ensure an open round on startup:", err);
  }
});
