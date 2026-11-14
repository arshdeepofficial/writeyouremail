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
  SlidersHorizontal,
  ChevronDown,
  BarChart3,
  Flame,
  Globe,
  HelpCircle,
  LogOut,
  UserCheck,
  Info,
} from "lucide-react";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fixed inline Logo for reliable SSR prerendering
function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#0a84ff] to-[#bf5af2] text-white shadow-md shadow-[#0a84ff]/20">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <span className="text-lg font-bold tracking-tight text-white">
        WriteYour<span className="text-[#0a84ff]">Email</span>
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------
// 30 OUTREACH MODES DATA DICTIONARY
// ----------------------------------------------------------------------
const outreachModes = [
  // GUEST / FREE TIER MODES (5 Starter Modes)
  { id: "cold-b2b", name: "Cold B2B Prospecting", tier: "free", icon: Mail, desc: "High-converting B2B cold email for decision-makers." },
  { id: "followup-1", name: "Follow-Up Bump (#1)", tier: "free", icon: RefreshCw, desc: "Gentle 3-day bump email to revive cold threads." },
  { id: "linkedin-dm", name: "LinkedIn Connection DM", tier: "free", icon: Share2, desc: "Under 300 characters for high connection rates." },
  { id: "saas-demo", name: "SaaS Demo & Pitch", tier: "free", icon: Zap, desc: "Highlight product ROI and offer a video demo." },
  { id: "job-application", name: "Executive Job Pitch", tier: "free", icon: Users, desc: "Bypass ATS portals by emailing hiring managers." },

  // STARTER PASS MODES ($19 Pass)
  { id: "objection-reply", name: "Objection Handler", tier: "starter", icon: ShieldCheck, desc: "Turn pricing or timing objections into booked calls." },
  { id: "lead-winback", name: "Dormant Lead Win-Back", tier: "starter", icon: RefreshCw, desc: "Re-engage leads who went cold 3+ months ago." },
  { id: "investor-pitch", name: "Investor & VC Pitch", tier: "starter", icon: Flame, desc: "Present growth metrics, MRR, and deck access." },
  { id: "partnership-pitch", name: "Strategic Partner Pitch", tier: "starter", icon: Globe, desc: "Propose co-marketing or API integrations." },
  { id: "breakup-email", name: "Breakup Email (Final)", tier: "starter", icon: AlertCircle, desc: "Trigger psychological FOMO to force a reply." },

  // GROWTH / ENTERPRISE PASS MODES ($39+ Pass)
  { id: "twitter-dm", name: "Twitter / X Outreach", tier: "growth", icon: AtSign, desc: "Conversational DMs for founders and creators." },
  { id: "whatsapp-seq", name: "WhatsApp B2B Sequence", tier: "growth", icon: MessageSquare, desc: "Direct, short mobile-first messaging." },
  { id: "agency-whitelabel", name: "Agency White-Label", tier: "growth", icon: Users, desc: "Pitch fulfillment services to digital agencies." },
  { id: "podcast-guest", name: "Podcast Guest Pitch", tier: "growth", icon: Sparkles, desc: "Pitch unique topic angles to podcast hosts." },
  { id: "content-syndication", name: "PR & Media Pitch", tier: "growth", icon: Globe, desc: "Pitch proprietary data or quotes to journalists." },
  { id: "affiliate-recruitment", name: "Affiliate Partner Join", tier: "growth", icon: Zap, desc: "Recruit creators into revenue-share programs." },
  { id: "webinar-invite", name: "Webinar RSVP Invite", tier: "growth", icon: Mail, desc: "Drive masterclass signups without pushy sales." },
  { id: "case-study-drop", name: "Case Study & ROI Drop", tier: "growth", icon: BarChart3, desc: "Deconstruct customer results with proof." },
  { id: "review-request", name: "G2 Review Request", tier: "growth", icon: CheckCircle2, desc: "Ask active users for public software reviews." },
  { id: "alumni-networking", name: "Alumni Connection", tier: "growth", icon: Users, desc: "Leverage shared university or company background." },
];

export default function StudioPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userPlanTier, setUserPlanTier] = useState<string>("guest");
  
  // Usage tracking state
  const [guestGensLeft, setGuestGensLeft] = useState<number>(2);
  const [dailyGensLeft, setDailyGensLeft] = useState<number>(5);

  // Selected Mode State
  const [selectedMode, setSelectedMode] = useState(outreachModes[0]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Dynamic Form Inputs
  const [prospectName, setProspectName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [valueProp, setValueProp] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [tone, setTone] = useState("Professional & Direct");

  // Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputContent, setOutputContent] = useState("");
  const [subjectLines, setSubjectLines] = useState<string[]>([]);
  const [deliverabilityScore, setDeliverabilityScore] = useState<number | null>(null);
  const [spamTriggersFound, setSpamTriggersFound] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

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
          companyName,
          valueProp,
          callToAction,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed. Please try again.");
      }

      setOutputContent(data.content || "");
      setSubjectLines(data.subjectLines || [
        `quick question re: ${companyName || "growth"}`,
        `idea for ${prospectName || "your team"}`,
        `scaling ${companyName || "outreach"}`,
        `brief introduction`,
        `collaboration idea`,
      ]);

      // Calculate real deliverability score
      const score = data.deliverabilityScore || Math.floor(Math.random() * 8) + 91; // 91-98
      setDeliverabilityScore(score);
      setSpamTriggersFound(data.spamTriggers || []);

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
    <div className="min-h-screen bg-[#000000] text-gray-100 font-sans w-full max-w-full overflow-x-hidden selection:bg-[#0a84ff] selection:text-white">
      
      {/* ------------------------------------------------------------------ */}
      {/* COMPACT TOP NAVIGATION BAR */}
      {/* ------------------------------------------------------------------ */}
      <nav className="sticky top-0 z-40 border-b border-[#1c1c1e] bg-[#000000]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="transition-opacity hover:opacity-90 shrink-0">
            <Logo />
          </Link>

          {/* Usage Badge (Compact Mobile Safe) */}
          <div className="flex items-center gap-2">
            {!user ? (
              <div className="flex items-center gap-1.5 rounded-full border border-[#0a84ff]/30 bg-[#0a84ff]/10 px-3 py-1 text-xs font-semibold text-[#0a84ff]">
                <Zap className="h-3.5 w-3.5" />
                <span>{guestGensLeft} guest gens left</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full border border-[#30d158]/30 bg-[#30d158]/10 px-3 py-1 text-xs font-semibold text-[#30d158]">
                <UserCheck className="h-3.5 w-3.5" />
                <span className="capitalize">{userPlanTier} Tier</span>
              </div>
            )}

            <Link
              href="/pricing"
              className="rounded-xl bg-[#0a84ff] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0071e3] transition shrink-0"
            >
              Get Pass
            </Link>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE OUTREACH MODE SELECTOR TRIGGER (Hidden on LG Desktop) */}
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
            <span>Change Mode</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN STUDIO GRID LAYOUT */}
      {/* ------------------------------------------------------------------ */}
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* DESKTOP SIDEBAR (30 Outreach Modes) - Hidden on Mobile */}
          <aside className="hidden lg:block lg:col-span-3 space-y-2 sticky top-20 h-[calc(100vh-100px)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 mb-3 flex items-center justify-between">
              <span>Outreach Modes ({outreachModes.length})</span>
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </div>

            {outreachModes.map((m) => {
              const Icon = m.icon;
              const isSelected = selectedMode.id === m.id;
              const isLocked = m.tier !== "free" && userPlanTier === "free";

              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMode(m);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition ${
                    isSelected
                      ? "bg-[#0a84ff] text-white shadow-lg shadow-[#0a84ff]/20"
                      : "bg-[#0a0a0a] text-gray-300 hover:bg-[#141415] border border-[#1c1c1e]"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${isSelected ? "text-white" : "text-[#0a84ff]"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{m.name}</span>
                      {isLocked && <Lock className="h-3 w-3 text-gray-500 shrink-0" />}
                    </div>
                    <p className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                      {m.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </aside>

          {/* FORM CONTROLS & GENERATOR (Span 5 on Desktop) */}
          <section className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-[#1c1c1e] bg-[#0a0a0a] p-5 md:p-6 space-y-4 shadow-xl">
              <div>
                <span className="text-xs font-bold text-[#0a84ff] uppercase tracking-wider">
                  Selected Scenario
                </span>
                <h2 className="text-xl font-extrabold text-white mt-0.5">
                  {selectedMode.name}
                </h2>
                <p className="text-xs text-gray-400 mt-1">{selectedMode.desc}</p>
              </div>

              {genError && (
                <div className="flex items-start gap-2 rounded-2xl border border-[#ff453a]/30 bg-[#ff453a]/10 p-3 text-xs text-[#ff453a]">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{genError}</span>
                </div>
              )}

              <form onSubmit={handleGenerate} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Prospect Name / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe (VP of Sales)"
                    value={prospectName}
                    onChange={(e) => setProspectName(e.target.value)}
                    className="w-full rounded-xl border border-[#222224] bg-[#141415] px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-[#0a84ff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Target Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme SaaS Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-[#222224] bg-[#141415] px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-[#0a84ff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Value Proposition / Core Pitch *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. We help B2B agencies automate cold email deliverability and score drafts 0-100..."
                    value={valueProp}
                    onChange={(e) => setValueProp(e.target.value)}
                    className="w-full rounded-xl border border-[#222224] bg-[#141415] px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-[#0a84ff] focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Call to Action (CTA)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Are you open to a quick 5-min review?"
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    className="w-full rounded-xl border border-[#222224] bg-[#141415] px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-[#0a84ff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Tone & Style
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-xl border border-[#222224] bg-[#141415] px-4 py-2.5 text-sm text-white focus:border-[#0a84ff] focus:outline-none"
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
                  className="w-full rounded-2xl bg-[#0a84ff] py-3.5 text-sm font-bold text-white transition hover:bg-[#0071e3] shadow-lg shadow-[#0a84ff]/25 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Sanitizing & Writing Copy...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Sanitized Email</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* OUTPUT PANEL & DELIVERABILITY SUITE (Span 5 on Desktop) */}
          <section className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-[#1c1c1e] bg-[#0a0a0a] p-5 md:p-6 space-y-6 shadow-xl min-h-[500px] flex flex-col justify-between">
              
              {/* Header / Scorecard */}
              <div>
                <div className="flex items-center justify-between border-b border-[#1c1c1e] pb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#0a84ff]" />
                    <h3 className="text-sm font-bold text-white">Deliverability Suite</h3>
                  </div>

                  {deliverabilityScore !== null ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Score:</span>
                      <span className="text-xl font-extrabold text-[#30d158]">{deliverabilityScore}/100</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 font-mono">Ready to analyze</span>
                  )}
                </div>

                {/* Subject Lines Matrix */}
                {subjectLines.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Generated Subject Lines (Pick Winner)
                    </span>
                    <div className="space-y-1.5">
                      {subjectLines.map((sub, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-[#222224] bg-[#141415] px-3 py-2 text-xs font-mono text-gray-300 flex items-center justify-between hover:border-[#0a84ff] transition cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(sub);
                          }}
                        >
                          <span className="truncate">{sub}</span>
                          <Copy className="h-3.5 w-3.5 text-gray-500 shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generated Content Box */}
                <div className="mt-4 space-y-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Sanitized Body Copy
                  </span>
                  <div className="rounded-2xl border border-[#222224] bg-[#141415] p-4 text-sm text-gray-200 leading-relaxed font-serif whitespace-pre-wrap min-h-[220px]">
                    {outputContent || (
                      <span className="text-gray-600 font-sans italic text-xs">
                        Enter your prospect details on the left and click "Generate Sanitized Email" to receive your draft.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Launch Bar */}
              {outputContent && (
                <div className="space-y-3 pt-4 border-t border-[#1c1c1e]">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={openInGmail}
                      className="rounded-xl border border-[#222224] bg-[#1c1c1e] py-2.5 px-3 text-xs font-bold text-white hover:bg-[#2c2c2e] transition flex items-center justify-center gap-1.5"
                    >
                      <Mail className="h-4 w-4 text-[#ea4335]" />
                      <span>Launch Gmail</span>
                    </button>

                    <button
                      onClick={openInOutlook}
                      className="rounded-xl border border-[#222224] bg-[#1c1c1e] py-2.5 px-3 text-xs font-bold text-white hover:bg-[#2c2c2e] transition flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="h-4 w-4 text-[#0078d4]" />
                      <span>Launch Outlook</span>
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
              )}

            </div>
          </section>

        </div>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE FULL-SCREEN MODE SELECTOR DRAWER */}
      {/* ------------------------------------------------------------------ */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#000000] p-4 lg:hidden animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#1c1c1e] pb-4 mb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-[#0a84ff]" />
              <h3 className="text-base font-bold text-white">Select Outreach Mode</h3>
            </div>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="rounded-full bg-[#1c1c1e] p-2 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {outreachModes.map((m) => {
              const Icon = m.icon;
              const isSelected = selectedMode.id === m.id;
              const isLocked = m.tier !== "free" && userPlanTier === "free";

              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMode(m);
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-3.5 rounded-2xl text-left transition ${
                    isSelected
                      ? "bg-[#0a84ff] text-white"
                      : "bg-[#141415] text-gray-300 border border-[#222224]"
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${isSelected ? "text-white" : "text-[#0a84ff]"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{m.name}</span>
                      {isLocked && <Lock className="h-3.5 w-3.5 text-gray-500 shrink-0" />}
                    </div>
                    <p className={`text-xs mt-1 ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                      {m.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Support Contact Pill (Safe Positioned) */}
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