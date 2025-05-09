'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Event } from '@/constants/data';
import { useUser } from '@clerk/nextjs';

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ cell }) => <div className="font-medium">{cell.getValue<string>()}</div>
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ cell }) => (
      <div className="line-clamp-2 text-muted-foreground">
        {cell.getValue<string>()}
      </div>
    )
  },
  {
    accessorKey: 'createdBy',
    header: 'Created By',
    cell: ({ row }) => {
      const { firstName, lastName, email } = row.original.createdBy || {};
      return (
        <div className="flex flex-col">
          <span>{firstName} {lastName}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'readBy',
    header: 'Readers',
    cell: ({ cell }) => {
      const readers = cell.getValue<string[]>();
      return (
        <Badge variant="outline">
          {readers?.length ?? 0} {readers?.length === 1 ? 'person' : 'people'} read
        </Badge>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { user } = useUser();
      {user?.publicMetadata?.role === 'admin' && <CellAction data={row.original} />}
      // <CellAction data={row.original} />}
    }
  }
];
