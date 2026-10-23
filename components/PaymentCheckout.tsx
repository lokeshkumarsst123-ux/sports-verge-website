"use client";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { billingApi, money, type PaymentPreparation } from "@/lib/tipster-api";
import { apiErrorMessage, hasAuthSession } from "@/lib/auth-api";
import StripePaymentForm from "./StripePaymentForm";
import { Notice } from "./TipsterUI";
export default function PaymentCheckout({ kind, plan, tipId, onBusyChange, activation = false }: {
    kind: "tipster" | "tip";
    activation?: boolean;
    plan?: string;
    tipId?: string;
    onBusyChange?: (busy: boolean) => void;
}) {
    const [payment, setPayment] = useState<PaymentPreparation | null>(null), [error, setError] = useState(""), [loading, setLoading] = useState(true), [retry, setRetry] = useState(0), [busy, setBusy] = useState(false);
    useEffect(() => { let active = true; (async () => { try {
        if (!hasAuthSession()) {
            window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
            return;
        }
        const result = kind === "tipster" ? await billingApi.setup(plan || "") : await billingApi.tipPayment(tipId || "");
        if (active) {
            setPayment(result);
            if (result.mode === "complete")
                window.location.assign(`/billing/return?order_id=${result.orderId}`);
        }
    }
    catch (e) {
        if (active)
            setError(apiErrorMessage(e));
    }
    finally {
        if (active)
            setLoading(false);
    } })(); return () => { active = false; }; }, [kind, plan, tipId, retry]);
    const returnUrl = payment && typeof window !== "undefined" ? `${window.location.origin}/billing/return?order_id=${payment.orderId}` : "";
    const continueCard = async () => { if (!payment?.setup_intent_id)
        return; setBusy(true); onBusyChange?.(true); setError(""); try {
        const sub = await billingApi.activate(payment.orderId, payment.setup_intent_id);
        if (sub.mode !== "complete") {
            const stripe = await loadStripe(sub.publishable_key);
            if (!stripe || !sub.client_secret)
                throw new Error("Payment is not ready. Please try again.");
            const result = await stripe.confirmCardPayment(sub.client_secret, sub.payment_method ? { payment_method: sub.payment_method } : undefined);
            if (result.error)
                throw new Error(result.error.message);
        }
        window.location.assign(returnUrl);
    }
    catch (e) {
        setError(apiErrorMessage(e));
        setBusy(false);
        onBusyChange?.(false);
    } };
    return <><Notice error={error}/>{loading ? <p className="muted" role="status">Preparing your secure payment...</p> : payment && <>{kind === "tipster" && <p className="muted small">Your membership renews automatically. You can cancel renewal from your dashboard.</p>}{payment.mode === "ready" ? <><p className="muted small">Your card is verified. Continue to activate your membership.</p><button className="tip-primary w-100" disabled={busy} onClick={continueCard}>{busy ? "Processing securely..." : `Pay ${money(payment.amount, payment.currency)} & Activate`}</button></> : payment.mode === "complete" ? <p role="status">Payment confirmed. Opening your account...</p> : <StripePaymentForm payment={payment} returnUrl={returnUrl} onBusyChange={onBusyChange} label={kind === "tip" ? `Pay ${money(payment.amount, payment.currency)} & Unlock Now` : `Pay ${money(payment.amount, payment.currency)} & Activate Tipster Account`} premium={kind === "tip"} activation={activation}/>}</>}{error && <button className="tip-pill mt-3" disabled={busy} onClick={() => { setLoading(true); setError(""); setPayment(null); setRetry(r => r + 1); }}>Retry payment</button>}<p className="muted small text-center mt-3 mb-0">Secure payment powered by Stripe</p></>;
}
