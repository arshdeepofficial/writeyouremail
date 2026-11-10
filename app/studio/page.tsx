"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const COMMON_SPAM_WORDS = [
  "100% free", "free", "guaranteed", "no cost", "risk-free", "act now",
  "click here", "urgent", "make money", "winner", "cash", "no obligation",
  "special promotion", "congratulations", "credit card", "order now", "$$$"
];

interface SubjectLine {
  subject: string;
  spamRisk: string;
  score: number;
  openRateForecast?: string;
}

interface EmailVariation {
  id: string;
  title: string;
  readingTime: string;
  body: string;
}

interface SavedEmailRecord {
  id: string;
  created_at: string;
  email_type: string;
  subject_line: string;
  body: string;
  language: string;
}

interface PromptPreset {
  id: string;
  name: string;
  context: string;
  emailType: string;
  tone: string;
  icpPersona: string;
}

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Dutch", "Japanese", "Chinese (Simplified)", "Hindi", "Arabic",
  "Korean", "Russian", "Turkish", "Vietnamese", "Polish"
];

const ICP_PERSONAS = [
  "Default / General",
  "CEO / Founder (Focus on Vision & Growth)",
  "CFO / Finance (Focus on ROI & Cost Savings)",
  "CTO / Engineering (Focus on Tech & Efficiency)",
  "HR / Ops (Focus on Team & Culture)",
  "Marketing / Sales (Focus on Leads & Revenue)",
  "Investors / VCs (Focus on Traction & Multiples)",
  "Small Business Owner (Focus on Survival & Ease)",
  "Enterprise Procurement (Focus on Compliance & Scale)",
  "Creator / Influencer (Focus on Brand & Monetization)"
];

type StudioMode = 
  | "create" 
  | "polish" 
  | "reply" 
  | "linkedin" 
  | "twitter" 
  | "whatsapp"
  | "vsl_script"
  | "proposal"
  | "telegram"
  | "sequence" 
  | "ab_test"
  | "cold_call"
  | "classifier" 
  | "batch" 
  | "csv_bulk"
  | "reddit_dm"
  | "threads_dm"
  | "direct_mail"
  | "sms_sequence";

const STARTER_MODES: StudioMode[] = ["create", "polish", "reply"];
const GROWTH_MODES: StudioMode[] = [
  ...STARTER_MODES, 
  "sequence", "ab_test", "linkedin", "twitter", 
  "whatsapp", "vsl_script", "proposal", "telegram"
];
const ENTERPRISE_MODES: StudioMode[] = [
  ...GROWTH_MODES, 
  "cold_call", "classifier", "batch", "csv_bulk", 
  "reddit_dm", "threads_dm", "direct_mail", "sms_sequence"
];

export default function StudioPage() {
  const [studioMode, setStudioMode] = useState<StudioMode>("create");

  // Common Form State
  const [emailType, setEmailType] = useState("cold_outreach");
  const [context, setContext] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [tone, setTone] = useState("professional");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [icpPersona, setIcpPersona] = useState(ICP_PERSONAS[0]);

  // Dynamic Channel Specific Inputs
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [whatsappEmoji, setWhatsappEmoji] = useState("Moderate");
  
  const [vslDuration, setVslDuration] = useState("60-Second Loom");
  const [vslScreenUrl, setVslScreenUrl] = useState("");
  
  const [upworkBudget, setUpworkBudget] = useState("Fixed $500 - $1,000");
  const [upworkJobPost, setUpworkJobPost] = useState("");
  const [upworkProof, setUpworkProof] = useState("");

  const [telegramHandle, setTelegramHandle] = useState("");
  const [telegramNiche, setTelegramNiche] = useState("AI & DevTools");

  const [redditSubreddit, setRedditSubreddit] = useState("r/marketing");
  const [redditPostText, setRedditPostText] = useState("");

  const [directMailFormat, setDirectMailFormat] = useState("Executive Letter");
  const [directMailGift, setDirectMailGift] = useState("$10 Starbucks Gift Card");

  const [smsPhone, setSmsPhone] = useState("");
  const [smsOptOut, setSmsOptOut] = useState(true);

  const [callGatekeeper, setCallGatekeeper] = useState("Executive Assistant Bypass");

  const [csvData, setCsvData] = useState("");
  const [draftText, setDraftText] = useState("");
  const [polishGoal, setPolishGoal] = useState("Fix grammar, typos & improve flow");
  const [replyStrategy, setReplyStrategy] = useState("Value & ROI Reframing (Turn price into value)");
  const [incomingEmailText, setIncomingEmailText] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [senderTitle, setSenderTitle] = useState("");

  // Generation Output
  const [subjectLines, setSubjectLines] = useState<SubjectLine[]>([]);
  const [variations, setVariations] = useState<EmailVariation[]>([]);
  const [analytics, setAnalytics] = useState<{ readingLevel: string; sentiment: string } | null>(null);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // App & User State
  const [user, setUser] = useState<any>(null);
  const [dailyUsage, setDailyUsage] = useState<number>(0);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [planTier, setPlanTier] = useState<string>("free");
  const [guestUsage, setGuestUsage] = useState<number>(0);

  const [savedHistory, setSavedHistory] = useState<SavedEmailRecord[]>([]);
  const [presets, setPresets] = useState<PromptPreset[]>([]);

  // Modals
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [proReason, setProReason] = useState("");
  const [proTargetTier, setProTargetTier] = useState<"growth" | "enterprise">("growth");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const [copiedBody, setCopiedBody] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const fetchUserUsage = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("usage_tracking")
        .select("count, is_pro, last_reset, plan_tier, subscription_ends_at")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        const now = new Date();
        const expiry = data.subscription_ends_at ? new Date(data.subscription_ends_at) : null;

        if (expiry && now > expiry) {
          setIsPro(false);
          setDailyUsage(data.count || 0);
          setPlanTier("free");
        } else {
          setIsPro(data.is_pro || false);
          setDailyUsage(data.count || 0);
          setPlanTier(data.plan_tier || "free");
        }
      } else if (error) {
        await supabase.from("usage_tracking").insert([{
          user_id: userId,
          count: 0,
          is_pro: false,
          plan_tier: "free",
        }]);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserUsage(session.user.id);
        fetchUserHistory(session.user.id);
      } else {
        const storedGuestUsage = localStorage.getItem("guest_usage");
        setGuestUsage(storedGuestUsage ? parseInt(storedGuestUsage, 10) : 0);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserUsage(session.user.id);
        fetchUserHistory(session.user.id);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const triggerProModal = (reason: string, targetTier: "growth" | "enterprise" = "growth") => {
    setProReason(reason);
    setProTargetTier(targetTier);
    setProModalOpen(true);
  };

  const fetchUserHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("emails").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (!error && data) {
        setSavedHistory(data.map((item: any) => ({
          id: item.id,
          created_at: item.created_at,
          email_type: item.email_type,
          subject_line: item.recipient || "Generated Content",
          body: item.generated_email,
          language: item.tone || "English",
        })));
      }
    } catch (e) { console.error(e); }
  };

  const checkModeAccess = (targetMode: StudioMode): boolean => {
    if (!isPro) {
      if (!STARTER_MODES.includes(targetMode)) {
        triggerProModal("This mode requires an active Pro Plan. Upgrade to Growth or Enterprise to unlock omni-channel generators.", "growth");
        return false;
      }
      return true;
    }

    if (planTier === "starter") {
      if (!STARTER_MODES.includes(targetMode)) {
        triggerProModal("Your Starter Plan ($19) includes Standard Emails, Polish, and Objection Replies. Upgrade to Growth ($39) for WhatsApp, Loom Scripts, Proposals, LinkedIn, and Sequences.", "growth");
        return false;
      }
      return true;
    }

    if (planTier === "growth") {
      if (!GROWTH_MODES.includes(targetMode)) {
        triggerProModal("Your Growth Plan ($39) includes WhatsApp, Loom Scripts, and Sequences. Upgrade to Enterprise ($79) for Direct Mail, SMS Sequences, Reddit Outreach, Threads, and Bulk CSV.", "enterprise");
        return false;
      }
      return true;
    }

    return true;
  };

  const handleSelectMode = (newMode: StudioMode) => {
    if (checkModeAccess(newMode)) {
      setStudioMode(newMode);
    }
  };

  const incrementUsageAfterSuccess = async () => {
    if (isPro && (planTier === "growth" || planTier === "enterprise")) return;

    if (!user) {
      const nextGuestCount = guestUsage + 1;
      setGuestUsage(nextGuestCount);
      localStorage.setItem("guest_usage", nextGuestCount.toString());
      return;
    }

    const nextUsage = dailyUsage + 1;
    setDailyUsage(nextUsage);
    try {
      await supabase.from("usage_tracking").upsert({
        user_id: user.id,
        count: nextUsage,
        last_reset: new Date().toISOString().split("T")[0],
        is_pro: isPro,
        plan_tier: planTier,
      });
    } catch (err) { console.error(err); }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!checkModeAccess(studioMode)) return;

    if (!user && guestUsage >= 2) {
      setAuthModalOpen(true);
      return;
    }
    if (user && !isPro && dailyUsage >= 5) {
      triggerProModal("You have reached your 5 daily free generations! Upgrade to Pro for unlimited access.", "growth");
      return;
    }

    setLoading(true);

    // Compile dynamic channel context
    let combinedContext = context;
    if (studioMode === "whatsapp") combinedContext = `Phone: ${whatsappPhone}. Emoji Style: ${whatsappEmoji}. Pitch: ${context}`;
    if (studioMode === "vsl_script") combinedContext = `Video Duration: ${vslDuration}. Target Screen URL: ${vslScreenUrl}. Video Goal: ${context}`;
    if (studioMode === "proposal") combinedContext = `Client Job Post: ${upworkJobPost}. Budget: ${upworkBudget}. Proof Link: ${upworkProof}. Pitch: ${context}`;
    if (studioMode === "telegram") combinedContext = `Telegram Handle: ${telegramHandle}. Tech Vertical: ${telegramNiche}. Pitch: ${context}`;
    if (studioMode === "reddit_dm") combinedContext = `Target Subreddit: ${redditSubreddit}. Post Context: ${redditPostText}. Offer: ${context}`;
    if (studioMode === "direct_mail") combinedContext = `Format: ${directMailFormat}. Enclosed Gift/Teaser: ${directMailGift}. Pitch Context: ${context}`;
    if (studioMode === "sms_sequence") combinedContext = `Target Phone: ${smsPhone}. Include Opt-Out: ${smsOptOut}. Message Goal: ${context}`;
    if (studioMode === "cold_call") combinedContext = `Gatekeeper Tactic: ${callGatekeeper}. Call Hook: ${context}`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: studioMode,
          emailType,
          context: combinedContext,
          recipient,
          sender,
          tone,
          targetLanguage,
          draftText,
          polishGoal,
          replyStrategy,
          incomingEmailText,
          csvData,
          brandVoice,
          senderTitle,
          icpPersona,
        }),
      });
      const data = await response.json();
      if (response.ok && data.variations) {
        setSubjectLines(data.subjectLines || []);
        setVariations(data.variations || []);
        setAnalytics(data.analytics || null);
        setSelectedTab(0);
        await incrementUsageAfterSuccess();
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const copyBody = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage("");
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
        if (error) throw error;
        setAuthMessage("Account created! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
        if (error) throw error;
        setAuthModalOpen(false);
      }
    } catch (err: any) { setAuthMessage(err.message); }
  };

  const modeBadge = () => {
    if (studioMode === "whatsapp") return { label: "WHATSAPP SEQUENCE", color: "from-emerald-500/20 to-green-500/20 border-emerald-500/40 text-emerald-400" };
    if (studioMode === "vsl_script") return { label: "LOOM / VSL SCRIPTWRITER", color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-indigo-400" };
    if (studioMode === "proposal") return { label: "UPWORK & FIVERR PROPOSAL", color: "from-green-500/20 to-teal-500/20 border-green-500/40 text-green-400" };
    if (studioMode === "direct_mail") return { label: "EXECUTIVE DIRECT MAIL", color: "from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-400" };
    if (studioMode === "sms_sequence") return { label: "SMS TEXT SEQUENCE", color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-400" };
    if (studioMode === "reddit_dm") return { label: "REDDIT COMMUNITY OUTREACH", color: "from-orange-500/20 to-red-500/20 border-orange-500/40 text-orange-400" };
    if (studioMode === "cold_call") return { label: "COLD CALL SCRIPTWRITER", color: "from-rose-500/20 to-pink-500/20 border-rose-500/40 text-rose-400" };
    if (studioMode === "csv_bulk") return { label: "CSV BULK PERSONALIZER", color: "from-teal-500/20 to-emerald-500/20 border-teal-500/40 text-teal-400" };
    return { label: studioMode.replace("_", " ").toUpperCase(), color: "from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-400" };
  };

  const activeBadge = modeBadge();

  return (
    <div className="relative w-full overflow-x-hidden min-h-screen bg-[#0a0a0a] text-[#f5f5f7] font-sans">
      {/* Ambient Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-b from-[#0a84ff]/15 via-[#0a84ff]/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 font-semibold tracking-tight text-lg">
            <span className="w-6 h-6 bg-gradient-to-br from-[#f5f5f7] to-[#a1a1a6] text-black flex items-center justify-center font-bold text-sm rounded-md shadow-sm">
              ✉️
            </span>
            <span>WriteYourEmail Titan</span>
          </Link>

          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 text-white border border-white/10">
              {!user ? `${guestUsage}/2 Guest` : planTier === "enterprise" ? "Enterprise ∞" : planTier === "growth" ? "Growth ∞" : `${dailyUsage}/5 Free`}
            </span>

            {user ? (
              <Link href="/profile" className="text-sm font-medium hover:text-[#0a84ff] transition flex items-center gap-1.5">
                <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[10px]">👤</span>
                {user.email.split('@')[0]}
              </Link>
            ) : (
              <button onClick={() => { setIsSignUp(false); setAuthModalOpen(true); }} className="text-sm font-medium bg-[#f5f5f7] text-black px-4 py-1.5 rounded-full">
                Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <section className="py-12 px-4 sm:px-6 max-w-[1100px] mx-auto">
        <div className="bg-[#141415]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Header Title & Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-white/5">
            <div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full bg-gradient-to-r ${activeBadge.color} border tracking-widest uppercase inline-block mb-2 shadow-sm`}>
                ⚡ {activeBadge.label}
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {studioMode === "whatsapp" && "WhatsApp Business Sequence Studio"}
                {studioMode === "vsl_script" && "Loom & VSL Video Script Engine"}
                {studioMode === "proposal" && "Upwork & Fiverr Proposal Generator"}
                {studioMode === "direct_mail" && "Executive Direct Mail & Lumpy Mail"}
                {studioMode === "sms_sequence" && "SMS Text Outreach Engine"}
                {studioMode === "reddit_dm" && "Reddit Value-First DM Creator"}
                {studioMode === "csv_bulk" && "Bulk CSV Personalization Matrix"}
                {studioMode === "cold_call" && "Cold Call Script & Objection Engine"}
                {!["whatsapp", "vsl_script", "proposal", "direct_mail", "sms_sequence", "reddit_dm", "csv_bulk", "cold_call"].includes(studioMode) && "Omni-Channel Sales Generator"}
              </h2>
            </div>
          </div>

          {/* 19-Mode Selector Dock */}
          <div className="flex items-center gap-2 bg-[#1c1c1e] p-2 rounded-2xl w-full mb-8 overflow-x-auto whitespace-nowrap border border-white/5 shadow-inner [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button type="button" onClick={() => handleSelectMode("create")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "create" ? "bg-[#0a84ff] text-white" : "text-[#86868b] hover:text-white"}`}>✉️ Email</button>
            <button type="button" onClick={() => handleSelectMode("polish")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "polish" ? "bg-[#0a84ff] text-white" : "text-[#86868b] hover:text-white"}`}>✨ Polish</button>
            <button type="button" onClick={() => handleSelectMode("reply")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "reply" ? "bg-[#0a84ff] text-white" : "text-[#86868b] hover:text-white"}`}>🥊 Objection</button>

            <div className="w-[1px] h-5 bg-white/10 mx-1 shrink-0" />

            {/* Growth Modes */}
            <button type="button" onClick={() => handleSelectMode("whatsapp")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "whatsapp" ? "bg-emerald-600 text-white" : "text-[#86868b] hover:text-white"}`}>💬 WhatsApp</button>
            <button type="button" onClick={() => handleSelectMode("vsl_script")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "vsl_script" ? "bg-indigo-600 text-white" : "text-[#86868b] hover:text-white"}`}>🎥 Loom VSL</button>
            <button type="button" onClick={() => handleSelectMode("proposal")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "proposal" ? "bg-green-600 text-white" : "text-[#86868b] hover:text-white"}`}>📄 Upwork Proposal</button>
            <button type="button" onClick={() => handleSelectMode("telegram")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "telegram" ? "bg-sky-500 text-white" : "text-[#86868b] hover:text-white"}`}>✈️ Telegram</button>
            <button type="button" onClick={() => handleSelectMode("sequence")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "sequence" ? "bg-purple-600 text-white" : "text-[#86868b] hover:text-white"}`}>🔁 Sequence</button>

            <div className="w-[1px] h-5 bg-white/10 mx-1 shrink-0" />

            {/* Enterprise Modes */}
            <button type="button" onClick={() => handleSelectMode("direct_mail")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "direct_mail" ? "bg-amber-600 text-white" : "text-[#86868b] hover:text-white"}`}>📮 Direct Mail</button>
            <button type="button" onClick={() => handleSelectMode("sms_sequence")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "sms_sequence" ? "bg-cyan-600 text-white" : "text-[#86868b] hover:text-white"}`}>📱 SMS</button>
            <button type="button" onClick={() => handleSelectMode("reddit_dm")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "reddit_dm" ? "bg-orange-600 text-white" : "text-[#86868b] hover:text-white"}`}>🤖 Reddit</button>
            <button type="button" onClick={() => handleSelectMode("cold_call")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "cold_call" ? "bg-rose-600 text-white" : "text-[#86868b] hover:text-white"}`}>📞 Cold Call</button>
            <button type="button" onClick={() => handleSelectMode("csv_bulk")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "csv_bulk" ? "bg-teal-600 text-white" : "text-[#86868b] hover:text-white"}`}>📊 CSV Bulk</button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">

            {/* 1. WHATSAPP SPECIFIC DYNAMIC FORM */}
            {studioMode === "whatsapp" && (
              <div className="bg-[#1c1c1e]/60 p-5 rounded-2xl border border-emerald-500/20 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Target WhatsApp Number / Name</label>
                    <input type="text" placeholder="+1 (555) 019-2834 or John Doe" value={whatsappPhone} onChange={(e) => setWhatsappPhone(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Emoji & Conversational Tone</label>
                    <select value={whatsappEmoji} onChange={(e) => setWhatsappEmoji(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm outline-none">
                      <option value="Moderate">Moderate (Professional & Clean)</option>
                      <option value="High Energy">High Energy (Sales & E-commerce)</option>
                      <option value="Minimal">Minimal (Strict Executive)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 2. LOOM / VSL SPECIFIC DYNAMIC FORM */}
            {studioMode === "vsl_script" && (
              <div className="bg-[#1c1c1e]/60 p-5 rounded-2xl border border-indigo-500/20 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Target Video Duration</label>
                    <select value={vslDuration} onChange={(e) => setVslDuration(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm outline-none">
                      <option value="60-Second Loom">60-Second Quick Loom (Recommended)</option>
                      <option value="2-Minute VSL">2-Minute Deep-Dive VSL</option>
                      <option value="30-Second Micro Hook">30-Second Micro Hook</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Screen-Share Target URL / Slide</label>
                    <input type="url" placeholder="https://prospect-website.com or Slide Deck" value={vslScreenUrl} onChange={(e) => setVslScreenUrl(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* 3. UPWORK / FIVERR PROPOSAL DYNAMIC FORM */}
            {studioMode === "proposal" && (
              <div className="bg-[#1c1c1e]/60 p-5 rounded-2xl border border-green-500/20 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">Paste Upwork / Fiverr Client Job Post</label>
                  <textarea rows={5} required placeholder="Paste the exact client job posting here to analyze their pain points..." value={upworkJobPost} onChange={(e) => setUpworkJobPost(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm outline-none resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">Client Budget Range</label>
                    <input type="text" placeholder="e.g. $500 - $1,000 or $50/hr" value={upworkBudget} onChange={(e) => setUpworkBudget(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">Relevant Portfolio Proof Link</label>
                    <input type="text" placeholder="e.g. https://myportfolio.com/case-study" value={upworkProof} onChange={(e) => setUpworkProof(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* 4. DIRECT MAIL (LUMPY MAIL) DYNAMIC FORM */}
            {studioMode === "direct_mail" && (
              <div className="bg-[#1c1c1e]/60 p-5 rounded-2xl border border-amber-500/20 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Direct Mail Physical Format</label>
                    <select value={directMailFormat} onChange={(e) => setDirectMailFormat(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm outline-none">
                      <option value="Executive Letter">Executive Letter (Framed / High-Quality)</option>
                      <option value="Physical Postcard">High-Impact Executive Postcard</option>
                      <option value="Handwritten Note Style">Handwritten Note Style</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Enclosed Item / Gift Teaser</label>
                    <input type="text" placeholder="e.g. $10 Starbucks Gift Card, Book, Custom Pen" value={directMailGift} onChange={(e) => setDirectMailGift(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* 5. SMS SEQUENCE DYNAMIC FORM WITH CHARACTER COUNTER */}
            {studioMode === "sms_sequence" && (
              <div className="bg-[#1c1c1e]/60 p-5 rounded-2xl border border-cyan-500/20 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Target Recipient Mobile #</label>
                    <input type="text" placeholder="+1 (555) 928-1102" value={smsPhone} onChange={(e) => setSmsPhone(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm outline-none" />
                  </div>
                  <div className="flex items-center pt-6">
                    <input type="checkbox" id="smsOptOutCheck" checked={smsOptOut} onChange={(e) => setSmsOptOut(e.target.checked)} className="w-4 h-4 rounded accent-[#0a84ff]" />
                    <label htmlFor="smsOptOutCheck" className="text-xs text-[#86868b] ml-2 font-medium">Include Automated Compliance Opt-Out (`Reply STOP`)</label>
                  </div>
                </div>
              </div>
            )}

            {/* 6. REDDIT DM DYNAMIC FORM */}
            {studioMode === "reddit_dm" && (
              <div className="bg-[#1c1c1e]/60 p-5 rounded-2xl border border-orange-500/20 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">Target Subreddit</label>
                    <input type="text" placeholder="e.g. r/sales, r/marketing, r/sysadmin" value={redditSubreddit} onChange={(e) => setRedditSubreddit(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">Paste Prospect's Reddit Post / Pain Point</label>
                    <input type="text" placeholder="e.g. 'Looking for advice on cold email warmup...'" value={redditPostText} onChange={(e) => setRedditPostText(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* 7. COLD CALL DYNAMIC FORM */}
            {studioMode === "cold_call" && (
              <div className="bg-[#1c1c1e]/60 p-5 rounded-2xl border border-rose-500/20 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">Gatekeeper Bypass Tactic</label>
                  <select value={callGatekeeper} onChange={(e) => setCallGatekeeper(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm outline-none">
                    <option value="Executive Assistant Bypass">Executive Assistant Bypass (Confident & Direct)</option>
                    <option value="Direct Dial Hook">Direct Dial Hook (Pattern Interrupt)</option>
                    <option value="Referral Name-Drop">Referral Name-Drop ("John suggested I call")</option>
                  </select>
                </div>
              </div>
            )}

            {/* 8. CSV BULK DYNAMIC FORM WITH TAG MAPPER */}
            {studioMode === "csv_bulk" && (
              <div className="bg-[#1c1c1e]/60 p-5 rounded-2xl border border-teal-500/20 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-teal-400 uppercase tracking-wider">Paste CSV Rows (Name, Company, Industry, URL)</label>
                    <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded font-mono">
                      TAGS: {`{{first_name}}, {{company}}, {{industry}}`}
                    </span>
                  </div>
                  <textarea rows={5} required placeholder="John Doe, Acme Corp, SaaS, https://acme.com&#10;Jane Smith, Globex, Real Estate, https://globex.com" value={csvData} onChange={(e) => setCsvData(e.target.value)} className="w-full bg-[#222224] border border-white/10 text-white rounded-xl p-3.5 text-sm font-mono outline-none resize-none" />
                </div>
              </div>
            )}

            {/* COMMON CONTEXT TEXTAREA (Show when not in proposal/csv) */}
            {studioMode !== "proposal" && studioMode !== "csv_bulk" && (
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  Campaign Goal / Core Value Pitch
                </label>
                <textarea rows={4} required placeholder="Describe your product, core problem solved, or offer..." value={context} onChange={(e) => setContext(e.target.value)} className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none resize-none" />
              </div>
            )}

            {/* Common Global Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">Output Language</label>
                <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none">
                  {LANGUAGES.map((lang) => (<option key={lang} value={lang}>{lang}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">ICP Persona</label>
                <select value={icpPersona} onChange={(e) => setIcpPersona(e.target.value)} className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none">
                  {ICP_PERSONAS.map((icp) => (<option key={icp} value={icp}>{icp}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">Tone of Voice</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none">
                  <option value="professional">Professional & Direct</option>
                  <option value="persuasive">Persuasive & Confident</option>
                  <option value="friendly">Friendly & Warm</option>
                  <option value="urgent">Urgent & Compelling</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
              <input type="text" placeholder="Your Name / Sender Title" value={sender} onChange={(e) => setSender(e.target.value)} className="bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none w-full sm:w-1/2" />
              <button type="submit" disabled={loading} className="w-full sm:w-auto bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition shadow-lg">
                {loading ? "Processing..." : `Generate ${activeBadge.label}`}
              </button>
            </div>
          </form>

          {/* Output Display */}
          {variations.length > 0 && (
            <div ref={resultRef} className="mt-12 pt-8 border-t border-white/10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/5">
                  <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Deliverability Audit</p>
                  <p className="text-sm font-bold text-emerald-400">Inbox Ready (0 Triggers)</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/5">
                  <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Reading Grade</p>
                  <p className="text-sm font-bold text-white">{analytics?.readingLevel || "5th Grade"}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/5">
                  <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Sentiment</p>
                  <p className="text-sm font-bold text-[#0a84ff]">{analytics?.sentiment || "Assertive"}</p>
                </div>
              </div>

              <div className="relative bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 text-[#f5f5f7] font-sans leading-relaxed whitespace-pre-wrap text-[15px]">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                  <span className="text-xs font-semibold text-[#34c759]">✓ Generated Content</span>
                  <button onClick={() => copyBody(variations[selectedTab]?.body)} className="text-xs bg-white text-black px-4 py-1.5 rounded-full font-semibold">
                    {copiedBody ? "Copied!" : "Copy Output"}
                  </button>
                </div>
                {variations[selectedTab]?.body}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PRO UPGRADE MODAL */}
      {proModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="bg-[#141415] border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full relative shadow-2xl">
            <button onClick={() => setProModalOpen(false)} className="absolute top-6 right-6 text-[#86868b] hover:text-white">✕</button>
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
                UPGRADE TO {proTargetTier.toUpperCase()}
              </span>
              <h3 className="text-2xl font-bold text-[#f5f5f7] mt-3 mb-1">Unlock {proTargetTier.toUpperCase()} Mode</h3>
              <p className="text-sm text-[#86868b]">{proReason}</p>
            </div>
            <Link href="/pricing" className="w-full py-4 bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold rounded-2xl text-center block transition">
              View {proTargetTier === "enterprise" ? "Enterprise ($79)" : "Growth ($39)"} Plan
            </Link>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="bg-[#141415] border border-white/10 rounded-[2rem] p-8 max-w-sm w-full relative">
            <button onClick={() => setAuthModalOpen(false)} className="absolute top-6 right-6 text-[#86868b]">✕</button>
            <h3 className="text-xl font-bold text-white mb-2">{isSignUp ? "Create Account" : "Log In"}</h3>
            <form onSubmit={handleAuth} className="space-y-4">
              <input type="email" required placeholder="Email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-[#1c1c1e] border border-white/5 text-white rounded-xl p-3.5 text-sm outline-none" />
              <input type="password" required placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-[#1c1c1e] border border-white/5 text-white rounded-xl p-3.5 text-sm outline-none" />
              {authMessage && <p className="text-xs text-red-400">{authMessage}</p>}
              <button type="submit" className="w-full bg-[#0a84ff] text-white font-semibold py-3.5 rounded-xl text-sm">
                {isSignUp ? "Sign Up" : "Log In"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}