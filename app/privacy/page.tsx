"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, EyeOff } from "lucide-react";

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

export default function PrivacyPage() {
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
            <Link href="/privacy" className="text-white font-semibold">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141415] border border-[#2c2c2e] text-xs font-semibold text-[#0a84ff] mb-6">
          <ShieldCheck size={14} />
          <span>Last Updated: January 2025</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-white via-[#e1e1e6] to-[#86868b] bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-[#86868b] text-base mb-12">
          How WriteYourEmail.com collects, protects, and handles your data.
        </p>

        <div className="space-y-10 text-[#d1d1d6] text-sm leading-relaxed">
          {/* Commitment */}
          <section className="p-6 rounded-2xl bg-[#141415] border border-[#1c1c1e] space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock size={18} className="text-[#0a84ff]" /> 1. Commitment to Privacy
            </h2>
            <p>
              WriteYourEmail.com ("we", "our", or "us") respects your privacy. We store only the minimal necessary data to provide high-deliverability AI email copywriting services. We do not sell your personal data or email logs to third parties.
            </p>
          </section>

          {/* Data Collected */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
            <p>We collect the following categories of information when you interact with our platform:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#86868b]">
              <li><strong className="text-white">Account Information:</strong> Email address provided during authentication (handled securely via Supabase Auth).</li>
              <li><strong className="text-white">Generation Prompts & History:</strong> Prospect names, value propositions, and mode inputs submitted to generate outreach copy. Saved to your private account history in Supabase DB.</li>
              <li><strong className="text-white">Payment & Subscription Data:</strong> Prepaid transaction records via PayPal Standard Orders v2. We never store credit card details on our servers.</li>
              <li><strong className="text-white">Usage Metrics:</strong> Daily and monthly generation counters to enforce plan quotas.</li>
            </ul>
          </section>

          {/* AI Processing */}
          <section className="p-6 rounded-2xl bg-[#141415] border border-[#1c1c1e] space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <EyeOff size={18} className="text-[#bf5af2]" /> 3. AI & Data Processing
            </h2>
            <p>
              Generative AI processing is executed using active Groq infrastructure (Llama 3.3-70B, Llama 3.1-8B, and Gemma models). Your prompts are passed transiently over encrypted TLS connections strictly for generating requested email outputs. Your copy is <strong className="text-white">never used to train public foundation models</strong>.
            </p>
          </section>

          {/* Security */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Security & Storage</h2>
            <p>
              Your account history and quota state are secured behind Row Level Security (RLS) policies in Supabase PostgreSQL databases. All data in transit is encrypted using AES-256 and SSL/TLS.
            </p>
          </section>

          {/* Data Rights */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Your Data Rights & Erasure</h2>
            <p>
              You have the right to request full export or complete deletion of your account and email generation history at any time.
            </p>
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
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing Passes</Link>
            <a href="mailto:help@writeyouremail.com" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}