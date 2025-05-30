'use server';

import connectDB from '@/lib/mongodb';
import event from '@/models/event';
import { Event, User } from '@/constants/data';
import { Types } from 'mongoose';
import { currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { sendEmail } from '@/lib/email'; // <-- Create this utility
function generateMeetLink() {
  const code = Math.random().toString(36).substring(2, 9);
  return `https://meet.google.com/${code}`;
}

export async function saveEvent(data: Event) {
  console.log('Saving event:', data);
  await connectDB();
  const user = await currentUser();
  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const baseEventData = {
    ...data,
    date: new Date(data.date),
    updatedAt: new Date(),
  };

  // Optional: Auto-generate a Meet link if it's virtual and no link is given
  if (data.isVirtual && !data.meetingLink) {
    baseEventData.meetingLink = generateMeetLink();
  }

  let savedEvent;
  if (data._id) {
    const id = new Types.ObjectId(data._id);
    savedEvent = await event.findByIdAndUpdate(id, baseEventData, { new: true });
  } else {
    savedEvent = await event.create({
      ...baseEventData,
      createdBy: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        clerkId: user.id,
      },
      createdAt: new Date(),
    });
  }

  // 🔔 Send invites if it's a virtual event
  if (data.isVirtual && baseEventData.meetingLink) {
    const client = await clerkClient();
    const usersResponse = await client.users.getUserList();
    interface ClerkUser {
      emailAddresses?: { emailAddress: string }[];
    }

    const usersList: ClerkUser[] = Array.isArray(usersResponse) ? usersResponse : (usersResponse.data ?? []);
    const emails: string[] = usersList
      .map((u: ClerkUser) => u.emailAddresses?.[0]?.emailAddress)
      .filter(Boolean) as string[];

    await Promise.all(
      emails.map(email =>
        sendEmail({
          to: email,
          subject: `You're Invited: ${data.title}`,
          text: `
Hi there,

You're invited to join our upcoming virtual event: "${data.title}".

📅 Date: ${new Date(data.date).toLocaleString()}
📝 Description: ${data.description}

🔗 Join the meeting: ${baseEventData.meetingLink}

We look forward to seeing you there!

Best regards,  
The Events Team
      `.trim()
        })
      )
    );

  }
}




export async function deleteEvent(eventId: string) {
  await connectDB()
  const user = await currentUser()

  if (!user) {
    throw new Error('User is not authenticated.')
  }

  if (!Types.ObjectId.isValid(eventId)) {
    throw new Error('Invalid event ID.')
  }

  const isAdmin = user.publicMetadata?.role === 'admin'

  const deleteQuery: any = { _id: new Types.ObjectId(eventId) }

  // If not admin, restrict deletion to only events they created
  if (!isAdmin) {
    deleteQuery['createdBy.clerkId'] = user.id
  }

  const result = await event.deleteOne(deleteQuery)

  if (result.deletedCount === 0) {
    throw new Error('You are not authorized to delete this event or it does not exist.')
  }
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
