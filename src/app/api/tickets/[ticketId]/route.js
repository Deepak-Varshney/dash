import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import Ticket from "@/models/ticket";

export async function GET(req, { params }) {
  const { ticketId } = params;

  try {
    await connectDB();

    // Find the ticket by its ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
