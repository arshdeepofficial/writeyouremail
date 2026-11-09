"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Legal Terms
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Terms of Service
          </h1>
          <p className="text-sm text-[#86868b]">Last updated: November 2026</p>
        </div>

        <div className="space-y-10 text-[#d1d1d6] text-sm leading-relaxed border-t border-white/10 pt-10">
          <section className="bg-[#141415] p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using WriteYourEmail.com ("Service"), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you may not access or use the Service.
            </p>
          </section>

          <section className="bg-[#141415] p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">2. Description of Service</h2>
            <p>
              WriteYourEmail.com provides AI-powered email and sales outreach content generation tools. The Service utilizes third-party artificial intelligence engines (including Groq API) to generate sales copy, follow-ups, and cold messaging templates.
            </p>
          </section>

          <section className="bg-[#141415] p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">3. User Accounts and Usage Quotas</h2>
            <p className="mb-3">
              You are responsible for maintaining the confidentiality of your account credentials. The Service enforces usage tiers:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#86868b]">
              <li><strong>Guest Users:</strong> Restricted to 2 lifetime test generations.</li>
              <li><strong>Free Logged-in Users:</strong> 5 generations per 24-hour cycle.</li>
              <li><strong>Pro Users:</strong> Unlimited access subject to fair play and anti-spam abuse policies.</li>
            </ul>
          </section>

          <section className="bg-[#141415] p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">4. Payments, Subscriptions, and Refunds</h2>
            <p>
              All paid tiers are processed securely via PayPal. Upgrades take effect immediately upon completed payment authorization. Subscriptions and one-time purchases are non-refundable once AI credits have been consumed, except as required by applicable consumer law.
            </p>
          </section>

          <section className="bg-[#141415] p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">5. Acceptable Use Policy</h2>
            <p>
              You agree not to use the Service to generate illegal spam, phishing schemes, malicious content, deceptive practices, or messages that violate anti-spam legislation (including CAN-SPAM Act and GDPR compliance guidelines).
            </p>
          </section>

          <section className="bg-[#141415] p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">6. Limitation of Liability</h2>
            <p>
              WriteYourEmail.com and its operators shall not be liable for any indirect, incidental, or consequential damages resulting from AI output accuracy, email deliverability issues, or missed sales opportunities.
            </p>
          </section>

          <section className="bg-[#141415] p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">7. Contact Information</h2>
            <p>
              For any legal or technical inquiries regarding these terms, please contact us via your account support panel or at arshdeep.singh.official@outlook.com.
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