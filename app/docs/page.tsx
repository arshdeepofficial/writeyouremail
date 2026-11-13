"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Search,
  ChevronRight,
  Terminal,
  Mail,
  FileText,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  Copy,
  Check,
  Server,
  Globe,
  Lock,
  Cpu,
  BarChart3,
  Sliders,
  CheckSquare,
  RefreshCw,
  Scale,
  DollarSign,
  UserCheck,
  Flame,
  FileCheck,
  Info,
  ShieldAlert,
} from "lucide-react";

// Fixed inline Logo for reliable SSR prerendering
function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0a84ff] to-[#bf5af2] text-white shadow-lg shadow-[#0a84ff]/20">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white">
        WriteYour<span className="text-[#0a84ff]">Email</span>
      </span>
    </div>
  );
}

// Interactive Copy Button for DNS Snippets
function CopySnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-[#222224] bg-[#1c1c1e] px-2.5 py-1 text-xs font-medium text-gray-300 transition hover:bg-[#2c2c2e] hover:text-white"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-[#30d158]" />
          <span className="text-[#30d158]">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-gray-400" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

export default function DocumentationPage() {
  const [activeCategory, setActiveCategory] = useState("deliverability");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModeTab, setActiveModeTab] = useState("cold");

  const docCategories = [
    { id: "deliverability", label: "Deliverability Engine & Scoring", icon: ShieldCheck },
    { id: "technical", label: "DNS & Technical Infrastructure", icon: Terminal },
    { id: "modes", label: "30 Outreach Modes Playbook", icon: Layers },
    { id: "warmup", label: "Domain Warmup & Ramp Schedule", icon: Flame },
    { id: "compliance", label: "Legal & Regulatory Compliance", icon: Scale },
    { id: "faq", label: "Prepaid Passes & Account FAQ", icon: HelpCircle },
  ];

  // 30 Complete Modes Data Dictionary
  const outreachModesData = [
    { id: "cold-b2b", name: "Cold B2B Prospecting", category: "cold", length: "75-100 words", cta: "Soft Interest CTA", tone: "Professional & Direct", desc: "Short, problem-driven outreach tailored for agency owners, VPs of Sales, and executive decision-makers." },
    { id: "cold-saas", name: "Cold SaaS Pitch & Demo", category: "cold", length: "80-110 words", cta: "Low-Friction Demo Link", tone: "Product-Led", desc: "Highlights technical pain points, product workflow savings, and instant video demo invites." },
    { id: "investor-pitch", name: "Investor & VC Pitch", category: "cold", length: "100-130 words", cta: "Deck Review Request", tone: "High Authority", desc: "Formats key growth metrics, MRR, market size, and pitch deck access for angels and venture firms." },
    { id: "partnership", name: "Strategic Partnership Pitch", category: "cold", length: "90-120 words", cta: "Exploratory Call", tone: "Collaborative", desc: "Proposes mutual distribution benefits, co-marketing opportunities, or API integration synergies." },
    { id: "executive-multithread", name: "Executive Multi-Threading", category: "cold", length: "85-115 words", cta: "Internal Intro Request", tone: "Strategic", desc: "Reaches out to top-level C-suite executives asking to be routed to the appropriate department head." },
    { id: "agency-whitelabel", name: "Agency White-Label Service", category: "cold", length: "95-125 words", cta: "Capacity Review", tone: "B2B Partner", desc: "Targets digital marketing agency owners looking for reliable sub-contract fulfillment partners." },
    { id: "podcast-guest", name: "Podcast Guest Pitch", category: "cold", length: "100-130 words", cta: "Topic Approval", tone: "Engaging & Value-First", desc: "Pitches unique industry insights and founder stories directly to show hosts and producers." },
    { id: "content-syndication", name: "Content & PR Pitch", category: "cold", length: "90-110 words", cta: "Exclusive Angle Review", tone: "Journalistic", desc: "Pitches proprietary data, research studies, or guest articles to editors and tech publications." },
    { id: "affiliate-outreach", name: "Affiliate Partner Recruitment", category: "cold", length: "85-115 words", cta: "Program Join Link", tone: "Incentive-Driven", desc: "Recruits high-traffic content creators and influencers into revenue-sharing referral programs." },
    { id: "cold-speaker", name: "Conference Speaker Pitch", category: "cold", length: "110-140 words", cta: "Abstract Review", tone: "Academic & Professional", desc: "Submits session abstracts and keynote proposals to event organizers and panel moderators." },

    { id: "followup-1", name: "Follow-Up #1 (Contextual Bump)", category: "followup", length: "30-50 words", cta: "Thread Revival", tone: "Polite & Casual", desc: "Gentle thread reviver sent 3 days after initial email referencing previous value point." },
    { id: "followup-2", name: "Follow-Up #2 (Case Study Drop)", category: "followup", length: "50-75 words", cta: "Proof Verification", tone: "Value Add", desc: "Shares a 1-sentence customer proof metric or relevant client case study link." },
    { id: "followup-3", name: "Follow-Up #3 (The Breakup Email)", category: "followup", length: "40-60 words", cta: "Final Permission", tone: "Respectful & Firm", desc: "Removes prospect from list while triggering psychological fear-of-missing-out." },
    { id: "re-engagement", name: "Dormant Prospect Re-engagement", category: "followup", length: "60-85 words", cta: "Status Update", tone: "Reconnecting", desc: "Re-opens cold leads from 6+ months ago with a new product feature update or lower pricing pass." },
    { id: "win-back", name: "Churned Customer Win-Back", category: "followup", length: "70-90 words", cta: "Feedback & Trial Pass", tone: "Humble & Receptive", desc: "Asks former paid subscribers for feedback while offering a discounted 30-day renewal pass." },
    { id: "past-client-revival", name: "Past Client Revival", category: "followup", length: "65-85 words", cta: "Q4 Strategy Chat", tone: "Warm Professional", desc: "Reaches out to former consulting or agency clients to propose new seasonal scope." },

    { id: "linkedin-dm", name: "LinkedIn Connection Note & DM", category: "social", length: "30-50 words", cta: "Profile Connect", tone: "Conversational", desc: "Short, non-salesy message tailored to stay strictly within LinkedIn's 300-character invite limit." },
    { id: "linkedin-inmail", name: "LinkedIn Executive InMail", category: "social", length: "60-80 words", cta: "Direct Reply", tone: "Authoritative", desc: "Pitches VP and Director level roles directly within the InMail messaging interface." },
    { id: "influencer-outreach", name: "Influencer Collaboration", category: "social", length: "70-95 words", cta: "Rate Card Request", tone: "Fan / Professional", desc: "Proposes product gifting or sponsored video placement to niche social media creators." },
    { id: "media-pr", name: "Journalist & Press Pitch", category: "social", length: "80-110 words", cta: "Interview Request", tone: "News-Worthy", desc: "Offers exclusive founder quotes, product launch statistics, or trend analysis to reporters." },
    { id: "alumni-networking", name: "Alumni Network Connection", category: "social", length: "50-75 words", cta: "Coffee Chat", tone: "Warm & Relatable", desc: "Leverages shared university or former company background for mentorship or career intros." },
    { id: "referral-request", name: "Customer Referral Request", category: "social", length: "60-80 words", cta: "Intro Permission", tone: "Grateful", desc: "Asks satisfied clients for warm introductions to peers in their professional network." },

    { id: "webinar-invite", name: "Webinar & Event Invite", category: "nurture", length: "80-110 words", cta: "1-Click RSVP", tone: "Educational", desc: "Invites prospects to a live masterclass or product breakdown without pushy sales pressure." },
    { id: "case-study-drop", name: "Case Study & ROI Teardown", category: "nurture", length: "90-120 words", cta: "Full Breakdown Link", tone: "Analytical", desc: "Deconstructs a real customer result with concrete before-and-after metrics." },
    { id: "product-feedback", name: "Product Feedback & Survey", category: "nurture", length: "50-70 words", cta: "2-Min Survey", tone: "Community-First", desc: "Gathers qualitative user insights from active free tier users or beta testers." },
    { id: "trial-conversion", name: "Free Trial to Paid Conversion", category: "nurture", length: "75-100 words", cta: "Upgrade Pass", tone: "Value-Driven", desc: "Highlights features used during trial and offers a seamless pass upgrade link." },
    { id: "review-request", name: "G2 / Capterra Review Request", category: "nurture", length: "50-70 words", cta: "Review Link + Gift", tone: "Appreciative", desc: "Asks power users to leave public reviews in exchange for extended usage passes." },

    { id: "job-application", name: "Direct Executive Job Application", category: "career", length: "100-130 words", cta: "Interview Schedule", tone: "Confident & Competent", desc: "Bypasses ATS portals by emailing hiring managers directly with concrete past accomplishments." },
    { id: "advisory-board", name: "Advisory Board Pitch", category: "career", length: "90-120 words", cta: "Advisor Chat", tone: "Respectful & Prestigious", desc: "Invites industry veterans to join early-stage startup advisory boards with equity grants." },
    { id: "enterprise-procurement", name: "Enterprise Procurement RFQ", category: "career", length: "110-140 words", cta: "Vendor Security Review", tone: "Corporate Formal", desc: "Responds to corporate procurement inquiries with vendor security details and compliance credentials." },
  ];

  const filteredModes = useMemo(() => {
    return outreachModesData.filter((mode) => {
      const matchesCategory = activeModeTab === "all" || mode.category === activeModeTab;
      const matchesSearch = searchQuery === "" || 
        mode.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        mode.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeModeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 font-sans selection:bg-[#0a84ff] selection:text-white">
      {/* Universal Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-[#1c1c1e] bg-[#000000]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Logo />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm text-gray-400 transition hover:text-white">
              Home
            </Link>
            <Link href="/studio" className="text-sm text-gray-400 transition hover:text-white">
              Studio
            </Link>
            <Link href="/docs" className="text-sm text-[#0a84ff] font-medium">
              Docs & Guides
            </Link>
            <Link href="/pricing" className="text-sm text-gray-400 transition hover:text-white">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/studio"
              className="rounded-xl bg-[#0a84ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0071e3] shadow-lg shadow-[#0a84ff]/25"
            >
              Open Studio
            </Link>
          </div>
        </div>
      </nav>

      {/* Docs Header & Search Bar */}
      <header className="border-b border-[#1c1c1e] bg-gradient-to-b from-[#0a0a0a] to-[#000000] py-16 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0a84ff]/30 bg-[#0a84ff]/10 px-4 py-1.5 text-xs font-semibold text-[#0a84ff] mb-4">
            <BookOpen className="h-3.5 w-3.5" /> Technical Documentation & Deliverability Standard
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Email Deliverability & Outreach Architecture
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            The complete technical guide to bypassing Google Workspace & Microsoft 365 spam filters, configuring DNS records, mastering 30 outreach modes, and scaling B2B cold outreach safely.
          </p>

          {/* Docs Search Engine */}
          <div className="mt-8 mx-auto max-w-xl relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search documentation (e.g., SPF, DKIM, DMARC, Spam Triggers, Warmup)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#222224] bg-[#141415] pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:border-[#0a84ff] focus:outline-none focus:ring-1 focus:ring-[#0a84ff]"
            />
          </div>
        </div>
      </header>

      {/* Main Documentation Container */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 space-y-2 sticky top-24 h-fit">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-3">
              Documentation Modules
            </div>
            {docCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-[#0a84ff] text-white shadow-lg shadow-[#0a84ff]/20"
                      : "text-gray-400 hover:bg-[#141415] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{cat.label}</span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? "rotate-90 text-white" : "opacity-40"}`} />
                </button>
              );
            })}

            {/* Direct Founder Support Box */}
            <div className="pt-6">
              <div className="rounded-2xl border border-[#222224] bg-[#141415] p-5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#0a84ff]" /> Technical Support
                </h4>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                  Have specific domain deliverability issues or custom prompt engineering requirements?
                </p>
                <a
                  href="mailto:help@writeyouremail.com"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a84ff] hover:underline"
                >
                  Contact help@writeyouremail.com <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* Detailed Content Area */}
          <section className="lg:col-span-3 space-y-12">
            
            {/* MODULE 1: Deliverability Engine & Scoring */}
            {activeCategory === "deliverability" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-[#1c1c1e] pb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <ShieldCheck className="h-7 w-7 text-[#0a84ff]" />
                    AI Spam Trigger Detector & Scorecard Architecture
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Comprehensive technical breakdown of how WriteYourEmail analyzes email drafts, identifies inbox placement risks, and calculates deliverability scores (0–100).
                  </p>
                </div>

                {/* Score Breakdown Cards */}
                <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6 space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#0a84ff]" /> 1. The 100-Point Deliverability Calculation Formula
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    WriteYourEmail evaluates copy using a weighted multi-factor heuristic engine that models Google Workspace, Microsoft 365, Proofpoint, and Mimecast anti-spam filters:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-[#30d158]/30 bg-[#30d158]/5 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-extrabold text-[#30d158]">90 – 100</span>
                        <CheckCircle2 className="h-5 w-5 text-[#30d158]" />
                      </div>
                      <h4 className="text-sm font-bold text-white mt-2">Primary Inbox Optimal</h4>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                        0 high-risk trigger words, word count between 50 and 125 words, low tracking link density, natural conversational phrasing.
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#ffd60a]/30 bg-[#ffd60a]/5 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-extrabold text-[#ffd60a]">70 – 89</span>
                        <AlertTriangle className="h-5 w-5 text-[#ffd60a]" />
                      </div>
                      <h4 className="text-sm font-bold text-white mt-2">Promotions / Spam Risk</h4>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                        1–2 minor trigger words detected, or text length exceeds 175 words. High risk of landing in Google Promotions tab.
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#ff453a]/30 bg-[#ff453a]/5 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-extrabold text-[#ff453a]">Below 70</span>
                        <ShieldAlert className="h-5 w-5 text-[#ff453a]" />
                      </div>
                      <h4 className="text-sm font-bold text-white mt-2">High Spam Flag Danger</h4>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                        Multiple aggressive sales terms ("guaranteed", "100% free", "click here now"), excessive capitalization, or aggressive urgency.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Spam Trigger Taxonomy */}
                <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6 space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-[#ff453a]" /> 2. High-Risk Spam Word Taxonomy
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Modern security gateway filters score emails based on semantic word clusters. Below is the exact matrix of sanitized trigger terms monitored by our AI engine:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300">
                      <thead className="bg-[#141415] text-gray-400 font-bold uppercase tracking-wider border-b border-[#222224]">
                        <tr>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">High-Risk Spam Trigger Words</th>
                          <th className="px-4 py-3">WriteYourEmail Sanitized Alternative</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1c1c1e]">
                        <tr>
                          <td className="px-4 py-3 font-semibold text-white">Financial & Pricing</td>
                          <td className="px-4 py-3 text-[#ff453a] font-mono">"100% free", "Earn $$$", "Risk-free demo", "No cost"</td>
                          <td className="px-4 py-3 text-[#30d158] font-mono">"Complimentary review", "Without commitment"</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold text-white">Urgency & Pressure</td>
                          <td className="px-4 py-3 text-[#ff453a] font-mono">"Act now", "Limited time offer", "Urgent request", "Do it today"</td>
                          <td className="px-4 py-3 text-[#30d158] font-mono">"When schedule permits", "At your convenience"</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold text-white">Exaggerated Claims</td>
                          <td className="px-4 py-3 text-[#ff453a] font-mono">"Guaranteed ROI", "Double your revenue", "Secret formula"</td>
                          <td className="px-4 py-3 text-[#30d158] font-mono">"Tested framework", "Proven client benchmark"</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold text-white">Pushy Call to Actions</td>
                          <td className="px-4 py-3 text-[#ff453a] font-mono">"Click here immediately", "Buy now", "Sign up now"</td>
                          <td className="px-4 py-3 text-[#30d158] font-mono">"Open to exploring?", "Worth a quick look?"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Subject Line A/B Matrix */}
                <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-[#bf5af2]" /> 3. Subject Line Open Rate Optimization Rules
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Subject lines determine whether your email is opened or discarded. Our generator builds 5 specific subject line archetype variations per prompt based on these principles:
                  </p>
                  <ul className="space-y-2 text-xs text-gray-400 pl-4 list-disc">
                    <li><strong className="text-white">Lowercase & Natural:</strong> Subject lines with lowercases (e.g., "quick question re: sales workflow") get 28% higher open rates than Title Case.</li>
                    <li><strong className="text-white">Character Count Limit:</strong> Keep subject lines between 2 to 5 words (under 30 characters total) so they are never truncated on mobile screens.</li>
                    <li><strong className="text-white">Zero Punctuation:</strong> Avoid exclamation points (!), dollar signs ($), or question marks at the end of subject lines.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* MODULE 2: Technical Domain Infrastructure */}
            {activeCategory === "technical" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-[#1c1c1e] pb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Terminal className="h-7 w-7 text-[#30d158]" />
                    Domain DNS Technical Architecture (SPF, DKIM, DMARC)
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Step-by-step technical guides for setting up authentication records on Cloudflare, Namecheap, Spaceship, GoDaddy, and Google Domains.
                  </p>
                </div>

                {/* SPF Setup */}
                <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">1. SPF (Sender Policy Framework)</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Authorizes specific mail server IP addresses to send emails on behalf of your domain name.
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-[#1c1c1e] text-[#0a84ff] border border-[#0a84ff]/30 px-3 py-1 rounded-full">
                      TXT Record
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#141415] border border-[#222224] p-4 flex items-center justify-between font-mono text-xs">
                    <div className="space-y-1">
                      <div className="text-gray-500">Host / Name: <span className="text-white font-bold">@</span></div>
                      <div className="text-gray-500">Value (Google Workspace): <span className="text-[#30d158] font-bold">v=spf1 include:_spf.google.com ~all</span></div>
                    </div>
                    <CopySnippet code="v=spf1 include:_spf.google.com ~all" />
                  </div>

                  <div className="rounded-xl bg-[#141415] border border-[#222224] p-4 flex items-center justify-between font-mono text-xs">
                    <div className="space-y-1">
                      <div className="text-gray-500">Host / Name: <span className="text-white font-bold">@</span></div>
                      <div className="text-gray-500">Value (Microsoft 365): <span className="text-[#30d158] font-bold">v=spf1 include:spf.protection.outlook.com -all</span></div>
                    </div>
                    <CopySnippet code="v=spf1 include:spf.protection.outlook.com -all" />
                  </div>
                </div>

                {/* DKIM Setup */}
                <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">2. DKIM (DomainKeys Identified Mail)</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Cryptographically signs outgoing emails to ensure the text hasn't been tampered with in transit.
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-[#1c1c1e] text-[#bf5af2] border border-[#bf5af2]/30 px-3 py-1 rounded-full">
                      TXT / CNAME Record
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    DKIM keys are generated within your email provider admin panel (e.g., Google Admin Console &gt; Apps &gt; Google Workspace &gt; Gmail &gt; Authenticate Email).
                  </p>

                  <div className="rounded-xl bg-[#141415] border border-[#222224] p-4 flex items-center justify-between font-mono text-xs">
                    <div className="space-y-1">
                      <div className="text-gray-500">Host / Name: <span className="text-white font-bold">google._domainkey</span></div>
                      <div className="text-gray-500">Value snippet: <span className="text-[#bf5af2] font-bold">v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOC...</span></div>
                    </div>
                    <CopySnippet code="v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu..." />
                  </div>
                </div>

                {/* DMARC Setup */}
                <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">3. DMARC Alignment & Enforcement Policy</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Instructs receiving servers (Gmail, Outlook) how to handle messages that fail SPF or DKIM checks.
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-[#1c1c1e] text-[#ffd60a] border border-[#ffd60a]/30 px-3 py-1 rounded-full">
                      TXT Record
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#141415] border border-[#222224] p-4 flex items-center justify-between font-mono text-xs">
                    <div className="space-y-1">
                      <div className="text-gray-500">Host / Name: <span className="text-white font-bold">_dmarc</span></div>
                      <div className="text-gray-500">Recommended Policy (Monitoring Phase): <span className="text-[#ffd60a] font-bold">v=DMARC1; p=none; rua=mailto:help@writeyouremail.com</span></div>
                    </div>
                    <CopySnippet code="v=DMARC1; p=none; rua=mailto:help@writeyouremail.com" />
                  </div>

                  <div className="rounded-xl bg-[#141415] border border-[#222224] p-4 flex items-center justify-between font-mono text-xs">
                    <div className="space-y-1">
                      <div className="text-gray-500">Host / Name: <span className="text-white font-bold">_dmarc</span></div>
                      <div className="text-gray-500">Strict Enforcement Policy: <span className="text-[#ff453a] font-bold">v=DMARC1; p=reject; rua=mailto:help@writeyouremail.com</span></div>
                    </div>
                    <CopySnippet code="v=DMARC1; p=reject; rua=mailto:help@writeyouremail.com" />
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 3: 30 Outreach Modes Playbook */}
            {activeCategory === "modes" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-[#1c1c1e] pb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Layers className="h-7 w-7 text-[#bf5af2]" />
                    30 Dynamic Omni-Channel Outreach Modes
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Filter and review optimal prompt configurations, word counts, tone settings, and call-to-action strategies across all 30 modes.
                  </p>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-[#1c1c1e] pb-4">
                  {[
                    { id: "all", label: "All 30 Modes" },
                    { id: "cold", label: "Cold Sales & Pitches" },
                    { id: "followup", label: "Follow-Up Sequences" },
                    { id: "social", label: "LinkedIn & Social" },
                    { id: "nurture", label: "Lead Nurturing" },
                    { id: "career", label: "Executive & Career" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveModeTab(tab.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                        activeModeTab === tab.id
                          ? "bg-[#0a84ff] text-white"
                          : "bg-[#141415] text-gray-400 hover:text-white border border-[#222224]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Modes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredModes.map((mode) => (
                    <div key={mode.id} className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-5 hover:border-[#222224] transition">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-white">{mode.name}</h4>
                        <span className="text-[10px] font-mono bg-[#1c1c1e] text-[#0a84ff] border border-[#0a84ff]/20 px-2 py-0.5 rounded">
                          {mode.length}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-4 leading-relaxed">{mode.desc}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-[#1c1c1e] pt-3 text-gray-500">
                        <div>Tone: <span className="text-gray-300 font-semibold">{mode.tone}</span></div>
                        <div>CTA: <span className="text-[#30d158] font-semibold">{mode.cta}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 4: Domain Warmup & Ramp Schedule */}
            {activeCategory === "warmup" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-[#1c1c1e] pb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Flame className="h-7 w-7 text-[#ff9500]" />
                    4-Week Domain Warmup & Sending Schedule
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Gradual sending schedules required when launching new outreach domains to build domain reputation with Google Workspace and Microsoft 365 filters.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6 space-y-6">
                  <h3 className="text-lg font-bold text-white">Recommended Daily Sending Cap Progression</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300">
                      <thead className="bg-[#141415] text-gray-400 font-bold uppercase tracking-wider border-b border-[#222224]">
                        <tr>
                          <th className="px-4 py-3">Timeframe</th>
                          <th className="px-4 py-3">Daily Sending Limit</th>
                          <th className="px-4 py-3">Warmup Peer Reply Rate</th>
                          <th className="px-4 py-3">Status / Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1c1c1e]">
                        <tr>
                          <td className="px-4 py-3 font-semibold text-white">Week 1 (Days 1–7)</td>
                          <td className="px-4 py-3 font-mono text-[#0a84ff]">5 – 10 emails/day</td>
                          <td className="px-4 py-3 font-mono text-[#30d158]">40% Reply Rate</td>
                          <td className="px-4 py-3 text-gray-400">DNS Setup Verification & Initial Warmup</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold text-white">Week 2 (Days 8–14)</td>
                          <td className="px-4 py-3 font-mono text-[#0a84ff]">15 – 25 emails/day</td>
                          <td className="px-4 py-3 font-mono text-[#30d158]">30% Reply Rate</td>
                          <td className="px-4 py-3 text-gray-400">Introduce 5 manual test drafts from Studio</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold text-white">Week 3 (Days 15–21)</td>
                          <td className="px-4 py-3 font-mono text-[#0a84ff]">30 – 45 emails/day</td>
                          <td className="px-4 py-3 font-mono text-[#30d158]">25% Reply Rate</td>
                          <td className="px-4 py-3 text-gray-400">Scale campaigns with Sanitized copy</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold text-white">Week 4+ (Day 22+)</td>
                          <td className="px-4 py-3 font-mono text-[#30d158]">50 max per inbox/day</td>
                          <td className="px-4 py-3 font-mono text-[#30d158]">20% Organic Replies</td>
                          <td className="px-4 py-3 text-[#30d158] font-bold">Full Campaign Capacity Active</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: Legal & Regulatory Compliance */}
            {activeCategory === "compliance" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-[#1c1c1e] pb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Scale className="h-7 w-7 text-[#ffd60a]" />
                    Global Email Compliance Standards (CAN-SPAM, GDPR, CASL)
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Essential legal requirements for sending commercial B2B emails across North America, Europe, and international markets.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6 space-y-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#30d158]" /> 1. US CAN-SPAM Act Compliance Checklist
                    </h3>
                    <ul className="space-y-2 text-xs text-gray-400 list-disc pl-5">
                      <li>Never use deceptive header information or false identity details in the "From" or "Reply-To" fields.</li>
                      <li>Do not use misleading subject lines that misrepresent the body content of your email.</li>
                      <li>Include a valid physical postal address of your business at the bottom of cold email templates.</li>
                      <li>Provide a clear, simple mechanism for recipients to opt-out (e.g., "Reply 'unsubscribe' to be removed").</li>
                      <li>Process opt-out requests within 10 business days without charging fees or requesting personal data.</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6 space-y-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Globe className="h-5 w-5 text-[#0a84ff]" /> 2. European Union GDPR B2B Legitimate Interest
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Under GDPR Article 6(1)(f), cold B2B outreach to corporate email addresses is permissible under the legal basis of "Legitimate Interest" provided that:
                    </p>
                    <ul className="space-y-2 text-xs text-gray-400 list-disc pl-5">
                      <li>The offering is directly relevant to the recipient's professional role or company function.</li>
                      <li>The prospect's data privacy rights do not override your legitimate business purpose.</li>
                      <li>You provide an immediate right to object (opt-out) in every communication.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 6: Prepaid Passes & Billing FAQ */}
            {activeCategory === "faq" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-[#1c1c1e] pb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <HelpCircle className="h-7 w-7 text-[#0a84ff]" />
                    Prepaid Passes & Account Architecture FAQ
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Clear guidance on 30-day prepaid pass durations, code redemption, and PayPal transaction processing.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6">
                    <h3 className="text-sm font-bold text-white">How do 30-Day Prepaid Passes work?</h3>
                    <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                      We operate exclusively on a transparent prepaid pass model (Starter $19, Growth $39, Enterprise $79). When you purchase a pass via PayPal, you receive 30 full days of uninterrupted access. There are zero auto-renewals or hidden subscription charges.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6">
                    <h3 className="text-sm font-bold text-white">How do I redeem the LAUNCH50 promo code?</h3>
                    <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                      Navigate to the <Link href="/pricing" className="text-[#0a84ff] hover:underline font-semibold">Pricing Page</Link>, type <code className="bg-[#1c1c1e] px-1.5 py-0.5 rounded text-white uppercase font-mono">LAUNCH50</code> into the discount input field, and click Apply. All pass prices will immediately calculate at 50% off ($9.50 for Starter, $19.50 for Growth Pass).
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#1c1c1e] bg-[#0a0a0a] p-6">
                    <h3 className="text-sm font-bold text-white">What happens when my 30-day pass expires?</h3>
                    <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                      Your account automatically returns to the free registered tier (5 generations per day). You will never be billed automatically. You can choose to top up another 30-day pass whenever you need to send your next campaign.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </section>
        </div>
      </main>

      {/* Universal Footer */}
      <footer className="border-t border-[#1c1c1e] bg-[#000000] py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-xs text-gray-500">© 2025 All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/studio" className="hover:text-white transition">Studio</Link>
            <Link href="/docs" className="hover:text-white transition">Docs</Link>
            <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <a href="mailto:help@writeyouremail.com" className="hover:text-white transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}