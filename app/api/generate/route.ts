import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GROQ_MODELS = [
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768"
];

export async function POST(req: Request) {
  try {
    const {
      mode, emailType, context, recipient, sender, tone, targetLanguage,
      draftText, polishGoal, replyStrategy, incomingEmailText, docuSignLink,
      brandVoice, senderTitle, icpPersona, prospectBio, crmTags, targetIndustries
    } = await req.json();

    const lang = targetLanguage || "English";
    
    // CRM Tags Logic
    const finalRecipient = crmTags ? "{{first_name}}" : (recipient || "Prospect");
    const finalSender = crmTags ? "{{sender_name}}" : (sender || "User");
    const crmInstruction = crmTags ? "CRITICAL: Use exact CRM tags like {{first_name}} and {{company}} in the text instead of inventing names." : "";

    // Build the core context string based on modes
    let promptInstructions = "";

    if (mode === "reply") {
      promptInstructions = `
You are replying to a prospect's email / objection.
PROSPECT EMAIL RECEIVED: "${incomingEmailText}"
REPLY STRATEGY: "${replyStrategy}"
`;
    } else if (mode === "polish") {
      promptInstructions = `
You are polishing and rewriting a user's raw draft.
DRAFT TEXT: "${draftText}"
GOAL: "${polishGoal}"
`;
    } else if (mode === "sequence") {
      promptInstructions = `
Generate a 3-step automated sales sequence:
Email 1: High-converting initial outreach / hook.
Email 2: Gentle bump + value-add proposition (Day 3).
Email 3: Soft-close / polite breakup email (Day 7).
CONTEXT: "${context}"
Set variation titles strictly to "Email 1 (Day 1)", "Email 2 (Day 3)", and "Email 3 (Day 7)".
`;
    } else if (mode === "ab_test") {
      promptInstructions = `
Generate an A/B Split Test for cold outreach.
CONTEXT: "${context}"
Variant A: Focus entirely on Metrics, Proof, and ROI.
Variant B: Focus entirely on Storytelling, Empathy, and Pain Points.
Set variation titles to "Variant A (Metrics Driven)" and "Variant B (Pain Point Driven)".
`;
    } else if (mode === "batch") {
      promptInstructions = `
Generate a Multi-Vertical Batch Campaign.
CORE OFFER/CONTEXT: "${context}"
TARGET INDUSTRIES: "${targetIndustries}"
Generate 3 distinct emails, each perfectly tailored to a different industry from the list above.
Set variation titles to the name of the Industry.
`;
    } else {
      promptInstructions = `
Generate emails for:
EMAIL TYPE: "${emailType}"
CONTEXT & KEY POINTS: "${context}"
`;
    }

    // Global Appendices applied to all modes
    promptInstructions += `
RECIPIENT: "${finalRecipient}"
SENDER: "${finalSender}"
TARGET TONE: "${tone}"
${icpPersona && icpPersona !== "Default / General" ? `TARGET ICP PERSONA: "${icpPersona}". Adjust terminology to match what this specific executive cares about.` : ""}
${prospectBio ? `PROSPECT BIO / ICEBREAKER SOURCE: "${prospectBio}". Use this to write a hyper-personalized opening line.` : ""}
${senderTitle ? `SENDER TITLE: "${senderTitle}"` : ""}
${docuSignLink ? `EMBED DOCUSIGN URL: "${docuSignLink}"` : ""}
${brandVoice ? `BRAND VOICE STYLISTIC DNA RULES: "${brandVoice}"` : ""}
${crmInstruction}
LANGUAGE: Output MUST be written completely in ${lang}.
`;

    const systemPrompt = `You are an elite executive AI copywriting engine. 
Respond strictly with a valid JSON object. No Markdown code fences, no extra text outside the JSON.

Return format MUST be EXACTLY:
{
  "subjectLines": [
    { "subject": "String", "spamRisk": "Low Risk | Medium Risk", "score": 95, "openRateForecast": "88%" }
  ],
  "variations": [
    { "id": "v1", "title": "Option Title", "readingTime": "30 sec read", "body": "Full body text" }
  ],
  "analytics": {
    "readingLevel": "e.g. 5th Grade",
    "sentiment": "e.g. Assertive"
  }
}

Provide 3 distinct subject line options and 3 email variations (unless A/B test, then provide 2). 
Ensure 'analytics' object is included with the estimated Flesch-Kincaid reading grade and the primary emotional sentiment of the generated text.`;

    let completion = null;
    let modelUsed = "";

    for (const model of GROQ_MODELS) {
      try {
        completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: promptInstructions },
          ],
          model,
          temperature: 0.7,
          max_tokens: 2500,
          response_format: { type: "json_object" },
        });
        modelUsed = model;
        if (completion?.choices?.[0]?.message?.content) break;
      } catch (err) {
        console.warn(`Model ${model} failed, switching to fallback...`);
      }
    }

    if (!completion?.choices?.[0]?.message?.content) {
      return NextResponse.json({ error: "AI failed to respond" }, { status: 500 });
    }

    let raw = completion.choices[0].message.content.trim();
    raw = raw.replace(/^```json\s*/i, "").replace(/\s*```$/, "");

    const parsedData = JSON.parse(raw);
    return NextResponse.json({ ...parsedData, modelUsed });

  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}