import { notFound } from 'next/navigation';
import EventForm from './event-form';
import { Event } from '@/constants/data';
import { getEventBydId } from '@/utils/handleEvents';

type TEventViewPageProps = {
  eventId: string;
};

export default async function EventViewPage({
  eventId
}: TEventViewPageProps) {
  let event: Event | undefined = undefined;
  let pageTitle = 'Create New Event';

  if (eventId !== 'new') {
    const data = await getEventBydId(eventId)
    event = data as Event;
    if (!event) {
      notFound();
    }
    pageTitle = `Edit Event`;
  }

  return <EventForm initialData={event || undefined} pageTitle={pageTitle} />;

}
