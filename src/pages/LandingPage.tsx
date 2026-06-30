import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Context } from "@/context/context";
import { Button } from "@/components/ui/button";
import LandingNav from "@/components/Landing/LandingNav";
import MeshBackdrop from "@/components/Landing/MeshBackdrop";
import HowItWorks from "@/components/Landing/HowItWorks";
import MarketsPreview from "@/components/Landing/MarketsPreview";
import FeaturesStats from "@/components/Landing/FeaturesStats";
import Footer from "@/components/Main/Footer";
import LivePriceTicker from "@/components/Main/LivePriceTicker";

const headline = ["PREDICT", "THE", "MARKET"];

function LandingPage() {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const primaryTarget = user ? "/app" : "/login";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      <section className="relative overflow-hidden">
        <MeshBackdrop />
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-20 min-h-screen flex flex-col justify-center">
          <div className="flex flex-col items-center text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Live crypto prediction market
            </motion.span>

            {headline.map((line, index) => (
              <motion.h1
                key={line}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
                className={`hero-title text-7xl sm:text-8xl md:text-9xl ${
                  line === "THE" ? "text-accent italic" : "text-foreground"
                }`}
              >
                {line}
              </motion.h1>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="body-text mt-8 max-w-xl"
            >
              Stake your take on where crypto goes next. Read the round, place your call,
              and let the market settle the score.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-12 flex flex-col sm:flex-row items-center gap-4"
            >
              <Button size="lg" onClick={() => navigate(primaryTarget)}>
                {user ? "Open app" : "Start predicting"}
                <ArrowRight />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/market")}>
                View market
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <LivePriceTicker />
        </motion.div>
      </section>

      <HowItWorks />
      <MarketsPreview />
      <FeaturesStats />
      <Footer />
    </div>
  );
}

export default LandingPage;
