import { columns } from './users-tables/columns';
import { UserTable } from './users-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { getTickets } from '@/app/actions/handleTickets';
import { Ticket, User } from '@/constants/data';
import { getUsers } from '@/lib/clerkUsers';

type UserListingPage = {};

export default async function UserListingPage({ }: UserListingPage) {

  const page = searchParamsCache.get('page');
  const limit = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('name');
  const categories = searchParamsCache.get('category');


  const filters = {
    page,
    limit: limit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const data = await getUsers();
  const totalUsers = data.length;
  const users: User[] = data;

  return (
    <UserTable
      data={users}
      totalItems={totalUsers}
      columns={columns}
    />
  );
}