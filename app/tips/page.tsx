"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SportType, Tip, TipsterProfile, PurchasedTip } from "@/types/tipster";
import {
  getStoredTips,
  INITIAL_TIPSTERS,
  getStoredTipster,
  getPurchasedTips,
  addPurchasedTip,
  useIsMounted,
} from "@/lib/tipster-store";

const SPORTS_OPTIONS: (SportType | "All")[] = ["All", "Cricket", "Football", "NFL", "AFL"];

const SPORT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Cricket: { bg: "rgba(34, 197, 94, 0.15)", text: "#4ade80", border: "rgba(34, 197, 94, 0.35)" },
  Football: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.35)" },
  NFL: { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.35)" },
  AFL: { bg: "rgba(236, 72, 153, 0.15)", text: "#f472b6", border: "rgba(236, 72, 153, 0.35)" },
};

export default function TipsMarketplacePage() {
  const mounted = useIsMounted();
  const [tips, setTips] = useState<Tip[]>(() =>
    getStoredTips().filter((t) => t.status === "Published")
  );
  const [tipsters, setTipsters] = useState<TipsterProfile[]>(() => {
    const current = getStoredTipster();
    if (!current) return INITIAL_TIPSTERS;
    const exists = INITIAL_TIPSTERS.some(
      (p) => p.id === current.id || p.username === current.username
    );
    if (exists) {
      return INITIAL_TIPSTERS.map((p) => (p.id === current.id ? current : p));
    }
    return [current, ...INITIAL_TIPSTERS];
  });
  const [activeAccessTab, setActiveAccessTab] = useState<"all" | "free" | "premium" | "trending">("all");
  const [selectedSport, setSelectedSport] = useState<SportType | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [followedTipsterIds, setFollowedTipsterIds] = useState<string[]>([]);
  const [purchasedTipIds, setPurchasedTipIds] = useState<string[]>(() =>
    getPurchasedTips().map((p) => p.tipId)
  );

  // Stripe Checkout Modal simulation
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedTipForCheckout, setSelectedTipForCheckout] = useState<Tip | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardHolder, setCardHolder] = useState("Sports Fan");

  const toggleFollowTipster = (tipsterId: string) => {
    setFollowedTipsterIds((prev) =>
      prev.includes(tipsterId) ? prev.filter((id) => id !== tipsterId) : [...prev, tipsterId]
    );
  };

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

  // Filter tips
  const filteredTips = tips.filter((tip) => {
    // Access tab filter
    if (activeAccessTab === "free" && tip.visibility !== "Free") return false;
    if (activeAccessTab === "premium" && tip.visibility !== "Premium") return false;
    if (activeAccessTab === "trending" && !tip.isTrending && tip.odds < 2.0) return false;

    // Sport filter
    if (selectedSport !== "All" && tip.sport !== selectedSport) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = tip.match.toLowerCase();
      const headline = tip.predictionTitle.toLowerCase();
      const competition = tip.competition.toLowerCase();
      const tipsterName = (tip.tipster?.displayName || "").toLowerCase();
      return (
        matchName.includes(q) ||
        headline.includes(q) ||
        competition.includes(q) ||
        tipsterName.includes(q)
      );
    }

    return true;
  });

  return (
    <main className="font-outfit text-white py-4 py-lg-5" style={{ background: "var(--bg-dark, #070b12)", minHeight: "100vh" }}>
      <div className="container custom-container" style={{ maxWidth: "1280px" }}>
        {/* Top Navigation Links */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <Link href="/" className="text-secondary text-decoration-none small hover-text-success">
              Home
            </Link>
            <span className="text-secondary small">/</span>
            <span className="text-success small fw-semibold">Sports Tips Marketplace</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              href="/my-purchased-tips"
              className="tipster-btn-outline px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2"
              style={{ fontSize: "12px", borderColor: "rgba(34, 197, 94, 0.4)", color: "#4ade80" }}
            >
              <i className="bi bi-unlock-fill"></i>
              <span>My Purchased Tips</span>
            </Link>

            <Link
              href="/join-tipster"
              className="tipster-btn-outline px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2"
              style={{ fontSize: "12px" }}
            >
              <i className="bi bi-person-plus-fill"></i>
              <span>Become a Tipster</span>
            </Link>
          </div>
        </div>

        {/* Hero Banner */}
        <div
          className="rounded-4 p-4 p-md-5 mb-5 position-relative overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 85% 20%, rgba(34, 197, 94, 0.18), rgba(7, 11, 18, 0) 70%), linear-gradient(135deg, #0e1722 0%, #070b12 100%)",
            border: "1px solid rgba(34, 197, 94, 0.35)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
          }}
        >
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
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
                  <i className="bi bi-patch-check-fill"></i>
                  <span>VERIFIED PRO PREDICTIONS</span>
                </span>
              </div>

              <h1 className="fw-black text-white font-space-grotesk text-uppercase mb-2" style={{ fontSize: "clamp(1.8rem, 4vw, 2.7rem)" }}>
                Sports Predictions & Tips
              </h1>
              <p className="text-secondary mb-4" style={{ maxWidth: "680px", fontSize: "15px", lineHeight: "1.6" }}>
                Browse expert predictions across Football, Cricket, NFL, and AFL. Access direct free sports analysis or unlock high-confidence premium tips from verified tipsters.
              </p>

              {/* Search Bar */}
              <div
                className="d-flex align-items-center rounded-pill p-1 ps-3"
                style={{
                  background: "rgba(7, 11, 18, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  maxWidth: "520px",
                }}
              >
                <i className="bi bi-search text-secondary me-2"></i>
                <input
                  type="text"
                  placeholder="Search team, league, or tipster..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control bg-transparent text-white border-0 shadow-none ps-0 font-outfit"
                  style={{ fontSize: "14px" }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="btn btn-link text-secondary p-1 me-2 shadow-none"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="col-lg-4 text-lg-end">
              <div
                className="p-4 rounded-4 text-start d-inline-block w-100"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  maxWidth: "340px",
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-secondary small fw-bold font-space-grotesk text-uppercase" style={{ fontSize: "11px" }}>
                    BECOME A TIPSTER
                  </span>
                  <span
                    className="badge rounded-pill px-2 py-1 font-space-grotesk fw-bold"
                    style={{
                      fontSize: "10px",
                      background: "rgba(34, 197, 94, 0.16)",
                      color: "#4ade80",
                      border: "1px solid rgba(34, 197, 94, 0.4)",
                    }}
                  >
                    PRO PROGRAM
                  </span>
                </div>
                <h6 className="fw-bold text-white mb-2 font-space-grotesk">Monetize Your Sports Predictions</h6>
                <p className="text-secondary small mb-3">
                  Publish free tips to build your audience and monetize premium predictions.
                </p>
                <Link
                  href="/join-tipster"
                  className="tipster-btn-primary rounded-pill w-100 text-center py-2 d-block"
                  style={{ fontSize: "13px" }}
                >
                  Join as a Tipster
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 1. FEATURED TIPSTERS SECTION */}
        <div className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h4 className="fw-black text-white font-space-grotesk text-uppercase mb-0" style={{ fontSize: "18px", letterSpacing: "0.03em" }}>
                <i className="bi bi-stars text-warning me-2"></i>
                Featured Tipsters
              </h4>
              <p className="text-secondary small mb-0">Top ranked analysts with verified win-rates</p>
            </div>
          </div>

          <div className="row g-3">
            {tipsters.slice(0, 4).map((t) => {
              const isFollowing = followedTipsterIds.includes(t.id);
              return (
                <div key={t.id} className="col-sm-6 col-lg-3">
                  <div
                    className="rounded-4 p-4 h-100 d-flex flex-column justify-content-between position-relative"
                    style={{
                      background: "var(--bg-card, #0e1520)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <div>
                      {/* Avatar & Header */}
                      <Link
                        href={`/tipsters/${t.id}`}
                        className="d-flex align-items-center gap-3 mb-3 text-decoration-none"
                      >
                        <div className="position-relative flex-shrink-0">
                          <img
                            src={
                              t.avatarUrl && t.avatarUrl.startsWith("/assets")
                                ? t.avatarUrl
                                : "/assets/imgs/players/Erling-Haaland.jpg"
                            }
                            onError={(e) => {
                              e.currentTarget.src = "/assets/imgs/players/Erling-Haaland.jpg";
                            }}
                            alt={t.displayName}
                            className="rounded-circle"
                            style={{
                              width: "52px",
                              height: "52px",
                              objectFit: "cover",
                              border: "2px solid #22c55e",
                            }}
                          />
                          <span
                            className="position-absolute bottom-0 end-0 rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                            style={{ width: "16px", height: "16px", border: "2px solid #070b12", fontSize: "9px" }}
                          >
                            <i className="bi bi-check"></i>
                          </span>
                        </div>

                        <div className="min-w-0">
                          <h6 className="fw-bold text-white mb-0 text-truncate font-space-grotesk hover-text-success" style={{ fontSize: "15px" }}>
                            {t.displayName}
                          </h6>
                          <div className="text-secondary small font-monospace" style={{ fontSize: "12px" }}>
                            @{t.username}
                          </div>
                        </div>
                      </Link>

                      {/* Stats Grid */}
                      <div className="d-flex align-items-center justify-content-between p-2 rounded-3 mb-3" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                        <div className="text-center px-2">
                          <div className="text-secondary text-uppercase fw-bold" style={{ fontSize: "10px" }}>Win Rate</div>
                          <div className="text-success fw-black font-space-grotesk fs-12">{t.stats?.winRate || 78.4}%</div>
                        </div>
                        <div className="border-end border-secondary border-opacity-20" style={{ height: "24px" }}></div>
                        <div className="text-center px-2">
                          <div className="text-secondary text-uppercase fw-bold" style={{ fontSize: "10px" }}>Rating</div>
                          <div className="text-warning fw-black font-space-grotesk fs-12">{t.stats?.rating || 4.9} ★</div>
                        </div>
                        <div className="border-end border-secondary border-opacity-20" style={{ height: "24px" }}></div>
                        <div className="text-center px-2">
                          <div className="text-secondary text-uppercase fw-bold" style={{ fontSize: "10px" }}>Tips</div>
                          <div className="text-white fw-black font-space-grotesk fs-12">{t.stats?.totalTips || 48}</div>
                        </div>
                      </div>

                      {/* Sports */}
                      <div className="d-flex align-items-center gap-1 flex-wrap mb-3">
                        {t.preferredSports.map((sp) => (
                          <span
                            key={sp}
                            className="badge rounded-pill px-2 py-1 font-space-grotesk"
                            style={{
                              fontSize: "10px",
                              background: "rgba(255, 255, 255, 0.06)",
                              color: "#cbd5e1",
                            }}
                          >
                            {sp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions: Follow + View Profile */}
                    <div className="d-flex align-items-center gap-2 mt-auto">
                      <button
                        type="button"
                        onClick={() => toggleFollowTipster(t.id)}
                        className="btn btn-sm rounded-pill flex-fill fw-bold font-space-grotesk transition-all d-flex align-items-center justify-content-center"
                        style={{
                          fontSize: "12px",
                          padding: "7px 10px",
                          background: isFollowing ? "rgba(34, 197, 94, 0.16)" : "rgba(255, 255, 255, 0.05)",
                          color: isFollowing ? "#4ade80" : "#ffffff",
                          border: isFollowing ? "1px solid #22c55e" : "1px solid rgba(255, 255, 255, 0.16)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isFollowing ? (
                          <>
                            <i className="bi bi-check2 me-1"></i> Following
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-lg me-1"></i> Follow
                          </>
                        )}
                      </button>

                      <Link
                        href={`/tipsters/${t.id}`}
                        className="btn btn-sm rounded-pill flex-fill fw-bold font-space-grotesk text-decoration-none transition-all d-flex align-items-center justify-content-center"
                        style={{
                          fontSize: "12px",
                          padding: "7px 10px",
                          background: "rgba(34, 197, 94, 0.12)",
                          color: "#4ade80",
                          border: "1px solid rgba(34, 197, 94, 0.35)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <i className="bi bi-person-badge me-1"></i>
                        <span>Profile</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. FREE VS PREMIUM FILTERS & SPORTS TABS */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-20">
          {/* Access / Visibility Filter Tabs */}
          <div className="d-flex align-items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All Tips", icon: "bi-grid-fill" },
              { id: "free", label: "Free Tips", icon: "bi-unlock-fill" },
              { id: "premium", label: "Premium Tips", icon: "bi-lock-fill" },
              { id: "trending", label: "Trending Picks", icon: "bi-fire" },
            ].map((tab) => {
              const isActive = activeAccessTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveAccessTab(tab.id as typeof activeAccessTab)}
                  className="btn btn-sm rounded-pill font-space-grotesk text-nowrap d-inline-flex align-items-center gap-2 transition-all"
                  style={{
                    fontSize: "13px",
                    padding: "8px 18px",
                    fontWeight: isActive ? "700" : "500",
                    background: isActive ? "#22c55e" : "rgba(255, 255, 255, 0.05)",
                    color: isActive ? "#ffffff" : "#cbd5e1",
                    border: isActive ? "1px solid #22c55e" : "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: isActive ? "0 4px 14px rgba(34, 197, 94, 0.3)" : "none",
                  }}
                >
                  <i className={`bi ${tab.icon}`} style={{ fontSize: "12px" }}></i>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sports Pills Filter */}
          <div className="d-flex align-items-center gap-2 overflow-x-auto">
            {SPORTS_OPTIONS.map((sport) => {
              const isSelected = selectedSport === sport;
              return (
                <button
                  key={sport}
                  type="button"
                  onClick={() => setSelectedSport(sport)}
                  className="btn btn-sm rounded-pill font-space-grotesk text-nowrap transition-all"
                  style={{
                    fontSize: "12px",
                    padding: "6px 16px",
                    fontWeight: isSelected ? "700" : "500",
                    background: isSelected ? "rgba(34, 197, 94, 0.18)" : "rgba(255, 255, 255, 0.03)",
                    color: isSelected ? "#4ade80" : "#94a3b8",
                    border: isSelected ? "1px solid #22c55e" : "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {sport}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="text-secondary small">
            Showing <strong className="text-white">{filteredTips.length}</strong> active predictions
          </div>
        </div>

        {/* 3. TIP CARDS GRID */}
        {filteredTips.length > 0 ? (
          <div className="row g-4">
            {filteredTips.map((tip) => {
              const sportColor = SPORT_COLORS[tip.sport] || SPORT_COLORS.Football;
              const isPremium = tip.visibility === "Premium";

              return (
                <div key={tip.id} className="col-md-6 col-lg-4">
                  <div
                    className="rounded-4 p-4 h-100 d-flex flex-column justify-content-between position-relative transition-all"
                    style={{
                      background: "var(--bg-card, #0e1520)",
                      border: isPremium ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35)",
                    }}
                  >
                    <div>
                      {/* Top Bar: Tipster Info & Published Date */}
                      <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-secondary border-opacity-20">
                        <Link
                          href={`/tipsters/${tip.tipster?.id || tip.tipsterId || tip.tipster?.username || "apex_picks"}`}
                          className="d-flex align-items-center gap-2 min-w-0 text-decoration-none"
                        >
                          <img
                            src={
                              tip.tipster?.avatarUrl && tip.tipster.avatarUrl.startsWith("/assets")
                                ? tip.tipster.avatarUrl
                                : "/assets/imgs/players/Erling-Haaland.jpg"
                            }
                            onError={(e) => {
                              e.currentTarget.src = "/assets/imgs/players/Erling-Haaland.jpg";
                            }}
                            alt={tip.tipster?.displayName || "Tipster"}
                            className="rounded-circle flex-shrink-0"
                            style={{
                              width: "38px",
                              height: "38px",
                              objectFit: "cover",
                              border: "2px solid rgba(34, 197, 94, 0.6)",
                            }}
                          />
                          <div className="min-w-0">
                            <div className="fw-bold text-white text-truncate font-space-grotesk hover-text-success" style={{ fontSize: "14px" }}>
                              {tip.tipster?.displayName || "Pro Tipster"}
                            </div>
                            <div className="text-secondary small font-monospace" style={{ fontSize: "11px" }}>
                              @{tip.tipster?.username || "tipster"}
                            </div>
                          </div>
                        </Link>

                        {/* Tip Type Badge */}
                        {isPremium ? (
                          <span
                            className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold d-inline-flex align-items-center gap-1"
                            style={{
                              fontSize: "11px",
                              background: "rgba(239, 68, 68, 0.18)",
                              color: "#f87171",
                              border: "1px solid rgba(239, 68, 68, 0.4)",
                            }}
                          >
                            <i className="bi bi-lock-fill"></i>
                            <span>${tip.premiumPrice || "4.99"}</span>
                          </span>
                        ) : (
                          <span
                            className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold"
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

                      {/* Sport & Competition */}
                      <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                        <span
                          className="badge rounded-pill px-2 py-1 font-space-grotesk fw-bold"
                          style={{
                            fontSize: "10px",
                            background: sportColor.bg,
                            color: sportColor.text,
                            border: `1px solid ${sportColor.border}`,
                          }}
                        >
                          {tip.sport}
                        </span>
                        <span className="text-secondary small text-truncate" style={{ fontSize: "12px", maxWidth: "200px" }}>
                          {tip.competition}
                        </span>
                      </div>

                      {/* Match Name */}
                      <h5 className="fw-black text-white font-space-grotesk mb-2 text-truncate" style={{ fontSize: "16px" }}>
                        {tip.match}
                      </h5>

                      {/* Prediction Headline / Market Pick */}
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
                          <span className="text-white fw-bold font-space-grotesk">Odds: {tip.odds}</span>
                        </div>
                      </div>

                      {/* Preview Description */}
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
                        purchasedTipIds.includes(tip.id) ? (
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
          /* Empty State */
          <div
            className="text-center p-5 rounded-4 my-4"
            style={{
              background: "var(--bg-card, #0e1520)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <i className="bi bi-funnel text-secondary fs-1 d-block mb-3"></i>
            <h4 className="fw-bold font-space-grotesk text-white mb-2">No Predictions Found</h4>
            <p className="text-secondary small mb-4" style={{ maxWidth: "450px", margin: "0 auto" }}>
              We could not find any predictions matching your selected filters or search keyword.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveAccessTab("all");
                setSelectedSport("All");
                setSearchQuery("");
              }}
              className="tipster-btn-outline rounded-pill px-4 py-2"
            >
              Reset All Filters
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
                    Tipster: <span className="text-light">{selectedTipForCheckout.tipster.displayName}</span> • Pick: <span className="text-success fw-bold">{selectedTipForCheckout.predictionTitle}</span>
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
