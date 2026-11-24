"use client";

import React from "react";
import { Copy, ExternalLink, Trophy } from "lucide-react";

const steps = [
  {
    icon: <Copy className="w-8 h-8 text-brand-yellow" />,
    title: "1. Copy Code",
    description: "Pick a tipster and copy the 6-digit Bet9ja booking code.",
  },
  {
    icon: <ExternalLink className="w-8 h-8 text-brand-green" />,
    title: "2. Load Coupon",
    description: "Open Bet9ja.com, click 'Load Coupon', and paste the code.",
  },
  {
    icon: <Trophy className="w-8 h-8 text-brand-red" />,
    title: "3. Stake & Win",
    description: "Place your bet and wait for the guaranteed winnings.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-surface-white mb-4">
          How It <span className="text-brand-green">Works</span>
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto">
          Get your winning coupon codes in three simple steps. No complications, just pure wins.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-bg-deep shadow-[10px_10px_20px_rgba(0,0,0,0.6),-5px_-5px_15px_rgba(255,255,255,0.03)] border border-gray-800/50 hover:shadow-[inset_5px_5px_15px_rgba(0,0,0,0.8),inset_-5px_-5px_15px_rgba(255,255,255,0.05)] transition-all duration-500 group"
          >
            {/* Neumorphic Icon Container */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-bg-slate shadow-[5px_5px_10px_rgba(0,0,0,0.5),-5px_-5px_10px_rgba(255,255,255,0.05)] mb-6 group-hover:scale-110 transition-transform duration-300">
              {step.icon}
            </div>
            
            <h3 className="text-xl font-bold text-surface-white mb-3">
              {step.title}
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
