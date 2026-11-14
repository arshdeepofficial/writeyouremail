"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Layers,
  Mail,
  FileText,
  ChevronRight,
  Star,
  MessageSquare,
  Lock,
  Check,
  Tag,
  BarChart3,
  Sliders,
  Terminal,
  Globe,
  Users,
  TrendingUp,
  AlertTriangle,
  PlayCircle,
  Inbox,
  Send,
  RefreshCw,
  Cpu,
  ChevronDown,
  Target,
  Briefcase,
  PenTool,
  Server, // Fixed: Server icon import added here
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

// ----------------------------------------------------------------------
// DATA ARRAYS (Testimonials, FAQs, Features)
// ----------------------------------------------------------------------

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "VP of Sales, TechFlow",
    content: "Before WriteYourEmail, our outbound campaigns were hitting a wall. Our open rates were hovering around 12%. Once we started using the Spam Sanitizer and adjusting our copy to hit a 90+ score, our open rates jumped to 48%. It's the highest ROI tool in our stack.",
    avatar: "SJ"
  },
  {
    name: "Marcus Thorne",
    role: "Founder, GrowthMatrix Agency",
    content: "As a lead gen agency, deliverability is our lifeblood. If our clients' emails go to spam, we lose retainers. WriteYourEmail's 30 outreach modes and instant deliverability scoring completely replaced our manual copywriters and paid deliverability consultants.",
    avatar: "MT"
  },
  {
    name: "Elena Rodriguez",
    role: "Independent Consultant",
    content: "I don't have time to write custom sequences all day. The Follow-Up generator is magic. It references the first email and creates gentle, non-pushy bumps. I closed two $10k consulting contracts last month directly from the Follow-Up Mode drafts.",
    avatar: "ER"
  },
  {
    name: "David Chen",
    role: "SDR Manager, CloudSync",
    content: "The Subject Line A/B matrix is incredible. Instead of guessing what works, we generate 5 variations, pick the most natural one, and launch directly into Outlook. My team's workflow is 10x faster and our reply rate has never been healthier.",
    avatar: "DC"
  },
  {
    name: "Michael Ross",
    role: "B2B SaaS Founder",
    content: "I love the prepaid pass model. No surprise subscriptions. I buy a $39 Growth Pass when I have a heavy outreach month, and use the free tier when I'm just doing light networking. The UX is beautifully Apple-esque. A joy to use.",
    avatar: "MR"
  },
  {
    name: "Jessica Alba",
    role: "Head of Partnerships",
    content: "The LinkedIn Connection Mode is my secret weapon. It keeps the character count strictly under 300 and writes highly contextual, non-salesy invites. My connection acceptance rate went from 20% to over 65% in three weeks.",
    avatar: "JA"
  }
];

const faqs = [
  {
    question: "Why are my current cold emails going to the spam folder?",
    answer: "Most likely, you are using high-risk 'spam trigger' words. Email providers (Gmail, Outlook) use AI to scan incoming emails for promotional phrasing like 'guaranteed', '100% free', or 'click here'. WriteYourEmail identifies these triggers and replaces them before you hit send."
  },
  {
    question: "How does the Deliverability Score (0-100) actually work?",
    answer: "Our scoring engine evaluates your draft against a multi-factor algorithm modeling Google Workspace and Microsoft 365 filters. It penalizes heavy spam trigger usage, excessive text length (over 150 words), high link density, and pushy formatting to give you a real-time inbox readiness score."
  },
  {
    question: "Do I need a monthly subscription to use this?",
    answer: "No. We hate subscription traps. We use a 30-Day Prepaid Pass model. You buy a pass for $19, $39, or $79, and you get 30 days of full access. When it expires, you revert to the free tier. No automatic renewals, ever."
  },
  {
    question: "Does it integrate with my current email client?",
    answer: "Yes! WriteYourEmail features a '1-Click Launch' integration. Once your draft is perfect, you click a button to instantly open it in either the Gmail or Outlook compose window, with the subject line and body text already formatted."
  },
  {
    question: "What outreach modes do you support?",
    answer: "We have 30 dynamic modes. This includes Cold B2B Sales, Multi-Step Follow-Ups, LinkedIn Connection Requests, Investor Pitches, SaaS Demo Invites, Job Applications, Influencer Outreach, and much more."
  },
  {
    question: "Can I use the LAUNCH50 code right now?",
    answer: "Yes! While the early bird promotion lasts, you can enter LAUNCH50 on the Pricing page to get 50% off any 30-day prepaid pass, bringing the Starter Pass down to just $9.50."
  }
];

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activePersona, setActivePersona] = useState("founders");

  const toggleFaq = (index: number) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 font-sans selection:bg-[#0a84ff] selection:text-white">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full bg-gradient-to-r from-[#0a84ff] via-[#bf5af2] to-[#0a84ff] bg-[length:200%_auto] py-2.5 px-4 text-center text-xs md:text-sm font-semibold text-white shadow-md">
        🚀 Product Hunt Launch Special: Use code{" "}
        <Link
          href="/pricing"
          className="underline font-mono bg-white/20 px-1.5 py-0.5 rounded hover:bg-white/30 transition-all cursor-pointer shadow-sm"
        >
          LAUNCH50
        </Link>{" "}
        for 50% OFF all 30-day prepaid passes!
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. UNIVERSAL NAVIGATION */}
      {/* ------------------------------------------------------------------ */}
      <nav className="sticky top-0 z-50 border-b border-[#1c1c1e] bg-[#000000]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Logo />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <Link href="/" className="text-sm text-[#0a84ff] font-medium">
              Home
            </Link>
            <Link href="/studio" className="text-sm text-gray-400 transition hover:text-white flex items-center gap-1">
              Studio <Zap className="h-3 w-3 text-[#ffd60a]" />
            </Link>
            <Link href="/docs" className="text-sm text-gray-400 transition hover:text-white flex items-center gap-1">
              Docs & Guides <span className="text-[9px] bg-[#0a84ff]/20 text-[#0a84ff] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider font-bold">New</span>
            </Link>
            <Link href="#features" className="text-sm text-gray-400 transition hover:text-white">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-gray-400 transition hover:text-white">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition"
            >
              Get a Pass
            </Link>
            <Link
              href="/studio"
              className="rounded-xl bg-[#0a84ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0071e3] shadow-lg shadow-[#0a84ff]/25 flex items-center gap-2"
            >
              Open Studio <ArrowRight className="h-4 w-4 hidden sm:block" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* 3. HERO SECTION WITH UI MOCKUP */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[#0a84ff]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] bg-[#bf5af2]/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-6xl px-6 text-center relative z-10">
          <Link href="/docs" className="inline-flex items-center gap-2 rounded-full border border-[#0a84ff]/30 bg-[#0a84ff]/10 px-4 py-1.5 text-xs font-semibold text-[#0a84ff] mb-8 hover:bg-[#0a84ff]/20 transition cursor-pointer">
            <ShieldCheck className="h-4 w-4" /> 
            <span>Read the ultimate email deliverability playbook</span>
            <ChevronRight className="h-3 w-3" />
          </Link>

          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl leading-tight">
            Stop landing in <span className="text-[#ff453a] line-through decoration-4 opacity-80">spam</span>.<br />
            Land in the <span className="bg-gradient-to-r from-[#0a84ff] via-[#bf5af2] to-[#30d158] bg-clip-text text-transparent">Primary Inbox.</span>
          </h1>

          <p className="mt-8 text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed sm:text-xl">
            The world's first AI outreach generator with a built-in Deliverability Engine. Automatically detect spam trigger words, score your inbox readiness, and write high-converting copy in sub-seconds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/studio"
              className="w-full sm:w-auto rounded-2xl bg-[#0a84ff] px-8 py-4 text-base font-bold text-white transition hover:bg-[#0071e3] shadow-2xl shadow-[#0a84ff]/30 flex items-center justify-center gap-2"
            >
              <span>Try Studio for Free</span>
              <Zap className="h-5 w-5" />
            </Link>

            <Link
              href="/pricing"
              className="w-full sm:w-auto rounded-2xl border border-[#222224] bg-[#141415] px-8 py-4 text-base font-semibold text-gray-300 transition hover:bg-[#1c1c1e] hover:text-white flex items-center justify-center gap-2"
            >
              <Tag className="h-5 w-5 text-[#bf5af2]" />
              <span>View Prepaid Passes</span>
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-500 flex items-center justify-center gap-4 font-medium">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#30d158]" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#30d158]" /> 2 free guest generations</span>
          </p>
        </div>

        {/* Hero App Mockup */}
        <div className="mx-auto max-w-5xl px-6 mt-20 relative">
          <div className="rounded-t-2xl border-t border-l border-r border-[#222224] bg-[#0a0a0a] shadow-2xl overflow-hidden ring-1 ring-white/5">
            {/* Mockup Top Bar */}
            <div className="bg-[#141415] border-b border-[#222224] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff453a]" />
                <div className="h-3 w-3 rounded-full bg-[#ffd60a]" />
                <div className="h-3 w-3 rounded-full bg-[#30d158]" />
              </div>
              <div className="mx-auto rounded-md bg-[#1c1c1e] px-24 py-1 text-[10px] text-gray-500 font-mono border border-[#222224]">
                writeyouremail.com/studio
              </div>
            </div>
            
            {/* Mockup Content */}
            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Fake Inputs */}
              <div className="col-span-1 space-y-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-gray-400">Outreach Mode</div>
                  <div className="rounded-xl border border-[#222224] bg-[#1c1c1e] p-3 text-sm text-white flex justify-between items-center">
                    Cold B2B Prospecting <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-gray-400">Prospect Context</div>
                  <div className="rounded-xl border border-[#222224] bg-[#1c1c1e] p-3 text-sm text-gray-300 h-24">
                    Pitching our SEO agency services to SaaS founders who recently raised a Series A...
                  </div>
                </div>
                <div className="rounded-xl bg-[#0a84ff] p-3 text-center text-sm font-bold text-white flex items-center justify-center gap-2 opacity-80">
                  <Sparkles className="h-4 w-4" /> Generate Email
                </div>
              </div>

              {/* Fake Output & Analytics */}
              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="flex items-center justify-between border-b border-[#1c1c1e] pb-4">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#30d158]" /> Deliverability: Optimal
                  </div>
                  <div className="text-2xl font-extrabold text-[#30d158]">98<span className="text-sm text-gray-500">/100</span></div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject Lines</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-[#222224] bg-[#141415] p-2.5 text-xs text-white">quick question re: growth</div>
                    <div className="rounded-lg border border-[#0a84ff]/30 bg-[#0a84ff]/10 p-2.5 text-xs text-[#0a84ff] font-semibold flex justify-between">
                      scaling SEO post Series A <Check className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sanitized Draft</div>
                  <div className="rounded-xl border border-[#222224] bg-[#141415] p-5 text-sm text-gray-300 leading-relaxed font-serif">
                    Hi [Name],<br/><br/>
                    Noticed the recent Series A announcement—congratulations to you and the team.<br/><br/>
                    Many SaaS companies hit a growth bottleneck post-funding when trying to scale organic acquisition. Our team built a framework that typically <span className="bg-[#ff453a]/20 text-[#ff453a] px-1 rounded line-through">guarantees 10x traffic</span> <span className="bg-[#30d158]/20 text-[#30d158] px-1 rounded font-medium">improves inbound pipeline metrics</span> within 90 days.<br/><br/>
                    Are you open to reviewing a quick benchmark report on how your competitors are currently ranking?<br/><br/>
                    Best,<br/>Arshdeep
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fade out bottom gradient */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#000000] to-transparent" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. LOGO CLOUD / SOCIAL PROOF */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-b border-[#1c1c1e] bg-[#0a0a0a] py-10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
            Engineered to bypass filters at the world's top ESPs
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
            <div className="flex items-center gap-2 text-xl font-bold text-white"><Mail className="h-6 w-6"/> Gmail</div>
            <div className="flex items-center gap-2 text-xl font-bold text-white"><Inbox className="h-6 w-6"/> Outlook</div>
            <div className="flex items-center gap-2 text-xl font-bold text-white"><ShieldCheck className="h-6 w-6"/> Proofpoint</div>
            <div className="flex items-center gap-2 text-xl font-bold text-white"><Server className="h-6 w-6"/> Mimecast</div>
            <div className="flex items-center gap-2 text-xl font-bold text-white"><Globe className="h-6 w-6"/> Google Workspace</div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. PROBLEM & SOLUTION (BENTO GRID) */}
      {/* ------------------------------------------------------------------ */}
      <section id="features" className="py-24 bg-[#000000]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
              Generic AI writes spam. <br className="hidden sm:block"/>
              <span className="text-[#0a84ff]">We write for the inbox.</span>
            </h2>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              If your cold email lands in the promotions tab or spam folder, your open rate is 0%. WriteYourEmail is built specifically to outsmart modern security filters and force your message into the primary inbox.
            </p>
          </div>

          {/* Apple-Style Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
            
            {/* Box 1: Deliverability Score (Span 2) */}
            <div className="col-span-1 md:col-span-2 rounded-3xl border border-[#1c1c1e] bg-[#0a0a0a] p-8 relative overflow-hidden group hover:border-[#222224] transition-all">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <BarChart3 className="h-48 w-48 text-[#0a84ff]" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a84ff]/10 text-[#0a84ff] mb-6">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Live Deliverability Scorecard</h3>
                  <p className="mt-3 text-sm text-gray-400 max-w-md leading-relaxed">
                    Stop guessing. Get a real-time 0-100 score on your draft's inbox readiness. We analyze sentence length, tracking link density, and CTA friction to ensure you score 90+ every time.
                  </p>
                </div>
                <Link href="/docs" className="text-sm font-semibold text-[#0a84ff] flex items-center gap-1.5 hover:underline">
                  Read Scoring Algorithm <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Box 2: Spam Sanitizer */}
            <div className="col-span-1 rounded-3xl border border-[#1c1c1e] bg-[#0a0a0a] p-8 relative overflow-hidden group hover:border-[#222224] transition-all">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff453a]/10 text-[#ff453a] mb-6">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Spam Trigger Sanitizer</h3>
                  <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                    Automatically detects high-risk words ("guaranteed", "100% free") and replaces them with safe alternatives.
                  </p>
                </div>
                <div className="mt-4 rounded-xl border border-[#222224] bg-[#141415] p-3 text-xs font-mono text-gray-300">
                  <span className="line-through text-[#ff453a]">Act now for a free demo</span><br/>
                  <span className="text-[#30d158]">Open to exploring a review?</span>
                </div>
              </div>
            </div>

            {/* Box 3: 30 Modes */}
            <div className="col-span-1 rounded-3xl border border-[#1c1c1e] bg-[#0a0a0a] p-8 relative overflow-hidden group hover:border-[#222224] transition-all">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#bf5af2]/10 text-[#bf5af2] mb-6">
                    <Layers className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">30 Outreach Modes</h3>
                  <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                    From LinkedIn Executive InMails to Multi-Step Follow-Ups. Dynamic inputs for every channel.
                  </p>
                </div>
                <Link href="/docs" className="text-sm font-semibold text-[#bf5af2] flex items-center gap-1.5 hover:underline mt-4">
                  View Mode Playbook <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Box 4: Subject Line Matrix & Direct Launch (Span 2) */}
            <div className="col-span-1 md:col-span-2 rounded-3xl border border-[#1c1c1e] bg-[#0a0a0a] p-8 relative overflow-hidden group hover:border-[#222224] transition-all flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#30d158]/10 text-[#30d158] mb-6">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Subject Lines & 1-Click Launch</h3>
                  <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                    Generate 5 high-converting subject line variations engineered for high open rates. Pick the winner, and push your sanitized draft directly into your Gmail or Outlook composer with a single click.
                  </p>
                </div>
                <div className="mt-6 flex gap-3">
                  <div className="rounded-xl border border-[#222224] bg-[#141415] px-4 py-2 text-xs font-semibold text-white flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#ea4335]" /> Open in Gmail
                  </div>
                  <div className="rounded-xl border border-[#222224] bg-[#141415] px-4 py-2 text-xs font-semibold text-white flex items-center gap-2">
                    <Inbox className="h-4 w-4 text-[#0078d4]" /> Open in Outlook
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. HOW IT WORKS (STEP-BY-STEP) */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 bg-[#0a0a0a] border-t border-[#1c1c1e]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              From idea to inbox in 3 seconds.
            </h2>
            <p className="mt-4 text-gray-400">
              No complex prompt engineering required. The Studio UI handles the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#0a84ff]/0 via-[#0a84ff]/20 to-[#0a84ff]/0 -z-10" />

            <div className="text-center space-y-4">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#141415] border border-[#222224] shadow-xl text-2xl font-extrabold text-white">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Select Mode</h3>
              <p className="text-sm text-gray-400">Choose from 30 targeted scenarios. E.g., B2B Pitch, Follow-Up, or LinkedIn DM.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#0a84ff]/10 border border-[#0a84ff]/30 shadow-xl shadow-[#0a84ff]/20 text-2xl font-extrabold text-[#0a84ff]">
                2
              </div>
              <h3 className="text-lg font-bold text-white">AI Sanitization</h3>
              <p className="text-sm text-gray-400">Llama 3.3 writes the draft while simultaneously scrubbing it of hard-coded spam triggers.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#30d158]/10 border border-[#30d158]/30 shadow-xl shadow-[#30d158]/20 text-2xl font-extrabold text-[#30d158]">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Verify & Send</h3>
              <p className="text-sm text-gray-400">Check your 0-100 Deliverability Score, pick a subject line, and 1-Click Launch into your ESP.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7. USE CASES / PERSONA TABS */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 bg-[#000000] border-t border-[#1c1c1e]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Who is WriteYourEmail for?
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Tabs Sidebar */}
            <div className="lg:w-1/3 flex flex-col gap-3">
              <button 
                onClick={() => setActivePersona("founders")}
                className={`text-left px-6 py-5 rounded-2xl border transition-all flex flex-col gap-2 ${activePersona === "founders" ? "bg-[#141415] border-[#0a84ff] shadow-lg shadow-[#0a84ff]/10" : "bg-[#0a0a0a] border-[#1c1c1e] hover:border-[#222224]"}`}
              >
                <div className={`flex items-center gap-3 font-bold ${activePersona === "founders" ? "text-white" : "text-gray-400"}`}>
                  <Target className={`h-5 w-5 ${activePersona === "founders" ? "text-[#0a84ff]" : ""}`} /> SaaS Founders
                </div>
                <p className="text-xs text-gray-500">Find early customers and secure investor meetings.</p>
              </button>

              <button 
                onClick={() => setActivePersona("agencies")}
                className={`text-left px-6 py-5 rounded-2xl border transition-all flex flex-col gap-2 ${activePersona === "agencies" ? "bg-[#141415] border-[#bf5af2] shadow-lg shadow-[#bf5af2]/10" : "bg-[#0a0a0a] border-[#1c1c1e] hover:border-[#222224]"}`}
              >
                <div className={`flex items-center gap-3 font-bold ${activePersona === "agencies" ? "text-white" : "text-gray-400"}`}>
                  <Briefcase className={`h-5 w-5 ${activePersona === "agencies" ? "text-[#bf5af2]" : ""}`} /> Agencies & Consultants
                </div>
                <p className="text-xs text-gray-500">Protect client deliverability and automate copywriting.</p>
              </button>

              <button 
                onClick={() => setActivePersona("sales")}
                className={`text-left px-6 py-5 rounded-2xl border transition-all flex flex-col gap-2 ${activePersona === "sales" ? "bg-[#141415] border-[#30d158] shadow-lg shadow-[#30d158]/10" : "bg-[#0a0a0a] border-[#1c1c1e] hover:border-[#222224]"}`}
              >
                <div className={`flex items-center gap-3 font-bold ${activePersona === "sales" ? "text-white" : "text-gray-400"}`}>
                  <TrendingUp className={`h-5 w-5 ${activePersona === "sales" ? "text-[#30d158]" : ""}`} /> Sales Teams (SDRs)
                </div>
                <p className="text-xs text-gray-500">Book more meetings with multi-step follow up sequences.</p>
              </button>
            </div>

            {/* Tab Content */}
            <div className="lg:w-2/3 rounded-3xl border border-[#222224] bg-[#0a0a0a] p-8 md:p-12 relative overflow-hidden">
              {activePersona === "founders" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#0a84ff]/30 bg-[#0a84ff]/10 px-4 py-1.5 text-xs font-semibold text-[#0a84ff]">
                    Popular Modes: B2B Pitch, Investor Pitch, Trial Conversion
                  </div>
                  <h3 className="text-2xl font-bold text-white">Stop sending generic founder updates.</h3>
                  <p className="text-gray-400 leading-relaxed">
                    As a founder, your time is best spent building product, not staring at a blank screen trying to write cold outreach that won't go to spam. WriteYourEmail formats perfect VC pitches, partner inquiries, and customer feedback loops in seconds.
                  </p>
                  <ul className="space-y-3 pt-4">
                    <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="h-5 w-5 text-[#0a84ff]" /> Keep domain reputation perfectly clean</li>
                    <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="h-5 w-5 text-[#0a84ff]" /> Ensure investor updates hit the primary inbox</li>
                    <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="h-5 w-5 text-[#0a84ff]" /> Scale early outbound without a dedicated SDR</li>
                  </ul>
                </div>
              )}

              {activePersona === "agencies" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#bf5af2]/30 bg-[#bf5af2]/10 px-4 py-1.5 text-xs font-semibold text-[#bf5af2]">
                    Popular Modes: Agency White-Label, Podcast Pitch, PR Outreach
                  </div>
                  <h3 className="text-2xl font-bold text-white">Protect your clients' domain reputation.</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Lead gen agencies die when their cold domains get burned by spam filters. Our Deliverability Scorecard acts as your ultimate safety net, ensuring your copywriters aren't stuffing campaigns with high-risk promotional triggers.
                  </p>
                  <ul className="space-y-3 pt-4">
                    <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="h-5 w-5 text-[#bf5af2]" /> Replace expensive deliverability consultants</li>
                    <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="h-5 w-5 text-[#bf5af2]" /> Standardize copy quality across all client accounts</li>
                    <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="h-5 w-5 text-[#bf5af2]" /> Access technical DNS (SPF/DKIM/DMARC) docs</li>
                  </ul>
                </div>
              )}

              {activePersona === "sales" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#30d158]/30 bg-[#30d158]/10 px-4 py-1.5 text-xs font-semibold text-[#30d158]">
                    Popular Modes: Follow-Up Sequence, LinkedIn InMail, Dormant Revival
                  </div>
                  <h3 className="text-2xl font-bold text-white">Book more meetings, send less spam.</h3>
                  <p className="text-gray-400 leading-relaxed">
                    SDRs have quotas to hit. Writing custom sequences for every prospect takes too long. WriteYourEmail's follow-up generator creates contextual, non-annoying thread bumps that force replies without hurting feelings.
                  </p>
                  <ul className="space-y-3 pt-4">
                    <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="h-5 w-5 text-[#30d158]" /> 1-Click Launch directly into Outlook or Gmail</li>
                    <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="h-5 w-5 text-[#30d158]" /> Stay under LinkedIn's strict 300 character limit</li>
                    <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="h-5 w-5 text-[#30d158]" /> A/B test 5 subject lines instantly</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 8. TESTIMONIALS (WALL OF LOVE) */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 bg-[#0a0a0a] border-t border-[#1c1c1e]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd60a]/30 bg-[#ffd60a]/10 px-4 py-1.5 text-xs font-semibold text-[#ffd60a] mb-6">
              <Star className="h-4 w-4 fill-current" /> Trusted by Outreach Professionals
            </div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Don't just take our word for it.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="rounded-3xl border border-[#1c1c1e] bg-[#141415] p-8 flex flex-col justify-between hover:border-[#222224] transition">
                <div className="space-y-4">
                  <div className="flex text-[#ffd60a]">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">"{testimonial.content}"</p>
                </div>
                <div className="mt-8 flex items-center gap-4 border-t border-[#1c1c1e] pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#222224] text-xs font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 9. PRICING TEASER */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 bg-[#000000] border-t border-[#1c1c1e]">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Simple, transparent prepaid passes.
          </h2>
          <p className="mt-4 text-lg text-gray-400 mb-12">
            No recurring subscriptions. Pay once for 30 days of full access. Cancel automatically.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="rounded-3xl border border-[#1c1c1e] bg-[#0a0a0a] p-8">
              <h3 className="text-xl font-bold text-white">Starter Pass</h3>
              <div className="my-4 text-3xl font-extrabold text-white">$19 <span className="text-sm font-normal text-gray-500">/ 30 days</span></div>
              <ul className="space-y-3 mb-8 text-sm text-gray-400">
                <li className="flex gap-2"><Check className="h-4 w-4 text-[#0a84ff] shrink-0" /> 50 AI Generations / mo</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-[#0a84ff] shrink-0" /> 5 Core Outreach Modes</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-[#0a84ff] shrink-0" /> Deliverability Scorecard</li>
              </ul>
              <Link href="/pricing" className="block w-full rounded-xl border border-[#222224] bg-[#141415] py-3 text-center text-sm font-semibold text-white hover:bg-[#1c1c1e] transition">View Pass</Link>
            </div>

            <div className="rounded-3xl border border-[#0a84ff] bg-[#141415] p-8 shadow-2xl shadow-[#0a84ff]/10 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0a84ff] to-[#bf5af2] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-bold text-white">Growth Pass</h3>
              <div className="my-4 text-3xl font-extrabold text-[#30d158] flex items-center gap-2">
                $39 <span className="text-sm font-normal text-gray-500 line-through">$78</span>
              </div>
              <p className="text-xs text-[#30d158] font-bold bg-[#30d158]/10 border border-[#30d158]/20 px-2 py-0.5 rounded inline-block mb-4">Code LAUNCH50 Applied</p>
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex gap-2"><Check className="h-4 w-4 text-[#0a84ff] shrink-0" /> Unlimited AI Generations</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-[#0a84ff] shrink-0" /> All 30 Outreach Modes</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-[#0a84ff] shrink-0" /> Spam Trigger Sanitizer</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-[#0a84ff] shrink-0" /> 1-Click Mail Launch</li>
              </ul>
              <Link href="/pricing" className="block w-full rounded-xl bg-[#0a84ff] py-3 text-center text-sm font-semibold text-white hover:bg-[#0071e3] transition shadow-lg shadow-[#0a84ff]/20">Get Growth Pass</Link>
            </div>

            <div className="rounded-3xl border border-[#1c1c1e] bg-[#0a0a0a] p-8">
              <h3 className="text-xl font-bold text-white">Enterprise</h3>
              <div className="my-4 text-3xl font-extrabold text-white">$79 <span className="text-sm font-normal text-gray-500">/ 30 days</span></div>
              <ul className="space-y-3 mb-8 text-sm text-gray-400">
                <li className="flex gap-2"><Check className="h-4 w-4 text-[#0a84ff] shrink-0" /> Unlimited Everything</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-[#0a84ff] shrink-0" /> Priority AI Queueing</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-[#0a84ff] shrink-0" /> Direct Support Access</li>
              </ul>
              <Link href="/pricing" className="block w-full rounded-xl border border-[#222224] bg-[#141415] py-3 text-center text-sm font-semibold text-white hover:bg-[#1c1c1e] transition">View Pass</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 10. FAQ ACCORDION */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 bg-[#0a0a0a] border-t border-[#1c1c1e]">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-2xl border border-[#1c1c1e] bg-[#141415] overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-sm font-bold text-white">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${activeFaq === index ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6 text-sm text-gray-400 leading-relaxed border-t border-[#1c1c1e] pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">
              Still have questions? Check out our <Link href="/docs" className="text-[#0a84ff] hover:underline">Documentation</Link> or email <a href="mailto:help@writeyouremail.com" className="text-[#0a84ff] hover:underline">help@writeyouremail.com</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 11. FINAL CTA */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 bg-gradient-to-r from-[#0a84ff]/20 via-[#bf5af2]/20 to-[#0a84ff]/20 border-t border-[#1c1c1e] text-center relative overflow-hidden">
        {/* Glow behind CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-[#0a84ff]/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-4xl px-6 space-y-8 relative z-10">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            Ready to fix your deliverability?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Try 2 free generations as a guest right now. No account required. Or lock in your 50% discount with promo code <span className="font-mono text-white underline bg-[#000000]/50 px-2 py-0.5 rounded">LAUNCH50</span>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/studio"
              className="w-full sm:w-auto rounded-xl bg-[#0a84ff] px-10 py-4 text-base font-bold text-white hover:bg-[#0071e3] transition shadow-xl shadow-[#0a84ff]/30 flex items-center justify-center gap-2"
            >
              Open Studio Now <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto rounded-xl border border-[#222224] bg-[#141415] px-10 py-4 text-base font-semibold text-gray-300 hover:bg-[#1c1c1e] hover:text-white transition"
            >
              View Prepaid Passes
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-4">
            <Lock className="h-3.5 w-3.5" /> Secure Checkout via PayPal Standard Orders
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 12. MEGA FOOTER */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-[#1c1c1e] bg-[#000000] pt-20 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1 space-y-4">
              <Logo />
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                The AI outreach generator built specifically to bypass spam filters, score deliverability, and maximize B2B open rates.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/studio" className="hover:text-[#0a84ff] transition">AI Studio</Link></li>
                <li><Link href="/pricing" className="hover:text-[#0a84ff] transition">Prepaid Passes</Link></li>
                <li><Link href="/#features" className="hover:text-[#0a84ff] transition">Features</Link></li>
                <li><Link href="/#modes" className="hover:text-[#0a84ff] transition">30 Outreach Modes</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/docs" className="hover:text-[#0a84ff] transition">Documentation Hub</Link></li>
                <li><Link href="/docs" className="hover:text-[#0a84ff] transition">Deliverability Scorecard</Link></li>
                <li><Link href="/docs" className="hover:text-[#0a84ff] transition">DNS Setup (SPF/DKIM)</Link></li>
                <li><Link href="/docs" className="hover:text-[#0a84ff] transition">Spam Trigger Words</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="mailto:help@writeyouremail.com" className="hover:text-[#0a84ff] transition">Contact Support</a></li>
                <li><Link href="/privacy" className="hover:text-[#0a84ff] transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#0a84ff] transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1c1c1e] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © 2025 WriteYourEmail.com. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>Built for high-deliverability outreach.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}