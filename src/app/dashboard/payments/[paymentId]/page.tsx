import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import PaymentViewPage from '@/features/payments/components/payments-view-page';

export const metadata = {
  title: 'Dashboard : Payment View'
};

type PageProps = { params: Promise<{ paymentId: string }> };

export default async function Page(props: PageProps) {

  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <PaymentViewPage paymentId={params.paymentId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
