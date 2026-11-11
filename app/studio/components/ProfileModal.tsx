"use client";

// app/studio/components/ProfileModal.tsx
import React from 'react';
import { X, User, Zap, Calendar, Shield, LogOut, ArrowUpRight } from 'lucide-react';
import { PlanTier } from '../lib/modeSchemas';

interface ProfileModalProps {
  user: any;
  userTier: PlanTier;
  usageCount: number;
  subscriptionEndsAt?: string | null;
  onClose: () => void;
  onUpgradeClick: () => void;
  onSignOut: () => void;
}

const TIER_NAMES: Record<PlanTier, string> = {
  free: 'Free Plan',
  starter: 'Starter Plan ($19/mo)',
  growth: 'Growth Plan ($39/mo)',
  enterprise: 'Enterprise Plan ($79/mo)',
};

const TIER_COLORS: Record<PlanTier, string> = {
  free: '#8e8e93',
  starter: '#30d158',
  growth: '#0a84ff',
  enterprise: '#bf5af2',
};

const TIER_LIMITS: Record<PlanTier, number> = {
  free: 5,
  starter: 50,
  growth: 999999,
  enterprise: 999999,
};

export default function ProfileModal({
  user,
  userTier,
  usageCount,
  subscriptionEndsAt,
  onClose,
  onUpgradeClick,
  onSignOut,
}: ProfileModalProps) {
  const limit = TIER_LIMITS[userTier];
  const isUnlimited = userTier === 'growth' || userTier === 'enterprise';
  const remaining = isUnlimited ? 'Unlimited' : Math.max(0, limit - usageCount);
  const color = TIER_COLORS[userTier];

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'N/A (Free Account)';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#141415',
        border: '1px solid #2a2a2c',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '460px',
        position: 'relative',
        padding: '32px',
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
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '32px',
            background: `linear-gradient(135deg, ${color}, #1c1c1e)`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: `0 8px 24px ${color}33`
          }}>
            <User size={32} color="#fff" />
          </div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 700, color: '#fff' }}>
            Account Profile
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#8e8e93', wordBreak: 'break-all' }}>
            {user?.email || 'Logged in User'}
          </p>
        </div>

        {/* Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          {/* Current Tier */}
          <div style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #2a2a2c',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={20} color={color} />
              <div>
                <div style={{ fontSize: '12px', color: '#8e8e93' }}>Active Plan</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{TIER_NAMES[userTier]}</div>
              </div>
            </div>
            <button
              onClick={() => { onClose(); onUpgradeClick(); }}
              style={{
                background: 'transparent',
                border: `1px solid ${color}`,
                color: color,
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Change <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Credits Used */}
          <div style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #2a2a2c',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Zap size={20} color="#0a84ff" />
            <div>
              <div style={{ fontSize: '12px', color: '#8e8e93' }}>Generations Usage</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>
                {usageCount} {isUnlimited ? 'generations used (Unlimited Plan)' : `/ ${limit} used (${remaining} remaining)`}
              </div>
            </div>
          </div>

          {/* Expiration Date */}
          <div style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #2a2a2c',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Calendar size={20} color="#bf5af2" />
            <div>
              <div style={{ fontSize: '12px', color: '#8e8e93' }}>Subscription Valid Until</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>
                {formatDate(subscriptionEndsAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => { onClose(); onUpgradeClick(); }}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0a84ff, #bf5af2)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Upgrade / Renew Pass
          </button>

          <button
            onClick={() => { onClose(); onSignOut(); }}
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              border: '1px solid #2a2a2c',
              backgroundColor: '#1c1c1e',
              color: '#ff453a',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}