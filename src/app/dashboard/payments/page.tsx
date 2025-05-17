// // // // // import PageContainer from '@/components/layout/page-container';
// // // // // import { buttonVariants } from '@/components/ui/button';
// // // // // import { Heading } from '@/components/ui/heading';
// // // // // import { Separator } from '@/components/ui/separator';
// // // // // import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
// // // // // import ExpenseListingPage from '@/features/expense/components/expense-listing';
// // // // // import { searchParamsCache } from '@/lib/searchparams';
// // // // // import { cn } from '@/lib/utils';
// // // // // import { currentUser } from '@clerk/nextjs/server';
// // // // // import { IconPlus } from '@tabler/icons-react';
// // // // // import Link from 'next/link';
// // // // // import { SearchParams } from 'nuqs/server';
// // // // // import { Suspense } from 'react';

// // // // // export const metadata = {
// // // // //   title: 'Dashboard: Payments'
// // // // // };

// // // // // type pageProps = {
// // // // //   searchParams: Promise<SearchParams>;
// // // // // };

// // // // // export default async function Page(props: pageProps) {
// // // // //   const searchParams = await props.searchParams;
// // // // //   // Allow nested RSCs to access the search params (in a type-safe way)
// // // // //   searchParamsCache.parse(searchParams);
// // // // //   const user = await currentUser();
// // // // //   // This key is used for invoke suspense if any of the search params changed (used for filters).
// // // // //   // const key = serialize({ ...searchParams });

// // // // //   return (
// // // // //     <PageContainer scrollable={false}>
// // // // //       <div className='flex flex-1 flex-col space-y-4'>
// // // // //         <div className='flex items-start justify-between'>
// // // // //           <Heading
// // // // //             title='Payments'
// // // // //             description='Manage payments'
// // // // //           />
// // // // //           {user?.publicMetadata?.role === 'admin' && (<Link
// // // // //             href='/dashboard/payments/new'
// // // // //             className={cn(buttonVariants(), 'text-xs md:text-sm')}
// // // // //           >
// // // // //             <IconPlus className='mr-2 h-4 w-4' /> Add New
// // // // //           </Link>)}
// // // // //         </div>
// // // // //         <Separator />
// // // // //         <Suspense
// // // // //           // key={key}
// // // // //           fallback={
// // // // //             <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
// // // // //           }
// // // // //         >
// // // // //           <ExpenseListingPage />
// // // // //         </Suspense>
// // // // //       </div>
// // // // //     </PageContainer>
// // // // //   );
// // // // // }

// // // // "use client";
// // // // import React, { useEffect, useState } from "react";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Checkbox } from "@/components/ui/checkbox";
// // // // import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
// // // // import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// // // // import { useUser } from "@clerk/nextjs";
// // // // import { PaymentForm } from "@/components/payment-form";

// // // // function getCurrentMonth() {
// // // //   const now = new Date();
// // // //   return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
// // // // }

// // // // function getPrevMonths(count: number) {
// // // //   const months = [];
// // // //   let d = new Date();
// // // //   for (let i = 0; i < count; i++) {
// // // //     months.unshift(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
// // // //     d.setMonth(d.getMonth() - 1);
// // // //   }
// // // //   return months;
// // // // }

// // // // const MONTHLY_AMOUNT = 100; // Change as needed

// // // // export default function PaymentsPage() {
// // // //   const [payments, setPayments] = useState<any[]>([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
// // // //   const [showDiscount, setShowDiscount] = useState(false);
// // // //   const { user } = useUser();

// // // //   useEffect(() => {
// // // //     fetch("/api/payments")
// // // //       .then(r => r.json())
// // // //       .then(setPayments)
// // // //       .finally(() => setLoading(false));
// // // //   }, []);

// // // //   // Get all months (current and next 5 months)
// // // //   const monthsToShow = [
// // // //     ...getPrevMonths(6), // last 6 months (including current)
// // // //     // Add future months if you want to allow advance payment
// // // //   ];

// // // //   const unpaid = monthsToShow
// // // //     .map(month => ({
// // // //       month,
// // // //       payment: payments.find(p => p.month === month),
// // // //     }))
// // // //     .filter(({ payment }) => !payment || payment.status !== "paid");

// // // //   const totalDue = unpaid.reduce((sum, { payment }) =>
// // // //     sum + (payment?.amount || MONTHLY_AMOUNT), 0
// // // //   );

// // // //   useEffect(() => {
// // // //     setShowDiscount(selectedMonths.length >= 6);
// // // //   }, [selectedMonths]);

// // // //   const handleSelectMonth = (month: string, checked: boolean) => {
// // // //     setSelectedMonths(checked
// // // //       ? [...selectedMonths, month]
// // // //       : selectedMonths.filter(m => m !== month)
// // // //     );
// // // //   };

// // // //   const handlePay = async () => {
// // // //     // Here, you'd call your payment gateway. For demo, just POST to API and mark as paid.
// // // //     await fetch("/api/payments", {
// // // //       method: "POST",
// // // //       headers: { "Content-Type": "application/json" },
// // // //       body: JSON.stringify({
// // // //         months: selectedMonths,
// // // //         amount: MONTHLY_AMOUNT,
// // // //       }),
// // // //     });
// // // //     setSelectedMonths([]);
// // // //     setShowDiscount(false);
// // // //     // Refetch payments
// // // //     const updated = await fetch("/api/payments").then(r => r.json());
// // // //     setPayments(updated);
// // // //     alert("Payment record(s) created! Integrate your payment gateway to mark as paid.");
// // // //   };

// // // //   return (
// // // //     <div className="p-6 max-w-3xl mx-auto">
// // // //       <h2 className="text-2xl font-bold mb-2">Maintenance Payments</h2>
// // // //       {loading ? (
// // // //         <p>Loading...</p>
// // // //       ) : (
// // // //         <>
// // // //           <div className="mb-4">
// // // //             <h3 className="font-semibold">Upcoming & Overdue</h3>
// // // //             <ul>
// // // //               {unpaid.map(({ month, payment }) => (
// // // //                 <li key={month} className="flex items-center gap-2">
// // // //                   <Checkbox
// // // //                     checked={selectedMonths.includes(month)}
// // // //                     onCheckedChange={checked => handleSelectMonth(month, !!checked)}
// // // //                   />
// // // //                   <span>{month}</span>
// // // //                   <span className={`ml-2 text-sm ${payment?.status === "overdue" ? "text-red-600" : ""}`}>
// // // //                     {payment?.status === "overdue" ? "Overdue" : "Pending"}
// // // //                   </span>
// // // //                   <span className="ml-auto">₹{payment?.amount || MONTHLY_AMOUNT}</span>
// // // //                 </li>
// // // //               ))}
// // // //             </ul>
// // // //             <div className="mt-2">
// // // //               <strong>Total Due:</strong> ₹{selectedMonths.length > 0
// // // //                 ? selectedMonths.length * MONTHLY_AMOUNT * (showDiscount ? 0.95 : 1)
// // // //                 : totalDue}
// // // //               {showDiscount && (
// // // //                 <Alert className="mt-2" variant="default">
// // // //                   <AlertTitle>Discount!</AlertTitle>
// // // //                   <AlertDescription>
// // // //                     Pay for 6+ months at once and get <strong>5% off</strong>!
// // // //                   </AlertDescription>
// // // //                 </Alert>
// // // //               )}
// // // //             </div>
// // // //             <Button
// // // //               className="mt-3"
// // // //               disabled={selectedMonths.length === 0}
// // // //               onClick={handlePay}
// // // //             >
// // // //               Pay Selected
// // // //             </Button>
// // // //           </div>
// // // //           <div>
// // // //             <h3 className="font-semibold mb-2">Past Payments</h3>
// // // //             <Table>
// // // //               <TableHead>
// // // //                 <TableRow>
// // // //                   <TableCell>Month</TableCell>
// // // //                   <TableCell>Status</TableCell>
// // // //                   <TableCell>Paid At</TableCell>
// // // //                   <TableCell>Amount</TableCell>
// // // //                 </TableRow>
// // // //               </TableHead>
// // // //               <TableBody>
// // // //                 {payments.filter(p => p.status === "paid").map(p => (
// // // //                   <TableRow key={p._id}>
// // // //                     <TableCell>{p.month}</TableCell>
// // // //                     <TableCell>{p.status}</TableCell>
// // // //                     <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</TableCell>
// // // //                     <TableCell>₹{p.amount}</TableCell>
// // // //                   </TableRow>
// // // //                 ))}
// // // //               </TableBody>
// // // //             </Table>
// // // //             <PaymentForm amount={MONTHLY_AMOUNT} />
// // // //           </div>
// // // //         </>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }


// // // "use client";
// // // import React, { useEffect, useState } from "react";
// // // import { Button } from "@/components/ui/button";
// // // import { Checkbox } from "@/components/ui/checkbox";
// // // import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
// // // import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// // // import { useUser } from "@clerk/nextjs";

// // // function getCurrentMonth() {
// // //   const now = new Date();
// // //   return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
// // // }

// // // function getPrevMonths(count: number) {
// // //   const months = [];
// // //   let d = new Date();
// // //   for (let i = 0; i < count; i++) {
// // //     months.unshift(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
// // //     d.setMonth(d.getMonth() - 1);
// // //   }
// // //   return months;
// // // }

// // // const MONTHLY_AMOUNT = 100; // Change as needed

// // // export default function PaymentsPage() {
// // //   const [payments, setPayments] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
// // //   const [showDiscount, setShowDiscount] = useState(false);

// // //   useEffect(() => {
// // //     fetch("/api/payments")
// // //       .then(r => r.json())
// // //       .then(setPayments)
// // //       .finally(() => setLoading(false));
// // //   }, []);

// // //   // Get all months (current and previous 5 months)
// // //   const monthsToShow = [
// // //     ...getPrevMonths(6), // last 6 months (including current)
// // //   ];

// // //   const unpaid = monthsToShow
// // //     .map(month => ({
// // //       month,
// // //       payment: payments.find(p => p.month === month),
// // //     }))
// // //     .filter(({ payment }) => !payment || payment.status !== "paid");

// // //   const totalDue = unpaid.reduce((sum, { payment }) =>
// // //     sum + (payment?.amount || MONTHLY_AMOUNT), 0
// // //   );

// // //   useEffect(() => {
// // //     setShowDiscount(selectedMonths.length >= 6);
// // //   }, [selectedMonths]);

// // //   const handleSelectMonth = (month: string, checked: boolean) => {
// // //     setSelectedMonths(checked
// // //       ? [...selectedMonths, month]
// // //       : selectedMonths.filter(m => m !== month)
// // //     );
// // //   };

// // //   const handleCreateOrUpdate = async () => {
// // //     // "Create" pending payments for selected months
// // //     await fetch("/api/payments", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({
// // //         months: selectedMonths,
// // //         amount: MONTHLY_AMOUNT,
// // //       }),
// // //     });
// // //     // Refetch payments
// // //     const updated = await fetch("/api/payments").then(r => r.json());
// // //     setPayments(updated);
// // //     alert("Pending payment(s) created or updated!");
// // //   };

// // //   const handleMarkPaid = async () => {
// // //     await fetch("/api/payments", {
// // //       method: "PATCH",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({ months: selectedMonths }),
// // //     });
// // //     setSelectedMonths([]);
// // //     setShowDiscount(false);
// // //     // Refetch payments
// // //     const updated = await fetch("/api/payments").then(r => r.json());
// // //     setPayments(updated);
// // //     alert("Payment(s) marked as paid!");
// // //   };

// // //   return (
// // //     <div className="p-6 mx-auto">
// // //       <h2 className="text-2xl font-bold mb-2">Maintenance Payments</h2>
// // //       {loading ? (
// // //         <p>Loading...</p>
// // //       ) : (
// // //         <>
// // //           <div className="mb-4">
// // //             <h3 className="font-semibold">Upcoming & Overdue</h3>
// // //             <ul>
// // //               {unpaid.map(({ month, payment }) => (
// // //                 <li key={month} className="flex items-center gap-2">
// // //                   <Checkbox
// // //                     checked={selectedMonths.includes(month)}
// // //                     onCheckedChange={checked => handleSelectMonth(month, !!checked)}
// // //                   />
// // //                   <span>{month}</span>
// // //                   <span className={`ml-2 text-sm ${payment?.status === "overdue" ? "text-red-600" : ""}`}>
// // //                     {payment?.status === "overdue" ? "Overdue" : "Pending"}
// // //                   </span>
// // //                   <span className="ml-auto">₹{payment?.amount || MONTHLY_AMOUNT}</span>
// // //                 </li>
// // //               ))}
// // //             </ul>
// // //             <div className="mt-2">
// // //               <strong>Total Due:</strong> ₹{selectedMonths.length > 0
// // //                 ? Math.round(selectedMonths.length * MONTHLY_AMOUNT * (showDiscount ? 0.95 : 1))
// // //                 : totalDue}
// // //               {showDiscount && (
// // //                 <Alert className="mt-2">
// // //                   <AlertTitle>Discount!</AlertTitle>
// // //                   <AlertDescription>
// // //                     Pay for 6+ months at once and get <strong>5% off</strong>!
// // //                   </AlertDescription>
// // //                 </Alert>
// // //               )}
// // //             </div>
// // //             <div className="flex gap-2 mt-3">
// // //               <Button
// // //                 disabled={selectedMonths.length === 0}
// // //                 onClick={handleCreateOrUpdate}
// // //                 variant="secondary"
// // //               >
// // //                 Create/Update Pending
// // //               </Button>
// // //               <Button
// // //                 disabled={selectedMonths.length === 0}
// // //                 onClick={handleMarkPaid}
// // //               >
// // //                 Mark as Paid
// // //               </Button>
// // //             </div>
// // //           </div>
// // //           <div>
// // //             <h3 className="font-semibold mb-2">Past Payments</h3>
// // //             <Table>
// // //               <TableHead>
// // //                 <TableRow>
// // //                   <TableCell>Month</TableCell>
// // //                   <TableCell>Status</TableCell>
// // //                   <TableCell>Paid At</TableCell>
// // //                   <TableCell>Amount</TableCell>
// // //                 </TableRow>
// // //               </TableHead>
// // //               <TableBody>
// // //                 {payments.filter(p => p.status === "paid").map(p => (
// // //                   <TableRow key={p._id}>
// // //                     <TableCell>{p.month}</TableCell>
// // //                     <TableCell>{p.status}</TableCell>
// // //                     <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</TableCell>
// // //                     <TableCell>₹{p.amount}</TableCell>
// // //                   </TableRow>
// // //                 ))}
// // //               </TableBody>
// // //             </Table>
// // //           </div>
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // // "use client";
// // // import React, { useEffect, useState } from "react";
// // // import { Button } from "@/components/ui/button";
// // // import { Checkbox } from "@/components/ui/checkbox";
// // // import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
// // // import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// // // import { IPayment } from "@/models/payment";

// // // const MONTHLY_AMOUNT = 100; // Adjust as needed

// // // // Helper functions to get the current and previous months
// // // function getCurrentMonth() {
// // //   const now = new Date();
// // //   return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
// // // }

// // // function getFutureMonths(count: number) {
// // //   const months = [];
// // //   let d = new Date();
// // //   // Start from next month
// // //   d.setMonth(d.getMonth() + 1);
// // //   for (let i = 0; i < count; i++) {
// // //     months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
// // //     d.setMonth(d.getMonth() + 1);
// // //   }
// // //   return months;
// // // }

// // // export default function PaymentsPage() {
// // //   const [payments, setPayments] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
// // //   const [overduePayments, setOverduePayments] = useState<any[]>([]);
// // //   const [showDiscount, setShowDiscount] = useState(false);

// // //   useEffect(() => {
// // //     // Fetch payments on component mount
// // //     fetch("/api/payments")
// // //       .then((r) => r.json())
// // //       .then((data) => {
// // //         setPayments(data);

// // //         // Determine overdue payments
// // //         const overdue = data.filter((p:IPayment) => {
// // //           const dueDate = new Date(p.dueDate);
// // //           return p.status !== "paid" && dueDate < new Date();
// // //         });
// // //         setOverduePayments(overdue);
// // //       })
// // //       .finally(() => setLoading(false));
// // //   }, []);

// // //   // Get future months for advance payment (next 6 months)
// // //   const upcomingMonths = getFutureMonths(12); // Show months from next month onward (can adjust the number)
// // //   const currentMonth = getCurrentMonth();

// // //   // Calculate total amount for overdue payments
// // //   const totalDue = overduePayments.reduce(
// // //     (sum, { amount }) => sum + (amount || MONTHLY_AMOUNT),
// // //     0
// // //   );

// // //   useEffect(() => {
// // //     setShowDiscount(selectedMonths.length >= 6);
// // //   }, [selectedMonths]);

// // //   const handleSelectMonth = (month: string, checked: boolean) => {
// // //     setSelectedMonths(
// // //       checked ? [...selectedMonths, month] : selectedMonths.filter((m) => m !== month)
// // //     );
// // //   };

// // //   const handleAdvancePayment = () => {
// // //     const selectedMonthsCount = selectedMonths.length;
// // //     let discount = 0;
// // //     if (selectedMonthsCount >= 12) {
// // //       discount = 0.1; // 10% discount for 12 months
// // //     } else if (selectedMonthsCount >= 6) {
// // //       discount = 0.05; // 5% discount for 6 months
// // //     }

// // //     const totalAmount = selectedMonthsCount * MONTHLY_AMOUNT;
// // //     const discountedTotal = totalAmount * (1 - discount);

// // //     alert(`Advance payment for ${selectedMonthsCount} months: ₹${discountedTotal.toFixed(2)} (Discount: ${discount * 100}%)`);
// // //   };

// // //   const handlePayOverdue = () => {
// // //     alert("Overdue payment processed successfully.");
// // //   };

// // //   return (
// // //     <div className="p-6 mx-auto">
// // //       <h2 className="text-2xl font-bold mb-2">Maintenance Payments</h2>
// // //       {loading ? (
// // //         <p>Loading...</p>
// // //       ) : (
// // //         <>
// // //           {/* Overdue Payments Card */}
// // //           {overduePayments.length > 0 && (
// // //             <div className="mb-4 p-4 border rounded-lg bg-red-100">
// // //               <h3 className="font-semibold text-lg">Overdue Payments</h3>
// // //               <ul>
// // //                 {overduePayments.map((payment) => (
// // //                   <li key={payment.month} className="flex items-center gap-2">
// // //                     <Checkbox
// // //                       checked={selectedMonths.includes(payment.month)}
// // //                       onCheckedChange={(checked) => handleSelectMonth(payment.month, !!checked)}
// // //                     />
// // //                     <span>{payment.month}</span>
// // //                     <span className="ml-auto">₹{payment.amount || MONTHLY_AMOUNT}</span>
// // //                   </li>
// // //                 ))}
// // //               </ul>
// // //               <div className="mt-2">
// // //                 <strong>Total Due:</strong> ₹{totalDue}
// // //               </div>
// // //               <div className="mt-3">
// // //                 <Button
// // //                   disabled={selectedMonths.length === 0}
// // //                   onClick={handlePayOverdue}
// // //                 >
// // //                   Pay Overdue
// // //                 </Button>
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Upcoming Payments Card */}
// // //           <div className="mb-4 p-4 border rounded-lg bg-green-100">
// // //             <h3 className="font-semibold text-lg">Advance Payment (Upcoming Months)</h3>
// // //             <ul>
// // //               {upcomingMonths.map((month) => (
// // //                 <li key={month} className="flex items-center gap-2">
// // //                   <Checkbox
// // //                     checked={selectedMonths.includes(month)}
// // //                     onCheckedChange={(checked) => handleSelectMonth(month, !!checked)}
// // //                   />
// // //                   <span>{month}</span>
// // //                   <span className="ml-auto">₹{MONTHLY_AMOUNT}</span>
// // //                 </li>
// // //               ))}
// // //             </ul>
// // //             <div className="mt-2">
// // //               <strong>Total for selected months:</strong> ₹{selectedMonths.length * MONTHLY_AMOUNT}
// // //               {showDiscount && (
// // //                 <Alert className="mt-2">
// // //                   <AlertTitle>Discount!</AlertTitle>
// // //                   <AlertDescription>
// // //                     Pay for 6+ months at once and get{" "}
// // //                     <strong>{selectedMonths.length >= 12 ? "10%" : "5%"}</strong> off!
// // //                   </AlertDescription>
// // //                 </Alert>
// // //               )}
// // //             </div>
// // //             <div className="mt-3">
// // //               <Button
// // //                 disabled={selectedMonths.length === 0}
// // //                 onClick={handleAdvancePayment}
// // //               >
// // //                 Advance Payment (with Discount)
// // //               </Button>
// // //             </div>
// // //           </div>

// // //           {/* Past Payments Table */}
// // //           <div>
// // //             <h3 className="font-semibold mb-2">Past Payments</h3>
// // //             <Table>
// // //               <TableHead>
// // //                 <TableRow>
// // //                   <TableCell>Month</TableCell>
// // //                   <TableCell>Status</TableCell>
// // //                   <TableCell>Paid At</TableCell>
// // //                   <TableCell>Amount</TableCell>
// // //                 </TableRow>
// // //               </TableHead>
// // //               <TableBody>
// // //                 {payments.filter((p) => p.status === "paid").map((p) => (
// // //                   <TableRow key={p._id}>
// // //                     <TableCell>{p.month}</TableCell>
// // //                     <TableCell>{p.status}</TableCell>
// // //                     <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</TableCell>
// // //                     <TableCell>₹{p.amount}</TableCell>
// // //                   </TableRow>
// // //                 ))}
// // //               </TableBody>
// // //             </Table>
// // //           </div>
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // // "use client";
// // // import React, { useEffect, useState } from "react";
// // // import { Button } from "@/components/ui/button";
// // // import { Checkbox } from "@/components/ui/checkbox";
// // // import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
// // // import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// // // import { IPayment } from "@/models/payment";

// // // const MONTHLY_AMOUNT = 100;

// // // function getCurrentMonth() {
// // //   const now = new Date();
// // //   return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
// // // }

// // // function getFutureMonths(count: number) {
// // //   const months = [];
// // //   let d = new Date();
// // //   d.setMonth(d.getMonth() + 1);
// // //   for (let i = 0; i < count; i++) {
// // //     months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
// // //     d.setMonth(d.getMonth() + 1);
// // //   }
// // //   return months;
// // // }

// // // export default function page() {
// // //   const [payments, setPayments] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
// // //   const [overduePayments, setOverduePayments] = useState<any[]>([]);
// // //   const [showDiscount, setShowDiscount] = useState(false);

// // //   useEffect(() => {
// // //     fetch("/api/payments")
// // //       .then((r) => r.json())
// // //       .then((data) => {
// // //         setPayments(data);

// // //         const overdue = data.filter((p: IPayment) => {
// // //           const dueDate = new Date(p.dueDate);
// // //           return p.status !== "paid" && dueDate < new Date();
// // //         });
// // //         setOverduePayments(overdue);
// // //       })
// // //       .finally(() => setLoading(false));
// // //   }, []);

// // //   const upcomingMonths = getFutureMonths(12);
// // //   const currentMonth = getCurrentMonth();

// // //   const totalDue = overduePayments.reduce(
// // //     (sum, { amount }) => sum + (amount || MONTHLY_AMOUNT),
// // //     0
// // //   );

// // //   useEffect(() => {
// // //     setShowDiscount(selectedMonths.length >= 6);
// // //   }, [selectedMonths]);

// // //   const handleSelectMonth = (month: string, checked: boolean) => {
// // //     setSelectedMonths(
// // //       checked ? [...selectedMonths, month] : selectedMonths.filter((m) => m !== month)
// // //     );
// // //   };

// // //   const handleAdvancePayment = () => {
// // //     const selectedMonthsCount = selectedMonths.length;
// // //     let discount = 0;
// // //     if (selectedMonthsCount >= 12) {
// // //       discount = 0.1; // 10% discount for 12 months
// // //     } else if (selectedMonthsCount >= 6) {
// // //       discount = 0.05; // 5% discount for 6 months
// // //     }

// // //     const totalAmount = selectedMonthsCount * MONTHLY_AMOUNT;
// // //     const discountedTotal = totalAmount * (1 - discount);

// // //     alert(`Advance payment for ${selectedMonthsCount} months: ₹${discountedTotal.toFixed(2)} (Discount: ${discount * 100}%)`);
// // //   };

// // //   const handlePayOverdue = () => {
// // //     alert("Overdue payment processed successfully.");
// // //   };

// // //   return (
// // //     <div className="p-6 mx-auto">
// // //       <h2 className="text-2xl font-bold mb-2">Maintenance Payments</h2>
// // //       {loading ? (
// // //         <p>Loading...</p>
// // //       ) : (
// // //         <>
// // //           {/* Overdue Payments Card */}
// // //           {overduePayments.length > 0 && (
// // //             <div className="mb-4 p-4 border rounded-lg bg-red-100">
// // //               <h3 className="font-semibold text-lg">Overdue Payments</h3>
// // //               <ul>
// // //                 {overduePayments.map((payment) => (
// // //                   <li key={payment.month} className="flex items-center gap-2">
// // //                     <Checkbox
// // //                       checked={selectedMonths.includes(payment.month)}
// // //                       onCheckedChange={(checked) => handleSelectMonth(payment.month, !!checked)}
// // //                     />
// // //                     <span>{payment.month}</span>
// // //                     <span className="ml-auto">₹{payment.amount || MONTHLY_AMOUNT}</span>
// // //                   </li>
// // //                 ))}
// // //               </ul>
// // //               <div className="mt-2">
// // //                 <strong>Total Due:</strong> ₹{totalDue}
// // //               </div>
// // //               <div className="mt-3">
// // //                 <Button
// // //                   disabled={selectedMonths.length === 0}
// // //                   onClick={handlePayOverdue}
// // //                 >
// // //                   Pay Overdue
// // //                 </Button>
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Upcoming Payments Card */}
// // //           <div className="mb-4 p-4 border rounded-lg bg-green-100">
// // //             <h3 className="font-semibold text-lg">Advance Payment (Upcoming Months)</h3>
// // //             <ul>
// // //               {upcomingMonths.map((month) => (
// // //                 <li key={month} className="flex items-center gap-2">
// // //                   <Checkbox
// // //                     checked={selectedMonths.includes(month)}
// // //                     onCheckedChange={(checked) => handleSelectMonth(month, !!checked)}
// // //                   />
// // //                   <span>{month}</span>
// // //                   <span className="ml-auto">₹{MONTHLY_AMOUNT}</span>
// // //                 </li>
// // //               ))}
// // //             </ul>
// // //             <div className="mt-2">
// // //               <strong>Total for selected months:</strong> ₹{selectedMonths.length * MONTHLY_AMOUNT}
// // //               {showDiscount && (
// // //                 <Alert className="mt-2">
// // //                   <AlertTitle>Discount!</AlertTitle>
// // //                   <AlertDescription>
// // //                     Pay for 6+ months at once and get{" "}
// // //                     <strong>{selectedMonths.length >= 12 ? "10%" : "5%"}</strong> off!
// // //                   </AlertDescription>
// // //                 </Alert>
// // //               )}
// // //             </div>
// // //             <div className="mt-3">
// // //               <Button
// // //                 disabled={selectedMonths.length === 0}
// // //                 onClick={handleAdvancePayment}
// // //               >
// // //                 Advance Payment (with Discount)
// // //               </Button>
// // //             </div>
// // //           </div>

// // //           {/* Past Payments Table */}
// // //           <div>
// // //             <h3 className="font-semibold mb-2">Past Payments</h3>
// // //             <Table>
// // //               <TableHead>
// // //                 <TableRow>
// // //                   <TableCell>Month</TableCell>
// // //                   <TableCell>Status</TableCell>
// // //                   <TableCell>Paid At</TableCell>
// // //                   <TableCell>Amount</TableCell>
// // //                 </TableRow>
// // //               </TableHead>
// // //               <TableBody>
// // //                 {payments.filter((p) => p.status === "paid").map((p) => (
// // //                   <TableRow key={p._id}>
// // //                     <TableCell>{p.month}</TableCell>
// // //                     <TableCell>{p.status}</TableCell>
// // //                     <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</TableCell>
// // //                     <TableCell>₹{p.amount}</TableCell>
// // //                   </TableRow>
// // //                 ))}
// // //               </TableBody>
// // //             </Table>
// // //           </div>
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // "use client";
// // import React, { useEffect, useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
// // import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// // import { IPayment } from "@/models/payment";

// // const MONTHLY_AMOUNT = 100;

// // function getCurrentMonth() {
// //   const now = new Date();
// //   return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
// // }

// // function getFutureMonths(count: number) {
// //   const months = [];
// //   let d = new Date();
// //   d.setMonth(d.getMonth() + 1);
// //   for (let i = 0; i < count; i++) {
// //     months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
// //     d.setMonth(d.getMonth() + 1);
// //   }
// //   return months;
// // }

// // export default function Page() {
// //   const [payments, setPayments] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
// //   const [overduePayments, setOverduePayments] = useState<any[]>([]);
// //   const [upcomingPayments, setUpcomingPayments] = useState<any[]>([]);
// //   const [showDiscount, setShowDiscount] = useState(false);
// //   const [payingMonths, setPayingMonths] = useState<string[]>([]);

// //   const upcomingMonths = getFutureMonths(12);
// //   const currentMonth = getCurrentMonth();

// //   useEffect(() => {
// //     fetch("/api/payments")
// //       .then((r) => r.json())
// //       .then((data) => {
// //         setPayments(data);
// //         const overdue = data.filter((p: IPayment) => {
// //           const dueDate = new Date(p.dueDate);
// //           return p.status !== "paid" && dueDate < new Date();
// //         });
// //         setOverduePayments(overdue);

// //         // Set upcoming payments excluding the current month if the date is after the 20th
// //         const upcoming = upcomingMonths.filter((month) => {
// //           return !data.some((payment: any) => payment.month === month && payment.status === "paid");
// //         });
// //         setUpcomingPayments(upcoming);
// //       })
// //       .finally(() => setLoading(false));
// //   }, []);

// //   const totalDue = overduePayments.reduce(
// //     (sum, { amount }) => sum + (amount || MONTHLY_AMOUNT),
// //     0
// //   );

// //   useEffect(() => {
// //     setShowDiscount(selectedMonths.length >= 6);
// //   }, [selectedMonths]);

// //   const handleSelectMonth = (month: string, checked: boolean) => {
// //     setSelectedMonths(
// //       checked ? [...selectedMonths, month] : selectedMonths.filter((m) => m !== month)
// //     );
// //   };

// //   const handleCreatePayment = async () => {
// //     const res = await fetch("/api/payments", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         month: currentMonth,
// //         amount: MONTHLY_AMOUNT,
// //         status: "unpaid",
// //         dueDate: new Date().toISOString(),
// //       }),
// //     });

// //     if (res.ok) {
// //       const newPayment = await res.json();
// //       setPayments((prevPayments) => [...prevPayments, newPayment]); // Add new payment to the list
// //       alert("Payment created for current month!");
// //     } else {
// //       alert("Failed to create payment. Please try again.");
// //     }
// //   };

// //   const handleAdvancePayment = async () => {
// //     const selectedMonthsCount = selectedMonths.length;
// //     let discount = 0;
// //     if (selectedMonthsCount >= 12) {
// //       discount = 0.1; // 10% discount for 12 months
// //     } else if (selectedMonthsCount >= 6) {
// //       discount = 0.05; // 5% discount for 6 months
// //     }

// //     const totalAmount = selectedMonthsCount * MONTHLY_AMOUNT;
// //     const discountedTotal = totalAmount * (1 - discount);

// //     const res = await fetch("/api/payments", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         months: selectedMonths,
// //         amount: discountedTotal,
// //         status: "paid",
// //       }),
// //     });

// //     if (res.ok) {
// //       const newPayment = await res.json();
// //       setPayments((prevPayments) => [...prevPayments, newPayment]); // Add new payment to the list
// //       setSelectedMonths([]); // Reset selected months
// //       alert(`Advance payment for ${selectedMonthsCount} months: ₹${discountedTotal.toFixed(2)} (Discount: ${discount * 100}%)`);
// //     } else {
// //       alert("Failed to create advance payment. Please try again.");
// //     }
// //   };

// //   const handlePayOverdue = async () => {
// //     const overduePaymentsToPay = overduePayments.filter((p: any) => payingMonths.includes(p.month));
// //     if (overduePaymentsToPay.length > 0) {
// //       const res = await fetch("/api/payments", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           months: payingMonths,
// //           amount: overduePaymentsToPay.reduce((sum, p: any) => sum + (p.amount || MONTHLY_AMOUNT), 0),
// //           status: "paid",
// //         }),
// //       });

// //       if (res.ok) {
// //         const newPayment = await res.json();
// //         setPayments((prevPayments) => [...prevPayments, newPayment]); // Add new payment to the list
// //         setPayingMonths([]); // Reset paying months
// //         alert("Overdue payment processed successfully.");
// //       } else {
// //         alert("Failed to process overdue payment. Please try again.");
// //       }
// //     } else {
// //       alert("No months selected for payment.");
// //     }
// //   };

// //   const handlePayForOverdueMonth = (month: string, checked: boolean) => {
// //     setPayingMonths(
// //       checked ? [...payingMonths, month] : payingMonths.filter((m) => m !== month)
// //     );
// //   };

// //   return (
// //     <div className="p-6 mx-auto">
// //       <h2 className="text-2xl font-bold mb-2">Maintenance Payments</h2>
// //       {loading ? (
// //         <p>Loading...</p>
// //       ) : (
// //         <>
// //           {/* Overdue Payments Card */}
// //           {overduePayments.length > 0 && (
// //             <div className="mb-4 p-4 border rounded-lg bg-red-100">
// //               <h3 className="font-semibold text-lg">Overdue Payments</h3>
// //               <ul>
// //                 {overduePayments.map((payment) => (
// //                   <li key={payment.month} className="flex items-center gap-2">
// //                     <Checkbox
// //                       checked={payingMonths.includes(payment.month)}
// //                       onCheckedChange={(checked) => handlePayForOverdueMonth(payment.month, !!checked)}
// //                     />
// //                     <span>{payment.month}</span>
// //                     <span className="ml-auto">₹{payment.amount || MONTHLY_AMOUNT}</span>
// //                   </li>
// //                 ))}
// //               </ul>
// //               <div className="mt-2">
// //                 <strong>Total Due:</strong> ₹{totalDue}
// //               </div>
// //               <div className="mt-3">
// //                 <Button
// //                   disabled={payingMonths.length === 0}
// //                   onClick={handlePayOverdue}
// //                 >
// //                   Pay Overdue
// //                 </Button>
// //               </div>
// //             </div>
// //           )}

// //           {/* Upcoming Payments Card */}
// //           {upcomingPayments.length > 0 && (
// //             <div className="mb-4 p-4 border rounded-lg bg-green-100">
// //               <h3 className="font-semibold text-lg">Upcoming Payments</h3>
// //               <ul>
// //                 {upcomingPayments.map((month) => (
// //                   <li key={month} className="flex items-center gap-2">
// //                     <Checkbox
// //                       checked={selectedMonths.includes(month)}
// //                       onCheckedChange={(checked) => handleSelectMonth(month, !!checked)}
// //                     />
// //                     <span>{month}</span>
// //                     <span className="ml-auto">₹{MONTHLY_AMOUNT}</span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           )}

// //           {/* Advance Payment Section */}
// //           <div className="mb-4 p-4 border rounded-lg bg-blue-100">
// //             <h3 className="font-semibold text-lg">Advance Payment</h3>
// //             <ul>
// //               {upcomingMonths.map((month) => (
// //                 <li key={month} className="flex items-center gap-2">
// //                   <Checkbox
// //                     checked={selectedMonths.includes(month)}
// //                     onCheckedChange={(checked) => handleSelectMonth(month, !!checked)}
// //                   />
// //                   <span>{month}</span>
// //                   <span className="ml-auto">₹{MONTHLY_AMOUNT}</span>
// //                 </li>
// //               ))}
// //             </ul>
// //             <div className="mt-2">
// //               <strong>Total for selected months:</strong> ₹{selectedMonths.length * MONTHLY_AMOUNT}
// //               {showDiscount && (
// //                 <Alert className="mt-2">
// //                   <AlertTitle>Discount!</AlertTitle>
// //                   <AlertDescription>
// //                     Pay for 6+ months at once and get{" "}
// //                     <strong>{selectedMonths.length >= 12 ? "10%" : "5%"}</strong> off!
// //                   </AlertDescription>
// //                 </Alert>
// //               )}
// //             </div>
// //             <div className="mt-3">
// //               <Button
// //                 disabled={selectedMonths.length === 0}
// //                 onClick={handleAdvancePayment}
// //               >
// //                 Advance Payment (with Discount)
// //               </Button>
// //             </div>
// //           </div>

// //           {/* Past Payments Table */}
// //           <div>
// //             <h3 className="font-semibold mb-2">Past Payments</h3>
// //             <Table>
// //               <TableHead>
// //                 <TableRow>
// //                   <TableCell>Month</TableCell>
// //                   <TableCell>Status</TableCell>
// //                   <TableCell>Paid At</TableCell>
// //                   <TableCell>Amount</TableCell>
// //                 </TableRow>
// //               </TableHead>
// //               <TableBody>
// //                 {payments.filter((p) => p.status === "paid").map((p) => (
// //                   <TableRow key={p._id}>
// //                     <TableCell>{p.month}</TableCell>
// //                     <TableCell>{p.status}</TableCell>
// //                     <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</TableCell>
// //                     <TableCell>₹{p.amount}</TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           </div>

// //           {/* Button to create payment if no payment created */}
// //           {!payments.some(p => p.month === currentMonth && p.status === "paid") && (
// //             <Button onClick={handleCreatePayment}>Create Payment for Current Month</Button>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // }


// "use client";
// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// import { IPayment } from "@/models/payment";

// const MONTHLY_AMOUNT = 100;

// function getCurrentMonth() {
//   const now = new Date();
//   return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
// }

// function getFutureMonths(count: number) {
//   const months = [];
//   let d = new Date();
//   d.setMonth(d.getMonth() + 1);
//   for (let i = 0; i < count; i++) {
//     months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
//     d.setMonth(d.getMonth() + 1);
//   }
//   return months;
// }

// export default function page() {
//   const [payments, setPayments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
//   const [payingMonths, setPayingMonths] = useState<string[]>([]);
//   const [overduePayments, setOverduePayments] = useState<any[]>([]);
//   const [showDiscount, setShowDiscount] = useState(false);

//   useEffect(() => {
//     fetch("/api/payments")
//       .then((r) => r.json())
//       .then((data) => {
//         setPayments(data);

//         const overdue = data.filter((p: IPayment) => {
//           const dueDate = new Date(p.dueDate);
//           return p.status !== "paid" && dueDate < new Date();
//         });
//         setOverduePayments(overdue);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const upcomingMonths = getFutureMonths(12);
//   const currentMonth = getCurrentMonth();

//   const totalDue = overduePayments.reduce(
//     (sum, { amount }) => sum + (amount || MONTHLY_AMOUNT),
//     0
//   );

//   useEffect(() => {
//     setShowDiscount(selectedMonths.length >= 6);
//   }, [selectedMonths]);

//   const handleSelectMonth = (month: string, checked: boolean) => {
//     setSelectedMonths(
//       checked ? [...selectedMonths, month] : selectedMonths.filter((m) => m !== month)
//     );
//   };

//   const handleSelectPayingMonth = (month: string, checked: boolean) => {
//     setPayingMonths(
//       checked ? [...payingMonths, month] : payingMonths.filter((m) => m !== month)
//     );
//   };

//   const handleAdvancePayment = async () => {
//     const selectedMonthsCount = selectedMonths.length;
//     let discount = 0;
//     if (selectedMonthsCount >= 12) {
//       discount = 0.1; // 10% discount for 12 months
//     } else if (selectedMonthsCount >= 6) {
//       discount = 0.05; // 5% discount for 6 months
//     }

//     const totalAmount = selectedMonthsCount * MONTHLY_AMOUNT;
//     const discountedTotal = totalAmount * (1 - discount);

//     const res = await fetch("/api/payments", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         months: selectedMonths,
//         amount: discountedTotal,
//       }),
//     });

//     if (res.ok) {
//       const newPayment = await res.json();
//       setPayments((prevPayments) => [...prevPayments, ...newPayment]);
//       setSelectedMonths([]); // Reset selected months
//       alert(`Advance payment for ${selectedMonthsCount} months: ₹${discountedTotal.toFixed(2)} (Discount: ${discount * 100}%)`);
//     } else {
//       alert("Failed to create advance payment. Please try again.");
//     }
//   };

//   const handlePayOverdue = async () => {
//     const overduePaymentsToPay = overduePayments.filter((p: any) => payingMonths.includes(p.month));
//     if (overduePaymentsToPay.length > 0) {
//       const res = await fetch("/api/payments", {
//         method: "PATCH", // Use PATCH request to update status
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           months: payingMonths, // Send selected months to backend
//         }),
//       });

//       if (res.ok) {
//         const updatedPayments = await res.json();
//         setPayments((prevPayments) => [...prevPayments, ...updatedPayments]);
//         setPayingMonths([]); // Reset paying months
//         alert("Overdue payment processed successfully.");
//       } else {
//         alert("Failed to process overdue payment. Please try again.");
//       }
//     } else {
//       alert("No months selected for payment.");
//     }
//   };

//   return (
//     <div className="p-6 mx-auto">
//       <h2 className="text-2xl font-bold mb-2">Maintenance Payments</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           {/* Overdue Payments Card */}
//           {overduePayments.length > 0 && (
//             <div className="mb-4 p-4 border rounded-lg bg-red-100">
//               <h3 className="font-semibold text-lg">Overdue Payments</h3>
//               <ul>
//                 {overduePayments.map((payment) => (
//                   <li key={payment.month} className="flex items-center gap-2">
//                     <Checkbox
//                       checked={payingMonths.includes(payment.month)}
//                       onCheckedChange={(checked) => handleSelectPayingMonth(payment.month, !!checked)}
//                     />
//                     <span>{payment.month}</span>
//                     <span className="ml-auto">₹{payment.amount || MONTHLY_AMOUNT}</span>
//                   </li>
//                 ))}
//               </ul>
//               <div className="mt-2">
//                 <strong>Total Due:</strong> ₹{totalDue}
//               </div>
//               <div className="mt-3">
//                 <Button
//                   disabled={payingMonths.length === 0}
//                   onClick={handlePayOverdue}
//                 >
//                   Pay Overdue
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Upcoming Payments Card */}
//           <div className="mb-4 p-4 border rounded-lg bg-green-100">
//             <h3 className="font-semibold text-lg">Advance Payment (Upcoming Months)</h3>
//             <ul>
//               {upcomingMonths.map((month) => (
//                 <li key={month} className="flex items-center gap-2">
//                   <Checkbox
//                     checked={selectedMonths.includes(month)}
//                     onCheckedChange={(checked) => handleSelectMonth(month, !!checked)}
//                   />
//                   <span>{month}</span>
//                   <span className="ml-auto">₹{MONTHLY_AMOUNT}</span>
//                 </li>
//               ))}
//             </ul>
//             <div className="mt-2">
//               <strong>Total for selected months:</strong> ₹{selectedMonths.length * MONTHLY_AMOUNT}
//               {showDiscount && (
//                 <Alert className="mt-2">
//                   <AlertTitle>Discount!</AlertTitle>
//                   <AlertDescription>
//                     Pay for 6+ months at once and get{" "}
//                     <strong>{selectedMonths.length >= 12 ? "10%" : "5%"}</strong> off!
//                   </AlertDescription>
//                 </Alert>
//               )}
//             </div>
//             <div className="mt-3">
//               <Button
//                 disabled={selectedMonths.length === 0}
//                 onClick={handleAdvancePayment}
//               >
//                 Advance Payment (with Discount)
//               </Button>
//             </div>
//           </div>

//           {/* Past Payments Table */}
//           <div>
//             <h3 className="font-semibold mb-2">Past Payments</h3>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Month</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell>Paid At</TableCell>
//                   <TableCell>Amount</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {payments.filter((p) => p.status === "paid").map((p) => (
//                   <TableRow key={p._id}>
//                     <TableCell>{p.month}</TableCell>
//                     <TableCell>{p.status}</TableCell>
//                     <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</TableCell>
//                     <TableCell>₹{p.amount}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }



"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const MONTHLY_AMOUNT = 1000;

// Helper to get YYYY-MM string for a given date
function getMonthString(offset: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Returns array of YYYY-MM for count months, starting from offset
function getMonths(count: number, startOffset = 0) {
  return Array.from({ length: count }, (_, i) => getMonthString(i + startOffset));
}

// Returns the payment status for a month: "upcoming", "due", or "advance"
function getPaymentStatus(month: string): "upcoming" | "due" | "advance" | null {
  const [year, m] = month.split("-").map(Number);
  const paymentDate = new Date(year, m - 1, 15); // 15th of the month
  const now = new Date();
  const weekAfter15th = new Date(paymentDate);
  weekAfter15th.setDate(weekAfter15th.getDate() + 7);

  if (now < paymentDate) return "advance";
  if (now >= paymentDate && now <= weekAfter15th) return "upcoming";
  if (now > weekAfter15th) return "due";
  return null;
}

export default function Page() {
  // All months to show (last 3, current, next 12)
  const months = [
    ...getMonths(3, -3), // Last 3 months
    getMonthString(0),   // Current month
    ...getMonths(12, 1), // Next 12 months
  ];

  // Categorize months based on payment status
  const categorized = {
    upcoming: [] as string[],
    due: [] as string[],
    advance: [] as string[],
  };
  months.forEach((month) => {
    const status = getPaymentStatus(month);
    if (status && categorized[status]) categorized[status].push(month);
  });

  const cardConfigs = [
    {
      key: "upcoming",
      title: "Upcoming Payments",
      desc: "Payment created on 15th, pay within a week.",
      months: categorized.upcoming,
      badge: "Upcoming",
      color: "",
    },
    {
      key: "due",
      title: "Total Due",
      desc: "Payments not paid within a week after 15th.",
      months: categorized.due,
      badge: "Due",
      color: "",
    },
    {
      key: "advance",
      title: "Advance Payments",
      desc: "Pay for future months and get discount.",
      months: categorized.advance,
      badge: "Advance",
      color: "",
    },
  ];

  const [selected, setSelected] = useState<{ [key: string]: string[] }>({
    upcoming: [],
    due: [],
    advance: [],
  });

  // Remove months from selection if they move to another category
  useEffect(() => {
    setSelected((prev) => ({
      upcoming: prev.upcoming.filter((m) => categorized.upcoming.includes(m)),
      due: prev.due.filter((m) => categorized.due.includes(m)),
      advance: prev.advance.filter((m) => categorized.advance.includes(m)),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(categorized)]);

  const handleCheck = (cardKey: string, month: string, checked: boolean) => {
    setSelected((prev) => ({
      ...prev,
      [cardKey]: checked
        ? [...prev[cardKey], month]
        : prev[cardKey].filter((m) => m !== month),
    }));
  };

  const handlePay = (cardKey: string) => {
    const months = selected[cardKey];
    if (months.length === 0) return;
    let discount = 0;
    if (cardKey === "advance" && months.length >= 6) discount = months.length >= 12 ? 0.1 : 0.05;
    const total = months.length * MONTHLY_AMOUNT * (1 - discount);
    alert(
      `Paying for months: ${months.join(", ")}\nTotal: ₹${total.toFixed(2)}${discount > 0 ? ` (Discount applied: ${discount * 100}%)` : ""}`
    );
    setSelected((prev) => ({ ...prev, [cardKey]: [] }));
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardConfigs.map((card) => (
          <Card key={card.key} className={`hover:shadow-lg transition-shadow duration-300 ${card.color}`}>
            <CardHeader>
              <CardDescription>{card.desc}</CardDescription>
              <CardTitle className="text-2xl font-semibold">{card.title}</CardTitle>
              <CardAction>
                <Badge variant="outline">{card.badge}</Badge>
              </CardAction>
            </CardHeader>
            <div className="px-6 pb-2">
              <ul className="space-y-2">
                {card.months.length === 0 && (
                  <li className="text-muted-foreground text-sm">No months available</li>
                )}
                {card.months.map((month) => (
                  <li key={month} className="flex items-center gap-2">
                    <Checkbox
                      checked={selected[card.key].includes(month)}
                      onCheckedChange={(checked) => handleCheck(card.key, month, !!checked)}
                    />
                    <span>{month}</span>
                    <span className="ml-auto font-medium">₹{MONTHLY_AMOUNT}</span>
                  </li>
                ))}
              </ul>
            </div>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex items-center gap-2 font-medium">
                {card.title}
              </div>
              <div className="text-muted-foreground">
                {selected[card.key].length > 0 && card.key === "advance" && selected[card.key].length >= 6 ? (
                  <span>
                    Discount: <b>{selected[card.key].length >= 12 ? "10%" : "5%"}</b> applied!
                  </span>
                ) : null}
                {selected[card.key].length > 0 && (
                  <span>
                    Total: ₹
                    {(selected[card.key].length *
                      MONTHLY_AMOUNT *
                      (card.key === "advance" && selected[card.key].length >= 6
                        ? selected[card.key].length >= 12
                          ? 0.9
                          : 0.95
                        : 1)
                    ).toFixed(2)}
                  </span>
                )}
              </div>
              <Button
                className="mt-2"
                disabled={selected[card.key].length === 0}
                onClick={() => handlePay(card.key)}
              >
                Pay Selected
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}