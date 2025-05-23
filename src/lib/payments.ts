// import payment from "@/models/payment";
// import connectDB from "./mongodb";

import payment from "@/models/payment";
import connectDB from "./mongodb";


// export async function markMonthsAsPaidForUser(userId: string, months: string[]) {
//   if (!userId || months.length === 0) throw new Error("Missing data");

//   await connectDB();

//   await payment.updateMany(
//     { userId, month: { $in: months } },
//     {
//       $set: {
//         status: "paid",
//         paidAt: new Date(),
//       },
//     }
//   );

//   return { success: true };
// }



export async function markMonthsAsPaidForUser(userId: string, months: string[]) {
  await connectDB();

  const result = await payment.updateMany(
    { userId, month: { $in: months } },
    { $set: { status: "paid", paidAt: new Date() } }
  );

  console.log(`Marked ${result.modifiedCount} payments as paid for user ${userId}`);
  return { success: true };
}
