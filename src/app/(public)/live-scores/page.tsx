import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Radio, ChevronRight, Activity, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LiveScoresPage() {
  const supabase = await createClient();
  
  // Fetch all matches ordered by league then date
  const { data: matches } = await supabase
    .from("live_scores")
    .select("*")
    .order("league", { ascending: true })
    .order("updated_at", { ascending: false });

  // Group matches by league
  const groupedMatches = (matches || []).reduce((acc: any, match: any) => {
    if (!acc[match.league]) {
      acc[match.league] = [];
    }
    acc[match.league].push(match);
    return acc;
  }, {});

  const leagues = Object.keys(groupedMatches).sort();

  return (
    <div className="min-h-screen bg-bg-deep pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-white flex items-center gap-3">
              <Activity className="text-brand-green w-8 h-8" />
              Live Center
            </h1>
            <p className="text-text-muted text-sm sm:text-base mt-2">
              Real-time football scores, updated instantly.
            </p>
          </div>
          
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-surface-white bg-bg-slate hover:bg-gray-700 border border-gray-700/50 px-3 py-1.5 rounded-lg transition-all"
          >
            <ArrowLeft size={14} className="text-brand-green" />
            Back to Home
          </Link>
        </div>

        {/* Matches Container */}
        {leagues.length === 0 ? (
          <div className="text-center py-20 bg-bg-slate rounded-2xl border border-gray-800">
            <Radio className="w-12 h-12 text-text-muted mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-surface-white mb-2">No matches right now</h2>
            <p className="text-text-muted text-sm">Check back later when games are live.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {leagues.map((league) => (
              <div key={league} className="bg-bg-slate rounded-2xl border border-gray-700/50 overflow-hidden shadow-xl">
                
                {/* League Header */}
                <div className="bg-bg-slate bg-gradient-to-r from-bg-deep/50 to-bg-slate px-4 py-3 border-b border-gray-700/50 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-surface-white flex items-center gap-2 uppercase tracking-wider">
                    <span className="w-1 h-4 bg-brand-green rounded-full"></span>
                    {league}
                  </h2>
                  <span className="text-[10px] font-bold text-text-muted bg-bg-deep px-2 py-0.5 rounded border border-gray-700/50">
                    {groupedMatches[league].length} Matches
                  </span>
                </div>

                {/* Match List */}
                <div className="flex flex-col divide-y divide-gray-700/30">
                  {groupedMatches[league].map((match: any) => {
                    const isFinished = match.minute === "FT";
                    const isHalfTime = match.minute === "HT";
                    const isLive = !isFinished && !isHalfTime;
                    const statusBadgeText = isFinished ? "FT" : isHalfTime ? "HT" : `${match.minute}'`;

                    return (
                      <Link 
                        key={match.id} 
                        href={`/live-scores/${match.id}`}
                        className="flex items-center justify-between p-3 sm:px-5 hover:bg-bg-deep/60 transition-colors group"
                      >
                        {/* Home Team */}
                        <div className="flex-1 flex justify-end items-center gap-3 text-right">
                          <span className={`text-sm truncate ${match.home_score > match.away_score ? 'text-surface-white font-bold' : 'text-text-muted'}`}>
                            {match.home_team}
                          </span>
                          <div className="w-7 h-7 bg-bg-deep rounded-full flex items-center justify-center border border-gray-700/50 shrink-0 overflow-hidden p-1">
                            {match.home_logo ? (
                              <img src={match.home_logo} alt={match.home_team} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-[10px] font-bold text-brand-green">{match.home_team.charAt(0)}</span>
                            )}
                          </div>
                        </div>

                        {/* Score & Time */}
                        <div className="px-3 sm:px-5 flex flex-col items-center justify-center min-w-[80px]">
                          <div className="flex items-center gap-2 text-lg font-black text-surface-white bg-bg-deep px-3 py-1 rounded-lg border border-gray-700/50">
                            <span className={match.home_score > match.away_score ? 'text-brand-green' : ''}>{match.home_score}</span>
                            <span className="text-gray-600 text-sm">-</span>
                            <span className={match.away_score > match.home_score ? 'text-brand-yellow' : ''}>{match.away_score}</span>
                          </div>
                          <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded ${
                            isLive 
                              ? "bg-brand-green/20 text-brand-green animate-pulse" 
                              : isHalfTime 
                              ? "bg-brand-yellow/20 text-brand-yellow"
                              : "bg-gray-800 text-gray-400"
                          }`}>
                            {isLive ? `LIVE • ${statusBadgeText}` : statusBadgeText}
                          </span>
                        </div>

                        {/* Away Team */}
                        <div className="flex-1 flex justify-start items-center gap-3 text-left">
                          <div className="w-7 h-7 bg-bg-deep rounded-full flex items-center justify-center border border-gray-700/50 shrink-0 overflow-hidden p-1">
                            {match.away_logo ? (
                              <img src={match.away_logo} alt={match.away_team} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-[10px] font-bold text-brand-yellow">{match.away_team.charAt(0)}</span>
                            )}
                          </div>
                          <span className={`text-sm truncate ${match.away_score > match.home_score ? 'text-surface-white font-bold' : 'text-text-muted'}`}>
                            {match.away_team}
                          </span>
                        </div>

                        {/* Arrow */}
                        <div className="hidden sm:flex ml-4 text-gray-600 group-hover:text-brand-green transition-colors">
                          <ChevronRight size={18} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SportScore Attribution (Required by API) */}
        <div className="mt-12 text-center border-t border-gray-800 pt-6">
          <p className="text-xs text-text-muted">
            Live data provided by{" "}
            <a 
              href="https://sportscore.com/" 
              rel="dofollow" 
              target="_blank"
              className="text-brand-green font-bold hover:underline"
            >
              SportScore
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
