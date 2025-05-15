import { Expense } from '@/constants/data';
import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './payment-tables/columns';
import { ExpenseTable } from './payment-tables';
import { getExpenses } from '@/utils/handleExpense';

type PaymentListingPage = {};

export default async function PaymentListingPage({}: PaymentListingPage) {
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

  const data = await getExpenses(filters);
  const totalExpenses = data.totalExpenses;
  const expenses: Expense[] = data.expenses;

  return (
    <ExpenseTable
      data={expenses}
      totalItems={totalExpenses}
      columns={columns}
    />
  );
}
