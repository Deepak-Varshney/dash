// import ticket from "@/models/ticket"

// // 1. Tickets by category
// export async function getTicketCountByCategory() {
//   const result = await ticket.aggregate([
//     {
//       $group: {
//         _id: "$category",
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $project: {
//         category: "$_id",
//         count: 1,
//         _id: 0,
//       },
//     },
//   ])
//   return result
// }

// // 2. Tickets by status
// export async function getTicketCountByStatus() {
//   const result = await ticket.aggregate([
//     {
//       $group: {
//         _id: "$status",
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $project: {
//         status: "$_id",
//         count: 1,
//         _id: 0,
//       },
//     },
//   ])
//   return result
// }

// // 3. Tickets over time (by createdAt date, grouped by day)
// export async function getTicketsCreatedOverTime() {
//   const result = await ticket.aggregate([
//     {
//       $group: {
//         _id: {
//           $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
//         },
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $sort: { _id: 1 },
//     },
//     {
//       $project: {
//         date: "$_id",
//         count: 1,
//         _id: 0,
//       },
//     },
//   ])
//   return result
// }

// // 4. Tickets by assigned supervisor (workload)
// export async function getTicketCountByAssignee() {
//   const result = await ticket.aggregate([
//     {
//       $match: {
//         "assignedTo.firstName": { $exists: true, $ne: null },
//       },
//     },
//     {
//       $group: {
//         _id: "$assignedTo.firstName",
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $project: {
//         name: "$_id",
//         count: 1,
//         _id: 0,
//       },
//     },
//   ])
//   return result
// }

// // 5. Tickets by subcategory (for pie charts)
// export async function getTicketCountBySubcategory() {
//   const result = await ticket.aggregate([
//     {
//       $group: {
//         _id: "$subcategory",
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $project: {
//         subcategory: "$_id",
//         count: 1,
//         _id: 0,
//       },
//     },
//   ])
//   return result
// }

// // 6. Overdue ticket count
// export async function getOverdueTicketCount() {
//   const now = new Date()
//   const count = await ticket.countDocuments({
//     status: { $ne: "done" },
//     deadline: { $lt: now },
//   })
//   return { overdue: count }
// }


import connectDB from "@/lib/mongodb"
import ticket from "@/models/ticket"
import { currentUser } from "@clerk/nextjs/server"

// Helper to get filter based on user role
async function getTicketAccessFilter() {
  const user = await currentUser()
  if (!user) throw new Error("User not authenticated")

  const role = user.publicMetadata?.role
  const clerkId = user.id

  if (role === "admin") return {}
  if (role === "supervisor") return { "assignedTo.clerkId": clerkId }

  return { "createdBy.clerkId": clerkId }
}

// 1. Tickets by category
export async function getTicketCountByCategory() {
  await connectDB() // Ensure DB connection is established
  const match = await getTicketAccessFilter()
  const result = await ticket.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        category: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ])
  return result
}

// 2. Tickets by status
export async function getTicketCountByStatus() {
  await connectDB() // Ensure DB connection is established
  const match = await getTicketAccessFilter()
  const result = await ticket.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ])
  return result
}

// 3. Tickets over time (by createdAt date, grouped by day)
export async function getTicketsCreatedOverTime() {
  await connectDB() // Ensure DB connection is established
  const match = await getTicketAccessFilter()
  const result = await ticket.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ])
  return result
}

// 4. Tickets by assigned supervisor (workload)
export async function getTicketCountByAssignee() {
  await connectDB() // Ensure DB connection is established
  const match = await getTicketAccessFilter()
  const result = await ticket.aggregate([
    { $match: { ...match, "assignedTo.firstName": { $exists: true, $ne: null } } },
    {
      $group: {
        _id: "$assignedTo.firstName",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        name: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ])
  return result
}

// 5. Tickets by subcategory (for pie charts)
export async function getTicketCountBySubcategory() {
  await connectDB() // Ensure DB connection is established
  const match = await getTicketAccessFilter()
  const result = await ticket.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$subcategory",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        subcategory: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ])
  return result
}

// 6. Overdue ticket count
export async function getOverdueTicketCount() {
  await connectDB() // Ensure DB connection is established
  const now = new Date()
  const match = await getTicketAccessFilter()
  const count = await ticket.countDocuments({
    ...match,
    status: { $ne: "done" },
    deadline: { $lt: now },
  })
  return { overdue: count }
}
