"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Search,
  ChevronRight,
  Terminal,
  Mail,
  FileText,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react";

// Fixed inline Logo for reliable SSR prerendering
function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0a84ff] to-[#bf5af2] text-white shadow-lg shadow-[#0a84ff]/20">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white">
        WriteYour<span className="text-[#0a84ff]">Email</span>
      </span>
    </div>
  );
}

export default function DocumentationPage() {
  const [activeCategory, setActiveCategory] = useState("deliverability");
  const [searchQuery, setSearchQuery] = useState("");

  const docCategories = [
    { id: "deliverability", label: "Deliverability Suite", icon: ShieldCheck },
    { id: "modes", label: "30 Outreach Modes", icon: Layers },
    { id: "technical", label: "DNS & Technical Setup", icon: Terminal },
    { id: "best-practices", label: "Cold Outreach Playbook", icon: BookOpen },
    { id: "faq", label: "Passes & Billing", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 font-sans selection:bg-[#0a84ff] selection:text-white">
      {/* Universal Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-[#1c1c1e] bg-[#000000]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Logo />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm text-gray-400 transition hover:text-white">
              Home
            </Link>
            <Link href="/studio" className="text-sm text-gray-400 transition hover:text-white">
              Studio
            </Link>
            <Link href="/docs" className="text-sm text-[#0a84ff] font-medium">
              Docs & Guides
            </Link>
            <Link href="/pricing" className="text-sm text-gray-400 transition hover:text-white">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/studio"
              className="rounded-xl bg-[#0a84ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0071e3] shadow-lg shadow-[#0a84ff]/25"
            >
              Open Studio
            </Link>
          </div>
        </div>
      </nav>

      {/* Docs Header */}
      <header className="border-b border-[#1c1c1e] bg-gradient-to-b from-[#0a0a0a] to-[#000000] py-16 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0a84ff]/30 bg-[#0a84ff]/10 px-4 py-1.5 text-xs font-semibold text-[#0a84ff] mb-4">
            <BookOpen className="h-3.5 w-3.5" /> Documentation & Knowledge Base
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Master Cold Outreach & Email Deliverability
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to bypass spam filters, configure domain DNS, craft high-converting emails, and maximize open rates.
          </p>

          {/* Docs Search Input */}
          <div className="mt-8 mx-auto max-w-xl relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search docs (e.g., SPF, DKIM, Spam Triggers, Subject Lines)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#222224] bg-[#141415] pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:border-[#0a84ff] focus:outline-none focus:ring-1 focus:ring-[#0a84ff]"
            />
          </div>
        </div>
      </header>

      {/* Main Documentation Container */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Category Navigation */}
          <aside className="lg:col-span-1 space-y-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-3">
              Documentation Topics
            </div>
            {docCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-[#0a84ff] text-white shadow-lg shadow-[#0a84ff]/20"
                      : "text-gray-400 hover:bg-[#141415] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{cat.label}</span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? "rotate-90" : "opacity-40"}`} />
                </button>
              );
            })}

            <div className="pt-6">
              <div className="rounded-2xl border border-[#222224] bg-[#141415] p-5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#0a84ff]" /> Need Direct Help?
                </h4>
                <p className="mt-2 text-xs text-gray-400">
                  Have a specific deliverability question or custom campaign audit request?
                </p>
                <a
                  href="mailto:help@writeyouremail.com"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a84ff] hover:underline"
                >
                  Contact Founder Support <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* Documentation Content Area */}
          <section className="lg:col-span-3 space-y-12">
            {/* CATEGORY 1: Deliverability Suite */}
            {activeCategory === "deliverability" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-[#1c1c1e] pb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <ShieldCheck className="h-7 w-7 text-[#0a84ff]" />
                    AI Spam Trigger Detector & Deliverability Scorecard
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Understanding how WriteYourEmail evaluates your copy and ensures primary inbox placement.
                  </p>
                </div>

                {/* Article 1 */}
                <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">1. How the Deliverability Score (0–100) Works</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Every draft generated or analyzed in WriteYourEmail is tested against standard spam filtering algorithms used by Gmail (Google Workspace), Outlook (Microsoft 365), Proofpoint, and Mimecast.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="rounded-xl border border-[#30d158]/30 bg-[#30d158]/5 p-4">
                      <div className="text-xl font-extrabold text-[#30d158]">90 – 100</div>
                      <div className="text-xs font-bold text-white mt-1">Primary Inbox Ready</div>
                      <p className="text-xs text-gray-400 mt-1">Zero spam triggers, optimal word count (50-125 words), strong natural CTA.</p>
                    </div>

                    <div className="rounded-xl border border-[#ffd60a]/30 bg-[#ffd60a]/5 p-4">
                      <div className="text-xl font-extrabold text-[#ffd60a]">70 – 89</div>
                      <div className="text-xs font-bold text-white mt-1">Moderate Risk</div>
                      <p className="text-xs text-gray-400 mt-1">Minor trigger words or lengthy paragraphs. May land in Promotions tab.</p>
                    </div>

                    <div className="rounded-xl border border-[#ff453a]/30 bg-[#ff453a]/5 p-4">
                      <div className="text-xl font-extrabold text-[#ff453a]">Below 70</div>
                      <div className="text-xs font-bold text-white mt-1">High Spam Flag Risk</div>
                      <p className="text-xs text-gray-400 mt-1">Contains aggressive sales jargon ("100% free", "guaranteed", "click here").</p>
                    </div>
                  </div>
                </div>

                {/* Article 2 */}
                <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">2. High-Risk Spam Trigger Words to Avoid</h3>
                  <p className="text-sm text-gray-300">
                    Email service providers (ESPs) scan incoming copy for transactional or pushy marketing terms. WriteYourEmail automatically sanitizes the following categories:
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3 text-sm text-gray-300">
                      <AlertTriangle className="h-5 w-5 text-[#ff453a] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Financial & Guarantee Flags:</strong> "100% free", "Risk-free", "Earn $$$", "No obligation", "Double your income".
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-gray-300">
                      <AlertTriangle className="h-5 w-5 text-[#ff453a] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Urgency & Pushy CTAs:</strong> "Act now", "Limited time", "Click here immediately", "Urgent request".
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-gray-300">
                      <AlertTriangle className="h-5 w-5 text-[#ff453a] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Formatting Red Flags:</strong> All CAPS subject lines, excessive exclamation marks (!!!), multiple tracking links.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 2: Outreach Modes */}
            {activeCategory === "modes" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-[#1c1c1e] pb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Layers className="h-7 w-7 text-[#bf5af2]" />
                    30 Dynamic Outreach Modes Guide
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    How to choose the exact outreach mode for your specific acquisition channel.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-5">
                    <div className="text-sm font-bold text-[#0a84ff]">Cold Sales & B2B Pitch</div>
                    <p className="text-xs text-gray-400 mt-1">
                      Generates short, problem-focused email drafts (75-100 words) targeted at agency decision makers or SDR leads.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-5">
                    <div className="text-sm font-bold text-[#bf5af2]">Multi-Step Follow-Up Sequence</div>
                    <p className="text-xs text-gray-400 mt-1">
                      Creates gentle, non-annoying bump emails (Step 2 & Step 3) designed to revive cold conversations.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-5">
                    <div className="text-sm font-bold text-[#30d158]">LinkedIn InMail & DM</div>
                    <p className="text-xs text-gray-400 mt-1">
                      Formats conversational, non-salesy social messages under 300 characters to ensure maximum connection responses.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-5">
                    <div className="text-sm font-bold text-[#ffd60a]">Investor & Seed Pitch</div>
                    <p className="text-xs text-gray-400 mt-1">
                      Structured for angel investors and VCs, emphasizing traction metrics, market size, and pitch deck access.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 3: Technical DNS Setup */}
            {activeCategory === "technical" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-[#1c1c1e] pb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Terminal className="h-7 w-7 text-[#30d158]" />
                    Essential Technical Domain Setup (SPF, DKIM, DMARC)
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Before sending high-volume cold outreach, configure these 3 mandatory DNS records to protect your domain reputation.
                  </p>
                </div>

                {/* SPF Guide */}
                <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">1. SPF (Sender Policy Framework)</h3>
                    <span className="text-xs font-mono bg-[#1c1c1e] text-[#0a84ff] px-2.5 py-1 rounded-md">TXT Record</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Tells receiving servers which IP addresses are authorized to send email on behalf of your domain.
                  </p>
                  <div className="rounded-xl bg-[#141415] border border-[#222224] p-3 font-mono text-xs text-[#30d158]">
                    v=spf1 include:_spf.google.com ~all
                  </div>
                </div>

                {/* DMARC Guide */}
                <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">2. DMARC Alignment</h3>
                    <span className="text-xs font-mono bg-[#1c1c1e] text-[#bf5af2] px-2.5 py-1 rounded-md">TXT Record (_dmarc)</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Instructs recipient servers how to handle emails that fail SPF or DKIM checks.
                  </p>
                  <div className="rounded-xl bg-[#141415] border border-[#222224] p-3 font-mono text-xs text-[#bf5af2]">
                    v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 4: Best Practices */}
            {activeCategory === "best-practices" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-[#1c1c1e] pb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <BookOpen className="h-7 w-7 text-[#ffd60a]" />
                    Cold Email Deliverability Checklist
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Follow these 5 rules before launching any outbound campaign.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "Use a Secondary Domain for Outreach", desc: "Never launch cold emails from your primary company domain (e.g., use getyourcompany.com instead of yourcompany.com) to safeguard core email operations." },
                    { title: "Warm Up New Domains for 14-21 Days", desc: "Start with 5 emails/day and gradually ramp up to 30-50 emails/day per inbox." },
                    { title: "Keep Character Count Under 120 Words", desc: "Prospects skim emails on mobile devices. Short emails get 3x higher response rates." },
                    { title: "Use Plain Text Over HTML", desc: "Avoid heavy HTML templates, images, and multiple hyperlinked buttons which trigger promotional tab routing." },
                    { title: "Test Copy in WriteYourEmail Studio First", desc: "Ensure your draft gets a 90+ score and 0 spam trigger warnings before sending." },
                  ].map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-4 rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0a84ff]/10 text-[#0a84ff] font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{rule.title}</h4>
                        <p className="mt-1 text-xs text-gray-400 leading-relaxed">{rule.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORY 5: FAQ & Prepaid Passes */}
            {activeCategory === "faq" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-[#1c1c1e] pb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <HelpCircle className="h-7 w-7 text-[#0a84ff]" />
                    Prepaid Passes & Account FAQ
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Clear answers about billing, pass durations, and usage limits.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6">
                    <h3 className="text-sm font-bold text-white">How do 30-Day Prepaid Passes work?</h3>
                    <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                      We do not charge recurring monthly subscriptions. When you purchase a Starter ($19), Growth ($39), or Enterprise ($79) pass via PayPal, you get 30 full days of access. It automatically expires after 30 days without surprise auto-renewals.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6">
                    <h3 className="text-sm font-bold text-white">How do I use the LAUNCH50 discount code?</h3>
                    <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                      Visit the <Link href="/pricing" className="text-[#0a84ff] underline">Pricing Page</Link>, type <code className="bg-[#1c1c1e] px-1.5 py-0.5 rounded text-white">LAUNCH50</code> into the discount input, and click Apply. All pass prices will immediately reduce by 50% ($9.50 for Starter, $19.50 for Growth).
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6">
                    <h3 className="text-sm font-bold text-white">What is the free guest limit?</h3>
                    <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                      Guest visitors get 2 free lifetime generations. Free registered accounts get 5 generations per day forever.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Universal Footer */}
      <footer className="border-t border-[#1c1c1e] bg-[#000000] py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-xs text-gray-500">© 2025 All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/studio" className="hover:text-white transition">Studio</Link>
            <Link href="/docs" className="hover:text-white transition">Docs</Link>
            <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <a href="mailto:help@writeyouremail.com" className="hover:text-white transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}