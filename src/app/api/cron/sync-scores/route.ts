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

  // ✅ WE USE THE SERVICE ROLE KEY HERE, NOT THE PUBLISHABLE KEY
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Missing Supabase Environment Variables (URL or SERVICE_ROLE_KEY)" }, { status: 500 });
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
    const matches = json.matches || [];

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

      if (error) {
        return NextResponse.json({ error: `Supabase Error: ${error.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, count: formattedMatches.length });
  } catch (error: any) {
    return NextResponse.json({ error: `System Error: ${error.message}` }, { status: 500 });
  }
}
