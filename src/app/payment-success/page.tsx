"use client";

import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

export default function SuccessPage() {
  const params = useSearchParams();
  const months = params.get("months");

  useEffect(() => {
    if (months) {
      toast.success(`Payment successful for: ${months}`);
    }
  }, [months]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p>Thank you for your payment.</p>
    </div>
  );
}
