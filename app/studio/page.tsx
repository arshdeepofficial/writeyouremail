"use client";

// app/studio/page.tsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ModeDock from './components/ModeDock';
import DynamicForm from './components/DynamicForm';
import OutputPanel from './components/OutputPanel';
import HistorySidebar, { HistoryItem } from './components/HistorySidebar';
import PricingModal from './components/PricingModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import SupportChatbot from './components/SupportChatbot';
import { useGenerate } from './lib/useGenerate';
import { usePlanGate } from './lib/usePlanGate';
import { PlanTier } from './lib/modeSchemas';
import { Sparkles, Zap, User, LogOut } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function StudioPage() {
  const [user, setUser] = useState<any>(null);
  const [userTier, setUserTier] = useState<PlanTier>('free');
  const [usageCount, setUsageCount] = useState<number>(0);
  const [subscriptionEndsAt, setSubscriptionEndsAt] = useState<string | null>(null);
  const [selectedModeId, setSelectedModeId] = useState<string>('create');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState<number>(0);
  const [latestHistoryItem, setLatestHistoryItem] = useState<HistoryItem | null>(null);

  // Modals
  const [showPricing, setShowPricing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signup');

  const { generate, isGenerating, genError, setGenError } = useGenerate();
  const { canAccessMode, hasCredits, getCreditsRemainingStatus } = usePlanGate(
    userTier,
    usageCount,
    !user
  );

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
        setSubscriptionEndsAt(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('usage_tracking')
        .select('count, plan_tier, subscription_ends_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (data) {
        setUserTier((data.plan_tier as PlanTier) || 'free');
        setUsageCount(data.count || 0);
        setSubscriptionEndsAt(data.subscription_ends_at || null);
      } else {
        await supabase.from('usage_tracking').insert({
          user_id: userId,
          count: 0,
          plan_tier: 'free',
          last_reset: new Date().toISOString()
        });
        setUserTier('free');
        setUsageCount(0);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
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
          setUsageCount(prev => prev + 1);
        }
      }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserTier('free');
    setUsageCount(0);
    setSubscriptionEndsAt(null);
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
      {/* Top Bar */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

          {/* User Account Button */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setShowProfile(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  backgroundColor: '#1c1c1e',
                  border: '1px solid #2a2a2c',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '10px', backgroundColor: '#0a84ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={12} color="#fff" />
                </div>
                <span>{user.email}</span>
              </button>

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

      {/* Main Studio Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ModeDock
          selectedModeId={selectedModeId}
          onSelectMode={(modeId) => {
            setSelectedModeId(modeId);
            setFormData({});
            setGenError(null);
          }}
          canAccessMode={canAccessMode}
          onUpgradeClick={() => setShowPricing(true)}
        />

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

        <OutputPanel
          result={aiOutput}
          isGenerating={isGenerating}
          error={genError}
        />

        <HistorySidebar
          userId={user?.id}
          refreshTrigger={historyRefresh}
          latestItem={latestHistoryItem}
          onSelectHistory={(content) => setAiOutput(content)}
        />
      </div>

      {/* Modals */}
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
            setSubscriptionEndsAt(endsAt);
            setUsageCount(0);
            setShowPricing(false);
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

      {showProfile && user && (
        <ProfileModal
          user={user}
          userTier={userTier}
          usageCount={usageCount}
          subscriptionEndsAt={subscriptionEndsAt}
          onClose={() => setShowProfile(false)}
          onUpgradeClick={() => setShowPricing(true)}
          onSignOut={handleSignOut}
        />
      )}

      <SupportChatbot />

      <style jsx global>{`
        * { box-sizing: border-box; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}