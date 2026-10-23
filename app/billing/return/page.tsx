"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { billingApi } from "@/lib/tipster-api";
import { loadStripe } from "@stripe/stripe-js";
import { hasAuthSession } from "@/lib/auth-api";
import { TipsterShell, Notice } from "@/components/TipsterUI";
import TipMarketplace from "@/components/TipMarketplace";
import TipPaymentSuccessModal from "@/components/TipPaymentSuccessModal";
export default function BillingReturn() {
  const [result, setResult] = useState<{
    hasAccess: boolean;
    status: string;
    destination: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    let tries = 0;
    const check = async () => {
      try {
        if (!hasAuthSession()) {
          setError("Please sign in to confirm your payment.");
          return;
        }
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get("order_id"),
          id = params.get("session_id");
        if (!orderId && !id) throw new Error("No payment found.");
        if (orderId && params.get("setup_intent") && tries === 0) {
          const subscription = await billingApi.activate(
            orderId,
            params.get("setup_intent")!,
          );
          if (subscription.mode !== "complete") {
            const stripe = await loadStripe(subscription.publishable_key);
            if (!stripe || !subscription.client_secret)
              throw new Error("Unable to confirm the membership payment.");
            const result = await stripe.confirmCardPayment(
              subscription.client_secret,
              subscription.payment_method
                ? { payment_method: subscription.payment_method }
                : undefined,
            );
            if (result.error)
              throw new Error(result.error.message || "Payment failed.");
          }
        }
        const data = orderId
          ? await billingApi.paymentStatus(orderId)
          : await billingApi.status(id!);
        if (!active) return;
        setResult(data);
        if (data.hasAccess && data.destination === "/tipster/dashboard") {
          window.location.replace(data.destination);
          return;
        }
        if (
          !data.hasAccess &&
          !["expired", "failed", "refunded", "disputed"].includes(
            data.status,
          ) &&
          ++tries < 10
        )
          timer = setTimeout(check, 2000);
      } catch (e) {
        if (active)
          setError(
            e instanceof Error ? e.message : "Unable to confirm payment.",
          );
      }
    };
    void check();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [attempt]);
  // A redirect query or Stripe's client result alone never opens the success UI.
  // This branch requires the authenticated backend's verified purchase access.
  if (result?.hasAccess && result.destination.startsWith("/tips/")) {
    return <><TipMarketplace/><TipPaymentSuccessModal destination={result.destination} onClose={() => window.location.replace("/tips")}/></>;
  }
  return (
    <TipsterShell
      title={
        result?.hasAccess ? "Payment confirmed" : "Confirming your payment"
      }
    >
      <div
        className="membership-card mx-auto text-center"
        style={{ maxWidth: 650 }}
      >
        <Notice error={error} />
        <p role="status">
          {result?.hasAccess
            ? "Your access is now enabled."
            : result
              ? `Payment status: ${result.status}. Access will appear after Stripe confirmation.`
              : "Checking your payment securely…"}
        </p>
        {result?.hasAccess ? (
          <Link
            className="btn btn-success rounded-pill"
            href={result.destination}
          >
            Continue
          </Link>
        ) : (
          <>
            <button
              onClick={() => {
                setError("");
                setAttempt((n) => n + 1);
              }}
              className="btn btn-outline-success me-2"
            >
              Check again
            </button>
            <Link href="/login?next=%2Fmembership" className="text-success">
              Sign in
            </Link>
          </>
        )}
      </div>
    </TipsterShell>
  );
}
