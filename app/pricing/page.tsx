"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Script from "next/script";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// PAYPAL LIVE CLIENT ID & 6 PLAN IDS
// ============================================================================
const PAYPAL_CLIENT_ID = "BAAODdDSTxLd8ul-bpGX8tIqVSkyEezEjQtleLHKXIXvHjTNHXcOkzCcvrfGB_uL-Sxm8y9Hr3GxIw8ZAc";

const PLANS = {
  starter_monthly: "P-65540742DC055563HNLWVQHA",
  starter_yearly: "P-9CN21210V4270151DNLWVTRQ",
  growth_monthly: "P-67E73174CK110761DNLWVRVQ",
  growth_yearly: "P-2XL77868VJ625713TNLWVUEY",
  enterprise_monthly: "P-8RE44022PJ0533112NLWVSLA",
  enterprise_yearly: "P-14H71946X5554112LNLWVURA",
};
// ============================================================================

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const tiers = [
    {
      name: "Starter",
      id: "starter",
      priceMonthly: "$19",
      priceYearly: "$190",
      periodLabelMonthly: "/mo",
      periodLabelYearly: "/yr",
      description: "Ideal for solo sales reps and founders sending cold pitches.",
      features: [
        "50 AI Email Generations / month",
        "Standard ICP Persona Engine",
        "1-Click Gmail & Mail App Launch",
        "Export History to TXT",
        "Spam Trigger Word Risk Audit"
      ],
      planIdMonthly: PLANS.starter_monthly,
      planIdYearly: PLANS.starter_yearly,
      highlight: false,
      badge: "ESSENTIAL"
    },
    {
      name: "Growth",
      id: "growth",
      priceMonthly: "$39",
      priceYearly: "$390",
      periodLabelMonthly: "/mo",
      periodLabelYearly: "/yr",
      description: "For fast-growing teams scaling multi-touch outbound campaigns.",
      features: [
        "Unlimited Daily AI Generations",
        "3-Step Follow-Up Sequence Generator",
        "A/B Split Test Variations Engine",
        "Custom Brand Voice DNA Injection",
        "LinkedIn & Twitter/X Cold DM Generator",
        "Priority Fallback Model Routing"
      ],
      planIdMonthly: PLANS.growth_monthly,
      planIdYearly: PLANS.growth_yearly,
      highlight: true,
      badge: "MOST POPULAR"
    },
    {
      name: "Enterprise",
      id: "enterprise",
      priceMonthly: "$79",
      priceYearly: "$790",
      periodLabelMonthly: "/mo",
      periodLabelYearly: "/yr",
      description: "Dedicated infrastructure and bulk automation for agencies.",
      features: [
        "Bulk CSV Lead List Personalization",
        "AI Reply Intent Classifier & Analyzer",
        "Cold Call Script Generator",
        "1-Click History Export (CSV & TXT)",
        "DocuSign & Proposal E-Signature Links",
        "Zapier & CRM Webhook Export (Coming Soon)"
      ],
      planIdMonthly: PLANS.enterprise_monthly,
      planIdYearly: PLANS.enterprise_yearly,
      highlight: false,
      badge: "SCALE"
    }
  ];

  return (
    <div
      className="min-h-screen bg-[#000000] text-[#f5f5f7] font-sans selection:bg-[#0a84ff] selection:text-white relative overflow-x-hidden"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* PayPal SDK Script with Server Subscription Support */}
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />

      {/* Ambient Apple Radial Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-b from-[#0a84ff]/15 via-[#0a84ff]/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#000000]/70 backdrop-blur-2xl saturate-150 h-16 flex items-center justify-between px-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2 font-semibold text-lg tracking-tight">
          <span className="w-6 h-6 bg-gradient-to-br from-[#f5f5f7] to-[#a1a1a6] text-black flex items-center justify-center font-bold text-sm rounded-md shadow-sm">
            ✉️
          </span>
          <span>WriteYourEmail</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/studio" className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition">
            Studio Engine
          </Link>
        </div>
      </header>

      {/* Pricing Hero */}
      <main className="py-20 px-6 max-w-7xl mx-auto text-center relative z-10">
        <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20 inline-block mb-4 tracking-wider uppercase">
          Flexible B2B Pricing
        </span>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-[#f5f5f7] via-[#f5f5f7] to-[#86868b] bg-clip-text text-transparent leading-tight">
          Tools designed to close deals.
        </h1>
        <p className="text-xl text-[#86868b] max-w-2xl mx-auto mb-10 font-medium">
          Choose the tier that fits your outreach velocity. Instant activation powered by PayPal.
        </p>

        {/* Monthly / Annual Toggle Switch */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span
            className={`text-sm font-semibold transition ${
              billingCycle === "monthly" ? "text-white" : "text-[#86868b]"
            }`}
          >
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
            className="w-14 h-7 bg-[#2c2c2e] border border-white/10 rounded-full relative transition-all p-1 cursor-pointer"
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-all shadow-md ${
                billingCycle === "monthly" ? "translate-x-0" : "translate-x-7 bg-[#0a84ff]"
              }`}
            />
          </button>
          <span
            className={`text-sm font-semibold transition flex items-center gap-1.5 ${
              billingCycle === "annually" ? "text-white" : "text-[#86868b]"
            }`}
          >
            Annual Billing
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Save ~20%
            </span>
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {tiers.map((tier) => {
            const activePlanId = billingCycle === "monthly" ? tier.planIdMonthly : tier.planIdYearly;
            const activePrice = billingCycle === "monthly" ? tier.priceMonthly : tier.priceYearly;
            const activePeriod = billingCycle === "monthly" ? tier.periodLabelMonthly : tier.periodLabelYearly;

            return (
              <div
                key={tier.id}
                className={`p-8 rounded-[2.5rem] bg-[#141415] border flex flex-col justify-between transition-all duration-300 relative ${
                  tier.highlight
                    ? "border-[#0a84ff] ring-2 ring-[#0a84ff]/30 shadow-[0_0_50px_rgba(10,132,255,0.15)]"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#86868b] tracking-widest uppercase">
                      {tier.badge}
                    </span>
                    {tier.highlight && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#0a84ff] text-white">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-2 text-white">{tier.name}</h3>
                  <p className="text-[#86868b] text-sm mb-6 leading-relaxed min-h-[40px]">
                    {tier.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-extrabold tracking-tight text-white">{activePrice}</span>
                    <span className="text-[#86868b] text-sm font-medium">{activePeriod}</span>
                  </div>

                  {/* PayPal Smart Button Mount */}
                  <div className="mb-8 min-h-[50px]">
                    {user ? (
                      <PayPalButtonWrapper planId={activePlanId} userId={user.id} sdkReady={sdkReady} />
                    ) : (
                      <Link
                        href="/studio"
                        className="w-full py-4 bg-[#f5f5f7] text-black font-semibold rounded-2xl block text-center hover:bg-white transition shadow-md"
                      >
                        Log in to Subscribe
                      </Link>
                    )}
                  </div>

                  <div className="space-y-3 pt-6 border-t border-white/5">
                    <p className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-4">
                      What's Included:
                    </p>
                    {tier.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-3 text-sm">
                        <span className="text-[#0a84ff] font-bold mt-0.5">✓</span>
                        <span className="text-[#f5f5f7]/90 font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm font-medium text-[#86868b]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 WriteYourEmail. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-[#f5f5f7] transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#f5f5f7] transition">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PayPalButtonWrapper({
  planId,
  userId,
  sdkReady,
}: {
  planId: string;
  userId: string;
  sdkReady: boolean;
}) {
  const containerId = `paypal-container-${planId.replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    let isMounted = true;

    const renderPayPal = () => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = "";

      // @ts-ignore
      if (window.paypal && window.paypal.Buttons) {
        try {
          // @ts-ignore
          window.paypal
            .Buttons({
              style: {
                shape: "pill",
                color: "blue",
                layout: "vertical",
                label: "subscribe",
              },
              createSubscription: async (_data: any, actions: any) => {
                try {
                  // Primary: Create Subscription securely via Next.js server route
                  const res = await fetch("/api/paypal/create-subscription", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ planId, userId }),
                  });
                  const data = await res.json();
                  if (res.ok && data.subscriptionId) {
                    return data.subscriptionId;
                  }
                  console.warn("Server route failed, attempting SDK fallback:", data);
                } catch (e) {
                  console.warn("Server route fetch error:", e);
                }

                // Fallback: Direct SDK call
                return actions.subscription.create({
                  plan_id: planId,
                  custom_id: userId,
                });
              },
              onApprove: (_data: any) => {
                alert("Subscription successful! Redirecting to Studio...");
                window.location.href = "/studio?success=true";
              },
              onError: (err: any) => {
                console.error("PayPal Checkout Error:", err);
              },
            })
            .render(`#${containerId}`);
        } catch (err) {
          console.error("Error rendering PayPal buttons:", err);
        }
      }
    };

    const timer = setTimeout(renderPayPal, 200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [planId, userId, sdkReady, containerId]);

  return <div id={containerId} className="w-full min-h-[45px]" />;
}