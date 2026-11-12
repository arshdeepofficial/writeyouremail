// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import { MODES, PlanTier } from "../../studio/lib/modeSchemas";

export const maxDuration = 30;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

const USAGE_LIMITS: Record<PlanTier, number> = {
  free: 5,
  starter: 50,
  growth: 999999,
  enterprise: 999999,
};

// Local spam lexicon for offline scoring / emergency fallback
const SPAM_LEXICON = [
  "free",
  "act now",
  "limited time",
  "click here",
  "buy now",
  "congratulations",
  "winner",
  "cash",
  "prize",
  "risk-free",
  "guarantee",
  "no obligation",
  "urgent",
  "$$$",
  "100%",
  "double your",
  "make money",
  "work from home",
  "congratulations!",
  "exclusive deal",
  "once in a lifetime",
];

function scoreDeliverability(text: string) {
  const lower = (text || "").toLowerCase();
  const triggers = SPAM_LEXICON.filter((w) => lower.includes(w));
  let score = 100;
  score -= triggers.length * 8;
  const caps = (text.match(/\b[A-Z]{4,}\b/g) || []).length;
  score -= caps * 3;
  const bangs = (text.match(/!/g) || []).length;
  score -= Math.max(0, bangs - 1) * 4;
  if ((text || "").length > 1200) score -= 5;
  if ((text || "").length < 40) score -= 10;
  return {
    spamScore: Math.max(0, Math.min(100, score)),
    spamTriggers: triggers,
  };
}

function buildFallbackPayload(formData: Record<string, any>, modeName: string) {
  const values = Object.values(formData || {}).filter(Boolean);
  const target =
    formData.company ||
    formData.prospect_name ||
    formData.target_audience ||
    "Team";
  const valueProp =
    formData.value_prop ||
    formData.solution ||
    formData.offer ||
    values[1] ||
    "our solutions";
  const callToAction =
    formData.call_to_action ||
    formData.ask ||
    "Would you be open to a 10-minute call next week?";
  const name = formData.prospect_name || "there";

  const subject = `Quick question regarding ${target}`;
  const body = `Hi ${name},

I noticed your work with ${target} and wanted to reach out directly.

We help teams tackle ${formData.pain_point || "key bottlenecks"} by leveraging ${valueProp}.

${callToAction}

Best regards,
[Your Name]`;

  const { spamScore, spamTriggers } = scoreDeliverability(`${subject}\n${body}`);

  return {
    subject,
    subjectVariations: [
      subject,
      `Idea for ${target}`,
      `Noticed something at ${target}`,
      `Worth 10 minutes?`,
      `Quick thought on ${formData.pain_point || "growth"}`,
    ],
    body,
    spamScore,
    spamTriggers,
    sanitizedBody: body
      .replace(/\bfree\b/gi, "complimentary")
      .replace(/\bact now\b/gi, "when you have a moment")
      .replace(/\bclick here\b/gi, "see details")
      .replace(/\bbuy now\b/gi, "get started")
      .replace(/\burgent\b/gi, "timely"),
    deliverabilityAdvice:
      spamScore >= 80
        ? "Clean copy — strong inbox potential."
        : "Tone down hype words and excessive punctuation for better placement.",
    plainText: body,
  };
}

function safeParseAiJson(raw: string) {
  try {
    // Strip markdown fences if model wraps JSON
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

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

    if (userId) {
      try {
        const { data: usageData } = await supabase
          .from("usage_tracking")
          .select("count, plan_tier, subscription_ends_at")
          .eq("user_id", userId)
          .maybeSingle();

        const currentCount = usageData?.count ?? 0;
        planTier = (usageData?.plan_tier as PlanTier) || "free";
        const limit = USAGE_LIMITS[planTier] || 5;

        if (planTier !== "free" && usageData?.subscription_ends_at) {
          const endsAt = new Date(usageData.subscription_ends_at).getTime();
          if (Date.now() > endsAt) {
            return NextResponse.json(
              { error: "Subscription expired. Please renew your plan." },
              { status: 403 }
            );
          }
        }

        if (currentCount >= limit) {
          return NextResponse.json(
            {
              error: `You have reached your limit of ${limit} generations. Please upgrade to continue.`,
            },
            { status: 403 }
          );
        }

        newUsageCount = currentCount + 1;
      } catch (dbErr) {
        console.warn("Database usage check warning:", dbErr);
      }
    }

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

    const systemPrompt = `You are an elite copywriter AND email deliverability expert.
Generate outreach for: ${modeConfig.name}
Goal: ${modeConfig.description}

User inputs:
${promptData}

Return ONLY valid JSON (no markdown, no commentary) with this exact shape:
{
  "subject": "best primary subject line",
  "subjectVariations": ["var1", "var2", "var3", "var4", "var5"],
  "body": "full message body only, no subject prefix",
  "spamScore": 0-100,
  "spamTriggers": ["words/phrases that hurt inbox placement"],
  "sanitizedBody": "same message with spammy words replaced by natural synonyms",
  "deliverabilityAdvice": "one short actionable sentence",
  "plainText": "plain-text version of body without markdown"
}

Rules:
- spamScore 100 = safest inbox placement; deduct for ALL CAPS, $$$, hype, urgency spam, misleading claims.
- subjectVariations must be 5 distinct, short, curiosity/value-led lines.
- body must be ready to send for the target channel.
- No filler like "Here is your email".`;

    const models = [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "gemma2-9b-it",
    ];

    let aiPayload: any = null;
    let rawText = "";

    if (groq) {
      for (const model of models) {
        try {
          const completion = await groq.chat.completions.create({
            messages: [{ role: "system", content: systemPrompt }],
            model,
            temperature: 0.7,
            max_tokens: 1400,
          });

          const content = completion.choices?.[0]?.message?.content?.trim();
          if (!content) continue;

          rawText = content;
          const parsed = safeParseAiJson(content);
          if (parsed && (parsed.body || parsed.subject)) {
            aiPayload = parsed;
            break;
          }
        } catch (err) {
          console.warn(`Groq model ${model} error:`, err);
        }
      }
    }

    // If model returned prose instead of JSON, wrap it
    if (!aiPayload && rawText) {
      const { spamScore, spamTriggers } = scoreDeliverability(rawText);
      const firstLine = rawText.split("\n").find((l) => l.trim()) || "Quick question";
      aiPayload = {
        subject: firstLine.replace(/^subject:\s*/i, "").slice(0, 90),
        subjectVariations: [
          firstLine.replace(/^subject:\s*/i, "").slice(0, 90),
          "Quick question",
          "Noticed something",
          "Worth a quick look?",
          "Idea for you",
        ],
        body: rawText.replace(/^subject:.*\n+/i, "").trim(),
        spamScore,
        spamTriggers,
        sanitizedBody: rawText,
        deliverabilityAdvice: "Review caps and hype words before sending.",
        plainText: rawText.replace(/^subject:.*\n+/i, "").trim(),
      };
    }

    // Emergency local fallback (Groq down / empty)
    if (!aiPayload) {
      aiPayload = buildFallbackPayload(formData, modeConfig.name);
    }

    // Normalize + re-score locally so UI never gets missing fields
    const bodyText = String(aiPayload.body || "");
    const subjectText = String(aiPayload.subject || "Quick question");
    const local = scoreDeliverability(`${subjectText}\n${bodyText}`);

    const normalized = {
      subject: subjectText,
      subjectVariations: Array.isArray(aiPayload.subjectVariations)
        ? aiPayload.subjectVariations.slice(0, 5)
        : [subjectText],
      body: bodyText,
      spamScore:
        typeof aiPayload.spamScore === "number"
          ? Math.max(0, Math.min(100, aiPayload.spamScore))
          : local.spamScore,
      spamTriggers: Array.isArray(aiPayload.spamTriggers)
        ? aiPayload.spamTriggers
        : local.spamTriggers,
      sanitizedBody: String(aiPayload.sanitizedBody || bodyText),
      deliverabilityAdvice: String(
        aiPayload.deliverabilityAdvice ||
          "Keep it short, specific, and free of hype for better inbox rate."
      ),
      plainText: String(aiPayload.plainText || bodyText),
    };

    // Store a readable string in DB + full JSON in result for the UI
    const contentForDb = `Subject: ${normalized.subject}\n\n${normalized.body}`;

    let createdHistoryRecord = {
      id: Date.now().toString(),
      mode: modeId,
      content: contentForDb,
      created_at: new Date().toISOString(),
    };

    if (userId) {
      try {
        await supabase.from("usage_tracking").upsert(
          {
            user_id: userId,
            count: newUsageCount,
            plan_tier: planTier,
            last_reset: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        const { data: historyData } = await supabase
          .from("emails")
          .insert({
            user_id: userId,
            mode: modeId,
            content: contentForDb,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (historyData) {
          createdHistoryRecord = historyData;
        }
      } catch (saveErr) {
        console.warn("Usage logging warning:", saveErr);
      }
    }

    return NextResponse.json({
      // `result` is now the rich object (OutputPanel reads this)
      result: normalized,
      // keep string mirror for anything still expecting text
      resultText: contentForDb,
      newUsageCount,
      historyItem: {
        ...createdHistoryRecord,
        // attach rich payload so History can re-open scorecard later if needed
        rich: normalized,
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}