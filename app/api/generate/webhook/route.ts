import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase with Service Role Key (Bypasses RLS to update user status)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventType = body.event_type;
    const resource = body.resource;

    // The custom_id we passed in the PayPal button is the Supabase User ID
    // PayPal places this in different spots depending on the event type
    const userId = resource.custom_id || resource.custom;

    console.log(`[PayPal Webhook] Received ${eventType} for user: ${userId}`);

    if (!userId) {
      return NextResponse.json({ message: "No user ID found" }, { status: 400 });
    }

    // 1. SUCCESS EVENTS: Activate Pro Status
    const successEvents = [
      'BILLING.SUBSCRIPTION.ACTIVATED',
      'PAYMENT.SALE.COMPLETED',
      'BILLING.SUBSCRIPTION.CREATED'
    ];

    if (successEvents.includes(eventType)) {
      const { error } = await supabaseAdmin
        .from('usage_tracking')
        .update({ is_pro: true })
        .eq('user_id', userId);

      if (error) throw error;
      console.log(`✅ User ${userId} upgraded to PRO`);
    }

    // 2. FAILURE/CANCEL EVENTS: Revoke Pro Status
    const failureEvents = [
      'BILLING.SUBSCRIPTION.CANCELLED',
      'BILLING.SUBSCRIPTION.EXPIRED',
      'BILLING.SUBSCRIPTION.SUSPENDED',
      'PAYMENT.SALE.DENIED'
    ];

    if (failureEvents.includes(eventType)) {
      const { error } = await supabaseAdmin
        .from('usage_tracking')
        .update({ is_pro: false })
        .eq('user_id', userId);

      if (error) throw error;
      console.log(`❌ User ${userId} downgraded to FREE`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Important: PayPal sends POST requests
export async function GET() {
  return new Response("Webhook active", { status: 200 });
}