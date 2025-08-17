import React, { useContext, useState, useEffect } from "react";
import Bitcoin from "../../assets/Bitcoin.svg";
import Ethereum from "../../assets/Ethereum.svg";
import Solana from "../../assets/solana.svg";
import Doge from "../../assets/doge.svg";
import Cardano from "../../assets/cardano.svg";
import Binance from "../../assets/binance.svg";
import Ripple from "../../assets/ripple.svg";
// import Polygon from "../../assets/polygon.svg"; // if you have polygon logo
import { Context } from "../../context/context";

function Main() {
  const { showData } = useContext(Context);
  const [questions, setQuestion] = useState([]);

  const QuestionFromPrice = (prices) => {
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

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
        text: `Bitcoin is forecasted to reach ${(bitcoinPrice + 1000).toFixed(2)} USDT or more at ${expiry.toLocaleTimeString()}?`,
        traders: 5,
        img: Bitcoin,
        expiration: expiry,
      },
      {
        id: "eth",
        text: `Ethereum is forecasted to reach ${(ethereumPrice + 100).toFixed(2)} USDT or more at ${expiry.toLocaleTimeString()}?`,
        traders: 5,
        img: Ethereum,
        expiration: expiry,
      },
      {
        id: "sol",
        text: `Solana is forecasted to reach ${(solanaPrice + 10).toFixed(2)} USDT or more at ${expiry.toLocaleTimeString()}?`,
        traders: 5,
        img: Solana,
        expiration: expiry,
      },
      {
        id: "doge",
        text: `Dogecoin is forecasted to reach ${(dogecoinPrice + 0.01).toFixed(2)} USDT or more at ${expiry.toLocaleTimeString()}?`,
        traders: 5,
        img: Doge,
        expiration: expiry,
      },
      {
        id: "card",
        text: `Cardano is forecasted to reach ${(cardanoPrice + 0.1).toFixed(2)} USDT or more at ${expiry.toLocaleTimeString()}?`,
        traders: 5,
        img: Cardano,
        expiration: expiry,
      },
      {
        id: "bnb",
        text: `Binance Coin is forecasted to reach ${(binancePrice + 10).toFixed(2)} USDT or more at ${expiry.toLocaleTimeString()}?`,
        traders: 5,
        img: Binance,
        expiration: expiry,
      },
      {
        id: "pol",
        text: `Polygon is forecasted to reach ${(polygonPrice + 0.1).toFixed(2)} USDT or more at ${expiry.toLocaleTimeString()}?`,
        traders: 5,
        img: Solana, // replace with Polygon if available
        expiration: expiry,
      },
      {
        id: "xrp",
        text: `Ripple is forecasted to reach ${(ripplePrice + 0.1).toFixed(2)} USDT or more at ${expiry.toLocaleTimeString()}?`,
        traders: 5,
        img: Ripple,
        expiration: expiry,
      },
    ];

    setQuestion(qList);
  };

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,dogecoin,cardano,binancecoin,polygon,ripple&vs_currencies=usd"
      );
      const data = await res.json();
      QuestionFromPrice(data);
    } catch (e) {
      console.error("price fetch failed", e);
    }
  };

  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const filteredQuestions =
    showData === "all"
      ? questions
      : questions.filter((q) => q.id === showData);

  return (
    <div className="bg-black text-white h-[100vh] flex flex-row gap-4">
      {/* Left side: Questions */}
      <div className="flex-1 pl-[50px] pt-[40px] max-w-[60vw] flex flex-col space-y-6">
        <p className="font-bold text-2xl mb-11">
          {showData === "all" ? "All" : showData.toUpperCase()}
        </p>

        {filteredQuestions.length === 0 ? (
          <p>Loading questions…</p>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="border border-white pl-4 pt-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow-md"
            >
              <a href="#" className="text-[12px] rounded-full py-1">
                {q.traders} Traders
              </a>
              <div className="flex flex-row justify-between">
                <p className="py-1 mb-11">{q.text}</p>
                <img
                  src={q.img}
                  alt={q.id}
                  className="w-[60px] relative right-4"
                />
              </div>
              <div className="flex flex-row justify-center pt-4">
                <button className="bg-[#0064FB] mx-5 px-5 py-2 w-[320px] rounded-md shadow-xl hover:scale-105 hover:bg-[#0064FB]/90 transition-all">
                  Yes
                </button>
                <button className="bg-[#FF414B] mx-5 px-5 py-2 w-[320px] rounded-md shadow-xl hover:scale-105 hover:bg-[#FF414B]/90 transition-all">
                  No
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right side: Portfolio (future use) */}
      <div className="flex-1 w-[40vw] m-4 mt-[40px] border border-white bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
        <p className="p-4">Portfolio / Stats Coming Soon</p>
      </div>
    </div>
  );
}

export default Main;
