import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.SPORTMONKS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  try {
    // 1. Fetch Live Matches from Sportmonks
    // We include participants (teams) and league data
    const response = await fetch(
      `https://api.sportmonks.com/v3/football/livescores/inplay?api_token=${apiKey}&include=participants;league;scores`,
      { cache: "no-store" } // Ensure fresh data on every request
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Sportmonks");
    }

    const json = await response.json();
    const rawMatches = json.data || [];

    // 2. Format the data for our UI
    const formattedMatches = rawMatches.map((match: any) => {
      // Find home and away teams from the participants array
      const homeTeam = match.participants?.find((p: any) => p.meta?.location === 'home')?.name || "Home";
      const awayTeam = match.participants?.find((p: any) => p.meta?.location === 'away')?.name || "Away";
      
      // Get scores
      const homeScore = match.scores?.find((s: any) => s.score?.participant === 'home' && s.description === 'CURRENT')?.score?.goals || 0;
      const awayScore = match.scores?.find((s: any) => s.score?.participant === 'away' && s.description === 'CURRENT')?.score?.goals || 0;

      // Get minute or match state
      const minute = match.periods?.[0]?.minutes || match.minute || 0;

      return {
        id: match.id,
        name: match.name,
        state: match.state_id, // 2 = LIVE, etc.
        minute: minute,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: homeScore,
        awayScore: awayScore,
        league: match.league?.name || "Unknown League",
      };
    });

    return NextResponse.json({ matches: formattedMatches });
    
  } catch (error: any) {
    console.error("Live Score API Error:", error.message);
    return NextResponse.json({ error: "Failed to load live scores" }, { status: 500 });
  }
}
