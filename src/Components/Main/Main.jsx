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

function Main() {
  const { showData, user } = useContext(Context);
  const [questions, setQuestion] = useState([]);
  const [responses, setResponses] = useState({});
  const [now, setNow] = useState(new Date());


  const [currentRoundResponses, setCurrentRoundResponses] = useState({});


  // In Main.jsx, at the top of the component
  const [expiry, setExpiry] = useState(null);

  function getNewExpiry() {
    return new Date(Date.now() + 60 * 1000);
  }

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // In Main.jsx, replace your existing timer listener with this
  useEffect(() => {
    const roundDocRef = doc(db, "rounds", "current");
    const unsubscribe = onSnapshot(roundDocRef, (doc) => {
      if (doc.exists()) {
        const expiryTimestamp = doc.data().expiryTime;
        const newExpiry = expiryTimestamp.toDate();
        setExpiry(newExpiry);

        // 👇 THIS IS THE FIX 👇
        // Fetch new prices as soon as we get the new expiry time
        fetchPrices(newExpiry);
      }
    });

    return () => unsubscribe();
  }, []); // This hook should only run once to set up the listener

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

  const fetchPrices = async (newExpiry = expiry) => {
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,dogecoin,cardano,binancecoin,polygon,ripple&vs_currencies=usd");
      const data = await res.json();
      QuestionFromPrice(data, newExpiry);
    } catch (e) {
      console.error("price fetch failed", e);
    }
  };


  useEffect(() => {
    if (!user) return;

    if (!expiry) return;

    const ref = doc(db, "responses", user.uid);
    const unsubscribe = onSnapshot(ref, (snap) => {

      console.log("Data received from Firestore:", snap.data());

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

  // In Main.jsx
  // In Main.jsx
  const handleResponse = async (qid, answer) => {
    if (!user) return alert("Login required!");

    const userDocRef = doc(db, "users", user.uid);
    const responsesDocRef = doc(db, "responses", user.uid);
    const roundId = `round_${expiry.getTime()}`;

    try {
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        return alert("Error: Could not find user profile. Please log out and back in.");
      }

      const userData = userDocSnap.data();
      if (userData.coins < 100) {
        return alert("You don't have enough coins! (Need 100)");
      }

      // 1. Subtract 100 coins
      await updateDoc(userDocRef, {
        coins: increment(-100)
      });

      // 2. Create the data structure to save
      const dataToSave = {
        [roundId]: { // The key is the current round ID
          [qid]: { answer, status: "pending" } // The new opinion
        }
      };

      // 3. Save the prediction using setDoc with merge:true
      // This will create the round if it doesn't exist, or
      // add/update a single opinion within the round without deleting others.
      await setDoc(responsesDocRef, dataToSave, { merge: true });

      console.log("✅ Bet placed for 100 coins!");

    } catch (err) {
      console.error("❌ FIREBASE ERROR:", err);
    }
  };

  // In Main.jsx
  const autoCheck = async (expiredQuestions) => {
    if (!user || expiredQuestions.length === 0) return;

    const userDocRef = doc(db, "users", user.uid);
    const expiredRoundId = `round_${expiry.getTime()}`;
    const roundData = responses[expiredRoundId];

    if (!roundData) return;

    const updates = {};
    let correctAnswersCount = 0;

    // Use the expiredQuestions list to get the correct answers
    expiredQuestions.forEach((q) => {
      if (roundData[q.id] && roundData[q.id].status === "pending") {
        const userAns = roundData[q.id].answer;
        const newStatus = userAns === q.correctAnswer ? "correct" : "wrong";
        updates[`${expiredRoundId}.${q.id}.status`] = newStatus;

        if (newStatus === "correct") {
          correctAnswersCount++;
        }
      }
    });

    if (Object.keys(updates).length > 0) {
      try {
        await updateDoc(doc(db, "responses", user.uid), updates);
        console.log("✅ Results updated for round:", expiredRoundId);
      } catch (err) {
        console.error("Error updating results", err);
      }
    }

    if (correctAnswersCount > 0) {
      const rewardAmount = correctAnswersCount * 200;
      try {
        await updateDoc(userDocRef, {
          coins: increment(rewardAmount)
        });
        console.log(`💰 Rewarded ${rewardAmount} coins!`);
      } catch (err) {
        console.error("Error adding reward", err);
      }
    }
  };




  // In Main.jsx
  useEffect(() => {
    if (!expiry) return;

    if (now >= expiry) {
      // We only need the user object to pass to autoCheck
      autoCheck(questions);

      const createNewRound = async () => {
        // --- Start of Locking Mechanism ---
        const roundDocRef = doc(db, "rounds", "current");

        try {
          const currentRoundDoc = await getDoc(roundDocRef);
          // Check if another user is already creating the new round
          if (currentRoundDoc.exists() && currentRoundDoc.data().isCreatingRound) {
            console.log("Another client is already creating the new round. Waiting...");
            return;
          }

          // Lock the document to signal that we are creating the round
          await updateDoc(roundDocRef, { isCreatingRound: true });
          // --- End of Locking Mechanism ---

          const newExpiryDate = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

          // Update the central document with the new time and release the lock
          await updateDoc(roundDocRef, {
            expiryTime: newExpiryDate,
            isCreatingRound: false // Release the lock
          });

          fetchPrices(newExpiryDate);

        } catch (error) {
          console.error("Error creating new round:", error);
          // In case of an error, try to release the lock
          const roundDocRef = doc(db, "rounds", "current");
          await updateDoc(roundDocRef, { isCreatingRound: false });
        }
      };

      createNewRound();
    }
  }, [now, expiry, user, questions]); // Add 'questions' to the dependency array


  const filteredQuestions = showData === "all" ? questions : questions.filter((q) => q.id === showData);
  const idToName = { btc: "Bitcoin", eth: "Ethereum", sol: "Solana", doge: "Dogecoin", card: "Cardano", bnb: "Binance Coin", pol: "Polygon", xrp: "Ripple" };

  const formatCountdown = (expiry) => {
    const diff = expiry - now;
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black text-white h-[100vh] flex flex-row gap-4 px-[50px]">
      <div className="flex-1 pl-[50px] pt-[40px] min-w-[55vw] flex flex-col space-y-11">
        <p className="font-bold text-3xl mb-11">{showData === "all" ? "ALL" : idToName[showData].toUpperCase()}</p>
        {filteredQuestions.map((q) => (
          <div key={q.id} className="border border-white pl-4 pt-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow-md space-y-2">
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
                className={`mx-5 px-5 py-2 w-[400px] rounded-md shadow-xl text-xl transition-all ${currentRoundResponses[q.id]?.answer === "yes" ? "bg-[#0064FB]" : "bg-[#0064FB]/70 hover:bg-[#0064FB]"} cursor-pointer hover:scale-105`}
              >
                Yes
              </button>
              <button
                onClick={() => handleResponse(q.id, "no")}
                disabled={currentRoundResponses[q.id]}
                className={`mx-5 px-5 py-2 w-[400px] rounded-md shadow-xl text-xl transition-all ${currentRoundResponses[q.id]?.answer === "no" ? "bg-[#FF414B]" : "bg-[#FF414B]/70 hover:bg-[#FF414B]"} cursor-pointer hover:scale-105`}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 w-1 m-4 mt-[40px] border border-white bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
        <Portfolio responses={responses} idToName={idToName} />
      </div>
    </div>
  );
}

export default Main;