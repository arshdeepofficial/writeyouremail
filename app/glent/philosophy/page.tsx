import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Philosophy | Glent Global Enterprises',
  description: 'The core engineering tenets, design principles, and deliverability physics behind Glent Global.',
};

export default function GlentPhilosophyPage() {
  const tenets = [
    {
      num: '01',
      title: 'Zero Latency Tolerance',
      body: 'Cognitive friction compounds exponentially with system latency. If an AI generator takes 8 seconds to deliver text, human creative momentum dissolves. Our benchmark is sub-second execution across all global nodes.',
    },
    {
      num: '02',
      title: 'Deliverability is Deterministic',
      body: 'Spam filters are mathematical classification matrices, not sentient critics. By auditing punctuation density, buzzword inflation, and header entropy before email dispatch, we turn email deliverability into an engineering certainty.',
    },
    {
      num: '03',
      title: 'Capital Efficiency over Headcount',
      body: 'We engineer software organizations that run with ultra-lean capital expenditure. By leveraging serverless edge runtimes, Groq LPUs, and distributed architectures, we achieve institutional scalability without inflated payroll.',
    },
    {
      num: '04',
      title: 'The Invisible Interface',
      body: 'The most sophisticated technology is indistinguishable from empty space. We reject chaotic enterprise dashboards in favor of high-contrast, Apple-inspired minimalist surfaces that present only the vital decision layer.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 space-y-16">
      <div className="space-y-3">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-purple-400">Foundational Axioms</p>
        <h1 className="text-4xl font-bold tracking-tight text-white">Engineering Philosophy</h1>
        <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-2xl">
          Glent Global Enterprises is governed by four non-negotiable principles. We build products designed to out-execute legacy SaaS incumbents through precision and restraint.
        </p>
      </div>

      <div className="space-y-8 border-t border-white/5 pt-10">
        {tenets.map((t) => (
          <div key={t.num} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-white/5 bg-white/[0.01]">
            <div className="font-mono text-xs text-neutral-500">{t.num} / TENET</div>
            <div className="md:col-span-3 space-y-2">
              <h3 className="text-lg font-semibold text-neutral-100">{t.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">{t.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}