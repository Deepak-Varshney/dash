import { notFound } from 'next/navigation';
import TicketForm from '@/features/tickets/components/ticket-form';
import { Ticket } from '@/constants/data';
import { getTicketBydId } from '@/app/actions/handleTickets';

type TTicketViewPageProps = {
  ticketId: string;
};

export default async function TicketViewPage({
  ticketId
}: TTicketViewPageProps) {
  let ticket: Ticket | undefined = undefined;
  let pageTitle = 'Create New Ticket';

  if (ticketId !== 'new') {
    const data = await getTicketBydId(ticketId)
    ticket = data as Ticket;
    if (!ticket) {
      notFound();
    }
    pageTitle = `Edit Ticket`;
  }

  return <TicketForm initialData={ticket || undefined} pageTitle={pageTitle} />;

}
