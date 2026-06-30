import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Context } from "@/context/context";
import { getCurrentRound, getMyPredictions, placePrediction } from "@/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import Portfolio from "./Portfolio";
import Bitcoin from "@/assets/Bitcoin.svg";
import Ethereum from "@/assets/Ethereum.svg";
import Solana from "@/assets/solana.svg";
import Doge from "@/assets/doge.svg";
import Cardano from "@/assets/cardano.svg";
import Binance from "@/assets/binance.svg";
import Polygon from "@/assets/Polygon.svg";
import Ripple from "@/assets/ripple.svg";

const POLL_INTERVAL_MS = 15000;
const REWARD_PER_CORRECT = 200;

const idToName: Record<string, string> = {
  btc: "Bitcoin",
  eth: "Ethereum",
  sol: "Solana",
  doge: "Dogecoin",
  card: "Cardano",
  bnb: "Binance Coin",
  pol: "Polygon",
  xrp: "Ripple",
};

const idToSymbol: Record<string, string> = {
  btc: "BTC",
  eth: "ETH",
  sol: "SOL",
  doge: "DOGE",
  card: "ADA",
  bnb: "BNB",
  pol: "POL",
  xrp: "XRP",
};

const symbolToKey: Record<string, string> = {
  BTC: "btc",
  ETH: "eth",
  SOL: "sol",
  DOGE: "doge",
  ADA: "card",
  BNB: "bnb",
  POL: "pol",
  XRP: "xrp",
};

const keyToImg: Record<string, string> = {
  btc: Bitcoin,
  eth: Ethereum,
  sol: Solana,
  doge: Doge,
  card: Cardano,
  bnb: Binance,
  pol: Polygon,
  xrp: Ripple,
};

function normalizeQuestion(q) {
  const key = symbolToKey[q.crypto];
  return {
    id: Number(q.id),
    key,
    img: keyToImg[key],
    name: idToName[key],
    symbol: idToSymbol[key],
    target: Number(q.target_price),
    traders: 5,
  };
}

function Main() {
  const { showData, user, refreshUserData } = useContext(Context);
  const [questions, setQuestions] = useState([]);
  const [now, setNow] = useState(new Date());
  const [expiry, setExpiry] = useState(null);
  const [roundId, setRoundId] = useState(null);
  const [myPredictions, setMyPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const loadRound = useCallback(async () => {
    try {
      const round = await getCurrentRound();
      setRoundId(round.roundId);
      setExpiry(new Date(round.expiryTime));
      setQuestions(round.questions.map(normalizeQuestion));
    } catch {
      setRoundId(null);
      setExpiry(null);
      setQuestions([]);
    }
  }, []);

  const loadPredictions = useCallback(async () => {
    if (!user) {
      setMyPredictions([]);
      return;
    }
    try {
      setMyPredictions(await getMyPredictions());
    } catch {
      setMyPredictions([]);
    }
  }, [user]);

  useEffect(() => {
    const poll = async () => {
      await loadRound();
      await loadPredictions();
      setLoading(false);
    };
    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadRound, loadPredictions]);

  const currentRoundResponses = useMemo(() => {
    const map = {};
    for (const p of myPredictions) {
      if (p.round_id === roundId) {
        map[symbolToKey[p.crypto]] = { answer: p.answer, status: p.status };
      }
    }
    return map;
  }, [myPredictions, roundId]);

  const handleResponse = async (question, answer) => {
    if (!user) return toast.error("Login required to place a prediction.");
    if (now >= expiry) return toast.error("This round has expired.");
    try {
      await placePrediction(question.id, answer);
      await Promise.all([loadPredictions(), refreshUserData()]);
      toast.success(`Prediction placed: ${answer.toUpperCase()}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredQuestions =
    showData === "all" ? questions : questions.filter((q) => q.key === showData);

  const diffMs = expiry ? expiry.getTime() - now.getTime() : 0;
  const expired = !expiry || diffMs <= 0;

  const formatCountdown = () => {
    if (expired) return "00:00";
    const minutes = Math.floor(diffMs / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(currentRoundResponses).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen px-4 sm:px-6 lg:px-[50px] pb-16"
    >
      <div className="relative pt-8 pb-6">
        <div className="pointer-events-none absolute -top-4 left-1/4 h-48 w-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative rounded-2xl border border-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.12)] overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-stretch">
            <div className="flex-1 p-6 sm:p-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full rounded-full opacity-75",
                      !expired && "animate-ping",
                      expired ? "bg-muted-foreground" : "bg-accent"
                    )}
                  />
                  <span
                    className={cn(
                      "relative inline-flex h-2.5 w-2.5 rounded-full",
                      expired ? "bg-muted-foreground" : "bg-accent"
                    )}
                  />
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {expired ? "Settling round" : "Live round"}
                  {roundId ? ` · #${roundId}` : ""}
                </span>
              </div>
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl text-foreground">
                Predict the <span className="text-accent italic">market</span>
              </h1>
              <p className="body-text text-sm sm:text-base mt-2 max-w-md">
                Will it hit the target before the clock runs out? Call it. Win{" "}
                {REWARD_PER_CORRECT} coins per correct read.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:flex sm:flex-col border-t sm:border-t-0 sm:border-l border-border divide-x sm:divide-x-0 sm:divide-y divide-border">
              <div className="px-5 py-4 sm:py-5 text-center sm:text-left sm:min-w-[180px]">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Time left
                </p>
                <p
                  className={cn(
                    "font-mono text-2xl sm:text-3xl font-bold tabular-nums mt-1",
                    expired ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {formatCountdown()}
                </p>
              </div>
              <div className="px-5 py-4 sm:py-5 text-center sm:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Markets
                </p>
                <p className="text-2xl sm:text-3xl font-bold tabular-nums mt-1 text-foreground">
                  {questions.length}
                </p>
              </div>
              <div className="px-5 py-4 sm:py-5 text-center sm:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {user ? "Your calls" : "Reward pool"}
                </p>
                <p className="text-2xl sm:text-3xl font-bold tabular-nums mt-1 text-foreground">
                  {user
                    ? `${answeredCount}/${questions.length}`
                    : (questions.length * REWARD_PER_CORRECT).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 relative z-10">
        <div className="flex-1 lg:min-w-[55vw] flex flex-col gap-5">
          <div className="flex items-center justify-between sticky top-[72px] bg-background/80 backdrop-blur py-4 z-10">
            <h2 className="section-header mb-0">
              {showData === "all" ? "All Markets" : idToName[showData] || ""}
            </h2>
            <span className="text-xs font-medium text-muted-foreground">
              {filteredQuestions.length} open
            </span>
          </div>

          {loading && (
            <div className="grid gap-5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-44 rounded-2xl border border-border bg-card animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && filteredQuestions.length === 0 && (
            <Card className="text-center text-muted-foreground py-16 px-6">
              <p className="text-lg font-medium text-foreground">No open markets</p>
              <p className="text-sm mt-2">
                The next round is being prepared — hang tight.
              </p>
            </Card>
          )}

          {!loading &&
            filteredQuestions.map((q, i) => {
              const response = currentRoundResponses[q.key];
              const locked = Boolean(response) || expired;
              return (
                <motion.div
                  key={q.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <Card className="p-5 sm:p-6 bg-card/80 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-0.5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 grid place-items-center w-14 h-14 rounded-xl bg-secondary border border-border">
                        <img src={q.img} alt={q.name} className="w-9 h-9" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold text-foreground">
                            {q.name}
                          </span>
                          <span className="text-xs font-mono font-medium text-muted-foreground px-1.5 py-0.5 rounded bg-secondary">
                            {q.symbol}
                          </span>
                          {response?.status === "correct" && (
                            <span className="ml-auto text-xs font-semibold text-accent">
                              ✓ Correct
                            </span>
                          )}
                          {response?.status === "wrong" && (
                            <span className="ml-auto text-xs font-semibold text-destructive">
                              ✗ Wrong
                            </span>
                          )}
                          {response?.status === "pending" && (
                            <span className="ml-auto text-xs font-medium text-muted-foreground">
                              Awaiting result…
                            </span>
                          )}
                        </div>

                        <p className="text-lg sm:text-xl font-medium leading-snug mt-2">
                          Will {q.name} reach{" "}
                          <span className="font-bold text-accent">
                            ${q.target.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </span>{" "}
                          or more?
                        </p>

                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <span className="font-semibold text-foreground">
                              {q.traders}
                            </span>{" "}
                            traders
                          </span>
                          <span className="font-mono">
                            {expired ? "Round ended" : `Closes in ${formatCountdown()}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-5">
                      <Button
                        onClick={() => handleResponse(q, "yes")}
                        disabled={locked}
                        className={cn(
                          "flex-1 h-11 text-base font-semibold",
                          response?.answer === "yes" && "ring-2 ring-accent ring-offset-2 ring-offset-card"
                        )}
                      >
                        Yes
                      </Button>
                      <Button
                        onClick={() => handleResponse(q, "no")}
                        disabled={locked}
                        variant="destructive"
                        className={cn(
                          "flex-1 h-11 text-base font-semibold",
                          response?.answer === "no" && "ring-2 ring-destructive ring-offset-2 ring-offset-card"
                        )}
                      >
                        No
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
        </div>

        <div className="flex-1 lg:max-w-[40vw]">
          <Card className="lg:sticky lg:top-[88px] h-[70vh] lg:h-[calc(100vh-110px)] overflow-hidden">
            <Portfolio predictions={myPredictions} />
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default Main;
