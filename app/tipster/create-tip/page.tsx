"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ConfidenceLevel,
  SportType,
  Tip,
  TipCategory,
  TipStatus,
  TipVisibility,
  TipsterProfile,
} from "@/types/tipster";
import {
  getStoredTipster,
  createNewTip,
  INITIAL_TIPSTERS,
  useIsMounted,
} from "@/lib/tipster-store";

const SPORTS: SportType[] = ["Cricket", "Football", "NFL", "AFL"];

const CATEGORIES: TipCategory[] = [
  "Match Winner",
  "Over/Under",
  "Both Teams To Score",
  "Handicap",
  "Toss Winner",
  "First Goal Scorer",
  "Player Prop",
  "Outright",
];

const COMPETITIONS_MAP: Record<SportType, string[]> = {
  Cricket: ["Indian Premier League 2026", "ICC T20 World Cup", "The Ashes", "Big Bash League", "Test Championship"],
  Football: ["UEFA Champions League", "English Premier League", "Spanish La Liga", "FIFA Club World Cup", "Serie A"],
  NFL: ["NFL Regular Season", "NFL Playoffs", "Super Bowl LXI", "AFC Championship"],
  AFL: ["AFL Premiership", "AFL Finals Series", "MCG Special Round"],
};

export default function CreateTipPage() {
  const router = useRouter();
  const mounted = useIsMounted();

  const [tipster, setTipster] = useState<TipsterProfile>(() => {
    return getStoredTipster() || INITIAL_TIPSTERS[0];
  });

  const [formData, setFormData] = useState(() => {
    const stored = getStoredTipster() || INITIAL_TIPSTERS[0];
    const firstSport: SportType =
      stored?.preferredSports && stored.preferredSports.length > 0
        ? stored.preferredSports[0]
        : "Football";
    const firstComp = COMPETITIONS_MAP[firstSport]?.[0] || "UEFA Champions League";

    return {
      sport: firstSport,
      competition: firstComp,
      homeTeam: "",
      awayTeam: "",
      predictionTitle: "",
      predictionDescription: "",
      predictionCategory: "Match Winner" as TipCategory,
      odds: "1.90",
      confidenceLevel: "High" as ConfidenceLevel,
      matchDate: new Date().toISOString().split("T")[0],
      kickoffTime: "20:00 BST",
      visibility: "Free" as TipVisibility,
      premiumPrice: "4.99",
      detailedAnalysis: "",
      status: "Published" as TipStatus,
    };
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingAction, setSubmittingAction] = useState<TipStatus | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const [successStatus, setSuccessStatus] = useState<TipStatus>("Published");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("12:00");
  const [scheduledInfo, setScheduledInfo] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "sport") {
      const sp = value as SportType;
      setFormData((prev) => ({
        ...prev,
        sport: sp,
        competition: COMPETITIONS_MAP[sp][0] || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (statusToSet: TipStatus = "Published") => {
    const newErrors: { [key: string]: string } = {};

    if (statusToSet === "Draft") {
      if (!formData.homeTeam.trim() && !formData.predictionTitle.trim()) {
        newErrors.homeTeam = "Please enter a team name or prediction title to save draft";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    if (!formData.homeTeam.trim()) newErrors.homeTeam = "Home team is required";
    if (!formData.awayTeam.trim()) newErrors.awayTeam = "Away team is required";
    if (!formData.predictionTitle.trim()) newErrors.predictionTitle = "Prediction headline is required";
    if (!formData.predictionDescription.trim()) newErrors.predictionDescription = "Summary description is required";
    if (!formData.odds || isNaN(Number(formData.odds)) || Number(formData.odds) <= 1.0) {
      newErrors.odds = "Valid decimal odds (> 1.0) required";
    }
    if (!formData.matchDate) newErrors.matchDate = "Match date is required";
    if (!formData.kickoffTime.trim()) newErrors.kickoffTime = "Kick-off time is required";

    if (formData.visibility === "Premium") {
      if (!formData.premiumPrice || isNaN(Number(formData.premiumPrice)) || Number(formData.premiumPrice) <= 0) {
        newErrors.premiumPrice = "Please enter a valid price in USD";
      }
      if (!formData.detailedAnalysis.trim()) {
        newErrors.detailedAnalysis = "Detailed analysis is required for premium tips to unlock value";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenScheduleModal = () => {
    if (!validateForm("Scheduled")) {
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }
    if (!scheduleDate) {
      setScheduleDate(formData.matchDate || new Date().toISOString().split("T")[0]);
    }
    setScheduleModalOpen(true);
  };

  const handleConfirmSchedule = () => {
    if (!scheduleDate) {
      alert("Please choose a scheduled release date.");
      return;
    }
    const formattedIso = `${scheduleDate}T${scheduleTime || "12:00"}:00`;
    setScheduledInfo(`${scheduleDate} at ${scheduleTime || "12:00"}`);
    setScheduleModalOpen(false);
    handleSubmit("Scheduled", formattedIso);
  };

  const handleSubmit = (statusToSet: TipStatus, scheduledPublishAt?: string) => {
    if (!validateForm(statusToSet)) {
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    setSubmittingAction(statusToSet);
    setIsSubmitting(true);
    setSuccessStatus(statusToSet);

    const currentTipster = tipster || INITIAL_TIPSTERS[0];
    const matchString = formData.homeTeam.trim() && formData.awayTeam.trim()
      ? `${formData.homeTeam.trim()} vs ${formData.awayTeam.trim()}`
      : formData.homeTeam.trim() || formData.awayTeam.trim() || "TBD Match";

    const newTip: Tip = {
      id: `tip-${Date.now()}`,
      tipsterId: currentTipster.id,
      tipster: {
        id: currentTipster.id,
        displayName: currentTipster.displayName,
        username: currentTipster.username,
        avatarUrl: currentTipster.avatarUrl || "/assets/imgs/players/Erling-Haaland.jpg",
        winRate: currentTipster.stats?.winRate || 78.4,
        rating: currentTipster.stats?.rating || 4.9,
        isVerified: true,
      },
      sport: formData.sport,
      competition: formData.competition,
      match: matchString,
      teams: {
        home: formData.homeTeam.trim() || "TBD",
        away: formData.awayTeam.trim() || "TBD",
      },
      predictionTitle: formData.predictionTitle.trim() || "Untitled Draft",
      predictionDescription: formData.predictionDescription.trim() || "No summary provided",
      analysisSnippet: formData.predictionDescription.trim() || "",
      detailedAnalysis:
        formData.detailedAnalysis.trim() || formData.predictionDescription.trim() || "",
      predictionCategory: formData.predictionCategory,
      odds: Number(formData.odds) || 1.90,
      confidenceLevel: formData.confidenceLevel,
      matchDate: formData.matchDate || new Date().toISOString().split("T")[0],
      kickoffTime: formData.kickoffTime.trim() || "12:00",
      visibility: formData.visibility,
      premiumPrice: formData.visibility === "Premium" ? Number(formData.premiumPrice) : undefined,
      status: statusToSet,
      scheduledPublishAt: statusToSet === "Scheduled" ? scheduledPublishAt : undefined,
      likesCount: 0,
      unlockedCount: 0,
      viewsCount: 1,
      publishedAt: new Date().toISOString(),
    };

    createNewTip(newTip);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittingAction(null);
      setSuccessMsg(true);
      setTimeout(() => {
        router.push("/tipster/dashboard");
      }, 1200);
    }, 600);
  };

  if (!mounted) return null;

  return (
    <main className="font-outfit text-white py-4 py-lg-5" style={{ background: "var(--bg-dark, #070b12)" }}>
      <div className="container custom-container" style={{ maxWidth: "940px" }}>
        {/* Navigation Breadcrumb */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <Link
            href="/tipster/dashboard"
            className="tipster-btn-outline px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2"
            style={{ fontSize: "12px" }}
          >
            <i className="bi bi-arrow-left"></i>
            <span>Back to Dashboard</span>
          </Link>

          <span
            className="badge rounded-pill px-3 py-2 font-space-grotesk fw-bold d-inline-flex align-items-center gap-2"
            style={{
              fontSize: "12px",
              background: "rgba(34, 197, 94, 0.16)",
              color: "#4ade80",
              border: "1px solid rgba(34, 197, 94, 0.4)",
            }}
          >
            <i className="bi bi-patch-check-fill"></i>
            <span>Tip Creator Studio</span>
          </span>
        </div>

        {/* Header */}
        <div className="mb-4">
          <h1 className="fw-black text-white font-space-grotesk text-uppercase mb-1" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)" }}>
            Create Sports Prediction
          </h1>
          <p className="text-secondary small mb-0">
            Publish a Free Tip to gain followers or a locked Premium Tip to monetize your analysis.
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="alert alert-success bg-success bg-opacity-20 border-success border-opacity-40 text-success rounded-4 p-4 mb-4 text-center">
            <i className="bi bi-check-circle-fill fs-3 d-block mb-2"></i>
            <h5 className="fw-bold font-space-grotesk text-white mb-1">
              {successStatus === "Scheduled"
                ? `Tip Scheduled for ${scheduledInfo || "Release"}!`
                : successStatus === "Draft"
                ? "Tip Saved as Draft!"
                : "Tip Published Successfully!"}
            </h5>
            <p className="small mb-0 text-light">
              {successStatus === "Scheduled"
                ? "Your prediction is saved and will automatically go live at the scheduled time. Redirecting to Dashboard..."
                : "Redirecting you to your Tipster Dashboard..."}
            </p>
          </div>
        )}

        {/* Main Form Card */}
        <div
          className="rounded-4 p-4 p-md-5"
          style={{
            background: "var(--bg-card, #0e1520)",
            border: "1px solid var(--border-dark, rgba(255, 255, 255, 0.08))",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit("Published");
            }}
            className="d-flex flex-column gap-4"
          >
            {/* Step 1: Visibility Mode Toggle (Free vs Premium) */}
            <div>
              <label className="form-label text-secondary small fw-bold mb-3 text-uppercase" style={{ letterSpacing: "0.05em" }}>
                1. Select Tip Visibility *
              </label>
              <div className="row g-3">
                <div className="col-md-6">
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, visibility: "Free" }))}
                    className="p-4 rounded-4 transition-all d-flex flex-column justify-content-between h-100"
                    style={{
                      background:
                        formData.visibility === "Free"
                          ? "linear-gradient(135deg, rgba(34, 197, 94, 0.16) 0%, rgba(14, 21, 32, 0.95) 100%)"
                          : "rgba(255, 255, 255, 0.03)",
                      border:
                        formData.visibility === "Free"
                          ? "2px solid #22c55e"
                          : "1px solid rgba(255, 255, 255, 0.12)",
                      cursor: "pointer",
                      minHeight: "100px",
                      boxShadow: formData.visibility === "Free" ? "0 8px 24px rgba(34, 197, 94, 0.22)" : "none",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span
                          className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold"
                          style={{
                            fontSize: "10px",
                            background: "rgba(59, 130, 246, 0.2)",
                            color: "#60a5fa",
                            border: "1px solid rgba(59, 130, 246, 0.4)",
                          }}
                        >
                          FREE TIP
                        </span>
                        <h6 className="fw-bold text-white mb-0 font-space-grotesk" style={{ fontSize: "15px" }}>
                          Open Access
                        </h6>
                      </div>
                      <span
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "24px",
                          height: "24px",
                          background: formData.visibility === "Free" ? "#22c55e" : "transparent",
                          border: formData.visibility === "Free" ? "none" : "2px solid rgba(255,255,255,0.25)",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      >
                        {formData.visibility === "Free" && <i className="bi bi-check-lg fw-bold"></i>}
                      </span>
                    </div>
                    <p className="text-secondary small mb-0 lh-base" style={{ fontSize: "12px" }}>
                      Visible to all SportsVerge users. Ideal for building followers & win-rate.
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, visibility: "Premium" }))}
                    className="p-4 rounded-4 transition-all d-flex flex-column justify-content-between h-100"
                    style={{
                      background:
                        formData.visibility === "Premium"
                          ? "linear-gradient(135deg, rgba(239, 68, 68, 0.16) 0%, rgba(14, 21, 32, 0.95) 100%)"
                          : "rgba(255, 255, 255, 0.03)",
                      border:
                        formData.visibility === "Premium"
                          ? "2px solid #ef4444"
                          : "1px solid rgba(255, 255, 255, 0.12)",
                      cursor: "pointer",
                      minHeight: "100px",
                      boxShadow: formData.visibility === "Premium" ? "0 8px 24px rgba(239, 68, 68, 0.22)" : "none",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span
                          className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold d-inline-flex align-items-center gap-1"
                          style={{
                            fontSize: "10px",
                            background: "rgba(239, 68, 68, 0.2)",
                            color: "#f87171",
                            border: "1px solid rgba(239, 68, 68, 0.4)",
                          }}
                        >
                          <i className="bi bi-lock-fill"></i> PREMIUM TIP
                        </span>
                        <h6 className="fw-bold text-white mb-0 font-space-grotesk" style={{ fontSize: "15px" }}>
                          Paid Unlock
                        </h6>
                      </div>
                      <span
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "24px",
                          height: "24px",
                          background: formData.visibility === "Premium" ? "#ef4444" : "transparent",
                          border: formData.visibility === "Premium" ? "none" : "2px solid rgba(255,255,255,0.25)",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      >
                        {formData.visibility === "Premium" && <i className="bi bi-check-lg fw-bold"></i>}
                      </span>
                    </div>
                    <p className="text-secondary small mb-0 lh-base" style={{ fontSize: "12px" }}>
                      Content is locked. Users pay to view full detailed prediction & stake.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Price Input & Presets (Visible only if Premium) */}
            {formData.visibility === "Premium" && (
              <div
                className="rounded-4 p-4 transition-all"
                style={{
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(14, 21, 32, 0.95) 100%)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  boxShadow: "0 8px 24px rgba(239, 68, 68, 0.15)",
                }}
              >
                <div className="row align-items-center g-3">
                  <div className="col-lg-5">
                    <label className="form-label text-white small fw-bold mb-2 d-flex align-items-center gap-2 font-space-grotesk text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                      <i className="bi bi-tag-fill text-danger"></i>
                      <span>Premium Unlock Price (USD) *</span>
                    </label>

                    <div
                      className="d-flex align-items-center rounded-3 transition-all"
                      style={{
                        background: "#090e17",
                        border: errors.premiumPrice
                          ? "1px solid #ef4444"
                          : "1px solid rgba(255, 255, 255, 0.16)",
                        height: "46px",
                      }}
                    >
                      <span
                        className="ps-3 pe-1 text-danger fw-bold font-space-grotesk fs-5 select-none"
                        style={{ userSelect: "none" }}
                      >
                        $
                      </span>
                      <input
                        type="number"
                        step="0.50"
                        min="1.00"
                        max="100.00"
                        name="premiumPrice"
                        value={formData.premiumPrice}
                        onChange={handleInputChange}
                        className="form-control bg-transparent text-white border-0 fw-bold font-space-grotesk fs-5 shadow-none ps-1 pe-3"
                        placeholder="4.99"
                        style={{ height: "100%", outline: "none" }}
                      />
                    </div>
                    {errors.premiumPrice && <div className="text-danger small mt-2 fw-semibold">{errors.premiumPrice}</div>}
                  </div>

                  <div className="col-lg-7">
                    <div className="mb-2 text-secondary small font-space-grotesk fw-bold" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>
                      QUICK SELECT PRESETS:
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                      {["2.99", "4.99", "9.99", "14.99", "19.99"].map((price) => {
                        const isSelected = formData.premiumPrice === price;
                        return (
                          <button
                            key={price}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, premiumPrice: price }))}
                            className="btn btn-sm rounded-pill font-space-grotesk fw-bold transition-all"
                            style={{
                              fontSize: "12px",
                              padding: "5px 14px",
                              background: isSelected ? "#ef4444" : "rgba(255, 255, 255, 0.05)",
                              color: isSelected ? "#ffffff" : "#cbd5e1",
                              border: isSelected ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.14)",
                              boxShadow: isSelected ? "0 2px 8px rgba(239, 68, 68, 0.35)" : "none",
                            }}
                          >
                            ${price}
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-secondary small" style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      <i className="bi bi-shield-check text-success me-1"></i>
                      Users will pay via Stripe secure checkout to unlock your full analysis.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Match & Sport Selection */}
            <div>
              <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom border-secondary border-opacity-20">
                <i className="bi bi-trophy-fill text-success" style={{ fontSize: "16px" }}></i>
                <h5 className="fw-bold text-white font-space-grotesk mb-0" style={{ fontSize: "15px" }}>
                  2. Sport & Match Details
                </h5>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">SPORT *</label>
                  <select
                    name="sport"
                    value={formData.sport}
                    onChange={handleInputChange}
                    className="form-select tipster-select"
                  >
                    {SPORTS.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">COMPETITION / LEAGUE *</label>
                  <select
                    name="competition"
                    value={formData.competition}
                    onChange={handleInputChange}
                    className="form-select tipster-select"
                  >
                    {(COMPETITIONS_MAP[formData.sport] || []).map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">HOME TEAM *</label>
                  <input
                    type="text"
                    name="homeTeam"
                    value={formData.homeTeam}
                    onChange={handleInputChange}
                    placeholder="e.g. Arsenal"
                    className={`form-control tipster-input ${
                      errors.homeTeam ? "border-danger" : ""
                    }`}
                  />
                  {errors.homeTeam && <div className="text-danger small mt-1">{errors.homeTeam}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">AWAY TEAM *</label>
                  <input
                    type="text"
                    name="awayTeam"
                    value={formData.awayTeam}
                    onChange={handleInputChange}
                    placeholder="e.g. Chelsea"
                    className={`form-control tipster-input ${
                      errors.awayTeam ? "border-danger" : ""
                    }`}
                  />
                  {errors.awayTeam && <div className="text-danger small mt-1">{errors.awayTeam}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">MATCH DATE *</label>
                  <input
                    type="date"
                    name="matchDate"
                    value={formData.matchDate}
                    onChange={handleInputChange}
                    className={`form-control tipster-input ${
                      errors.matchDate ? "border-danger" : ""
                    }`}
                  />
                  {errors.matchDate && <div className="text-danger small mt-1">{errors.matchDate}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">KICK-OFF TIME *</label>
                  <input
                    type="text"
                    name="kickoffTime"
                    value={formData.kickoffTime}
                    onChange={handleInputChange}
                    placeholder="e.g. 20:00 BST / 19:30 IST"
                    className={`form-control tipster-input ${
                      errors.kickoffTime ? "border-danger" : ""
                    }`}
                  />
                  {errors.kickoffTime && <div className="text-danger small mt-1">{errors.kickoffTime}</div>}
                </div>
              </div>
            </div>

            {/* Step 3: Prediction Details */}
            <div>
              <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom border-secondary border-opacity-20">
                <i className="bi bi-lightbulb-fill text-success" style={{ fontSize: "16px" }}></i>
                <h5 className="fw-bold text-white font-space-grotesk mb-0" style={{ fontSize: "15px" }}>
                  3. Prediction & Odds
                </h5>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">PREDICTION CATEGORY *</label>
                  <select
                    name="predictionCategory"
                    value={formData.predictionCategory}
                    onChange={handleInputChange}
                    className="form-select tipster-select"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3 col-6">
                  <label className="form-label text-secondary small fw-bold mb-1">DECIMAL ODDS *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1.01"
                    max="50.00"
                    name="odds"
                    value={formData.odds}
                    onChange={handleInputChange}
                    placeholder="1.90"
                    className={`form-control tipster-input ${
                      errors.odds ? "border-danger" : ""
                    }`}
                  />
                  {errors.odds && <div className="text-danger small mt-1">{errors.odds}</div>}
                </div>

                <div className="col-md-3 col-6">
                  <label className="form-label text-secondary small fw-bold mb-1">CONFIDENCE *</label>
                  <select
                    name="confidenceLevel"
                    value={formData.confidenceLevel}
                    onChange={handleInputChange}
                    className="form-select tipster-select"
                  >
                    <option value="High">High Confidence</option>
                    <option value="Medium">Medium Confidence</option>
                    <option value="Low">Low / Speculative</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label text-secondary small fw-bold mb-1">
                    PREDICTION TITLE / MAIN PICK *
                  </label>
                  <input
                    type="text"
                    name="predictionTitle"
                    value={formData.predictionTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Over 2.5 Total Goals & Both Teams To Score"
                    className={`form-control tipster-input ${
                      errors.predictionTitle ? "border-danger" : ""
                    }`}
                  />
                  {errors.predictionTitle && (
                    <div className="text-danger small mt-1">{errors.predictionTitle}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label text-secondary small fw-bold mb-1">
                    PREDICTION SUMMARY / PREVIEW SNIPPET *
                  </label>
                  <textarea
                    rows={2}
                    name="predictionDescription"
                    value={formData.predictionDescription}
                    onChange={handleInputChange}
                    placeholder="Public summary highlighting the core statistical reason for this selection..."
                    className={`form-control tipster-input ${
                      errors.predictionDescription ? "border-danger" : ""
                    }`}
                  ></textarea>
                  {errors.predictionDescription && (
                    <div className="text-danger small mt-1">{errors.predictionDescription}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label text-secondary small fw-bold mb-1">
                    DETAILED ANALYSIS & STAKING DISCIPLINE {formData.visibility === "Premium" ? "(LOCKED CONTENT) *" : "(OPTIONAL)"}
                  </label>
                  <textarea
                    rows={4}
                    name="detailedAnalysis"
                    value={formData.detailedAnalysis}
                    onChange={handleInputChange}
                    placeholder="Full in-depth match breakdown, tactical match-ups, expected goals/points modeling, recommended unit stake (e.g. 2.5 units)..."
                    className={`form-control tipster-input ${
                      errors.detailedAnalysis ? "border-danger" : ""
                    }`}
                  ></textarea>
                  {errors.detailedAnalysis && (
                    <div className="text-danger small mt-1">{errors.detailedAnalysis}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions: Publish, Save Draft, Schedule */}
            <div className="pt-3 border-top border-secondary border-opacity-20 d-flex flex-wrap align-items-center justify-content-between gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit("Draft")}
                className="tipster-btn-outline rounded-pill px-4 py-2"
                style={{ fontSize: "14px" }}
              >
                {submittingAction === "Draft" ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    <span>Saving Draft...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-2"></i>
                    <span>Save as Draft</span>
                  </>
                )}
              </button>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleOpenScheduleModal}
                  className="tipster-btn-outline rounded-pill px-4 py-2"
                  style={{
                    fontSize: "14px",
                    borderColor: "rgba(56, 189, 248, 0.4)",
                    color: "#38bdf8",
                  }}
                >
                  {submittingAction === "Scheduled" ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-clock-history me-2"></i>
                      <span>Schedule Tip</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit("Published")}
                  className="tipster-btn-primary rounded-pill px-5 py-2"
                  style={{ fontSize: "14px" }}
                >
                  {submittingAction === "Published" ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill me-2"></i>
                      <span>Publish Tip Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Schedule Tip Modal Dialog */}
        {scheduleModalOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
            style={{
              background: "rgba(4, 7, 12, 0.85)",
              backdropFilter: "blur(12px)",
              zIndex: 9999,
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            <div
              className="rounded-4 p-4 p-md-4 position-relative"
              style={{
                background: "linear-gradient(180deg, #0e1622 0%, #080d14 100%)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                boxShadow: "0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(34, 197, 94, 0.08)",
                maxWidth: "520px",
                width: "100%",
              }}
            >
              {/* Modal Header */}
              <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-secondary border-opacity-20">
                <div className="d-flex align-items-center gap-3">
                  <span
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{
                      width: "42px",
                      height: "42px",
                      background: "rgba(34, 197, 94, 0.15)",
                      color: "#22c55e",
                      border: "1px solid rgba(34, 197, 94, 0.35)",
                      fontSize: "18px",
                      boxShadow: "0 0 16px rgba(34, 197, 94, 0.2)",
                    }}
                  >
                    <i className="bi bi-calendar2-check-fill"></i>
                  </span>
                  <div>
                    <h5 className="fw-bold font-space-grotesk text-white mb-0" style={{ fontSize: "17px", letterSpacing: "0.02em" }}>
                      Schedule Tip Release
                    </h5>
                    <span className="text-secondary small" style={{ fontSize: "12.5px" }}>
                      Set the automatic publish date and time
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="rounded-circle d-flex align-items-center justify-content-center text-secondary hover-text-white transition-all"
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: "pointer",
                  }}
                >
                  <i className="bi bi-x-lg" style={{ fontSize: "13px" }}></i>
                </button>
              </div>

              {/* Match Snapshot Card */}
              <div
                className="p-3 rounded-3 mb-3"
                style={{
                  background: "#060a10",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                  <div className="fw-bold text-white font-space-grotesk text-capitalize" style={{ fontSize: "15px" }}>
                    {formData.homeTeam.trim() || "Home Team"}{" "}
                    <span className="text-secondary fw-normal font-outfit" style={{ fontSize: "13px" }}>
                      vs
                    </span>{" "}
                    {formData.awayTeam.trim() || "Away Team"}
                  </div>
                  <span
                    className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold text-uppercase"
                    style={{
                      fontSize: "11px",
                      background: formData.visibility === "Premium" ? "rgba(239, 68, 68, 0.18)" : "rgba(59, 130, 246, 0.18)",
                      color: formData.visibility === "Premium" ? "#f87171" : "#60a5fa",
                      border: formData.visibility === "Premium" ? "1px solid rgba(239, 68, 68, 0.35)" : "1px solid rgba(59, 130, 246, 0.35)",
                    }}
                  >
                    {formData.visibility === "Premium" ? (
                      <>
                        <i className="bi bi-lock-fill me-1"></i>
                        ${formData.premiumPrice || "4.99"} PREMIUM
                      </>
                    ) : (
                      "FREE TIP"
                    )}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span
                    className="badge bg-dark border border-secondary border-opacity-30 text-light px-2 py-1 font-space-grotesk"
                    style={{ fontSize: "11px" }}
                  >
                    {formData.sport}
                  </span>
                  <span
                    className="badge bg-dark border border-secondary border-opacity-30 text-light px-2 py-1 font-space-grotesk"
                    style={{ fontSize: "11px" }}
                  >
                    {formData.predictionCategory}
                  </span>
                  <span
                    className="badge px-2 py-1 font-space-grotesk fw-bold"
                    style={{
                      fontSize: "11px",
                      background: "rgba(34, 197, 94, 0.15)",
                      color: "#4ade80",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                    }}
                  >
                    Odds: {formData.odds}
                  </span>
                </div>
              </div>

              {/* Date & Time Selectors */}
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label text-secondary small fw-bold mb-2 font-space-grotesk text-uppercase d-flex align-items-center gap-1" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>
                    <i className="bi bi-calendar3 text-success"></i>
                    <span>RELEASE DATE *</span>
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="form-control tipster-input"
                    style={{ height: "46px" }}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label text-secondary small fw-bold mb-2 font-space-grotesk text-uppercase d-flex align-items-center gap-1" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>
                    <i className="bi bi-clock text-success"></i>
                    <span>RELEASE TIME *</span>
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="form-control tipster-input"
                    style={{ height: "46px" }}
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold mb-2 font-space-grotesk text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>
                  QUICK TIME PRESETS:
                </label>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {[
                    { label: "Morning 09:00", time: "09:00", icon: "bi-sun" },
                    { label: "Afternoon 14:00", time: "14:00", icon: "bi-brightness-high" },
                    { label: "Evening 18:00", time: "18:00", icon: "bi-sunset" },
                    { label: "Night 21:00", time: "21:00", icon: "bi-moon-stars" },
                  ].map((preset) => {
                    const isSelected = scheduleTime === preset.time;
                    return (
                      <button
                        key={preset.time}
                        type="button"
                        onClick={() => setScheduleTime(preset.time)}
                        className="btn btn-sm rounded-pill font-space-grotesk transition-all d-flex align-items-center gap-2"
                        style={{
                          fontSize: "12px",
                          padding: "5px 12px",
                          background: isSelected ? "#22c55e" : "rgba(255, 255, 255, 0.04)",
                          color: isSelected ? "#ffffff" : "#94a3b8",
                          border: isSelected ? "1px solid #22c55e" : "1px solid rgba(255, 255, 255, 0.12)",
                          boxShadow: isSelected ? "0 2px 10px rgba(34, 197, 94, 0.35)" : "none",
                          fontWeight: isSelected ? "700" : "500",
                        }}
                      >
                        <i className={`bi ${preset.icon}`} style={{ fontSize: "11px" }}></i>
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Info Notice */}
              <div
                className="p-3 rounded-3 mb-4 d-flex align-items-start gap-2"
                style={{
                  background: "rgba(34, 197, 94, 0.08)",
                  border: "1px solid rgba(34, 197, 94, 0.22)",
                  fontSize: "12px",
                  color: "#cbd5e1",
                  lineHeight: "1.45",
                }}
              >
                <i className="bi bi-shield-check text-success fs-5 flex-shrink-0 mt-1"></i>
                <div>
                  This prediction will remain securely stored in your dashboard with <strong className="text-white">Scheduled</strong> status and will automatically go live to users at the selected time.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex align-items-center justify-content-end gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="tipster-btn-outline rounded-pill px-4 py-2"
                  style={{ fontSize: "13px" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSchedule}
                  className="tipster-btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2"
                  style={{ fontSize: "13px" }}
                >
                  <i className="bi bi-check2-circle fs-12"></i>
                  <span>Confirm Schedule</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
