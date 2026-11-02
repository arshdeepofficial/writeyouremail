"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthModal from "@/components/AuthModal";
import { User } from "@supabase/supabase-js";

interface EmailRecord {
  id: string;
  email_type: string;
  context: string;
  generated_email: string;
  created_at: string;
}

const emailTypes = [
  "Follow-Up",
  "Job Application",
  "Cold Outreach",
  "Thank You",
  "Complaint",
  "Resignation",
  "Meeting Request",
  "Apology",
  "Sales Pitch",
  "Announcement",
];

const tones = [
  "Professional",
  "Friendly",
  "Formal",
  "Casual",
  "Urgent",
  "Empathetic",
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [history, setHistory] = useState<EmailRecord[]>([]);

  const [emailType, setEmailType] = useState("Follow-Up");
  const [context, setContext] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [usageCount, setUsageCount] = useState(0);
  const GUEST_LIMIT = 2;
  const REGISTERED_LIMIT = 5;

  // Load user history
  const loadHistory = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("emails")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) setHistory(data);
  }, []);

  // Check current logged-in user session & usage count
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        loadHistory(session.user.id);

        const { data } = await supabase
          .from("usage_tracking")
          .select("count")
          .eq("user_id", session.user.id)
          .single();
        if (data) setUsageCount(data.count);
      }
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadHistory(session.user.id);
      } else {
        setHistory([]);
        setUsageCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadHistory]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Check limit (without deducting credit yet)
  const canUserGenerate = async () => {
    if (!user) {
      const guestUsage = parseInt(localStorage.getItem("guest_usage") || "0");
      if (guestUsage >= GUEST_LIMIT) {
        setError(
          "Guest limit reached! Please Sign Up to get 5 more free emails daily."
        );
        setIsAuthOpen(true);
        return false;
      }
      return true;
    }

    const today = new Date().toISOString().split("T")[0];
    const { data: usageData } = await supabase
      .from("usage_tracking")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!usageData || usageData.last_reset !== today) {
      return true;
    }

    if (usageData.count >= REGISTERED_LIMIT) {
      setError(
        `Daily limit reached (${REGISTERED_LIMIT}/${REGISTERED_LIMIT}). Upgrade to Pro for unlimited emails!`
      );
      return false;
    }
    return true;
  };

  // Increment usage count ONLY after AI generation succeeds
  const incrementUsage = async () => {
    if (!user) {
      const guestUsage = parseInt(localStorage.getItem("guest_usage") || "0");
      localStorage.setItem("guest_usage", (guestUsage + 1).toString());
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const { data: usageData } = await supabase
      .from("usage_tracking")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!usageData || usageData.last_reset !== today) {
      await supabase.from("usage_tracking").upsert({
        user_id: user.id,
        count: 1,
        last_reset: today,
      });
      setUsageCount(1);
    } else {
      const newCount = usageData.count + 1;
      await supabase
        .from("usage_tracking")
        .update({ count: newCount })
        .eq("user_id", user.id);
      setUsageCount(newCount);
    }
  };

  const handleGenerate = async () => {
    if (!context.trim()) {
      setError("Please describe what you want to say");
      return;
    }

    setError("");

    const allowed = await canUserGenerate();
    if (!allowed) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailType, context, recipient, sender, tone }),
      });

      const data = await res.json();

      if (data.error || !data.email) {
        setError(data.error || "AI failed to respond. No credit was taken.");
      } else {
        setResult(data.email);
        await incrementUsage();

        if (user) {
          await supabase.from("emails").insert({
            user_id: user.id,
            email_type: emailType,
            context,
            recipient,
            sender,
            tone,
            generated_email: data.email,
          });
          loadHistory(user.id);
        }
      }
    } catch {
      setError("Network error. Please try again. No credit was taken.");
    }
    setLoading(false);
  };

  const handleCopy = (text: string, id?: string) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans pb-10">
      {/* Vercel Style Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black text-sm">
              ✉️
            </span>
            <span className="font-bold text-lg tracking-tight text-white">
              WriteYourEmail<span className="text-neutral-500">.com</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-full font-mono">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-neutral-400 hover:text-red-400 font-medium transition cursor-pointer px-2 py-1"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="text-xs font-medium text-neutral-400 hover:text-white px-3 py-2 transition cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="text-xs font-semibold bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-full transition shadow-sm cursor-pointer"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Vercel Style Hero Section with Radial Glow */}
      <div className="relative overflow-hidden pt-16 pb-12">
        {/* Soft Radial Spotlight Glow behind hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-white/10 via-neutral-900/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <section className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 border border-neutral-800 bg-neutral-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-neutral-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Email Engine v2.0 Live
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-400">
            Write perfect emails in seconds.
          </h1>

          <p className="text-neutral-400 text-base md:text-lg max-w-xl mx-auto mb-8 font-normal leading-relaxed">
            Stop staring at a blank screen. Describe what you need, and our AI drafts clear, human emails instantly.
          </p>
        </section>

        {/* Main Generator Card */}
        <main className="relative max-w-3xl mx-auto px-6">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-2xl relative">
            {/* Top gradient highlight line */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Row 1: Email Type + Tone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Email Type
                </label>
                <select
                  value={emailType}
                  onChange={(e) => setEmailType(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-white focus:border-white focus:outline-none transition"
                >
                  {emailTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-white focus:border-white focus:outline-none transition"
                >
                  {tones.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Recipient&apos;s Name{" "}
                  <span className="text-neutral-600 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g., Alex Smith"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:ring-1 focus:ring-white focus:border-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Your Name{" "}
                  <span className="text-neutral-600 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="e.g., Jordan"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:ring-1 focus:ring-white focus:border-white focus:outline-none transition"
                />
              </div>
            </div>

            {/* Row 3: Context */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                What do you want to say? <span className="text-emerald-500">*</span>
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g., Follow up after yesterday's interview for the Developer position, thank them, and ask about next steps."
                rows={4}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:ring-1 focus:ring-white focus:border-white focus:outline-none resize-none transition leading-relaxed"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs font-medium flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Usage Stats Banner */}
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-3 px-1">
              <span>Daily credits used:</span>
              <span className="font-mono text-neutral-300">
                {user ? `${usageCount} / ${REGISTERED_LIMIT}` : `Guest (${GUEST_LIMIT} free)`}
              </span>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-white hover:bg-neutral-200 disabled:opacity-50 text-black font-semibold py-3 px-6 rounded-xl text-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Drafting email...
                </span>
              ) : (
                "✨ Generate Email"
              )}
            </button>
          </div>

          {/* Result Card */}
          {result && (
            <div className="mt-8 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-2xl relative animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                  <span>✅</span> Generated Result
                </h3>
                <button
                  onClick={() => handleCopy(result)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                >
                  {copied ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
              <div className="bg-neutral-900/60 rounded-xl p-4 whitespace-pre-wrap text-neutral-200 leading-relaxed font-mono text-xs border border-neutral-800/80">
                {result}
              </div>
            </div>
          )}

          {/* User History Section */}
          {user && history.length > 0 && (
            <div className="mt-14">
              <h3 className="text-base font-semibold tracking-tight mb-4 text-white flex items-center justify-between">
                <span>📜 Saved History</span>
                <span className="text-xs text-neutral-500 font-normal">
                  {history.length} saved
                </span>
              </h3>

              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-5 hover:border-neutral-700 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-medium tracking-wide uppercase bg-neutral-900 border border-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md">
                        {item.email_type}
                      </span>
                      <button
                        onClick={() => handleCopy(item.generated_email, item.id)}
                        className="text-xs text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-md transition cursor-pointer"
                      >
                        {copiedId === item.id ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mb-3 italic">
                      Prompt: &quot;{item.context}&quot;
                    </p>
                    <div className="bg-neutral-900/40 border border-neutral-900 rounded-lg p-3 text-xs font-mono text-neutral-300 whitespace-pre-wrap max-h-36 overflow-y-auto">
                      {item.generated_email}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================== FEATURES GRID ==================== */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-neutral-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to write better emails
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto">
            Built for speed, clarity, and results. No fluff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-lg mb-4">
              ⚡
            </div>
            <h3 className="font-semibold text-white mb-2">Instant Drafts</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Go from rough thoughts to a polished email in under 3 seconds. No more blank page anxiety.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-lg mb-4">
              🎯
            </div>
            <h3 className="font-semibold text-white mb-2">10+ Email Types</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Job applications, cold outreach, follow-ups, resignations, sales pitches and more — all covered.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-lg mb-4">
              🔒
            </div>
            <h3 className="font-semibold text-white mb-2">Private & Secure</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Your emails and history are private. We never train on your data or share it with anyone.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-lg mb-4">
              📋
            </div>
            <h3 className="font-semibold text-white mb-2">Saved History</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Every email you generate is automatically saved so you can copy and reuse it anytime.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-lg mb-4">
              🗣️
            </div>
            <h3 className="font-semibold text-white mb-2">Tone Control</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Professional, friendly, urgent, formal — dial in exactly how you want to sound.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-lg mb-4">
              🚀
            </div>
            <h3 className="font-semibold text-white mb-2">Zero Learning Curve</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Just type what you want to say. No prompt engineering skills required.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== PRICING TABLE ==================== */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24 border-t border-neutral-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto">
            Start free. Upgrade when you need unlimited power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* FREE PLAN */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 relative">
            <h3 className="text-lg font-semibold text-white mb-1">Free</h3>
            <p className="text-sm text-neutral-400 mb-6">Perfect for trying it out</p>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold tracking-tight">$0</span>
              <span className="text-neutral-500 text-sm">/ forever</span>
            </div>

            <ul className="space-y-3 mb-8 text-sm text-neutral-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> 2 emails as guest
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> 5 emails / day after signup
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> All email types & tones
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Saved history
              </li>
              <li className="flex items-center gap-2 text-neutral-500">
                <span>○</span> No unlimited access
              </li>
            </ul>

            <button
              onClick={() => setIsAuthOpen(true)}
              className="w-full py-2.5 rounded-xl border border-neutral-700 text-sm font-medium text-white hover:bg-neutral-900 transition cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="bg-neutral-950 border border-white/20 rounded-2xl p-8 relative shadow-[0_0_40px_-15px_rgba(255,255,255,0.15)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-[11px] font-bold px-3 py-1 rounded-full tracking-wide uppercase">
              Most Popular
            </div>

            <h3 className="text-lg font-semibold text-white mb-1">Pro</h3>
            <p className="text-sm text-neutral-400 mb-6">For power users & professionals</p>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold tracking-tight">$9</span>
              <span className="text-neutral-500 text-sm">/ month</span>
            </div>

            <ul className="space-y-3 mb-8 text-sm text-neutral-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> <strong>Unlimited</strong> emails
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> All email types & tones
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Full history & search
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Priority generation speed
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Future Pro templates
              </li>
            </ul>

            <button
              onClick={() => setIsAuthOpen(true)}
              className="w-full py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition cursor-pointer"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-neutral-600 mt-8">
          Payments via PayPal · Cancel anytime · 7-day money-back guarantee
        </p>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-neutral-900 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="w-6 h-6 bg-white text-black rounded flex items-center justify-center text-[10px] font-black">
              W
            </span>
            WriteYourEmail.com
          </div>
          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <a href="#" className="hover:text-white transition">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms
            </a>
            <a href="#pricing" className="hover:text-white transition">
              Pricing
            </a>
          </div>
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} WriteYourEmail. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}