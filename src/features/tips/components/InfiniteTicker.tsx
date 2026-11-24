"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Trophy,
  TrendingUp,
  Ticket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

interface WinningTicket {
  id: string;
  odds: number;
  stake: number;
  return_amount: number;
  booking_code: string;
  time: string;
  created_at?: string;
}

interface TicketCardProps {
  odds: number;
  stake: number;
  returnAmt: number;
  time: string;
  code: string;
  createdAt?: string;
}

const formatCurrency = (amount: number) =>
  `₦${Number(amount || 0).toLocaleString("en-NG")}`;

const formatDate = (date?: string) => {
  if (!date) return "Recently";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Recently";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TicketCard = ({
  odds,
  stake,
  returnAmt,
  time,
  code,
  createdAt,
}: TicketCardProps) => {
  return (
    <article className="group relative shrink-0 w-[290px] sm:w-[330px] mx-3">

      {/* Ambient Glow */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-brand-green/50 via-transparent to-brand-yellow/20 opacity-50 blur-sm transition-opacity duration-500 group-hover:opacity-100" />

      {/* Main Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#101610] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-brand-green/40">

        {/* Top Accent */}
        <div className="h-[3px] w-full bg-gradient-to-r from-brand-green/20 via-brand-green to-brand-yellow/60" />

        {/* Decorative Background */}
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-green/[0.07] blur-3xl pointer-events-none" />

        <div className="relative p-4 sm:p-5">

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">

            <div className="flex items-center gap-2.5">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green/10 border border-brand-green/20">
                <Trophy className="h-[17px] w-[17px] text-brand-green" />
              </div>

              <div>
                <p className="text-surface-white text-sm font-bold tracking-tight">
                  Winning Ticket
                </p>

                <p className="text-[10px] text-text-muted">
                  Verified winning slip
                </p>
              </div>

            </div>

            {/* WON Badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-brand-green/25 bg-brand-green/10 px-3 py-1.5">

              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-green" />
              </span>

              <span className="text-[10px] font-black tracking-widest text-brand-green">
                WON
              </span>

            </div>
          </div>

          {/* Odds Section */}
          <div className="flex items-end justify-between py-5">

            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-brand-green" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                  Total Odds
                </span>
              </div>

              <p className="text-3xl sm:text-4xl font-black tracking-tight text-surface-white">
                {Number(odds).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
                <span className="text-brand-green">x</span>
              </p>
            </div>

            {/* Trophy Decoration */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-yellow/15 bg-brand-yellow/[0.06]">

              <div className="absolute inset-0 rounded-2xl bg-brand-yellow/5 blur-lg" />

              <Trophy className="relative h-7 w-7 text-brand-yellow drop-shadow-[0_0_8px_rgba(250,204,21,0.25)]" />

              <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-brand-yellow" />

            </div>

          </div>

          {/* Financial Details */}
          <div className="grid grid-cols-2 gap-3">

            {/* Stake */}
            <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">

              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted">
                Total Stake
              </p>

              <p className="text-sm font-bold text-surface-white">
                {formatCurrency(stake)}
              </p>

            </div>

            {/* Return */}
            <div className="relative overflow-hidden rounded-xl border border-brand-green/20 bg-brand-green/[0.07] p-3">

              <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-brand-green/10 blur-xl" />

              <p className="relative mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-brand-green/80">
                Total Return
              </p>

              <p className="relative text-sm font-extrabold text-brand-green">
                {formatCurrency(returnAmt)}
              </p>

            </div>

          </div>

          {/* Bet ID */}
          <div className="mt-3 rounded-xl border border-brand-yellow/15 bg-brand-yellow/[0.035] p-3">

            <div className="flex items-center justify-between mb-1.5">

              <div className="flex items-center gap-1.5">
                <Ticket className="h-3 w-3 text-brand-yellow" />

                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted">
                  Bet Identification
                </span>
              </div>

              <span className="text-[9px] font-semibold text-brand-green">
                VERIFIED
              </span>

            </div>

            <p className="break-all font-mono text-[11px] sm:text-xs font-bold tracking-wide text-brand-yellow">
              {code}
            </p>

          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-green/10 border border-brand-green/20">
                <ShieldCheck className="h-4 w-4 text-brand-green" />
              </div>

              <div>
                <p className="text-[10px] font-bold text-surface-white">
                  Successfully Settled
                </p>

                <p className="text-[9px] text-text-muted">
                  {formatDate(createdAt)} • {time}
                </p>
              </div>

            </div>

            <CheckCircle2 className="h-4 w-4 text-brand-green" />

          </div>

        </div>

      </div>

    </article>
  );
};

const InfiniteTicker = () => {
  const [tickets, setTickets] = useState<WinningTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let mounted = true;

    const fetchTickets = async () => {
      try {
        const { data, error } = await supabase
          .from("winning_tickets")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Failed to fetch winning tickets:", error.message);
          return;
        }

        if (mounted && data) {
          setTickets(data as WinningTicket[]);
        }

      } catch (error) {
        console.error("Winning tickets error:", error);

      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTickets();

    return () => {
      mounted = false;
    };

  }, [supabase]);

  if (loading || tickets.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden py-8 sm:py-10">

      {/* Section Header */}
      <div className="mx-auto mb-7 max-w-7xl px-5">

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-green/20 bg-brand-green/10">
              <Trophy className="h-5 w-5 text-brand-green" />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-surface-white">
                Recent Winners
              </h2>

              <p className="text-[10px] sm:text-xs text-text-muted">
                Real winning tickets from our community
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/[0.06] px-3 py-1.5">

            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-green" />
            </span>

            <span className="text-[9px] font-bold uppercase tracking-widest text-brand-green">
              Latest Wins
            </span>

          </div>

        </div>

      </div>

      {/* Scrolling Track */}
      <div className="relative w-full overflow-hidden">

        {/* Left Fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-32 bg-gradient-to-r from-bg-deep via-bg-deep/80 to-transparent" />

        {/* Right Fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-32 bg-gradient-to-l from-bg-deep via-bg-deep/80 to-transparent" />

        <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">

          {/* First Set */}
          <div className="flex shrink-0">
            {tickets.map((ticket) => (
              <TicketCard
                key={`first-${ticket.id}`}
                odds={ticket.odds}
                stake={ticket.stake}
                returnAmt={ticket.return_amount}
                time={ticket.time}
                code={ticket.booking_code}
                createdAt={ticket.created_at}
              />
            ))}
          </div>

          {/* Duplicate Set For Infinite Loop */}
          <div className="flex shrink-0" aria-hidden="true">
            {tickets.map((ticket) => (
              <TicketCard
                key={`second-${ticket.id}`}
                odds={ticket.odds}
                stake={ticket.stake}
                returnAmt={ticket.return_amount}
                time={ticket.time}
                code={ticket.booking_code}
                createdAt={ticket.created_at}
              />
            ))}
          </div>

        </div>

      </div>

    </section>
  );
};

export default InfiniteTicker;
