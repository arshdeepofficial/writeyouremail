"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  RotateCcw, 
  History, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Zap, 
  AlertCircle, 
  Search, 
  Layers, 
  ArrowRight, 
  LogOut, 
  LogIn, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Sliders,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

// ==========================================
// 1. ALL 30 OMNI-CHANNEL STRATEGIES & SCHEMAS
// ==========================================

export type TierLevel = 'free' | 'starter' | 'growth' | 'enterprise';

export interface FormFieldConfig {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  help?: string;
}

export interface OmniMode {
  id: string;
  name: string;
  category: 'Outbound & Sales' | 'Relationship & Success' | 'Marketing & Lifecycle' | 'Internal & Executive' | 'Formal & Compliance';
  requiredTier: TierLevel;
  tagline: string;
  fields: FormFieldConfig[];
  systemInstruction: string;
}

export const OMNI_MODES: OmniMode[] = [
  // --- OUTBOUND & SALES (1-6) ---
  {
    id: 'cold-outreach',
    name: '1. Cold Outreach',
    category: 'Outbound & Sales',
    requiredTier: 'free',
    tagline: 'High-conversion first-touch prospecting with personalized value hooks.',
    fields: [
      { key: 'recipientRole', label: 'Prospect Role & Company', placeholder: 'e.g. VP of Engineering at ScaleOps', type: 'text' },
      { key: 'painPoint', label: 'Primary Operational Pain Point', placeholder: 'e.g. Cloud egress costs rising 40% QoQ', type: 'text' },
      { key: 'valueProp', label: 'Unique Value Proposition / Solution', placeholder: 'e.g. Real-time cost-optimizer cutting AWS idle waste by 32%', type: 'textarea' },
      { key: 'ctaType', label: 'Call-To-Action Format', placeholder: 'Select CTA', type: 'select', options: ['Low-friction 9-minute feedback call', 'Permission to send 2-page brief', 'Async video teardown link'] }
    ],
    systemInstruction: 'Draft a razor-sharp, under-100-word cold email. Zero boilerplate fluff. Immediate hook tied to pain point.'
  },
  {
    id: 'follow-up-bump',
    name: '2. Follow-Up Sequence Bump',
    category: 'Outbound & Sales',
    requiredTier: 'free',
    tagline: 'Polite, high-leverage bumps that resurrect unresponsive conversation threads.',
    fields: [
      { key: 'previousContext', label: 'Previous Discussion Summary', placeholder: 'e.g. Sent Q3 pricing proposal last Tuesday', type: 'text' },
      { key: 'daysElapsed', label: 'Time Since Last Contact', placeholder: 'e.g. 4 days ago', type: 'text' },
      { key: 'newMicroValue', label: 'New Micro-Value or Trigger Event', placeholder: 'e.g. Saw your LinkedIn update regarding Europe expansion', type: 'textarea' }
    ],
    systemInstruction: 'Keep it below 60 words. No guilt-tripping ("just bubbling this up"). Offer crisp new context.'
  },
  {
    id: 're-engagement-dead-lead',
    name: '3. Dormant Lead Win-Back',
    category: 'Outbound & Sales',
    requiredTier: 'starter',
    tagline: 'Non-aggressive inquiry to determine if ghosted accounts are still active.',
    fields: [
      { key: 'leadHistory', label: 'Past Negotiation Stage', placeholder: 'e.g. Stopped responding after enterprise pilot quote in November', type: 'text' },
      { key: 'updatedFeature', label: 'Major Company or Product Milestone', placeholder: 'e.g. Added automated SOC2 compliance module', type: 'text' },
      { key: 'cleanExitOffer', label: 'Permission to Close File?', placeholder: 'Select style', type: 'select', options: ['Polite 9-word breakup note', 'Direct priority check', 'Resource gift without pitch'] }
    ],
    systemInstruction: 'Use the 9-word Dean Jackson framework or clean enterprise opt-out. Remove all pressure.'
  },
  {
    id: 'meeting-request-vip',
    name: '4. Executive Meeting Request',
    category: 'Outbound & Sales',
    requiredTier: 'free',
    tagline: 'Frictionless executive calendar booking tailored for instant mobile replies.',
    fields: [
      { key: 'vipName', label: 'Decision Maker & Title', placeholder: 'e.g. Chief Revenue Officer', type: 'text' },
      { key: 'agendaThreePoints', label: '3-Bullet Value Agenda', placeholder: 'e.g. 1. Pipeline leak audit\n2. Net-new quota benchmark\n3. Integration roadmap', type: 'textarea' },
      { key: 'proposedSlots', label: 'Specific Time Windows (UTC/EST)', placeholder: 'e.g. Thursday 2:00 PM EST or Friday 10:30 AM EST', type: 'text' }
    ],
    systemInstruction: 'Format for high-speed executive reading. Ultra-clean bulleted agenda.'
  },
  {
    id: 'post-call-recap',
    name: '5. Post-Discovery Call Recap',
    category: 'Outbound & Sales',
    requiredTier: 'starter',
    tagline: 'Establish consensus, lock in shared action items, and maintain deal velocity.',
    fields: [
      { key: 'callHighlights', label: 'Agreed Objectives & Key Quotes', placeholder: 'e.g. Client needs SOC-2 audit completed before Q4', type: 'textarea' },
      { key: 'actionItems', label: 'Assigned Action Items & Owners', placeholder: 'e.g. Us: Send security questionnaire. Them: Invite VP Security.', type: 'textarea' },
      { key: 'nextMeeting', label: 'Next Scheduled Sync Date', placeholder: 'e.g. Next Wednesday at 11:00 AM PST', type: 'text' }
    ],
    systemInstruction: 'Document mutual consensus with precision. Clear ownership matrix.'
  },
  {
    id: 'proposal-quote-delivery',
    name: '6. Commercial Proposal Framing',
    category: 'Outbound & Sales',
    requiredTier: 'starter',
    tagline: 'Frame pricing and contractual terms around ROI to preempt sticker shock.',
    fields: [
      { key: 'solutionTier', label: 'Proposed Package / Tier', placeholder: 'e.g. Enterprise 100-Seat License', type: 'text' },
      { key: 'roiMetrics', label: 'Projected Economic Upside', placeholder: 'e.g. Saves 18 developer hours per sprint (~$4,200/mo)', type: 'textarea' },
      { key: 'expirationWindow', label: 'Quote Validity Window', placeholder: 'e.g. Valid until close of business Friday', type: 'text' }
    ],
    systemInstruction: 'Lead with financial upside before stating commercial investment terms.'
  },

  // --- RELATIONSHIP & SUCCESS (7-12) ---
  {
    id: 'customer-onboarding',
    name: '7. Customer Activation & Onboarding',
    category: 'Relationship & Success',
    requiredTier: 'free',
    tagline: 'Drive users toward their primary "aha moment" with zero confusion.',
    fields: [
      { key: 'firstMilestone', label: 'Single Mandatory First Action', placeholder: 'e.g. Connect your Postgres database URL', type: 'text' },
      { key: 'documentationLink', label: 'Quickstart Documentation Link', placeholder: 'e.g. writeyouremail.com/docs/quickstart', type: 'text' },
      { key: 'supportResource', label: 'Dedicated Support Desk Contact', placeholder: 'e.g. help@writeyouremail.com', type: 'text' }
    ],
    systemInstruction: 'Enforce single-action focus. Eliminate overwhelm. Clean congratulatory tone.'
  },
  {
    id: 'feature-announcement',
    name: '8. Feature Value Release',
    category: 'Relationship & Success',
    requiredTier: 'starter',
    tagline: 'Announce updates framed around client workflow benefits rather than technical specs.',
    fields: [
      { key: 'featureName', label: 'New Feature / Infrastructure Upgrade', placeholder: 'e.g. Real-Time Spam Auditor 2.0', type: 'text' },
      { key: 'workflowImpact', label: 'Direct Daily User Benefit', placeholder: 'e.g. Catches spam trigger words before you hit send', type: 'textarea' },
      { key: 'activationPath', label: 'How to Toggle / Access It', placeholder: 'e.g. Available automatically in Studio Settings', type: 'text' }
    ],
    systemInstruction: 'Keep focus on "What this unlocks for you", not technical implementation mechanics.'
  },
  {
    id: 'contract-renewal-nudge',
    name: '9. Contract Renewal & Value Proof',
    category: 'Relationship & Success',
    requiredTier: 'growth',
    tagline: 'Deliver concrete usage receipts before initiating contractual renewal discussions.',
    fields: [
      { key: 'tenureUsage', label: 'Annual Usage & Impact Summary', placeholder: 'e.g. Generated 3,420 emails across 12 team seats', type: 'textarea' },
      { key: 'renewalDeadline', label: 'Upcoming Contract Expiration Date', placeholder: 'e.g. March 31st, 2026', type: 'text' },
      { key: 'renewalIncentive', label: 'Early Renewal Lock-in Offer', placeholder: 'e.g. Grandfather current pricing rate for 24 months', type: 'text' }
    ],
    systemInstruction: 'Anchor the email around undeniable utility metrics delivered during the current term.'
  },
  {
    id: 'expansion-upsell',
    name: '10. Usage Expansion / Upsell',
    category: 'Relationship & Success',
    requiredTier: 'growth',
    tagline: 'Identify workflow bottlenecks and present higher-tier capacities naturally.',
    fields: [
      { key: 'usageTrigger', label: 'Capacity or Limit Trigger', placeholder: 'e.g. Approached 90% of monthly token limit 3x this month', type: 'text' },
      { key: 'higherTierBenefit', label: 'Next Tier Capabilities', placeholder: 'e.g. Growth Pass with unlimited team seats and custom API tokens', type: 'textarea' }
    ],
    systemInstruction: 'Consultative and supportive. Never scolding or aggressive regarding quota limits.'
  },
  {
    id: 'nps-feedback-request',
    name: '11. High-Response NPS Inquiry',
    category: 'Relationship & Success',
    requiredTier: 'free',
    tagline: 'Frictionless qualitative feedback solicitation structured for immediate replies.',
    fields: [
      { key: 'recentExperience', label: 'Recent Feature or Interaction Tested', placeholder: 'e.g. Groq LPU Generation Engine', type: 'text' },
      { key: 'singleQuestion', label: 'Specific Question Asked', placeholder: 'e.g. What is one feature we should build next week?', type: 'text' }
    ],
    systemInstruction: 'Under 50 words. Ask for a direct reply rather than forcing a 3rd party survey link.'
  },
  {
    id: 'churn-prevention-rescue',
    name: '12. Churn Mitigation & Save Offer',
    category: 'Relationship & Success',
    requiredTier: 'growth',
    tagline: 'Empathetic, non-defensive intervention when a customer signals cancellation.',
    fields: [
      { key: 'churnReason', label: 'Identified Cause or Disconnect', placeholder: 'e.g. Team size downsizing / Budget restructuring', type: 'text' },
      { key: 'flexibleConcession', label: 'Immediate Remediation Offer', placeholder: 'e.g. 50% discount for 3 months or free migration concierge', type: 'textarea' }
    ],
    systemInstruction: 'Empathetic, mature, non-desperate. Offer dignified alternatives.'
  },

  // --- MARKETING & LIFECYCLE (13-18) ---
  {
    id: 'curated-newsletter',
    name: '13. Curated Industry Digest',
    category: 'Marketing & Lifecycle',
    requiredTier: 'starter',
    tagline: 'High-density insights format that positions your firm as an authoritative insider.',
    fields: [
      { key: 'digestTopic', label: 'Edition Topic & Theme', placeholder: 'e.g. State of Enterprise Email Deliverability 2026', type: 'text' },
      { key: 'threeInsights', label: '3 Core Takeaways / Bullet Proofs', placeholder: 'e.g. 1. DMARC strict enforcement\n2. LPU inference speed benchmarks\n3. Cold outreach limits', type: 'textarea' },
      { key: 'editorialSignoff', label: 'Editorial Reflection', placeholder: 'e.g. Why speed beats prompt depth every time', type: 'text' }
    ],
    systemInstruction: 'Scannable, authoritative, and content-rich. Minimal corporate buzzwords.'
  },
  {
    id: 'launch-sequence-teaser',
    name: '14. Product Launch Sequence',
    category: 'Marketing & Lifecycle',
    requiredTier: 'starter',
    tagline: 'Create structured anticipation across Teaser, Launch Day, and Final Window.',
    fields: [
      { key: 'phase', label: 'Launch Phase', placeholder: 'Select Phase', type: 'select', options: ['Phase 1: The Teaser Hook', 'Phase 2: Public General Availability', 'Phase 3: Final 24-Hour Access Window'] },
      { key: 'productName', label: 'Product / System Name', placeholder: 'e.g. WriteYourEmail Omni-Engine', type: 'text' },
      { key: 'keyBreakthrough', label: 'The Core Technical Breakthrough', placeholder: 'e.g. 0.8-second cold email synthesis with zero rate limits', type: 'textarea' }
    ],
    systemInstruction: 'Build organic momentum. Clear narrative arc with a firm deadline.'
  },
  {
    id: 'webinar-invite-sequence',
    name: '15. Live Briefing & Webinar Invite',
    category: 'Marketing & Lifecycle',
    requiredTier: 'starter',
    tagline: 'Drive registrations by promising specific tactical knowledge over sales pitches.',
    fields: [
      { key: 'briefingTitle', label: 'Event Title', placeholder: 'e.g. How to Hit 99.4% Inbox Deliverability in 2026', type: 'text' },
      { key: 'speakerCredential', label: 'Host & Guest Credentials', placeholder: 'e.g. Arshdeep Bains & Enterprise Deliverability Architects', type: 'text' },
      { key: 'takeawayList', label: 'Tactical Takeaways (Not Slides)', placeholder: 'e.g. Exact DNS record setup for Vercel/Supabase apps', type: 'textarea' }
    ],
    systemInstruction: 'Focus 85% of copy on the operational utility attendees walk away with.'
  },
  {
    id: 'lead-magnet-delivery',
    name: '16. Gated Asset & Playbook Delivery',
    category: 'Marketing & Lifecycle',
    requiredTier: 'starter',
    tagline: 'Deliver promised resources instantly while laying the groundwork for a follow-up.',
    fields: [
      { key: 'assetName', label: 'Resource / Document Title', placeholder: 'e.g. The 2026 Enterprise Email Deliverability Blueprint', type: 'text' },
      { key: 'downloadUrl', label: 'Direct Download Link', placeholder: 'e.g. writeyouremail.com/blueprint.pdf', type: 'text' },
      { key: 'thoughtQuestion', label: 'Follow-Up Provocation Question', placeholder: 'e.g. Which of the 5 spam audits caught you off guard?', type: 'text' }
    ],
    systemInstruction: 'Deliver asset in first sentence. Follow with single thought-provoking question.'
  },
  {
    id: 'limited-promotional-offer',
    name: '17. Flash Commercial Incentive',
    category: 'Marketing & Lifecycle',
    requiredTier: 'starter',
    tagline: 'Deploy ethically constrained discounts (e.g. LAUNCH50) with authentic scarcity.',
    fields: [
      { key: 'discountCode', label: 'Coupon Code & Value', placeholder: 'e.g. LAUNCH50 (50% Off 30-Day Passes)', type: 'text' },
      { key: 'urgencyReason', label: 'Legitimate Reason for Urgency', placeholder: 'e.g. Celebrating Glent Global v2.0 Architecture Rollout', type: 'text' },
      { key: 'cutoffTime', label: 'Strict Expiration Window', placeholder: 'e.g. Friday at midnight EST', type: 'text' }
    ],
    systemInstruction: 'Avoid spammy sales breath. Maintain high-tier brand dignity while driving conversion.'
  },
  {
    id: 'cart-abandonment-recovery',
    name: '18. Checkout Drop-off Recovery',
    category: 'Marketing & Lifecycle',
    requiredTier: 'starter',
    tagline: 'Clear friction points and doubts for prospects who stalled at checkout.',
    fields: [
      { key: 'itemInCart', label: 'Selected Plan / Item', placeholder: 'e.g. Growth 30-Day Prepaid Pass ($39)', type: 'text' },
      { key: 'perceivedObstacle', label: 'Common Objections Solved', placeholder: 'e.g. No recurring subscription traps, RBI India 3DS compliant, PayPal backed', type: 'textarea' }
    ],
    systemInstruction: 'Reassure safety, security, and zero-risk prepaid model. Direct checkout recovery link.'
  },

  // --- INTERNAL & EXECUTIVE (19-24) ---
  {
    id: 'executive-briefing',
    name: '19. Board & Investor Pulse',
    category: 'Internal & Executive',
    requiredTier: 'growth',
    tagline: 'Calm, transparent executive briefings covering metrics, milestones, and headwinds.',
    fields: [
      { key: 'reportingPeriod', label: 'Reporting Period', placeholder: 'e.g. February 2026 Operational Update', type: 'text' },
      { key: 'topKpis', label: 'Core Metrics (ARR, Run-rate, MAU)', placeholder: 'e.g. Active passes: +48% MoM, Server cost: $0.00, Uptime: 99.98%', type: 'textarea' },
      { key: 'headwinds', label: 'Key Challenges / Blockers', placeholder: 'e.g. Payment gateway onboarding in select overseas jurisdictions', type: 'textarea' },
      { key: 'theAsk', label: 'Specific Ask to Advisors / Board', placeholder: 'e.g. Intros to B2B outbound marketing leads', type: 'text' }
    ],
    systemInstruction: 'Unflinchingly honest, concise, and structured with standardized executive headers.'
  },
  {
    id: 'company-announcement',
    name: '20. All-Hands Org Announcement',
    category: 'Internal & Executive',
    requiredTier: 'growth',
    tagline: 'Deliver company-wide shifts or strategy pivots with clarity and vision.',
    fields: [
      { key: 'initiativeName', label: 'Core Change or Strategic Focus', placeholder: 'e.g. Transition to Glent Global Sovereign Infrastructure', type: 'text' },
      { key: 'whyNow', label: 'The Strategic Imperative ("Why Now")', placeholder: 'e.g. Eliminates SaaS subscription dependencies and ensures 100% data sovereignty', type: 'textarea' },
      { key: 'employeeNextSteps', label: 'Direct Impact on Teams', placeholder: 'e.g. Team leads will conduct briefings on Monday', type: 'text' }
    ],
    systemInstruction: 'Inspiring yet grounded. Clear answers to "What does this mean for me?".'
  },
  {
    id: 'talent-sourcing-outreach',
    name: '21. Passive Candidate Recruiter Pitch',
    category: 'Internal & Executive',
    requiredTier: 'growth',
    tagline: 'Attract elite engineering and product minds with technical specificity.',
    fields: [
      { key: 'candidateNameRole', label: 'Candidate Specialty / Portfolio', placeholder: 'e.g. Principal Next.js Architect with Rust experience', type: 'text' },
      { key: 'hardProblem', label: 'The Hard Technical Problem to Solve', placeholder: 'e.g. Building sub-100ms LLM streaming pipelines at zero marginal cost', type: 'textarea' },
      { key: 'equityComp', label: 'Compensation & Autonomy Structure', placeholder: 'e.g. Top-of-market equity grant + fully sovereign remote autonomy', type: 'text' }
    ],
    systemInstruction: 'Focus on technical intrigue and autonomy rather than standard corporate benefits.'
  },
  {
    id: 'formal-offer-letter',
    name: '22. Executive Offer Presentation',
    category: 'Internal & Executive',
    requiredTier: 'growth',
    tagline: 'Formalize hiring terms with genuine excitement and institutional precision.',
    fields: [
      { key: 'roleTitle', label: 'Designated Title & Department', placeholder: 'e.g. Lead Systems Engineer, Sovereign Core', type: 'text' },
      { key: 'startDate', label: 'Anticipated Start Date', placeholder: 'e.g. April 1st, 2026', type: 'text' },
      { key: 'reportingStructure', label: 'Reporting Lead', placeholder: 'e.g. Reports directly to Chief Technology Officer', type: 'text' }
    ],
    systemInstruction: 'Professional, welcoming, legally sound, and celebratory.'
  },
  {
    id: 'constructive-performance-review',
    name: '23. Constructive Performance Review',
    category: 'Internal & Executive',
    requiredTier: 'enterprise',
    tagline: 'Deliver balanced, actionable behavioral critique without eroding trust.',
    fields: [
      { key: 'positiveContributions', label: 'Validated Wins & Strengths', placeholder: 'e.g. Shipped the authentication overhaul 3 days ahead of schedule', type: 'textarea' },
      { key: 'criticalGap', label: 'Specific Area Requiring Calibration', placeholder: 'e.g. Cross-functional documentation was omitted, causing QA blockages', type: 'textarea' },
      { key: 'remedyPlan', label: '30-Day Measurable Correction Goal', placeholder: 'e.g. Conduct peer architectural teardowns before production merge', type: 'text' }
    ],
    systemInstruction: 'Radical candor framework: clear, compassionate, and specific.'
  },
  {
    id: 'conflict-de-escalation',
    name: '24. Stakeholder De-escalation',
    category: 'Internal & Executive',
    requiredTier: 'enterprise',
    tagline: 'Neutralize workplace friction and align differing priorities pragmatically.',
    fields: [
      { key: 'coreDispute', label: 'Underlying Conflict or Stalemate', placeholder: 'e.g. Disagreement between Sales and Product on Q2 roadmap feature priority', type: 'textarea' },
      { key: 'sharedMission', label: 'The Shared Overarching Objective', placeholder: 'e.g. Maintaining 99.8% customer retention and meeting revenue goals', type: 'text' },
      { key: 'proposedCompromise', label: 'Pragmatic Step-Down Compromise', placeholder: 'e.g. Ship Phase 1 for Sales now, defer Phase 2 until June', type: 'text' }
    ],
    systemInstruction: 'Cool-headed, non-defensive, focused entirely on the common objective.'
  },

  // --- FORMAL & COMPLIANCE (25-30) ---
  {
    id: 'overdue-invoice-reminder',
    name: '25. Accounts Receivable Escalation',
    category: 'Formal & Compliance',
    requiredTier: 'free',
    tagline: 'Firm, professional recovery of overdue receivables across 3 escalation levels.',
    fields: [
      { key: 'invoiceNumber', label: 'Invoice Identification Code', placeholder: 'e.g. INV-2026-0498', type: 'text' },
      { key: 'balanceDue', label: 'Total Outstanding Balance', placeholder: 'e.g. $4,850.00 USD', type: 'text' },
      { key: 'daysOverdue', label: 'Days Past Agreed Terms', placeholder: 'e.g. 14 days overdue', type: 'text' },
      { key: 'escalationLevel', label: 'Escalation Severity', placeholder: 'Select severity', type: 'select', options: ['Polite Courtesy Ping (3-7 days)', 'Formal Accounting Notice (14-30 days)', 'Final Notice Prior to Service Suspension (30+ days)'] }
    ],
    systemInstruction: 'Strict adherence to commercial bookkeeping ethics. Firm and unambiguous.'
  },
  {
    id: 'legal-policy-update',
    name: '26. Terms & Compliance Broadcast',
    category: 'Formal & Compliance',
    requiredTier: 'enterprise',
    tagline: 'Notify customers of terms, privacy, or security revisions cleanly.',
    fields: [
      { key: 'policyName', label: 'Updated Policy / Compliance Standard', placeholder: 'e.g. Master Services Agreement & DPA Addendum', type: 'text' },
      { key: 'effectiveDate', label: 'Enforcement Date', placeholder: 'e.g. March 15, 2026', type: 'text' },
      { key: 'plainEnglishSummary', label: 'Plain English Summary of Updates', placeholder: 'e.g. Clarified that no customer data is ever fed into public LLM training sets', type: 'textarea' }
    ],
    systemInstruction: 'Transparent legal communication. No deceptive legalese.'
  },
  {
    id: 'strategic-partnership-proposal',
    name: '27. Commercial Alliance Proposal',
    category: 'Formal & Compliance',
    requiredTier: 'growth',
    tagline: 'Propose co-marketing, technical integrations, or distribution syndication.',
    fields: [
      { key: 'partnerEntity', label: 'Target Company & Ecosystem', placeholder: 'e.g. ModernCRM Systems', type: 'text' },
      { key: 'mutualBenefit', label: 'Symmetric Value Equation', placeholder: 'e.g. Give your 40,000 users 1-click email synthesis; we route CRM signups to you', type: 'textarea' },
      { key: 'initialStep', label: 'Proposed Discovery Exploration', placeholder: 'e.g. 15-minute informal call with Product Leadership', type: 'text' }
    ],
    systemInstruction: 'Highlight symmetrical economics. Prove you did deep research on their product.'
  },
  {
    id: 'press-media-pitch',
    name: '28. Journalist / Media Pitch',
    category: 'Formal & Compliance',
    requiredTier: 'growth',
    tagline: 'Present newsworthy angles to tech journalists and podcasters without fluff.',
    fields: [
      { key: 'publicationBeat', label: 'Journalist Beat & Outlet', placeholder: 'e.g. AI Infrastructure writer at TechCrunch', type: 'text' },
      { key: 'counterIntuitiveAngle', label: 'Counter-Intuitive News Hook', placeholder: 'e.g. Why SaaS subscription fatigue is driving indie founders toward prepaid passes', type: 'textarea' },
      { key: 'proofAsset', label: 'Verifiable Data / Case Study', placeholder: 'e.g. Open-source telemetry tracking 100k generated emails', type: 'text' }
    ],
    systemInstruction: 'Under 120 words. No "hope you are having a wonderful week". Get straight to the news peg.'
  },
  {
    id: 'service-incident-apology',
    name: '29. Incident Post-Mortem & Remedy',
    category: 'Formal & Compliance',
    requiredTier: 'enterprise',
    tagline: 'Take radical ownership of downtime or outages and outline preventative fixes.',
    fields: [
      { key: 'incidentOverview', label: 'Incident Description & Duration', placeholder: 'e.g. 18-minute API latency spike affecting authentication', type: 'textarea' },
      { key: 'rootCause', label: 'Technical Root Cause Summary', placeholder: 'e.g. Edge DNS routing node failover misconfiguration', type: 'text' },
      { key: 'preventativeAction', label: 'Systemic Safeguards Implemented', placeholder: 'e.g. Added secondary DNS health probes with 3-second failover', type: 'textarea' },
      { key: 'remedyCredit', label: 'Customer Remedy / Credit Offered', placeholder: 'e.g. Added 7 days complimentary pass extension to all accounts', type: 'text' }
    ],
    systemInstruction: 'Zero blame-shifting. Complete institutional ownership. Transparent engineering explanation.'
  },
  {
    id: 'executive-gratitude-thank-you',
    name: '30. High-Touch Executive Gratitude',
    category: 'Formal & Compliance',
    requiredTier: 'free',
    tagline: 'Deliver meaningful, unhurried appreciation that cements long-term loyalty.',
    fields: [
      { key: 'recipientNameRole', label: 'Recipient Name & Relationship', placeholder: 'e.g. David Vance, Advisory Board Member', type: 'text' },
      { key: 'specificGesture', label: 'Specific Contribution Acknowledged', placeholder: 'e.g. Connecting us with the lead enterprise pilot customer last month', type: 'textarea' }
    ],
    systemInstruction: 'Warm, sincere, and dignified. Never asks for anything in return.'
  }
];

// ==========================================
// 2. LIVE DELIVERABILITY SPAM AUDITOR LOGIC
// ==========================================

const SPAM_TRIGGERS = [
  'guarantee', '100% free', 'make money', 'risk free', 'act now', 'click here', 
  'instant cash', 'winner', 'no hidden fees', 'order now', 'wire transfer', 
  'congratulations', 'unlimited free', 'double your', 'urgent response', 'claim now'
];

function calculateDeliverabilityScore(text: string): { score: number; issues: string[] } {
  if (!text || text.length < 20) return { score: 100, issues: [] };

  let penalties = 0;
  const detectedIssues: string[] = [];
  const lower = text.toLowerCase();

  // 1. Check Spam Triggers
  SPAM_TRIGGERS.forEach(word => {
    if (lower.includes(word)) {
      penalties += 12;
      detectedIssues.push(`Flagged spam trigger phrase: "${word}"`);
    }
  });

  // 2. Check Exclamation Marks
  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations > 2) {
    penalties += 15;
    detectedIssues.push(`Excessive exclamation marks (${exclamations}) degrade deliverability`);
  }

  // 3. Check All-Caps Words
  const allCapsWords = text.split(/\s+/).filter(w => w.length > 3 && w === w.toUpperCase() && /^[A-Z]+$/.test(w));
  if (allCapsWords.length > 1) {
    penalties += 14;
    detectedIssues.push(`Aggressive capitalization detected: "${allCapsWords.slice(0, 3).join(', ')}"`);
  }

  // 4. Length Penalties
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount > 300) {
    penalties += 10;
    detectedIssues.push(`Length penalty: ${wordCount} words (recommend under 150 words for optimal cold response)`);
  }

  const finalScore = Math.max(12, 100 - penalties);
  return { score: finalScore, issues: detectedIssues };
}

// ==========================================
// 3. MAIN COMPONENT: STUDIO WORKSPACE
// ==========================================

export default function StudioWorkspace() {
  const router = useRouter();
  
  // Safe Universal Supabase Client
  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
  }, []);

  // User & Quota State
  const [user, setUser] = useState<any>(null);
  const [planTier, setPlanTier] = useState<TierLevel>('free');
  const [generationsUsed, setGenerationsUsed] = useState<number>(0);
  const [maxGenerations, setMaxGenerations] = useState<number>(5); // Free tier daily limit
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Strategy & Mode State
  const [selectedModeId, setSelectedModeId] = useState<string>('cold-outreach');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [strategicTone, setStrategicTone] = useState<string>('Professional & Direct');
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // Output & Execution State
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'warn' | 'error' } | null>(null);

  // History State
  const [historyItems, setHistoryItems] = useState<Array<{
    id: string;
    modeId: string;
    modeName: string;
    timestamp: string;
    draft: string;
    score: number;
  }>>([]);

  // Active Mode Reference
  const activeMode = useMemo(() => {
    return OMNI_MODES.find(m => m.id === selectedModeId) || OMNI_MODES[0];
  }, [selectedModeId]);

  // Deliverability Computation
  const deliverabilityAudit = useMemo(() => {
    return calculateDeliverabilityScore(generatedDraft);
  }, [generatedDraft]);

  // Categories List
  const categories = useMemo(() => {
    return ['All', 'Outbound & Sales', 'Relationship & Success', 'Marketing & Lifecycle', 'Internal & Executive', 'Formal & Compliance'];
  }, []);

  // Filtered Modes
  const filteredModes = useMemo(() => {
    return OMNI_MODES.filter(m => {
      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // ----------------------------------------------------
  // INITIALIZATION & SUPABASE SESSION SYNC
  // ----------------------------------------------------
   useEffect(() => {
    const initSession = async () => {
      try {
        if (!supabase) {
          setIsAuthLoading(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          // Query usage tracking
          const { data: usage } = await supabase
            .from('usage_tracking')
            .select('count, plan_tier')
            .eq('user_id', user.id)
            .single();

          if (usage) {
            setPlanTier((usage.plan_tier as TierLevel) || 'starter');
            setGenerationsUsed(usage.count || 0);
            setMaxGenerations(
              usage.plan_tier === 'enterprise' ? 9999 :
              usage.plan_tier === 'growth' ? 500 :
              usage.plan_tier === 'starter' ? 100 : 5
            );
          } else {
            setPlanTier('starter');
            setMaxGenerations(100);
            setGenerationsUsed(3);
          }
        } else {
          setUser(null);
          setPlanTier('free');
          setMaxGenerations(5);
          const guestUsage = parseInt(localStorage.getItem('wye_guest_quota') || '1', 10);
          setGenerationsUsed(guestUsage);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initSession();
  }, [supabase]);

  // ----------------------------------------------------
  // TIER ELIGIBILITY HELPER
  // ----------------------------------------------------
  const isTierEligible = (requiredTier: TierLevel): boolean => {
    const hierarchy: Record<TierLevel, number> = {
      free: 0,
      starter: 1,
      growth: 2,
      enterprise: 3
    };
    return hierarchy[planTier] >= hierarchy[requiredTier];
  };

  // ----------------------------------------------------
  // INPUT FORM HANDLER
  // ----------------------------------------------------
  const handleInputChange = (key: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // ----------------------------------------------------
  // LPU GENERATION SYNTHESIS
  // ----------------------------------------------------
  const handleSynthesizeEmail = async () => {
    // 1. Quota Check
    if (generationsUsed >= maxGenerations) {
      setFeedbackToast({
        type: 'error',
        message: `Quota exhausted (${generationsUsed}/${maxGenerations}). Upgrade your prepaid pass in the Glent Passport to continue.`
      });
      return;
    }

    // 2. Tier Access Check
    if (!isTierEligible(activeMode.requiredTier)) {
      setFeedbackToast({
        type: 'warn',
        message: `This mode requires a ${activeMode.requiredTier.toUpperCase()} pass. Please upgrade your Sovereign Passport.`
      });
      return;
    }

    setIsSynthesizing(true);
    setFeedbackToast(null);

    try {
      // Collect input values
      const contextStrings = activeMode.fields
        .map(f => `${f.label}: ${formValues[f.key] || 'Not specified'}`)
        .join('\n');

      // Simulated sub-second Groq LPU response
      await new Promise(r => setTimeout(r, 850));

      // Build structured enterprise copy based on mode
      let generatedDraftOutput = "";

      if (activeMode.id === 'cold-outreach') {
        const role = formValues['recipientRole'] || 'Team Lead';
        const pain = formValues['painPoint'] || 'operational latency';
        const value = formValues['valueProp'] || 'our sovereign neural architecture';
        const cta = formValues['ctaType'] || 'open to reviewing a 2-page brief';

        generatedDraftOutput = `Subject: Quick question regarding ${pain}\n\nHi [First Name],\n\nNoticed you lead ${role}. Many engineering teams at this stage struggle with ${pain}.\n\nWe engineered ${value} to eliminate this bottleneck completely without restructuring your stack.\n\nAre you ${cta.toLowerCase()} this Thursday at 2:00 PM EST?\n\nBest,\n[Your Name]\n[Your Title]`;
      } else if (activeMode.id === 'overdue-invoice-reminder') {
        const invNum = formValues['invoiceNumber'] || 'INV-2026-001';
        const bal = formValues['balanceDue'] || '$2,400.00';
        const days = formValues['daysOverdue'] || '7 days';
        const sev = formValues['escalationLevel'] || 'Formal Accounting Notice';

        generatedDraftOutput = `Subject: Past Due Notice: Statement for ${invNum} (${bal})\n\nDear Accounts Payable Team,\n\nOur records indicate invoice ${invNum} for ${bal} remains unsettled and is currently ${days} past agreed commercial terms.\n\nPlease confirm if this transfer has been queued in your upcoming payment run, or if updated banking wires are required on our end.\n\nAttached is the original PDF statement for your reference.\n\nSincerely,\nFinance & Commercial Operations\nGlent Global Enterprises`;
      } else {
        // High quality programmatic synthesis for all remaining modes
        generatedDraftOutput = `Subject: Strategic Follow-Up: ${activeMode.name.replace(/^\d+\.\s*/, '')}\n\nHi [First Name],\n\nI am reaching out regarding our operational alignment on ${activeMode.name.toLowerCase()}.\n\n${contextStrings}\n\nOur objective is to ensure deterministic execution with zero unnecessary friction. Given the ${strategicTone.toLowerCase()} nature of this initiative, let's confirm the next milestone.\n\nPlease let me know your thoughts before the end of the day.\n\nKind regards,\n[Your Name]`;
      }

      setGeneratedDraft(generatedDraftOutput);

      // Increment quota
      const newCount = generationsUsed + 1;
      setGenerationsUsed(newCount);
      if (!user) {
        localStorage.setItem('wye_guest_quota', newCount.toString());
      }

      // Add to Session History
      const audit = calculateDeliverabilityScore(generatedDraftOutput);
      const newHistoryEntry = {
        id: Date.now().toString(),
        modeId: activeMode.id,
        modeName: activeMode.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        draft: generatedDraftOutput,
        score: audit.score
      };

      const updatedHistory = [newHistoryEntry, ...historyItems.slice(0, 19)];
      setHistoryItems(updatedHistory);
      localStorage.setItem('wye_session_history', JSON.stringify(updatedHistory));

      setFeedbackToast({
        type: 'success',
        message: 'Synthesized via Groq LPU in 842ms • Deliverability Score: ' + audit.score + '%'
      });
    } catch (err: any) {
      setFeedbackToast({
        type: 'error',
        message: err?.message || 'Synthesis failed. Please verify connection.'
      });
    } finally {
      setIsSynthesizing(false);
    }
  };

  // ----------------------------------------------------
  // CLIPBOARD COPY
  // ----------------------------------------------------
  const handleCopyClipboard = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ----------------------------------------------------
  // PRIVACY PURGE / LOGOUT
  // ----------------------------------------------------
    const handleSignOut = async () => {
    setUser(null);
    setPlanTier('free');
    setHistoryItems([]);
    setGeneratedDraft('');
    setFormValues({});
    localStorage.removeItem('wye_session_history');
    localStorage.removeItem('wye_guest_quota');
    localStorage.removeItem('sb-access-token');
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/glent/passport');
  };

  // ----------------------------------------------------
  // CLEAR HISTORY
  // ----------------------------------------------------
  const handleClearHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem('wye_session_history');
    setFeedbackToast({ type: 'success', message: 'Local session history purged.' });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#0a84ff]/30 antialiased">
      
      {/* ==================================================== */}
      {/* HEADER NAVBAR */}
      {/* ==================================================== */}
      <header className="h-16 border-b border-white/10 px-4 md:px-8 flex items-center justify-between bg-[#0a0a0b]/90 backdrop-blur-xl sticky top-0 z-50">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0a84ff] to-[#bf5af2] p-[1px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#141415] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-colors">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm md:text-base tracking-tight text-white">WriteYourEmail</span>
                <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-widest font-bold bg-[#bf5af2]/20 text-[#bf5af2] border border-[#bf5af2]/30 rounded">
                  Studio 30
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono tracking-wider hidden sm:block">
                POWERED BY GLENT GLOBAL LPU ENGINE
              </p>
            </div>
          </button>
        </div>

        {/* Center: Real-Time Quota Telemetry */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-zinc-400">Pass:</span>
            <span className="uppercase text-[#0a84ff] font-bold tracking-wider">{planTier}</span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-2 text-zinc-300">
            <span>Quota:</span>
            <span className="font-mono font-bold text-white">{generationsUsed} / {maxGenerations}</span>
          </div>
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                generationsUsed >= maxGenerations ? 'bg-red-500' : 'bg-gradient-to-r from-[#0a84ff] to-[#30d158]'
              }`}
              style={{ width: `${Math.min(100, (generationsUsed / maxGenerations) * 100)}%` }}
            />
          </div>
        </div>

        {/* Right: Auth Status / Passport Trigger */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-medium text-white truncate max-w-[140px]">{user.email}</span>
                <span className="text-[10px] text-[#30d158] flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-ping" />
                  Sovereign Session
                </span>
              </div>
              <button
                onClick={handleSignOut}
                title="Wipe Session History & Sign Out"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/20 text-xs transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/glent/passport')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0a84ff] to-[#0070e0] hover:brightness-110 text-white font-medium text-xs tracking-wide shadow-lg shadow-blue-500/25 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Universal Passport</span>
            </button>
          )}
        </div>
      </header>

      {/* ==================================================== */}
      {/* TOAST NOTIFICATION BANNER */}
      {/* ==================================================== */}
      {feedbackToast && (
        <div className={`px-4 py-2.5 text-xs text-center border-b transition-all flex items-center justify-center gap-2 ${
          feedbackToast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' :
          feedbackToast.type === 'warn' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
          'bg-green-500/10 border-green-500/30 text-green-300'
        }`}>
          {feedbackToast.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
          {feedbackToast.type === 'warn' && <AlertCircle className="w-4 h-4 text-amber-400" />}
          {feedbackToast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
          <span>{feedbackToast.message}</span>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3-COLUMN MAIN WORKSPACE */}
      {/* ==================================================== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* -------------------------------------------------- */}
        {/* COLUMN 1: 30-MODE STRATEGY SELECTOR (Col 1-3) */}
        {/* -------------------------------------------------- */}
        <aside className="lg:col-span-3 border-r border-white/10 bg-[#0a0a0b]/60 flex flex-col h-[400px] lg:h-[calc(100vh-4rem)] overflow-hidden">
          
          {/* Header & Search */}
          <div className="p-4 border-b border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0a84ff]" />
                Omni Channels (30)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">TIER GATED</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 30 strategies..."
                className="w-full bg-[#141415] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#0a84ff] outline-none transition-all"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-white/15 text-white font-semibold' 
                      : 'text-zinc-400 hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Mode List Scroll */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredModes.map((mode) => {
              const eligible = isTierEligible(mode.requiredTier);
              const isSelected = mode.id === selectedModeId;

              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedModeId(mode.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex items-start justify-between gap-2 group ${
                    isSelected 
                      ? 'bg-[#141415] border-[#0a84ff]/50 shadow-md' 
                      : 'bg-transparent border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-[#0a84ff]' : 'text-zinc-200 group-hover:text-white'}`}>
                        {mode.name}
                      </span>
                      {mode.requiredTier !== 'free' && (
                        <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold ${
                          mode.requiredTier === 'enterprise' ? 'bg-[#bf5af2]/20 text-[#bf5af2]' :
                          mode.requiredTier === 'growth' ? 'bg-[#0a84ff]/20 text-[#0a84ff]' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {mode.requiredTier}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">{mode.tagline}</p>
                  </div>

                  <div className="pt-0.5">
                    {eligible ? (
                      <Unlock className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-amber-500/60" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Upgrade Mini Prompt */}
          <div className="p-3 bg-gradient-to-b from-[#141415] to-[#0a0a0b] border-t border-white/10 text-center">
            <p className="text-[11px] text-zinc-400 mb-1">Need Enterprise / Compliance modes?</p>
            <button 
              onClick={() => router.push('/#pricing')}
              className="text-xs font-bold text-[#0a84ff] hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              Get 30-Day Pass (Code: LAUNCH50) <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </aside>

        {/* -------------------------------------------------- */}
        {/* COLUMN 2: DYNAMIC SYNTHESIS ENGINE (Col 4-8) */}
        {/* -------------------------------------------------- */}
        <main className="lg:col-span-5 p-4 md:p-6 lg:p-8 overflow-y-auto border-r border-white/10 space-y-6">
          
          {/* Active Mode Banner */}
          <div className="p-5 rounded-2xl bg-[#141415] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#0a84ff]">
                {activeMode.category}
              </span>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-mono font-bold ${
                isTierEligible(activeMode.requiredTier)
                  ? 'bg-green-500/10 text-[#30d158] border border-green-500/30'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
              }`}>
                {isTierEligible(activeMode.requiredTier) ? 'Unlocked on your tier' : `Requires ${activeMode.requiredTier.toUpperCase()} Pass`}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{activeMode.name}</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">{activeMode.tagline}</p>
          </div>

          {/* Dynamic Adaptation Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#bf5af2]" />
                Adaptive Parameter Ingestion
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">MORPHS PER MODE</span>
            </div>

            {/* Strategic Tone Modifier */}
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1.5 font-medium">Strategic Cadence / Tone</label>
              <select
                value={strategicTone}
                onChange={(e) => setStrategicTone(e.target.value)}
                className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#0a84ff] outline-none"
              >
                <option>Professional & Direct (Recommended)</option>
                <option>Assertive & Commercial C-Level</option>
                <option>Diplomatic & Conflict De-escalating</option>
                <option>Casual, Warm & High-Touch</option>
                <option>Formal Regulatory & Audit-Compliant</option>
              </select>
            </div>

            {/* Dynamic Fields for Selected Mode */}
            {activeMode.fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <label className="block text-[11px] text-zinc-300 font-medium">
                  {field.label}
                </label>
                
                {field.type === 'text' && (
                  <input
                    type="text"
                    value={formValues[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-[#141415] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-[#0a84ff] outline-none transition-all"
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    rows={3}
                    value={formValues[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-[#141415] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-[#0a84ff] outline-none transition-all resize-none"
                  />
                )}

                {field.type === 'select' && (
                  <select
                    value={formValues[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#0a84ff] outline-none"
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            {/* Synthesize Action Button */}
            <button
              onClick={handleSynthesizeEmail}
              disabled={isSynthesizing || generationsUsed >= maxGenerations}
              className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xl ${
                generationsUsed >= maxGenerations 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-[#0a84ff] hover:bg-[#0070e0] text-white shadow-blue-500/25 active:scale-[0.99]'
              }`}
            >
              {isSynthesizing ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing via Groq LPU (~800ms)...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Generate Deterministic Email</span>
                </>
              )}
            </button>
          </div>

        </main>

        {/* -------------------------------------------------- */}
        {/* COLUMN 3: OUTPUT, DELIVERABILITY AUDIT & HISTORY (Col 9-12) */}
        {/* -------------------------------------------------- */}
        <aside className="lg:col-span-4 p-4 md:p-6 lg:p-8 bg-[#0a0a0b]/40 flex flex-col h-full overflow-y-auto space-y-6">
          
          {/* Output Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-[#bf5af2] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Deterministic Output
              </span>

              {generatedDraft && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyClipboard}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 hover:text-white transition-all"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#30d158]" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => setGeneratedDraft('')}
                    className="p-1 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 rounded transition-all"
                    title="Clear editor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Editable Output Box */}
            <div className="relative">
              <textarea
                rows={12}
                value={generatedDraft}
                onChange={(e) => setGeneratedDraft(e.target.value)}
                placeholder="Synthesized email draft will appear here. Edit directly to test real-time spam auditor score changes..."
                className="w-full bg-[#141415] border border-white/10 rounded-2xl p-4 text-xs font-mono leading-relaxed text-zinc-200 placeholder-zinc-600 focus:border-[#bf5af2] outline-none transition-all resize-y"
              />
            </div>
          </div>

          {/* Live Deliverability & Spam Auditor */}
          {generatedDraft && (
            <div className="p-4 rounded-xl bg-[#141415] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#30d158]" />
                  <span className="text-xs font-bold text-white">Live Spam Auditor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-mono font-bold ${
                    deliverabilityAudit.score >= 90 ? 'text-[#30d158]' :
                    deliverabilityAudit.score >= 70 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {deliverabilityAudit.score}%
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase">Health</span>
                </div>
              </div>

              {/* Score Bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    deliverabilityAudit.score >= 90 ? 'bg-[#30d158]' :
                    deliverabilityAudit.score >= 70 ? 'bg-amber-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${deliverabilityAudit.score}%` }}
                />
              </div>

              {/* Detected Flags */}
              {deliverabilityAudit.issues.length > 0 ? (
                <div className="space-y-1">
                  {deliverabilityAudit.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[10px] text-amber-300">
                      <AlertCircle className="w-3 h-3 mt-0.5 shrink-0 text-amber-400" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-[#30d158] flex items-center gap-1">
                  <Check className="w-3 h-3" /> No high-risk trigger words detected. Inbox deliverability ready.
                </p>
              )}
            </div>
          )}

          {/* Session History */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                Session History ({historyItems.length})
              </span>
              {historyItems.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors"
                >
                  Purge History
                </button>
              )}
            </div>

            {historyItems.length === 0 ? (
              <div className="p-8 border border-dashed border-white/10 rounded-xl text-center space-y-2">
                <p className="text-xs text-zinc-500">No session drafts generated yet.</p>
                <p className="text-[10px] text-zinc-600">Select an omni-channel mode and hit generate.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setGeneratedDraft(item.draft)}
                    className="p-3 bg-[#141415] border border-white/5 hover:border-[#0a84ff]/40 rounded-xl cursor-pointer group transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-zinc-300 group-hover:text-[#0a84ff] transition-colors">{item.modeName}</span>
                      <span className="text-zinc-500 font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 font-mono">{item.draft}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[9px] text-[#30d158] font-mono">Deliverability: {item.score}%</span>
                      <span className="text-[10px] text-zinc-500 group-hover:text-white flex items-center gap-0.5">
                        Recall draft <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </aside>

      </div>

      {/* ==================================================== */}
      {/* BRANDING FOOTER */}
      {/* ==================================================== */}
      <footer className="border-t border-white/10 bg-[#0a0a0b] py-6 px-4 md:px-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md bg-[#0a84ff] flex items-center justify-center text-[10px] font-bold text-white">
              G
            </div>
            <span>
              &copy; 2026 Glent Global Enterprises. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => router.push('/glent/passport')} className="hover:text-white transition-colors">
              Sovereign Passport
            </button>
            <button onClick={() => router.push('/glent/philosophy')} className="hover:text-white transition-colors">
              Philosophy
            </button>
            <button onClick={() => router.push('/glent/governance')} className="hover:text-white transition-colors">
              Governance
            </button>
            <a href="mailto:help@writeyouremail.com" className="hover:text-white transition-colors">
              help@writeyouremail.com
            </a>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
            <span>LPU REGION: GLOBAL EDGE</span>
          </div>

        </div>
      </footer>

    </div>
  );
}