import expense from "@/models/expense";
import connectDB from "@/lib/mongodb";
import { Expense } from "@/constants/data";
import { toast } from "sonner";


export const getExpenseBydId = async (expenseId: string) => {
  try {
    await connectDB();
    const expenseData = await expense.findById(expenseId).lean() as Expense;

    if (!expenseData) {
      toast.error('Expense not found');
      return null;
    }

    const transformedExpense: Expense = {
      _id: expenseData._id?.toString(),
      amount: expenseData.amount,
      category: expenseData.category,
      date: expenseData.date,
      notes: expenseData.notes,
      createdBy: expenseData.createdBy, // convert ObjectId to string if needed
      createdAt: expenseData.createdAt,
      updatedAt: expenseData.updatedAt,
      __v: expenseData.__v,
    };

    return transformedExpense;
  } catch (error) {
    console.error('Error fetching expense:', error);
    toast.error('Error fetching expense');
    return null;
  }
};
