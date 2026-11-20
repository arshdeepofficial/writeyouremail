import React from 'react';
import type { Metadata } from 'next';
import { Shield, Lock, Scale, Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Corporate Governance | Glent Global Enterprises',
  description: 'Corporate charter, compliance protocols, and entity governance for Glent Global Enterprises.',
};

export default function GlentGovernancePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 space-y-16">
      <div className="space-y-3">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400">Institutional Framework</p>
        <h1 className="text-4xl font-bold tracking-tight text-white">Corporate Governance</h1>
        <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-2xl">
          Glent Global Enterprises operates as the centralized holding and operational umbrella for autonomous SaaS assets and generative IP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-7 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <Building className="text-neutral-400" size={20} />
          <h3 className="text-base font-semibold text-white">Entity Hierarchy</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            All proprietary algorithms, domain real-estate (including WriteYourEmail.com), and payment reconciliation pipelines are owned and maintained by Glent Global Enterprises.
          </p>
        </div>

        <div className="p-7 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <Lock className="text-neutral-400" size={20} />
          <h3 className="text-base font-semibold text-white">Data Sovereign Boundary</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            We enforce strict user isolation. Cold emails, strategy inputs, and recipient parameters generated across our child products are never utilized to train public foundation models.
          </p>
        </div>

        <div className="p-7 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <Scale className="text-neutral-400" size={20} />
          <h3 className="text-base font-semibold text-white">Monetary Compliance</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            All transactions adhere strictly to central banking directives, leveraging standardized 30-day prepaid orders via PayPal Global, eliminating recurrent non-consensual debits.
          </p>
        </div>

        <div className="p-7 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
          <Shield className="text-neutral-400" size={20} />
          <h3 className="text-base font-semibold text-white">Infrastructure Integrity</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            High-availability deployment architecture across Vercel Edge Network, Supabase PostgreSQL with row-level security (RLS), and Groq low-latency hardware accelerators.
          </p>
        </div>
      </div>
    </div>
  );
}