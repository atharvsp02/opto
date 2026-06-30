import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { Interval } from "@/lib/markets";
import { useCandleChart } from "@/hooks/useCandleChart";

interface CandleChartProps {
  symbol: string;
  interval: Interval;
}

export default function CandleChart({ symbol, interval }: CandleChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { status } = useCandleChart(ref, symbol, interval);
  const hasRendered = useRef(false);
  if (status === "live") hasRendered.current = true;

  const showFirstLoad = status === "loading" && !hasRendered.current;

  return (
    <div className="relative w-full">
      <div ref={ref} className="w-full h-[420px] md:h-[520px]" />

      {showFirstLoad && (
        <div className="absolute inset-0 grid place-items-center bg-card/40 backdrop-blur-sm">
          <Skeleton className="h-[380px] md:h-[480px] w-[94%]" />
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-foreground font-medium">Couldn't load chart</p>
            <p className="text-sm text-muted-foreground mt-1">
              The market feed is unavailable right now.
            </p>
          </div>
        </div>
      )}

      <div
        role="status"
        aria-live="polite"
        className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-border bg-card/80 backdrop-blur-sm px-2.5 py-1 text-xs font-medium"
      >
        <span className="relative flex h-2 w-2">
          {status === "live" && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
          )}
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              status === "live" ? "bg-accent" : "bg-muted-foreground"
            )}
          />
        </span>
        <span className="text-muted-foreground">
          {status === "live" ? "Live" : "Loading…"}
        </span>
      </div>
    </div>
  );
}
