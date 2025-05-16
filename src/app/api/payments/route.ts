import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import payment from "@/models/payment";
import connectDB from "@/lib/mongodb";

// export async function GET(req: NextRequest) {
//   await connectDB();
//   const { userId } = await auth();
//   if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   // Fetch all payments for this user, sorted by month descending
//   const payments = await payment.find({ userId }).sort({ month: -1 });
//   return NextResponse.json(payments, { status: 200 });
// }

// export async function POST(req: NextRequest) {
//   await connectDB();
//   const { userId } = await auth();
//   if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const { months, amount } = await req.json(); // months: string[] (['2025-05', ...]), amount: number (per month)

//   // Upsert each month: if not exists, create; if exists and unpaid, update amount if necessary
//   const results = [];
//   for (const month of months) {
//     const Payment = await payment.findOneAndUpdate(
//       { userId, month },
//       { $setOnInsert: { status: 'pending', amount } },
//       { upsert: true, new: true }
//     );
//     results.push(Payment);
//   }
//   return NextResponse.json(results, { status: 200 });
// }

// // You can add PATCH here for marking as PAID after payment, or do it in your payment webhook endpoint


// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/app/lib/mongodb";
// import Payment from "@/app/models/payment";
// import { auth } from "@clerk/nextjs/server";


async function markOverduePayments(userId: string) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const currentMonth = `${year}-${month}`;
  const day = today.getDate();

  if (day > 7) {
    // Mark all "pending" payments for this user, for all months <= currentMonth, as "overdue"
    await payment.updateMany(
      { userId, month: { $lte: currentMonth }, status: "pending" },
      { $set: { status: "overdue" } }
    );
  }
}

// In your GET handler:
export async function GET(req: NextRequest) {
  await connectDB();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await markOverduePayments(userId); // <------ RUN OVERDUE LOGIC

  const payments = await payment.find({ userId }).sort({ month: -1 });
  return NextResponse.json(payments, { status: 200 });
}
// export async function GET(req: NextRequest) {
//   await connectDB();
//   const { userId } = await auth();
//   if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const payments = await payment.find({ userId }).sort({ month: -1 });
//   return NextResponse.json(payments, { status: 200 });
// }

export async function POST(req: NextRequest) {
  await connectDB();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { months, amount } = await req.json(); // months: string[] (['2025-05', ...]), amount: number

  const results = [];
  for (const month of months) {
    const Payment = await payment.findOneAndUpdate(
      { userId, month },
      { $setOnInsert: { amount, status: 'pending' } },
      { upsert: true, new: true }
    );
    results.push(Payment);
  }
  return NextResponse.json(results, { status: 200 });
}

export async function PATCH(req: NextRequest) {
  // Mark given months as paid
  await connectDB();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { months } = await req.json(); // months: string[]

  const results = [];
  for (const month of months) {
    const Payment = await payment.findOneAndUpdate(
      { userId, month },
      { status: "paid", paidAt: new Date() },
      { new: true }
    );
    results.push(Payment);
  }
  return NextResponse.json(results, { status: 200 });
}