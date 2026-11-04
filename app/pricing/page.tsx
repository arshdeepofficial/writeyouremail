"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const PRO_CHECKOUT_BASE_URL =
  "https://writeyouremail.lemonsqueezy.com/checkout/buy/8de4d383-5177-4977-8066-de6872cdb69d";

export default function PricingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Initialize Supabase & Fetch Session for Lemon Squeezy Passthrough
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUserId(session.user.id);
          setUserEmail(session.user.email || null);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
          setUserEmail(session.user.email || null);
        } else {
          setUserId(null);
          setUserEmail(null);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  // Lock body scroll on mobile menu
  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [mobileMenuOpen]);

  // Build Checkout URL with dynamically attached custom user parameters
  const getCheckoutUrl = () => {
    const params = new URLSearchParams();
    if (userId) params.append("checkout[custom][user_id]", userId);
    if (userEmail) params.append("checkout[email]", userEmail);

    const queryString = params.toString();
    return queryString ? `${PRO_CHECKOUT_BASE_URL}?${queryString}` : PRO_CHECKOUT_BASE_URL;
  };

  return (
    <div
      className="relative w-full overflow-x-hidden min-h-screen bg-[#000000] text-[#f5f5f7] font-sans selection:bg-[#0a84ff] selection:text-white"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Apple Ambient Radial Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1100px] h-[500px] bg-gradient-to-b from-[#0a84ff]/20 via-[#0a84ff]/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

      {/* Glassmorphic Navigation Header */}
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
              <span className="w-7 h-7 bg-gradient-to-br from-[#0a84ff] to-purple-600 text-white flex items-center justify-center font-bold text-sm rounded-lg shadow-md">
                ✉️
              </span>
              <span className="text-[#f5f5f7]">WriteYourEmail</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm text-[#86868b] font-medium">
              <Link href="/#generator" className="hover:text-[#f5f5f7] transition-colors">
                Studio
              </Link>
              <Link href="/#faq" className="hover:text-[#f5f5f7] transition-colors">
                FAQ
              </Link>
              <Link href="/pricing" className="text-[#f5f5f7] font-semibold transition-colors">
                Pricing
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/"
              className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition"
            >
              Open Studio
            </Link>
            <div className="flex items-center space-x-3 ml-2 border-l border-white/10 pl-4">
              {userId ? (
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-[#86868b] bg-[#1c1c1e] px-3 py-1.5 rounded-full border border-white/5">
                    Logged in
                  </span>
                  <a
                    href={getCheckoutUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold bg-[#0a84ff] hover:bg-[#0071e3] text-white px-4 py-1.5 rounded-full transition shadow-md"
                  >
                    Upgrade Now ⚡
                  </a>
                </div>
              ) : (
                <>
                  <Link href="/" className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition">
                    Log In
                  </Link>
                  <Link
                    href="/"
                    className="text-sm font-semibold bg-[#f5f5f7] text-black hover:bg-white px-4 py-1.5 rounded-full transition shadow-sm"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>

          <button
            className="md:hidden text-[#86868b] hover:text-[#f5f5f7] z-50 p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
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

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[#000000] md:hidden pt-20 px-6 transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <nav className="flex flex-col text-lg font-medium text-[#f5f5f7]">
          <Link href="/#generator" onClick={() => setMobileMenuOpen(false)} className="border-b border-white/10 py-4">
            Studio Engine
          </Link>
          <Link href="/#faq" onClick={() => setMobileMenuOpen(false)} className="border-b border-white/10 py-4">
            FAQ & Support
          </Link>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="border-b border-white/10 py-4 text-[#0a84ff] font-bold">
            Pricing Plans
          </Link>
          <div className="pt-8 flex flex-col space-y-4">
            <a
              href={getCheckoutUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center bg-[#0a84ff] text-white py-3.5 rounded-xl text-base font-semibold shadow-lg"
            >
              Upgrade to Executive Pro ($9/mo)
            </a>
            <Link href="/" className="text-center bg-[#1c1c1e] text-[#f5f5f7] py-3.5 rounded-xl text-base font-semibold border border-white/10">
              Return to App
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Pricing Header */}
      <section className="pt-20 pb-12 px-6 max-w-4xl mx-auto text-center relative z-10">
        <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 inline-block mb-4 shadow-sm">
          TRANSPARENT sAAS PRICING
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f5f5f7] mb-6 leading-tight">
          Supercharge your outreach. <br />
          <span className="bg-gradient-to-r from-[#0a84ff] via-purple-400 to-amber-300 bg-clip-text text-transparent">
            Scale without limits.
          </span>
        </h1>
        <p className="text-[#86868b] text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Start for free with daily credits, or unlock Executive Pro for 3-step automated follow-up sequences, brand voice DNA, and unlimited generations.
        </p>
      </section>

      {/* Pricing Cards Grid */}
      <section className="pb-24 px-4 sm:px-6 max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Free Tier Card */}
          <div className="bg-[#1c1c1e] border border-white/10 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between hover:border-white/20 transition duration-300">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-[#f5f5f7]">Hobby Free</h3>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 text-[#86868b] border border-white/10">
                  Starter
                </span>
              </div>
              <p className="text-[#86868b] text-[15px] font-medium mb-8">
                For casual users, students, and early testers exploring AI email writing.
              </p>
              <div className="mb-8 flex items-baseline">
                <span className="text-5xl font-bold text-[#f5f5f7] tracking-tight">$0</span>
                <span className="text-[#86868b] ml-2 font-medium">/ forever</span>
              </div>
              <Link
                href="/"
                className="block w-full text-center bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#f5f5f7] font-semibold py-4 rounded-2xl text-[15px] transition mb-8 shadow-sm"
              >
                Use Free Version
              </Link>
              <ul className="space-y-4 text-[15px] text-[#86868b] font-medium">
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> 2 Instant Guest Generations
                </li>
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> 5 Daily Free Generations (Logged-In)
                </li>
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> Standard Cold Outreach & Sales Studio
                </li>
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> Magic Polish & Tone adjustment
                </li>
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> 25+ Global Language Translations
                </li>
                <li className="flex items-center text-[#55555d] line-through">
                  <span className="mr-3 font-bold">✕</span> 🔒 3-Step Follow-Up Sequences
                </li>
                <li className="flex items-center text-[#55555d] line-through">
                  <span className="mr-3 font-bold">✕</span> 🔒 Brand Voice DNA Profile Engine
                </li>
                <li className="flex items-center text-[#55555d] line-through">
                  <span className="mr-3 font-bold">✕</span> 🔒 1-Click CSV & TXT History Export
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs text-[#86868b] text-center font-medium">
              No credit card required
            </div>
          </div>

          {/* Executive Pro Tier Card */}
          <div className="bg-[#1c1c1e] border-2 border-[#0a84ff] rounded-[2.5rem] p-8 sm:p-10 relative shadow-2xl shadow-[#0a84ff]/10 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[#0a84ff] to-purple-600 text-white text-[11px] font-bold uppercase tracking-widest py-1.5 px-5 rounded-bl-2xl shadow-md">
              Most Popular
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-[#f5f5f7]">Executive Pro</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ⚡ GOD MODE
                </span>
              </div>
              <p className="text-[#86868b] text-[15px] font-medium mb-8">
                For sales executives, founders, agency owners, and power writers.
              </p>
              <div className="mb-8 flex items-baseline">
                <span className="text-5xl font-bold text-[#f5f5f7] tracking-tight">$9</span>
                <span className="text-[#86868b] ml-2 font-medium">/ month</span>
              </div>
              <a
                href={getCheckoutUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold py-4 rounded-2xl text-[15px] transition shadow-lg shadow-[#0a84ff]/20 mb-8 transform hover:scale-[1.01]"
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
                  <span className="text-amber-400 mr-3 font-bold">✓</span> <strong>🥊 AI Objection Handler & Rebuttal Studio</strong>
                </li>
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> <strong>📊 A/B Split Test Generator (Metrics vs Pain-Point)</strong>
                </li>
                <li className="flex items-center">
                  <span className="text-[#0a84ff] mr-3 font-bold">✓</span> <strong>💼 Multi-Vertical Industry Batch Generator</strong>
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-400 mr-3 font-bold">✓</span> <strong>🛡️ Live Deliverability Spam Risk Audit</strong>
                </li>
                <li className="flex items-center">
                  <span className="text-[#34c759] mr-3 font-bold">✓</span> <strong>📥 1-Click CSV & TXT CRM History Export</strong>
                </li>
              </ul>
            </div>
            <p className="text-[12px] text-center text-[#86868b] mt-8 pt-4 border-t border-white/5 font-medium">
              Instant activation • Automated via Lemon Squeezy • Cancel anytime
            </p>
          </div>

        </div>
      </section>

      {/* Feature Guarantee & Security Bar */}
      <section className="pb-20 px-6 max-w-4xl mx-auto text-center relative z-10">
        <div className="bg-[#1c1c1e]/60 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-around gap-4 text-xs font-medium text-[#86868b] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-base">🔒</span> 256-Bit SSL Encrypted Checkout
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">💳</span> Credit Cards & PayPal Supported
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span> Multi-Model Groq Priority Pipeline
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="pb-24 px-6 max-w-3xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center text-[#f5f5f7] mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-[#f5f5f7] mb-2">How does the billing activation work?</h4>
            <p className="text-[#86868b] text-sm leading-relaxed">
              When you complete payment via Lemon Squeezy, our webhook automatically upgrades your Supabase user ID within seconds. You immediately unlock unlimited generations and all Pro features without reloading.
            </p>
          </div>
          <div className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-[#f5f5f7] mb-2">What is the Brand Voice DNA feature?</h4>
            <p className="text-[#86868b] text-sm leading-relaxed">
              Brand Voice DNA allows you to input your company's tone guideline, key selling points, or website bio. The AI enforces this signature style across every generated email and multi-step sequence.
            </p>
          </div>
          <div className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-[#f5f5f7] mb-2">Can I cancel my subscription anytime?</h4>
            <p className="text-[#86868b] text-sm leading-relaxed">
              Yes, absolutely. You can manage or cancel your subscription at any time directly through the Lemon Squeezy customer portal sent with your order confirmation email.
            </p>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm font-medium text-[#86868b]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 WriteYourEmail. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/" className="hover:text-[#f5f5f7] transition">
              Studio Home
            </Link>
            <Link href="/pricing" className="hover:text-[#f5f5f7] transition">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}