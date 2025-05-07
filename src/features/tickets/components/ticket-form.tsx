'use client';

import { FileUploader } from '@/components/file-uploader';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import * as z from 'zod';
import { ticketOptions } from '@/utils/ticketOptions';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'sonner';
import { saveTicket } from '@/app/actions/handleTickets';
import { Ticket } from '@/constants/data';


const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const formSchema = z.object({
    image: z
        .any()
        .optional()
        .refine(
            (files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
            'Max file size is 5MB.'
        )
        .refine(
            (files) =>
                !files ||
                files.length === 0 ||
                ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            'Only .jpg, .jpeg, .png, .webp formats are supported.'
        ),
    category: z.string().min(1, 'Category is required'),
    subcategory: z.string().min(1, 'Subcategory is required'),
    description: z.string().min(10, 'Description must be at least 10 characters')
});

type FormValues = z.infer<typeof formSchema>;

export default function TicketForm({
    initialData,
    pageTitle,
}: {
    initialData?: Ticket;
    pageTitle: string;
}) {
    const [loading, setLoading] = useState(false);
    const submitButtonText = initialData ? 'Update Event' : 'Create Event';

    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            category: '',
            subcategory: '',
            description: '',
            image: ''
        }
    });

    async function onSubmit(values: FormValues) {

        try {
            setLoading(true);
            const payload = {
                ...values,
                _id: initialData?._id,
            };
            await saveTicket(payload);
            toast.success('Ticket saved successfully');
            router.push('/dashboard/ticket');
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    const selectedCategory = useWatch({ control: form.control, name: 'category' });

    const availableSubcategories = ticketOptions.find((cat) => cat.category === selectedCategory)?.subcategories || [];

    return (
        <Card className='mx-auto w-full'>
            <CardHeader>
                <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        {/* Optional Image */}
                        <FormField
                            control={form.control}
                            name='image'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Optional Screenshot</FormLabel>
                                    <FormControl>
                                        <FileUploader
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            maxFiles={1}
                                            maxSize={MAX_FILE_SIZE}
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
                            name='subcategory'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subcategory</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select a subcategory' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableSubcategories.map((sub) => (
                                                <SelectItem key={sub.id} value={sub.name}>
                                                    {sub.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Description */}
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Describe the issue in detail'
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
