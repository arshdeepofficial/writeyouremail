import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Currently ACTIVE Groq Model IDs
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

    const prompt = `Write a high-converting, highly professional email based on these exact details:
- Email Type / Goal: ${emailType}
- Tone of Voice: ${tone}
- Recipient Name/Role: ${recipient || "Not specified"}
- Sender Name: ${sender || "Not specified"}
- Main Context & Key Points: ${context}

Requirements:
- Provide a clear, compelling Subject Line.
- Provide the full email body with appropriate placeholders or signature if names are missing.
- Make it natural, concise, and effective.
- Output ONLY the email (Subject + Body). No conversational preamble or post-introductory chatter.`;

    let generatedEmail = "";
    let lastError = null;

    // Try active Groq models in sequence
    for (const model of GROQ_MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are an expert executive email writer.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          model: model,
          temperature: 0.7,
          max_tokens: 1024,
        });

        const resultText = completion.choices[0]?.message?.content;
        if (resultText && resultText.trim().length > 10) {
          generatedEmail = resultText.trim();
          break; // Success! Exit loop immediately.
        }
      } catch (err) {
        console.warn(`Groq Model ${model} failed, trying fallback...`, err);
        lastError = err;
      }
    }

    if (!generatedEmail) {
      throw lastError || new Error("All active Groq models failed to respond.");
    }

    return NextResponse.json({ email: generatedEmail });
  } catch (error: any) {
    console.error("Groq API Execution Error:", error);
    return NextResponse.json(
      { error: "Failed to generate email." },
      { status: 500 }
    );
  }
}