"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface WinningTicket {
  id: string;
  odds: number;
  stake: number;
  return_amount: number;
  booking_code: string;
  time: string;
}

// THIS IS THE MISSING COMPONENT
const TicketCard = ({ odds, stake, returnAmt, time, code }: any) => (
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
        <p className="text-surface-white font-bold text-sm">₦{Number(stake).toLocaleString()}</p>
      </div>
      <div className="text-right">
        <p className="text-text-muted text-[10px] uppercase tracking-wider">Return</p>
        <p className="text-brand-green font-bold text-sm">₦{Number(returnAmt).toLocaleString()}</p>
      </div>
    </div>

    {/* Booking Code */}
    <div className="bg-bg-deep border border-gray-700/50 rounded-lg py-2 px-3 flex justify-between items-center">
      <span className="text-text-muted text-[10px] uppercase font-bold">Code</span>
      <span className="text-brand-yellow font-mono font-bold text-sm">{code}</span>
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
  const [tickets, setTickets] = useState<WinningTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from("winning_tickets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (data) setTickets(data);
      setLoading(false);
    };

    fetchTickets();
  }, []);

  // Return null if loading or no data
  if (loading) return null;
  if (tickets.length === 0) return null;

  return (
    <div className="w-full overflow-hidden relative py-8">
      {/* Gradient Fades */}
      <div className="absolute top-0 left-0 w-16 sm:w-32 h-full bg-gradient-to-r from-bg-deep to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 sm:w-32 h-full bg-gradient-to-l from-bg-deep to-transparent z-10 pointer-events-none" />

      {/* Scrolling Container */}
      <div className="flex w-max animate-scroll">
        <div className="flex">
          {tickets.map((ticket) => (
            <TicketCard 
              key={`first-${ticket.id}`} 
              odds={ticket.odds} 
              stake={ticket.stake} 
              returnAmt={ticket.return_amount} 
              time={ticket.time} 
              code={ticket.booking_code} 
            />
          ))}
        </div>
        <div className="flex">
          {tickets.map((ticket) => (
            <TicketCard 
              key={`second-${ticket.id}`} 
              odds={ticket.odds} 
              stake={ticket.stake} 
              returnAmt={ticket.return_amount} 
              time={ticket.time} 
              code={ticket.booking_code} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteTicker;
