import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Context } from "@/context/context";
import { getCurrentRound } from "@/api";
import { getMarket } from "@/lib/markets";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PredictCTAProps {
  symbol: string;
}

interface RoundQuestion {
  id: string | number;
  crypto: string;
  target_price: string | number;
}

export default function PredictCTA({ symbol }: PredictCTAProps) {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [target, setTarget] = useState<number | null>(null);

  const market = getMarket(symbol);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const round = await getCurrentRound();
        if (!active) return;
        const q = (round.questions as RoundQuestion[]).find(
          (item) => item.crypto === symbol
        );
        setTarget(q ? Number(q.target_price) : null);
      } catch {
        if (active) setTarget(null);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [symbol]);

  return (
    <Card className="p-6 sm:p-8 bg-card/80 backdrop-blur-sm overflow-hidden relative">
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <p className="section-header mb-2">Put it to the test</p>
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
            Think you can read {market?.name ?? symbol}?
          </h3>
          <p className="body-text text-sm sm:text-base mt-2 max-w-md">
            {target !== null ? (
              <>
                There's an open round asking if {symbol} hits{" "}
                <span className="font-bold text-accent">
                  ${target.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                . Call it and win coins.
              </>
            ) : (
              <>Call Yes or No on live price targets and win coins when you're right.</>
            )}
          </p>
        </div>
        <Button
          size="lg"
          className="shrink-0"
          onClick={() => navigate(user ? "/app" : "/login")}
        >
          {user ? "Predict now" : "Sign in to predict"}
          <ArrowRight />
        </Button>
      </div>
    </Card>
  );
}
