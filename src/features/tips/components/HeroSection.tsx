"use client";

import React from "react";
import CountUp from "react-countup";
import Link from "next/link";
import Image from "next/image";
import { Search, Gift } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between py-12 lg:py-24 px-6 max-w-7xl mx-auto gap-12">
      
      {/* Left Content */}
      <div className="flex-1 flex flex-col items-start w-full">
        
        {/* Discount Badge - Neumorphic */}
        <div className="flex items-center gap-2 bg-bg-slate px-4 py-2 rounded-lg shadow-[inset_-3px_-3px_6px_rgba(255,255,255,0.05),inset_3px_3px_6px_rgba(0,0,0,0.5)] mb-6">
          <Gift className="text-brand-yellow w-5 h-5" />
          <p className="text-text-muted text-sm font-medium">
            <span className="text-surface-white font-bold">
              <CountUp end={100} start={50} duration={4} prefix="" suffix="%" />
            </span>{" "}
            sure odds, <span className="text-surface-white">winning</span> tickets...
          </p>
        </div>

        {/* Headline */}
        <h1 className="font-sans font-extrabold text-[52px] sm:text-[72px] leading-[1.1] text-surface-white mb-2 tracking-tight">
          Get Sure <br />
          <span className="text-gradient">ODDS</span>
        </h1>
        <h1 className="font-sans font-extrabold text-[52px] sm:text-[72px] leading-[1.1] text-surface-white w-full mb-6">
          Daily.
        </h1>

        {/* Paragraph */}
        <p className="text-text-muted max-w-[470px] text-lg leading-relaxed mb-8">
          This is our official platform and every game is predicted by our professional sports analyzers. We generate 99.9% fixed odds for our Bet9ja users. Coupon codes only! Absolutely free.
        </p>

        {/* Action Area */}
        <div className="flex items-center gap-6 w-full">
          <Link
            href="/tips"
            className="bg-brand-green hover:bg-brand-green-dark text-surface-white font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(42,157,72,0.4)] transition-all transform hover:scale-105"
          >
            Get Coupon Code
          </Link>

          {/* Neumorphic Search Circle */}
          <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full bg-bg-deep shadow-[5px_5px_10px_rgba(0,0,0,0.5),-5px_-5px_10px_rgba(255,255,255,0.05)] cursor-pointer hover:text-brand-green transition-colors group">
            <Search className="w-6 h-6 text-text-muted group-hover:text-brand-green transition-colors" />
          </div>
        </div>
      </div>

      {/* Right Image Area */}
      <div className="flex-1 flex justify-center items-center relative w-full h-[400px] lg:h-[600px]">
        {/* Glow Effects behind the image */}
        <div className="absolute z-0 w-[80%] h-[80%] rounded-full glow-green top-10 right-10 opacity-50" />
        <div className="absolute z-0 w-[50%] h-[50%] rounded-full glow-yellow bottom-10 left-10 opacity-30" />

        {/* The Hero Image */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <Image
            src="/hero-image.png"
            alt="Bet9ja Winning Tickets"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
