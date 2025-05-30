// import {
//     Card,
//     CardHeader,
//     CardContent,
//     CardTitle,
//     CardDescription,
// } from '@/components/ui/card';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Separator } from '@/components/ui/separator';
// import { Event } from '@/constants/data';
// import { getdata } from '@/utils/dashboard';
// import { Calendar, User } from 'lucide-react';

// export async function data() {
//     const data = await getdata();

//     if (!data || data.length === 0) {
//         return (
//             <Card className="h-full">
//                 <CardHeader>
//                     <CardTitle>No Upcoming Events</CardTitle>
//                     <CardDescription>No events scheduled.</CardDescription>
//                 </CardHeader>
//                 <CardContent className="text-center">
//                     <p className="text-sm text-muted-foreground">No upcoming events found.</p>
//                 </CardContent>
//             </Card>
//         );
//     }

//     return (
//         <div className="lg:col-span-2 space-y-4">
//             <h2 className="font-semibold text-lg">Upcoming Events ({data.length})</h2>
//             <ScrollArea className='h-96'>
//                 {data.map((event: Event) => (
//                     <Card className=' my-5' key={event._id}>
//                         <CardContent className="p-4 border-l-4 border-primary">
//                             <p className="font-semibold">{event.title}</p>
//                             <p className="text-sm">{event.description}</p>
//                             <p className="text-xs flex items-center gap-1 text-muted-foreground mt-1">
//                                 <Calendar size={13} /> {new Date(event.date).toLocaleDateString()}
//                             </p>
//                             <p className="text-xs text-muted-foreground flex items-center gap-1">
//                                 <User size={13} /><span> {event.createdBy?.firstName} {event.createdBy?.lastName} ({event.createdBy?.email})</span>
//                             </p>
//                         </CardContent>
//                     </Card>

//                 ))}
//             </ScrollArea>
//         </div>
//     );
// }

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Event } from '@/constants/data';
import { Calendar, User } from 'lucide-react';

interface dataProps {
    data: Event[] | null;
}

export function UpcomingEvents({ data }: dataProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>No Upcoming Events</CardTitle>
                    <CardDescription>No events scheduled.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">No upcoming events found.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-lg">Upcoming Events ({data.length})</h2>
            <ScrollArea className="h-96">
                {data.map((event: Event) => (
                    <Card className="my-5" key={event._id}>
                        <CardContent className="p-4 border-l-4 border-primary">
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm">{event.description}</p>
                            <p className="text-xs flex items-center gap-1 text-muted-foreground mt-1">
                                <Calendar size={13} /> {new Date(event.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <User size={13} />
                                <span>
                                    {event.createdBy?.firstName} {event.createdBy?.lastName} ({event.createdBy?.email})
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </ScrollArea>
        </div>
    );
}
