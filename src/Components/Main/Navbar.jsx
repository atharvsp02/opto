import React, { useContext, useState } from "react";
import { Context } from '../../context/context';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBitcoin, faEthereum } from "@fortawesome/free-brands-svg-icons";
import Coin from "../../assets/Coin.svg"
import Solana from "../../assets/solana.svg";
import Doge from "../../assets/doge.svg";
import Cardano from "../../assets/cardano.svg";
import Binance from "../../assets/binance.svg";
import Polygon from "../../assets/Polygon.svg";
import Ripple from "../../assets/ripple.svg";
import Shuffle from '../AnimatedComponents/Shuffle';


function Navbar() {
  const { user, userData, showData, setShowData } = useContext(Context);
  const [selectedCoin, setSelectedCoin] = useState("All");

  const cryptos = [
    { name: "All", key: "all" },
    { name: "Bitcoin", icon: faBitcoin, type: "fa", setIconColor: "#ff7800", key: "btc" },
    { name: "Ethereum", icon: faEthereum, type: "fa", setIconColor: "#deddda", key: "eth" },
    { name: "Solana", icon: Solana, type: "svg", key: "sol" },
    { name: "Dogecoin", icon: Doge, type: "svg", key: "doge" },
    { name: "Cardano", icon: Cardano, type: "svg", key: "card" },
    { name: "Binance Coin", icon: Binance, type: "svg", key: "bnb" },
    { name: "Polygon", icon: Polygon, type: "svg", key: "pol" },
    { name: "Ripple", icon: Ripple, type: "svg", key: "xrp" },
  ];

  return (
    <header>
      {/* CHANGES MADE HERE:
        - bg-black/30 -> bg-gray-900/50: A slightly less transparent background that better matches the theme.
        - backdrop-blur-md -> backdrop-blur-lg: Increased the glassmorphism blur effect.
        - Added border-b border-white/10: A subtle white bottom border for better separation.
        - Removed the heavy custom shadow for a cleaner look.
      */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900/50 backdrop-blur-lg border-b border-white/10 text-white h-[75px] flex items-center z-50 px-[65px]">
        <nav className="flex items-center justify-between w-full">

          <h1 className="px-5 tracking-[6px] text-[35px] font-silkscreen"><Shuffle
            text="OPTO"
            fontSize="3rem"
            fontFamily="'silkscreen', serif"

          /></h1>
          <ul className="flex justify-start pl-[360px] gap-[150px] text-lg">
            <li><a href="">Live-opinion</a></li>
            <li><a href="">Pre-match</a></li>
            <li><a href="">Promos</a></li>
          </ul>

          <div className="ml-auto flex items-center gap-4">
            {/* This is the part that displays the coins */}
            {userData && (
              <div className="text-lg font-semibold bg-white/10 p-2 px-4 rounded-full ">
                <span className="flex gap-3 justify-center items-center px-2  "><img src={Coin} alt="" className="w-9 " /> {userData.coins.toLocaleString()}</span>
              </div>
            )}
            <button className="px-5 h-11 bg-[#136ef6c9] hover:bg-[hsl(216,93%,52%)] hover:scale-105 rounded-3xl transition-all text-lg">
              Add Coins
            </button>
          </div>

          <div className="flex items-center gap-4 mr-5 hover:bg-[#fbfbff49] p-2 rounded-3xl ml-4">
            {user && user.photoURL && (
              <img
                src={user.photoURL}
                alt="User Avatar"
                className="w-11 h-11 rounded-full"
              />
            )}
          </div>
        </nav>
      </div>

      <div className="bg-transparent py-6 px-4 overflow-x-auto scrollbar-hide pt-[90px] mx-[50px]">
        <ul className="flex gap-4 min-w-max justify-between">
          {cryptos.map((coin) => (
            <li key={coin.name}>
              <button
                onClick={() => {
                  setSelectedCoin(coin.name);
                  setShowData(coin.key);
                }}
                className={`px-5 py-3 rounded-full text-base font-semibold transition-all border-2 flex items-center gap-2 ${selectedCoin === coin.name
                  ? "scale-105 shadow-[0_0_15px_1px_rgba(255,255,255,0.7)]"
                  : "opacity-90 hover:opacity-100"
                  }`}
                style={{
                  borderColor: "#fbfbff90",
                  backgroundColor: "#fbfbff75",
                  color: "black",
                }}
              >
                {coin.type === "fa" && <FontAwesomeIcon icon={coin.icon} size="xl" style={{ color: coin.setIconColor }} />}
                {coin.type === "svg" && <img src={coin.icon} alt={coin.name} style={{ width: "22px", height: "22px" }} />}
                {coin.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
