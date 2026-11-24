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

// ... (Keep TicketCard exactly as it is) ...

const InfiniteTicker = () => {
  const [tickets, setTickets] = useState<WinningTicket[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const supabase = createClient();

  useEffect(() => {
    const fetchTickets = async () => {
      // Force no-store cache
      const { data, error } = await supabase
        .from("winning_tickets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (data && data.length > 0) {
        setTickets(data);
      }
      setLoading(false);
    };

    fetchTickets();
  }, []);

  if (loading) return null; // Don't render while loading
  if (tickets.length === 0) return null; // If DB is empty, hide

  return (
    <div className="w-full overflow-hidden relative py-8">
      {/* ... (Keep the gradients and the mapping exactly as they were) ... */}
      <div className="flex w-max animate-scroll">
        <div className="flex">
          {tickets.map((ticket) => (
            <TicketCard key={`first-${ticket.id}`} {...ticket} returnAmt={ticket.return_amount} />
          ))}
        </div>
        <div className="flex">
          {tickets.map((ticket) => (
            <TicketCard key={`second-${ticket.id}`} {...ticket} returnAmt={ticket.return_amount} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteTicker;
