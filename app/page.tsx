"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function MarketingHomepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle Navbar styling on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="relative w-full overflow-x-hidden min-h-screen bg-[#000000] text-[#f5f5f7] selection:bg-[#0a84ff] selection:text-white"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Arial, sans-serif',
      }}
    >
      {/* Dynamic Background Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-gradient-to-b from-[#0a84ff]/20 via-purple-600/10 to-transparent blur-[150px] pointer-events-none rounded-full" />

      {/* Glassmorphic Navbar */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? "bg-[#000000]/80 backdrop-blur-2xl border-b border-white/10 saturate-150 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 font-semibold tracking-tight text-xl z-50">
            <span className="w-8 h-8 bg-gradient-to-br from-[#0a84ff] to-purple-600 text-white flex items-center justify-center font-bold text-sm rounded-lg shadow-lg shadow-[#0a84ff]/20">
              ✉️
            </span>
            <span className="text-[#f5f5f7]">WriteYourEmail</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm text-[#86868b] font-medium">
            <a href="#features" className="hover:text-[#f5f5f7] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#f5f5f7] transition-colors">How it Works</a>
            <Link href="/pricing" className="hover:text-[#f5f5f7] transition-colors">Pricing</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/studio" className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition">
              Sign In
            </Link>
            <Link
              href="/studio"
              className="text-sm font-semibold bg-[#f5f5f7] text-black hover:bg-white px-5 py-2 rounded-full transition shadow-sm hover:scale-105 transform duration-200"
            >
              Start for Free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[#86868b] z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`absolute top-0 left-0 w-full h-screen bg-[#000000] flex flex-col items-center justify-center space-y-8 transition-all duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-[#86868b] hover:text-white">Features</a>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-[#86868b] hover:text-white">Pricing</Link>
          <Link href="/studio" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-white bg-[#0a84ff] px-8 py-3 rounded-full mt-4">Open Studio Engine</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a84ff]/10 border border-[#0a84ff]/20 text-xs font-bold text-[#0a84ff] mb-8 shadow-sm tracking-wide uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0a84ff] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0a84ff]"></span>
          </span>
          WriteYourEmail V7.0 Titan is live
        </div>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-[#f5f5f7] mb-8 leading-[1.1]">
          Emails that get <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-[#0a84ff] via-purple-400 to-amber-300 bg-clip-text text-transparent">
            replied to.
          </span>
        </h1>
        <p className="text-[#86868b] text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed mb-12">
          The AI sales communication engine for top-performing revenue teams. Generate cold outreach, 3-step sequences, and bulk CSV campaigns engineered to land in the inbox.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/studio"
            className="w-full sm:w-auto text-center bg-[#f5f5f7] hover:bg-white text-black font-semibold px-8 py-4 rounded-full text-lg transition shadow-xl hover:scale-105 transform duration-300"
          >
            Launch the Studio
          </Link>
          <Link
            href="/pricing"
            className="w-full sm:w-auto text-center bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white font-semibold px-8 py-4 rounded-full text-lg border border-white/10 transition"
          >
            View Pricing Plans
          </Link>
        </div>
        <p className="mt-6 text-sm text-[#55555d] font-medium">No credit card required for the Hobby plan.</p>
      </section>

      {/* Hero Image Mockup */}
      <section className="px-6 pb-24 max-w-6xl mx-auto relative z-10">
        <div className="relative rounded-[2rem] border border-white/10 bg-[#1c1c1e]/50 backdrop-blur-md p-2 shadow-2xl overflow-hidden aspect-video">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a84ff]/5 to-transparent pointer-events-none" />
          <div className="w-full h-full bg-[#000000] rounded-[1.5rem] border border-white/5 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Mock Dashboard UI Layout */}
            <div className="w-full flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="text-xs text-[#86868b] bg-[#1c1c1e] px-4 py-1 rounded-full border border-white/5">Studio Pipeline Active</div>
            </div>
            
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 space-y-4">
                <div className="h-10 bg-[#1c1c1e] rounded-xl border border-white/5 flex items-center px-4"><div className="w-24 h-2 bg-white/20 rounded-full"></div></div>
                <div className="h-24 bg-[#1c1c1e] rounded-xl border border-white/5 p-4 flex flex-col gap-2">
                  <div className="w-full h-2 bg-white/20 rounded-full"></div>
                  <div className="w-3/4 h-2 bg-white/20 rounded-full"></div>
                </div>
                <div className="h-12 bg-gradient-to-r from-[#0a84ff] to-purple-600 rounded-xl flex items-center justify-center"><div className="w-32 h-2 bg-white/80 rounded-full"></div></div>
              </div>
              <div className="col-span-1 md:col-span-2 bg-[#1c1c1e] rounded-2xl border border-white/5 p-6 relative">
                 <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded">0% SPAM RISK</div>
                 <div className="w-32 h-3 bg-white/30 rounded-full mb-6 mt-2"></div>
                 <div className="space-y-3">
                    <div className="w-full h-2 bg-white/20 rounded-full"></div>
                    <div className="w-full h-2 bg-white/20 rounded-full"></div>
                    <div className="w-5/6 h-2 bg-white/20 rounded-full"></div>
                    <div className="w-full h-2 bg-white/20 rounded-full mt-4"></div>
                    <div className="w-4/6 h-2 bg-white/20 rounded-full"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Logos */}
      <section className="py-10 border-y border-white/10 bg-[#000000]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#55555d] mb-6">Built for top 1% revenue leaders utilizing</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            <div className="text-xl font-bold">Instantly</div>
            <div className="text-xl font-bold">HubSpot</div>
            <div className="text-xl font-bold">Salesforce</div>
            <div className="text-xl font-bold">Apollo.io</div>
            <div className="text-xl font-bold">Lemlist</div>
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Section */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#f5f5f7] mb-4">Enterprise sales engine.</h2>
          <p className="text-xl text-[#86868b] max-w-2xl mx-auto">Replaces hours of manual copywriting with highly trained AI models designed specifically for cold outbound.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Deliverability */}
          <div className="md:col-span-2 bg-[#1c1c1e] rounded-3xl border border-white/10 p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-[#0a84ff]/20 blur-[100px] rounded-full group-hover:bg-[#0a84ff]/30 transition duration-500" />
            <div className="relative z-10">
              <span className="text-3xl mb-4 block">🛡️</span>
              <h3 className="text-2xl font-bold text-white mb-3">Live Deliverability Audit</h3>
              <p className="text-[#86868b] text-lg leading-relaxed max-w-md">Our AI scans your email for common spam trigger words and automatically sanitizes them to ensure 99%+ inbox placement.</p>
            </div>
          </div>

          {/* Card 2: Bulk CSV */}
          <div className="md:col-span-1 bg-[#1c1c1e] rounded-3xl border border-white/10 p-8 relative overflow-hidden group">
            <div className="absolute bottom-[-20%] left-[-20%] w-[300px] h-[300px] bg-amber-500/10 blur-[80px] rounded-full group-hover:bg-amber-500/20 transition duration-500" />
            <div className="relative z-10">
              <span className="text-3xl mb-4 block">📊</span>
              <h3 className="text-xl font-bold text-white mb-3">Bulk CSV Personalization</h3>
              <p className="text-[#86868b] text-base">Upload a list of 1,000+ leads. The AI reads their bios and writes 1,000 completely unique icebreaker emails in seconds.</p>
            </div>
          </div>

          {/* Card 3: Sequences */}
          <div className="md:col-span-1 bg-[#1c1c1e] rounded-3xl border border-white/10 p-8 relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-3xl mb-4 block">🔄</span>
              <h3 className="text-xl font-bold text-white mb-3">Automated Sequences</h3>
              <p className="text-[#86868b] text-base">Instantly generate Day 1 pitches, Day 3 value-adds, and Day 7 breakup emails all connected to the same context.</p>
            </div>
          </div>

          {/* Card 4: Omni-channel */}
          <div className="md:col-span-2 bg-[#1c1c1e] rounded-3xl border border-white/10 p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-[-50%] left-[-10%] w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full group-hover:bg-purple-600/30 transition duration-500" />
            <div className="relative z-10">
              <span className="text-3xl mb-4 block">🌐</span>
              <h3 className="text-2xl font-bold text-white mb-3">Omni-Channel Generation</h3>
              <p className="text-[#86868b] text-lg leading-relaxed max-w-md">Generate an email, and the engine automatically creates a matching LinkedIn connection request, InMail, and Cold Call script.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#1c1c1e] to-[#000000] border border-white/10 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#0a84ff]/10 blur-[120px] rounded-full pointer-events-none" />
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 relative z-10 tracking-tight">Stop staring at a blank screen.</h2>
          <p className="text-xl text-[#86868b] font-medium mb-10 max-w-2xl mx-auto relative z-10">Join top performers closing more deals with AI. Start your free trial today and unlock the ultimate sales studio.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              href="/studio"
              className="w-full sm:w-auto text-center bg-[#0a84ff] hover:bg-[#0071e3] text-white font-bold px-10 py-5 rounded-full text-lg transition shadow-lg shadow-[#0a84ff]/25 hover:scale-105 transform duration-300"
            >
              Start Generating for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm font-medium text-[#86868b] bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white">✉️</span>
            <span>© 2026 WriteYourEmail. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <Link href="/pricing" className="hover:text-[#f5f5f7] transition">Pricing</Link>
            <Link href="/studio" className="hover:text-[#f5f5f7] transition">Studio Login</Link>
            <a href="#" className="hover:text-[#f5f5f7] transition">Terms & Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}