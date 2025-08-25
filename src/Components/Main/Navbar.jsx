import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Context } from '../../context/context'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBitcoin, faEthereum } from "@fortawesome/free-brands-svg-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";
import Solana from "../../assets/solana.svg";
import Doge from "../../assets/doge.svg";
import Cardano from "../../assets/cardano.svg";
import Binance from "../../assets/binance.svg";
import Polygon from "../../assets/Polygon.svg"
import Ripple from "../../assets/ripple.svg";

function Navbar() {
  const [user, setUser] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState("All");
  const { showData, setShowData } = useContext(Context);

  const cryptos = [
    { name: "All", color: "#020313", type: "", key: "all" },
    {
      name: "Bitcoin",
      color: "#020313",
      icon: faBitcoin,
      type: "fa",
      setIconColor: "#ff7800",
      key: "btc"
    },
    {
      name: "Ethereum",
      color: "#020313",
      icon: faEthereum,
      type: "fa",
      setIconColor: "#deddda",
      key: "eth",
    },
    { name: "Solana", color: "#020313", icon: Solana, type: "svg", key: "sol", },
    { name: "Dogecoin", color: "#020313", icon: Doge, type: "svg", key: "doge", },
    { name: "Cardano", color: "#020313", icon: Cardano, type: "svg", key: "card", },
    { name: "Binance Coin", color: "#020313", icon: Binance, type: "svg", key: "bnb", },
    { name: "Polygon", color: "#020313", icon: Polygon, type: "svg", key: "pol", },
    { name: "Ripple", color: "#020313", icon: Ripple, type: "svg", key: "xrp", },
  ];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header>
      <div
        className="fixed top-0 left-0 right-0  bg-black/30 backdrop-blur-md shadow-[0_4px_50px_rgba(0,0,0,0.5)] text-white h-[75px] flex items-center z-50 px-[65px]"
      >
        <nav className="flex items-center justify-between w-full">
          <h1 className="px-5 tracking-[6px] text-[35px] font-silkscreen">Opto</h1>
          <ul className="flex justify-start pl-[360px] gap-[150px] text-lg">
            <li>
              <a href="">Live-opinion</a>
            </li>
            <li>
              <a href="">Pre-match</a>
            </li>
            <li>
              <a href="">Promos</a>
            </li>
          </ul>
          <button className="ml-auto mr-11 px-5 h-11 bg-[#136ef6c9] hover:bg-[hsl(216,93%,52%)]  hover:scale-105 rounded-3xl transition-all text-lg">
            Add Coins
          </button>

          <div className=" flex  items-center gap-4 mr-5 hover:bg-[#fbfbff49] p-2 rounded-3xl   ">
            {user && (
              <>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="User Avatar"
                    className="w-11 h-11 rounded-full"
                  />
                )}

              </>
            )}
          </div>
        </nav>
      </div>

      <div className="bg-transparent py-6 px-4 overflow-x-auto scrollbar-hide pt-[90px] mx-[50px]">
        <ul className="flex gap-4 min-w-max justify-between  ">
          {cryptos.map((coin) => (
            <li key={coin.name}>
              <button
                onClick={() => {
                  setSelectedCoin(coin.name);  // for local highlight
                  setShowData(coin.key);       // store the crypto key globally
                }}
                className={`px-5 py-3 rounded-full text-base font-semibold transition-all  border-2 flex items-center gap-2 
                ${selectedCoin === coin.name
                    ? "scale-105  shadow-[0_0_15px_1px_rgba(255,255,255,0.7)]"
                    : "opacity-90 hover:opacity-100"
                  }`}
                style={{
                  borderColor: "#fbfbff90",
                  backgroundColor: "#fbfbff75",
                  color: "black",
                }}
              >
                {coin.type === "fa" && (
                  <FontAwesomeIcon
                    icon={coin.icon}
                    size="xl"
                    style={{ color: coin.setIconColor }}
                  />
                )}

                {coin.type === "svg" && (
                  <img
                    src={coin.icon}
                    alt={coin.name}
                    style={{
                      width: "22px",
                      height: "22px",
                      filter:
                        selectedCoin === coin.name
                          ? "brightness(1.1)"
                          : "brigthness(1  )",
                    }}
                  />
                )}
                {coin.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header >
  );
}

export default Navbar;
