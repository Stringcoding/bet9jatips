import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/features/tips/components/HeroSection";
import InfiniteTicker from "@/features/tips/components/InfiniteTicker";
import HowItWorks from "@/features/tips/components/HowItWorks";
import TopTipsters from "@/features/tips/components/TopTipsters";
import TipCard from "@/features/tips/components/TipCard";
import { Flame } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const cookieStore = await cookies();
  const gateToken = cookieStore.get("gate_token")?.value;
  const supabase = await createClient();

  let hasAccess = false;

  // 1. Verify if the user has passed the gate form
  if (gateToken) {
    const { data } = await supabase
      .from("gate_access")
      .select("id")
      .eq("session_token", gateToken)
      .gt("expires_at", new Date().toISOString())
      .single();

    hasAccess = !!data;
  }

  // 2. Fetch the latest 3 active tips from Supabase
  const { data: tips } = await supabase
    .from("tips")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen pb-20 overflow-x-hidden">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Infinite Horizontal Scroll Ticker (Public) */}
      <InfiniteTicker />

      {/* 3. How It Works Section */}
      <HowItWorks />

      {/* 4. Top Tipsters Leaderboard Section */}
      <TopTipsters />

      {/* 5. Recent Tips Section (With Locking Logic) */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Flame className="text-brand-red w-8 h-8" />
            <h2 className="text-3xl font-extrabold text-surface-white">Recent Tips</h2>
          </div>
          
          {/* Show a subtle prompt if locked */}
          {!hasAccess && (
            <Link 
              href="/gate" 
              className="text-brand-yellow text-sm font-medium animate-pulse hidden sm:block hover:underline"
            >
              Pass the form to unlock codes →
            </Link>
          )}
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips && tips.length > 0 ? (
            tips.map((tip) => (
              <TipCard
                key={tip.id}
                user={tip.punter_name || "Unknown"}
                odds={tip.total_odds?.toString() || "0"}
                date={new Date(tip.created_at).toLocaleDateString()}
                code={tip.booking_code}
                avatarUrl={tip.punter_avatar_url}
                cardTitle={tip.card_title}
                isLocked={!hasAccess}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-text-muted bg-bg-slate rounded-xl border border-gray-700/50">
              No active tips available right now. Check back later!
            </div>
          )}
        </div>

        {/* View All Button */}
        {tips && tips.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link 
              href="/tips"
              className="bg-bg-slate hover:bg-gray-700 text-surface-white font-bold py-3 px-8 rounded-xl transition-colors border border-gray-700/50"
            >
              View All Tips
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
