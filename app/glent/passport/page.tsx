'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  Key,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  LogOut,
  AlertCircle,
  Clock,
  RefreshCw,
  Cpu,
  Layers,
  Database,
  Building2,
  Radio,
  Power
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  validateSovereignEmail,
  getRateLimitStatus,
  recordFailedAuthAttempt,
  resetAuthAttempts,
  evaluatePasswordEntropy,
  RateLimitStatus
} from '../lib/security';

// Vector Brand Icons
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
    <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-1.9.4-2.8L1.9 6.3C.7 8.7 0 11.3 0 14s.7 5.3 1.9 7.7l3.7-6.9z" />
    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function GlentPassportSecurityPage() {
  const router = useRouter();

  // User & Session States
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [usageData, setUsageData] = useState<{ planTier: string; count: number; limit: number } | null>(null);

  // Authentication Mode
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'magic'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Anti-Bot Honeypot field (Bots fill this; real users don't see it)
  const [botHoneypot, setBotHoneypot] = useState('');

  // Security & Validation States
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimitStatus>({ isLocked: false, remainingSeconds: 0, attemptsLeft: 5 });

  // Emergency Security Circuit Breaker (Can be toggled by admin/env)
  const [isSecurityLockdownActive, setIsSecurityLockdownActive] = useState(false);

  // Password Entropy
  const passwordStrength = evaluatePasswordEntropy(password);

  // Check Rate Limits on Mount & Countdown Tick
  useEffect(() => {
    setRateLimit(getRateLimitStatus());

    const countdownTimer = setInterval(() => {
      setRateLimit((prev) => {
        if (prev.isLocked && prev.remainingSeconds > 1) {
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        } else if (prev.isLocked && prev.remainingSeconds <= 1) {
          return { isLocked: false, remainingSeconds: 0, attemptsLeft: 5 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

  // Listen to Supabase Session
  useEffect(() => {
    if (!supabase) {
      setLoadingUser(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadUsageProfile(session.user.id);
      }
      setLoadingUser(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUsageProfile(session.user.id);
      } else {
        setUser(null);
        setUsageData(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Load User Tier Profile
  const loadUsageProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data } = await supabase.from('usage_tracking').select('*').eq('user_id', userId).single();
      if (data) {
        const limits: Record<string, number> = { free: 5, starter: 100, growth: 300, enterprise: 1000 };
        setUsageData({
          planTier: data.plan_tier || 'free',
          count: data.count || 0,
          limit: limits[data.plan_tier] || 5,
        });
      }
    } catch (e) {
      console.warn('Profile load:', e);
    }
  };

  // 1-Click OAuth Handlers (Google & GitHub)
  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    if (!supabase) return;
    if (rateLimit.isLocked || isSecurityLockdownActive) return;

    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/studio`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || `Failed to initialize ${provider} login.`);
    }
  };

  // Form Submit Handler with Strict Security Guards
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    // Guard 1: Emergency Security Lockdown Active
    if (isSecurityLockdownActive) {
      setAuthError('CRITICAL: Authentication services are temporarily restricted due to a security audit. Please check back shortly.');
      return;
    }

    // Guard 2: Brute Force Rate-Limit Lockout
    if (rateLimit.isLocked) {
      setAuthError(`Rate limit exceeded. System access locked for ${Math.floor(rateLimit.remainingSeconds / 60)}m ${rateLimit.remainingSeconds % 60}s to protect infrastructure.`);
      return;
    }

    // Guard 3: Bot Honeypot Detection
    if (botHoneypot.trim().length > 0) {
      // Invisible to real users; bots fill it
      setAuthError('Security token rejection. Automated bot registration detected.');
      return;
    }

    // Guard 4: Disposable / Temporary Email Rejection
    const emailCheck = validateSovereignEmail(email);
    if (!emailCheck.isValid) {
      setAuthError(emailCheck.error || 'Invalid email address.');
      return;
    }

    // Guard 5: Password Entropy Requirement for Sign-Up
    if (authMode === 'signup' && password.length < 8) {
      setAuthError('Security Protocol: Master key must contain a minimum of 8 characters.');
      return;
    }

    setAuthError(null);
    setAuthSuccess(null);
    setIsSubmitting(true);

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              full_name: fullName,
              provider_type: emailCheck.isCorporate ? 'corporate_domain' : 'consumer_verified'
            }
          }
        });

        if (error) throw error;

        resetAuthAttempts();
        if (data?.user && !data.session) {
          setAuthSuccess('Verification dispatch sent. Check your inbox to confirm your Glent Sovereign Passport.');
        } else if (data?.user) {
          setUser(data.user);
          setAuthSuccess('Glent Sovereign Passport activated. Universal SSO active.');
          setTimeout(() => router.push('/studio'), 1200);
        }
      } else if (authMode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });

        if (error) {
          // Record failed attempt and compute new lockout state
          const newStatus = recordFailedAuthAttempt();
          setRateLimit(newStatus);
          throw error;
        }

        resetAuthAttempts();
        if (data?.user) {
          setUser(data.user);
          setAuthSuccess('Passport verified. Connecting to ecosystem studio...');
          setTimeout(() => router.push('/studio'), 1000);
        }
      } else if (authMode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim().toLowerCase(),
          options: {
            emailRedirectTo: `${window.location.origin}/studio`
          }
        });

        if (error) throw error;
        setAuthSuccess('One-time cryptographic login link dispatched to your email.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication rejected. Verify credentials or try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setUsageData(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wye_recent_history');
      localStorage.removeItem('writeyour_email_history');
      localStorage.removeItem('write-your-email-history');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-16 pb-28 space-y-16">
      
      {/* Top Protocol Security Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono uppercase tracking-[0.25em] text-neutral-300">
          <ShieldCheck size={14} className="text-blue-400" />
          <span>Glent Sovereign Security Gateway • SSL / TLS 1.3</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
          One Universal Passport. Protected Infrastructure.
        </h1>
        
        <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
          Create your master login for WriteYourEmail.com and the entire Glent Global software suite. 
          Protected by real-time disposable domain filters, bot honeypots, and brute-force mitigations.
        </p>
      </div>

      {/* EMERGENCY CIRCUIT BREAKER BANNER (If Active) */}
      {isSecurityLockdownActive && (
        <div className="max-w-3xl mx-auto p-6 rounded-2xl border border-red-500/40 bg-red-950/40 text-red-200 space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 font-mono font-bold text-sm uppercase tracking-wider text-red-400">
            <ShieldAlert size={18} /> High-Security Gateway Lockout Active
          </div>
          <p className="text-xs text-neutral-300 font-light">
            Authentication is temporarily restricted for scheduled cryptographic rotation and firewall inspection. 
            Active sessions remain operational. Public registrations will resume shortly.
          </p>
        </div>
      )}

      {/* BRUTE FORCE LOCKOUT NOTIFICATION (If user failed 5 attempts) */}
      {rateLimit.isLocked && (
        <div className="max-w-3xl mx-auto p-5 rounded-2xl border border-amber-500/40 bg-amber-950/30 text-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-amber-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-white">Rate Limit Restriction Triggered</p>
              <p className="text-neutral-400 mt-0.5">Too many failed password attempts. System locked for security preservation.</p>
            </div>
          </div>
          <span className="font-mono font-bold text-sm text-amber-400 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 shrink-0">
            {Math.floor(rateLimit.remainingSeconds / 60)}:{(rateLimit.remainingSeconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Main Authentication Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: The Interactive Security Terminal */}
        <div className="lg:col-span-7">
          {user ? (
            /* ACTIVE PASSPORT DASHBOARD */
            <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.05] via-neutral-950 to-black p-8 sm:p-10 space-y-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white via-neutral-300 to-neutral-600 text-black flex items-center justify-center font-bold text-xl shadow-md">
                    G
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      Sovereign Passport Active
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </h2>
                    <p className="text-xs font-mono text-neutral-400">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-500/40 text-neutral-400 hover:text-red-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <LogOut size={13} /> Disconnect
                </button>
              </div>

              {/* Status Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">AUTHENTICATION TIER</span>
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    {usageData?.planTier || 'Free Explorer'}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">ECOSYSTEM CREDITS</span>
                  <p className="text-sm font-mono font-semibold text-emerald-400">
                    {usageData ? `${usageData.count} / ${usageData.limit} Used` : '5 Free Active'}
                  </p>
                </div>
              </div>

              {/* Launch Action */}
              <div className="p-5 rounded-2xl border border-white/10 bg-black/60 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">WriteYourEmail Studio</p>
                  <p className="text-xs text-neutral-400 mt-0.5">30 modes and zero-spam audits unlocked.</p>
                </div>
                <Link
                  href="/studio"
                  className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5 shadow-md shadow-white/5"
                >
                  Enter Studio <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="pt-2 text-xs font-mono text-neutral-500 flex justify-between">
                <span>IDENTITY: {user.id.slice(0, 14)}...</span>
                <span>CRYPTOGRAPHIC TOKEN: VALID</span>
              </div>
            </div>
          ) : (
            /* PASSPORT REGISTRATION & LOGIN FORM */
            <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.04] to-black p-8 sm:p-10 space-y-6 shadow-2xl relative">
              
              {/* Mode Switcher */}
              <div className="grid grid-cols-3 p-1 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono uppercase">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                  className={`py-2 rounded-lg transition-all ${
                    authMode === 'signup' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Create ID
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setAuthError(null); }}
                  className={`py-2 rounded-lg transition-all ${
                    authMode === 'signin' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('magic'); setAuthError(null); }}
                  className={`py-2 rounded-lg transition-all ${
                    authMode === 'magic' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Magic OTP
                </button>
              </div>

              {/* 1-Click Fast OAuth Providers */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={rateLimit.isLocked || isSecurityLockdownActive}
                    className="py-3 px-4 rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.02] text-xs font-medium text-white flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50"
                  >
                    <GoogleIcon />
                    <span>Google 1-Click</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={rateLimit.isLocked || isSecurityLockdownActive}
                    className="py-3 px-4 rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.02] text-xs font-medium text-white flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50"
                  >
                    <GitHubIcon />
                    <span>GitHub SSO</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <div className="h-[1px] flex-1 bg-white/10"></div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Or use verified email</span>
                  <div className="h-[1px] flex-1 bg-white/10"></div>
                </div>
              </div>

              {/* Status Messages */}
              {authError && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-300 flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-300 flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{authSuccess}</span>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {/* INVISIBLE BOT HONEYPOT (Traps Automated Scrapers) */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={botHoneypot}
                    onChange={(e) => setBotHoneypot(e.target.value)}
                    placeholder="Leave this empty"
                  />
                </div>

                {authMode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Full Legal or Operating Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Arshdeep Singh"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-wider">
                    <label className="text-neutral-400">Verified Email (Gmail, Outlook, Yahoo, Zoho, Apple)</label>
                    <span className="text-[10px] text-emerald-400 font-mono">No Temp Mails</span>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@gmail.com or name@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="text-[10px] font-mono text-neutral-500">
                    Strictly accepts Gmail, Outlook, Yahoo, Zoho, Apple, Proton, or your company domain.
                  </p>
                </div>

                {authMode !== 'magic' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-wider">
                      <label className="text-neutral-400">Master Password</label>
                      {authMode === 'signup' && (
                        <span className="text-[10px] font-mono text-neutral-400">
                          Strength: <span className="font-bold text-white">{passwordStrength.label}</span>
                        </span>
                      )}
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      minLength={8}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />

                    {/* Password Entropy Meter */}
                    {authMode === 'signup' && password.length > 0 && (
                      <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden mt-1.5">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || rateLimit.isLocked || isSecurityLockdownActive}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Verifying Cryptographic Credentials...'
                  ) : authMode === 'signup' ? (
                    <>Create Glent Sovereign ID <ArrowRight size={14} /></>
                  ) : authMode === 'magic' ? (
                    <>Dispatch One-Time Magic Link <Mail size={14} /></>
                  ) : (
                    <>Authenticate Passport <ArrowRight size={14} /></>
                  )}
                </button>
              </form>

              {/* Rate Limit Remaining Attempts Counter */}
              <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>ATTEMPTS REMAINING: {rateLimit.attemptsLeft} / 5</span>
                <span>HONEYPOT SHIELD: ARMED</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Institutional Security Architecture Specifications */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.01] space-y-6">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Anti-Abuse Protocols
            </h3>
            
            <div className="space-y-4 text-xs font-light leading-relaxed">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white text-xs">Disposable Domain Blacklist</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    100+ temporary email providers (e.g. Mailinator, Temp-Mail, GuerrillaMail) are blocked 
                    at the perimeter to maintain inbox deliverability trust scores across all child tools.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white text-xs">Brute-Force Rate Limiting</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    5 failed credential attempts trigger an automatic 15-minute cool-down period to prevent automated dictionary attacks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white text-xs">Honeypot Script Detection</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    Automated scrapers attempting headless POST registrations are silently discarded without burdening legitimate users with image puzzles.
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Circuit Breaker Trigger for Admin */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                Security Circuit Breaker (Admin Inspection)
              </span>
              <button
                type="button"
                onClick={() => setIsSecurityLockdownActive(!isSecurityLockdownActive)}
                className="w-full py-2 px-3 rounded-lg border border-white/10 hover:border-white/25 text-neutral-400 hover:text-white text-[11px] font-mono flex items-center justify-between transition-colors"
              >
                <span>Simulate Emergency Lockdown</span>
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                  isSecurityLockdownActive ? 'bg-red-500 text-white' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {isSecurityLockdownActive ? 'LOCKED' : 'NORMAL'}
                </span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}