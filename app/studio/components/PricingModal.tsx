// app/studio/components/PricingModal.tsx
import React, { useEffect, useState } from 'react';
import { X, Check, Shield } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { createClient } from '@supabase/supabase-js';
import { PlanTier } from '../lib/modeSchemas';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface PricingModalProps {
  userId: string | undefined;
  onClose: () => void;
  onRequireAuth: () => void;
  onSuccess: (newTier: PlanTier, endsAt: string) => void;
}

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '19',
    description: 'Perfect for individuals and freelancers.',
    color: '#30d158', // Green
    features: [
      '50 Generations / month',
      '5 Starter Outreach Modes',
      'Cold Emails & Objection Handling',
      'Standard AI Models',
      '30-Day Access pass'
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '39',
    description: 'For founders and sales professionals.',
    color: '#0a84ff', // Blue
    popular: true,
    features: [
      'Unlimited Generations',
      '15 Omni-Channel Modes',
      'LinkedIn, X, WhatsApp, VSLs',
      'Priority AI Processing',
      '30-Day Access pass'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '79',
    description: 'For agencies and high-volume teams.',
    color: '#bf5af2', // Purple
    features: [
      'Unlimited Generations',
      'All 30 Omni-Channel Modes',
      'Cold Calls, Direct Mail, Bulk CSV',
      'Max Token Output & Memory',
      '30-Day Access pass'
    ]
  }
];

export default function PricingModal({ userId, onClose, onRequireAuth, onSuccess }: PricingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Fixes Vercel SSR build crash caused by PayPal SDK
  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePaymentSuccess = async (planId: string) => {
    if (!userId) return;
    setProcessingId(planId);
    
    try {
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + 30); // 30-day prepaid access
      const endsAtIso = endsAt.toISOString();

      const { error } = await supabase
        .from("usage_tracking")
        .update({
          plan_tier: planId,
          subscription_ends_at: endsAtIso,
          count: 0,
          last_reset: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) throw error;
      
      onSuccess(planId as PlanTier, endsAtIso);
    } catch (err) {
      console.error("Plan activation database error:", err);
      alert("Payment successful but account update failed. Please contact support.");
    } finally {
      setProcessingId(null);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: '#141415',
        border: '1px solid #2a2a2c',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '1000px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#2a2a2c',
            border: 'none',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ padding: '40px 40px 20px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '32px', fontWeight: 700, color: '#fff' }}>
            Upgrade Your Arsenal
          </h2>
          <p style={{ margin: 0, fontSize: '16px', color: '#8e8e93', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Shield size={16} color="#30d158" />
            Secure 30-Day Prepaid Passes. No automatic rebilling.
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          padding: '20px 40px 40px'
        }}>
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              style={{
                backgroundColor: '#0a0a0a',
                border: plan.popular ? `2px solid ${plan.color}` : '1px solid #2a2a2c',
                borderRadius: '20px',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transform: plan.popular ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: plan.color,
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  Most Popular
                </div>
              )}

              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#fff', fontWeight: 600 }}>
                {plan.name}
              </h3>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '36px', fontWeight: 700, color: '#fff' }}>${plan.price}</span>
                <span style={{ color: '#8e8e93', fontSize: '14px' }}>/ 30 days</span>
              </div>
              <p style={{ margin: '0 0 24px 0', color: '#8e8e93', fontSize: '14px', lineHeight: 1.5 }}>
                {plan.description}
              </p>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {plan.features.map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Check size={18} color={plan.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: '#d1d1d6', fontSize: '14px' }}>{feature}</span>
                  </div>
                ))}
              </div>

              {processingId === plan.id ? (
                <div style={{ textAlign: 'center', padding: '14px', color: plan.color, fontSize: '14px', fontWeight: 600 }}>
                  Activating Plan...
                </div>
              ) : !userId ? (
                <button
                  onClick={() => {
                    onClose();
                    onRequireAuth();
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: plan.color,
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Sign in to Purchase
                </button>
              ) : (
                <PayPalScriptProvider options={{ 
                  "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", 
                  "currency": "USD",
                  "intent": "capture"
                }}>
                  <PayPalButtons
                    style={{ layout: "vertical", shape: "rect", color: "blue", label: "pay" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [{
                          description: `WriteYourEmail ${plan.name} (30-Day Pass)`,
                          amount: {
                            currency_code: "USD",
                            value: plan.price
                          },
                          custom_id: userId // Ties the order strictly to the user
                        }]
                      });
                    }}
                    onApprove={async (data, actions) => {
                      if (!actions.order) return;
                      const details = await actions.order.capture();
                      if (details.status === "COMPLETED") {
                        await handlePaymentSuccess(plan.id);
                      }
                    }}
                    onError={(err) => {
                      console.error("PayPal Error:", err);
                    }}
                  />
                </PayPalScriptProvider>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}