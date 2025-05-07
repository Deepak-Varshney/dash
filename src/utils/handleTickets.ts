import ticket from "@/models/ticket";
import connectDB from "@/lib/mongodb";
import { Ticket } from "@/constants/data";
import { toast } from "sonner";

export const getTicketBydId = async (ticketId: string) => {
    try {
        await connectDB();
        const ticketData = await ticket.findById(ticketId).lean() as Ticket;

        if (!ticketData) {
            toast.error('Ticket not found');
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
        toast.error('Error fetching ticket');
        return null;
    }
};
