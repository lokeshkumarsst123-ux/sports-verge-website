"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { TipIcon } from "./TipsterUI";

export default function TipPaymentSuccessModal({ destination, onClose }: {
  destination: string;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return <dialog ref={dialog} className="tip-native-dialog" aria-labelledby="tip-payment-success-title" onCancel={event => {event.preventDefault();onClose();}}>
    <div className="tip-module tip-checkout-modal tip-payment-success">
      <div className="tip-checkout-title"><strong className="d-flex align-items-center gap-2"><span className="tip-checkout-shield"><i className="bi bi-shield-lock-fill text-warning"></i></span>Stripe Secure Checkout</strong><button className="tip-modal-close" aria-label="Close payment confirmation" onClick={onClose}><i className="bi bi-x-lg"></i></button></div>
      <div className="tip-payment-success-body">
        <span className="tip-payment-success-check" aria-hidden="true"><i className="bi bi-check-lg" style={{ fontSize: "32px", color: "#16A34A" }}></i></span>
        <h1 id="tip-payment-success-title">Payment Successful!</h1>
        <p role="status">Prediction has been unlocked and added to your purchased library.</p>
        <div className="tip-payment-success-actions"><Link className="tip-primary" href={destination}>View Full Prediction Now <i className="bi bi-arrow-right ms-1"></i></Link><Link className="tip-pill" href="/my-purchased-tips">My Purchased Tips</Link></div>
      </div>
    </div>
  </dialog>;
}
