import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

import HeroSection from "@/features/tips/components/HeroSection";
import InfiniteTicker from "@/features/tips/components/InfiniteTicker";
import HowItWorks from "@/features/tips/components/HowItWorks";
import TopTipsters from "@/features/tips/components/TopTipsters";
import TipCard from "@/features/tips/components/TipCard";
import LiveScoreTicker from "@/features/live-scores/components/LiveScoreTicker";
import { Flame } from "lucide-react";
import Link from "next/link";

// Always fetch fresh server-side data.
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Tip {
  id: string;
  punter_name: string | null;
  total_odds: number | null;
  created_at: string;
  booking_code: string;
  punter_avatar_url: string | null;
  card_title: string | null;
}

export default async function HomePage() {
  const supabase = await createClient();
  const cookieStore = await cookies();

  // –––––––––––––––––––––––––
  // 1. CHECK ACCESS GATE
  // –––––––––––––––––––––––––
  const gateToken = cookieStore.get("gate_token")?.value;
  let hasAccess = false;

  if (gateToken) {
    const { data: gateAccess, error: gateError } = await supabase
      .from("gate_access")
      .select("id")
      .eq("session_token", gateToken)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (gateError) {
      console.error("Gate verification error:", gateError.message);
    }
    hasAccess = !!gateAccess;
  }

  // –––––––––––––––––––––––––
  // 2. FETCH RECENT ACTIVE TIPS
  // –––––––––––––––––––––––––
  const { data, error: tipsError } = await supabase
    .from("tips")
    .select(
      "id, punter_name, total_odds, created_at, booking_code, punter_avatar_url, card_title"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const tips: Tip[] = data ?? [];

  // –––––––––––––––––––––––––
  // 3. SERVER LOGGING
  // –––––––––––––––––––––––––
  if (tipsError) {
    console.error("Recent tips fetch failed:", tipsError.message);
  }

  console.log("Homepage data status:", {
    tipsCount: tips.length,
    hasAccess,
    tipsError: tipsError?.message ?? null,
  });

  // –––––––––––––––––––––––––
  // 4. RENDER HOMEPAGE
  // –––––––––––––––––––––––––
  return (
    <main className="min-h-screen pb-20 overflow-x-hidden">
      
      <HeroSection />

      {/* Infinite Winning Tickets */}
      <InfiniteTicker />

      {/* Recent Tips */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Flame className="text-brand-red w-8 h-8" />
            <h2 className="text-3xl font-extrabold text-surface-white">
              Recent Tips
            </h2>
          </div>

          {!hasAccess && (
            <Link
              href="/gate"
              className="text-brand-yellow text-sm font-medium animate-pulse hover:underline"
            >
              Unlock codes →
            </Link>
          )}
        </div>

        {/* Tips Grid */}
        {tipsError ? (
          <div className="text-center py-12 text-red-400 bg-bg-slate rounded-xl border border-red-500/20">
            Unable to load recent tips. Please try again later.
          </div>
        ) : tips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <TipCard
                key={tip.id}
                user={tip.punter_name || "Unknown"}
                odds={tip.total_odds?.toString() || "0"}
                date={new Date(tip.created_at).toLocaleDateString("en-GB")}
                code={tip.booking_code || ""}
                avatarUrl={tip.punter_avatar_url || undefined}
                cardTitle={tip.card_title || "Multiple"}
                isVerified={true}
                isLocked={!hasAccess}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-muted bg-bg-slate rounded-xl border border-gray-700/50">
            <Flame className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <h3 className="text-surface-white font-bold text-lg mb-1">
              No Active Tips Yet
            </h3>
            <p className="text-sm">
              Check back soon for the latest betting tips.
            </p>
          </div>
        )}
      </section>

      {/* How It Works */}
      <HowItWorks />

      <LiveScoreTicker />

      {/* Top Tipsters */}
      <TopTipsters />

      

    </main>
  );
}
