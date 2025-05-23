import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './event-tables/columns';
import { EventTable } from './event-tables';
import { getEvents } from '@/app/actions/handleEvents';
import { Event } from '@/constants/data';

type EventListingPage = {};

export default async function EventListingPage({ }: EventListingPage) {

  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('search');
  const limit = searchParamsCache.get('perPage');
  const sort = searchParamsCache.get('sort');


  const filters = {
    page,
    limit: limit,
    ...(search && { search }),
    ...(sort && { sort })

  };

  const data = await getEvents(filters);
  const totalEvents = data.totalEvents;
  const events: Event[] = data.events;

  return (
    <EventTable
      data={events}
      totalItems={totalEvents}
      columns={columns}
    />
  );
}