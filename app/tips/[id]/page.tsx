"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tip, PurchasedTip } from "@/types/tipster";
import {
  getStoredTips,
  isTipPurchasedByUser,
  addPurchasedTip,
  getStoredTipster,
  useIsMounted,
} from "@/lib/tipster-store";

const SPORT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Cricket: { bg: "rgba(34, 197, 94, 0.15)", text: "#4ade80", border: "rgba(34, 197, 94, 0.35)" },
  Football: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.35)" },
  NFL: { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.35)" },
  AFL: { bg: "rgba(236, 72, 153, 0.15)", text: "#f472b6", border: "rgba(236, 72, 153, 0.35)" },
};

export default function TipDetailPage() {
  const params = useParams();
  const tipId = params?.id as string;
  const mounted = useIsMounted();

  const [tip, setTip] = useState<Tip | null>(() => {
    if (!tipId) return null;
    const all = getStoredTips();
    return all.find((t) => t.id === tipId) || null;
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (!tipId) return false;
    const all = getStoredTips();
    const found = all.find((t) => t.id === tipId);
    if (!found) return false;
    return found.visibility === "Free" || isTipPurchasedByUser(tipId);
  });

  const [isOwner] = useState<boolean>(() => {
    if (!tipId) return false;
    const all = getStoredTips();
    const found = all.find((t) => t.id === tipId);
    if (!found) return false;
    const loggedIn = getStoredTipster();
    return loggedIn?.id === found.tipsterId;
  });

  const [isFollowing, setIsFollowing] = useState(false);

  // Stripe Checkout Modal simulation
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardHolder, setCardHolder] = useState("Sports Enthusiast");

  const handleProcessStripePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tip) return;

    setIsProcessingPayment(true);

    setTimeout(() => {
      const newPurchase: PurchasedTip = {
        id: `purchase-${Date.now()}`,
        tipId: tip.id,
        tip: tip,
        userId: "user-current-session",
        purchasePrice: tip.premiumPrice || 4.99,
        purchasedAt: new Date().toISOString(),
        paymentId: `pi_sim_${Date.now()}_secret`,
        status: "active",
      };

      addPurchasedTip(newPurchase);
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setIsUnlocked(true);

      setTimeout(() => {
        setCheckoutModalOpen(false);
      }, 1500);
    }, 1200);
  };

  if (!mounted) return null;

  if (!tip) {
    return (
      <main className="font-outfit text-white py-5 min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "var(--bg-dark, #070b12)" }}>
        <div className="text-center p-5 rounded-4" style={{ background: "var(--bg-card, #0e1520)", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "500px" }}>
          <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "64px", height: "64px", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", fontSize: "28px" }}>
            <i className="bi bi-exclamation-octagon"></i>
          </div>
          <h3 className="fw-bold font-space-grotesk text-white mb-2">Prediction Not Found</h3>
          <p className="text-secondary small mb-4">
            The sports tip you are looking for (ID: <code className="text-light">{tipId}</code>) does not exist or may have been removed.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Link href="/tipster/dashboard" className="tipster-btn-outline rounded-pill px-4 py-2">
              Tipster Dashboard
            </Link>
            <Link href="/tips" className="tipster-btn-primary rounded-pill px-4 py-2">
              Browse All Tips
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const sportColor = SPORT_COLORS[tip.sport] || SPORT_COLORS.Football;

  return (
    <main className="font-outfit text-white py-4 py-lg-5" style={{ background: "var(--bg-dark, #070b12)", minHeight: "100vh" }}>
      <div className="container custom-container" style={{ maxWidth: "1200px" }}>
        {/* Navigation & Breadcrumb */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
          <div className="d-flex align-items-center gap-2">
            <Link href="/" className="text-secondary text-decoration-none small hover-text-success">
              Home
            </Link>
            <span className="text-secondary small">/</span>
            <Link href="/tips" className="text-secondary text-decoration-none small hover-text-success">
              Tips
            </Link>
            <span className="text-secondary small">/</span>
            <span className="text-success small fw-semibold text-truncate" style={{ maxWidth: "160px" }}>
              {tip.sport}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <Link
              href="/tips"
              className="tipster-btn-outline px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5"
              style={{ fontSize: "12px" }}
            >
              <i className="bi bi-arrow-left"></i>
              <span>All Tips</span>
            </Link>

            <Link
              href="/my-purchased-tips"
              className="tipster-btn-outline px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5"
              style={{ fontSize: "12px", borderColor: "rgba(34, 197, 94, 0.35)", color: "#4ade80" }}
            >
              <i className="bi bi-unlock-fill"></i>
              <span>My Purchased Tips</span>
            </Link>

            {isOwner && (
              <Link
                href={`/tipster/edit-tip/${tip.id}`}
                className="tipster-btn-outline px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5"
                style={{ fontSize: "12px", borderColor: "rgba(34, 197, 94, 0.4)", color: "#4ade80" }}
              >
                <i className="bi bi-pencil-square"></i>
                <span>Edit</span>
              </Link>
            )}
          </div>
        </div>

        {/* Hero Card: Match & Prediction Header */}
        <div
          className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0e1622 0%, #080d14 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Background Ambient Glow */}
          <div
            className="position-absolute top-0 end-0 rounded-circle"
            style={{
              width: "400px",
              height: "400px",
              background:
                tip.visibility === "Premium"
                  ? "radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 70%)",
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          ></div>

          {/* Badges Row */}
          <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
            <span
              className="badge rounded-pill px-3 py-2 font-space-grotesk fw-bold text-uppercase"
              style={{
                fontSize: "12px",
                background: sportColor.bg,
                color: sportColor.text,
                border: `1px solid ${sportColor.border}`,
                letterSpacing: "0.04em",
              }}
            >
              {tip.sport}
            </span>

            <span
              className="badge bg-dark border border-secondary border-opacity-30 text-light px-3 py-2 font-space-grotesk"
              style={{ fontSize: "12px" }}
            >
              {tip.competition}
            </span>

            {tip.visibility === "Premium" ? (
              <span
                className="badge rounded-pill px-3 py-2 font-space-grotesk fw-bold d-inline-flex align-items-center gap-2"
                style={{
                  fontSize: "12px",
                  background: "rgba(239, 68, 68, 0.18)",
                  color: "#f87171",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  letterSpacing: "0.04em",
                }}
              >
                <i className="bi bi-lock-fill"></i>
                <span>PREMIUM (${tip.premiumPrice || "4.99"} USD)</span>
              </span>
            ) : (
              <span
                className="badge rounded-pill px-3 py-2 font-space-grotesk fw-bold"
                style={{
                  fontSize: "12px",
                  background: "rgba(59, 130, 246, 0.18)",
                  color: "#60a5fa",
                  border: "1px solid rgba(59, 130, 246, 0.4)",
                  letterSpacing: "0.04em",
                }}
              >
                FREE TIP
              </span>
            )}

            <span
              className="badge rounded-pill px-3 py-2 font-space-grotesk fw-bold"
              style={{
                fontSize: "12px",
                background:
                  tip.status === "Published"
                    ? "rgba(34, 197, 94, 0.16)"
                    : tip.status === "Scheduled"
                    ? "rgba(56, 189, 248, 0.16)"
                    : "rgba(148, 163, 184, 0.16)",
                color:
                  tip.status === "Published"
                    ? "#4ade80"
                    : tip.status === "Scheduled"
                    ? "#38bdf8"
                    : "#cbd5e1",
                border:
                  tip.status === "Published"
                    ? "1px solid rgba(34, 197, 94, 0.4)"
                    : tip.status === "Scheduled"
                    ? "1px solid rgba(56, 189, 248, 0.4)"
                    : "1px solid rgba(148, 163, 184, 0.4)",
              }}
            >
              {tip.status}
            </span>
          </div>

          {/* Match Title & Fixture Details */}
          <div className="mb-4">
            <h1
              className="fw-black text-white font-space-grotesk text-uppercase mb-3"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", letterSpacing: "0.02em", lineHeight: "1.25" }}
            >
              {tip.predictionTitle}
            </h1>

            <div className="d-flex align-items-center gap-3 flex-wrap text-secondary small pt-1">
              <span className="text-white fw-bold d-flex align-items-center gap-2" style={{ fontSize: "14px" }}>
                <i className="bi bi-shield-fill text-danger"></i>
                <span>{tip.match}</span>
              </span>
              <span className="text-secondary opacity-50">•</span>
              <span className="text-light d-flex align-items-center gap-2" style={{ fontSize: "14px" }}>
                <i className="bi bi-calendar3 text-success"></i>
                <span>{tip.matchDate}</span>
              </span>
              <span className="text-secondary opacity-50">•</span>
              <span className="text-light d-flex align-items-center gap-2" style={{ fontSize: "14px" }}>
                <i className="bi bi-clock-fill text-warning"></i>
                <span>{tip.kickoffTime}</span>
              </span>
            </div>
          </div>

          {/* Prediction Metric Badges Banner */}
          <div
            className="p-3 p-md-4 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-3 mt-2"
            style={{
              background: "#060a10",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="d-flex align-items-center gap-4 flex-wrap">
              <div>
                <span
                  className="text-secondary small text-uppercase font-space-grotesk fw-bold d-block mb-1"
                  style={{ fontSize: "12px", letterSpacing: "0.05em", color: "#94a3b8" }}
                >
                  PREDICTION MARKET
                </span>
                <span className="text-white fw-bold font-space-grotesk" style={{ fontSize: "15px" }}>{tip.predictionCategory}</span>
              </div>

              <div className="border-start border-secondary border-opacity-25 ps-4">
                <span
                  className="text-secondary small text-uppercase font-space-grotesk fw-bold d-block mb-1"
                  style={{ fontSize: "12px", letterSpacing: "0.05em", color: "#94a3b8" }}
                >
                  DECIMAL ODDS
                </span>
                <span className="text-success fw-black font-space-grotesk fs-4">{Number(tip.odds).toFixed(2)}</span>
              </div>

              <div className="border-start border-secondary border-opacity-25 ps-4">
                <span
                  className="text-secondary small text-uppercase font-space-grotesk fw-bold d-block mb-1"
                  style={{ fontSize: "12px", letterSpacing: "0.05em", color: "#94a3b8" }}
                >
                  CONFIDENCE
                </span>
                <span
                  className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold"
                  style={{
                    fontSize: "12px",
                    background:
                      tip.confidenceLevel === "High"
                        ? "rgba(34, 197, 94, 0.2)"
                        : tip.confidenceLevel === "Medium"
                        ? "rgba(245, 158, 11, 0.2)"
                        : "rgba(148, 163, 184, 0.2)",
                    color:
                      tip.confidenceLevel === "High"
                        ? "#4ade80"
                        : tip.confidenceLevel === "Medium"
                        ? "#fbbf24"
                        : "#cbd5e1",
                    border:
                      tip.confidenceLevel === "High"
                        ? "1px solid rgba(34, 197, 94, 0.35)"
                        : "1px solid rgba(245, 158, 11, 0.35)",
                  }}
                >
                  {tip.confidenceLevel} Confidence
                </span>
              </div>
            </div>

            {/* Views Count */}
            <div className="d-flex align-items-center gap-2">
              <div className="badge rounded-pill px-3 py-2 font-space-grotesk d-flex align-items-center gap-2" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", fontSize: "13px", color: "#cbd5e1" }}>
                <i className="bi bi-eye text-secondary"></i>
                <span className="text-light">{tip.viewsCount || 1} Views</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Main Analysis + Tipster Info Sidebar */}
        <div className="row g-4">
          {/* Main Column: Analysis / Locked Content */}
          <div className="col-lg-8">
            {/* Overview / Preview Summary */}
            <div
              className="rounded-4 p-4 mb-4"
              style={{
                background: "var(--bg-card, #0e1520)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <h5 className="fw-bold text-white font-space-grotesk mb-3 d-flex align-items-center gap-2" style={{ fontSize: "16px" }}>
                <i className="bi bi-info-circle-fill text-success"></i>
                <span>Match Preview & Summary</span>
              </h5>
              <p className="text-light lh-lg mb-0" style={{ fontSize: "15px", color: "#e2e8f0" }}>
                {tip.predictionDescription}
              </p>
            </div>

            {/* UNLOCKED FULL ANALYSIS OR LOCKED PAYWALL */}
            {isUnlocked ? (
              <div
                className="rounded-4 p-4 position-relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(14, 21, 32, 0.95) 100%)",
                  border: "1px solid rgba(34, 197, 94, 0.35)",
                  boxShadow: "0 12px 35px rgba(34, 197, 94, 0.12)",
                }}
              >
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 pb-3 mb-3 border-bottom border-secondary border-opacity-20">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{
                        width: "36px",
                        height: "36px",
                        minWidth: "36px",
                        minHeight: "36px",
                        background: "rgba(34, 197, 94, 0.2)",
                        color: "#22c55e",
                        flexShrink: 0,
                      }}
                    >
                      <i className="bi bi-unlock-fill"></i>
                    </span>
                    <h5 className="fw-bold text-white font-space-grotesk mb-0" style={{ fontSize: "17px" }}>
                      Pro Handicapper Detailed Analysis
                    </h5>
                  </div>
                  <span
                    className="badge rounded-pill px-3 py-2 font-space-grotesk fw-bold text-nowrap"
                    style={{
                      background: "rgba(34, 197, 94, 0.2)",
                      color: "#4ade80",
                      border: "1px solid rgba(34, 197, 94, 0.4)",
                      fontSize: "12px",
                    }}
                  >
                    <i className="bi bi-check-circle-fill me-1"></i> FULL ACCESS UNLOCKED
                  </span>
                </div>

                {/* Analysis Content */}
                <div className="mb-4">
                  <div className="text-light lh-lg" style={{ fontSize: "15px", whiteSpace: "pre-line", color: "#f1f5f9" }}>
                    {tip.detailedAnalysis || tip.predictionDescription}
                  </div>
                </div>

                {/* Recommended Stake & Discipline Box */}
                <div
                  className="p-3 rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-3"
                  style={{
                    background: "rgba(34, 197, 94, 0.08)",
                    border: "1px solid rgba(34, 197, 94, 0.25)",
                  }}
                >
                  <div>
                    <span
                      className="text-secondary small font-space-grotesk fw-bold d-block text-uppercase mb-1"
                      style={{ fontSize: "11px", letterSpacing: "0.05em", color: "#94a3b8" }}
                    >
                      RECOMMENDED STAKE ALLOCATION
                    </span>
                    <span className="text-white fw-bold font-space-grotesk" style={{ fontSize: "15px" }}>
                      2.5 - 3.0 Units (3% Bankroll Max)
                    </span>
                  </div>
                  <div className="text-success small font-space-grotesk d-flex align-items-center gap-2 fw-semibold">
                    <i className="bi bi-shield-lock-fill"></i>
                    <span>Verified Prediction Source</span>
                  </div>
                </div>
              </div>
            ) : (
              /* LOCKED PAYWALL BANNER */
              <div
                className="rounded-4 p-4 p-md-5 text-center position-relative overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, #120e17 0%, #0c0812 100%)",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  boxShadow: "0 20px 50px rgba(239, 68, 68, 0.15)",
                }}
              >
                {/* Lock Icon */}
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
                  style={{
                    width: "68px",
                    height: "68px",
                    background: "rgba(239, 68, 68, 0.18)",
                    border: "2px solid rgba(239, 68, 68, 0.4)",
                    color: "#f87171",
                    fontSize: "28px",
                    boxShadow: "0 0 25px rgba(239, 68, 68, 0.3)",
                  }}
                >
                  <i className="bi bi-lock-fill"></i>
                </div>

                <h3 className="fw-black font-space-grotesk text-white text-uppercase mb-2" style={{ fontSize: "22px" }}>
                  Premium Tip Locked
                </h3>
                <p className="text-secondary mx-auto mb-4" style={{ maxWidth: "520px", fontSize: "14px" }}>
                  Unlock this exclusive high-confidence prediction by {tip.tipster.displayName} to view the complete mathematical model, tactical edges, and recommended bankroll stake.
                </p>

                {/* Sneak Peak snippet with blurred background */}
                <div
                  className="p-3 rounded-3 text-start mx-auto mb-4 position-relative"
                  style={{
                    background: "#08060b",
                    border: "1px dashed rgba(239, 68, 68, 0.3)",
                    maxWidth: "540px",
                  }}
                >
                  <div className="text-secondary small font-space-grotesk fw-bold mb-1 text-uppercase" style={{ fontSize: "12px", color: "#94a3b8" }}>
                    PRO ANALYSIS PREVIEW:
                  </div>
                  <div className="text-light small lh-base" style={{ opacity: 0.85, fontSize: "14px" }}>
                    {tip.analysisSnippet || tip.predictionDescription}
                  </div>
                  <div
                    className="position-absolute bottom-0 start-0 w-100 h-50 rounded-bottom"
                    style={{
                      background: "linear-gradient(to bottom, transparent, #08060b 90%)",
                    }}
                  ></div>
                </div>

                {/* Unlock CTA Button */}
                <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                  <button
                    onClick={() => setCheckoutModalOpen(true)}
                    className="btn btn-danger btn-lg rounded-pill px-5 py-3 font-space-grotesk fw-bold text-uppercase shadow d-flex align-items-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      border: "none",
                      fontSize: "15px",
                      letterSpacing: "0.03em",
                      boxShadow: "0 6px 20px rgba(239, 68, 68, 0.45)",
                    }}
                  >
                    <i className="bi bi-stripe"></i>
                    <span>Unlock with Stripe for ${tip.premiumPrice || "4.99"} USD</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>

                  <span className="text-secondary small" style={{ fontSize: "12px" }}>
                    <i className="bi bi-shield-check text-success me-1"></i>
                    Instant access upon payment • Secure 256-bit encrypted checkout
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Tipster Profile & Track Record */}
          <div className="col-lg-4">
            <div
              className="rounded-4 p-4 position-sticky"
              style={{
                background: "var(--bg-card, #0e1520)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                top: "24px",
              }}
            >
              <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom border-secondary border-opacity-20">
                <i className="bi bi-person-badge-fill text-success" style={{ fontSize: "18px" }}></i>
                <h5 className="fw-bold text-white font-space-grotesk mb-0" style={{ fontSize: "16px" }}>
                  Tipster Profile
                </h5>
              </div>

              {/* Tipster Avatar & Info */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="position-relative flex-shrink-0">
                  <img
                    src={tip.tipster.avatarUrl || "/assets/imgs/players/Erling-Haaland.jpg"}
                    alt={tip.tipster.displayName}
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #22c55e",
                      display: "block",
                    }}
                  />
                  {tip.tipster.isVerified && (
                    <span
                      className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center bg-success text-white"
                      style={{
                        width: "18px",
                        height: "18px",
                        border: "2px solid #070b12",
                        fontSize: "10px",
                        transform: "translate(15%, 15%)",
                      }}
                    >
                      <i className="bi bi-check"></i>
                    </span>
                  )}
                </div>

                <div className="overflow-hidden">
                  <h6 className="fw-bold text-white mb-0 font-space-grotesk text-truncate" style={{ fontSize: "16px" }}>
                    {tip.tipster.displayName}
                  </h6>
                  <span className="text-secondary small d-block mb-1">@{tip.tipster.username}</span>
                  <div className="d-flex align-items-center gap-1 text-warning small font-space-grotesk fw-bold">
                    <i className="bi bi-star-fill"></i>
                    <span>{tip.tipster.rating || 4.9}</span>
                    <span className="text-secondary fw-normal">/ 5.0</span>
                  </div>
                </div>
              </div>

              {/* Performance Stats Cards */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <div className="p-3 rounded-3 text-center" style={{ background: "#060a10", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span
                      className="text-secondary small text-uppercase font-space-grotesk fw-bold d-block mb-1"
                      style={{ fontSize: "11px", color: "#94a3b8" }}
                    >
                      WIN RATE
                    </span>
                    <span className="text-success fw-black font-space-grotesk fs-5">{tip.tipster.winRate || 78.4}%</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-3 text-center" style={{ background: "#060a10", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span
                      className="text-secondary small text-uppercase font-space-grotesk fw-bold d-block mb-1"
                      style={{ fontSize: "11px", color: "#94a3b8" }}
                    >
                      STATUS
                    </span>
                    <span className="text-info fw-bold font-space-grotesk" style={{ fontSize: "14px" }}>Verified Pro</span>
                  </div>
                </div>
              </div>

              {/* Follow Button */}
              <button
                type="button"
                onClick={() => setIsFollowing(!isFollowing)}
                className={`btn w-100 rounded-pill font-space-grotesk fw-bold py-2 mb-3 transition-all ${
                  isFollowing ? "btn-outline-success" : "tipster-btn-primary"
                }`}
                style={{ fontSize: "13.5px" }}
              >
                {isFollowing ? (
                  <>
                    <i className="bi bi-check2 me-1"></i> Following Tipster
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-lg me-1"></i> Follow Tipster
                  </>
                )}
              </button>

              {/* Back to Profile Link */}
              <Link
                href={`/tipsters/${tip.tipster.id}`}
                className="text-secondary small text-decoration-none d-flex align-items-center justify-content-center gap-1 hover-text-success text-center"
                style={{ color: "#94a3b8" }}
              >
                <span>View Full Tipster Track Record</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Checkout Modal Simulation */}
      {checkoutModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            background: "rgba(4, 7, 12, 0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 9999,
          }}
        >
          <div
            className="rounded-4 p-4 shadow-lg position-relative"
            style={{
              background: "#0e1520",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8)",
              maxWidth: "480px",
              width: "100%",
            }}
          >
            {/* Modal Header */}
            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-secondary border-opacity-20">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "rgba(239, 68, 68, 0.15)",
                    color: "#f87171",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    fontSize: "16px",
                  }}
                >
                  <i className="bi bi-stripe"></i>
                </span>
                <div>
                  <h5 className="fw-bold font-space-grotesk text-white mb-0" style={{ fontSize: "16px" }}>
                    Unlock Premium Prediction
                  </h5>
                  <span className="text-secondary small" style={{ fontSize: "12px" }}>
                    Stripe 1-Click Secure Payment
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="btn btn-sm text-secondary hover-text-white p-1"
                style={{ background: "transparent", border: "none" }}
              >
                <i className="bi bi-x-lg" style={{ fontSize: "15px" }}></i>
              </button>
            </div>

            {/* Payment Feedback */}
            {paymentSuccess ? (
              <div className="text-center py-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "60px", height: "60px", background: "rgba(34, 197, 94, 0.2)", color: "#22c55e", fontSize: "28px" }}
                >
                  <i className="bi bi-check-lg fw-bold"></i>
                </div>
                <h5 className="fw-bold font-space-grotesk text-white mb-1">Payment Successful!</h5>
                <p className="text-secondary small mb-0">Premium prediction unlocked. Loading full analysis...</p>
              </div>
            ) : (
              <form onSubmit={handleProcessStripePayment}>
                {/* Order Summary */}
                <div
                  className="p-3 rounded-3 mb-3"
                  style={{
                    background: "#060a10",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                    <span className="text-white fw-bold font-space-grotesk small text-truncate" style={{ maxWidth: "260px" }}>
                      {tip.predictionTitle}
                    </span>
                    <span className="text-danger fw-black font-space-grotesk fs-12">
                      ${tip.premiumPrice || "4.99"} USD
                    </span>
                  </div>
                  <div className="text-secondary small" style={{ fontSize: "12px" }}>
                    Tipster: <span className="text-light">{tip.tipster.displayName}</span> • Odds: <span className="text-success fw-bold">{Number(tip.odds).toFixed(2)}</span>
                  </div>
                </div>

                {/* Mock Card Form */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold mb-1 font-space-grotesk text-uppercase" style={{ fontSize: "11px" }}>
                    CARDHOLDER NAME
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="form-control tipster-input"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold mb-1 font-space-grotesk text-uppercase" style={{ fontSize: "11px" }}>
                    CARD NUMBER
                  </label>
                  <div
                    className="d-flex align-items-center rounded-3 px-3"
                    style={{ background: "#090e17", border: "1px solid rgba(255,255,255,0.12)", height: "44px" }}
                  >
                    <i className="bi bi-credit-card text-secondary me-2"></i>
                    <input
                      type="text"
                      defaultValue="•••• •••• •••• 4242"
                      className="form-control bg-transparent text-white border-0 shadow-none p-0"
                      style={{ fontSize: "14px", height: "100%" }}
                      readOnly
                    />
                    <span className="badge bg-secondary bg-opacity-25 text-light font-space-grotesk" style={{ fontSize: "10px" }}>
                      TEST CARD
                    </span>
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label text-secondary small fw-bold mb-1 font-space-grotesk text-uppercase" style={{ fontSize: "11px" }}>
                      EXPIRY
                    </label>
                    <input type="text" defaultValue="12/28" className="form-control tipster-input text-center" readOnly />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-secondary small fw-bold mb-1 font-space-grotesk text-uppercase" style={{ fontSize: "11px" }}>
                      CVC
                    </label>
                    <input type="password" defaultValue="123" className="form-control tipster-input text-center" readOnly />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="btn btn-danger w-100 py-3 rounded-pill font-space-grotesk fw-bold text-uppercase shadow d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: "#ef4444",
                    border: "none",
                    fontSize: "14.5px",
                    boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)",
                  }}
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Processing Stripe Charge...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lock-fill"></i>
                      <span>Pay ${tip.premiumPrice || "4.99"} & Unlock Now</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
