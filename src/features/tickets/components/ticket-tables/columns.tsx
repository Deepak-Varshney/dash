'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Clock, Loader2, MinusCircle, Send } from 'lucide-react';
import { CellAction } from './cell-action';
import { Ticket } from '@/constants/data';
import AssignTicketDialog from '@/components/modal/assign-ticket';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CATEGORY_OPTIONS } from '@/features/expense/components/expense-tables/options';
import { updateTicketStatus } from '@/app/actions/handleTickets';
import { useRouter } from 'next/navigation';
const supervisors = [
  { firstName: "Deepak", lastName: "Supervisor", email: "supervisor@gmail.com", clerkId: "user_2w5OH0OjodyZHI7IdQzeowjPyML" },
  { firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", clerkId: "67890" },
  { firstName: "Emily", lastName: "Johnson", email: "emily.johnson@example.com", clerkId: "11223" }
];
const CellAssignWrapper = ({
  row,
  supervisors,
  AssignDialogComponent,
}: {
  row: any;
  supervisors: any[];
  AssignDialogComponent: React.ComponentType<{ data: any; supervisors: any[] }>;
}) => {
  const { user } = useUser();
  const ticketAssignedToClerkId = row.original.assignedTo?.clerkId;
  const router = useRouter();
  if (user?.publicMetadata?.role !== 'admin' && user?.publicMetadata?.role !== 'supervisor') {
    return <span className="text-muted-foreground italic">Unassigned</span>;
  }

  // if (user?.publicMetadata?.role === 'supervisor') {
  //   if (user.id === ticketAssignedToClerkId) {
  //     return <Button onClick={() => alert("Mark Done!!!")} className="italic">Mark Done?</Button>;
  //   }
  // }

  if (user?.publicMetadata?.role === 'supervisor'  && row.original.status !== 'done') {
    if (user.id === ticketAssignedToClerkId) {
      return (
        <Button
          onClick={async () => {
            try {
              await updateTicketStatus(row.original._id, 'done'); // Call your utility
              toast.success('Ticket marked as done!');
              router.refresh();
            } catch (err) {
              toast.error('Failed to mark as done');
            }
          }}
          className="italic"
        >
          Mark Done?
        </Button>
      );
    }
  }
  return (row.original.status!=='done' && <AssignDialogComponent data={row.original} supervisors={supervisors} />)
};
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
    id: 'search',
    accessorKey: 'description',
    header: ({ column }: { column: Column<Ticket, unknown> }) => (
      <DataTableColumnHeader column={column} title='Description' />),
    cell: ({ cell }) => (
      <div className="line-clamp-2 text-muted-foreground">
        {cell.getValue<string>()}
      </div>
    ),
    meta: {
      label: 'Notes',
      placeholder: 'Search name, email, description...',
      variant: 'text',
    },
    enableColumnFilter: true
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
      const displayStatus = status === 'done'
        ? 'Resolved'
        : status
          ? status.charAt(0).toUpperCase() + status.slice(1)
          : '';
      const Icon = iconMap[status as keyof typeof iconMap] || MinusCircle;


      return (
        <Badge variant='outline' className='flex items-center gap-1 capitalize'>
          <Icon className="h-4 w-4" />
          {displayStatus}
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
  {
    id: 'assign',
    cell: ({ row }) => (
      <CellAssignWrapper
        row={row}
        supervisors={supervisors}
        AssignDialogComponent={AssignTicketDialog}
      />
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
