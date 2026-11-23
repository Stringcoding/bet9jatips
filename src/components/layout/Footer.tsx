import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-bg-deep border-t border-bg-slate py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
           <div className="bg-brand-green text-surface-white font-extrabold text-sm px-2 py-1 rounded">
            bet<span className="text-brand-red">9ja</span>
          </div>
          <span className="text-text-muted text-sm">
            © {new Date().getFullYear()} Bet9ja Tips. All rights reserved.
          </span>
        </div>

        <div className="flex gap-6 text-sm text-text-muted">
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
