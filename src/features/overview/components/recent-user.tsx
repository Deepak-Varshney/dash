import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { getUsersFromClerk } from '@/lib/clerkUsers';
export async function RecentUsers() {
  const users = await getUsersFromClerk();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>{users.length} new users recently joined.</CardDescription>
        <Separator/>

      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[calc(87vh-20rem)]'>

          <div className='space-y-8 bg-muted-foreground/6 p-4 rounded-md'>
            {users.map((user: any) => (
              <CardContent key={user.id} className='flex items-center'>
                <Avatar className='h-9 w-9'>
                  <AvatarImage src={user.image_url || user.profile_image_url} alt='Avatar' />
                  <AvatarFallback>
                    {(user.first_name[0] + user.last_name[0]).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm font-medium leading-none'>
                    {user.first_name} {user.last_name}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {user.email_addresses[0]?.email_address ?? 'No email'}
                  </p>
                  <span>Edit</span>
                </div>
              </CardContent>
            ))}
          </div>
        </ScrollArea>

      </CardContent>
    </Card>

  );
}
