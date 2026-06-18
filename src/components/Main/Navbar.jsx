import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBitcoin, faEthereum } from "@fortawesome/free-brands-svg-icons";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import Coin from "../../assets/Coin.svg";
import Solana from "../../assets/solana.svg";
import Doge from "../../assets/doge.svg";
import Cardano from "../../assets/cardano.svg";
import Binance from "../../assets/binance.svg";
import Polygon from "../../assets/Polygon.svg";
import Ripple from "../../assets/ripple.svg";
import Shuffle from "../AnimatedComponents/Shuffle";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { user, userData, setShowData } = useContext(Context);
  const [selectedCoin, setSelectedCoin] = useState("All");
  const [LoggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.profile-menu-container')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

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

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="fixed top-0 left-0 right-0 bg-transparent backdrop-blur-lg text-white h-[75px] flex items-center z-50 px-4 sm:px-6 lg:px-10">
        <nav className="flex items-center justify-between w-full">
          {/* Brand */}
          <h1 className="tracking-[6px] text-2xl sm:text-[32px] font-silkscreen">
            <div className="hidden sm:block">
              <Shuffle
                text="OPTO"
                fontFamily="'silkscreen', serif"
                fontSize="3rem"
                letterColors={['#FFB000', '#ffffff', '#ffffff', '#FFB000']}
              />
            </div>

            <div className="block sm:hidden">
              <Shuffle
                text="OPTO"
                fontFamily="'silkscreen', serif"
                fontSize="2rem"
                letterColors={['#FFB000']}
              />
            </div>
          </h1>

          {/* Navigation */}
          <div className="relative flex items-center gap-2 sm:gap-4 lg:gap-11">
            {userData && (
              <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-4 py-1 rounded-full text-xs sm:text-base font-medium">
                <img src={Coin} alt="coin" className="w-6 h-6 sm:w-9 sm:h-9" />
                <span className="hidden xs:inline">{userData.coins.toLocaleString()}</span>
                <span className="inline xs:hidden">{userData.coins > 999 ? `${(userData.coins / 1000).toFixed(1)}k` : userData.coins}</span>
              </div>
            )}

            <button className="px-3 sm:px-5 py-2 hidden md:block bg-[#136ef6ee] hover:bg-[hsl(216,93%,52%)] hover:scale-105 rounded-3xl transition-all text-sm sm:text-base whitespace-nowrap">
              Add Coins
            </button>

            {LoggedIn && user?.photoURL ? (
              <div className="relative profile-menu-container">
                <img
                  src={user.photoURL}
                  alt="Profile"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 hover:border-white/50 hover:scale-105 transition-all object-cover cursor-pointer"
                />

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-[55px] sm:top-[60px] right-0 bg-white text-black rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-md p-4 sm:p-5 min-w-[200px] sm:min-w-[250px] z-[100]"
                    >
                      <ul className="flex flex-col gap-3 sm:gap-4">
                        <li
                          onClick={() => setMenuOpen(false)}
                          className="hover:bg-gray-200 rounded-3xl px-4 sm:px-5 py-2 sm:py-3 cursor-pointer text-center font-bold text-base sm:text-lg transition-all"
                        >
                          Account
                        </li>
                        <li
                          onClick={() => setMenuOpen(false)}
                          className="hover:bg-gray-200 rounded-3xl px-4 sm:px-5 py-2 sm:py-3 cursor-pointer text-center font-bold text-base sm:text-lg transition-all"
                        >
                          Settings
                        </li>
                        <li
                          onClick={handleLogout}
                          className="hover:bg-red-600 bg-red-500 text-white rounded-3xl px-4 sm:px-5 py-2 sm:py-3 cursor-pointer text-center font-bold text-base sm:text-lg transition-all"
                        >
                          Logout
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-3 sm:px-5 py-2 bg-[#136ef6ee] hover:bg-[hsl(216,93%,52%)] hover:scale-105 rounded-3xl transition-all text-sm sm:text-base cursor-pointer whitespace-nowrap"
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </div>

      <div className="bg-transparent py-4 sm:py-6 px-2 sm:px-4 overflow-x-auto scrollbar-hide pt-[85px] sm:pt-[90px] mx-0 sm:mx-[30px] lg:mx-[50px]">
        <ul className="flex gap-2 sm:gap-3 lg:gap-4 min-w-max sm:justify-between">
          {cryptos.map((coin) => (
            <li key={coin.name}>
              <button
                onClick={() => {
                  setSelectedCoin(coin.name);
                  setShowData(coin.key);
                }}
                className={`px-3 sm:px-4 lg:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm lg:text-base font-semibold transition-all border-2 flex items-center gap-1 sm:gap-2 whitespace-nowrap ${selectedCoin === coin.name
                  ? "scale-105 shadow-[0_0_15px_1px_rgba(255,255,255,0.7)]"
                  : "opacity-90 hover:opacity-100"
                  }`}
                style={{
                  borderColor: "#fbfbff90",
                  backgroundColor: "#fbfbff75",
                  color: "black",
                }}
              >
                {coin.type === "fa" && (
                  <FontAwesomeIcon icon={coin.icon} size="lg" className="sm:text-xl" style={{ color: coin.setIconColor }} />
                )}
                {coin.type === "svg" && (
                  <img src={coin.icon} alt={coin.name} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-[22px] lg:h-[22px]" />
                )}
                {coin.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.header>
  );
}

export default Navbar;