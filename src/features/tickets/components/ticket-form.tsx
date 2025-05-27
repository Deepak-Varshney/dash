// 'use client';

// import { FileUploader } from '@/components/file-uploader';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage
// } from '@/components/ui/form';
// import { Textarea } from '@/components/ui/textarea';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue
// } from '@/components/ui/select';
// import * as z from 'zod';
// import { ticketOptions } from '@/utils/ticketOptions';
// import { useState } from 'react';
// import { useForm, useWatch } from 'react-hook-form';
// import { useRouter } from 'next/navigation';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'sonner';
// import { saveTicket } from '@/app/actions/handleTickets';
// import { Ticket } from '@/constants/data';


// const MAX_FILE_SIZE = 5 * 1024 * 1024;
// const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// const formSchema = z.object({
//     image: z
//         .any()
//         .optional()
//         .refine(
//             (files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
//             'Max file size is 5MB.'
//         )
//         .refine(
//             (files) =>
//                 !files ||
//                 files.length === 0 ||
//                 ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
//             'Only .jpg, .jpeg, .png, .webp formats are supported.'
//         ),
//     category: z.string().min(1, 'Category is required'),
//     subcategory: z.string().min(1, 'Subcategory is required'),
//     deadline: z.date().optional(),
//     priority: z.string().optional(),
//     description: z.string().min(10, 'Description must be at least 10 characters'),
//     assignedTo: z.object({
//         firstName: z.string().min(1, 'First name is required').optional(),
//         lastName: z.string().min(1, 'Last name is required').optional(),
//         email: z.string().email('Invalid email address').optional(),
//         id: z.string().min(1, 'Supervisor ID is required').optional()
//     }).optional()
// });

// type FormValues = z.infer<typeof formSchema>;

// export default function TicketForm({
//     initialData,
//     supervisors,
//     pageTitle,
// }: {
//     initialData?: Ticket;
//     supervisors?: { id: string; firstName: string; lastName: string; email?: string; }[];
//     pageTitle: string;
// }) {
//     const [loading, setLoading] = useState(false);
//     const submitButtonText = initialData ? 'Update Ticket' : 'Create Ticket';
//     const router = useRouter();

//     const form = useForm<FormValues>({
//         resolver: zodResolver(formSchema),
//         defaultValues: initialData || {
//             category: '',
//             subcategory: '',
//             description: '',
//             image: '',
//             deadline: new Date(),
//             priority: '',
//             assignedTo: {
//                 firstName: '',
//                 lastName: '',
//                 email: '',
//                 id: ''
//             }
//         }
//     });

//     async function onSubmit(values: FormValues) {

//         try {
//             setLoading(true);
//             const payload = {
//                 ...values,
//                 _id: initialData?._id,
//             };
//             console.log(payload);
//             await saveTicket(payload);
//             toast.success('Ticket saved successfully');
//             router.push('/dashboard/ticket');
//         } catch (error) {
//             console.error(error);
//             toast.error('Something went wrong');
//         } finally {
//             setLoading(false);
//         }
//     }
//     console.log(supervisors);
//     const selectedCategory = useWatch({ control: form.control, name: 'category' });

//     const availableSubcategories = ticketOptions.find((cat) => cat.category === selectedCategory)?.subcategories || [];

//     return (
//         <Card className='mx-auto w-full'>
//             <CardHeader>
//                 <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
//                         {/* Optional Image */}
//                         <FormField
//                             control={form.control}
//                             name='image'
//                             render={({ field }) => (
//                                 <FormItem className='w-full'>
//                                     <FormLabel>Optional Screenshot</FormLabel>
//                                     <FormControl>
//                                         <FileUploader
//                                             value={field.value}
//                                             onValueChange={field.onChange}
//                                             maxFiles={1}
//                                             maxSize={MAX_FILE_SIZE}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name='category'
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Category</FormLabel>
//                                     <Select onValueChange={field.onChange} value={field.value}>
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder='Select a category' />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {ticketOptions.map((option) => (
//                                                 <SelectItem key={option.category} value={option.category}>
//                                                     {option.category}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name='subcategory'
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Subcategory</FormLabel>
//                                     <Select onValueChange={field.onChange} value={field.value}>
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder='Select a subcategory' />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {availableSubcategories.map((sub) => (
//                                                 <SelectItem key={sub.id} value={sub.name}>
//                                                     {sub.name}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />


//                         {/* Description */}
//                         <FormField
//                             control={form.control}
//                             name='description'
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Description</FormLabel>
//                                     <FormControl>
//                                         <Textarea
//                                             placeholder='Describe the issue in detail'
//                                             className='resize-none'
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name='assignedTo'
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Assign To</FormLabel>
//                                     <Select
//                                         onValueChange={(id) => {
//                                             const supervisor = supervisors?.find((s) => s.id === id);
//                                             field.onChange(supervisor ? supervisor : undefined);
//                                         }}
//                                         value={field.value?.id || ''}
//                                     >
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder='Select a Supervisor' />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {supervisors?.map((option) => (
//                                                 <SelectItem key={option.id} value={option.id}>
//                                                     {option.firstName} {option.lastName}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <Button type='submit' disabled={loading}>
//                             {loading ? 'Submitting...' : submitButtonText}
//                         </Button>
//                     </form>
//                 </Form>
//             </CardContent>
//         </Card>
//     );
// }


'use client';
import { format } from 'date-fns';
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
import { toast } from 'sonner';
import { saveTicket } from '@/app/actions/handleTickets';
import { Ticket } from '@/constants/data';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

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
    deadline: z.date().optional(),
    priority: z.string().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    assignedTo: z
        .object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            email: z.string().email().optional(),
            clerkId: z.string().optional()
        })
        .optional(),
    status: z.enum(['open', 'assigned', 'extended', 'done']).optional(),


});

type FormValues = z.infer<typeof formSchema>;

export default function TicketForm({
    initialData,
    supervisors,
    pageTitle
}: {
    initialData?: Ticket;
    supervisors?: { clerkId: string; firstName: string; lastName: string; email?: string }[];
    pageTitle: string;
}) {
    const [loading, setLoading] = useState(false);
    const submitButtonText = initialData ? 'Update Ticket' : 'Create Ticket';
    const router = useRouter();

    const defaultAssignedTo =
        initialData?.assignedTo && supervisors
            ? supervisors.find((s) => s.clerkId === initialData.assignedTo?.clerkId) || initialData.assignedTo
            : undefined;
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: initialData?.category || '',
            subcategory: initialData?.subcategory || '',
            description: initialData?.description || '',
            image: initialData?.image || '',
            deadline: initialData?.deadline ? new Date(initialData.deadline) : undefined,
            priority: initialData?.priority || '',
            assignedTo: defaultAssignedTo,
            status: initialData?.status || 'open', // Default to 'open' if not editing
        }
    });

    async function onSubmit(values: FormValues) {
        try {
            setLoading(true);
            const payload = {
                ...values,
                _id: initialData?._id
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
    const availableSubcategories =
        ticketOptions.find((cat) => cat.category === selectedCategory)?.subcategories || [];

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

                        <FormField
                            control={form.control}
                            name='assignedTo'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assign To</FormLabel>
                                    <Select
                                        onValueChange={(clerkId) => {
                                            const supervisor = supervisors?.find((s) => s.clerkId === clerkId);
                                            field.onChange(supervisor || undefined);
                                        }}
                                        value={field.value?.clerkId || ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select a Supervisor' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {supervisors?.map((option) => (
                                                <SelectItem key={option.clerkId} value={option.clerkId}>
                                                    {option.firstName} {option.lastName}
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
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Priority</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {['Low', 'Medium', 'High'].map((level) => (
                                                <SelectItem key={level} value={level}>
                                                    {level}
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
                            name="deadline"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Deadline</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                >
                                                    {field.value ? format(field.value, 'PPP') : <span>Select a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='status'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select a status' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value='open'>Open</SelectItem>
                                            <SelectItem value='assigned'>Assigned</SelectItem>
                                            <SelectItem value='done'>Done</SelectItem>
                                            <SelectItem value='extended'>Extended</SelectItem>
                                        </SelectContent>
                                    </Select>
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
