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
  await connectDB()
  const user = await currentUser()

  if (!user) {
    throw new Error('User is not authenticated.')
  }

  if (!Types.ObjectId.isValid(expenseId)) {
    throw new Error('Invalid expense ID.')
  }

  const isAdmin = user.publicMetadata?.role === 'admin'

  const deleteQuery: any = { _id: new Types.ObjectId(expenseId) }

  // Only allow non-admins to delete their own expenses
  if (!isAdmin) {
    deleteQuery['createdBy.clerkId'] = user.id
  }

  const result = await expense.deleteOne(deleteQuery)

  if (result.deletedCount === 0) {
    throw new Error('You are not authorized to delete this expense or it does not exist.')
  }
}