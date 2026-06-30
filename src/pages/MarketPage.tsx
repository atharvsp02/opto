import { useContext, useState, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Context } from "@/context/context";
import { cn } from "@/lib/utils";
import {
  MARKETS,
  INTERVALS,
  DEFAULT_SYMBOL,
  getMarket,
  type Interval,
} from "@/lib/markets";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Logo from "@/components/Logo";
import MarketStats from "@/components/Market/MarketStats";
import PredictCTA from "@/components/Market/PredictCTA";

const CandleChart = lazy(() => import("@/components/Market/CandleChart"));

export default function MarketPage() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [interval, setInterval] = useState<Interval>("15m");

  const market = getMarket(symbol);

  return (
    <div className="min-h-screen bg-background dot-grid">
      <header className="fixed top-0 left-0 right-0 nav-blur border-b border-border h-[72px] flex items-center z-50 px-4 sm:px-6 lg:px-10">
        <nav className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link to="/" className="hover:opacity-70 transition-opacity">
              <Logo className="text-2xl sm:text-3xl" />
            </Link>
            <Link
              to="/"
              className="hidden sm:inline text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
          </div>
          <Button size="sm" onClick={() => navigate(user ? "/app" : "/login")}>
            {user ? "Open app" : "Sign in"}
          </Button>
        </nav>
      </header>

      <main className="px-4 sm:px-6 lg:px-[50px] pt-[96px] pb-16 max-w-6xl mx-auto">
        <div className="overflow-x-auto scrollbar-hide mb-6">
          <ul
            aria-label="Select market"
            className="flex items-center gap-1.5 min-w-max p-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm w-max"
          >
            {MARKETS.map((m) => {
              const active = symbol === m.symbol;
              return (
                <li key={m.symbol} className="relative">
                  <button
                    onClick={() => setSymbol(m.symbol)}
                    aria-pressed={active}
                    aria-label={m.name}
                    className={cn(
                      "relative z-10 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap",
                      active
                        ? "text-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="market-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 -z-10 rounded-full bg-foreground shadow-sm"
                      />
                    )}
                    <img
                      src={m.img}
                      alt=""
                      className={cn(
                        "w-4 h-4 sm:w-[18px] sm:h-[18px]",
                        active ? "opacity-100" : "opacity-80"
                      )}
                    />
                    {m.symbol}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            {market && (
              <div className="grid place-items-center w-12 h-12 rounded-xl bg-secondary border border-border">
                <img src={market.img} alt={market.name} className="w-8 h-8" />
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                {market?.name ?? symbol}
              </h1>
              <p className="text-xs font-mono text-muted-foreground">
                {symbol}/USDT · Binance
              </p>
            </div>
          </div>

          <ul
            aria-label="Select chart interval"
            className="flex items-center gap-1 p-1 rounded-full border border-border bg-card/60 backdrop-blur-sm w-max"
          >
            {INTERVALS.map((iv) => {
              const active = interval === iv;
              return (
                <li key={iv} className="relative">
                  <button
                    onClick={() => setInterval(iv)}
                    aria-pressed={active}
                    aria-label={`${iv} interval`}
                    className={cn(
                      "relative z-10 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors duration-200",
                      active
                        ? "text-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="interval-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 -z-10 rounded-full bg-foreground"
                      />
                    )}
                    {iv}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.12)] p-2 sm:p-4 mb-8">
          <Suspense fallback={<Skeleton className="h-[420px] md:h-[520px] w-full" />}>
            <CandleChart symbol={symbol} interval={interval} />
          </Suspense>
        </div>

        <div className="mb-8">
          <MarketStats symbol={symbol} />
        </div>

        <PredictCTA symbol={symbol} />
      </main>
    </div>
  );
}
