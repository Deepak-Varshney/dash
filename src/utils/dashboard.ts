// import { Event } from "@/constants/data";
// import connectDB from "@/lib/mongodb";
// import event from "@/models/event";
// import expense from "@/models/expense";
// import ticket from "@/models/ticket";
// import { clerkClient } from "@clerk/nextjs/server";

// // New: Get ticket count before a given date
// export const getTicketCountBeforeDate = async (status?: string, beforeDate?: Date): Promise<number> => {
//   try {
//     await connectDB();
//     const query: any = {};
//     if (beforeDate) query.createdAt = { $lt: beforeDate };
//     if (status) query.status = status;

//     return await ticket.countDocuments(query).lean();
//   } catch (error) {
//     console.error(`Error fetching previous ticket count for status "${status}":`, error);
//     return 0;
//   }
// };

// // New: Trend calculation helper
// // export const calculateTrend = (current: number, previous: number): string => {
// //   if (previous === 0) {
// //     if (current === 0) return '0%';
// //     if (current === 1) return '+100%'; // Single item added
// //     return `+${current * 100}%`; // Scale up reasonably
// //   }

// //   const change = ((current - previous) / previous) * 100;
// //   return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
// // };

// export const calculateTrend = (current: number, previous: number): string => {
//   if (previous === 0) {
//     if (current === 0) return '0%';
//     return '+100%'; // or 'New' or 'N/A'
//   }
//   const change = ((current - previous) / previous) * 100;
//   return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`;
// };


// // Total number of tickets
// export const getTotalTickets = async () => {
//   try {
//     await connectDB();

//     const result = await ticket.countDocuments().lean(); // Using .lean() for better performance
//     return result;
//   } catch (error) {
//     console.error("Error counting total tickets:", error);
//     return 0;
//   }
// };



// // Total expenses of current month
// export const getCurrentMonthExpenses = async () => {
//   try {
//     await connectDB();

//     const now = new Date();
//     const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
//     const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

//     const result = await expense.aggregate([
//       {
//         $match: {
//           date: { $gte: firstDay, $lte: lastDay },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$amount" },
//         },
//       },
//     ]);

//     return result[0]?.total || 0;
//   } catch (error) {
//     console.error("Error fetching current month expenses:", error);
//     return 0;
//   }
// };

// // Upcoming events (next 7 days)
// export const getUpcomingEvents = async (): Promise<Event[] | null> => {
//   try {
//     await connectDB();

//     const now = new Date();
//     const nextWeek = new Date();
//     nextWeek.setDate(now.getDate() + 7);

//     // Use lean() to return plain JS objects and for better performance
//     const events = await event
//       .find({
//         date: { $gte: now, $lte: nextWeek },
//       })
//       .sort({ date: 1 })
//       .lean(); // Ensuring lean() is used here

//     if (!events || events.length === 0) return [];

//     // Transform events to match the Event interface/shape
//     const transformedEvents: Event[] = events.map((e: any) => ({
//       _id: e._id?.toString(),
//       title: e.title,
//       description: e.description,
//       createdBy: {
//         firstName: e.createdBy.firstName,
//         lastName: e.createdBy.lastName,
//         email: e.createdBy.email,
//         clerkId: e.createdBy.clerkId,
//       },
//       createdAt: e.createdAt,
//       date: e.date,
//       __v: e.__v,
//     }));

//     return transformedEvents;
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     return null;
//   }
// };

// export const getExpensesInRange = async (startDate: Date, endDate: Date): Promise<number> => {
//   try {
//     await connectDB();

//     const result = await expense.aggregate([
//       {
//         $match: {
//           date: { $gte: startDate, $lte: endDate },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$amount" },
//         },
//       },
//     ]);

//     return result[0]?.total || 0;
//   } catch (error) {
//     console.error(`Error fetching expenses from ${startDate} to ${endDate}:`, error);
//     return 0;
//   }
// };


// export const getMonthlyExpenses = async (month: number, year: number): Promise<number> => {
//   try {
//     await connectDB();

//     const firstDay = new Date(year, month - 1, 1);
//     const lastDay = new Date(year, month, 0, 23, 59, 59, 999);

//     const result = await expense.aggregate([
//       {
//         $match: {
//           date: { $gte: firstDay, $lte: lastDay },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$amount" },
//         },
//       },
//     ]);

//     return result[0]?.total || 0;
//   } catch (error) {
//     console.error(`Error fetching expenses for ${month}/${year}:`, error);
//     return 0;
//   }
// };

// function sanitize(obj: any): any {
//   if (Array.isArray(obj)) {
//     return obj.map(sanitize);
//   } else if (obj && typeof obj === 'object') {
//     return Object.fromEntries(
//       Object.entries(obj).map(([key, value]) => [key, sanitize(value)])
//     );
//   }
//   return obj;
// }
// export async function getUsers() {
//   const client = await clerkClient();
//   const users = await client.users.getUserList({ limit: 100 });

//   const plainUsers = users.data.map((user) => sanitize(user));

//   return plainUsers;
// }

// export async function getSupervisors() {
//   const client = await clerkClient();
//   const users = await client.users.getUserList({ limit: 1000 });

//   const plainUsers = users.data.map((user) => sanitize(user));
//   const supervisors = plainUsers.filter(
//     (user: any) => user.publicMetadata?.role === 'supervisor'
//   );

//   return supervisors;
// }

import { Event } from "@/constants/data";
import connectDB from "@/lib/mongodb";
import event from "@/models/event";
import expense from "@/models/expense";
import ticket from "@/models/ticket";
import { clerkClient } from "@clerk/nextjs/server";

// New: Get ticket count before a given date
export const getTicketCountBeforeDate = async (status?: string, beforeDate?: Date): Promise<number> => {
  try {
    await connectDB();
    const query: any = {};
    if (beforeDate) query.createdAt = { $lt: beforeDate };
    if (status) query.status = status;

    return await ticket.countDocuments(query).lean();
  } catch (error) {
    console.error(`Error fetching previous ticket count for status "${status}":`, error);
    return 0;
  }
};

/**
 * Gets ticket counts grouped by month, optionally filtered by status.
 * @param status Optional ticket status to filter by.
 * @returns Array of objects with year, month, and count.
 */
export const getTicketsByMonth = async (status?: string) => {
  try {
    await connectDB();

    const matchStage: any = {};
    if (status) {
      matchStage.status = status;
    }

    const result = await ticket.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // Optional: Format the result for easier consumption
    return result.map(item => ({
      year: item._id.year,
      month: item._id.month,
      count: item.count,
    }));
  } catch (error) {
    console.error("Error fetching ticket counts by month:", error);
    return [];
  }
};

// // New: Trend calculation helper
// export const calculateTrend = (current: number, previous: number): string => {
//   if (previous === 0) {
//     if (current === 0) return '0%';
//     if (current === 1) return '+100%'; // Single item added
//     return `+${current * 100}%`; // Scale up reasonably
//   }

//   const change = ((current - previous) / previous) * 100;
//   return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
// };

// export const calculateTrend = (current: number, previous: number): string => {
//   if (previous === 0) {
//     if (current === 0) return '0%';
//     return '+100%'; // or 'New' or 'N/A'
//   }
//   const change = ((current - previous) / previous) * 100;
//   return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`;
// };

export function calculateTrend(current: number, previous: number): string {
  if (!isFinite(previous) || previous === 0) {
    if (current === 0) return '0%';
    return '100%'; // Avoid division by zero
  }
  const change = ((current - previous) / previous) * 100;
  return `${change.toFixed(2)}%`;
}

// Total number of tickets
export const getTotalTickets = async () => {
  try {
    await connectDB();

    const result = await ticket.countDocuments().lean(); // Using .lean() for better performance
    return result;
  } catch (error) {
    console.error("Error counting total tickets:", error);
    return 0;
  }
};

// Tickets by status
export const getTicketCountWithStatus = async (status: string) => {
  await connectDB();
  try {
    const result = await ticket.countDocuments({ status }).lean(); // Using .lean()
    return result;
  } catch (error) {
    console.error(`Error counting tickets with status ${status}:`, error);
    return 0;
  }
};

// Total expenses of current month
export const getCurrentMonthExpenses = async () => {
  try {
    await connectDB();

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await expense.aggregate([
      {
        $match: {
          date: { $gte: firstDay, $lte: lastDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return result[0]?.total || 0;
  } catch (error) {
    console.error("Error fetching current month expenses:", error);
    return 0;
  }
};

// // Tickets by status
export const getTicketCountByStatus = async (status: string) => {
  await connectDB();
  try {
    const result = await ticket.countDocuments({ status }).lean(); // Using .lean()
    return result;
  } catch (error) {
    console.error(`Error counting tickets with status ${status}:`, error);
    return 0;
  }
};
// Upcoming events (next 7 days)
export const getUpcomingEvents = async (): Promise<Event[] | null> => {
  try {
    await connectDB();

    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    // Use lean() to return plain JS objects and for better performance
    const events = await event
      .find({
        date: { $gte: now, $lte: nextWeek },
      })
      .sort({ date: 1 })
      .lean(); // Ensuring lean() is used here

    if (!events || events.length === 0) return [];

    // Transform events to match the Event interface/shape
    const transformedEvents: Event[] = events.map((e: any) => ({
      _id: e._id?.toString(),
      title: e.title,
      description: e.description,
      createdBy: {
        firstName: e.createdBy.firstName,
        lastName: e.createdBy.lastName,
        email: e.createdBy.email,
        clerkId: e.createdBy.clerkId,
      },
      createdAt: e.createdAt,
      date: e.date,
      __v: e.__v,
    }));

    return transformedEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
};

export const getExpensesInRange = async (startDate: Date, endDate: Date): Promise<number> => {
  try {
    await connectDB();

    const result = await expense.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return result[0]?.total || 0;
  } catch (error) {
    console.error(`Error fetching expenses from ${startDate} to ${endDate}:`, error);
    return 0;
  }
};


export const getMonthlyExpenses = async (month: number, year: number): Promise<number> => {
  try {
    await connectDB();

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0, 23, 59, 59, 999);

    const result = await expense.aggregate([
      {
        $match: {
          date: { $gte: firstDay, $lte: lastDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return result[0]?.total || 0;
  } catch (error) {
    console.error(`Error fetching expenses for ${month}/${year}:`, error);
    return 0;
  }
};

function sanitize(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, sanitize(value)])
    );
  }
  return obj;
}
export async function getUsers() {
  const client = await clerkClient();
  const users = await client.users.getUserList({ limit: 100 });

  const plainUsers = users.data.map((user) => sanitize(user));

  return plainUsers;
}

export async function getSupervisors() {
  const client = await clerkClient();
  const users = await client.users.getUserList({ limit: 1000 });

  const plainUsers = users.data.map((user) => sanitize(user));
  const supervisors = plainUsers.filter(
    (user: any) => user.publicMetadata?.role === 'supervisor'
  );

  return supervisors;
}