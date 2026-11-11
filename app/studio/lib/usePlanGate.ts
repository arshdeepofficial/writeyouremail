// app/studio/lib/usePlanGate.ts
import { PlanTier } from './modeSchemas';

// 1. Define the hierarchy of tiers (higher numbers = higher access)
const TIER_WEIGHTS: Record<PlanTier, number> = {
  free: 0,
  starter: 1,
  growth: 2,
  enterprise: 3,
};

// 2. Define usage limits per tier
const USAGE_LIMITS: Record<PlanTier, number> = {
  free: 5,        // 5 per day (assuming reset logic handles daily vs monthly)
  starter: 50,    // 50 per month
  growth: 999999,      // Unlimited
  enterprise: 999999,  // Unlimited
};

export function usePlanGate(
  currentTier: PlanTier, 
  currentUsage: number, 
  isGuest: boolean
) {
  
  // Check if a user's tier is high enough to access a specific mode
  const canAccessMode = (modeTierRequired: PlanTier): boolean => {
    const userWeight = TIER_WEIGHTS[currentTier];
    const requiredWeight = TIER_WEIGHTS[modeTierRequired];
    return userWeight >= requiredWeight;
  };

  // Check if the user has enough credits left to generate
  const hasCredits = (): boolean => {
    if (isGuest) {
      return currentUsage < 2; // Guest = 2 lifetime limits
    }
    
    const limit = USAGE_LIMITS[currentTier];
    return currentUsage < limit;
  };

  // Get remaining credits formatted for the UI
  const getCreditsRemainingStatus = (): string => {
    if (isGuest) return `${2 - currentUsage} guest generations remaining`;
    
    if (currentTier === 'growth' || currentTier === 'enterprise') {
      return 'Unlimited generations';
    }

    const limit = USAGE_LIMITS[currentTier];
    const remaining = Math.max(0, limit - currentUsage);
    
    if (currentTier === 'free') {
      return `${remaining}/${limit} daily generations remaining`;
    }
    
    return `${remaining}/${limit} monthly generations remaining`;
  };

  return {
    canAccessMode,
    hasCredits,
    getCreditsRemainingStatus,
    usageLimit: isGuest ? 2 : USAGE_LIMITS[currentTier]
  };
}