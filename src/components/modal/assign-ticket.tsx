

'use client';
import React, { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Ticket } from '@/constants/data';
import { assignTicket } from '@/app/actions/handleTickets';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AssignTicketDialogProps {
    data: Ticket;
    supervisors: { firstName: string; lastName: string; email: string; clerkId: string }[]; // Supervisors passed as a prop
}

const AssignTicketDialog: React.FC<AssignTicketDialogProps> = ({ data, supervisors }) => {
    useEffect(() => {
        const fetchData = async () => {
            console.log('Use effect is working');
        };
        fetchData();
    }, []);

    const [deadline, setDeadline] = useState('');
    const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAssignClick = async () => {
        if (!selectedSupervisor) {
            setError('Please select a supervisor.');
            return;
        }

        const supervisor = supervisors.find((supervisor) => supervisor.clerkId === selectedSupervisor);
        if (!supervisor) {
            setError('Selected supervisor not found.');
            return;
        }

        try {
            const updatedTicket = await assignTicket(data._id, supervisor, deadline);
            if (updatedTicket) {
                toast.success(`Ticket assigned to ${updatedTicket.assignedTo.firstName} successfully!`);
                router.refresh();
            }
            setError(null); // Clear any previous error
        } catch (err: any) {
            setError(err.message || 'An error occurred while assigning the ticket.');
            toast.error(err.message || 'An error occurred while assigning the ticket.');
        }
    };

    return (
        <AlertDialog>
            <Button variant="outline" asChild>
                <AlertDialogTrigger>Assign</AlertDialogTrigger>
            </Button>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to assign the ticket?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will assign the ticket to the selected user.
                    </AlertDialogDescription>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                        <Input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Supervisor</label>
                        <Select value={selectedSupervisor || ''} onValueChange={setSelectedSupervisor}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a supervisor" />
                            </SelectTrigger>
                            <SelectContent>
                                {supervisors.map((supervisor) => (
                                    <SelectItem key={supervisor.clerkId} value={supervisor.clerkId}>
                                        {supervisor.firstName} {supervisor.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAssignClick}>Assign</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AssignTicketDialog;
