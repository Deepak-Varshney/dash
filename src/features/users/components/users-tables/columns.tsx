'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { User } from '@/constants/data';
import { CellActionWrapper } from '@/lib/wrapper';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';



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
    accessorKey: 'firstName',
    header: 'First Name',
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
    accessorKey: 'photo_url',
    header: 'IMAGE',
    cell: ({ row }) => {
      return (
        row.original?.hasImage &&
        <Avatar className="h-9 w-9">
          <AvatarImage src={row.original?.imageUrl} alt="Avatar" />
          <AvatarFallback>
            {((row.original?.firstName?.[0] ?? '') + (row.original?.lastName?.[0] ?? '')).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    }
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
