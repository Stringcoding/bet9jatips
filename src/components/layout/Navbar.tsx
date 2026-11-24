"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Unlock } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-bg-deep border-b border-bg-slate sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="relative h-8 sm:h-10 w-32 sm:w-40">
            <Image
              src="/logo.png"
              alt="Bet9ja Tips"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-text-muted hover:text-surface-white transition font-medium">
            Home
          </Link>
          <Link href="/tips" className="text-text-muted hover:text-surface-white transition font-medium">
            Recent Tips
          </Link>
          <Link href="/about" className="text-text-muted hover:text-surface-white transition font-medium">
            About Us
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link 
            href="/gate" 
            className="flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-surface-white font-bold px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm shadow-[0_0_15px_rgba(42,157,72,0.3)]"
          >
            <Unlock size={16} className="hidden sm:block" />
            Access Codes
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
