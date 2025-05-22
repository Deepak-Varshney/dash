// models/Payment.ts
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  month: { type: String, required: true }, // Format: "2025-05"
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "due", "paid"], default: "pending" },
  paidAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
