'use server';

import connectDB from '@/lib/mongodb';
import ticket from '@/models/ticket';
import { Ticket } from '@/constants/data';
import { Types } from 'mongoose';
import { currentUser } from '@clerk/nextjs/server';

export async function saveTicket(data: Ticket) {
  await connectDB();
  const user = await currentUser()
  if (data._id) {
    const id = new Types.ObjectId(data._id);
    await ticket.findByIdAndUpdate(id, {
      ...data,
      updatedAt: new Date(),
    });
  } else {
    if (!user) {
      throw new Error("User is not authenticated.");
    }
    await ticket.create({
      ...data,
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



export async function deleteTicket(ticketId: string) {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  if (!Types.ObjectId.isValid(ticketId)) {
    throw new Error("Invalid ticket ID.");
  }

  await ticket.deleteOne({
    _id: new Types.ObjectId(ticketId),
    'createdBy.clerkId': user.id
  });
}



interface GetTicketParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string | string[];
  sort?: string;
}
export async function getTickets({
  search = '',
  category,
  page = 1,
  sort,
  limit = 10
}: GetTicketParams) {
  await connectDB();

  const offset = (page - 1) * limit;
  const query: any = {};
  const user = await currentUser()
  const role = user?.publicMetadata?.role;
  const clerkId = user?.id;
  // Role-based access
  if (!user) {
    throw new Error('Unauthorized');
  }

  switch (role) {
    case 'user':
    case undefined:
      query['createdBy.clerkId'] = clerkId;
      break;
    case 'supervisor':
      query['assignedTo.clerkId'] = clerkId;
      break;
    case 'admin':
      // See all tickets — no query constraints
      break;
    default:
      // Optionally deny unknown roles
      throw new Error(`Invalid role: ${role}`);
  }
  // Search filter
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { description: searchRegex },
      { 'createdBy.firstName': searchRegex },
      { 'createdBy.email': searchRegex }
    ];
  }
  // Parse sort param
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


  // Category filter (multi-select support)
  let categoryList: string[] = [];

  if (Array.isArray(category)) {
    categoryList = category;
  } else if (typeof category === 'string' && category.length > 0) {
    categoryList = category.split(',').map((c) => c.trim());
  }

  if (categoryList.length > 0) {
    query.category = { $in: categoryList };
  }

  const totalTickets = await ticket.countDocuments(query);
  const tickets = await ticket.find(query)
    .skip(offset)
    .limit(limit)
    .sort(sortQuery)
    .lean();

  const totalPages = Math.ceil(totalTickets / limit);

  return {
    tickets: tickets.map((ticketDoc) => ({
      ...ticketDoc,
      _id: ticketDoc._id?.toString(),
      deadline: ticketDoc.deadline?.toLocaleDateString(),
      createdAt: ticketDoc.createdAt?.toLocaleDateString(),
      updatedAt: ticketDoc.updatedAt?.toLocaleDateString(),
      category: ticketDoc.category,
      subcategory: ticketDoc.subcategory,
      status: ticketDoc.status,
      createdBy: {
        ...ticketDoc.createdBy
      },
    })),
    totalTickets,
    totalPages,
    currentPage: page
  };
}



export const getTicketBydId = async (ticketId: string) => {
  try {
    await connectDB();
    const ticketData = await ticket.findById(ticketId).lean() as Ticket;

    if (!ticketData) {
      return null;
    }

    const transformedTicket: Ticket = {
      _id: ticketData._id?.toString(),
      category: ticketData.category,
      subcategory: ticketData.subcategory,
      description: ticketData.description,
      createdBy: ticketData.createdBy,
      createdAt: ticketData.createdAt,
      __v: ticketData.__v,
    };

    return transformedTicket;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return null;
  }
};


export async function assignTicket(ticketId: string | any, supervisor: {
  firstName: string;
  lastName: string;
  email: string;
  clerkId: string;
}, deadline?: string) {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  if (!Types.ObjectId.isValid(ticketId)) {
    throw new Error("Invalid ticket ID.");
  }

  const updateData: any = {
    assignedTo: supervisor,
    status: 'assigned',
    updatedAt: new Date(),
  };

  if (deadline) {
    updateData.deadline = new Date(deadline);
  }

  const updatedTicket = await ticket.findByIdAndUpdate(
    ticketId,
    updateData,
    { new: true }
  );

  if (!updatedTicket) {
    throw new Error("Ticket not found or update failed.");
  }

  return {
    ...updatedTicket.toObject(),
    _id: updatedTicket._id.toString(),
    deadline: updatedTicket.deadline?.toISOString(),
    createdAt: updatedTicket.createdAt?.toISOString(),
    updatedAt: updatedTicket.updatedAt?.toISOString(),
  };
}

export async function updateTicketStatus(ticketId: string, status: "extended" | "done", deadline?: string) {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  if (!Types.ObjectId.isValid(ticketId)) {
    throw new Error("Invalid ticket ID.");
  }

  const ticketData = await ticket.findById(ticketId);

  if (!ticketData || ticketData.assignedTo?.clerkId !== user.id) {
    throw new Error("Not authorized to update this ticket.");
  }

  const updateData: any = {
    status,
    updatedAt: new Date(),
  };

  if (status === 'extended' && deadline) {
    updateData.deadline = new Date(deadline);
  }

  const updatedTicket = await ticket.findByIdAndUpdate(ticketId, updateData, { new: true });

  return {
    ...updatedTicket.toObject(),
    _id: updatedTicket._id.toString(),
    deadline: updatedTicket.deadline?.toISOString(),
    createdAt: updatedTicket.createdAt?.toISOString(),
    updatedAt: updatedTicket.updatedAt?.toISOString(),
  };
}
