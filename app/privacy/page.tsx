"use client";

import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen bg-[#000000] text-[#f5f5f7] font-sans selection:bg-[#0a84ff] selection:text-white relative overflow-x-hidden"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#000000]/70 backdrop-blur-2xl saturate-150 h-16 flex items-center justify-between px-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2 font-semibold text-lg tracking-tight">
          <span className="w-6 h-6 bg-gradient-to-br from-[#f5f5f7] to-[#a1a1a6] text-black flex items-center justify-center font-bold text-sm rounded-md shadow-sm">
            ✉️
          </span>
          <span>WriteYourEmail</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/studio"
            className="text-xs bg-[#0a84ff] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0071e3] transition-colors"
          >
            Go to Studio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-[#86868b] hover:text-[#0a84ff] transition mb-4 gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5" /> Data Protection
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#86868b]">Last updated: November 2026</p>
        </div>

        <div className="space-y-10 text-[#d1d1d6] text-sm leading-relaxed border-t border-white/10 pt-10">
          <section className="bg-[#141415] p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">1. Information We Collect</h2>
            <p className="mb-3">
              WriteYourEmail.com collects minimal information required to deliver high-quality AI sales copy generation:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#86868b]">
              <li><strong>Account Credentials:</strong> Email address and authentication tokens via Supabase Auth.</li>
              <li><strong>Generation Prompts:</strong> Inputs provided in the Studio (ICP descriptions, offer details, subject lines) to construct LLM queries.</li>
              <li><strong>Payment Information:</strong> Handled securely by PayPal. We never store credit card numbers on our servers.</li>
            </ul>
          </section>

          <section className="bg-[#141415] p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>
              Your data is used exclusively to generate outreach copy, track usage limits, manage Pro subscription statuses, and improve user interface performance.
            </p>
          </section>

          <section className="bg-[#141415] p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">3. AI Data Processing Disclosure</h2>
            <p>
              Outreach prompt data is transmitted securely to Groq API endpoints solely for immediate inference generation. Prompts are not used to train public foundational models.
            </p>
          </section>

          <section className="bg-[#141415] p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">4. Security & Storage</h2>
            <p>
              User databases are hosted on Supabase with Row Level Security (RLS) policies enforced. Admin database keys are strictly isolated on server-side API routes.
            </p>
          </section>

          <section className="bg-[#141415] p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">5. Data Erasure Rights</h2>
            <p>
              You have the right to request deletion of your account and prompt generation history at any time by contacting support.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm font-medium text-[#86868b]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 WriteYourEmail. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-[#f5f5f7] transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#f5f5f7] transition">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}