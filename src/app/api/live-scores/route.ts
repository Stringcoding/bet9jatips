import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // 1. Security Check (Supports both Header and Query Param)
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get("secret");
  const authHeader = request.headers.get("authorization");
  
  const cronSecret = process.env.CRON_SECRET;
  
  const isAuthorized = 
    authHeader === `Bearer ${cronSecret}` || 
    querySecret === cronSecret;

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use Service Role Key to bypass RLS for backend writing
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 2. Fetch live matches from SportScore
    const res = await fetch(
      "https://sportscore.com/api/widget/matches/?sport=football&limit=15&src=bet9jatips",
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch from SportScore");

    const { matches } = await res.json();

    // 3. Format and Upsert into Supabase
    const formattedMatches = matches.map((match: any) => ({
      id: match.id.toString(),
      league: match.competition?.name || "Football",
      home_team: match.homeTeam?.name || "Home",
      away_team: match.awayTeam?.name || "Away",
      home_score: match.homeScore || 0,
      away_score: match.awayScore || 0,
      minute: match.time || "LIVE",
      status: match.status || "inplay",
      updated_at: new Date().toISOString(),
    }));

    if (formattedMatches.length > 0) {
      const { error } = await supabase
        .from("live_scores")
        .upsert(formattedMatches, { onConflict: "id" });

      if (error) throw error;
    }

    return NextResponse.json({ success: true, count: formattedMatches.length });
  } catch (error: any) {
    console.error("Sync Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
