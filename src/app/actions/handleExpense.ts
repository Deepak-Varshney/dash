'use server';

import connectDB from '@/lib/mongodb';
import expense from '@/models/expense';
import { Expense } from '@/constants/data';
import { Types } from 'mongoose';
import { currentUser } from '@clerk/nextjs/server';

export async function saveExpense(data: Expense) {
    await connectDB();
    const user = await currentUser()
    if (data._id) {
        const id = new Types.ObjectId(data._id);
        await expense.findByIdAndUpdate(id, {
            ...data,
            updatedAt: new Date(),
        });
    } else {
        if (!user) {
            throw new Error("User is not authenticated.");
        }
        await expense.create({
            ...data,
            createdBy: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.emailAddresses[0].emailAddress,
                clerkId: user.id
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}



export async function deleteExpense(expenseId: string) {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  if (!Types.ObjectId.isValid(expenseId)) {
    throw new Error("Invalid expense ID.");
  }

  await expense.deleteOne({
    _id: new Types.ObjectId(expenseId),
    'createdBy.clerkId': user.id, // optional: only delete if owned by user
  });
}



interface GetExpensesParams {
  page?: string | number;
  limit?: string | number;
  search?: string;
  categories?: string | string[];
}

export async function getExpenses(params: GetExpensesParams) {
  await connectDB();

  const {
    page = 1,
    limit = 10,
    search = '',
    categories,
  } = params;

  const skip = (Number(page) - 1) * Number(limit);

  const query: any = {};

  if (search) {
    query.notes = { $regex: search, $options: 'i' }; // search in notes
  }

  if (categories) {
    query.category = { $in: Array.isArray(categories) ? categories : [categories] };
  }

  const [expenses, totalExpenses] = await Promise.all([
    expense
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    expense.countDocuments(query),
  ]);

  return {
    expenses: expenses.map((e:any) => ({
        ...e,
        _id: e._id.toString(),
        date: e.date?.toISOString(),
        createdAt: e.createdAt?.toISOString(),
        updatedAt: e.updatedAt?.toISOString(),
        createdBy: {
          ...e.createdBy,
        },
      })),
      totalExpenses,
  };
}
