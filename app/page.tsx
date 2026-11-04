"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LEMON_SQUEEZY_CHECKOUT = "https://writeyouremail.lemonsqueezy.com/checkout/buy/8de4d383-5177-4977-8066-de6872cdb69d";

const COMMON_SPAM_WORDS = [
  "100% free", "free", "guaranteed", "no cost", "risk-free", "act now",
  "click here", "urgent", "make money", "winner", "cash", "no obligation",
  "special promotion", "congratulations", "credit card", "order now"
];

interface SubjectLine {
  subject: string;
  spamRisk: string;
  score: number;
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

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Dutch", "Japanese", "Chinese (Simplified)", "Hindi", "Arabic",
  "Korean", "Russian", "Turkish", "Vietnamese", "Polish"
];

export default function Home() {
  const [studioMode, setStudioMode] = useState<"create" | "polish" | "sequence" | "reply">("create");
  const [emailType, setEmailType] = useState("cold_outreach");
  const [context, setContext] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [tone, setTone] = useState("professional");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [draftText, setDraftText] = useState("");
  const [polishGoal, setPolishGoal] = useState("Fix grammar, typos & improve flow");
  const [replyStrategy, setReplyStrategy] = useState("Value & ROI Reframing (Turn price into value)");
  const [incomingEmailText, setIncomingEmailText] = useState("");
  const [docuSignLink, setDocuSignLink] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [includeSignature, setIncludeSignature] = useState(false);
  const [senderTitle, setSenderTitle] = useState("");

  const [subjectLines, setSubjectLines] = useState<SubjectLine[]>([]);
  const [variations, setVariations] = useState<EmailVariation[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [proReason, setProReason] = useState("");
  const [savedHistory, setSavedHistory] = useState<SavedEmailRecord[]>([]);
  const [historySearch, setHistorySearch] = useState("");

  const [user, setUser] = useState<any>(null);
  const [dailyUsage, setDailyUsage] = useState<number>(0);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [guestUsage, setGuestUsage] = useState<number>(0);

  const [copiedSubject, setCopiedSubject] = useState<number | null>(null);
  const [copiedBody, setCopiedBody] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileMenuOpen || historyModalOpen || proModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen, historyModalOpen, proModalOpen]);

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
          id: item.id, created_at: item.created_at, email_type: item.email_type,
          subject_line: item.recipient || "Generated Email", body: item.generated_email, language: item.tone || "English",
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
    const primarySubject = subjects[0]?.subject || "Generated Email";
    const primaryBody = vars[0]?.body || "";
    const newRecord: SavedEmailRecord = {
      id: Date.now().toString(), created_at: new Date().toISOString(),
      email_type: studioMode === "sequence" ? "3-Step Sequence" : studioMode === "reply" ? "Objection Response" : (studioMode === "create" ? emailType : "Magic Polish"),
      subject_line: primarySubject, body: primaryBody, language: targetLanguage,
    };

    if (user) {
      try {
        await supabase.from("emails").insert({
          user_id: user.id, email_type: newRecord.email_type,
          context: studioMode === "create" || studioMode === "sequence" ? context : studioMode === "reply" ? incomingEmailText : draftText,
          recipient: primarySubject, sender: sender || "User", tone: targetLanguage, generated_email: primaryBody,
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
        `=== EMAIL #${idx + 1} (${new Date(item.created_at).toLocaleDateString()}) ===\nType: ${item.email_type}\nSubject: ${item.subject_line}\n\nBODY:\n${item.body}\n\n`
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
        user_id: user.id, count: nextUsage, last_reset: new Date().toISOString().split("T")[0], is_pro: isPro,
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
        triggerProModal("You have reached your 5 daily free emails! Upgrade to Pro for unlimited email generations.");
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
            brandVoice: isPro ? brandVoice : "",
            senderTitle: includeSignature ? senderTitle : "",
          }),
        });
        const data = await response.json();
        if (response.ok && data.variations && data.variations.length > 0) {
          setSubjectLines(data.subjectLines || []);
          setVariations(data.variations || []);
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

  const faqs = [
    {
      q: "What is WriteYourEmail?",
      a: "WriteYourEmail is an AI email engine that writes, translates (25+ languages), polishes drafts, handles prospect objections, and embeds DocuSign requests.",
    },
    {
      q: "Is there a free tier?",
      a: "Yes. Unregistered guests get 2 free emails. Registered users get 5 free emails every single day.",
    },
    {
      q: "What is included in the Pro plan?",
      a: "The Pro plan ($9/mo) gives you unlimited email generations, 3-step follow-up sequences, custom brand voice DNA, AI objection handler, live spam risk audit, and CSV/TXT history exports.",
    },
    {
      q: "How do I cancel my subscription?",
      a: "You can manage or cancel your subscription anytime via Lemon Squeezy with one click.",
    },
  ];

  return (
    <div
      className="relative w-full overflow-x-hidden min-h-screen bg-[#000000] text-[#f5f5f7] font-sans selection:bg-[#0a84ff] selection:text-white"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Apple Ambient Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-b from-[#0a84ff]/15 via-[#0a84ff]/5 to-transparent blur-[100px] pointer-events-none rounded-full" />

      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b border-white/10 transition-colors duration-300 ${
          mobileMenuOpen ? "bg-[#000000]" : "bg-[#000000]/70 backdrop-blur-2xl saturate-150"
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
              <span>WriteYourEmail</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6 text-sm text-[#86868b] font-medium">
              <a href="#generator" className="hover:text-[#f5f5f7] transition-colors">
                Products
              </a>
              <a href="#faq" className="hover:text-[#f5f5f7] transition-colors">
                Resources
              </a>
              <Link href="/pricing" className="hover:text-[#f5f5f7] transition-colors">
                Pricing
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isPro ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300">
                ⚡ PRO MEMBER
              </span>
            ) : (
              <button
                onClick={() =>
                  triggerProModal(
                    "Upgrade to Pro to unlock unlimited daily generations, 3-step outreach sequences, and custom brand voice."
                  )
                }
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1"
              >
                <span>🚀 Free Plan</span> — <span className="text-[#0a84ff] underline">Upgrade ($9/mo)</span>
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

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#000000] md:hidden pt-20 px-6 transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <nav className="flex flex-col text-lg font-medium text-[#f5f5f7]">
          <a href="#generator" onClick={() => setMobileMenuOpen(false)} className="border-b border-white/10 py-4">
            Products
          </a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="border-b border-white/10 py-4">
            Resources
          </a>
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

      {/* Hero */}
      <section className="relative pt-24 pb-20 px-6 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f5f5f7] leading-tight mb-6">
          Intelligence that closes deals.
        </h1>
        <p className="text-xl text-[#86868b] max-w-2xl mx-auto mb-10 font-medium">
          Generate sales pitches, 3-step outreach sequences, objection replies, e-signature requests with DocuSign, and multi-language emails instantly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="#generator"
            className="bg-[#f5f5f7] text-black hover:bg-white font-semibold px-8 py-3.5 rounded-full text-base transition shadow-sm w-full sm:w-auto"
          >
            Start Writing
          </a>
          <Link
            href="/pricing"
            className="bg-[#1c1c1e] hover:bg-[#2c2c2e] text-[#f5f5f7] font-semibold px-8 py-3.5 rounded-full text-base transition w-full sm:w-auto"
          >
            View Pricing ($9/mo)
          </Link>
        </div>
      </section>

      {/* Generator Workspace */}
      <section id="generator" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="bg-[#1c1c1e]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f5f5f7]">Email Studio v4.0 Pro</h2>
              <p className="text-sm text-[#86868b] mt-1">Includes Objection Handler & Deliverability Spam Audit.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setHistoryModalOpen(true)}
                className="text-sm px-4 py-2 bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-full text-[#f5f5f7] transition font-medium"
              >
                History ({savedHistory.length})
              </button>
              {!isPro && (
                <span className="text-sm px-4 py-2 bg-[#2c2c2e] rounded-full text-[#86868b] font-medium">
                  {user ? `${dailyUsage}/5 Free` : `${guestUsage}/2 Free`}
                </span>
              )}
            </div>
          </div>

          {/* Segmented Control */}
          <div className="flex items-center bg-[#2c2c2e] p-1 rounded-xl w-fit mb-8 overflow-x-auto max-w-full">
            <button
              onClick={() => setStudioMode("create")}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                studioMode === "create" ? "bg-[#636366] text-white shadow-sm" : "text-[#86868b] hover:text-[#f5f5f7]"
              }`}
            >
              Create New
            </button>
            <button
              onClick={() => setStudioMode("polish")}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                studioMode === "polish" ? "bg-[#636366] text-white shadow-sm" : "text-[#86868b] hover:text-[#f5f5f7]"
              }`}
            >
              Magic Polish
            </button>
            <button
              onClick={() => setStudioMode("reply")}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                studioMode === "reply" ? "bg-[#636366] text-white shadow-sm" : "text-[#86868b] hover:text-[#f5f5f7]"
              }`}
            >
              🥊 Objection Reply
            </button>
            <button
              onClick={() => {
                if (!isPro) {
                  triggerProModal("3-Step Outreach Sequence generator is a Pro exclusive feature.");
                } else {
                  setStudioMode("sequence");
                }
              }}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                studioMode === "sequence"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm"
                  : "text-[#86868b] hover:text-[#f5f5f7]"
              }`}
            >
              <span>🔁 3-Step Sequence</span>
              {!isPro && (
                <span className="text-[10px] bg-amber-500/30 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="max-w-xs">
              <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                Output Language
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#0a84ff] transition outline-none appearance-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Brand Voice DNA Input (Pro Feature) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider flex items-center gap-1.5">
                  <span>✍️ Custom Brand Voice DNA</span>
                  {!isPro && (
                    <span className="text-[10px] bg-amber-500/30 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded-full font-bold">
                      PRO
                    </span>
                  )}
                </label>
                {!isPro && (
                  <button
                    type="button"
                    onClick={() => triggerProModal("Custom Brand Voice DNA is a Pro feature.")}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Unlock Pro
                  </button>
                )}
              </div>
              <input
                type="text"
                disabled={!isPro}
                placeholder={
                  isPro
                    ? "e.g. Direct Silicon Valley executive, max 3 bullet points, sign off 'Warmly'"
                    : "🔒 Upgrade to Pro to enforce your unique personal brand voice"
                }
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                className={`w-full border-none rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#0a84ff] transition outline-none ${
                  isPro
                    ? "bg-[#2c2c2e] text-[#f5f5f7] placeholder-[#86868b]"
                    : "bg-[#2c2c2e]/50 text-[#86868b] cursor-not-allowed"
                }`}
              />
            </div>

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
                    className="w-full bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#0a84ff] transition outline-none placeholder-[#86868b] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                    Select Rebuttal / Reply Strategy
                  </label>
                  <select
                    value={replyStrategy}
                    onChange={(e) => setReplyStrategy(e.target.value)}
                    className="w-full bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#0a84ff] transition outline-none appearance-none cursor-pointer"
                  >
                    <option value="Value & ROI Reframing (Turn price into value)">Value & ROI Reframing (Turn cost into ROI)</option>
                    <option value="Soft 5-Minute Nudge (Low-friction short chat ask)">Soft 5-Minute Nudge (Low friction ask)</option>
                    <option value="Polite Breakup & Future Pivot (Ask for referral or later touchpoint)">Polite Breakup & Future Touchpoint</option>
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
                    placeholder="Paste your messy draft, notes, or contract text here..."
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    className="w-full bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#0a84ff] transition outline-none placeholder-[#86868b] resize-none"
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
                        className={`text-sm px-4 py-2 rounded-full transition font-medium ${
                          polishGoal === goal
                            ? "bg-[#0a84ff] text-white"
                            : "bg-[#2c2c2e] text-[#86868b] hover:text-[#f5f5f7]"
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                      Email Type
                    </label>
                    <select
                      value={emailType}
                      onChange={(e) => setEmailType(e.target.value)}
                      className="w-full bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#0a84ff] transition outline-none appearance-none cursor-pointer"
                    >
                      <option value="cold_outreach">Cold Outreach / Sales</option>
                      <option value="contract_pitch">Contract / Proposal Pitch (DocuSign)</option>
                      <option value="job_application">Job Application / Pitch</option>
                      <option value="follow_up">Follow Up</option>
                      <option value="resignation">Resignation / Transition</option>
                      <option value="custom">Custom Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                      Tone of Voice
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#0a84ff] transition outline-none appearance-none cursor-pointer"
                    >
                      <option value="professional">Professional & Direct</option>
                      <option value="persuasive">Persuasive & Confident</option>
                      <option value="friendly">Friendly & Warm</option>
                      <option value="urgent">Urgent & High Priority</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tim Cook"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#0a84ff] transition outline-none placeholder-[#86868b]"
                    />
                  </div>
                </div>

                {/* Signature Embed Controls */}
                <div className="bg-[#2c2c2e]/60 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider flex items-center gap-2">
                      <span>🖋️ HTML Email Signature Generator</span>
                    </label>
                    <input
                      type="checkbox"
                      checked={includeSignature}
                      onChange={(e) => setIncludeSignature(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#0a84ff] cursor-pointer"
                    />
                  </div>
                  {includeSignature && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <input
                        type="text"
                        placeholder="Sender Title (e.g. VP of Business Development)"
                        value={senderTitle}
                        onChange={(e) => setSenderTitle(e.target.value)}
                        className="bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-3 text-sm outline-none placeholder-[#86868b]"
                      />
                      <input
                        type="url"
                        placeholder="DocuSign / Pitch Link (Optional)"
                        value={docuSignLink}
                        onChange={(e) => setDocuSignLink(e.target.value)}
                        className="bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-3 text-sm outline-none placeholder-[#86868b]"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                    {studioMode === "sequence" ? "Sequence Context & Pitch Goal" : "Context & Main Points"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={
                      studioMode === "sequence"
                        ? "Pitching SaaS tool to Head of Marketing. Goal is to book a 15-min call."
                        : "What is the key goal of this email or contract request?"
                    }
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="w-full bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#0a84ff] transition outline-none placeholder-[#86868b] resize-none"
                  />
                </div>
              </>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <input
                type="text"
                placeholder="Your Name (Sender Signature)"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#0a84ff] transition outline-none placeholder-[#86868b] w-full sm:w-1/2"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md"
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
                      : studioMode === "reply"
                      ? "Generate Rebuttal"
                      : studioMode === "create"
                      ? "Generate Emails"
                      : "Magic Polish Draft"}
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Result Output Display */}
          {variations.length > 0 && (
            <div ref={resultRef} className="mt-12 pt-8 border-t border-white/10 space-y-8">
              {/* Deliverability & Spam Trigger Live Audit */}
              <div className="p-4 rounded-2xl bg-[#2c2c2e]/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛡️</span>
                  <div>
                    <p className="text-xs font-semibold text-[#f5f5f7]">Inbox Deliverability Audit</p>
                    <p className="text-xs text-[#86868b]">
                      {activeSpamTriggers.length === 0
                        ? "0 Spam Trigger Words Found. High Inbox Primary Rate."
                        : `Warning: ${activeSpamTriggers.length} spam trigger phrase(s) detected: [${activeSpamTriggers.join(", ")}]`}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                    activeSpamTriggers.length === 0
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {activeSpamTriggers.length === 0 ? "Inbox Ready (98/100)" : "Risk Detected"}
                </span>
              </div>

              {/* Subject Lines */}
              {subjectLines.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                    Subject Line Studio
                  </span>
                  <div className="space-y-2">
                    {subjectLines.map((subj, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#2c2c2e] p-4 rounded-2xl gap-3"
                      >
                        <span className="text-sm font-medium text-[#f5f5f7]">{subj.subject}</span>
                        <div className="flex items-center space-x-3 shrink-0">
                          <span
                            className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                              subj.score >= 90
                                ? "bg-[#34c759]/20 text-[#34c759]"
                                : "bg-[#ff9f0a]/20 text-[#ff9f0a]"
                            }`}
                          >
                            {subj.spamRisk}
                          </span>
                          <button
                            onClick={() => copySubject(subj.subject, idx)}
                            className="text-xs font-medium text-[#0a84ff] hover:text-[#0071e3] bg-[#0a84ff]/10 px-3 py-1.5 rounded-full transition"
                          >
                            {copiedSubject === idx ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variations / Sequence steps */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                    {targetLanguage} Output Options
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
                      className={`text-sm font-medium px-5 py-2 rounded-full transition ${
                        selectedTab === i
                          ? "bg-[#f5f5f7] text-black"
                          : "bg-[#2c2c2e] text-[#86868b] hover:text-[#f5f5f7]"
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>

                {/* 1-Click Persona Rewriter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pt-2">
                  <span className="text-xs text-[#86868b] font-medium shrink-0">Rewrite Persona:</span>
                  <button
                    onClick={() => handleGenerate(undefined, "Executive C-Suite Short & Concise")}
                    className="text-xs bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#f5f5f7] px-3 py-1.5 rounded-full transition shrink-0"
                  >
                    ⚡ C-Suite Brief (3 Sentences)
                  </button>
                  <button
                    onClick={() => handleGenerate(undefined, "Warm, Friendly & Casual")}
                    className="text-xs bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#f5f5f7] px-3 py-1.5 rounded-full transition shrink-0"
                  >
                    ☕ Warm & Casual
                  </button>
                  <button
                    onClick={() => handleGenerate(undefined, "Direct Response Aggressive Call to Action")}
                    className="text-xs bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#f5f5f7] px-3 py-1.5 rounded-full transition shrink-0"
                  >
                    🎯 Direct-Response CTA
                  </button>
                </div>

                <div className="relative bg-[#2c2c2e] rounded-2xl p-6 text-[#f5f5f7] font-sans leading-relaxed whitespace-pre-wrap text-[15px] shadow-inner mt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-4 border-b border-white/10">
                    <span className="text-xs font-medium text-[#34c759] flex items-center gap-1">✓ Auto-saved</span>

                    <div className="flex flex-wrap items-center gap-2">
                      {docuSignLink && (
                        <a
                          href={docuSignLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium bg-[#ff9f0a]/10 hover:bg-[#ff9f0a]/20 text-[#ff9f0a] px-4 py-2 rounded-full transition flex items-center gap-1"
                        >
                          🖋️ Test DocuSign Link
                        </a>
                      )}

                      <button
                        onClick={() =>
                          openInGmail(subjectLines[0]?.subject || "Email", variations[selectedTab]?.body)
                        }
                        className="text-xs font-medium bg-[#ff3b30]/10 hover:bg-[#ff3b30]/20 text-[#ff3b30] px-4 py-2 rounded-full transition"
                      >
                        Open in Gmail
                      </button>

                      <button
                        onClick={() =>
                          openInMailClient(subjectLines[0]?.subject || "Email", variations[selectedTab]?.body)
                        }
                        className="text-xs font-medium bg-[#0a84ff]/10 hover:bg-[#0a84ff]/20 text-[#0a84ff] px-4 py-2 rounded-full transition"
                      >
                        Mail App
                      </button>

                      <button
                        onClick={() => copyBody(variations[selectedTab]?.body)}
                        className="text-xs font-medium bg-[#f5f5f7] text-black hover:bg-white px-4 py-2 rounded-full transition shadow-sm"
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
          <div className="bg-[#1c1c1e] border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full relative shadow-2xl overflow-hidden">
            <button
              onClick={() => setProModalOpen(false)}
              className="absolute top-6 right-6 bg-[#2c2c2e] text-[#86868b] hover:text-[#f5f5f7] w-8 h-8 rounded-full flex items-center justify-center transition"
            >
              ✕
            </button>

            <div className="text-center mb-6 pt-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block mb-3">
                ⚡ UNLOCK EXECUTIVE PRO
              </span>
              <h3 className="text-2xl font-bold text-[#f5f5f7] mb-2">Upgrade to Pro ($9/mo)</h3>
              <p className="text-sm text-[#86868b]">
                {proReason || "Unlock all executive tools and unlimited generations."}
              </p>
            </div>

            <div className="space-y-3 mb-8 text-sm text-[#f5f5f7]">
              <div className="p-3.5 rounded-xl bg-[#2c2c2e] flex items-center gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <strong>Unlimited Email Generations</strong> (No 5/day limit)
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#2c2c2e] flex items-center gap-3">
                <span className="text-purple-400 font-bold">✓</span>
                <span>
                  <strong>3-Step Outreach Sequence Generator</strong>
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#2c2c2e] flex items-center gap-3">
                <span className="text-[#0a84ff] font-bold">✓</span>
                <span>
                  <strong>Custom Brand Voice DNA Preset</strong>
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#2c2c2e] flex items-center gap-3">
                <span className="text-amber-400 font-bold">✓</span>
                <span>
                  <strong>1-Click CSV/TXT Email History Export</strong>
                </span>
              </div>
            </div>

            <a
              href={LEMON_SQUEEZY_CHECKOUT}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold rounded-2xl text-center block transition shadow-lg"
            >
              Get Pro Access — $9/mo (Cards & PayPal)
            </a>

            <p className="text-[11px] text-center text-[#86868b] mt-3">Powered by Lemon Squeezy • Cancel anytime</p>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md p-0 sm:p-4">
          <div className="bg-[#1c1c1e] border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] p-6 max-w-2xl w-full h-[85vh] sm:max-h-[80vh] flex flex-col relative shadow-2xl transform transition-transform">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-semibold text-[#f5f5f7]">Saved History</h3>
                <p className="text-sm text-[#86868b]">Search, copy, or export past emails.</p>
              </div>
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="bg-[#2c2c2e] text-[#86868b] hover:text-[#f5f5f7] w-8 h-8 rounded-full flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Export Toolbar */}
            <div className="py-3 flex items-center justify-between border-b border-white/5 text-xs text-[#86868b]">
              <span>{savedHistory.length} saved records</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportHistory("txt")}
                  className="px-3 py-1.5 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#f5f5f7] font-medium transition"
                >
                  Export TXT {!isPro && "🔒"}
                </button>
                <button
                  onClick={() => exportHistory("csv")}
                  className="px-3 py-1.5 rounded-full bg-[#0a84ff]/20 text-[#0a84ff] font-medium transition"
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
                className="w-full bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#0a84ff] transition outline-none placeholder-[#86868b]"
              />
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 pr-2">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12 text-[#86868b] text-sm font-medium">No saved emails found.</div>
              ) : (
                filteredHistory.map((item) => (
                  <div key={item.id} className="bg-[#2c2c2e] rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#86868b] border-b border-white/5 pb-2">
                      <span className="font-semibold uppercase tracking-wider">
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
                          className="text-xs font-medium bg-[#ff3b30]/10 text-[#ff3b30] px-3 py-1.5 rounded-full"
                        >
                          Gmail
                        </button>
                        <button
                          onClick={() => copyBody(item.body)}
                          className="text-xs font-medium bg-[#f5f5f7] text-black px-3 py-1.5 rounded-full"
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

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f7] mb-10 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#1c1c1e] rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-semibold text-[#f5f5f7]">{faq.q}</span>
                <span className="text-[#86868b] ml-4 text-xl font-light">{openFaq === index ? "−" : "+"}</span>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6 text-[15px] text-[#86868b] leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Auth Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="bg-[#1c1c1e] border border-white/10 rounded-[2rem] p-8 max-w-sm w-full relative shadow-2xl">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-6 right-6 bg-[#2c2c2e] text-[#86868b] hover:text-[#f5f5f7] w-8 h-8 rounded-full flex items-center justify-center transition"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-[#f5f5f7] mb-2">{isSignUp ? "Create Account" : "Log In"}</h3>
            <p className="text-sm text-[#86868b] mb-8">Get 5 free AI email generations every day.</p>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#0a84ff] outline-none placeholder-[#86868b]"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-[#2c2c2e] border-none text-[#f5f5f7] rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#0a84ff] outline-none placeholder-[#86868b]"
                />
              </div>
              {authMessage && (
                <p className="text-sm text-[#ff3b30] bg-[#ff3b30]/10 p-3 rounded-xl">{authMessage}</p>
              )}
              <button
                type="submit"
                className="w-full bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold py-4 rounded-xl text-sm transition shadow-md mt-2"
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
      <footer className="border-t border-white/10 py-12 text-center text-sm font-medium text-[#86868b]">
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