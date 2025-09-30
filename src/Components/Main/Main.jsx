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
import { Context } from "../../context/context";
import Portfolio from "./Portfolio";
import { doc, setDoc, getDoc, updateDoc, onSnapshot, increment } from "firebase/firestore";
import TargetCursor from '../AnimatedComponents/TargetCursor';

function Main() {
  const { showData, user } = useContext(Context);
  const [questions, setQuestion] = useState([]);
  const [responses, setResponses] = useState({});
  const [now, setNow] = useState(new Date());
  const [currentRoundResponses, setCurrentRoundResponses] = useState({});
  const [expiry, setExpiry] = useState(null);

  // Effect to update the current time every second for the countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Effect to listen for the central timer from Firestore
  useEffect(() => {
    const roundDocRef = doc(db, "rounds", "current");
    const unsubscribe = onSnapshot(roundDocRef, (doc) => {
      if (doc.exists()) {
        const expiryTimestamp = doc.data().expiryTime;
        const newExpiry = expiryTimestamp.toDate();
        setExpiry(newExpiry);
        fetchPrices(newExpiry); // Fetch prices as soon as we get the new time
      }
    });
    return () => unsubscribe();
  }, []);

  // Effect to listen for the user's prediction history
  useEffect(() => {
    if (!user || !expiry) return; // Wait until user and expiry are loaded

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

  // Function to fetch crypto prices from API
  const fetchPrices = async (newExpiry) => {
    if (!newExpiry) return;
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,dogecoin,cardano,binancecoin,polygon,ripple&vs_currencies=usd");
      const data = await res.json();
      QuestionFromPrice(data, newExpiry);
    } catch (e) {
      console.error("price fetch failed", e);
    }
  };

  // Function to generate question list based on prices
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
      { id: "btc", text: `Bitcoin is forecasted to reach ${(bitcoinPrice + 1000).toFixed(2)} USDT or more?`, traders: 5, img: Bitcoin, expiration: expiryTime, correctAnswer: bitcoinPrice >= bitcoinPrice + 1000 ? "yes" : "no" },
      { id: "eth", text: `Ethereum is forecasted to reach ${(ethereumPrice + 100).toFixed(2)} USDT or more?`, traders: 5, img: Ethereum, expiration: expiryTime, correctAnswer: ethereumPrice >= ethereumPrice + 100 ? "yes" : "no" },
      { id: "sol", text: `Solana is forecasted to reach ${(solanaPrice + 10).toFixed(2)} USDT or more?`, traders: 5, img: Solana, expiration: expiryTime, correctAnswer: solanaPrice >= solanaPrice + 10 ? "yes" : "no" },
      { id: "doge", text: `Dogecoin is forecasted to reach ${(dogecoinPrice + 0.01).toFixed(2)} USDT or more?`, traders: 5, img: Doge, expiration: expiryTime, correctAnswer: dogecoinPrice >= dogecoinPrice + 0.01 ? "yes" : "no" },
      { id: "card", text: `Cardano is forecasted to reach ${(cardanoPrice + 0.1).toFixed(2)} USDT or more?`, traders: 5, img: Cardano, expiration: expiryTime, correctAnswer: cardanoPrice >= cardanoPrice + 0.1 ? "yes" : "no" },
      { id: "bnb", text: `Binance Coin is forecasted to reach ${(binancePrice + 10).toFixed(2)} USDT or more?`, traders: 5, img: Binance, expiration: expiryTime, correctAnswer: binancePrice >= binancePrice + 10 ? "yes" : "no" },
      { id: "pol", text: `Polygon is forecasted to reach ${(polygonPrice + 0.1).toFixed(2)} USDT or more?`, traders: 5, img: Polygon, expiration: expiryTime, correctAnswer: polygonPrice >= polygonPrice + 0.1 ? "yes" : "no" },
      { id: "xrp", text: `Ripple is forecasted to reach ${(ripplePrice + 0.1).toFixed(2)} USDT or more?`, traders: 5, img: Ripple, expiration: expiryTime, correctAnswer: ripplePrice >= ripplePrice + 0.1 ? "yes" : "no" },
    ];
    setQuestion(qList);
  };

  // Function to handle a user's prediction
  const handleResponse = async (qid, answer) => {
    if (!user || !expiry) return alert("Login required or round not ready!");
    const userDocRef = doc(db, "users", user.uid);
    const responsesDocRef = doc(db, "responses", user.uid);
    const roundId = `round_${expiry.getTime()}`;
    try {
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) return alert("Error: User profile not found.");
      if (userDocSnap.data().coins < 100) return alert("Not enough coins!");

      await updateDoc(userDocRef, { coins: increment(-100) });
      const dataToSave = { [roundId]: { [qid]: { answer, status: "pending" } } };
      await setDoc(responsesDocRef, dataToSave, { merge: true });
    } catch (err) {
      console.error("FIREBASE ERROR:", err);
    }
  };

  // Function to check answers when a round expires
  const autoCheck = async (expiredQuestions) => {
    if (!user || !expiry || expiredQuestions.length === 0) return;
    const userDocRef = doc(db, "users", user.uid);
    const expiredRoundId = `round_${expiry.getTime()}`;
    const roundData = responses[expiredRoundId];
    if (!roundData) return;

    const updates = {};
    let correctAnswersCount = 0;
    expiredQuestions.forEach((q) => {
      if (roundData[q.id]?.status === "pending") {
        const newStatus = roundData[q.id].answer === q.correctAnswer ? "correct" : "wrong";
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

  // Effect to manage round expiration and creation
  useEffect(() => {
    if (!expiry || now < expiry) return;

    autoCheck(questions);

    const createNewRound = async () => {
      const roundDocRef = doc(db, "rounds", "current");
      try {
        const currentRoundDoc = await getDoc(roundDocRef);
        if (currentRoundDoc.exists() && currentRoundDoc.data().isCreatingRound) return;

        await updateDoc(roundDocRef, { isCreatingRound: true });
        const newExpiryDate = new Date(Date.now() + 5 * 60 * 1000);
        await updateDoc(roundDocRef, {
          expiryTime: newExpiryDate,
          isCreatingRound: false,
        });
      } catch (error) {
        console.error("Error creating new round:", error);
        await updateDoc(doc(db, "rounds", "current"), { isCreatingRound: false });
      }
    };

    createNewRound();
  }, [now, expiry, user, questions]);

  const idToName = { btc: "Bitcoin", eth: "Ethereum", sol: "Solana", doge: "Dogecoin", card: "Cardano", bnb: "Binance Coin", pol: "Polygon", xrp: "Ripple" };
  const filteredQuestions = showData === "all" ? questions : questions.filter((q) => q.id === showData);

  const formatCountdown = (expiry) => {
    if (!expiry) return "00:00:00";
    const diff = expiry - now;
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full pt-[75px] px-[50px] text-white">
      {/* Single TargetCursor for all prediction buttons */}
      <TargetCursor targetSelector=".prediction-button" />

      <div className="flex flex-row gap-4">
        <div className="flex-1 min-w-[55vw] flex flex-col space-y-11">
          <p className="font-bold text-3xl mb-11 sticky top-0 py-4 z-10">
            {showData === "all" ? "ALL" : idToName[showData]?.toUpperCase()}
          </p>

          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="border-0 border-white p-4 bg-white/5 backdrop-blur-3xl rounded-lg shadow-md space-y-2"
            >
              <a href="#" className="text-[15px] rounded-full py-1">{q.traders} Traders</a>
              <div className="flex flex-row justify-between">
                <p className="py-1 mb-11 text-lg">{q.text}</p>
                <img src={q.img} alt={q.id} className="w-[60px] relative right-4" />
              </div>
              <p className="text-base text-yellow-300 font-mono">Time Left: {formatCountdown(q.expiration)}</p>

              {currentRoundResponses[q.id]?.status === "correct" && <p className="text-green-400 font-bold">✅ Correct</p>}
              {currentRoundResponses[q.id]?.status === "wrong" && <p className="text-red-400 font-bold">❌ Wrong</p>}
              {currentRoundResponses[q.id]?.status === "pending" && <p className="text-gray-400">⏳ Waiting for expiry…</p>}

              <div className="flex flex-row justify-center pt-4">
                <button
                  onClick={() => handleResponse(q.id, "yes")}
                  disabled={currentRoundResponses[q.id]}
                  className={`mx-5 px-5 py-2 w-[400px] rounded-md shadow-xl text-xl transition-all ${currentRoundResponses[q.id]?.answer === "yes" ? "bg-[#0064FB]" : "bg-[#0064FB]/70 hover:bg-[#0064FB]"} cursor-pointer hover:scale-105 prediction-button`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleResponse(q.id, "no")}
                  disabled={currentRoundResponses[q.id]}
                  className={`mx-5 px-5 py-2 w-[400px] rounded-md shadow-xl text-xl transition-all ${currentRoundResponses[q.id]?.answer === "no" ? "bg-[#FF414B]" : "bg-[#FF414B]/70 hover:bg-[#FF414B]"} cursor-pointer hover:scale-105 prediction-button`}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 w-1 border-0 border-white bg-white/5 backdrop-blur-sm rounded-lg shadow-md h-[100vh] p-4">
          <Portfolio responses={responses} idToName={idToName} />
        </div>
      </div>
    </div>
  );
}

export default Main;