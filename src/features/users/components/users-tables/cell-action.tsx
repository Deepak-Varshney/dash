'use client';
import { setRole } from '@/app/actions/handleRoles';
import { deleteUser } from '@/app/actions/handleUser';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User } from '@/constants/data';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { User2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { toast } from 'sonner';


interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [role, setRoleState] = useState(''); // Ass

  const onConfirm = async () => {
    startTransition(async () => {
      if (data.id) {
        try {
          await deleteUser(data.id);
          toast.success('User deleted successfully');
          setOpen(false);
          router.refresh()
        } catch (error) {
          toast.error('Failed to delete user');
        }
      }

    });
  };
  const onRoleConfirm = async () => {
    if (!data.id || !role) {
      toast.error("Please select a role first.");
      return;
    }

    setLoading(true);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('id', data.id || ''); // User ID
        formData.append('role', role); // Selected role

        await setRole(formData); // Call the server-side action to set the role

        toast.success(`Role assigned to ${role} successfully!`);
        setOpen(false);
        router.refresh(); // Refresh the page if necessary
      } catch (error) {
        toast.error("Failed to assign role.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    });
  };


  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onRoleConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/users/${data.id}`)}
          >
            <IconEdit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
          {data.publicMetadata?.role !== 'user' && <DropdownMenuItem onClick={() => {
            setOpen(true)
            setRoleState('user')
          }}>
            <User2 className='mr-2 h-4 w-4' /> Make User
          </DropdownMenuItem>}
          {data.publicMetadata?.role !=='admin' && <DropdownMenuItem onClick={() => {
            setOpen(true)
            setRoleState('admin')
          }}>
            <User2 className='mr-2 h-4 w-4' /> Make Admin
          </DropdownMenuItem>}
         {data.publicMetadata?.role !=='supervisor' && <DropdownMenuItem onClick={() => {
            setOpen(true)
            setRoleState('supervisor')
          }}>
            <User2 className='mr-2 h-4 w-4' /> Make Supervisor
          </DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
