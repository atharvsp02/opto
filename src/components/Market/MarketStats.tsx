import { useEffect, useState } from "react";
import { fetch24h, type Ticker24h } from "@/lib/binance";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const REFRESH_MS = 15000;

function formatPrice(value: number) {
  if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(4);
}

function formatVolume(value: number) {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(0);
}

interface MarketStatsProps {
  symbol: string;
}

export default function MarketStats({ symbol }: MarketStatsProps) {
  const [data, setData] = useState<Ticker24h | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const load = async () => {
      try {
        const next = await fetch24h(symbol, controller.signal);
        if (active) setData(next);
      } catch {
        return;
      }
    };
    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      controller.abort();
      clearInterval(interval);
    };
  }, [symbol]);

  const up = (data?.priceChangePercent ?? 0) >= 0;

  const cards = [
    {
      label: "Last Price",
      value: data ? `$${formatPrice(data.lastPrice)}` : "——",
      tone: "text-foreground",
    },
    {
      label: "24h Change",
      value: data
        ? `${up ? "+" : ""}${data.priceChangePercent.toFixed(2)}%`
        : "——",
      tone: up ? "text-accent" : "text-destructive",
    },
    {
      label: "24h High / Low",
      value: data
        ? `$${formatPrice(data.highPrice)} / $${formatPrice(data.lowPrice)}`
        : "——",
      tone: "text-foreground",
    },
    {
      label: "24h Volume",
      value: data ? `$${formatVolume(data.quoteVolume)}` : "——",
      tone: "text-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card
          key={c.label}
          className="p-4 sm:p-5 bg-card/80 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {c.label}
          </p>
          <p className={cn("text-lg sm:text-xl font-bold tabular-nums mt-2", c.tone)}>
            {c.value}
          </p>
        </Card>
      ))}
    </div>
  );
}
