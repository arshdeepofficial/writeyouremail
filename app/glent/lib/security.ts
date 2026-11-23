// Comprehensive blacklist of known disposable & temporary email providers
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', 'temp-mail.org', '10minutemail.com', '10minutemail.net',
  'guerrillamail.com', 'guerrillamailblock.com', 'sharklasers.com', 'yopmail.com', 'yopmail.fr',
  'trashmail.com', 'trashmail.net', 'dispostable.com', 'getairmail.com', 'throwawaymail.com',
  'fakeinbox.com', 'mohmal.com', 'crazymailing.com', 'burnermail.io', 'generator.email',
  'inboxkitten.com', 'maildrop.cc', 'tempail.com', 'mytemp.email', 'tempinbox.com',
  'emailondeck.com', 'mintemail.com', 'dropmail.me', 'getnada.com', 'fakemailgenerator.com',
  'trashmail.me', 'armyspy.com', 'cuvox.de', 'dayrep.com', 'einrot.com', 'fleckens.hu',
  'gustr.com', 'jourrapide.com', 'rhyta.com', 'superrito.com', 'teleworm.us', 'chacuo.net',
  'discard.email', 'disposablemail.com', 'tempmailaddress.com', 'spambog.com', 'spambox.us'
]);

// Trusted major consumer email providers
export const TRUSTED_CONSUMER_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'yahoo.com',
  'ymail.com',
  'rocketmail.com',
  'zoho.com',
  'zohomail.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'apple.com',
  'proton.me',
  'protonmail.com',
  'aol.com'
]);

/**
 * Validates whether an email belongs to a trusted provider or legitimate corporate domain.
 * Strictly blocks disposable and temporary email addresses.
 */
export function validateSovereignEmail(email: string): { isValid: boolean; error?: string; isCorporate?: boolean } {
  if (!email || !email.includes('@')) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2 || !parts[1].includes('.')) {
    return { isValid: false, error: 'Invalid email domain structure.' };
  }

  const domain = parts[1];

  // 1. Strictly Reject Known Disposable / Temp Mail Services
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: 'Temporary and disposable email addresses are strictly blocked by Glent Global Security. Please use Gmail, Outlook, Yahoo, Zoho, Apple, Proton, or your official company work email.'
    };
  }

  // 2. Check if it is an approved major provider
  if (TRUSTED_CONSUMER_DOMAINS.has(domain)) {
    return { isValid: true, isCorporate: false };
  }

  // 3. Otherwise, check if it's a legitimate corporate work domain
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];

  // Reject suspicious top-level domains often used by disposable scripts
  const suspiciousTLDs = ['tk', 'ml', 'ga', 'cf', 'gq', 'top', 'work', 'click'];
  if (suspiciousTLDs.includes(tld)) {
    return {
      isValid: false,
      error: 'Security alert: Free/high-risk domain extensions (.tk, .cf, .gq) are restricted. Please register using a verified corporate or consumer email.'
    };
  }

  return { isValid: true, isCorporate: true };
}

/**
 * Client-Side Rate-Limiting & Brute-Force Lockout Manager
 */
const STORAGE_KEY = 'glent_auth_rate_limit';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 Minutes

export interface RateLimitStatus {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
}

export function getRateLimitStatus(): RateLimitStatus {
  if (typeof window === 'undefined') {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };

    const data = JSON.parse(raw);
    const now = Date.now();

    if (data.lockoutUntil && data.lockoutUntil > now) {
      const remainingSeconds = Math.ceil((data.lockoutUntil - now) / 1000);
      return { isLocked: true, remainingSeconds, attemptsLeft: 0 };
    }

    // Lockout has expired; reset if needed
    if (data.lockoutUntil && data.lockoutUntil <= now) {
      localStorage.removeItem(STORAGE_KEY);
      return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
    }

    const attempts = data.attempts || 0;
    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsLeft: Math.max(0, MAX_ATTEMPTS - attempts)
    };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
  }
}

export function recordFailedAuthAttempt(): RateLimitStatus {
  if (typeof window === 'undefined') {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let attempts = 1;
    const now = Date.now();

    if (raw) {
      const data = JSON.parse(raw);
      attempts = (data.attempts || 0) + 1;
    }

    if (attempts >= MAX_ATTEMPTS) {
      const lockoutUntil = now + LOCKOUT_DURATION_MS;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ attempts, lockoutUntil }));
      return { isLocked: true, remainingSeconds: LOCKOUT_DURATION_MS / 1000, attemptsLeft: 0 };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ attempts }));
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS - attempts };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
  }
}

export function resetAuthAttempts(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Calculates password security entropy (Weak, Moderate, Strong, Enterprise)
 */
export function evaluatePasswordEntropy(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: 'None', color: 'bg-neutral-800' };

  let score = 0;
  if (pwd.length >= 8) score += 25;
  if (pwd.length >= 12) score += 15;
  if (/[A-Z]/.test(pwd)) score += 20;
  if (/[0-9]/.test(pwd)) score += 20;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 20;

  if (score < 40) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score < 70) return { score, label: 'Moderate', color: 'bg-amber-500' };
  if (score < 90) return { score, label: 'Strong', color: 'bg-blue-500' };
  return { score: 100, label: 'Military-Grade', color: 'bg-emerald-400' };
}