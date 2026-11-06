"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Zap, Shield, Rocket } from "lucide-react";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[#000000] text-[#f5f5f7] font-sans selection:bg-[#0a84ff] selection:text-white relative overflow-x-hidden"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Ambient Apple Radial Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-gradient-to-b from-[#0a84ff]/20 via-[#0a84ff]/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#000000]/70 backdrop-blur-2xl saturate-150 h-16 flex items-center justify-between px-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2 font-semibold text-lg tracking-tight">
          <span className="w-7 h-7 bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] text-white flex items-center justify-center font-bold text-sm rounded-lg shadow-md shadow-[#0a84ff]/30">
            W
          </span>
          <span className="font-bold tracking-tight">WriteYourEmail</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/pricing" className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition">
            Pricing
          </Link>
          <Link
            href="/studio"
            className="text-xs bg-[#0a84ff] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#0071e3] transition-colors shadow-lg shadow-[#0a84ff]/20"
          >
            Launch Studio
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c1c1e] border border-white/10 text-[#0a84ff] text-xs font-bold uppercase tracking-wider mb-8">
          <Sparkles className="w-4 h-4" /> V7.0 Titan Outreach Engine
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white via-[#f5f5f7] to-[#86868b] bg-clip-text text-transparent leading-[1.05]">
          Write Cold Emails That <br className="hidden sm:inline" /> Actually Get Replies.
        </h1>

        <p className="text-lg sm:text-xl text-[#86868b] max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          The high-converting AI engine built for founders, sales reps, and agencies. Instant 11-mode omni-channel messaging with zero spam triggers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/studio"
            className="w-full sm:w-auto px-8 py-4 bg-[#0a84ff] text-white text-base font-bold rounded-2xl hover:bg-[#0071e3] transition shadow-xl shadow-[#0a84ff]/25 flex items-center justify-center gap-2"
          >
            Open Studio Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/pricing"
            className="w-full sm:w-auto px-8 py-4 bg-[#1c1c1e] text-white text-base font-bold rounded-2xl border border-white/10 hover:bg-[#2c2c2e] transition"
          >
            View Pricing Plans
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16 pt-16 border-t border-white/5">
          <div className="p-8 rounded-3xl bg-[#141415] border border-white/5 hover:border-white/10 transition">
            <Zap className="w-8 h-8 text-[#0a84ff] mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">11 Outreach Modes</h3>
            <p className="text-sm text-[#86868b] leading-relaxed">
              Standard emails, LinkedIn DMs, Twitter DMs, cold call scripts, objection rebuttals, and bulk CSV personalization.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#141415] border border-white/5 hover:border-white/10 transition">
            <Shield className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Spam Audit Shield</h3>
            <p className="text-sm text-[#86868b] leading-relaxed">
              Automatic 1-click spam trigger word sanitization ensures maximum inbox deliverability and domain reputation.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#141415] border border-white/5 hover:border-white/10 transition">
            <Rocket className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">1-Click Launch</h3>
            <p className="text-sm text-[#86868b] leading-relaxed">
              Seamlessly push generated drafts directly into Gmail or your native desktop mail app with pre-filled subjects.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm font-medium text-[#86868b]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 WriteYourEmail. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/studio" className="hover:text-[#f5f5f7] transition">
              Studio
            </Link>
            <Link href="/pricing" className="hover:text-[#f5f5f7] transition">
              Pricing
            </Link>
            <Link href="/terms" className="hover:text-[#f5f5f7] transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#f5f5f7] transition">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}