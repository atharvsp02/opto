import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Zap, LineChart, ArrowRight } from "lucide-react";
import { Context } from "@/context/context";
import Reveal from "@/components/Landing/Reveal";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: ShieldCheck,
    title: "Settled by real prices",
    body: "Every round resolves against live market data on the server. The outcome isn't ours to decide — the market's the referee.",
  },
  {
    icon: Zap,
    title: "Atomic coin engine",
    body: "Coins move in all-or-nothing database transactions. No double-spends, no race conditions, no funny business.",
  },
  {
    icon: LineChart,
    title: "Live trading terminal",
    body: "Real candlestick charts stream tick-by-tick from Binance, so you read the same price action the pros do.",
  },
];

const stats = [
  { value: "8", label: "Live markets" },
  { value: "15m", label: "Round cadence" },
  { value: "200", label: "Coins per win" },
  { value: "100%", label: "Server-settled" },
];

export default function FeaturesStats() {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="section-header text-center">Why OPTO</p>
          <h2 className="hero-title text-5xl sm:text-6xl text-center text-foreground mb-16">
            Built like the <span className="text-accent italic">real thing</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12 mb-20">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.1}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 border-t-2 border-foreground pt-5">
                    <Icon className="w-5 h-5 text-accent shrink-0" strokeWidth={1.75} />
                    <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                  </div>
                  <p className="body-text text-base mt-4">{f.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border bg-border mb-24">
            {stats.map((s) => (
              <div key={s.label} className="bg-card px-6 py-8 text-center">
                <p className="hero-title text-5xl sm:text-6xl text-foreground">
                  {s.value}
                </p>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-2">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="relative rounded-3xl border border-border bg-foreground text-background overflow-hidden px-8 py-16 sm:px-16 sm:py-20 text-center">
            <div className="pointer-events-none absolute -top-1/4 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
            <div className="relative">
              <h2 className="hero-title text-5xl sm:text-7xl mb-6">
                Read the market.
                <br />
                <span className="text-[#FFB000] italic">Make the call.</span>
              </h2>
              <p className="text-base sm:text-lg text-background/70 max-w-xl mx-auto mb-10">
                Start with virtual coins, sharpen your instinct, and prove you can
                call the market before it moves.
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate(user ? "/app" : "/login")}
              >
                {user ? "Open app" : "Start predicting"}
                <ArrowRight />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
