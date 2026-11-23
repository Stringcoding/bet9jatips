"use client";

import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-bg-deep border-b border-bg-slate sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-brand-green text-surface-white font-extrabold text-xl px-2 py-1 rounded">
            bet<span className="text-brand-red">9ja</span>
          </div>
          <span className="text-surface-white font-bold text-lg hidden sm:block">
            Tips
          </span>
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
            href="/login" 
            className="hidden sm:block text-bg-deep bg-brand-yellow hover:bg-yellow-500 font-bold px-4 py-2 rounded transition-colors text-sm"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="bg-brand-green hover:bg-brand-green-dark text-surface-white font-bold px-4 py-2 rounded transition-colors text-sm"
          >
            Register
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
