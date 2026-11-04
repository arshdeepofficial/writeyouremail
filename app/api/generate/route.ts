import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Active Groq Model Endpoints
const GROQ_MODELS = [
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
];

export async function POST(req: Request) {
  try {
    const { emailType, context, recipient, sender, tone } = await req.json();

    if (!context || !context.trim()) {
      return NextResponse.json(
        { error: "Context is required." },
        { status: 400 }
      );
    }

    const prompt = `You are an world-class email copywriting engine. Create 3 subject lines with spam scores and 3 distinct email body variations based on these inputs:
- Email Type: ${emailType}
- Tone: ${tone}
- Recipient: ${recipient || "Not specified"}
- Sender Signature: ${sender || "Not specified"}
- Context & Goals: ${context}

Respond ONLY with valid, strict JSON matching this exact structure:
{
  "subjectLines": [
    { "subject": "Subject line 1", "spamRisk": "Low Risk", "score": 98 },
    { "subject": "Subject line 2", "spamRisk": "Low Risk", "score": 94 },
    { "subject": "Subject line 3", "spamRisk": "Medium Risk", "score": 82 }
  ],
  "variations": [
    {
      "id": "direct",
      "title": "Direct & Concise",
      "readingTime": "20 sec read",
      "body": "Subject: [Use chosen subject]\n\nEmail body text here..."
    },
    {
      "id": "persuasive",
      "title": "Persuasive & Detailed",
      "readingTime": "45 sec read",
      "body": "Subject: [Use chosen subject]\n\nEmail body text here..."
    },
    {
      "id": "casual",
      "title": "Casual & Warm",
      "readingTime": "30 sec read",
      "body": "Subject: [Use chosen subject]\n\nEmail body text here..."
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
            {
              role: "system",
              content: "You are an AI assistant that outputs clean JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          model: model,
          temperature: 0.7,
          max_tokens: 1500,
        });

        const rawText = completion.choices[0]?.message?.content || "";
        const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const parsed = JSON.parse(cleanJson);
        if (parsed.variations && parsed.variations.length > 0) {
          generatedData = parsed;
          break;
        }
      } catch (err) {
        console.warn(`Model ${model} failed JSON response, trying fallback...`, err);
        lastError = err;
      }
    }

    if (!generatedData) {
      throw lastError || new Error("All active Groq models failed to respond.");
    }

    return NextResponse.json(generatedData);
  } catch (error: any) {
    console.error("Groq Multi-Variation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate multi-variation emails." },
      { status: 500 }
    );
  }
}