"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  Sparkles, 
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
  LogOut, 
  LogIn, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Sliders,
  ChevronRight,
  Briefcase,
  Building2,
  Globe,
  UserCheck,
  Plus,
  Save,
  CheckSquare,
  X
} from 'lucide-react';

import { 
  BrandProfile, 
  DEFAULT_BRAND_PRESETS, 
  loadLocalBrandProfiles, 
  saveLocalBrandProfiles, 
  getActiveBrandProfile 
} from '../glent/lib/brand-memory';

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
  brandMemoryKey?: keyof BrandProfile;
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
      { key: 'recipientRole', label: 'Prospect Role & Target Segment', placeholder: 'e.g. VP of Engineering at ScaleOps', type: 'text', brandMemoryKey: 'icp' },
      { key: 'painPoint', label: 'Primary Operational Pain Point', placeholder: 'e.g. Cloud egress costs rising 40% QoQ', type: 'text' },
      { key: 'valueProp', label: 'Unique Value Proposition / Solution', placeholder: 'e.g. Cuts idle waste by 32%', type: 'textarea', brandMemoryKey: 'elevatorPitch' },
      { key: 'proofAsset', label: 'Proof Point / Credibility Anchor', placeholder: 'e.g. Trusted by 12,000 teams', type: 'text', brandMemoryKey: 'proofPoints' },
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
      { key: 'newMicroValue', label: 'New Micro-Value or Trigger Event', placeholder: 'e.g. Saw your LinkedIn update regarding expansion', type: 'textarea' }
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
      { key: 'updatedFeature', label: 'Major Company or Product Milestone', placeholder: 'e.g. Added automated SOC2 compliance module', type: 'text', brandMemoryKey: 'proofPoints' },
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
      { key: 'calendarUrl', label: 'Direct Calendar Link', placeholder: 'e.g. cal.com/your-team/15min', type: 'text', brandMemoryKey: 'primaryCta' },
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
      { key: 'roiMetrics', label: 'Projected Economic Upside', placeholder: 'e.g. Saves 18 developer hours per sprint (~$4,200/mo)', type: 'textarea', brandMemoryKey: 'elevatorPitch' },
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
      { key: 'documentationLink', label: 'Quickstart Documentation Link', placeholder: 'e.g. writeyouremail.com/docs', type: 'text', brandMemoryKey: 'websiteUrl' },
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
      { key: 'productName', label: 'Product / System Name', placeholder: 'e.g. WriteYourEmail Omni-Engine', type: 'text', brandMemoryKey: 'companyName' },
      { key: 'keyBreakthrough', label: 'The Core Technical Breakthrough', placeholder: 'e.g. 0.8-second cold email synthesis with zero rate limits', type: 'textarea', brandMemoryKey: 'elevatorPitch' }
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
      { key: 'speakerCredential', label: 'Host & Guest Credentials', placeholder: 'e.g. Lead Enterprise Deliverability Architects', type: 'text', brandMemoryKey: 'senderTitle' },
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
      { key: 'downloadUrl', label: 'Direct Download Link', placeholder: 'e.g. writeyouremail.com/blueprint.pdf', type: 'text', brandMemoryKey: 'websiteUrl' },
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
      { key: 'topKpis', label: 'Core Metrics (ARR, Run-rate, MAU)', placeholder: 'e.g. Active passes: +48% MoM, Server cost: $0.00, Uptime: 99.98%', type: 'textarea', brandMemoryKey: 'proofPoints' },
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
      { key: 'whyNow', label: 'The Strategic Imperative ("Why Now")', placeholder: 'e.g. Eliminates SaaS subscription dependencies', type: 'textarea' },
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
      { key: 'hardProblem', label: 'The Hard Technical Problem to Solve', placeholder: 'e.g. Building sub-100ms LLM streaming pipelines at zero marginal cost', type: 'textarea', brandMemoryKey: 'elevatorPitch' },
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
      { key: 'criticalGap', label: 'Specific Area Requiring Calibration', placeholder: 'e.g. Cross-functional documentation was omitted', type: 'textarea' },
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
      { key: 'mutualBenefit', label: 'Symmetric Value Equation', placeholder: 'e.g. Give your 40,000 users 1-click email synthesis; we route CRM signups to you', type: 'textarea', brandMemoryKey: 'elevatorPitch' },
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
      { key: 'proofAsset', label: 'Verifiable Data / Case Study', placeholder: 'e.g. Open-source telemetry tracking 100k generated emails', type: 'text', brandMemoryKey: 'proofPoints' }
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
      { key: 'recipientNameRole', label: 'Recipient Name & Relationship', placeholder: 'e.g. Advisory Board Member', type: 'text' },
      { key: 'specificGesture', label: 'Specific Contribution Acknowledged', placeholder: 'e.g. Connecting us with the lead enterprise pilot customer last month', type: 'textarea' }
    ],
    systemInstruction: 'Warm, sincere, and dignified. Never asks for anything in return.'
  }
];

// Deliverability Spam Auditor
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

  SPAM_TRIGGERS.forEach(word => {
    if (lower.includes(word)) {
      penalties += 12;
      detectedIssues.push(`Flagged spam trigger phrase: "${word}"`);
    }
  });

  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations > 2) {
    penalties += 15;
    detectedIssues.push(`Excessive exclamation marks (${exclamations}) degrade deliverability`);
  }

  const allCapsWords = text.split(/\s+/).filter(w => w.length > 3 && w === w.toUpperCase() && /^[A-Z]+$/.test(w));
  if (allCapsWords.length > 1) {
    penalties += 14;
    detectedIssues.push(`Aggressive capitalization: "${allCapsWords.slice(0, 3).join(', ')}"`);
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount > 300) {
    penalties += 10;
    detectedIssues.push(`Length penalty: ${wordCount} words (recommend under 150 for cold response)`);
  }

  return { score: Math.max(12, 100 - penalties), issues: detectedIssues };
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function StudioWorkspace() {
  const router = useRouter();

  // Safe Supabase Client
  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
  }, []);

  // Auth & Quota
  const [user, setUser] = useState<any>(null);
  const [planTier, setPlanTier] = useState<TierLevel>('free');
  const [generationsUsed, setGenerationsUsed] = useState<number>(0);
  const [maxGenerations, setMaxGenerations] = useState<number>(5);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Strategy & Forms
  const [selectedModeId, setSelectedModeId] = useState<string>('cold-outreach');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [strategicTone, setStrategicTone] = useState<string>('Professional & Direct');
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // Brand Memory State
  const [brandProfiles, setBrandProfiles] = useState<BrandProfile[]>([]);
  const [isBrandDrawerOpen, setIsBrandDrawerOpen] = useState<boolean>(false);
  const [autoInjectBrand, setAutoInjectBrand] = useState<boolean>(true);
  const [editingBrand, setEditingBrand] = useState<BrandProfile | null>(null);

  // Output & History
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'warn' | 'error' } | null>(null);
  const [historyItems, setHistoryItems] = useState<Array<{
    id: string;
    modeId: string;
    modeName: string;
    timestamp: string;
    draft: string;
    score: number;
  }>>([]);

  // Active Brand Helper
  const activeBrand = useMemo(() => {
    return getActiveBrandProfile(brandProfiles);
  }, [brandProfiles]);

  const activeMode = useMemo(() => {
    return OMNI_MODES.find(m => m.id === selectedModeId) || OMNI_MODES[0];
  }, [selectedModeId]);

  const deliverabilityAudit = useMemo(() => {
    return calculateDeliverabilityScore(generatedDraft);
  }, [generatedDraft]);

  const categories = useMemo(() => {
    return ['All', 'Outbound & Sales', 'Relationship & Success', 'Marketing & Lifecycle', 'Internal & Executive', 'Formal & Compliance'];
  }, []);

  const filteredModes = useMemo(() => {
    return OMNI_MODES.filter(m => {
      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // ----------------------------------------------------
  // INITIALIZE SESSION & BRAND PROFILES
  // ----------------------------------------------------
  useEffect(() => {
    const initSession = async () => {
      try {
        // 1. Load Local Brands First
        const localProfiles = loadLocalBrandProfiles();
        setBrandProfiles(localProfiles);
        setEditingBrand(localProfiles[0] || null);

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

          // Fetch Brand Profiles from Supabase if table exists
          const { data: dbBrands, error: brandErr } = await supabase
            .from('brand_profiles')
            .select('*')
            .eq('user_id', user.id);

          if (!brandErr && dbBrands && dbBrands.length > 0) {
            const mapped: BrandProfile[] = dbBrands.map((b: any) => ({
              id: b.id,
              profileName: b.profile_name,
              companyName: b.company_name,
              industry: b.industry || '',
              websiteUrl: b.website_url || '',
              elevatorPitch: b.elevator_pitch || '',
              icp: b.icp || '',
              brandVoice: b.brand_voice || '',
              primaryCta: b.primary_cta || '',
              senderName: b.sender_name || '',
              senderTitle: b.sender_title || '',
              proofPoints: b.proof_points || '',
              isActive: b.is_active
            }));
            setBrandProfiles(mapped);
            setEditingBrand(mapped.find(m => m.isActive) || mapped[0]);
          }
        } else {
          setUser(null);
          setPlanTier('free');
          setMaxGenerations(5);
          const guestUsage = parseInt(localStorage.getItem('wye_guest_quota') || '1', 10);
          setGenerationsUsed(guestUsage);
        }

        const savedHistory = localStorage.getItem('wye_session_history');
        if (savedHistory) setHistoryItems(JSON.parse(savedHistory));
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initSession();
  }, [supabase]);

  const isTierEligible = (requiredTier: TierLevel): boolean => {
    const hierarchy: Record<TierLevel, number> = { free: 0, starter: 1, growth: 2, enterprise: 3 };
    return hierarchy[planTier] >= hierarchy[requiredTier];
  };

  const handleInputChange = (key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  // ----------------------------------------------------
  // BRAND MEMORY 1-CLICK AUTOFILL
  // ----------------------------------------------------
  const handleAutoFillFromBrand = () => {
    if (!activeBrand) return;
    const updated = { ...formValues };
    
    activeMode.fields.forEach(field => {
      if (field.brandMemoryKey && activeBrand[field.brandMemoryKey]) {
        updated[field.key] = String(activeBrand[field.brandMemoryKey]);
      }
    });

    setFormValues(updated);
    setFeedbackToast({
      type: 'success',
      message: `Injected "${activeBrand.companyName}" Brand DNA into fields.`
    });
  };

  // Switch Active Brand
  const handleSelectActiveBrand = async (brandId: string) => {
    const updated = brandProfiles.map(b => ({
      ...b,
      isActive: b.id === brandId
    }));
    setBrandProfiles(updated);
    saveLocalBrandProfiles(updated);
    const selected = updated.find(b => b.id === brandId) || null;
    setEditingBrand(selected);

    // Sync to Supabase if authenticated
    if (supabase && user) {
      await supabase.from('brand_profiles').update({ is_active: false }).eq('user_id', user.id);
      await supabase.from('brand_profiles').update({ is_active: true }).eq('id', brandId);
    }

    setFeedbackToast({
      type: 'success',
      message: `Switched active brand profile to "${selected?.profileName}".`
    });
  };

  // Save/Update Brand Profile
  const handleSaveBrandProfile = async () => {
    if (!editingBrand) return;
    if (!editingBrand.companyName.trim()) {
      setFeedbackToast({ type: 'warn', message: 'Company Name is required.' });
      return;
    }

    let updatedProfiles = [...brandProfiles];
    const exists = updatedProfiles.some(b => b.id === editingBrand.id);

    if (exists) {
      updatedProfiles = updatedProfiles.map(b => b.id === editingBrand.id ? editingBrand : b);
    } else {
      updatedProfiles.push(editingBrand);
    }

    setBrandProfiles(updatedProfiles);
    saveLocalBrandProfiles(updatedProfiles);

    // Persist to Supabase if logged in
    if (supabase && user) {
      const payload = {
        user_id: user.id,
        profile_name: editingBrand.profileName,
        company_name: editingBrand.companyName,
        industry: editingBrand.industry,
        website_url: editingBrand.websiteUrl,
        elevator_pitch: editingBrand.elevatorPitch,
        icp: editingBrand.icp,
        brand_voice: editingBrand.brandVoice,
        primary_cta: editingBrand.primaryCta,
        sender_name: editingBrand.senderName,
        sender_title: editingBrand.senderTitle,
        proof_points: editingBrand.proofPoints,
        is_active: editingBrand.isActive
      };

      if (exists && !editingBrand.id.startsWith('preset-')) {
        await supabase.from('brand_profiles').update(payload).eq('id', editingBrand.id);
      } else {
        const { data: inserted } = await supabase.from('brand_profiles').insert([payload]).select().single();
        if (inserted) {
          editingBrand.id = inserted.id;
        }
      }
    }

    setFeedbackToast({ type: 'success', message: 'Brand Memory profile saved successfully.' });
    setIsBrandDrawerOpen(false);
  };

  // ----------------------------------------------------
  // LPU SYNTHESIS WITH BRAND MEMORY INJECTION
  // ----------------------------------------------------
  const handleSynthesizeEmail = async () => {
    if (generationsUsed >= maxGenerations) {
      setFeedbackToast({
        type: 'error',
        message: `Daily quota exhausted (${generationsUsed}/${maxGenerations}). Upgrade in Sovereign Passport.`
      });
      return;
    }

    if (!isTierEligible(activeMode.requiredTier)) {
      setFeedbackToast({
        type: 'warn',
        message: `Requires ${activeMode.requiredTier.toUpperCase()} pass.`
      });
      return;
    }

    setIsSynthesizing(true);
    setFeedbackToast(null);

    try {
      await new Promise(r => setTimeout(r, 780)); // Simulate ultra-fast Groq LPU latency

      const brand = activeBrand;
      const signature = brand.senderName 
        ? `${brand.senderName}\n${brand.senderTitle || 'Executive Lead'}\n${brand.companyName} | ${brand.websiteUrl}`
        : `[Your Name]\n${brand.companyName || '[Your Company]'}`;

      let output = "";

      if (activeMode.id === 'cold-outreach') {
        const pain = formValues['painPoint'] || 'systemic operational bottlenecks';
        const role = formValues['recipientRole'] || brand.icp || 'VP of Operations';
        const pitch = formValues['valueProp'] || brand.elevatorPitch;
        const proof = formValues['proofAsset'] || brand.proofPoints;

        output = `Subject: Quick question regarding ${pain}\n\nHi [First Name],\n\nNoticed your work leading ${role}. Most scaling teams encounter ${pain} once they push past current volume.\n\nAt ${brand.companyName}, we built a way to solve this: ${pitch}.\n\nFor context, ${proof}.\n\nAre you open to reviewing a 2-page brief this Thursday?\n\nBest,\n${signature}`;
      } else if (activeMode.id === 'meeting-request-vip') {
        const vip = formValues['vipName'] || 'Executive Director';
        const agenda = formValues['agendaThreePoints'] || `1. ${brand.companyName} architecture review\n2. Pipeline efficiency benchmark\n3. Integration roadmap`;
        const link = formValues['calendarUrl'] || brand.primaryCta || 'writeyouremail.com';

        output = `Subject: Strategic alignment for ${brand.companyName}\n\nHi ${vip},\n\nI want to respect your calendar, so I'll keep this brief.\n\nOur team would value 12 minutes to share how we are approaching this quarter:\n\n${agenda}\n\nIf you have a window this week, you can grab a direct slot here: ${link}\n\nRegards,\n${signature}`;
      } else {
        // Universal Ingestion Engine
        const contextLines = activeMode.fields
          .map(f => `${f.label}: ${formValues[f.key] || (f.brandMemoryKey ? brand[f.brandMemoryKey] : 'Not specified')}`)
          .join('\n');

        output = `Subject: ${activeMode.name.replace(/^\d+\.\s*/, '')} — ${brand.companyName}\n\nHi [First Name],\n\nI am reaching out from ${brand.companyName} regarding our ongoing engagement with ${activeMode.name.toLowerCase()}.\n\n${contextLines}\n\nAs a reminder, our primary objective is: ${brand.elevatorPitch}\n\nLooking forward to your thoughts.\n\nSincerely,\n${signature}`;
      }

      setGeneratedDraft(output);

      // Telemetry & History
      const newCount = generationsUsed + 1;
      setGenerationsUsed(newCount);
      if (!user) localStorage.setItem('wye_guest_quota', newCount.toString());

      const audit = calculateDeliverabilityScore(output);
      const newEntry = {
        id: Date.now().toString(),
        modeId: activeMode.id,
        modeName: activeMode.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        draft: output,
        score: audit.score
      };

      const updatedHistory = [newEntry, ...historyItems.slice(0, 19)];
      setHistoryItems(updatedHistory);
      localStorage.setItem('wye_session_history', JSON.stringify(updatedHistory));

      setFeedbackToast({
        type: 'success',
        message: `Draft generated with "${brand.companyName}" Brand DNA • Deliverability: ${audit.score}%`
      });
    } catch (err: any) {
      setFeedbackToast({ type: 'error', message: err?.message || 'Synthesis failed.' });
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCopyClipboard = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignOut = async () => {
    setUser(null);
    setPlanTier('free');
    setHistoryItems([]);
    setGeneratedDraft('');
    setFormValues({});
    localStorage.removeItem('wye_session_history');
    localStorage.removeItem('wye_guest_quota');
    if (supabase) await supabase.auth.signOut();
    router.push('/glent/passport');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#0a84ff]/30 antialiased">
      
      {/* ==================================================== */}
      {/* HEADER NAVBAR WITH BRAND MEMORY PILL */}
      {/* ==================================================== */}
      <header className="h-16 border-b border-white/10 px-4 md:px-8 flex items-center justify-between bg-[#0a0a0b]/90 backdrop-blur-xl sticky top-0 z-40">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-2.5 group text-left">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0a84ff] to-[#bf5af2] p-[1px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#141415] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-colors">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm md:text-base tracking-tight text-white">WriteYourEmail</span>
                <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-widest font-bold bg-[#bf5af2]/20 text-[#bf5af2] border border-[#bf5af2]/30 rounded">
                  Studio
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono tracking-wider hidden sm:block">
                POWERED BY GLENT GLOBAL ENTERPRISES
              </p>
            </div>
          </button>
        </div>

        {/* Center: Brand Memory Active Profile Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBrandDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs group"
          >
            <Building2 className="w-3.5 h-3.5 text-[#0a84ff] group-hover:scale-110 transition-transform" />
            <span className="text-zinc-400 hidden sm:inline">Brand Memory:</span>
            <span className="font-bold text-white max-w-[120px] truncate">{activeBrand?.companyName || 'Not Set'}</span>
            <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse" />
          </button>
        </div>

        {/* Right: Auth & Quota */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-xs">
            <span className="text-zinc-400 font-mono">{generationsUsed}/{maxGenerations} Used</span>
          </div>

          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-white/10 text-xs transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => router.push('/glent/passport')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0a84ff] hover:bg-[#0070e0] text-white text-xs font-semibold shadow-md transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Universal Passport</span>
            </button>
          )}
        </div>
      </header>

      {/* Toast Feedback */}
      {feedbackToast && (
        <div className={`px-4 py-2 text-xs text-center border-b flex items-center justify-center gap-2 ${
          feedbackToast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' :
          feedbackToast.type === 'warn' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
          'bg-green-500/10 border-green-500/30 text-green-300'
        }`}>
          {feedbackToast.type === 'error' && <AlertTriangle className="w-3.5 h-3.5" />}
          {feedbackToast.type === 'warn' && <AlertCircle className="w-3.5 h-3.5" />}
          {feedbackToast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
          <span>{feedbackToast.message}</span>
        </div>
      )}

      {/* ==================================================== */}
      {/* WORKSPACE GRID */}
      {/* ==================================================== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* COL 1: 30 MODES */}
        <aside className="lg:col-span-3 border-r border-white/10 bg-[#0a0a0b]/60 flex flex-col h-[350px] lg:h-[calc(100vh-4rem)] overflow-hidden">
          <div className="p-3 border-b border-white/10 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 30 modes..."
                className="w-full bg-[#141415] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-[#0a84ff] outline-none"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[10px] whitespace-nowrap ${
                    selectedCategory === cat ? 'bg-white/15 text-white font-semibold' : 'text-zinc-400 hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredModes.map((mode) => {
              const isSelected = mode.id === selectedModeId;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedModeId(mode.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center justify-between ${
                    isSelected ? 'bg-[#141415] border-[#0a84ff]/50' : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className={`text-xs font-semibold ${isSelected ? 'text-[#0a84ff]' : 'text-zinc-300'}`}>{mode.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{mode.tagline}</p>
                  </div>
                  {isTierEligible(mode.requiredTier) ? (
                    <Unlock className="w-3 h-3 text-zinc-600 shrink-0" />
                  ) : (
                    <Lock className="w-3 h-3 text-amber-500/60 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* COL 2: DYNAMIC ADAPTIVE INPUTS */}
        <main className="lg:col-span-5 p-4 md:p-6 overflow-y-auto border-r border-white/10 space-y-5">
          
          {/* Header Card */}
          <div className="p-4 rounded-xl bg-[#141415] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#0a84ff]">{activeMode.category}</span>
              <button
                onClick={handleAutoFillFromBrand}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0a84ff]/10 hover:bg-[#0a84ff]/20 text-[#0a84ff] border border-[#0a84ff]/30 rounded-lg text-xs font-semibold transition-all"
                title="Populate inputs automatically from active Brand Profile"
              >
                <Zap className="w-3 h-3" /> Auto-Fill Brand DNA
              </button>
            </div>
            <h1 className="text-lg font-bold text-white">{activeMode.name}</h1>
            <p className="text-xs text-zinc-400">{activeMode.tagline}</p>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1 font-medium">Strategic Tone</label>
              <select
                value={strategicTone}
                onChange={(e) => setStrategicTone(e.target.value)}
                className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0a84ff] outline-none"
              >
                <option>Professional & Direct</option>
                <option>Assertive & Commercial C-Level</option>
                <option>Diplomatic & Conflict De-escalating</option>
                <option>Casual, Warm & High-Touch</option>
                <option>Formal Regulatory & Audit-Compliant</option>
              </select>
            </div>

            {activeMode.fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-zinc-300 font-medium">{field.label}</label>
                  {field.brandMemoryKey && (
                    <span className="text-[9px] text-[#0a84ff] font-mono flex items-center gap-1">
                      <Briefcase className="w-2.5 h-2.5" /> Memory Linked
                    </span>
                  )}
                </div>

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={formValues[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-[#0a84ff] outline-none"
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    rows={3}
                    value={formValues[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-[#0a84ff] outline-none resize-none"
                  />
                )}

                {field.type === 'select' && (
                  <select
                    value={formValues[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0a84ff] outline-none"
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            <button
              onClick={handleSynthesizeEmail}
              disabled={isSynthesizing || generationsUsed >= maxGenerations}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#0a84ff] hover:bg-[#0070e0] text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isSynthesizing ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing via Groq LPU (~780ms)...</span>
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

        {/* COL 3: OUTPUT & DELIVERABILITY */}
        <aside className="lg:col-span-4 p-4 md:p-6 bg-[#0a0a0b]/40 flex flex-col h-full overflow-y-auto space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-[#bf5af2] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Output Synthesis
              </span>
              {generatedDraft && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyClipboard}
                    className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#30d158]" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button onClick={() => setGeneratedDraft('')} className="p-1 hover:text-red-400 text-zinc-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <textarea
              rows={12}
              value={generatedDraft}
              onChange={(e) => setGeneratedDraft(e.target.value)}
              placeholder="Synthesized email will appear here..."
              className="w-full bg-[#141415] border border-white/10 rounded-xl p-3 text-xs font-mono leading-relaxed text-zinc-200 placeholder-zinc-600 focus:border-[#bf5af2] outline-none resize-y"
            />
          </div>

          {/* Deliverability Auditor */}
          {generatedDraft && (
            <div className="p-3.5 rounded-xl bg-[#141415] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#30d158]" /> Deliverability Audit
                </span>
                <span className={`text-xs font-mono font-bold ${
                  deliverabilityAudit.score >= 90 ? 'text-[#30d158]' :
                  deliverabilityAudit.score >= 70 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {deliverabilityAudit.score}%
                </span>
              </div>

              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${deliverabilityAudit.score >= 90 ? 'bg-[#30d158]' : deliverabilityAudit.score >= 70 ? 'bg-amber-400' : 'bg-red-500'}`}
                  style={{ width: `${deliverabilityAudit.score}%` }}
                />
              </div>

              {deliverabilityAudit.issues.length > 0 ? (
                <div className="space-y-1">
                  {deliverabilityAudit.issues.map((iss, i) => (
                    <p key={i} className="text-[10px] text-amber-300 flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5 text-amber-400" />
                      <span>{iss}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-[#30d158] flex items-center gap-1">
                  <Check className="w-3 h-3" /> No high-risk spam triggers found.
                </p>
              )}
            </div>
          )}

          {/* History */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Session Drafts ({historyItems.length})
            </span>
            <div className="space-y-1.5">
              {historyItems.slice(0, 5).map(item => (
                <div
                  key={item.id}
                  onClick={() => setGeneratedDraft(item.draft)}
                  className="p-2.5 bg-[#141415] border border-white/5 hover:border-[#0a84ff]/40 rounded-xl cursor-pointer text-xs"
                >
                  <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                    <span className="font-semibold text-white">{item.modeName}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <p className="text-zinc-500 line-clamp-1 font-mono text-[11px]">{item.draft}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ==================================================== */}
      {/* BRAND MEMORY SLIDE-OVER DRAWER / MODAL */}
      {/* ==================================================== */}
      {isBrandDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-[#0e0e10] border-l border-white/10 h-full flex flex-col p-6 overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0a84ff]" />
                <div>
                  <h2 className="text-base font-bold text-white">Enterprise Brand Memory</h2>
                  <p className="text-xs text-zinc-400">Save company DNA once; inject across all 30 channels.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsBrandDrawerOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Selector Pills */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Select Active Profile</label>
              <div className="grid grid-cols-2 gap-2">
                {brandProfiles.map(b => (
                  <button
                    key={b.id}
                    onClick={() => handleSelectActiveBrand(b.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      b.isActive 
                        ? 'bg-[#0a84ff]/10 border-[#0a84ff] text-white shadow-md' 
                        : 'bg-[#141415] border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold truncate">{b.profileName}</span>
                      {b.isActive && <CheckSquare className="w-3.5 h-3.5 text-[#0a84ff]" />}
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate">{b.companyName}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Editing Form */}
            {editingBrand && (
              <div className="space-y-4 pt-2 border-t border-white/10">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Profile Nickname</label>
                    <input
                      type="text"
                      value={editingBrand.profileName}
                      onChange={(e) => setEditingBrand({ ...editingBrand, profileName: e.target.value })}
                      className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0a84ff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Company / Brand Name *</label>
                    <input
                      type="text"
                      value={editingBrand.companyName}
                      onChange={(e) => setEditingBrand({ ...editingBrand, companyName: e.target.value })}
                      className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0a84ff] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Industry / Vertical</label>
                    <input
                      type="text"
                      value={editingBrand.industry}
                      onChange={(e) => setEditingBrand({ ...editingBrand, industry: e.target.value })}
                      className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0a84ff] outline-none"
                      placeholder="e.g. Fintech, SaaS"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Website URL</label>
                    <input
                      type="text"
                      value={editingBrand.websiteUrl}
                      onChange={(e) => setEditingBrand({ ...editingBrand, websiteUrl: e.target.value })}
                      className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0a84ff] outline-none"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Elevator Pitch / Value Proposition</label>
                  <textarea
                    rows={2}
                    value={editingBrand.elevatorPitch}
                    onChange={(e) => setEditingBrand({ ...editingBrand, elevatorPitch: e.target.value })}
                    className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0a84ff] outline-none resize-none"
                    placeholder="What do you build and who does it help?"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Ideal Customer Profile (ICP)</label>
                  <input
                    type="text"
                    value={editingBrand.icp}
                    onChange={(e) => setEditingBrand({ ...editingBrand, icp: e.target.value })}
                    className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0a84ff] outline-none"
                    placeholder="e.g. CTOs, Growth Leads, Real Estate Agents"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Sender Full Name</label>
                    <input
                      type="text"
                      value={editingBrand.senderName}
                      onChange={(e) => setEditingBrand({ ...editingBrand, senderName: e.target.value })}
                      className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0a84ff] outline-none"
                      placeholder="e.g. Sarah Vance"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Sender Title</label>
                    <input
                      type="text"
                      value={editingBrand.senderTitle}
                      onChange={(e) => setEditingBrand({ ...editingBrand, senderTitle: e.target.value })}
                      className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0a84ff] outline-none"
                      placeholder="e.g. VP Commercial Growth"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Proof Points & Credibility</label>
                  <input
                    type="text"
                    value={editingBrand.proofPoints}
                    onChange={(e) => setEditingBrand({ ...editingBrand, proofPoints: e.target.value })}
                    className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0a84ff] outline-none"
                    placeholder="e.g. SOC2 Type II, 99.99% uptime, 1,000+ enterprise clients"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Primary Call-to-Action / Booking Link</label>
                  <input
                    type="text"
                    value={editingBrand.primaryCta}
                    onChange={(e) => setEditingBrand({ ...editingBrand, primaryCta: e.target.value })}
                    className="w-full bg-[#141415] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#0a84ff] outline-none"
                    placeholder="e.g. cal.com/your-team/15min"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleSaveBrandProfile}
                    className="flex-1 py-2.5 bg-[#0a84ff] hover:bg-[#0070e0] rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Brand DNA
                  </button>
                  <button
                    onClick={() => {
                      const newId = 'custom-' + Date.now();
                      const blank: BrandProfile = {
                        id: newId,
                        profileName: 'New Client / Brand',
                        companyName: '',
                        industry: '',
                        websiteUrl: '',
                        elevatorPitch: '',
                        icp: '',
                        brandVoice: 'Professional',
                        primaryCta: '',
                        senderName: '',
                        senderTitle: '',
                        proofPoints: '',
                        isActive: true
                      };
                      setEditingBrand(blank);
                    }}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-zinc-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2026 GLENT GLOBAL ENTERPRISES FOOTER */}
      {/* ==================================================== */}
      <footer className="border-t border-white/10 bg-[#0a0a0b] py-5 px-4 md:px-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md bg-[#0a84ff] flex items-center justify-center text-[10px] font-bold text-white">
              G
            </div>
            <span>&copy; 2026 Glent Global Enterprises. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setIsBrandDrawerOpen(true)} className="hover:text-white transition-colors flex items-center gap-1 text-[#0a84ff]">
              <Building2 className="w-3 h-3" /> Brand Memory
            </button>
            <button onClick={() => router.push('/glent/passport')} className="hover:text-white transition-colors">
              Sovereign Passport
            </button>
            <button onClick={() => router.push('/glent/philosophy')} className="hover:text-white transition-colors">
              Philosophy
            </button>
            <a href="mailto:help@writeyouremail.com" className="hover:text-white transition-colors">
              help@writeyouremail.com
            </a>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
            <span>LPU ENGINE: ACTIVE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}