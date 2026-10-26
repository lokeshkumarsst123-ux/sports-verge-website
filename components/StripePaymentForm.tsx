"use client";
import { useMemo, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe, } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { TipIcon } from "./TipsterUI";
import { getStoredUser } from "@/lib/auth-api";
import { billingApi, money, type PaymentPreparation } from "@/lib/tipster-api";
function PaymentForm({ payment, returnUrl, label, premium, onBusyChange, activation = false, }: {
    payment: PaymentPreparation;
    returnUrl: string;
    label?: string;
    premium?: boolean;
    activation?: boolean;
    onBusyChange?: (busy: boolean) => void;
}) {
    const stripe = useStripe(), elements = useElements();
    const [busy, setBusy] = useState(false), [error, setError] = useState("");
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements)
            return;
        setBusy(true);
        onBusyChange?.(true);
        setError("");
        try {
            if (payment.mode === "setup") {
                const result = await stripe.confirmSetup({
                    elements,
                    confirmParams: { return_url: returnUrl },
                    redirect: "if_required",
                });
                if (result.error)
                    throw new Error(result.error.message || "Card verification failed.");
                if (result.setupIntent?.status !== "succeeded")
                    throw new Error("Card verification is still processing. Please retry shortly.");
                const subscription = await billingApi.activate(payment.orderId, result.setupIntent.id);
                if (subscription.mode !== "complete") {
                    if (!subscription.client_secret)
                        throw new Error("Subscription payment is not ready.");
                    const confirmation = await stripe.confirmCardPayment(subscription.client_secret, subscription.payment_method
                        ? { payment_method: subscription.payment_method }
                        : undefined);
                    if (confirmation.error)
                        throw new Error(confirmation.error.message || "Payment could not be completed.");
                }
            }
            else {
                const result = await stripe.confirmPayment({
                    elements,
                    confirmParams: { return_url: returnUrl },
                    redirect: "if_required",
                });
                if (result.error)
                    throw new Error(result.error.message || "Payment could not be completed.");
            }
            window.location.assign(returnUrl);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "Unable to process payment.");
            setBusy(false);
            onBusyChange?.(false);
        }
    };
    return (<form onSubmit={submit}>
      <PaymentElement options={{ layout: "tabs", business: { name: "The Sports Verge" }, ...(activation || premium ? {fields:{billingDetails:{name:"always" as const}},defaultValues:{billingDetails:{name:[getStoredUser()?.firstName,getStoredUser()?.lastName].filter(Boolean).join(" "),address:{country:"AU"}}}} : {}) }}/>
      {error && (<p className="alert alert-danger mt-3" role="alert">
          {error}
        </p>)}
      <button className={`tip-primary w-100 mt-4 ${premium ? "tip-danger" : ""}`} disabled={busy || !stripe || !elements}>
        {(activation || premium) && <TipIcon name="lock"/>}
        {busy
            ? "Processing securely…"
            : (label || `Pay ${money(payment.amount, payment.currency)}`)}
      </button>
    </form>);
}
export default function StripePaymentForm({ payment, returnUrl, label, premium, onBusyChange, activation = false, }: {
    payment: PaymentPreparation;
    returnUrl: string;
    label?: string;
    premium?: boolean;
    activation?: boolean;
    onBusyChange?: (busy: boolean) => void;
}) {
    const stripe = useMemo(() => loadStripe(payment.publishable_key), [payment.publishable_key]);
    if (!payment.client_secret)
        return null;
    return (<Elements stripe={stripe} options={{
            clientSecret: payment.client_secret,
            appearance: {
                theme: "stripe",
                variables: {
                    colorPrimary: "#1C1F22",
                    colorBackground: "#FFFFFF",
                    colorText: "#1C1F22",
                    colorDanger: "#ef4444",
                    borderRadius: "10px",
                    fontFamily: "Outfit, Arial, sans-serif",
                    fontSizeBase: "15px",
                    fontSizeSm: "13px",
                    fontSizeXs: "12px",
                    spacingUnit: "4px",
                },
                rules: {
                    ".Input": {
                        backgroundColor: "#FAF6EF",
                        borderColor: "#EAE5DC",
                        color: "#1C1F22",
                        boxShadow: "none",
                    },
                    ".Input:focus": {
                        borderColor: "#FFCC00",
                        boxShadow: "0 0 0 1px #FFCC00",
                    },
                    ".Label": {
                        color: "#4B5563",
                        fontWeight: "600",
                        fontSize: "12px",
                        textTransform: "uppercase",
                    },
                    ".Tab": {
                        backgroundColor: "#FAF6EF",
                        borderColor: "#EAE5DC",
                        color: "#1C1F22",
                    },
                    ".Tab--selected": {
                        backgroundColor: "#FFFFFF",
                        borderColor: "#FFCC00",
                        color: "#1C1F22",
                    },
                },
            },
        }}>
      <PaymentForm payment={payment} returnUrl={returnUrl} label={label} premium={premium} onBusyChange={onBusyChange} activation={activation}/>
    </Elements>);
}
