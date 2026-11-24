"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, Ticket, Users, LogOut, Trophy, Menu, X } from "lucide-react";

const sidebarLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Manage Tips", href: "/admin/tips", icon: Ticket },
  { name: "Winning Ticker", href: "/admin/ticker", icon: Trophy },
  { name: "Users & Gate", href: "/admin/users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-screen bg-bg-deep overflow-hidden">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-bg-slate border-r border-gray-800 flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link href="/" className="bg-brand-green text-surface-white font-extrabold text-lg px-2 py-1 rounded">
            bet<span className="text-brand-red">9ja</span> <span className="text-xs font-normal text-brand-yellow ml-1">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-brand-green/10 text-brand-green"
                    : "text-text-muted hover:bg-bg-deep hover:text-surface-white"
                }`}
              >
                <Icon size={20} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-brand-red font-medium hover:bg-brand-red/10 transition-colors"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-bg-slate border-r border-gray-800 z-50 transform transition-transform duration-300 md:hidden flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <Link href="/" className="bg-brand-green text-surface-white font-extrabold text-lg px-2 py-1 rounded">
            bet<span className="text-brand-red">9ja</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-text-muted hover:text-white">
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-brand-green/10 text-brand-green"
                    : "text-text-muted hover:bg-bg-deep hover:text-surface-white"
                }`}
              >
                <Icon size={20} />
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-brand-red font-medium hover:bg-brand-red/10 transition-colors"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-bg-slate border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-text-muted hover:text-white">
            <Menu size={24} />
          </button>
          <Link href="/" className="bg-brand-green text-surface-white font-extrabold text-lg px-2 py-1 rounded">
            bet<span className="text-brand-red">9ja</span>
          </Link>
          <button onClick={handleLogout} className="text-brand-red">
            <LogOut size={20} />
          </button>
        </header>

        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
