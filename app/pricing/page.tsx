"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, Zap, Mail } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#0a84ff30] selection:text-[#0a84ff]">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70 border-b border-[#1c1c1e]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#86868b] hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="text-lg font-bold text-white">
            WriteYourEmail<span className="text-[#0a84ff]">.com</span>
          </div>
          <Link
            href="/studio"
            className="px-5 py-2.5 bg-[#0a84ff] hover:bg-[#007aff] text-white font-semibold text-xs rounded-full transition-all shadow-lg shadow-[#0a84ff20]"
          >
            Launch Studio
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section className="pt-36 pb-16 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141415] border border-[#2c2c2e] text-xs font-semibold text-[#30d158] mb-6">
          <Zap size={14} />
          <span>Prepaid 30-Day Passes • Zero Automatic Recurring Fees</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white via-[#e1e1e6] to-[#86868b] bg-clip-text text-transparent">
          Simple, High-Value Outreach Pricing.
        </h1>
        <p className="text-lg text-[#86868b] max-w-2xl mx-auto leading-relaxed">
          Unlock 30 omni-channel AI modes, real-time deliverability scoring, and 5 A/B subject line variations. Pay once, use for 30 days.
        </p>
      </section>

      {/* Pricing Grid */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl bg-[#141415] border border-[#1c1c1e] flex flex-col justify-between">
            <div>
              <div className="text-sm font-semibold text-[#86868b] mb-2">Guest / Free</div>
              <div className="text-4xl font-extrabold text-white mb-2">$0</div>
              <p className="text-xs text-[#86868b] mb-6">Test outreach copy quality anytime.</p>
              <ul className="space-y-3 text-xs text-[#d1d1d6] mb-8">
                <li className="flex items-center gap-2"><Check size={14} className="text-[#30d158]" /> 5 Generations / day</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#30d158]" /> 5 Starter Modes</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#30d158]" /> Deliverability Scorecard</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#30d158]" /> 1-Click Gmail Link</li>
              </ul>
            </div>
            <Link
              href="/studio"
              className="w-full py-3 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white font-semibold text-xs rounded-full transition-all text-center block"
            >
              Start Free
            </Link>
          </div>

          {/* Starter Tier */}
          <div className="p-8 rounded-3xl bg-[#141415] border border-[#1c1c1e] flex flex-col justify-between">
            <div>
              <div className="text-sm font-semibold text-[#0a84ff] mb-2">Starter Pass</div>
              <div className="text-4xl font-extrabold text-white mb-2">$19 <span className="text-xs text-[#86868b] font-normal">/ 30 days</span></div>
              <p className="text-xs text-[#86868b] mb-6">For freelancers and solo outreach.</p>
              <ul className="space-y-3 text-xs text-[#d1d1d6] mb-8">
                <li className="flex items-center gap-2"><Check size={14} className="text-[#0a84ff]" /> 50 Generations / month</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#0a84ff]" /> 5 Core Modes</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#0a84ff]" /> Subject Line A/B Matrix</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#0a84ff]" /> Spam Trigger Sanitizer</li>
              </ul>
            </div>
            <Link
              href="/studio"
              className="w-full py-3 bg-[#0a84ff] hover:bg-[#007aff] text-white font-semibold text-xs rounded-full transition-all text-center block shadow-lg shadow-[#0a84ff20]"
            >
              Get Starter Pass
            </Link>
          </div>

          {/* Growth Tier */}
          <div className="p-8 rounded-3xl bg-[#141415] border-2 border-[#bf5af2] flex flex-col justify-between relative shadow-xl shadow-[#bf5af215]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#bf5af2] text-white text-[10px] font-bold uppercase rounded-full">
              Most Popular
            </div>
            <div>
              <div className="text-sm font-semibold text-[#bf5af2] mb-2">Growth Pass</div>
              <div className="text-4xl font-extrabold text-white mb-2">$39 <span className="text-xs text-[#86868b] font-normal">/ 30 days</span></div>
              <p className="text-xs text-[#86868b] mb-6">For agencies and active sales reps.</p>
              <ul className="space-y-3 text-xs text-[#d1d1d6] mb-8">
                <li className="flex items-center gap-2"><Check size={14} className="text-[#bf5af2]" /> Unlimited Generations</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#bf5af2]" /> All 30 Omni-Channel Modes</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#bf5af2]" /> Multi-Touch Sequences</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#bf5af2]" /> Priority AI Engine</li>
              </ul>
            </div>
            <Link
              href="/studio"
              className="w-full py-3 bg-[#bf5af2] hover:bg-[#a846da] text-white font-semibold text-xs rounded-full transition-all text-center block shadow-lg shadow-[#bf5af220]"
            >
              Get Growth Pass
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="p-8 rounded-3xl bg-[#141415] border border-[#1c1c1e] flex flex-col justify-between">
            <div>
              <div className="text-sm font-semibold text-[#ffd60a] mb-2">Enterprise Pass</div>
              <div className="text-4xl font-extrabold text-white mb-2">$79 <span className="text-xs text-[#86868b] font-normal">/ 30 days</span></div>
              <p className="text-xs text-[#86868b] mb-6">Full 30-day pass for agencies & sales teams.</p>
              <ul className="space-y-3 text-xs text-[#d1d1d6] mb-8">
                <li className="flex items-center gap-2"><Check size={14} className="text-[#ffd60a]" /> Unlimited Generations & 30 Modes</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#ffd60a]" /> VIP Support Chatbot</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#ffd60a]" /> Priority Custom Modes</li>
              </ul>
            </div>
            <Link
              href="/studio"
              className="w-full py-3 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white font-semibold text-xs rounded-full transition-all text-center block"
            >
              Get Enterprise Pass
            </Link>
          </div>
        </div>
      </section>

      {/* Support Box */}
      <section className="pb-24 px-6 max-w-3xl mx-auto text-center">
        <div className="p-8 rounded-3xl bg-[#141415] border border-[#1c1c1e] space-y-4">
          <h3 className="text-lg font-bold text-white">Need a custom plan or team license?</h3>
          <p className="text-sm text-[#86868b]">
            Reach out directly to our support team and we will assist with custom invoicing.
          </p>
          <a
            href="mailto:help@writeyouremail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-[#0a84ff] font-mono text-sm rounded-full transition-all border border-[#2c2c2e]"
          >
            <Mail size={16} /> help@writeyouremail.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#1c1c1e] text-xs text-[#86868b]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© 2025 WriteYourEmail.com. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:help@writeyouremail.com" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}