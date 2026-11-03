"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  // Generator State
  const [emailType, setEmailType] = useState("cold_outreach");
  const [context, setContext] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [tone, setTone] = useState("professional");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Auth & Usage State
  const [user, setUser] = useState<any>(null);
  const [dailyUsage, setDailyUsage] = useState<number>(0);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [guestUsage, setGuestUsage] = useState<number>(0);

  // UI state
  const [copied, setCopied] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserUsage(session.user.id);
      } else {
        const storedGuestUsage = localStorage.getItem("guest_usage");
        setGuestUsage(storedGuestUsage ? parseInt(storedGuestUsage, 10) : 0);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserUsage(session.user.id);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchUserUsage = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("usage_tracking")
        .select("count, is_pro, last_reset")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        setIsPro(data.is_pro || false);
        setDailyUsage(data.count || 0);
      }
    } catch (e) {
      console.error(e);
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
    } catch (err) {
      console.error("Failed to sync usage:", err);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPro) {
      if (!user && guestUsage >= 2) {
        alert("You have reached your 2 free guest emails! Please log in or sign up to get 5 free emails every day.");
        setAuthModalOpen(true);
        return;
      }
      if (user && dailyUsage >= 5) {
        alert("You have reached your 5 daily free emails! Upgrade to Pro for unlimited emails.");
        return;
      }
    }

    setLoading(true);
    setGeneratedEmail("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailType, context, recipient, sender, tone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate email");

      setGeneratedEmail(data.email);
      await incrementUsageAfterSuccess();
    } catch (err: any) {
      alert(err.message || "An error occurred while generating your email.");
    } finally {
      setLoading(false);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    { q: "What is WriteYourEmail?", a: "WriteYourEmail is an AI-powered infrastructure designed to generate high-converting, professional emails in seconds using advanced LLMs." },
    { q: "Is there a free tier?", a: "Yes. Guests can generate 2 emails for free. Registered users get 5 free emails every single day." },
    { q: "What is included in the Pro plan?", a: "The Pro plan gives you unlimited email generations, priority processing speed, and unrestricted access to all tones and templates." },
    { q: "How do I cancel my subscription?", a: "You can securely manage or cancel your subscription at any time through our payment provider, Lemon Squeezy." }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-zinc-700/20 via-zinc-900/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-900 bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 font-bold tracking-tight text-lg z-50">
              <span className="w-5 h-5 bg-white text-black flex items-center justify-center font-black text-xs rounded-sm">▲</span>
              <span>WriteYourEmail</span>
            </Link>
            
            {/* Desktop Links */}
            <nav className="hidden md:flex items-center space-x-6 text-sm text-zinc-400">
              <a href="#generator" className="hover:text-white transition">Products</a>
              <a href="#faq" className="hover:text-white transition">Resources</a>
              <a href="#generator" className="hover:text-white transition">Enterprise</a>
              <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <a href="#generator" className="text-xs font-medium text-zinc-300 hover:text-white px-3.5 py-2 rounded-full border border-zinc-800 hover:border-zinc-700 transition">
              Get a Demo
            </a>
            {user ? (
              <div className="flex items-center space-x-3 ml-2 border-l border-zinc-800 pl-4">
                <span className="text-xs text-zinc-400">{user.email}</span>
                <button onClick={handleLogout} className="text-xs text-zinc-400 hover:text-white transition">Log out</button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-2 border-l border-zinc-800 pl-4">
                <button onClick={() => { setIsSignUp(false); setAuthModalOpen(true); }} className="text-xs font-medium text-zinc-300 hover:text-white px-3.5 py-2 rounded-full border border-zinc-800 hover:border-zinc-700 transition">
                  Log In
                </button>
                <button onClick={() => { setIsSignUp(true); setAuthModalOpen(true); }} className="text-xs font-medium bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full transition">
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-zinc-400 hover:text-white z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <div className={`fixed inset-0 z-30 bg-black/95 backdrop-blur-xl transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 md:hidden pt-24 px-6`}>
        <nav className="flex flex-col space-y-6 text-lg font-medium text-zinc-300">
          <a href="#generator" onClick={() => setMobileMenuOpen(false)} className="hover:text-white border-b border-zinc-900 pb-4">Products</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white border-b border-zinc-900 pb-4">Resources</a>
          <a href="#generator" onClick={() => setMobileMenuOpen(false)} className="hover:text-white border-b border-zinc-900 pb-4">Enterprise</a>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-white border-b border-zinc-900 pb-4">Pricing</Link>
          
          <div className="pt-6 flex flex-col space-y-4">
            <a href="#generator" onClick={() => setMobileMenuOpen(false)} className="text-center bg-zinc-900 text-white py-3 rounded-full text-sm font-semibold border border-zinc-800">
              Get a Demo
            </a>
            {user ? (
              <>
                <span className="text-sm text-zinc-500 text-center">{user.email}</span>
                <button onClick={handleLogout} className="text-center bg-white text-black py-3 rounded-full text-sm font-semibold">Log Out</button>
              </>
            ) : (
              <>
                <button onClick={() => { setIsSignUp(false); setAuthModalOpen(true); }} className="text-center bg-zinc-900 text-white py-3 rounded-full text-sm font-semibold border border-zinc-800">Log In</button>
                <button onClick={() => { setIsSignUp(true); setAuthModalOpen(true); }} className="text-center bg-white text-black py-3 rounded-full text-sm font-semibold">Sign Up</button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
              Agentic <br /> Infrastructure
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#generator" className="bg-white text-black hover:bg-zinc-200 font-medium px-6 py-3 rounded-full text-sm transition shadow-lg shadow-white/5 w-full sm:w-auto text-center">
                Start Writing
              </a>
              <Link href="/pricing" className="bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-white font-medium px-6 py-3 rounded-full text-sm transition backdrop-blur-md w-full sm:w-auto text-center">
                View Pricing
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative z-10 space-y-4 text-zinc-300 font-medium text-lg sm:text-xl border-l border-zinc-800 pl-6">
              <p className="hover:text-white transition">For coding agents</p>
              <p className="hover:text-white transition">To ship apps and emails</p>
              <p className="hover:text-white transition">Automated by AI agents</p>
            </div>
            <div className="mt-12 relative flex justify-center items-center">
              <div className="w-48 h-48 bg-gradient-to-tr from-white/20 via-zinc-500/10 to-transparent rounded-full blur-2xl absolute" />
              <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-zinc-200 filter drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] opacity-95 transition-transform hover:scale-105 duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Generator Workspace */}
      <section id="generator" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">Email Studio</h2>
              <p className="text-xs text-zinc-400 mt-1">Fill in the details below to generate your professional email instantly.</p>
            </div>
            {!isPro && (
              <div className="text-right">
                <span className="text-xs px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 font-mono">
                  {user ? `${dailyUsage}/5 Free Daily` : `${guestUsage}/2 Guest Free`}
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Email Type</label>
                <select value={emailType} onChange={(e) => setEmailType(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-white transition">
                  <option value="cold_outreach">Cold Outreach / Sales</option>
                  <option value="job_application">Job Application / Pitch</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="resignation">Resignation / Transition</option>
                  <option value="custom">Custom Email</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Tone of Voice</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-white transition">
                  <option value="professional">Professional & Direct</option>
                  <option value="persuasive">Persuasive & Confident</option>
                  <option value="friendly">Friendly & Warm</option>
                  <option value="urgent">Urgent & High Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Recipient Name / Title</label>
                <input type="text" placeholder="e.g. Sarah Connor" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-white transition placeholder-zinc-600" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Context & Main Points</label>
              <textarea rows={4} required placeholder="What is the key goal of this email?" value={context} onChange={(e) => setContext(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-white transition placeholder-zinc-600 resize-none" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <input type="text" placeholder="Your Name (Sender Signature)" value={sender} onChange={(e) => setSender(e.target.value)} className="bg-zinc-900 border border-zinc-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-white transition placeholder-zinc-600 w-full sm:w-1/2" />
              <button type="submit" disabled={loading} className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 font-semibold px-8 py-3 rounded-full text-sm transition disabled:opacity-50 flex items-center justify-center space-x-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /><span>Writing...</span></>
                ) : (
                  <span>Generate Email ▲</span>
                )}
              </button>
            </div>
          </form>

          {generatedEmail && (
            <div className="mt-8 pt-6 border-t border-zinc-900">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Generated Result</span>
                <button onClick={copyToClipboard} className="text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-full text-zinc-300 transition">
                  {copied ? "Copied to Clipboard!" : "Copy Text"}
                </button>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 text-zinc-200 font-sans leading-relaxed whitespace-pre-wrap text-sm">
                {generatedEmail}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-zinc-800 bg-zinc-950/50 rounded-xl overflow-hidden transition-all">
              <button 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <span className="font-medium text-zinc-200">{faq.q}</span>
                <span className="text-zinc-500 ml-4">{openFaq === index ? "−" : "+"}</span>
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Auth Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full relative">
            <button onClick={() => setAuthModalOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>
            <h3 className="text-lg font-bold text-white mb-2">{isSignUp ? "Create your account" : "Log in to WriteYourEmail"}</h3>
            <p className="text-xs text-zinc-400 mb-6">Get 5 free AI email generations every day.</p>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Email</label>
                <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-white" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Password</label>
                <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-white" />
              </div>
              {authMessage && <p className="text-xs text-zinc-400 border border-zinc-800 p-2 rounded">{authMessage}</p>}
              <button type="submit" className="w-full bg-white text-black font-semibold py-2.5 rounded-full text-xs hover:bg-zinc-200 transition">
                {isSignUp ? "Sign Up" : "Log In"}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button onClick={() => { setIsSignUp(!isSignUp); setAuthMessage(""); }} className="text-xs text-zinc-400 hover:text-white transition">
                {isSignUp ? "Already have an account? Log In" : "Need an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-10 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 WriteYourEmail.com. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-zinc-400 transition">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-zinc-400 transition">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}