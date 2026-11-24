"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Copy, Lock } from "lucide-react";

// THIS INTERFACE FIXES THE ERROR
interface TipCardProps {
  user: string;
  odds: string;
  date: string;
  code: string;
  avatarUrl?: string;
  cardTitle?: string;
  isVerified?: boolean;
  isLocked?: boolean;
}

const TipCard: React.FC<TipCardProps> = ({
  user,
  odds,
  date,
  code,
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

  return (
    <div className="bg-bg-slate p-5 rounded-2xl w-full max-w-md border border-gray-700/50 shadow-lg hover:shadow-brand transition-all duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          
          {/* DYNAMIC IMAGE OR FALLBACK LETTER */}
          <div className="w-10 h-10 bg-bg-deep rounded-full flex items-center justify-center text-sm font-bold text-brand-green border border-gray-600 overflow-hidden relative">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={user} fill className="object-cover" />
            ) : (
              user.charAt(0).toUpperCase()
            )}
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

      {/* Booking Code Box */}
      <div className="bg-bg-deep border border-gray-700/50 rounded-xl p-4 flex justify-between items-center mb-4 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)]">
        <div>
          {/* DYNAMIC CARD TITLE */}
          <div className="text-xs text-text-muted mb-1">{cardTitle}</div>
          <div className="font-bold text-sm text-surface-white tracking-wider flex items-center gap-2">
            Booking Code:{" "}
            {isLocked ? (
              <span className="text-text-muted blur-[4px] select-none">●●●●●●</span>
            ) : (
              <span className="text-brand-yellow">{code}</span>
            )}
          </div>
        </div>
        
        <button
          onClick={handleCopy}
          disabled={isLocked}
          className={`p-2 rounded-lg transition-colors ${
            isLocked ? "bg-bg-slate text-gray-600 cursor-not-allowed" : "bg-bg-slate text-text-muted hover:text-brand-green"
          }`}
        >
          {isLocked ? <Lock size={18} /> : copied ? <CheckCircle2 size={18} className="text-brand-green" /> : <Copy size={18} />}
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {isLocked ? (
          <Link href="/gate" className="w-full text-center bg-brand-yellow hover:bg-yellow-500 text-bg-deep text-sm font-bold py-2.5 rounded-lg transition-colors">
            Unlock Code to View
          </Link>
        ) : (
          <>
            <button className="flex-1 bg-bg-deep hover:bg-gray-800 text-surface-white text-sm font-semibold py-2.5 rounded-lg transition-colors border border-gray-700/50">
              View Selections
            </button>
            <button className="flex-1 bg-brand-green hover:bg-brand-green-dark text-surface-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
              Add to betslip
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TipCard;
