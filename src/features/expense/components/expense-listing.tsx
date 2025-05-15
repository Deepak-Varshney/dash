
import { Expense } from '@/constants/data';
import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './expense-tables/columns';
import { ExpenseTable } from './expense-tables';
import { getExpenses } from '@/utils/handleExpense';

export default async function ExpenseListingPage() {
  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('search');
  const sort = searchParamsCache.get('sort');
  const category = searchParamsCache.get('category');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(category && { category }),
    ...(sort && { sort })
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
