"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Check if the user is actually an admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setError("Access denied. You are not an administrator.");
      setLoading(false);
      return;
    }

    // Redirect to admin dashboard
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-slate p-8 rounded-2xl border border-gray-700 shadow-2xl">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-brand-green" />
          </div>
          <h1 className="text-2xl font-extrabold text-surface-white">Admin Portal</h1>
          <p className="text-text-muted text-sm mt-1">Authorized access only</p>
        </div>

        {error && (
          <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-muted font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-deep border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-surface-white focus:outline-none focus:border-brand-green"
                placeholder="admin@bet9jatips.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-muted font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-deep border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-surface-white focus:outline-none focus:border-brand-green"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-brand-green hover:bg-brand-green-dark text-surface-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-text-muted hover:text-brand-green transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
