import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { emailType, context, recipient, sender, tone } = await req.json();

    if (!context) {
      return NextResponse.json(
        { error: "Please describe what you want to say" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert email writer. Write a ${tone.toLowerCase()} ${emailType.toLowerCase()} email.

What the user wants to communicate: ${context}
${recipient ? `Recipient's name: ${recipient}` : "Recipient's name: not provided"}
${sender ? `Sender's name: ${sender}` : "Sender's name: not provided"}

Rules:
- Start with "Subject: ..." on the first line
- Keep it under 200 words
- Use proper email formatting (greeting, body, sign-off)
- Sound natural and human, not robotic
- Use the actual names provided, never use placeholders like [Name]
- Match the tone exactly as requested`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are a professional email writing assistant. You write clear, effective emails that sound natural.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const email = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ email });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate email. Please try again." },
      { status: 500 }
    );
  }
}