import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MARKETS } from "@/lib/markets";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Landing/Reveal";
import { Card } from "@/components/ui/card";

const REFRESH_MS = 60000;

const PRICE_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${MARKETS.map(
  (m) => m.coingeckoId
).join(",")}&vs_currencies=usd&include_24hr_change=true`;

interface Quote {
  price: number;
  change: number;
}

function formatPrice(value: number) {
  if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(4);
}

export default function MarketsPreview() {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(PRICE_URL);
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        const next: Record<string, Quote> = {};
        for (const m of MARKETS) {
          const row = data[m.coingeckoId];
          if (row) next[m.symbol] = { price: row.usd, change: row.usd_24h_change ?? 0 };
        }
        setQuotes(next);
      } catch {
        return;
      }
    };
    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 sm:py-32">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="section-header">Live markets</p>
            <h2 className="hero-title text-5xl sm:text-6xl text-foreground">
              Eight markets, <span className="text-accent italic">always moving</span>
            </h2>
          </div>
          <Link
            to="/market"
            className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1 shrink-0"
          >
            Open the terminal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {MARKETS.map((m, i) => {
          const quote = quotes[m.symbol];
          const up = (quote?.change ?? 0) >= 0;
          return (
            <Reveal key={m.symbol} delay={i * 0.05}>
              <Link to="/market">
                <Card className="p-5 bg-card/70 backdrop-blur-sm hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <img src={m.img} alt={m.name} className="w-9 h-9" />
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{m.name}</p>
                  <p className="text-xs font-mono text-muted-foreground">{m.symbol}</p>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-base font-bold tabular-nums text-foreground">
                      {quote ? `$${formatPrice(quote.price)}` : "——"}
                    </span>
                    {quote && (
                      <span
                        className={cn(
                          "text-xs font-mono font-semibold tabular-nums",
                          up ? "text-accent" : "text-destructive"
                        )}
                      >
                        {up ? "▲" : "▼"} {Math.abs(quote.change).toFixed(2)}%
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
