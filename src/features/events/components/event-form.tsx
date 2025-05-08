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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { saveEvent } from '@/app/actions/handleEvents';
import { Event } from '@/constants/data';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title is required' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  date: z.coerce.date({ required_error: 'Date is required' }),

});
type FormValues = z.infer<typeof formSchema>;

export default function EventForm({
  initialData,
  pageTitle
}: {
  initialData?: Event;
  pageTitle: string;
}) {
  const [loading, setLoading] = useState(false);
  const submitButtonText = initialData ? 'Update Event' : 'Create Event';

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      date: new Date()
    }
  });

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);
      const payload = {
        ...values,
        _id: initialData?._id,
        date: values.date ? new Date(values.date) : new Date(),
      };
      await saveEvent(payload);
      toast.success('Event saved successfully');
      router.push('/dashboard/event');
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
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter event title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter event description'
                      className='resize-none'
                      {...field}
                    />
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


            <Button type='submit' disabled={loading}>
              {loading ? 'Submitting...' : submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
