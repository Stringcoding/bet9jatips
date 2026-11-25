import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import TipsGrid from "@/features/tips/components/TipsGrid";

// Add force-dynamic to ensure pagination works instantly
export const dynamic = 'force-dynamic';

interface TipsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TipsPage({ searchParams }: TipsPageProps) {
  const cookieStore = await cookies();
  const gateToken = cookieStore.get("gate_token")?.value;
  const supabase = await createClient();

  // 1. Check Gate Access
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

  // 2. Pagination Logic
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const itemsPerPage = 6;
  
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // 3. Fetch only 6 tips for the current page
  const { data: tips, count } = await supabase
    .from("tips")
    .select("*", { count: "exact" }) // Get total count for pagination
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

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

      <TipsGrid 
        initialTips={tips || []} 
        hasAccess={hasAccess} 
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
