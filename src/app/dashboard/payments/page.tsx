
// "use client";

// import {
//   getCategorizedPayments,
//   getPaymentHistory,
//   markMonthsAsPaid,
//   createTestPayment,
//   generatePayments, // temp dev-only action
// } from "@/app/actions/handlePayments";
// import { useEffect, useState } from "react";

// // Define payment type
// type Payment = {
//   month: string;
//   amount: number;
//   status: "pending" | "due" | "paid";
//   discount?: number;
//   paidAt?: string;
// };

// type CategoryKey = "due" | "upcoming" | "advance";

// const MONTHLY_AMOUNT = 1000;

// export default function Page() {
//   const [payments, setPayments] = useState<Record<CategoryKey, Payment[]>>({
//     due: [],
//     upcoming: [],
//     advance: [],
//   });

//   const [selected, setSelected] = useState<Record<CategoryKey, string[]>>({
//     due: [],
//     upcoming: [],
//     advance: [],
//   });

//   const [tab, setTab] = useState<"active" | "history">("active");
//   const [history, setHistory] = useState<Payment[]>([]);

//   useEffect(() => {
//     if (tab === "history") {
//       getPaymentHistory().then(setHistory);
//     }
//   }, [tab]);

//   useEffect(() => {
//     const loadPayments = async () => {
//       const categorized = await getCategorizedPayments();
//       setPayments(categorized);
//     };
//     loadPayments();
//   }, []);

//   const handleCheck = (key: CategoryKey, month: string, checked: boolean) => {
//     setSelected((prev) => ({
//       ...prev,
//       [key]: checked ? [...prev[key], month] : prev[key].filter((m) => m !== month),
//     }));
//   };

//   const handlePay = async (key: CategoryKey) => {
//     const months = selected[key];
//     if (months.length === 0) return;

//     let discount = 0;
//     if (key === "advance" && months.length >= 6) {
//       discount = months.length >= 12 ? 0.1 : 0.05;
//     }

//     const total = months.length * MONTHLY_AMOUNT * (1 - discount);
//     await markMonthsAsPaid(months);
//     alert(`Paid ₹${total.toFixed(2)} for: ${months.join(", ")}`);
//     setSelected((prev) => ({ ...prev, [key]: [] }));

//     const refreshed = await getCategorizedPayments();
//     setPayments(refreshed);
//   };

//   const handleGeneratePayments = async () => {
//     await generatePayments(); // Temporary button for testing
//     const refreshed = await getCategorizedPayments();
//     setPayments(refreshed);
//     alert("Payments generated successfully.");
//   };

//   const handleTestPayment = async () => {
//     const now = new Date();
//     const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
//     await createTestPayment(month);  // Temporary button for testing
//     const refreshed = await getCategorizedPayments();
//     setPayments(refreshed);
//     alert("Test payment created successfully.");
//   }
//   const cards: { key: CategoryKey; title: string; desc: string; badge: string }[] = [
//     {
//       key: "upcoming",
//       title: "Upcoming Payments",
//       desc: "Pay within 1 week of creation.",
//       badge: "Upcoming",
//     },
//     {
//       key: "due",
//       title: "Total Due",
//       desc: "Payments overdue after 1 week.",
//       badge: "Due",
//     },
//     {
//       key: "advance",
//       title: "Advance Payments",
//       desc: "Pay future months with discounts.",
//       badge: "Advance",
//     },
//   ];

//   return (
//     <div className="p-4">
//       {/* Tab Switcher */}
//       <div className="flex gap-4 mb-6">
//         <button
//           className={`px-4 py-2 rounded ${tab === "active" ? "bg-black text-white" : "bg-muted"
//             }`}
//           onClick={() => setTab("active")}
//         >
//           Active Payments
//         </button>
//         <button
//           className={`px-4 py-2 rounded ${tab === "history" ? "bg-black text-white" : "bg-muted"
//             }`}
//           onClick={() => setTab("history")}
//         >
//           Payment History
//         </button>
//         {/* 🔧 TEMP DEV ONLY */}
//         <button
//           className="ml-auto px-4 py-2 rounded bg-blue-600 text-white"
//           onClick={handleGeneratePayments}
//         >
//           Generate Payments (Test)
//         </button>
//         <button
//           className="ml-auto px-4 py-2 rounded bg-blue-600 text-white"
//           onClick={handleTestPayment}
//         >
//           Create Payments (Test)
//         </button>
//       </div>

//       {/* Active Payments UI */}
//       {tab === "active" ? (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {cards.map((card) => (
//             <div key={card.key} className="border rounded-xl shadow p-4">
//               <div className="text-xl font-semibold mb-1">{card.title}</div>
//               <div className="text-sm text-muted-foreground mb-2">{card.desc}</div>

//               {payments[card.key].length === 0 ? (
//                 <p className="text-muted-foreground text-sm">No months available</p>
//               ) : (
//                 <ul className="space-y-2 mb-2">
//                   {payments[card.key].map((payment) => (
//                     <li key={payment.month} className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={selected[card.key].includes(payment.month)}
//                         onChange={(e) =>
//                           handleCheck(card.key, payment.month, e.target.checked)
//                         }
//                       />
//                       <span>{payment.month}</span>
//                       <span className="ml-auto font-medium">₹{payment.amount}</span>
//                     </li>
//                   ))}
//                 </ul>
//               )}

//               {selected[card.key].length > 0 && (
//                 <div className="text-sm text-muted-foreground mb-2">
//                   {card.key === "advance" && selected[card.key].length >= 6 && (
//                     <div>
//                       Discount:{" "}
//                       <b>
//                         {selected[card.key].length >= 12 ? "10%" : "5%"}
//                       </b>
//                     </div>
//                   )}
//                   Total: ₹
//                   {(
//                     selected[card.key].length *
//                     MONTHLY_AMOUNT *
//                     (card.key === "advance" && selected[card.key].length >= 6
//                       ? selected[card.key].length >= 12
//                         ? 0.9
//                         : 0.95
//                       : 1)
//                   ).toFixed(2)}
//                 </div>
//               )}

//               <button
//                 className="mt-2 px-4 py-2 bg-black text-white rounded disabled:opacity-50"
//                 disabled={selected[card.key].length === 0}
//                 onClick={() => handlePay(card.key)}
//               >
//                 Pay Selected
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         // Payment History UI
//         <div className="overflow-x-auto">
//           {history.length === 0 ? (
//             <p className="text-muted-foreground text-sm">No payment history available.</p>
//           ) : (
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr>
//                   <th className="text-left py-2">Month</th>
//                   <th className="text-left py-2">Amount</th>
//                   <th className="text-left py-2">Discount</th>
//                   <th className="text-left py-2">Paid At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {history.map((p) => (
//                   <tr key={p.month}>
//                     <td className="py-1">{p.month}</td>
//                     <td className="py-1">₹{p.amount.toFixed(2)}</td>
//                     <td className="py-1">{p.discount ? `${p.discount * 100}%` : "-"}</td>
//                     <td className="py-1">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import {
  getCategorizedPayments,
  getPaymentHistory,
  markMonthsAsPaid,
  createTestPayment,
  generatePayments,
} from "@/app/actions/handlePayments";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Payment = {
  month: string;
  amount: number;
  status: "pending" | "due" | "paid";
  discount?: number;
  paidAt?: string;
};

type CategoryKey = "due" | "upcoming" | "advance";
const MONTHLY_AMOUNT = 1000;

function calculateTotal(key: CategoryKey, months: string[]) {
  if (months.length === 0) return 0;
  let discount = 0;
  if (key === "advance") {
    discount = months.length >= 12 ? 0.1 : months.length >= 6 ? 0.05 : 0;
  }
  return months.length * MONTHLY_AMOUNT * (1 - discount);
}

export default function Page() {
  const [payments, setPayments] = useState<Record<CategoryKey, Payment[]>>({
    due: [],
    upcoming: [],
    advance: [],
  });
  const [selected, setSelected] = useState<Record<CategoryKey, string[]>>({
    due: [],
    upcoming: [],
    advance: [],
  });
  const [tab, setTab] = useState<"active" | "history">("active");
  const [history, setHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === "history") {
      getPaymentHistory().then(setHistory);
    }
  }, [tab]);

  useEffect(() => {
    const loadPayments = async () => {
      const categorized = await getCategorizedPayments();
      setPayments(categorized);
    };
    loadPayments();
  }, []);

  const handleCheck = (key: CategoryKey, month: string, checked: boolean) => {
    setSelected((prev) => ({
      ...prev,
      [key]: checked ? [...prev[key], month] : prev[key].filter((m) => m !== month),
    }));
  };

  // const handlePay = async (key: CategoryKey) => {
  //   const months = selected[key];
  //   if (months.length === 0) return;
  //   const total = calculateTotal(key, months);

  //   try {
  //     setLoading(true);
  //     await markMonthsAsPaid(months);
  //     toast.success(`Paid ₹${total.toFixed(2)} for: ${months.join(", ")}`);
  //     setSelected((prev) => ({ ...prev, [key]: [] }));
  //     const refreshed = await getCategorizedPayments();
  //     setPayments(refreshed);
  //   } catch {
  //     toast.error("Payment failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePay = async (key: CategoryKey) => {
    const months = selected[key];
    if (months.length === 0) return;
    const total = calculateTotal(key, months);

    try {
      setLoading(true);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ months, total }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        toast.error("Failed to start Stripe payment.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayments = async () => {
    try {
      setLoading(true);
      await generatePayments();
      const refreshed = await getCategorizedPayments();
      setPayments(refreshed);
      toast.success("Payments generated successfully.");
    } catch {
      toast.error("Failed to generate payments.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestPayment = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      await createTestPayment(month);
      const refreshed = await getCategorizedPayments();
      setPayments(refreshed);
      toast.success("Test payment created successfully.");
    } catch {
      toast.error("Failed to create test payment.");
    } finally {
      setLoading(false);
    }
  };

  const cards: { key: CategoryKey; title: string; desc: string; badge: string }[] = [
    {
      key: "upcoming",
      title: "Upcoming Payments",
      desc: "Pay within 1 week of creation.",
      badge: "Upcoming",
    },
    {
      key: "due",
      title: "Total Due",
      desc: "Payments overdue after 1 week.",
      badge: "Due",
    },
    {
      key: "advance",
      title: "Advance Payments",
      desc: "Pay future months with discounts.",
      badge: "Advance",
    },
  ];

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === "active" ? "bg-black text-white" : "bg-muted"}`}
          onClick={() => setTab("active")}
        >
          Active Payments
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "history" ? "bg-black text-white" : "bg-muted"}`}
          onClick={() => setTab("history")}
        >
          Payment History
        </button>
        <button
          className="ml-auto px-4 py-2 rounded bg-blue-600 text-white"
          onClick={handleGeneratePayments}
        >
          Generate Payments (Test)
        </button>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white"
          onClick={handleTestPayment}
        >
          Create Payment (Test)
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Loading...</div>
      ) : tab === "active" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.key} className="border rounded-xl shadow p-4">
              <div className="text-xl font-semibold mb-1">{card.title}</div>
              <div className="text-sm text-muted-foreground mb-2">{card.desc}</div>

              {payments[card.key].length === 0 ? (
                <p className="text-muted-foreground text-sm">No months available</p>
              ) : (
                <ul className="space-y-2 mb-2">
                  {payments[card.key].map((payment) => (
                    <li key={payment.month} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selected[card.key].includes(payment.month)}
                        onChange={(e) => handleCheck(card.key, payment.month, e.target.checked)}
                      />
                      <span>{payment.month}</span>
                      <span className="ml-auto font-medium">₹{payment.amount}</span>
                    </li>
                  ))}
                </ul>
              )}

              {selected[card.key].length > 0 && (
                <div className="text-sm text-muted-foreground mb-2">
                  {card.key === "advance" && selected[card.key].length >= 6 && (
                    <div>
                      Discount:{" "}
                      <b>
                        {selected[card.key].length >= 12 ? "10%" : "5%"}
                      </b>
                    </div>
                  )}
                  Total: ₹{calculateTotal(card.key, selected[card.key]).toFixed(2)}
                </div>
              )}

              <button
                className="mt-2 px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                disabled={selected[card.key].length === 0}
                onClick={() => handlePay(card.key)}
              >
                Pay Selected
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Payment History
        <div className="overflow-x-auto">
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">No payment history available.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2">Month</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Discount</th>
                  <th className="text-left py-2">Paid At</th>
                </tr>
              </thead>
              <tbody>
                {history.map((p) => (
                  <tr key={p.month}>
                    <td className="py-1">{p.month}</td>
                    <td className="py-1">₹{p.amount.toFixed(2)}</td>
                    <td className="py-1">{p.discount ? `${p.discount * 100}%` : "-"}</td>
                    <td className="py-1">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
