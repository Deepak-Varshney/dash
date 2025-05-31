import connectDB from "@/lib/mongodb";
import payment from "@/models/payment";

export async function getData() {
  await connectDB() // Ensure DB connection is established

  const data = payment.find({}).lean();
  const payments = await data;
  return payments;
}