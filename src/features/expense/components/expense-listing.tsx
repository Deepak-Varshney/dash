import { Expense } from '@/constants/data';
import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './expense-tables/columns';
import { ExpenseTable } from './expense-tables';
import axios from 'axios';

type ExpenseListingPage = {};

export default async function ExpenseListingPage({}: ExpenseListingPage) {
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

  const data = await axios.get(`/api/expenses`);
  const totalTickets = data.data.length;
  const tickets: Expense[] = data.data

  return (
    <ExpenseTable
      data={tickets}
      totalItems={totalTickets}
      columns={columns}
    />
  );
}
