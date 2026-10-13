"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SportType, Tip, TipsterProfile } from "@/types/tipster";
import {
  getStoredTipster,
  getStoredTips,
  deleteTipById,
  INITIAL_TIPSTERS,
  useIsMounted,
} from "@/lib/tipster-store";

const SPORT_COLORS: Record<SportType, { bg: string; text: string; border: string }> = {
  Cricket: { bg: "rgba(34, 197, 94, 0.15)", text: "#4ade80", border: "rgba(34, 197, 94, 0.35)" },
  Football: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.35)" },
  NFL: { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.35)" },
  AFL: { bg: "rgba(236, 72, 153, 0.15)", text: "#f472b6", border: "rgba(236, 72, 153, 0.35)" },
};

export default function TipsterDashboardPage() {
  const router = useRouter();
  const mounted = useIsMounted();

  const [tipster, setTipster] = useState<TipsterProfile>(() => {
    return getStoredTipster() || INITIAL_TIPSTERS[0];
  });
  const [tips, setTips] = useState<Tip[]>(() => getStoredTips());
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft" | "free" | "premium">("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const currentTipsterId = tipster?.id || "tipster-1";

  // Filter tips belonging to this tipster (or all if demo)
  const tipsterTips = tips.filter(
    (t) => t.tipsterId === currentTipsterId || t.tipster?.username === tipster?.username
  );

  const activeTipsList = tipsterTips.length > 0 ? tipsterTips : tips;

  const displayedTips = activeTipsList.filter((t) => {
    if (activeTab === "all") return true;
    if (activeTab === "published") return t.status === "Published";
    if (activeTab === "draft") return t.status === "Draft";
    if (activeTab === "free") return t.visibility === "Free";
    if (activeTab === "premium") return t.visibility === "Premium";
    return true;
  });

  const handleDeleteTip = (tipId: string) => {
    const updated = deleteTipById(tipId);
    setTips(updated);
    setDeleteConfirmId(null);
  };

  if (!mounted || !tipster) {
    return (
      <main className="font-outfit text-white py-5" style={{ background: "var(--bg-dark, #070b12)" }}>
        <div className="container custom-container text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading Dashboard...</span>
          </div>
        </div>
      </main>
    );
  }

  const isSubscriptionActive = tipster.subscriptionStatus === "active";
  const totalTipsCount = activeTipsList.length || tipster.stats.totalTips;
  const freeTipsCount = activeTipsList.filter((t) => t.visibility === "Free").length;
  const premiumTipsCount = activeTipsList.filter((t) => t.visibility === "Premium").length;
  const totalUnlocksCount = activeTipsList.reduce((acc, t) => acc + (t.unlockedCount || 0), 126);
  const estimatedRevenue = (totalUnlocksCount * 5.99).toFixed(2);

  return (
    <main className="font-outfit text-white py-4 py-lg-5" style={{ background: "var(--bg-dark, #070b12)" }}>
      <div className="container custom-container">
        {/* Top Profile Header Card */}
        <div
          className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 65% 75% at 90% 15%, rgba(34, 197, 94, 0.18), rgba(7, 11, 18, 0) 70%), linear-gradient(135deg, #0e1722 0%, #070b12 100%)",
            border: "1px solid rgba(34, 197, 94, 0.35)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
          }}
        >
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <div className="d-flex align-items-start gap-3 gap-md-4">
                <div className="position-relative flex-shrink-0">
                  <img
                    src={
                      tipster.avatarUrl && tipster.avatarUrl.startsWith("/assets")
                        ? tipster.avatarUrl
                        : "/assets/imgs/players/Erling-Haaland.jpg"
                    }
                    onError={(e) => {
                      e.currentTarget.src = "/assets/imgs/players/Erling-Haaland.jpg";
                    }}
                    alt={tipster.displayName}
                    className="rounded-circle"
                    style={{
                      width: "74px",
                      height: "74px",
                      objectFit: "cover",
                      border: "3px solid #22c55e",
                      boxShadow: "0 0 20px rgba(34, 197, 94, 0.45)",
                    }}
                  />
                  <span
                    className="position-absolute bottom-0 end-0 rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                    style={{ width: "22px", height: "22px", border: "2px solid #070b12", fontSize: "11px" }}
                    title="Verified Pro Tipster"
                  >
                    <i className="bi bi-patch-check-fill"></i>
                  </span>
                </div>

                <div className="min-w-0 flex-grow-1">
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                    <h2
                      className="fw-black text-white font-space-grotesk text-uppercase mb-0 text-truncate"
                      style={{ fontSize: "clamp(1.4rem, 3vw, 1.85rem)" }}
                    >
                      {tipster.displayName}
                    </h2>
                    <span className="text-secondary small font-monospace">(@{tipster.username})</span>

                    <span
                      className="badge rounded-pill font-space-grotesk fw-bold d-inline-flex align-items-center"
                      style={{
                        padding: "5px 12px",
                        gap: "6px",
                        fontSize: "11px",
                        background: isSubscriptionActive ? "rgba(34, 197, 94, 0.16)" : "rgba(234, 179, 8, 0.16)",
                        color: isSubscriptionActive ? "#4ade80" : "#facc15",
                        border: isSubscriptionActive
                          ? "1px solid rgba(34, 197, 94, 0.4)"
                          : "1px solid rgba(234, 179, 8, 0.4)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      <i className={`bi ${isSubscriptionActive ? "bi-check-circle-fill" : "bi-hourglass-split"}`}></i>
                      <span>{isSubscriptionActive ? "ACTIVE TIPSTER" : "PENDING ACTIVATION"}</span>
                    </span>
                  </div>

                  <p
                    className="text-secondary mb-2 small"
                    style={{
                      maxWidth: "580px",
                      lineHeight: "1.6",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {tipster.shortBio || "Sports handicapper & statistical match analyst on SportsVerge."}
                  </p>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {tipster.preferredSports.map((sp) => {
                      const colorObj = SPORT_COLORS[sp] || SPORT_COLORS.Football;
                      return (
                        <span
                          key={sp}
                          className="badge rounded-pill px-3 py-1 font-space-grotesk"
                          style={{
                            fontSize: "11px",
                            background: colorObj.bg,
                            color: colorObj.text,
                            border: `1px solid ${colorObj.border}`,
                          }}
                        >
                          {sp}
                        </span>
                      );
                    })}
                    <span className="text-secondary small ms-2">
                      <i className="bi bi-clock-history me-1 text-success"></i>
                      {tipster.yearsOfExperience}+ Years Experience
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 text-lg-end">
              <div className="d-flex gap-2 flex-column justify-content-lg-end" style={{ minWidth: "220px" }}>
                <Link
                  href="/tipster/create-tip"
                  className="tipster-btn-primary px-4 py-2 rounded-pill text-nowrap"
                  style={{ fontSize: "14px" }}
                >
                  <i className="bi bi-plus-circle-fill"></i>
                  <span>Create Free or Paid Tip</span>
                </Link>

                <Link
                  href="/tipster/profile"
                  className="tipster-btn-outline px-4 py-2 rounded-pill text-nowrap"
                  style={{ fontSize: "13px" }}
                >
                  <i className="bi bi-person-gear"></i>
                  <span>Edit My Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Inactive Subscription Warning */}
        {!isSubscriptionActive && (
          <div className="alert alert-warning bg-warning bg-opacity-10 border-warning border-opacity-30 text-warning rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill fs-5 text-warning"></i>
              <div>
                <strong>Subscription Pending:</strong> Complete your subscription checkout to authorize publishing tips to all users.
              </div>
            </div>
            <Link href="/tipster-subscription" className="btn btn-warning btn-sm rounded-pill fw-bold text-dark px-4 py-2 font-space-grotesk">
              Activate Subscription Now
            </Link>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="d-flex align-items-center gap-2 border-bottom border-secondary border-opacity-20 pb-3 mb-4 overflow-x-auto">
          <Link
            href="/tipster/dashboard"
            className="tipster-btn-primary rounded-pill text-nowrap"
          >
            <i className="bi bi-speedometer2"></i>
            <span>Dashboard Overview</span>
          </Link>
          <Link
            href="/tipster/my-tips"
            className="tipster-btn-outline rounded-pill text-nowrap"
          >
            <i className="bi bi-card-checklist text-success"></i>
            <span>My Tips ({totalTipsCount})</span>
          </Link>
          <Link
            href="/tipster/create-tip"
            className="tipster-btn-outline rounded-pill text-nowrap"
          >
            <i className="bi bi-plus-circle text-success"></i>
            <span>Create Tip</span>
          </Link>
          <Link
            href="/tipster/profile"
            className="tipster-btn-outline rounded-pill text-nowrap"
          >
            <i className="bi bi-person-circle text-success"></i>
            <span>My Profile</span>
          </Link>
          <Link
            href="/tips"
            className="tipster-btn-outline rounded-pill text-nowrap ms-auto"
            style={{ borderColor: "rgba(34, 197, 94, 0.35)", color: "#4ade80" }}
          >
            <i className="bi bi-box-arrow-up-right text-success"></i>
            <span>View Public Tips Feed</span>
          </Link>
        </div>

        {/* 4 Performance Statistics Grid */}
        <div className="row g-3 mb-4">
          {/* Stat 1: Total Tips */}
          <div className="col-sm-6 col-lg-3">
            <div
              className="rounded-4 p-4 h-100 position-relative"
              style={{
                background: "var(--bg-card, #0e1520)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                  Total Tips
                </span>
                <span
                  className="rounded-2 d-flex align-items-center justify-content-center p-2"
                  style={{ width: "32px", height: "32px", background: "rgba(34, 197, 94, 0.12)", color: "#22c55e" }}
                >
                  <i className="bi bi-file-earmark-text-fill"></i>
                </span>
              </div>
              <div className="display-6 fw-black text-white font-space-grotesk mb-1">{totalTipsCount}</div>
              <div className="d-flex align-items-center gap-2 text-secondary small">
                <span className="text-success fw-semibold">{freeTipsCount} Free</span>
                <span>•</span>
                <span className="text-warning fw-semibold">{premiumTipsCount} Premium</span>
              </div>
            </div>
          </div>

          {/* Stat 2: Win Rate */}
          <div className="col-sm-6 col-lg-3">
            <div
              className="rounded-4 p-4 h-100 position-relative"
              style={{
                background: "var(--bg-card, #0e1520)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                  Win Rate
                </span>
                <span
                  className="rounded-2 d-flex align-items-center justify-content-center p-2"
                  style={{ width: "32px", height: "32px", background: "rgba(34, 197, 94, 0.12)", color: "#22c55e" }}
                >
                  <i className="bi bi-trophy-fill"></i>
                </span>
              </div>
              <div className="display-6 fw-black text-success font-space-grotesk mb-1">
                {tipster.stats?.winRate || 78.4}%
              </div>
              <div className="text-secondary small">
                <i className="bi bi-graph-up-arrow text-success me-1"></i>
                Verified track record
              </div>
            </div>
          </div>

          {/* Stat 3: Followers */}
          <div className="col-sm-6 col-lg-3">
            <div
              className="rounded-4 p-4 h-100 position-relative"
              style={{
                background: "var(--bg-card, #0e1520)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                  Followers
                </span>
                <span
                  className="rounded-2 d-flex align-items-center justify-content-center p-2"
                  style={{ width: "32px", height: "32px", background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}
                >
                  <i className="bi bi-people-fill"></i>
                </span>
              </div>
              <div className="display-6 fw-black text-white font-space-grotesk mb-1">
                {(tipster.stats?.followersCount || 3420).toLocaleString()}
              </div>
              <div className="text-secondary small">
                <i className="bi bi-bell-fill text-primary me-1"></i>
                Active subscriber base
              </div>
            </div>
          </div>

          {/* Stat 4: ROI / Profit Units */}
          <div className="col-sm-6 col-lg-3">
            <div
              className="rounded-4 p-4 h-100 position-relative"
              style={{
                background: "var(--bg-card, #0e1520)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                  ROI Yield
                </span>
                <span
                  className="rounded-2 d-flex align-items-center justify-content-center p-2"
                  style={{ width: "32px", height: "32px", background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}
                >
                  <i className="bi bi-lightning-charge-fill"></i>
                </span>
              </div>
              <div className="display-6 fw-black text-warning font-space-grotesk mb-1">
                +{tipster.stats?.profitUnits || 46.5}u
              </div>
              <div className="text-secondary small">
                Yield: <span className="text-white fw-bold">{tipster.stats?.roi || 24.8}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription & Earnings Section */}
        <div className="row g-4 mb-4">
          {/* Subscription Status Details Card */}
          <div className="col-lg-6">
            <div
              className="rounded-4 p-4 h-100"
              style={{
                background: "var(--bg-card, #0e1520)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-secondary border-opacity-20">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-credit-card-fill text-success" style={{ fontSize: "18px" }}></i>
                  <h5 className="fw-bold text-white font-space-grotesk mb-0" style={{ fontSize: "16px" }}>
                    Subscription Status
                  </h5>
                </div>
                <span
                  className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold"
                  style={{
                    fontSize: "11px",
                    background: isSubscriptionActive ? "rgba(34, 197, 94, 0.16)" : "rgba(234, 179, 8, 0.16)",
                    color: isSubscriptionActive ? "#4ade80" : "#facc15",
                    border: isSubscriptionActive
                      ? "1px solid rgba(34, 197, 94, 0.4)"
                      : "1px solid rgba(234, 179, 8, 0.4)",
                  }}
                >
                  {isSubscriptionActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center text-secondary small">
                  <span>Current Membership:</span>
                  <span className="badge bg-dark border border-secondary border-opacity-30 text-white font-space-grotesk text-uppercase px-3 py-1">
                    {tipster.subscriptionPlan || "Quarterly"} Plan
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center text-secondary small">
                  <span>Payment Gateway:</span>
                  <span className="text-white d-flex align-items-center gap-2 fw-semibold">
                    <i className="bi bi-credit-card-2-front-fill text-info fs-6"></i> Stripe Secure Recurring
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center text-secondary small">
                  <span>Next Renewal Date:</span>
                  <span className="text-white fw-semibold">
                    {tipster.subscriptionExpiresAt
                      ? new Date(tipster.subscriptionExpiresAt).toLocaleDateString()
                      : "2027-04-01"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-2">
                <Link
                  href="/tipster-subscription"
                  className="tipster-btn-outline-card rounded-pill w-100 py-2 text-center"
                  style={{ fontSize: "13px" }}
                >
                  Manage / Change Subscription Plan
                </Link>
              </div>
            </div>
          </div>

          {/* Earnings (Future Enhancement Preview) */}
          <div className="col-lg-6">
            <div
              className="rounded-4 p-4 h-100 position-relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(14, 21, 32, 0.95) 100%)",
                border: "1px solid rgba(34, 197, 94, 0.25)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-secondary border-opacity-20">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-cash-stack text-success" style={{ fontSize: "18px" }}></i>
                  <h5 className="fw-bold text-white font-space-grotesk mb-0" style={{ fontSize: "16px" }}>
                    Tipster Earnings
                  </h5>
                </div>
                <span
                  className="badge rounded-pill px-3 py-1 font-space-grotesk"
                  style={{
                    fontSize: "10px",
                    background: "rgba(6, 182, 212, 0.15)",
                    color: "#22d3ee",
                    border: "1px solid rgba(6, 182, 212, 0.35)",
                  }}
                >
                  Future Enhancement
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-baseline mb-2">
                <div>
                  <span className="text-secondary small">Estimated Unlocked Revenue:</span>
                  <div className="display-6 fw-black text-white font-space-grotesk mt-1">${estimatedRevenue}</div>
                </div>
                <div className="text-end">
                  <span className="text-secondary small">Total Unlocks:</span>
                  <div className="fs-5 fw-bold text-success font-space-grotesk">{totalUnlocksCount} purchases</div>
                </div>
              </div>

              <p className="text-secondary small mb-0 mt-3 pt-2 border-top border-secondary border-opacity-15" style={{ lineHeight: "1.5" }}>
                <i className="bi bi-info-circle text-info me-1"></i>
                Direct creator bank payouts, split revenue analytics, and automated Stripe Connect disbursements will be enabled in the upcoming monetization rollout.
              </p>
            </div>
          </div>
        </div>

        {/* My Tips Management Section */}
        <div
          className="rounded-4 p-4 p-md-5"
          style={{
            background: "var(--bg-card, #0e1520)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        >
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-20">
            <div>
              <h4 className="fw-bold text-white font-space-grotesk mb-1" style={{ fontSize: "18px" }}>
                My Published & Draft Predictions
              </h4>
              <p className="text-secondary small mb-0">Manage, edit, or remove your sports tips.</p>
            </div>

            {/* Filter Pills */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {(["all", "published", "draft", "free", "premium"] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className="btn btn-sm rounded-pill font-space-grotesk text-capitalize transition-all"
                    style={{
                      fontSize: "12px",
                      padding: "6px 14px",
                      fontWeight: isActive ? "700" : "500",
                      background: isActive ? "var(--accent-green, #22c55e)" : "rgba(255, 255, 255, 0.05)",
                      color: isActive ? "#ffffff" : "#94a3b8",
                      border: isActive ? "1px solid #22c55e" : "1px solid rgba(255, 255, 255, 0.12)",
                      boxShadow: isActive ? "0 2px 10px rgba(34, 197, 94, 0.3)" : "none",
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tips List */}
          {displayedTips.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "64px", height: "64px", background: "rgba(255,255,255,0.04)", color: "#64748b", fontSize: "28px" }}
              >
                <i className="bi bi-file-earmark-plus"></i>
              </div>
              <h5 className="fw-bold text-white font-space-grotesk mb-1">No tips found in this category</h5>
              <p className="text-secondary small mb-4">Start sharing your sports analysis with the SportsVerge audience.</p>
              <Link
                href="/tipster/create-tip"
                className="btn btn-success fw-bold rounded-pill px-4 py-2 font-space-grotesk"
                style={{ background: "#22c55e", border: "none" }}
              >
                + Create Your First Tip
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {displayedTips.map((tip) => {
                const sportColor = SPORT_COLORS[tip.sport] || SPORT_COLORS.Football;

                // Status styling helper
                const getStatusStyle = (status: string) => {
                  switch (status) {
                    case "Published":
                      return {
                        background: "rgba(34, 197, 94, 0.16)",
                        color: "#4ade80",
                        border: "1px solid rgba(34, 197, 94, 0.4)",
                      };
                    case "Draft":
                      return {
                        background: "rgba(148, 163, 184, 0.15)",
                        color: "#cbd5e1",
                        border: "1px solid rgba(148, 163, 184, 0.35)",
                      };
                    case "Scheduled":
                      return {
                        background: "rgba(56, 189, 248, 0.16)",
                        color: "#38bdf8",
                        border: "1px solid rgba(56, 189, 248, 0.35)",
                      };
                    default:
                      return {
                        background: "rgba(148, 163, 184, 0.15)",
                        color: "#cbd5e1",
                        border: "1px solid rgba(148, 163, 184, 0.35)",
                      };
                  }
                };

                const statusStyle = getStatusStyle(tip.status);

                return (
                  <div
                    key={tip.id}
                    className="rounded-4 p-4 transition-all"
                    style={{
                      background: "rgba(7, 11, 18, 0.75)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <div className="row align-items-center g-3">
                       <div className="col-lg-7">
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
                            {tip.sport}
                          </span>

                          <span
                            className="badge bg-dark border border-secondary border-opacity-30 text-light px-3 py-1 font-space-grotesk"
                            style={{ fontSize: "11px" }}
                          >
                            {tip.competition}
                          </span>

                          {tip.visibility === "Premium" ? (
                            <span
                              className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold"
                              style={{
                                fontSize: "11px",
                                background: "rgba(239, 68, 68, 0.18)",
                                color: "#f87171",
                                border: "1px solid rgba(239, 68, 68, 0.35)",
                              }}
                            >
                              <i className="bi bi-lock-fill me-1"></i> PREMIUM (${tip.premiumPrice || "4.99"})
                            </span>
                          ) : (
                            <span
                              className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold"
                              style={{
                                fontSize: "11px",
                                background: "rgba(59, 130, 246, 0.18)",
                                color: "#60a5fa",
                                border: "1px solid rgba(59, 130, 246, 0.35)",
                              }}
                            >
                              FREE TIP
                            </span>
                          )}

                          <span
                            className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold"
                            style={{
                              fontSize: "11px",
                              background: statusStyle.background,
                              color: statusStyle.color,
                              border: statusStyle.border,
                            }}
                          >
                            {tip.status}
                          </span>
                        </div>

                        <h5 className="fw-bold text-white mb-2 font-space-grotesk" style={{ fontSize: "16px" }}>
                          {tip.predictionTitle}
                        </h5>
                        <div className="text-secondary small mb-2">
                          <span className="text-white fw-bold">{tip.match}</span> • Kickoff: {tip.matchDate} ({tip.kickoffTime})
                        </div>
                        <p className="text-secondary small mb-0 lh-base" style={{ maxWidth: "640px" }}>
                          {tip.predictionDescription}
                        </p>

                        {tip.status === "Scheduled" && tip.scheduledPublishAt && (
                          <div
                            className="mt-2 px-3 py-1 rounded-3 d-inline-flex align-items-center gap-2"
                            style={{
                              background: "rgba(56, 189, 248, 0.12)",
                              border: "1px solid rgba(56, 189, 248, 0.25)",
                              color: "#38bdf8",
                              fontSize: "12px",
                            }}
                          >
                            <i className="bi bi-clock-history"></i>
                            <span>
                              Auto-publish: <strong>{new Date(tip.scheduledPublishAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</strong>
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="col-lg-2 text-lg-center">
                        <div
                          className="p-3 rounded-3"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          <div className="text-secondary small text-uppercase fw-bold" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>
                            ODDS
                          </div>
                          <div className="fw-black text-white font-space-grotesk fs-4">{tip.odds}</div>
                          <div className="text-secondary" style={{ fontSize: "11px" }}>{tip.predictionCategory}</div>
                        </div>
                      </div>

                      <div className="col-lg-3 text-lg-end">
                        <div className="d-flex align-items-center justify-content-lg-end gap-2 flex-wrap">
                          <Link
                            href={`/tips/${tip.id}`}
                            className="btn btn-sm rounded-3 px-3 py-1 fw-semibold d-inline-flex align-items-center"
                            style={{
                              fontSize: "12px",
                              gap: "6px",
                              background: "rgba(255, 255, 255, 0.05)",
                              color: "#e2e8f0",
                              border: "1px solid rgba(255, 255, 255, 0.15)",
                            }}
                          >
                            <i className="bi bi-eye text-secondary"></i>
                            <span>View</span>
                          </Link>
                          <Link
                            href={`/tipster/edit-tip/${tip.id}`}
                            className="btn btn-sm rounded-3 px-3 py-1 fw-semibold d-inline-flex align-items-center"
                            style={{
                              fontSize: "12px",
                              gap: "6px",
                              background: "rgba(34, 197, 94, 0.1)",
                              color: "#4ade80",
                              border: "1px solid rgba(34, 197, 94, 0.35)",
                            }}
                          >
                            <i className="bi bi-pencil-square"></i>
                            <span>Edit</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(tip.id)}
                            className="btn btn-sm rounded-3 d-inline-flex align-items-center justify-content-center"
                            title="Delete Tip"
                            style={{
                              width: "32px",
                              height: "32px",
                              fontSize: "13px",
                              background: "rgba(239, 68, 68, 0.1)",
                              color: "#f87171",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                            }}
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>

                        <div className="d-flex align-items-center justify-content-lg-end gap-3 text-secondary small mt-3">
                          <span><i className="bi bi-heart text-danger me-1"></i>{tip.likesCount}</span>
                          <span><i className="bi bi-eye me-1"></i>{tip.viewsCount}</span>
                          {tip.visibility === "Premium" && (
                            <span className="text-success fw-semibold">
                              <i className="bi bi-unlock-fill me-1"></i>{tip.unlockedCount || 0} Unlocks
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete Confirmation Modal */}
                    {deleteConfirmId === tip.id && (
                      <div className="mt-3 p-3 rounded-3 bg-danger bg-opacity-10 border border-danger border-opacity-30 d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <span className="text-danger small fw-semibold">
                          Are you sure you want to delete this tip permanently?
                        </span>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleDeleteTip(tip.id)}
                            className="btn btn-danger btn-sm rounded-pill px-3 py-1 fw-bold font-space-grotesk"
                            style={{ fontSize: "12px" }}
                          >
                            Confirm Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="tipster-btn-outline rounded-pill px-3 py-1"
                            style={{ fontSize: "12px" }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
