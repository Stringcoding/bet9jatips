import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Trophy, BarChart2, AlertCircle, Flame } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Sportsbook-style split statistic bar
const StatBar = ({
  label,
  home,
  away,
  isPercentage = false,
}: {
  label: string;
  home: number | string;
  away: number | string;
  isPercentage?: boolean;
}) => {
  const homeVal = Number(home) || 0;
  const awayVal = Number(away) || 0;
  const total = homeVal + awayVal;

  const homeWidth = total === 0 ? 50 : (homeVal / total) * 100;
  const awayWidth = total === 0 ? 50 : (awayVal / total) * 100;

  const homeLeading = homeVal > awayVal;
  const awayLeading = awayVal > homeVal;

  return (
    <div className="py-2.5 border-b border-white/[0.04] last:border-none">
      <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-1.5 tabular-nums">
        <span className={homeLeading ? "text-[#00E676]" : "text-gray-300"}>
          {isPercentage ? `${homeVal}%` : homeVal}
        </span>
        <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
        <span className={awayLeading ? "text-[#FBBF24]" : "text-gray-300"}>
          {isPercentage ? `${awayVal}%` : awayVal}
        </span>
      </div>

      {/* Split Progress Track */}
      <div className="flex h-1.5 w-full rounded-sm overflow-hidden bg-[#0B0E11] gap-0.5">
        <div
          className={`h-full transition-all duration-500 rounded-l-sm ${
            homeLeading ? "bg-[#00A859]" : "bg-gray-600"
          }`}
          style={{ width: `${homeWidth}%` }}
        />
        <div
          className={`h-full transition-all duration-500 rounded-r-sm ${
            awayLeading ? "bg-[#FBBF24]" : "bg-gray-600"
          }`}
          style={{ width: `${awayWidth}%` }}
        />
      </div>
    </div>
  );
};

export default async function MatchDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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

  const isFinished = match.minute === "FT";
  const isHalfTime = match.minute === "HT";
  const isLive = !isFinished && !isHalfTime;

  const statusBadgeText = isFinished
    ? "FT"
    : isHalfTime
    ? "HT"
    : `${match.minute}'`;

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white pt-4 pb-16 selection:bg-[#00A859] selection:text-white">
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-5">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/live-scores"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white bg-[#161B22] hover:bg-[#1E242D] border border-white/10 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold"
          >
            <ArrowLeft size={14} className="text-[#00A859]" />
            <span>Live Center</span>
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <Flame size={13} className="text-[#FBBF24]" />
            <span>Match Tracker</span>
          </div>
        </div>

        {/* Bet9ja-Inspired Live Scoreboard Card */}
        <div className="bg-[#161B22] rounded-xl border border-white/10 overflow-hidden shadow-2xl mb-5">
          
          {/* League & Live Status Header */}
          <div className="bg-gradient-to-r from-[#0F291E] via-[#131920] to-[#161B22] px-4 py-2.5 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2 truncate pr-2">
              <Trophy size={14} className="text-[#FBBF24] shrink-0" />
              <span className="text-gray-200 font-bold uppercase tracking-wider text-[11px] sm:text-xs truncate">
                {match.league}
              </span>
            </div>

            {/* Live Ticker Pill */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-extrabold tracking-wide shrink-0 ${
                isLive
                  ? "bg-[#00A859]/20 text-[#00E676] border border-[#00A859]/40"
                  : isHalfTime
                  ? "bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30"
                  : "bg-white/5 text-gray-400 border border-white/10"
              }`}
            >
              {isLive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
              )}
              <span>{isLive ? `LIVE • ${statusBadgeText}` : statusBadgeText}</span>
            </div>
          </div>

          {/* Pitch / Scoreboard Arena */}
          <div className="relative p-5 sm:p-7 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00A859]/10 via-[#161B22] to-[#161B22]">
            <div className="grid grid-cols-3 items-center gap-2 sm:gap-4">
              
              {/* Home Team */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0B0E11] rounded-full flex items-center justify-center border border-white/15 mb-2.5 p-2 shadow-lg">
                  {match.home_logo ? (
                    <img
                      src={match.home_logo}
                      alt={match.home_team}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-lg font-black text-[#00A859]">
                      {match.home_team.charAt(0)}
                    </span>
                  )}
                </div>
                <h1 className="text-xs sm:text-sm font-extrabold text-white leading-snug line-clamp-2">
                  {match.home_team}
                </h1>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-0.5">
                  Home
                </span>
              </div>

              {/* Center Score Box */}
              <div className="flex flex-col items-center justify-center">
                <div className="bg-[#0B0E11] border border-white/10 rounded-xl px-3.5 py-2 sm:px-5 sm:py-3 shadow-inner flex items-center gap-2 sm:gap-3 tabular-nums">
                  <span
                    className={`text-3xl sm:text-4xl font-black ${
                      match.home_score > match.away_score
                        ? "text-[#00E676]"
                        : "text-white"
                    }`}
                  >
                    {match.home_score}
                  </span>
                  <span className="text-gray-600 text-xl sm:text-2xl font-bold">
                    -
                  </span>
                  <span
                    className={`text-3xl sm:text-4xl font-black ${
                      match.away_score > match.home_score
                        ? "text-[#FBBF24]"
                        : "text-white"
                    }`}
                  >
                    {match.away_score}
                  </span>
                </div>

                <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {isFinished
                    ? "Full Time"
                    : isHalfTime
                    ? "Half Time"
                    : "In-Play"}
                </span>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0B0E11] rounded-full flex items-center justify-center border border-white/15 mb-2.5 p-2 shadow-lg">
                  {match.away_logo ? (
                    <img
                      src={match.away_logo}
                      alt={match.away_team}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-lg font-black text-[#FBBF24]">
                      {match.away_team.charAt(0)}
                    </span>
                  )}
                </div>
                <h2 className="text-xs sm:text-sm font-extrabold text-white leading-snug line-clamp-2">
                  {match.away_team}
                </h2>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-0.5">
                  Away
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Match Statistics Panel */}
        <div className="bg-[#161B22] rounded-xl border border-white/10 overflow-hidden shadow-xl">
          
          {/* Section Header with Green Accent Bar */}
          <div className="bg-[#1C222B] px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#00A859] rounded-full" />
              <BarChart2 className="text-[#00A859] w-4 h-4" />
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
                Match Statistics
              </h3>
            </div>

            {/* Color Legend */}
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00A859]" /> Home
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#FBBF24]" /> Away
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {stats.length === 0 ? (
              <div className="text-center py-8 bg-[#0B0E11]/50 rounded-lg border border-white/5">
                <AlertCircle className="w-7 h-7 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-300 text-xs font-semibold">
                  Live match stats unavailable
                </p>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Data will appear automatically once kick-off begins.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {stats.map((stat: any, index: number) => {
                  const homeValue = stat.home || stat.home_value || 0;
                  const awayValue = stat.away || stat.away_value || 0;
                  const isPercentage =
                    stat.name?.toLowerCase().includes("possession") ||
                    stat.type?.toLowerCase().includes("possession");
                  const label = stat.name || stat.type || "Stat";
                  const formattedLabel = label
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l: string) => l.toUpperCase());

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
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-gray-500">
            Real-time match feed powered by{" "}
            <a
              href="https://sportscore.com/"
              rel="dofollow"
              className="text-[#00A859] hover:text-[#00E676] font-semibold transition-colors"
            >
              SportScore
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
