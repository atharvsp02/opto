import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  computeStats,
  symbolToName,
  type Prediction,
} from "@/lib/portfolioStats";

interface PortfolioProps {
  predictions?: Prediction[];
}

const RECENT_LIMIT = 6;

function statusBadgeVariant(status: string) {
  if (status === "correct") return "default";
  if (status === "wrong") return "destructive";
  return "secondary";
}

function Portfolio({ predictions = [] }: PortfolioProps) {
  const stats = computeStats(predictions);
  const recent = predictions.slice(0, RECENT_LIMIT);
  const pnlPositive = stats.netPnl >= 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Recent Activity
          </h2>
          <Link
            to="/portfolio"
            className="text-xs font-medium text-accent hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex items-center gap-5 mt-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Win rate
            </p>
            <p className="text-lg font-bold tabular-nums text-foreground">
              {stats.winRate}%
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Net P&L
            </p>
            <p
              className={cn(
                "text-lg font-bold tabular-nums",
                pnlPositive ? "text-accent" : "text-destructive"
              )}
            >
              {pnlPositive ? "+" : ""}
              {stats.netPnl.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Streak
            </p>
            <p className="text-lg font-bold tabular-nums text-foreground">
              {stats.currentStreak}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-3">
        {recent.length === 0 ? (
          <div className="h-full grid place-items-center text-center px-4">
            <div>
              <p className="text-sm font-medium text-foreground">No calls yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Place a prediction to start your track record.
              </p>
            </div>
          </div>
        ) : (
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="space-y-1.5"
          >
            {recent.map((p) => (
              <motion.li
                key={p.id}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-secondary/60 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">
                    {symbolToName[p.crypto] || p.crypto}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {p.answer ? p.answer.toUpperCase() : "—"}
                  </span>
                </div>
                <Badge
                  variant={statusBadgeVariant(p.status)}
                  className="capitalize text-[10px] px-2 py-0 min-w-[64px] justify-center"
                >
                  {p.status}
                </Badge>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
