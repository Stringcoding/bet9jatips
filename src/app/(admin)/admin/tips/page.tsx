"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Edit, Trash2, Plus, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminManageTipsPage() {
  const supabase = createClient();
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tips
  const fetchTips = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tips")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTips(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTips();
  }, []);

  // Toggle Active Status
  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("tips")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (!error) {
      fetchTips(); // Refresh list
    } else {
      alert("Error updating status: " + error.message);
    }
  };

  // Delete Tip
  const deleteTip = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tip? This cannot be undone.")) return;

    const { error } = await supabase.from("tips").delete().eq("id", id);

    if (!error) {
      fetchTips(); // Refresh list
    } else {
      alert("Error deleting tip: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-white">Manage Recent Tips</h1>
          <p className="text-text-muted text-sm mt-1">Create, edit, and control which tips are visible on the homepage.</p>
        </div>
        <Link 
          href="/admin/tips/new" 
          className="bg-brand-green hover:bg-brand-green-dark text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Create New Tip
        </Link>
      </div>

      <div className="bg-bg-slate rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="animate-spin text-brand-green w-8 h-8" />
          </div>
        ) : tips.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            No tips found. Click "Create New Tip" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-surface-white">
              <thead className="bg-bg-deep text-text-muted uppercase text-xs border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4">Punter</th>
                  <th className="px-6 py-4">Booking Code</th>
                  <th className="px-6 py-4">Odds</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {tips.map((tip) => (
                  <tr key={tip.id} className="hover:bg-bg-deep transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden relative flex items-center justify-center text-xs font-bold">
                        {tip.punter_avatar_url ? (
                          <img src={tip.punter_avatar_url} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          tip.punter_name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="font-bold">{tip.punter_name || "Unknown"}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-brand-yellow">
                      {tip.booking_code}
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-green">
                      {tip.total_odds}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        tip.is_active 
                          ? "bg-brand-green/20 text-brand-green" 
                          : "bg-brand-red/20 text-brand-red"
                      }`}>
                        {tip.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => toggleActive(tip.id, tip.is_active)}
                        className="p-2 text-text-muted hover:text-brand-yellow transition-colors"
                        title={tip.is_active ? "Hide from Homepage" : "Show on Homepage"}
                      >
                        {tip.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <Link 
                        href={`/admin/tips/${tip.id}/edit`}
                        className="p-2 text-text-muted hover:text-blue-400 transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => deleteTip(tip.id)}
                        className="p-2 text-text-muted hover:text-brand-red transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
