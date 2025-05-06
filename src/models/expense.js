import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now() },
    notes: { type: String },
    createdBy: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        clerkId: { type: String, required: true },
    },
}, {
    timestamps: true
})

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema)
export default Expense
