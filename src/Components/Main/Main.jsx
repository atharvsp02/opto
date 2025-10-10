import React, { useContext, useState, useEffect, useRef } from "react";
import Bitcoin from "../../assets/Bitcoin.svg";
import Ethereum from "../../assets/Ethereum.svg";
import Solana from "../../assets/solana.svg";
import Doge from "../../assets/doge.svg";
import Cardano from "../../assets/cardano.svg";
import Binance from "../../assets/binance.svg";
import Polygon from "../../assets/Polygon.svg";
import Ripple from "../../assets/ripple.svg";
import { db } from "../../firebase";
import { Context } from "../../context/context";
import Portfolio from "./Portfolio";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  increment,
} from "firebase/firestore";
import TargetCursor from "../AnimatedComponents/TargetCursor";
import GlassSurfaceBackground from "../AnimatedComponents/GlassSurface";

function Main() {
  const { showData, user } = useContext(Context);
  const [questions, setQuestion] = useState([]);
  const [responses, setResponses] = useState({});
  const [now, setNow] = useState(new Date());
  const [currentRoundResponses, setCurrentRoundResponses] = useState({});
  const [expiry, setExpiry] = useState(null);
  const hasCheckedRef = useRef(false);
  const currentRoundIdRef = useRef(null);

  // 🕒 update time every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔁 listen for central timer (Firestore)
  useEffect(() => {
    const roundDocRef = doc(db, "rounds", "current");

    getDoc(roundDocRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.expiryTime) {
          const newExpiry = new Date(Date.now() + 5 * 60 * 1000);
          setDoc(roundDocRef, {
            expiryTime: newExpiry,
            isCreatingRound: false,
          });
        }
      } else {
        const newExpiry = new Date(Date.now() + 5 * 60 * 1000);
        setDoc(roundDocRef, {
          expiryTime: newExpiry,
          isCreatingRound: false,
        });
      }
    });

    const unsubscribe = onSnapshot(roundDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.expiryTime) return;
        const expiryTimestamp = data.expiryTime;
        const newExpiry = expiryTimestamp.toDate();
        const newRoundId = `round_${newExpiry.getTime()}`;

        if (currentRoundIdRef.current !== newRoundId) {
          hasCheckedRef.current = false;
          currentRoundIdRef.current = newRoundId;
        }

        setExpiry(newExpiry);
        fetchPrices(newExpiry);
      }
    });

    return () => unsubscribe();
  }, []);

  // 👤 listen for user's responses
  useEffect(() => {
    if (!user || !expiry) return;
    const ref = doc(db, "responses", user.uid);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const allResponses = snap.data();
        setResponses(allResponses);
        const currentRoundId = `round_${expiry.getTime()}`;
        const currentData = allResponses[currentRoundId] || {};
        setCurrentRoundResponses(currentData);
      } else {
        setResponses({});
        setCurrentRoundResponses({});
      }
    });
    return () => unsubscribe();
  }, [user, expiry]);

  // 🌐 fetch prices
  const fetchPrices = async (newExpiry) => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,dogecoin,cardano,binancecoin,polygon,ripple&vs_currencies=usd"
      );
      if (!res.ok) {
        useFallbackPrices(newExpiry);
        return;
      }
      const data = await res.json();
      if (!data || Object.keys(data).length === 0) {
        useFallbackPrices(newExpiry);
        return;
      }
      QuestionFromPrice(data, newExpiry);
    } catch {
      useFallbackPrices(newExpiry);
    }
  };

  const useFallbackPrices = (expiryTime) => {
    const fallbackData = {
      bitcoin: { usd: 95000 },
      ethereum: { usd: 3500 },
      solana: { usd: 180 },
      dogecoin: { usd: 0.35 },
      cardano: { usd: 0.85 },
      binancecoin: { usd: 600 },
      polygon: { usd: 0.75 },
      ripple: { usd: 2.5 },
    };
    QuestionFromPrice(fallbackData, expiryTime);
  };

  const QuestionFromPrice = (prices, expiryTime) => {
    const qList = [
      {
        id: "btc",
        text: `Bitcoin to reach ${(prices.bitcoin.usd + 1000).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Bitcoin,
        expiration: expiryTime,
        correctAnswer: "no",
      },
      {
        id: "eth",
        text: `Ethereum to reach ${(prices.ethereum.usd + 100).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Ethereum,
        expiration: expiryTime,
        correctAnswer: "no",
      },
      {
        id: "sol",
        text: `Solana to reach ${(prices.solana.usd + 10).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Solana,
        expiration: expiryTime,
        correctAnswer: "no",
      },
      {
        id: "doge",
        text: `Dogecoin to reach ${(prices.dogecoin.usd + 0.01).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Doge,
        expiration: expiryTime,
        correctAnswer: "no",
      },
      {
        id: "card",
        text: `Cardano to reach ${(prices.cardano.usd + 0.1).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Cardano,
        expiration: expiryTime,
        correctAnswer: "no",
      },
      {
        id: "bnb",
        text: `Binance Coin to reach ${(prices.binancecoin.usd + 10).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Binance,
        expiration: expiryTime,
        correctAnswer: "no",
      },
      {
        id: "pol",
        text: `Polygon to reach ${(prices.polygon.usd + 0.1).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Polygon,
        expiration: expiryTime,
        correctAnswer: "no",
      },
      {
        id: "xrp",
        text: `Ripple to reach ${(prices.ripple.usd + 0.1).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Ripple,
        expiration: expiryTime,
        correctAnswer: "no",
      },
    ];
    setQuestion(qList);
  };

  const handleResponse = async (qid, answer) => {
    if (!user || !expiry) return alert("Login required or round not ready!");
    if (now >= expiry) return alert("This round has expired!");
    const userDocRef = doc(db, "users", user.uid);
    const responsesDocRef = doc(db, "responses", user.uid);
    const roundId = `round_${expiry.getTime()}`;
    try {
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) return alert("User not found");
      if (userDocSnap.data().coins < 100) return alert("Not enough coins!");
      await updateDoc(userDocRef, { coins: increment(-100) });
      const dataToSave = {
        [roundId]: { [qid]: { answer, status: "pending" } },
      };
      await setDoc(responsesDocRef, dataToSave, { merge: true });
    } catch (err) {
      console.error("FIREBASE ERROR:", err);
    }
  };

  const autoCheck = async () => {
    if (!user || !expiry || questions.length === 0 || hasCheckedRef.current)
      return;
    hasCheckedRef.current = true;
    const userDocRef = doc(db, "users", user.uid);
    const expiredRoundId = `round_${expiry.getTime()}`;
    const roundData = responses[expiredRoundId];
    if (!roundData) return;

    const updates = {};
    let correctAnswersCount = 0;

    questions.forEach((q) => {
      if (roundData[q.id]?.status === "pending") {
        const newStatus =
          roundData[q.id].answer === q.correctAnswer ? "correct" : "wrong";
        updates[`${expiredRoundId}.${q.id}.status`] = newStatus;
        if (newStatus === "correct") correctAnswersCount++;
      }
    });

    if (Object.keys(updates).length > 0) {
      await updateDoc(doc(db, "responses", user.uid), updates);
    }

    if (correctAnswersCount > 0) {
      await updateDoc(userDocRef, { coins: increment(correctAnswersCount * 200) });
    }
  };

  useEffect(() => {
    if (!expiry) return;
    if (now >= expiry && !hasCheckedRef.current) {
      autoCheck();
      const createNewRound = async () => {
        const roundDocRef = doc(db, "rounds", "current");
        try {
          const currentRoundDoc = await getDoc(roundDocRef);
          const data = currentRoundDoc.data();
          if (data?.isCreatingRound || data?.expiryTime.toDate() > expiry) return;
          await updateDoc(roundDocRef, { isCreatingRound: true });
          const newExpiryDate = new Date(Date.now() + 5 * 60 * 1000);
          await updateDoc(roundDocRef, {
            expiryTime: newExpiryDate,
            isCreatingRound: false,
          });
        } catch {
          await updateDoc(roundDocRef, { isCreatingRound: false });
        }
      };
      setTimeout(createNewRound, 1000);
    }
  }, [now, expiry]);

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

  const filteredQuestions =
    showData === "all" ? questions : questions.filter((q) => q.id === showData);

  const formatCountdown = (expiry) => {
    if (!expiry) return "00:00:00";
    const diff = expiry - now;
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative min-h-screen pt-[75px] px-[50px] text-white overflow-hidden bg-transparent">

      {/* 🧊 Frosted glass background behind everything */}
      <GlassSurfaceBackground />

      <TargetCursor targetSelector=".prediction-button" />

      <div className="flex flex-row gap-4 relative z-10">
        {/* LEFT SIDE */}
        <div className="flex-1 min-w-[55vw] flex flex-col space-y-11">
          <p className="font-bold text-3xl mb-2 sticky top-0 py-4 z-10">
            {showData === "all"
              ? "ALL"
              : idToName[showData]?.toUpperCase() || ""}
          </p>

          {filteredQuestions.length === 0 && (
            <div className="text-center text-gray-400 text-xl mt-20">
              <p>⏳ Loading questions...</p>
              <p className="text-sm mt-2">
                Fetching crypto prices and generating predictions
              </p>
            </div>
          )}

          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="p-5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all "
            >

              <a href="#" className="text-[15px] rounded-full py-1">
                {q.traders} Traders
              </a>
              <div className="flex flex-row justify-between">
                <p className="py-1 mb-11 text-lg">{q.text}</p>
                <img
                  src={q.img}
                  alt={q.id}
                  className="w-[60px] relative right-4"
                />
              </div>
              <p className="text-base text-yellow-300 font-mono">
                Time Left: {formatCountdown(q.expiration)}
              </p>

              {currentRoundResponses[q.id]?.status === "correct" && (
                <p className="text-green-400 font-bold">✅ Correct</p>
              )}
              {currentRoundResponses[q.id]?.status === "wrong" && (
                <p className="text-red-400 font-bold">❌ Wrong</p>
              )}
              {currentRoundResponses[q.id]?.status === "pending" && (
                <p className="text-gray-400">⏳ Waiting for expiry…</p>
              )}

              <div className="flex flex-row justify-center pt-4">
                {/* YES Button */}
                <button
                  onClick={() => handleResponse(q.id, "yes")}
                  disabled={currentRoundResponses[q.id] || now >= expiry}
                  className={`mx-5 px-5 py-2 w-[400px] rounded-md shadow-xl text-xl transition-all cursor-pointer 
                    ${currentRoundResponses[q.id]?.answer === "yes"
                      ? "bg-gray-500"
                      : now >= expiry || currentRoundResponses[q.id]
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-[#0064FB]/70 hover:bg-[#0064FB] hover:scale-105"
                    }
                    `}
                >
                  Yes
                </button>

                {/* NO Button */}
                <button
                  onClick={() => handleResponse(q.id, "no")}
                  disabled={currentRoundResponses[q.id] || now >= expiry}
                  className={`mx-5 px-5 py-2 w-[400px] rounded-md shadow-xl text-xl transition-all cursor-pointer 
                    ${currentRoundResponses[q.id]?.answer === "no"
                      ? "bg-gray-500"
                      : now >= expiry || currentRoundResponses[q.id]
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-[#FF414B]/70 hover:bg-[#FF414B] hover:scale-105"
                    }
                    `}
                >
                  No
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 w-1 border border-white/20 bg-black/10 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.08)] h-[100vh]  relative overflow-hidden">
          {/* Subtle glow layers */}
          <div className="absolute inset-0 rounded-2xl bg-white/10 border-white" />
          <div className="absolute inset-0 rounded-2xl " />

          {/* Portfolio component */}
          <div className="relative z-10 h-full">
            <Portfolio responses={responses} idToName={idToName} />
          </div>
        </div>


      </div>
    </div>
  );
}

export default Main;
