// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [usageData, setUsageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        router.push("/studio");
        return;
      }
      
      setUser(session.user);

      // Fetch subscription data
      const { data } = await supabase
        .from("usage_tracking")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (data) {
        setUsageData(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#0a84ff] rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate Subscription Status
  const now = new Date();
  const expiryDate = usageData?.subscription_ends_at ? new Date(usageData.subscription_ends_at) : null;
  const isExpired = expiryDate ? now > expiryDate : false;
  
  const activePlan = isExpired ? "free" : (usageData?.plan_tier || "free");
  const isProActive = usageData?.is_pro && !isExpired;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f7] font-sans selection:bg-[#0a84ff] selection:text-white">
      {/* Ambient Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-gradient-to-b from-[#0a84ff]/10 via-[#0a84ff]/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

      {/* Simple Header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/70 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/studio" className="text-sm font-medium text-[#86868b] hover:text-white transition flex items-center gap-2">
            <span>←</span> Back to Studio
          </Link>
          <div className="text-sm font-semibold tracking-wide">Account Profile</div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 relative z-10">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Your Account</h1>

        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-[#141415]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <h2 className="text-xs font-bold text-[#86868b] uppercase tracking-wider mb-6">Profile Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-[#86868b] mb-1 block">Email Address</label>
                <div className="text-base font-medium text-[#f5f5f7]">{user?.email}</div>
              </div>
              <div>
                <label className="text-xs text-[#86868b] mb-1 block">Account ID</label>
                <div className="text-xs font-mono text-[#86868b] bg-[#1c1c1e] px-3 py-1.5 rounded-lg inline-block border border-white/5">
                  {user?.id}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-[#141415]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold text-[#86868b] uppercase tracking-wider">Subscription & Billing</h2>
              {isProActive ? (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20">
                  ACTIVE
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-[#86868b] border border-white/10">
                  FREE TIER
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div>
                <label className="text-xs text-[#86868b] mb-1 block">Current Plan</label>
                <div className="text-xl font-bold text-[#f5f5f7] capitalize">
                  {activePlan} Plan
                </div>
              </div>

              <div>
                <label className="text-xs text-[#86868b] mb-1 block">Access Ends On</label>
                <div className="text-base font-medium text-[#f5f5f7]">
                  {expiryDate && !isExpired 
                    ? expiryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
                    : "N/A (Free)"}
                </div>
              </div>

              <div className="text-right">
                <Link 
                  href="/pricing" 
                  className="inline-block bg-[#0a84ff] hover:bg-[#0071e3] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition shadow-[0_0_15px_rgba(10,132,255,0.3)]"
                >
                  {isProActive ? "Change Plan" : "Upgrade to Pro"}
                </Link>
              </div>
            </div>
          </div>

          {/* Usage Card */}
          <div className="bg-[#141415]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-[#86868b] uppercase tracking-wider mb-2">Generations Used</h2>
              <div className="text-sm text-[#86868b]">
                You have generated <strong className="text-white">{usageData?.count || 0}</strong> emails.
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="text-sm font-medium bg-[#ff3b30]/10 text-[#ff3b30] hover:bg-[#ff3b30]/20 border border-[#ff3b30]/20 px-5 py-2 rounded-full transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}