import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function isFinishedMatch(match: any): boolean {
  const status = String(match?.status || "").toLowerCase();
  const statusText = String(match?.status_text || "").toLowerCase();
  return (
    status === "finished" ||
    status === "ended" ||
    status === "ft" ||
    statusText === "finished" ||
    statusText === "ft"
  );
}

function isLiveMatch(match: any): boolean {
  if (isFinishedMatch(match)) return false;
  const status = String(match?.status || "").toLowerCase();
  return (
    status === "inplay" ||
    status === "live" ||
    Boolean(match?.live_minute)
  );
}

// Get target Saturday date string (YYYY-MM-DD) in Africa/Lagos (WAT)
function getTargetSaturdayDateWAT(): string {
  const now = new Date();
  const watParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(now);

  const year = Number(watParts.find((p) => p.type === "year")?.value);
  const month = Number(watParts.find((p) => p.type === "month")?.value);
  const day = Number(watParts.find((p) => p.type === "day")?.value);
  const weekday = watParts.find((p) => p.type === "weekday")?.value || "";

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const currentDow = dayMap[weekday] ?? now.getUTCDay();
  const daysUntilSaturday = (6 - currentDow + 7) % 7;

  const target = new Date(Date.UTC(year, month - 1, day + daysUntilSaturday));
  return target.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getMatchDateWAT(isoTime?: string): string | null {
  if (!isoTime) return null;
  const parsed = new Date(isoTime);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
}

function formatKickoffTimeWAT(isoTime?: string): string {
  if (!isoTime) return "SOON";
  const parsed = new Date(isoTime);
  if (Number.isNaN(parsed.getTime())) return "SOON";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsed);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get("secret");
  const authHeader = request.headers.get("authorization");

  const cronSecret = process.env.CRON_SECRET;

  const isAuthorized =
    authHeader === `Bearer ${cronSecret}` || querySecret === cronSecret;

  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Unauthorized: Secret mismatch" },
      { status: 401 }
    );
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      { error: "Missing Supabase Environment Variables" },
      { status: 500 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const targetSaturday = getTargetSaturdayDateWAT();

    // Fetch live matches + upcoming/scheduled matches across all countries in parallel (max 50 per call)
    const [liveRes, scheduledRes, generalRes] = await Promise.all([
      fetch(
        "https://sportscore.com/api/widget/matches/?sport=football&status=live&limit=50&src=bet9jatips",
        { cache: "no-store" }
      ),
      fetch(
        `https://sportscore.com/api/widget/matches/?sport=football&status=scheduled&date=${targetSaturday}&limit=50&src=bet9jatips`,
        { cache: "no-store" }
      ),
      fetch(
        "https://sportscore.com/api/widget/matches/?sport=football&limit=50&src=bet9jatips",
        { cache: "no-store" }
      ),
    ]);

    if (!liveRes.ok && !scheduledRes.ok && !generalRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch matches from SportScore API" },
        { status: 500 }
      );
    }

    const [liveJson, scheduledJson, generalJson] = await Promise.all([
      liveRes.ok ? liveRes.json() : Promise.resolve({ matches: [] }),
      scheduledRes.ok ? scheduledRes.json() : Promise.resolve({ matches: [] }),
      generalRes.ok ? generalRes.json() : Promise.resolve({ matches: [] }),
    ]);

    const rawMatches = [
      ...(liveJson.matches || []),
      ...(scheduledJson.matches || []),
      ...(generalJson.matches || []),
    ];

    // Deduplicate by match URL and exclude any FT / finished games
    const uniqueMatchesMap = new Map<string, any>();

    for (const match of rawMatches) {
      if (!match || !match.url) continue;

      // 1. Wipe/skip all finished (FT) games
      if (isFinishedMatch(match)) continue;

      const isLive = isLiveMatch(match);
      const matchDateWAT = getMatchDateWAT(match.time);
      const isSaturdayUpcoming = !isLive && matchDateWAT === targetSaturday;

      // 2. Keep all currently LIVE matches + Saturday upcoming matches across all countries
      if (!isLive && !isSaturdayUpcoming) continue;

      // Prefer live version if present in multiple feeds
      if (!uniqueMatchesMap.has(match.url) || isLive) {
        uniqueMatchesMap.set(match.url, match);
      }
    }

    const filteredMatches = Array.from(uniqueMatchesMap.values());

    // Sort: LIVE games first, then Saturday upcoming games sorted by kickoff time
    filteredMatches.sort((a, b) => {
      const aLive = isLiveMatch(a) ? 0 : 1;
      const bLive = isLiveMatch(b) ? 0 : 1;
      if (aLive !== bLive) return aLive - bLive;

      const aTime = a.time ? new Date(a.time).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.time ? new Date(b.time).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });

    const formattedMatches = filteredMatches.map((match: any) => {
      const matchId = match.url.replace(/\//g, "-");
      const live = isLiveMatch(match);

      let minuteDisplay = "SOON";
      if (live) {
        if (match.live_minute) {
          minuteDisplay = `${match.live_minute}'`;
        } else if (
          String(match.status_text || "").toUpperCase() === "HT" ||
          String(match.status || "").toLowerCase() === "halftime"
        ) {
          minuteDisplay = "HT";
        } else {
          minuteDisplay = match.status_text || "LIVE";
        }
      } else {
        // Upcoming Saturday game: show kickoff time in WAT (e.g., "15:00")
        minuteDisplay = formatKickoffTimeWAT(match.time);
      }

      const countryPrefix = match.country ? `${match.country}: ` : "";
      const leagueLabel =
        match.competition &&
        match.country &&
        !String(match.competition)
          .toLowerCase()
          .startsWith(String(match.country).toLowerCase())
          ? `${countryPrefix}${match.competition}`
          : match.competition || "Football";

      return {
        id: matchId,
        league: leagueLabel,
        country_logo: match.country_logo || null,
        home_team: match.home || "Home",
        away_team: match.away || "Away",
        home_logo: match.home_logo || null,
        away_logo: match.away_logo || null,
        home_score: Number(match.home_score) || 0,
        away_score: Number(match.away_score) || 0,
        minute: minuteDisplay,
        status: live ? "inplay" : "scheduled",
        updated_at: new Date().toISOString(),
      };
    });

    // Always wipe old rows (including any previous FT matches)
    await supabase.from("live_scores").delete().neq("id", "none");

    if (formattedMatches.length > 0) {
      const { error } = await supabase
        .from("live_scores")
        .upsert(formattedMatches, { onConflict: "id" });

      if (error) {
        return NextResponse.json(
          { error: `Supabase Error: ${error.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      saturdayDate: targetSaturday,
      liveCount: formattedMatches.filter((m) => m.status === "inplay").length,
      upcomingSaturdayCount: formattedMatches.filter(
        (m) => m.status === "scheduled"
      ).length,
      totalCount: formattedMatches.length,
    });
  } catch (error: any) {
    console.error("Sync Error:", error.message);
    return NextResponse.json(
      { error: `System Error: ${error.message}` },
      { status: 500 }
    );
  }
}
