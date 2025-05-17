
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
  dueDate: Date; // Add a field for the due date
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: String, required: true },
  month: { type: String, required: true },
  status: { type: String, enum: ['upcoming', 'paid', 'overdue', "advance"], default: 'pending' },
  amount: { type: Number, required: true },
  paidAt: { type: Date },
  dueDate: { type: Date, required: true }, // Add a required dueDate field
}, { timestamps: true });

// A static method to calculate overdue payments based on dueDate
PaymentSchema.statics.getOverduePayments = function () {
  return this.find({ status: 'pending', dueDate: { $lt: new Date() } });
};

export default models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
