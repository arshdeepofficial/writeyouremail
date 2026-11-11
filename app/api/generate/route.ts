import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verified Active Groq Models (Updated for 2025/2026)
const ACTIVE_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it'
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      mode = 'create',
      prompt = '',
      senderName = '',
      language = 'English',
      tone = 'Professional & Direct',
      persona = 'Default / General',
      user_id = null,
      ...extras
    } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    // Build channel-specific context
    let channelContext = `Target Channel Mode: ${mode.toUpperCase()}\n`;
    if (senderName) channelContext += `Sender Name/Title: ${senderName}\n`;
    if (persona) channelContext += `ICP Target Persona: ${persona}\n`;

    Object.keys(extras).forEach((key) => {
      if (extras[key]) {
        channelContext += `${key.replace(/_/g, ' ')}: ${extras[key]}\n`;
      }
    });

    const systemPrompt = `You are an elite omni-channel sales copywriter and deliverability expert.
Generate highly realistic, human, high-converting copy for the specified channel.

Output Settings:
- Language: ${language}
- Tone: ${tone}
- Context & Custom Fields:
${channelContext}

Formatting Guidelines:
- Cold Email: Punchy hook, low friction CTA. Include 2-3 catchy subject line options at the top.
- WhatsApp / SMS / Social DMs (LinkedIn, Twitter/X, Instagram, Threads, Slack, Telegram, Discord, FB): Natural conversational chat format, concise.
- Cold Call Script / Voicemail Drop: Spoken dialogue script with clear visual/verbal cues and objection handles.
- Loom VSL Script: Video script with [On Screen] cues and spoken voiceover lines.
- Direct Mail: Formal letter or postcard format with strong headline, body, CTA, and P.S.
- Upwork / Freelance Proposal: Focus on solving client's problem first, show relevant proof, ask a closing question.
- CSV Bulk: Generate template structure with clear tag variables.

Generate output now:`;

    let content = '';
    let lastErrorMessage = '';

    // Loop through active models until one succeeds
    for (const modelName of ACTIVE_MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          model: modelName,
          temperature: 0.7,
          max_tokens: 2048,
        });

        const resultText = completion.choices[0]?.message?.content || '';
        if (resultText.trim()) {
          content = resultText;
          break; // Successfully generated! Stop loop.
        }
      } catch (err: any) {
        lastErrorMessage = err?.message || String(err);
        console.warn(`Groq model ${modelName} failed (${lastErrorMessage}). Trying fallback...`);
      }
    }

    if (!content) {
      return NextResponse.json(
        { error: `AI generation temporary issue: ${lastErrorMessage || 'Service busy, please retry in a moment.'}` },
        { status: 500 }
      );
    }

    // Record generation history & increment usage in Supabase if user_id present
    if (user_id) {
      try {
        await supabase.from('emails').insert({
          user_id,
          prompt,
          content,
          mode,
          created_at: new Date().toISOString()
        });

        const { data: usage } = await supabase
          .from('usage_tracking')
          .select('count')
          .eq('user_id', user_id)
          .single();

        if (usage) {
          await supabase
            .from('usage_tracking')
            .update({ count: (usage.count || 0) + 1 })
            .eq('user_id', user_id);
        }
      } catch (dbErr) {
        console.error('Supabase DB logging error:', dbErr);
      }
    }

    return NextResponse.json({ content });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}