
"use client";

import React from "react";
import CountUp from "react-countup";
import Link from "next/link";
import Image from "next/image";
import { Search, Gift } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 px-4 sm:px-6 py-8 sm:py-12 lg:py-24 overflow-hidden">

      {/* ================= RIGHT: HERO IMAGE ================= */}
      <div className="relative order-1 w-full flex-1 min-w-0">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[600px]">

          {/* Green Glow */}
          <div className="absolute top-[10%] right-[10%] z-0 h-[70%] w-[70%] rounded-full glow-green opacity-40 blur-2xl" />

          {/* Yellow Glow */}
          <div className="absolute bottom-[5%] left-[5%] z-0 h-[45%] w-[45%] rounded-full glow-yellow opacity-30 blur-2xl" />

          {/* Hero Image */}
          <Image
            src="/hero-image.png"
            alt="Bet9ja Winning Tickets"
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 50vw"
            className="relative z-10 object-contain drop-shadow-[0_15px_35px_rgba(42,157,72,0.25)]"
          />
        </div>
      </div>

      {/* ================= LEFT: CONTENT ================= */}
      <div className="relative z-10 order-2 flex w-full flex-1 min-w-0 flex-col items-center text-center lg:items-start lg:text-left">

        {/* Discount Badge */}
        <div className="mb-5 flex w-full max-w-[340px] items-center justify-center gap-2 rounded-lg bg-bg-slate px-3 py-2 sm:px-4 lg:mx-0 shadow-[inset_-3px_-3px_6px_rgba(255,255,255,0.05),inset_3px_3px_6px_rgba(0,0,0,0.5)]">
          <Gift className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-brand-yellow" />

          <p className="text-xs sm:text-sm font-medium text-text-muted">
            <span className="font-bold text-surface-white">
              <CountUp end={100} start={50} duration={4} suffix="%" />
            </span>{" "}
            sure odds,{" "}
            <span className="text-surface-white">winning</span> tickets...
          </p>
        </div>

        {/* Headline */}
        <h1 className="mb-4 font-sans font-extrabold text-[40px] leading-[1.05] tracking-tight text-surface-white sm:text-[56px] lg:text-[72px]">
          Get Sure
          <br />
          <span className="text-gradient">ODDS</span>
          <br />
          Daily.
        </h1>

        {/* Description */}
        <p className="mb-6 max-w-[470px] text-sm leading-relaxed text-text-muted sm:text-base lg:mb-8 lg:text-lg">
          This is our official platform and every game is predicted by our
          professional sports analyzers. We generate 99.9% fixed odds for
          our Bet9ja users. Coupon codes only! Absolutely free.
        </p>

        {/* Actions */}
        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center lg:w-auto lg:justify-start lg:gap-6">

          {/* CTA */}
          <Link
            href="/tips"
            className="w-full rounded-xl bg-brand-green px-6 py-3 text-center font-bold text-surface-white shadow-[0_0_20px_rgba(42,157,72,0.4)] transition-all duration-300 hover:scale-105 hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-4"
          >
            Get Coupon Code
          </Link>

          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-bg-deep shadow-[5px_5px_10px_rgba(0,0,0,0.5),-5px_-5px_10px_rgba(255,255,255,0.05)] transition-colors hover:text-brand-green sm:flex lg:h-16 lg:w-16"
          >
            <Search className="h-5 w-5 text-text-muted transition-colors group-hover:text-brand-green lg:h-6 lg:w-6" />
          </button>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
