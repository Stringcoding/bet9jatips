import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Clock, Shield, Activity, Target, Flag, AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Helper to format percentage
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
        {/* Home Bar */}
        <div 
          className="bg-brand-green h-full transition-all duration-500" 
          style={{ width: `${homeWidth}%` }} 
        />
        {/* Away Bar */}
        <div 
          className="bg-brand-red/80 h-full transition-all duration-500" 
          style={{ width: `${awayWidth}%` }} 
        />
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
  // Our database ID is the URL with slashes replaced by dashes. We need to reverse it to fetch stats.
  // Alternatively, if you saved the raw URL, you can use that. We'll reconstruct it here.
  // Example: -football-match-diriangen-vs-matagalpa-fc-3glrw7h41k74qdy-
  let rawSlug = matchId.startsWith("-") ? matchId.substring(1) : matchId;
  rawSlug = rawSlug.endsWith("-") ? rawSlug.slice(0, -1) : rawSlug;
  
  // Extract only the final part of the slug (e.g., "manchester-united-vs-liverpool")
  const matchSlug = rawSlug.split("-football-match-")[1] || rawSlug;

  // 3. Fetch Stats from SportScore API
  let stats: any[] = [];
  let events: any[] = [];
  
  try {
    const res = await fetch(
      `https://sportscore.com/api/widget/match/?sport=football&slug=${matchSlug}`,
      { cache: "no-store" }
    );
    
    if (res.ok) {
      const json = await res.json();
      // SportScore returns stats in different possible keys depending on the match state
      stats = json.match?.stats || json.stats || [];
      events = json.match?.events || json.events || [];
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
              
              {/* Map through the stats we get from the API */}
              {stats.map((stat: any, index: number) => {
                // Safely extract home and away values
                const homeValue = stat.home || stat.home_value || 0;
                const awayValue = stat.away || stat.away_value || 0;
                
                // Check if the stat is a percentage (like possession)
                const isPercentage = stat.name?.toLowerCase().includes("possession") || stat.type?.toLowerCase().includes("possession");
                
                // Clean up label (e.g., "ball_possession" -> "Ball Possession")
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

              {/* Fallback if API sends specific known stat keys but our generic mapping misses them */}
              {stats.length > 0 && !stats.find((s:any) => s.name === "Ball Possession") && (
                 <>
                   {/* You can manually map more stats here if SportScore changes their structure */}
                 </>
              )}

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
