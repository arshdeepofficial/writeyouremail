"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Sparkles, Tag, ShieldCheck, Zap, Lock, ArrowRight } from "lucide-react";

declare global {
  interface Window {
    paypal?: any;
  }
}

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
  
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load PayPal SDK dynamically when modal opens
  useEffect(() => {
    if (selectedPlan && mounted) {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb"; // Defaults to sandbox if env not set
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
  }, [selectedPlan, mounted, discountPercent]);

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

  const renderPayPalButtons = () => {
    const container = document.getElementById("paypal-button-container");
    if (!container || !window.paypal || !selectedPlan) return;

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
                description: `WriteYourEmail.com - ${selectedPlan.name} (30 Days)`,
                amount: {
                  currency_code: "USD",
                  value: finalPrice,
                },
              },
            ],
          });
        },
        onApprove: async (_data: any, actions: any) => {
          setCheckoutStatus("Processing payment...");
          try {
            const details = await actions.order.capture();
            setCheckoutStatus(`✅ Payment successful! Welcome to ${selectedPlan.name}. Order ID: ${details.id}`);
          } catch (err) {
            setCheckoutStatus("❌ Payment capture failed. Please contact help@writeyouremail.com.");
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
      cta: "Get Starter Pass",
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
      cta: "Get Growth Pass",
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
      cta: "Get Enterprise Pass",
    },
  ];

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
            <Link href="/pricing" className="text-sm text-[#0a84ff] font-medium">
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

      <main className="mx-auto max-w-7xl px-6 py-16">
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
            No recurring billing, cancel anytime because it never auto-renews.
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

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl border p-8 transition-all ${
                  plan.popular
                    ? "border-[#0a84ff] bg-[#141415] shadow-2xl shadow-[#0a84ff]/10 ring-1 ring-[#0a84ff]"
                    : "border-[#1c1c1e] bg-[#0a0a0a] hover:border-[#222224]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#0a84ff] to-[#bf5af2] px-4 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-md">
                    Most Popular
                  </div>
                )}

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
                    plan.popular
                      ? "bg-[#0a84ff] text-white hover:bg-[#0071e3] shadow-lg shadow-[#0a84ff]/20"
                      : "bg-[#1c1c1e] text-white hover:bg-[#222224] border border-[#222224]"
                  }`}
                >
                  <span>{plan.cta}</span>
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

      {/* PayPal Checkout Modal */}
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

            {checkoutStatus ? (
              <div className="my-6 rounded-2xl border border-[#222224] bg-[#1c1c1e] p-4 text-center text-sm font-medium text-white">
                {checkoutStatus}
              </div>
            ) : (
              <div className="my-4 min-h-[150px]">
                <div id="paypal-button-container"></div>
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