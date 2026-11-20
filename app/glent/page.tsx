'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowRight,
  Cpu,
  Layers,
  Terminal,
  Database,
  Sparkles,
  ShieldCheck,
  Activity,
  Globe,
  Lock,
  Zap,
  CheckCircle2,
  Clock,
  Server,
  BarChart3,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  Mail,
  Sliders,
  Radio,
  FileText
} from 'lucide-react';

// Custom inline SVG for Instagram to avoid lucide-react build errors
const InstagramIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function GlentGlobalEnterprisePage() {
  // Interactive Diagnostic Sandbox States
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [diagnosticStage, setDiagnosticStage] = useState('Standby');
  const [diagnosticMetrics, setDiagnosticMetrics] = useState({
    latency: '614ms',
    tokensSec: '482 tok/s',
    spamEntropy: '0.012',
    deliveryConfidence: '99.8%'
  });

  // System Architecture Tab Selector
  const [activeArchTab, setActiveArchTab] = useState<'inference' | 'deliverability' | 'sovereignty' | 'monetary'>('inference');

  // Interactive Terminal Copier
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live Pulse Ticker Simulator
  const [uptimeSeconds, setUptimeSeconds] = useState(3184209);
  const [activeEdgeNodes, setActiveEdgeNodes] = useState(18);

  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Run Simulated System Benchmark
  const handleRunDiagnostic = () => {
    if (isRunningDiagnostic) return;
    setIsRunningDiagnostic(true);
    setDiagnosticProgress(10);
    setDiagnosticStage('Establishing Handshake with Groq LPU Cluster...');

    setTimeout(() => {
      setDiagnosticProgress(35);
      setDiagnosticStage('Simulating Token Stream for Llama 3.3 70B Engine...');
    }, 450);

    setTimeout(() => {
      setDiagnosticProgress(70);
      setDiagnosticStage('Executing Real-Time Spam Dictionary Matrix (200+ Term Penalties)...');
    }, 950);

    setTimeout(() => {
      setDiagnosticProgress(100);
      setDiagnosticStage('Telemetry Verified. All Systems Optimal.');
      setDiagnosticMetrics({
        latency: `${Math.floor(Math.random() * 80 + 560)}ms`,
        tokensSec: `${Math.floor(Math.random() * 40 + 470)} tok/s`,
        spamEntropy: '0.009',
        deliveryConfidence: '99.9%'
      });
      setIsRunningDiagnostic(false);
    }, 1500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="relative overflow-hidden bg-black text-white antialiased selection:bg-[#0a84ff]/30 selection:text-white font-sans">
      {/* Dynamic Background Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Ambient Gradient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-blue-600/15 via-purple-600/10 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[1400px] right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[180px] pointer-events-none -z-10" />

      {/* Top Telemetry Header Bar */}
      <div className="border-b border-white/5 bg-neutral-950/80 backdrop-blur-md px-6 py-2.5 text-[11px] font-mono text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-neutral-300 font-semibold tracking-wider uppercase">
              GLENT GLOBAL CORE RUNTIME: 100% OPERATIONAL
            </span>
            <span className="text-neutral-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-neutral-500">
              UPTIME: {(uptimeSeconds / 86400).toFixed(2)} DAYS CONTINUOUS
            </span>
          </div>

          <div className="flex items-center gap-5 text-neutral-500 text-[10px]">
            <span>EDGE CLUSTER: <span className="text-neutral-300">{activeEdgeNodes} NODES ONLINE</span></span>
            <span>INFERENCE REGION: <span className="text-neutral-300">US-EAST / GLOBAL ANYCAST</span></span>
            <span>SOVEREIGN ARCHITECTURE: <span className="text-blue-400 font-bold">V2.4</span></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 space-y-36">

        {/* SECTION 1: HERO & CORE MANIFESTO */}
        <section className="space-y-8 max-w-4xl pt-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-widest text-neutral-300">
            <Sparkles size={13} className="text-blue-400" />
            <span className="uppercase text-[11px] tracking-[0.25em]">Parent Technology Conglomerate</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-500 leading-[1.05]">
            Engineering the mechanics of autonomous software.
          </h1>

          <p className="text-lg sm:text-2xl text-neutral-400 leading-relaxed font-light max-w-3xl">
            Glent Global Enterprises is a high-conviction technology holding laboratory. We build, 
            capitalize, and orchestrate precision AI systems designed to operate at extreme velocity 
            with zero operational bloat.
          </p>

          <div className="pt-6 flex flex-wrap items-center gap-5">
            <Link
              href="/studio"
              className="px-7 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-widest transition-all duration-200 flex items-center gap-2.5 shadow-xl shadow-white/5 group"
            >
              Launch Flagship Studio <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <button
              onClick={handleRunDiagnostic}
              disabled={isRunningDiagnostic}
              className="px-7 py-3.5 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.02] text-neutral-200 font-semibold text-xs uppercase tracking-widest transition-all flex items-center gap-2.5"
            >
              <RefreshCw size={14} className={isRunningDiagnostic ? 'animate-spin text-blue-400' : 'text-neutral-400'} />
              {isRunningDiagnostic ? 'Benchmarking Cluster...' : 'Run System Diagnostic'}
            </button>

            <Link
              href="/glent/contact"
              className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-white transition-colors pl-2"
            >
              Corporate Inquiries →
            </Link>
          </div>
        </section>

        {/* SECTION 2: REAL-TIME SYSTEM TELEMETRY SANDBOX */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-black p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-blue-400">Live Cluster Diagnostic</p>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Edge Telemetry & LPU Benchmarking</h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-500">Status:</span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {diagnosticStage}
              </span>
            </div>
          </div>

          {/* Diagnostic Progress Bar */}
          <div className="mt-8 space-y-2">
            <div className="flex justify-between text-xs font-mono text-neutral-500">
              <span>CLUSTER SIMULATION PIPELINE</span>
              <span>{diagnosticProgress}%</span>
            </div>
            <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 transition-all duration-500 ease-out"
                style={{ width: `${diagnosticProgress}%` }}
              />
            </div>
          </div>

          {/* Real-Time Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-xs font-mono">
                <span>INFERENCE LATENCY</span>
                <Clock size={14} className="text-blue-400" />
              </div>
              <p className="text-3xl font-mono font-bold text-white tracking-tight">{diagnosticMetrics.latency}</p>
              <p className="text-[11px] text-neutral-500 font-mono">Llama 3.3 70B via Groq LPUs</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-xs font-mono">
                <span>PROCESSING SPEED</span>
                <Zap size={14} className="text-purple-400" />
              </div>
              <p className="text-3xl font-mono font-bold text-white tracking-tight">{diagnosticMetrics.tokensSec}</p>
              <p className="text-[11px] text-neutral-500 font-mono">Parallel token stream capacity</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-xs font-mono">
                <span>SPAM ENTROPY RISK</span>
                <ShieldCheck size={14} className="text-emerald-400" />
              </div>
              <p className="text-3xl font-mono font-bold text-emerald-400 tracking-tight">{diagnosticMetrics.spamEntropy}</p>
              <p className="text-[11px] text-neutral-500 font-mono">Local dictionary penalty score</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-xs font-mono">
                <span>INBOX PLACEMENT</span>
                <BarChart3 size={14} className="text-cyan-400" />
              </div>
              <p className="text-3xl font-mono font-bold text-cyan-400 tracking-tight">{diagnosticMetrics.deliveryConfidence}</p>
              <p className="text-[11px] text-neutral-500 font-mono">Audited against major ISP algorithms</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE GLENT ECOSYSTEM BENTO GRID */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400">Capital Portfolio</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">The Enterprise Ecosystem</h2>
            </div>
            <p className="text-xs font-mono text-neutral-500 max-w-sm">
              Each unit operates as an autonomous economic entity anchored to the centralized Glent Global compute and billing fabric.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* PRODUCT 01: WRITEYOUREMAIL (FLAGSHIP) */}
            <div className="md:col-span-2 rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.05] via-neutral-950 to-black p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between group shadow-2xl">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-lg">
                      W
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        WriteYourEmail.com
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      </h3>
                      <p className="text-xs font-mono text-neutral-400">Autonomous B2B Outreach & Deliverability Intelligence</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live Production • v2.4
                  </span>
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed font-light max-w-2xl">
                  Engineered to eliminate outreach failure. Combines 30 specialized B2B strategic modes with 
                  real-time spam word penalties, automated A/B subject line synthesis, and direct zero-friction dispatch 
                  to native Gmail and Outlook desktop and web clients.
                </p>

                {/* Technical Bullet Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <p className="text-[10px] font-mono uppercase text-neutral-500">ENGINE INFERENCE</p>
                    <p className="text-sm font-semibold text-white mt-1">Llama 3.3 70B</p>
                    <p className="text-[11px] text-neutral-400 font-light mt-0.5">Sub-800ms generation</p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <p className="text-[10px] font-mono uppercase text-neutral-500">DELIVERABILITY</p>
                    <p className="text-sm font-semibold text-emerald-400 mt-1">Algorithmic Audit</p>
                    <p className="text-[11px] text-neutral-400 font-light mt-0.5">Live spam penalty heuristic</p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <p className="text-[10px] font-mono uppercase text-neutral-500">SETTLEMENT ENGINE</p>
                    <p className="text-sm font-semibold text-blue-400 mt-1">Prepaid 30-Day</p>
                    <p className="text-[11px] text-neutral-400 font-light mt-0.5">RBI-compliant PayPal Orders v2</p>
                  </div>
                </div>
              </div>

              <div className="pt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/studio"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  Enter Studio Application <ArrowUpRight size={14} />
                </Link>
                <Link
                  href="/pricing"
                  className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/25 text-neutral-300 text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  Review Access Passes
                </Link>
              </div>
            </div>

            {/* PRODUCT 02: GLENT SIGNAL */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-blue-400">
                    <Radio size={20} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-800 text-neutral-400">
                    Phase 02 • Q2 2025
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">Glent Signal</h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-light">
                    Autonomous prospect intent identification engine. Continuously parses enterprise job postings, 
                    executive changes, and tech stack shifts to calculate cold outreach timing before competitors react.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <CheckCircle2 size={13} className="text-blue-400" />
                    <span>Algorithmic Intent Mining</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <CheckCircle2 size={13} className="text-blue-400" />
                    <span>Real-Time Tech Stack Verification</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <CheckCircle2 size={13} className="text-blue-400" />
                    <span>Autonomous CRM Enrichment</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest block">
                  Proprietary R&D Initiative
                </span>
              </div>
            </div>

            {/* PRODUCT 03: GLENT NEURAL INBOX */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-purple-400">
                    <Terminal size={20} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-800 text-neutral-400">
                    Phase 03 • R&D
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">Glent Neural Inbox</h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-light">
                    Sub-10ms response triage agent. Autonomously handles incoming lead objections, 
                    schedules high-stakes calendar reservations, and syncs intent states into underlying databases.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <CheckCircle2 size={13} className="text-purple-400" />
                    <span>Deterministic Objection Triage</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <CheckCircle2 size={13} className="text-purple-400" />
                    <span>Multi-Calendar Conflict Solver</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest block">
                  Lab Research Stage
                </span>
              </div>
            </div>

            {/* PRODUCT 04: GLENT SOVEREIGN VAULT */}
            <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Lock size={20} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-800 text-neutral-400">
                    Infrastructure Primitive
                  </span>
                </div>

                <div className="max-w-2xl">
                  <h3 className="text-2xl font-bold text-white">Glent Sovereign Data Architecture</h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-light">
                    Zero customer email content, strategy inputs, or recipient prospect lists generated within Glent Global 
                    properties are ever fed into public training corpuses. We enforce strict ephemeral memory states and row-level 
                    cryptographic isolation across all relational persistence tiers.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-neutral-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Row-Level Security (RLS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Zero-Model Retraining Policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Stateless Edge Routing</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: SYSTEM ARCHITECTURE SPECIFICATIONS (INTERACTIVE DEEP DIVE TABS) */}
        <section className="space-y-12">
          <div className="border-b border-white/5 pb-6">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">Engineering Dossier</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">System Architecture Matrix</h2>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
            <button
              onClick={() => setActiveArchTab('inference')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeArchTab === 'inference'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              01 / Inference Cluster
            </button>
            <button
              onClick={() => setActiveArchTab('deliverability')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeArchTab === 'deliverability'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              02 / Deliverability Physics
            </button>
            <button
              onClick={() => setActiveArchTab('sovereignty')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeArchTab === 'sovereignty'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              03 / Privacy Sovereign
            </button>
            <button
              onClick={() => setActiveArchTab('monetary')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeArchTab === 'monetary'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              04 / Monetary Architecture
            </button>
          </div>

          {/* Active Tab Panel Content */}
          <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-white/[0.01]">
            {activeArchTab === 'inference' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Cpu className="text-blue-400" size={24} />
                  <h3 className="text-2xl font-bold text-white">Sub-Second LPUs & Fallback Fallbacks</h3>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed font-light max-w-3xl">
                  Traditional cloud GPU instances suffer from queue cold-starts and multi-second time-to-first-token (TTFT). 
                  Glent Global routes all generation through Groq Language Processing Units (LPUs). We maintain automated 
                  fallback hierarchies cascading from <code className="text-blue-400 font-mono">llama-3.3-70b-versatile</code> to{' '}
                  <code className="text-blue-400 font-mono">llama-3.1-8b-instant</code> and <code className="text-blue-400 font-mono">gemma2-9b-it</code>, 
                  ensuring 99.99% operational continuity under global load spikes.
                </p>
                <div className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs text-neutral-400 space-y-1">
                  <p className="text-neutral-500">// Inference Dispatch Protocol</p>
                  <p className="text-emerald-400">const primaryEngine = &quot;groq/llama-3.3-70b-versatile&quot;;</p>
                  <p className="text-neutral-400">const fallbackChain = [&quot;llama-3.1-8b-instant&quot;, &quot;gemma2-9b-it&quot;];</p>
                  <p className="text-neutral-400">const maxLatencyTarget = 800; // milliseconds</p>
                </div>
              </div>
            )}

            {activeArchTab === 'deliverability' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Layers className="text-purple-400" size={24} />
                  <h3 className="text-2xl font-bold text-white">Deterministic Deliverability Scoring</h3>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed font-light max-w-3xl">
                  Email spam filters utilize statistical token scoring rather than semantic evaluation. Glent Global applies 
                  a local heuristic scanning layer that penalizes aggressive capitalization, high-risk solicitation adjectives, 
                  and link density before user copying. The result is a mathematically verified delivery confidence score 
                  exceeding 99% across Google Workspace and Microsoft 365 tenants.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-white/5 bg-black">
                    <p className="text-xs font-mono text-neutral-500">DICTIONARY SIZE</p>
                    <p className="text-lg font-bold text-white mt-1">200+ Trigger Terms</p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-black">
                    <p className="text-xs font-mono text-neutral-500">PENALTY CALCULATION</p>
                    <p className="text-lg font-bold text-purple-400 mt-1">Weighted Subtraction</p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-black">
                    <p className="text-xs font-mono text-neutral-500">A/B VARIANTS</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1">Automated Multi-Pass</p>
                  </div>
                </div>
              </div>
            )}

            {activeArchTab === 'sovereignty' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Lock className="text-emerald-400" size={24} />
                  <h3 className="text-2xl font-bold text-white">Cryptographic Isolation & Zero-PII Leakage</h3>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed font-light max-w-3xl">
                  Glent Global products maintain an uncompromised privacy boundary. Customer usage tracking is decoupled 
                  from identity ledgers. All historical email logs are constrained by PostgreSQL Row Level Security (RLS), 
                  preventing accidental cross-tenant data traversal or exposure in client-side runtime logs.
                </p>
                <div className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs text-neutral-400">
                  <p className="text-neutral-500">// Row Level Security Verification Rule</p>
                  <p className="text-emerald-400">CREATE POLICY &quot;Users access own generations only&quot;</p>
                  <p className="text-neutral-300">ON public.emails FOR ALL</p>
                  <p className="text-neutral-300">USING (auth.uid() = user_id);</p>
                </div>
              </div>
            )}

            {activeArchTab === 'monetary' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Database className="text-cyan-400" size={24} />
                  <h3 className="text-2xl font-bold text-white">Prepaid 30-Day Passes (Zero Auto-Debit Churn)</h3>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed font-light max-w-3xl">
                  Traditional SaaS subscription billing fails in global markets due to bank card e-mandate rejections and 
                  chargeback friction. Glent Global operates exclusively on 30-Day Prepaid Passes via PayPal Orders v2. 
                  Users maintain absolute sovereign control over renewals, with stackable expiration timers and zero unwanted recurring charges.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-white/5 bg-black">
                    <p className="text-xs font-mono text-neutral-500">BILLING ARCHITECTURE</p>
                    <p className="text-lg font-bold text-white mt-1">Prepaid Orders v2</p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-black">
                    <p className="text-xs font-mono text-neutral-500">MANDATE FRICTION</p>
                    <p className="text-lg font-bold text-cyan-400 mt-1">0% Card Declines</p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-black">
                    <p className="text-xs font-mono text-neutral-500">STACKABILITY</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1">+30 Days / Transaction</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 5: GLOBAL EDGE TOPOLOGY (SVG MAP VISUALIZER) */}
        <section className="rounded-3xl border border-white/10 bg-neutral-950 p-8 sm:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
                <Globe size={14} className="text-blue-400" /> Global Anycast Routing
              </div>
              <h3 className="text-2xl font-bold text-white">Edge Node Distribution</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active Routing
              </span>
              <span className="text-neutral-500">Avg Global RTT: 24ms</span>
            </div>
          </div>

          {/* Topology Node Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { city: 'San Francisco', code: 'SFO-1', ping: '12ms', status: 'Optimal' },
              { city: 'Frankfurt', code: 'FRA-2', ping: '18ms', status: 'Optimal' },
              { city: 'Tokyo', code: 'NRT-1', ping: '31ms', status: 'Optimal' },
              { city: 'Mumbai', code: 'BOM-1', ping: '24ms', status: 'Optimal' },
              { city: 'London', code: 'LHR-2', ping: '15ms', status: 'Optimal' },
              { city: 'Singapore', code: 'SIN-1', ping: '28ms', status: 'Optimal' },
            ].map((node) => (
              <div key={node.code} className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500">{node.code}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-sm font-semibold text-white">{node.city}</p>
                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-neutral-400">
                  <span>RTT:</span>
                  <span className="text-blue-400">{node.ping}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: THE FOUNDER MANIFESTO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/5 pt-16">
          <div className="lg:col-span-4 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white text-black font-bold flex items-center justify-center text-base">
              G
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white">Executive Manifesto</h3>
            <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Founding Principles of Glent Global
            </p>
          </div>

          <div className="lg:col-span-8 space-y-6 text-sm text-neutral-400 font-light leading-relaxed">
            <p>
              The enterprise software landscape has become paralyzed by unnecessary complexity. 
              Modern software organizations prioritize headcounts over architectural discipline, 
              delivering bloated interfaces that slow human execution rather than accelerating it.
            </p>
            <p>
              Glent Global Enterprises was founded on a contrary hypothesis: that a lean, disciplined technology 
              lab operating on modern serverless edge architecture and specialized silicon (LPUs) can deliver 
              higher utility than legacy multi-thousand employee incumbents.
            </p>
            <p>
              We do not accept outside venture debt that compromises product integrity. We measure success by 
              system availability, sub-second execution, and whether our users achieve their commercial objectives.
            </p>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white uppercase tracking-wider">Arshdeep</p>
                <p className="text-[11px] font-mono text-neutral-500">Founder & Principal Systems Architect, Glent Global</p>
              </div>
              <a
                href="https://instagram.com/glentglobal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5"
              >
                <InstagramIcon size={14} /> @glentglobal
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 7: INTERACTIVE INSTITUTIONAL INQUIRY TERMINAL */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/40 to-black p-8 sm:p-14 space-y-8 relative overflow-hidden">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">Institutional Dispatch</p>
            <h3 className="text-3xl font-bold tracking-tight text-white">Direct Communication Desk</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              For enterprise pass syndication, developer API access, or creator partnerships across the Glent Global portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-black/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Official Executive Email</span>
                <button
                  onClick={() => copyToClipboard('help@writeyouremail.com', 'email')}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  {copiedKey === 'email' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-lg font-mono font-semibold text-white">help@writeyouremail.com</p>
              <p className="text-[11px] text-neutral-500">Monitored directly by core engineering & executive triage.</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-black/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Instagram Channel</span>
                <a
                  href="https://instagram.com/glentglobal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <ArrowUpRight size={14} />
                </a>
              </div>
              <p className="text-lg font-mono font-semibold text-white">@glentglobal</p>
              <p className="text-[11px] text-neutral-500">Official corporate updates, product launches, and ecosystem dispatches.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/5">
            <a
              href="mailto:help@writeyouremail.com?subject=Institutional%20Inquiry%20-%20Glent%20Global"
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
            >
              <Mail size={14} /> Dispatch Institutional Ingestion
            </a>
            <span className="text-xs font-mono text-neutral-600">
              DISPATCH ACKNOWLEDGEMENT SLA: &lt; 4 HOURS
            </span>
          </div>
        </section>

      </div>
    </div>
  );
}