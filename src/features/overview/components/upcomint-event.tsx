import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { getUpcomingEvents } from '@/utils/dashboard';

export async function UpcomingEvents() {
    const upcomingEvents = await getUpcomingEvents();
    if (!upcomingEvents || upcomingEvents.length === 0) {
        return (
            <Card className='h-full'>
                <CardHeader>
                    <CardTitle>No Upcoming Events</CardTitle>
                    <CardDescription>No events scheduled.</CardDescription>
                </CardHeader>
                <CardContent className='text-center'>
                    <p className='text-sm text-muted-foreground'>No upcoming events found.</p>
                </CardContent>
            </Card>
        );
    }


    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>{upcomingEvents.length} events scheduled.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {upcomingEvents.map((event: any) => (
                        <div key={event._id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarImage
                                    src="/default-avatar.png" // Placeholder image if no image URL is available
                                    alt="Avatar"
                                />
                                <AvatarFallback>
                                    {(event.createdBy.firstName[0] + event.createdBy.lastName[0]).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{event.title}</p>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                <p className="text-xs text-muted-foreground">
                                    Scheduled for: {new Date(event.date).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Created by: {event.createdBy.firstName} {event.createdBy.lastName} (
                                    {event.createdBy.email})
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
