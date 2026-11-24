"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Ticket, Trophy, Users, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const supabase = createClient();
  
  const [stats, setStats] = useState({
    totalTips: 0,
    activeTips: 0,
    totalTickers: 0,
    totalUsers: 0,
  });
  
  const [recentTips, setRecentTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // 1. Fetch Tips Stats
      const { data: tips } = await supabase.from("tips").select("*").order("created_at", { ascending: false });
      
      // 2. Fetch Ticker Stats
      const { count: tickerCount } = await supabase.from("winning_tickets").select("*", { count: "exact", head: true });
      
      // 3. Fetch Users Stats
      const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });

      if (tips) {
        setStats({
          totalTips: tips.length,
          activeTips: tips.filter(t => t.is_active).length,
          totalTickers: tickerCount || 0,
          totalUsers: userCount || 0,
        });
        setRecentTips(tips.slice(0, 5)); // Just the top 5 for the preview
      }
      
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: "Total Tips", value: stats.totalTips, icon: Ticket, color: "text-brand-green", bg: "bg-brand-green/10" },
    { title: "Active Tips", value: stats.activeTips, icon: TrendingUp, color: "text-brand-yellow", bg: "bg-brand-yellow/10" },
    { title: "Winning Tickers", value: stats.totalTickers, icon: Trophy, color: "text-brand-red", bg: "bg-brand-red/10" },
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  ];

  if (loading) {
    return <div className="p-8 text-center text-text-muted">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-surface-white">Dashboard Overview</h1>
        <p className="text-text-muted mt-1">Welcome back, SuperAdmin. Here is your platform summary.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-bg-slate p-5 rounded-2xl border border-gray-700/50 flex items-center gap-4 hover:border-gray-600 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">{stat.title}</p>
                <p className="text-2xl font-extrabold text-surface-white mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Tips Preview */}
        <div className="bg-bg-slate rounded-2xl border border-gray-700/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-surface-white">Recent Tips</h2>
            <Link href="/admin/tips" className="text-sm text-brand-green hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="flex flex-col gap-3">
            {recentTips.map((tip) => (
              <div key={tip.id} className="flex justify-between items-center p-3 bg-bg-deep rounded-lg border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-bg-slate flex items-center justify-center text-xs font-bold text-brand-green overflow-hidden">
                    {tip.punter_avatar_url ? (
                      <img src={tip.punter_avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      tip.punter_name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{tip.punter_name}</p>
                    <p className="text-xs text-brand-yellow font-mono">{tip.booking_code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-green">{tip.total_odds} Odds</p>
                  <p className={`text-[10px] font-bold ${tip.is_active ? 'text-brand-green' : 'text-brand-red'}`}>
                    {tip.is_active ? 'ACTIVE' : 'HIDDEN'}
                  </p>
                </div>
              </div>
            ))}
            {recentTips.length === 0 && <p className="text-text-muted text-sm">No tips created yet.</p>}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-bg-slate rounded-2xl border border-gray-700/50 p-6">
          <h2 className="text-lg font-bold text-surface-white mb-6">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link href="/admin/tips/new" className="flex items-center justify-between p-4 bg-bg-deep hover:bg-gray-800 border border-gray-700/50 rounded-xl transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-green/10 rounded-lg">
                  <Ticket className="text-brand-green w-5 h-5" />
                </div>
                <div>
                  <p className="text-surface-white font-bold text-sm">Create New Tip</p>
                  <p className="text-text-muted text-xs">Add a booking code to the platform</p>
                </div>
              </div>
              <ArrowRight className="text-text-muted group-hover:text-brand-green transition-colors" size={18} />
            </Link>

            <Link href="/admin/ticker" className="flex items-center justify-between p-4 bg-bg-deep hover:bg-gray-800 border border-gray-700/50 rounded-xl transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-yellow/10 rounded-lg">
                  <Trophy className="text-brand-yellow w-5 h-5" />
                </div>
                <div>
                  <p className="text-surface-white font-bold text-sm">Update Winning Ticker</p>
                  <p className="text-text-muted text-xs">Add new winning tickets to the scroll</p>
                </div>
              </div>
              <ArrowRight className="text-text-muted group-hover:text-brand-yellow transition-colors" size={18} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
