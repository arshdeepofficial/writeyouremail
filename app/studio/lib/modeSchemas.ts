// app/studio/lib/modeSchemas.ts

export type PlanTier = "free" | "starter" | "growth" | "enterprise";

export type FieldType = "text" | "textarea" | "select";

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
}

export interface ModeConfig {
  id: string;
  name: string;
  iconName: string; // We will map this to Lucide icons in the UI
  tier: PlanTier;
  description: string;
  fields: FormField[];
}

export const MODES: ModeConfig[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ─── STARTER TIER ($19/mo) ───
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "create",
    name: "Cold Email",
    iconName: "Mail",
    tier: "starter",
    description: "High-converting B2B cold outreach.",
    fields: [
      { id: "prospect_name", label: "Prospect Name", type: "text", placeholder: "e.g. John Doe", required: true },
      { id: "company", label: "Target Company", type: "text", placeholder: "e.g. Acme Corp", required: true },
      { id: "value_prop", label: "Value Proposition", type: "textarea", placeholder: "How do you help them?", required: true },
      { id: "call_to_action", label: "Call to Action", type: "text", placeholder: "e.g. 15 min call next Tuesday?", required: true },
      { id: "tone", label: "Tone", type: "select", options: [
        { label: "Professional & Direct", value: "professional" },
        { label: "Casual & Friendly", value: "casual" },
        { label: "Aggressive & Salesy", value: "aggressive" }
      ], required: true }
    ]
  },
  {
    id: "polish",
    name: "Magic Polish",
    iconName: "Sparkles",
    tier: "starter",
    description: "Rewrite your draft for maximum impact.",
    fields: [
      { id: "draft", label: "Your Draft", type: "textarea", placeholder: "Paste your messy email here...", required: true },
      { id: "goal", label: "Goal", type: "text", placeholder: "e.g. Sound more confident and concise", required: true }
    ]
  },
  {
    id: "reply",
    name: "Objection Reply",
    iconName: "MessageSquareReply",
    tier: "starter",
    description: "Overcome 'too expensive' or 'bad timing'.",
    fields: [
      { id: "client_message", label: "Client's Objection", type: "textarea", placeholder: "Paste their response...", required: true },
      { id: "objection_type", label: "Objection Type", type: "select", options: [
        { label: "Price / Budget", value: "price" },
        { label: "Timing / Not now", value: "timing" },
        { label: "Competitor", value: "competitor" },
        { label: "Lack of Trust", value: "trust" }
      ], required: true },
      { id: "rebuttal_angle", label: "Your Rebuttal Angle", type: "text", placeholder: "e.g. Highlight ROI over 6 months", required: true }
    ]
  },
  {
    id: "winback",
    name: "Lead Win-Back",
    iconName: "RefreshCw",
    tier: "starter",
    description: "Re-engage ghosted or lost leads.",
    fields: [
      { id: "prospect_name", label: "Prospect Name", type: "text", placeholder: "e.g. Sarah", required: true },
      { id: "last_interaction", label: "Last Interaction", type: "text", placeholder: "e.g. Demo call 3 months ago", required: true },
      { id: "new_update", label: "New Update / Hook", type: "textarea", placeholder: "e.g. We just launched a new feature they wanted", required: true }
    ]
  },
  {
    id: "inbound",
    name: "Inbound Follow-Up",
    iconName: "Inbox",
    tier: "starter",
    description: "Warm response to inbound inquiries.",
    fields: [
      { id: "lead_source", label: "Lead Source", type: "text", placeholder: "e.g. Website Pricing Form", required: true },
      { id: "inquiry_details", label: "What they asked", type: "textarea", placeholder: "e.g. Looking for enterprise features", required: true },
      { id: "next_steps", label: "Proposed Next Steps", type: "text", placeholder: "e.g. Book a discovery call", required: true }
    ]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ─── GROWTH TIER ($39/mo) ───
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "linkedin",
    name: "LinkedIn DM",
    iconName: "Linkedin", // Will map to a generic user/network icon if brand icon missing
    tier: "growth",
    description: "Short, punchy LinkedIn connection messages.",
    fields: [
      { id: "prospect_name", label: "Name", type: "text", placeholder: "e.g. Mike", required: true },
      { id: "common_ground", label: "Common Ground", type: "text", placeholder: "e.g. Both attended SaaStr 2023", required: true },
      { id: "pitch", label: "Soft Pitch", type: "textarea", placeholder: "e.g. Scaling engineering teams", required: true }
    ]
  },
  {
    id: "twitter",
    name: "Twitter / X DM",
    iconName: "Twitter",
    tier: "growth",
    description: "Casual, high-status DMs for Twitter.",
    fields: [
      { id: "handle", label: "Twitter Handle", type: "text", placeholder: "e.g. @elonmusk", required: true },
      { id: "recent_tweet", label: "Reference Recent Tweet", type: "textarea", placeholder: "e.g. Loved your thread on AI agents...", required: true },
      { id: "ask", label: "The Ask", type: "text", placeholder: "e.g. Quick question about your tech stack", required: true }
    ]
  },
  {
    id: "whatsapp",
    name: "WhatsApp Sequence",
    iconName: "MessageCircle",
    tier: "growth",
    description: "Conversational messages for WhatsApp.",
    fields: [
      { id: "prospect_name", label: "Name", type: "text", placeholder: "e.g. David", required: true },
      { id: "context", label: "Context", type: "text", placeholder: "e.g. Met at the real estate conference", required: true },
      { id: "offer", label: "Quick Offer", type: "textarea", placeholder: "e.g. Free property valuation", required: true }
    ]
  },
  {
    id: "vsl_script",
    name: "Loom VSL Script",
    iconName: "Video",
    tier: "growth",
    description: "Video Sales Letter scripts for Loom.",
    fields: [
      { id: "target_audience", label: "Target Audience", type: "text", placeholder: "e.g. E-commerce founders", required: true },
      { id: "pain_point", label: "Main Pain Point", type: "text", placeholder: "e.g. High cart abandonment", required: true },
      { id: "solution", label: "Your Solution", type: "textarea", placeholder: "e.g. AI-driven SMS recovery", required: true },
      { id: "proof", label: "Social Proof", type: "text", placeholder: "e.g. Increased revenue by 20% for Brand X", required: true }
    ]
  },
  {
    id: "proposal",
    name: "Upwork Proposal",
    iconName: "Briefcase",
    tier: "growth",
    description: "Winning cover letters for freelancers.",
    fields: [
      { id: "job_description", label: "Job Description Snippet", type: "textarea", placeholder: "Paste key requirements...", required: true },
      { id: "my_experience", label: "My Relevant Experience", type: "textarea", placeholder: "e.g. Built 3 similar React apps", required: true },
      { id: "unique_angle", label: "Why Me?", type: "text", placeholder: "e.g. I can start immediately and deliver in 48h", required: true }
    ]
  },
  {
    id: "telegram",
    name: "Telegram Tech DM",
    iconName: "Send",
    tier: "growth",
    description: "Crypto & Tech focused Telegram outreach.",
    fields: [
      { id: "project_name", label: "Target Project", type: "text", placeholder: "e.g. DeFi Protocol X", required: true },
      { id: "value_add", label: "Your Value Add", type: "textarea", placeholder: "e.g. Smart contract auditing services", required: true }
    ]
  },
  {
    id: "instagram",
    name: "Instagram DM",
    iconName: "Instagram",
    tier: "growth",
    description: "Visual & influencer focused outreach.",
    fields: [
      { id: "influencer_niche", label: "Their Niche", type: "text", placeholder: "e.g. Fitness & Wellness", required: true },
      { id: "collaboration_type", label: "Collab Type", type: "select", options: [
        { label: "Product Seeding (Free Gift)", value: "seeding" },
        { label: "Paid Sponsorship", value: "paid" },
        { label: "Affiliate Partnership", value: "affiliate" }
      ], required: true },
      { id: "brand_vibe", label: "Brand Vibe", type: "text", placeholder: "e.g. Premium, minimalist", required: true }
    ]
  },
  {
    id: "sequence",
    name: "3-Step Sequence",
    iconName: "ListOrdered",
    tier: "growth",
    description: "Generate a full 3-drip email campaign.",
    fields: [
      { id: "product", label: "Product/Service", type: "text", placeholder: "e.g. SaaS CRM", required: true },
      { id: "day_1", label: "Email 1 Angle", type: "text", placeholder: "e.g. Introduction & Value", required: true },
      { id: "day_3", label: "Email 2 Angle", type: "text", placeholder: "e.g. Case Study / Proof", required: true },
      { id: "day_7", label: "Email 3 Angle", type: "text", placeholder: "e.g. Breakup / Final Offer", required: true }
    ]
  },
  {
    id: "slack_dm",
    name: "Slack Connect",
    iconName: "Hash",
    tier: "growth",
    description: "B2B Slack community networking.",
    fields: [
      { id: "community_name", label: "Slack Community", type: "text", placeholder: "e.g. RevGenius", required: true },
      { id: "prospect_problem", label: "What they asked", type: "textarea", placeholder: "e.g. They asked for outbound tool recs", required: true },
      { id: "helpful_answer", label: "Your Helpful Answer", type: "textarea", placeholder: "e.g. Share a quick tip, then soft pitch", required: true }
    ]
  },
  {
    id: "discord",
    name: "Discord DM",
    iconName: "Gamepad2",
    tier: "growth",
    description: "Web3/Gaming Discord community outreach.",
    fields: [
      { id: "server_name", label: "Server Name", type: "text", placeholder: "e.g. Bored Ape Yacht Club", required: true },
      { id: "role", label: "Your Role", type: "text", placeholder: "e.g. 3D Artist", required: true },
      { id: "pitch", label: "Pitch", type: "textarea", placeholder: "e.g. Offering custom 3D renders", required: true }
    ]
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ─── ENTERPRISE TIER ($79/mo) ───
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "cold_call",
    name: "Cold Call Script",
    iconName: "PhoneCall",
    tier: "enterprise",
    description: "Opener, pitch, and objection handling script.",
    fields: [
      { id: "icp", label: "Ideal Customer Profile", type: "text", placeholder: "e.g. VP of Sales", required: true },
      { id: "hook", label: "Pattern Interrupt / Hook", type: "text", placeholder: "e.g. I know I'm an interruption...", required: true },
      { id: "value_prop", label: "Value Prop", type: "textarea", placeholder: "e.g. We save reps 5 hours a week", required: true }
    ]
  },
  {
    id: "sms_sequence",
    name: "SMS Sequence",
    iconName: "Smartphone",
    tier: "enterprise",
    description: "High-compliance, short SMS marketing.",
    fields: [
      { id: "campaign_goal", label: "Campaign Goal", type: "text", placeholder: "e.g. Flash Sale Reminder", required: true },
      { id: "discount", label: "Offer / Discount", type: "text", placeholder: "e.g. 20% OFF with code FAST", required: true },
      { id: "opt_out", label: "Opt-Out Required?", type: "select", options: [
        { label: "Yes (Reply STOP)", value: "yes" },
        { label: "No (Internal)", value: "no" }
      ], required: true }
    ]
  },
  {
    id: "reddit_dm",
    name: "Reddit DM",
    iconName: "MessageCircle", // Reddit icon fallback
    tier: "enterprise",
    description: "Anti-spam, value-first Reddit outreach.",
    fields: [
      { id: "subreddit", label: "Subreddit", type: "text", placeholder: "e.g. r/Entrepreneur", required: true },
      { id: "post_context", label: "Their Post Context", type: "textarea", placeholder: "e.g. They complained about Stripe fees", required: true },
      { id: "solution", label: "Your Solution", type: "text", placeholder: "e.g. A merchant of record alternative", required: true }
    ]
  },
  {
    id: "threads_dm",
    name: "Threads DM",
    iconName: "AtSign",
    tier: "enterprise",
    description: "Meta Threads conversational outreach.",
    fields: [
      { id: "topic", label: "Thread Topic", type: "text", placeholder: "e.g. Future of remote work", required: true },
      { id: "angle", label: "Conversation Starter", type: "textarea", placeholder: "e.g. Agree with their point, add a new perspective", required: true }
    ]
  },
  {
    id: "direct_mail",
    name: "Direct Mail Letter",
    iconName: "Mailbox",
    tier: "enterprise",
    description: "Physical B2B letters that bypass the inbox.",
    fields: [
      { id: "recipient_title", label: "Recipient Title", type: "text", placeholder: "e.g. Chief Marketing Officer", required: true },
      { id: "lumpy_mail", label: "Physical Item Included?", type: "text", placeholder: "e.g. A coffee gift card", required: false },
      { id: "core_message", label: "Core Message", type: "textarea", placeholder: "e.g. Let's discuss your Q4 ad spend over coffee", required: true }
    ]
  },
  {
    id: "csv_bulk",
    name: "CSV Bulk Mapper",
    iconName: "Table",
    tier: "enterprise",
    description: "Spintax generation for bulk CSV merging.",
    fields: [
      { id: "variables", label: "Your CSV Variables", type: "text", placeholder: "e.g. {{first_name}}, {{company}}", required: true },
      { id: "base_template", label: "Base Template", type: "textarea", placeholder: "e.g. Hi {{first_name}}, noticed {{company}}...", required: true },
      { id: "spintax_level", label: "Spintax Complexity", type: "select", options: [
        { label: "Light (Subject lines only)", value: "light" },
        { label: "Heavy (Full body variation)", value: "heavy" }
      ], required: true }
    ]
  },
  {
    id: "tiktok",
    name: "TikTok Pitch",
    iconName: "Music",
    tier: "enterprise",
    description: "Gen-Z focused, short-form creator pitches.",
    fields: [
      { id: "creator_name", label: "Creator Name", type: "text", placeholder: "e.g. Charli", required: true },
      { id: "trend", label: "Reference Trend", type: "text", placeholder: "e.g. 'Get Ready With Me'", required: true },
      { id: "offer", label: "Sponsorship Offer", type: "textarea", placeholder: "e.g. $500 + free clothing haul", required: true }
    ]
  },
  {
    id: "podcast",
    name: "Podcast Pitch",
    iconName: "Mic",
    tier: "enterprise",
    description: "Get booked as a guest on top podcasts.",
    fields: [
      { id: "podcast_name", label: "Podcast Name", type: "text", placeholder: "e.g. My First Million", required: true },
      { id: "host_name", label: "Host Name(s)", type: "text", placeholder: "e.g. Sam & Shaan", required: true },
      { id: "my_expertise", label: "My Unique Story", type: "textarea", placeholder: "e.g. Bootstrapped a SaaS to $1M in 12 months", required: true },
      { id: "topic_ideas", label: "3 Topic Ideas", type: "textarea", placeholder: "e.g. 1. SEO hacks, 2. Hiring offshore, 3. Failing fast", required: true }
    ]
  },
  {
    id: "voicemail_drop",
    name: "Ringless Voicemail",
    iconName: "Voicemail",
    tier: "enterprise",
    description: "Natural-sounding scripts for RVM drops.",
    fields: [
      { id: "caller_identity", label: "Who are you?", type: "text", placeholder: "e.g. Alex from Acme Real Estate", required: true },
      { id: "reason_for_call", label: "Reason for Call", type: "textarea", placeholder: "e.g. Saw you listed your house on Zillow", required: true },
      { id: "callback_number", label: "Call Back Number", type: "text", placeholder: "e.g. 555-0192", required: true }
    ]
  },
  {
    id: "facebook_dm",
    name: "FB Messenger",
    iconName: "MessageSquare", // FB icon fallback
    tier: "enterprise",
    description: "B2C and local business Facebook outreach.",
    fields: [
      { id: "business_name", label: "Business Name", type: "text", placeholder: "e.g. Joe's Plumbing", required: true },
      { id: "observation", label: "Observation", type: "text", placeholder: "e.g. Noticed you don't have a booking widget", required: true },
      { id: "offer", label: "Offer", type: "textarea", placeholder: "e.g. We can install one for free this week", required: true }
    ]
  },
  {
    id: "signal_vip",
    name: "Signal / VIP DM",
    iconName: "Shield",
    tier: "enterprise",
    description: "Highly confidential, executive-level outreach.",
    fields: [
      { id: "executive_title", label: "Executive Title", type: "text", placeholder: "e.g. CEO / Founder", required: true },
      { id: "confidential_topic", label: "Topic", type: "text", placeholder: "e.g. M&A Opportunity", required: true },
      { id: "trust_builder", label: "Trust Builder", type: "textarea", placeholder: "e.g. Referred by mutual investor X", required: true }
    ]
  },
  {
    id: "recruiter",
    name: "Talent Recruiter",
    iconName: "Users",
    tier: "enterprise",
    description: "Headhunting messages for passive candidates.",
    fields: [
      { id: "candidate_role", label: "Candidate Current Role", type: "text", placeholder: "e.g. Senior Backend Engineer", required: true },
      { id: "company_selling_point", label: "Why your company?", type: "textarea", placeholder: "e.g. Pre-IPO, remote-first, $200k base", required: true },
      { id: "tech_stack", label: "Tech Stack / Skills", type: "text", placeholder: "e.g. Node.js, AWS, PostgreSQL", required: true }
    ]
  },
  {
    id: "event_pitch",
    name: "Conference Pitch",
    iconName: "Calendar",
    tier: "enterprise",
    description: "Pre-conference networking messages.",
    fields: [
      { id: "event_name", label: "Event Name", type: "text", placeholder: "e.g. Web Summit 2024", required: true },
      { id: "prospect_goal", label: "Assumed Prospect Goal", type: "text", placeholder: "e.g. Raising Series A", required: true },
      { id: "meeting_proposal", label: "Meeting Proposal", type: "textarea", placeholder: "e.g. Coffee at the VIP lounge on Day 2", required: true }
    ]
  },
  {
    id: "abm",
    name: "ABM Briefing",
    iconName: "Target",
    tier: "enterprise",
    description: "Account-Based Marketing hyper-personalized email.",
    fields: [
      { id: "target_account", label: "Target Account", type: "text", placeholder: "e.g. Microsoft", required: true },
      { id: "company_news", label: "Recent Company News", type: "textarea", placeholder: "e.g. They just acquired an AI startup", required: true },
      { id: "our_solution", label: "How we fit in", type: "textarea", placeholder: "e.g. Our compliance API secures AI data", required: true }
    ]
  },
  {
    id: "wechat",
    name: "WeChat B2B",
    iconName: "MessageCircle", // WeChat fallback
    tier: "enterprise",
    description: "Cross-border B2B messaging tailored for WeChat.",
    fields: [
      { id: "partner_name", label: "Partner Name", type: "text", placeholder: "e.g. Mr. Wang", required: true },
      { id: "industry", label: "Industry", type: "text", placeholder: "e.g. Electronics Manufacturing", required: true },
      { id: "proposal", label: "Partnership Proposal", type: "textarea", placeholder: "e.g. Sourcing 10,000 units of component X", required: true },
      { id: "cultural_tone", label: "Cultural Tone", type: "select", options: [
        { label: "Highly Formal & Respectful", value: "formal" },
        { label: "Modern Business", value: "modern" }
      ], required: true }
    ]
  }
];