"use client";

import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Mail, 
  Target, 
  CheckCircle2,
  Send,
  Phone
} from "lucide-react";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[#000000] text-[#f5f5f7] font-sans selection:bg-[#0a84ff] selection:text-white relative overflow-x-hidden"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Ambient Apple Radial Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-gradient-to-b from-[#0a84ff]/20 via-[#0a84ff]/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* Header Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#000000]/70 backdrop-blur-2xl saturate-150 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 font-semibold text-lg tracking-tight group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] text-white flex items-center justify-center font-bold text-sm rounded-xl shadow-lg shadow-[#0a84ff]/20 group-hover:shadow-[#0a84ff]/40 transition-all">
              W
            </div>
            <span className="font-bold tracking-tight text-white">WriteYourEmail</span>
          </Link>
          <div className="flex items-center space-x-8">
            <Link href="/pricing" className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition hidden sm:block">
              Pricing
            </Link>
            <Link
              href="/studio"
              className="text-sm bg-white text-black px-5 py-2.5 rounded-full font-semibold hover:bg-[#e5e5ea] transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Enter Studio
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c1c1e] border border-white/10 text-[#0a84ff] text-xs font-bold uppercase tracking-wider mb-8 shadow-xl shadow-[#0a84ff]/10">
            <Sparkles className="w-4 h-4" /> V7.0 Titan Engine Live
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-[5.5rem] font-black tracking-tighter mb-8 bg-gradient-to-b from-white via-[#f5f5f7] to-[#86868b] bg-clip-text text-transparent leading-[1.05] max-w-5xl mx-auto">
            Stop sending emails <br className="hidden sm:inline" /> that get ignored.
          </h1>

          <p className="text-lg sm:text-xl text-[#86868b] max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            The high-converting AI outreach engine built for elite sales reps. Instantly generate emails, LinkedIn DMs, and cold call scripts that actually get replies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/studio"
              className="w-full sm:w-auto px-8 py-4 bg-[#0a84ff] text-white text-base font-bold rounded-full hover:bg-[#0071e3] transition-all shadow-[0_0_30px_rgba(10,132,255,0.3)] hover:shadow-[0_0_40px_rgba(10,132,255,0.4)] hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Start Generating Free <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="text-sm font-medium text-[#86868b] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required
            </div>
          </div>

          {/* Abstract UI Mockup */}
          <div className="relative max-w-5xl mx-auto rounded-t-3xl bg-[#141415] border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            {/* Window Header */}
            <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-[#000000]/50 backdrop-blur-md">
              <div className="w-3 h-3 rounded-full bg-[#ff453a]" />
              <div className="w-3 h-3 rounded-full bg-[#ffd60a]" />
              <div className="w-3 h-3 rounded-full bg-[#30d158]" />
              <div className="ml-4 px-3 py-1 rounded-md bg-[#1c1c1e] text-[10px] font-medium text-[#86868b] flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> studio.writeyouremail.com
              </div>
            </div>

            {/* Fake App Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
              <div className="col-span-1 space-y-4">
                <div className="h-4 w-24 bg-[#2c2c2e] rounded-full" />
                <div className="h-10 w-full bg-[#1c1c1e] rounded-xl border border-white/5" />
                <div className="h-24 w-full bg-[#1c1c1e] rounded-xl border border-white/5" />
                <div className="h-10 w-full bg-[#0a84ff] rounded-xl" />
              </div>
              <div className="col-span-2 space-y-4">
                <div className="h-4 w-32 bg-[#2c2c2e] rounded-full" />
                <div className="h-64 w-full bg-[#1c1c1e] rounded-xl border border-white/5 p-4 flex flex-col gap-3">
                  <div className="h-4 w-3/4 bg-[#2c2c2e] rounded-full" />
                  <div className="h-4 w-full bg-[#2c2c2e] rounded-full" />
                  <div className="h-4 w-5/6 bg-[#2c2c2e] rounded-full" />
                  <div className="h-4 w-1/2 bg-[#2c2c2e] rounded-full mt-4" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#000000] to-transparent" />
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="border-y border-white/5 bg-[#0a0a0a] py-10 mb-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-bold text-[#86868b] uppercase tracking-widest mb-6">
              Empowering outreach for high-performing teams
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale text-white">
              <div className="flex items-center gap-2 font-bold text-xl"><div className="w-6 h-6 bg-white rounded-md" /> Acme Corp</div>
              <div className="flex items-center gap-2 font-bold text-xl"><div className="w-6 h-6 bg-white rounded-full" /> GlobalTech</div>
              <div className="flex items-center gap-2 font-bold text-xl"><div className="w-6 h-6 bg-white rotate-45" /> Nexus</div>
              <div className="flex items-center gap-2 font-bold text-xl"><div className="w-6 h-6 border-2 border-white rounded-full" /> Vertex</div>
            </div>
          </div>
        </section>

        {/* BENTO BOX FEATURES GRID */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">Everything you need to close.</h2>
            <p className="text-[#86868b] text-lg">A complete toolkit for modern outbound sales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento 1: 11 Modes */}
            <div className="md:col-span-2 bg-[#141415] rounded-[2rem] border border-white/5 p-8 relative overflow-hidden group hover:border-white/10 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0a84ff]/10 rounded-full blur-[80px] -mr-20 -mt-20 transition-all group-hover:bg-[#0a84ff]/20" />
              <div className="relative z-10">
                <Target className="w-10 h-10 text-[#0a84ff] mb-6" />
                <h3 className="text-2xl font-bold mb-3 text-white">11 Omni-Channel Modes</h3>
                <p className="text-[#86868b] mb-8 max-w-md">
                  Don&apos;t just stick to email. Generate highly personalized outreach for every platform your prospects live on.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-2 bg-[#1c1c1e] border border-white/5 px-4 py-2 rounded-full text-sm font-medium text-white">
                    <Mail className="w-4 h-4 text-[#0a84ff]" /> Cold Email
                  </span>
                  <span className="flex items-center gap-2 bg-[#1c1c1e] border border-white/5 px-4 py-2 rounded-full text-sm font-medium text-white">
                    <svg className="w-4 h-4 fill-[#0a66c2]" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg> LinkedIn DM
                  </span>
                  <span className="flex items-center gap-2 bg-[#1c1c1e] border border-white/5 px-4 py-2 rounded-full text-sm font-medium text-white">
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> Twitter/X DM
                  </span>
                  <span className="flex items-center gap-2 bg-[#1c1c1e] border border-white/5 px-4 py-2 rounded-full text-sm font-medium text-white">
                    <Phone className="w-4 h-4 text-emerald-500" /> Cold Call
                  </span>
                </div>
              </div>
            </div>

            {/* Bento 2: Spam Shield */}
            <div className="md:col-span-1 bg-[#141415] rounded-[2rem] border border-white/5 p-8 relative overflow-hidden group hover:border-white/10 transition-all">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] -mr-10 -mb-10 transition-all group-hover:bg-emerald-500/20" />
              <div className="relative z-10">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mb-6" />
                <h3 className="text-2xl font-bold mb-3 text-white">Spam Shield</h3>
                <p className="text-[#86868b]">
                  Automatic 1-click trigger word sanitization ensures maximum inbox deliverability. Keep your domain reputation pristine.
                </p>
              </div>
            </div>

            {/* Bento 3: One Click Launch */}
            <div className="md:col-span-1 bg-[#141415] rounded-[2rem] border border-white/5 p-8 relative overflow-hidden group hover:border-white/10 transition-all">
               <div className="absolute top-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] -ml-10 -mt-10 transition-all group-hover:bg-purple-500/20" />
               <div className="relative z-10">
                 <Send className="w-10 h-10 text-purple-400 mb-6" />
                 <h3 className="text-2xl font-bold mb-3 text-white">1-Click Launch</h3>
                 <p className="text-[#86868b]">
                   Push generated drafts directly into Gmail or your desktop mail app with pre-filled subjects and bodies.
                 </p>
               </div>
            </div>

            {/* Bento 4: Fallback Engine */}
            <div className="md:col-span-2 bg-[#141415] rounded-[2rem] border border-white/5 p-8 relative overflow-hidden group hover:border-white/10 transition-all flex flex-col sm:flex-row items-center justify-between gap-8">
               <div className="relative z-10 w-full sm:w-1/2">
                 <Zap className="w-10 h-10 text-amber-400 mb-6" />
                 <h3 className="text-2xl font-bold mb-3 text-white">Groq Powered</h3>
                 <p className="text-[#86868b]">
                   Lightning-fast generation using a resilient 3-tier model fallback loop (Llama 3, Mixtral, GPT). Silent retry logic means you never see an error.
                 </p>
               </div>
               <div className="w-full sm:w-1/2 h-32 bg-[#1c1c1e] rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
                 <div className="px-6 py-3 bg-black border border-white/10 rounded-lg text-xs font-mono text-emerald-400 z-10 shadow-2xl">
                   &gt; generation_complete in 0.8s
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <div className="bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-[#0a84ff]/20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6 relative z-10">
              Ready to book more meetings?
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto relative z-10 font-medium">
              Join the smart sales reps who are automating their outbound outreach. 
              Get started for free, upgrade when you need scale.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
              <Link
                href="/studio"
                className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-[#f5f5f7] transition-all hover:scale-105"
              >
                Go to Studio
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-4 bg-black/20 text-white font-bold rounded-full border border-white/20 hover:bg-black/40 transition-all backdrop-blur-md"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#000000] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] text-white flex items-center justify-center font-bold text-[10px] rounded-md">
              W
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">WriteYourEmail</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-[#86868b]">
            <Link href="/studio" className="hover:text-white transition">Studio</Link>
            <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          </div>

          <div className="text-xs text-[#52525b]">
            © 2026 WriteYourEmail. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}