"use client";

import React from "react";
import Link from "next/link";
import { FileText, Mail, ShieldAlert, CheckCircle2 } from "lucide-react";

function Logo({ size = 32, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0a84ff] to-[#bf5af2] p-0.5 shadow-lg shadow-[#0a84ff25] group-hover:scale-105 transition-transform"
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full bg-[#0a0a0a] rounded-[10px] flex items-center justify-center">
          <svg
            width={size * 0.55}
            height={size * 0.55}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            <path d="M18 15v6" />
            <path d="M15 18h6" />
          </svg>
        </div>
      </div>
      {showText && (
        <span className="font-bold tracking-tight text-white text-lg">
          WriteYourEmail<span className="text-[#0a84ff]">.com</span>
        </span>
      )}
    </Link>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#0a84ff30] selection:text-[#0a84ff]">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70 border-b border-[#1c1c1e]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size={36} showText={true} />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#86868b]">
            <Link href="/studio" className="hover:text-white transition-colors">
              Studio
            </Link>
            <Link href="/#modes" className="hover:text-white transition-colors">
              30 Modes
            </Link>
            <Link href="/#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing Passes
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-white font-semibold">
              Terms
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/studio"
              className="px-4 py-2 bg-[#0a84ff] hover:bg-[#007aff] text-white font-semibold text-xs rounded-full transition-all"
            >
              Open Studio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-36 pb-20 px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141415] border border-[#2c2c2e] text-xs font-semibold text-[#30d158] mb-6">
          <FileText size={14} />
          <span>Last Updated: January 2025</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-white via-[#e1e1e6] to-[#86868b] bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-[#86868b] text-base mb-12">
          Rules and conditions governing the use of WriteYourEmail.com.
        </p>

        <div className="space-y-10 text-[#d1d1d6] text-sm leading-relaxed">
          {/* Terms */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or using WriteYourEmail.com ("Service"), you agree to be bound by these Terms of Service.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#141415] border border-[#1c1c1e] space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#0a84ff]" /> 2. Service Description
            </h2>
            <p>
              WriteYourEmail.com provides AI-powered omni-channel sales outreach generation, deliverability scoring, spam trigger detection, and subject line variation tools.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Prepaid 30-Day Passes</h2>
            <p>
              WriteYourEmail.com operates on a <strong className="text-white">Prepaid Access Pass model</strong> via PayPal Standard Checkout Orders (v2). No automatic recurring charges apply.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#141415] border border-[#1c1c1e] space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#ff453a]" /> 4. Ownership & Content Rights
            </h2>
            <p>
              <strong className="text-white">You own all generated content</strong>. You retain 100% rights to edit, commercialize, and send generated outputs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Support Enquiries</h2>
            <div className="p-4 rounded-xl bg-[#141415] border border-[#2c2c2e] inline-flex items-center gap-3 text-white font-mono text-sm">
              <Mail size={16} className="text-[#0a84ff]" />
              <a href="mailto:help@writeyouremail.com" className="hover:underline text-[#0a84ff]">
                help@writeyouremail.com
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#1c1c1e] text-xs text-[#86868b]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© 2025 WriteYourEmail.com. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/studio" className="hover:text-white transition-colors">Studio</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing Passes</Link>
            <a href="mailto:help@writeyouremail.com" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}