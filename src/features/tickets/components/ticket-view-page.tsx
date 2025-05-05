import { Ticket } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import TicketForm from '@/features/tickets/components/ticket-form';
import axios from 'axios';

type TTicketViewPageProps = {
  ticketId: string;
};

export default async function TicketViewPage({
  ticketId
}: TTicketViewPageProps) {
  let ticket = null;
  let pageTitle = 'Create New Ticket';

  if (ticketId !== 'new') {
    const data = await axios.get(`/api/tickets/${ticketId}`);
    ticket = data.data as Ticket;
    if (!ticket) {
      notFound();
    }
    pageTitle = `Edit Ticket`;
  }

  return <TicketForm pageTitle={pageTitle} />;

}
