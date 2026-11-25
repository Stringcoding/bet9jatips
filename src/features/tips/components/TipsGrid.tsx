"use client";

import React, { useState } from "react";
import PremiumTipCard from "./PremiumTipCard";
import { Filter, Search, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const leages = ["All Leagues", "EPL", "La Liga", "Serie A", "UCL", "NPFL", "Mixed"];

interface TipsGridProps {
  initialTips: any[];
  hasAccess: boolean;
  currentPage: number;
  totalPages: number;
}

export default function TipsGrid({ initialTips, hasAccess, currentPage, totalPages }: TipsGridProps) {
  const [activeLeague, setActiveLeague] = useState("All Leagues");
  const [search, setSearch] = useState("");
  
  const searchParams = useSearchParams();
  const isReviewing = searchParams.get("reviewing") === "true";
  const forceLock = isReviewing ? true : !hasAccess;

  const filteredTips = initialTips.filter(tip => {
    const matchesLeague = activeLeague === "All Leagues" || tip.league === activeLeague;
    const matchesSearch = tip.punter_name.toLowerCase().includes(search.toLowerCase()) || 
                          tip.booking_code.toLowerCase().includes(search.toLowerCase());
    return matchesLeague && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8">
      
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-6">
        <div className="bg-bg-slate rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center gap-2 mb-4 text-surface-white font-bold border-b border-gray-700/50 pb-3">
            <Filter size={18} className="text-brand-green" /> Filter Tips
          </div>
          <div className="flex flex-col gap-2">
            {leages.map((league) => (
              <button
                key={league}
                onClick={() => setActiveLeague(league)}
                className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeLeague === league 
                  ? "bg-brand-green/10 text-brand-green border border-brand-green/30" 
                  : "text-text-muted hover:bg-bg-deep hover:text-surface-white"
                }`}
              >
                {league}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-bg-slate rounded-2xl p-5 border border-gray-800">
           <div className="flex items-center gap-2 mb-4 text-surface-white font-bold border-b border-gray-700/50 pb-3">
            <TrendingUp size={18} className="text-brand-yellow" /> Platform Stats
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-text-muted text-sm">Active Tips</span>
              <span className="text-surface-white font-bold">{initialTips.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted text-sm">Win Rate</span>
              <span className="text-brand-green font-bold">87%</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Grid */}
      <div className="flex-1">
        
        {/* Mobile Filters */}
        <div className="lg:hidden flex flex-col gap-4 mb-6">
           <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search tipster or code..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg-slate border border-gray-700/50 rounded-xl py-3 pl-10 pr-4 text-surface-white placeholder-text-muted focus:outline-none focus:border-brand-green"
            />
            <Search className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {leages.map((league) => (
              <button
                key={league}
                className={`px-4 py-2 rounded-lg text-sm shrink-0 border transition-colors ${
                  activeLeague === league 
                  ? "bg-brand-green text-surface-white border-brand-green" 
                  : "bg-bg-slate text-text-muted border-gray-700/50"
                }`}
                onClick={() => setActiveLeague(league)}
              >
                {league}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:block relative w-72 mb-6 float-right">
          <input 
            type="text" 
            placeholder="Search tipster or code..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-slate border border-gray-700/50 rounded-xl py-3 pl-10 pr-4 text-surface-white placeholder-text-muted focus:outline-none focus:border-brand-green"
          />
          <Search className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
        </div>

        <div className="clear-both"></div>

        {/* The Grid */}
        {filteredTips.length === 0 ? (
          <div className="text-center text-text-muted py-12">No tips found on this page matching your filters.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredTips.map((tip) => (
              <PremiumTipCard 
                key={tip.id}
                user={tip.punter_name}
                odds={tip.total_odds.toString()}
                date={new Date(tip.created_at).toLocaleDateString()}
                code={tip.booking_code}
                league={tip.league}
                matchesCount={tip.matches_count}
                riskLevel={tip.risk_level}
                avatarUrl={tip.punter_avatar_url}
                cardTitle={tip.card_title}
                isLocked={forceLock} 
              />
            ))}
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && !search && activeLeague === "All Leagues" && (
          <div className="flex items-center justify-between border-t border-gray-800 pt-6">
            <Link
              href={`/tips?page=${currentPage - 1}${isReviewing ? '&reviewing=true' : ''}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                currentPage <= 1 
                  ? "bg-bg-slate text-gray-600 pointer-events-none opacity-50" 
                  : "bg-bg-slate text-surface-white hover:bg-gray-700"
              }`}
            >
              <ChevronLeft size={16} /> Previous
            </Link>

            <div className="text-text-muted text-sm font-medium">
              Page <span className="text-surface-white font-bold">{currentPage}</span> of {totalPages}
            </div>

            <Link
              href={`/tips?page=${currentPage + 1}${isReviewing ? '&reviewing=true' : ''}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                currentPage >= totalPages 
                  ? "bg-bg-slate text-gray-600 pointer-events-none opacity-50" 
                  : "bg-brand-green text-surface-white hover:bg-brand-green-dark"
              }`}
            >
              Next <ChevronRight size={16} />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
