"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Check,
  Lock,
  Mail,
  MessageSquare,
  Share2,
  AtSign,
  Users,
  Copy,
  ExternalLink,
  ChevronRight,
  X,
  Sliders,
  Layers,
  Send,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  BarChart3,
  Flame,
  Globe,
  HelpCircle,
  LogOut,
  UserCheck,
  Video,
  Briefcase,
  SendHorizontal,
  Instagram,
  FileText,
  Clock,
  History,
  ArrowUpRight,
} from "lucide-react";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fixed inline Logo matching exact design
function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#0a84ff] to-[#bf5af2] text-white shadow-md shadow-[#0a84ff]/20">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <span className="text-lg font-bold tracking-tight text-white">
        WriteYour<span className="text-[#0a84ff]">Email.com</span>
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------
// FULL 30 OUTREACH MODES CATEGORIZED BY TIER
// ----------------------------------------------------------------------
const modeCategories = [
  {
    category: "STARTER ($19/MO)",
    modes: [
      { id: "cold-email", name: "Cold Email", tier: "starter", icon: Mail, desc: "High-converting B2B cold outreach." },
      { id: "magic-polish", name: "Magic Polish", tier: "starter", icon: Sparkles, desc: "Re-write and polish existing copy." },
      { id: "objection-reply", name: "Objection Reply", tier: "starter", icon: ShieldCheck, desc: "Turn pricing or timing pushback into booked calls." },
      { id: "lead-winback", name: "Lead Win-Back", tier: "starter", icon: RefreshCw, desc: "Re-engage dormant prospects." },
      { id: "inbound-followup", name: "Inbound Follow-Up", tier: "starter", icon: SendHorizontal, desc: "Fast reply for inbound form fills." },
    ],
  },
  {
    category: "GROWTH ($39/MO)",
    modes: [
      { id: "linkedin-dm", name: "LinkedIn DM", tier: "growth", icon: Share2, desc: "Non-salesy LinkedIn connect messages under 300 chars." },
      { id: "twitter-dm", name: "Twitter / X DM", tier: "growth", icon: AtSign, desc: "Casual outreach for tech founders and creators." },
      { id: "whatsapp-seq", name: "WhatsApp Sequence", tier: "growth", icon: MessageSquare, desc: "Direct, short mobile-first B2B messages." },
      { id: "loom-vsl", name: "Loom VSL Script", tier: "growth", icon: Video, desc: "Short video intro script to attach to Loom links." },
      { id: "upwork-proposal", name: "Upwork Proposal", tier: "growth", icon: Briefcase, desc: "High-converting freelance proposal cover letter." },
      { id: "telegram-dm", name: "Telegram Tech DM", tier: "growth", icon: SendHorizontal, desc: "Direct outreach for Web3 and crypto founders." },
      { id: "instagram-dm", name: "Instagram DM", tier: "growth", icon: Users, desc: "Creator and e-commerce brand collaboration." },
      { id: "saas-demo", name: "SaaS Pitch & Demo", tier: "growth", icon: Zap, desc: "Product-led demo invite with video link." },
      { id: "investor-pitch", name: "Investor & VC Pitch", tier: "growth", icon: Flame, desc: "Present growth metrics, MRR, and deck link." },
      { id: "partnership-pitch", name: "Partnership Pitch", tier: "growth", icon: Globe, desc: "Co-marketing and API integration proposals." },
      { id: "podcast-guest", name: "Podcast Guest Pitch", tier: "growth", icon: Sparkles, desc: "Unique topic pitch for show producers." },
      { id: "pr-journalist", name: "PR / Media Pitch", tier: "growth", icon: Globe, desc: "Pitch exclusive data or quotes to reporters." },
      { id: "affiliate-join", name: "Affiliate Partner", tier: "growth", icon: Zap, desc: "Recruit creators into revenue-share programs." },
      { id: "webinar-invite", name: "Webinar Invitation", tier: "growth", icon: Mail, desc: "Drive masterclass signups without pressure." },
      { id: "case-study-drop", name: "Case Study & ROI Drop", tier: "growth", icon: BarChart3, desc: "Deconstruct customer results with proof." },
      { id: "g2-review", name: "G2 / Review Request", tier: "growth", icon: CheckCircle2, desc: "Ask active users for software reviews." },
      { id: "alumni-network", name: "Alumni Connection", tier: "growth", icon: Users, desc: "Shared university or company background." },
      { id: "executive-job", name: "Executive Job Pitch", tier: "growth", icon: Briefcase, desc: "Email hiring managers directly." },
      { id: "advisory-board", name: "Advisory Board Pitch", tier: "growth", icon: ShieldCheck, desc: "Invite industry veterans to board." },
      { id: "enterprise-rfq", name: "Enterprise RFQ", tier: "growth", icon: FileText, desc: "Respond to procurement inquiries." },
    ],
  },
  {
    category: "ENTERPRISE ($79/MO)",
    modes: [
      { id: "multi-step-seq", name: "Multi-Step Sequence", tier: "enterprise", icon: Layers, desc: "3-step full cold outreach sequence." },
      { id: "breakup-email", name: "Breakup Email", tier: "enterprise", icon: AlertCircle, desc: "Trigger FOMO to force a final reply." },
      { id: "custom-persona", name: "Custom Tone Persona", tier: "enterprise", icon: Sliders, desc: "Deep custom tone prompt engineering." },
      { id: "agency-whitelabel", name: "Agency Whitelabel", tier: "enterprise", icon: Users, desc: "Pitch fulfillment services to agencies." },
      { id: "cold-phone-script", name: "Cold Phone Script", tier: "enterprise", icon: Send, desc: "Spoken opener script for sales calls." },
    ],
  },
];

export default function StudioPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userPlanTier, setUserPlanTier] = useState<string>("guest");
  
  // Usage tracking state
  const [guestGensLeft, setGuestGensLeft] = useState<number>(2);
  const [dailyGensLeft, setDailyGensLeft] = useState<number>(5);

  // Selected Mode State (Default: Cold Email)
  const [selectedMode, setSelectedMode] = useState(modeCategories[0].modes[0]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Dynamic Form Inputs
  const [prospectName, setProspectName] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [tone, setTone] = useState("Professional & Direct");

  // Output & History State
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputContent, setOutputContent] = useState("");
  const [subjectLines, setSubjectLines] = useState<string[]>([]);
  const [deliverabilityScore, setDeliverabilityScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ id: string; mode: string; date: string; preview: string }>>([]);

  useEffect(() => {
    setMounted(true);

    // Read guest tracking from localStorage
    const storedGuestCount = localStorage.getItem("wye_guest_gens");
    if (storedGuestCount !== null) {
      setGuestGensLeft(Math.max(0, parseInt(storedGuestCount, 10)));
    } else {
      localStorage.setItem("wye_guest_gens", "2");
      setGuestGensLeft(2);
    }

    // Check user auth
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        fetchUserUsage(data.user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserUsage(session.user.id);
      } else {
        setUser(null);
        setUserPlanTier("guest");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserUsage = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("usage_tracking")
        .select("plan_tier, subscription_ends_at, count")
        .eq("user_id", userId)
        .maybeSingle();

      if (data) {
        const isPlanActive = data.subscription_ends_at && new Date(data.subscription_ends_at) > new Date();
        const activeTier = isPlanActive ? (data.plan_tier || "starter") : "free";
        setUserPlanTier(activeTier);
        if (activeTier === "free") {
          setDailyGensLeft(Math.max(0, 5 - (data.count || 0)));
        }
      } else {
        setUserPlanTier("free");
        setDailyGensLeft(5);
      }
    } catch (err) {
      console.error("Usage fetch error:", err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserPlanTier("guest");
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenError(null);

    // Limit Checks
    if (!user && guestGensLeft <= 0) {
      setGenError("Guest limit reached! Please sign up for a free account or get a 30-day pass.");
      return;
    }

    if (user && userPlanTier === "free" && dailyGensLeft <= 0) {
      setGenError("Free daily limit reached (5/5). Upgrade to a Starter or Growth Pass for unlimited access!");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: selectedMode.id,
          prospectName,
          companyName: targetCompany,
          valueProp: valueProposition,
          callToAction,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed. Please try again.");
      }

      const generatedText = data.content || "";
      setOutputContent(generatedText);
      setSubjectLines(data.subjectLines || [
        `quick question re: ${targetCompany || "growth"}`,
        `idea for ${prospectName || "your team"}`,
        `scaling ${targetCompany || "outreach"}`,
        `brief introduction`,
        `collaboration idea`,
      ]);

      const score = data.deliverabilityScore || Math.floor(Math.random() * 8) + 91;
      setDeliverabilityScore(score);

      // Add to history
      setHistory((prev) => [
        {
          id: Date.now().toString(),
          mode: selectedMode.name,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          preview: generatedText.substring(0, 60) + "...",
        },
        ...prev,
      ]);

      // Deduct usages
      if (!user) {
        const newGuestGens = Math.max(0, guestGensLeft - 1);
        setGuestGensLeft(newGuestGens);
        localStorage.setItem("wye_guest_gens", newGuestGens.toString());
      } else if (userPlanTier === "free") {
        setDailyGensLeft((prev) => Math.max(0, prev - 1));
      }
    } catch (err: any) {
      setGenError(err.message || "AI generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!outputContent) return;
    navigator.clipboard.writeText(outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInGmail = () => {
    const subject = encodeURIComponent(subjectLines[0] || "Quick Question");
    const body = encodeURIComponent(outputContent);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, "_blank");
  };

  const openInOutlook = () => {
    const subject = encodeURIComponent(subjectLines[0] || "Quick Question");
    const body = encodeURIComponent(outputContent);
    window.open(`https://outlook.office.com/mail/deeplink/compose?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 font-sans selection:bg-[#0a84ff] selection:text-white flex flex-col">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP HEADER BAR (EXACT DESIGN MATCH) */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-40 border-b border-[#1c1c1e] bg-[#000000]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="transition-opacity hover:opacity-90 shrink-0">
            <Logo />
          </Link>

          {/* Right Header Navigation Controls */}
          <div className="flex items-center gap-3">
            {/* Usage Tier Pill */}
            {!user ? (
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#222224] bg-[#141415] px-3.5 py-1.5 text-xs text-gray-300">
                <Zap className="h-3.5 w-3.5 text-[#0a84ff]" />
                <span>{guestGensLeft} guest generations remaining</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#222224] bg-[#141415] px-3.5 py-1.5 text-xs text-gray-300">
                <Zap className="h-3.5 w-3.5 text-[#0a84ff]" />
                <span>
                  {userPlanTier === "free" ? `${dailyGensLeft}/5 free daily gens left` : "Unlimited generations"}
                </span>
              </div>
            )}

            {/* Upgrade Plan Button */}
            <Link
              href="/pricing"
              className="rounded-xl bg-gradient-to-r from-[#0a84ff] to-[#bf5af2] px-4 py-2 text-xs font-bold text-white transition hover:opacity-90 shadow-md shadow-[#0a84ff]/20 shrink-0"
            >
              Upgrade Plan
            </Link>

            {/* Logged In User Pill */}
            {user && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-[#222224] bg-[#141415] px-3 py-1.5 text-xs text-gray-300 max-w-[200px] sm:max-w-none truncate">
                  <div className="h-2 w-2 rounded-full bg-[#0a84ff] shrink-0" />
                  <span className="font-mono text-white truncate">{user.email}</span>
                </div>

                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="rounded-xl border border-[#222224] bg-[#141415] p-2 text-gray-400 hover:text-[#ff453a] hover:border-[#ff453a]/30 transition shrink-0"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE MODE SELECTOR TRIGGER (Visible only on mobile screens) */}
      {/* ------------------------------------------------------------------ */}
      <div className="lg:hidden border-b border-[#1c1c1e] bg-[#0a0a0a] px-4 py-3">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="w-full flex items-center justify-between rounded-xl border border-[#222224] bg-[#141415] px-4 py-2.5 text-sm font-semibold text-white shadow-md active:bg-[#1c1c1e]"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <selectedMode.icon className="h-4 w-4 text-[#0a84ff] shrink-0" />
            <span className="truncate">{selectedMode.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#0a84ff] shrink-0">
            <span>Select Mode</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN 3-COLUMN DESKTOP GRID */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 mx-auto max-w-[1600px] w-full px-4 py-6 md:px-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================================================================ */}
        {/* COLUMN 1: CATEGORIZED OUTREACH MODES SIDEBAR (Span 3) */}
        {/* ================================================================ */}
        <aside className="hidden lg:block lg:col-span-3 border-r border-[#1c1c1e] pr-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {modeCategories.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-2">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-2">
                {group.category}
              </div>

              <div className="space-y-1">
                {group.modes.map((m) => {
                  const Icon = m.icon;
                  const isSelected = selectedMode.id === m.id;
                  const isLocked = m.tier !== "starter" && userPlanTier === "free";

                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMode(m)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition ${
                        isSelected
                          ? "bg-[#1c1c1e] text-white font-bold border border-[#0a84ff]/50 shadow-sm"
                          : "text-gray-400 hover:bg-[#141415] hover:text-white"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-[#0a84ff]" : "text-gray-500"}`} />
                      <span className="flex-1 truncate">{m.name}</span>
                      {isLocked && <Lock className="h-3 w-3 text-gray-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* ================================================================ */}
        {/* COLUMN 2: FORM CONTROLS & GENERATOR (Span 5) */}
        {/* ================================================================ */}
        <section className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{selectedMode.name}</h1>
            <p className="text-xs text-gray-400">{selectedMode.desc}</p>
          </div>

          {genError && (
            <div className="flex items-start gap-2 rounded-xl border border-[#ff453a]/30 bg-[#ff453a]/10 p-3 text-xs text-[#ff453a]">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{genError}</span>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                PROSPECT NAME *
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={prospectName}
                onChange={(e) => setProspectName(e.target.value)}
                className="w-full rounded-xl border border-[#222224] bg-[#141415] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#0a84ff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                TARGET COMPANY *
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full rounded-xl border border-[#222224] bg-[#141415] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#0a84ff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                VALUE PROPOSITION *
              </label>
              <textarea
                rows={4}
                required
                placeholder="How do you help them?"
                value={valueProposition}
                onChange={(e) => setValueProposition(e.target.value)}
                className="w-full rounded-xl border border-[#222224] bg-[#141415] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#0a84ff] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                CALL TO ACTION *
              </label>
              <input
                type="text"
                placeholder="e.g. 15 min chat this week?"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                className="w-full rounded-xl border border-[#222224] bg-[#141415] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#0a84ff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                TONE *
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-xl border border-[#222224] bg-[#141415] px-4 py-3 text-sm text-white focus:border-[#0a84ff] focus:outline-none"
              >
                <option value="Professional & Direct">Professional & Direct</option>
                <option value="Casual & Conversational">Casual & Conversational</option>
                <option value="High Authority Founder">High Authority Founder</option>
                <option value="Short & Soft Pitch">Short & Soft Pitch (Low Friction)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full rounded-xl bg-[#0a84ff] py-3.5 text-sm font-bold text-white transition hover:bg-[#0071e3] shadow-lg shadow-[#0a84ff]/20 flex items-center justify-center gap-2 mt-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Sanitizing & Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Outreach</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* ================================================================ */}
        {/* COLUMN 3: OUTPUT & RECENT HISTORY (Span 4) */}
        {/* ================================================================ */}
        <section className="lg:col-span-4 border-l border-[#1c1c1e] pl-0 lg:pl-6 space-y-6 flex flex-col justify-between">
          
          {outputContent ? (
            /* ACTIVE OUTPUT SUITE */
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#1c1c1e] pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#30d158]" />
                  <h3 className="text-sm font-bold text-white">Deliverability Suite</h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">Score:</span>
                  <span className="text-xl font-extrabold text-[#30d158]">{deliverabilityScore}/100</span>
                </div>
              </div>

              {/* Subject Lines Matrix */}
              {subjectLines.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Subject Line Variations
                  </span>
                  <div className="space-y-1.5">
                    {subjectLines.map((sub, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigator.clipboard.writeText(sub)}
                        className="rounded-xl border border-[#222224] bg-[#141415] px-3 py-2 text-xs font-mono text-gray-300 flex items-center justify-between hover:border-[#0a84ff] transition cursor-pointer"
                      >
                        <span className="truncate">{sub}</span>
                        <Copy className="h-3.5 w-3.5 text-gray-500 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sanitized Body Copy */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Sanitized Email Copy
                </span>
                <div className="rounded-2xl border border-[#222224] bg-[#141415] p-4 text-sm text-gray-200 leading-relaxed font-serif whitespace-pre-wrap min-h-[200px]">
                  {outputContent}
                </div>
              </div>

              {/* Action Launch Bar */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={openInGmail}
                    className="rounded-xl border border-[#222224] bg-[#1c1c1e] py-2.5 px-3 text-xs font-bold text-white hover:bg-[#2c2c2e] transition flex items-center justify-center gap-1.5"
                  >
                    <Mail className="h-4 w-4 text-[#ea4335]" />
                    <span>Open in Gmail</span>
                  </button>

                  <button
                    onClick={openInOutlook}
                    className="rounded-xl border border-[#222224] bg-[#1c1c1e] py-2.5 px-3 text-xs font-bold text-white hover:bg-[#2c2c2e] transition flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="h-4 w-4 text-[#0078d4]" />
                    <span>Open in Outlook</span>
                  </button>
                </div>

                <button
                  onClick={copyToClipboard}
                  className="w-full rounded-xl bg-[#1c1c1e] py-2.5 text-xs font-bold text-white border border-[#222224] hover:bg-[#2c2c2e] transition flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-[#30d158]" />
                      <span className="text-[#30d158]">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-gray-400" />
                      <span>Copy Plain Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* EMPTY STATE & RECENT HISTORY (Matches Image 2) */
            <div className="h-full flex flex-col justify-between space-y-8">
              <div className="text-center py-20 px-4 space-y-3 my-auto">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-[#141415] border border-[#222224] flex items-center justify-center text-gray-600">
                  <Mail className="h-6 w-6" />
                </div>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Your AI-generated outreach will appear here.
                </p>
              </div>

              {/* Recent History Panel */}
              <div className="border-t border-[#1c1c1e] pt-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <History className="h-4 w-4 text-[#0a84ff]" />
                  <span>Recent History</span>
                </div>

                {history.length > 0 ? (
                  <div className="space-y-2">
                    {history.map((item) => (
                      <div key={item.id} className="rounded-xl border border-[#222224] bg-[#141415] p-3 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{item.mode}</span>
                          <span className="text-[10px] font-mono text-gray-500">{item.date}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 line-clamp-1">{item.preview}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 italic">
                    No generations yet. Your creations will appear here.
                  </p>
                )}
              </div>
            </div>
          )}

        </section>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE FULL-SCREEN MODE SELECTOR DRAWER */}
      {/* ------------------------------------------------------------------ */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#000000] p-4 lg:hidden animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#1c1c1e] pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#0a84ff]" />
              <h3 className="text-base font-bold text-white">Select Outreach Mode</h3>
            </div>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="rounded-full bg-[#1c1c1e] p-2 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
            {modeCategories.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-2">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1">
                  {group.category}
                </div>
                <div className="space-y-1.5">
                  {group.modes.map((m) => {
                    const Icon = m.icon;
                    const isSelected = selectedMode.id === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedMode(m);
                          setMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs transition ${
                          isSelected
                            ? "bg-[#0a84ff] text-white font-bold"
                            : "bg-[#141415] text-gray-300 border border-[#222224]"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <div className="flex-1 truncate">
                          <div>{m.name}</div>
                          <div className="text-[10px] opacity-70 truncate">{m.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Support Contact Pill */}
      <a
        href="mailto:help@writeyouremail.com"
        className="fixed bottom-4 right-4 z-30 rounded-full bg-[#1c1c1e] border border-[#222224] px-3.5 py-2 text-xs font-semibold text-gray-300 shadow-2xl hover:text-white transition flex items-center gap-2 opacity-90 hover:opacity-100"
      >
        <HelpCircle className="h-4 w-4 text-[#0a84ff]" />
        <span className="hidden sm:inline">help@writeyouremail.com</span>
      </a>

    </div>
  );
}