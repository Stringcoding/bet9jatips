import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-bg-deep border-t border-bg-slate py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Logo Container */}
          <Link href="/" className="relative h-6 sm:h-8 w-24 sm:w-32 shrink-0">
            <Image
              src="/logo.png"
              alt="Bet9ja Tips"
              fill
              className="object-contain object-center sm:object-left"
            />
          </Link>
          
          <span className="text-text-muted text-xs sm:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Bet9ja Tips. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-xs sm:text-sm text-text-muted">
          <Link href="/terms" className="hover:text-surface-white transition">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-surface-white transition">
            Privacy Policy
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
