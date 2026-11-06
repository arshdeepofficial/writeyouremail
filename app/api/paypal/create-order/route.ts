import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, userId, planName } = await req.json();

    if (!amount || !userId) {
      return NextResponse.json(
        { error: "Missing amount or userId" },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "BAAODdDSTxLd8ul-bpGX8tIqVSkyEezEjQtleLHKXIXvHjTNHXcOkzCcvrfGB_uL-Sxm8y9Hr3GxIw8ZAc";
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientSecret) {
      return NextResponse.json(
        { error: "PAYPAL_CLIENT_SECRET missing in Vercel environment variables." },
        { status: 500 }
      );
    }

    // 1. Get OAuth Access Token
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenResponse = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || "Failed to authenticate with PayPal");
    }

    const accessToken = tokenData.access_token;

    // 2. Create Standard PayPal Order (RBI Compliant for Global Payments)
    const orderResponse = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: userId,
            description: `WriteYourEmail Pro Plan - ${planName}`,
            amount: {
              currency_code: "USD",
              value: amount.toString(),
            },
          },
        ],
        application_context: {
          brand_name: "WriteYourEmail.com",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: "https://writeyouremail.vercel.app/studio?success=true",
          cancel_url: "https://writeyouremail.vercel.app/pricing",
        },
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error("PayPal Order Creation Error:", orderData);
      return NextResponse.json(
        { error: orderData.message || "Failed to create order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ orderId: orderData.id }, { status: 200 });
  } catch (error: any) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}