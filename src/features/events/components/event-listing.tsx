import { Event } from '@/constants/data';
import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './event-tables/columns';
import { EventTable } from './event-tables';
import axios from 'axios';

type EventListingPage = {};

export default async function EventListingPage({}: EventListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const data = await axios.get(`/api/tickets`);
  const totalTickets = data.data.length;
  const tickets: Event[] = data.data

  return (
    <EventTable
      data={tickets}
      totalItems={totalTickets}
      columns={columns}
    />
  );
}
