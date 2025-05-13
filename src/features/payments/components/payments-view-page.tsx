import { notFound } from 'next/navigation';
import { Expense } from '@/constants/data';
import { getExpenseBydId } from '@/utils/handleExpense';
import PaymentForm from './payment-form';

type TPaymentViewPageProps = {
  paymentId: string;
};

export default async function PaymentViewPage({
  paymentId
}: TPaymentViewPageProps) {
  let expense: Expense | undefined = undefined;
  let pageTitle = 'Create New Expense';

  if (paymentId !== 'new') {
    const data = await getExpenseBydId(paymentId);
    expense = data as Expense;
    if (!expense) {
      notFound();
    }
    pageTitle = `Edit Payment`;
  }

  return <PaymentForm initialData={expense || undefined} pageTitle={pageTitle} />;

}
