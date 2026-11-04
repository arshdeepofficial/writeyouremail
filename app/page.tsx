"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const PRO_CHECKOUT_BASE_URL =
  "https://writeyouremail.lemonsqueezy.com/checkout/buy/8de4d383-5177-4977-8066-de6872cdb69d";

// Deliverability Spam Word Dictionary
const SPAM_TRIGGER_DICTIONARY: Record<string, string> = {
  "100% free": "complimentary",
  "act now": "at your earliest convenience",
  "guaranteed results": "proven outcomes",
  "make money": "generate revenue",
  "no risk": "low risk",
  "click here": "view details here",
  "buy now": "get started",
  "special promotion": "exclusive opportunity",
  "risk-free": "seamless trial",
  "earn extra cash": "increase revenue",
};

interface Preset {
  id: string;
  title: string;
  emailType: string;
  tone: string;
  context: string;
}

interface SavedEmail {
  id: string;
  subject: string;
  body: string;
  type: string;
  created_at: string;
}

export default function Home() {
  // Auth & User States
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [guestUsage, setGuestUsage] = useState<number>(0);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authMessage, setAuthMessage] = useState<string>("");

  // Studio Mode State
  const [mode, setMode] = useState<
    "create" | "polish" | "reply" | "sequence" | "ab_test" | "batch" | "csv_bulk" | "classifier"
  >("create");

  // Advanced Form Inputs
  const [emailType, setEmailType] = useState<string>("Cold Outreach / Sales");
  const [tone, setTone] = useState<string>("Professional & Direct");
  const [recipientName, setRecipientName] = useState<string>("");
  const [prospectBio, setProspectBio] = useState<string>("");
  const [brandVoice, setBrandVoice] = useState<string>("");
  const [targetIcp, setTargetIcp] = useState<string>("CEO / Founder");
  const [context, setContext] = useState<string>(
    "Pitching SaaS tool. Goal is to book a 15-min demo call."
  );
  const [existingDraft, setExistingDraft] = useState<string>("");
  const [incomingReply, setIncomingReply] = useState<string>("");
  const [csvLeadsInput, setCsvLeadsInput] = useState<string>(
    "John Doe, CEO, Acme Corp, Scaled ARR to 10M\nSarah Smith, CTO, TechLabs, Hiring AI Engineers"
  );
  const [includeSignature, setIncludeSignature] = useState<boolean>(false);
  const [useCrmTags, setUseCrmTags] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("English (US)");

  // Preset & History States
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetTitle, setPresetTitle] = useState<string>("");
  const [showSavePresetModal, setShowSavePresetModal] = useState<boolean>(false);
  const [savedEmails, setSavedEmails] = useState<SavedEmail[]>([]);

  // Generation & Output States
  const [loading, setLoading] = useState<boolean>(false);
  const [outputSubject, setOutputSubject] = useState<string>("");
  const [outputBody, setOutputBody] = useState<string>("");
  const [outputSequence, setOutputSequence] = useState<{ day1: string; day3: string; day7: string } | null>(null);
  const [outputAbTest, setOutputAbTest] = useState<{ variantA: string; variantB: string } | null>(null);
  const [outputBatch, setOutputBatch] = useState<{ saas: string; agency: string; ecom: string } | null>(null);
  const [outputBulkLeads, setOutputBulkLeads] = useState<{ lead: string; email: string }[] | null>(null);
  const [outputClassification, setOutputClassification] = useState<{
    intent: string;
    sentimentScore: number;
    recommendedAction: string;
    replyStrategy: string;
  } | null>(null);

  // Quality Engine Metrics
  const [spamScore, setSpamScore] = useState<number>(0);
  const [detectedSpamWords, setDetectedSpamWords] = useState<string[]>([]);
  const [readingGrade, setReadingGrade] = useState<string>("Grade 6");
  const [copiedSubject, setCopiedSubject] = useState<boolean>(false);
  const [copiedBody, setCopiedBody] = useState<boolean>(false);
  const [showProUpgradeModal, setShowProUpgradeModal] = useState<boolean>(false);

  const outputRef = useRef<HTMLDivElement>(null);

  // Load User Session & Quotas
  useEffect(() => {
    const localGuest = localStorage.getItem("guest_email_usage");
    if (localGuest) setGuestUsage(parseInt(localGuest, 10));

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          fetchUserData(session.user.id);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchUserData(session.user.id);
        } else {
          setUser(null);
          setIsPro(false);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    if (!supabase) return;
    const { data: usage } = await supabase.from("usage_tracking").select("count, is_pro").eq("user_id", userId).single();
    if (usage) {
      setUsageCount(usage.count || 0);
      setIsPro(usage.is_pro || false);
    }
    const { data: history } = await supabase.from("emails").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10);
    if (history) setSavedEmails(history);
    const { data: userPresets } = await supabase.from("email_presets").select("*").eq("user_id", userId);
    if (userPresets) setPresets(userPresets);
  };

  useEffect(() => {
    const textToAnalyze = `${outputSubject} ${outputBody}`;
    const foundSpam: string[] = [];
    Object.keys(SPAM_TRIGGER_DICTIONARY).forEach((word) => {
      if (textToAnalyze.toLowerCase().includes(word.toLowerCase())) foundSpam.push(word);
    });
    setDetectedSpamWords(foundSpam);
    setSpamScore(Math.min(100, foundSpam.length * 25));

    const words = textToAnalyze.trim().split(/\s+/).length;
    if (words < 30) setReadingGrade("Grade 4 (Very Easy)");
    else if (words < 80) setReadingGrade("Grade 6 (Optimal Sales)");
    else setReadingGrade("Grade 9 (Formal)");
  }, [outputSubject, outputBody]);

  const handleAutoSanitize = () => {
    let sanitizedSubject = outputSubject;
    let sanitizedBody = outputBody;
    Object.entries(SPAM_TRIGGER_DICTIONARY).forEach(([badWord, cleanWord]) => {
      const regex = new RegExp(badWord, "gi");
      sanitizedSubject = sanitizedSubject.replace(regex, cleanWord);
      sanitizedBody = sanitizedBody.replace(regex, cleanWord);
    });
    setOutputSubject(sanitizedSubject);
    setOutputBody(sanitizedBody);
  };

  const checkCanGenerate = (): boolean => {
    if (isPro) return true;
    if (!user) {
      if (guestUsage >= 2) {
        setShowProUpgradeModal(true);
        return false;
      }
      return true;
    }
    if (usageCount >= 5) {
      setShowProUpgradeModal(true);
      return false;
    }
    return true;
  };

  const incrementUsageAfterSuccess = async () => {
    if (isPro) return;
    if (!user) {
      const newGuest = guestUsage + 1;
      setGuestUsage(newGuest);
      localStorage.setItem("guest_email_usage", newGuest.toString());
    } else if (supabase) {
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      await supabase.from("usage_tracking").update({ count: newCount }).eq("user_id", user.id);
    }
  };

  const handleGenerate = async () => {
    if (!checkCanGenerate()) return;

    setLoading(true);
    setOutputSubject("");
    setOutputBody("");
    setOutputSequence(null);
    setOutputAbTest(null);
    setOutputBatch(null);
    setOutputBulkLeads(null);
    setOutputClassification(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          emailType,
          tone,
          recipientName: useCrmTags ? "{{first_name}}" : recipientName,
          prospectBio,
          brandVoice: isPro ? brandVoice : "",
          targetIcp,
          context,
          existingDraft,
          incomingReply,
          csvLeadsInput,
          includeSignature,
          language,
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      if (mode === "sequence") setOutputSequence(data.sequence);
      else if (mode === "ab_test") setOutputAbTest(data.abTest);
      else if (mode === "batch") setOutputBatch(data.batch);
      else if (mode === "csv_bulk") setOutputBulkLeads(data.bulkLeads);
      else if (mode === "classifier") {
        setOutputClassification(data.classification);
        setOutputSubject(data.subject || "Re: Prospect Inquiry");
        setOutputBody(data.body || "");
      } else {
        setOutputSubject(data.subject || "");
        setOutputBody(data.body || "");
      }

      await incrementUsageAfterSuccess();

      if (user && supabase && (data.subject || data.body)) {
        const { data: savedRecord } = await supabase
          .from("emails")
          .insert({
            user_id: user.id,
            subject: data.subject || `${mode.toUpperCase()} Email Result`,
            body: data.body || JSON.stringify(data),
            type: emailType,
          })
          .select()
          .single();
        if (savedRecord) setSavedEmails([savedRecord, ...savedEmails.slice(0, 9)]);
      }

      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (err: any) {
      console.error("AI Generation Failed silently:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setAuthLoading(true);
    setAuthMessage("");
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
        if (error) throw error;
        setAuthMessage("Account created! Check email or log in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
        if (error) throw error;
        setShowAuthModal(false);
      }
    } catch (err: any) {
      setAuthMessage(err.message || "Authentication error.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setIsPro(false);
  };

  const handleSavePreset = async () => {
    if (!presetTitle) return;
    const newPreset: Preset = { id: Date.now().toString(), title: presetTitle, emailType, tone, context };
    if (user && supabase) {
      await supabase.from("email_presets").insert({
        user_id: user.id, title: presetTitle, email_type: emailType, tone, context,
      });
    }
    setPresets([...presets, newPreset]);
    setPresetTitle("");
    setShowSavePresetModal(false);
  };

  const exportHistoryCSV = () => {
    if (!isPro) {
      setShowProUpgradeModal(true);
      return;
    }
    const headers = ["Subject", "Body", "Type", "Date"];
    const rows = savedEmails.map((e) => [
      `"${e.subject.replace(/"/g, '""')}"`, `"${e.body.replace(/"/g, '""')}"`, `"${e.type}"`, `"${e.created_at}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `WriteYourEmail_History_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getProCheckoutUrl = () => {
    if (user?.id) {
      return `${PRO_CHECKOUT_BASE_URL}?checkout[custom][user_id]=${user.id}&checkout[email]=${encodeURIComponent(user.email || "")}`;
    }
    return PRO_CHECKOUT_BASE_URL;
  };

  return (
    <div className="relative w-full overflow-x-hidden min-h-screen bg-[#000000] text-[#f5f5f7] selection:bg-[#0a84ff] selection:text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-gradient-to-b from-[#0a84ff]/15 via-purple-600/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <header className="sticky top-0 z-50 bg-[#000000]/70 backdrop-blur-2xl border-b border-white/10 saturate-150">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 font-semibold tracking-tight text-lg">
            <span className="w-7 h-7 bg-gradient-to-br from-[#0a84ff] to-purple-600 text-white flex items-center justify-center font-bold text-sm rounded-lg shadow-md">✉️</span>
            <span className="text-[#f5f5f7]">WriteYourEmail</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">v6.0 Ultra</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm text-[#86868b] font-medium">
            <a href="#generator" className="hover:text-[#f5f5f7] transition">Studio</a>
            <a href="#presets" className="hover:text-[#f5f5f7] transition">Presets</a>
            <Link href="/pricing" className="hover:text-[#f5f5f7] transition">Pricing</Link>
          </nav>

          <div className="flex items-center space-x-3">
            {isPro ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <span>⚡ PRO UNLIMITED</span>
              </span>
            ) : (
              <button onClick={() => setShowProUpgradeModal(true)} className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#0a84ff] hover:bg-[#0071e3] text-white transition shadow-sm">
                Upgrade ($9/mo)
              </button>
            )}
            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
                <span className="text-xs text-[#86868b] hidden sm:inline">{user.email}</span>
                <button onClick={handleLogout} className="text-xs font-medium text-[#86868b] hover:text-[#f5f5f7] transition">Log Out</button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] text-[#f5f5f7] border border-white/10 transition">Sign In</button>
            )}
          </div>
        </div>
      </header>

      <section className="pt-16 pb-10 px-6 max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#86868b] mb-6 shadow-sm">
          <span>🔥 World's Most Advanced AI Sales Communication Studio</span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f5f5f7] mb-6 leading-tight">
          Write emails that get <br />
          <span className="bg-gradient-to-r from-[#0a84ff] via-purple-400 to-amber-300 bg-clip-text text-transparent">opened, read & replied to.</span>
        </h1>
        <p className="text-[#86868b] text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          Generates high-converting cold outreach, 3-step sequences, A/B tests, bulk lead personalizations, and AI rebuttal handlers engineered to land in the inbox.
        </p>

        <div className="mt-6 inline-flex items-center gap-4 px-4 py-2 rounded-2xl bg-[#1c1c1e] border border-white/10 text-xs font-semibold text-[#86868b]">
          {isPro ? (
            <span className="text-amber-300 flex items-center gap-1.5"><span>⚡</span> Unlimited Executive Generations Active</span>
          ) : user ? (
            <span>Daily Usage: <strong className="text-white">{usageCount} / 5</strong> Free Credits Used</span>
          ) : (
            <span>Guest Usage: <strong className="text-white">{guestUsage} / 2</strong> Free Preview Credits</span>
          )}
        </div>
      </section>

      <section id="generator" className="pb-20 px-4 sm:px-6 max-w-5xl mx-auto relative z-10">
        <div className="bg-[#1c1c1e]/90 border border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl backdrop-blur-3xl">
          
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-[#000000]/60 p-2 rounded-2xl border border-white/5">
            {[
              { id: "create", label: "✨ Cold Email" },
              { id: "sequence", label: "🔄 3-Step Sequence", pro: true },
              { id: "csv_bulk", label: "📊 Bulk CSV Leads", pro: true },
              { id: "classifier", label: "🎯 Reply Classifier", pro: true },
              { id: "ab_test", label: "🧪 A/B Split Test" },
              { id: "batch", label: "🏢 Multi-Vertical" },
              { id: "reply", label: "🥊 Rebuttal Studio" },
              { id: "polish", label: "🪄 Magic Polish" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.pro && !isPro) setShowProUpgradeModal(true);
                  else setMode(tab.id as any);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  mode === tab.id ? "bg-[#0a84ff] text-white shadow-md" : "text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/5"
                }`}
              >
                <span>{tab.label}</span>
                {tab.pro && !isPro && <span className="text-[10px] text-amber-300 font-bold">PRO</span>}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {mode === "csv_bulk" && (
              <div className="bg-[#000000]/40 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400">Bulk Leads Input (CSV / Lines)</label>
                  <span className="text-[11px] text-[#86868b]">Format: Name, Title, Company, Bio</span>
                </div>
                <textarea rows={4} value={csvLeadsInput} onChange={(e) => setCsvLeadsInput(e.target.value)} placeholder="John Doe, CEO, Acme Corp, Scaled ARR to 10M&#10;Sarah Smith, CTO, TechLabs, Hiring AI Engineers" className="w-full bg-[#1c1c1e] border border-white/10 rounded-xl p-3 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#0a84ff]" />
              </div>
            )}

            {mode === "classifier" && (
              <div className="bg-[#000000]/40 p-5 rounded-2xl border border-white/10 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-purple-400">Paste Incoming Prospect Email / Objection</label>
                <textarea rows={4} value={incomingReply} onChange={(e) => setIncomingReply(e.target.value)} placeholder="e.g., 'Sounds interesting, but we don't have budget for this until Q4. Send me pricing breakdown later.'" className="w-full bg-[#1c1c1e] border border-white/10 rounded-xl p-3 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#0a84ff]" />
              </div>
            )}

            {mode === "polish" && (
              <div className="bg-[#000000]/40 p-5 rounded-2xl border border-white/10 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0a84ff]">Existing Raw Email Draft</label>
                <textarea rows={4} value={existingDraft} onChange={(e) => setExistingDraft(e.target.value)} placeholder="Paste your existing messy draft here to optimize tone, clarity, and deliverability..." className="w-full bg-[#1c1c1e] border border-white/10 rounded-xl p-3 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#0a84ff]" />
              </div>
            )}

            {mode !== "csv_bulk" && mode !== "classifier" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-2">Target ICP Persona</label>
                  <select value={targetIcp} onChange={(e) => setTargetIcp(e.target.value)} className="w-full bg-[#2c2c2e] border border-white/10 rounded-xl p-3 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#0a84ff]">
                    <option value="CEO / Founder">CEO / Founder / Managing Director</option>
                    <option value="CTO / VP of Engineering">CTO / VP of Engineering</option>
                    <option value="CFO / Finance Director">CFO / Finance Director</option>
                    <option value="Head of Sales / CRO">Head of Sales / CRO</option>
                    <option value="HR / Talent Director">HR / Talent Acquisition Director</option>
                    <option value="Marketing Executive">CMO / Marketing Director</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-2">Email Purpose</label>
                  <select value={emailType} onChange={(e) => setEmailType(e.target.value)} className="w-full bg-[#2c2c2e] border border-white/10 rounded-xl p-3 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#0a84ff]">
                    <option value="Cold Outreach / Sales">Cold Outreach / Sales Pitch</option>
                    <option value="Meeting Request / Booking">Meeting Request / Demo Booking</option>
                    <option value="Partnership / Co-Marketing">Partnership & Collaboration</option>
                    <option value="Job Inquiry / Executive Referral">Job Inquiry & Candidate Pitch</option>
                    <option value="Investor Pitch / Raising Capital">Investor Pitch & Fundraising</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-2">Tone of Voice</label>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-[#2c2c2e] border border-white/10 rounded-xl p-3 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#0a84ff]">
                    <option value="Professional & Direct">Professional & Direct</option>
                    <option value="C-Suite Brief (<75 words)">C-Suite Brief (&lt;75 words)</option>
                    <option value="Casual & Conversational">Casual & Conversational</option>
                    <option value="High-Converting Aggressive">Direct Response / High Converting</option>
                    <option value="Warm & Consultative">Warm & Consultative</option>
                  </select>
                </div>
              </div>
            )}

            {mode !== "csv_bulk" && mode !== "classifier" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-2">Recipient Name / Tag</label>
                  <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} disabled={useCrmTags} placeholder="e.g. Alex Rivera" className="w-full bg-[#2c2c2e] border border-white/10 rounded-xl p-3 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#0a84ff] disabled:opacity-50" />
                  <div className="mt-2 flex items-center gap-2">
                    <input type="checkbox" id="crmTagToggle" checked={useCrmTags} onChange={(e) => setUseCrmTags(e.target.checked)} className="rounded bg-[#2c2c2e] border-white/10 text-[#0a84ff] focus:ring-0" />
                    <label htmlFor="crmTagToggle" className="text-xs text-[#86868b]">Use CRM Tag <code className="text-[#0a84ff] bg-white/5 px-1.5 py-0.5 rounded">{"{{first_name}}"}</code></label>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Brand Voice DNA</label>
                    {!isPro && <span className="text-[10px] text-amber-300 font-bold">PRO REQUIRED</span>}
                  </div>
                  <input type="text" value={brandVoice} onChange={(e) => setBrandVoice(e.target.value)} disabled={!isPro} placeholder={isPro ? "e.g. Concise, data-driven, casual tone" : "🔒 Pro Mode Feature"} className="w-full bg-[#2c2c2e] border border-white/10 rounded-xl p-3 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#0a84ff] disabled:opacity-40" />
                </div>
              </div>
            )}

            {mode !== "csv_bulk" && mode !== "classifier" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Context & Value Pitch Goal</label>
                  <button onClick={() => setShowSavePresetModal(true)} className="text-xs font-semibold text-[#0a84ff] hover:underline">Save as Preset</button>
                </div>
                <textarea rows={3} value={context} onChange={(e) => setContext(e.target.value)} placeholder="State your offer, social proof, key metrics, and call to action..." className="w-full bg-[#2c2c2e] border border-white/10 rounded-xl p-3.5 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#0a84ff]" />
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/5">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Output Language:</span>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-[#2c2c2e] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#f5f5f7] focus:outline-none">
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="German (Direct)">German (Formal)</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Japanese (Keigo)">Japanese (Formal)</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="sigCheck" checked={includeSignature} onChange={(e) => setIncludeSignature(e.target.checked)} className="rounded bg-[#2c2c2e] border-white/10 text-[#0a84ff]" />
                <label htmlFor="sigCheck" className="text-xs text-[#86868b]">Attach HTML Signature & DocuSign Embed</label>
              </div>
            </div>

            <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-[#0a84ff] to-purple-600 hover:opacity-95 text-white font-bold py-4 rounded-2xl text-base transition shadow-xl flex items-center justify-center gap-2 transform active:scale-[0.99]">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  <span>Engaging AI Pipeline...</span>
                </>
              ) : (
                <span>🚀 Generate Sales Communication</span>
              )}
            </button>
          </div>
        </div>
      </section>

      <section ref={outputRef} className="pb-24 px-4 sm:px-6 max-w-5xl mx-auto relative z-10">
        {(outputSubject || outputBody || outputSequence || outputAbTest || outputBatch || outputBulkLeads || outputClassification) && (
          <div className="bg-[#1c1c1e] border border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-[#f5f5f7] flex items-center gap-2">
                  <span>✨ AI Generated Result</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Ready to Send</span>
                </h3>
              </div>
              <div className="flex items-center space-x-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#86868b]">Deliverability Risk:</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md ${spamScore === 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-300"}`}>
                    {spamScore === 0 ? "0% (Inbox Safe)" : `${spamScore}% Risk (${detectedSpamWords.length} triggers)`}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-[#86868b]">Readability:</span>
                  <span className="text-[#f5f5f7] font-semibold">{readingGrade}</span>
                </div>
                {detectedSpamWords.length > 0 && (
                  <button onClick={handleAutoSanitize} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1">
                    ⚡ Auto-Sanitize Draft
                  </button>
                )}
              </div>
            </div>

            {outputClassification && (
              <div className="mb-6 p-5 rounded-2xl bg-[#000000]/60 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">AI Intent Analysis</span>
                  <span className="text-xs text-[#86868b]">Sentiment Score: <strong className="text-white">{outputClassification.sentimentScore}/100</strong></span>
                </div>
                <h4 className="text-lg font-bold text-white">{outputClassification.intent}</h4>
                <p className="text-xs text-[#86868b] leading-relaxed"><strong>Recommended Action:</strong> {outputClassification.recommendedAction}</p>
              </div>
            )}

            {(outputSubject || outputBody) && !outputSequence && !outputAbTest && !outputBatch && !outputBulkLeads && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Subject Line</span>
                    <button onClick={() => { navigator.clipboard.writeText(outputSubject); setCopiedSubject(true); setTimeout(() => setCopiedSubject(false), 2000); }} className="text-xs text-[#0a84ff] font-semibold hover:underline">
                      {copiedSubject ? "Copied!" : "Copy Subject"}
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-[#2c2c2e] text-[#f5f5f7] font-semibold text-sm border border-white/5">{outputSubject}</div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Email Body</span>
                    <button onClick={() => { navigator.clipboard.writeText(outputBody); setCopiedBody(true); setTimeout(() => setCopiedBody(false), 2000); }} className="text-xs text-[#0a84ff] font-semibold hover:underline">
                      {copiedBody ? "Copied!" : "Copy Body"}
                    </button>
                  </div>
                  <div className="p-5 rounded-xl bg-[#2c2c2e] text-[#f5f5f7] text-sm whitespace-pre-wrap leading-relaxed border border-white/5 font-sans">{outputBody}</div>
                </div>
              </div>
            )}

            {/* RESTORED: A/B Test Output UI */}
            {outputAbTest && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-[#2c2c2e] border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0a84ff]">Variant A: Metrics & Social Proof</span>
                    <button onClick={() => navigator.clipboard.writeText(outputAbTest.variantA)} className="text-xs text-[#86868b] hover:text-white">Copy Variant A</button>
                  </div>
                  <div className="text-sm text-[#f5f5f7] whitespace-pre-wrap leading-relaxed">{outputAbTest.variantA}</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#2c2c2e] border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Variant B: Pain-Point & Agitation</span>
                    <button onClick={() => navigator.clipboard.writeText(outputAbTest.variantB)} className="text-xs text-[#86868b] hover:text-white">Copy Variant B</button>
                  </div>
                  <div className="text-sm text-[#f5f5f7] whitespace-pre-wrap leading-relaxed">{outputAbTest.variantB}</div>
                </div>
              </div>
            )}

            {/* RESTORED: Multi-Vertical Batch Output UI */}
            {outputBatch && (
              <div className="space-y-6">
                {[
                  { title: "SaaS / Tech Vertical", content: outputBatch.saas, color: "text-[#0a84ff]" },
                  { title: "Agency / Services Vertical", content: outputBatch.agency, color: "text-purple-400" },
                  { title: "E-Commerce / Retail Vertical", content: outputBatch.ecom, color: "text-amber-400" },
                ].map((batch, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#2c2c2e] border border-white/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold uppercase tracking-wider ${batch.color}`}>{batch.title}</span>
                      <button onClick={() => navigator.clipboard.writeText(batch.content)} className="text-xs text-[#86868b] hover:text-white">Copy Version</button>
                    </div>
                    <div className="text-sm text-[#f5f5f7] whitespace-pre-wrap leading-relaxed">{batch.content}</div>
                  </div>
                ))}
              </div>
            )}

            {outputSequence && (
              <div className="space-y-6">
                {[
                  { step: "Day 1: Initial Touchpoint", content: outputSequence.day1 },
                  { step: "Day 3: Value Add Follow-up", content: outputSequence.day3 },
                  { step: "Day 7: Breakup / Final Call", content: outputSequence.day7 },
                ].map((seq, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#2c2c2e] border border-white/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0a84ff]">{seq.step}</span>
                      <button onClick={() => navigator.clipboard.writeText(seq.content)} className="text-xs text-[#86868b] hover:text-white">Copy Step</button>
                    </div>
                    <div className="text-sm text-[#f5f5f7] whitespace-pre-wrap leading-relaxed">{seq.content}</div>
                  </div>
                ))}
              </div>
            )}

            {outputBulkLeads && (
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Bulk Personalization Results ({outputBulkLeads.length} Leads)</span>
                {outputBulkLeads.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#2c2c2e] border border-white/5 space-y-2">
                    <span className="text-xs font-bold text-[#0a84ff]">{item.lead}</span>
                    <p className="text-xs text-[#f5f5f7] whitespace-pre-wrap">{item.email}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-[#86868b]">Save emails to export CRM campaign packages.</span>
              <button onClick={exportHistoryCSV} className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#f5f5f7] border border-white/10 transition flex items-center gap-1.5">
                <span>📥 Export History (CSV)</span>
              </button>
            </div>
          </div>
        )}
      </section>

      <section id="presets" className="pb-20 px-6 max-w-5xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#f5f5f7]">Saved Context Presets</h3>
          <span className="text-xs text-[#86868b]">{presets.length} Presets Available</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {presets.length === 0 ? (
            <div className="col-span-3 p-8 text-center bg-[#1c1c1e] rounded-2xl border border-white/5 text-xs text-[#86868b]">
              No custom presets saved yet. Click "Save as Preset" in the generator context box to save your workflow.
            </div>
          ) : (
            presets.map((preset) => (
              <div key={preset.id} onClick={() => { setEmailType(preset.emailType); setTone(preset.tone); setContext(preset.context); }} className="p-4 bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-white/5 rounded-2xl cursor-pointer transition">
                <h4 className="text-sm font-bold text-[#f5f5f7] mb-1">{preset.title}</h4>
                <p className="text-xs text-[#86868b] line-clamp-2">{preset.context}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 text-center text-xs text-[#86868b]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 WriteYourEmail. Built for High Performers.</p>
          <div className="flex space-x-6">
            <Link href="/pricing" className="hover:text-white transition">Pricing Plans</Link>
            <a href="#generator" className="hover:text-white transition">Back to Studio</a>
          </div>
        </div>
      </footer>

      {showSavePresetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-[#f5f5f7]">Save Context Preset</h3>
            <input type="text" placeholder="Preset Title (e.g., SaaS Demo Pitch)" value={presetTitle} onChange={(e) => setPresetTitle(e.target.value)} className="w-full bg-[#2c2c2e] border border-white/10 rounded-xl p-3 text-sm text-[#f5f5f7] focus:outline-none" />
            <div className="flex space-x-3 pt-2">
              <button onClick={() => setShowSavePresetModal(false)} className="w-full bg-[#2c2c2e] text-[#86868b] font-semibold py-2.5 rounded-xl text-xs">Cancel</button>
              <button onClick={handleSavePreset} className="w-full bg-[#0a84ff] text-white font-semibold py-2.5 rounded-xl text-xs">Save Preset</button>
            </div>
          </div>
        </div>
      )}

      {showProUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1c1e] border-2 border-[#0a84ff] rounded-[2.5rem] p-8 max-w-lg w-full text-center relative shadow-2xl space-y-6">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-block">⚡ UNLOCK GOD MODE</span>
            <h3 className="text-3xl font-bold text-[#f5f5f7]">Upgrade to Executive Pro</h3>
            <p className="text-sm text-[#86868b] leading-relaxed">You've reached your free usage quota limit. Upgrade now to unlock unlimited generations, 3-step follow-up sequences, bulk CSV personalization, and custom Brand Voice DNA.</p>
            <div className="space-y-3 text-left text-xs text-[#f5f5f7] bg-[#000000]/40 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2"><span className="text-[#34c759] font-bold">✓</span> Unlimited Daily AI Generations</div>
              <div className="flex items-center gap-2"><span className="text-purple-400 font-bold">✓</span> 3-Step Follow-Up Sequence Engine</div>
              <div className="flex items-center gap-2"><span className="text-amber-300 font-bold">✓</span> Bulk Lead CSV Personalization Generator</div>
              <div className="flex items-center gap-2"><span className="text-[#0a84ff] font-bold">✓</span> AI Reply Intent & Objection Classifier</div>
            </div>
            <a href={getProCheckoutUrl()} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#0a84ff] hover:bg-[#0071e3] text-white font-bold py-4 rounded-2xl text-sm transition shadow-lg">Upgrade Now ($9/month)</a>
            <button onClick={() => setShowProUpgradeModal(false)} className="text-xs text-[#86868b] hover:text-white">Continue with Free Features</button>
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-8 max-w-sm w-full space-y-5">
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#f5f5f7]">{isSignUp ? "Create Account" : "Welcome Back"}</h3>
              <p className="text-xs text-[#86868b] mt-1">{isSignUp ? "Sign up to unlock 5 free daily generations" : "Sign in to access your saved presets"}</p>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              <input type="email" placeholder="Work Email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-[#2c2c2e] border border-white/10 rounded-xl p-3 text-sm text-[#f5f5f7] focus:outline-none" />
              <input type="password" placeholder="Password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-[#2c2c2e] border border-white/10 rounded-xl p-3 text-sm text-[#f5f5f7] focus:outline-none" />
              {authMessage && <p className="text-xs text-amber-300 text-center">{authMessage}</p>}
              <button type="submit" disabled={authLoading} className="w-full bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold py-3 rounded-xl text-sm transition">{authLoading ? "Processing..." : isSignUp ? "Sign Up Free" : "Sign In"}</button>
            </form>
            <div className="text-center pt-2">
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-xs text-[#86868b] hover:text-white">{isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up Free"}</button>
            </div>
            <div className="text-center">
              <button onClick={() => setShowAuthModal(false)} className="text-xs text-[#55555d] hover:text-[#86868b]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
