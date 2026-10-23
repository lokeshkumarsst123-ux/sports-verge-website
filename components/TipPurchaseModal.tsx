"use client";
import { useEffect, useRef, useState } from "react";
import type { Tip } from "@/types/tipster";
import { TipIcon } from "./TipsterUI";
import { money } from "@/lib/tipster-api";
import PaymentCheckout from "./PaymentCheckout";
export default function TipPurchaseModal({ tip, onClose }: {
    tip: Tip;
    onClose: () => void;
}) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [busy, setBusy] = useState(false);
    useEffect(() => { const element = dialog.current; const previous = document.activeElement as HTMLElement | null; element?.showModal(); const overflow = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus(); }; }, []);
    return <dialog ref={dialog} className="tip-native-dialog" onCancel={e => { e.preventDefault(); if (!busy)
        onClose(); }} aria-labelledby="tip-checkout-title"><div className="tip-module tip-checkout-modal"><div className="tip-checkout-title"><strong id="tip-checkout-title" className="d-flex align-items-center gap-2"><span className="tip-checkout-shield"><i className="bi bi-shield-lock-fill text-warning"></i></span>Stripe Secure Checkout</strong><button className="tip-modal-close" aria-label="Close checkout" disabled={busy} onClick={onClose}><i className="bi bi-x-lg"></i></button></div><div className="tip-checkout-summary"><div><strong>{tip.teams.home} vs {tip.teams.away}</strong><small>Tipster: {tip.tipster.displayName}</small><small className="text-success">Pick: {tip.predictionTitle}</small></div><span className="text-danger">{money(tip.premiumPrice || 0, tip.currency)}</span></div><PaymentCheckout kind="tip" tipId={tip.id} onBusyChange={setBusy}/></div></dialog>;
}
