import { useContext, useState, useEffect } from "react";
import { Context } from "@/context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBitcoin, faEthereum } from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import Coin from "@/assets/Coin.svg";
import Solana from "@/assets/solana.svg";
import Doge from "@/assets/doge.svg";
import Cardano from "@/assets/cardano.svg";
import Binance from "@/assets/binance.svg";
import Polygon from "@/assets/Polygon.svg";
import Ripple from "@/assets/ripple.svg";

const cryptos = [
  { name: "All", key: "all" },
  { name: "Bitcoin", icon: faBitcoin, type: "fa", setIconColor: "#f7931a", key: "btc" },
  { name: "Ethereum", icon: faEthereum, type: "fa", setIconColor: "#3c3c3d", key: "eth" },
  { name: "Solana", icon: Solana, type: "svg", key: "sol" },
  { name: "Dogecoin", icon: Doge, type: "svg", key: "doge" },
  { name: "Cardano", icon: Cardano, type: "svg", key: "card" },
  { name: "Binance Coin", icon: Binance, type: "svg", key: "bnb" },
  { name: "Polygon", icon: Polygon, type: "svg", key: "pol" },
  { name: "Ripple", icon: Ripple, type: "svg", key: "xrp" },
];

function Navbar() {
  const { user, userData, showData, setShowData } = useContext(Context);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (menuOpen && !target.closest(".profile-menu-container")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="fixed top-0 left-0 right-0 nav-blur border-b border-border h-[72px] flex items-center z-50 px-4 sm:px-6 lg:px-10">
        <nav className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link to="/" className="hover:opacity-70 transition-opacity">
              <Logo className="text-2xl sm:text-3xl" />
            </Link>
            {user && (
              <div className="hidden md:flex items-center gap-1">
                {[
                  { to: "/app", label: "Markets" },
                  { to: "/portfolio", label: "Portfolio" },
                ].map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                        active
                          ? "text-foreground bg-secondary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative flex items-center gap-2 sm:gap-4">
            {userData && (
              <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-sm font-medium">
                <img src={Coin} alt="coins" className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>{userData.coins.toLocaleString()}</span>
              </div>
            )}

            <Button variant="default" size="sm" className="hidden md:inline-flex">
              Add Coins
            </Button>

            {user?.photoURL ? (
              <div className="relative profile-menu-container">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Open account menu"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  className="block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-10 h-10 rounded-full border border-border hover:border-foreground/40 transition-all object-cover cursor-pointer"
                  />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      role="menu"
                      className="absolute top-[52px] right-0 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-1.5 min-w-[200px] z-[100]"
                    >
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/portfolio");
                        }}
                        className="w-full text-left rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary transition-colors md:hidden"
                      >
                        Portfolio
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full text-left rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary transition-colors"
                      >
                        Account
                      </button>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="w-full text-left rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary transition-colors"
                      >
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button variant="default" size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </div>
        </nav>
      </div>

      <div className="pt-[84px] px-3 sm:px-6 lg:px-[50px]">
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide">
            <ul aria-label="Filter markets by coin" className="flex items-center gap-1.5 min-w-max p-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm w-max mx-auto">
              {cryptos.map((coin) => {
                const active = showData === coin.key;
                return (
                  <li key={coin.name} className="relative">
                    <button
                      onClick={() => setShowData(coin.key)}
                      aria-pressed={active}
                      className={cn(
                        "relative z-10 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap",
                        active
                          ? "text-background"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="filter-pill"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="absolute inset-0 -z-10 rounded-full bg-foreground shadow-sm"
                        />
                      )}
                      {coin.type === "fa" && (
                        <FontAwesomeIcon
                          icon={coin.icon as IconDefinition}
                          className="text-[13px]"
                          style={{ color: active ? "#FFB000" : coin.setIconColor }}
                        />
                      )}
                      {coin.type === "svg" && (
                        <img
                          src={coin.icon as string}
                          alt=""
                          className={cn(
                            "w-4 h-4 sm:w-[18px] sm:h-[18px] transition-opacity",
                            active ? "opacity-100" : "opacity-80"
                          )}
                        />
                      )}
                      {coin.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
