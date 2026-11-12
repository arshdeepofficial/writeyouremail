"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Zap,
  ShieldCheck,
  BarChart3,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MousePointerClick,
  Mail,
  Shield,
  FileText,
} from "lucide-react";

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

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"cold" | "linkedin" | "reply">("cold");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#0a84ff30] selection:text-[#0a84ff] overflow-x-hidden">
      {/* 1. Universal Header Navigation */}
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
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/studio"
              className="px-5 py-2.5 bg-[#0a84ff] hover:bg-[#007aff] text-white font-semibold text-sm rounded-full transition-all duration-200 shadow-lg shadow-[#0a84ff30] flex items-center gap-2 group"
            >
              Open Studio
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#0a84ff20] via-[#bf5af220] to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141415] border border-[#2c2c2e] text-xs font-semibold text-[#0a84ff] mb-8">
          <Sparkles size={14} />
          <span>New: Deliverability & Spam Sanitizer Engine Live</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6 bg-gradient-to-b from-white via-[#e1e1e6] to-[#86868b] bg-clip-text text-transparent">
          Write High-Converting Outreach That Never Hits Spam.
        </h1>

        <p className="text-lg md:text-xl text-[#86868b] max-w-2xl mx-auto mb-10 leading-relaxed">
          30 omni-channel AI outreach modes tailored for Cold Email, LinkedIn DMs, WhatsApp, and Sales Sequences. Powered by real-time deliverability scoring and 5 A/B subject lines.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/studio"
            className="w-full sm:w-auto px-8 py-4 bg-[#0a84ff] hover:bg-[#007aff] text-white font-bold text-base rounded-full transition-all duration-200 shadow-xl shadow-[#0a84ff30] flex items-center justify-center gap-3 group"
          >
            Start Writing Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/pricing"
            className="w-full sm:w-auto px-8 py-4 bg-[#141415] hover:bg-[#1c1c1e] text-white font-semibold text-base rounded-full border border-[#2c2c2e] transition-all flex items-center justify-center gap-2"
          >
            View Pricing Passes
          </Link>
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-[#1c1c1e] text-left">
          <div>
            <div className="text-3xl font-bold text-white mb-1">98.4%</div>
            <div className="text-xs text-[#86868b]">Average Deliverability Score</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#bf5af2] mb-1">30 Modes</div>
            <div className="text-xs text-[#86868b]">Omni-Channel Coverage</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#30d158] mb-1">5 Variations</div>
            <div className="text-xs text-[#86868b]">Subject Line A/B Matrix</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#0a84ff] mb-1">1-Click</div>
            <div className="text-xs text-[#86868b]">Open in Gmail & Outlook</div>
          </div>
        </div>
      </section>

      {/* 3. Hero App Preview / Live Interactive Mockup */}
      <section id="demo" className="py-12 px-6 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-[#141415] border border-[#2c2c2e] p-4 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#2c2c2e] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="ml-2 text-xs font-mono text-[#86868b]">WriteYourEmail.com / Studio Preview</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("cold")}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                  activeTab === "cold" ? "bg-[#0a84ff] text-white" : "bg-[#1c1c1e] text-[#86868b]"
                }`}
              >
                Cold Email
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("linkedin")}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                  activeTab === "linkedin" ? "bg-[#0a84ff] text-white" : "bg-[#1c1c1e] text-[#86868b]"
                }`}
              >
                LinkedIn DM
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("reply")}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                  activeTab === "reply" ? "bg-[#0a84ff] text-white" : "bg-[#1c1c1e] text-[#86868b]"
                }`}
              >
                Objection Reply
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Input Side */}
            <div className="md:col-span-5 bg-[#0a0a0a] p-5 rounded-2xl border border-[#1c1c1e] space-y-4">
              <div className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
                {activeTab === "cold" ? "Cold Outreach Prompt" : activeTab === "linkedin" ? "LinkedIn Connection" : "Objection Handler"}
              </div>
              <div>
                <label className="text-xs text-[#d1d1d6] block mb-1">Prospect Name / Company</label>
                <div className="px-3 py-2 bg-[#1c1c1e] border border-[#2c2c2e] rounded-lg text-sm text-white">
                  {activeTab === "cold" ? "Alex Rivera @ ScaleUp Labs" : activeTab === "linkedin" ? "Sarah Chen @ Stripe" : "Marcus Vance @ Apex Corp"}
                </div>
              </div>
              <div>
                <label className="text-xs text-[#d1d1d6] block mb-1">Value Proposition</label>
                <div className="px-3 py-2 bg-[#1c1c1e] border border-[#2c2c2e] rounded-lg text-sm text-white">
                  {activeTab === "cold" ? "Automate outbound SDR workflows with AI" : activeTab === "linkedin" ? "Scaling B2B outbound pipeline without spam" : "Guaranteed 25% boost in cold email open rates"}
                </div>
              </div>
              <Link
                href="/studio"
                className="w-full py-2.5 bg-[#0a84ff] hover:bg-[#007aff] text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Zap size={14} /> Generate High-Deliverability Output
              </Link>
            </div>

            {/* Output Side */}
            <div className="md:col-span-7 bg-[#0a0a0a] p-5 rounded-2xl border border-[#1c1c1e] space-y-5">
              {/* Scorecard Widget */}
              <div className="p-4 bg-[#141415] rounded-xl border border-[#2c2c2e] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-[#30d158] flex items-center justify-center font-bold text-lg text-[#30d158]">
                    96
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                      Deliverability Score <ShieldCheck size={16} className="text-[#30d158]" />
                    </div>
                    <div className="text-xs text-[#86868b]">Zero spam triggers detected. Safe for inbox placement.</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-[#1c1c1e] text-[#d1d1d6] text-xs font-medium rounded-full flex items-center gap-1">
                    <ExternalLink size={12} /> Gmail Ready
                  </span>
                </div>
              </div>

              {/* Subject Variations */}
              <div className="p-3 bg-[#141415] rounded-xl border border-[#1c1c1e]">
                <div className="text-xs font-semibold text-[#bf5af2] mb-2 flex items-center gap-1.5">
                  <BarChart3 size={14} /> Top A/B Subject Line
                </div>
                <div className="text-sm text-white font-medium bg-[#0a0a0a] p-2.5 rounded-lg border border-[#1c1c1e]">
                  {activeTab === "cold"
                    ? "Quick question regarding ScaleUp Labs outbound rate"
                    : activeTab === "linkedin"
                    ? "Loved your post on B2B pipeline growth"
                    : "Re: Budget constraints for Q3 outreach"}
                </div>
              </div>

              {/* Content Output */}
              <div>
                <div className="text-xs font-bold text-[#86868b] uppercase tracking-wider mb-2">Message Body</div>
                <div className="text-sm text-[#d1d1d6] leading-relaxed whitespace-pre-line bg-[#141415] p-4 rounded-xl border border-[#1c1c1e]">
                  {activeTab === "cold" &&
                    "Hi Alex,\n\nI noticed ScaleUp Labs is rapidly expanding its SDR team this quarter.\n\nWe helped a similar team cut outbound research time by 70% while improving inbox deliverability scores from 64% to 98%.\n\nWould you be open to a 10-minute call next Tuesday to see how?"}
                  {activeTab === "linkedin" &&
                    "Hi Sarah,\n\nYour recent breakdown on scaling enterprise pipelines was spot on. Loved the emphasis on personalization over volume.\n\nWould love to connect here and share a quick deliverability framework we just built."}
                  {activeTab === "reply" &&
                    "Hi Marcus,\n\nCompletely understand that budget is tight right now.\n\nWhat if we started with a zero-upfront pilot so you only pay once we hit a 20% increase in reply rates?\n\nWorth a brief 5-minute chat?"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#1c1c1e]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-[#0a84ff] uppercase tracking-widest mb-3">Engineered for Conversion</h2>
          <p className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Everything You Need to Scale Cold Outreach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#141415] border border-[#2c2c2e] hover:border-[#0a84ff50] transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-[#0a84ff15] text-[#0a84ff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Spam Trigger Detector</h3>
            <p className="text-[#86868b] text-sm leading-relaxed">
              Instantly scans your copy against spam lexicons, flags risky words, and generates a sanitized, spam-free version to keep your domain safe.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#141415] border border-[#2c2c2e] hover:border-[#bf5af250] transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-[#bf5af215] text-[#bf5af2] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Subject Line A/B Matrix</h3>
            <p className="text-[#86868b] text-sm leading-relaxed">
              Generates 5 distinct high-open subject lines for every prompt—ranging from curiosity hooks to personalized value propositions.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#141415] border border-[#2c2c2e] hover:border-[#30d15850] transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-[#30d15815] text-[#30d158] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MousePointerClick size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">1-Click Gmail & Outlook</h3>
            <p className="text-[#86868b] text-sm leading-relaxed">
              Launch directly into your email client with pre-filled subject and body fields—no copy-paste friction required.
            </p>
          </div>
        </div>
      </section>

      {/* 5. 30 Omni-Channel Modes Showcase */}
      <section id="modes" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#1c1c1e] bg-[#050507]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-[#bf5af2] uppercase tracking-widest mb-3">30 Specialized AI Copy Generators</h2>
          <p className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            One Studio for Every Channel.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "Cold Email", tag: "Starter" },
            { name: "Magic Polish", tag: "Starter" },
            { name: "Objection Reply", tag: "Starter" },
            { name: "Lead Win-Back", tag: "Starter" },
            { name: "Inbound Followup", tag: "Starter" },
            { name: "LinkedIn DM", tag: "Growth" },
            { name: "WhatsApp Pitch", tag: "Growth" },
            { name: "VSL Script", tag: "Growth" },
            { name: "Proposal Pitch", tag: "Growth" },
            { name: "Slack DM", tag: "Growth" },
            { name: "Sequence Builder", tag: "Growth" },
            { name: "Telegram Broadcast", tag: "Growth" },
            { name: "Cold Call Script", tag: "Enterprise" },
            { name: "SMS Sequence", tag: "Enterprise" },
            { name: "Direct Mail", tag: "Enterprise" },
          ].map((item, idx) => (
            <Link
              key={idx}
              href="/studio"
              className="p-4 rounded-2xl bg-[#141415] border border-[#1c1c1e] hover:border-[#0a84ff] transition-all flex flex-col justify-between group"
            >
              <div className="text-xs text-[#86868b] font-mono mb-2">{item.tag}</div>
              <div className="text-sm font-semibold text-white group-hover:text-[#0a84ff] transition-colors">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a84ff] hover:underline"
          >
            Explore all 30 Modes in Studio <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 6. Simple Prepaid Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#1c1c1e]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-[#30d158] uppercase tracking-widest mb-3">Transparent Prepaid Passes</h2>
          <p className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            No Recurring Subscriptions. Pay As You Grow.
          </p>
          <p className="text-[#86868b] text-sm mt-3">
            All paid plans are valid for 30 days via PayPal Standard Orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl bg-[#141415] border border-[#1c1c1e] flex flex-col justify-between">
            <div>
              <div className="text-sm font-semibold text-[#86868b] mb-2">Guest / Free</div>
              <div className="text-4xl font-extrabold text-white mb-4">$0</div>
              <p className="text-xs text-[#86868b] mb-6">Ideal for testing AI outreach quality.</p>
              <ul className="space-y-3 text-xs text-[#d1d1d6] mb-8">
                <li className="flex items-center gap-2"><Check size={14} className="text-[#30d158]" /> 5 Generations / day</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#30d158]" /> 5 Starter Modes</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#30d158]" /> Deliverability Scorecard</li>
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
              <div className="text-4xl font-extrabold text-white mb-4">$19 <span className="text-xs text-[#86868b] font-normal">/ 30 days</span></div>
              <p className="text-xs text-[#86868b] mb-6">Perfect for solo founders & freelancers.</p>
              <ul className="space-y-3 text-xs text-[#d1d1d6] mb-8">
                <li className="flex items-center gap-2"><Check size={14} className="text-[#0a84ff]" /> 50 Generations / month</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#0a84ff]" /> 5 Core Modes</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#0a84ff]" /> Subject A/B Matrix</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#0a84ff]" /> Spam Detector</li>
              </ul>
            </div>
            <Link
              href="/studio"
              className="w-full py-3 bg-[#0a84ff] hover:bg-[#007aff] text-white font-semibold text-xs rounded-full transition-all text-center block shadow-lg shadow-[#0a84ff20]"
            >
              Upgrade in Studio
            </Link>
          </div>

          {/* Growth Tier */}
          <div className="p-8 rounded-3xl bg-[#141415] border-2 border-[#bf5af2] flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#bf5af2] text-white text-[10px] font-bold uppercase rounded-full">
              Most Popular
            </div>
            <div>
              <div className="text-sm font-semibold text-[#bf5af2] mb-2">Growth Pass</div>
              <div className="text-4xl font-extrabold text-white mb-4">$39 <span className="text-xs text-[#86868b] font-normal">/ 30 days</span></div>
              <p className="text-xs text-[#86868b] mb-6">For agencies and active SDRs.</p>
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
              <div className="text-4xl font-extrabold text-white mb-4">$79 <span className="text-xs text-[#86868b] font-normal">/ 30 days</span></div>
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

      {/* 7. FAQ Section */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto border-t border-[#1c1c1e]">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-[#86868b] uppercase tracking-widest mb-3">Questions & Answers</h2>
          <p className="text-3xl md:text-4xl font-bold text-white">Frequently Asked Questions</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How does the Deliverability Scorecard work?",
              a: "Our AI scans your email copy for blacklisted spam triggers, excessive capitalization, risky financial promises, and bad formatting. It outputs a score from 0-100 along with actionable tips to fix issues before sending.",
            },
            {
              q: "What are prepaid 30-day passes?",
              a: "Instead of forced recurring subscriptions, you buy a 30-day pass using PayPal. When your pass expires, you fall back to the Free tier until you choose to purchase another pass manually.",
            },
            {
              q: "Can I use WriteYourEmail without creating an account?",
              a: "Yes! Guests get 2 lifetime generations immediately. Creating a free account gives you 5 generations per day.",
            },
            {
              q: "Which AI models power the outreach generator?",
              a: "We utilize active Groq infrastructure powered by Llama-3.3-70B-Versatile and Llama-3.1-8b-Instant for real-time latency and copywriting mastery.",
            },
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl bg-[#141415] border border-[#1c1c1e] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-6 text-left flex items-center justify-between text-white font-semibold text-base"
              >
                <span>{item.q}</span>
                {openFaq === idx ? <ChevronUp size={20} className="text-[#0a84ff]" /> : <ChevronDown size={20} className="text-[#86868b]" />}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-sm text-[#86868b] leading-relaxed border-t border-[#1c1c1e] pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Final Call to Action */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#0a84ff20] via-[#bf5af220] to-[#0a84ff10] border border-[#2c2c2e] p-10 md:p-16 text-center relative overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Multiply Your Outreach Reply Rates?
          </h2>
          <p className="text-[#d1d1d6] max-w-xl mx-auto mb-8 text-base">
            Join thousands of sales reps, founders, and marketers generating high-deliverability copy in seconds.
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#0a84ff] hover:bg-[#007aff] text-white font-bold text-base rounded-full transition-all shadow-xl shadow-[#0a84ff30]"
          >
            Launch WriteYourEmail Studio
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="py-12 px-6 border-t border-[#1c1c1e] text-xs text-[#86868b]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size={24} showText={true} />
            <span>© 2025 WriteYourEmail.com. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap gap-6 items-center">
            <Link href="/studio" className="hover:text-white transition-colors">
              Studio
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing Passes
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a
              href="mailto:help@writeyouremail.com"
              className="text-[#0a84ff] hover:underline flex items-center gap-1 font-mono"
            >
              <Mail size={12} /> help@writeyouremail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
