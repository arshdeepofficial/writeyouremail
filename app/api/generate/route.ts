import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const FALLBACK_MODELS = [
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
  "llama3-70b-8192",
];

const SPAM_WORDS = [
  "100% free", "free", "guaranteed", "no cost", "risk-free", "act now",
  "click here", "urgent", "make money", "winner", "cash", "no obligation",
  "special promotion", "congratulations", "credit card", "order now", "$$$"
];

function analyzeSpamAndMetrics(text: string) {
  const lower = text.toLowerCase();
  const foundSpam = SPAM_WORDS.filter((word) => lower.includes(word));
  
  const words = text.trim().split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).length || 1;
  const avgWordsPerSentence = Math.round(words / sentences);
  
  let readingLevel = "5th Grade (Optimal)";
  if (avgWordsPerSentence > 18) readingLevel = "10th Grade (Complex)";
  else if (avgWordsPerSentence > 14) readingLevel = "8th Grade (Moderate)";

  let sentiment = "Assertive & Direct";
  if (lower.includes("thank") || lower.includes("appreciate")) sentiment = "Warm & Empathetic";
  if (lower.includes("urgent") || lower.includes("now")) sentiment = "Urgent & High-Intent";

  return {
    spamCount: foundSpam.length,
    foundSpam,
    readingLevel,
    sentiment,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
      csvData,
      brandVoice,
      senderTitle,
      icpPersona,
      prospectBio,
      crmTags,
      targetIndustries,
    } = body;

    let systemPrompt = "";
    let userPrompt = "";

    // 1. WhatsApp Sequence
    if (mode === "whatsapp") {
      systemPrompt = `You are an expert mobile sales copywriter specializing in WhatsApp Business sequences. 
Write concise, professional, non-spammy WhatsApp messages that feel like a direct text conversation. Use WhatsApp formatting (*bold*, _italics_) naturally. Output 3 short sequential messages (Initial Hook, 24-hr Soft Follow-up, 48-hr Final Value Nudge). Output in JSON format with "subjectLines" (for preview lines) and "variations".`;
      userPrompt = `Context: ${context}. Recipient: ${recipient || "Prospect"}. Tone: ${tone}. Language: ${targetLanguage}. ICP: ${icpPersona}. Bio: ${prospectBio}.`;
    }
    // 2. Loom / VSL Script
    else if (mode === "vsl_script") {
      systemPrompt = `You are a top-tier Video Sales Letter (VSL) and Loom video scriptwriter. 
Write a high-converting 60-second script for a personalized video. Include clear time-stamped cues: [0:00-0:10 Hook], [0:10-0:30 Screen-Share Pain Point], [0:30-0:50 Solution Demo], [0:50-1:00 Soft Call to Action]. Output JSON format with "subjectLines" (Video Email Subject Lines) and "variations" (containing full time-stamped script).`;
      userPrompt = `Context: ${context}. Recipient: ${recipient || "Prospect"}. Target Bio/URL: ${prospectBio}. Language: ${targetLanguage}.`;
    }
    // 3. Upwork & Fiverr Freelancer Proposal
    else if (mode === "proposal") {
      systemPrompt = `You are an elite freelancer proposal writer who has generated over $1M on Upwork and Fiverr.
Write a winning project proposal based on the client's job description. Structure: 1) Instant hook proving you read their job post, 2) Direct approach to solving their specific problem, 3) Relevant portfolio proof/case study, 4) Low-friction closing question to kick off a chat. Do NOT sound like generic canned spam. Output JSON with "subjectLines" (Proposal Titles) and "variations".`;
      userPrompt = `Job Description / Context: ${context || draftText}. Sender: ${sender || "Freelancer"}. Tone: ${tone}. Language: ${targetLanguage}.`;
    }
    // 4. Telegram Tech Outreach
    else if (mode === "telegram") {
      systemPrompt = `You are a Web3, AI, and Tech BD specialist writing direct Telegram messages.
Write 3 punchy, high-value, fluff-free Telegram DMs tailored for founders, developers, and crypto/AI executives. Keep messages short (<100 words), direct, and focused on tech utility or business ROI. Output JSON.`;
      userPrompt = `Pitch Context: ${context}. Recipient: ${recipient}. Tone: ${tone}. Language: ${targetLanguage}.`;
    }
    // 5. Reddit DM Outreach
    else if (mode === "reddit_dm") {
      systemPrompt = `You are a community-first Reddit outreach writer.
Craft an empathetic, highly contextual Reddit Direct Message that addresses a specific post or problem a user posted about. Do NOT sound like a corporate cold email. Sound like a helpful peer giving genuine value first before softly mentioning your solution. Output JSON.`;
      userPrompt = `Reddit Post Context: ${context || incomingEmailText}. Recipient: ${recipient}. Language: ${targetLanguage}.`;
    }
    // 6. Threads & BlueSky DM
    else if (mode === "threads_dm") {
      systemPrompt = `You are a modern social media manager crafting conversational Meta Threads and BlueSky DMs.
Write short, witty, engaging social direct messages designed for creator and tech communities. Keep it under 60 words. Output JSON.`;
      userPrompt = `Context: ${context}. Prospect Bio: ${prospectBio}. Language: ${targetLanguage}.`;
    }
    // 7. Direct Mail (Lumpy Mail) Physical Letter
    else if (mode === "direct_mail") {
      systemPrompt = `You are an executive direct mail copywriter for ABM (Account-Based Marketing) campaigns.
Write a physical executive letter/postcard meant to be printed and mailed to high-ticket C-Suite executives. Include: [Envelope Teaser], [Executive Salutation], [Hook referencing a physical item/gift], [Core Value Proposition], [Call to Action with URL/QR Code]. Output JSON.`;
      userPrompt = `Context: ${context}. Recipient: ${recipient}. Sender Title: ${senderTitle}. Brand Voice: ${brandVoice}. Language: ${targetLanguage}.`;
    }
    // 8. SMS Sequence
    else if (mode === "sms_sequence") {
      systemPrompt = `You are an SMS marketing expert.
Write a 3-part SMS text sequence for meeting reminders or quick sales follow-ups. Each text MUST be under 160 characters. Format with clear [SMS #1], [SMS #2], [SMS #3] headers. Output JSON.`;
      userPrompt = `Context: ${context}. Recipient: ${recipient}. Sender: ${sender}. Language: ${targetLanguage}.`;
    }
    // Standard Modes
    else if (mode === "sequence") {
      systemPrompt = `You are an expert sales strategist. Output a 3-step cold email sequence (Step 1: Initial Pitch, Step 2: Value Add & Social Proof, Step 3: Polite Breakup) in JSON.`;
      userPrompt = `Type: ${emailType}. Context: ${context}. Recipient: ${recipient}. Sender: ${sender}. Tone: ${tone}. Language: ${targetLanguage}.`;
    } else if (mode === "ab_test") {
      systemPrompt = `Generate 2 distinct cold email variations for A/B testing (Variant A: Direct Hook, Variant B: Storytelling/Problem-focused) in JSON.`;
      userPrompt = `Context: ${context}. Tone: ${tone}. Language: ${targetLanguage}.`;
    } else if (mode === "polish") {
      systemPrompt = `You are an executive email editor. Polish the draft based on goal: "${polishGoal}". Output JSON.`;
      userPrompt = `Draft: "${draftText}". Language: ${targetLanguage}.`;
    } else if (mode === "reply") {
      systemPrompt = `You are a master objection handler. Write a persuasive rebuttal addressing the prospect's email using strategy: "${replyStrategy}". Output JSON.`;
      userPrompt = `Incoming Email: "${incomingEmailText}". Language: ${targetLanguage}.`;
    } else {
      systemPrompt = `You are a world-class cold outreach copywriter. Generate 3 subject lines with spam risk ratings and 2 full email body variations in valid JSON. Output format strictly:
{
  "subjectLines": [
    { "subject": "...", "spamRisk": "LOW", "score": 95, "openRateForecast": "78%" }
  ],
  "variations": [
    { "id": "1", "title": "Variation 1", "readingTime": "30 sec read", "body": "..." }
  ]
}`;
      userPrompt = `Type: ${emailType}. Context: ${context}. Recipient: ${recipient || "Prospect"}. Sender: ${sender || "User"}. Tone: ${tone}. Language: ${targetLanguage}. Brand Voice: ${brandVoice}. CRM Tags: ${crmTags ? "Use {{first_name}} and {{company}}" : "No"}.`;
    }

    let completion = null;
    let lastError = null;

    for (const model of FALLBACK_MODELS) {
      try {
        completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt + " MUST RETURN VALID JSON ONLY. NO MARKDOWN RAW TEXT OUTSIDE JSON." },
            { role: "user", content: userPrompt },
          ],
          model: model,
          temperature: 0.7,
          response_format: { type: "json_object" },
        });
        if (completion?.choices[0]?.message?.content) break;
      } catch (err) {
        lastError = err;
        console.warn(`Groq Model ${model} failed, trying fallback...`);
      }
    }

    if (!completion || !completion.choices[0]?.message?.content) {
      throw lastError || new Error("Failed to generate with all Groq models");
    }

    const rawContent = completion.choices[0].message.content;
    const parsedData = JSON.parse(rawContent);

    const primaryBody = parsedData.variations?.[0]?.body || "";
    const metrics = analyzeSpamAndMetrics(primaryBody);

    return NextResponse.json({
      subjectLines: parsedData.subjectLines || [{ subject: "Outreach Copy", spamRisk: "LOW", score: 92, openRateForecast: "75%" }],
      variations: parsedData.variations || [{ id: "1", title: "Primary Output", readingTime: "30 sec read", body: rawContent }],
      analytics: {
        readingLevel: metrics.readingLevel,
        sentiment: metrics.sentiment,
        spamCount: metrics.spamCount,
      },
    });
  } catch (error: any) {
    console.error("Generate API Error:", error);
    return NextResponse.json(
      { error: error.message || "Generation failed" },
      { status: 500 }
    );
  }
}