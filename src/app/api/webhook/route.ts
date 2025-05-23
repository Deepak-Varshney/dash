// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { markMonthsAsPaidForUser } from "@/lib/payments";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const rawBody = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const months = session.metadata?.months?.split(",") ?? [];
      const userId = session.metadata?.userId;
      if (months.length && userId) {
        await markMonthsAsPaidForUser(userId, months);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}

