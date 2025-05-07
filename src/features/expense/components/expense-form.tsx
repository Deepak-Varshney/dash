'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveExpense } from '@/app/actions/handleExpense'; // Adjust path as needed

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ticketOptions } from '@/utils/ticketOptions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Expense } from '@/constants/data';

const expenseSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number' }),
  category: z.string().min(1, { message: 'Category is required' }),
  notes: z.string().optional(),
  date: z.coerce.date({ required_error: 'Date is required' }),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function ExpenseForm({
  initialData,
  pageTitle,
}: {
  initialData?: Expense;
  pageTitle: string;
}) {
  const [loading, setLoading] = useState(false);
  const submitButtonText = initialData ? 'Update Event' : 'Create Event';
  const router = useRouter();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData || {
      amount: 0,
      category: '',
      notes: '',
      date: new Date(),
    },
  });




  async function onSubmit(values: ExpenseFormValues) {
    try {
      setLoading(true);
      const payload = {
        ...values,
        _id: initialData?._id,
      };
      await saveExpense(payload);
      toast.success('Expense saved successfully');
      router.push('/dashboard/expense');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>

            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='Enter amount' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      value={field.value?.toISOString().split('T')[0]}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ticketOptions.map((option) => (
                        <SelectItem key={option.category} value={option.category}>
                          {option.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Optional notes'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={loading}>
              {loading ? 'Submitting...' : submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
