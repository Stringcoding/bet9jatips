"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewTipPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const punterName = formData.get("punterName") as string;
    const odds = formData.get("odds") as string;
    const code = formData.get("code") as string;
    const cardTitle = formData.get("cardTitle") as string;
    const league = formData.get("league") as string;
    const matchesCount = formData.get("matchesCount") as string;
    const riskLevel = formData.get("riskLevel") as string;

    let avatarUrl = "";

    // 1. Upload Image
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("Error uploading image: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);
      avatarUrl = publicUrl;
    }

    // 2. Insert Tip
    const { error } = await supabase.from("tips").insert({
      punter_name: punterName,
      punter_avatar_url: avatarUrl,
      total_odds: parseFloat(odds),
      booking_code: code.toUpperCase(),
      card_title: cardTitle,
      league: league,
      matches_count: parseInt(matchesCount),
      risk_level: riskLevel,
      is_verified: true,
      is_active: true,
    });

    setLoading(false);

    if (error) {
      alert("Error saving tip: " + error.message);
    } else {
      router.push("/admin/tips");
      router.refresh();
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/tips" className="p-2 bg-bg-slate rounded-lg hover:bg-gray-700 transition-colors">
          <ArrowLeft size={20} className="text-white" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Create New Tip</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-bg-slate p-6 rounded-xl border border-gray-700 flex flex-col gap-5">
        
        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-text-muted">Punter Image</label>
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center bg-bg-deep hover:border-brand-green transition cursor-pointer relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-8 h-8 text-text-muted mb-2" />
            <span className="text-sm text-text-muted">
              {imageFile ? imageFile.name : "Click to upload image"}
            </span>
          </div>
        </div>

        {/* Punter Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-text-muted">Punter Name</label>
          <input name="punterName" required placeholder="e.g. Mrgsports" 
            className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white focus:border-brand-green outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Card Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-muted">Card Subtitle</label>
            <input name="cardTitle" required defaultValue="Multiple" 
              className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white focus:border-brand-green outline-none" />
          </div>

          {/* League */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-muted">League</label>
            <select name="league" className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white focus:border-brand-green outline-none">
              <option value="EPL">EPL</option>
              <option value="La Liga">La Liga</option>
              <option value="Serie A">Serie A</option>
              <option value="UCL">UCL</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
        </div>

        {/* Odds & Code Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-muted">Total Odds</label>
            <input name="odds" required placeholder="e.g. 62.84" type="number" step="0.01"
              className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white focus:border-brand-green outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-muted">Booking Code</label>
            <input name="code" required placeholder="e.g. 62HXPN6"
              className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white focus:border-brand-green outline-none uppercase font-mono" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Matches Count */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-muted">Matches Count</label>
            <input name="matchesCount" type="number" required defaultValue="1"
              className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white focus:border-brand-green outline-none" />
          </div>

          {/* Risk Level */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-muted">Risk Level</label>
            <select name="riskLevel" className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white focus:border-brand-green outline-none">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 rounded-lg mt-2 flex justify-center items-center gap-2 transition-colors">
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Publish Tip"}
        </button>
      </form>
    </div>
  );
}
