import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Clock, Shield } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MatchDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const matchId = resolvedParams.slug;
  const supabase = await createClient();

  const { data: match } = await supabase
    .from("live_scores")
    .select("*")
    .eq("id", matchId)
    .single();

  if (!match) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg-deep pt-8 pb-20 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
        
        <Link 
          href="/live-scores" 
          className="inline-flex items-center gap-2 text-text-muted hover:text-surface-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Live Center
        </Link>

        <div className="bg-bg-slate rounded-3xl border border-gray-800 overflow-hidden shadow-2xl relative">
          
          {/* Top League Banner */}
          <div className="bg-bg-deep px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <span className="text-brand-green font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              <Shield size={16} /> {match.league}
            </span>
            <div className="flex items-center gap-1.5 text-brand-red bg-brand-red/10 px-3 py-1 rounded-full text-xs font-bold border border-brand-red/20">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" /> LIVE
            </div>
          </div>

          {/* Scoreboard */}
          <div className="p-8 sm:p-12 flex flex-col items-center">
            
            <div className="text-text-muted font-medium mb-6 flex items-center gap-2">
              <Clock size={16} /> {match.minute === "FT" ? "Full Time" : `Minute ${match.minute}`}
            </div>

            <div className="w-full flex items-center justify-between gap-4 sm:gap-8">
              
              {/* Home */}
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-bg-deep rounded-full flex items-center justify-center border-4 border-gray-700 mb-4 shadow-lg">
                  <span className="text-2xl font-black text-gray-400">{match.home_team.charAt(0)}</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-surface-white">{match.home_team}</h2>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="text-5xl sm:text-7xl font-black text-surface-white flex items-center gap-4">
                  <span className={match.home_score > match.away_score ? 'text-brand-green' : ''}>{match.home_score}</span>
                  <span className="text-gray-600 text-3xl sm:text-5xl">:</span>
                  <span className={match.away_score > match.home_score ? 'text-brand-green' : ''}>{match.away_score}</span>
                </div>
              </div>

              {/* Away */}
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-bg-deep rounded-full flex items-center justify-center border-4 border-gray-700 mb-4 shadow-lg">
                  <span className="text-2xl font-black text-gray-400">{match.away_team.charAt(0)}</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-surface-white">{match.away_team}</h2>
              </div>

            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-bg-deep/50 p-6 text-center border-t border-gray-800">
            <p className="text-sm text-text-muted">
              Data refreshes automatically. Powered by{" "}
              <a href="https://sportscore.com/" rel="dofollow" className="text-brand-green hover:underline">
                SportScore
              </a>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
