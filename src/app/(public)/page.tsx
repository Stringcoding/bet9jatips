import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/features/tips/components/HeroSection";
import InfiniteTicker from "@/features/tips/components/InfiniteTicker";
import HowItWorks from "@/features/tips/components/HowItWorks";
import TopTipsters from "@/features/tips/components/TopTipsters";
import TipCard from "@/features/tips/components/TipCard";
import { Flame } from "lucide-react";

export default async function HomePage() {
  const cookieStore = await cookies();
  const gateToken = cookieStore.get("gate_token")?.value;
  const supabase = await createClient();

  let hasAccess = false;

  // Verify if the user has passed the gate form
  if (gateToken) {
    const { data } = await supabase
      .from("gate_access")
      .select("id")
      .eq("session_token", gateToken)
      .gt("expires_at", new Date().toISOString())
      .single();

    hasAccess = !!data;
  }

  return (
    <main className="min-h-screen pb-20 overflow-x-hidden">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Infinite Horizontal Scroll Ticker */}
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
            <span className="text-brand-yellow text-sm font-medium animate-pulse hidden sm:block">
              Pass the form to unlock codes →
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TipCard
            user="Mrgsports"
            odds="62.84"
            date="23/11/2026 18:21"
            code="62HXPN6"
            isLocked={!hasAccess} // <-- Passes the lock state
          />
          <TipCard
            user="iamjeffre_real"
            odds="124.97"
            date="23/11/2026 18:16"
            code="62HXFDL"
            isLocked={!hasAccess}
          />
          <TipCard
            user="SureBanker"
            odds="14.50"
            date="23/11/2026 17:00"
            code="99KLM2X"
            isLocked={!hasAccess}
          />
        </div>
      </section>
    </main>
  );
}
