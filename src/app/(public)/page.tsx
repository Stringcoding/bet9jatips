import HeroSection from "@/features/tips/components/HeroSection";
import InfiniteTicker from "@/features/tips/components/InfiniteTicker";
import HowItWorks from "@/features/tips/components/HowItWorks";
import TopTipsters from "@/features/tips/components/TopTipsters";
import TipCard from "@/features/tips/components/TipCard";
import { Flame } from "lucide-react";

export default function HomePage() {
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

      {/* 5. Recent Tips Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 mb-8">
          <Flame className="text-brand-red w-8 h-8" />
          <h2 className="text-3xl font-extrabold text-surface-white">Recent Tips</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Data */}
          <TipCard 
            user="Mrgsports" 
            odds="62.84" 
            date="23/11/2026 18:21" 
            code="62HXPN6" 
          />
          <TipCard 
            user="iamjeffre_real" 
            odds="124.97" 
            date="23/11/2026 18:16" 
            code="62HXFDL" 
          />
          <TipCard 
            user="SureBanker" 
            odds="14.50" 
            date="23/11/2026 17:00" 
            code="99KLM2X" 
          />
        </div>
      </section>

    </main>
  );
}
