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
    // Fetch live matches from SportScore
    const res = await fetch(
      "https://sportscore.com/api/widget/matches/?sport=football&status=live&limit=20&src=bet9jatips",
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ error: `SportScore API returned ${res.status}` }, { status: 500 });
    }

    const json = await res.json();
    const matches = json.matches || []; 

    // Map the exact structure from SportScore to our Supabase table
    const formattedMatches = matches
      .filter((match: any) => match && match.url) 
      .map((match: any) => {
        
        const matchId = match.url.replace(/\//g, '-');
        
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
          // ✅ ADDED: Map the logos from SportScore
          home_logo: match.home_logo || null,
          away_logo: match.away_logo || null,
          home_score: Number(match.home_score) || 0,
          away_score: Number(match.away_score) || 0,
          minute: minuteDisplay,
          status: match.status || "inplay",
          updated_at: new Date().toISOString(),
        };
      });

    // Clear out old data and insert new (prevents ghost matches)
    if (formattedMatches.length > 0) {
      await supabase.from("live_scores").delete().neq("id", "none");
      
      const { error } = await supabase
        .from("live_scores")
        .upsert(formattedMatches, { onConflict: "id" });

      if (error) {
        return NextResponse.json({ error: `Supabase Error: ${error.message}` }, { status: 500 });
      }
    } else {
       // If no live matches right now, empty the table
       await supabase.from("live_scores").delete().neq("id", "none");
    }

    return NextResponse.json({ success: true, count: formattedMatches.length });
  } catch (error: any) {
    console.error("Sync Error:", error.message);
    return NextResponse.json({ error: `System Error: ${error.message}` }, { status: 500 });
  }
}
