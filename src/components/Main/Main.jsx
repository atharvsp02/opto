import React, { useContext, useState, useEffect, useCallback, useMemo } from "react";
import Bitcoin from "../../assets/Bitcoin.svg";
import Ethereum from "../../assets/Ethereum.svg";
import Solana from "../../assets/solana.svg";
import Doge from "../../assets/doge.svg";
import Cardano from "../../assets/cardano.svg";
import Binance from "../../assets/binance.svg";
import Polygon from "../../assets/Polygon.svg";
import Ripple from "../../assets/ripple.svg";
import { Context } from "../../context/context";
import Portfolio from "./Portfolio";
import { getCurrentRound, getMyPredictions, placePrediction } from "../../api";
import TargetCursor from "../AnimatedComponents/TargetCursor";
import GlassSurfaceBackground from "../AnimatedComponents/GlassSurface";
import { motion } from "framer-motion";

const POLL_INTERVAL_MS = 15000;

const idToName = {
  btc: "Bitcoin",
  eth: "Ethereum",
  sol: "Solana",
  doge: "Dogecoin",
  card: "Cardano",
  bnb: "Binance Coin",
  pol: "Polygon",
  xrp: "Ripple",
};

const symbolToKey = {
  BTC: "btc",
  ETH: "eth",
  SOL: "sol",
  DOGE: "doge",
  ADA: "card",
  BNB: "bnb",
  POL: "pol",
  XRP: "xrp",
};

const keyToImg = {
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
    traders: 5,
    text: `${idToName[key]} to reach ${Number(q.target_price).toFixed(2)} USDT or more?`,
  };
}

function Main() {
  const { showData, user, refreshUserData } = useContext(Context);
  const [questions, setQuestions] = useState([]);
  const [now, setNow] = useState(new Date());
  const [expiry, setExpiry] = useState(null);
  const [roundId, setRoundId] = useState(null);
  const [myPredictions, setMyPredictions] = useState([]);

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
    if (!user) return alert("Login required or round not ready!");
    if (now >= expiry) return alert("This round has expired!");
    try {
      await placePrediction(question.id, answer);
      await Promise.all([loadPredictions(), refreshUserData()]);
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredQuestions =
    showData === "all" ? questions : questions.filter((q) => q.key === showData);

  const formatCountdown = (expiryTime) => {
    if (!expiryTime) return "00:00:00";
    const diff = expiryTime - now;
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (

    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative min-h-screen pt-[75px] px-4 sm:px-6 lg:px-[50px] text-white overflow-hidden bg-transparent"
    >

      <GlassSurfaceBackground />


      <div className="hidden md:block">
        <TargetCursor targetSelector=".prediction-button" />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-4 relative z-10">
        {/* LEFT SIDE */}
        <div className="flex-1 lg:min-w-[55vw] flex flex-col space-y-6 sm:space-y-8 lg:space-y-11">
          <p className="font-bold text-2xl sm:text-3xl mb-2 sticky top-0 py-4 z-10">
            {showData === "all"
              ? "ALL"
              : idToName[showData]?.toUpperCase() || ""}
          </p>

          {filteredQuestions.length === 0 && (
            <div className="text-center text-gray-400 text-lg sm:text-xl mt-20">
              <p>⏳ Loading questions...</p>
              <p className="text-xs sm:text-sm mt-2">
                Fetching crypto prices and generating predictions
              </p>
            </div>
          )}

          {filteredQuestions.map((q) => (
            <div
              key={q.key}
              className="p-4 sm:p-5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all"
            >

              <a href="#" className="text-xs sm:text-[15px] rounded-full py-1">
                {q.traders} Traders
              </a>
              <div className="flex flex-row justify-between items-start">
                <p className="py-1 mb-6 sm:mb-11 text-base sm:text-lg pr-2">{q.text}</p>
                <img
                  src={q.img}
                  alt={q.key}
                  className="w-[40px] sm:w-[50px] lg:w-[60px] flex-shrink-0"
                />
              </div>
              <p className="text-sm sm:text-base text-yellow-300 font-mono">
                Time Left: {formatCountdown(expiry)}
              </p>

              {currentRoundResponses[q.key]?.status === "correct" && (
                <p className="text-green-400 font-bold text-sm sm:text-base">✅ Correct</p>
              )}
              {currentRoundResponses[q.key]?.status === "wrong" && (
                <p className="text-red-400 font-bold text-sm sm:text-base">❌ Wrong</p>
              )}
              {currentRoundResponses[q.key]?.status === "pending" && (
                <p className="text-gray-400 text-sm sm:text-base">⏳ Waiting for expiry…</p>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 pt-4">
                <button
                  onClick={() => handleResponse(q, "yes")}
                  disabled={currentRoundResponses[q.key] || now >= expiry}
                  className={`prediction-button px-4 sm:px-5 py-2 sm:py-2 w-full sm:w-[400px] rounded-md shadow-xl text-lg sm:text-xl transition-all
                    ${currentRoundResponses[q.key]?.answer === "yes"
                      ? "bg-gray-500 cursor-default"
                      : now >= expiry || currentRoundResponses[q.key]
                        ? "bg-gray-500 cursor-default"
                        : "bg-[#0064FB]/70 hover:bg-[#0064FB] hover:scale-105 cursor-pointer"
                    }
                    `}
                >
                  Yes
                </button>

                <button
                  onClick={() => handleResponse(q, "no")}
                  disabled={currentRoundResponses[q.key] || now >= expiry}
                  className={`prediction-button px-4 sm:px-5 py-2 sm:py-2 w-full sm:w-[400px] rounded-md shadow-xl text-lg sm:text-xl transition-all
                    ${currentRoundResponses[q.key]?.answer === "no"
                      ? "bg-gray-500 cursor-default"
                      : now >= expiry || currentRoundResponses[q.key]
                        ? "bg-gray-500 cursor-default"
                        : "bg-[#FF414B]/70 hover:bg-[#FF414B] hover:scale-105 cursor-pointer"
                    }
                    `}
                >
                  No
                </button>
              </div>

            </div>
          ))}
        </div>

        <div className="flex-1 lg:w-1 border border-white/20 bg-black/10 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.08)] h-[60vh] sm:h-[70vh] lg:h-[100vh] mt-6 lg:mt-0 relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-white/10 border-white" />
          <div className="absolute inset-0 rounded-2xl " />

          <div className="relative z-10 h-full">
            <Portfolio predictions={myPredictions} />
          </div>
        </div>


      </div>
    </motion.div>
  );
}

export default Main;
