"use client";

import { useState } from "react";

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
  const [emailType, setEmailType] = useState("Follow-Up");
  const [context, setContext] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

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
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            ✉️ WriteYourEmail
            <span className="text-indigo-400">.com</span>
          </h1>
          <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            Free · No signup required
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8 text-center">
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

      {/* Main Form */}
      <main className="max-w-3xl mx-auto px-6 pb-20">
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
                Your Name{" "}
                <span className="text-slate-500">(optional)</span>
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
              What do you want to say?{" "}
              <span className="text-red-400">*</span>
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., I had an interview yesterday for the frontend developer role. I want to thank the interviewer and ask about the next steps."
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Writing your email...
              </span>
            ) : (
              "✨ Generate Email"
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-8 bg-slate-800/50 backdrop-blur border border-green-500/30 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-400">
                ✅ Your Email is Ready
              </h3>
              <button
                onClick={handleCopy}
                className="bg-slate-700 hover:bg-slate-600 text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-5 whitespace-pre-wrap text-slate-200 leading-relaxed font-mono text-sm">
              {result}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}