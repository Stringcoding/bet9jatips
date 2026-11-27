import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get("secret");
  const authHeader = request.headers.get("authorization");
  
  const cronSecret = process.env.CRON_SECRET;
  
  const isAuthorized = 
    authHeader === `Bearer ${cronSecret}` || 
    querySecret === cronSecret;

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized: Secret mismatch" }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Missing Supabase Environment Variables" }, { status: 500 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const res = await fetch(
      "https://sportscore.com/api/widget/matches/?sport=football&limit=15&src=bet9jatips",
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ error: `SportScore API returned ${res.status}` }, { status: 500 });
    }

    const json = await res.json();
    const matches = json.matches || json.data || []; // Handle different root structures

    // ✅ FILTER OUT INVALID MATCHES AND MAP FIELDS SAFELY
    const formattedMatches = matches
      .filter((match: any) => match && (match.id || match.matchId)) // Skip if no ID
      .map((match: any) => {
        // Safely extract the ID
        const matchId = match.id || match.matchId;
        
        // Safely extract teams (handling different API key formats)
        const home = match.homeTeam?.name || match.home?.name || "Home";
        const away = match.awayTeam?.name || match.away?.name || "Away";
        
        // Safely extract scores
        const homeScore = match.homeScore ?? match.home?.score ?? 0;
        const awayScore = match.awayScore ?? match.away?.score ?? 0;

        // Safely extract league
        const league = match.competition?.name || match.league?.name || "Football";
        
        // Safely extract minute/time
        const minute = match.time || match.minute || "LIVE";

        return {
          id: matchId.toString(),
          league: league,
          home_team: home,
          away_team: away,
          home_score: Number(homeScore),
          away_score: Number(awayScore),
          minute: minute.toString(),
          status: match.status || "inplay",
          updated_at: new Date().toISOString(),
        };
      });

    if (formattedMatches.length > 0) {
      const { error } = await supabase
        .from("live_scores")
        .upsert(formattedMatches, { onConflict: "id" });

      if (error) {
        return NextResponse.json({ error: `Supabase Error: ${error.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, count: formattedMatches.length });
  } catch (error: any) {
    return NextResponse.json({ error: `System Error: ${error.message}` }, { status: 500 });
  }
}
