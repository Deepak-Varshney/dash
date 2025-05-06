'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Expense } from '@/constants/data';

export const columns: ColumnDef<Expense>[] = [
  // {
  //   id: 'name',
  //   accessorKey: 'name',
  //   header: ({ column }: { column: Column<Expense, unknown> }) => (
  //     <DataTableColumnHeader column={column} title='Amount' />
  //   ),
  //   cell: ({ cell }) => <div>{cell.getValue<Expense['amount']>()}</div>,
  //   meta: {
  //     label: 'Amount',
  //     placeholder: 'Search products...',
  //     variant: 'text',
  //   },
  //   enableColumnFilter: true
  // },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ cell }) => <div className="font-medium px-3">{cell.getValue<string>()}</div>
  },
  {
    accessorKey: 'notes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Notes' />
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
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ cell }) => {
      const date = cell.getValue<Date>();
      return <span>{date ? new Date(date).toLocaleDateString() : '-'}</span>;
    }
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ cell }) => {
      const date = cell.getValue<Date>();
      return <span>{date ? new Date(date).toLocaleDateString() : '-'}</span>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
