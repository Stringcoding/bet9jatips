"use client";

import React, { useState } from "react";
import PremiumTipCard from "@/features/tips/components/PremiumTipCard";
import { Filter, SlidersHorizontal, Search, TrendingUp } from "lucide-react";

// Sample data to populate the portal
const mockTips = [
  { id: 1, user: "Mrgsports", odds: "62.84", date: "Today, 18:21", code: "62HXPN6", league: "EPL", matchesCount: 12, riskLevel: "Medium" as const },
  { id: 2, user: "iamjeffre_real", odds: "124.97", date: "Today, 18:16", code: "62HXFDL", league: "La Liga", matchesCount: 15, riskLevel: "High" as const },
  { id: 3, user: "SureBanker", odds: "14.50", date: "Today, 17:00", code: "99KLM2X", league: "Serie A", matchesCount: 4, riskLevel: "Low" as const },
  { id: 4, user: "OddsMaster", odds: "45.20", date: "Today, 15:30", code: "33ABCD9", league: "UCL", matchesCount: 8, riskLevel: "Medium" as const },
  { id: 5, user: "NaijaPunter", odds: "8.90", date: "Today, 14:10", code: "11XYZ77", league: "NPFL", matchesCount: 3, riskLevel: "Low" as const },
  { id: 6, user: "TheAnalyzer", odds: "210.50", date: "Today, 12:00", code: "88QWERT", league: "Mixed", matchesCount: 20, riskLevel: "High" as const },
];

const leages = ["All Leagues", "EPL", "La Liga", "Serie A", "UCL", "NPFL"];

export default function TipsPage() {
  const [activeLeague, setActiveLeague] = useState("All Leagues");

  return (
    <div className="min-h-screen bg-bg-deep pt-8 pb-20">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-white mb-2">
              Today's <span className="text-brand-green">Coupon Codes</span>
            </h1>
            <p className="text-text-muted text-sm sm:text-base">
              Hand-picked, professionally analyzed Bet9ja booking codes. Updated daily.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search tipster or code..." 
              className="w-full bg-bg-slate border border-gray-700/50 rounded-xl py-3 pl-10 pr-4 text-surface-white placeholder-text-muted focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
            />
            <Search className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar (Desktop Only) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-6">
          
          {/* Filter Menu */}
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

          {/* Quick Stats */}
          <div className="bg-bg-slate rounded-2xl p-5 border border-gray-800">
             <div className="flex items-center gap-2 mb-4 text-surface-white font-bold border-b border-gray-700/50 pb-3">
              <TrendingUp size={18} className="text-brand-yellow" /> Platform Stats
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-text-muted text-sm">Total Codes Today</span>
                <span className="text-surface-white font-bold">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted text-sm">Yesterday's Win Rate</span>
                <span className="text-brand-green font-bold">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted text-sm">Active Tipsters</span>
                <span className="text-surface-white font-bold">12</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Tips Grid Area */}
        <div className="flex-1">
          
          {/* Mobile Filter Bar */}
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            <button className="flex items-center gap-2 bg-bg-slate text-surface-white px-4 py-2 rounded-lg text-sm shrink-0 border border-gray-700">
              <SlidersHorizontal size={16} /> Filters
            </button>
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

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockTips.map((tip) => (
              <PremiumTipCard 
                key={tip.id}
                user={tip.user}
                odds={tip.odds}
                date={tip.date}
                code={tip.code}
                league={tip.league}
                matchesCount={tip.matchesCount}
                riskLevel={tip.riskLevel}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
