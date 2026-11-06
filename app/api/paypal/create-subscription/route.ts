import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { planId, userId } = await req.json();

    if (!planId || !userId) {
      return NextResponse.json(
        { error: "Missing planId or userId" },
        { status: 400 }
      );
    }

    const clientId =
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
      "BAAODdDSTxLd8ul-bpGX8tIqVSkyEezEjQtleLHKXIXvHjTNHXcOkzCcvrfGB_uL-Sxm8y9Hr3GxIw8ZAc";
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientSecret) {
      console.error("Missing PAYPAL_CLIENT_SECRET in Vercel Environment Variables");
      return NextResponse.json(
        {
          error:
            "PAYPAL_CLIENT_SECRET is missing on Vercel. Please add it in Vercel Project Settings -> Environment Variables and Redeploy.",
        },
        { status: 500 }
      );
    }

    // 1. Fetch OAuth Access Token from PayPal Live API
    const auth = Buffer.from(`${clientId.trim()}:${clientSecret.trim()}`).toString("base64");
    const tokenResponse = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("PayPal Auth Error Response:", tokenData);
      return NextResponse.json(
        {
          error:
            tokenData.error_description ||
            "PayPal OAuth authentication failed. Check CLIENT_ID and CLIENT_SECRET.",
        },
        { status: 500 }
      );
    }

    const accessToken = tokenData.access_token;

    // 2. Create Subscription on PayPal Live Servers
    const subResponse = await fetch("https://api-m.paypal.com/v1/billing/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        custom_id: userId,
        application_context: {
          brand_name: "WriteYourEmail.com",
          locale: "en-US",
          shipping_preference: "NO_SHIPPING",
          user_action: "SUBSCRIBE_NOW",
          return_url: "https://writeyouremail.vercel.app/studio?success=true",
          cancel_url: "https://writeyouremail.vercel.app/pricing",
        },
      }),
      cache: "no-store",
    });

    const subData = await subResponse.json();

    if (!subResponse.ok) {
      console.error("PayPal Subscription API Error:", subData);
      return NextResponse.json(
        { error: subData.message || subData.description || "Failed to create subscription on PayPal." },
        { status: 500 }
      );
    }

    return NextResponse.json({ subscriptionId: subData.id }, { status: 200 });
  } catch (error: any) {
    console.error("PayPal Server Route Internal Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}