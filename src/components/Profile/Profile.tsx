import { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  Mail,
  CalendarDays,
} from "lucide-react";
import { Context } from "@/context/context";
import { getMyPredictions } from "@/api";
import { computeStats, type Prediction } from "@/lib/portfolioStats";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Main/Navbar";
import Footer from "@/components/Main/Footer";
import Coin from "@/assets/Coin.svg";

export default function Profile() {
  const { user, userData, logout } = useContext(Context);
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    let active = true;
    const load = async () => {
      try {
        const data = await getMyPredictions();
        if (active) setPredictions(data);
      } catch {
        if (active) setPredictions([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [user, navigate]);

  const stats = useMemo(() => computeStats(predictions), [predictions]);

  if (!user) return null;

  const displayName = userData?.display_name || user.displayName || "Unnamed User";
  const email = userData?.email || user.email || "—";
  const memberSince = userData?.created_at
    ? new Date(userData.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const pnlPositive = stats.netPnl >= 0;

  const summary = [
    { label: "Predictions", value: stats.total.toLocaleString(), tone: "text-foreground" },
    { label: "Win Rate", value: `${stats.winRate}%`, tone: "text-foreground" },
    {
      label: "Net P&L",
      value: `${pnlPositive ? "+" : ""}${stats.netPnl.toLocaleString()}`,
      tone: pnlPositive ? "text-accent" : "text-destructive",
    },
    {
      label: "Streak",
      value: stats.currentStreak.toString(),
      tone: stats.currentStreak > 0 ? "text-accent" : "text-foreground",
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background dot-grid flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 lg:px-[50px] pt-[120px] pb-16 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="section-header mb-2">Account</p>
          <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl text-foreground">
            Your <span className="text-accent italic">profile</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <Card className="p-6 sm:p-8 bg-card/80 backdrop-blur-sm mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <img
                src={
                  user.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    displayName
                  )}&background=FFB000&color=fff&size=160`
                }
                alt="Profile avatar"
                className="w-24 h-24 rounded-full border border-border object-cover shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-semibold text-foreground truncate">
                  {displayName}
                </h2>
                <div className="mt-3 space-y-1.5">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="truncate">{email}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4 shrink-0" />
                    Member since {memberSince}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-sm shrink-0 self-start">
                <img src={Coin} alt="coins" className="w-6 h-6" />
                <span className="text-lg font-bold tabular-nums">
                  {(userData?.coins ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">balance</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <Card className="p-5 sm:p-6 bg-card/80 backdrop-blur-sm mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                At a glance
              </h3>
              <Link
                to="/portfolio"
                className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1"
              >
                Full portfolio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {summary.map((s) => (
                <div key={s.label}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    {s.label === "Net P&L" &&
                      (pnlPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
                      ))}
                    {s.label}
                  </p>
                  <p className={cn("text-3xl font-bold tabular-nums mt-2", s.tone)}>
                    {loading ? "—" : s.value}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button onClick={() => navigate("/app")} className="sm:flex-1">
            Go to markets
            <ArrowRight />
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="sm:flex-1 text-destructive hover:text-destructive"
          >
            <LogOut />
            Log out
          </Button>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
