"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Mail, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#0a84ff30] selection:text-[#0a84ff]">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70 border-b border-[#1c1c1e]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-[#86868b] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="text-sm font-bold text-white">
            WriteYourEmail<span className="text-[#0a84ff]">.com</span>
          </div>
          <Link
            href="/studio"
            className="px-4 py-2 bg-[#0a84ff] hover:bg-[#007aff] text-white font-semibold text-xs rounded-full transition-all"
          >
            Open Studio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
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
          {/* Agreement */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or using WriteYourEmail.com ("Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access the Service.
            </p>
          </section>

          {/* Service Description */}
          <section className="p-6 rounded-2xl bg-[#141415] border border-[#1c1c1e] space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#0a84ff]" /> 2. Description of Service
            </h2>
            <p>
              WriteYourEmail.com provides AI-powered omni-channel sales outreach generation, deliverability scoring, spam trigger detection, and subject line variation tools. Content generation is governed by daily and monthly quotas according to your active access tier.
            </p>
          </section>

          {/* Prepaid Passes & Payment */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Prepaid 30-Day Passes & Monetization</h2>
            <p>
              To maintain flexible, transparent pricing, WriteYourEmail.com operates on a <strong className="text-white">Prepaid Access Pass model</strong> processed via PayPal Standard Checkout Orders (v2).
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#86868b]">
              <li><strong className="text-white">No Recurring Subscriptions:</strong> You purchase non-recurring 30-day (or 365-day) access passes. You will never be charged automatic recurring monthly fees.</li>
              <li><strong className="text-white">Plan Expiry:</strong> Upon pass expiration, your account automatically reverts to the Free tier until a new pass is manually purchased.</li>
              <li><strong className="text-white">Refunds:</strong> Refund requests submitted within 7 days of purchase to <a href="mailto:help@writeyouremail.com" className="text-[#0a84ff] hover:underline">help@writeyouremail.com</a> are evaluated on a case-by-case basis.</li>
            </ul>
          </section>

          {/* Ownership */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Intellectual Property & Output Ownership</h2>
            <p>
              <strong className="text-white">You own all email copy and outreach content</strong> generated using WriteYourEmail.com. We claim no ownership or copyright over the outputs produced for your campaigns. You are free to edit, send, publish, and commercialize generated text without restriction.
            </p>
          </section>

          {/* Acceptable Use */}
          <section className="p-6 rounded-2xl bg-[#141415] border border-[#1c1c1e] space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#ff453a]" /> 5. Acceptable Use Policy
            </h2>
            <p>You agree NOT to use WriteYourEmail.com to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#86868b]">
              <li>Generate illegal, harmful, harassing, or fraudulent communications.</li>
              <li>Attempt to bypass API quota limits or reverse-engineer system endpoints.</li>
              <li>Distribute malware, phishing links, or deception vectors.</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Limitation of Liability</h2>
            <p>
              WriteYourEmail.com is provided "as is" without warranty of any kind. While our Deliverability Scorecard reduces spam risk, we do not guarantee specific open rates, response rates, or domain reputation outcomes for your sales campaigns.
            </p>
          </section>

          {/* Support */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">7. Support & Inquiries</h2>
            <p>
              For technical assistance, billing queries, or legal notices, contact our support desk:
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
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© 2025 WriteYourEmail.com. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing Passes</Link>
            <a href="mailto:help@writeyouremail.com" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}