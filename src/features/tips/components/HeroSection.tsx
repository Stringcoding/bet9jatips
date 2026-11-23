"use client";

import React from "react";
import CountUp from "react-countup";
import Link from "next/link";
import Image from "next/image";
import { Search, Gift } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between py-8 lg:py-24 px-4 sm:px-6 max-w-7xl mx-auto gap-8 lg:gap-12 overflow-hidden">
      
      {/* Left Content */}
      <div className="flex-1 flex flex-col items-center lg:items-start w-full text-center lg:text-left">
        
        {/* Discount Badge - Neumorphic */}
        <div className="flex items-center justify-center lg:justify-start gap-2 bg-bg-slate px-3 sm:px-4 py-2 rounded-lg shadow-[inset_-3px_-3px_6px_rgba(255,255,255,0.05),inset_3px_3px_6px_rgba(0,0,0,0.5)] mb-6 w-full max-w-[340px] lg:max-w-fit mx-auto lg:mx-0">
          <Gift className="text-brand-yellow w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <p className="text-text-muted text-xs sm:text-sm font-medium">
            <span className="text-surface-white font-bold">
              <CountUp end={100} start={50} duration={4} prefix="" suffix="%" />
            </span>{" "}
            sure odds, <span className="text-surface-white">winning</span> tickets...
          </p>
        </div>

        {/* Headline */}
        <h1 className="font-sans font-extrabold text-[42px] sm:text-[56px] lg:text-[72px] leading-[1.1] text-surface-white mb-2 tracking-tight">
          Get Sure <br />
          <span className="text-gradient">ODDS</span>
        </h1>
        <h1 className="font-sans font-extrabold text-[42px] sm:text-[56px] lg:text-[72px] leading-[1.1] text-surface-white w-full mb-4 lg:mb-6">
          Daily.
        </h1>

        {/* Paragraph */}
        <p className="text-text-muted max-w-[470px] text-sm sm:text-base lg:text-lg leading-relaxed mb-6 lg:mb-8">
          This is our official platform and every game is predicted by our professional sports analyzers. We generate 99.9% fixed odds for our Bet9ja users. Coupon codes only! Absolutely free.
        </p>

        {/* Action Area */}
        <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 w-full lg:w-auto">
          <Link
            href="/tips"
            className="w-full sm:w-auto text-center bg-brand-green hover:bg-brand-green-dark text-surface-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-[0_0_20px_rgba(42,157,72,0.4)] transition-all transform hover:scale-105"
          >
            Get Coupon Code
          </Link>

          {/* Neumorphic Search Circle */}
          <div className="hidden sm:flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-bg-deep shadow-[5px_5px_10px_rgba(0,0,0,0.5),-5px_-5px_10px_rgba(255,255,255,0.05)] cursor-pointer hover:text-brand-green transition-colors group shrink-0">
            <Search className="w-5 h-5 lg:w-6 lg:h-6 text-text-muted group-hover:text-brand-green transition-colors" />
          </div>
        </div>
      </div>

      {/* Right Image Area */}
      <div className="flex-1 flex justify-center items-center relative w-full h-[300px] sm:h-[400px] lg:h-[600px] mt-8 lg:mt-0">
        {/* Glow Effects behind the image */}
        <div className="absolute z-0 w-[80%] h-[80%] rounded-full glow-green top-10 right-10 opacity-50" />
        <div className="absolute z-0 w-[50%] h-[50%] rounded-full glow-yellow bottom-10 left-10 opacity-30" />

        {/* The Hero Image Container */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {/* 
            Using object-contain ensures the full image is always visible. 
            Using w-full and h-full with the parent's fixed height makes it fit perfectly.
          */}
          <Image
            src="/hero-image.png"
            alt="Bet9ja Winning Tickets"
            fill
            className="object-contain drop-shadow-[0_20px_50px_rgba(42,157,72,0.3)]"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
