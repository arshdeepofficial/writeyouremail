'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  History,
  Send,
  Mail,
  RefreshCw,
  Lock,
  Crown,
  Layers,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
  FileText,
  BarChart3,
  Target,
  Briefcase,
  Users,
  Award,
  MessageCircle,
  Share2,
  HelpCircle,
  Globe,
  Building2,
  Flame,
  CheckCircle2
} from 'lucide-react';

// Initialize Supabase Client dynamically
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Categorized Outreach Modes Definition (30 total modes)
interface OutreachMode {
  id: string;
  name: string;
  category: string;
  tier: 'Starter' | 'Growth' | 'Enterprise';
  description: string;
  icon: React.ElementType;
}

const OUTREACH_MODES: OutreachMode[] = [
  // Category: Cold Outreach & Prospecting
  { id: 'cold-b2b', name: 'B2B SaaS Prospecting', category: 'Cold Outreach', tier: 'Starter', description: 'High-converting cold email for B2B SaaS decisions makers.', icon: Briefcase },
  { id: 'cold-agency', name: 'Agency Client Acquisition', category: 'Cold Outreach', tier: 'Starter', description: 'Pitch design, marketing, or dev services to decision-makers.', icon: Target },
  { id: 'cold-exec', name: 'C-Suite Executive Pitch', category: 'Cold Outreach', tier: 'Growth', description: 'Ultra-concise, high-impact messages tailored for CEOs and CTOs.', icon: Crown },
  { id: 'cold-investor', name: 'VC & Angel Pitch', category: 'Cold Outreach', tier: 'Growth', description: 'Pitch startup vision, traction, and ask for introductory calls.', icon: Flame },
  { id: 'cold-linkbuilding', name: 'SEO Link Building Outreach', category: 'Cold Outreach', tier: 'Starter', description: 'Pitch content collaborations and guest post backlinks.', icon: Globe },

  // Category: Sales & Follow-Ups
  { id: 'sales-followup-1', name: 'Gentle Follow-Up #1', category: 'Sales & Follow-ups', tier: 'Starter', description: 'Polite reminder for unopened or unreplied pitch emails.', icon: Send },
  { id: 'sales-breakup', name: 'Break-Up Email (Last Chance)', category: 'Sales & Follow-ups', tier: 'Starter', description: 'High-conversion final attempt before closing a deal lead.', icon: AlertTriangle },
  { id: 'sales-demo-confirm', name: 'Demo Call Confirmation', category: 'Sales & Follow-ups', tier: 'Starter', description: 'Set agenda and eliminate no-shows for scheduled sales calls.', icon: CheckCircle2 },
  { id: 'sales-reengage', name: 'Dormant Lead Re-engagement', category: 'Sales & Follow-ups', tier: 'Growth', description: 'Revive cold prospects with fresh value and industry insights.', icon: RefreshCw },
  { id: 'sales-upsell', name: 'Customer Expansion / Upsell', category: 'Sales & Follow-ups', tier: 'Enterprise', description: 'Pitch higher tier, annual billing, or premium add-ons to clients.', icon: Zap },

  // Category: Creator & Influencer Partnerships
  { id: 'creator-sponsor', name: 'Sponsorship Inquiry', category: 'Creator & Partnerships', tier: 'Starter', description: 'Pitch creators or podcasts for brand sponsorship opportunities.', icon: Award },
  { id: 'creator-collab', name: 'Co-Marketing Collaboration', category: 'Creator & Partnerships', tier: 'Growth', description: 'Propose webinars, co-promotions, or podcast guest swaps.', icon: Users },
  { id: 'creator-affiliate', name: 'Affiliate Program Pitch', category: 'Creator & Partnerships', tier: 'Starter', description: 'Invite influencers to join revenue-sharing affiliate programs.', icon: Share2 },
  { id: 'creator-dm-followup', name: 'Social DM Pitch Follow-Up', category: 'Creator & Partnerships', tier: 'Growth', description: 'Cross-channel follow-up following Instagram or LinkedIn DMs.', icon: MessageCircle },
  { id: 'creator-gifting', name: 'Product Seeding & Gifting', category: 'Creator & Partnerships', tier: 'Starter', description: 'Send free product samples in exchange for authentic reviews.', icon: Sparkles },

  // Category: Executive & Enterprise B2B
  { id: 'exec-account-based', name: 'ABM Target Enterprise', category: 'Executive & B2B', tier: 'Enterprise', description: 'Hyper-personalized multi-touch email for 10,000+ employee accounts.', icon: Building2 },
  { id: 'exec-procurement', name: 'RFP / Procurement Introduction', category: 'Executive & B2B', tier: 'Enterprise', description: 'Formal inquiry into Enterprise RFPs and vendor list additions.', icon: FileText },
  { id: 'exec-strategic-partner', name: 'Strategic Alliance Proposal', category: 'Executive & B2B', tier: 'Growth', description: 'Propose joint venture partnerships to executive teams.', icon: Layers },
  { id: 'exec-board-update', name: 'Investor & Board Update', category: 'Executive & B2B', tier: 'Enterprise', description: 'Professional progress report for board members and investors.', icon: BarChart3 },
  { id: 'exec-event-invite', name: 'VIP Roundtable Invitation', category: 'Executive & B2B', tier: 'Growth', description: 'Exclusive executive dinner or private event invitation.', icon: Crown },

  // Category: PR, Media & Product Hunt
  { id: 'pr-press-release', name: 'Journalist Press Pitch', category: 'PR & Media', tier: 'Growth', description: 'Pitch tech journalists, TechCrunch, or Forbes reporters.', icon: Globe },
  { id: 'pr-ph-support', name: 'Product Hunt Launch Blast', category: 'PR & Media', tier: 'Starter', description: 'Mobilize community and supporters on Product Hunt launch day.', icon: Flame },
  { id: 'pr-podcast-pitch', name: 'Podcast Guest Application', category: 'PR & Media', tier: 'Starter', description: 'Pitch founder story and topic ideas to podcast hosts.', icon: MessageCircle },
  { id: 'pr-crisis-comm', name: 'Crisis Communication Notice', category: 'PR & Media', tier: 'Enterprise', description: 'Professional disclosure regarding downtime, security, or changes.', icon: ShieldCheck },
  { id: 'pr-award-nomination', name: 'Industry Award Entry Pitch', category: 'PR & Media', tier: 'Growth', description: 'Submit brand or executive for industry leadership awards.', icon: Award },

  // Category: Internal, HR & Retention
  { id: 'internal-churn-save', name: 'Cancellation Intervention (Save)', category: 'Internal & Retention', tier: 'Growth', description: 'Personal message from founder when customer clicks cancel.', icon: AlertTriangle },
  { id: 'internal-welcome', name: 'High-Touch Onboarding Welcome', category: 'Internal & Retention', tier: 'Starter', description: 'Welcome new paid users with quick tips and support access.', icon: Sparkles },
  { id: 'internal-feedback', name: 'NPS & Customer Review Request', category: 'Internal & Retention', tier: 'Starter', description: 'Ask power users for testimonials, Trustpilot reviews, or feedback.', icon: HelpCircle },
  { id: 'internal-winback', name: 'Lost Customer Winback', category: 'Internal & Retention', tier: 'Growth', description: 'Re-engage churning clients with special discount or new features.', icon: RefreshCw },
  { id: 'internal-recruiting', name: 'Executive Talent Outreach', category: 'Internal & Retention', tier: 'Enterprise', description: 'Headhunt senior engineers or executives with personalized pitch.', icon: User }
];

// Spam trigger word database for live deliverability scoring
const SPAM_TRIGGER_WORDS = [
  'free', 'guarantee', '100%', 'risk free', 'make money', 'click here', 'act now',
  'limited time', 'cash', 'credit card', 'urgent', 'no cost', 'no obligation',
  'winner', 'congratulations', 'passwords', 'billion', 'dollars', 'buy direct',
  'income', 'profit', 'earn $', 'cheap', 'lowest price', 'double your'
];

interface GeneratedResult {
  subject: string;
  body: string;
  spamScore: number;
  spamTriggers: string[];
  wordCount: number;
  readingTime: string;
}

export default function StudioPage() {
  // Navigation & User State
  const [user, setUser] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<'Free' | 'Starter' | 'Growth' | 'Enterprise'>('Free');
  const [usageCount, setUsageCount] = useState<number>(0);
  const [usageLimit, setUsageLimit] = useState<number>(5);
  
  // UI State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<OutreachMode>(OUTREACH_MODES[0]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form Inputs
  const [prospectName, setProspectName] = useState<string>('');
  const [prospectCompany, setProspectCompany] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('Alex Rivera');
  const [offerDetails, setOfferDetails] = useState<string>('');
  const [painPoints, setPainPoints] = useState<string>('');
  const [customCTA, setCustomCTA] = useState<string>('Are you open to a 10-minute call this Thursday?');
  const [tone, setTone] = useState<string>('Professional & Direct');

  // Generation & Deliverability State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genResult, setGenResult] = useState<GeneratedResult | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  // History State
  const [history, setHistory] = useState<Array<{ id: string; subject: string; body: string; mode: string; date: string }>>([]);
  const [copiedSubject, setCopiedSubject] = useState<boolean>(false);
  const [copiedBody, setCopiedBody] = useState<boolean>(false);

  // Load User Authentication & Plan details
  useEffect(() => {
    async function loadUserData() {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Fetch usage tracking from Supabase
        const { data } = await supabase
          .from('usage_tracking')
          .select('plan_tier, count, subscription_ends_at')
          .eq('user_id', session.user.id)
          .single();

        if (data) {
          setUserPlan(data.plan_tier || 'Free');
          setUsageCount(data.count || 0);
          setUsageLimit(
            data.plan_tier === 'Starter' ? 50 : data.plan_tier === 'Growth' || data.plan_tier === 'Enterprise' ? 9999 : 5
          );
        }
      }
    }
    loadUserData();
  }, []);

  // Filter modes based on category and search
  const filteredModes = OUTREACH_MODES.filter(m => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Cold Outreach', 'Sales & Follow-ups', 'Creator & Partnerships', 'Executive & B2B', 'PR & Media', 'Internal & Retention'];

  // Handle Dynamic Generation Request
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenError(null);

    if (!offerDetails.trim()) {
      setGenError('Please provide key value proposition or offer details.');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modeId: selectedMode.id,
          modeName: selectedMode.name,
          category: selectedMode.category,
          prospectName: prospectName || 'Prospect',
          prospectCompany: prospectCompany || 'Target Company',
          senderName: senderName || 'Your Name',
          offerDetails,
          painPoints,
          customCTA,
          tone
        })
      });

      const data = await response.json();

      if (!response.ok || !data.subject || !data.body) {
        throw new Error(data.error || 'Failed to generate response. Please try again.');
      }

      // Calculate Spam & Deliverability Metrics
      const fullContent = `${data.subject} ${data.body}`.toLowerCase();
      const triggersFound = SPAM_TRIGGER_WORDS.filter(word => fullContent.includes(word));
      
      // Calculate Deliverability Score (Base 100, deducted per trigger word)
      let score = 100 - (triggersFound.length * 12);
      if (data.subject.length > 60) score -= 10; // Subject too long
      if (data.subject.length < 10) score -= 15; // Subject too short
      if (score < 0) score = 10;

      const words = data.body.trim().split(/\s+/).length;
      const readTime = `${Math.ceil(words / 200)} min read`;

      const result: GeneratedResult = {
        subject: data.subject,
        body: data.body,
        spamScore: score,
        spamTriggers: triggersFound,
        wordCount: words,
        readingTime: readTime
      };

      setGenResult(result);

      // Append to Recent History
      const newHistoryItem = {
        id: Date.now().toString(),
        subject: data.subject,
        body: data.body,
        mode: selectedMode.name,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);

      // Increment local usage count
      setUsageCount(prev => prev + 1);

    } catch (err: any) {
      setGenError(err.message || 'An unexpected error occurred while generating email.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, isSubject: boolean) => {
    navigator.clipboard.writeText(text);
    if (isSubject) {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } else {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };

  const getGmailLink = () => {
    if (!genResult) return '#';
    return `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${encodeURIComponent(genResult.subject)}&body=${encodeURIComponent(genResult.body)}`;
  };

  const getOutlookLink = () => {
    if (!genResult) return '#';
    return `https://outlook.live.com/mail/0/deeplink/compose?subject=${encodeURIComponent(genResult.subject)}&body=${encodeURIComponent(genResult.body)}`;
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 flex flex-col font-sans selection:bg-[#0a84ff] selection:text-white">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 border-b border-[#222224] bg-[#000000]/80 backdrop-blur-md px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-[#0a84ff] items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0a84ff] to-[#bf5af2] flex items-center justify-center font-bold text-white shadow-lg shadow-[#0a84ff]/20">
              W
            </div>
            <span className="font-semibold text-lg tracking-tight text-white group-hover:text-[#0a84ff] transition-colors">
              WriteYourEmail<span className="text-[#0a84ff]">.com</span>
            </span>
          </Link>
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#1c1c1e] text-gray-400 border border-[#222224]">
            Studio v2.4
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Usage Badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#141415] border border-[#222224] text-xs">
            <span className="text-gray-400">Generations:</span>
            <span className="font-bold text-white">{usageCount} / {usageLimit === 9999 ? '∞' : usageLimit}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#0a84ff]/20 text-[#0a84ff]">
              {userPlan} Tier
            </span>
          </div>

          <Link
            href="/docs"
            className="hidden sm:flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-[#222224] bg-[#141415] hover:bg-[#1c1c1e]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Docs</span>
          </Link>

          <Link
            href="/pricing"
            className="flex items-center space-x-1 text-xs font-medium text-white bg-gradient-to-r from-[#0a84ff] to-[#bf5af2] hover:opacity-90 transition-opacity px-3.5 py-1.5 rounded-lg shadow-md"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Upgrade Pass</span>
          </Link>

          {/* Mobile Mode Trigger Button (< lg screens) */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-[#141415] border border-[#222224] text-gray-300 hover:text-white"
            aria-label="Open Modes Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Responsive 3-Column Layout */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-3 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMN 1: Categorized Modes Sidebar (Desktop View: Col 3) */}
        <aside className="hidden lg:block lg:col-span-3 bg-[#141415] border border-[#222224] rounded-2xl p-4 flex flex-col h-[calc(100vh-110px)] sticky top-[80px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#222224] mb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#0a84ff]" />
              <h2 className="font-semibold text-sm text-white">Outreach Strategies</h2>
            </div>
            <span className="text-xs text-gray-400 font-mono">{OUTREACH_MODES.length} Modes</span>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1c1e] border border-[#222224] text-xs text-white rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-[#0a84ff] transition-colors placeholder:text-gray-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-1 overflow-x-auto pb-2 mb-2 no-scrollbar border-b border-[#222224]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] whitespace-nowrap px-2.5 py-1 rounded-md transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0a84ff] text-white font-medium'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1c1c1e]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scrollable Mode List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-xs">
            {filteredModes.map((mode) => {
              const IconComp = mode.icon;
              const isSelected = selectedMode.id === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-[#1c1c1e] border-[#0a84ff] shadow-sm'
                      : 'bg-[#141415] border-transparent hover:bg-[#1c1c1e] hover:border-[#222224]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2 font-medium text-white truncate">
                      <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0a84ff]' : 'text-gray-400'}`} />
                      <span className="truncate">{mode.name}</span>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                        mode.tier === 'Starter'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : mode.tier === 'Growth'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {mode.tier}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-1">{mode.description}</p>
                </button>
              );
            })}
          </div>
        </aside>

        {/* COLUMN 2: Input Generation Form (Desktop View: Col 5) */}
        <section className="lg:col-span-5 bg-[#141415] border border-[#222224] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            {/* Active Strategy Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#222224] mb-5">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20">
                  <selectedMode.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="font-semibold text-base text-white">{selectedMode.name}</h1>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#1c1c1e] text-gray-400 border border-[#222224]">
                      {selectedMode.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedMode.description}</p>
                </div>
              </div>
            </div>

            {/* Error UI Banner */}
            {genError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{genError}</span>
              </div>
            )}

            {/* Form Setup */}
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Prospect Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={prospectName}
                    onChange={(e) => setProspectName(e.target.value)}
                    className="w-full bg-[#1c1c1e] border border-[#222224] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0a84ff] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Company / Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe, TechCorp"
                    value={prospectCompany}
                    onChange={(e) => setProspectCompany(e.target.value)}
                    className="w-full bg-[#1c1c1e] border border-[#222224] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0a84ff] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Core Offer / Value Proposition <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. We help SaaS teams cut customer churn by 28% using AI deliverability optimization and custom email Warmup sequence."
                  value={offerDetails}
                  onChange={(e) => setOfferDetails(e.target.value)}
                  className="w-full bg-[#1c1c1e] border border-[#222224] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#0a84ff] transition-colors resize-none placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Prospect Pain Points / Trigger</label>
                <input
                  type="text"
                  placeholder="e.g. Recent product launch, struggling with low email open rates below 15%."
                  value={painPoints}
                  onChange={(e) => setPainPoints(e.target.value)}
                  className="w-full bg-[#1c1c1e] border border-[#222224] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0a84ff] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Call to Action (CTA)</label>
                  <input
                    type="text"
                    value={customCTA}
                    onChange={(e) => setCustomCTA(e.target.value)}
                    className="w-full bg-[#1c1c1e] border border-[#222224] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0a84ff] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Tone of Voice</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[#1c1c1e] border border-[#222224] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0a84ff] transition-colors"
                  >
                    <option value="Professional & Direct">Professional & Direct</option>
                    <option value="Casual & Conversational">Casual & Conversational</option>
                    <option value="Urgent & High-Stakes">Urgent & High-Stakes</option>
                    <option value="Witty & Thoughtful">Witty & Thoughtful</option>
                    <option value="Short & Executive">Short & Executive (C-Suite)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0a84ff] via-[#30d158] to-[#0a84ff] text-white font-semibold text-xs tracking-wide hover:opacity-95 transition-all shadow-lg shadow-[#0a84ff]/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Optimizing Email with Llama 3.3 70B...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Email & Analyze Deliverability</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222224] text-[11px] text-gray-500 flex items-center justify-between">
            <span>Backed by Groq Llama 3.3 70B</span>
            <span>Zero Spam Rate Guarantee</span>
          </div>
        </section>

        {/* COLUMN 3: Generated Output, Spam Audit & Recent History (Desktop View: Col 4) */}
        <section className="lg:col-span-4 space-y-4">
          
          {/* Output Card */}
          <div className="bg-[#141415] border border-[#222224] rounded-2xl p-5 flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#222224] mb-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#30d158]" />
                  <h2 className="font-semibold text-sm text-white">Generated Email Output</h2>
                </div>
                {genResult && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#30d158]/10 text-[#30d158] font-mono border border-[#30d158]/20">
                    Deliverability: {genResult.spamScore}%
                  </span>
                )}
              </div>

              {!genResult && !isGenerating && (
                <div className="py-16 text-center text-gray-500 text-xs flex flex-col items-center justify-center space-y-2">
                  <Mail className="w-8 h-8 text-gray-600 stroke-1" />
                  <p>Configure parameters on the left and click Generate.</p>
                  <p className="text-[11px] text-gray-600">Your deliverability score and email copy will appear here.</p>
                </div>
              )}

              {isGenerating && (
                <div className="py-16 text-center text-gray-400 text-xs flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#0a84ff]" />
                  <p>Writing highly targeted outreach copy...</p>
                </div>
              )}

              {genResult && !isGenerating && (
                <div className="space-y-4 text-xs">
                  {/* Subject Line */}
                  <div className="bg-[#1c1c1e] p-3 rounded-xl border border-[#222224] relative group">
                    <div className="text-[10px] text-gray-400 font-semibold uppercase mb-1 flex justify-between">
                      <span>Subject Line</span>
                      <button
                        onClick={() => copyToClipboard(genResult.subject, true)}
                        className="text-[#0a84ff] hover:text-white flex items-center space-x-1"
                      >
                        {copiedSubject ? <Check className="w-3 h-3 text-[#30d158]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSubject ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-white font-medium pr-8">{genResult.subject}</div>
                  </div>

                  {/* Body Copy */}
                  <div className="bg-[#1c1c1e] p-3 rounded-xl border border-[#222224] relative group">
                    <div className="text-[10px] text-gray-400 font-semibold uppercase mb-1 flex justify-between">
                      <span>Email Body</span>
                      <button
                        onClick={() => copyToClipboard(genResult.body, false)}
                        className="text-[#0a84ff] hover:text-white flex items-center space-x-1"
                      >
                        {copiedBody ? <Check className="w-3 h-3 text-[#30d158]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedBody ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-gray-200 whitespace-pre-wrap leading-relaxed pr-2 font-mono text-[11px]">
                      {genResult.body}
                    </div>
                  </div>

                  {/* Quick Action Direct Launch */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={getGmailLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#1c1c1e] border border-[#222224] hover:border-[#0a84ff] text-white transition-colors text-[11px] font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                      <span>Launch Gmail</span>
                    </a>
                    <a
                      href={getOutlookLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#1c1c1e] border border-[#222224] hover:border-[#0a84ff] text-white transition-colors text-[11px] font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                      <span>Launch Outlook</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Spam Trigger Words Breakdown */}
            {genResult && (
              <div className="mt-4 pt-3 border-t border-[#222224] text-[11px]">
                <div className="flex items-center justify-between text-gray-400 mb-1">
                  <span>Spam Trigger Traces:</span>
                  <span className={genResult.spamTriggers.length === 0 ? 'text-[#30d158]' : 'text-amber-400'}>
                    {genResult.spamTriggers.length === 0 ? '0 Detected (Inbox Safe)' : `${genResult.spamTriggers.length} flagged`}
                  </span>
                </div>
                {genResult.spamTriggers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {genResult.spamTriggers.map((word, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] border border-red-500/20">
                        {word}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent History Panel */}
          <div className="bg-[#141415] border border-[#222224] rounded-2xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#222224] mb-3">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-purple-400" />
                <h3 className="font-semibold text-xs text-white">Recent Generations</h3>
              </div>
              <span className="text-[10px] text-gray-500">{history.length} Saved</span>
            </div>

            {history.length === 0 ? (
              <p className="text-gray-500 text-[11px] text-center py-4">No recent history in this session.</p>
            ) : (
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setGenResult({
                        subject: item.subject,
                        body: item.body,
                        spamScore: 98,
                        spamTriggers: [],
                        wordCount: item.body.split(' ').length,
                        readingTime: '1 min read'
                      });
                    }}
                    className="p-2 rounded-lg bg-[#1c1c1e] hover:bg-[#222224] border border-[#222224] cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                      <span className="text-[#0a84ff] font-medium">{item.mode}</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="text-xs text-white truncate font-medium">{item.subject}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MOBILE SLIDE-OVER DRAWER (< lg viewport) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs bg-[#141415] border-l border-[#222224] h-full p-4 flex flex-col z-10">
            <div className="flex items-center justify-between pb-3 border-b border-[#222224] mb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#0a84ff]" />
                <h2 className="font-semibold text-sm text-white">Select Strategy</h2>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search strategies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c1c1e] border border-[#222224] text-xs text-white rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-[#0a84ff]"
              />
            </div>

            {/* Mobile Categories */}
            <div className="flex space-x-1 overflow-x-auto pb-2 mb-2 no-scrollbar border-b border-[#222224]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] whitespace-nowrap px-2 py-1 rounded transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#0a84ff] text-white font-medium'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mobile Scrollable Modes List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 text-xs">
              {filteredModes.map((mode) => {
                const IconComp = mode.icon;
                const isSelected = selectedMode.id === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setSelectedMode(mode);
                      setMobileDrawerOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-[#1c1c1e] border-[#0a84ff]'
                        : 'bg-[#141415] border-transparent hover:bg-[#1c1c1e]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2 font-medium text-white truncate">
                        <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0a84ff]' : 'text-gray-400'}`} />
                        <span className="truncate">{mode.name}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {mode.tier}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-1">{mode.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#222224] bg-[#000000] py-4 px-6 text-center text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between">
        <div>© 2025 WriteYourEmail.com. All rights reserved.</div>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <Link href="/pricing" className="hover:text-gray-300">Pricing</Link>
          <Link href="/docs" className="hover:text-gray-300">Documentation</Link>
          <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}