import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, Cpu, Layers, Terminal, Database, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ecosystem & Portfolio | Glent Global Enterprises',
  description: 'Technical portfolio and production initiatives across Glent Global Enterprises.',
};

export default function GlentEcosystemPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 space-y-20">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400">Venture Portfolio</p>
        <h1 className="text-4xl font-bold tracking-tight text-white">The Glent Ecosystem</h1>
        <p className="text-sm text-neutral-400 font-light leading-relaxed">
          Our products operate as independent operational units sharing a centralized data fabric, security architecture, and inference cluster.
        </p>
      </div>

      {/* Product Deep Dive 01: WriteYourEmail */}
      <section className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.04] to-transparent p-8 sm:p-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-lg">
              W
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">WriteYourEmail.com</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Production v2.4
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">Autonomous B2B Outreach & Deliverability Intelligence</p>
            </div>
          </div>

          <Link
            href="/studio"
            className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5 self-start"
          >
            Launch Studio <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <div className="text-neutral-400 font-mono flex items-center gap-1.5">
              <Cpu size={14} className="text-blue-400" /> Model Architecture
            </div>
            <p className="text-neutral-300 font-medium">Meta Llama 3.3 70B Versatile via Groq LPUs</p>
            <p className="text-neutral-500 leading-relaxed font-light">Sub-second generation latency with deterministic JSON schema extraction.</p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <div className="text-neutral-400 font-mono flex items-center gap-1.5">
              <Layers size={14} className="text-purple-400" /> Deliverability Engine
            </div>
            <p className="text-neutral-300 font-medium">Algorithmic Spam Word Auditor</p>
            <p className="text-neutral-500 leading-relaxed font-light">Local heuristic scanner penalizes high-risk terminology before mail server egress.</p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <div className="text-neutral-400 font-mono flex items-center gap-1.5">
              <Database size={14} className="text-emerald-400" /> Prepaid Pass Billing
            </div>
            <p className="text-neutral-300 font-medium">PayPal Orders v2 Engine</p>
            <p className="text-neutral-500 leading-relaxed font-light">Zero recurring auto-charge friction. Compliant with RBI Indian e-mandates.</p>
          </div>
        </div>
      </section>

      {/* Upcoming Roadmap Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Project 02: Glent Signal */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400">
              <Cpu size={18} />
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-800 text-neutral-400">
              Phase 02 • Q2 2025
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-200">Glent Signal</h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-light">
              Autonomous prospect intent identification engine. Scans corporate filings, hiring velocity, and API activity to detect enterprise readiness before cold outreach.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-500">Intent Mining</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-500">Autonomous CRM Sync</span>
          </div>
        </div>

        {/* Project 03: Glent Neural Inbox */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400">
              <Terminal size={18} />
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-800 text-neutral-400">
              Phase 03 • R&D
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-200">Glent Neural Inbox</h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-light">
              Sub-10ms autonomous response orchestration. Handles meeting scheduling, calendar friction, and technical objection resolution with zero human touch.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-500">Autonomous Triage</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-500">Edge Reasoning</span>
          </div>
        </div>
      </div>
    </div>
  );
}