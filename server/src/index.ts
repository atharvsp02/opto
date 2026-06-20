import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool, query } from "./db";
import { requireAuth } from "./authMiddleware";

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

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`OPTO backend listening on http://localhost:${port}`);
});
