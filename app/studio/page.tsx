"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";
import {
  Mail, Sparkles, ShieldAlert, RefreshCw, Zap,
  Share2, Hash, MessageCircle, Video, FileText,
  Send as Plane, Camera, Layers, Disc,
  PhoneCall, Smartphone, MessageSquare, AtSign, Inbox,
  Database, Clapperboard, Mic, Voicemail, Users,
  Shield, UserCheck, Calendar, Target, MessageCircleCode,
  Send, User, History, Lock, CheckCircle2, ChevronDown, Copy, X
} from "lucide-react";
import Link from "next/link";

// Safely import PayPal components client-side only (Bypasses Vercel Build Error)
const PayPalScriptProvider = dynamic(
  () => import("@paypal/react-paypal-js").then((m) => m.PayPalScriptProvider),
  { ssr: false }
);
const PayPalButtons = dynamic(
  () => import("@paypal/react-paypal-js").then((m) => m.PayPalButtons),
  { ssr: false }
);

// Initialize Supabase safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ------------------------------------------------------------------ */
/*  TIER & MODE CONFIGURATION                                         */
/* ------------------------------------------------------------------ */

const TIER_HIERARCHY: Record<string, number> = {
  free: 0,
  starter: 1,
  growth: 2,
  enterprise: 3,
};

const MODES = [
  // STARTER ($19)
  { id: "create", label: "Cold Email", icon: Mail, tier: "starter", color: "#0a84ff" },
  { id: "polish", label: "Magic Polish", icon: Sparkles, tier: "starter", color: "#ff9f0a" },
  { id: "reply", label: "Objection Reply", icon: ShieldAlert, tier: "starter", color: "#ff453a" },
  { id: "winback", label: "Lead Win-Back", icon: RefreshCw, tier: "starter", color: "#30d158" },
  { id: "inbound", label: "Inbound Follow-Up", icon: Zap, tier: "starter", color: "#ffd60a" },

  // GROWTH ($39)
  { id: "linkedin", label: "LinkedIn DM", icon: Share2, tier: "growth", color: "#0077b5" },
  { id: "twitter", label: "Twitter / X DM", icon: Hash, tier: "growth", color: "#1da1f2" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, tier: "growth", color: "#25d366" },
  { id: "vsl_script", label: "Loom VSL Script", icon: Video, tier: "growth", color: "#a855f7" },
  { id: "proposal", label: "Upwork Proposal", icon: FileText, tier: "growth", color: "#6fdc6f" },
  { id: "telegram", label: "Telegram", icon: Plane, tier: "growth", color: "#229ed9" },
  { id: "instagram", label: "Instagram DM", icon: Camera, tier: "growth", color: "#e1306c" },
  { id: "sequence", label: "3-Step Sequence", icon: Layers, tier: "growth", color: "#818cf8" },
  { id: "slack_dm", label: "Slack Connect", icon: MessageSquare, tier: "growth", color: "#e01e5a" },
  { id: "discord", label: "Discord DM", icon: Disc, tier: "growth", color: "#5865f2" },

  // ENTERPRISE ($79)
  { id: "cold_call", label: "Cold Call Script", icon: PhoneCall, tier: "enterprise", color: "#34d399" },
  { id: "sms_sequence", label: "SMS Sequence", icon: Smartphone, tier: "enterprise", color: "#facc15" },
  { id: "reddit_dm", label: "Reddit DM", icon: MessageSquare, tier: "enterprise", color: "#ff4500" },
  { id: "threads_dm", label: "Threads DM", icon: AtSign, tier: "enterprise", color: "#ffffff" },
  { id: "direct_mail", label: "Direct Mail", icon: Inbox, tier: "enterprise", color: "#f472b6" },
  { id: "csv_bulk", label: "CSV Bulk Mapper", icon: Database, tier: "enterprise", color: "#22d3ee" },
  { id: "tiktok", label: "TikTok Pitch", icon: Clapperboard, tier: "enterprise", color: "#fe2c55" },
  { id: "podcast", label: "Podcast Pitch", icon: Mic, tier: "enterprise", color: "#c084fc" },
  { id: "voicemail_drop", label: "Ringless Voicemail", icon: Voicemail, tier: "enterprise", color: "#fb923c" },
  { id: "facebook_dm", label: "FB Messenger", icon: Users, tier: "enterprise", color: "#1877f2" },
  { id: "signal_vip", label: "Signal / VIP DM", icon: Shield, tier: "enterprise", color: "#3a76f0" },
  { id: "recruiter", label: "Talent Recruiter", icon: UserCheck, tier: "enterprise", color: "#2dd4bf" },
  { id: "event_pitch", label: "Conference Pitch", icon: Calendar, tier: "enterprise", color: "#f97316" },
  { id: "abm", label: "ABM Briefing", icon: Target, tier: "enterprise", color: "#ef4444" },
  { id: "wechat", label: "WeChat B2B", icon: MessageCircleCode, tier: "enterprise", color: "#07c160" },
] as const;

type ModeId = (typeof MODES)[number]["id"];

/* ------------------------------------------------------------------ */
/*  FAQ DATA                                                           */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "What is WriteYourEmail.com?",
    a: "WriteYourEmail.com is an AI-powered omni-channel sales copywriting studio. It generates high-converting outreach messages for 30+ channels including cold email, LinkedIn DM, WhatsApp, cold call scripts, SMS sequences, direct mail letters, podcast pitches, and more — all from a single interface.",
  },
  {
    q: "How many channels are supported?",
    a: "We support 30 distinct omni-channel modes covering every outbound and inbound sales touchpoint.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Guests can generate 2 messages without signing up. Free registered users get 5 generations per day. Upgrade to Starter ($19/mo), Growth ($39/mo), or Enterprise ($79/mo) for full access.",
  },
  {
    q: "How does the dynamic form work?",
    a: "Unlike generic AI writers that show the same text box for every channel, our studio dynamically adapts the input form based on the selected channel.",
  },
  {
    q: "How do payments work?",
    a: "We use PayPal Standard Checkout for secure one-time payments. Your paid tier remains active until your 30-day access period expires, then you automatically return to the free plan. No recurring charges.",
  },
];

/* ------------------------------------------------------------------ */
/*  INPUT STYLING CONSTANTS                                            */
/* ------------------------------------------------------------------ */

const INPUT_CLS = "w-full bg-[#1c1c1e] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-[15px] text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all";
const SELECT_CLS = INPUT_CLS;
const TEXTAREA_CLS = `${INPUT_CLS} min-h-[120px] resize-none`;
const LABEL_CLS = "block text-[11px] font-bold text-zinc-500 uppercase tracking-[0.12em] mb-2 pl-1";

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function StudioPage() {
  // ALL REACT HOOKS MUST BE AT THE VERY TOP
  const [mounted, setMounted] = useState(false);
  const [activeMode, setActiveMode] = useState<ModeId>("create");
  const [prompt, setPrompt] = useState("");
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [senderName, setSenderName] = useState("");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Professional & Direct");
  const [persona, setPersona] = useState("Default / General");
  
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [targetTier, setTargetTier] = useState("growth");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    bootstrap();
    const { data: listener } = supabase.auth.onAuthStateChange(() => bootstrap());
    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // HYDRATION FIX: Do not render UI until component has mounted in browser
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  async function bootstrap() {
    const { data: { user: u } } = await supabase.auth.getUser();
    setUser(u);
    if (u) {
      const { data } = await supabase.from("usage_tracking").select("*").eq("user_id", u.id).single();
      setUsage(data || { count: 0, plan_tier: "free" });
      const { data: h } = await supabase.from("emails").select("*").eq("user_id", u.id).order("created_at", { ascending: false }).limit(10);
      setHistory(h || []);
    }
  }

  function checkAccess(modeId: ModeId): boolean {
    const mode = MODES.find((m) => m.id === modeId);
    if (!mode) return false;
    const userTier = usage?.plan_tier || "free";
    if (TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[mode.tier]) return true;
    setTargetTier(mode.tier);
    setShowUpgrade(true);
    return false;
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    if (!checkAccess(activeMode)) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: activeMode, prompt, senderName, language, tone, persona, ...extra }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setResult(data.content);
        bootstrap();
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
      }
    } catch {
      alert("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function updateExtra(key: string, value: string) {
    setExtra((prev) => ({ ...prev, [key]: value }));
  }

  function copyResult() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function switchMode(id: ModeId) {
    setActiveMode(id);
    setExtra({});
    setResult("");
  }

  const activeModeObj = MODES.find((m) => m.id === activeMode)!;
  const userTierLevel = TIER_HIERARCHY[usage?.plan_tier || "free"];

  function getPromptMeta(): { label: string; placeholder: string } {
    switch (activeMode) {
      case "reply": return { label: "Prospect Objection / Reply", placeholder: "Paste the prospect's email or objection..." };
      case "polish": return { label: "Rough Draft to Polish", placeholder: "Paste your rough draft email here..." };
      case "proposal": return { label: "Your Core Pitch / Relevant Experience", placeholder: "Describe your skills and relevant project experience..." };
      case "csv_bulk": return { label: "Base Email Template with Tags", placeholder: "Write your template using tags like {{first_name}}..." };
      default: return { label: "Campaign Goal / Core Value Pitch", placeholder: "Describe your product, the core problem it solves, your target audience..." };
    }
  }

  const promptMeta = getPromptMeta();

  /* ================================================================ */
  /*  DYNAMIC FORM FIELDS                                              */
  /* ================================================================ */

  function renderDynamicFields() {
    switch (activeMode) {
      case "create":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={LABEL_CLS}>Recipient Role / Title</label><input className={INPUT_CLS} placeholder="e.g. VP of Sales" onChange={(e) => updateExtra("recipient_role", e.target.value)} /></div>
            <div><label className={LABEL_CLS}>Company / Industry</label><input className={INPUT_CLS} placeholder="e.g. Shopify, E-commerce SaaS" onChange={(e) => updateExtra("company", e.target.value)} /></div>
            <div>
              <label className={LABEL_CLS}>Call-to-Action Type</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("cta_type", e.target.value)}>
                <option value="book_call">Book a Call</option><option value="reply">Get a Reply</option><option value="click_link">Click a Link</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Email Length</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("length", e.target.value)}>
                <option value="short">Short (50-80 words)</option><option value="medium">Medium (100-150 words)</option>
              </select>
            </div>
          </div>
        );
      case "whatsapp":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Emoji Density</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("emojis", e.target.value)}>
                <option value="minimal">Minimal / Business</option><option value="moderate">Moderate / Friendly</option><option value="heavy">Heavy / Casual</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Sequence Steps</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("steps", e.target.value)}>
                <option value="1">Single Message</option><option value="3">3-Message Drip</option>
              </select>
            </div>
          </div>
        );
      case "proposal":
        return (
          <div className="space-y-4">
            <div><label className={LABEL_CLS}>Paste Client Job Description</label><textarea className={TEXTAREA_CLS} placeholder="Copy & paste the job post here..." onChange={(e) => updateExtra("job_post", e.target.value)} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={LABEL_CLS}>Your Rate</label><input className={INPUT_CLS} placeholder="$50/hr" onChange={(e) => updateExtra("rate", e.target.value)} /></div>
              <div><label className={LABEL_CLS}>Portfolio Link</label><input className={INPUT_CLS} placeholder="https://yourportfolio.com" onChange={(e) => updateExtra("portfolio", e.target.value)} /></div>
            </div>
          </div>
        );
      case "cold_call":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Gatekeeper Bypass Tactic</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("gatekeeper", e.target.value)}>
                <option value="assertive">Assertive / Peer-to-Peer</option><option value="curious">Curious / Seeking Help</option>
              </select>
            </div>
            <div><label className={LABEL_CLS}>Call Objective</label><input className={INPUT_CLS} placeholder="e.g. Book a Demo" onChange={(e) => updateExtra("objective", e.target.value)} /></div>
          </div>
        );
      case "direct_mail":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Physical Format</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("mail_format", e.target.value)}>
                <option value="executive_letter">Formal Executive Letter</option><option value="handwritten_card">Handwritten Style Postcard</option>
              </select>
            </div>
            <div><label className={LABEL_CLS}>Enclosed Gift / Pattern Interrupt</label><input className={INPUT_CLS} placeholder="e.g. $5 Starbucks card" onChange={(e) => updateExtra("gift", e.target.value)} /></div>
          </div>
        );
      case "csv_bulk":
        return (
          <div className="space-y-4">
            <div>
              <label className={LABEL_CLS}>Number of Variations</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("variations", e.target.value)}>
                <option value="3">3 Variations</option><option value="5">5 Variations</option>
              </select>
            </div>
            <div><label className={LABEL_CLS}>Fallback for Empty Tags</label><input className={INPUT_CLS} placeholder="e.g. 'there' for empty {{first_name}}" onChange={(e) => updateExtra("fallback", e.target.value)} /></div>
          </div>
        );
      default:
        return null;
    }
  }

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-blue-500/30" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif" }}>
      {/* ---- NAV ---- */}
      <nav className="border-b border-white/[0.04] bg-[#0a0a0a]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-blue-600 rounded-[10px] flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Mail className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-bold tracking-tight text-[17px]">
              WriteYourEmail<span className="text-blue-500">.com</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {usage && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] rounded-full border border-white/[0.06]">
                <div className={`w-1.5 h-1.5 rounded-full ${usage.plan_tier !== "free" ? "bg-green-500 animate-pulse" : "bg-zinc-500"}`} />
                <span className="text-[11px] font-semibold text-zinc-400 tracking-wide">
                  {(usage.plan_tier || "free").toUpperCase()} · {usage.count} used
                </span>
              </div>
            )}
            {!user && (
              <Link href="/auth" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-semibold transition-colors">
                Sign In
              </Link>
            )}
            {user && (
              <Link href="/profile" className="p-2 hover:bg-white/[0.04] rounded-full transition-colors">
                <User className="w-5 h-5 text-zinc-400" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 md:py-16">
        <header className="mb-10">
          <h1 className="text-3xl md:text-[42px] font-extrabold tracking-tight leading-[1.1] mb-3">
            Omni-Channel Sales Studio
          </h1>
          <p className="text-zinc-500 text-[17px] font-medium max-w-2xl">
            Select any of the 30 outreach channels below. The form adapts dynamically to each platform for maximum output quality.
          </p>
        </header>

        {/* ---- MODE DOCK ---- */}
        <div className="mb-10 relative">
          <div className="flex gap-6 mb-4">
            {[
              { label: "Starter", color: "text-blue-500", tier: "starter" },
              { label: "Growth", color: "text-purple-400", tier: "growth" },
              { label: "Enterprise", color: "text-orange-400", tier: "enterprise" },
            ].map((t) => (
              <span key={t.tier} className={`text-[10px] font-bold uppercase tracking-[0.15em] ${t.color}`}>
                {t.label}
              </span>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {MODES.map((mode) => {
              const locked = userTierLevel < TIER_HIERARCHY[mode.tier];
              const active = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => switchMode(mode.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[13px] font-semibold transition-all duration-200 ${
                    active
                      ? "bg-[#0a84ff] border-[#0a84ff]/50 text-white shadow-lg shadow-blue-500/20 scale-[1.03]"
                      : locked
                      ? "bg-[#141415] border-white/[0.04] text-zinc-600 hover:border-white/[0.08]"
                      : "bg-[#141415] border-white/[0.04] text-zinc-400 hover:border-white/[0.08] hover:bg-[#1c1c1e]"
                  }`}
                >
                  <mode.icon className="w-4 h-4" style={active ? {} : { color: mode.color }} />
                  <span>{mode.label}</span>
                  {locked && <Lock className="w-3 h-3 opacity-40" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- MAIN GRID ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ---- LEFT: FORM ---- */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleGenerate} className="bg-[#141415] border border-white/[0.04] rounded-[28px] p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: activeModeObj.color + "18" }}>
                  <activeModeObj.icon className="w-4 h-4" style={{ color: activeModeObj.color }} />
                </div>
                <span className="text-sm font-bold text-white">{activeModeObj.label}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-500">
                  {activeModeObj.tier}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={LABEL_CLS}>{promptMeta.label}</label>
                  <textarea
                    required
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={promptMeta.placeholder}
                    className={`${TEXTAREA_CLS} min-h-[180px] text-[16px] leading-relaxed`}
                  />
                </div>

                {renderDynamicFields()}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className={LABEL_CLS}>Output Language</label>
                    <select className={SELECT_CLS} value={language} onChange={(e) => setLanguage(e.target.value)}>
                      <option>English</option><option>Spanish</option><option>French</option><option>German</option>
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>ICP Persona</label>
                    <select className={SELECT_CLS} value={persona} onChange={(e) => setPersona(e.target.value)}>
                      <option>Default / General</option><option>SaaS Founder</option><option>VP of Sales</option><option>Agency Owner</option>
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Tone of Voice</label>
                    <select className={SELECT_CLS} value={tone} onChange={(e) => setTone(e.target.value)}>
                      <option>Professional & Direct</option><option>Casual & Friendly</option><option>Urgent & Scarcity</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="w-full bg-[#0a84ff] hover:bg-[#0070e0] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 text-[16px]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Generate {activeModeObj.label.toUpperCase()}
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* ---- RESULT ---- */}
            {result && (
              <div ref={resultRef} className="bg-[#141415] border border-white/[0.06] rounded-[28px] p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">AI Result — {activeModeObj.label}</span>
                  </div>
                  <button onClick={copyResult} className="flex items-center gap-1.5 text-[11px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-[0.12em]">
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="whitespace-pre-wrap text-[15px] text-zinc-200 leading-[1.8] font-medium">{result}</div>

                <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/[0.04] rounded-xl flex items-center justify-center">
                      <Send className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Ready to send at scale?</p>
                      <p className="text-[10px] text-zinc-500">We recommend Instantly.ai for high-volume outreach.</p>
                    </div>
                  </div>
                  <a href="https://instantly.ai/?via=writeyouremail" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-xs font-bold transition-all">
                    Try Instantly →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ---- RIGHT: SIDEBAR ---- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#141415] border border-white/[0.04] rounded-[28px] p-6">
              <div className="flex items-center gap-2 mb-5">
                <History className="w-4 h-4 text-zinc-500" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">Recent Generations</h3>
              </div>
              <div className="space-y-2.5 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {history.length > 0 ? (
                  history.map((item) => (
                    <button key={item.id} onClick={() => setResult(item.content)} className="w-full text-left p-4 rounded-2xl bg-[#1c1c1e] border border-white/[0.04] hover:border-white/[0.08] transition-all group">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{item.mode || "email"}</span>
                        <span className="text-[10px] text-zinc-600">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[13px] text-zinc-500 line-clamp-2 leading-relaxed group-hover:text-zinc-300">{item.prompt}</p>
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <Layers className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
                    <p className="text-zinc-600 text-sm">No history yet.</p>
                  </div>
                )}
              </div>
            </div>

            {(usage?.plan_tier === "free" || !usage) && (
              <div className="bg-gradient-to-br from-blue-600/90 to-indigo-700/90 rounded-[28px] p-6 text-white shadow-xl shadow-blue-500/10 border border-blue-500/20">
                <Sparkles className="w-8 h-8 mb-4 opacity-60" />
                <h3 className="text-xl font-bold mb-2">Unlock All 30 Channels</h3>
                <p className="text-blue-100/80 text-sm mb-6 leading-relaxed">
                  Upgrade to Growth for WhatsApp, LinkedIn, Instagram, Loom scripts & sequences. Enterprise unlocks cold call scripts, SMS, direct mail, ABM, and CSV bulk.
                </p>
                <div className="space-y-2">
                  <button onClick={() => { setTargetTier("growth"); setShowUpgrade(true); }} className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl shadow-lg hover:bg-blue-50 transition-colors">
                    Growth — $39/mo
                  </button>
                  <button onClick={() => { setTargetTier("enterprise"); setShowUpgrade(true); }} className="w-full bg-white/10 text-white font-bold py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                    Enterprise — $79/mo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ---- FAQS ---- */}
        <section className="mt-24 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-[36px] font-extrabold tracking-tight mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#141415] border border-white/[0.04] rounded-2xl overflow-hidden transition-all">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 md:p-6 text-left group">
                  <span className="text-[15px] font-semibold text-white pr-4 group-hover:text-blue-400 transition-colors">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === i ? "rotate-180 text-blue-500" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0"><p className="text-[14px] text-zinc-400 leading-[1.8]">{faq.a}</p></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ---- FOOTER ---- */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-zinc-600 font-medium">© {new Date().getFullYear()} WriteYourEmail.com — AI-Powered Omni-Channel Sales Copywriting</p>
          <div className="flex items-center gap-6">
            <Link href="/profile" className="text-[12px] text-zinc-500 hover:text-white transition-colors font-medium">Account</Link>
          </div>
        </div>
      </footer>

      {/* ---- UPGRADE MODAL ---- */}
      {showUpgrade && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/70 animate-in fade-in duration-300">
          <div className="bg-[#141415] border border-white/[0.08] w-full max-w-md rounded-[32px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowUpgrade(false)} className="absolute top-5 right-5 p-1 text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500/10 rounded-[20px] flex items-center justify-center mx-auto mb-5 border border-blue-500/20">
                <Sparkles className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Upgrade to {targetTier.charAt(0).toUpperCase() + targetTier.slice(1)}</h2>
            </div>
            <div className="bg-[#1c1c1e] rounded-2xl p-4 mb-6 text-center border border-white/[0.04]">
              <p className="text-3xl font-bold text-white">${targetTier === "starter" ? "19" : targetTier === "growth" ? "39" : "79"}<span className="text-sm font-medium text-zinc-500"> / month</span></p>
            </div>
            {user ? (
              <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "", currency: "USD", intent: "capture" }}>
                <PayPalButtons
                  style={{ layout: "vertical", shape: "pill", label: "pay", height: 48 }}
                  createOrder={(data: any, actions: any) => {
                    const price = targetTier === "starter" ? "19.00" : targetTier === "growth" ? "39.00" : "79.00";
                    return actions.order.create({
                      purchase_units: [{ amount: { value: price, currency_code: "USD" }, description: `WriteYourEmail.com ${targetTier}`, custom_id: user?.id }],
                    });
                  }}
                  onApprove={async (data: any, actions: any) => {
                    if (!actions.order) return;
                    const capture = await actions.order.capture();
                    if (capture?.status === "COMPLETED") {
                      await fetch("/api/paypal/capture-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderID: data.orderID, user_id: user?.id, tier: targetTier }) });
                      setShowUpgrade(false);
                      bootstrap();
                      alert(`🎉 Welcome to ${targetTier.toUpperCase()}! Your access is now active.`);
                    }
                  }}
                />
              </PayPalScriptProvider>
            ) : (
              <Link href="/auth" className="w-full block text-center bg-[#0a84ff] hover:bg-[#0070e0] text-white font-bold py-4 rounded-2xl transition-colors">Sign In to Upgrade</Link>
            )}
            <p className="text-[10px] text-zinc-600 text-center mt-5 uppercase tracking-[0.12em] font-bold">🔒 Secure Encrypted Payment via PayPal</p>
          </div>
        </div>
      )}
    </div>
  );
}