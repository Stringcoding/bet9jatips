"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";

export default function VerificationManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReviewing = searchParams.get("reviewing") === "true";

  const [status, setStatus] = useState<"idle" | "reviewing" | "failed">("idle");
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!isReviewing) return;

    setStatus("reviewing");
    setTimeLeft(60);

    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // After 60 seconds, trigger the failure
    const timer = setTimeout(() => {
      setStatus("failed");
      // Clear the URL param so they don't get stuck in a loop
      router.replace(window.location.pathname);
    }, 60000); // 1 Minute

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isReviewing, router]);

  if (status === "idle") return null;

  return (
    <>
      {/* 1. FIXED BANNER UNDER NAVBAR */}
      <div className="fixed top-16 left-0 right-0 z-[90] bg-brand-yellow text-bg-deep font-bold py-2 px-4 text-center text-sm shadow-md flex items-center justify-center gap-2 animate-in slide-in-from-top">
        {status === "reviewing" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Reviewing your credentials. Please wait ({timeLeft}s)...
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4" />
            Credentials invalid. You must retry.
          </>
        )}
      </div>

      {/* 2. FULL SYSTEM LOCK & MODAL */}
      {status === "failed" && (
        <div className="fixed inset-0 z-[100] bg-bg-deep/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-bg-slate border border-brand-red/50 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(227,30,36,0.3)] animate-in zoom-in-95">
            <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-brand-red" />
            </div>
            <h2 className="text-2xl font-extrabold text-surface-white mb-2">Access Denied</h2>
            <p className="text-text-muted text-sm mb-6">
              We could not verify your credentials. Your session has been locked for security reasons.
            </p>
            <button 
              onClick={() => router.push("/gate")}
              className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Retry Verification
            </button>
          </div>
        </div>
      )}
    </>
  );
}
