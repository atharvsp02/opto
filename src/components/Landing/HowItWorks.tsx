import { MousePointerClick, TrendingUp, Coins } from "lucide-react";
import Reveal from "@/components/Landing/Reveal";

const steps = [
  {
    icon: MousePointerClick,
    title: "Pick a market",
    body: "Choose from eight live crypto markets. Each round asks one question: will the price hit the target before time runs out?",
  },
  {
    icon: TrendingUp,
    title: "Call Yes or No",
    body: "Read the chart, trust your gut, and place your prediction. One call per market, locked in until the round settles.",
  },
  {
    icon: Coins,
    title: "Win coins",
    body: "When the round closes, real market prices decide the outcome. Get it right and the coins are yours — no house, no tricks.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="max-w-7xl mx-auto px-6 md:px-12 py-24 sm:py-32">
      <Reveal>
        <p className="section-header text-center">How it works</p>
        <h2 className="hero-title text-5xl sm:text-6xl text-center text-foreground mb-16">
          Three steps to your <span className="text-accent italic">first call</span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <Reveal key={step.title} delay={i * 0.1}>
              <div className="group h-full bg-card hover:bg-card/60 transition-colors duration-300 p-8 sm:p-10">
                <div className="flex items-baseline gap-4 border-b border-border pb-6 mb-6">
                  <span className="hero-title text-7xl sm:text-8xl leading-none text-foreground">
                    {i + 1}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                  <Icon className="w-5 h-5 text-accent shrink-0" strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="body-text text-base">{step.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
