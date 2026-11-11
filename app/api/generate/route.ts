// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import { MODES, PlanTier } from "../../studio/lib/modeSchemas";

// Vercel Serverless Function timeout configuration
export const maxDuration = 30;

// Initialize Supabase Service Role Client (Bypasses RLS to update usage securely)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
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

    let newUsageCount = 0;
    let planTier: PlanTier = "free";

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ─── 1. VERIFY & UPDATE USAGE LIMITS (If Logged In) ───
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (userId) {
      const { data: usageData, error: usageError } = await supabase
        .from("usage_tracking")
        .select("count, plan_tier, subscription_ends_at, last_reset")
        .eq("user_id", userId)
        .single();

      if (usageError) {
        console.error("Usage fetch error:", usageError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      const currentCount = usageData?.count || 0;
      planTier = (usageData?.plan_tier as PlanTier) || "free";
      const limit = USAGE_LIMITS[planTier] || 5;
      
      // Enforce prepaid expiration if not free
      if (planTier !== "free" && usageData?.subscription_ends_at) {
        const endsAt = new Date(usageData.subscription_ends_at).getTime();
        if (Date.now() > endsAt) {
          return NextResponse.json({ error: "Subscription expired. Please renew." }, { status: 403 });
        }
      }

      if (currentCount >= limit) {
        return NextResponse.json(
          { error: `You have reached your limit of ${limit} generations.` },
          { status: 403 }
        );
      }

      newUsageCount = currentCount + 1;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ─── 2. CONSTRUCT THE AI PROMPT DYNAMICALLY ───
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const modeConfig = MODES.find((m) => m.id === modeId);
    if (!modeConfig) {
      return NextResponse.json({ error: "Invalid mode selected" }, { status: 400 });
    }

    let promptData = "";
    for (const [key, value] of Object.entries(formData)) {
      // Find the label for better AI context
      const fieldConfig = modeConfig.fields.find(f => f.id === key);
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
3. Keep it professional, highly personalized, and tailored to the platform format (e.g., short for SMS/Twitter, structured for Email).`;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ─── 3. CALL THE AI (Zero Error Fallback Array) ───
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    // Per your instructions, using "openai/gpt-oss-20b" as primary. 
    // If that specific node drops, we silently cascade to ultra-reliable active models.
    const models = [
      "openai/gpt-oss-20b", 
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant"
    ];

    let aiResult = "";
    let lastError = null;

    for (const model of models) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
          ],
          model: model,
          temperature: 0.7,
          max_tokens: 1024,
        });

        if (completion.choices?.[0]?.message?.content) {
          aiResult = completion.choices[0].message.content.trim();
          break; // Success! Exit the loop.
        }
      } catch (err) {
        console.warn(`Model ${model} failed, trying next...`, err);
        lastError = err;
      }
    }

    if (!aiResult) {
      console.error("All AI models failed:", lastError);
      return NextResponse.json(
        { error: "AI service is currently experiencing heavy load. Please try again." },
        { status: 503 }
      );
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ─── 4. LOG SUCCESS TO DATABASE ───
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (userId) {
      // 1. Update Usage
      await supabase
        .from("usage_tracking")
        .update({ count: newUsageCount })
        .eq("user_id", userId);

      // 2. Log History
      await supabase.from("emails").insert({
        user_id: userId,
        mode: modeId,
        content: aiResult,
        created_at: new Date().toISOString(),
      });
    }

    // Return successfully to frontend hook
    return NextResponse.json({ 
      result: aiResult,
      newUsageCount: newUsageCount
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}