"use client";

import React from "react";
import { CheckCircle2, Trophy } from "lucide-react";

// Sample data to populate the cards
const tickets = [
  { id: 1, odds: "23.50", stake: "₦1,000", returnAmt: "₦23,500", time: "14:32" },
  { id: 2, odds: "12.75", stake: "₦1,000", returnAmt: "₦12,750", time: "13:47" },
  { id: 3, odds: "17.80", stake: "₦1,000", returnAmt: "₦17,800", time: "15:20" },
  { id: 4, odds: "8.90", stake: "₦500", returnAmt: "₦4,450", time: "12:10" },
  { id: 5, odds: "20.25", stake: "₦1,000", returnAmt: "₦20,250", time: "16:05" },
  { id: 6, odds: "45.10", stake: "₦2,000", returnAmt: "₦90,200", time: "11:30" },
];

const TicketCard = ({ odds, stake, returnAmt, time }: any) => (
  <div className="shrink-0 w-[280px] sm:w-[300px] bg-bg-slate/80 backdrop-blur-sm border border-brand-green/30 rounded-xl p-4 mx-3 shadow-[0_0_15px_rgba(42,157,72,0.15)] flex flex-col gap-3">
    
    {/* Header */}
    <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="text-brand-green w-4 h-4" />
        <span className="text-surface-white font-bold text-sm">Winning Ticket</span>
      </div>
      <Trophy className="text-brand-yellow w-5 h-5" />
    </div>

    {/* Odds & Win Badge */}
    <div className="flex justify-between items-end mt-1">
      <div>
        <p className="text-text-muted text-xs">Total Odds</p>
        <p className="text-surface-white font-extrabold text-2xl">{odds}</p>
      </div>
      <div className="bg-brand-green text-surface-white font-black px-3 py-1 rounded-md text-sm italic shadow-[0_0_10px_rgba(42,157,72,0.5)]">
        WIN
      </div>
    </div>

    {/* Stake & Return */}
    <div className="grid grid-cols-2 gap-2 bg-bg-deep rounded-lg p-2 mt-1">
      <div>
        <p className="text-text-muted text-[10px] uppercase tracking-wider">Stake</p>
        <p className="text-surface-white font-bold text-sm">{stake}</p>
      </div>
      <div className="text-right">
        <p className="text-text-muted text-[10px] uppercase tracking-wider">Return</p>
        <p className="text-brand-green font-bold text-sm">{returnAmt}</p>
      </div>
    </div>

    {/* Footer */}
    <div className="flex items-center gap-2 mt-1">
      <div className="w-4 h-4 rounded-full bg-brand-green flex items-center justify-center">
         <CheckCircle2 className="text-bg-deep w-3 h-3" />
      </div>
      <div>
        <p className="text-surface-white text-[10px] font-medium">Bet Placed Successfully</p>
        <p className="text-text-muted text-[9px]">12 Nov 2026 • {time}</p>
      </div>
    </div>
  </div>
);

const InfiniteTicker = () => {
  return (
    <div className="w-full overflow-hidden relative py-8">
      {/* Gradient Fades on edges for smooth transition into background */}
      <div className="absolute top-0 left-0 w-16 sm:w-32 h-full bg-gradient-to-r from-bg-deep to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 sm:w-32 h-full bg-gradient-to-l from-bg-deep to-transparent z-10 pointer-events-none" />

      {/* Scrolling Container */}
      <div className="flex w-max animate-scroll">
        {/* We render the list twice to create the infinite seamless loop */}
        <div className="flex">
          {tickets.map((ticket) => (
            <TicketCard key={`first-${ticket.id}`} {...ticket} />
          ))}
        </div>
        <div className="flex">
          {tickets.map((ticket) => (
            <TicketCard key={`second-${ticket.id}`} {...ticket} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteTicker;
