"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Copy, Share2, ShieldAlert, BarChart3, Clock, Lock } from "lucide-react";

interface PremiumTipCardProps {
  user: string;
  odds: string;
  date: string;
  code: string;
  league?: string;
  matchesCount?: number;
  riskLevel?: "Low" | "Medium" | "High";
  avatarUrl?: string;   // <-- Added for dynamic image
  cardTitle?: string;   // <-- Added for dynamic subtitle
  isVerified?: boolean;
  isLocked?: boolean;   // <-- Added for the gate locking
}

const PremiumTipCard: React.FC<PremiumTipCardProps> = ({
  user,
  odds,
  date,
  code,
  league = "Mixed",
  matchesCount = 1,
  riskLevel = "Medium",
  avatarUrl,
  cardTitle = "Multiple",
  isVerified = true,
  isLocked = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (isLocked) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color mapping for risk levels
  const riskColor =
    riskLevel === "Low"
      ? "text-brand-green bg-brand-green/10 border-brand-green/20"
      : riskLevel === "Medium"
      ? "text-brand-yellow bg-brand-yellow/10 border-brand-yellow/20"
      : "text-brand-red bg-brand-red/10 border-brand-red/20";

  return (
    <div className="bg-bg-slate rounded-2xl p-1 w-full relative group transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,157,72,0.15)]">
      {/* Outer Glow Border */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Inner Content Box */}
      <div className="bg-bg-deep rounded-xl p-5 relative z-10 border border-gray-800 flex flex-col h-full">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            
            {/* DYNAMIC AVATAR */}
            <div className="w-12 h-12 bg-bg-slate rounded-full flex items-center justify-center text-lg font-bold text-brand-green border-2 border-brand-green/30 overflow-hidden relative shrink-0">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={user} fill className="object-cover" />
              ) : (
                user.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <div className="flex items-center gap-1 text-base font-bold text-surface-white">
                {user}
                {isVerified && <CheckCircle2 size={16} className="text-brand-green" />}
              </div>
              <div className="text-xs text-text-muted flex items-center gap-1 mt-1">
                <Clock size={12} /> {date}
              </div>
            </div>
          </div>
          
          {/* League Badge */}
          <div className="bg-bg-slate text-text-muted text-xs font-semibold px-3 py-1.5 rounded-md border border-gray-700/50">
            {league}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-bg-slate rounded-lg p-2 text-center border border-gray-800">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Total Odds</p>
            <p className="text-xl font-black text-brand-green">{odds}</p>
          </div>
          <div className="bg-bg-slate rounded-lg p-2 text-center border border-gray-800">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Matches</p>
            <p className="text-xl font-bold text-surface-white flex items-center justify-center gap-1">
              <BarChart3 size={16} className="text-text-muted" /> {matchesCount}
            </p>
          </div>
          <div className={`rounded-lg p-2 text-center border flex flex-col justify-center items-center ${riskColor}`}>
            <p className="text-[10px] uppercase tracking-wider mb-1 opacity-80">Risk</p>
            <p className="text-sm font-bold flex items-center gap-1">
              <ShieldAlert size={14} /> {riskLevel}
            </p>
          </div>
        </div>

        {/* Booking Code Area - Premium Look */}
        <div 
          onClick={handleCopy}
          className={`relative overflow-hidden bg-bg-slate border border-gray-700/50 rounded-xl p-4 flex justify-between items-center transition-all ${isLocked ? "cursor-not-allowed" : "group/code cursor-pointer hover:bg-gray-800"}`}
        >
          {/* Subtle moving gradient background on hover */}
          {!isLocked && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-green/10 to-transparent -translate-x-full group-hover/code:translate-x-full transition-transform duration-1000" />
          )}
          
          <div>
            <div className="text-xs text-text-muted mb-1">{cardTitle}</div>
            <div className="font-mono font-bold text-xl tracking-widest flex items-center gap-2">
              {isLocked ? (
                <span className="text-text-muted blur-[4px] select-none">●●●●●●</span>
              ) : (
                <span className="text-brand-yellow">{code}</span>
              )}
            </div>
          </div>
          <button className={`p-3 rounded-lg transition-colors ${
            isLocked 
              ? "bg-bg-deep text-gray-600" 
              : copied 
                ? "bg-brand-green text-white" 
                : "bg-bg-deep text-text-muted hover:text-brand-green"
          }`}>
            {isLocked ? <Lock size={20} /> : copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-auto pt-4">
          {isLocked ? (
            <Link 
              href="/gate" 
              className="w-full text-center bg-brand-yellow hover:bg-yellow-500 text-bg-deep text-sm font-bold py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(253,185,19,0.3)]"
            >
              Unlock Code to View
            </Link>
          ) : (
            <>
              <button className="flex-1 bg-bg-slate hover:bg-gray-700 text-surface-white text-sm font-bold py-3 rounded-lg transition-colors border border-gray-700/50 flex items-center justify-center gap-2">
                <Share2 size={16} /> Share
              </button>
              <button className="flex-[2] bg-brand-green hover:bg-brand-green-dark text-surface-white text-sm font-bold py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(42,157,72,0.3)]">
                View Full Slip
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default PremiumTipCard;
