"use client";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { hasAuthSession } from "@/lib/auth-api";
import PaymentCheckout from "@/components/PaymentCheckout";
import { TipsterShell } from "@/components/TipsterUI";
import MembershipPlans from "@/components/MembershipPlans";
export default function PaymentPage() { return <Suspense fallback={<TipsterShell title="Secure checkout"><p role="status">Preparing your payment...</p></TipsterShell>}><PaymentContent /></Suspense>; }
function PaymentContent() { const params = useSearchParams(); useEffect(() => { if (!hasAuthSession())
    window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`); }, []); if (params.get("kind") === "tipster")
    return <MembershipPlans />; return <TipsterShell title="Unlock premium prediction"><div className="tip-panel mx-auto" style={{ maxWidth: 480 }}>{params.get("kind") === "tip" && params.get("tipId") ? <PaymentCheckout kind="tip" tipId={params.get("tipId") || ""}/> : <p>Choose a membership plan or premium tip first.</p>}<Link className="muted small d-block mt-4" href="/tips">Back to tips</Link></div></TipsterShell>; }
