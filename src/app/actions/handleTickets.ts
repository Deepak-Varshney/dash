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
  page?: string | number;
  limit?: string | number;
  search?: string;
  categories?: string | string[];
}

export async function getTickets(params: GetTicketParams) {
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

  const [tickets, totalTickets] = await Promise.all([
    ticket
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    ticket.countDocuments(query),
  ]);

  return {
    tickets: tickets.map((e: any) => ({
      ...e,
      _id: e._id.toString(),
      deadline: e.deadline?.toLocaleDateString(),
      createdAt: e.createdAt?.toLocaleDateString(),
      updatedAt: e.updatedAt?.toLocaleDateString(),
      createdBy: {
        ...e.createdBy,
      },
    })),
    totalTickets,
  };
}

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
