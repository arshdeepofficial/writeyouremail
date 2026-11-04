"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const PRO_CHECKOUT_URL =
  "https://writeyouremail.lemonsqueezy.com/checkout/buy/8de4d383-5177-4977-8066-de6872cdb69d";

export default function PricingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [mobileMenuOpen]);

  return (
    <div
      className="relative w-full overflow-x-hidden min-h-screen bg-[#000000] text-[#f5f5f7] font-sans selection:bg-[#0a84ff] selection:text-white"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Apple Ambient Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-b from-[#0a84ff]/15 via-[#0a84ff]/5 to-transparent blur-[100px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header
        className={`sticky top-0 z-50 border-b border-white/10 transition-colors duration-300 ${
          mobileMenuOpen ? "bg-[#000000]" : "bg-[#000000]/70 backdrop-blur-2xl saturate-150"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 font-semibold tracking-tight text-lg z-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="w-6 h-6 bg-gradient-to-br from-[#f5f5f7] to-[#a1a1a6] text-black flex items-center justify-center font-bold text-sm rounded-md shadow-sm">
                ✉️
              </span>
              <span>WriteYourEmail</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm text-[#86868b] font-medium">
              <Link href="/#generator" className="hover:text-[#f5f5f7] transition-colors">
                Products
              </Link>
              <Link href="/#faq" className="hover:text-[#f5f5f7] transition-colors">
                Resources
              </Link>
              <Link href="/pricing" className="text-[#f5f5f7] transition-colors">
                Pricing
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/#generator"
              className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition"
            >
              Get a Demo
            </Link>
            <div className="flex items-center space-x-3 ml-2 border-l border-white/10 pl-4">
              <Link href="/" className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition">
                Log In
              </Link>
              <Link
                href="/"
                className="text-sm font-medium bg-[#f5f5f7] text-black hover:bg-white px-4 py-1.5 rounded-full transition shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <button
            className="md:hidden text-[#86868b] hover:text-[#f5f5f7] z-50 p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#000000] md:hidden pt-20 px-6 transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <nav className="flex flex-col text-lg font-medium text-[#f5f5f7]">
          <Link href="/#generator" onClick={() => setMobileMenuOpen(false)} className="border-b border-white/10 py-4">
            Products
          </Link>
          <Link href="/#faq" onClick={() => setMobileMenuOpen(false)} className="border-b border-white/10 py-4">
            Resources
          </Link>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="border-b border-white/10 py-4 text-[#f5f5f7]">
            Pricing
          </Link>
          <div className="pt-8 flex flex-col space-y-4">
            <Link href="/" className="text-center bg-[#1c1c1e] text-[#f5f5f7] py-3 rounded-xl text-base font-semibold">
              Log In
            </Link>
            <Link href="/" className="text-center bg-[#f5f5f7] text-black py-3 rounded-xl text-base font-semibold">
              Sign Up
            </Link>
          </div>
        </nav>
      </div>

      {/* Pricing Header */}
      <section className="pt-24 pb-16 px-6 max-w-4xl mx-auto text-center">
        <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 inline-block mb-4">
          TRANSPARENT sAAS PRICING
        </span>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f5f5f7] mb-6">
          Pricing for high performers.
        </h1>
        <p className="text-[#86868b] text-xl font-medium max-w-2xl mx-auto">
          Start free with daily generations, or upgrade to Executive Pro to unlock sequences, brand voice DNA, and unlimited output.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Free Tier Card */}
          <div className="bg-[#1c1c1e] border border-white/5 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#f5f5f7] mb-2">Hobby Free</h3>
              <p className="text-[#86868b] text-[15px] font-medium mb-8">
                For casual users and students testing the platform.
              </p>
              <div className="mb-8 flex items-baseline">
                <span className="text-5xl font-bold text-[#f5f5f7] tracking-tight">$0</span>
                <span className="text-[#86868b] ml-2 font-medium">/ forever</span>
              </div>
              <Link
                href="/"
                className="block w-full text-center bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#f5f5f7] font-semibold py-4 rounded-2xl text-[15px] transition mb-10"
              >
                Start Free
              </Link>
              <ul className="space-y-4 text-[15px] text-[#86868b] font-medium">
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> 2 Free Guest Generations
                </li>
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> 5 Daily Free Generations (Logged-in)
                </li>
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> Standard Single Email Generation
                </li>
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> Magic Polish Draft Mode
                </li>
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> 25+ Target Languages
                </li>
                <li className="flex items-center text-[#55555d]">
                  <span className="mr-3 font-bold">✕</span> 🔒 3-Step Automated Sequences
                </li>
                <li className="flex items-center text-[#55555d]">
                  <span className="mr-3 font-bold">✕</span> 🔒 Custom Brand Voice DNA
                </li>
                <li className="flex items-center text-[#55555d]">
                  <span className="mr-3 font-bold">✕</span> 🔒 1-Click CSV/TXT History Export
                </li>
              </ul>
            </div>
          </div>

          {/* Executive Pro Tier Card */}
          <div className="bg-[#1c1c1e] border-2 border-[#0a84ff] rounded-[2.5rem] p-8 sm:p-10 relative shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[#0a84ff] to-purple-600 text-white text-[11px] font-bold uppercase tracking-widest py-1.5 px-5 rounded-bl-2xl shadow-md">
              Most Popular
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-[#f5f5f7]">Executive Pro</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ⚡ PRO
                </span>
              </div>
              <p className="text-[#86868b] text-[15px] font-medium mb-8">
                For sales executives, founders, recruiters, and power writers.
              </p>
              <div className="mb-8 flex items-baseline">
                <span className="text-5xl font-bold text-[#f5f5f7] tracking-tight">$9</span>
                <span className="text-[#86868b] ml-2 font-medium">/ month</span>
              </div>
              <a
                href={PRO_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold py-4 rounded-2xl text-[15px] transition shadow-lg mb-10"
              >
                Upgrade to Pro ($9/mo) — Cards & PayPal
              </a>
              <ul className="space-y-4 text-[15px] text-[#f5f5f7] font-medium">
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> <strong>Unlimited Daily Email Generations</strong>
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-3 font-bold">✓</span> <strong>3-Step Automated Outreach Sequences</strong> (Day 1, 3, 7)
                </li>
                <li className="flex items-center">
                  <span className="text-[#0a84ff] mr-3 font-bold">✓</span> <strong>Custom Brand Voice DNA Engine</strong>
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-400 mr-3 font-bold">✓</span> <strong>🥊 AI Objection Handler & Rebuttal Studio</strong>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-400 mr-3 font-bold">✓</span> <strong>🛡️ Live Inbox Spam Risk Audit (98%+ Open Rates)</strong>
                </li>
                <li className="flex items-center">
                  <span className="text-[#0a84ff] mr-3 font-bold">✓</span> <strong>📥 1-Click CSV & TXT History Export for CRMs</strong>
                </li>
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> DocuSign & Link Embedding
                </li>
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> Apple HTML Signature Generator
                </li>
              </ul>
            </div>
            <p className="text-[12px] text-center text-[#86868b] mt-8 pt-4 border-t border-white/5">
              Instant activation • Powered by Lemon Squeezy • Cancel anytime
            </p>
          </div>

        </div>
      </section>

      {/* Feature Guarantee Bar */}
      <section className="pb-24 px-6 max-w-4xl mx-auto text-center">
        <div className="bg-[#1c1c1e]/60 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-around gap-4 text-xs font-medium text-[#86868b]">
          <div className="flex items-center gap-2">
            <span>🔒 SSL Encrypted Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💳 PayPal & Credit Cards Accepted</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚡ Multi-Model Groq Priority Processing</span>
          </div>
        </div>
      </section>

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