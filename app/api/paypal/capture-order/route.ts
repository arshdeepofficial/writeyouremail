import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: Request) {
  try {
    const { orderId, userId, tierName } = await req.json();

    if (!orderId || !userId) {
      return NextResponse.json(
        { error: "Missing orderId or userId" },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "BAAODdDSTxLd8ul-bpGX8tIqVSkyEezEjQtleLHKXIXvHjTNHXcOkzCcvrfGB_uL-Sxm8y9Hr3GxIw8ZAc";
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    // 1. Get OAuth Token
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
    const accessToken = tokenData.access_token;

    // 2. Capture the Payment
    const captureResponse = await fetch(
      `https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const captureData = await captureResponse.json();

    if (!captureResponse.ok || captureData.status !== "COMPLETED") {
      console.error("Capture Failed:", captureData);
      return NextResponse.json(
        { error: "Payment capture failed" },
        { status: 500 }
      );
    }

    // Determine normalized tier name
    const normalizedTier = (tierName || "starter").toLowerCase();

    // 3. Update Supabase with exact plan tier & pro status
    const { error: dbError } = await supabaseAdmin
      .from("usage_tracking")
      .update({ 
        is_pro: true,
        plan_tier: normalizedTier
      })
      .eq("user_id", userId);

    if (dbError) {
      console.error("Database Update Error:", dbError);
    }

    console.log(`✅ Payment captured! User ${userId} upgraded to ${normalizedTier.toUpperCase()}`);

    return NextResponse.json({ success: true, captureData }, { status: 200 });
  } catch (error: any) {
    console.error("Capture Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}