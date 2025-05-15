import event from "@/models/event";
import connectDB from "@/lib/mongodb";
import { Event } from "@/constants/data";
import { toast } from "sonner";

export const getEventBydId = async (eventId: string) => {
    try {
      await connectDB();
      const eventData = await event.findById(eventId).lean() as Event;
  
      if (!eventData) {
        toast.error('Event not found');
        return null;
      }
  
      const transformedEvent: Event = {
        _id: eventData._id?.toString(),
        title: eventData.title,
        description: eventData.description,
        createdBy: eventData.createdBy, 
        createdAt: eventData.createdAt,
        date: eventData.date,
        __v: eventData.__v,
      };
  
      return transformedEvent;
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Error fetching event');
      return null;
    }
  };
  