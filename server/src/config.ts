function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    console.warn(`Invalid ${name}="${raw}"; falling back to ${fallback}`);
    return fallback;
  }
  return parsed;
}

const ROUND_DURATION_MINUTES = intFromEnv("ROUND_DURATION_MINUTES", 5);

export const ROUND_DURATION_MS = ROUND_DURATION_MINUTES * 60 * 1000;

export const RESOLVER_CRON = process.env.RESOLVER_CRON || "* * * * *";

export const REWARD = intFromEnv("ROUND_REWARD", 200);

export const PREDICTION_COST = intFromEnv("PREDICTION_COST", 100);
