"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { 
  Check, 
  Sparkles, 
  Tag, 
  ShieldCheck, 
  Zap, 
  Lock, 
  ArrowRight, 
  UserCheck, 
  AlertCircle, 
  Loader2,
  Calendar,
  Clock,
  CheckCircle2,
  PlusCircle
} from "lucide-react";

declare global {
  interface Window {
    paypal?: any;
  }
}

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Active subscription status from Supabase
  const [activeSub, setActiveSub] = useState<{
    plan_tier: string;
    subscription_ends_at: string;
  } | null>(null);
  const [subLoading, setSubLoading] = useState(true);

  // Promo code engine state
  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  // Selected plan state for modal checkout
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string;
    name: string;
    basePrice: number;
  } | null>(null);

  // In-modal authentication state
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const loadUserAndSubscription = async () => {
      setSubLoading(true);
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        await fetchUserSubscription(data.user.id);
      }
      setSubLoading(false);
    };

    loadUserAndSubscription();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserSubscription(session.user.id);
      } else {
        setActiveSub(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("usage_tracking")
        .select("plan_tier, subscription_ends_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching usage tracking:", error);
        return;
      }

      if (data && data.subscription_ends_at) {
        const isStillValid = new Date(data.subscription_ends_at) > new Date();
        if (isStillValid) {
          setActiveSub({
            plan_tier: data.plan_tier || "starter",
            subscription_ends_at: data.subscription_ends_at,
          });
        } else {
          setActiveSub(null);
        }
      }
    } catch (err) {
      console.error("Subscription check error:", err);
    }
  };

  // Load PayPal SDK dynamically when modal opens
  useEffect(() => {
    if (selectedPlan && user && mounted) {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";
      const scriptId = "paypal-sdk-script";

      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
        script.async = true;
        script.onload = () => renderPayPalButtons();
        document.body.appendChild(script);
      } else {
        renderPayPalButtons();
      }
    }
  }, [selectedPlan, user, mounted, discountPercent]);

  const applyPromoCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPromoError(null);
    setPromoSuccess(null);

    const cleanCode = promoCode.trim().toUpperCase();

    if (cleanCode === "LAUNCH50") {
      setDiscountPercent(50);
      setAppliedCode("LAUNCH50");
      setPromoSuccess("🎉 Code LAUNCH50 applied! 50% OFF active.");
    } else if (cleanCode === "") {
      setPromoError("Please enter a discount code.");
    } else {
      setPromoError("Invalid code. Try LAUNCH50 for 50% off.");
    }
  };

  const calculatePrice = (basePrice: number) => {
    if (discountPercent > 0) {
      const discounted = basePrice * (1 - discountPercent / 100);
      return discounted.toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  const handleInModalAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    if (!authEmail || !authPassword) {
      setAuthError("Please provide both email and password.");
      setAuthLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });

        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          await fetchUserSubscription(data.user.id);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          await fetchUserSubscription(data.user.id);
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Stackable expiration calculation
  const getStackedExpiryDate = () => {
    const baseDate = activeSub?.subscription_ends_at && new Date(activeSub.subscription_ends_at) > new Date()
      ? new Date(activeSub.subscription_ends_at)
      : new Date();
    
    return new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  };

  const renderPayPalButtons = () => {
    const container = document.getElementById("paypal-button-container");
    if (!container || !window.paypal || !selectedPlan || !user) return;

    container.innerHTML = ""; // Clear existing buttons

    const finalPrice = calculatePrice(selectedPlan.basePrice);

    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "pay",
        },
        createOrder: (_data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: `WriteYourEmail.com - ${selectedPlan.name} (+30 Days) for ${user.email}`,
                amount: {
                  currency_code: "USD",
                  value: finalPrice,
                },
                custom_id: user.id,
              },
            ],
          });
        },
        onApprove: async (_data: any, actions: any) => {
          setCheckoutStatus("Processing payment & extending active pass...");
          try {
            const details = await actions.order.capture();
            const newExpiryISO = getStackedExpiryDate().toISOString();

            // Record updated stackable subscription in Supabase
            await supabase.from("usage_tracking").upsert({
              user_id: user.id,
              plan_tier: selectedPlan.id,
              subscription_ends_at: newExpiryISO,
            });

            // Refresh UI active subscription state
            await fetchUserSubscription(user.id);

            setCheckoutStatus(`✅ Success! ${selectedPlan.name} active until ${new Date(newExpiryISO).toLocaleDateString()}. Order ID: ${details.id}`);
          } catch (err) {
            setCheckoutStatus("❌ Payment capture failed. Please contact help@writeyouremail.com with your receipt.");
          }
        },
        onError: (err: any) => {
          console.error("PayPal Error:", err);
          setCheckoutStatus("❌ Payment gateway error. Please try again.");
        },
      })
      .render("#paypal-button-container");
  };

  const plans = [
    {
      id: "starter",
      name: "Starter Pass",
      basePrice: 19,
      period: "30-day prepaid pass",
      description: "Ideal for freelancers and consultants sending focused outreach.",
      popular: false,
      features: [
        "50 AI Generations / Month",
        "5 Core Outreach Modes",
        "AI Spam Trigger Sanitizer",
        "Deliverability Scorecard (0-100)",
        "Subject Line A/B Matrix (5 variations)",
        "1-Click Gmail & Outlook Launch",
      ],
    },
    {
      id: "growth",
      name: "Growth Pass",
      basePrice: 39,
      period: "30-day prepaid pass",
      description: "Best for SaaS founders, agency owners, and active sales pros.",
      popular: true,
      features: [
        "Unlimited AI Generations",
        "All 30 Omni-Channel Outreach Modes",
        "Priority AI Processing (Sub-second)",
        "AI Spam Trigger Sanitizer",
        "Deliverability Scorecard (0-100)",
        "Subject Line A/B Matrix (5 variations)",
        "Multi-Step Follow-Up Generator",
        "1-Click Direct Email Launch",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise Pass",
      basePrice: 79,
      period: "30-day prepaid pass",
      description: "For teams and agencies running heavy volume campaigns.",
      popular: false,
      features: [
        "Unlimited AI Generations",
        "All 30 Omni-Channel Outreach Modes",
        "VIP Fast-Track AI Queue",
        "Deliverability Audit & Sanitizer",
        "Custom Prompt Tone Engineering",
        "Direct Support: help@writeyouremail.com",
        "Commercial Usage Rights",
      ],
    },
  ];

  const getDaysRemaining = (endsAt: string) => {
    const diffTime = new Date(endsAt).getTime() - new Date().getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 font-sans selection:bg-[#0a84ff] selection:text-white">
      {/* Launch Promo Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-[#0a84ff] via-[#bf5af2] to-[#0a84ff] bg-[length:200%_auto] py-2.5 px-4 text-center text-xs md:text-sm font-semibold text-white shadow-md">
        🚀 Product Hunt Early Bird Special: Enter code{" "}
        <button
          onClick={() => {
            setPromoCode("LAUNCH50");
            setDiscountPercent(50);
            setAppliedCode("LAUNCH50");
            setPromoSuccess("🎉 Code LAUNCH50 applied! 50% OFF active.");
          }}
          className="underline font-mono bg-white/20 px-1.5 py-0.5 rounded hover:bg-white/30 transition-all cursor-pointer"
        >
          LAUNCH50
        </button>{" "}
        at checkout for 50% OFF all 30-day passes!
      </div>

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
            <Link href="/docs" className="text-sm text-gray-400 transition hover:text-white">
              Docs & Guides
            </Link>
            <Link href="/pricing" className="text-sm text-[#0a84ff] font-medium">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                Logged in: <strong className="text-white">{user.email}</strong>
              </span>
            )}
            <Link
              href="/studio"
              className="rounded-xl bg-[#0a84ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0071e3] shadow-lg shadow-[#0a84ff]/25"
            >
              Open Studio
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Active Pass Banner (If Logged In with Active Plan) */}
        {activeSub && (
          <div className="mx-auto max-w-4xl mb-12 rounded-3xl border border-[#30d158]/30 bg-[#30d158]/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#30d158]/20 text-[#30d158] shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#30d158]/20 px-3 py-0.5 text-xs font-bold text-[#30d158] uppercase tracking-wider mb-1">
                    Active Pass Verified
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    You are currently on the <span className="text-[#30d158] uppercase">{activeSub.plan_tier} PASS</span>
                  </h3>
                  <p className="mt-1 text-xs text-gray-300 flex items-center gap-2 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-[#30d158]" /> Valid until:{" "}
                    <strong className="text-white">{new Date(activeSub.subscription_ends_at).toLocaleDateString()}</strong>
                    <span className="text-gray-400">({getDaysRemaining(activeSub.subscription_ends_at)} days remaining)</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/studio"
                  className="rounded-xl bg-[#30d158] px-5 py-2.5 text-sm font-bold text-black hover:bg-[#28b84c] transition shadow-lg shrink-0"
                >
                  Use Studio Now
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0a84ff]/30 bg-[#0a84ff]/10 px-4 py-1.5 text-xs font-semibold text-[#0a84ff] mb-4">
            <Tag className="h-3.5 w-3.5" /> Simple Prepaid Access • No Subscription Traps
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Choose Your Outreach Pass
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Pay once for 30 days of high-deliverability AI email generation. 
            No recurring billing. Purchasing a pass while active adds +30 days to your current balance!
          </p>
        </div>

        {/* Interactive Promo Code Form */}
        <div className="mx-auto max-w-md mb-12 rounded-2xl border border-[#222224] bg-[#141415] p-4 shadow-xl">
          <form onSubmit={applyPromoCode} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter promo code (e.g. LAUNCH50)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full rounded-xl border border-[#222224] bg-[#1c1c1e] px-4 py-2.5 text-sm text-white uppercase placeholder-gray-500 focus:border-[#0a84ff] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#0a84ff] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0071e3] shrink-0"
            >
              Apply
            </button>
          </form>

          {promoError && (
            <p className="mt-2 text-xs font-medium text-red-400">{promoError}</p>
          )}

          {promoSuccess && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#30d158]/10 border border-[#30d158]/20 px-3 py-1.5 text-xs font-semibold text-[#30d158]">
              <Check className="h-3.5 w-3.5" /> {promoSuccess}
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const hasDiscount = discountPercent > 0;
            const finalPrice = calculatePrice(plan.basePrice);
            const isCurrentActive = activeSub?.plan_tier?.toLowerCase() === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl border p-8 transition-all ${
                  isCurrentActive
                    ? "border-[#30d158] bg-[#141415] ring-2 ring-[#30d158] shadow-2xl shadow-[#30d158]/10"
                    : plan.popular
                    ? "border-[#0a84ff] bg-[#141415] shadow-2xl shadow-[#0a84ff]/10 ring-1 ring-[#0a84ff]"
                    : "border-[#1c1c1e] bg-[#0a0a0a] hover:border-[#222224]"
                }`}
              >
                {isCurrentActive ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#30d158] px-4 py-1 text-xs font-extrabold tracking-wider text-black uppercase shadow-md flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Current Active Pass
                  </div>
                ) : plan.popular ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#0a84ff] to-[#bf5af2] px-4 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-md">
                    Most Popular
                  </div>
                ) : null}

                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-xs text-gray-400 min-h-[32px]">{plan.description}</p>

                <div className="my-6">
                  {hasDiscount ? (
                    <div>
                      <span className="text-sm text-gray-500 line-through mr-2">
                        ${plan.basePrice}
                      </span>
                      <span className="text-4xl font-extrabold text-[#30d158]">
                        ${finalPrice}
                      </span>
                      <span className="ml-2 text-xs font-semibold text-[#30d158] bg-[#30d158]/10 px-2 py-0.5 rounded-full border border-[#30d158]/20">
                        SAVE 50%
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-extrabold text-white">
                        ${plan.basePrice}
                      </span>
                      <span className="ml-1 text-sm text-gray-400">/ 30 days</span>
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">{plan.period}</p>
                </div>

                <ul className="mb-8 space-y-3 flex-1">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-[#0a84ff] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    setSelectedPlan(plan);
                    setCheckoutStatus(null);
                  }}
                  className={`w-full rounded-xl py-3 px-4 text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    isCurrentActive
                      ? "bg-[#30d158] text-black hover:bg-[#28b84c] shadow-lg shadow-[#30d158]/20"
                      : plan.popular
                      ? "bg-[#0a84ff] text-white hover:bg-[#0071e3] shadow-lg shadow-[#0a84ff]/20"
                      : "bg-[#1c1c1e] text-white hover:bg-[#222224] border border-[#222224]"
                  }`}
                >
                  <span>
                    {isCurrentActive
                      ? "Extend Pass (+30 Days)"
                      : activeSub
                      ? `Switch to ${plan.name} (+30 Days)`
                      : `Get ${plan.name}`}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-16 rounded-3xl border border-[#1c1c1e] bg-[#0a0a0a] p-8 text-center max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0a84ff]/10 text-[#0a84ff] shrink-0">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="text-left">
            <h4 className="text-lg font-bold text-white">100% Risk-Free Prepaid Pass</h4>
            <p className="mt-1 text-sm text-gray-400">
              Every pass gives you full access for 30 days without recurring charges. 
              If you have any deliverability or technical questions, contact founder support directly at{" "}
              <a href="mailto:help@writeyouremail.com" className="text-[#0a84ff] hover:underline">
                help@writeyouremail.com
              </a>.
            </p>
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#222224] bg-[#141415] p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-sm font-mono p-2"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-[#0a84ff] uppercase tracking-wider">
                Checkout
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                {selectedPlan.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  ${calculatePrice(selectedPlan.basePrice)}
                </span>
                <span className="text-sm text-gray-400">for 30 Days</span>
                {appliedCode && (
                  <span className="text-xs font-bold text-[#30d158] bg-[#30d158]/10 px-2 py-0.5 rounded border border-[#30d158]/20">
                    50% Discount Applied
                  </span>
                )}
              </div>
            </div>

            {/* If User Is NOT Logged In -> Show Account Creation */}
            {!user ? (
              <div className="my-4 space-y-4">
                <div className="rounded-2xl border border-[#0a84ff]/30 bg-[#0a84ff]/10 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0a84ff] uppercase tracking-wider">
                    <UserCheck className="h-4 w-4" /> Step 1: Create Account
                  </div>
                  <p className="mt-1 text-xs text-gray-300">
                    Create your account to attach your 30-day pass to your email before completing PayPal payment.
                  </p>
                </div>

                <form onSubmit={handleInModalAuth} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full rounded-xl border border-[#222224] bg-[#1c1c1e] px-4 py-2.5 text-sm text-white focus:border-[#0a84ff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full rounded-xl border border-[#222224] bg-[#1c1c1e] px-4 py-2.5 text-sm text-white focus:border-[#0a84ff] focus:outline-none"
                    />
                  </div>

                  {authError && (
                    <div className="flex items-center gap-2 rounded-xl border border-[#ff453a]/30 bg-[#ff453a]/10 p-3 text-xs text-[#ff453a]">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full rounded-xl bg-[#0a84ff] py-3 text-sm font-semibold text-white transition hover:bg-[#0071e3] flex items-center justify-center gap-2"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>{isSignUp ? "Create Free Account & Continue" : "Log In & Continue"}</span>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-xs text-gray-400 hover:text-white underline"
                    >
                      {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* User IS Logged In -> Show PayPal Buttons & Extension Date Preview */
              <div className="space-y-4">
                <div className="rounded-xl border border-[#222224] bg-[#1c1c1e] p-3 text-xs text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Purchasing pass for:</span>
                    <strong className="text-white font-mono">{user.email}</strong>
                  </div>
                  {activeSub && (
                    <div className="flex justify-between text-[#30d158] font-medium pt-1 border-t border-[#222224]">
                      <span>New Expiration Date:</span>
                      <strong>{getStackedExpiryDate().toLocaleDateString()} (+30 days)</strong>
                    </div>
                  )}
                </div>

                {checkoutStatus ? (
                  <div className="my-4 rounded-2xl border border-[#222224] bg-[#1c1c1e] p-4 text-center text-sm font-medium text-white">
                    {checkoutStatus}
                  </div>
                ) : (
                  <div className="my-4 min-h-[150px]">
                    <div id="paypal-button-container"></div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
              <Lock className="h-3.5 w-3.5" /> 256-Bit SSL Encrypted Standard PayPal Checkout
            </div>
          </div>
        </div>
      )}

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