'use server';

import connectDB from '@/lib/mongodb';
import event from '@/models/event';
import { Event } from '@/constants/data';
import { Types } from 'mongoose';
import { currentUser } from '@clerk/nextjs/server';

export async function saveEvent(data: Event) {
    await connectDB();
    const user = await currentUser()
    if (data._id) {
        const id = new Types.ObjectId(data._id);
        await event.findByIdAndUpdate(id, {
            ...data,
            date: new Date(data.date), 
            updatedAt: new Date(),
        });
    } else {
        if (!user) {
            throw new Error("User is not authenticated.");
        }
        await event.create({
            ...data,
            date: new Date(data.date),
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



export async function deleteEvent(eventId: string) {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  if (!Types.ObjectId.isValid(eventId)) {
    throw new Error("Invalid events ID.");
  }

  await event.deleteOne({
    _id: new Types.ObjectId(eventId),
    'createdBy.clerkId': user.id, // optional: only delete if owned by user
  });
}



interface GetEventsParams {
  page?: string | number;
  limit?: string | number;
  search?: string;
  categories?: string | string[];
}

export async function getEvents(params: GetEventsParams) {
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

  const [events, totalEvents] = await Promise.all([
    event
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    event.countDocuments(query),
  ]);

  return {
    events: events.map((e:any) => ({
        ...e,
        _id: e._id.toString(),            
        date: e.date?.toLocaleDateString(),
        createdAt: e.createdAt?.toLocaleDateString(),
        updatedAt: e.updatedAt?.toLocaleDateString(),
        createdBy: {
          ...e.createdBy,
        },
      })),
      totalEvents,
  };
}
