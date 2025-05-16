"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "Payment failed.");
    } else {
      setMessage("Payment succeeded!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe || loading} className="btn btn-primary mt-4">
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>
      {message && <div className="mt-2 text-red-500">{message}</div>}
    </form>
  );
}

export function PaymentForm({ amount }: { amount: number }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useState(() => {
    fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  },) ;

  if (!clientSecret) return <div>Loading payment form...</div>;

  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
}