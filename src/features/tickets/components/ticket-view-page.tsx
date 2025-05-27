import { notFound } from 'next/navigation';
import TicketForm from '@/features/tickets/components/ticket-form';
import { Ticket } from '@/constants/data';
import { getTicketBydId } from '@/app/actions/handleTickets';
import { getSupervisors } from '@/utils/dashboard';

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
  const data = await getSupervisors();

  const supervisor = data.map(user => ({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: (user.emailAddresses && user.emailAddresses[0]?.emailAddress) || '',
    id: user.id || ''
  }));

  return <TicketForm supervisors={supervisor} initialData={ticket || undefined} pageTitle={pageTitle} />;

}
