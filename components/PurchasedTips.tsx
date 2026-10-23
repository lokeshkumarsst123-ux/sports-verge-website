"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { tipsterApi, money } from "@/lib/tipster-api";
import { apiErrorMessage, hasAuthSession } from "@/lib/auth-api";
import type { PurchasedTip } from "@/types/tipster";
import { TipsterShell, Notice } from "./TipsterUI";
export default function PurchasedTips() {
  const [items, setItems] = useState<PurchasedTip[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!hasAuthSession()) {
          window.location.assign("/login?next=%2Fmy-purchased-tips");
          return;
        }
        const r = await tipsterApi.purchases();
        if (active) setItems(r.purchases);
      } catch (e) {
        if (active) setError(apiErrorMessage(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  return (
    <TipsterShell title="" navigation="none" className="tip-purchased-page">
      <Notice error={error} />
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <nav aria-label="Breadcrumb" className="d-flex align-items-center gap-2 small mb-2">
            <Link href="/" className="text-muted text-decoration-none">Home</Link>
            <span className="text-muted">/</span>
            <Link href="/tips" className="text-muted text-decoration-none">Tips</Link>
            <span className="text-muted">/</span>
            <span className="fw-bold text-success text-uppercase">Purchased Tips</span>
          </nav>
          <h1 className="mb-0 fs-2 fw-black font-space-grotesk text-dark">MY PURCHASED PREDICTIONS</h1>
          <p className="text-muted small mb-0 mt-1">Review your unlocked premium predictions and detailed betting analysis.</p>
        </div>
        <Link className="tip-pill" href="/tips">
          <i className="bi bi-arrow-left me-1"></i> Browse More Tips
        </Link>
      </div>

      {loading ? (
        <p role="status">Loading purchases…</p>
      ) : items.length ? (
        <div className="row g-4">
          {items.map((p) => (
            <div className="col-lg-6 col-12" key={p.id}>
              <article className="tip-panel p-4 h-100 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="tip-tag" data-sport={p.tip.sport}>{p.tip.sport}</span>
                    <span className="badge bg-light text-dark border px-2 py-1 fw-semibold small">{p.tip.competition}</span>
                  </div>
                  <span className="badge bg-success-subtle text-success border border-success-subtle fw-bold px-2 py-1">
                    <i className="bi bi-check-circle-fill me-1"></i> UNLOCKED
                  </span>
                </div>

                <h3 className="fs-5 fw-bold text-dark mb-1">{p.tip.predictionTitle}</h3>
                <p className="text-muted small mb-3">
                  <strong>{p.tip.teams.home} vs {p.tip.teams.away}</strong>
                </p>

                <div className="p-3 rounded-3 mb-3 mt-auto" style={{ background: "#FAF6EF", border: "1px solid #EAE5DC" }}>
                  <div className="d-flex justify-content-between align-items-center small mb-1">
                    <span className="text-muted">Purchased on</span>
                    <strong className="text-dark">{new Date(p.purchasedAt).toLocaleDateString()}</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center small">
                    <span className="text-muted">Price Paid</span>
                    <strong className="text-success">{money(p.purchasePrice, p.currency || p.tip.currency)}</strong>
                  </div>
                </div>

                {p.contentAvailable !== false ? (
                  <Link
                    href={`/tips/${p.tipId}`}
                    className="tip-primary text-center py-2 text-decoration-none mt-2"
                  >
                    Read Full Prediction <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                ) : (
                  <p className="text-muted small mb-0 text-center mt-2">
                    {p.status === "active" ? "This tip is currently unavailable. Your purchase record is retained." : "Access is inactive for this purchase."}
                  </p>
                )}
              </article>
            </div>
          ))}
        </div>
      ) : (
        <section className="tip-panel text-center py-5 px-3 rounded-4" style={{ background: "#FAF6EF", border: "1px dashed #D8D1C5" }}>
          <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "56px", height: "56px", background: "#FFFFFF", border: "1px solid #EAE5DC", color: "#9CA3AF", fontSize: "24px" }}>
            <i className="bi bi-unlock-fill"></i>
          </div>
          <h3 className="fs-5 fw-bold text-dark mb-2">No Purchased Predictions Yet</h3>
          <p className="text-muted small mb-4" style={{ maxWidth: "420px", margin: "0 auto" }}>When you unlock premium predictions from verified tipsters, they will appear here with lifetime access.</p>
          <Link className="tip-primary px-4 py-2" href="/tips">
            Explore Tips Marketplace
          </Link>
        </section>
      )}
    </TipsterShell>
  );
}
