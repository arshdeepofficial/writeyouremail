import React from 'react';
import type { Metadata } from 'next';
import { Mail, Instagram, MessageSquare, Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Institutional Inquiries | Glent Global Enterprises',
  description: 'Direct communication desk for Glent Global Enterprises executive leadership.',
};

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function GlentContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 space-y-16">
      <div className="space-y-3">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">Communication Desk</p>
        <h1 className="text-4xl font-bold tracking-tight text-white">Institutional Inquiries</h1>
        <p className="text-sm text-neutral-400 font-light leading-relaxed">
          For enterprise licensing, syndicate partnerships, press relations, or platform syndication across the Glent Global ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Direct Channels */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
            <div className="flex items-center gap-2 text-neutral-400">
              <Mail size={16} />
              <span className="text-xs font-mono uppercase tracking-wider">Executive Inbox</span>
            </div>
            <a
              href="mailto:help@writeyouremail.com?subject=Glent%20Global%20Corporate%20Inquiry"
              className="text-base font-semibold text-white hover:text-blue-400 transition-colors block"
            >
              help@writeyouremail.com
            </a>
            <p className="text-[11px] text-neutral-500">Monitored 24/7 by executive team.</p>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3">
            <div className="flex items-center gap-2 text-neutral-400">
              <InstagramIcon size={16} />
              <span className="text-xs font-mono uppercase tracking-wider">Official Instagram</span>
            </div>
            <a
              href="https://instagram.com/glentglobal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-white hover:text-blue-400 transition-colors block"
            >
              @glentglobal
            </a>
            <p className="text-[11px] text-neutral-500">Direct inquiries & corporate announcements.</p>
          </div>
        </div>

        {/* Corporate Profile Card */}
        <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-black text-sm">
              G
            </div>
            <h3 className="text-lg font-semibold text-white">Founder Dispatch</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              We respond to institutional, creator partnership, and developer proposals with extreme velocity. Include your organization domain and objective scope for accelerated triage.
            </p>
          </div>

          <a
            href="mailto:help@writeyouremail.com?subject=Partnership%20Proposal%20-%20Glent%20Global"
            className="w-full py-3 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors text-center block"
          >
            Dispatch Inquiry
          </a>
        </div>
      </div>
    </div>
  );
}