"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const PRO_CHECKOUT_URL =
  "https://writeyouremail.lemonsqueezy.com/checkout/buy/8de4d383-5177-4977-8066-de6872cdb69d";

export default function PricingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <div className="relative w-full overflow-x-hidden min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Navigation Bar */}
      <header className={`sticky top-0 z-50 border-b border-zinc-900 transition-colors duration-300 ${mobileMenuOpen ? 'bg-black' : 'bg-black/70 backdrop-blur-xl'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 font-bold tracking-tight text-lg z-50" onClick={() => setMobileMenuOpen(false)}>
              <span className="w-5 h-5 bg-white text-black flex items-center justify-center font-black text-xs rounded-sm">▲</span>
              <span>WriteYourEmail</span>
            </Link>
            
            {/* Desktop Links */}
            <nav className="hidden md:flex items-center space-x-6 text-sm text-zinc-400">
              <Link href="/#generator" className="hover:text-white transition">Products</Link>
              <Link href="/#faq" className="hover:text-white transition">Resources</Link>
              <Link href="/#generator" className="hover:text-white transition">Enterprise</Link>
              <Link href="/pricing" className="text-white transition">Pricing</Link>
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/#generator" className="text-xs font-medium text-zinc-300 hover:text-white px-3.5 py-2 rounded-full border border-zinc-800 hover:border-zinc-700 transition">
              Get a Demo
            </Link>
            <div className="flex items-center space-x-3 ml-2 border-l border-zinc-800 pl-4">
              <Link href="/" className="text-xs font-medium text-zinc-300 hover:text-white px-3.5 py-2 rounded-full border border-zinc-800 hover:border-zinc-700 transition">
                Log In
              </Link>
              <Link href="/" className="text-xs font-medium bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full transition">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-zinc-400 hover:text-white z-50 p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Menu (Fixed Overflow Issue) */}
      <div className={`fixed inset-0 z-40 bg-black md:hidden pt-20 px-6 transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <nav className="flex flex-col text-sm font-medium text-zinc-300">
          <Link href="/#generator" onClick={() => setMobileMenuOpen(false)} className="hover:text-white border-b border-zinc-900 py-4">Products</Link>
          <Link href="/#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white border-b border-zinc-900 py-4">Resources</Link>
          <Link href="/#generator" onClick={() => setMobileMenuOpen(false)} className="hover:text-white border-b border-zinc-900 py-4">Enterprise</Link>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-white border-b border-zinc-900 py-4">Pricing</Link>
          
          <div className="pt-8 flex flex-col space-y-4">
            <Link href="/#generator" className="text-center bg-zinc-900 text-white py-3 rounded-full text-sm font-semibold border border-zinc-800">
              Get a Demo
            </Link>
            <Link href="/" className="text-center bg-zinc-900 text-white py-3 rounded-full text-sm font-semibold border border-zinc-800">Log In</Link>
            <Link href="/" className="text-center bg-white text-black py-3 rounded-full text-sm font-semibold">Sign Up</Link>
          </div>
        </nav>
      </div>

      {/* Pricing Header */}
      <section className="pt-20 pb-12 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
          Pricing for everyone.
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Start writing emails for free, or upgrade to Pro for unlimited AI generations and priority speed.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Free Tier */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-10">
            <h3 className="text-2xl font-bold text-white mb-2">Hobby</h3>
            <p className="text-zinc-400 text-sm mb-6">For individuals trying out the platform.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-white">$0</span>
              <span className="text-zinc-500 ml-2">/ forever</span>
            </div>
            <Link href="/" className="block w-full text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold py-3 rounded-full text-sm transition mb-8">
              Start for Free
            </Link>
            <ul className="space-y-4 text-sm text-zinc-300">
              <li className="flex items-center"><span className="text-white mr-3">✓</span> 2 Free Guest Emails</li>
              <li className="flex items-center"><span className="text-white mr-3">✓</span> 5 Free Emails / Day (Registered)</li>
              <li className="flex items-center"><span className="text-white mr-3">✓</span> Standard AI Speed</li>
              <li className="flex items-center"><span className="text-white mr-3">✓</span> Basic Email Templates</li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-700 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-2xl shadow-white/5">
            <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-bl-lg">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <p className="text-zinc-400 text-sm mb-6">For professionals who write emails daily.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-white">$9</span>
              <span className="text-zinc-500 ml-2">/ month</span>
            </div>
            <a href={PRO_CHECKOUT_URL} className="block w-full text-center bg-white hover:bg-zinc-200 text-black font-semibold py-3 rounded-full text-sm transition mb-8">
              Upgrade to Pro
            </a>
            <ul className="space-y-4 text-sm text-zinc-300">
              <li className="flex items-center"><span className="text-white mr-3">✓</span> <strong>Unlimited</strong> Email Generations</li>
              <li className="flex items-center"><span className="text-white mr-3">✓</span> Priority AI Processing Speed</li>
              <li className="flex items-center"><span className="text-white mr-3">✓</span> All Tones & Advanced Context</li>
              <li className="flex items-center"><span className="text-white mr-3">✓</span> PayPal & Credit Card Supported</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-10 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 WriteYourEmail.com. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-zinc-400 transition">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-zinc-400 transition">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}