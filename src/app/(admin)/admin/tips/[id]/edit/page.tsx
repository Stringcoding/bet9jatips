"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { Loader2, UploadCloud } from "lucide-react";

export default function EditTipPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const tipId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    punter_name: "",
    card_title: "",
    total_odds: "",
    booking_code: "",
    punter_avatar_url: "",
  });

  useEffect(() => {
    const fetchTip = async () => {
      const { data, error } = await supabase.from("tips").select("*").eq("id", tipId).single();
      if (data) {
        setFormData({
          punter_name: data.punter_name,
          card_title: data.card_title,
          total_odds: data.total_odds.toString(),
          booking_code: data.booking_code,
          punter_avatar_url: data.punter_avatar_url || "",
        });
      }
      setLoading(false);
    };
    fetchTip();
  }, [tipId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let avatarUrl = formData.punter_avatar_url;

    // Upload new image if selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, imageFile);
      
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);
        avatarUrl = publicUrl;
      }
    }

    // Update Database
    const { error } = await supabase.from("tips").update({
      punter_name: formData.punter_name,
      card_title: formData.card_title,
      total_odds: formData.total_odds,
      booking_code: formData.booking_code,
      punter_avatar_url: avatarUrl,
    }).eq("id", tipId);

    setSaving(false);

    if (error) {
      alert("Error updating: " + error.message);
    } else {
      router.push("/admin/tips");
      router.refresh();
    }
  };

  if (loading) return <div className="p-12 text-center text-white">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Tip</h1>
      
      <form onSubmit={handleSubmit} className="bg-bg-slate p-6 rounded-xl border border-gray-700 flex flex-col gap-5">
        
        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-text-muted">Punter Image</label>
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center bg-bg-deep hover:border-brand-green transition relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {imageFile ? (
              <span className="text-brand-green text-sm">{imageFile.name}</span>
            ) : formData.punter_avatar_url ? (
              <div className="flex flex-col items-center">
                <img src={formData.punter_avatar_url} alt="Current" className="w-16 h-16 rounded-full object-cover mb-2" />
                <span className="text-xs text-text-muted">Click to change image</span>
              </div>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-text-muted mb-2" />
                <span className="text-sm text-text-muted">Click to upload image</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-text-muted">Punter Name</label>
          <input required value={formData.punter_name}
            onChange={(e) => setFormData({...formData, punter_name: e.target.value})}
            className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-green" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-text-muted">Card Subtitle</label>
          <input required value={formData.card_title}
            onChange={(e) => setFormData({...formData, card_title: e.target.value})}
            className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-green" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-muted">Total Odds</label>
            <input required type="number" step="0.01" value={formData.total_odds}
              onChange={(e) => setFormData({...formData, total_odds: e.target.value})}
              className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-green" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-muted">Booking Code</label>
            <input required value={formData.booking_code}
              onChange={(e) => setFormData({...formData, booking_code: e.target.value})}
              className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-green" />
          </div>
        </div>

        <div className="flex gap-4 mt-2">
          <button type="button" onClick={() => router.push('/admin/tips')} 
            className="flex-1 bg-bg-deep text-white font-bold py-3 rounded-lg border border-gray-700">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 rounded-lg flex justify-center items-center">
            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
