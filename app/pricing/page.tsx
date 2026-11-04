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
    <div className="relative w-full overflow-x-hidden min-h-screen bg-[#000000] text-[#f5f5f7] font-sans selection:bg-[#0a84ff] selection:text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      
      {/* Navigation Header */}
      <header className={`sticky top-0 z-50 border-b border-white/10 transition-colors duration-300 ${mobileMenuOpen ? 'bg-[#000000]' : 'bg-[#000000]/70 backdrop-blur-2xl saturate-150'}`}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 font-semibold tracking-tight text-lg z-50" onClick={() => setMobileMenuOpen(false)}>
              <span className="w-6 h-6 bg-gradient-to-br from-[#f5f5f7] to-[#a1a1a6] text-black flex items-center justify-center font-bold text-sm rounded-md shadow-sm">✉️</span>
              <span>WriteYourEmail</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm text-[#86868b] font-medium">
              <Link href="/#generator" className="hover:text-[#f5f5f7] transition-colors">Products</Link>
              <Link href="/#faq" className="hover:text-[#f5f5f7] transition-colors">Resources</Link>
              <Link href="/pricing" className="text-[#f5f5f7] transition-colors">Pricing</Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/#generator" className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition">Get a Demo</Link>
            <div className="flex items-center space-x-3 ml-2 border-l border-white/10 pl-4">
              <Link href="/" className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition">Log In</Link>
              <Link href="/" className="text-sm font-medium bg-[#f5f5f7] text-black hover:bg-white px-4 py-1.5 rounded-full transition shadow-sm">Sign Up</Link>
            </div>
          </div>

          <button className="md:hidden text-[#86868b] hover:text-[#f5f5f7] z-50 p-2 -mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      <div className={`fixed inset-0 z-40 bg-[#000000] md:hidden pt-20 px-6 transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <nav className="flex flex-col text-lg font-medium text-[#f5f5f7]">
          <Link href="/#generator" onClick={() => setMobileMenuOpen(false)} className="border-b border-white/10 py-4">Products</Link>
          <Link href="/#faq" onClick={() => setMobileMenuOpen(false)} className="border-b border-white/10 py-4">Resources</Link>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="border-b border-white/10 py-4 text-[#f5f5f7]">Pricing</Link>
          <div className="pt-8 flex flex-col space-y-4">
            <Link href="/" className="text-center bg-[#1c1c1e] text-[#f5f5f7] py-3 rounded-xl text-base font-semibold">Log In</Link>
            <Link href="/" className="text-center bg-[#f5f5f7] text-black py-3 rounded-xl text-base font-semibold">Sign Up</Link>
          </div>
        </nav>
      </div>

      {/* Pricing Header */}
      <section className="pt-24 pb-16 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f5f5f7] mb-6">
          Pricing for everyone.
        </h1>
        <p className="text-[#86868b] text-xl font-medium max-w-2xl mx-auto">
          Start writing emails for free, or upgrade to Pro for unlimited intelligence.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Free Tier */}
          <div className="bg-[#1c1c1e] rounded-[2rem] p-8 sm:p-10">
            <h3 className="text-2xl font-bold text-[#f5f5f7] mb-2">Hobby</h3>
            <p className="text-[#86868b] text-[15px] font-medium mb-8">For individuals trying out the platform.</p>
            <div className="mb-8 flex items-baseline">
              <span className="text-5xl font-bold text-[#f5f5f7] tracking-tight">$0</span>
              <span className="text-[#86868b] ml-2 font-medium">/ forever</span>
            </div>
            <Link href="/" className="block w-full text-center bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#f5f5f7] font-semibold py-3.5 rounded-full text-[15px] transition mb-10">
              Start for Free
            </Link>
            <ul className="space-y-4 text-[15px] text-[#86868b] font-medium">
              <li className="flex items-center"><span className="text-[#34c759] mr-3 font-bold">✓</span> 2 Free Guest Emails</li>
              <li className="flex items-center"><span className="text-[#34c759] mr-3 font-bold">✓</span> 5 Free Emails / Day (Registered)</li>
              <li className="flex items-center"><span className="text-[#34c759] mr-3 font-bold">✓</span> Standard AI Speed</li>
              <li className="flex items-center"><span className="text-[#34c759] mr-3 font-bold">✓</span> Basic Email Templates</li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="bg-[#1c1c1e] border border-white/10 rounded-[2rem] p-8 sm:p-10 relative shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a84ff] text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-md">
              Pro
            </div>
            <h3 className="text-2xl font-bold text-[#f5f5f7] mb-2">Unlimited</h3>
            <p className="text-[#86868b] text-[15px] font-medium mb-8">For professionals who write emails daily.</p>
            <div className="mb-8 flex items-baseline">
              <span className="text-5xl font-bold text-[#f5f5f7] tracking-tight">$9</span>
              <span className="text-[#86868b] ml-2 font-medium">/ month</span>
            </div>
            <a href={PRO_CHECKOUT_URL} className="block w-full text-center bg-[#f5f5f7] hover:bg-white text-black font-semibold py-3.5 rounded-full text-[15px] transition shadow-sm mb-10">
              Upgrade to Pro
            </a>
            <ul className="space-y-4 text-[15px] text-[#f5f5f7] font-medium">
              <li className="flex items-center"><span className="text-[#34c759] mr-3 font-bold">✓</span> <strong>Unlimited</strong> Email Generations</li>
              <li className="flex items-center"><span className="text-[#34c759] mr-3 font-bold">✓</span> 3 Variations + Subject Studio</li>
              <li className="flex items-center"><span className="text-[#34c759] mr-3 font-bold">✓</span> 25+ Output Languages</li>
              <li className="flex items-center"><span className="text-[#34c759] mr-3 font-bold">✓</span> Magic Polish Draft Tools</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm font-medium text-[#86868b]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 WriteYourEmail. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-[#f5f5f7] transition">Terms</Link>
            <Link href="/privacy" className="hover:text-[#f5f5f7] transition">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}