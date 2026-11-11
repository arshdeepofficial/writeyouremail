// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import { MODES, PlanTier } from "../../studio/lib/modeSchemas";

export const maxDuration = 30;

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// Initialize Groq SDK
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const USAGE_LIMITS: Record<PlanTier, number> = {
  free: 5,
  starter: 50,
  growth: 999999, // Unlimited
  enterprise: 999999, // Unlimited
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { modeId, formData, userId } = body;

    if (!modeId || !formData) {
      return NextResponse.json(
        { error: "Missing required fields (modeId, formData)" },
        { status: 400 }
      );
    }

    let newUsageCount = 1;
    let planTier: PlanTier = "free";

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ─── 1. VERIFY & UPDATE USAGE LIMITS (Safe Auto-Upsert) ───
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (userId) {
      try {
        const { data: usageData, error: usageError } = await supabase
          .from("usage_tracking")
          .select("count, plan_tier, subscription_ends_at")
          .eq("user_id", userId)
          .maybeSingle(); // Safe query: returns null if row doesn't exist instead of throwing error

        if (usageError) {
          console.warn("Usage fetch warning (defaulting to free):", usageError);
        }

        const currentCount = usageData?.count ?? 0;
        planTier = (usageData?.plan_tier as PlanTier) || "free";
        const limit = USAGE_LIMITS[planTier] || 5;

        // Check prepaid expiration if paid user
        if (planTier !== "free" && usageData?.subscription_ends_at) {
          const endsAt = new Date(usageData.subscription_ends_at).getTime();
          if (Date.now() > endsAt) {
            return NextResponse.json(
              { error: "Subscription expired. Please renew your plan." },
              { status: 403 }
            );
          }
        }

        // Check credit limit
        if (currentCount >= limit) {
          return NextResponse.json(
            { error: `You have reached your limit of ${limit} generations. Please upgrade to continue.` },
            { status: 403 }
          );
        }

        newUsageCount = currentCount + 1;
      } catch (dbErr) {
        console.warn("Database pre-check error (proceeding as free):", dbErr);
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ─── 2. CONSTRUCT PROMPT ───
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const modeConfig = MODES.find((m) => m.id === modeId);
    if (!modeConfig) {
      return NextResponse.json({ error: "Invalid mode selected" }, { status: 400 });
    }

    let promptData = "";
    for (const [key, value] of Object.entries(formData)) {
      const fieldConfig = modeConfig.fields.find((f) => f.id === key);
      const label = fieldConfig ? fieldConfig.label : key;
      promptData += `- ${label}: ${value}\n`;
    }

    const systemPrompt = `You are an elite, world-class copywriter and sales strategist. 
Your task is to generate a highly converting message for the following category: ${modeConfig.name}.
Goal: ${modeConfig.description}

Here are the specific inputs provided by the user:
${promptData}

INSTRUCTIONS:
1. Write ONLY the final output. Do not include conversational filler like "Here is your email:" or "Hope this helps!".
2. Optimize for maximum conversion, psychological impact, and clarity.
3. Keep it professional, highly personalized, and tailored to the platform format.`;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ─── 3. CALL ACTIVE AI MODELS ───
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const models = [
      "llama-3.3-70b-versatile",
      "llama-3.1-70b-versatile",
      "llama-3.1-8b-instant",
      "gemma2-9b-it"
    ];

    let aiResult = "";
    let lastError = null;

    for (const model of models) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [{ role: "system", content: systemPrompt }],
          model: model,
          temperature: 0.7,
          max_tokens: 1024,
        });

        if (completion.choices?.[0]?.message?.content) {
          aiResult = completion.choices[0].message.content.trim();
          break; // Success!
        }
      } catch (err) {
        console.warn(`Model ${model} failed, trying fallback...`, err);
        lastError = err;
      }
    }

    if (!aiResult) {
      console.error("All AI models failed:", lastError);
      return NextResponse.json(
        { error: "AI service is currently busy. Please click Generate again." },
        { status: 503 }
      );
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ─── 4. LOG TO DATABASE (UPSERT AUTO-CREATES MISSING ROWS) ───
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (userId) {
      try {
        // Automatically creates row if missing or updates if existing
        await supabase.from("usage_tracking").upsert({
          user_id: userId,
          count: newUsageCount,
          plan_tier: planTier,
          last_reset: new Date().toISOString(),
        }, { onConflict: "user_id" });

        // Save email history
        await supabase.from("emails").insert({
          user_id: userId,
          mode: modeId,
          content: aiResult,
          created_at: new Date().toISOString(),
        });
      } catch (saveErr) {
        console.warn("Failed to persist history/usage (non-fatal):", saveErr);
      }
    }

    return NextResponse.json({
      result: aiResult,
      newUsageCount: newUsageCount,
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}