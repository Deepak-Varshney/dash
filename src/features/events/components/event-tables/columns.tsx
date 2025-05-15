'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ColumnDef, Column } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Event } from '@/constants/data';
import { CellActionWrapper } from '@/lib/wrapper';



export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ cell }) => <div className="font-medium">{cell.getValue<string>()}</div>
  },
  {
    id: 'search',
    accessorKey: 'description',
    header: ({ column }: { column: Column<Event, unknown> }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ cell }) =>
      <div className="line-clamp-2 text-muted-foreground">
        {cell.getValue<string>()}
      </div>,
    meta: {
      label: 'Description',
      placeholder: 'Search name, email, description...',
      variant: 'text',
    },
    enableColumnFilter: true
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
      return (
        <CellActionWrapper row={row} CellActionComponent={CellAction} />
      )
    }
  }
];
