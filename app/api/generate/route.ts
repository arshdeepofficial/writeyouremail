import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// Active Fallback Models Loop
const ACTIVE_MODELS = [
  'openai/gpt-oss-20b',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
];

async function callGroqWithFallback(prompt: string, isJson: boolean = false) {
  let lastError = null;

  for (const model of ACTIVE_MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an elite B2B sales copywriter and deliverability specialist.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: model,
        temperature: 0.7,
        max_tokens: 1500,
        response_format: isJson ? { type: 'json_object' } : undefined,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      if (responseText) return responseText;
    } catch (err: any) {
      console.warn(`Model ${model} failed, attempting next fallback...`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Groq AI models failed.');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      mode,
      emailType,
      tone,
      recipientName,
      prospectBio,
      brandVoice,
      targetIcp,
      context,
      existingDraft,
      incomingReply,
      csvLeadsInput,
      includeSignature,
      language,
    } = body;

    // 1. Mode: Bulk CSV Personalization
    if (mode === 'csv_bulk') {
      const prompt = `
Generate custom personalized cold email intros for each of the following leads:
${csvLeadsInput}

Goal: ${context || 'Pitch SaaS product'}
Language: ${language}

Return STRICT JSON format:
{
  "bulkLeads": [
    { "lead": "Lead Name", "email": "Full personalized cold email text..." }
  ]
}
`;
      const rawJson = await callGroqWithFallback(prompt, true);
      return NextResponse.json(JSON.parse(rawJson));
    }

    // 2. Mode: AI Prospect Reply Classifier
    if (mode === 'classifier') {
      const prompt = `
Analyze this prospect reply email:
"${incomingReply}"

Return STRICT JSON format:
{
  "classification": {
    "intent": "Interested / Meeting Request OR Pricing Objection OR Competitor Usage OR Out of Office OR Not Interested",
    "sentimentScore": 75,
    "recommendedAction": "Actionable sales recommendation...",
    "replyStrategy": "Optimal objection response angle..."
  },
  "subject": "Re: Cold Outreach Followup",
  "body": "The high-converting response email answering the prospect..."
}
`;
      const rawJson = await callGroqWithFallback(prompt, true);
      return NextResponse.json(JSON.parse(rawJson));
    }

    // 3. Mode: 3-Step Sequence
    if (mode === 'sequence') {
      const prompt = `
Create a 3-step cold email sequence (Day 1, Day 3, Day 7) for ICP: ${targetIcp}.
Context: ${context}
Recipient: ${recipientName}
Language: ${language}

Return STRICT JSON format:
{
  "sequence": {
    "day1": "Full text of Day 1 email...",
    "day3": "Full text of Day 3 email...",
    "day7": "Full text of Day 7 email..."
  }
}
`;
      const rawJson = await callGroqWithFallback(prompt, true);
      return NextResponse.json(JSON.parse(rawJson));
    }

    // 4. Mode: A/B Split Test
    if (mode === 'ab_test') {
      const prompt = `
Create an A/B split test for a cold email to ${targetIcp}.
Context: ${context}
Recipient: ${recipientName}
Language: ${language}

Variant A must focus heavily on Data/Metrics and Social Proof.
Variant B must focus heavily on emotional Pain-Points and Agitation.

Return STRICT JSON format:
{
  "abTest": {
    "variantA": "Subject: ...\n\nBody of Variant A...",
    "variantB": "Subject: ...\n\nBody of Variant B..."
  }
}
`;
      const rawJson = await callGroqWithFallback(prompt, true);
      return NextResponse.json(JSON.parse(rawJson));
    }

    // 5. Mode: Multi-Vertical Batch
    if (mode === 'batch') {
      const prompt = `
Rewrite this pitch for 3 different industry verticals: SaaS, Agencies, and E-commerce.
Pitch Context: ${context}
Language: ${language}

Return STRICT JSON format:
{
  "batch": {
    "saas": "Subject: ...\n\nBody tailored for SaaS...",
    "agency": "Subject: ...\n\nBody tailored for Agencies...",
    "ecom": "Subject: ...\n\nBody tailored for E-commerce..."
  }
}
`;
      const rawJson = await callGroqWithFallback(prompt, true);
      return NextResponse.json(JSON.parse(rawJson));
    }

    // 6. Mode: Objection Handler / Reply Rebuttal
    if (mode === 'reply') {
      const prompt = `
Write an aggressive but polite objection-handling rebuttal email to this prospect.
Prospect said: "${incomingReply || context}"
Tone: Direct & Consultative
Language: ${language}

Return STRICT JSON format:
{
  "subject": "Re: Your thoughts",
  "body": "Full rebuttal email text..."
}
`;
      const rawJson = await callGroqWithFallback(prompt, true);
      return NextResponse.json(JSON.parse(rawJson));
    }

    // 7. Default Mode: Standard Single Email & Polish
    const prompt = `
Write a high-converting ${emailType} email for target persona ${targetIcp}.
Recipient Name: ${recipientName || 'there'}
Tone: ${tone}
Context: ${context}
${prospectBio ? `Prospect Bio / Context: ${prospectBio}` : ''}
${brandVoice ? `Brand Voice Rule: ${brandVoice}` : ''}
${existingDraft ? `Raw Draft to Polish: ${existingDraft}` : ''}
Language: ${language}
${includeSignature ? 'Include a professional email signature layout at the end.' : ''}

Return STRICT JSON format:
{
  "subject": "Compelling subject line",
  "body": "Full body text..."
}
`;

    const rawJson = await callGroqWithFallback(prompt, true);
    return NextResponse.json(JSON.parse(rawJson));

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal AI Error' }, { status: 500 });
  }
}