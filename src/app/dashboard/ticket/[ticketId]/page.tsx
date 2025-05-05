import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import TicketViewPage from '@/features/tickets/components/ticket-view-page';

export const metadata = {
  title: 'Dashboard : Ticket View'
};

type PageProps = { params: Promise<{ ticketId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <TicketViewPage ticketId={params.ticketId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
