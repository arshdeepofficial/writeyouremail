import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODELS = [
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
];

export async function POST(req: Request) {
  try {
    const { 
      mode, 
      emailType, 
      context, 
      recipient, 
      sender, 
      tone, 
      targetLanguage, 
      draftText, 
      polishGoal, 
      docuSignLink,
      brandVoice 
    } = await req.json();

    const lang = targetLanguage || "English";
    let prompt = "";

    if (mode === "sequence") {
      if (!context || !context.trim()) {
        return NextResponse.json({ error: "Context is required for sequences." }, { status: 400 });
      }

      prompt = `You are a world-class executive sales strategist.
Create a high-converting 3-step email outreach sequence written natively in ${lang}.
- Goal/Context: ${context}
- Target Recipient: ${recipient || "Partner"}
- Sender Name: ${sender || "Best Regards"}
- Target Language: ${lang}
${brandVoice ? `- CUSTOM BRAND VOICE DNA INSTRUCTIONS: ${brandVoice}` : ""}
${docuSignLink ? `- Include DocuSign link in Email 1 or 2: ${docuSignLink}` : ""}

Requirements:
1. Generate 3 high-converting subject line options written in ${lang} with spam risk ratings.
2. Generate 3 sequence steps written natively in ${lang}:
   - Step 1: Initial Pitch / Outreach (Day 1)
   - Step 2: Gentle Follow-Up Nudge (Day 3)
   - Step 3: Polite Breakup / Final Call (Day 7)`;

    } else if (mode === "polish") {
      if (!draftText || !draftText.trim()) {
        return NextResponse.json({ error: "Draft text is required for polishing." }, { status: 400 });
      }

      prompt = `You are a world-class executive editor and email copywriter.
Task: Polish and rewrite the user's rough email draft.
- Target Output Language: ${lang}
- Polish Goal: ${polishGoal || "Fix grammar and improve professional clarity"}
- Original Draft: "${draftText}"
${brandVoice ? `- CUSTOM BRAND VOICE DNA: ${brandVoice}` : ""}
${docuSignLink ? `- Include e-signature CTA with DocuSign link: ${docuSignLink}` : ""}

Requirements:
1. Generate 3 subject line options in ${lang} with spam risk ratings.
2. Generate 3 distinct polished body variations natively in ${lang}:
   - Option 1: Direct & Concise
   - Option 2: Confident & High Impact
   - Option 3: Warm & Collaborative`;

    } else {
      if (!context || !context.trim()) {
        return NextResponse.json({ error: "Context is required." }, { status: 400 });
      }

      const isContract = emailType === "contract_pitch";

      prompt = `You are a world-class email copywriting engine specializing in executive communication.
Create 3 subject lines with spam scores and 3 email body variations in ${lang}:
- Target Language: ${lang}
- Email Type: ${emailType} ${isContract ? "(Contract/Proposal Pitch for e-Signature)" : ""}
- Tone: ${tone}
- Recipient: ${recipient || "Not specified"}
- Sender Signature: ${sender || "Not specified"}
- Context & Goals: ${context}
${brandVoice ? `- CUSTOM BRAND VOICE DNA: ${brandVoice}` : ""}
${docuSignLink ? `- e-Signature / DocuSign Link: ${docuSignLink}` : ""}

Requirements:
1. Generate 3 subject lines in ${lang} with spam risk ratings.
2. Generate 3 email body variations in ${lang}:
   - Option 1: Direct & Concise
   - Option 2: Persuasive & Detailed
   - Option 3: Casual & Warm`;
    }

    if (mode === "sequence") {
      prompt += `\n\nRespond ONLY with valid, strict JSON matching this exact structure:
{
  "subjectLines": [
    { "subject": "Subject 1 in ${lang}", "spamRisk": "Low Risk", "score": 98 },
    { "subject": "Subject 2 in ${lang}", "spamRisk": "Low Risk", "score": 94 },
    { "subject": "Subject 3 in ${lang}", "spamRisk": "Medium Risk", "score": 82 }
  ],
  "variations": [
    {
      "id": "seq-1",
      "title": "Email 1: Initial Pitch (Day 1)",
      "readingTime": "45 sec read",
      "body": "Full body text for Step 1 in ${lang}..."
    },
    {
      "id": "seq-2",
      "title": "Email 2: Gentle Nudge (Day 3)",
      "readingTime": "25 sec read",
      "body": "Full body text for Step 2 in ${lang}..."
    },
    {
      "id": "seq-3",
      "title": "Email 3: Polite Breakup (Day 7)",
      "readingTime": "30 sec read",
      "body": "Full body text for Step 3 in ${lang}..."
    }
  ]
}`;
    } else {
      prompt += `\n\nRespond ONLY with valid, strict JSON matching this exact structure:
{
  "subjectLines": [
    { "subject": "Subject line 1 in ${lang}", "spamRisk": "Low Risk", "score": 98 },
    { "subject": "Subject line 2 in ${lang}", "spamRisk": "Low Risk", "score": 94 },
    { "subject": "Subject line 3 in ${lang}", "spamRisk": "Medium Risk", "score": 82 }
  ],
  "variations": [
    {
      "id": "v1",
      "title": "Direct & Concise",
      "readingTime": "20 sec read",
      "body": "Full body text in ${lang}..."
    },
    {
      "id": "v2",
      "title": "Confident & High Impact",
      "readingTime": "40 sec read",
      "body": "Full body text in ${lang}..."
    },
    {
      "id": "v3",
      "title": "Warm & Collaborative",
      "readingTime": "30 sec read",
      "body": "Full body text in ${lang}..."
    }
  ]
}`;
    }

    prompt += `\nDO NOT include markdown codeblocks (like \`\`\`json). Output pure JSON string only.`;

    let generatedData = null;
    let lastError = null;

    for (const model of GROQ_MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "You are an AI assistant that outputs clean JSON only." },
            { role: "user", content: prompt },
          ],
          model: model,
          temperature: 0.7,
          max_tokens: 2200,
        });

        const rawText = completion.choices[0]?.message?.content || "";
        const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

        const parsed = JSON.parse(cleanJson);
        if (parsed.variations && parsed.variations.length > 0) {
          generatedData = parsed;
          break;
        }
      } catch (err) {
        console.warn(`Model ${model} failed, trying next fallback...`, err);
        lastError = err;
      }
    }

    if (!generatedData) {
      throw lastError || new Error("All active Groq models failed to respond.");
    }

    return NextResponse.json(generatedData);
  } catch (error: any) {
    console.error("Groq Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate output." }, { status: 500 });
  }
}