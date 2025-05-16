
// // File: models/payment.js
// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   amount: { type: Number, required: true },
//   status: { 
//     type: String, 
//     enum: ["pending", "completed", "failed"], 
//     default: "pending" 
//   },
//   date: { type: Date, default: Date.now }
// });

// export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);


import mongoose, { Schema, Document, models } from 'mongoose';

export interface IPayment extends Document {
  userId: string;
  month: string; // 'YYYY-MM'
  status: 'pending' | 'paid' | 'overdue';
  amount: number;
  paidAt?: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: String, required: true },
  month: { type: String, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  amount: { type: Number, required: true },
  paidAt: { type: Date }
}, { timestamps: true });

export default models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);