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
  homePct,
  awayPct,
  suffix,
}: {
  label: string;
  home: number | string;
  away: number | string;
  homePct: number;
  awayPct: number;
  suffix: string;
}) => {
  const homeVal = Number(home) || 0;
  const awayVal = Number(away) || 0;
  const homeLeading = homeVal > awayVal;
  const awayLeading = awayVal > homeVal;

  const homeWidth = homePct || 50;
  const awayWidth = awayPct || 50;

  return (
    <div className="py-2.5 border-b border-gray-700/50 last:border-none">
      <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-1.5 tabular-nums">
        <span className={homeLeading ? "text-brand-green" : "text-text-muted"}>
          {homeVal}{suffix}
        </span>
        <span className="text-text-muted text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
        <span className={awayLeading ? "text-brand-yellow" : "text-text-muted"}>
          {awayVal}{suffix}
        </span>
      </div>

      <div className="flex h-1.5 w-full rounded-sm overflow-hidden bg-bg-deep gap-0.5">
        <div
          className={`h-full transition-all duration-500 rounded-l-sm ${
            homeLeading ? "bg-brand-green" : "bg-gray-600"
          }`}
          style={{ width: `${homeWidth}%` }}
        />
        <div
          className={`h-full transition-all duration-500 rounded-r-sm ${
            awayLeading ? "bg-brand-yellow" : "bg-gray-600"
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

  // ✅ FIXED SLUG RECONSTRUCTION
  let rawSlug = matchId
    .replace(/^-/, "")
    .replace(/-$/, "");
  const matchSlug = rawSlug
    .replace(/^football-match-/, "")
    .replace(/-[^-]+$/, "");

  // Fetch Stats
  let stats: any[] = [];
  try {
    const res = await fetch(
      `https://sportscore.com/api/widget/match/?sport=football&slug=${encodeURIComponent(matchSlug)}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const json = await res.json();
      stats = json.match?.stats || [];
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
    <div className="min-h-screen bg-bg-deep text-surface-white pt-4 pb-16 selection:bg-brand-green selection:text-white font-sans">
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-5">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/live-scores"
            className="inline-flex items-center gap-2 text-text-muted hover:text-surface-white bg-bg-slate hover:bg-gray-700 border border-gray-700/50 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold tracking-wide"
          >
            <ArrowLeft size={14} className="text-brand-green" />
            <span>Live Center</span>
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted">
            <Flame size={13} className="text-brand-yellow" />
            <span>Match Tracker</span>
          </div>
        </div>

        {/* Bet9ja-Inspired Live Scoreboard Card */}
        <div className="bg-bg-slate rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl mb-5">
          
          {/* League & Live Status Header */}
          <div className="bg-bg-slate bg-gradient-to-r from-bg-deep/50 to-bg-slate px-4 py-2.5 border-b border-gray-700/50 flex justify-between items-center">
            <div className="flex items-center gap-2 truncate pr-2">
              
              {/* COUNTRY LOGO */}
              <div className="w-5 h-5 rounded-full bg-bg-deep border border-gray-700/50 flex items-center justify-center shrink-0 overflow-hidden">
                {match.country_logo ? (
                  <img
                    src={match.country_logo}
                    alt="Country"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Trophy size={12} className="text-brand-yellow shrink-0" />
                )}
              </div>

              <span className="text-surface-white font-bold uppercase tracking-wider text-[11px] sm:text-xs truncate">
                {match.league}
              </span>
            </div>

            {/* Live Ticker Pill */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-extrabold tracking-wide shrink-0 ${
                isLive
                  ? "bg-brand-green/20 text-brand-green border border-brand-green/40"
                  : isHalfTime
                  ? "bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30"
                  : "bg-gray-800 text-text-muted border border-gray-700"
              }`}
            >
              {isLive && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              )}
              <span>{isLive ? `LIVE • ${statusBadgeText}` : statusBadgeText}</span>
            </div>
          </div>

          {/* Pitch / Scoreboard Arena */}
          <div className="relative p-5 sm:p-7 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-green/10 via-bg-slate to-bg-slate">
            <div className="grid grid-cols-3 items-center gap-2 sm:gap-4">
              
              {/* Home Team */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-bg-deep rounded-full flex items-center justify-center border border-gray-700/50 mb-2.5 p-2 shadow-lg">
                  {match.home_logo ? (
                    <img
                      src={match.home_logo}
                      alt={match.home_team}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-lg font-black text-brand-green">
                      {match.home_team.charAt(0)}
                    </span>
                  )}
                </div>
                <h1 className="text-xs sm:text-sm font-extrabold text-surface-white leading-snug line-clamp-2">
                  {match.home_team}
                </h1>
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mt-0.5">
                  Home
                </span>
              </div>

              {/* Center Score Box */}
              <div className="flex flex-col items-center justify-center">
                <div className="bg-bg-deep border border-gray-700/50 rounded-xl px-3.5 py-2 sm:px-5 sm:py-3 shadow-inner flex items-center gap-2 sm:gap-3 tabular-nums">
                  <span
                    className={`text-3xl sm:text-4xl font-black ${
                      match.home_score > match.away_score
                        ? "text-brand-green"
                        : "text-surface-white"
                    }`}
                  >
                    {match.home_score}
                  </span>
                  <span className="text-text-muted text-xl sm:text-2xl font-bold">
                    -
                  </span>
                  <span
                    className={`text-3xl sm:text-4xl font-black ${
                      match.away_score > match.home_score
                        ? "text-brand-yellow"
                        : "text-surface-white"
                    }`}
                  >
                    {match.away_score}
                  </span>
                </div>

                <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  {isFinished
                    ? "Full Time"
                    : isHalfTime
                    ? "Half Time"
                    : "In-Play"}
                </span>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-bg-deep rounded-full flex items-center justify-center border border-gray-700/50 mb-2.5 p-2 shadow-lg">
                  {match.away_logo ? (
                    <img
                      src={match.away_logo}
                      alt={match.away_team}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-lg font-black text-brand-yellow">
                      {match.away_team.charAt(0)}
                    </span>
                  )}
                </div>
                <h2 className="text-xs sm:text-sm font-extrabold text-surface-white leading-snug line-clamp-2">
                  {match.away_team}
                </h2>
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mt-0.5">
                  Away
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Match Statistics Panel */}
        <div className="bg-bg-slate rounded-xl border border-gray-700/50 overflow-hidden shadow-xl">
          
          <div className="bg-bg-slate px-4 py-3 border-b border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-brand-green rounded-full" />
              <BarChart2 className="text-brand-green w-4 h-4" />
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-surface-white">
                Match Statistics
              </h3>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-text-muted">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-green" /> Home
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-yellow" /> Away
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {stats.length === 0 ? (
              <div className="text-center py-8 bg-bg-deep/50 rounded-lg border border-gray-700/30">
                <AlertCircle className="w-7 h-7 text-text-muted mx-auto mb-2" />
                <p className="text-text-muted text-xs font-semibold">
                  Live match stats unavailable
                </p>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Data will appear automatically once kick-off begins.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {stats.map((stat: any, index: number) => (
                  <StatBar
                    key={index}
                    label={stat.label || "Stat"}
                    home={stat.home}
                    away={stat.away}
                    homePct={stat.home_pct}
                    awayPct={stat.away_pct}
                    suffix={stat.suffix || ""}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-text-muted">
            Real-time match feed powered by{" "}
            <a
              href="https://sportscore.com/"
              rel="dofollow"
              className="text-brand-green hover:text-brand-green-dark font-semibold transition-colors"
            >
              SportScore
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
