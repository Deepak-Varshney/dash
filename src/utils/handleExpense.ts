import expense from "@/models/expense";
import connectDB from "@/lib/mongodb";
import { Expense } from "@/constants/data";
import { toast } from "sonner";

export const getExpenses = async (filters: any) => {
  try {
    await connectDB();
    const { page = 1, limit =2, search, categories } = filters;
    const query: any = {};

    if (search) query.title = { $regex: search, $options: 'i' };
    if (categories) query.category = { $in: Array.isArray(categories) ? categories : [categories] };

    const [expenses, totalExpenses] = await Promise.all([
      expense.find(query).skip((page - 1) * limit).limit(limit).lean(),
      expense.countDocuments(query),
    ]);

    const transformedExpenses: Expense[] = expenses.map((expenseDoc) => ({
      _id: expenseDoc._id?.toString(),
      createdAt: expenseDoc.createdAt,
      updatedAt: expenseDoc.updatedAt,
      amount: expenseDoc.amount,
      category: expenseDoc.category,
      __v: expenseDoc.__v,
      notes: expenseDoc.notes,
      date: expenseDoc.date,
      createdBy: expenseDoc.createdBy,
    }));

    return {
      expenses: transformedExpenses,
      totalExpenses,
    };
  } catch (error) {
    console.error(error);
    return {
      expenses: [],
      totalExpenses: 0,
    };
  }
};



export const updatedExpense = async (expenseId:any, data: Expense) => {
  try {
    await connectDB();

    const updated = await expense.findByIdAndUpdate(
      expenseId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new Error('Expense not found');
    }

    return updated;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

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
