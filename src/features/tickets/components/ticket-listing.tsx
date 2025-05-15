import { columns } from './ticket-tables/columns';
import { TicketTable } from './ticket-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { getTickets } from '@/app/actions/handleTickets';
import { Ticket } from '@/constants/data';

type TicketListingPage = {};

export default async function TicketListingPage({ }: TicketListingPage) {

  const page = searchParamsCache.get('page');
  const limit = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('search');
  const sort = searchParamsCache.get('sort');
  const category = searchParamsCache.get('category');


  const filters = {
    page,
    limit: limit,
    ...(search && { search }),
    ...(category && { category }),
    ...(sort && { sort })
  };

  const data = await getTickets(filters);
  const totalTickets = data.totalTickets;
  const tickets: Ticket[] = data.tickets;

  return (
    <TicketTable
      data={tickets}
      totalItems={totalTickets}
      columns={columns}
    />
  );
}