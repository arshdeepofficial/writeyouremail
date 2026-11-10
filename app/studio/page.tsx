"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { 
  Send, Sparkles, ShieldAlert, MessageCircle, Video, FileText, 
  Plane, Layers, Mail, Smartphone, Users, Hash, PhoneCall, 
  Database, Share2, MessageSquare, CreditCard, History, User, CheckCircle2, Lock
} from "lucide-react";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// --- TIER CONFIGURATION ---
const MODES = [
  { id: "create", label: "Email", icon: Mail, tier: "starter", color: "bg-blue-500" },
  { id: "polish", label: "Polish", icon: Sparkles, tier: "starter", color: "bg-orange-500" },
  { id: "reply", label: "Objection", icon: ShieldAlert, tier: "starter", color: "bg-red-500" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, tier: "growth", color: "bg-green-500" },
  { id: "vsl_script", label: "Loom VSL", icon: Video, tier: "growth", color: "bg-purple-500" },
  { id: "proposal", label: "Upwork Proposal", icon: FileText, tier: "growth", color: "bg-slate-400" },
  { id: "telegram", label: "Telegram", icon: Plane, tier: "growth", color: "bg-sky-500" },
  { id: "sequence", label: "Sequence", icon: Layers, tier: "growth", color: "bg-indigo-500" },
  { id: "linkedin", label: "LinkedIn", icon: Share2, tier: "growth", color: "bg-blue-600" },
  { id: "twitter", label: "Twitter DM", icon: Hash, tier: "growth", color: "bg-slate-200" },
  { id: "direct_mail", label: "Direct Mail", icon: Mail, tier: "enterprise", color: "bg-rose-500" },
  { id: "sms_sequence", label: "SMS", icon: Smartphone, tier: "enterprise", color: "bg-yellow-500" },
  { id: "reddit_dm", label: "Reddit", icon: MessageSquare, tier: "enterprise", color: "bg-orange-600" },
  { id: "cold_call", label: "Cold Call", icon: PhoneCall, tier: "enterprise", color: "bg-emerald-500" },
  { id: "csv_bulk", label: "CSV Bulk", icon: Database, tier: "enterprise", color: "bg-cyan-500" },
];

const TIER_HIERARCHY: Record<string, number> = { free: 0, starter: 1, growth: 2, enterprise: 3 };

export default function StudioPage() {
  const supabase = createClientComponentClient();
  const [activeMode, setActiveMode] = useState("create");
  const [prompt, setPrompt] = useState("");
  const [extraData, setExtraData] = useState<any>({}); // For dynamic fields
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [targetTier, setTargetTier] = useState("growth");

  useEffect(() => {
    fetchUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => fetchUser());
    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { data } = await supabase.from("usage_tracking").select("*").eq("user_id", user.id).single();
      setUsage(data || { count: 0, plan_tier: 'free' });
      const { data: hist } = await supabase.from("emails").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5);
      setHistory(hist || []);
    }
  };

  const checkAccess = (modeId: string) => {
    const mode = MODES.find(m => m.id === modeId);
    if (!mode) return false;
    const userTier = usage?.plan_tier || "free";
    if (TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[mode.tier]) return true;
    setTargetTier(mode.tier);
    setShowUpgrade(true);
    return false;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkAccess(activeMode)) return;
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ 
          mode: activeMode, 
          prompt, 
          ...extraData,
          language: extraData.language || 'English',
          tone: extraData.tone || 'Professional' 
        }),
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else {
        setResult(data.content);
        fetchUser(); // Refresh usage count
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- DYNAMIC FORM FIELDS ---
  const renderModeSpecificFields = () => {
    switch (activeMode) {
      case "whatsapp":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Emoji Density</label>
              <select 
                className="w-full bg-[#222224] border border-white/5 rounded-xl p-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                onChange={(e) => setExtraData({...extraData, emojis: e.target.value})}
              >
                <option value="minimal">Minimal / Business</option>
                <option value="heavy">Heavy / Friendly</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Sequence Steps</label>
              <select 
                className="w-full bg-[#222224] border border-white/5 rounded-xl p-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                onChange={(e) => setExtraData({...extraData, steps: e.target.value})}
              >
                <option value="1">Single Message</option>
                <option value="3">3-Day Nurture</option>
              </select>
            </div>
          </div>
        );
      case "vsl_script":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Video Duration</label>
              <select 
                className="w-full bg-[#222224] border border-white/5 rounded-xl p-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                onChange={(e) => setExtraData({...extraData, duration: e.target.value})}
              >
                <option value="45s">45 Seconds (Quick Clip)</option>
                <option value="2m">2 Minutes (Full Pitch)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Target Landing Page</label>
              <input 
                type="text" 
                placeholder="https://yourwebsite.com"
                className="w-full bg-[#222224] border border-white/5 rounded-xl p-3 text-white outline-none"
                onChange={(e) => setExtraData({...extraData, url: e.target.value})}
              />
            </div>
          </div>
        );
      case "proposal":
        return (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Paste Job Description</label>
              <textarea 
                placeholder="Paste the Upwork/Fiverr job post here for context..."
                className="w-full bg-[#222224] border border-white/5 rounded-xl p-3 text-white h-24 outline-none"
                onChange={(e) => setExtraData({...extraData, job_post: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Your Rate (e.g. $50/hr)" className="bg-[#222224] border border-white/5 rounded-xl p-3 text-white outline-none" onChange={(e) => setExtraData({...extraData, rate: e.target.value})} />
              <input type="text" placeholder="Portfolio Link" className="bg-[#222224] border border-white/5 rounded-xl p-3 text-white outline-none" onChange={(e) => setExtraData({...extraData, portfolio: e.target.value})} />
            </div>
          </div>
        );
      case "direct_mail":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Mail Format</label>
              <select className="w-full bg-[#222224] border border-white/5 rounded-xl p-3 text-white outline-none" onChange={(e) => setExtraData({...extraData, format: e.target.value})}>
                <option value="handwritten">Handwritten Style Postcard</option>
                <option value="formal">Formal Executive Letter</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Enclosed Item (Pattern Interrupt)</label>
              <input type="text" placeholder="e.g. $5 bill, Coffee Card, Mini-Book" className="w-full bg-[#222224] border border-white/5 rounded-xl p-3 text-white outline-none" onChange={(e) => setExtraData({...extraData, gift: e.target.value})} />
            </div>
          </div>
        );
      case "cold_call":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Gatekeeper Tactic</label>
              <select className="w-full bg-[#222224] border border-white/5 rounded-xl p-3 text-white outline-none" onChange={(e) => setExtraData({...extraData, gatekeeper: e.target.value})}>
                <option value="assertive">Assertive / Peer-to-Peer</option>
                <option value="curious">Curious / Seeking Help</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Call Objective</label>
              <input type="text" placeholder="e.g. Book a Demo, Direct Sale" className="w-full bg-[#222224] border border-white/5 rounded-xl p-3 text-white outline-none" onChange={(e) => setExtraData({...extraData, objective: e.target.value})} />
            </div>
          </div>
        );
      default: // Email, Polish, Objection, etc.
        return null; 
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-blue-500/30">
      <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">WriteYourEmail<span className="text-blue-500">.com</span></span>
          </Link>

          <div className="flex items-center gap-4">
            {usage && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <div className={`w-2 h-2 rounded-full ${usage.plan_tier !== 'free' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
                <span className="text-xs font-medium text-zinc-400">
                  {usage.plan_tier.toUpperCase()} Plan: {usage.count}{usage.plan_tier === 'free' ? '/5' : '/∞'}
                </span>
              </div>
            )}
            <Link href="/profile" className="p-2 hover:bg-white/5 rounded-full transition-colors"><User className="w-5 h-5 text-zinc-400" /></Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Omni-Channel Sales Studio</h1>
          <p className="text-zinc-500 font-medium">Select a channel and build your high-converting outreach campaign.</p>
        </header>

        {/* MODE DOCK - Hidden Scrollbars */}
        <div className="mb-8 relative group">
          <div className="flex gap-2 overflow-x-auto pb-4 pt-2 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => { setActiveMode(mode.id); setExtraData({}); }}
                className={`flex-shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-2xl border transition-all duration-200 ${
                  activeMode === mode.id 
                    ? `bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20 scale-[1.02]` 
                    : "bg-[#141415] border-white/5 text-zinc-400 hover:border-white/10 hover:bg-[#1c1c1e]"
                }`}
              >
                <mode.icon className={`w-4 h-4 ${activeMode === mode.id ? "text-white" : "text-zinc-500"}`} />
                <span className="text-sm font-semibold">{mode.label}</span>
                {mode.tier !== 'starter' && TIER_HIERARCHY[usage?.plan_tier || 'free'] < TIER_HIERARCHY[mode.tier] && (
                  <Lock className="w-3 h-3 opacity-50" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleGenerate} className="bg-[#141415] border border-white/5 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">
                    {activeMode === 'reply' ? 'The Prospect Objection' : 'The Value Pitch / Campaign Goal'}
                  </label>
                  <textarea
                    required
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      activeMode === 'reply' 
                        ? "Paste the prospect's email or objection (e.g. 'Your price is too high')..." 
                        : "Describe your product, the core problem it solves, and your specific offer..."
                    }
                    className="w-full bg-[#222224] border border-white/5 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-blue-500/50 outline-none min-h-[160px] text-lg transition-all"
                  />
                </div>

                {/* DYNAMIC FIELDS RENDER HERE */}
                {renderModeSpecificFields()}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Language</label>
                    <select 
                      className="w-full bg-[#222224] border border-white/5 rounded-xl p-3 text-white text-sm outline-none"
                      onChange={(e) => setExtraData({...extraData, language: e.target.value})}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Tone of Voice</label>
                    <select 
                      className="w-full bg-[#222224] border border-white/5 rounded-xl p-3 text-white text-sm outline-none"
                      onChange={(e) => setExtraData({...extraData, tone: e.target.value})}
                    >
                      <option>Professional & Direct</option>
                      <option>Casual & Friendly</option>
                      <option>Urgent & Scarcity-Focused</option>
                      <option>Witty & Creative</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !prompt}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg shadow-blue-600/20"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Generate {MODES.find(m => m.id === activeMode)?.label.toUpperCase()}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* RESULTS AREA */}
            {result && (
              <div className="bg-[#141415] border border-white/10 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">AI Generated Result</span>
                  </div>
                  <button 
                    onClick={() => {navigator.clipboard.writeText(result); alert("Copied to clipboard!");}}
                    className="text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-zinc-200 leading-relaxed font-medium">
                    {result}
                  </div>
                </div>
                
                {/* SPONSORED TOOL TIP */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                      <Send className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Scale your sending?</p>
                      <p className="text-[10px] text-zinc-500">We recommend Instantly.ai for high-volume outreach.</p>
                    </div>
                  </div>
                  <a href="https://instantly.ai/?via=writeyouremail" target="_blank" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all">
                    Try Instantly →
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* HISTORY CARD */}
            <div className="bg-[#141415] border border-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <History className="w-4 h-4 text-zinc-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Recent Generations</h3>
              </div>
              <div className="space-y-3">
                {history.length > 0 ? history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setResult(item.content)}
                    className="w-full text-left p-4 rounded-2xl bg-[#1c1c1e] border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{item.mode || 'Email'}</span>
                      <span className="text-[10px] text-zinc-600">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed group-hover:text-zinc-200 transition-colors">
                      {item.prompt}
                    </p>
                  </button>
                )) : (
                  <div className="py-10 text-center">
                    <p className="text-zinc-600 text-sm">No history yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* UPGRADE CARD */}
            {usage?.plan_tier === 'free' && (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/10">
                <Sparkles className="w-8 h-8 mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Unlock Growth Tier</h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">Get unlimited generations, WhatsApp sequences, Loom scripts, and Upwork proposals.</p>
                <button 
                  onClick={() => { setTargetTier('growth'); setShowUpgrade(true); }}
                  className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl shadow-lg hover:bg-blue-50 transition-colors"
                >
                  Upgrade Now — $39
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* UPGRADE MODAL */}
      {showUpgrade && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60 animate-in fade-in duration-300">
          <div className="bg-[#141415] border border-white/10 w-full max-w-md rounded-[32px] p-8 shadow-2xl relative">
            <button onClick={() => setShowUpgrade(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
              <Lock className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                <Sparkles className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Upgrade to {targetTier.toUpperCase()}</h2>
              <p className="text-zinc-500 text-sm">Unlock pro features and unlimited generations instantly.</p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                `Unlimited ${targetTier} generations`,
                "Priority AI processing speed",
                "Advanced omni-channel modes",
                "Full account generation history"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency: "USD", intent: "capture" }}>
              <PayPalButtons
                style={{ layout: "vertical", shape: "pill", label: "checkout" }}
                createOrder={(data, actions) => {
                  const price = targetTier === 'starter' ? "19.00" : targetTier === 'growth' ? "39.00" : "79.00";
                  return actions.order.create({
                    purchase_units: [{
                      amount: { value: price, currency_code: "USD" },
                      description: `WriteYourEmail.com ${targetTier} Access`,
                      custom_id: user?.id
                    }]
                  });
                }}
                onApprove={async (data, actions) => {
                  const capture = await actions.order?.capture();
                  if (capture?.status === "COMPLETED") {
                    await fetch("/api/paypal/capture-order", {
                      method: "POST",
                      body: JSON.stringify({ orderID: data.orderID, user_id: user?.id, tier: targetTier }),
                    });
                    setShowUpgrade(false);
                    fetchUser();
                  }
                }}
              />
            </PayPalScriptProvider>
            
            <p className="text-[10px] text-zinc-600 text-center mt-6 uppercase tracking-widest font-bold">Secure Encrypted Payment via PayPal</p>
          </div>
        </div>
      )}
    </div>
  );
}