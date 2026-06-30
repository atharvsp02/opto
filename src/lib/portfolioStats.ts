export const PREDICTION_COST = 100;
export const REWARD = 200;

export interface Prediction {
  id: string | number;
  round_id: string | number;
  crypto: string;
  answer: string | null;
  status: "correct" | "wrong" | "pending" | string;
  target_price?: string | number;
  correct_answer?: string | null;
  created_at: string;
}

export const symbolToName: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
  DOGE: "Dogecoin",
  ADA: "Cardano",
  BNB: "Binance Coin",
  POL: "Polygon",
  XRP: "Ripple",
};

export interface PortfolioStats {
  total: number;
  settled: number;
  wins: number;
  losses: number;
  pending: number;
  winRate: number;
  netPnl: number;
  currentStreak: number;
}

export function computeStats(predictions: Prediction[]): PortfolioStats {
  let wins = 0;
  let losses = 0;
  let pending = 0;

  for (const p of predictions) {
    if (p.status === "correct") wins += 1;
    else if (p.status === "wrong") losses += 1;
    else pending += 1;
  }

  const settled = wins + losses;
  const winRate = settled === 0 ? 0 : Math.round((wins / settled) * 100);
  const netPnl = wins * (REWARD - PREDICTION_COST) - losses * PREDICTION_COST;

  let currentStreak = 0;
  for (const p of predictions) {
    if (p.status === "pending") continue;
    if (p.status === "correct") currentStreak += 1;
    else break;
  }

  return {
    total: predictions.length,
    settled,
    wins,
    losses,
    pending,
    winRate,
    netPnl,
    currentStreak,
  };
}

export interface PnlPoint {
  index: number;
  pnl: number;
  label: string;
}

export function buildPnlSeries(predictions: Prediction[]): PnlPoint[] {
  const ordered = [...predictions].reverse();
  const points: PnlPoint[] = [];
  let running = 0;
  let step = 0;

  for (const p of ordered) {
    if (p.status === "pending") continue;
    running += p.status === "correct" ? REWARD - PREDICTION_COST : -PREDICTION_COST;
    step += 1;
    points.push({
      index: step,
      pnl: running,
      label: new Date(p.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    });
  }

  return points;
}
