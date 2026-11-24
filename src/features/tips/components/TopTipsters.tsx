"use client";

import React from "react";
import { ShieldCheck, TrendingUp, Medal } from "lucide-react";

const tipsters = [
  { id: 1, name: "Mrgsports", winRate: "92%", totalOdds: "62.84", rank: 1 },
  { id: 2, name: "iamjeffre_real", winRate: "88%", totalOdds: "124.97", rank: 2 },
  { id: 3, name: "SureBanker", winRate: "85%", totalOdds: "14.50", rank: 3 },
  { id: 4, name: "OddsMaster", winRate: "81%", totalOdds: "45.20", rank: 4 },
];

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1: return "bg-brand-yellow/20 text-brand-yellow border-brand-yellow/50 shadow-[0_0_15px_rgba(253,185,19,0.2)]";
    case 2: return "bg-gray-300/20 text-gray-300 border-gray-300/50";
    case 3: return "bg-orange-500/20 text-orange-400 border-orange-500/50";
    default: return "bg-bg-slate text-text-muted border-gray-700";
  }
};

const TopTipsters = () => {
  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Medal className="w-8 h-8 text-brand-yellow" />
        <h2 className="text-3xl font-extrabold text-surface-white">Top Tipsters</h2>
      </div>

      <div className="bg-bg-slate rounded-2xl p-2 sm:p-6 shadow-2xl border border-gray-700/50">
        {/* Header (Hidden on Mobile) */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider border-b border-gray-700/50">
          <div className="col-span-2">Rank</div>
          <div className="col-span-5">Tipster</div>
          <div className="col-span-2 text-center">Win Rate</div>
          <div className="col-span-3 text-right">Total Odds</div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2 mt-2">
          {tipsters.map((tipster) => (
            <div
              key={tipster.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center px-4 sm:px-6 py-4 rounded-xl hover:bg-bg-deep transition-colors duration-200 group"
            >
              
              {/* Rank Badge */}
              <div className="col-span-2 flex items-center justify-between sm:justify-start">
                <span className="sm:hidden text-xs text-text-muted font-bold uppercase">Rank</span>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold border ${getRankStyle(tipster.rank)}`}>
                  #{tipster.rank}
                </div>
              </div>

              {/* Tipster Info */}
              <div className="col-span-5 flex items-center justify-between sm:justify-start gap-3 w-full">
                 <span className="sm:hidden text-xs text-text-muted font-bold uppercase">Tipster</span>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg-deep flex items-center justify-center text-brand-green font-bold border border-gray-700">
                      {tipster.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-surface-white">{tipster.name}</span>
                      <ShieldCheck className="w-4 h-4 text-brand-green" />
                    </div>
                 </div>
              </div>

              {/* Win Rate */}
              <div className="col-span-2 flex items-center justify-between sm:justify-center">
                 <span className="sm:hidden text-xs text-text-muted font-bold uppercase">Win Rate</span>
                 <div className="flex items-center gap-1 text-brand-green font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    {tipster.winRate}
                 </div>
              </div>

              {/* Total Odds */}
              <div className="col-span-3 flex items-center justify-between sm:justify-end">
                 <span className="sm:hidden text-xs text-text-muted font-bold uppercase">Total Odds</span>
                 <span className="font-extrabold text-lg text-surface-white group-hover:text-brand-yellow transition-colors">
                    {tipster.totalOdds}
                 </span>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopTipsters;
