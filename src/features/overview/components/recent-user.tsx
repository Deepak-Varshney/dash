// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardTitle,
//   CardDescription
// } from '@/components/ui/card';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Separator } from '@/components/ui/separator';

// import { getUsersFromClerk } from '@/lib/clerkUsers';
// import { getUsers } from '@/lib/clerkUsers';
// export async function RecentUsers() {
//   const users = await getUsersFromClerk();
//   const usersList = await getUsers();
//   console.log('usersList', usersList);
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Recent Users</CardTitle>
//         <CardDescription>{users.length} new users recently joined.</CardDescription>
//         <Separator/>

//       </CardHeader>
//       <CardContent>
//         <ScrollArea className='h-[calc(87vh-20rem)]'>

//           <div className='space-y-8 bg-muted-foreground/6 p-4 rounded-md'>
//             {users.map((user: any) => (
//               <CardContent key={user.id} className='flex items-center'>
//                 <Avatar className='h-9 w-9'>
//                   <AvatarImage src={user.image_url || user.profile_image_url} alt='Avatar' />
//                   <AvatarFallback>
//                     {(user.first_name[0] + user.last_name[0]).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className='ml-4 space-y-1'>
//                   <p className='text-sm font-medium leading-none'>
//                     {user.first_name} {user.last_name}
//                   </p>
//                   <p className='text-sm text-muted-foreground'>
//                     {user.email_addresses[0]?.email_address ?? 'No email'}
//                   </p>
//                   <span>Edit</span>
//                 </div>
//               </CardContent>
//             ))}
//           </div>
//         </ScrollArea>

//       </CardContent>
//     </Card>

//   );
// }


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
import { Button } from '@/components/ui/button';

import { getUsersFromClerk } from '@/lib/clerkUsers';
import { getUsers } from '@/lib/clerkUsers';

// Assuming setRole and removeRole are server-side actions
// import { setRole, removeRole } from '@/lib/roleActions';

export async function RecentUsers() {
  // const users = await getUsersFromClerk();
  const usersList = await getUsers();
  const users = usersList.data;
  const handleAssignRole = async (userId: string) => {
    // Server action to assign role
    // await setRole(userId, 'admin'); // Example: assigning the 'admin' role
    alert(`Assigned role to user with ID: ${userId}`);
  };

  const handleRemoveRole = async (userId: string) => {
    // Server action to remove role
    // await removeRole(userId);
    alert(`Removed role from user with ID: ${userId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>{users.length} new users recently joined.</CardDescription>
        <Separator />
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[calc(87vh-20rem)]">
          <div className="space-y-8 bg-muted-foreground/6 p-4 rounded-md">
            {users && users.map((user: any) => (
              <CardContent key={user.id} className="flex items-center space-x-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.imageUrl || user.profile_image_url} alt="Avatar" />
                  <AvatarFallback>
                    {(user.firstName[0] + user.lastName[0]).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.emailAddresses[0]?.emailAddress ?? 'No email'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Role: {user.publicMetadata?.role || 'No Role Assigned'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last active: {new Date(user.lastActiveAt).toLocaleString()}
                  </p>
                  {user.banned && (
                    <span className="text-sm text-red-500">Banned</span>
                  )}
                  {user.locked && (
                    <span className="text-sm text-yellow-500">Locked</span>
                  )}
                </div>

                <div className="ml-auto space-x-2">
                  {/* Assign Role Button */}
                  <Button  >
                    Assign Role
                  </Button>
                  
                  {/* Remove Role Button */}
                  {user.role && (
                    <Button  variant="destructive">
                      Remove Role
                    </Button>
                  )}
                </div>
              </CardContent>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
