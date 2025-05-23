// app/api/create-checkout-session/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { months, total } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Monthly Fee for: ${months.join(", ")}`,
            },
            unit_amount: Math.round(total * 100), // Stripe needs amount in paisa
          },
          quantity: 1,
        },
      ],
      metadata: {
        months: months.join(","),
        userId,
      },
      success_url: `${req.nextUrl.origin}/payment-success?months=${months.join(",")}`,
      cancel_url: `${req.nextUrl.origin}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Stripe session creation failed" }, { status: 500 });
  }
}
