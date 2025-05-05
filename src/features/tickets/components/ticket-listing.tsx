import { Ticket } from '@/constants/data';
import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './ticket-tables/columns';
import { TicketTable } from './ticket-tables';
import axios from 'axios';

type TicketListingPage = {};

export default async function TicketListingPage({}: TicketListingPage) {
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
  const tickets: Ticket[] = data.data

  return (
    <TicketTable
      data={tickets}
      totalItems={totalTickets}
      columns={columns}
    />
  );
}
