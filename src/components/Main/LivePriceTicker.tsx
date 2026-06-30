import { useState, useEffect } from "react";
import { LogoLoop } from "@/components/AnimatedComponents/LogoLoop";
import { MARKETS } from "@/lib/markets";

const REFRESH_MS = 60000;

const PRICE_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${MARKETS.map(
  (m) => m.coingeckoId
).join(",")}&vs_currencies=usd&include_24hr_change=true`;

function formatPrice(value: number) {
  if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(4);
}

interface Quote {
  price: number;
  change: number;
}

function PriceChip({
  img,
  symbol,
  quote,
}: {
  img: string;
  symbol: string;
  quote?: Quote;
}) {
  const up = (quote?.change ?? 0) >= 0;
  return (
    <div className="flex items-center gap-2.5 pr-1">
      <img src={img} alt={symbol} className="w-7 h-7 flex-shrink-0" />
      <span className="text-sm font-semibold text-foreground">{symbol}</span>
      {quote ? (
        <>
          <span className="text-sm font-mono text-foreground tabular-nums">
            ${formatPrice(quote.price)}
          </span>
          <span
            className={`text-xs font-mono font-semibold tabular-nums ${
              up ? "text-accent" : "text-destructive"
            }`}
          >
            {up ? "▲" : "▼"} {Math.abs(quote.change).toFixed(2)}%
          </span>
        </>
      ) : (
        <span className="text-sm font-mono text-muted-foreground tabular-nums">
          ——
        </span>
      )}
    </div>
  );
}

export default function LivePriceTicker() {
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

  const logos = MARKETS.map((m) => ({
    node: <PriceChip img={m.img} symbol={m.symbol} quote={quotes[m.symbol]} />,
    title: m.symbol,
    ariaLabel: m.symbol,
  }));

  return (
    <div className="border-b border-border bg-card/50">
      <LogoLoop
        logos={logos}
        speed={36}
        direction="left"
        gap={48}
        pauseOnHover
        fadeOut
        fadeOutColor="hsl(40 10% 96%)"
        ariaLabel="Live crypto prices"
        className="py-3.5"
      />
    </div>
  );
}
