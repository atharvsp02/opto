import "dotenv/config";
import express from "express";
import cors from "cors";
import { query } from "./db";
import { requireAuth } from "./authMiddleware";

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

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`OPTO backend listening on http://localhost:${port}`);
});
