import Event from '@/models/event';
import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './event-tables/columns';
import { EventTable } from './event-tables';
import axios from 'axios';
import connectDB from '@/lib/mongodb';

type EventListingPage = {};

export default async function EventListingPage({ }: EventListingPage) {
  await connectDB()

  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const limit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');

  const query: any = {};
  if (search) query.title = { $regex: search, $options: 'i' };
  if (categories) query.category = { $in: Array.isArray(categories) ? categories : [categories] };
  const rawEvents = await Event.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean(); // ensures plain objects
  const filters = {
    page,
    limit: limit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };
  const events = rawEvents.map(event => ({
    ...event,
    _id: event._id.toString(),
    createdAt: event.createdAt?.toISOString(),
    updatedAt: event.updatedAt?.toISOString(),
  }));
  const totalEvents = await Event.countDocuments();

  return (
    <EventTable
      data={events}
      totalItems={totalEvents}
      columns={columns}
    />
  );
}
