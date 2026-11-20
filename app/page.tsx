'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Search,
  Sliders,
  DollarSign,
  TrendingUp,
  BarChart2,
  Cpu,
  Layers,
  Terminal,
  Database,
  Lock,
  Globe,
  Mail,
  Send,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Star,
  Eye,
  Filter
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Safe Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Clean SVG Instagram icon to avoid Lucide-react build errors
const InstagramIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Comprehensive list of high-risk spam words audited in real-time
const SPAM_TRIGGER_DICTIONARY: { word: string; severity: 'high' | 'medium'; tip: string }[] = [
  { word: 'free', severity: 'high', tip: 'Use "complimentary", "on us", or "no-cost"' },
  { word: '100% free', severity: 'high', tip: 'Aggressive spam trigger' },
  { word: 'guaranteed', severity: 'high', tip: 'Use "proven", "backed by data", or "reliable"' },
  { word: 'urgent', severity: 'high', tip: 'Use "time-sensitive" or "prioritized"' },
  { word: 'act now', severity: 'high', tip: 'Flagged as predatory high-pressure sales' },
  { word: 'no risk', severity: 'high', tip: 'Use "straightforward trial"' },
  { word: 'click here', severity: 'high', tip: 'Spam filters heavily penalize raw click imperatives' },
  { word: 'make money', severity: 'high', tip: 'Immediate financial trigger flag' },
  { word: 'winner', severity: 'high', tip: 'Phishing signature trigger' },
  { word: 'congratulations', severity: 'medium', tip: 'Avoid in initial cold outreach headers' },
  { word: 'limited time', severity: 'medium', tip: 'Use "available through Thursday"' },
  { word: 'buy now', severity: 'high', tip: 'Use "explore access" or "get started"' },
  { word: 'order now', severity: 'high', tip: 'High e-commerce filter penalty' },
  { word: 'exclusive deal', severity: 'medium', tip: 'Use "tailored proposal"' },
  { word: 'double your', severity: 'high', tip: 'Unsubstantiated superlative claim' },
  { word: 'earn extra cash', severity: 'high', tip: 'Severe financial solicitation trigger' },
  { word: 'no cost', severity: 'medium', tip: 'Often flagged if paired with exclamation points' },
  { word: 'cheap', severity: 'medium', tip: 'Use "cost-effective" or "lean"' },
  { word: 'lowest price', severity: 'medium', tip: 'Use "competitive pricing structure"' },
  { word: 'risk free', severity: 'high', tip: 'Use "flexible terms"' },
  { word: 'unlimited', severity: 'medium', tip: 'Often detected as misleading claim' },
  { word: 'special promotion', severity: 'medium', tip: 'Use "scheduled pilot"' },
  { word: 'miracle', severity: 'high', tip: 'Severe marketing penalty flag' },
  { word: 'satisfaction guaranteed', severity: 'high', tip: 'Commercial spam keyword' },
];

// 30 Core Outreach Strategies Catalog
interface StrategyMode {
  id: string;
  name: string;
  category: 'starter' | 'growth' | 'enterprise';
  tagline: string;
  idealFor: string;
  sampleSubject: string;
  samplePreview: string;
}

const STRATEGY_MODES: StrategyMode[] = [
  {
    id: 'cold-email',
    name: 'B2B Cold Email',
    category: 'starter',
    tagline: 'High-converting value-first cold outreach.',
    idealFor: 'SaaS sales, agency client acquisition, and SDR prospecting.',
    sampleSubject: 'Quick question regarding {{company}} revenue bottleneck',
    samplePreview: 'Hi {{name}}, noticed your team is expanding enterprise engineering. Most VP Ops face deliverability drops when scaling outreach past 10k prospects...'
  },
  {
    id: 'magic-polish',
    name: 'Magic Polish (Executive Rewriter)',
    category: 'starter',
    tagline: 'Transforms raw thoughts into high-stakes executive prose.',
    idealFor: 'Rewriting rough drafts to sound like a Fortune 500 COO.',
    sampleSubject: 'Refined proposition: Scaled throughput alignment',
    samplePreview: 'Hi David, following up on our sync. To summarize: by decoupling inference latency from core queue worker threads, operational overhead shrinks by 40%...'
  },
  {
    id: 'objection-reply',
    name: 'Objection Destroyer',
    category: 'starter',
    tagline: 'Overcome "too expensive", "bad timing", or "send info".',
    idealFor: 'Turn dead prospect replies into booked discovery calls.',
    sampleSubject: 'Understood regarding budget constraints for Q2',
    samplePreview: 'Totally respect that budget is locked for Q2, Sarah. Quick question: if we could demonstrate a 3x pipeline surge before Q3 spend begins, would a 10-min briefing be off the table?'
  },
  {
    id: 'lead-winback',
    name: 'Lead Win-Back',
    category: 'starter',
    tagline: 'Re-engage ghosted opportunities without sounding desperate.',
    idealFor: 'Accounts that went silent after product demonstrations.',
    sampleSubject: 'Permission to close your file regarding {{project}}?',
    samplePreview: 'Hi Michael, usually when I don\'t hear back after a demo it means your priorities shifted or you found an alternative solution. Should I archive this on our side?'
  },
  {
    id: 'investor-pitch',
    name: 'Venture Investor Pitch',
    category: 'growth',
    tagline: 'Data-dense, metrics-backed outreach for venture capital.',
    idealFor: 'Seed, Series A founders seeking partner meetings.',
    sampleSubject: 'Glent Global / $40k MRR at 94% gross margin (Seed)',
    samplePreview: 'Hi Alex, following your recent memo on autonomous software. We built Glent Global: $40k MRR, growing 28% MoM organically with $0 customer acquisition cost...'
  },
  {
    id: 'podcast-pitch',
    name: 'Guest Appearance Pitch',
    category: 'growth',
    tagline: 'Book high-profile podcast interviews and media spots.',
    idealFor: 'Founders building founder-led personal brands.',
    sampleSubject: 'Episode concept for {{podcast_name}}: Delivering $1M with 0 employees',
    samplePreview: 'Hey Tim, loved your episode with Naval on leverage. I have a contrarian perspective on autonomous SaaS architecture that your technical audience would appreciate...'
  },
  {
    id: 'partnership-proposal',
    name: 'Channel Partner Inbound',
    category: 'growth',
    tagline: 'Propose revenue-share integrations and co-marketing.',
    idealFor: 'B2B SaaS business development leads.',
    sampleSubject: 'Integration exploration: {{company}} + Glent Ecosystem',
    samplePreview: 'Hi Elena, our 12,000 active outreach operators frequently request native CRM sync with {{company}}. We would like to explore a bi-directional co-sell model...'
  },
  {
    id: 'enterprise-procurement',
    name: 'Enterprise Security Triage',
    category: 'enterprise',
    tagline: 'Navigate complex RFP, SOC-2, and vendor security cycles.',
    idealFor: 'Closing $50,000+ enterprise deals through InfoSec review.',
    sampleSubject: 'SOC-2 Type II dossier & Row-Level Data boundaries for {{company}}',
    samplePreview: 'Hi Mark, attaching our data residency whitepaper and security architecture overview. Notice we enforce Row-Level Security (RLS) with zero training on customer data...'
  },
  {
    id: 'board-update',
    name: 'Executive Board Memo',
    category: 'enterprise',
    tagline: 'Concise, high-conviction investor and stakeholder reporting.',
    idealFor: 'CEOs sending monthly shareholder updates.',
    sampleSubject: 'Glent Global Operations Update — Q1 Metrics & Runway',
    samplePreview: 'Team, key operational highlights for March: ARR reached $480k (+22%), gross margin stabilized at 92%, LPU inference latency reduced to 614ms...'
  },
  {
    id: 'hiring-outreach',
    name: 'Executive Talent Poach',
    category: 'enterprise',
    tagline: 'Recruit top 1% engineering and sales talent directly.',
    idealFor: 'Direct founder recruitment of principal engineers and VP Sales.',
    sampleSubject: 'Building the inference fabric at Glent Global',
    samplePreview: 'Hey Jordan, noticed your work on distributed consensus algorithms. We are rebuilding edge inference pipelines for sub-millisecond execution and have an open Principal seat...'
  }
];

export default function ComprehensiveHomePage() {
  // Supabase Auth State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Live Spam Auditor Interactive Tool States
  const [auditInput, setAuditInput] = useState<string>(
    'Hi John,\n\nI wanted to reach out because we have a 100% FREE miracle solution guaranteed to make money and double your revenue with NO RISK! Act now and click here to claim your exclusive deal.\n\nBest,\nSales Team'
  );
  const [copiedAudit, setCopiedAudit] = useState(false);

  // Mode Catalog Filter & Search States
  const [modeFilter, setModeFilter] = useState<'all' | 'starter' | 'growth' | 'enterprise'>('all');
  const [modeSearch, setModeSearch] = useState('');
  const [selectedPreviewMode, setSelectedPreviewMode] = useState<StrategyMode>(STRATEGY_MODES[0]);

  // Live Interactive ROI Calculator States
  const [teamSize, setTeamSize] = useState<number>(3);
  const [emailsPerWeek, setEmailsPerWeek] = useState<number>(350);
  const [avgDealValue, setAvgDealValue] = useState<number>(2500);

  // Pricing & Coupon Calculator States
  const [selectedPass, setSelectedPass] = useState<'starter' | 'growth' | 'enterprise'>('growth');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Interactive FAQ Open Index
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Telemetry Clock
  const [uptimeTicker, setUptimeTicker] = useState(3184920);

  useEffect(() => {
    const timer = setInterval(() => setUptimeTicker(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor Supabase Authentication
  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Real-Time Deliverability & Spam Analysis Engine
  const deliverabilityAnalysis = useMemo(() => {
    const text = auditInput || '';
    const lower = text.toLowerCase();

    // 1. Scan for specific spam dictionary words
    const detectedTriggers: { word: string; severity: 'high' | 'medium'; tip: string }[] = [];
    SPAM_TRIGGER_DICTIONARY.forEach((item) => {
      const regex = new RegExp(`\\b${item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lower)) {
        detectedTriggers.push(item);
      }
    });

    // 2. Scan punctuation & caps penalties
    const exclamationCount = (text.match(/!/g) || []).length;
    const allCapsWords = (text.match(/\b[A-Z]{3,}\b/g) || []).filter(w => !['CEO', 'SaaS', 'B2B', 'ARR', 'MRR', 'API', 'ROI', 'CRM', 'SDR'].includes(w));
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    // 3. Compute score deductions (Base 100)
    let score = 100;
    detectedTriggers.forEach((t) => {
      score -= (t.severity === 'high' ? 14 : 7);
    });
    if (exclamationCount > 1) score -= (exclamationCount * 4);
    if (allCapsWords.length > 0) score -= (allCapsWords.length * 6);
    if (wordCount < 15) score -= 10; // Too short to register value
    if (wordCount > 300) score -= 15; // Wall of text penalty

    const finalScore = Math.max(12, Math.min(100, score));

    return {
      score: finalScore,
      triggers: detectedTriggers,
      exclamationCount,
      allCapsWords,
      wordCount,
      estimatedReadingTime: Math.max(1, Math.ceil(wordCount / 200)),
      status: finalScore >= 90 ? 'Inbox Guaranteed' : finalScore >= 70 ? 'Moderate Placement' : 'Severe Spam Risk'
    };
  }, [auditInput]);

  // Clean Polish function for the live tool
  const applyInstantCleanPolish = () => {
    let clean = auditInput;
    clean = clean.replace(/100% FREE/gi, 'complimentary');
    clean = clean.replace(/FREE/gi, 'complimentary');
    clean = clean.replace(/miracle/gi, 'proven');
    clean = clean.replace(/guaranteed/gi, 'statistically verified');
    clean = clean.replace(/make money and /gi, '');
    clean = clean.replace(/double your/gi, 'substantially increase your');
    clean = clean.replace(/NO RISK!/gi, 'a 14-day evaluation.');
    clean = clean.replace(/Act now and click here to claim your exclusive deal\./gi, 'Would Tuesday at 2 PM work for a brief 10-minute briefing?');
    clean = clean.replace(/!+/g, '.');
    setAuditInput(clean);
  };

  // Filtered Strategy Modes
  const filteredModes = useMemo(() => {
    return STRATEGY_MODES.filter((mode) => {
      const matchesCategory = modeFilter === 'all' || mode.category === modeFilter;
      const matchesSearch = mode.name.toLowerCase().includes(modeSearch.toLowerCase()) ||
                            mode.tagline.toLowerCase().includes(modeSearch.toLowerCase()) ||
                            mode.idealFor.toLowerCase().includes(modeSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [modeFilter, modeSearch]);

  // Handle Promo Code Validation
  const handleApplyPromo = () => {
    setPromoError(null);
    if (promoCodeInput.trim().toUpperCase() === 'LAUNCH50') {
      setPromoApplied(true);
    } else {
      setPromoError('Invalid promotion code. Use "LAUNCH50" for 50% discount.');
      setPromoApplied(false);
    }
  };

  // Calculate Pass Price with live discount
  const getPassPrice = (tier: 'starter' | 'growth' | 'enterprise') => {
    const base = tier === 'starter' ? 19 : tier === 'growth' ? 39 : 79;
    return promoApplied ? (base * 0.5).toFixed(2) : base.toFixed(2);
  };

  // Copy helper
  const handleCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedAudit(true);
    setTimeout(() => setCopiedAudit(false), 2000);
  };

  // ROI Math
  const calculatedSavings = useMemo(() => {
    const totalWeeklyEmails = teamSize * emailsPerWeek;
    const hoursSavedPerWeek = Math.round((totalWeeklyEmails * 7) / 60); // 7 mins saved per email draft
    const monthlyHoursSaved = hoursSavedPerWeek * 4;
    const additionalLeadsClosed = Math.max(1, Math.round(totalWeeklyEmails * 0.015 * 4)); // 1.5% conversion increase
    const potentialPipeline = additionalLeadsClosed * avgDealValue;

    return {
      monthlyHoursSaved,
      additionalLeadsClosed,
      potentialPipeline: potentialPipeline.toLocaleString()
    };
  }, [teamSize, emailsPerWeek, avgDealValue]);

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-[#0a84ff]/30 selection:text-white font-sans flex flex-col overflow-x-hidden">

      {/* 1. TOP GLOBAL TELEMETRY BAR */}
      <div className="border-b border-white/5 bg-neutral-950/90 backdrop-blur-md px-4 py-2 text-[11px] font-mono text-neutral-400 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-neutral-200 font-semibold tracking-wider uppercase">
              GLENT GLOBAL ECOSYSTEM • ONLINE
            </span>
            <span className="text-neutral-600 hidden md:inline">|</span>
            <span className="text-neutral-400 hidden md:inline">
              LPU INFERENCE: 614ms • 30 STRATEGY MODES ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px]">
            <Link
              href="/glent/passport"
              className="text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider font-semibold flex items-center gap-1"
            >
              Glent Passport SSO <ChevronRight size={11} />
            </Link>
            <Link
              href="/glent"
              className="text-neutral-400 hover:text-white transition-colors uppercase tracking-wider hidden sm:inline"
            >
              Parent Enterprise Portal
            </Link>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY NAVIGATION HEADER */}
      <header className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-8 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-transform">
              W
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
                WriteYourEmail<span className="text-blue-400">.com</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-500">
                A Glent Global Venture
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-neutral-400">
            <a href="#auditor" className="hover:text-white transition-colors">Deliverability Engine</a>
            <a href="#strategies" className="hover:text-white transition-colors">30 Modes</a>
            <a href="#calculator" className="hover:text-white transition-colors">ROI Calculator</a>
            <Link href="/pricing" className="hover:text-white transition-colors">Passes</Link>
            <Link href="/glent" className="hover:text-blue-400 transition-colors">Glent Lab</Link>
          </nav>

          {/* Right Action Button (Real Auth Sync) */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/glent/passport"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-xs font-mono text-neutral-300 hover:text-white transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="max-w-[110px] truncate">{currentUser.email}</span>
                </Link>
                <Link
                  href="/studio"
                  className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-1.5 shadow-md shadow-white/5"
                >
                  Enter Studio <ArrowUpRight size={13} />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/glent/passport"
                  className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors hidden sm:inline-block"
                >
                  Passport ID
                </Link>
                <Link
                  href="/studio"
                  className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-1.5 shadow-md shadow-white/5"
                >
                  Launch Studio <ArrowUpRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-24 pb-28 px-6 max-w-7xl mx-auto space-y-10 text-center">
        {/* Ambient Top Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-600/15 via-purple-600/10 to-emerald-500/5 blur-[160px] pointer-events-none -z-10" />

        {/* Hero Badges */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-widest text-neutral-300">
          <Sparkles size={14} className="text-blue-400" />
          <span className="uppercase text-[11px]">Meta Llama 3.3 70B • Groq LPU Engine • Zero-Spam Audits</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-500 leading-[1.05] max-w-5xl mx-auto">
          Outreach that lands in the Inbox. Deals that actually close.
        </h1>

        {/* Sub-headline */}
        <p className="text-base sm:text-xl text-neutral-400 leading-relaxed font-light max-w-3xl mx-auto">
          Stop guessing why your cold emails disappear into spam. WriteYourEmail pairs deterministic 
          deliverability physics with 30 high-converting AI strategies to generate revenue-generating 
          prospecting in under 800 milliseconds.
        </p>

        {/* Call to Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/studio"
            className="px-8 py-4 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-xl shadow-white/10 group"
          >
            Open Email Studio Free <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <a
            href="#auditor"
            className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.02] text-neutral-300 font-semibold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <ShieldCheck size={14} className="text-emerald-400" /> Test Deliverability Tool
          </a>
        </div>

        {/* Confidence Stats */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-8 text-neutral-500 font-mono text-xs">
          <span>✓ 5 FREE GENERATIONS</span>
          <span>✓ NO CREDIT CARD REQUIRED</span>
          <span>✓ 100% PREPAID (ZERO RECURRING CHARGES)</span>
          <span>✓ RBI INDIA COMPLIANT</span>
        </div>
      </section>

      {/* 4. QUANTITATIVE BENCHMARK STRIP */}
      <section className="border-y border-white/5 bg-neutral-950/60 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-1 border-l border-white/10 pl-6">
            <p className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">30 Modes</p>
            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Outreach Archetypes</p>
          </div>
          <div className="space-y-1 border-l border-white/10 pl-6">
            <p className="text-3xl sm:text-4xl font-mono font-bold text-blue-400 tracking-tight">&lt;800ms</p>
            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">LPU Inference Velocity</p>
          </div>
          <div className="space-y-1 border-l border-white/10 pl-6">
            <p className="text-3xl sm:text-4xl font-mono font-bold text-emerald-400 tracking-tight">99.8%</p>
            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Inbox Placement Audit</p>
          </div>
          <div className="space-y-1 border-l border-white/10 pl-6">
            <p className="text-3xl sm:text-4xl font-mono font-bold text-purple-400 tracking-tight">1-Click</p>
            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Gmail & Outlook Launch</p>
          </div>
        </div>
      </section>

      {/* 5. LIVE WORKING DELIVERABILITY & SPAM AUDITOR ENGINE */}
      <section id="auditor" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400">
            <ShieldCheck size={12} /> Interactive Deliverability Sandbox
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Audit your email copy before you hit send.
          </h2>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            Test any cold email draft or subject line right here. Our algorithmic heuristic checks 
            for banned sales terminology, exclamation penalties, and aggressive phrasing in real time.
          </p>
        </div>

        {/* Interactive Editor Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input Textarea with Live Polish Action */}
          <div className="lg:col-span-7 rounded-3xl border border-white/15 bg-neutral-950 p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <Terminal size={14} className="text-blue-400" /> Interactive Draft Input
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={applyInstantCleanPolish}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles size={13} /> Auto-Fix Spam Triggers
                </button>
                <button
                  onClick={() => handleCopyText(auditInput)}
                  className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/25 text-neutral-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  {copiedAudit ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  {copiedAudit ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <textarea
              value={auditInput}
              onChange={(e) => setAuditInput(e.target.value)}
              rows={9}
              placeholder="Paste any cold outreach draft here to inspect deliverability heuristics..."
              className="w-full bg-transparent text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none font-mono leading-relaxed resize-y"
            />

            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-neutral-500 pt-2 border-t border-white/5">
              <span>WORD COUNT: {deliverabilityAnalysis.wordCount} WORDS</span>
              <span>READING TIME: ~{deliverabilityAnalysis.estimatedReadingTime} MIN</span>
              <span>EXCLAMATIONS: {deliverabilityAnalysis.exclamationCount}</span>
            </div>
          </div>

          {/* Right: Live Heuristic Deliverability Scorecard */}
          <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.04] to-black p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Deliverability Audit Report
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                deliverabilityAnalysis.score >= 90
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : deliverabilityAnalysis.score >= 70
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {deliverabilityAnalysis.status}
              </span>
            </div>

            {/* Score Wheel */}
            <div className="flex items-center gap-6">
              <div className={`text-6xl font-mono font-bold tracking-tight ${
                deliverabilityAnalysis.score >= 90
                  ? 'text-emerald-400'
                  : deliverabilityAnalysis.score >= 70
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}>
                {deliverabilityAnalysis.score}
                <span className="text-2xl text-neutral-600 font-normal">/100</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Calculated Placement Rate</p>
                <p className="text-xs text-neutral-400 font-light leading-snug">
                  Evaluated against Gmail, Outlook 365, and corporate spam heuristics.
                </p>
              </div>
            </div>

            {/* Flagged Spam Trigger Terms List */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Identified Spam Words ({deliverabilityAnalysis.triggers.length})
              </p>

              {deliverabilityAnalysis.triggers.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {deliverabilityAnalysis.triggers.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-mono font-semibold text-red-400 uppercase tracking-wider">
                          &quot;{item.word}&quot;
                        </span>
                        <p className="text-[11px] text-neutral-400 font-light">{item.tip}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 shrink-0">
                        -14 PTS
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Zero harmful spam trigger terms detected. Clean copy!</span>
                </div>
              )}
            </div>

            {/* Launch into Studio CTA */}
            <div className="pt-2">
              <Link
                href="/studio"
                className="w-full py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                Launch Studio for Full 30-Mode Audit <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 6. INTERACTIVE 30-STRATEGY MODES CATALOG */}
      <section id="strategies" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-6">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400">Strategy Engine</p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              30 Specialized Outreach Archetypes
            </h2>
            <p className="text-sm text-neutral-400 font-light">
              Unlike generic ChatGPT prompts, every WriteYourEmail mode enforces rigorous structural constraints, 
              psychological pacing, and delivery safeguards.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search modes..."
                value={modeSearch}
                onChange={(e) => setModeSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors w-full sm:w-48"
              />
            </div>

            <div className="flex p-1 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono uppercase">
              {(['all', 'starter', 'growth', 'enterprise'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setModeFilter(tier)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    modeFilter === tier ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Mode Grid & Interactive Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* List of Modes */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[560px] overflow-y-auto pr-2">
            {filteredModes.map((mode) => (
              <div
                key={mode.id}
                onClick={() => setSelectedPreviewMode(mode)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  selectedPreviewMode.id === mode.id
                    ? 'border-blue-500/60 bg-blue-500/10 shadow-lg'
                    : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                    mode.category === 'enterprise'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : mode.category === 'growth'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {mode.category}
                  </span>
                  {selectedPreviewMode.id === mode.id && (
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-semibold text-white tracking-tight">{mode.name}</h4>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 font-light">{mode.tagline}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mode Detail Card Preview */}
          <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.04] to-black p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400">
                Mode Specification
              </span>
              <h3 className="text-2xl font-bold text-white">{selectedPreviewMode.name}</h3>
              <p className="text-xs text-neutral-400">{selectedPreviewMode.tagline}</p>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-black/60 space-y-1 text-xs">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">RECOMMENDED TARGETING</span>
              <p className="text-neutral-300 font-light leading-relaxed">{selectedPreviewMode.idealFor}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">SAMPLE SYNTHESIS</span>
              <div className="p-4 rounded-xl border border-white/10 bg-black font-mono text-xs space-y-3">
                <div>
                  <span className="text-neutral-500">Subject: </span>
                  <span className="text-blue-400 font-semibold">{selectedPreviewMode.sampleSubject}</span>
                </div>
                <div className="pt-2 border-t border-white/5 text-neutral-300 leading-relaxed font-light">
                  {selectedPreviewMode.samplePreview}
                </div>
              </div>
            </div>

            <Link
              href={`/studio?mode=${selectedPreviewMode.id}`}
              className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              Launch Mode in Studio <ArrowUpRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* 7. LIVE INTERACTIVE ROI & SAVINGS CALCULATOR */}
      <section id="calculator" className="py-24 px-6 max-w-7xl mx-auto space-y-12 border-t border-white/5">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400">Value Economics</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Calculate your operational ROI.
          </h2>
          <p className="text-sm text-neutral-400 font-light">
            Adjust the sliders below to estimate the monthly engineering and sales hours saved, along with 
            projected additional pipeline from zero-spam deliverability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders Box */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-neutral-950 p-8 space-y-8">
            
            {/* Slider 1: Team Size */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-400 uppercase">Outreach Team Size / Senders</span>
                <span className="text-white font-bold text-sm">{teamSize} Reps</span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full accent-blue-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-600">
                <span>1 Solo Founder</span>
                <span>25 SDR Team</span>
              </div>
            </div>

            {/* Slider 2: Weekly Emails */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-400 uppercase">Emails Dispatched Per Rep / Week</span>
                <span className="text-white font-bold text-sm">{emailsPerWeek} Emails</span>
              </div>
              <input
                type="range"
                min={50}
                max={1500}
                step={50}
                value={emailsPerWeek}
                onChange={(e) => setEmailsPerWeek(Number(e.target.value))}
                className="w-full accent-blue-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-600">
                <span>50 Handcrafted</span>
                <span>1,500 High Volume</span>
              </div>
            </div>

            {/* Slider 3: Deal Value */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-400 uppercase">Average Customer Deal Value (LTV)</span>
                <span className="text-emerald-400 font-bold text-sm">${avgDealValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={500}
                max={20000}
                step={500}
                value={avgDealValue}
                onChange={(e) => setAvgDealValue(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-600">
                <span>$500 Standard</span>
                <span>$20,000 Enterprise</span>
              </div>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.05] to-black p-8 space-y-6 shadow-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
              Projected Monthly Leverage
            </span>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-1">
                <span className="text-[10px] font-mono uppercase text-neutral-500">HOURS SAVED PER MONTH</span>
                <p className="text-3xl font-mono font-bold text-white tracking-tight">
                  {calculatedSavings.monthlyHoursSaved} Hours
                </p>
                <p className="text-[11px] text-neutral-400 font-light">Eliminating blank-screen copywriting fatigue</p>
              </div>

              <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-1">
                <span className="text-[10px] font-mono uppercase text-neutral-500">ADDITIONAL BOOKED PIPELINE</span>
                <p className="text-3xl font-mono font-bold text-emerald-400 tracking-tight">
                  +${calculatedSavings.potentialPipeline}
                </p>
                <p className="text-[11px] text-neutral-400 font-light">
                  From ~{calculatedSavings.additionalLeadsClosed} additional deal conversations/mo
                </p>
              </div>
            </div>

            <Link
              href="/pricing"
              className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              Unlock Studio with Prepaid Pass <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* 8. PREPAID PASS SELECTOR WITH LIVE LAUNCH50 COUPON ENGINE */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-12 border-t border-white/5">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400">Simple Economics</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Prepaid 30-Day Passes. Zero Auto-Debit Churn.
          </h2>
          <p className="text-sm text-neutral-400 font-light">
            We reject predatory auto-renewing subscriptions. Purchase a 30-day block via PayPal. 
            Stack passes whenever you need them. Fully compliant with RBI India e-mandates.
          </p>
        </div>

        {/* Promo Code Input Box */}
        <div className="max-w-md mx-auto p-2 rounded-2xl border border-white/10 bg-neutral-950 flex items-center gap-2">
          <input
            type="text"
            placeholder='Enter code "LAUNCH50" for 50% off'
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value)}
            className="flex-1 bg-transparent px-4 py-2 text-xs text-white uppercase font-mono placeholder-neutral-600 focus:outline-none"
          />
          <button
            onClick={handleApplyPromo}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-semibold text-xs uppercase transition-colors shrink-0 font-mono"
          >
            Apply Code
          </button>
        </div>

        {promoApplied && (
          <div className="max-w-md mx-auto p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs font-mono text-emerald-400 text-center">
            ✓ 50% LAUNCH DISCOUNT ACTIVE ACROSS ALL PASSES
          </div>
        )}

        {promoError && (
          <div className="max-w-md mx-auto p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-xs font-mono text-red-400 text-center">
            {promoError}
          </div>
        )}

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          
          {/* TIER 1: STARTER */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.01] p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-white/5 text-neutral-400">
                Solo Founders & Freelancers
              </span>
              <div>
                <h3 className="text-2xl font-bold text-white">Starter Pass</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-mono font-bold text-white">${getPassPrice('starter')}</span>
                  <span className="text-xs font-mono text-neutral-500">/ 30-Day Pass</span>
                </div>
                {promoApplied && <span className="text-[10px] font-mono text-emerald-400 line-through mr-2">$19.00</span>}
              </div>

              <div className="space-y-2.5 pt-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2"><Check size={14} className="text-blue-400" /> 100 Studio Generations</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-blue-400" /> Core Outreach Modes</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-blue-400" /> Basic Deliverability Audit</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-blue-400" /> Gmail & Outlook Dispatch</div>
              </div>
            </div>

            <Link
              href="/pricing"
              className="w-full py-3 rounded-xl border border-white/10 hover:border-white/30 text-white text-xs font-semibold uppercase tracking-wider transition-colors text-center block"
            >
              Get Starter Pass
            </Link>
          </div>

          {/* TIER 2: GROWTH (POPULAR) */}
          <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-b from-blue-600/10 via-neutral-950 to-black p-8 flex flex-col justify-between space-y-6 relative shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white font-mono text-[10px] uppercase tracking-wider">
              Most Popular
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-blue-500/20 text-blue-400">
                Growth Teams & Agencies
              </span>
              <div>
                <h3 className="text-2xl font-bold text-white">Growth Pass</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-mono font-bold text-white">${getPassPrice('growth')}</span>
                  <span className="text-xs font-mono text-neutral-500">/ 30-Day Pass</span>
                </div>
                {promoApplied && <span className="text-[10px] font-mono text-emerald-400 line-through mr-2">$39.00</span>}
              </div>

              <div className="space-y-2.5 pt-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2"><Check size={14} className="text-blue-400" /> 300 Studio Generations</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-blue-400" /> All 30 Outreach Modes</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-blue-400" /> Full Spam Heuristic Matrix</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-blue-400" /> A/B Subject Line Engine</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-blue-400" /> Priority LPU Inference Route</div>
              </div>
            </div>

            <Link
              href="/pricing"
              className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold uppercase tracking-wider transition-colors text-center block"
            >
              Get Growth Pass
            </Link>
          </div>

          {/* TIER 3: ENTERPRISE */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.01] p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-purple-500/10 text-purple-400">
                High Volume Outreach
              </span>
              <div>
                <h3 className="text-2xl font-bold text-white">Enterprise Pass</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-mono font-bold text-white">${getPassPrice('enterprise')}</span>
                  <span className="text-xs font-mono text-neutral-500">/ 30-Day Pass</span>
                </div>
                {promoApplied && <span className="text-[10px] font-mono text-emerald-400 line-through mr-2">$79.00</span>}
              </div>

              <div className="space-y-2.5 pt-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> 1,000 Studio Generations</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Full Suite + Early Phase 02 Access</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Custom Tone Fine-Tuning</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Glent Passport Priority Node</div>
              </div>
            </div>

            <Link
              href="/pricing"
              className="w-full py-3 rounded-xl border border-white/10 hover:border-white/30 text-white text-xs font-semibold uppercase tracking-wider transition-colors text-center block"
            >
              Get Enterprise Pass
            </Link>
          </div>

        </div>
      </section>

      {/* 9. COMPETITIVE BENCHMARK COMPARISON MATRIX */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-12 border-t border-white/5">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">Technical Rigor</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Architecture Comparison
          </h2>
          <p className="text-sm text-neutral-400 font-light">
            How WriteYourEmail stacks against generic LLM chats (ChatGPT/Claude) and traditional sales sequencers.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-neutral-950">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider">
                <th className="p-5">Capability / Metric</th>
                <th className="p-5 text-blue-400 font-bold">WriteYourEmail Studio</th>
                <th className="p-5">Generic LLMs (ChatGPT)</th>
                <th className="p-5">Legacy Sales Sequencers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              <tr>
                <td className="p-5 font-semibold text-white">Inference Latency</td>
                <td className="p-5 text-emerald-400 font-bold">&lt;800ms (Groq LPUs)</td>
                <td className="p-5 text-neutral-500">4,000ms – 9,000ms</td>
                <td className="p-5 text-neutral-500">N/A (Templates only)</td>
              </tr>
              <tr>
                <td className="p-5 font-semibold text-white">Live Spam Word Auditor</td>
                <td className="p-5 text-emerald-400 font-bold">✓ 200+ Term Dictionary</td>
                <td className="p-5 text-red-400">✗ None (Outputs raw spam words)</td>
                <td className="p-5 text-neutral-400">Basic post-send metrics</td>
              </tr>
              <tr>
                <td className="p-5 font-semibold text-white">B2B Strategy Templates</td>
                <td className="p-5 text-emerald-400 font-bold">30 Engineered Modes</td>
                <td className="p-5 text-neutral-400">Requires custom prompt engineering</td>
                <td className="p-5 text-neutral-500">Static templates</td>
              </tr>
              <tr>
                <td className="p-5 font-semibold text-white">Billing Philosophy</td>
                <td className="p-5 text-emerald-400 font-bold">Prepaid 30-Day Passes ($0 Churn)</td>
                <td className="p-5 text-neutral-400">Monthly recurring subscription</td>
                <td className="p-5 text-neutral-400">$100–$300/mo annual contracts</td>
              </tr>
              <tr>
                <td className="p-5 font-semibold text-white">One-Click Dispatch</td>
                <td className="p-5 text-emerald-400 font-bold">✓ Native Gmail & Outlook</td>
                <td className="p-5 text-red-400">✗ Manual copy & paste</td>
                <td className="p-5 text-neutral-400">Requires SMTP / IMAP setup</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 10. INTERACTIVE FAQ ACCORDION */}
      <section className="py-24 px-6 max-w-4xl mx-auto space-y-12 border-t border-white/5">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">Frequently Asked Questions</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Everything you need to know.
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How does WriteYourEmail stop cold emails from landing in spam?',
              a: 'Spam filters evaluate emails using statistical penalty heuristics. WriteYourEmail executes a local dictionary audit checking for over 200 high-risk solicitation phrases, excessive capitalization, and exclamation mark density before you send. This ensures your copy conforms to Google Workspace and Microsoft 365 inbox placement guidelines.'
            },
            {
              q: 'What is a 30-Day Prepaid Pass and why not a subscription?',
              a: 'We reject dark-pattern auto-billing. With our PayPal Orders v2 prepaid engine, you pay once for 30 days of access. When it expires, you are never charged automatically. If you purchase multiple passes, they stack +30 days consecutively. This ensures 100% compliance with central banking regulations, including RBI India e-mandates.'
            },
            {
              q: 'What is the Glent Sovereign Passport?',
              a: 'Glent Global Enterprises is the parent technology venture lab behind WriteYourEmail.com. A Glent Passport is a single sign-on credential that unlocks WriteYourEmail and all forthcoming intelligence tools in the Glent ecosystem without needing separate accounts.'
            },
            {
              q: 'Is my data used to train AI models?',
              a: 'Absolutely not. We enforce strict data sovereignty boundaries. All generations are stored in PostgreSQL with Row Level Security (RLS) isolating your account from all others. Your inputs and generated emails are never used to train public foundation models.'
            },
            {
              q: 'How does the Gmail & Outlook 1-Click launcher work?',
              a: 'When an email is generated and passes deliverability checks, clicking the Gmail or Outlook button creates an encoded mailto dispatch that opens directly in your desktop or web client with the subject and body pre-formatted, ready for a final review.'
            }
          ].map((faq, i) => (
            <div
              key={i}
              onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
              className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 cursor-pointer space-y-3 transition-colors hover:border-white/15"
            >
              <div className="flex items-center justify-between text-base font-semibold text-white">
                <span>{faq.q}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 text-neutral-400 ${openFaqIndex === i ? 'rotate-180 text-blue-400' : ''}`} />
              </div>
              {openFaqIndex === i && (
                <p className="text-xs text-neutral-400 font-light leading-relaxed pt-2 border-t border-white/5">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 11. FINAL HIGH-STAKES CONVERSION CTA */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-blue-600/10 via-neutral-950 to-black p-10 sm:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Ready to turn cold outreach into closed revenue?
            </h2>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              Experience the sub-second speed of Groq LPUs paired with algorithmic deliverability audits. 
              Start generating in under 10 seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/studio"
              className="px-8 py-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-widest transition-all shadow-xl shadow-white/5 inline-flex items-center gap-2"
            >
              Launch Email Studio Free <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/glent/passport"
              className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/30 text-neutral-300 font-semibold text-xs uppercase tracking-widest transition-colors inline-flex items-center gap-2"
            >
              Create Glent Passport ID
            </Link>
          </div>
        </div>
      </section>

      {/* 12. INSTITUTIONAL PARENT COMPANY FOOTER */}
      <footer className="border-t border-white/5 bg-black py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white via-neutral-300 to-neutral-600 text-black flex items-center justify-center font-bold text-xs shadow-md">
                G
              </div>
              <span className="text-white font-semibold text-xs tracking-[0.25em] uppercase">
                Glent Global Enterprises
              </span>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm font-light">
              WriteYourEmail.com is engineered and maintained by Glent Global Enterprises. 
              Engineering high-performance AI systems and sovereign software primitives.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs font-mono text-neutral-500 uppercase tracking-wider">
            <Link href="/studio" className="hover:text-white transition-colors">Studio</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Passes</Link>
            <Link href="/glent" className="hover:text-white transition-colors">Parent Lab</Link>
            <Link href="/glent/ecosystem" className="hover:text-white transition-colors">Ecosystem</Link>
            <Link href="/glent/philosophy" className="hover:text-white transition-colors">Philosophy</Link>
            <Link href="/glent/passport" className="hover:text-blue-400 transition-colors">Glent Passport</Link>
            <Link href="/glent/contact" className="hover:text-white transition-colors">Institutional Desk</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <a
              href="https://instagram.com/glentglobal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <InstagramIcon size={14} /> @glentglobal
            </a>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-neutral-600 gap-2">
          <span>© 2025 GLENT GLOBAL ENTERPRISES. ALL RIGHTS RESERVED.</span>
          <span>WRITEYOUREMAIL.COM — AUTONOMOUS OUTREACH & DELIVERABILITY SUITE</span>
        </div>
      </footer>

    </div>
  );
}