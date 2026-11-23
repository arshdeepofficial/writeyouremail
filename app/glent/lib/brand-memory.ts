export interface BrandProfile {
  id: string;
  profileName: string;
  companyName: string;
  industry: string;
  websiteUrl: string;
  elevatorPitch: string;
  icp: string; // Ideal Customer Profile
  brandVoice: string;
  primaryCta: string;
  senderName: string;
  senderTitle: string;
  proofPoints: string;
  isActive: boolean;
}

export const DEFAULT_BRAND_PRESETS: BrandProfile[] = [
  {
    id: 'preset-b2b-saas',
    profileName: 'B2B Enterprise SaaS',
    companyName: 'ScaleFlow Systems',
    industry: 'Cloud Infrastructure / DevOps',
    websiteUrl: 'https://scaleflow.io',
    elevatorPitch: 'Sub-second telemetry pipeline that eliminates cloud egress waste by 38% without code changes.',
    icp: 'VPs of Engineering, CTOs, and Platform Leads at Series A-D scaling companies.',
    brandVoice: 'Authoritative, engineering-focused, direct, zero fluff or hyperbole.',
    primaryCta: 'https://scaleflow.io/audit',
    senderName: 'David Chen',
    senderTitle: 'Head of Solutions Architecture',
    proofPoints: 'SOC2 Type II certified, 99.99% uptime SLA, powering 4.2B events daily.',
    isActive: true
  },
  {
    id: 'preset-agency',
    profileName: 'Growth Marketing Agency',
    companyName: 'Apex Demand Group',
    industry: 'B2B Outbound & RevOps',
    websiteUrl: 'https://apexdemand.co',
    elevatorPitch: 'Turn cold outbound into predictable pipeline through deterministic inbox placement and LPU copywriting.',
    icp: 'B2B Founders and Heads of Revenue with $10k+ Average Contract Value.',
    brandVoice: 'Commercial, confident, metric-driven, consultative.',
    primaryCta: 'https://cal.com/apexdemand/discovery',
    senderName: 'Elena Rostova',
    senderTitle: 'Managing Partner',
    proofPoints: 'Generated $14M in verified enterprise pipeline in 2025 across 80+ clients.',
    isActive: false
  }
];

const STORAGE_KEY = 'glent_brand_memory_profiles';

export const loadLocalBrandProfiles = (): BrandProfile[] => {
  if (typeof window === 'undefined') return DEFAULT_BRAND_PRESETS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BRAND_PRESETS));
    return DEFAULT_BRAND_PRESETS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_BRAND_PRESETS;
  }
};

export const saveLocalBrandProfiles = (profiles: BrandProfile[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

export const getActiveBrandProfile = (profiles: BrandProfile[]): BrandProfile => {
  return profiles.find(p => p.isActive) || profiles[0] || DEFAULT_BRAND_PRESETS[0];
};