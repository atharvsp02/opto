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
  const { user, userData, showData, setShowData } = useContext(Context);
  const [selectedCoin, setSelectedCoin] = useState("All");
  const [LoggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // ← ADD THIS

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // ← ADD THIS: Close menu when clicking outside
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
      setMenuOpen(false); // ← Close menu after logout
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
      <div className="fixed top-0 left-0 right-0 bg-transparent backdrop-blur-lg text-white h-[75px] flex items-center z-50 px-10 sm:px-16">
        <nav className="flex items-center justify-between w-full">
          {/* Brand */}
          <h1 className="tracking-[6px] text-[32px] font-silkscreen">
            <Shuffle
              text="OPTO"
              fontSize="3rem"
              fontFamily="'silkscreen', serif"
              letterColors={['#FFB000', '#ffffff', '#ffffff', '#FFB000']}
            />
          </h1>

          {/* Navigation */}
          <div className="relative flex items-center gap-11">
            {userData && (
              <div className="flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full text-base font-medium">
                <img src={Coin} alt="coin" className="w-9 h-9" />
                {userData.coins.toLocaleString()}
              </div>
            )}

            <button className="px-5 py-2 bg-[#136ef6ee] hover:bg-[hsl(216,93%,52%)] hover:scale-105 rounded-3xl transition-all text-base">
              Add Coins
            </button>

            {/* Profile Menu - REPLACED NavigationMenu with simple state */}
            {LoggedIn && user?.photoURL ? (
              <div className="relative profile-menu-container">
                <img
                  src={user.photoURL}
                  alt="Profile"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-12 h-12 rounded-full border border-white/20 hover:border-white/50 hover:scale-105 transition-all object-cover cursor-pointer"
                />

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-[60px] right-0 bg-white text-black rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-md p-5 min-w-[250px] z-[100]"
                    >
                      <ul className="flex flex-col gap-4">
                        <li
                          onClick={() => setMenuOpen(false)}
                          className="hover:bg-gray-200 rounded-3xl px-5 py-3 cursor-pointer text-center font-bold text-lg transition-all"
                        >
                          Account
                        </li>
                        <li
                          onClick={() => setMenuOpen(false)}
                          className="hover:bg-gray-200 rounded-3xl px-5 py-3 cursor-pointer text-center font-bold text-lg transition-all"
                        >
                          Settings
                        </li>
                        <li
                          onClick={handleLogout}
                          className="hover:bg-red-600 bg-red-500 text-white rounded-3xl px-5 py-3 cursor-pointer text-center font-bold text-lg transition-all"
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
                className="px-5 py-2 bg-[#136ef6ee] hover:bg-[hsl(216,93%,52%)] hover:scale-105 rounded-3xl transition-all text-base cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Crypto Filter Bar */}
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
                {coin.type === "fa" && (
                  <FontAwesomeIcon icon={coin.icon} size="xl" style={{ color: coin.setIconColor }} />
                )}
                {coin.type === "svg" && (
                  <img src={coin.icon} alt={coin.name} style={{ width: "22px", height: "22px" }} />
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