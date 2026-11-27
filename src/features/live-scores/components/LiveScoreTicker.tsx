"use client";

import React, { useEffect, useState } from "react";
import { Radio, Clock, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface LiveMatch {
  id: string;
  league: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  minute: string;
  status: string;
}

export default function LiveScoreTicker() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchScores = async () => {
      const { data } = await supabase
        .from("live_scores")
        .select("*")
        .order("updated_at", { ascending: false });
      
      if (data) setMatches(data);
      setLoading(false);
    };

    fetchScores();

    // Realtime subscription to update scores instantly without refresh
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
      <div className="w-full bg-bg-deep border-y border-gray-800 py-6 px-6 flex items-center justify-center">
        <span className="text-text-muted text-sm animate-pulse flex items-center gap-2">
           <Radio size={16} className="text-brand-red" /> Syncing Live Scores...
        </span>
      </div>
    );
  }

  // If no matches are found, hide the section to keep the page clean
  if (matches.length === 0) return null;

  return (
    <section className="w-full bg-bg-deep border-y border-gray-800 py-6 relative overflow-hidden">
      
      {/* Subtle Green Glow Background */}
      <div className="absolute top-0 left-0 w-64 h-full bg-brand-green/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-brand-red/10 border border-brand-red/20 px-2 py-1 rounded text-brand-red text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(227,30,36,0.2)]">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" /> 
              Live
            </div>
            <h2 className="text-lg font-bold text-surface-white hidden sm:block">Football Scores</h2>
          </div>
          
          {/* View All Button */}
          <Link 
            href="/live-scores" 
            className="flex items-center gap-1 text-sm font-bold text-brand-green hover:text-white transition-colors bg-brand-green/10 hover:bg-brand-green px-3 py-1.5 rounded-lg border border-brand-green/20"
          >
            Check Live Score <ChevronRight size={16} />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {matches.map((match) => (
            <Link 
              href={`/live-scores/${match.id}`}
              key={match.id} 
              className="shrink-0 w-[280px] bg-bg-slate border border-gray-700/50 rounded-xl p-4 flex flex-col gap-3 shadow-lg hover:border-brand-green/50 hover:shadow-brand transition-all cursor-pointer group"
            >
              {/* League & Minute */}
              <div className="flex justify-between items-center text-xs text-text-muted border-b border-gray-700/50 pb-2">
                <span className="truncate max-w-[150px]">{match.league}</span>
                <span className={`flex items-center gap-1 font-bold px-1.5 py-0.5 rounded ${
                  match.minute === "FT" 
                    ? "text-gray-400 bg-gray-800" 
                    : "text-brand-yellow bg-brand-yellow/10"
                }`}>
                  <Clock size={12} /> {match.minute}
                </span>
              </div>

              {/* Teams & Score */}
              <div className="flex flex-col gap-2 mt-1">
                {/* Home Team */}
                <div className="flex justify-between items-center">
                  <span className={`text-sm truncate pr-2 ${match.home_score > match.away_score ? 'text-surface-white font-bold' : 'text-text-muted'}`}>
                    {match.home_team}
                  </span>
                  <span className={`text-lg font-black ${match.home_score > match.away_score ? 'text-brand-green' : 'text-surface-white'}`}>
                    {match.home_score}
                  </span>
                </div>
                
                {/* Away Team */}
                <div className="flex justify-between items-center">
                  <span className={`text-sm truncate pr-2 ${match.away_score > match.home_score ? 'text-surface-white font-bold' : 'text-text-muted'}`}>
                    {match.away_team}
                  </span>
                  <span className={`text-lg font-black ${match.away_score > match.home_score ? 'text-brand-green' : 'text-surface-white'}`}>
                    {match.away_score}
                  </span>
                </div>
              </div>
              
              {/* Action Indicator */}
              <div className="mt-2 w-full bg-bg-deep group-hover:bg-brand-green/10 text-center text-[10px] text-text-muted group-hover:text-brand-green py-1.5 rounded transition-colors uppercase font-bold tracking-wider">
                Match Details
              </div>
            </Link>
          ))}
        </div>

        {/* SportScore Attribution (Required) */}
        <div className="mt-3 text-right">
          <a 
            href="https://sportscore.com/" 
            rel="dofollow" 
            target="_blank"
            className="text-[10px] text-text-muted/50 hover:text-surface-white transition-colors"
          >
            Data by SportScore
          </a>
        </div>

      </div>
    </section>
  );
}
