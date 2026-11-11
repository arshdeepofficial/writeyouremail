// app/studio/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ModeDock from './components/ModeDock';
import DynamicForm from './components/DynamicForm';
import OutputPanel from './components/OutputPanel';
import HistorySidebar from './components/HistorySidebar';
import PricingModal from './components/PricingModal';
import AuthModal from './components/AuthModal';
import SupportChatbot from './components/SupportChatbot';
import { useGenerate } from './lib/useGenerate';
import { usePlanGate } from './lib/usePlanGate';
import { PlanTier, MODES } from './lib/modeSchemas';
import { Sparkles, User, Zap, LogOut } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function StudioPage() {
  // State
  const [user, setUser] = useState<any>(null);
  const [userTier, setUserTier] = useState<PlanTier>('free');
  const [usageCount, setUsageCount] = useState<number>(0);
  const [selectedModeId, setSelectedModeId] = useState<string>('create');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState<number>(0);

  // Modals
  const [showPricing, setShowPricing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signup');

  // Custom Hooks
  const { generate, isGenerating, genError, setGenError } = useGenerate();
  const { canAccessMode, hasCredits, getCreditsRemainingStatus } = usePlanGate(
    userTier,
    usageCount,
    !user
  );

  // Fetch session & user subscription info
  useEffect(() => {
    async function loadUserSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchUserData(session.user.id);
      }
    }

    loadUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser.id);
      } else {
        setUserTier('free');
        setUsageCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('count, plan_tier, subscription_ends_at')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Record doesn't exist yet, insert default
        await supabase.from('usage_tracking').insert({
          user_id: userId,
          count: 0,
          plan_tier: 'free',
          last_reset: new Date().toISOString()
        });
        setUserTier('free');
        setUsageCount(0);
        return;
      }

      if (data) {
        setUserTier((data.plan_tier as PlanTier) || 'free');
        setUsageCount(data.count || 0);
      }
    } catch (err) {
      console.error("Error fetching user usage data:", err);
    }
  };

  const handleFormChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiOutput(null);

    await generate(selectedModeId, formData, user?.id, {
      onSuccess: (result, newCount) => {
        setAiOutput(result);
        if (user) {
          setUsageCount(newCount);
          setHistoryRefresh(prev => prev + 1);
        } else {
          setUsageCount(prev => prev + 1); // Local guest count increment
        }
      }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserTier('free');
    setUsageCount(0);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#000000',
      color: '#ffffff',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", Roboto, sans-serif'
    }}>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ─── TOP NAVIGATION BAR ─── */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header style={{
        height: '60px',
        borderBottom: '1px solid #2a2a2c',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0a84ff, #bf5af2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px' }}>
            WriteYourEmail<span style={{ color: '#0a84ff' }}>.com</span>
          </span>
        </div>

        {/* Right Section: Status, Upgrade & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Usage Badge */}
          <div style={{
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: '#1c1c1e',
            border: '1px solid #2a2a2c',
            fontSize: '12px',
            color: '#a1a1a6',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Zap size={14} color="#0a84ff" />
            {getCreditsRemainingStatus()}
          </div>

          {/* Upgrade Button */}
          <button
            onClick={() => setShowPricing(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #0a84ff, #bf5af2)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(10,132,255,0.3)'
            }}
          >
            Upgrade Plan
          </button>

          {/* User Account Button / Sign In */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#8e8e93' }}>{user.email}</span>
              <button
                onClick={handleSignOut}
                style={{
                  background: '#1c1c1e',
                  border: '1px solid #2a2a2c',
                  color: '#ff453a',
                  padding: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setAuthInitialMode('signin'); setShowAuth(true); }}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1px solid #2a2a2c',
                backgroundColor: '#1c1c1e',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ─── STUDIO MAIN WORKSPACE ─── */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Column: 30 Omni-Channel Mode Dock */}
        <ModeDock
          selectedModeId={selectedModeId}
          onSelectMode={(modeId) => {
            setSelectedModeId(modeId);
            setFormData({}); // Reset form inputs when switching mode
            setGenError(null);
          }}
          canAccessMode={canAccessMode}
          onUpgradeClick={() => setShowPricing(true)}
        />

        {/* Center-Left Column: Dynamic Input Form */}
        <div 
          className="hide-scrollbar"
          style={{
            width: '420px',
            borderRight: '1px solid #2a2a2c',
            backgroundColor: '#0a0a0a',
            padding: '24px',
            overflowY: 'auto',
            flexShrink: 0
          }}
        >
          <DynamicForm
            modeId={selectedModeId}
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
            isGenerating={isGenerating}
            hasCredits={hasCredits()}
          />
        </div>

        {/* Center-Right Column: Generated AI Output Panel */}
        <OutputPanel
          result={aiOutput}
          isGenerating={isGenerating}
          error={genError}
        />

        {/* Rightmost Column: History Sidebar */}
        <HistorySidebar
          userId={user?.id}
          refreshTrigger={historyRefresh}
          onSelectHistory={(content) => setAiOutput(content)}
        />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ─── MODALS & FLOATING ASSISTANT ─── */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showPricing && (
        <PricingModal
          userId={user?.id}
          onClose={() => setShowPricing(false)}
          onRequireAuth={() => {
            setShowPricing(false);
            setAuthInitialMode('signup');
            setShowAuth(true);
          }}
          onSuccess={(newTier, endsAt) => {
            setUserTier(newTier);
            setUsageCount(0);
            setShowPricing(false);
            alert(`Plan upgraded to ${newTier.toUpperCase()}! Your 30-day access is now active.`);
          }}
        />
      )}

      {showAuth && (
        <AuthModal
          initialMode={authInitialMode}
          onClose={() => setShowAuth(false)}
          onAuthSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setShowAuth(false);
          }}
        />
      )}

      {/* Inline Support Chatbot */}
      <SupportChatbot />

      {/* Global CSS resets for smooth scrollbars */}
      <style jsx global>{`
        * { box-sizing: border-box; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}