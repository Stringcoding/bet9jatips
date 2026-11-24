import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import TipsGrid from "@/features/tips/components/TipsGrid";

export default async function TipsPage() {
  const cookieStore = await cookies();
  const gateToken = cookieStore.get("gate_token")?.value;
  const supabase = await createClient();

  let hasAccess = false;
  if (gateToken) {
    const { data } = await supabase
      .from("gate_access")
      .select("id")
      .eq("session_token", gateToken)
      .gt("expires_at", new Date().toISOString())
      .single();
    hasAccess = !!data;
  }

  // Fetch all active tips
  const { data: tips } = await supabase
    .from("tips")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-bg-deep pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-white mb-2">
          Today's <span className="text-brand-green">Coupon Codes</span>
        </h1>
        <p className="text-text-muted text-sm sm:text-base">
          Hand-picked, professionally analyzed Bet9ja booking codes. Updated daily.
        </p>
      </div>

      <TipsGrid initialTips={tips || []} hasAccess={hasAccess} />
    </div>
  );
}
