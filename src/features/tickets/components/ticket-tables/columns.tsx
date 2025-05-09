'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Clock, Loader2, MinusCircle, Send } from 'lucide-react';
import { CellAction } from './cell-action';
import { CATEGORY_OPTIONS } from './options';
import { Ticket } from '@/constants/data';
import AssignTicketDialog from '@/components/modal/assign-ticket';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
const supervisors = [
  { firstName: "Deepak", lastName: "Supervisor", email: "supervisor@gmail.com", clerkId: "user_2w5OH0OjodyZHI7IdQzeowjPyML" },
  { firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", clerkId: "67890" },
  { firstName: "Emily", lastName: "Johnson", email: "emily.johnson@example.com", clerkId: "11223" }
];

export const columns: ColumnDef<Ticket>[] = [
  {
    id: 'category',
    accessorKey: 'category',
    header: ({ column }: { column: Column<Ticket, unknown> }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ cell }) => (
      <Badge variant='outline' className='capitalize'>
        {cell.getValue<Ticket['category']>()}
      </Badge>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Category',
      variant: 'multiSelect',
      options: CATEGORY_OPTIONS
    }
  },
  {
    accessorKey: 'subcategory',
    header: 'Subcategory',
    cell: ({ cell }) => <div>{cell.getValue<Ticket['subcategory']>()}</div>
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ cell }) => (
      <div className="line-clamp-2 text-muted-foreground">
        {cell.getValue<Ticket['description']>()}
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ cell }) => {
      const status = cell.getValue<Ticket['status']>();
      const iconMap = {
        open: Clock,
        assigned: Send,
        extended: Loader2,
        done: CheckCircle2
      };
      const Icon = iconMap[status as keyof typeof iconMap] || MinusCircle;

      return (
        <Badge variant='outline' className='flex items-center gap-1 capitalize'>
          <Icon className="h-4 w-4" />
          {status}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'createdBy',
    header: 'Created By',
    cell: ({ row }) => {
      const createdBy = row.original.createdBy;
      return createdBy?.firstName ? (
        <div>{createdBy?.firstName} {createdBy?.lastName}</div>
      ) : (
        <span className="text-muted-foreground italic">Unassigned</span>
      );
    }
  },
  {
    accessorKey: 'assignedTo.firstName',
    header: 'Assigned To',
    cell: ({ row }) => {
      const assignedTo = row.original.assignedTo;
      return assignedTo?.firstName ? (
        <div>{assignedTo.firstName} {assignedTo.lastName}</div>
      ) : (
        <span className="text-muted-foreground italic">Unassigned</span>
      );
    }
  },
  {
    accessorKey: 'deadline',
    header: 'Deadline',
    cell: ({ cell }) => {
      const value = cell.getValue<Ticket['deadline']>();
      return value ? value : '-';
    }
  },
  // {
  //   id: 'assign',
  //   cell: ({ row }) => {
  //     const { user } = useUser();
  //     if (user?.publicMetadata?.role !== 'admin' && user?.publicMetadata?.role !== 'supervisor') {
  //       return <span className="text-muted-foreground italic">Unassigned</span>;
  //     }
  //     return <AssignTicketDialog supervisors={supervisors} data={row.original} />;
  //   }
  // },
  {
    id: 'assign',
    cell: ({ row }) => {
      const { user } = useUser();
      const ticketAssignedToClerkId = row.original.assignedTo?.clerkId;

      // Check the user's role and whether the supervisor's clerkId matches the ticket's assignedTo
      if (user?.publicMetadata?.role !== 'admin' && user?.publicMetadata?.role !== 'supervisor') {
        // If the user is neither an admin nor a supervisor, don't show the assign button
        return <span className="text-muted-foreground italic">Unassigned</span>;
      }

      if (user?.publicMetadata?.role === 'supervisor') {
        // If the user is a supervisor, check if their clerkId matches the ticket's assignedTo clerkId
        if (user.id == ticketAssignedToClerkId) {
          return <Button onClick={()=>alert("Mark Done!!!")} className="italic">Mark Done?</Button>;
        }
      }

      // For Admins, and Supervisors who are assigned to the ticket, show the Assign Ticket Dialog
      return <AssignTicketDialog supervisors={supervisors} data={row.original} />;
    }
  },
  
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
