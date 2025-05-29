import connectDB from "@/lib/mongodb"
import event from "@/models/event"

// 1. Event Count by Type (e.g., Meeting, Webinar, etc.)
export async function getEventCountByType() {
  await connectDB() // Ensure DB connection is established
  const result = await event.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        type: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ])
  return result
}

// 2. Events Over Time (grouped by day, using createdAt)
export async function getEventsOverTime() {
  await connectDB() // Ensure DB connection is established
  const result = await event.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
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

// 3. Event Count by Organizer (assuming organizer's name stored in event.organizer.name)
export async function getEventCountByOrganizer() {
  await connectDB() // Ensure DB connection is established
  const result = await event.aggregate([
    {
      $group: {
        _id: "$organizer.name",
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
