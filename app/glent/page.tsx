import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, ShieldCheck, Cpu, Activity, Sparkles } from 'lucide-react';

export default function GlentOverviewPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 space-y-24">
      {/* Hero */}
      <section className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          Autonomous Software Conglomerate
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-500 leading-[1.1]">
          Building autonomous systems for exponential commerce.
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-light">
          Glent Global Enterprises incubates, engineers, and operates mission-critical software. 
          We eliminate human friction in B2B transactions through high-velocity AI inference and deterministic deliverability physics.
        </p>

        <div className="pt-4 flex flex-wrap gap-4">
          <Link
            href="/studio"
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2"
          >
            Launch WriteYourEmail <ArrowUpRight size={14} />
          </Link>
          <Link
            href="/glent/ecosystem"
            className="px-6 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-neutral-300 font-semibold text-xs uppercase tracking-wider hover:border-white/30 hover:text-white transition-all flex items-center gap-2"
          >
            Explore Ecosystem <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Quantitative Vitals */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-white/5 py-10">
        <div className="space-y-1">
          <p className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">30+</p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Autonomous Modes</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl sm:text-3xl font-mono font-bold text-blue-400 tracking-tight">&lt;800ms</p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Inference Latency</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tracking-tight">99.4%</p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Zero-Spam Placement</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl sm:text-3xl font-mono font-bold text-purple-400 tracking-tight">$0/mo</p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Core Infra Overhead</p>
        </div>
      </section>

      {/* Flagship Highlight Card */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Flagship Division
            </span>
            <span className="text-neutral-500 font-mono text-xs">• Live in Global Production</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white">
            WriteYourEmail.com
          </h2>

          <p className="text-sm text-neutral-400 leading-relaxed font-light">
            The world’s first email generation studio pairing generative models (Llama 3.3 70B via Groq) with real-time spam dictionary heuristics, A/B subject line synthesis, and direct dispatch to Gmail and Outlook.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/studio"
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
            >
              Enter Studio <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/glent/ecosystem"
              className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-white/20 text-neutral-300 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              System Specs
            </Link>
          </div>
        </div>
      </section>

      {/* Corporate Architecture Triad */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-blue-400">
            <Cpu size={20} />
          </div>
          <h3 className="text-lg font-semibold text-white">Algorithmic Edge</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            We bypass cloud latency bottlenecks by running inference pipelines on specialized edge processing engines.
          </p>
          <Link href="/glent/philosophy" className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1 pt-2">
            View Philosophy <ArrowRight size={12} />
          </Link>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-purple-400">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-lg font-semibold text-white">Autonomous Governance</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            Every product within Glent Global complies with strict data residency, privacy compartmentalization, and RBI/PayPal billing mechanics.
          </p>
          <Link href="/glent/governance" className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1 pt-2">
            View Governance <ArrowRight size={12} />
          </Link>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-emerald-400">
            <Activity size={20} />
          </div>
          <h3 className="text-lg font-semibold text-white">Venture Syndicate</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            We structure our portfolio around high-margin SaaS tools designed to scale without bloated human operational overhead.
          </p>
          <Link href="/glent/contact" className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 pt-2">
            Institutional Desk <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </div>
  );
}