'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Expense } from '@/constants/data';
import { CellActionWrapper } from '@/lib/wrapper';
import { CATEGORY_OPTIONS } from './options';


export const columns: ColumnDef<Expense>[] = [
  {
    id: 'category',
    accessorKey: 'category',
    header: ({ column }: { column: Column<Expense, unknown> }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Expense['category']>()}</div>,
    meta: {
      label: 'Category',
      variant: 'multiSelect',
      options: CATEGORY_OPTIONS
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    enableColumnFilter: true,
    cell: ({ cell }) => <div className="font-medium px-3">{cell.getValue<string>()}</div>
  },
  {
    accessorKey: 'notes',
    id: 'search',
    header: ({ column }: { column: Column<Expense, unknown> }) => (
      <DataTableColumnHeader column={column} title='Notes' />
    ),
    cell: ({ cell }) =>
      <div className="line-clamp-2 text-muted-foreground">
        {cell.getValue<string>()}
      </div>,
    meta: {
      label: 'Notes',
      placeholder: 'Search name, email, notes...',
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
    cell: ({ row }) =>
      <CellActionWrapper CellActionComponent={CellAction} row={row} />
  }
];
