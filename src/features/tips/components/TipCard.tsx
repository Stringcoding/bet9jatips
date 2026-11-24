"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2 } from "lucide-react";

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

    let avatarUrl = "";

    // 1. Upload Image to Supabase Storage
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

      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);
      avatarUrl = publicUrl;
    }

    // 2. Insert Tip into Database
    const { error } = await supabase.from("tips").insert({
      punter_name: punterName,
      punter_avatar_url: avatarUrl,
      total_odds: odds,
      booking_code: code,
      card_title: cardTitle,
      risk_level: "Medium", // Default, you can add a dropdown for this
      league: "EPL", // Default, you can add a dropdown for this
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
      <h1 className="text-2xl font-bold text-surface-white mb-6">Create New Tip</h1>
      
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

        {/* Card Title */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-text-muted">Card Subtitle (e.g. Multiple)</label>
          <input name="cardTitle" required defaultValue="Multiple" 
            className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white focus:border-brand-green outline-none" />
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
              className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white focus:border-brand-green outline-none" />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 rounded-lg mt-2 flex justify-center items-center gap-2">
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Publish Tip"}
        </button>
      </form>
    </div>
  );
}
