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
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

export async function getEvents(params: GetEventsParams) {
  await connectDB();

  const {
    page = 1,
    limit = 10,
    search = '',
    sort,
  } = params;


  const offset = (page - 1) * limit;
  const query: any = {};
  // search filter
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { search: searchRegex },
      { title: searchRegex },
      { 'createdBy.lastName': searchRegex },
      { 'createdBy.firstName': searchRegex },
      { 'createdBy.email': searchRegex }
    ];
  }
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
  const totalEvents = await event.countDocuments(query);
  const events = await event.find(query)
    .skip(offset)
    .limit(limit)
    .sort(sortQuery)
    .lean();

  const totalPages = Math.ceil(totalEvents / limit);


  return {
    events: events.map((e: any) => ({
      ...e,
      _id: e._id?.toString(),
      date: e.date?.toLocaleDateString(),
      createdAt: e.createdAt?.toLocaleDateString(),
      updatedAt: e.updatedAt?.toLocaleDateString(),
      createdBy: {
        ...e.createdBy,
      },
    })),
    totalEvents,
    totalPages,
    currentPage: page
  };
}
