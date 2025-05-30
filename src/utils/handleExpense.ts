import expense from "@/models/expense";
import connectDB from "@/lib/mongodb";
import { Expense } from "@/constants/data";
import { toast } from "sonner";
import { Document, PipelineStage } from 'mongoose'; // or from 'mongodb'

interface GetExpensesParams {
  search?: string;
  category?: string | string[];
  page?: number;
  sort?: string;
  limit?: number;
}

export async function getExpenses({
  search = '',
  category,
  page = 1,
  sort,
  limit = 10
}: GetExpensesParams) {
  await connectDB();

  const offset = (page - 1) * limit;
  const query: any = {};

  // Search filter
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { notes: searchRegex },
      { 'createdBy.firstName': searchRegex },
      { 'createdBy.email': searchRegex }
    ];
  }
  // Parse sort param
  let sortQuery: Record<string, 1 | -1> = { updatedAt: -1 }; // default

  if (sort) {
    try {
      const sortArray = JSON.parse(sort); // Expecting [{ id: 'field', desc: true }]
      if (Array.isArray(sortArray) && sortArray.length > 0) {
        sortQuery = sortArray.reduce((acc, item) => {
          if (item.id && typeof item.desc === 'boolean') {
            acc[item.id] = item.desc ? -1 : 1;
          }
          return acc;
        }, {} as Record<string, 1 | -1>);
      }
    } catch (err) {
      console.warn('Invalid sort param:', sort);
    }
  }


  // Category filter (multi-select support)
  let categoryList: string[] = [];

  if (Array.isArray(category)) {
    categoryList = category;
  } else if (typeof category === 'string' && category.length > 0) {
    categoryList = category.split(',').map((c) => c.trim());
  }

  if (categoryList.length > 0) {
    query.category = { $in: categoryList };
  }

  const totalExpenses = await expense.countDocuments(query);
  const expenses = await expense.find(query)
    .skip(offset)
    .limit(limit)
    .sort(sortQuery)
    .lean();

  const totalPages = Math.ceil(totalExpenses / limit);

  return {
    expenses: expenses.map((expenseDoc) => ({
      _id: expenseDoc._id?.toString(),
      createdAt: expenseDoc.createdAt,
      updatedAt: expenseDoc.updatedAt,
      amount: expenseDoc.amount,
      category: expenseDoc.category,
      __v: expenseDoc.__v,
      notes: expenseDoc.notes,
      date: expenseDoc.date,
      createdBy: expenseDoc.createdBy,
    })),
    totalExpenses,
    totalPages,
    currentPage: page
  };
}



export const updatedExpense = async (expenseId: any, data: Expense) => {
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




const MONTH_IDS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export async function getMonthlyExpensesData(year = new Date().getFullYear()) {
  const raw = await expense.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$date' },
        total: { $sum: '$amount' }
      }
    },
    {
      $project: {
        month: '$_id',
        total: 1,
        _id: 0
      }
    }
  ]);

  // Create a full year with all 12 months, using aggregated totals where present
  const fullYearData = Array.from({ length: 12 }).map((_, i) => {
    const monthData = raw.find(item => item.month === i + 1);
    return {
      id: MONTH_IDS[i],
      name: MONTH_NAMES[i],
      value: monthData ? monthData.total : 0
    };
  });

  return fullYearData;
}
