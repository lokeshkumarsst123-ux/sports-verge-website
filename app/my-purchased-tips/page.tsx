"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PurchasedTip, SportType } from "@/types/tipster";
import { getPurchasedTips, useIsMounted } from "@/lib/tipster-store";

const SPORT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Cricket: { bg: "rgba(34, 197, 94, 0.15)", text: "#4ade80", border: "rgba(34, 197, 94, 0.35)" },
  Football: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.35)" },
  NFL: { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.35)" },
  AFL: { bg: "rgba(236, 72, 153, 0.15)", text: "#f472b6", border: "rgba(236, 72, 153, 0.35)" },
};

export default function MyPurchasedTipsPage() {
  const mounted = useIsMounted();
  const [purchasedTips] = useState<PurchasedTip[]>(() => getPurchasedTips());
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "expired">("all");
  const [selectedSport, setSelectedSport] = useState<SportType | "All">("All");

  if (!mounted) return null;

  const filteredPurchases = purchasedTips.filter((item) => {
    if (activeFilter === "active" && item.status !== "active") return false;
    if (activeFilter === "expired" && item.status !== "expired") return false;
    if (selectedSport !== "All" && item.tip?.sport !== selectedSport) return false;
    return true;
  });

  const totalSpent = purchasedTips.reduce((acc, curr) => acc + (curr.purchasePrice || 0), 0);
  const activeCount = purchasedTips.filter((p) => p.status === "active").length;

  return (
    <main className="font-outfit text-white py-4 py-lg-5" style={{ background: "var(--bg-dark, #070b12)", minHeight: "100vh" }}>
      <div className="container custom-container" style={{ maxWidth: "1200px" }}>
        {/* Breadcrumb Navigation */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div className="d-flex align-items-center gap-2">
            <Link href="/" className="text-secondary text-decoration-none small hover-text-success">
              Home
            </Link>
            <span className="text-secondary small">/</span>
            <Link href="/tips" className="text-secondary text-decoration-none small hover-text-success">
              Tips
            </Link>
            <span className="text-secondary small">/</span>
            <span className="text-success small fw-semibold">My Purchased Tips</span>
          </div>

          <Link
            href="/tips"
            className="tipster-btn-outline px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2"
            style={{ fontSize: "12px" }}
          >
            <i className="bi bi-grid-fill"></i>
            <span>Browse All Tips</span>
          </Link>
        </div>

        {/* Page Title & Summary Header */}
        <div
          className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 85% 20%, rgba(34, 197, 94, 0.16), rgba(7, 11, 18, 0) 70%), linear-gradient(135deg, #0e1722 0%, #070b12 100%)",
            border: "1px solid rgba(34, 197, 94, 0.35)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
          }}
        >
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span
                  className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold d-inline-flex align-items-center gap-2"
                  style={{
                    fontSize: "12px",
                    background: "rgba(34, 197, 94, 0.16)",
                    color: "#4ade80",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                  }}
                >
                  <i className="bi bi-unlock-fill"></i>
                  <span>UNLOCKED PREDICTIONS PORTAL</span>
                </span>
              </div>

              <h1 className="fw-black text-white font-space-grotesk text-uppercase mb-2" style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)" }}>
                My Purchased Tips
              </h1>
              <p className="text-secondary mb-0" style={{ maxWidth: "580px", fontSize: "14px", lineHeight: "1.6" }}>
                Access and review all your unlocked premium sports predictions, complete staking breakdowns, and purchase history.
              </p>
            </div>

            {/* Quick Stat Counters */}
            <div className="col-lg-5">
              <div className="row g-3">
                <div className="col-6">
                  <div
                    className="p-3 rounded-4 text-center"
                    style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                  >
                    <div className="text-secondary text-uppercase small fw-bold mb-1" style={{ fontSize: "10px" }}>
                      UNLOCKED TIPS
                    </div>
                    <div className="display-6 fw-black text-white font-space-grotesk">{purchasedTips.length}</div>
                    <div className="text-success small fw-semibold" style={{ fontSize: "11px" }}>{activeCount} Active</div>
                  </div>
                </div>

                <div className="col-6">
                  <div
                    className="p-3 rounded-4 text-center"
                    style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                  >
                    <div className="text-secondary text-uppercase small fw-bold mb-1" style={{ fontSize: "10px" }}>
                      TOTAL SPENT
                    </div>
                    <div className="display-6 fw-black text-success font-space-grotesk">
                      ${totalSpent.toFixed(2)}
                    </div>
                    <div className="text-secondary small" style={{ fontSize: "11px" }}>Via Stripe Checkout</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-20">
          <div className="d-flex align-items-center gap-2 overflow-x-auto">
            {[
              { id: "all", label: `All Purchases (${purchasedTips.length})` },
              { id: "active", label: `Active Predictions (${activeCount})` },
              { id: "expired", label: "Tip History" },
            ].map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                  className="btn btn-sm rounded-pill font-space-grotesk text-nowrap transition-all"
                  style={{
                    fontSize: "13px",
                    padding: "7px 18px",
                    fontWeight: isActive ? "700" : "500",
                    background: isActive ? "#22c55e" : "rgba(255, 255, 255, 0.05)",
                    color: isActive ? "#ffffff" : "#cbd5e1",
                    border: isActive ? "1px solid #22c55e" : "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: isActive ? "0 4px 14px rgba(34, 197, 94, 0.3)" : "none",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="d-flex align-items-center gap-2 overflow-x-auto">
            {(["All", "Cricket", "Football", "NFL", "AFL"] as const).map((sp) => {
              const isSelected = selectedSport === sp;
              return (
                <button
                  key={sp}
                  type="button"
                  onClick={() => setSelectedSport(sp)}
                  className="btn btn-sm rounded-pill font-space-grotesk text-nowrap transition-all"
                  style={{
                    fontSize: "12px",
                    padding: "5px 14px",
                    fontWeight: isSelected ? "700" : "500",
                    background: isSelected ? "rgba(34, 197, 94, 0.18)" : "rgba(255, 255, 255, 0.03)",
                    color: isSelected ? "#4ade80" : "#94a3b8",
                    border: isSelected ? "1px solid #22c55e" : "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {sp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Purchased Tips List */}
        {filteredPurchases.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {filteredPurchases.map((item) => {
              const tip = item.tip;
              const sportColor = SPORT_COLORS[tip?.sport || "Football"] || SPORT_COLORS.Football;
              const purchaseDate = item.purchasedAt
                ? new Date(item.purchasedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
                : "Recent";

              return (
                <div
                  key={item.id}
                  className="rounded-4 p-4 transition-all"
                  style={{
                    background: "var(--bg-card, #0e1520)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {/* Badges */}
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
                    <span
                      className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold"
                      style={{
                        fontSize: "11px",
                        background: sportColor.bg,
                        color: sportColor.text,
                        border: `1px solid ${sportColor.border}`,
                      }}
                    >
                      {tip?.sport || "Sports"}
                    </span>

                    <span
                      className="badge bg-dark border border-secondary border-opacity-30 text-light px-3 py-1 font-space-grotesk"
                      style={{ fontSize: "11px" }}
                    >
                      {tip?.competition || "Pro League"}
                    </span>

                    <span
                      className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold d-inline-flex align-items-center gap-1"
                      style={{
                        fontSize: "11px",
                        background: "rgba(34, 197, 94, 0.16)",
                        color: "#4ade80",
                        border: "1px solid rgba(34, 197, 94, 0.4)",
                      }}
                    >
                      <i className="bi bi-patch-check-fill"></i>
                      <span>UNLOCKED</span>
                    </span>
                  </div>

                  {/* Match Fixture Title */}
                  <h5 className="fw-black text-white font-space-grotesk mb-3" style={{ fontSize: "18px" }}>
                    {tip?.match || "Match Fixture"}
                  </h5>

                  {/* 2-Column Content Row */}
                  <div className="row g-3 align-items-center">
                    {/* Left Column: Prediction Pick Box */}
                    <div className="col-lg-7">
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span className="text-secondary text-uppercase small fw-bold font-space-grotesk" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>
                            PREDICTION PICK
                          </span>
                          <span className="text-success fw-bold font-space-grotesk small">
                            {tip?.confidenceLevel || "High"} Confidence
                          </span>
                        </div>
                        <div className="fw-bold text-white font-space-grotesk mb-1" style={{ fontSize: "15px" }}>
                          {tip?.predictionTitle || "Premium Prediction"}
                        </div>
                        <div className="d-flex align-items-center justify-content-between text-secondary small">
                          <span>Market: <strong className="text-light">{tip?.predictionCategory}</strong></span>
                          <span>Odds: <strong className="text-success font-space-grotesk fs-6">{Number(tip?.odds || 1.9).toFixed(2)}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Invoice Details Box */}
                    <div className="col-lg-5">
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1 text-secondary small">
                          <span>Price Paid:</span>
                          <span className="text-white fw-bold font-space-grotesk fs-6">
                            ${item.purchasePrice?.toFixed(2) || "4.99"} USD
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-1 text-secondary small">
                          <span>Purchased At:</span>
                          <span className="text-light">{purchaseDate}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center text-secondary small">
                          <span>Stripe Ref:</span>
                          <span className="text-secondary font-monospace" style={{ fontSize: "10px" }}>
                            {item.paymentId || "stripe_completed"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Meta Info on Left, CTA Button on Right */}
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 pt-3 mt-3 border-top border-secondary border-opacity-10">
                    <div className="d-flex align-items-center gap-3 text-secondary small flex-wrap">
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-person-circle text-success"></i>
                        <span>Tipster: <strong className="text-white">{tip?.tipster?.displayName || "Pro Tipster"}</strong></span>
                      </div>
                      <span>•</span>
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-calendar-event me-1"></i>
                        <span>Match Kickoff: <strong className="text-white">{tip?.matchDate} {tip?.kickoffTime ? `(${tip.kickoffTime})` : ""}</strong></span>
                      </div>
                    </div>

                    <Link
                      href={`/tips/${item.tipId}`}
                      className="tipster-btn-primary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 text-decoration-none shadow"
                      style={{ fontSize: "13px" }}
                    >
                      <i className="bi bi-eye"></i>
                      <span>View Full Unlocked Prediction</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div
            className="text-center p-5 rounded-4 my-4"
            style={{
              background: "var(--bg-card, #0e1520)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: "64px", height: "64px", background: "rgba(34, 197, 94, 0.12)", color: "#22c55e", fontSize: "28px" }}
            >
              <i className="bi bi-lock-fill"></i>
            </div>
            <h4 className="fw-bold font-space-grotesk text-white mb-2">No Purchased Tips Yet</h4>
            <p className="text-secondary small mb-4" style={{ maxWidth: "460px", margin: "0 auto" }}>
              You haven't unlocked any premium tips yet. Browse our marketplace to find high-confidence predictions from verified sports analysts.
            </p>
            <Link href="/tips" className="tipster-btn-primary rounded-pill px-5 py-2">
              Browse Available Tips
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
