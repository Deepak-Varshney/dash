import { notFound } from 'next/navigation';
import axios from 'axios';
import ExpenseForm from './expense-form';
import { Expense } from '@/constants/data';

type TExpenseViewPageProps = {
  expenseId: string;
};

export default async function ExpenseViewPage({
  expenseId
}: TExpenseViewPageProps) {
  let expense = null;
  let pageTitle = 'Create New Expense';

  if (expenseId !== 'new') {
    const data = await axios.get(`/api/expenses/${expenseId}`);
    expense = data.data as Expense;
    if (!expense) {
      notFound();
    }
    pageTitle = `Edit Expense`;
  }

  return <ExpenseForm pageTitle={pageTitle} />;

}
