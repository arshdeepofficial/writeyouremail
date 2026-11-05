"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Placeholders for your new Lemon Squeezy Product Links
const CHECKOUT_STARTER = "https://writeyouremail.lemonsqueezy.com/checkout/buy/YOUR_STARTER_LINK";
const CHECKOUT_GROWTH = "https://writeyouremail.lemonsqueezy.com/checkout/buy/YOUR_GROWTH_LINK";
const CHECKOUT_ENTERPRISE = "https://writeyouremail.lemonsqueezy.com/checkout/buy/YOUR_ENTERPRISE_LINK";

export default function PricingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState<boolean>(true); // Default to annual for better conversion

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
  const getCheckoutUrl = (baseUrl: string) => {
    const params = new URLSearchParams();
    if (userId) params.append("checkout[custom][user_id]", userId);
    if (userEmail) params.append("checkout[email]", userEmail);

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
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
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1100px] h-[500px] bg-gradient-to-b from-[#0a84ff]/20 via-purple-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

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
              <Link href="/#features" className="hover:text-[#f5f5f7] transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-[#f5f5f7] font-semibold transition-colors">
                Pricing
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/" className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition">
              Open Studio
            </Link>
            <div className="flex items-center space-x-3 ml-2 border-l border-white/10 pl-4">
              {userId ? (
                <span className="text-xs text-[#86868b] bg-[#1c1c1e] px-3 py-1.5 rounded-full border border-white/5">
                  Logged in
                </span>
              ) : (
                <>
                  <Link href="/" className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition">
                    Log In
                  </Link>
                  <Link
                    href="/"
                    className="text-sm font-semibold bg-[#f5f5f7] text-black hover:bg-white px-4 py-1.5 rounded-full transition shadow-sm"
                  >
                    Start Free
                  </Link>
                </>
              )}
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

      {/* Hero Pricing Header */}
      <section className="pt-20 pb-12 px-6 max-w-4xl mx-auto text-center relative z-10">
        <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 inline-block mb-4 shadow-sm">
          B2B SAAS PRICING
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#f5f5f7] mb-6 leading-tight">
          Supercharge your outreach. <br />
          <span className="bg-gradient-to-r from-[#0a84ff] via-purple-400 to-amber-300 bg-clip-text text-transparent">
            Scale without limits.
          </span>
        </h1>
        <p className="text-[#86868b] text-lg font-medium max-w-2xl mx-auto mb-10">
          From solo founders to enterprise sales teams. Pick the plan that fits your growth engine.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 text-sm font-medium">
          <span className={!isAnnual ? "text-white" : "text-[#86868b]"}>Pay Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 rounded-full bg-[#2c2c2e] border border-white/10 relative transition-colors duration-300 focus:outline-none"
            style={{ backgroundColor: isAnnual ? "#0a84ff" : "#2c2c2e" }}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform duration-300 ${
                isAnnual ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
          <span className={isAnnual ? "text-white" : "text-[#86868b]"}>
            Pay Annually <span className="text-emerald-400 text-xs font-bold ml-1">Save 20%</span>
          </span>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="pb-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* Tier 1: Starter */}
          <div className="bg-[#1c1c1e] border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-white/20 transition duration-300">
            <div>
              <h3 className="text-xl font-bold text-[#f5f5f7] mb-2">Starter</h3>
              <p className="text-[#86868b] text-sm font-medium mb-6">
                For solo founders and freelancers building their pipeline.
              </p>
              <div className="mb-6 flex items-baseline">
                <span className="text-4xl font-bold text-[#f5f5f7] tracking-tight">
                  ${isAnnual ? "15" : "19"}
                </span>
                <span className="text-[#86868b] ml-2 text-sm font-medium">/ month</span>
              </div>
              <a
                href={getCheckoutUrl(CHECKOUT_STARTER)}
                className="block w-full text-center bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#f5f5f7] font-semibold py-3.5 rounded-2xl text-sm transition mb-8 shadow-sm"
              >
                Get Starter
              </a>
              <ul className="space-y-4 text-sm text-[#d2d2d7] font-medium">
                <li className="flex items-start gap-3"><span className="text-[#34c759] font-bold">✓</span> Unlimited Email Generations</li>
                <li className="flex items-start gap-3"><span className="text-[#34c759] font-bold">✓</span> 1-Click Gmail & Outlook Launch</li>
                <li className="flex items-start gap-3"><span className="text-[#34c759] font-bold">✓</span> Subject Line Matrix (5 Variations)</li>
                <li className="flex items-start gap-3"><span className="text-[#34c759] font-bold">✓</span> CRM Merge Tag Support</li>
                <li className="flex items-start gap-3"><span className="text-[#34c759] font-bold">✓</span> Spam Auto-Sanitizer & Reading Grade</li>
              </ul>
            </div>
          </div>

          {/* Tier 2: Growth (Most Popular) */}
          <div className="bg-[#1c1c1e] border-2 border-[#0a84ff] rounded-[2.5rem] p-8 relative shadow-2xl shadow-[#0a84ff]/10 flex flex-col justify-between transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[#0a84ff] to-purple-600 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-bl-2xl shadow-md">
              Most Popular
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#f5f5f7] mb-2">Growth</h3>
              <p className="text-[#86868b] text-sm font-medium mb-6">
                For sales reps and marketers running omni-channel campaigns.
              </p>
              <div className="mb-6 flex items-baseline">
                <span className="text-4xl font-bold text-[#f5f5f7] tracking-tight">
                  ${isAnnual ? "31" : "39"}
                </span>
                <span className="text-[#86868b] ml-2 text-sm font-medium">/ month</span>
              </div>
              <a
                href={getCheckoutUrl(CHECKOUT_GROWTH)}
                className="block w-full text-center bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold py-3.5 rounded-2xl text-sm transition shadow-lg shadow-[#0a84ff]/20 mb-8 transform hover:scale-[1.02]"
              >
                Get Growth
              </a>
              <p className="text-xs font-bold text-[#86868b] mb-4 uppercase tracking-wider">Everything in Starter, plus:</p>
              <ul className="space-y-4 text-sm text-[#f5f5f7] font-medium">
                <li className="flex items-start gap-3"><span className="text-[#0a84ff] font-bold">✓</span> <strong>LinkedIn Omni-Channel Matcher</strong></li>
                <li className="flex items-start gap-3"><span className="text-[#0a84ff] font-bold">✓</span> <strong>Cold Call & Voicemail Scripts</strong></li>
                <li className="flex items-start gap-3"><span className="text-[#0a84ff] font-bold">✓</span> <strong>Twitter/X Cold DM Generator</strong></li>
                <li className="flex items-start gap-3"><span className="text-[#0a84ff] font-bold">✓</span> LinkedIn Profile Personalizer</li>
                <li className="flex items-start gap-3"><span className="text-[#0a84ff] font-bold">✓</span> 3-Step Follow-Up Sequences</li>
              </ul>
            </div>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="bg-[#1c1c1e] border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-white/20 transition duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none" />
            <div>
              <h3 className="text-xl font-bold text-[#f5f5f7] mb-2 flex items-center gap-2">
                Enterprise <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">MAX</span>
              </h3>
              <p className="text-[#86868b] text-sm font-medium mb-6">
                For agencies and sales teams doing high-volume automation.
              </p>
              <div className="mb-6 flex items-baseline">
                <span className="text-4xl font-bold text-[#f5f5f7] tracking-tight">
                  ${isAnnual ? "63" : "79"}
                </span>
                <span className="text-[#86868b] ml-2 text-sm font-medium">/ month</span>
              </div>
              <a
                href={getCheckoutUrl(CHECKOUT_ENTERPRISE)}
                className="block w-full text-center bg-[#f5f5f7] hover:bg-white text-black font-semibold py-3.5 rounded-2xl text-sm transition mb-8 shadow-sm"
              >
                Get Enterprise
              </a>
              <p className="text-xs font-bold text-[#86868b] mb-4 uppercase tracking-wider">Everything in Growth, plus:</p>
              <ul className="space-y-4 text-sm text-[#f5f5f7] font-medium">
                <li className="flex items-start gap-3"><span className="text-amber-400 font-bold">✓</span> <strong>Bulk CSV Lead Personalizer</strong></li>
                <li className="flex items-start gap-3"><span className="text-amber-400 font-bold">✓</span> <strong>URL / Website Icebreaker Scraper</strong></li>
                <li className="flex items-start gap-3"><span className="text-amber-400 font-bold">✓</span> <strong>Webhooks / Zapier CRM Push</strong></li>
                <li className="flex items-start gap-3"><span className="text-amber-400 font-bold">✓</span> Custom Brand Voice DNA</li>
                <li className="flex items-start gap-3"><span className="text-amber-400 font-bold">✓</span> A/B Testing & Multi-Vertical Engine</li>
              </ul>
            </div>
          </div>

        </div>
        
        <div className="mt-12 text-center">
          <Link href="/" className="text-sm font-medium text-[#86868b] hover:text-white transition underline underline-offset-4">
            Just want to test it out? Start with the free tier.
          </Link>
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