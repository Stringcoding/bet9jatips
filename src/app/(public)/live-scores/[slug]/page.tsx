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
  
  // Calculate percentage widths for the bars
  const homeWidth = total === 0 ? 50 : (homeVal / total) * 100;
  const awayWidth = total === 0 ? 50 : (awayVal / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center text-sm font-bold text-surface-white mb-2">
        <span>{isPercentage ? `${homeVal}%` : homeVal}</span>
        <span className="text-text-muted text-xs uppercase tracking-wider">{label}</span>
        <span>{isPercentage ? `${awayVal}%` : awayVal}</span>
      </div>
      <div className="flex h-2 w-full rounded-full overflow-hidden bg-bg-deep border border-gray-800">
        <div className="bg-brand-green h-full transition-all duration-500" style={{ width: `${homeWidth}%` }} />
        <div className="bg-brand-red/80 h-full transition-all duration-500" style={{ width: `${awayWidth}%` }} />
      </div>
    </div>
  );
};

export default async function MatchDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const matchId = resolvedParams.slug;
  
  // 1. Get the match from Supabase
  const supabase = await createClient();
  const { data: match } = await supabase
    .from("live_scores")
    .select("*")
    .eq("id", matchId)
    .single();

  if (!match) {
    notFound();
  }

  // 2. Extract the original URL slug to fetch stats from SportScore
  let rawSlug = matchId.startsWith("-") ? matchId.substring(1) : matchId;
  rawSlug = rawSlug.endsWith("-") ? rawSlug.slice(0, -1) : rawSlug;
  const matchSlug = rawSlug.split("-football-match-")[1] || rawSlug;

  // 3. Fetch Stats from SportScore API
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

  return (
    <div className="min-h-screen bg-bg-deep pt-8 pb-20">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        
        <Link 
          href="/live-scores" 
          className="inline-flex items-center gap-2 text-text-muted hover:text-surface-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Live Center
        </Link>

        {/* Scoreboard Header */}
        <div className="bg-bg-slate rounded-t-3xl border-t border-x border-gray-800 overflow-hidden shadow-2xl">
          <div className="bg-bg-deep px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <span className="text-brand-green font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              <Shield size={16} /> {match.league}
            </span>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              match.minute === "FT" 
                ? "bg-gray-800 text-gray-400 border-gray-700" 
                : "bg-brand-red/10 text-brand-red border-brand-red/20"
            }`}>
              {match.minute !== "FT" && <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />}
              {match.minute === "FT" ? "FULL TIME" : "LIVE"}
            </div>
          </div>

          <div className="p-8 sm:p-12 flex flex-col items-center">
            <div className="text-text-muted font-medium mb-6 flex items-center gap-2">
              <Clock size={16} /> {match.minute === "FT" ? "Full Time" : `Minute ${match.minute}`}
            </div>

            <div className="w-full flex items-center justify-between gap-4 sm:gap-8">
              {/* Home Team */}
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-bg-deep rounded-full flex items-center justify-center border-4 border-gray-700 mb-4 shadow-lg overflow-hidden p-2">
                  {match.home_logo ? (
                    <img src={match.home_logo} alt={match.home_team} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-2xl font-black text-gray-400">{match.home_team.charAt(0)}</span>
                  )}
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

              {/* Away Team */}
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-bg-deep rounded-full flex items-center justify-center border-4 border-gray-700 mb-4 shadow-lg overflow-hidden p-2">
                  {match.away_logo ? (
                    <img src={match.away_logo} alt={match.away_team} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-2xl font-black text-gray-400">{match.away_team.charAt(0)}</span>
                  )}
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-surface-white">{match.away_team}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-bg-slate rounded-b-3xl border-b border-x border-gray-800 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-8 border-b border-gray-800 pb-4">
            <Activity className="text-brand-green w-5 h-5" />
            <h3 className="text-xl font-bold text-surface-white">Match Statistics</h3>
          </div>

          {stats.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-text-muted text-sm">Statistics are not available for this match yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
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

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-muted">
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
