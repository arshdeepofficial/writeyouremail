// app/api/chat/route.ts
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export const maxDuration = 30;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SUPPORT_SYSTEM_PROMPT = `You are "WriteBot", the ultra-helpful, friendly AI support assistant for WriteYourEmail.com.
Your goal is to assist users with questions about features, pricing, credit limits, platforms, and usage.

KEY PRODUCT INFORMATION:
- Product: WriteYourEmail.com — an omni-channel sales outreach AI generator with 30 platform modes.
- Infrastructure: Zero-latency generation using high-speed LLMs on Groq.

PRICING & TIERS (30-Day Prepaid Passes via PayPal):
1. Starter Tier ($19 for 30 days):
   - 50 Generations / month
   - 5 Starter Modes: Cold Email, Magic Polish, Objection Reply, Lead Win-Back, Inbound Follow-Up.
2. Growth Tier ($39 for 30 days):
   - Unlimited Generations
   - 15 Omni-Channel Modes: LinkedIn DM, Twitter/X DM, WhatsApp, VSL Scripts, Upwork Proposal, Telegram, Instagram DM, 3-Step Email Sequence, Slack Connect, Discord DM.
3. Enterprise Tier ($79 for 30 days):
   - Unlimited Generations
   - All 30 Omni-Channel Modes: Cold Call Scripts, SMS Sequences, Reddit DMs, Threads, Direct Mail, CSV Bulk Mapper, TikTok Pitches, Podcast Pitch, Ringless Voicemail, Facebook DM, Signal/VIP, Recruiter Headhunting, Conference Pitches, ABM Briefings, WeChat B2B.

FREE / GUEST LIMITS:
- Guest users (not signed in): 2 lifetime test generations.
- Free Registered Accounts: 5 daily generations (resets every 24 hours).

PAYMENT & REFUND POLICIES:
- Payments are processed via PayPal Standard Checkout Orders (v2).
- Passes provide 30-day non-recurring access (no surprise automated credit card charges).
- Users can manually renew or upgrade at any time.

TONE & BEHAVIOR:
- Concise, polite, structured, and helpful. Use bullet points or short paragraphs.
- Keep responses under 150 words whenever possible.
- If asking about upgrades, encourage them to click the "Upgrade" button in the top navigation bar.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid payload: 'messages' array required" },
        { status: 400 }
      );
    }

    // Append system prompt to conversation history
    const conversation = [
      { role: "system", content: SUPPORT_SYSTEM_PROMPT },
      ...messages.slice(-6) // Send last 6 messages for context efficiency
    ];

    const models = [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant"
    ];

    let botResponse = "";

    for (const model of models) {
      try {
        const completion = await groq.chat.completions.create({
          messages: conversation,
          model: model,
          temperature: 0.5,
          max_tokens: 512,
        });

        if (completion.choices?.[0]?.message?.content) {
          botResponse = completion.choices[0].message.content.trim();
          break;
        }
      } catch (err) {
        console.warn(`Support bot model ${model} failed, trying fallback...`, err);
      }
    }

    if (!botResponse) {
      botResponse = "I'm currently receiving high traffic. Please email support@writeyouremail.com or try asking your question again in a moment.";
    }

    return NextResponse.json({ reply: botResponse });

  } catch (error: any) {
    console.error("Support chat API error:", error);
    return NextResponse.json(
      { error: "Internal chat server error" },
      { status: 500 }
    );
  }
}