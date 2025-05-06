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
import { Input } from '@/components/ui/input';
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

// Optional image constraints
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

export default function TicketForm({ pageTitle }: { pageTitle: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: '',
            subcategory: '',
            description: '',
            image: ''
        }
    });

    const onSubmit = async(values: z.infer<typeof formSchema>) => {

        try {
            setLoading(true);
            const res = await axios.post('/api/tickets', values);
            const response = res.data;
            if (res.status!=200) throw new Error('Failed to submit event');
            toast.success("Ticket Has Been Created")
            router.push("/dashboard/ticket")
            console.log(response)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        console.log('Form Values:', values);
    };

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

                        <Button type='submit' disabled={loading}> {loading ? 'Submitting...' : 'Create Ticket'}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
