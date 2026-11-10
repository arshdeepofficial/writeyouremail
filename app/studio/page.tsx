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

// 19-Mode Tier Access Matrix
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

  // Form State
  const [emailType, setEmailType] = useState("cold_outreach");
  const [context, setContext] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [tone, setTone] = useState("professional");
  const [targetLanguage, setTargetLanguage] = useState("English");

  // Advanced Targeting State
  const [icpPersona, setIcpPersona] = useState(ICP_PERSONAS[0]);
  const [prospectBio, setProspectBio] = useState("");
  const [crmTags, setCrmTags] = useState(false);
  const [targetIndustries, setTargetIndustries] = useState("");
  const [csvData, setCsvData] = useState("");

  // Mode Specific Inputs
  const [draftText, setDraftText] = useState("");
  const [polishGoal, setPolishGoal] = useState("Fix grammar, typos & improve flow");
  const [replyStrategy, setReplyStrategy] = useState("Value & ROI Reframing (Turn price into value)");
  const [incomingEmailText, setIncomingEmailText] = useState("");

  // Signature & Brand Voice
  const [docuSignLink, setDocuSignLink] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [includeSignature, setIncludeSignature] = useState(false);
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
  const [historySearch, setHistorySearch] = useState("");

  // Modals & Navigation
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [proReason, setProReason] = useState("");
  const [proTargetTier, setProTargetTier] = useState<"growth" | "enterprise">("growth");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const [copiedSubject, setCopiedSubject] = useState<number | null>(null);
  const [copiedBody, setCopiedBody] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  const isSocialOrCall = [
    "linkedin", "twitter", "whatsapp", "vsl_script", 
    "proposal", "telegram", "cold_call", "reddit_dm", 
    "threads_dm", "direct_mail", "sms_sequence"
  ].includes(studioMode);

  useEffect(() => {
    if (mobileMenuOpen || historyModalOpen || proModalOpen || authModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen, historyModalOpen, proModalOpen, authModalOpen]);

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
    } catch (e) {
      console.error(e);
    }
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
        loadGuestHistory();
      }
    });

    const localPresets = localStorage.getItem("email_presets");
    if (localPresets) {
      try { setPresets(JSON.parse(localPresets)); } catch (e) { console.error(e); }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserUsage(session.user.id);
        fetchUserHistory(session.user.id);
      } else {
        loadGuestHistory();
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

  const loadGuestHistory = () => {
    const raw = localStorage.getItem("guest_email_history");
    if (raw) {
      try { setSavedHistory(JSON.parse(raw)); } catch (e) { console.error(e); }
    }
  };

  // TIER ACCESS LOGIC
  const checkModeAccess = (targetMode: StudioMode): boolean => {
    if (!isPro) {
      if (!STARTER_MODES.includes(targetMode)) {
        triggerProModal(
          "This feature requires a Pro Plan. WhatsApp Sequences, Loom Scripts, Proposals, and Enterprise Channels require an active plan.",
          "growth"
        );
        return false;
      }
      return true;
    }

    if (planTier === "starter") {
      if (!STARTER_MODES.includes(targetMode)) {
        triggerProModal(
          "Your Starter Plan ($19) includes Standard Emails, Polish, and Objection Replies. Upgrade to Growth ($39) for WhatsApp, Loom Scripts, Proposals, LinkedIn, and Sequences.",
          "growth"
        );
        return false;
      }
      return true;
    }

    if (planTier === "growth") {
      if (!GROWTH_MODES.includes(targetMode)) {
        triggerProModal(
          "Your Growth Plan ($39) includes WhatsApp, Loom Scripts, and Sequences. Upgrade to Enterprise ($79) for Direct Mail, SMS Sequences, Reddit Outreach, Threads, and Bulk CSV.",
          "enterprise"
        );
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

  const saveToHistory = async (subjects: SubjectLine[], vars: EmailVariation[]) => {
    const primarySubject = subjects[0]?.subject || "Generated Content";
    const primaryBody = vars[0]?.body || "";

    const newRecord: SavedEmailRecord = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      email_type: studioMode.toUpperCase(),
      subject_line: primarySubject,
      body: primaryBody,
      language: targetLanguage,
    };

    if (user) {
      try {
        await supabase.from("emails").insert({
          user_id: user.id,
          email_type: newRecord.email_type,
          context: context || incomingEmailText || draftText || csvData,
          recipient: primarySubject,
          sender: sender || "User",
          tone: targetLanguage,
          generated_email: primaryBody,
        });
        fetchUserHistory(user.id);
      } catch (e) { console.error(e); }
    } else {
      const updated = [newRecord, ...savedHistory];
      setSavedHistory(updated);
      localStorage.setItem("guest_email_history", JSON.stringify(updated.slice(0, 20)));
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

  const handleGenerate = async (e?: React.FormEvent, overrideTone?: string) => {
    if (e) e.preventDefault();

    if (!checkModeAccess(studioMode)) return;

    if (!overrideTone) {
      if (!user && guestUsage >= 2) {
        setAuthModalOpen(true);
        return;
      }
      if (user && !isPro && dailyUsage >= 5) {
        triggerProModal("You have reached your 5 daily free generations! Upgrade to Pro for unlimited access.", "growth");
        return;
      }
      if (isPro && planTier === "starter" && dailyUsage >= 50) {
        triggerProModal("You have used all 50 AI generations on your Starter Plan this month. Upgrade to Growth ($39) for Unlimited!", "growth");
        return;
      }
    }

    setLoading(true);
    let attempts = 0;
    let success = false;

    while (attempts < 3 && !success) {
      try {
        attempts++;
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: studioMode,
            emailType: isSocialOrCall ? studioMode : emailType,
            context,
            recipient,
            sender,
            tone: overrideTone || tone,
            targetLanguage,
            draftText,
            polishGoal,
            replyStrategy,
            incomingEmailText,
            docuSignLink,
            csvData,
            brandVoice: isPro ? brandVoice : "",
            senderTitle: includeSignature ? senderTitle : "",
            icpPersona,
            prospectBio,
            crmTags,
            targetIndustries,
          }),
        });
        const data = await response.json();
        if (response.ok && data.variations && data.variations.length > 0) {
          setSubjectLines(data.subjectLines || []);
          setVariations(data.variations || []);
          setAnalytics(data.analytics || null);
          setSelectedTab(0);
          success = true;
          if (!overrideTone) await saveToHistory(data.subjectLines || [], data.variations || []);
          break;
        }
      } catch (err) {
        console.warn(`Attempt ${attempts} retrying...`);
      }
      if (!success && attempts < 3) await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setLoading(false);
    if (success) {
      if (!overrideTone) await incrementUsageAfterSuccess();
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }
  };

  const detectSpamTriggers = (text: string) => {
    if (!text) return [];
    const lower = text.toLowerCase();
    return COMMON_SPAM_WORDS.filter((word) => lower.includes(word));
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
        setMobileMenuOpen(false);
      }
    } catch (err: any) {
      setAuthMessage(err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsPro(false);
    setPlanTier("free");
    setDailyUsage(0);
    setMobileMenuOpen(false);
  };

  const copyBody = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const usageDisplay = () => {
    if (!user) return `${guestUsage}/2 Guest`;
    if (planTier === "enterprise") return "Enterprise ∞";
    if (planTier === "growth") return "Growth ∞";
    if (planTier === "starter") return `${dailyUsage}/50 Starter`;
    return `${dailyUsage}/5 Free`;
  };

  const currentBody = variations[selectedTab]?.body || "";
  const activeSpamTriggers = detectSpamTriggers(currentBody);

  return (
    <div className="relative w-full overflow-x-hidden min-h-screen bg-[#0a0a0a] text-[#f5f5f7] font-sans selection:bg-[#0a84ff] selection:text-white">
      {/* Ambient Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-b from-[#0a84ff]/15 via-[#0a84ff]/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/70 backdrop-blur-2xl saturate-150">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 font-semibold tracking-tight text-lg">
            <span className="w-6 h-6 bg-gradient-to-br from-[#f5f5f7] to-[#a1a1a6] text-black flex items-center justify-center font-bold text-sm rounded-md shadow-sm">
              ✉️
            </span>
            <span>WriteYourEmail Titan</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 text-white border border-white/10">
              {usageDisplay()}
            </span>

            {user ? (
              <div className="flex items-center space-x-4 border-l border-white/10 pl-4">
                <Link href="/profile" className="text-sm font-medium hover:text-[#0a84ff] transition flex items-center gap-1.5">
                  <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[10px]">👤</span>
                  {user.email.split('@')[0]}
                </Link>
                <button onClick={handleLogout} className="text-sm text-[#86868b] hover:text-[#f5f5f7] transition">
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setIsSignUp(false); setAuthModalOpen(true); }}
                className="text-sm font-medium bg-[#f5f5f7] text-black hover:bg-white px-4 py-1.5 rounded-full transition shadow-sm"
              >
                Sign Up / Log In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Generator Workspace */}
      <section id="generator" className="py-12 px-4 sm:px-6 max-w-[1100px] mx-auto">
        <div className="bg-[#141415]/80 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-6 sm:p-10 shadow-[0_0_80px_rgba(10,132,255,0.03)] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f5f5f7]">19 Omni-Channel Outreach Engine</h2>
              <p className="text-sm text-[#86868b] mt-1">WhatsApp · Loom VSL · Proposals · Direct Mail · Telegram · SMS</p>
            </div>
          </div>

          {/* 19-Mode Selector Dock */}
          <div className="flex items-center gap-2 bg-[#1c1c1e] p-2 rounded-2xl w-full mb-8 overflow-x-auto whitespace-nowrap border border-white/5 shadow-inner [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Basic Modes */}
            <button type="button" onClick={() => handleSelectMode("create")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "create" ? "bg-[#0a84ff] text-white" : "text-[#86868b] hover:text-white"}`}>✉️ Create Email</button>
            <button type="button" onClick={() => handleSelectMode("polish")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "polish" ? "bg-[#0a84ff] text-white" : "text-[#86868b] hover:text-white"}`}>✨ Magic Polish</button>
            <button type="button" onClick={() => handleSelectMode("reply")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "reply" ? "bg-[#0a84ff] text-white" : "text-[#86868b] hover:text-white"}`}>🥊 Objection Reply</button>

            <div className="w-[1px] h-5 bg-white/10 mx-1 shrink-0" />

            {/* Growth Tier Modes */}
            <button type="button" onClick={() => handleSelectMode("whatsapp")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1 ${studioMode === "whatsapp" ? "bg-emerald-600 text-white" : "text-[#86868b] hover:text-white"}`}>💬 WhatsApp</button>
            <button type="button" onClick={() => handleSelectMode("vsl_script")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1 ${studioMode === "vsl_script" ? "bg-indigo-600 text-white" : "text-[#86868b] hover:text-white"}`}>🎥 Loom / VSL Script</button>
            <button type="button" onClick={() => handleSelectMode("proposal")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1 ${studioMode === "proposal" ? "bg-green-600 text-white" : "text-[#86868b] hover:text-white"}`}>📄 Upwork Proposal</button>
            <button type="button" onClick={() => handleSelectMode("telegram")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1 ${studioMode === "telegram" ? "bg-sky-500 text-white" : "text-[#86868b] hover:text-white"}`}>✈️ Telegram DM</button>
            <button type="button" onClick={() => handleSelectMode("linkedin")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "linkedin" ? "bg-[#0077b5] text-white" : "text-[#86868b] hover:text-white"}`}>💼 LinkedIn DM</button>
            <button type="button" onClick={() => handleSelectMode("sequence")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "sequence" ? "bg-purple-600 text-white" : "text-[#86868b] hover:text-white"}`}>🔁 3-Step Sequence</button>

            <div className="w-[1px] h-5 bg-white/10 mx-1 shrink-0" />

            {/* Enterprise Tier Modes */}
            <button type="button" onClick={() => handleSelectMode("reddit_dm")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "reddit_dm" ? "bg-orange-600 text-white" : "text-[#86868b] hover:text-white"}`}>🤖 Reddit DM</button>
            <button type="button" onClick={() => handleSelectMode("threads_dm")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "threads_dm" ? "bg-pink-600 text-white" : "text-[#86868b] hover:text-white"}`}>🌀 Threads DM</button>
            <button type="button" onClick={() => handleSelectMode("direct_mail")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "direct_mail" ? "bg-amber-600 text-white" : "text-[#86868b] hover:text-white"}`}>📮 Direct Mail Letter</button>
            <button type="button" onClick={() => handleSelectMode("sms_sequence")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "sms_sequence" ? "bg-cyan-600 text-white" : "text-[#86868b] hover:text-white"}`}>📱 SMS Sequence</button>
            <button type="button" onClick={() => handleSelectMode("cold_call")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "cold_call" ? "bg-rose-600 text-white" : "text-[#86868b] hover:text-white"}`}>📞 Call Script</button>
            <button type="button" onClick={() => handleSelectMode("csv_bulk")} className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${studioMode === "csv_bulk" ? "bg-teal-600 text-white" : "text-[#86868b] hover:text-white"}`}>📊 CSV Bulk</button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            {/* Dynamic Inputs Based on Selected Mode */}
            {studioMode === "proposal" ? (
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">Paste Upwork / Fiverr Job Description</label>
                <textarea rows={5} required placeholder="Paste the client's job post here..." value={context} onChange={(e) => setContext(e.target.value)} className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none resize-none" />
              </div>
            ) : studioMode === "reddit_dm" ? (
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">Paste Reddit Post / Comment Being Addressed</label>
                <textarea rows={4} required placeholder="Paste the post or problem context..." value={context} onChange={(e) => setContext(e.target.value)} className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none resize-none" />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">Pitch Context & Campaign Goal</label>
                <textarea rows={4} required placeholder="Describe your product, offer, or campaign goal..." value={context} onChange={(e) => setContext(e.target.value)} className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none resize-none" />
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
              <input type="text" placeholder="Your Name / Sender Title" value={sender} onChange={(e) => setSender(e.target.value)} className="bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none w-full sm:w-1/2" />
              <button type="submit" disabled={loading} className="w-full sm:w-auto bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition shadow-lg">
                {loading ? "Generating..." : `Generate ${studioMode.replace('_', ' ').toUpperCase()}`}
              </button>
            </div>
          </form>

          {/* Result Output Display */}
          {variations.length > 0 && (
            <div ref={resultRef} className="mt-12 pt-8 border-t border-white/10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/5">
                  <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Deliverability Audit</p>
                  <p className={`text-sm font-bold ${activeSpamTriggers.length === 0 ? "text-emerald-400" : "text-amber-400"}`}>
                    {activeSpamTriggers.length === 0 ? "Inbox Ready (0 Spam Triggers)" : `${activeSpamTriggers.length} Spam Words Found`}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/5">
                  <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Reading Grade</p>
                  <p className="text-sm font-bold text-[#f5f5f7]">{analytics?.readingLevel || "5th Grade"}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/5">
                  <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Sentiment</p>
                  <p className="text-sm font-bold text-[#0a84ff]">{analytics?.sentiment || "Assertive"}</p>
                </div>
              </div>

              <div className="relative bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 text-[#f5f5f7] font-sans leading-relaxed whitespace-pre-wrap text-[15px]">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                  <span className="text-xs font-semibold text-[#34c759]">✓ Generated Successfully</span>
                  <button onClick={() => copyBody(variations[selectedTab]?.body)} className="text-xs bg-white text-black px-4 py-1.5 rounded-full font-semibold">
                    {copiedBody ? "Copied!" : "Copy Output"}
                  </button>
                </div>
                {variations[selectedTab]?.body}
              </div>

              {/* NATIVE SPONSORED PARTNER CARD */}
              <div className="mt-6 bg-gradient-to-r from-[#1c1c1e] via-[#141415] to-[#1c1c1e] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">RECOMMENDED INFRASTRUCTURE</span>
                      <h4 className="text-sm font-bold text-[#f5f5f7]">Warm Up Domain & Send at Scale</h4>
                    </div>
                    <p className="text-xs text-[#86868b]">
                      Automate unlimited inbox sending and domain warming with Instantly.ai.
                    </p>
                  </div>

                  <a href="https://instantly.ai" target="_blank" rel="noopener noreferrer" className="shrink-0 bg-[#0a84ff] hover:bg-[#0071e3] text-white px-4 py-2 rounded-xl text-xs font-semibold transition">
                    Try Instantly ↗
                  </a>
                </div>
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
            <p className="text-sm text-[#86868b] mb-6">Get 5 free AI generations daily.</p>
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