'use client';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { User } from '@/constants/data';
import { CellActionWrapper } from '@/lib/wrapper';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';



export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const user = row.original;
      const primaryEmail = user.emailAddresses?.find(
        (email: any) => email.id === user.primaryEmailAddressId
      );

      return primaryEmail?.emailAddress ?? 'N/A';
    },
  },
  {
    id: 'firstName',
    accessorKey: 'firstName',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<User['firstName']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Search name...',
      variant: 'text',
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const user = row.original;
      return user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        : 'N/A';
    },
  },
  {
    id: 'role',
    header: 'Role',
    cell: ({ row }) => {
      return (
        row.original.publicMetadata?.role?.toUpperCase()
      )
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <CellActionWrapper row={row} CellActionComponent={CellAction} />
      )
    }
  }
];
