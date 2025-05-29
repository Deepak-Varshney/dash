import connectDB from "@/lib/mongodb"
import expense from "@/models/expense"

// 1. Expenses by category
export async function getExpenseAmountByCategory() {
  await connectDB() // Ensure DB connection is established

  const result = await expense.aggregate([
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        category: "$_id",
        totalAmount: 1,
        _id: 0,
      },
    },
  ])
  return result
}

// 2. Expenses over time (grouped by day or week)
export async function getExpensesOverTime() {
  await connectDB() // Ensure DB connection is established

  const result = await expense.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        date: "$_id",
        totalAmount: 1,
        _id: 0,
      },
    },
  ])
  return result
}

// 3. Expenses by user
export async function getExpenseAmountByUser() {
  await connectDB() // Ensure DB connection is established

  const result = await expense.aggregate([
    {
      $match: { createdBy: { $exists: true, $ne: null } },
    },
    {
      $group: {
        _id: "$createdBy.name",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        name: "$_id",
        totalAmount: 1,
        _id: 0,
      },
    },
  ])
  return result
}
