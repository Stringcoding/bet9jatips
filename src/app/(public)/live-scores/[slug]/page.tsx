import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Clock, Shield, Activity, AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Helper component to draw the statistic bars
const StatBar = ({ label, home, away, isPercentage = false }: { label: string, home: number | string, away: number | string, isPercentage?: boolean }) => {
  const homeVal = Number(home) || 0;
  const awayVal = Number(away) || 0;
  const total = homeVal + awayVal;
  
  const homeWidth = total === 0 ? 50 : (homeVal / total) * 100;
  const awayWidth = total === 0 ? 50 : (awayVal / total) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center text-sm font-bold text-surface-white mb-2">
        <span>{isPercentage ? `${homeVal}%` : homeVal}</span>
        <span className="text-text-muted text-[11px] uppercase tracking-wider">{label}</span>
        <span>{isPercentage ? `${awayVal}%` : awayVal}</span>
      </div>
      <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-bg-deep border border-gray-800">
        <div className="bg-brand-green h-full transition-all duration-500" style={{ width: `${homeWidth}%` }} />
        <div className="bg-brand-red/80 h-full transition-all duration-500" style={{ width: `${awayWidth}%` }} />
      </div>
    </div>
  );
};

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

  // Reconstruct slug for API
  let rawSlug = matchId.startsWith("-") ? matchId.substring(1) : matchId;
  rawSlug = rawSlug.endsWith("-") ? rawSlug.slice(0, -1) : rawSlug;
  const matchSlug = rawSlug.split("-football-match-")[1] || rawSlug;

  // Fetch Stats
  let stats: any[] = [];
  try {
    const res = await fetch(
      `https://sportscore.com/api/widget/match/?sport=football&slug=${matchSlug}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const json = await res.json();
      stats = json.match?.stats || json.stats || [];
    }
  } catch (error) {
    console.error("Failed to fetch match stats", error);
  }

  // Fix HT display
  const displayMinute = match.minute === "HT" ? "Half Time" : match.minute === "FT" ? "Full Time" : `Minute ${match.minute}`;

  return (
    <div className="min-h-screen bg-bg-deep pt-6 pb-16">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
        
        <Link 
          href="/live-scores" 
          className="inline-flex items-center gap-2 text-text-muted hover:text-surface-white mb-6 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back to Live Center
        </Link>

        {/* Compact Scoreboard Header */}
        <div className="bg-bg-slate rounded-2xl border border-gray-800 overflow-hidden shadow-xl mb-6">
          
          <div className="bg-bg-deep px-4 py-3 border-b border-gray-800 flex justify-between items-center">
            <span className="text-brand-green font-bold uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Shield size={14} /> {match.league}
            </span>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${
              match.minute === "FT" || match.minute === "HT"
                ? "bg-gray-800 text-gray-400 border-gray-700" 
                : "bg-brand-red/10 text-brand-red border-brand-red/20"
            }`}>
              {match.minute !== "FT" && match.minute !== "HT" && <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-ping" />}
              {match.minute === "FT" ? "FULL TIME" : match.minute === "HT" ? "HALF TIME" : "LIVE"}
            </div>
          </div>

          <div className="p-6 flex flex-col items-center">
            
            <div className="text-text-muted text-xs font-medium mb-4 flex items-center gap-1.5 bg-bg-deep px-3 py-1 rounded-full">
              <Clock size={12} /> {displayMinute}
            </div>

            <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
              
              {/* Home Team */}
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-bg-deep rounded-full flex items-center justify-center border-2 border-gray-700 mb-3 overflow-hidden p-1.5 shadow-inner">
                  {match.home_logo ? (
                    <img src={match.home_logo} alt={match.home_team} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-lg font-black text-gray-400">{match.home_team.charAt(0)}</span>
                  )}
                </div>
                <h2 className="text-sm sm:text-base font-bold text-surface-white leading-tight">{match.home_team}</h2>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center justify-center shrink-0 px-2">
                <div className="text-4xl sm:text-5xl font-black text-surface-white flex items-center gap-2">
                  <span className={match.home_score > match.away_score ? 'text-brand-green' : ''}>{match.home_score}</span>
                  <span className="text-gray-600 text-2xl">:</span>
                  <span className={match.away_score > match.home_score ? 'text-brand-green' : ''}>{match.away_score}</span>
                </div>
              </div>

              {/* Away Team */}
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-bg-deep rounded-full flex items-center justify-center border-2 border-gray-700 mb-3 overflow-hidden p-1.5 shadow-inner">
                  {match.away_logo ? (
                    <img src={match.away_logo} alt={match.away_team} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-lg font-black text-gray-400">{match.away_team.charAt(0)}</span>
                  )}
                </div>
                <h2 className="text-sm sm:text-base font-bold text-surface-white leading-tight">{match.away_team}</h2>
              </div>

            </div>
          </div>
        </div>

        {/* Compact Statistics Section */}
        <div className="bg-bg-slate rounded-2xl border border-gray-800 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-3">
            <Activity className="text-brand-green w-4 h-4" />
            <h3 className="text-base font-bold text-surface-white">Match Statistics</h3>
          </div>

          {stats.length === 0 ? (
            <div className="text-center py-6">
              <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-text-muted text-xs">Statistics are not available for this match yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {stats.map((stat: any, index: number) => {
                const homeValue = stat.home || stat.home_value || 0;
                const awayValue = stat.away || stat.away_value || 0;
                const isPercentage = stat.name?.toLowerCase().includes("possession") || stat.type?.toLowerCase().includes("possession");
                const label = stat.name || stat.type || "Stat";
                const formattedLabel = label.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

                return (
                  <StatBar 
                    key={index}
                    label={formattedLabel}
                    home={homeValue}
                    away={awayValue}
                    isPercentage={isPercentage}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-text-muted">
            Stats provided by{" "}
            <a href="https://sportscore.com/" rel="dofollow" className="text-brand-green hover:underline">
              SportScore
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
