import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, Shield, Zap, Sparkles, Globe, Cpu, Layers, Mail, Terminal, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Glent Global Enterprises | Autonomous Systems & Venture Lab',
  description: 'Glent Global Enterprises builds high-performance AI software systems and precision infrastructure for modern commerce.',
};

const InstagramIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
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

export default function GlentGlobalPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#0a84ff]/30 selection:text-white font-sans antialiased">
      {/* Top Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Navigation */}
      <header className="border-b border-white/5 backdrop-blur-xl bg-black/40 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white via-neutral-300 to-neutral-600 flex items-center justify-center font-bold text-black text-sm tracking-tighter shadow-md">
              G
            </div>
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-neutral-200">
              Glent Global
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-400 font-medium">
            <a href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</a>
            <a href="#philosophy" className="hover:text-white transition-colors">Philosophy</a>
            <a 
              href="https://instagram.com/glentglobal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <InstagramIcon size={14} />
              <span className="hidden sm:inline">@glentglobal</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] uppercase tracking-[0.25em] text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Venture Lab & Autonomous Systems
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500 leading-[1.1]">
            Engineering software with absolute precision.
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-light max-w-2xl">
            Glent Global Enterprises operates at the intersection of generative intelligence, 
            high-throughput data systems, and minimalist software architecture. We build products designed 
            to eliminate operational friction for modern businesses.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link 
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-neutral-200 transition-all shadow-lg shadow-white/5 group"
            >
              Launch Flagship: WriteYourEmail
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <a 
              href="mailto:help@writeyouremail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-neutral-300 font-medium text-sm hover:border-white/25 hover:text-white transition-all"
            >
              Institutional Inquiries
            </a>
          </div>
        </div>

        {/* Ecosystem / Products Showcase */}
        <section id="ecosystem" className="mt-32 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/5 pb-4 gap-2">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-blue-400 font-mono">Portfolio Roadmap</p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">The Glent Ecosystem</h2>
            </div>
            <p className="text-xs text-neutral-500 font-mono">Phase 01 Deployed • Phase 02 in Development</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Product 01: WriteYourEmail */}
            <div className="group relative rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-7 flex flex-col justify-between hover:border-blue-500/50 transition-all duration-300 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                    W
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Live • Phase 1
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white tracking-tight flex items-center gap-1.5">
                    WriteYourEmail.com
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    Autonomous B2B outreach & deliverability intelligence suite. Built with 30+ conversion models, 
                    zero-spam algorithmic audits, and deep mail client integrations.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400">Llama 3.3 70B</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400">Spam Scoring</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400">Prepaid Engine</span>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href="/studio"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black font-medium text-xs transition-all duration-200"
                >
                  Enter Studio <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Product 02: Glent Signal */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-7 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400">
                    <Cpu size={20} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-neutral-800 text-neutral-400 border border-white/5">
                    Q2 2025 • Phase 2
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-neutral-300 tracking-tight">
                    Glent Signal
                  </h3>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                    Algorithmic prospect enrichment and intent identification engine for high-velocity outbound teams.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5 opacity-60">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-500">Signal Extraction</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-500">Autonomous CRM</span>
                </div>
              </div>

              <div className="pt-8">
                <div className="w-full text-center py-2.5 rounded-lg border border-dashed border-white/10 text-neutral-500 font-mono text-[11px]">
                  In Active Development
                </div>
              </div>
            </div>

            {/* Product 03: Glent Neural Inbox */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-7 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400">
                    <Terminal size={20} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-neutral-800 text-neutral-400 border border-white/5">
                    Concept • Phase 3
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-neutral-300 tracking-tight">
                    Glent Neural Inbox
                  </h3>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                    Zero-latency AI triage agent capable of autonomous meeting orchestration and objection resolution.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5 opacity-60">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-500">Autonomous Triage</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-500">Voice Synthesis</span>
                </div>
              </div>

              <div className="pt-8">
                <div className="w-full text-center py-2.5 rounded-lg border border-dashed border-white/10 text-neutral-500 font-mono text-[11px]">
                  Research Initiative
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Philosophy / Core Pillars */}
        <section id="philosophy" className="mt-32 space-y-12">
          <div className="border-b border-white/5 pb-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-mono">Guiding Architecture</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">Foundational Principles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-blue-400 font-mono text-xs">01 / DISCIPLINE</div>
              <h4 className="text-lg font-medium text-neutral-200">Invisible Interface</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Software should never make users decipher its complexity. Our systems automate high-effort cognitive tasks into single-click workflows.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-purple-400 font-mono text-xs">02 / DELIVERABILITY</div>
              <h4 className="text-lg font-medium text-neutral-200">Algorithmic Integrity</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Outreach that fails to land in the inbox does not exist. We hold deliverability and zero-spam audits as non-negotiable primitives.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-emerald-400 font-mono text-xs">03 / VELOCITY</div>
              <h4 className="text-lg font-medium text-neutral-200">Low-Latency Inference</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Using Groq Llama 3.3 edge computing, our products generate production-ready sales intelligence in under 800 milliseconds.
              </p>
            </div>
          </div>
        </section>

        {/* Founder & Corporate Inquiries */}
        <section className="mt-32 rounded-3xl border border-white/10 bg-gradient-to-r from-neutral-900/60 via-black to-neutral-900/60 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400">Corporate Governance</p>
            <h3 className="text-2xl font-semibold text-white tracking-tight">Direct Founder Inquiry</h3>
            <p className="text-xs text-neutral-400 max-w-md font-light">
              For partnership proposals, API syndication, or enterprise bulk deployments across Glent Global initiatives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a 
              href="mailto:help@writeyouremail.com?subject=Inquiry%20for%20Glent%20Global%20Enterprises"
              className="px-6 py-3 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2"
            >
              <Mail size={14} /> Contact Glent Global
            </a>
            <a 
              href="https://instagram.com/glentglobal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/30 text-neutral-300 text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <InstagramIcon size={14} /> Follow @glentglobal
            </a>
          </div>
        </section>
      </main>

      {/* Corporate Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-xs text-neutral-600">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="tracking-widest uppercase text-[10px]">
            © 2025 GLENT GLOBAL ENTERPRISES. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6 font-mono text-[11px] text-neutral-500">
            <Link href="/" className="hover:text-white transition-colors">WriteYourEmail</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}