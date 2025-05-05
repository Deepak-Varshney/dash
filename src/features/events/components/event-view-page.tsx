import { notFound } from 'next/navigation';
import axios from 'axios';
import EventForm from './event-form';
import { Event } from '@/constants/data';

type TEventViewPageProps = {
  eventId: string;
};

export default async function EventViewPage({
  eventId
}: TEventViewPageProps) {
  let event = null;
  let pageTitle = 'Create New Event';

  if (eventId !== 'new') {
    const data = await axios.get(`/api/events/${eventId}`);
    event = data.data as Event;
    if (!event) {
      notFound();
    }
    pageTitle = `Edit Event`;
  }

  return <EventForm pageTitle={pageTitle} />;

}
