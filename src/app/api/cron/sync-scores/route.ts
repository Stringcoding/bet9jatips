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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Map the EXACT structure from the screenshot
    const formattedMatches = matches
      .filter((match: any) => match && match.url) // Ensure there is a unique identifier
      .map((match: any) => {
        
        // Use the URL as the unique ID, stripping out slashes to keep it clean
        const matchId = match.url.replace(/\//g, '-');
        
        // Determine minute/status display
        let minuteDisplay = match.status_text || "LIVE";
        if (match.live_minute) {
          minuteDisplay = `${match.live_minute}'`;
        } else if (match.status === "finished") {
          minuteDisplay = "FT";
        }

        return {
          id: matchId,
          league: match.competition || "Football",
          home_team: match.home || "Home",
          away_team: match.away || "Away",
          home_score: Number(match.home_score) || 0,
          away_score: Number(match.away_score) || 0,
          minute: minuteDisplay,
          status: match.status || "inplay",
          updated_at: new Date().toISOString(),
        };
      });

    if (formattedMatches.length > 0) {
      // Use upsert to update existing matches, and insert new ones
      const { error } = await supabase
        .from("live_scores")
        .upsert(formattedMatches, { onConflict: "id" });

      if (error) {
        console.error("Supabase Insert Error:", error);
        return NextResponse.json({ error: `Supabase Error: ${error.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, count: formattedMatches.length });
  } catch (error: any) {
    console.error("System Error:", error);
    return NextResponse.json({ error: `System Error: ${error.message}` }, { status: 500 });
  }
}
