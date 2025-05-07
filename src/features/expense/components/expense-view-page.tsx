import { notFound } from 'next/navigation';
import ExpenseForm from './expense-form';
import { Expense } from '@/constants/data';
import { getExpenseBydId } from '@/utils/handleExpense';

type TExpenseViewPageProps = {
  expenseId: string;
};

export default async function ExpenseViewPage({
  expenseId
}: TExpenseViewPageProps) {
  let expense: Expense | undefined = undefined;
  let pageTitle = 'Create New Expense';

  if (expenseId !== 'new') {
    const data = await getExpenseBydId(expenseId);
    expense = data as Expense;
    if (!expense) {
      notFound();
    }
    pageTitle = `Edit Expense`;
  }

  return <ExpenseForm initialData={expense || undefined} pageTitle={pageTitle} />;

}
