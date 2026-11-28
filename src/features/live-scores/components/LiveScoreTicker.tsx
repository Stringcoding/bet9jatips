"use client";

import React, { useEffect, useState } from "react";
import { Radio, Clock, ChevronRight, Flame } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface LiveMatch {
  id: string;
  league: string;
  home_team: string;
  away_team: string;
  home_logo: string | null;
  away_logo: string | null;
  home_score: number;
  away_score: number;
  minute: string;
  status: string;
}

export default function LiveScoreTicker() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchScores = async () => {
      const { data } = await supabase
        .from("live_scores")
        .select("*")
        .order("updated_at", { ascending: false });

      if (data) setMatches(data);
      setLoading(false);
    };

    fetchScores();

    // Realtime subscription to update scores instantly
    const channel = supabase
      .channel("live-score-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_scores" },
        () => {
          fetchScores();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#0B0E11] border-y border-white/10 py-5 px-4 sm:px-6 flex items-center justify-center">
        <div className="flex items-center gap-2 bg-[#161B22] border border-white/10 px-4 py-2 rounded-lg">
          <Radio size={15} className="text-[#00E676] animate-pulse" />
          <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">
            Syncing Live Odds &amp; Scores...
          </span>
        </div>
      </div>
    );
  }

  // If no matches are found, hide the section to keep the page clean
  if (matches.length === 0) return null;

  return (
    <section className="w-full bg-[#0B0E11] border-y border-white/10 py-5 sm:py-6 relative overflow-hidden selection:bg-[#00A859] selection:text-white">
      {/* Subtle Sportsbook Green Ambient Glow */}
      <div className="absolute -top-10 left-1/4 w-72 h-40 bg-[#00A859]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 relative z-10">
        {/* Top Ticker Header */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center gap-1.5 bg-[#00A859]/20 border border-[#00A859]/40 px-2.5 py-1 rounded text-[#00E676] text-[11px] font-black uppercase tracking-wider shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping" />
              In-Play
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              <Flame size={15} className="text-[#FBBF24] shrink-0 hidden xs:block" />
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight truncate">
                Live Football Scores
              </h2>
            </div>

            <span className="hidden md:inline-flex items-center text-[11px] font-bold text-gray-400 bg-[#161B22] border border-white/10 px-2 py-0.5 rounded tabular-nums">
              {matches.length} {matches.length === 1 ? "Match" : "Matches"}
            </span>
          </div>

          {/* View All CTA Button */}
          <Link
            href="/live-scores"
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0B0E11] bg-[#00A859] hover:bg-[#00C86B] active:scale-[0.98] transition-all px-3 py-1.5 rounded-lg shrink-0 shadow-md"
          >
            <span>All Live</span>
            <ChevronRight size={15} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Horizontal Scrollable Sportsbook Card Strip */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {matches.map((match) => {
            const isFinished = match.minute === "FT";
            const isHalfTime = match.minute === "HT";
            const isLive = !isFinished && !isHalfTime;
            const homeWinning = match.home_score > match.away_score;
            const awayWinning = match.away_score > match.home_score;

            return (
              <Link
                href={`/live-scores/${match.id}`}
                key={match.id}
                className="snap-start shrink-0 w-[265px] sm:w-[295px] bg-[#161B22] border border-white/10 hover:border-[#00A859]/60 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between gap-3 shadow-xl hover:bg-[#192029] transition-all group"
              >
                {/* League & Match Clock Bar */}
                <div className="flex justify-between items-center gap-2 text-[11px] border-b border-white/[0.06] pb-2">
                  <span className="text-gray-400 font-bold uppercase tracking-wide truncate">
                    {match.league}
                  </span>

                  <span
                    className={`flex items-center gap-1 font-extrabold px-2 py-0.5 rounded text-[10px] shrink-0 tabular-nums ${
                      isLive
                        ? "text-[#00E676] bg-[#00A859]/15 border border-[#00A859]/30"
                        : isHalfTime
                        ? "text-[#FBBF24] bg-[#FBBF24]/15 border border-[#FBBF24]/30"
                        : "text-gray-400 bg-white/5 border border-white/10"
                    }`}
                  >
                    <Clock size={11} />
                    {isLive ? `${match.minute}'` : match.minute}
                  </span>
                </div>

                {/* Teams & Scoreboard Rows */}
                <div className="flex flex-col gap-2">
                  {/* Home Team Row */}
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#0B0E11] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 p-0.5">
                        {match.home_logo ? (
                          <img
                            src={match.home_logo}
                            alt={match.home_team}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] font-black text-[#00A859]">
                            {match.home_team.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs sm:text-sm truncate ${
                          homeWinning
                            ? "text-white font-extrabold"
                            : "text-gray-300 font-medium"
                        }`}
                      >
                        {match.home_team}
                      </span>
                    </div>

                    <span
                      className={`text-base sm:text-lg font-black tabular-nums px-1.5 rounded ${
                        homeWinning
                          ? "text-[#00E676] bg-[#00A859]/10"
                          : "text-white"
                      }`}
                    >
                      {match.home_score}
                    </span>
                  </div>

                  {/* Away Team Row */}
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#0B0E11] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 p-0.5">
                        {match.away_logo ? (
                          <img
                            src={match.away_logo}
                            alt={match.away_team}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] font-black text-[#FBBF24]">
                            {match.away_team.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs sm:text-sm truncate ${
                          awayWinning
                            ? "text-white font-extrabold"
                            : "text-gray-300 font-medium"
                        }`}
                      >
                        {match.away_team}
                      </span>
                    </div>

                    <span
                      className={`text-base sm:text-lg font-black tabular-nums px-1.5 rounded ${
                        awayWinning
                          ? "text-[#FBBF24] bg-[#FBBF24]/10"
                          : "text-white"
                      }`}
                    >
                      {match.away_score}
                    </span>
                  </div>
                </div>

                {/* Sportsbook Footer Action Bar */}
                <div className="pt-1 flex items-center justify-between bg-[#0B0E11] group-hover:bg-[#00A859]/15 border border-white/[0.06] group-hover:border-[#00A859]/30 px-3 py-1.5 rounded-lg transition-colors">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 group-hover:text-[#00E676] transition-colors">
                    Match Stats
                  </span>
                  <ChevronRight
                    size={13}
                    className="text-gray-500 group-hover:text-[#00E676] group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* SportScore Attribution (Required) */}
        <div className="mt-2.5 flex justify-end">
          <a
            href="https://sportscore.com/"
            rel="dofollow"
            target="_blank"
            className="text-[10px] text-gray-500 hover:text-[#00E676] transition-colors"
          >
            Data by SportScore
          </a>
        </div>
      </div>
    </section>
  );
}
