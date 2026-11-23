"use client";

import React from "react";
import { CheckCircle2, Copy, Share2 } from "lucide-react";

interface TipCardProps {
  user: string;
  odds: string;
  date: string;
  code: string;
  isVerified?: boolean;
}

const TipCard: React.FC<TipCardProps> = ({ user, odds, date, code, isVerified = true }) => {
  return (
    <div className="bg-bg-slate p-5 rounded-2xl w-full max-w-md border border-gray-700/50 shadow-lg hover:shadow-brand transition-all duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar Placeholder */}
          <div className="w-10 h-10 bg-bg-deep rounded-full flex items-center justify-center text-sm font-bold text-brand-green border border-gray-600">
             {user.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1 text-sm font-bold text-surface-white">
              {user} 
              {isVerified && <CheckCircle2 size={16} className="text-brand-green" />}
            </div>
            <div className="text-xs text-text-muted">{date}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-text-muted">Initial Odds</div>
          <div className="text-xl font-extrabold text-brand-green">{odds}</div>
        </div>
      </div>

      {/* Booking Code Box - Neumorphic inner shadow */}
      <div className="bg-bg-deep border border-gray-700/50 rounded-xl p-4 flex justify-between items-center mb-4 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)]">
        <div>
          <div className="text-xs text-text-muted mb-1">Multiple</div>
          <div className="font-bold text-sm text-surface-white tracking-wider">
            Booking Code: <span className="text-brand-yellow">{code}</span>
          </div>
        </div>
        <button className="text-text-muted hover:text-brand-green transition-colors p-2 bg-bg-slate rounded-lg">
          <Copy size={18} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 bg-bg-deep hover:bg-gray-800 text-surface-white text-sm font-semibold py-2.5 rounded-lg transition-colors border border-gray-700/50">
          View Selections
        </button>
        <button className="flex-1 bg-brand-green hover:bg-brand-green-dark text-surface-white text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-[0_0_10px_rgba(42,157,72,0.3)]">
          Add to betslip
        </button>
      </div>

    </div>
  );
};

export default TipCard;
