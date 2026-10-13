"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SportType, Tip, TipsterProfile, PurchasedTip } from "@/types/tipster";
import {
  getStoredTips,
  INITIAL_TIPSTERS,
  getStoredTipster,
  getPurchasedTips,
  addPurchasedTip,
  useIsMounted,
} from "@/lib/tipster-store";

const SPORT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Cricket: { bg: "rgba(34, 197, 94, 0.15)", text: "#4ade80", border: "rgba(34, 197, 94, 0.35)" },
  Football: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.35)" },
  NFL: { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.35)" },
  AFL: { bg: "rgba(236, 72, 153, 0.15)", text: "#f472b6", border: "rgba(236, 72, 153, 0.35)" },
};

export default function PublicTipsterProfilePage() {
  const params = useParams();
  const tipsterParam = (params?.id as string) || "";
  const mounted = useIsMounted();

  const [profile, setProfile] = useState<TipsterProfile | null>(() => {
    if (!tipsterParam) return null;
    const allTipsters = [...INITIAL_TIPSTERS];
    const loggedInTipster = getStoredTipster();
    if (loggedInTipster) {
      const exists = allTipsters.some(
        (t) => t.id === loggedInTipster.id || t.username === loggedInTipster.username
      );
      if (exists) {
        const idx = allTipsters.findIndex(
          (t) => t.id === loggedInTipster.id || t.username === loggedInTipster.username
        );
        allTipsters[idx] = loggedInTipster;
      } else {
        allTipsters.unshift(loggedInTipster);
      }
    }
    return (
      allTipsters.find(
        (t) =>
          t.id.toLowerCase() === tipsterParam.toLowerCase() ||
          t.username.toLowerCase() === tipsterParam.toLowerCase()
      ) || loggedInTipster || null
    );
  });

  const [tips, setTips] = useState<Tip[]>(() => {
    const allTips = getStoredTips();
    const allTipsters = [...INITIAL_TIPSTERS];
    const loggedInTipster = getStoredTipster();
    if (loggedInTipster) {
      const exists = allTipsters.some(
        (t) => t.id === loggedInTipster.id || t.username === loggedInTipster.username
      );
      if (!exists) allTipsters.unshift(loggedInTipster);
    }
    const target = allTipsters.find(
      (t) =>
        t.id.toLowerCase() === tipsterParam.toLowerCase() ||
        t.username.toLowerCase() === tipsterParam.toLowerCase()
    ) || loggedInTipster;

    return allTips.filter((tip) => {
      if (tip.status !== "Published") return false;
      if (target) {
        return (
          tip.tipsterId === target.id ||
          tip.tipster?.id === target.id ||
          tip.tipster?.username?.toLowerCase() === target.username?.toLowerCase()
        );
      }
      return false;
    });
  });

  const [activeTab, setActiveTab] = useState<"all" | "free" | "premium">("all");
  const [isFollowing, setIsFollowing] = useState(false);
  const [purchasedTipIds, setPurchasedTipIds] = useState<string[]>(() =>
    getPurchasedTips().map((p) => p.tipId)
  );

  // Stripe checkout modal simulation
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedTipForCheckout, setSelectedTipForCheckout] = useState<Tip | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardHolder, setCardHolder] = useState("Sports Enthusiast");

  const handleOpenStripeModal = (tip: Tip) => {
    setSelectedTipForCheckout(tip);
    setPaymentSuccess(false);
    setIsProcessingPayment(false);
    setCheckoutModalOpen(true);
  };

  const handleProcessStripePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTipForCheckout) return;

    setIsProcessingPayment(true);

    setTimeout(() => {
      const newPurchase: PurchasedTip = {
        id: `purchase-${Date.now()}`,
        tipId: selectedTipForCheckout.id,
        tip: selectedTipForCheckout,
        userId: "user-current-session",
        purchasePrice: selectedTipForCheckout.premiumPrice || 4.99,
        purchasedAt: new Date().toISOString(),
        paymentId: `pi_sim_${Date.now()}_secret`,
        status: "active",
      };

      addPurchasedTip(newPurchase);
      setPurchasedTipIds((prev) => [...prev, selectedTipForCheckout.id]);
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
    }, 1200);
  };

  if (!mounted) return null;

  if (!profile) {
    return (
      <main className="font-outfit text-white py-5 min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "var(--bg-dark, #070b12)" }}>
        <div className="text-center p-5 rounded-4" style={{ background: "var(--bg-card, #0e1520)", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "500px" }}>
          <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "64px", height: "64px", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", fontSize: "28px" }}>
            <i className="bi bi-person-x"></i>
          </div>
          <h3 className="fw-bold font-space-grotesk text-white mb-2">Tipster Not Found</h3>
          <p className="text-secondary small mb-4">
            The tipster profile you requested (<code className="text-light">{tipsterParam}</code>) does not exist or may have been deactivated.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Link href="/tips" className="tipster-btn-primary rounded-pill px-4 py-2">
              Browse All Tips & Tipsters
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const filteredTips = tips.filter((t) => {
    if (activeTab === "free") return t.visibility === "Free";
    if (activeTab === "premium") return t.visibility === "Premium";
    return true;
  });

  return (
    <main className="font-outfit text-white py-4 py-lg-5" style={{ background: "var(--bg-dark, #070b12)", minHeight: "100vh" }}>
      <div className="container custom-container" style={{ maxWidth: "1200px" }}>
        {/* Top Breadcrumb Navigation */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <Link href="/" className="text-secondary text-decoration-none small hover-text-success">
              Home
            </Link>
            <span className="text-secondary small">/</span>
            <Link href="/tips" className="text-secondary text-decoration-none small hover-text-success">
              Tips Marketplace
            </Link>
            <span className="text-secondary small">/</span>
            <span className="text-success small fw-semibold">{profile.displayName}</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              href="/tips"
              className="tipster-btn-outline px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2"
              style={{ fontSize: "12px" }}
            >
              <i className="bi bi-arrow-left"></i>
              <span>All Predictions</span>
            </Link>
          </div>
        </div>

        {/* Tipster Profile Header Card */}
        <div
          className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0e1724 0%, #070b12 100%)",
            border: "1px solid rgba(34, 197, 94, 0.35)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
          }}
        >
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <div className="d-flex align-items-start gap-3 gap-md-4 flex-wrap flex-sm-nowrap">
                {/* Large Avatar with Verified Badge */}
                <div className="position-relative flex-shrink-0">
                  <img
                    src={
                      profile.avatarUrl && profile.avatarUrl.startsWith("/assets")
                        ? profile.avatarUrl
                        : "/assets/imgs/players/Erling-Haaland.jpg"
                    }
                    onError={(e) => {
                      e.currentTarget.src = "/assets/imgs/players/Erling-Haaland.jpg";
                    }}
                    alt={profile.displayName}
                    className="rounded-circle shadow-lg"
                    style={{
                      width: "96px",
                      height: "96px",
                      objectFit: "cover",
                      border: "3px solid #22c55e",
                    }}
                  />
                  <span
                    className="position-absolute bottom-0 end-0 rounded-circle bg-success text-white d-flex align-items-center justify-content-center shadow"
                    style={{
                      width: "28px",
                      height: "28px",
                      border: "3px solid #070b12",
                      fontSize: "14px",
                    }}
                  >
                    <i className="bi bi-check-lg"></i>
                  </span>
                </div>

                {/* Info & Bio */}
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                    <h2 className="fw-black text-white font-space-grotesk mb-0" style={{ fontSize: "24px" }}>
                      {profile.displayName}
                    </h2>
                    <span
                      className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold d-inline-flex align-items-center gap-1"
                      style={{
                        fontSize: "11px",
                        background: "rgba(34, 197, 94, 0.18)",
                        color: "#4ade80",
                        border: "1px solid rgba(34, 197, 94, 0.4)",
                      }}
                    >
                      <i className="bi bi-patch-check-fill"></i>
                      <span>VERIFIED PRO</span>
                    </span>
                  </div>

                  <div className="text-secondary small font-monospace mb-2" style={{ fontSize: "13px" }}>
                    @{profile.username} • <span className="text-light">{profile.country || "Global"}</span> • <span className="text-success">{profile.yearsOfExperience || 5}+ Years Experience</span>
                  </div>

                  <p
                    className="text-light small mb-3"
                    style={{
                      maxWidth: "650px",
                      fontSize: "13.5px",
                      lineHeight: "1.6",
                      color: "#cbd5e1",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {profile.shortBio ||
                      "Professional sports handicapper providing high-value mathematical and tactical predictions across major international leagues."}
                  </p>

                  {/* Sports Coverage Pills */}
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="text-secondary small fw-bold font-space-grotesk" style={{ fontSize: "11px" }}>
                      SPORTS COVERAGE:
                    </span>
                    {(profile.preferredSports || ["Football", "Cricket"]).map((sp) => {
                      const color = SPORT_COLORS[sp] || SPORT_COLORS.Football;
                      return (
                        <span
                          key={sp}
                          className="badge rounded-pill px-2.5 py-1 font-space-grotesk fw-bold"
                          style={{
                            fontSize: "11px",
                            background: color.bg,
                            color: color.text,
                            border: `1px solid ${color.border}`,
                          }}
                        >
                          {sp}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Action: Follow & Rating */}
            <div className="col-lg-4 text-lg-end">
              <div
                className="p-3 p-md-4 rounded-4 text-start d-inline-block w-100"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  maxWidth: "320px",
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <div className="text-secondary small fw-bold font-space-grotesk text-uppercase" style={{ fontSize: "10px" }}>
                      OVERALL RATING
                    </div>
                    <div className="d-flex align-items-center gap-1 text-warning fw-black font-space-grotesk fs-4">
                      <span>{profile.stats?.rating || 4.9}</span>
                      <i className="bi bi-star-fill fs-6"></i>
                    </div>
                  </div>

                  <div className="text-end">
                    <div className="text-secondary small fw-bold font-space-grotesk text-uppercase" style={{ fontSize: "10px" }}>
                      FOLLOWERS
                    </div>
                    <div className="text-white fw-black font-space-grotesk fs-5">
                      {profile.stats?.followersCount?.toLocaleString() || "3,420"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`btn w-100 rounded-pill font-space-grotesk fw-bold py-2 transition-all ${
                    isFollowing ? "btn-outline-success" : "tipster-btn-primary"
                  }`}
                  style={{ fontSize: "13px" }}
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
              </div>
            </div>
          </div>
        </div>

        {/* STATS METRICS ROW */}
        <div className="row g-3 mb-5">
          <div className="col-6 col-md-3">
            <div
              className="p-3 p-md-4 rounded-4 text-center h-100"
              style={{
                background: "var(--bg-card, #0e1520)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="text-secondary small text-uppercase font-space-grotesk fw-bold mb-1" style={{ fontSize: "11px" }}>
                WIN RATE
              </div>
              <div className="text-success fw-black font-space-grotesk display-6">
                {profile.stats?.winRate || 78.4}%
              </div>
              <span className="text-secondary small" style={{ fontSize: "11px" }}>Historical accuracy</span>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div
              className="p-3 p-md-4 rounded-4 text-center h-100"
              style={{
                background: "var(--bg-card, #0e1520)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="text-secondary small text-uppercase font-space-grotesk fw-bold mb-1" style={{ fontSize: "11px" }}>
                AVG ROI %
              </div>
              <div className="text-warning fw-black font-space-grotesk display-6">
                +{profile.stats?.roi || 24.8}%
              </div>
              <span className="text-secondary small" style={{ fontSize: "11px" }}>Return on investment</span>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div
              className="p-3 p-md-4 rounded-4 text-center h-100"
              style={{
                background: "var(--bg-card, #0e1520)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="text-secondary small text-uppercase font-space-grotesk fw-bold mb-1" style={{ fontSize: "11px" }}>
                TOTAL PUBLISHED
              </div>
              <div className="text-white fw-black font-space-grotesk display-6">
                {profile.stats?.totalTips || tips.length || 184}
              </div>
              <span className="text-secondary small" style={{ fontSize: "11px" }}>Verified predictions</span>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div
              className="p-3 p-md-4 rounded-4 text-center h-100"
              style={{
                background: "var(--bg-card, #0e1520)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="text-secondary small text-uppercase font-space-grotesk fw-bold mb-1" style={{ fontSize: "11px" }}>
                CURRENT STREAK
              </div>
              <div className="text-info fw-black font-space-grotesk display-6">
                {profile.stats?.streak || "5W Streak"}
              </div>
              <span className="text-secondary small" style={{ fontSize: "11px" }}>Consecutive wins</span>
            </div>
          </div>
        </div>

        {/* TIPS SECTION HEADER & FILTER TABS */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-black text-white font-space-grotesk text-uppercase mb-1" style={{ fontSize: "20px" }}>
              {profile.displayName}&apos;s Predictions Feed
            </h3>
            <p className="text-secondary small mb-0">Browse all active and verified tips by this handicapper</p>
          </div>

          {/* Access Tabs */}
          <div className="d-flex align-items-center gap-2 p-1 rounded-pill" style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`btn btn-sm rounded-pill px-3 py-1 font-space-grotesk fw-bold ${
                activeTab === "all" ? "tipster-btn-primary" : "text-secondary"
              }`}
              style={{ fontSize: "12px" }}
            >
              All Tips ({tips.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("free")}
              className={`btn btn-sm rounded-pill px-3 py-1 font-space-grotesk fw-bold ${
                activeTab === "free" ? "tipster-btn-primary" : "text-secondary"
              }`}
              style={{ fontSize: "12px" }}
            >
              Free Tips ({tips.filter((t) => t.visibility === "Free").length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("premium")}
              className={`btn btn-sm rounded-pill px-3 py-1 font-space-grotesk fw-bold ${
                activeTab === "premium" ? "tipster-btn-primary" : "text-secondary"
              }`}
              style={{ fontSize: "12px" }}
            >
              Premium Tips ({tips.filter((t) => t.visibility === "Premium").length})
            </button>
          </div>
        </div>

        {/* TIPS CARDS GRID */}
        {filteredTips.length > 0 ? (
          <div className="row g-4">
            {filteredTips.map((tip) => {
              const sportStyle = SPORT_COLORS[tip.sport] || SPORT_COLORS.Football;
              const isPremium = tip.visibility === "Premium";
              const isPurchased = purchasedTipIds.includes(tip.id);

              return (
                <div key={tip.id} className="col-md-6 col-lg-4">
                  <div
                    className="rounded-4 p-4 h-100 d-flex flex-column justify-content-between position-relative tipster-tip-card"
                    style={{
                      background: "var(--bg-card, #0e1520)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <div>
                      {/* Card Header: Sport pill & Price / Free badge */}
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span
                          className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold"
                          style={{
                            fontSize: "11px",
                            background: sportStyle.bg,
                            color: sportStyle.text,
                            border: `1px solid ${sportStyle.border}`,
                          }}
                        >
                          {tip.sport} • {tip.competition}
                        </span>

                        {isPremium ? (
                          <span
                            className="badge rounded-pill px-2.5 py-1 font-space-grotesk fw-bold"
                            style={{
                              fontSize: "11px",
                              background: "rgba(239, 68, 68, 0.16)",
                              color: "#f87171",
                              border: "1px solid rgba(239, 68, 68, 0.4)",
                            }}
                          >
                            <i className="bi bi-lock-fill me-1"></i>
                            ${tip.premiumPrice || "4.99"}
                          </span>
                        ) : (
                          <span
                            className="badge rounded-pill px-2.5 py-1 font-space-grotesk fw-bold"
                            style={{
                              fontSize: "11px",
                              background: "rgba(34, 197, 94, 0.16)",
                              color: "#4ade80",
                              border: "1px solid rgba(34, 197, 94, 0.4)",
                            }}
                          >
                            FREE TIP
                          </span>
                        )}
                      </div>

                      {/* Match Fixture Title */}
                      <h5 className="fw-black text-white font-space-grotesk mb-2 text-truncate" style={{ fontSize: "16px" }}>
                        {tip.match}
                      </h5>

                      {/* Selection / Pick box */}
                      <div
                        className="p-3 rounded-3 mb-3"
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.07)",
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span className="text-secondary text-uppercase fw-bold" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>
                            SELECTION / PICK
                          </span>
                          <span className="text-success fw-bold font-space-grotesk" style={{ fontSize: "11px" }}>
                            {tip.confidenceLevel} Confidence
                          </span>
                        </div>
                        <div className="fw-bold text-white font-space-grotesk mb-1" style={{ fontSize: "14px" }}>
                          {tip.predictionTitle}
                        </div>
                        <div className="d-flex align-items-center justify-content-between text-secondary small">
                          <span>{tip.predictionCategory}</span>
                          <span className="text-white fw-bold font-space-grotesk">Odds: {Number(tip.odds).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Description Preview */}
                      <p className="text-secondary small mb-3 lh-base" style={{ fontSize: "12px", minHeight: "36px" }}>
                        {tip.predictionDescription}
                      </p>
                    </div>

                    {/* Card Footer: Match Date & CTA */}
                    <div className="pt-3 border-top border-secondary border-opacity-20 d-flex align-items-center justify-content-between gap-2">
                      <div className="text-secondary small" style={{ fontSize: "11px" }}>
                        <i className="bi bi-calendar-event me-1"></i>
                        {tip.matchDate}
                      </div>

                      {isPremium ? (
                        isPurchased ? (
                          <Link
                            href={`/tips/${tip.id}`}
                            className="tipster-btn-primary rounded-pill px-3 py-2 fw-bold font-space-grotesk text-decoration-none d-inline-flex align-items-center gap-1"
                            style={{
                              fontSize: "12px",
                              background: "#22c55e",
                              borderColor: "#22c55e",
                            }}
                          >
                            <i className="bi bi-unlock-fill"></i>
                            <span>View Unlocked Tip</span>
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenStripeModal(tip)}
                            className="tipster-btn-outline rounded-pill px-3 py-2 fw-bold font-space-grotesk d-inline-flex align-items-center gap-1 transition-all"
                            style={{
                              fontSize: "12px",
                              borderColor: "rgba(239, 68, 68, 0.45)",
                              color: "#f87171",
                              background: "rgba(239, 68, 68, 0.06)",
                            }}
                          >
                            <i className="bi bi-lock-fill"></i>
                            <span>Unlock (${tip.premiumPrice || "4.99"})</span>
                          </button>
                        )
                      ) : (
                        <Link
                          href={`/tips/${tip.id}`}
                          className="tipster-btn-primary rounded-pill px-3 py-2 fw-bold font-space-grotesk text-decoration-none d-inline-flex align-items-center gap-1"
                          style={{ fontSize: "12px" }}
                        >
                          <span>View Full Tip</span>
                          <i className="bi bi-arrow-right"></i>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="text-center p-5 rounded-4 my-4"
            style={{
              background: "var(--bg-card, #0e1520)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <i className="bi bi-journal-x text-secondary fs-1 d-block mb-3"></i>
            <h4 className="fw-bold font-space-grotesk text-white mb-2">No Predictions in this Category</h4>
            <p className="text-secondary small mb-4" style={{ maxWidth: "450px", margin: "0 auto" }}>
              This tipster currently does not have any active predictions in the selected category.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className="tipster-btn-outline rounded-pill px-4 py-2"
            >
              Show All Tips
            </button>
          </div>
        )}
      </div>

      {/* STRIPE CHECKOUT MODAL */}
      {checkoutModalOpen && selectedTipForCheckout && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
          }}
        >
          <div
            className="rounded-4 p-4 p-md-5 text-white position-relative shadow-lg"
            style={{
              background: "linear-gradient(135deg, #0e1520 0%, #070b12 100%)",
              border: "1px solid rgba(34, 197, 94, 0.35)",
              maxWidth: "480px",
              width: "100%",
            }}
          >
            {/* Modal Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-secondary border-opacity-25">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "32px", height: "32px", background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}
                >
                  <i className="bi bi-shield-check"></i>
                </span>
                <h5 className="fw-bold font-space-grotesk mb-0 text-white" style={{ fontSize: "17px" }}>
                  Stripe Secure Checkout
                </h5>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="btn btn-sm text-secondary hover-text-white p-1"
                style={{ background: "transparent", border: "none" }}
              >
                <i className="bi bi-x-lg" style={{ fontSize: "16px" }}></i>
              </button>
            </div>

            {/* Payment Feedback */}
            {paymentSuccess ? (
              <div className="text-center py-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "64px", height: "64px", background: "rgba(34, 197, 94, 0.2)", color: "#22c55e", fontSize: "32px" }}
                >
                  <i className="bi bi-check-lg fw-bold"></i>
                </div>
                <h4 className="fw-bold font-space-grotesk text-white mb-2">Payment Successful!</h4>
                <p className="text-secondary small mb-4">
                  Prediction has been unlocked and added to your purchased library.
                </p>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <Link
                    href={`/tips/${selectedTipForCheckout.id}`}
                    className="tipster-btn-primary rounded-pill px-4 py-2 text-decoration-none fw-bold font-space-grotesk"
                  >
                    View Full Prediction Now →
                  </Link>
                  <Link
                    href="/my-purchased-tips"
                    className="tipster-btn-outline rounded-pill px-4 py-2 text-decoration-none font-space-grotesk"
                  >
                    My Purchased Tips
                  </Link>
                </div>
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
                      {selectedTipForCheckout.match}
                    </span>
                    <span className="text-danger fw-black font-space-grotesk fs-12">
                      ${selectedTipForCheckout.premiumPrice || "4.99"} USD
                    </span>
                  </div>
                  <div className="text-secondary small" style={{ fontSize: "12px" }}>
                    Tipster: <span className="text-light">{profile.displayName}</span> • Pick: <span className="text-success fw-bold">{selectedTipForCheckout.predictionTitle}</span>
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
                      <span>Pay ${selectedTipForCheckout.premiumPrice || "4.99"} & Unlock Now</span>
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
