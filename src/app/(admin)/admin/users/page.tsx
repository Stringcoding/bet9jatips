"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Loader2, ShieldCheck, Mail, Fingerprint, Phone } from "lucide-react";

export default function AdminUsersPage() {
  const supabase = createClient();
  const [gateAccessData, setGateAccessData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGateData = async () => {
      const { data, error } = await supabase
        .from("gate_access")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setGateAccessData(data);
      }
      setLoading(false);
    };

    fetchGateData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-400/10 rounded-xl flex items-center justify-center">
          <Users className="text-blue-400 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-surface-white">Users & Gate Access</h1>
          <p className="text-text-muted text-sm mt-1">View all users who have attempted to access the coupon codes.</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-bg-slate rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="animate-spin text-brand-green w-8 h-8" />
          </div>
        ) : gateAccessData.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            No gate access records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-surface-white whitespace-nowrap">
              <thead className="bg-bg-deep text-text-muted uppercase text-xs border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Primary ID (Step 1)</th>
                  <th className="px-6 py-4">Verify Type (Step 2)</th>
                  <th className="px-6 py-4">Verify ID (Step 2)</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {gateAccessData.map((record) => (
                  <tr key={record.id} className="hover:bg-bg-deep transition-colors">
                    
                    {/* Username */}
                    <td className="px-6 py-4 flex items-center gap-2 font-bold">
                      {record.username || "N/A"}
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-text-muted">
                      {record.email || "N/A"}
                    </td>

                    {/* Primary ID (from Step 1) */}
                    <td className="px-6 py-4 font-mono text-xs text-brand-yellow">
                      {record.id_number || "N/A"}
                    </td>

                    {/* Verification Type (from Step 2) */}
                    <td className="px-6 py-4">
                      {record.id_type ? (
                        <span className="bg-brand-green/10 text-brand-green px-2 py-1 rounded text-xs font-bold border border-brand-green/20">
                          {record.id_type}
                        </span>
                      ) : (
                        <span className="text-text-muted italic text-xs">Pending...</span>
                      )}
                    </td>

                    {/* Verification ID (from Step 2) */}
                    <td className="px-6 py-4 font-mono text-xs">
                      {record.id_type ? (
                        // Assuming they re-entered a different ID in step 2
                        // If you used a separate column for step 2 ID, put it here
                        <span className="text-surface-white">{record.id_number}</span> 
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        record.verification_status === 'verifying' 
                          ? "bg-brand-yellow/20 text-brand-yellow" 
                          : record.verification_status === 'verified'
                          ? "bg-brand-green/20 text-brand-green"
                          : "bg-brand-red/20 text-brand-red"
                      }`}>
                        {record.verification_status?.toUpperCase() || "PENDING"}
                      </span>
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
