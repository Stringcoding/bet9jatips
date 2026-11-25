"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Loader2, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function AdminUsersPage() {
  const supabase = createClient();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gate_access")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRecords(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Function to manually verify a user
  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    
    // Update the status to 'verified'
    const { error } = await supabase
      .from("gate_access")
      .update({ verification_status: "verified" })
      .eq("id", id);

    if (error) {
      alert("Error verifying user: " + error.message);
    } else {
      // Refresh the local state instantly
      setRecords((prev) => 
        prev.map((record) => 
          record.id === id ? { ...record, verification_status: "verified" } : record
        )
      );
    }
    
    setVerifyingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <span className="flex items-center gap-1 w-fit bg-brand-green/10 text-brand-green px-2 py-1 rounded text-xs font-bold border border-brand-green/20"><CheckCircle2 size={12}/> Verified</span>;
      case "verifying":
        return <span className="flex items-center gap-1 w-fit bg-brand-yellow/10 text-brand-yellow px-2 py-1 rounded text-xs font-bold border border-brand-yellow/20"><Clock size={12}/> Verifying</span>;
      case "failed":
        return <span className="flex items-center gap-1 w-fit bg-brand-red/10 text-brand-red px-2 py-1 rounded text-xs font-bold border border-brand-red/20"><XCircle size={12}/> Failed</span>;
      default:
        return <span className="flex items-center gap-1 w-fit bg-gray-700/50 text-text-muted px-2 py-1 rounded text-xs font-bold border border-gray-600"><Clock size={12}/> Pending</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-400/10 rounded-xl flex items-center justify-center">
            <Users className="text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-white">Users & Gate Access</h1>
            <p className="text-text-muted text-sm mt-1">Track and manually verify user attempts.</p>
          </div>
        </div>
        
        <button 
          onClick={fetchRecords}
          className="flex items-center gap-2 bg-bg-slate hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-700"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      <div className="bg-bg-slate rounded-xl border border-gray-700 overflow-hidden shadow-lg">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="animate-spin text-brand-green w-8 h-8" />
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-text-muted">No gate access records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-surface-white whitespace-nowrap">
              <thead className="bg-bg-deep text-text-muted uppercase text-xs border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Step 1 (Initial)</th>
                  <th className="px-6 py-4">Step 2 (Verification)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-bg-deep transition-colors">
                    
                    {/* User Details */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-surface-white">{record.username || "Unknown"}</span>
                        <span className="text-xs text-text-muted">{record.email || "No email"}</span>
                      </div>
                    </td>

                    {/* Step 1 Data */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-text-muted mb-1">Primary ID</span>
                        <span className="font-mono text-brand-yellow bg-brand-yellow/10 px-2 py-0.5 rounded w-fit">
                          {record.id_number || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Step 2 Data */}
                    <td className="px-6 py-4">
                      {record.id_type && record.verification_number ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-brand-green font-bold uppercase tracking-wider bg-brand-green/10 px-1.5 py-0.5 rounded w-fit">
                            {record.id_type}
                          </span>
                          <span className="font-mono text-surface-white bg-bg-deep px-2 py-1 rounded border border-gray-700 w-fit text-xs">
                            {record.verification_number}
                          </span>
                        </div>
                      ) : (
                        <span className="text-brand-red text-xs font-medium bg-brand-red/10 px-2 py-1 rounded">
                          Incomplete
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(record.verification_status)}
                    </td>

                    {/* Action Button */}
                    <td className="px-6 py-4">
                      {record.verification_status !== "verified" ? (
                        <button
                          onClick={() => handleVerify(record.id)}
                          disabled={verifyingId === record.id}
                          className="bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                        >
                          {verifyingId === record.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          Verify
                        </button>
                      ) : (
                        <span className="text-text-muted text-xs flex items-center gap-1">
                          <CheckCircle2 size={14} className="text-brand-green" /> Approved
                        </span>
                      )}
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
