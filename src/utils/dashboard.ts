// import { Event } from "@/constants/data";
// import connectDB from "@/lib/mongodb";
// import event from "@/models/event";
// import expense from "@/models/expense";
// import ticket from "@/models/ticket";
// import mongoose from "mongoose";

// // Total number of tickets
// export const getTotalTickets = async () => {
//   return await ticket.countDocuments();
// };

// // Tickets by status
// export const getTicketCountByStatus = async (status: string) => {
//   return await ticket.countDocuments({ status });
// };

// // Total expenses of current month
// export const getCurrentMonthExpenses = async () => {
//   const now = new Date();
//   const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
//   const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

//   const result = await expense.aggregate([
//     {
//       $match: {
//         date: { $gte: firstDay, $lte: lastDay },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         total: { $sum: "$amount" },
//       },
//     },
//   ]);

//   return result[0]?.total || 0;
// };

// // Upcoming events (next 7 days)


// export const getUpcomingEvents = async (): Promise<Event[] | null> => {
//   try {
//     await connectDB();

//     const now = new Date();
//     const nextWeek = new Date();
//     nextWeek.setDate(now.getDate() + 7);

//     // Use lean() to return plain JS objects
//     const events = await event.find({
//       createdAt: { $gte: now, $lte: nextWeek },
//     })
//     .sort({ createdAt: 1 })
//     .lean();

//     if (!events || events.length === 0) return [];

//     // Convert _id and other values to serializable formats
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
//       readBy: e.readBy,
//       __v: e.__v,
//     }));

//     return transformedEvents;
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     return null;
//   }
// };


// // Assigned tickets count
// export const getAssignedTicketsCount = async () => {
//   return await ticket.countDocuments({ status: "assigned" });
// };

// // Closed/Done tickets count
// export const getClosedTicketsCount = async () => {
//   return await ticket.countDocuments({ status: "done" });
// };


import { Event } from "@/constants/data";
import connectDB from "@/lib/mongodb";
import event from "@/models/event";
import expense from "@/models/expense";
import ticket from "@/models/ticket";

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
      readBy: e.readBy,
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
