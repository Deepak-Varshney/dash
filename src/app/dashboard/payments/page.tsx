// // import PageContainer from '@/components/layout/page-container';
// // import { buttonVariants } from '@/components/ui/button';
// // import { Heading } from '@/components/ui/heading';
// // import { Separator } from '@/components/ui/separator';
// // import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
// // import ExpenseListingPage from '@/features/expense/components/expense-listing';
// // import { searchParamsCache } from '@/lib/searchparams';
// // import { cn } from '@/lib/utils';
// // import { currentUser } from '@clerk/nextjs/server';
// // import { IconPlus } from '@tabler/icons-react';
// // import Link from 'next/link';
// // import { SearchParams } from 'nuqs/server';
// // import { Suspense } from 'react';

// // export const metadata = {
// //   title: 'Dashboard: Payments'
// // };

// // type pageProps = {
// //   searchParams: Promise<SearchParams>;
// // };

// // export default async function Page(props: pageProps) {
// //   const searchParams = await props.searchParams;
// //   // Allow nested RSCs to access the search params (in a type-safe way)
// //   searchParamsCache.parse(searchParams);
// //   const user = await currentUser();
// //   // This key is used for invoke suspense if any of the search params changed (used for filters).
// //   // const key = serialize({ ...searchParams });

// //   return (
// //     <PageContainer scrollable={false}>
// //       <div className='flex flex-1 flex-col space-y-4'>
// //         <div className='flex items-start justify-between'>
// //           <Heading
// //             title='Payments'
// //             description='Manage payments'
// //           />
// //           {user?.publicMetadata?.role === 'admin' && (<Link
// //             href='/dashboard/payments/new'
// //             className={cn(buttonVariants(), 'text-xs md:text-sm')}
// //           >
// //             <IconPlus className='mr-2 h-4 w-4' /> Add New
// //           </Link>)}
// //         </div>
// //         <Separator />
// //         <Suspense
// //           // key={key}
// //           fallback={
// //             <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
// //           }
// //         >
// //           <ExpenseListingPage />
// //         </Suspense>
// //       </div>
// //     </PageContainer>
// //   );
// // }

// "use client";
// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// import { useUser } from "@clerk/nextjs";
// import { PaymentForm } from "@/components/payment-form";

// function getCurrentMonth() {
//   const now = new Date();
//   return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
// }

// function getPrevMonths(count: number) {
//   const months = [];
//   let d = new Date();
//   for (let i = 0; i < count; i++) {
//     months.unshift(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
//     d.setMonth(d.getMonth() - 1);
//   }
//   return months;
// }

// const MONTHLY_AMOUNT = 100; // Change as needed

// export default function PaymentsPage() {
//   const [payments, setPayments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
//   const [showDiscount, setShowDiscount] = useState(false);
//   const { user } = useUser();

//   useEffect(() => {
//     fetch("/api/payments")
//       .then(r => r.json())
//       .then(setPayments)
//       .finally(() => setLoading(false));
//   }, []);

//   // Get all months (current and next 5 months)
//   const monthsToShow = [
//     ...getPrevMonths(6), // last 6 months (including current)
//     // Add future months if you want to allow advance payment
//   ];

//   const unpaid = monthsToShow
//     .map(month => ({
//       month,
//       payment: payments.find(p => p.month === month),
//     }))
//     .filter(({ payment }) => !payment || payment.status !== "paid");

//   const totalDue = unpaid.reduce((sum, { payment }) =>
//     sum + (payment?.amount || MONTHLY_AMOUNT), 0
//   );

//   useEffect(() => {
//     setShowDiscount(selectedMonths.length >= 6);
//   }, [selectedMonths]);

//   const handleSelectMonth = (month: string, checked: boolean) => {
//     setSelectedMonths(checked
//       ? [...selectedMonths, month]
//       : selectedMonths.filter(m => m !== month)
//     );
//   };

//   const handlePay = async () => {
//     // Here, you'd call your payment gateway. For demo, just POST to API and mark as paid.
//     await fetch("/api/payments", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         months: selectedMonths,
//         amount: MONTHLY_AMOUNT,
//       }),
//     });
//     setSelectedMonths([]);
//     setShowDiscount(false);
//     // Refetch payments
//     const updated = await fetch("/api/payments").then(r => r.json());
//     setPayments(updated);
//     alert("Payment record(s) created! Integrate your payment gateway to mark as paid.");
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold mb-2">Maintenance Payments</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <div className="mb-4">
//             <h3 className="font-semibold">Upcoming & Overdue</h3>
//             <ul>
//               {unpaid.map(({ month, payment }) => (
//                 <li key={month} className="flex items-center gap-2">
//                   <Checkbox
//                     checked={selectedMonths.includes(month)}
//                     onCheckedChange={checked => handleSelectMonth(month, !!checked)}
//                   />
//                   <span>{month}</span>
//                   <span className={`ml-2 text-sm ${payment?.status === "overdue" ? "text-red-600" : ""}`}>
//                     {payment?.status === "overdue" ? "Overdue" : "Pending"}
//                   </span>
//                   <span className="ml-auto">₹{payment?.amount || MONTHLY_AMOUNT}</span>
//                 </li>
//               ))}
//             </ul>
//             <div className="mt-2">
//               <strong>Total Due:</strong> ₹{selectedMonths.length > 0
//                 ? selectedMonths.length * MONTHLY_AMOUNT * (showDiscount ? 0.95 : 1)
//                 : totalDue}
//               {showDiscount && (
//                 <Alert className="mt-2" variant="default">
//                   <AlertTitle>Discount!</AlertTitle>
//                   <AlertDescription>
//                     Pay for 6+ months at once and get <strong>5% off</strong>!
//                   </AlertDescription>
//                 </Alert>
//               )}
//             </div>
//             <Button
//               className="mt-3"
//               disabled={selectedMonths.length === 0}
//               onClick={handlePay}
//             >
//               Pay Selected
//             </Button>
//           </div>
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
//                 {payments.filter(p => p.status === "paid").map(p => (
//                   <TableRow key={p._id}>
//                     <TableCell>{p.month}</TableCell>
//                     <TableCell>{p.status}</TableCell>
//                     <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</TableCell>
//                     <TableCell>₹{p.amount}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             <PaymentForm amount={MONTHLY_AMOUNT} />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@clerk/nextjs";

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getPrevMonths(count: number) {
  const months = [];
  let d = new Date();
  for (let i = 0; i < count; i++) {
    months.unshift(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    d.setMonth(d.getMonth() - 1);
  }
  return months;
}

const MONTHLY_AMOUNT = 100; // Change as needed

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [showDiscount, setShowDiscount] = useState(false);

  useEffect(() => {
    fetch("/api/payments")
      .then(r => r.json())
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  // Get all months (current and previous 5 months)
  const monthsToShow = [
    ...getPrevMonths(6), // last 6 months (including current)
  ];

  const unpaid = monthsToShow
    .map(month => ({
      month,
      payment: payments.find(p => p.month === month),
    }))
    .filter(({ payment }) => !payment || payment.status !== "paid");

  const totalDue = unpaid.reduce((sum, { payment }) =>
    sum + (payment?.amount || MONTHLY_AMOUNT), 0
  );

  useEffect(() => {
    setShowDiscount(selectedMonths.length >= 6);
  }, [selectedMonths]);

  const handleSelectMonth = (month: string, checked: boolean) => {
    setSelectedMonths(checked
      ? [...selectedMonths, month]
      : selectedMonths.filter(m => m !== month)
    );
  };

  const handleCreateOrUpdate = async () => {
    // "Create" pending payments for selected months
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        months: selectedMonths,
        amount: MONTHLY_AMOUNT,
      }),
    });
    // Refetch payments
    const updated = await fetch("/api/payments").then(r => r.json());
    setPayments(updated);
    alert("Pending payment(s) created or updated!");
  };

  const handleMarkPaid = async () => {
    await fetch("/api/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ months: selectedMonths }),
    });
    setSelectedMonths([]);
    setShowDiscount(false);
    // Refetch payments
    const updated = await fetch("/api/payments").then(r => r.json());
    setPayments(updated);
    alert("Payment(s) marked as paid!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Maintenance Payments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="font-semibold">Upcoming & Overdue</h3>
            <ul>
              {unpaid.map(({ month, payment }) => (
                <li key={month} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedMonths.includes(month)}
                    onCheckedChange={checked => handleSelectMonth(month, !!checked)}
                  />
                  <span>{month}</span>
                  <span className={`ml-2 text-sm ${payment?.status === "overdue" ? "text-red-600" : ""}`}>
                    {payment?.status === "overdue" ? "Overdue" : "Pending"}
                  </span>
                  <span className="ml-auto">₹{payment?.amount || MONTHLY_AMOUNT}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <strong>Total Due:</strong> ₹{selectedMonths.length > 0
                ? Math.round(selectedMonths.length * MONTHLY_AMOUNT * (showDiscount ? 0.95 : 1))
                : totalDue}
              {showDiscount && (
                <Alert className="mt-2">
                  <AlertTitle>Discount!</AlertTitle>
                  <AlertDescription>
                    Pay for 6+ months at once and get <strong>5% off</strong>!
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                disabled={selectedMonths.length === 0}
                onClick={handleCreateOrUpdate}
                variant="secondary"
              >
                Create/Update Pending
              </Button>
              <Button
                disabled={selectedMonths.length === 0}
                onClick={handleMarkPaid}
              >
                Mark as Paid
              </Button>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Past Payments</h3>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Paid At</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.filter(p => p.status === "paid").map(p => (
                  <TableRow key={p._id}>
                    <TableCell>{p.month}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>₹{p.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}