import React, { useContext, useState, useEffect } from "react";
import Bitcoin from "../../assets/Bitcoin.svg";
import Ethereum from "../../assets/Ethereum.svg";
import Solana from "../../assets/solana.svg";
import Doge from "../../assets/doge.svg";
import Cardano from "../../assets/cardano.svg";
import Binance from "../../assets/binance.svg";
import Polygon from "../../assets/Polygon.svg";
import Ripple from "../../assets/ripple.svg";
import { db } from "../../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; // 🔹 added updateDoc
import { Context } from "../../context/context";

function Main() {
  const { showData, user } = useContext(Context);
  const [questions, setQuestion] = useState([]);
  const [responses, setResponses] = useState({});
  const [now, setNow] = useState(new Date());
  const [expiry, setExpiry] = useState(() => {
    const saved = localStorage.getItem("expiry");
    return saved ? new Date(saved) : getNewExpiry();
  });

  function getNewExpiry() {
    return new Date(Date.now() + 60 * 60 * 1000);
  }

  // Keep updating current time
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Build questions from API prices (with correctAnswer field)
  const QuestionFromPrice = (prices, expiryTime) => {
    const bitcoinPrice = prices.bitcoin?.usd ?? 0;
    const ethereumPrice = prices.ethereum?.usd ?? 0;
    const solanaPrice = prices.solana?.usd ?? 0;
    const dogecoinPrice = prices.dogecoin?.usd ?? 0;
    const cardanoPrice = prices.cardano?.usd ?? 0;
    const binancePrice = prices.binancecoin?.usd ?? 0;
    const polygonPrice = prices.polygon?.usd ?? 0;
    const ripplePrice = prices.ripple?.usd ?? 0;

    const qList = [
      {
        id: "btc",
        text: `Bitcoin is forecasted to reach ${(bitcoinPrice + 1000).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Bitcoin,
        expiration: expiryTime,
        correctAnswer: bitcoinPrice >= bitcoinPrice + 1000 ? "yes" : "no", // 🔹 set correct answer
      },
      {
        id: "eth",
        text: `Ethereum is forecasted to reach ${(ethereumPrice + 100).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Ethereum,
        expiration: expiryTime,
        correctAnswer: ethereumPrice >= ethereumPrice + 100 ? "yes" : "no",
      },
      {
        id: "sol",
        text: `Solana is forecasted to reach ${(solanaPrice + 10).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Solana,
        expiration: expiryTime,
        correctAnswer: solanaPrice >= solanaPrice + 10 ? "yes" : "no",
      },
      {
        id: "doge",
        text: `Dogecoin is forecasted to reach ${(dogecoinPrice + 0.01).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Doge,
        expiration: expiryTime,
        correctAnswer: dogecoinPrice >= dogecoinPrice + 0.01 ? "yes" : "no",
      },
      {
        id: "card",
        text: `Cardano is forecasted to reach ${(cardanoPrice + 0.1).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Cardano,
        expiration: expiryTime,
        correctAnswer: cardanoPrice >= cardanoPrice + 0.1 ? "yes" : "no",
      },
      {
        id: "bnb",
        text: `Binance Coin is forecasted to reach ${(binancePrice + 10).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Binance,
        expiration: expiryTime,
        correctAnswer: binancePrice >= binancePrice + 10 ? "yes" : "no",
      },
      {
        id: "pol",
        text: `Polygon is forecasted to reach ${(polygonPrice + 0.1).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Polygon,
        expiration: expiryTime,
        correctAnswer: polygonPrice >= polygonPrice + 0.1 ? "yes" : "no",
      },
      {
        id: "xrp",
        text: `Ripple is forecasted to reach ${(ripplePrice + 0.1).toFixed(2)} USDT or more?`,
        traders: 5,
        img: Ripple,
        expiration: expiryTime,
        correctAnswer: ripplePrice >= ripplePrice + 0.1 ? "yes" : "no",
      },
    ];

    setQuestion(qList);
  };

  // 🔹 Fetch prices
  const fetchPrices = async (newExpiry = expiry) => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,dogecoin,cardano,binancecoin,polygon,ripple&vs_currencies=usd"
      );
      const data = await res.json();
      QuestionFromPrice(data, newExpiry);
    } catch (e) {
      console.error("price fetch failed", e);
    }
  };

  // Load user responses
  useEffect(() => {
    if (!user) return;
    const loadResponses = async () => {
      try {
        const ref = doc(db, "responses", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setResponses(snap.data());
        }
      } catch (err) {
        console.error("Error loading responses", err);
      }
    };
    loadResponses();
  }, [user]);

  // Save response
  const handleResponse = async (qid, answer) => {
    if (!user) return alert("Login required!");
    const newResponses = { ...responses, [qid]: { answer, status: "pending" } }; // 🔹 store status
    setResponses(newResponses);
    try {
      await setDoc(doc(db, "responses", user.uid), newResponses);
    } catch (err) {
      console.error("Error saving response", err);
    }
  };

  // 🔹 Auto-check answers when expired
  const autoCheck = async () => {
    if (!user) return;

    const updatedResponses = { ...responses };

    questions.forEach((q) => {
      if (updatedResponses[q.id] && updatedResponses[q.id].status === "pending") {
        const userAns = updatedResponses[q.id].answer;
        updatedResponses[q.id].status =
          userAns === q.correctAnswer ? "correct" : "wrong"; // mark answer
      }
    });

    setResponses(updatedResponses);
    try {
      await updateDoc(doc(db, "responses", user.uid), updatedResponses);
    } catch (err) {
      console.error("Error updating results", err);
    }
  };

  // First fetch
  useEffect(() => {
    fetchPrices(expiry);
  }, []);

  // 🔹 When time expires → auto-check responses + reset expiry
  useEffect(() => {
    if (now >= expiry) {
      autoCheck(); // 🔥 check answers automatically

      const newExp = getNewExpiry();
      setExpiry(newExp);
      localStorage.setItem("expiry", newExp.toISOString());
      fetchPrices(newExp);
    }
  }, [now]);

  const filteredQuestions =
    showData === "all"
      ? questions
      : questions.filter((q) => q.id === showData);

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

  const formatCountdown = (expiry) => {
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
    <div className="bg-black text-white h-[100vh] flex flex-row gap-4 px-[50px]">
      {/* Left side: Questions */}
      <div className="flex-1 pl-[50px] pt-[40px] min-w-[55vw] flex flex-col space-y-11">
        <p className="font-bold text-3xl mb-11">
          {showData === "all" ? "ALL" : idToName[showData].toUpperCase()}
        </p>

        {filteredQuestions.length === 0 ? (
          <p>Loading questions…</p>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="border border-white pl-4 pt-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow-md space-y-2"
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

              {/* 🔹 Show result if already checked */}
              {responses[q.id]?.status === "correct" && (
                <p className="text-green-400 font-bold">✅ Correct</p>
              )}
              {responses[q.id]?.status === "wrong" && (
                <p className="text-red-400 font-bold">❌ Wrong</p>
              )}
              {responses[q.id]?.status === "pending" && (
                <p className="text-gray-400">⏳ Waiting for expiry…</p>
              )}

              <div className="flex flex-row justify-center pt-4">
                <button
                  onClick={() => handleResponse(q.id, "yes")}
                  disabled={responses[q.id]?.status !== "pending"} // 🔹 disable after expiry
                  className={`mx-5 px-5 py-2 w-[400px] rounded-md shadow-xl text-xl transition-all ${responses[q.id]?.answer === "yes"
                    ? "bg-[#0064FB]"
                    : "bg-[#0064FB]/70 hover:bg-[#0064FB]"
                    } cursor-pointer hover:scale-105`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleResponse(q.id, "no")}
                  disabled={responses[q.id]?.status !== "pending"} // 🔹 disable after expiry
                  className={`mx-5 px-5 py-2 w-[400px] rounded-md shadow-xl text-xl transition-all ${responses[q.id]?.answer === "no"
                    ? "bg-[#FF414B]"
                    : "bg-[#FF414B]/70 hover:bg-[#FF414B]"
                    } cursor-pointer hover:scale-105`}
                >
                  No
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right side */}
      <div className="flex-1 w-1 m-4 mt-[40px] border border-white bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
        <p className="p-4">Portfolio / Stats Coming Soon</p>
      </div>
    </div>
  );
}

export default Main;
