import  Ticket from '@/models/ticket'; // Your Mongoose model
import { columns } from './ticket-tables/columns';
import { TicketTable } from './ticket-tables';
import { searchParamsCache } from '@/lib/searchparams';
import connectDB from "@/lib/mongodb";

export default async function TicketListingPage() {
  await connectDB()
  const page = searchParamsCache.get('page');
  const limit = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('name');
  const categories = searchParamsCache.get('category');

  const query: any = {};
  if (search) query.title = { $regex: search, $options: 'i' };
  if (categories) query.category = { $in: Array.isArray(categories) ? categories : [categories] };
  const rawTickets = await Ticket.find(query)
  .skip((page - 1) * limit)
  .limit(limit)
  .lean(); // ensures plain objects

// Convert ObjectId and Date fields to strings for serialization
const tickets = rawTickets.map(ticket => ({
  ...ticket,
  _id: ticket._id.toString(),
  createdAt: ticket.createdAt?.toISOString(),
  updatedAt: ticket.updatedAt?.toISOString(),
}));
  const totalTickets = await Ticket.countDocuments();
  
  return (
    <TicketTable
      data={tickets}
      totalItems={totalTickets}
      columns={columns}
    />
  );
}
