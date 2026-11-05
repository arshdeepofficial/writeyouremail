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
  | "cold_call"
  | "classifier" 
  | "sequence" 
  | "ab_test" 
  | "batch" 
  | "csv_bulk";

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
  const [guestUsage, setGuestUsage] = useState<number>(0);

  const [savedHistory, setSavedHistory] = useState<SavedEmailRecord[]>([]);
  const [presets, setPresets] = useState<PromptPreset[]>([]);
  const [historySearch, setHistorySearch] = useState("");

  // Modals & Navigation
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [proReason, setProReason] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const [copiedSubject, setCopiedSubject] = useState<number | null>(null);
  const [copiedBody, setCopiedBody] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileMenuOpen || historyModalOpen || proModalOpen || authModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen, historyModalOpen, proModalOpen, authModalOpen]);

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

  const triggerProModal = (reason: string) => {
    setProReason(reason);
    setProModalOpen(true);
  };

  const fetchUserUsage = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("usage_tracking").select("count, is_pro, last_reset").eq("user_id", userId).single();
      if (!error && data) {
        setIsPro(data.is_pro || false);
        setDailyUsage(data.count || 0);
      }
    } catch (e) { console.error(e); }
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

  const saveToHistory = async (subjects: SubjectLine[], vars: EmailVariation[]) => {
    const primarySubject = subjects[0]?.subject || "Generated Content";
    const primaryBody = vars[0]?.body || "";
    
    const modeLabels: Record<StudioMode, string> = {
      create: emailType,
      sequence: "3-Step Sequence",
      reply: "Objection Response",
      ab_test: "A/B Split Test",
      batch: "Multi-Vertical Batch",
      csv_bulk: "Bulk CSV Leads",
      classifier: "AI Reply Intent",
      polish: "Magic Polish",
      linkedin: "LinkedIn DM",
      twitter: "Twitter/X DM",
      cold_call: "Cold Call Script"
    };
    
    let typeLabel = modeLabels[studioMode] || "Generated Content";

    const newRecord: SavedEmailRecord = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      email_type: typeLabel,
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

  const deleteHistoryItem = async (id: string) => {
    if (user) {
      await supabase.from("emails").delete().eq("id", id);
      fetchUserHistory(user.id);
    } else {
      const updated = savedHistory.filter((item) => item.id !== id);
      setSavedHistory(updated);
      localStorage.setItem("guest_email_history", JSON.stringify(updated));
    }
  };

  const exportHistory = (format: "txt" | "csv") => {
    if (!isPro) {
      triggerProModal("1-Click Email History Export is a Pro feature.");
      return;
    }
    if (savedHistory.length === 0) return;

    if (format === "txt") {
      const content = savedHistory.map((item, idx) => (
        `=== ITEM #${idx + 1} (${new Date(item.created_at).toLocaleDateString()}) ===\nType: ${item.email_type}\nSubject: ${item.subject_line}\n\nBODY:\n${item.body}\n\n`
      )).join("\n---\n\n");
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "WriteYourEmail_History.txt";
      a.click();
    } else {
      const csvRows = [
        ["Date", "Type", "Subject", "Body"],
        ...savedHistory.map((item) => [
          new Date(item.created_at).toLocaleDateString(),
          `"${item.email_type.replace(/"/g, '""')}"`,
          `"${item.subject_line.replace(/"/g, '""')}"`,
          `"${item.body.replace(/"/g, '""')}"`,
        ]),
      ];
      const blob = new Blob([csvRows.map((e) => e.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "WriteYourEmail_History.csv";
      a.click();
    }
  };

  const incrementUsageAfterSuccess = async () => {
    if (isPro) return;
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
      });
    } catch (err) { console.error(err); }
  };

  const handleGenerate = async (e?: React.FormEvent, overrideTone?: string) => {
    if (e) e.preventDefault();

    if (!isPro && !overrideTone) {
      if (!user && guestUsage >= 2) {
        setAuthModalOpen(true);
        return;
      }
      if (user && dailyUsage >= 5) {
        triggerProModal("You have reached your 5 daily free generations! Upgrade to Pro for unlimited access.");
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
            emailType,
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

  const savePreset = () => {
    if (!isPro) return triggerProModal("Saving Custom Prompt Presets is a Pro feature.");
    const name = prompt("Enter a name for this custom preset (e.g. 'SaaS Agency Pitch'):");
    if (name) {
      const newPreset: PromptPreset = { id: Date.now().toString(), name, context, emailType, tone, icpPersona };
      const updated = [...presets, newPreset];
      setPresets(updated);
      localStorage.setItem("email_presets", JSON.stringify(updated));
      alert("Preset saved successfully!");
    }
  };

  const loadPreset = (presetId: string) => {
    const p = presets.find((x) => x.id === presetId);
    if (p) {
      setContext(p.context);
      setEmailType(p.emailType);
      setTone(p.tone);
      setIcpPersona(p.icpPersona);
    }
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
    setDailyUsage(0);
    setMobileMenuOpen(false);
  };

  const copySubject = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSubject(index);
    setTimeout(() => setCopiedSubject(null), 2000);
  };

  const copyBody = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const openInGmail = (subjectText: string, bodyText: string) => {
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`,
      "_blank"
    );
  };

  const openInMailClient = (subjectText: string, bodyText: string) => {
    window.location.href = `mailto:?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
  };

  const currentBody = variations[selectedTab]?.body || "";
  const activeSpamTriggers = detectSpamTriggers(currentBody);

  const filteredHistory = savedHistory.filter(
    (item) =>
      item.subject_line.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.body.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.email_type.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div
      className="relative w-full overflow-x-hidden min-h-screen bg-[#0a0a0a] text-[#f5f5f7] font-sans selection:bg-[#0a84ff] selection:text-white"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Apple Ambient Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-b from-[#0a84ff]/15 via-[#0a84ff]/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b border-white/5 transition-colors duration-300 ${
          mobileMenuOpen ? "bg-[#0a0a0a]" : "bg-[#0a0a0a]/70 backdrop-blur-2xl saturate-150"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 font-semibold tracking-tight text-lg z-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="w-6 h-6 bg-gradient-to-br from-[#f5f5f7] to-[#a1a1a6] text-black flex items-center justify-center font-bold text-sm rounded-md shadow-sm">
                ✉️
              </span>
              <span>WriteYourEmail Studio</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6 text-sm text-[#86868b] font-medium">
              <Link href="/" className="hover:text-[#f5f5f7] transition-colors">
                Home
              </Link>
              <Link href="/pricing" className="hover:text-[#f5f5f7] transition-colors">
                Pricing
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isPro ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                ⚡ PRO MEMBER
              </span>
            ) : (
              <button
                onClick={() =>
                  triggerProModal(
                    "Upgrade to Pro to unlock unlimited daily generations, 3-step outreach sequences, and custom brand voice."
                  )
                }
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition flex items-center gap-1 ring-1 ring-white/10"
              >
                <span>🚀 Free Plan</span> — <span className="text-[#0a84ff]">Upgrade</span>
              </button>
            )}

            <button
              onClick={() => setHistoryModalOpen(true)}
              className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition flex items-center gap-1.5"
            >
              <span>History</span>
              {savedHistory.length > 0 && (
                <span className="bg-[#2c2c2e] text-[#f5f5f7] text-[10px] px-1.5 py-0.5 rounded-full">
                  {savedHistory.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-4 ml-2 border-l border-white/10 pl-4">
                <span className="text-sm text-[#86868b]">{user.email}</span>
                <button onClick={handleLogout} className="text-sm text-[#86868b] hover:text-[#f5f5f7] transition">
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-2 border-l border-white/10 pl-4">
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    setAuthModalOpen(true);
                  }}
                  className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    setAuthModalOpen(true);
                  }}
                  className="text-sm font-medium bg-[#f5f5f7] text-black hover:bg-white px-4 py-1.5 rounded-full transition shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-[#86868b] hover:text-[#f5f5f7] z-50 p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[#0a0a0a] md:hidden pt-20 px-6 transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <nav className="flex flex-col text-lg font-medium text-[#f5f5f7]">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="border-b border-white/10 py-4">
            Home
          </Link>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="border-b border-white/10 py-4">
            Pricing
          </Link>

          <div className="pt-8 flex flex-col space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setHistoryModalOpen(true);
              }}
              className="text-center bg-[#1c1c1e] text-[#f5f5f7] py-3 rounded-xl text-base font-semibold"
            >
              Saved History ({savedHistory.length})
            </button>
            {user ? (
              <>
                <span className="text-sm text-[#86868b] text-center">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-center bg-[#f5f5f7] text-black py-3 rounded-xl text-base font-semibold"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-center bg-[#1c1c1e] text-[#f5f5f7] py-3 rounded-xl text-base font-semibold"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-center bg-[#f5f5f7] text-black py-3 rounded-xl text-base font-semibold"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Generator Workspace */}
      <section id="generator" className="py-12 px-4 sm:px-6 max-w-[1050px] mx-auto">
        <div className="bg-[#141415]/80 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-6 sm:p-10 shadow-[0_0_80px_rgba(10,132,255,0.03)] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f5f5f7]">Studio v7.0 Titan</h2>
              <p className="text-sm text-[#86868b] mt-1">Includes Omni-Channel Outreach, CSV Bulk, Presets & CRM Tags.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {presets.length > 0 && (
                <select
                  onChange={(e) => loadPreset(e.target.value)}
                  className="text-sm px-4 py-2 bg-[#222224] text-[#f5f5f7] rounded-full outline-none border border-white/5 cursor-pointer focus:ring-2 focus:ring-[#0a84ff]/50"
                >
                  <option value="">Load Preset...</option>
                  {presets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
              {!isPro && (
                <span className="text-sm px-4 py-2 bg-[#222224] rounded-full text-[#86868b] font-medium border border-white/5">
                  {user ? `${dailyUsage}/5 Free` : `${guestUsage}/2 Free`}
                </span>
              )}
            </div>
          </div>

          {/* Hiding Webkit Scrollbar properly while keeping scroll functionality */}
          <div className="flex items-center gap-2 bg-[#1c1c1e] p-1.5 rounded-2xl w-full mb-8 overflow-x-auto whitespace-nowrap border border-white/5 shadow-inner [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              type="button"
              onClick={() => setStudioMode("create")}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                studioMode === "create" ? "bg-[#2c2c2e] text-white shadow-md ring-1 ring-white/10" : "text-[#86868b] hover:bg-[#2c2c2e]/50 hover:text-[#f5f5f7]"
              }`}
            >
              ✉️ Create New
            </button>
            <button
              type="button"
              onClick={() => setStudioMode("linkedin")}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                studioMode === "linkedin" ? "bg-[#0077b5] text-white shadow-md ring-1 ring-white/20" : "text-[#86868b] hover:bg-[#2c2c2e]/50 hover:text-[#f5f5f7]"
              }`}
            >
              💼 LinkedIn DM
            </button>
            <button
              type="button"
              onClick={() => setStudioMode("twitter")}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                studioMode === "twitter" ? "bg-black text-white shadow-md ring-1 ring-white/20" : "text-[#86868b] hover:bg-[#2c2c2e]/50 hover:text-[#f5f5f7]"
              }`}
            >
              🐦 Twitter/X DM
            </button>
            <button
              type="button"
              onClick={() => setStudioMode("cold_call")}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                studioMode === "cold_call" ? "bg-rose-600 text-white shadow-md ring-1 ring-white/20" : "text-[#86868b] hover:bg-[#2c2c2e]/50 hover:text-[#f5f5f7]"
              }`}
            >
              📞 Call Script
            </button>
            <div className="w-[1px] h-6 bg-white/10 mx-1 shrink-0" />
            <button
              type="button"
              onClick={() => setStudioMode("polish")}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                studioMode === "polish" ? "bg-[#2c2c2e] text-white shadow-md ring-1 ring-white/10" : "text-[#86868b] hover:bg-[#2c2c2e]/50 hover:text-[#f5f5f7]"
              }`}
            >
              ✨ Magic Polish
            </button>
            <button
              type="button"
              onClick={() => setStudioMode("reply")}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                studioMode === "reply" ? "bg-[#2c2c2e] text-white shadow-md ring-1 ring-white/10" : "text-[#86868b] hover:bg-[#2c2c2e]/50 hover:text-[#f5f5f7]"
              }`}
            >
              🥊 Objection Reply
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isPro) triggerProModal("AI Reply Intent Classifier is a Pro exclusive feature.");
                else setStudioMode("classifier");
              }}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                studioMode === "classifier" ? "bg-pink-600 text-white shadow-md ring-1 ring-white/20" : "text-[#86868b] hover:bg-[#2c2c2e]/50 hover:text-[#f5f5f7]"
              }`}
            >
              <span>🧠 Classifier</span>
              {!isPro && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isPro) triggerProModal("3-Step Outreach Sequence generator is a Pro exclusive feature.");
                else setStudioMode("sequence");
              }}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                studioMode === "sequence" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-1 ring-white/20" : "text-[#86868b] hover:bg-[#2c2c2e]/50 hover:text-[#f5f5f7]"
              }`}
            >
              <span>🔁 Sequence</span>
              {!isPro && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isPro) triggerProModal("A/B Split Test generator is a Pro exclusive feature.");
                else setStudioMode("ab_test");
              }}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                studioMode === "ab_test" ? "bg-[#0a84ff] text-white shadow-md ring-1 ring-white/20" : "text-[#86868b] hover:bg-[#2c2c2e]/50 hover:text-[#f5f5f7]"
              }`}
            >
              <span>⚖️ A/B Split</span>
              {!isPro && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isPro) triggerProModal("Multi-Vertical Batch generator is a Pro exclusive feature.");
                else setStudioMode("batch");
              }}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                studioMode === "batch" ? "bg-emerald-600 text-white shadow-md ring-1 ring-white/20" : "text-[#86868b] hover:bg-[#2c2c2e]/50 hover:text-[#f5f5f7]"
              }`}
            >
              <span>📦 Batch</span>
              {!isPro && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isPro) triggerProModal("Bulk CSV Leads generator is a Pro exclusive feature.");
                else setStudioMode("csv_bulk");
              }}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                studioMode === "csv_bulk" ? "bg-orange-600 text-white shadow-md ring-1 ring-white/20" : "text-[#86868b] hover:bg-[#2c2c2e]/50 hover:text-[#f5f5f7]"
              }`}
            >
              <span>📄 CSV Bulk</span>
              {!isPro && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  Output Language
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition outline-none appearance-none cursor-pointer shadow-sm"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  ICP Persona Targeting
                </label>
                <select
                  value={icpPersona}
                  onChange={(e) => setIcpPersona(e.target.value)}
                  className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition outline-none appearance-none cursor-pointer shadow-sm"
                >
                  {ICP_PERSONAS.map((icp) => (
                    <option key={icp} value={icp}>
                      {icp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Advanced Campaign Tools Panel */}
            <div className="bg-[#1c1c1e]/60 p-5 rounded-2xl border border-white/5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#f5f5f7] uppercase tracking-wider flex items-center gap-2">
                  ⚙️ Advanced Campaign Engine
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-2 flex justify-between">
                    <span>Brand Voice DNA</span>
                    {!isPro && <span className="text-[10px] text-amber-400 font-bold tracking-wider">PRO</span>}
                  </label>
                  <input
                    type="text"
                    disabled={!isPro}
                    placeholder={isPro ? "e.g. Direct Silicon Valley executive" : "🔒 Pro Required"}
                    value={brandVoice}
                    onChange={(e) => setBrandVoice(e.target.value)}
                    className={`w-full border border-white/5 rounded-xl p-3 text-sm outline-none transition ${
                      isPro ? "bg-[#222224] text-[#f5f5f7] focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d]" : "bg-[#1a1a1c] text-[#86868b] cursor-not-allowed opacity-70"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-2 flex justify-between">
                    <span>Prospect Bio / URL Icebreaker</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://stripe.com or 'VP of Sales'"
                    value={prospectBio}
                    onChange={(e) => setProspectBio(e.target.value)}
                    className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3 text-sm outline-none placeholder-[#86868b] focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <input
                  type="checkbox"
                  id="crmTagsCheckbox"
                  checked={crmTags}
                  onChange={(e) => setCrmTags(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#0a84ff] cursor-pointer bg-[#222224] border-white/10"
                />
                <label htmlFor="crmTagsCheckbox" className="text-sm text-[#86868b] cursor-pointer font-medium">
                  Use CRM Merge Tags{" "}
                  <code className="text-xs bg-[#2a2a2d] px-1.5 py-0.5 rounded text-[#f5f5f7] ml-1 ring-1 ring-white/5">{`{{first_name}}`}</code>
                </label>
              </div>
            </div>

            {/* Mode-Specific Fields */}
            {studioMode === "batch" && (
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  Target Industries (Comma Separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SaaS, Real Estate, Healthcare"
                  value={targetIndustries}
                  onChange={(e) => setTargetIndustries(e.target.value)}
                  className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none placeholder-[#86868b] focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
                />
              </div>
            )}

            {studioMode === "csv_bulk" && (
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  Paste CSV Data (Name, Company, Industry, etc.)
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="John Doe, Acme Corp, SaaS&#10;Jane Smith, Globex, Real Estate"
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none placeholder-[#86868b] resize-none focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
                />
              </div>
            )}

            {studioMode === "classifier" && (
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  Paste Incoming Email to Classify Intent
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Paste the prospect's reply here to analyze their intent (e.g. Positive, Negative, OOO, Pricing Objection)..."
                  value={incomingEmailText}
                  onChange={(e) => setIncomingEmailText(e.target.value)}
                  className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none placeholder-[#86868b] resize-none focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
                />
              </div>
            )}

            {studioMode === "reply" ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                    Paste Prospect Email / Objection Received
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. 'Thanks for reaching out, but your solution is way too expensive for our Q3 budget right now.'"
                    value={incomingEmailText}
                    onChange={(e) => setIncomingEmailText(e.target.value)}
                    className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none placeholder-[#86868b] resize-none focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                    Select Rebuttal / Reply Strategy
                  </label>
                  <select
                    value={replyStrategy}
                    onChange={(e) => setReplyStrategy(e.target.value)}
                    className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
                  >
                    <option value="Value & ROI Reframing">Value & ROI Reframing (Turn cost into ROI)</option>
                    <option value="Soft 5-Minute Nudge">Soft 5-Minute Nudge (Low friction ask)</option>
                    <option value="Polite Breakup">Polite Breakup & Future Touchpoint</option>
                  </select>
                </div>
              </>
            ) : studioMode === "polish" ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                    Paste Your Existing Draft
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Paste your draft or raw notes here..."
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none placeholder-[#86868b] resize-none focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                    Select Polish Goal
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Fix grammar, typos & improve flow",
                      "Make shorter & punchier",
                      "Make strong & confident",
                      "Make politely firm (set boundaries)",
                    ].map((goal) => (
                      <button
                        type="button"
                        key={goal}
                        onClick={() => setPolishGoal(goal)}
                        className={`text-sm px-4 py-2 rounded-xl transition-all font-medium ${
                          polishGoal === goal
                            ? "bg-[#0a84ff] text-white shadow-md ring-1 ring-[#0a84ff]/50"
                            : "bg-[#222224] border border-white/5 text-[#86868b] hover:bg-[#2a2a2d] hover:text-[#f5f5f7]"
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : studioMode !== "classifier" && studioMode !== "csv_bulk" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                      Outreach Type
                    </label>
                    <select
                      value={emailType}
                      onChange={(e) => setEmailType(e.target.value)}
                      className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
                    >
                      <option value="cold_outreach">Cold Outreach / Sales</option>
                      <option value="follow_up">Follow Up</option>
                      <option value="networking">Networking / Connect</option>
                      <option value="investor_pitch">Investor / VC Pitch</option>
                      <option value="pr_outreach">PR / Media Outreach</option>
                      <option value="job_application">Job / Career Inquiry</option>
                      <option value="newsletter_sponsor">Newsletter Sponsorship</option>
                      <option value="contract_pitch">Contract / Proposal Pitch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                      Tone of Voice
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
                    >
                      <option value="professional">Professional & Direct</option>
                      <option value="persuasive">Persuasive & Confident</option>
                      <option value="friendly">Friendly & Warm</option>
                      <option value="urgent">Urgent & Compelling</option>
                      <option value="storytelling">Storytelling & Narrative</option>
                      <option value="empathetic">Empathetic & Understanding</option>
                      <option value="data_driven">Data-Driven & Analytical</option>
                      <option value="authoritative">Authoritative & Expert</option>
                      <option value="humorous">Humorous & Witty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      disabled={crmTags}
                      placeholder={crmTags ? "{{first_name}}" : "Recipient Name"}
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full bg-[#222224] border border-white/5 disabled:opacity-50 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none placeholder-[#86868b] focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
                    />
                  </div>
                </div>

                <div className="bg-[#1c1c1e]/60 p-4 rounded-2xl border border-white/5 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
                      🖋️ HTML Signature & DocuSign
                    </label>
                    <input
                      type="checkbox"
                      checked={includeSignature}
                      onChange={(e) => setIncludeSignature(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#0a84ff] cursor-pointer bg-[#222224] border-white/10"
                    />
                  </div>
                  {includeSignature && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <input
                        type="text"
                        placeholder="Sender Title (e.g. VP of Sales)"
                        value={senderTitle}
                        onChange={(e) => setSenderTitle(e.target.value)}
                        className="bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3 text-sm outline-none placeholder-[#86868b] focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
                      />
                      <input
                        type="url"
                        placeholder="DocuSign / Pitch Link"
                        value={docuSignLink}
                        onChange={(e) => setDocuSignLink(e.target.value)}
                        className="bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3 text-sm outline-none placeholder-[#86868b] focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                      Context & Pitch Goal
                    </label>
                    <button type="button" onClick={savePreset} className="text-xs text-[#0a84ff] font-medium hover:text-[#0071e3] transition">
                      + Save as Preset
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Pitching SaaS tool. Goal is to book a 15-min demo call."
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="w-full bg-[#222224] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none placeholder-[#86868b] resize-none focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
                  />
                </div>
              </>
            ) : null}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
              <input
                type="text"
                disabled={crmTags}
                placeholder={crmTags ? "{{sender_name}}" : "Your Name"}
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="bg-[#222224] border border-white/5 disabled:opacity-50 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none placeholder-[#86868b] w-full sm:w-1/2 focus:ring-2 focus:ring-[#0a84ff]/50 focus:bg-[#2a2a2d] transition shadow-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(10,132,255,0.3)] ring-1 ring-[#0a84ff]/50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {studioMode === "sequence"
                      ? "Generate 3-Step Sequence"
                      : studioMode === "ab_test"
                      ? "Generate A/B Test"
                      : studioMode === "batch"
                      ? "Generate Batch Campaign"
                      : studioMode === "reply"
                      ? "Generate Rebuttal"
                      : studioMode === "csv_bulk"
                      ? "Process CSV Bulk"
                      : studioMode === "classifier"
                      ? "Classify Reply Intent"
                      : studioMode === "linkedin"
                      ? "Generate LinkedIn DM"
                      : studioMode === "twitter"
                      ? "Generate Twitter DM"
                      : studioMode === "cold_call"
                      ? "Generate Call Script"
                      : "Generate Content"}
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Result Output Display */}
          {variations.length > 0 && (
            <div ref={resultRef} className="mt-12 pt-8 border-t border-white/10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/5 flex flex-col justify-center shadow-inner">
                  <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Deliverability Audit</p>
                  <p className={`text-sm font-bold ${activeSpamTriggers.length === 0 ? "text-emerald-400" : "text-amber-400"}`}>
                    {activeSpamTriggers.length === 0 ? "Inbox Ready (0 Triggers)" : `${activeSpamTriggers.length} Spam Words Found`}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/5 flex flex-col justify-center shadow-inner">
                  <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Reading Grade</p>
                  <p className="text-sm font-bold text-[#f5f5f7]">{analytics?.readingLevel || "5th Grade (Optimal)"}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/5 flex flex-col justify-center shadow-inner">
                  <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Tone Sentiment</p>
                  <p className="text-sm font-bold text-[#0a84ff]">{analytics?.sentiment || "Assertive"}</p>
                </div>
              </div>

              {/* Subject Lines (Hidden for certain modes like Cold Call) */}
              {subjectLines.length > 0 && studioMode !== "cold_call" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
                    Subject Line Studio
                  </span>
                  <div className="space-y-2">
                    {subjectLines.map((subj, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1c1c1e] border border-white/5 p-4 rounded-2xl gap-3 shadow-sm hover:bg-[#222224] transition"
                      >
                        <span className="text-sm font-medium text-[#f5f5f7]">{subj.subject}</span>
                        <div className="flex items-center space-x-3 shrink-0">
                          {subj.openRateForecast && (
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              Forecast: {subj.openRateForecast}
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                              subj.score >= 90 ? "bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20" : "bg-[#ff9f0a]/10 text-[#ff9f0a] border border-[#ff9f0a]/20"
                            }`}
                          >
                            {subj.spamRisk}
                          </span>
                          <button
                            onClick={() => copySubject(subj.subject, idx)}
                            className="text-xs font-medium text-[#0a84ff] hover:text-white hover:bg-[#0a84ff] bg-[#0a84ff]/10 px-3 py-1.5 rounded-full transition ring-1 ring-[#0a84ff]/30"
                          >
                            {copiedSubject === idx ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
                    Output Options
                  </span>
                  <span className="text-xs text-[#86868b] font-medium">
                    {variations[selectedTab]?.readingTime}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {variations.map((v, i) => (
                    <button
                      key={v.id || i}
                      onClick={() => setSelectedTab(i)}
                      className={`text-sm font-medium px-5 py-2 rounded-full transition-all ${
                        selectedTab === i ? "bg-[#f5f5f7] text-black shadow-md" : "bg-[#1c1c1e] border border-white/5 text-[#86868b] hover:bg-[#222224] hover:text-[#f5f5f7]"
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>

                {/* 1-Click Persona Rewriter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#86868b] shrink-0">1-Click Rewrite:</span>
                  <button
                    onClick={() => handleGenerate(undefined, "Compress to less than 75 words exactly.")}
                    className="text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 px-3 py-1.5 rounded-full transition shrink-0"
                  >
                    ✂️ Compress &lt;75 Words
                  </button>
                  <button
                    onClick={() => handleGenerate(undefined, "Executive C-Suite Short & Concise")}
                    className="text-xs font-medium bg-[#1c1c1e] border border-white/5 hover:bg-[#222224] text-[#f5f5f7] px-3 py-1.5 rounded-full transition shrink-0"
                  >
                    ⚡ C-Suite Brief
                  </button>
                  <button
                    onClick={() => handleGenerate(undefined, "Warm, Friendly & Casual")}
                    className="text-xs font-medium bg-[#1c1c1e] border border-white/5 hover:bg-[#222224] text-[#f5f5f7] px-3 py-1.5 rounded-full transition shrink-0"
                  >
                    ☕ Casual
                  </button>
                  <button
                    onClick={() => handleGenerate(undefined, "Direct Response Aggressive Call to Action")}
                    className="text-xs font-medium bg-[#1c1c1e] border border-white/5 hover:bg-[#222224] text-[#f5f5f7] px-3 py-1.5 rounded-full transition shrink-0"
                  >
                    🎯 Direct-Response CTA
                  </button>
                </div>

                <div className="relative bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 sm:p-8 text-[#f5f5f7] font-sans leading-relaxed whitespace-pre-wrap text-[15px] shadow-inner mt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-4 border-b border-white/5">
                    <span className="text-xs font-semibold text-[#34c759] flex items-center gap-1 bg-[#34c759]/10 px-2.5 py-1 rounded-full border border-[#34c759]/20">
                      ✓ Auto-saved
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {docuSignLink && (
                        <a
                          href={docuSignLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium bg-[#ff9f0a]/10 hover:bg-[#ff9f0a]/20 text-[#ff9f0a] px-4 py-2 rounded-full transition flex items-center gap-1 border border-[#ff9f0a]/20"
                        >
                          🖋️ Test DocuSign
                        </a>
                      )}

                      <button
                        onClick={() => openInGmail(subjectLines[0]?.subject || "Email", variations[selectedTab]?.body)}
                        className="text-xs font-medium bg-[#ff3b30]/10 hover:bg-[#ff3b30]/20 text-[#ff3b30] px-4 py-2 rounded-full transition border border-[#ff3b30]/20"
                      >
                        Gmail
                      </button>

                      <button
                        onClick={() => openInMailClient(subjectLines[0]?.subject || "Email", variations[selectedTab]?.body)}
                        className="text-xs font-medium bg-[#0a84ff]/10 hover:bg-[#0a84ff]/20 text-[#0a84ff] px-4 py-2 rounded-full transition border border-[#0a84ff]/20"
                      >
                        Mail App
                      </button>

                      <button
                        onClick={() => copyBody(variations[selectedTab]?.body)}
                        className="text-xs font-medium bg-[#f5f5f7] text-black hover:bg-white px-4 py-2 rounded-full transition shadow-md"
                      >
                        {copiedBody ? "Copied!" : "Copy Text"}
                      </button>
                    </div>
                  </div>

                  {variations[selectedTab]?.body}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PRO UPGRADE MODAL */}
      {proModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="bg-[#141415] border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full relative shadow-[0_0_80px_rgba(10,132,255,0.1)] overflow-hidden">
            <button
              onClick={() => setProModalOpen(false)}
              className="absolute top-6 right-6 bg-[#222224] text-[#86868b] hover:text-[#f5f5f7] w-8 h-8 rounded-full flex items-center justify-center transition border border-white/5"
            >
              ✕
            </button>

            <div className="text-center mb-6 pt-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 inline-block mb-3 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                ⚡ UNLOCK EXECUTIVE PRO
              </span>
              <h3 className="text-2xl font-bold text-[#f5f5f7] mb-2 tracking-tight">Upgrade to Pro</h3>
              <p className="text-sm text-[#86868b]">
                {proReason || "Unlock all executive tools and unlimited generations."}
              </p>
            </div>

            <div className="space-y-3 mb-8 text-sm text-[#f5f5f7]">
              <div className="p-3.5 rounded-xl bg-[#1c1c1e] border border-white/5 flex items-center gap-3 shadow-inner">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <strong>Unlimited Generations</strong> (No 5/day limit)
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1c1c1e] border border-white/5 flex items-center gap-3 shadow-inner">
                <span className="text-purple-400 font-bold">✓</span>
                <span>
                  <strong>3-Step Outreach Sequence Generator</strong>
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1c1c1e] border border-white/5 flex items-center gap-3 shadow-inner">
                <span className="text-[#0a84ff] font-bold">✓</span>
                <span>
                  <strong>A/B Split Testing & Multi-Vertical Batching</strong>
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1c1c1e] border border-white/5 flex items-center gap-3 shadow-inner">
                <span className="text-amber-400 font-bold">✓</span>
                <span>
                  <strong>Custom Presets & 1-Click CRM Exports</strong>
                </span>
              </div>
            </div>

            <Link
              href="/pricing"
              className="w-full py-4 bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold rounded-2xl text-center block transition shadow-[0_0_20px_rgba(10,132,255,0.3)] ring-1 ring-[#0a84ff]/50"
            >
              View Pro Plans (Starter, Growth, Enterprise)
            </Link>

            <p className="text-[11px] text-center text-[#86868b] mt-4 font-medium">Powered by Lemon Squeezy • Cancel anytime</p>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xl p-0 sm:p-4">
          <div className="bg-[#141415] border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] p-6 max-w-2xl w-full h-[85vh] sm:max-h-[80vh] flex flex-col relative shadow-[0_0_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-[#f5f5f7]">Saved History</h3>
                <p className="text-sm text-[#86868b]">Search, copy, or export past content.</p>
              </div>
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="bg-[#222224] border border-white/5 text-[#86868b] hover:text-[#f5f5f7] w-8 h-8 rounded-full flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="py-3 flex items-center justify-between border-b border-white/5 text-xs text-[#86868b] font-medium">
              <span>{savedHistory.length} saved records</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportHistory("txt")}
                  className="px-3 py-1.5 rounded-full bg-[#1c1c1e] border border-white/5 hover:bg-[#222224] text-[#f5f5f7] transition"
                >
                  Export TXT {!isPro && "🔒"}
                </button>
                <button
                  onClick={() => exportHistory("csv")}
                  className="px-3 py-1.5 rounded-full bg-[#0a84ff]/10 border border-[#0a84ff]/20 text-[#0a84ff] hover:bg-[#0a84ff]/20 transition"
                >
                  Export CSV {!isPro && "🔒"}
                </button>
              </div>
            </div>

            <div className="py-4">
              <input
                type="text"
                placeholder="Search history..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full bg-[#1c1c1e] border border-white/5 text-[#f5f5f7] rounded-xl p-3.5 text-sm outline-none placeholder-[#86868b] focus:ring-2 focus:ring-[#0a84ff]/50 transition shadow-inner"
              />
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12 text-[#86868b] text-sm font-medium">No saved content found.</div>
              ) : (
                filteredHistory.map((item) => (
                  <div key={item.id} className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-5 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#86868b] border-b border-white/5 pb-2 uppercase tracking-wider">
                      <span>
                        {item.email_type} ({item.language})
                      </span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>

                    <p className="text-sm font-semibold text-[#f5f5f7] truncate">{item.subject_line}</p>
                    <p className="text-sm text-[#86868b] line-clamp-3 whitespace-pre-wrap">{item.body}</p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openInGmail(item.subject_line, item.body)}
                          className="text-xs font-medium bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#ff3b30] px-3 py-1.5 rounded-full hover:bg-[#ff3b30]/20 transition"
                        >
                          Gmail
                        </button>
                        <button
                          onClick={() => copyBody(item.body)}
                          className="text-xs font-medium bg-[#f5f5f7] text-black px-3 py-1.5 rounded-full hover:bg-white transition shadow-sm"
                        >
                          Copy
                        </button>
                      </div>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="text-xs font-medium text-[#86868b] hover:text-[#ff3b30] transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4">
          <div className="bg-[#141415] border border-white/10 rounded-[2rem] p-8 max-w-sm w-full relative shadow-[0_0_80px_rgba(10,132,255,0.1)]">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-6 right-6 bg-[#222224] text-[#86868b] hover:text-[#f5f5f7] w-8 h-8 rounded-full flex items-center justify-center transition border border-white/5"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold tracking-tight text-[#f5f5f7] mb-2">{isSignUp ? "Create Account" : "Log In"}</h3>
            <p className="text-sm text-[#86868b] mb-6">Get 5 free AI generations every day.</p>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-[#1c1c1e] border border-white/5 text-[#f5f5f7] rounded-xl p-4 text-sm outline-none placeholder-[#86868b] focus:ring-2 focus:ring-[#0a84ff]/50 transition shadow-inner"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-[#1c1c1e] border border-white/5 text-[#f5f5f7] rounded-xl p-4 text-sm outline-none placeholder-[#86868b] focus:ring-2 focus:ring-[#0a84ff]/50 transition shadow-inner"
                />
              </div>
              {authMessage && (
                <p className="text-sm font-medium text-[#ff3b30] bg-[#ff3b30]/10 border border-[#ff3b30]/20 p-3 rounded-xl">{authMessage}</p>
              )}
              <button
                type="submit"
                className="w-full bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold py-4 rounded-xl text-sm transition shadow-[0_0_20px_rgba(10,132,255,0.3)] ring-1 ring-[#0a84ff]/50 mt-2"
              >
                {isSignUp ? "Sign Up" : "Log In"}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthMessage("");
                }}
                className="text-sm font-medium text-[#0a84ff] hover:text-[#0071e3] transition"
              >
                {isSignUp ? "Already have an account? Log In" : "Need an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-sm font-medium text-[#86868b]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 WriteYourEmail. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-[#f5f5f7] transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#f5f5f7] transition">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}