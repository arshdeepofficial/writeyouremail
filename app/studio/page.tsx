"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Initialize Supabase Client directly
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
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
    a: "We support 30 distinct omni-channel modes covering every outbound and inbound sales touchpoint: email, social DMs (LinkedIn, Twitter/X, Instagram, Threads, Discord, Slack), messaging apps (WhatsApp, Telegram, Signal, WeChat, FB Messenger), voice (cold call scripts, ringless voicemail), physical mail (direct mail letters & postcards), video scripts (Loom/VSL), freelance proposals (Upwork/Fiverr), community outreach (Reddit, Discord), recruitment sourcing, conference meeting pitches, account-based marketing briefings, TikTok creator pitches, podcast guest pitches, SMS campaigns, and CSV bulk personalization.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Guests can generate 2 messages without signing up. Free registered users get 5 generations per day with access to basic email modes. Upgrade to Starter ($19/mo) for 50 generations, Growth ($39/mo) for unlimited generations plus social & messaging channels, or Enterprise ($79/mo) for all 30 channels including offline, voice, and bulk modes.",
  },
  {
    q: "What AI model powers the generations?",
    a: "We use state-of-the-art large language models via Groq's ultra-fast inference API, including Llama 3.1 and Mixtral. Our multi-model fallback system ensures 99.9% uptime — if one model is unavailable, we automatically switch to the next.",
  },
  {
    q: "How does the dynamic form work?",
    a: "Unlike generic AI writers that show the same text box for every channel, our studio dynamically adapts the input form based on the selected channel. WhatsApp mode shows emoji density and sequence step controls. Upwork mode shows a job post paste area and rate field. Cold call mode shows gatekeeper tactic selectors. Each channel gets purpose-built inputs for maximum output quality.",
  },
  {
    q: "How do payments work?",
    a: "We use PayPal Standard Checkout for secure one-time payments. When you upgrade, you purchase 30-day prepaid access to your chosen tier. Your access activates instantly and expires after 30 days. There are no recurring subscriptions or hidden charges — you renew manually when you choose to.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Since we use prepaid access instead of recurring subscriptions, there is nothing to cancel. Your paid tier remains active until your 30-day access period expires, then you automatically return to the free plan. No cancellation forms, no retention calls, no hassle.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. We use Supabase (built on PostgreSQL) with row-level security for all user data. Your generated messages are stored in your private history and are never shared, sold, or used for model training. All API communications are encrypted via HTTPS/TLS.",
  },
  {
    q: "What makes this different from ChatGPT?",
    a: "ChatGPT is a general-purpose assistant. WriteYourEmail.com is a purpose-built sales copywriting tool with 30 channel-specific modes, dynamic input forms tailored to each platform, deliverability-optimized output, professional tone presets, ICP persona targeting, multi-language support, and a usage dashboard — all without needing to write a single prompt.",
  },
  {
    q: "Do you offer team or agency plans?",
    a: "Enterprise tier ($79/mo) includes all 30 channels and unlimited generations, which is ideal for agencies and teams. For custom volume pricing with dedicated support, contact us at hello@writeyouremail.com.",
  },
];

/* ------------------------------------------------------------------ */
/*  INPUT STYLING CONSTANTS                                            */
/* ------------------------------------------------------------------ */

const INPUT_CLS =
  "w-full bg-[#1c1c1e] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-[15px] text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all";
const SELECT_CLS = INPUT_CLS;
const TEXTAREA_CLS = `${INPUT_CLS} min-h-[120px] resize-none`;
const LABEL_CLS =
  "block text-[11px] font-bold text-zinc-500 uppercase tracking-[0.12em] mb-2 pl-1";

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function StudioPage() {
  // core state
  const [activeMode, setActiveMode] = useState<ModeId>("create");
  const [prompt, setPrompt] = useState("");
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [senderName, setSenderName] = useState("");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Professional & Direct");
  const [persona, setPersona] = useState("Default / General");

  // ---- output state ----
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ---- user / usage ----
  const [user, setUser] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // ---- upgrade modal ----
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [targetTier, setTargetTier] = useState("growth");

  // ---- FAQ accordion ----
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ---- refs ----
  const resultRef = useRef<HTMLDivElement>(null);

  /* ---------- bootstrap ---------- */
  useEffect(() => {
    bootstrap();
    const { data: listener } = supabase.auth.onAuthStateChange(() => bootstrap());
    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function bootstrap() {
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    setUser(u);
    if (u) {
      const { data } = await supabase
        .from("usage_tracking")
        .select("*")
        .eq("user_id", u.id)
        .single();
      setUsage(data || { count: 0, plan_tier: "free" });
      const { data: h } = await supabase
        .from("emails")
        .select("*")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setHistory(h || []);
    }
  }

  /* ---------- tier check ---------- */
  function checkAccess(modeId: ModeId): boolean {
    const mode = MODES.find((m) => m.id === modeId);
    if (!mode) return false;
    const userTier = usage?.plan_tier || "free";
    if (TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[mode.tier]) return true;
    setTargetTier(mode.tier);
    setShowUpgrade(true);
    return false;
  }

  /* ---------- generate ---------- */
  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    if (!checkAccess(activeMode)) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: activeMode,
          prompt,
          senderName,
          language,
          tone,
          persona,
          ...extra,
        }),
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

  /* ---------- helpers ---------- */
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

  /* ---------- prompt label & placeholder ---------- */
  function getPromptMeta(): { label: string; placeholder: string } {
    switch (activeMode) {
      case "reply":
        return {
          label: "Prospect Objection / Reply",
          placeholder: "Paste the prospect's email or objection (e.g. 'Your price is too high', 'We already use a competitor', 'Not interested right now')...",
        };
      case "polish":
        return {
          label: "Rough Draft to Polish",
          placeholder: "Paste your rough draft email here. We'll transform it into a crisp, high-converting message while preserving your intent...",
        };
      case "winback":
        return {
          label: "Context About the Dormant Lead",
          placeholder: "Describe the lead, what you previously pitched, and why they went cold (e.g. 'SaaS founder, demoed in March, stopped responding after pricing call')...",
        };
      case "inbound":
        return {
          label: "Inbound Submission Details",
          placeholder: "Paste the form submission or describe the inbound lead (e.g. 'CEO of 50-person agency filled out demo request, interested in automation')...",
        };
      case "proposal":
        return {
          label: "Your Core Pitch / Relevant Experience",
          placeholder: "Describe your skills, relevant project experience, and why you're the perfect fit for this type of project...",
        };
      case "cold_call":
        return {
          label: "Product Value Proposition",
          placeholder: "What do you sell, who is it for, and what's the main pain point you solve? (e.g. 'AI scheduling tool that saves sales teams 10 hrs/week')...",
        };
      case "csv_bulk":
        return {
          label: "Base Email Template with Tags",
          placeholder: "Write your template using tags like {{first_name}}, {{company}}, {{pain_point}}. We'll generate personalized variations for each row...",
        };
      case "abm":
        return {
          label: "Target Account & Strategic Objective",
          placeholder: "Name the target company, their public strategic priorities (from 10-K, press releases), and your proposed partnership angle...",
        };
      case "podcast":
        return {
          label: "Your Expertise & Story Angle",
          placeholder: "What unique story, data, or expertise can you bring to a podcast? What would the audience gain from your episode?...",
        };
      default:
        return {
          label: "Campaign Goal / Core Value Pitch",
          placeholder: "Describe your product, the core problem it solves, your target audience, and your specific offer or call-to-action...",
        };
    }
  }

  const promptMeta = getPromptMeta();

  /* ================================================================ */
  /*  DYNAMIC FORM FIELDS                                              */
  /* ================================================================ */

  function renderDynamicFields() {
    switch (activeMode) {
      /* ---- STARTER ---- */
      case "create":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Recipient Role / Title</label>
              <input className={INPUT_CLS} placeholder="e.g. VP of Sales, CTO, Founder" onChange={(e) => updateExtra("recipient_role", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Company / Industry</label>
              <input className={INPUT_CLS} placeholder="e.g. Shopify, E-commerce SaaS" onChange={(e) => updateExtra("company", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Call-to-Action Type</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("cta_type", e.target.value)}>
                <option value="book_call">Book a Call</option>
                <option value="reply">Get a Reply</option>
                <option value="click_link">Click a Link</option>
                <option value="watch_demo">Watch Demo</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Email Length</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("length", e.target.value)}>
                <option value="short">Short (50-80 words)</option>
                <option value="medium">Medium (100-150 words)</option>
                <option value="long">Long (200+ words)</option>
              </select>
            </div>
          </div>
        );

      case "polish":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Polish Intensity</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("intensity", e.target.value)}>
                <option value="light">Light Touch (fix grammar & flow)</option>
                <option value="medium">Medium (restructure & sharpen)</option>
                <option value="heavy">Heavy Rewrite (full transformation)</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Target Word Count</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("word_count", e.target.value)}>
                <option value="same">Keep Same Length</option>
                <option value="shorter">Make Shorter</option>
                <option value="longer">Expand & Elaborate</option>
              </select>
            </div>
          </div>
        );

      case "reply":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Objection Type</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("objection_type", e.target.value)}>
                <option value="price">Price / Budget</option>
                <option value="timing">Timing / Not Now</option>
                <option value="competitor">Already Using Competitor</option>
                <option value="authority">Need to Check with Boss</option>
                <option value="ghost">Complete Ghost / No Reply</option>
                <option value="generic">Generic "Not Interested"</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Reply Strategy</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("strategy", e.target.value)}>
                <option value="empathize">Empathize & Redirect</option>
                <option value="challenge">Respectfully Challenge</option>
                <option value="social_proof">Social Proof / Case Study</option>
                <option value="breakup">Breakup / Walk Away</option>
              </select>
            </div>
          </div>
        );

      case "winback":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Days Since Last Contact</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("days_cold", e.target.value)}>
                <option value="30">~30 days</option>
                <option value="60">~60 days</option>
                <option value="90">90+ days</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Win-Back Angle</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("angle", e.target.value)}>
                <option value="new_feature">New Feature / Update</option>
                <option value="case_study">New Case Study / Result</option>
                <option value="9word">9-Word "Are you still…" Email</option>
                <option value="breakup">Final Breakup Message</option>
              </select>
            </div>
          </div>
        );

      case "inbound":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Lead Source</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("source", e.target.value)}>
                <option value="demo_form">Demo Request Form</option>
                <option value="content_download">Content Download / Lead Magnet</option>
                <option value="pricing_page">Pricing Page Visit</option>
                <option value="chatbot">Chatbot Conversation</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Response Speed</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("speed", e.target.value)}>
                <option value="instant">Instant (within 5 min)</option>
                <option value="same_day">Same Day</option>
                <option value="next_day">Next Business Day</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={LABEL_CLS}>Booking / Calendar Link</label>
              <input className={INPUT_CLS} placeholder="https://calendly.com/yourname" onChange={(e) => updateExtra("booking_link", e.target.value)} />
            </div>
          </div>
        );

      /* ---- GROWTH ---- */
      case "linkedin":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Message Type</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("msg_type", e.target.value)}>
                <option value="connection_note">Connection Request Note (300 chars)</option>
                <option value="inmail">InMail (full length)</option>
                <option value="follow_up">Follow-Up After Connection</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Shared Context / Trigger</label>
              <input className={INPUT_CLS} placeholder="Mutual connection, shared group, recent post…" onChange={(e) => updateExtra("trigger", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className={LABEL_CLS}>Their LinkedIn Headline (optional)</label>
              <input className={INPUT_CLS} placeholder="Paste their headline for hyper-personalization" onChange={(e) => updateExtra("headline", e.target.value)} />
            </div>
          </div>
        );

      case "twitter":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>DM Format</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("format", e.target.value)}>
                <option value="short_dm">Short DM (under 280 chars)</option>
                <option value="thread_dm">Multi-Part Thread DM</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Their Recent Tweet / Topic</label>
              <input className={INPUT_CLS} placeholder="Reference their tweet for a warm open" onChange={(e) => updateExtra("tweet_ref", e.target.value)} />
            </div>
          </div>
        );

      case "whatsapp":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Emoji Density</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("emojis", e.target.value)}>
                <option value="minimal">Minimal / Business</option>
                <option value="moderate">Moderate / Friendly</option>
                <option value="heavy">Heavy / Casual</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Sequence Steps</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("steps", e.target.value)}>
                <option value="1">Single Message</option>
                <option value="3">3-Message Drip (24hr gaps)</option>
                <option value="5">5-Message Nurture Sequence</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>WhatsApp Message Tone</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("wa_tone", e.target.value)}>
                <option value="professional">Professional Chat</option>
                <option value="warm_intro">Warm Introduction</option>
                <option value="follow_up">Gentle Follow-Up</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Include Voice Note Script?</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("voice_note", e.target.value)}>
                <option value="no">No — Text Only</option>
                <option value="yes">Yes — Include 30s Voice Script</option>
              </select>
            </div>
          </div>
        );

      case "vsl_script":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Video Duration</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("duration", e.target.value)}>
                <option value="30s">30 Seconds (Quick Hook)</option>
                <option value="60s">60 Seconds (Full Pitch)</option>
                <option value="2m">2 Minutes (Deep Dive)</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Video Type</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("video_type", e.target.value)}>
                <option value="loom_screenshare">Loom Screen-Share Walkthrough</option>
                <option value="talking_head">Talking Head / Webcam</option>
                <option value="slide_narration">Slide Deck Narration</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={LABEL_CLS}>Target URL to Show on Screen</label>
              <input className={INPUT_CLS} placeholder="https://yourproduct.com/demo" onChange={(e) => updateExtra("target_url", e.target.value)} />
            </div>
          </div>
        );

      case "proposal":
        return (
          <div className="space-y-4">
            <div>
              <label className={LABEL_CLS}>Paste Client Job Description</label>
              <textarea className={TEXTAREA_CLS} placeholder="Copy & paste the full Upwork/Fiverr job post here so the AI can tailor your proposal directly to their requirements..." onChange={(e) => updateExtra("job_post", e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Your Rate</label>
                <input className={INPUT_CLS} placeholder="$50/hr or $500 fixed" onChange={(e) => updateExtra("rate", e.target.value)} />
              </div>
              <div>
                <label className={LABEL_CLS}>Delivery Timeline</label>
                <input className={INPUT_CLS} placeholder="e.g. 5 business days" onChange={(e) => updateExtra("timeline", e.target.value)} />
              </div>
              <div>
                <label className={LABEL_CLS}>Portfolio Link</label>
                <input className={INPUT_CLS} placeholder="https://yourportfolio.com" onChange={(e) => updateExtra("portfolio", e.target.value)} />
              </div>
            </div>
          </div>
        );

      case "telegram":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Community Context</label>
              <input className={INPUT_CLS} placeholder="Telegram group name or topic" onChange={(e) => updateExtra("group_context", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Outreach Angle</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("angle", e.target.value)}>
                <option value="collaboration">Partnership / Collaboration</option>
                <option value="beta_invite">Beta / Early Access Invite</option>
                <option value="hiring">Hiring / Freelance Gig</option>
                <option value="product_launch">Product Launch Announcement</option>
              </select>
            </div>
          </div>
        );

      case "instagram":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>DM Trigger</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("trigger", e.target.value)}>
                <option value="story_reply">Story Reply</option>
                <option value="post_comment">Post / Reel Comment Follow-Up</option>
                <option value="cold_dm">Cold DM</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Outreach Purpose</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("purpose", e.target.value)}>
                <option value="collab">Brand Collaboration</option>
                <option value="ugc">UGC / Content Creation</option>
                <option value="affiliate">Affiliate Partnership</option>
                <option value="service">Service Pitch</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={LABEL_CLS}>Their Profile Niche</label>
              <input className={INPUT_CLS} placeholder="e.g. Fitness influencer, 50K followers, posts workout reels" onChange={(e) => updateExtra("niche", e.target.value)} />
            </div>
          </div>
        );

      case "sequence":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Sequence Length</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("seq_length", e.target.value)}>
                <option value="3">3-Step (Classic Cold Sequence)</option>
                <option value="5">5-Step (Extended Nurture)</option>
                <option value="7">7-Step (Enterprise Cadence)</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Delay Between Steps</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("delay", e.target.value)}>
                <option value="2days">2 Days</option>
                <option value="3days">3 Days</option>
                <option value="5days">5 Days</option>
                <option value="7days">7 Days</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Sequence Strategy</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("seq_strategy", e.target.value)}>
                <option value="value_first">Value-First (Give before Ask)</option>
                <option value="direct">Direct Pitch Escalation</option>
                <option value="curiosity">Curiosity Gap / Mystery</option>
                <option value="social_proof">Social Proof Cascade</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Final Step Type</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("final_step", e.target.value)}>
                <option value="breakup">Breakup Email</option>
                <option value="hail_mary">Hail Mary Offer</option>
                <option value="referral_ask">Referral Redirect</option>
              </select>
            </div>
          </div>
        );

      case "slack_dm":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Workspace / Community Name</label>
              <input className={INPUT_CLS} placeholder="e.g. Exit Five, Demand Curve, RevGenius" onChange={(e) => updateExtra("workspace", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Shared Channel / Topic</label>
              <input className={INPUT_CLS} placeholder="e.g. #cold-email, #saas-growth" onChange={(e) => updateExtra("channel", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className={LABEL_CLS}>Approach Style</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("approach", e.target.value)}>
                <option value="help_offer">Offer Genuine Help First</option>
                <option value="resource_share">Share a Free Resource</option>
                <option value="question">Ask a Thoughtful Question</option>
                <option value="intro">Warm Self-Introduction</option>
              </select>
            </div>
          </div>
        );

      case "discord":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Server Name</label>
              <input className={INPUT_CLS} placeholder="e.g. Buildspace, Indie Hackers" onChange={(e) => updateExtra("server", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Their Role / Context</label>
              <input className={INPUT_CLS} placeholder="e.g. Moderator, Active in #launches" onChange={(e) => updateExtra("role", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className={LABEL_CLS}>Outreach Angle</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("angle", e.target.value)}>
                <option value="feedback">Ask for Feedback on Your Project</option>
                <option value="collab">Propose Collaboration</option>
                <option value="beta">Invite to Beta Test</option>
                <option value="hiring">Freelance / Hiring Inquiry</option>
              </select>
            </div>
          </div>
        );

      /* ---- ENTERPRISE ---- */
      case "cold_call":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Gatekeeper Bypass Tactic</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("gatekeeper", e.target.value)}>
                <option value="assertive">Assertive / Peer-to-Peer</option>
                <option value="curious">Curious / Seeking Help</option>
                <option value="referral">Name-Drop Internal Referral</option>
                <option value="callback">Pretend Callback / Return Call</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Call Objective</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("objective", e.target.value)}>
                <option value="book_meeting">Book a Meeting</option>
                <option value="qualify">Qualify the Lead</option>
                <option value="direct_sale">Direct Sale / Close</option>
                <option value="referral">Get Referral to Decision Maker</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Script Structure</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("structure", e.target.value)}>
                <option value="pattern_interrupt">Pattern Interrupt Opening</option>
                <option value="permission_based">Permission-Based Opener</option>
                <option value="problem_led">Problem-Led / Insight Opener</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Include Objection Responses?</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("include_objections", e.target.value)}>
                <option value="yes">Yes — Top 3 Objection Rebuttals</option>
                <option value="no">No — Script Only</option>
              </select>
            </div>
          </div>
        );

      case "sms_sequence":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>SMS Steps</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("sms_steps", e.target.value)}>
                <option value="1">Single SMS</option>
                <option value="3">3-SMS Drip</option>
                <option value="5">5-SMS Sequence</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Character Limit per SMS</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("char_limit", e.target.value)}>
                <option value="160">160 chars (single segment)</option>
                <option value="320">320 chars (2 segments)</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Quick Link / Short URL</label>
              <input className={INPUT_CLS} placeholder="https://bit.ly/your-link" onChange={(e) => updateExtra("sms_link", e.target.value)} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer bg-[#1c1c1e] border border-white/[0.06] rounded-2xl px-4 py-3.5 w-full">
                <input type="checkbox" defaultChecked className="accent-blue-500 w-4 h-4" onChange={(e) => updateExtra("opt_out", e.target.checked ? "yes" : "no")} />
                <span className="text-sm text-zinc-300">Include "Reply STOP" compliance</span>
              </label>
            </div>
          </div>
        );

      case "reddit_dm":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Target Subreddit</label>
              <input className={INPUT_CLS} placeholder="e.g. r/SaaS, r/Entrepreneur, r/sales" onChange={(e) => updateExtra("subreddit", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Their Post / Comment Context</label>
              <input className={INPUT_CLS} placeholder="What did they post about?" onChange={(e) => updateExtra("post_context", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className={LABEL_CLS}>Approach Style</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("approach", e.target.value)}>
                <option value="helpful">Genuinely Helpful (No Sales Language)</option>
                <option value="resource">Share Relevant Resource</option>
                <option value="ask_question">Ask a Thoughtful Question</option>
              </select>
            </div>
          </div>
        );

      case "threads_dm":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Thread / Conversation Hook</label>
              <input className={INPUT_CLS} placeholder="Reference their recent thread or topic" onChange={(e) => updateExtra("thread_hook", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Message Style</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("style", e.target.value)}>
                <option value="casual">Casual / Conversational</option>
                <option value="witty">Witty / Clever</option>
                <option value="direct">Direct / No-BS</option>
              </select>
            </div>
          </div>
        );

      case "direct_mail":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Physical Format</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("mail_format", e.target.value)}>
                <option value="executive_letter">Formal Executive Letter</option>
                <option value="handwritten_card">Handwritten Style Postcard</option>
                <option value="oversized_postcard">Oversized Postcard (6x9)</option>
                <option value="dimensional">Dimensional Mailer / FedEx Box</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Pattern Interrupt / Enclosed Gift</label>
              <input className={INPUT_CLS} placeholder="e.g. $5 Starbucks card, Mini-book, USB drive" onChange={(e) => updateExtra("gift", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Recipient Title</label>
              <input className={INPUT_CLS} placeholder="e.g. CEO, VP of Marketing" onChange={(e) => updateExtra("recipient_title", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Response Mechanism</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("response_mech", e.target.value)}>
                <option value="qr_code">QR Code to Landing Page</option>
                <option value="phone">Call a Phone Number</option>
                <option value="url">Visit Short URL</option>
                <option value="reply_mail">Reply by Mail (BRE Enclosed)</option>
              </select>
            </div>
          </div>
        );

      case "csv_bulk":
        return (
          <div className="space-y-4">
            <div>
              <label className={LABEL_CLS}>Define Your Personalization Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {["{{first_name}}", "{{company}}", "{{industry}}", "{{pain_point}}", "{{competitor}}", "{{city}}"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setPrompt((prev) => prev + " " + tag)}
                    className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-mono text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Number of Variations</label>
                <select className={SELECT_CLS} onChange={(e) => updateExtra("variations", e.target.value)}>
                  <option value="3">3 Variations</option>
                  <option value="5">5 Variations</option>
                  <option value="10">10 Variations</option>
                </select>
              </div>
              <div>
                <label className={LABEL_CLS}>Fallback When Tag is Empty</label>
                <input className={INPUT_CLS} placeholder="e.g. 'there' for empty {{first_name}}" onChange={(e) => updateExtra("fallback", e.target.value)} />
              </div>
            </div>
          </div>
        );

      case "tiktok":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Creator Niche</label>
              <input className={INPUT_CLS} placeholder="e.g. Beauty, Fitness, Tech Reviews" onChange={(e) => updateExtra("niche", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Pitch Type</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("pitch_type", e.target.value)}>
                <option value="ugc">UGC / Product Review</option>
                <option value="sponsored">Sponsored Post / Integration</option>
                <option value="affiliate">Affiliate Commission Deal</option>
                <option value="gifting">Product Gifting (No Payment)</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Compensation Offer</label>
              <input className={INPUT_CLS} placeholder="e.g. $200/video, 15% commission, Free product" onChange={(e) => updateExtra("compensation", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Their Follower Count Range</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("follower_range", e.target.value)}>
                <option value="nano">Nano (1K-10K)</option>
                <option value="micro">Micro (10K-100K)</option>
                <option value="mid">Mid (100K-500K)</option>
                <option value="macro">Macro (500K+)</option>
              </select>
            </div>
          </div>
        );

      case "podcast":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Podcast Name</label>
              <input className={INPUT_CLS} placeholder="e.g. My First Million, SaaStr" onChange={(e) => updateExtra("podcast_name", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Recent Episode You Liked</label>
              <input className={INPUT_CLS} placeholder="Reference a specific episode for credibility" onChange={(e) => updateExtra("episode_ref", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Pitch Type</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("pitch_type", e.target.value)}>
                <option value="guest">Guest Appearance Pitch</option>
                <option value="sponsor">Sponsorship / Ad Inquiry</option>
                <option value="cross_promo">Cross-Promotion Swap</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Your Unique Angle / Story</label>
              <input className={INPUT_CLS} placeholder="e.g. Built $1M ARR with $0 ad spend" onChange={(e) => updateExtra("unique_angle", e.target.value)} />
            </div>
          </div>
        );

      case "voicemail_drop":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Voicemail Length</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("vm_length", e.target.value)}>
                <option value="15s">15 Seconds (Ultra-Short)</option>
                <option value="30s">30 Seconds (Standard)</option>
                <option value="45s">45 Seconds (Detailed)</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Opening Hook Style</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("hook", e.target.value)}>
                <option value="name_company">Name + Company Direct</option>
                <option value="mystery">Mystery / Curiosity Gap</option>
                <option value="referral">Mutual Contact Referral</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={LABEL_CLS}>Callback Number</label>
              <input className={INPUT_CLS} placeholder="+1 (555) 123-4567" onChange={(e) => updateExtra("callback", e.target.value)} />
            </div>
          </div>
        );

      case "facebook_dm":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Context Source</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("context", e.target.value)}>
                <option value="group_member">Facebook Group Member</option>
                <option value="page_follower">Business Page Follower</option>
                <option value="marketplace">Marketplace Listing</option>
                <option value="cold">Cold Outreach</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Shared Group Name (if any)</label>
              <input className={INPUT_CLS} placeholder="e.g. Digital Marketing Pros" onChange={(e) => updateExtra("group_name", e.target.value)} />
            </div>
          </div>
        );

      case "signal_vip":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Warm Referral Name</label>
              <input className={INPUT_CLS} placeholder="Who referred you? (e.g. 'John from Sequoia')" onChange={(e) => updateExtra("referral", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Message Brevity</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("brevity", e.target.value)}>
                <option value="ultra_short">Ultra-Short (2-3 sentences)</option>
                <option value="brief">Brief Elevator Pitch</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={LABEL_CLS}>Meeting / Calendar Link</label>
              <input className={INPUT_CLS} placeholder="https://calendly.com/vip-meeting" onChange={(e) => updateExtra("meeting_link", e.target.value)} />
            </div>
          </div>
        );

      case "recruiter":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Job Role Title</label>
              <input className={INPUT_CLS} placeholder="e.g. Senior Full-Stack Engineer" onChange={(e) => updateExtra("role_title", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Compensation Hook</label>
              <input className={INPUT_CLS} placeholder="e.g. $180K-$220K + equity" onChange={(e) => updateExtra("comp", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Sourcing Channel</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("source_channel", e.target.value)}>
                <option value="linkedin">LinkedIn InMail</option>
                <option value="email">Direct Email</option>
                <option value="github">GitHub / OSS Contribution</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Confidentiality Level</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("confidential", e.target.value)}>
                <option value="open">Open Position (Public)</option>
                <option value="confidential">Confidential / Stealth</option>
              </select>
            </div>
          </div>
        );

      case "event_pitch":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Conference / Event Name</label>
              <input className={INPUT_CLS} placeholder="e.g. SaaStr Annual, Web Summit" onChange={(e) => updateExtra("event_name", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Meeting Location</label>
              <input className={INPUT_CLS} placeholder="e.g. Booth #42, Marriott Lobby, Dinner at…" onChange={(e) => updateExtra("location", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Proposed Time Window</label>
              <input className={INPUT_CLS} placeholder="e.g. Day 1 afternoon, Tuesday 2-4pm" onChange={(e) => updateExtra("time_window", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Meeting Purpose</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("purpose", e.target.value)}>
                <option value="partnership">Partnership Discussion</option>
                <option value="demo">Live Product Demo</option>
                <option value="networking">General Networking</option>
                <option value="investor">Investor Meeting</option>
              </select>
            </div>
          </div>
        );

      case "abm":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Target Account Name</label>
                <input className={INPUT_CLS} placeholder="e.g. Salesforce, HubSpot, Stripe" onChange={(e) => updateExtra("account_name", e.target.value)} />
              </div>
              <div>
                <label className={LABEL_CLS}>Decision Maker Title</label>
                <input className={INPUT_CLS} placeholder="e.g. CRO, VP of Revenue Operations" onChange={(e) => updateExtra("dm_title", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={LABEL_CLS}>Account Intelligence / Public Priority</label>
              <textarea className={TEXTAREA_CLS} placeholder="Paste insights from their 10-K filing, earnings call, press release, or LinkedIn company page (e.g. 'Expanding into APAC market, just raised Series D, hiring 200 engineers')..." onChange={(e) => updateExtra("intel", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>Briefing Format</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("format", e.target.value)}>
                <option value="executive_summary">1-Page Executive Summary</option>
                <option value="full_brief">Full Strategic Briefing</option>
                <option value="partnership_memo">Partnership Proposal Memo</option>
              </select>
            </div>
          </div>
        );

      case "wechat":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Business Relationship Level</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("relationship", e.target.value)}>
                <option value="cold">Cold Introduction</option>
                <option value="warm">Warm (Met at Event / Mutual Contact)</option>
                <option value="existing">Existing Relationship</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Formality / Courtesy Level</label>
              <select className={SELECT_CLS} onChange={(e) => updateExtra("formality", e.target.value)}>
                <option value="formal">Highly Formal (尊敬的)</option>
                <option value="professional">Professional Standard</option>
                <option value="casual">Casual / Modern</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Industry Context</label>
              <input className={INPUT_CLS} placeholder="e.g. Cross-border e-commerce, Manufacturing" onChange={(e) => updateExtra("industry", e.target.value)} />
            </div>
            <div>
              <label className={LABEL_CLS}>WeChat ID / QR Context</label>
              <input className={INPUT_CLS} placeholder="Your WeChat ID for them to add back" onChange={(e) => updateExtra("wechat_id", e.target.value)} />
            </div>
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
        {/* ---- HEADER ---- */}
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
          {/* tier labels */}
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
              {/* active mode badge */}
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
                {/* main prompt */}
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

                {/* dynamic fields */}
                {renderDynamicFields()}

                {/* universal controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className={LABEL_CLS}>Output Language</label>
                    <select className={SELECT_CLS} value={language} onChange={(e) => setLanguage(e.target.value)}>
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Portuguese</option>
                      <option>Italian</option>
                      <option>Dutch</option>
                      <option>Hindi</option>
                      <option>Japanese</option>
                      <option>Chinese (Simplified)</option>
                      <option>Arabic</option>
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>ICP Persona</label>
                    <select className={SELECT_CLS} value={persona} onChange={(e) => setPersona(e.target.value)}>
                      <option>Default / General</option>
                      <option>SaaS Founder / CEO</option>
                      <option>VP of Sales / CRO</option>
                      <option>Marketing Director / CMO</option>
                      <option>E-commerce Store Owner</option>
                      <option>Agency Owner</option>
                      <option>HR / People Ops Leader</option>
                      <option>Developer / CTO</option>
                      <option>Real Estate Agent</option>
                      <option>Financial Advisor</option>
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Tone of Voice</label>
                    <select className={SELECT_CLS} value={tone} onChange={(e) => setTone(e.target.value)}>
                      <option>Professional & Direct</option>
                      <option>Casual & Friendly</option>
                      <option>Urgent & Scarcity-Focused</option>
                      <option>Witty & Creative</option>
                      <option>Executive / C-Suite</option>
                      <option>Empathetic & Consultative</option>
                    </select>
                  </div>
                </div>

                {/* sender name */}
                <div>
                  <label className={LABEL_CLS}>Your Name / Sender Title</label>
                  <input
                    className={INPUT_CLS}
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Alex Chen, Growth Lead at Acme"
                  />
                </div>

                {/* submit */}
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
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                      AI Result — {activeModeObj.label}
                    </span>
                  </div>
                  <button
                    onClick={copyResult}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-[0.12em] transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="whitespace-pre-wrap text-[15px] text-zinc-200 leading-[1.8] font-medium">{result}</div>

                {/* affiliate card */}
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
                  <a
                    href="https://instantly.ai/?via=writeyouremail"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-xs font-bold transition-all"
                  >
                    Try Instantly →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ---- RIGHT: SIDEBAR ---- */}
          <div className="lg:col-span-5 space-y-6">
            {/* history */}
            <div className="bg-[#141415] border border-white/[0.04] rounded-[28px] p-6">
              <div className="flex items-center gap-2 mb-5">
                <History className="w-4 h-4 text-zinc-500" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">Recent Generations</h3>
              </div>
              <div className="space-y-2.5 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {history.length > 0 ? (
                  history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setResult(item.content)}
                      className="w-full text-left p-4 rounded-2xl bg-[#1c1c1e] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                          {item.mode || "email"}
                        </span>
                        <span className="text-[10px] text-zinc-600">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[13px] text-zinc-500 line-clamp-2 leading-relaxed group-hover:text-zinc-300 transition-colors">
                        {item.prompt}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <Layers className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
                    <p className="text-zinc-600 text-sm">No history yet. Generate your first message above.</p>
                  </div>
                )}
              </div>
            </div>

            {/* upgrade CTA card */}
            {(usage?.plan_tier === "free" || !usage) && (
              <div className="bg-gradient-to-br from-blue-600/90 to-indigo-700/90 rounded-[28px] p-6 text-white shadow-xl shadow-blue-500/10 border border-blue-500/20">
                <Sparkles className="w-8 h-8 mb-4 opacity-60" />
                <h3 className="text-xl font-bold mb-2">Unlock All 30 Channels</h3>
                <p className="text-blue-100/80 text-sm mb-6 leading-relaxed">
                  Upgrade to Growth for WhatsApp, LinkedIn, Instagram, Loom scripts, sequences & more. Enterprise unlocks cold call scripts, SMS, direct mail, ABM, and CSV bulk.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => { setTargetTier("growth"); setShowUpgrade(true); }}
                    className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl shadow-lg hover:bg-blue-50 transition-colors"
                  >
                    Growth — $39/mo
                  </button>
                  <button
                    onClick={() => { setTargetTier("enterprise"); setShowUpgrade(true); }}
                    className="w-full bg-white/10 text-white font-bold py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    Enterprise — $79/mo
                  </button>
                </div>
              </div>
            )}

            {/* channel count badge */}
            <div className="bg-[#141415] border border-white/[0.04] rounded-[28px] p-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 mb-4">Channel Coverage</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/[0.04]">
                  <p className="text-2xl font-bold text-blue-500">5</p>
                  <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-1">Starter</p>
                </div>
                <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/[0.04]">
                  <p className="text-2xl font-bold text-purple-400">10</p>
                  <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-1">Growth</p>
                </div>
                <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/[0.04]">
                  <p className="text-2xl font-bold text-orange-400">15</p>
                  <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-1">Enterprise</p>
                </div>
              </div>
              <p className="text-center text-[11px] text-zinc-600 mt-3 font-medium">30 total omni-channel modes</p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  FAQ SECTION                                                  */}
        {/* ============================================================ */}
        <section className="mt-24 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-[36px] font-extrabold tracking-tight mb-3">Frequently Asked Questions</h2>
            <p className="text-zinc-500 text-[16px] font-medium">Everything you need to know about WriteYourEmail.com</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-[#141415] border border-white/[0.04] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left group"
                >
                  <span className="text-[15px] font-semibold text-white pr-4 group-hover:text-blue-400 transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-500 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180 text-blue-500" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                    <p className="text-[14px] text-zinc-400 leading-[1.8]">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ---- FOOTER ---- */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-zinc-600 font-medium">
            © {new Date().getFullYear()} WriteYourEmail.com — AI-Powered Omni-Channel Sales Copywriting
          </p>
          <div className="flex items-center gap-6">
            <Link href="/profile" className="text-[12px] text-zinc-500 hover:text-white transition-colors font-medium">Account</Link>
            <a href="mailto:hello@writeyouremail.com" className="text-[12px] text-zinc-500 hover:text-white transition-colors font-medium">Contact</a>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/*  UPGRADE MODAL                                                */}
      {/* ============================================================ */}
      {showUpgrade && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/70 animate-in fade-in duration-300">
          <div className="bg-[#141415] border border-white/[0.08] w-full max-w-md rounded-[32px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowUpgrade(false)}
              className="absolute top-5 right-5 p-1 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500/10 rounded-[20px] flex items-center justify-center mx-auto mb-5 border border-blue-500/20">
                <Sparkles className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Upgrade to {targetTier.charAt(0).toUpperCase() + targetTier.slice(1)}
              </h2>
              <p className="text-zinc-500 text-sm">
                {targetTier === "starter"
                  ? "50 generations/month + core email modes."
                  : targetTier === "growth"
                  ? "Unlimited generations + all social & messaging channels."
                  : "All 30 channels including offline, voice, and bulk modes."}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {(targetTier === "starter"
                ? [
                    "50 generations per month",
                    "Cold Email, Polish, Objection, Win-Back, Inbound",
                    "All languages & tones",
                    "Generation history",
                  ]
                : targetTier === "growth"
                ? [
                    "Unlimited generations",
                    "All Starter modes included",
                    "LinkedIn, Twitter/X, WhatsApp, Instagram",
                    "Loom VSL scripts, Upwork proposals",
                    "Telegram, Discord, Slack DMs",
                    "3-Step / 5-Step / 7-Step Sequences",
                  ]
                : [
                    "Unlimited generations",
                    "All 30 omni-channel modes",
                    "Cold call scripts with objection rebuttals",
                    "SMS sequences with compliance",
                    "Direct mail & dimensional mailers",
                    "CSV bulk personalization tag mapper",
                    "Reddit, Threads, TikTok, Podcast pitches",
                    "ABM executive briefings",
                    "Signal/VIP, WeChat, Voicemail drops",
                    "Conference meeting pitches",
                    "Recruiter talent sourcing",
                  ]
              ).map((feature, i) => (
                <div key={i} className="flex items-start gap-3 text-[13px] text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#1c1c1e] rounded-2xl p-4 mb-6 text-center border border-white/[0.04]">
              <p className="text-3xl font-bold text-white">
                ${targetTier === "starter" ? "19" : targetTier === "growth" ? "39" : "79"}
                <span className="text-sm font-medium text-zinc-500"> / month</span>
              </p>
              <p className="text-[11px] text-zinc-600 mt-1">30-day prepaid access · No auto-renewal</p>
            </div>

            {user ? (
              <PayPalScriptProvider
                options={{
                  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                  currency: "USD",
                  intent: "capture",
                }}
              >
                <PayPalButtons
  style={{ layout: "vertical", shape: "pill", label: "pay", height: 48 }}
  createOrder={(data: any, actions: any) => {
    const price = targetTier === "starter" ? "19.00" : targetTier === "growth" ? "39.00" : "79.00";
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: price, currency_code: "USD" },
          description: `WriteYourEmail.com ${targetTier} — 30 day access`,
          custom_id: user?.id,
        },
      ],
    });
  }}
  onApprove={async (data: any, actions: any) => {
    // Check if order exists to satisfy TypeScript
    if (!actions.order) return Promise.reject("No order found");
    
    const capture = await actions.order.capture();
    
    if (capture?.status === "COMPLETED") {
      await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: data.orderID,
          user_id: user?.id,
          tier: targetTier,
        }),
      });
      setShowUpgrade(false);
      bootstrap(); // Refreshes user usage state
      alert(`🎉 Welcome to ${targetTier.toUpperCase()}! Your access is now active.`);
    }
  }}
/>
                
              </PayPalScriptProvider>
            ) : (
              <Link
                href="/auth"
                className="w-full block text-center bg-[#0a84ff] hover:bg-[#0070e0] text-white font-bold py-4 rounded-2xl transition-colors"
              >
                Sign In to Upgrade
              </Link>
            )}

            <p className="text-[10px] text-zinc-600 text-center mt-5 uppercase tracking-[0.12em] font-bold">
              🔒 Secure Encrypted Payment via PayPal
            </p>
          </div>
        </div>
      )}
    </div>
  );
}