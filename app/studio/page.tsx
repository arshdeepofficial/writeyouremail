'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { MODES, ModeConfig, PlanTier, FormField } from './lib/modeSchemas';
import {
  Mail,
  Sparkles,
  MessageSquare,
  RefreshCw,
  Inbox,
  Share2,
  MessageCircle,
  Video,
  Briefcase,
  Send,
  ListOrdered,
  Hash,
  Gamepad2,
  PhoneCall,
  Smartphone,
  AtSign,
  Mailbox,
  Table,
  Music,
  Mic,
  Voicemail,
  Shield,
  Users,
  Calendar,
  Target,
  Layers,
  Crown,
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  History,
  Search,
  FileText,
  Menu,
  X,
  Lock,
  ChevronDown,
  User,
  LogOut,
  LogIn,
  ShieldCheck,
  Building
} from 'lucide-react';

// Initialize Supabase Client dynamically
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Safe Lucide Icon mapping for modeSchemas iconName strings
const ICON_MAP: Record<string, React.ElementType> = {
  Mail,
  Sparkles,
  MessageSquareReply: MessageSquare,
  MessageSquare,
  RefreshCw,
  Inbox,
  Linkedin: Share2,
  Twitter: Share2,
  MessageCircle,
  Video,
  Briefcase,
  Send,
  Instagram: MessageCircle,
  ListOrdered,
  Hash,
  Gamepad2,
  PhoneCall,
  Smartphone,
  Reddit: MessageCircle,
  AtSign,
  Mailbox,
  Table,
  Music,
  Mic,
  Voicemail,
  Facebook: MessageSquare,
  Shield,
  Users,
  Calendar,
  Target,
  Building,
  Crown
};

interface AiGeneratedResult {
  subject: string;
  subjectVariations?: string[];
  body: string;
  spamScore: number;
  spamTriggers: string[];
  sanitizedBody?: string;
  deliverabilityAdvice?: string;
  plainText?: string;
}

export default function StudioPage() {
  // User Authentication & Plan State
  const [user, setUser] = useState<any>(null);
  const [planTier, setPlanTier] = useState<PlanTier>('free');
  const [usageCount, setUsageCount] = useState<number>(0);
  const [usageLimit, setUsageLimit] = useState<number>(5);

  // Profile Menu & Auth Modal State
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Strategy Sidebar & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<ModeConfig>(MODES[0]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamic Form Field State Map
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Generation & Output State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genResult, setGenResult] = useState<AiGeneratedResult | null>(null);
  const [activeSubjectTab, setActiveSubjectTab] = useState<number>(0);
  const [showSanitized, setShowSanitized] = useState<boolean>(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Recent History & Feedback State
  const [history, setHistory] = useState<Array<{ id: string; subject: string; body: string; mode: string; date: string }>>([]);
  const [copiedSubject, setCopiedSubject] = useState<boolean>(false);
  const [copiedBody, setCopiedBody] = useState<boolean>(false);

  // Load User Data & Setup Realtime Auth Listener
  useEffect(() => {
    async function loadUserData(currentUser: any) {
      if (!supabase || !currentUser) {
        setUser(null);
        setPlanTier('free');
        setUsageCount(0);
        setUsageLimit(5);
        return;
      }

      setUser(currentUser);

      try {
        const { data } = await supabase
          .from('usage_tracking')
          .select('plan_tier, count, subscription_ends_at')
          .eq('user_id', currentUser.id)
          .maybeSingle();

        if (data) {
          const tier = (data.plan_tier as PlanTier) || 'free';
          setPlanTier(tier);
          setUsageCount(data.count || 0);
          setUsageLimit(
            tier === 'starter' ? 50 : tier === 'growth' || tier === 'enterprise' ? 999999 : 5
          );
        }
      } catch (err) {
        console.warn('Error fetching usage tracking:', err);
      }
    }

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        loadUserData(session?.user || null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        loadUserData(session?.user || null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Reset/Initialize form fields when selected mode changes
  useEffect(() => {
    const initialForm: Record<string, string> = {};
    selectedMode.fields.forEach((field) => {
      if (field.type === 'select' && field.options && field.options.length > 0) {
        initialForm[field.id] = field.options[0].value;
      } else {
        initialForm[field.id] = '';
      }
    });
    setFormData(initialForm);
    setGenError(null);
  }, [selectedMode]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  // Auth Operations
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!supabase) {
      setAuthError('Authentication service unavailable.');
      return;
    }

    if (!authEmail || !authPassword) {
      setAuthError('Please fill in all email and password fields.');
      return;
    }

    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword
        });
        if (error) throw error;
      }

      setIsAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setPlanTier('free');
    setUsageCount(0);
    setUsageLimit(5);
    setIsProfileMenuOpen(false);
  };

  const categories = ['All', 'starter', 'growth', 'enterprise'];

  const filteredModes = MODES.filter((m) => {
    const matchesCategory = selectedCategory === 'All' || m.tier === selectedCategory.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Generation Request to /api/generate
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenError(null);

    // Enforce Plan Tier Lock
    if (planTier === 'free' && selectedMode.tier !== 'starter') {
      setGenError(`The "${selectedMode.name}" mode requires a ${selectedMode.tier.toUpperCase()} pass. Please upgrade your plan.`);
      return;
    }

    // Validate Required Fields
    for (const field of selectedMode.fields) {
      if (field.required && (!formData[field.id] || !formData[field.id].trim())) {
        setGenError(`Please fill out the required field: ${field.label}.`);
        return;
      }
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modeId: selectedMode.id,
          formData,
          userId: user?.id || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate email copy. Please try again.');
      }

      if (data.result) {
        setGenResult(data.result);
        setActiveSubjectTab(0);
        setShowSanitized(false);

        setHistory((prev) => [
          {
            id: Date.now().toString(),
            subject: data.result.subject,
            body: data.result.body,
            mode: selectedMode.name,
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          ...prev.slice(0, 9)
        ]);
      }

      if (typeof data.newUsageCount === 'number') {
        setUsageCount(data.newUsageCount);
      }
    } catch (err: any) {
      setGenError(err.message || 'An unexpected error occurred while generating email.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentSubject =
    genResult?.subjectVariations && genResult.subjectVariations[activeSubjectTab]
      ? genResult.subjectVariations[activeSubjectTab]
      : genResult?.subject || '';

  const currentBody =
    showSanitized && genResult?.sanitizedBody
      ? genResult.sanitizedBody
      : genResult?.body || '';

  const copyToClipboard = (text: string, isSubject: boolean) => {
    navigator.clipboard.writeText(text);
    if (isSubject) {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } else {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };

  const ModeIcon = ICON_MAP[selectedMode.iconName] || Mail;

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 flex flex-col font-sans selection:bg-[#0a84ff] selection:text-white relative">
      {/* Studio Header */}
      <header className="sticky top-0 z-40 border-b border-[#222224] bg-[#000000]/80 backdrop-blur-md px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0a84ff] to-[#bf5af2] flex items-center justify-center font-bold text-white shadow-lg shadow-[#0a84ff]/20">
              W
            </div>
            <span className="font-semibold text-lg tracking-tight text-white group-hover:text-[#0a84ff] transition-colors">
              WriteYourEmail<span className="text-[#0a84ff]">.com</span>
            </span>
          </Link>
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#1c1c1e] text-gray-400 border border-[#222224]">
            Studio v2.4
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Usage Counter Pill */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#141415] border border-[#222224] text-xs">
            <span className="text-gray-400">Generations:</span>
            <span className="font-bold text-white">
              {usageCount} / {usageLimit > 9000 ? '∞' : usageLimit}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#0a84ff]/20 text-[#0a84ff]">
              {planTier} Tier
            </span>
          </div>

          <Link
            href="/docs"
            className="hidden sm:flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-[#222224] bg-[#141415] hover:bg-[#1c1c1e]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Docs</span>
          </Link>

          <Link
            href="/pricing"
            className="flex items-center space-x-1 text-xs font-medium text-white bg-gradient-to-r from-[#0a84ff] to-[#bf5af2] hover:opacity-90 transition-opacity px-3.5 py-1.5 rounded-lg shadow-md"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Upgrade Pass</span>
          </Link>

          {/* User Auth & Profile Control */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-1.5 pl-2.5 pr-2 rounded-xl bg-[#141415] border border-[#222224] hover:border-[#0a84ff] transition-all text-xs text-white"
              >
                <div className="w-5 h-5 rounded-full bg-[#0a84ff] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {user.email ? user.email.charAt(0) : 'U'}
                </div>
                <span className="hidden sm:inline font-medium max-w-[110px] truncate">
                  {user.email ? user.email.split('@')[0] : 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#141415] border border-[#222224] hover:border-[#0a84ff] transition-colors text-xs font-medium text-white"
              >
                <LogIn className="w-3.5 h-3.5 text-[#0a84ff]" />
                <span>Log In</span>
              </button>
            )}

            {/* Logged-In User Profile Dropdown Menu */}
            {isProfileMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#141415] border border-[#222224] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2.5 border-b border-[#222224] mb-1">
                  <div className="text-xs font-semibold text-white truncate">{user.email}</div>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase bg-[#0a84ff]/20 text-[#0a84ff]">
                      {planTier} Plan
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{usageCount} used</span>
                  </div>
                </div>

                <Link
                  href="/pricing"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-[#1c1c1e] flex items-center justify-between transition-colors mb-1"
                >
                  <div className="flex items-center space-x-2">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Manage Subscription</span>
                  </div>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 flex items-center space-x-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Drawer Button (< lg screens) */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-[#141415] border border-[#222224] text-gray-300 hover:text-white"
            aria-label="Open Strategy Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main 3-Column Studio Layout */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-3 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMN 1: Categorized Modes Sidebar (Desktop View) */}
        <aside className="hidden lg:block lg:col-span-3 bg-[#141415] border border-[#222224] rounded-2xl p-4 flex flex-col h-[calc(100vh-110px)] sticky top-[80px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#222224] mb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#0a84ff]" />
              <h2 className="font-semibold text-sm text-white">Outreach Strategies</h2>
            </div>
            <span className="text-xs text-gray-400 font-mono">{MODES.length} Modes</span>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1c1e] border border-[#222224] text-xs text-white rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-[#0a84ff] transition-colors placeholder:text-gray-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex space-x-1 overflow-x-auto pb-2 mb-2 border-b border-[#222224] [::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] capitalize whitespace-nowrap px-2.5 py-1 rounded-md transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0a84ff] text-white font-medium'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1c1c1e]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scrollable Mode List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-xs">
            {filteredModes.map((mode) => {
              const IconComp = ICON_MAP[mode.iconName] || Mail;
              const isSelected = selectedMode.id === mode.id;
              const isLocked = planTier === 'free' && mode.tier !== 'starter';

              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-[#1c1c1e] border-[#0a84ff] shadow-sm'
                      : 'bg-[#141415] border-transparent hover:bg-[#1c1c1e] hover:border-[#222224]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2 font-medium text-white truncate">
                      <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0a84ff]' : 'text-gray-400'}`} />
                      <span className="truncate">{mode.name}</span>
                    </div>
                    {isLocked ? (
                      <Lock className="w-3 h-3 text-gray-500" />
                    ) : (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                          mode.tier === 'starter'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : mode.tier === 'growth'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {mode.tier}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-1">{mode.description}</p>
                </button>
              );
            })}
          </div>
        </aside>

        {/* COLUMN 2: Dynamic Form for Active Strategy */}
        <section className="lg:col-span-5 bg-[#141415] border border-[#222224] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            {/* Header for Active Strategy */}
            <div className="flex items-start justify-between pb-4 border-b border-[#222224] mb-5">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20">
                  <ModeIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="font-semibold text-base text-white">{selectedMode.name}</h1>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#1c1c1e] text-gray-400 border border-[#222224]">
                      {selectedMode.tier} tier
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedMode.description}</p>
                </div>
              </div>
            </div>

            {/* Inline Error Card */}
            {genError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{genError}</span>
                </div>
                {genError.includes('upgrade') && (
                  <Link href="/pricing" className="underline font-semibold ml-2">Upgrade</Link>
                )}
              </div>
            )}

            {/* Dynamic Form Control Generator */}
            <form onSubmit={handleGenerate} className="space-y-4">
              {selectedMode.fields.map((field: FormField) => (
                <div key={field.id}>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      placeholder={field.placeholder || ''}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full bg-[#1c1c1e] border border-[#222224] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#0a84ff] transition-colors resize-none placeholder:text-gray-500 font-sans"
                      required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.id] || (field.options && field.options[0]?.value) || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full bg-[#1c1c1e] border border-[#222224] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#0a84ff] transition-colors"
                      required={field.required}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={field.placeholder || ''}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full bg-[#1c1c1e] border border-[#222224] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0a84ff] transition-colors placeholder:text-gray-500"
                      required={field.required}
                    />
                  )}
                </div>
              ))}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0a84ff] via-[#30d158] to-[#0a84ff] text-white font-semibold text-xs tracking-wide hover:opacity-95 transition-all shadow-lg shadow-[#0a84ff]/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Optimizing Email with Llama 3.3 70B...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Email & Analyze Deliverability</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222224] text-[11px] text-gray-500 flex items-center justify-between">
            <span>Powered by Groq Llama 3.3 70B</span>
            <span>Zero Spam Rate Audit</span>
          </div>
        </section>

        {/* COLUMN 3: Deliverability Scorecard & Output Panel */}
        <section className="lg:col-span-4 space-y-4">
          <div className="bg-[#141415] border border-[#222224] rounded-2xl p-5 flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#222224] mb-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#30d158]" />
                  <h2 className="font-semibold text-sm text-white">Deliverability Output</h2>
                </div>
                {genResult && (
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono border ${
                      genResult.spamScore >= 80
                        ? 'bg-[#30d158]/10 text-[#30d158] border-[#30d158]/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    Inbox Score: {genResult.spamScore}/100
                  </span>
                )}
              </div>

              {!genResult && !isGenerating && (
                <div className="py-16 text-center text-gray-500 text-xs flex flex-col items-center justify-center space-y-2">
                  <Mail className="w-8 h-8 text-gray-600 stroke-1" />
                  <p>Configure parameters on the left and click Generate.</p>
                  <p className="text-[11px] text-gray-600">Your email copy and deliverability scorecard will appear here.</p>
                </div>
              )}

              {isGenerating && (
                <div className="py-16 text-center text-gray-400 text-xs flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#0a84ff]" />
                  <p>Analyzing spam lexicon & generating copy...</p>
                </div>
              )}

              {genResult && !isGenerating && (
                <div className="space-y-4 text-xs">
                  {/* Subject Line & Variations */}
                  <div className="bg-[#1c1c1e] p-3 rounded-xl border border-[#222224]">
                    <div className="text-[10px] text-gray-400 font-semibold uppercase mb-1 flex justify-between">
                      <span>Subject Line</span>
                      <button
                        onClick={() => copyToClipboard(currentSubject, true)}
                        className="text-[#0a84ff] hover:text-white flex items-center space-x-1"
                      >
                        {copiedSubject ? <Check className="w-3 h-3 text-[#30d158]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSubject ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-white font-medium mb-2">{currentSubject}</div>

                    {genResult.subjectVariations && genResult.subjectVariations.length > 1 && (
                      <div className="flex items-center space-x-1 overflow-x-auto pt-1.5 border-t border-[#222224] [::-webkit-scrollbar]:hidden">
                        <span className="text-[9px] text-gray-500 mr-1">A/B:</span>
                        {genResult.subjectVariations.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveSubjectTab(idx)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                              activeSubjectTab === idx
                                ? 'bg-[#0a84ff] text-white'
                                : 'bg-[#141415] text-gray-400 hover:text-white'
                            }`}
                          >
                            #{idx + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Body & Clean Copy Toggle */}
                  <div className="bg-[#1c1c1e] p-3 rounded-xl border border-[#222224]">
                    <div className="text-[10px] text-gray-400 font-semibold uppercase mb-1 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span>Message Body</span>
                        {genResult.sanitizedBody && (
                          <button
                            type="button"
                            onClick={() => setShowSanitized(!showSanitized)}
                            className={`text-[9px] px-1.5 py-0.2 rounded border ${
                              showSanitized
                                ? 'bg-[#30d158]/20 text-[#30d158] border-[#30d158]/30'
                                : 'bg-[#141415] text-gray-400 border-[#222224]'
                            }`}
                          >
                            {showSanitized ? '✓ Spam-Free Mode' : 'Clean Copy'}
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => copyToClipboard(currentBody, false)}
                        className="text-[#0a84ff] hover:text-white flex items-center space-x-1"
                      >
                        {copiedBody ? <Check className="w-3 h-3 text-[#30d158]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedBody ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-gray-200 whitespace-pre-wrap leading-relaxed font-mono text-[11px] max-h-[220px] overflow-y-auto">
                      {currentBody}
                    </div>
                  </div>

                  {/* Direct Mail Launchers */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${encodeURIComponent(currentSubject)}&body=${encodeURIComponent(currentBody)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#1c1c1e] border border-[#222224] hover:border-[#0a84ff] text-white transition-colors text-[11px] font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                      <span>Launch Gmail</span>
                    </a>
                    <a
                      href={`https://outlook.live.com/mail/0/deeplink/compose?subject=${encodeURIComponent(currentSubject)}&body=${encodeURIComponent(currentBody)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#1c1c1e] border border-[#222224] hover:border-[#0a84ff] text-white transition-colors text-[11px] font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                      <span>Launch Outlook</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Spam Triggers Breakdown */}
            {genResult && (
              <div className="mt-4 pt-3 border-t border-[#222224] text-[11px]">
                <div className="flex items-center justify-between text-gray-400 mb-1">
                  <span>Spam Triggers:</span>
                  <span className={genResult.spamTriggers.length === 0 ? 'text-[#30d158]' : 'text-amber-400'}>
                    {genResult.spamTriggers.length === 0
                      ? '0 Detected (Safe)'
                      : `${genResult.spamTriggers.length} flagged`}
                  </span>
                </div>
                {genResult.deliverabilityAdvice && (
                  <p className="text-[10px] text-gray-400 mt-1 italic">{genResult.deliverabilityAdvice}</p>
                )}
              </div>
            )}
          </div>

          {/* Recent History Panel */}
          <div className="bg-[#141415] border border-[#222224] rounded-2xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#222224] mb-3">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-purple-400" />
                <h3 className="font-semibold text-xs text-white">Recent Generations</h3>
              </div>
              <span className="text-[10px] text-gray-500">{history.length} Saved</span>
            </div>

            {history.length === 0 ? (
              <p className="text-gray-500 text-[11px] text-center py-4">No recent history in this session.</p>
            ) : (
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setGenResult({
                        subject: item.subject,
                        body: item.body,
                        spamScore: 95,
                        spamTriggers: []
                      });
                    }}
                    className="p-2 rounded-lg bg-[#1c1c1e] hover:bg-[#222224] border border-[#222224] cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                      <span className="text-[#0a84ff] font-medium">{item.mode}</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="text-xs text-white truncate font-medium">{item.subject}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MOBILE SLIDE-OVER DRAWER (< lg viewport) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#141415] border-l border-[#222224] h-full p-4 flex flex-col z-10">
            <div className="flex items-center justify-between pb-3 border-b border-[#222224] mb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#0a84ff]" />
                <h2 className="font-semibold text-sm text-white">Select Strategy</h2>
              </div>
              <button onClick={() => setMobileDrawerOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search strategies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c1c1e] border border-[#222224] text-xs text-white rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-[#0a84ff]"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 text-xs">
              {filteredModes.map((mode) => {
                const IconComp = ICON_MAP[mode.iconName] || Mail;
                const isSelected = selectedMode.id === mode.id;

                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setSelectedMode(mode);
                      setMobileDrawerOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-[#1c1c1e] border-[#0a84ff]'
                        : 'bg-[#141415] border-transparent hover:bg-[#1c1c1e]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2 font-medium text-white truncate">
                        <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0a84ff]' : 'text-gray-400'}`} />
                        <span className="truncate">{mode.name}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {mode.tier}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-1">{mode.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL DIALOG (LOGIN / SIGN UP) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141415] border border-[#222224] rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0a84ff] to-[#bf5af2] mx-auto flex items-center justify-center font-bold text-white mb-3 shadow-lg shadow-[#0a84ff]/20">
                W
              </div>
              <h3 className="font-semibold text-lg text-white">
                {authMode === 'login' ? 'Log in to WriteYourEmail' : 'Create your account'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {authMode === 'login'
                  ? 'Access your generated emails and pass status'
                  : 'Start writing deliverability-optimized emails in seconds'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-[#1c1c1e] border border-[#222224] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#0a84ff]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-[#1c1c1e] border border-[#222224] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#0a84ff]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-[#0a84ff] hover:bg-[#0a84ff]/90 text-white font-semibold text-xs tracking-wide transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {authLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#222224] text-center text-xs text-gray-400">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                    className="text-[#0a84ff] font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setAuthMode('login'); setAuthError(null); }}
                    className="text-[#0a84ff] font-semibold hover:underline"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#222224] bg-[#000000] py-4 px-6 text-center text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between">
        <div>© 2025 WriteYourEmail.com. All rights reserved.</div>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <Link href="/pricing" className="hover:text-gray-300">Pricing</Link>
          <Link href="/docs" className="hover:text-gray-300">Documentation</Link>
          <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}