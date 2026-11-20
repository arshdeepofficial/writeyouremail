'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from './lib/supabase';
import { User, LogOut, ArrowUpRight } from 'lucide-react';

const InstagramIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function GlentLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-[#0a84ff]/30 selection:text-white flex flex-col font-sans">
      {/* Global Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[320px] bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Institutional Corporate Header */}
      <header className="border-b border-white/5 backdrop-blur-xl bg-black/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/glent" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white via-neutral-300 to-neutral-600 flex items-center justify-center font-bold text-black text-sm tracking-tighter shadow-md group-hover:scale-105 transition-transform">
              G
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-200">
                Glent Global
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-500">
                Enterprises
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-neutral-400">
            <Link href="/glent" className="hover:text-white transition-colors">Overview</Link>
            <Link href="/glent/ecosystem" className="hover:text-white transition-colors">Ecosystem</Link>
            <Link href="/glent/philosophy" className="hover:text-white transition-colors">Philosophy</Link>
            <Link href="/glent/governance" className="hover:text-white transition-colors">Governance</Link>
            <Link href="/glent/contact" className="hover:text-white transition-colors">Inquiries</Link>
          </nav>

          {/* Right Action / Auth Status */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/glent/passport"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-xs font-mono text-neutral-300 hover:text-white transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </Link>
                <Link
                  href="/studio"
                  className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors hidden sm:inline-flex items-center gap-1"
                >
                  Studio <ArrowUpRight size={12} />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/glent/passport"
                  className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                >
                  Glent Passport ID
                </Link>
                <Link
                  href="/glent/passport"
                  className="px-3.5 py-1.5 rounded-lg bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                >
                  Authenticate
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="md:hidden border-t border-white/5 px-6 py-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-400 overflow-x-auto gap-4">
          <Link href="/glent" className="hover:text-white">Overview</Link>
          <Link href="/glent/ecosystem" className="hover:text-white">Ecosystem</Link>
          <Link href="/glent/philosophy" className="hover:text-white">Philosophy</Link>
          <Link href="/glent/passport" className="text-blue-400">Passport ID</Link>
          <Link href="/glent/contact" className="hover:text-white">Contact</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-16 px-6 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm tracking-widest uppercase">
                Glent Global Enterprises
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm">
              Architecting generative AI infrastructure, deliverability intelligence, and autonomous software units.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs font-mono text-neutral-500 uppercase tracking-wider">
            <Link href="/glent/passport" className="text-neutral-300 hover:text-white transition-colors">Glent Passport</Link>
            <Link href="/glent/ecosystem" className="hover:text-white transition-colors">Portfolio</Link>
            <Link href="/glent/philosophy" className="hover:text-white transition-colors">Philosophy</Link>
            <Link href="/glent/governance" className="hover:text-white transition-colors">Governance</Link>
            <Link href="/glent/contact" className="hover:text-white transition-colors">Corporate Desk</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-neutral-600 gap-2">
          <span>© 2025 GLENT GLOBAL ENTERPRISES. ALL RIGHTS RESERVED.</span>
          <span>UNIFIED SINGLE SIGN-ON INFRASTRUCTURE</span>
        </div>
      </footer>
    </div>
  );
}