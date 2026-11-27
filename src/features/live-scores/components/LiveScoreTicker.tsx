"use client";

import React, { useEffect, useState } from "react";
import { Radio, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

interface LiveMatch {
  id: number;
  name: string;
  state: string;
  minute: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  league: string;
}

export default function LiveScoreTicker() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live matches from our internal API route
  useEffect(() => {
    const fetchLiveScores = async () => {
      try {
        const res = await fetch("/api/live-scores");
        const data = await res.json();
        if (data.matches) {
          setMatches(data.matches);
        }
      } catch (error) {
        console.error("Failed to fetch live scores", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveScores();
    
    // Poll every 60 seconds for fresh live data
    const interval = setInterval(fetchLiveScores, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-bg-slate border-y border-gray-800 py-4 px-6 flex items-center justify-center">
        <span className="text-text-muted text-sm animate-pulse">Loading Live Matches...</span>
      </div>
    );
  }

  if (matches.length === 0) return null;

  return (
    <section className="w-full bg-bg-deep border-b border-gray-800 py-6">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-brand-red/10 border border-brand-red/20 px-2 py-1 rounded text-brand-red text-xs font-bold uppercase tracking-wider">
              <Radio size={14} className="animate-pulse" /> Live Now
            </div>
            <h2 className="text-lg font-bold text-surface-white">Football Scores</h2>
          </div>
          <Link href="/live-scores" className="text-sm text-brand-green hover:text-brand-green-dark font-medium flex items-center gap-1 transition-colors">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {matches.map((match) => (
            <div 
              key={match.id} 
              className="shrink-0 w-[280px] bg-bg-slate border border-gray-700/50 rounded-xl p-4 flex flex-col gap-3 shadow-lg hover:border-brand-green/50 transition-colors cursor-pointer group"
            >
              {/* League & Minute */}
              <div className="flex justify-between items-center text-xs text-text-muted border-b border-gray-700/50 pb-2">
                <span className="truncate max-w-[150px]">{match.league}</span>
                <span className="flex items-center gap-1 text-brand-yellow font-bold bg-brand-yellow/10 px-1.5 py-0.5 rounded">
                  <Clock size={12} /> {match.minute}'
                </span>
              </div>

              {/* Teams & Score */}
              <div className="flex flex-col gap-2 mt-1">
                {/* Home Team */}
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${match.homeScore > match.awayScore ? 'text-surface-white font-bold' : 'text-text-muted'}`}>
                    {match.homeTeam}
                  </span>
                  <span className={`text-lg font-black ${match.homeScore > match.awayScore ? 'text-brand-green' : 'text-surface-white'}`}>
                    {match.homeScore}
                  </span>
                </div>
                
                {/* Away Team */}
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${match.awayScore > match.homeScore ? 'text-surface-white font-bold' : 'text-text-muted'}`}>
                    {match.awayTeam}
                  </span>
                  <span className={`text-lg font-black ${match.awayScore > match.homeScore ? 'text-brand-green' : 'text-surface-white'}`}>
                    {match.awayScore}
                  </span>
                </div>
              </div>
              
              {/* Hover Action Indicator */}
              <div className="mt-2 w-full bg-bg-deep group-hover:bg-brand-green/10 text-center text-xs text-text-muted group-hover:text-brand-green py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                View Match <ChevronRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
