'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  Key,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  LogOut,
  User,
  Cpu,
  Layers,
  Activity,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function GlentPassportPage() {
  const router = useRouter();

  // Auth States
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'magic'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // User Profile / Usage State
  const [usageData, setUsageData] = useState<{ planTier: string; count: number; limit: number } | null>(null);

  // Check active session on mount
  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) {
        setLoadingUser(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await loadUsageProfile(session.user.id);
        }
      } catch (err) {
        console.error('Session retrieval error:', err);
      } finally {
        setLoadingUser(false);
      }
    };

    checkSession();

    // Listen to real-time auth changes
    const { data: authListener } = supabase?.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUsageProfile(session.user.id);
      } else {
        setUser(null);
        setUsageData(null);
      }
    }) || { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch or initialize usage record
  const loadUsageProfile = async (userId: string) => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        const limits: Record<string, number> = { free: 5, starter: 100, growth: 300, enterprise: 1000 };
        setUsageData({
          planTier: data.plan_tier || 'free',
          count: data.count || 0,
          limit: limits[data.plan_tier] || 5,
        });
      } else {
        // Create initial usage tracker if new user
        await supabase.from('usage_tracking').insert({
          user_id: userId,
          count: 0,
          plan_tier: 'free',
          last_reset: new Date().toISOString()
        });
        setUsageData({ planTier: 'free', count: 0, limit: 5 });
      }
    } catch (err) {
      console.warn('Profile sync issue:', err);
    }
  };

  // Sign In / Sign Up Handler
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setAuthError('Authentication service unavailable.');
      return;
    }

    setAuthError(null);
    setAuthSuccess(null);
    setIsSubmitting(true);

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });

        if (error) throw error;

        if (data?.user && !data.session) {
          setAuthSuccess('Verification link dispatched. Check your email inbox to activate your Glent Passport.');
        } else if (data?.user) {
          setUser(data.user);
          await loadUsageProfile(data.user.id);
          setAuthSuccess('Glent Sovereign Passport activated successfully.');
        }
      } else if (authMode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data?.user) {
          setUser(data.user);
          await loadUsageProfile(data.user.id);
          setAuthSuccess('Authenticated. Redirecting to WriteYourEmail Studio...');
          setTimeout(() => router.push('/studio'), 1200);
        }
      } else if (authMode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/studio`
          }
        });

        if (error) throw error;
        setAuthSuccess('Magic access link dispatched to your inbox.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign Out Handler
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
    <div className="max-w-6xl mx-auto px-6 pt-16 pb-24 space-y-16">
      
      {/* Header Badge */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">
          <ShieldCheck size={12} className="text-blue-400" />
          Glent Sovereign Identity System
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          One Passport. The Entire Ecosystem.
        </h1>
        <p className="text-sm text-neutral-400 font-light leading-relaxed">
          Your Glent Global account acts as your universal single sign-on passport for WriteYourEmail.com, 
          future intelligence systems, and all enterprise developer tooling.
        </p>
      </div>

      {/* Main Grid: Auth Form OR Active Passport Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* LEFT COLUMN: The Interactive Passport Terminal */}
        <div className="lg:col-span-7">
          {user ? (
            /* ACTIVE PASSPORT VIEW (When Logged In) */
            <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.05] via-neutral-950 to-black p-8 sm:p-10 space-y-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white via-neutral-300 to-neutral-600 text-black flex items-center justify-center font-bold text-xl shadow-md">
                    G
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      Glent Passport Active
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </h2>
                    <p className="text-xs font-mono text-neutral-400">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-500/40 text-neutral-400 hover:text-red-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>

              {/* Passport Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">PORTFOLIO STATUS</span>
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    {usageData?.planTier === 'enterprise'
                      ? 'Enterprise Sovereign'
                      : usageData?.planTier === 'growth'
                      ? 'Growth Pass'
                      : usageData?.planTier === 'starter'
                      ? 'Starter Pass'
                      : 'Free Explorer Tier'}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">ECOSYSTEM CREDITS</span>
                  <p className="text-sm font-mono font-semibold text-emerald-400">
                    {usageData ? `${usageData.count} / ${usageData.limit} Used` : 'Syncing...'}
                  </p>
                </div>
              </div>

              {/* Universal Access Matrix */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">Connected Services</p>
                
                <div className="p-4 rounded-xl border border-white/10 bg-black/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                      W
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">WriteYourEmail Studio</p>
                      <p className="text-[10px] font-mono text-emerald-400">Connected & Authorized</p>
                    </div>
                  </div>
                  <Link
                    href="/studio"
                    className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5"
                  >
                    Launch <ArrowUpRight size={13} />
                  </Link>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-black/40 flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 text-xs">
                      <Cpu size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Glent Signal</p>
                      <p className="text-[10px] font-mono text-neutral-500">Phase 02 Early Access (Q2 2025)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-1 rounded bg-white/5 text-neutral-400">Queued</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>PASSPORT ID: {user.id.slice(0, 12)}...</span>
                <span>AUTHENTICATED VIA SUPABASE RLS</span>
              </div>
            </div>
          ) : (
            /* LOGIN / REGISTRATION FORM */
            <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.04] to-black p-8 sm:p-10 space-y-6 shadow-2xl">
              
              {/* Form Mode Selector */}
              <div className="grid grid-cols-3 p-1 rounded-xl bg-neutral-900/80 border border-white/10 text-xs font-mono uppercase">
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
                  onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                  className={`py-2 rounded-lg transition-all ${
                    authMode === 'signup' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Create ID
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('magic'); setAuthError(null); }}
                  className={`py-2 rounded-lg transition-all ${
                    authMode === 'magic' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Magic Link
                </button>
              </div>

              {/* Status Notifications */}
              {authError && (
                <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-300 flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-300 flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* The Form */}
              <form onSubmit={handleAuth} className="space-y-4">
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
                  <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Sovereign Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {authMode !== 'magic' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Master Key (Password)
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      minLength={6}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    'Processing Handshake...'
                  ) : authMode === 'signup' ? (
                    <>Create Glent Sovereign ID <ArrowRight size={14} /></>
                  ) : authMode === 'magic' ? (
                    <>Dispatch Magic Key <Mail size={14} /></>
                  ) : (
                    <>Authenticate Passport <ArrowRight size={14} /></>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-neutral-500 font-mono">
                  By authenticating, you agree to Glent Global sovereign data policies and zero-retraining terms.
                </p>
              </div>

            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Institutional Security & SSO Benefits */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.01] space-y-6">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Single Sign-On Architecture
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Glent Passport uses cryptographic JSON Web Tokens (JWT) signed by our core Supabase database. 
              Once authenticated, your session persists across all current and future Glent Global software products.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Instant Studio Access</p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    No secondary login needed on WriteYourEmail.com. Your 30 modes and deliverability checks activate immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Consolidated Prepaid Passes</p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Prepaid access passes purchased via PayPal apply directly to your central Glent identity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Row-Level Privacy Guarantee</p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Your generated emails, inputs, and recipient lists are strictly ring-fenced to your personal account ID.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-500">
              <span>SECURITY PROTOCOL: SSL / TLS 1.3</span>
              <span className="text-blue-400">ACTIVE</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}