import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { orderId, userId, tierName, billingCycle } = await req.json();

    // 1. Get Access Token
    const auth = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: { Authorization: `Basic ${auth}` },
    });
    const { access_token } = await tokenRes.json();

    // 2. Capture Order
    const captureRes = await fetch(
      `https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const captureData = await captureRes.json();

    if (captureData.status === "COMPLETED") {
      // 3. Calculate Expiration Date
      const expirationDate = new Date();
      if (billingCycle === "yearly") {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      } else {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      }

      // 4. Update Supabase with Expiry
      const { error } = await supabaseAdmin
        .from("usage_tracking")
        .upsert({
          user_id: userId,
          is_pro: true,
          plan_tier: tierName.toLowerCase(),
          subscription_ends_at: expirationDate.toISOString(),
          last_reset: new Date().toISOString(),
        });

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Payment not completed" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}