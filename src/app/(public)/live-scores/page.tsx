import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Radio,
  ChevronRight,
  Trophy,
  ArrowLeft,
  Flame,
  CalendarClock,
} from "lucide-react";
import LiveScoresRefresher from "./LiveScoresRefresher";

export const dynamic = "force-dynamic";

function classifyMatchStatus(match: any) {
  const minuteStr = String(match.minute || "").trim();
  const statusStr = String(match.status || "").toLowerCase();

  const isFinished =
    minuteStr === "FT" || statusStr === "finished" || statusStr === "ended";
  const isHalfTime = minuteStr === "HT" || statusStr === "halftime";
  const isScheduled =
    !isFinished &&
    !isHalfTime &&
    (statusStr === "scheduled" ||
      minuteStr.includes(":") ||
      minuteStr === "SOON");
  const isLive = !isFinished && !isHalfTime && !isScheduled;

  const formattedMinute =
    isFinished || isHalfTime || isScheduled || minuteStr.endsWith("'")
      ? minuteStr
      : `${minuteStr}'`;

  return {
    isFinished,
    isHalfTime,
    isScheduled,
    isLive,
    formattedMinute,
  };
}

export default async function LiveScoresPage() {
  const supabase = await createClient();

  // Fetch all live + upcoming matches ordered by status (inplay first), league, then updated_at
  const { data: matches } = await supabase
    .from("live_scores")
    .select("*")
    .order("status", { ascending: true })
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

  // Sort leagues so competitions with live matches appear first, then alphabetically
  const leagues = Object.keys(groupedMatches).sort((a, b) => {
    const aHasLive = groupedMatches[a].some(
      (m: any) => classifyMatchStatus(m).isLive || classifyMatchStatus(m).isHalfTime
    );
    const bHasLive = groupedMatches[b].some(
      (m: any) => classifyMatchStatus(m).isLive || classifyMatchStatus(m).isHalfTime
    );
    if (aHasLive !== bHasLive) return aHasLive ? -1 : 1;
    return a.localeCompare(b);
  });

  const totalLiveCount = (matches || []).filter((m: any) => {
    const s = classifyMatchStatus(m);
    return s.isLive || s.isHalfTime;
  }).length;

  const totalUpcomingCount = (matches || []).filter(
    (m: any) => classifyMatchStatus(m).isScheduled
  ).length;

  return (
    <div className="min-h-screen bg-bg-deep text-surface-white pt-4 sm:pt-8 pb-20 selection:bg-brand-green selection:text-surface-white font-sans">
      {/* Keeps the page synced automatically with Supabase Realtime without extra API calls */}
      <LiveScoresRefresher />

      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        {/* Top Navigation & Live Summary Bar */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-surface-white bg-bg-slate hover:bg-gray-700 border border-gray-700/50 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold tracking-wide"
          >
            <ArrowLeft size={14} className="text-brand-green" />
            <span>Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-bg-slate border border-gray-700/50 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-text-muted tabular-nums">
                {totalLiveCount} Live
              </span>
            </div>

            {totalUpcomingCount > 0 && (
              <div className="flex items-center gap-1.5 bg-bg-slate border border-gray-700/50 px-3 py-1.5 rounded-lg">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-yellow tabular-nums">
                  {totalUpcomingCount} Upcoming
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sportsbook Lobby Header Banner */}
        <div className="bg-gradient-to-r from-bg-slate via-bg-slate to-bg-slate rounded-xl border border-gray-700/50 p-4 sm:p-6 mb-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-brand-green text-bg-deep text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                In-Play &amp; Fixtures
              </span>
              <span className="text-xs font-bold text-brand-yellow tracking-wide flex items-center gap-1">
                <Flame size={13} /> Real-Time Feed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-surface-white tracking-tight">
              Live Score Center
            </h1>
            <p className="text-text-muted text-xs sm:text-sm mt-1">
              Tap any fixture for live match tracker &amp; in-depth statistics.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-bg-deep/80 border border-gray-700/50 px-3.5 py-2.5 rounded-lg self-start sm:self-auto">
            <CalendarClock size={18} className="text-brand-green" />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold">
                Active Leagues
              </div>
              <div className="text-sm font-black text-surface-white tabular-nums">
                {leagues.length} Competitions
              </div>
            </div>
          </div>
        </div>

        {/* Matches Container */}
        {leagues.length === 0 ? (
          <div className="text-center py-16 bg-bg-slate rounded-xl border border-gray-700/50 px-4">
            <div className="w-12 h-12 rounded-full bg-bg-deep border border-gray-700/50 flex items-center justify-center mx-auto mb-3">
              <Radio className="w-6 h-6 text-brand-green animate-pulse" />
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-surface-white mb-1 tracking-tight">
              No live or upcoming matches right now
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-sm mx-auto">
              Fixtures will populate automatically as soon as matches are scheduled or kick off.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {leagues.map((league) => {
              // Sort matches inside each league: live/HT first, then upcoming by kickoff time
              const leagueMatches = [...groupedMatches[league]].sort(
                (a: any, b: any) => {
                  const aStatus = classifyMatchStatus(a);
                  const bStatus = classifyMatchStatus(b);
                  const aRank = aStatus.isLive || aStatus.isHalfTime ? 0 : 1;
                  const bRank = bStatus.isLive || bStatus.isHalfTime ? 0 : 1;
                  if (aRank !== bRank) return aRank - bRank;
                  return String(a.minute).localeCompare(String(b.minute));
                }
              );

              const countryLogo = leagueMatches[0]?.country_logo;

              return (
                <div
                  key={league}
                  className="bg-bg-slate rounded-xl border border-gray-700/50 overflow-hidden shadow-xl"
                >
                  {/* League Strip Header */}
                  <div className="bg-bg-slate px-3.5 sm:px-5 py-2.5 border-b border-gray-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-1 h-4 bg-brand-green rounded-full shrink-0" />

                      <div className="w-5 h-5 rounded-full bg-bg-deep border border-gray-700/50 flex items-center justify-center shrink-0 overflow-hidden">
                        {countryLogo ? (
                          <img
                            src={countryLogo}
                            alt="Flag"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Trophy size={12} className="text-brand-yellow shrink-0" />
                        )}
                      </div>

                      <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-surface-white truncate">
                        {league}
                      </h2>
                    </div>

                    <span className="text-[10px] font-extrabold text-text-muted bg-bg-deep border border-gray-700/50 px-2 py-0.5 rounded shrink-0 tabular-nums tracking-wide">
                      {leagueMatches.length}{" "}
                      {leagueMatches.length === 1 ? "Match" : "Matches"}
                    </span>
                  </div>

                  {/* Match Rows */}
                  <div className="flex flex-col divide-y divide-gray-700/50">
                    {leagueMatches.map((match: any) => {
                      const {
                        isFinished,
                        isHalfTime,
                        isScheduled,
                        isLive,
                        formattedMinute,
                      } = classifyMatchStatus(match);

                      const homeWinning =
                        !isScheduled && match.home_score > match.away_score;
                      const awayWinning =
                        !isScheduled && match.away_score > match.home_score;

                      return (
                        <Link
                          key={match.id}
                          href={`/live-scores/${match.id}`}
                          className="flex items-center justify-between px-3.5 py-3 sm:px-5 sm:py-3.5 hover:bg-bg-deep/60 active:bg-bg-deep transition-colors group gap-3"
                        >
                          {/* Left: Match Minute / Kickoff Time Badge */}
                          <div className="w-14 sm:w-16 shrink-0 flex flex-col items-center justify-center border-r border-gray-700/50 pr-2.5 sm:pr-3">
                            {isLive ? (
                              <div className="flex items-center gap-1 text-brand-green font-extrabold text-xs tabular-nums">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
                                <span>{formattedMinute}</span>
                              </div>
                            ) : isHalfTime ? (
                              <span className="text-[11px] font-extrabold text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/30 px-1.5 py-0.5 rounded">
                                HT
                              </span>
                            ) : isScheduled ? (
                              <span className="text-[11px] font-extrabold text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/25 px-1.5 py-0.5 rounded tabular-nums">
                                {formattedMinute}
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-text-muted bg-bg-deep px-1.5 py-0.5 rounded">
                                FT
                              </span>
                            )}
                            <span className="text-[9px] uppercase tracking-widest text-text-muted/70 font-semibold mt-1">
                              {isLive
                                ? "Live"
                                : isHalfTime
                                ? "Break"
                                : isScheduled
                                ? "Kickoff"
                                : "Ended"}
                            </span>
                          </div>

                          {/* Middle: Stacked Teams */}
                          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                            {/* Home Team Row */}
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-5 h-5 rounded-full bg-bg-deep border border-gray-700/50 flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                                {match.home_logo ? (
                                  <img
                                    src={match.home_logo}
                                    alt={match.home_team}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <span className="text-[10px] font-black text-brand-green">
                                    {match.home_team.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`text-xs sm:text-sm truncate ${
                                  homeWinning
                                    ? "text-surface-white font-extrabold"
                                    : isScheduled
                                    ? "text-surface-white/90 font-semibold"
                                    : "text-text-muted font-medium"
                                }`}
                              >
                                {match.home_team}
                              </span>
                            </div>

                            {/* Away Team Row */}
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-5 h-5 rounded-full bg-bg-deep border border-gray-700/50 flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                                {match.away_logo ? (
                                  <img
                                    src={match.away_logo}
                                    alt={match.away_team}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <span className="text-[10px] font-black text-brand-yellow">
                                    {match.away_team.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`text-xs sm:text-sm truncate ${
                                  awayWinning
                                    ? "text-surface-white font-extrabold"
                                    : isScheduled
                                    ? "text-surface-white/90 font-semibold"
                                    : "text-text-muted font-medium"
                                }`}
                              >
                                {match.away_team}
                              </span>
                            </div>
                          </div>

                          {/* Right: Sportsbook Score Pill & Stats Trigger */}
                          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                            <div className="bg-bg-deep border border-gray-700/50 rounded-lg px-2.5 py-1.5 flex flex-col items-center justify-center min-w-[36px] tabular-nums shadow-inner">
                              <span
                                className={`text-xs sm:text-sm font-black leading-tight ${
                                  homeWinning
                                    ? "text-brand-green"
                                    : isScheduled
                                    ? "text-text-muted"
                                    : isLive
                                    ? "text-surface-white"
                                    : "text-text-muted"
                                }`}
                              >
                                {isScheduled ? "-" : match.home_score}
                              </span>
                              <div className="w-3 h-[1px] bg-gray-700/50 my-0.5" />
                              <span
                                className={`text-xs sm:text-sm font-black leading-tight ${
                                  awayWinning
                                    ? "text-brand-yellow"
                                    : isScheduled
                                    ? "text-text-muted"
                                    : isLive
                                    ? "text-surface-white"
                                    : "text-text-muted"
                                }`}
                              >
                                {isScheduled ? "-" : match.away_score}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-gray-600 group-hover:text-brand-green transition-colors">
                              <span className="hidden md:inline text-[11px] font-bold uppercase tracking-widest">
                                {isScheduled ? "Preview" : "Stats"}
                              </span>
                              <ChevronRight
                                size={18}
                                className="group-hover:translate-x-0.5 transition-transform"
                              />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SportScore Attribution (Required by API) */}
        <div className="mt-10 text-center border-t border-gray-700/50 pt-5">
          <p className="text-xs text-text-muted tracking-wide">
            Live data provided by{" "}
            <a
              href="https://sportscore.com/"
              rel="dofollow"
              target="_blank"
              className="text-brand-green hover:text-brand-green-dark font-bold transition-colors"
            >
              SportScore
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
