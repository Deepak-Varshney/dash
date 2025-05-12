import { notFound } from 'next/navigation';
import { User } from '@/constants/data';
import { getUserById } from '@/lib/clerkUsers';
import { RegistrationForm } from '@/components/register-form';

type TUserViewPageProps = {
  userId: string;
};

export default async function UserViewPage({
  userId
}: TUserViewPageProps) {
  let user: User | undefined = undefined;
  let pageTitle = 'Create New User';

  if (userId !== 'new') {
    const data = await getUserById(userId)
    user = data as User;
    if (!user) {
      notFound();
    }
    pageTitle = `Edit User`;
  }

  return <RegistrationForm initialData={user} />

}
