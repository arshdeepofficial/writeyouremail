"use client";
// app/studio/components/AuthModal.tsx
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, Mail, Lock, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({ onClose, onAuthSuccess, initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // Check if session exists (email confirmation disabled or auto-confirmed)
          if (data.session) {
            onAuthSuccess(data.user);
            onClose();
          } else {
            setSuccessMsg('Account created! Please check your email to confirm your sign up.');
          }
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          onAuthSuccess(data.user);
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px 14px 44px',
    backgroundColor: '#1c1c1e',
    border: '1px solid #2a2a2c',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
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
        maxWidth: '440px',
        position: 'relative',
        padding: '36px',
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

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0a84ff, #bf5af2)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 20px rgba(10,132,255,0.3)'
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
            {mode === 'signup' ? 'Create an Account' : 'Welcome Back'}
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#8e8e93' }}>
            {mode === 'signup' 
              ? 'Get 5 free daily AI generations instantly.' 
              : 'Sign in to access your saved history & plans.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: '#0a0a0a',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid #2a2a2c'
        }}>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null); }}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: mode === 'signup' ? '#1c1c1e' : 'transparent',
              color: mode === 'signup' ? '#fff' : '#8e8e93',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); setSuccessMsg(null); }}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: mode === 'signin' ? '#1c1c1e' : 'transparent',
              color: mode === 'signin' ? '#fff' : '#8e8e93',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
        </div>

        {/* Inline Alerts */}
        {error && (
          <div style={{
            marginBottom: '20px',
            padding: '12px 14px',
            backgroundColor: 'rgba(255, 69, 58, 0.12)',
            border: '1px solid rgba(255, 69, 58, 0.3)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#ff9f9c',
            fontSize: '13px'
          }}>
            <AlertCircle size={16} color="#ff453a" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            marginBottom: '20px',
            padding: '12px 14px',
            backgroundColor: 'rgba(48, 209, 88, 0.12)',
            border: '1px solid rgba(48, 209, 88, 0.3)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#75f094',
            fontSize: '13px'
          }}>
            <CheckCircle2 size={16} color="#30d158" style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} color="#8e8e93" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#0a84ff')}
              onBlur={(e) => (e.target.style.borderColor = '#2a2a2c')}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="#8e8e93" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (6+ characters)"
              required
              minLength={6}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#0a84ff')}
              onBlur={(e) => (e.target.style.borderColor = '#2a2a2c')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#0a84ff',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              boxShadow: '0 6px 16px rgba(10,132,255,0.3)'
            }}
          >
            {loading ? 'Processing...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}