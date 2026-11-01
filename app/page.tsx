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
  const [error, setError] = useState("");

  // Load user history
  const loadHistory = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("emails")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) setHistory(data);
  }, []);

  // Check current logged-in user session
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        loadHistory(session.user.id);
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
      }
    });

    return () => subscription.unsubscribe();
  }, [loadHistory]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleGenerate = async () => {
    if (!context.trim()) {
      setError("Please describe what you want to say");
      return;
    }
    setError("");
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailType, context, recipient, sender, tone }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.email);

        // If user is logged in, save email to Supabase database
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
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pb-20">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-40 bg-slate-950/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            ✉️ WriteYourEmail
            <span className="text-indigo-400">.com</span>
          </h1>

          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                  👤 {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg font-medium transition cursor-pointer"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Write Perfect Emails
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            in Seconds
          </span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Stop staring at a blank screen. Tell us what you want to say, and
          we&apos;ll write a polished, professional email for you instantly.
        </p>
      </section>

      {/* Main Generator Form */}
      <main className="max-w-3xl mx-auto px-6">
        <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          {/* Row 1: Email Type + Tone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email Type
              </label>
              <select
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {emailTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Recipient&apos;s Name{" "}
                <span className="text-slate-500">(optional)</span>
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g., Mr. Sharma"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Your Name <span className="text-slate-500">(optional)</span>
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g., Rahul"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: Context */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              What do you want to say? <span className="text-red-400">*</span>
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., I had an interview yesterday for the frontend developer role. I want to thank the interviewer and ask about the next steps."
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Writing your email..." : "✨ Generate Email"}
          </button>
        </div>

        {/* Current Result */}
        {result && (
          <div className="mt-8 bg-slate-800/50 backdrop-blur border border-green-500/30 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-400">
                ✅ Your Email is Ready
              </h3>
              <button
                onClick={() => handleCopy(result)}
                className="bg-slate-700 hover:bg-slate-600 text-sm px-4 py-2 rounded-lg transition cursor-pointer"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-5 whitespace-pre-wrap text-slate-200 leading-relaxed font-mono text-sm">
              {result}
            </div>
          </div>
        )}

        {/* User History Section */}
        {user && history.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4 text-slate-200">
              📜 Your Saved Email History
            </h3>
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800/40 border border-white/5 rounded-xl p-5 hover:border-white/10 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded font-medium">
                      {item.email_type}
                    </span>
                    <button
                      onClick={() => handleCopy(item.generated_email)}
                      className="text-xs text-slate-400 hover:text-white bg-slate-700 px-3 py-1 rounded cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 italic">
                    Prompt: &quot;{item.context}&quot;
                  </p>
                  <div className="bg-slate-950/40 rounded p-3 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {item.generated_email}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}