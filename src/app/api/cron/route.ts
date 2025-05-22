// // // app/api/cron/route.ts
// // import { NextResponse } from "next/server";
// // import payment from "@/models/payment";
// // import { getAllUsers } from "@/lib/clerkUsers";
// // import connectDB from "@/lib/mongodb";


// // export async function POST() {
// //   await connectDB();

// //   const today = new Date();
// //   const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

// //   // 1. Get all users (Assuming you store them somewhere or fetch via Clerk API)
// //   const users = await getAllUsers(); // Replace with actual method

// //   for (const user of users) {
// //     const existing = await payment.findOne({ userId: user.id, month });
// //     if (!existing) {
// //       await payment.create({
// //         userId: user.id,
// //         month,
// //         amount: 1000, // your fixed rent amount
// //         status: "pending",
// //       });
// //     }
// //   }

// //   // 2. Mark unpaid ones from 1st to 7th as due
// //   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
// //   const dueDate = new Date(today.getFullYear(), today.getMonth(), 7);

// //   if (today >= dueDate) {
// //     await payment.updateMany({
// //       status: "pending",
// //       month,
// //     }, { $set: { status: "due" } });
// //   }

// //   return NextResponse.json({ success: true });
// // }


// // app/api/cron/route.ts
// import { NextResponse } from "next/server";
// import payment from "@/models/payment";
// import { getAllUsers } from "@/lib/clerkUsers";
// import connectDB from "@/lib/mongodb";

// export async function POST() {
//   await connectDB();

//   const today = new Date();
//   const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

//   // 1. Create current month payment if not exists
//   const users = await getAllUsers();
//   for (const user of users) {
//     const existing = await payment.findOne({ userId: user.id, month });
//     if (!existing) {
//       await payment.create({
//         userId: user.id,
//         month,
//         amount: 1000,
//         status: "pending",
//       });
//     }
//   }

//   // ✅ No need to mark anything as "due" here.
//   // That logic now lives in the client/server-categorizer (based on the current date)

//   return NextResponse.json({ success: true });
// }



import { NextResponse } from "next/server";
import payment from "@/models/payment";
import { getAllUsers } from "@/lib/clerkUsers";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");

  if (secret !== process.env.CRON_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await connectDB();

  const today = new Date();
  const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const users = await getAllUsers();

  for (const user of users) {
    const existing = await payment.findOne({ userId: user.id, month });
    if (!existing) {
      await payment.create({
        userId: user.id,
        month,
        amount: 1000,
        status: "pending",
      });
    }
  }

  // Mark payments as due after the 7th
  const currentDay = today.getDate();
  if (currentDay > 7) {
    await payment.updateMany(
      { status: "pending", month },
      { $set: { status: "due" } }
    );
  }

  return NextResponse.json({ success: true });
}
