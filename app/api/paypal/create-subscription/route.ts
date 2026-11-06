// app/api/paypal/create-subscription/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { planId, userId } = await req.json();

    if (!planId || !userId) {
      return NextResponse.json(
        { error: 'Missing planId or userId' },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'PayPal API credentials not configured on server' },
        { status: 500 }
      );
    }

    // 1. Get Live Access Token from PayPal OAuth
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('PayPal OAuth Error:', tokenData);
      return NextResponse.json(
        { error: 'Failed to authenticate with PayPal API' },
        { status: 500 }
      );
    }

    const accessToken = tokenData.access_token;

    // 2. Create Subscription on PayPal Servers
    const subResponse = await fetch('https://api-m.paypal.com/v1/billing/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        custom_id: userId,
        application_context: {
          brand_name: 'WriteYourEmail.com',
          user_action: 'SUBSCRIBE_NOW',
          return_url: 'https://writeyouremail.vercel.app/studio',
          cancel_url: 'https://writeyouremail.vercel.app/pricing',
        },
      }),
    });

    const subData = await subResponse.json();

    if (!subResponse.ok) {
      console.error('PayPal Subscription Creation Error:', subData);
      return NextResponse.json(
        { error: subData.message || 'Failed to create subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({ subscriptionId: subData.id }, { status: 200 });
  } catch (error: any) {
    console.error('PayPal Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}