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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MONTHLY_AMOUNT = 1000;

type Payment = {
  month: string;
  amount: number;
  status: "pending" | "due" | "paid";
  discount?: number;
  paidAt?: string;
};

type CategoryKey = "due" | "upcoming" | "advance";

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
      getPaymentHistory().then((history) =>
        setHistory(
          history.map((p) => ({
            month: p.month,
            amount: p.amount,
            status: p.status,
            discount: (p as any).discount,
            paidAt: p.paidAt ?? undefined,
          }))
        )
      );
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
        window.location.href = data.url;
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
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Payments</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <div className="flex gap-2 mb-6">
          <Button onClick={handleGeneratePayments} disabled={loading} variant="secondary">
            Generate Payments (Test)
          </Button>
          <Button onClick={handleTestPayment} disabled={loading} variant="secondary">
            Create Payment (Test)
          </Button>
        </div>

        <TabsContent value="active">
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.map((card) => (
                <Card key={card.key}>
                  <CardContent className="p-4">
                    <div className="text-xl font-semibold mb-1">{card.title}</div>
                    <div className="text-sm text-muted-foreground mb-2">{card.desc}</div>
                    {payments[card.key].length === 0 ? (
                      <p className="text-muted-foreground text-sm">No months available</p>
                    ) : (
                      <ul className="space-y-2 mb-2">
                        {payments[card.key].map((payment) => (
                          <li key={payment.month} className="flex items-center gap-2">
                            <Checkbox
                              checked={selected[card.key].includes(payment.month)}
                              onCheckedChange={(checked) =>
                                handleCheck(card.key, payment.month, !!checked)
                              }
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
                            Discount: <b>{selected[card.key].length >= 12 ? "10%" : "5%"}</b>
                          </div>
                        )}
                        Total: ₹{calculateTotal(card.key, selected[card.key]).toFixed(2)}
                      </div>
                    )}

                    <Button
                      className="mt-2 w-full"
                      onClick={() => handlePay(card.key)}
                      disabled={selected[card.key].length === 0 || loading}
                    >
                      Pay Selected
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">No payment history available.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Paid At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((p) => (
                  <TableRow key={p.month}>
                    <TableCell>{p.month}</TableCell>
                    <TableCell>₹{p.amount.toFixed(2)}</TableCell>
                    <TableCell>{p.discount ? `${p.discount * 100}%` : "-"}</TableCell>
                    <TableCell>
                      {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
