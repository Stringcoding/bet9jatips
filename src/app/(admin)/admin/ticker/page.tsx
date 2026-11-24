"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Loader2, Trophy } from "lucide-react";

export default function AdminTickerPage() {
  const supabase = createClient();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch all ticker tickets
  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("winning_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTickets(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Add a new ticket
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const odds = formData.get("odds") as string;
    const stake = formData.get("stake") as string;
    const returnAmt = formData.get("returnAmt") as string;
    const code = formData.get("code") as string;
    const time = formData.get("time") as string;

    const { error } = await supabase.from("winning_tickets").insert({
      odds: parseFloat(odds),
      stake: parseFloat(stake),
      return_amount: parseFloat(returnAmt),
      booking_code: code.toUpperCase(),
      time: time,
    });

    setSaving(false);

    if (error) {
      alert("Error adding ticket: " + error.message);
    } else {
      (e.target as HTMLFormElement).reset();
      fetchTickets(); // Refresh list
    }
  };

  // Delete a ticket
  const deleteTicket = async (id: string) => {
    if (!confirm("Are you sure you want to delete this winning ticket?")) return;

    const { error } = await supabase.from("winning_tickets").delete().eq("id", id);

    if (!error) {
      fetchTickets();
    } else {
      alert("Error deleting ticket: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-brand-yellow/10 rounded-xl flex items-center justify-center">
          <Trophy className="text-brand-yellow w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-surface-white">Manage Winning Ticker</h1>
          <p className="text-text-muted text-sm mt-1">These tickets scroll infinitely on the homepage.</p>
        </div>
      </div>

      {/* Add New Ticket Form */}
      <div className="bg-bg-slate p-6 rounded-xl border border-gray-700 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Add New Winning Ticket</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          
          <div className="flex flex-col gap-2">
            <label className="text-xs text-text-muted">Total Odds</label>
            <input required name="odds" type="number" step="0.01" placeholder="e.g. 23.50" 
              className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-green" />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs text-text-muted">Stake (₦)</label>
            <input required name="stake" type="number" placeholder="e.g. 1000" 
              className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-green" />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs text-text-muted">Return (₦)</label>
            <input required name="returnAmt" type="number" placeholder="e.g. 23500" 
              className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-green" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-text-muted">Time</label>
            <input required name="time" placeholder="e.g. 14:32" 
              className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-green" />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs text-text-muted">Bet ID</label>
            <input required name="code" placeholder="e.g. B9VD689375842U5-1302669" 
              className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-green uppercase font-mono" />
          </div>

          <button type="submit" disabled={saving}
            className="md:col-span-3 bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 mt-2 transition-colors">
            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <><Plus size={18} /> Add to Ticker</>}
          </button>
        </form>
      </div>

      {/* Existing Tickets List */}
      <div className="bg-bg-slate rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="animate-spin text-brand-green w-8 h-8" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-text-muted">No winning tickets in the ticker yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-surface-white">
              <thead className="bg-bg-deep text-text-muted uppercase text-xs border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4">Bet ID</th>
                  <th className="px-6 py-4">Odds</th>
                  <th className="px-6 py-4">Stake</th>
                  <th className="px-6 py-4">Return</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-bg-deep transition-colors">
                    <td className="px-6 py-4 font-mono text-brand-yellow text-xs">{ticket.booking_code}</td>
                    <td className="px-6 py-4 font-bold text-brand-green">{ticket.odds}</td>
                    <td className="px-6 py-4">₦{ticket.stake.toLocaleString()}</td>
                    <td className="px-6 py-4 text-brand-green font-bold">₦{ticket.return_amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-text-muted">{ticket.time}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteTicket(ticket.id)}
                        className="p-2 text-text-muted hover:text-brand-red transition-colors">
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
