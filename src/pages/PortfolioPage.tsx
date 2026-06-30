import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import { Context } from "@/context/context";
import { getMyPredictions } from "@/api";
import {
  buildPnlSeries,
  computeStats,
  symbolToName,
  type Prediction,
} from "@/lib/portfolioStats";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Main/Navbar";
import Footer from "@/components/Main/Footer";
import Coin from "@/assets/Coin.svg";

const POLL_INTERVAL_MS = 60000;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "correct", label: "Correct" },
  { key: "wrong", label: "Wrong" },
  { key: "pending", label: "Pending" },
];

function statusBadgeVariant(status: string) {
  if (status === "correct") return "default";
  if (status === "wrong") return "destructive";
  return "secondary";
}

export default function PortfolioPage() {
  const { userData } = useContext(Context);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [coinFilter, setCoinFilter] = useState("all");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await getMyPredictions();
        if (active) setPredictions(data);
      } catch {
        if (active) setPredictions([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const stats = useMemo(() => computeStats(predictions), [predictions]);
  const series = useMemo(() => buildPnlSeries(predictions), [predictions]);

  const coinOptions = useMemo(() => {
    const set = new Set(predictions.map((p) => p.crypto));
    return Array.from(set);
  }, [predictions]);

  const filtered = useMemo(() => {
    return predictions.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (coinFilter !== "all" && p.crypto !== coinFilter) return false;
      return true;
    });
  }, [predictions, statusFilter, coinFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, Prediction[]> = {};
    for (const p of filtered) {
      const key = String(p.round_id);
      (groups[key] ||= []).push(p);
    }
    return Object.keys(groups)
      .sort((a, b) => Number(b) - Number(a))
      .map((roundId) => ({ roundId, rows: groups[roundId] }));
  }, [filtered]);

  const pnlPositive = stats.netPnl >= 0;

  const statCards = [
    {
      label: "Total Predictions",
      value: stats.total.toLocaleString(),
      sub: `${stats.pending} pending`,
      icon: Activity,
      tone: "text-foreground",
    },
    {
      label: "Win Rate",
      value: `${stats.winRate}%`,
      sub: `${stats.wins}W · ${stats.losses}L`,
      icon: Target,
      tone: "text-foreground",
    },
    {
      label: "Net P&L",
      value: `${pnlPositive ? "+" : ""}${stats.netPnl.toLocaleString()}`,
      sub: "coins",
      icon: pnlPositive ? ArrowUpRight : ArrowDownRight,
      tone: pnlPositive ? "text-accent" : "text-destructive",
    },
    {
      label: "Current Streak",
      value: stats.currentStreak.toString(),
      sub: stats.currentStreak === 1 ? "win" : "wins",
      icon: Flame,
      tone: stats.currentStreak > 0 ? "text-accent" : "text-foreground",
    },
  ];

  return (
    <div className="min-h-screen bg-background dot-grid">
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-[50px] pt-[120px] pb-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
        >
          <div>
            <p className="section-header mb-2">Dashboard</p>
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl text-foreground">
              Your <span className="text-accent italic">Portfolio</span>
            </h1>
            <p className="body-text text-sm sm:text-base mt-2">
              Track every call, your win rate, and how your coins are trending.
            </p>
          </div>
          {userData && (
            <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-sm">
              <img src={Coin} alt="coins" className="w-6 h-6" />
              <span className="text-lg font-bold tabular-nums">
                {userData.coins.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">balance</span>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl border border-border bg-card animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Card className="p-5 bg-card/80 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {s.label}
                      </p>
                      <Icon className={cn("w-4 h-4", s.tone)} />
                    </div>
                    <p className={cn("text-3xl font-bold tabular-nums mt-3", s.tone)}>
                      {s.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <Card className="p-5 sm:p-6 mb-8 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Coin Balance Trend
              </h2>
            </div>
          </div>
          {series.length === 0 ? (
            <div className="h-56 grid place-items-center text-center">
              <div>
                <p className="text-foreground font-medium">No settled rounds yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your P&L curve appears once predictions resolve.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={series}
                  margin={{ top: 6, right: 6, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="pnlFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(231 100% 55%)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(231 100% 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "hsl(0 0% 45%)" }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={24}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(0 0% 45%)" }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(0 0% 85%)",
                      fontSize: 12,
                      boxShadow: "0 8px 24px -8px rgba(0,0,0,0.2)",
                    }}
                    formatter={(value: number) => [`${value} coins`, "Net P&L"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="pnl"
                    stroke="hsl(231 100% 55%)"
                    strokeWidth={2.5}
                    fill="url(#pnlFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="p-5 sm:p-6 bg-card/80 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Prediction History
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList>
                  {FILTERS.map((f) => (
                    <TabsTrigger key={f.key} value={f.key}>
                      {f.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <select
                value={coinFilter}
                onChange={(e) => setCoinFilter(e.target.value)}
                aria-label="Filter history by coin"
                className="h-10 rounded-md border border-border bg-card px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All coins</option>
                {coinOptions.map((c) => (
                  <option key={c} value={c}>
                    {symbolToName[c] || c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-14 rounded-lg border border-border bg-background animate-pulse"
                />
              ))}
            </div>
          ) : grouped.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-foreground font-medium">
                {predictions.length === 0
                  ? "No predictions yet"
                  : "No predictions match these filters"}
              </p>
              {predictions.length === 0 && (
                <Link to="/app">
                  <Button className="mt-4">Make your first prediction</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map(({ roundId, rows }) => (
                <div key={roundId}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-foreground">
                      Round #{roundId}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(rows[0].created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="rounded-xl border border-border overflow-hidden">
                    {rows.map((p, i) => (
                      <div
                        key={p.id}
                        className={cn(
                          "flex items-center justify-between gap-3 px-4 py-3 bg-card hover:bg-secondary/50 transition-colors",
                          i !== rows.length - 1 && "border-b border-border/60"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-sm font-semibold text-foreground truncate">
                            {symbolToName[p.crypto] || p.crypto}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-secondary">
                            {p.crypto}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            Called{" "}
                            <span className="font-semibold text-foreground">
                              {p.answer ? p.answer.toUpperCase() : "—"}
                            </span>
                          </span>
                          <Badge
                            variant={statusBadgeVariant(p.status)}
                            className="capitalize min-w-[72px] justify-center"
                          >
                            {p.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
