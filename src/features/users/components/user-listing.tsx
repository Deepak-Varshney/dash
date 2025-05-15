import { columns } from './users-tables/columns';
import { UserTable } from './users-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { User } from '@/constants/data';
import { getUsers } from '@/lib/clerkUsers';

type UserListingPage = {};

export default async function UserListingPage({ }: UserListingPage) {

  const page = searchParamsCache.get('page');
  const limit = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('search');


  const filters = {
    page,
    limit: limit,
    ...(search && { search }),
  };

  const data = await getUsers(filters);
  const totalUsers = data.totalCount;
  const users: User[] = data.plainUsers;

  return (
    <UserTable
      data={users}
      totalItems={totalUsers}
      columns={columns}
    />
  );
}