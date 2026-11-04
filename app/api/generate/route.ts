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
    const { mode, emailType, context, recipient, sender, tone, targetLanguage, draftText, polishGoal, docuSignLink } = await req.json();

    const lang = targetLanguage || "English";
    let prompt = "";

    if (mode === "polish") {
      if (!draftText || !draftText.trim()) {
        return NextResponse.json({ error: "Draft text is required for polishing." }, { status: 400 });
      }

      prompt = `You are a world-class executive editor and email copywriter.
Task: Polish and rewrite the user's rough email draft.
- Target Output Language: ${lang}
- Polish Goal: ${polishGoal || "Fix grammar and improve professional clarity"}
- Original Draft: "${draftText}"
${docuSignLink ? `- Include a professional e-signature Call To Action pointing to this DocuSign link: ${docuSignLink}` : ""}

Requirements:
1. Generate 3 improved subject line variations written in ${lang} with spam risk ratings.
2. Generate 3 distinct polished versions of the body written natively in ${lang}:
   - Variation 1: Direct & Concise
   - Variation 2: Confident & High Impact
   - Variation 3: Warm & Collaborative`;
    } else {
      if (!context || !context.trim()) {
        return NextResponse.json({ error: "Context is required." }, { status: 400 });
      }

      const isContract = emailType === "contract_pitch";

      prompt = `You are a world-class email copywriting engine specializing in executive communication and high-stakes deals.
Create 3 subject lines with spam scores and 3 distinct email body variations based on these inputs:
- Target Language: Output EVERYTHING natively in ${lang}
- Email Type: ${emailType} ${isContract ? "(Contract/Proposal Pitch for e-Signature)" : ""}
- Tone: ${tone}
- Recipient: ${recipient || "Not specified"}
- Sender Signature: ${sender || "Not specified"}
- Context & Goals: ${context}
${docuSignLink ? `- e-Signature / DocuSign Link: ${docuSignLink}` : ""}

${isContract ? `SPECIAL INSTRUCTIONS FOR CONTRACT / DOCUSIGN PITCHING:
- Clear instructions guiding the recipient to review and electronically sign via the provided link.
- Friendly, professional tone assuring security and ease of signing.
- Optional subtle deadline or call-to-action to complete agreement.` : ""}

Requirements:
1. Generate 3 high-converting subject line variations written natively in ${lang} with spam risk ratings.
2. Generate 3 distinct email body variations written natively in ${lang}:
   - Option 1: Direct & Concise
   - Option 2: Persuasive & Detailed
   - Option 3: Casual & Warm`;
    }

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
}

DO NOT include markdown codeblocks (like \`\`\`json). Output pure JSON string only.`;

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
          max_tokens: 1600,
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