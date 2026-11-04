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
      mode,
      emailType,
      context,
      recipient,
      sender,
      tone,
      targetLanguage,
      draftText,
      polishGoal,
      replyStrategy,
      incomingEmailText,
      docuSignLink,
      brandVoice,
      senderTitle,
    } = await req.json();

    const lang = targetLanguage || "English";
    let promptInstructions = "";

    if (mode === "reply") {
      promptInstructions = `
You are replying to a prospect's email / objection.
PROSPECT EMAIL RECEIVED: "${incomingEmailText}"
REPLY STRATEGY: "${replyStrategy}"
TARGET TONE: "${tone}"
RECIPIENT NAME: "${recipient || "Prospect"}"
SENDER NAME: "${sender || "User"}"
${senderTitle ? `SENDER TITLE: "${senderTitle}"` : ""}
${docuSignLink ? `EMBED DOCUSIGN URL: "${docuSignLink}"` : ""}
${brandVoice ? `BRAND VOICE STYLISTIC DNA RULES: "${brandVoice}"` : ""}
LANGUAGE: Output MUST be written completely in ${lang}.
`;
    } else if (mode === "polish") {
      promptInstructions = `
You are polishing and rewriting a user's raw draft.
DRAFT TEXT: "${draftText}"
GOAL: "${polishGoal}"
TARGET TONE: "${tone}"
SENDER NAME: "${sender || "User"}"
${senderTitle ? `SENDER TITLE: "${senderTitle}"` : ""}
${docuSignLink ? `EMBED DOCUSIGN URL: "${docuSignLink}"` : ""}
${brandVoice ? `BRAND VOICE STYLISTIC DNA RULES: "${brandVoice}"` : ""}
LANGUAGE: Output MUST be written completely in ${lang}.
`;
    } else if (mode === "sequence") {
      promptInstructions = `
Generate a 3-step automated sales sequence:
Email 1: High-converting initial outreach / hook.
Email 2: Gentle bump + value-add proposition (Day 3).
Email 3: Soft-close / polite breakup email (Day 7).
CONTEXT: "${context}"
RECIPIENT NAME: "${recipient || "Prospect"}"
SENDER NAME: "${sender || "User"}"
${senderTitle ? `SENDER TITLE: "${senderTitle}"` : ""}
${docuSignLink ? `EMBED DOCUSIGN URL: "${docuSignLink}"` : ""}
${brandVoice ? `BRAND VOICE STYLISTIC DNA RULES: "${brandVoice}"` : ""}
LANGUAGE: Output MUST be written completely in ${lang}.
Set variation titles strictly to "Email 1 (Day 1)", "Email 2 (Day 3)", and "Email 3 (Day 7)".
`;
    } else {
      promptInstructions = `
Generate emails for:
EMAIL TYPE: "${emailType}"
CONTEXT & KEY POINTS: "${context}"
RECIPIENT NAME: "${recipient || "Prospect"}"
SENDER NAME: "${sender || "User"}"
TARGET TONE: "${tone}"
${senderTitle ? `SENDER TITLE: "${senderTitle}"` : ""}
${docuSignLink ? `EMBED DOCUSIGN URL: "${docuSignLink}"` : ""}
${brandVoice ? `BRAND VOICE STYLISTIC DNA RULES: "${brandVoice}"` : ""}
LANGUAGE: Output MUST be written completely in ${lang}.
`;
    }

    const systemPrompt = `You are an elite executive AI copywriting engine. 
Respond strictly with a valid JSON object. No Markdown code fences, no extra text outside the JSON.

Return format MUST be:
{
  "subjectLines": [
    { "subject": "String", "spamRisk": "Low Risk | Medium Risk", "score": 95 }
  ],
  "variations": [
    { "id": "v1", "title": "Option Title", "readingTime": "30 sec read", "body": "Full body text" }
  ]
}

Provide 3 distinct subject line options and 3 email variations (or 3 sequence steps if mode is sequence).`;

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
          temperature: 0.6,
          max_tokens: 2200,
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