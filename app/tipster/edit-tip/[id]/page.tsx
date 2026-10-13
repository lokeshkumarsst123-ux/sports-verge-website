"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ConfidenceLevel,
  SportType,
  Tip,
  TipCategory,
  TipStatus,
  TipVisibility,
} from "@/types/tipster";
import {
  getStoredTips,
  updateExistingTip,
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

export default function EditTipPage() {
  const params = useParams();
  const router = useRouter();
  const tipId = params.id as string;
  const mounted = useIsMounted();

  const [tip] = useState<Tip | null>(() => {
    if (!tipId) return null;
    const all = getStoredTips();
    return all.find((t) => t.id === tipId) || null;
  });

  const [formData, setFormData] = useState(() => {
    const all = getStoredTips();
    const found = tipId ? all.find((t) => t.id === tipId) : null;
    if (found) {
      return {
        sport: found.sport,
        competition: found.competition,
        homeTeam: found.teams.home,
        awayTeam: found.teams.away,
        predictionTitle: found.predictionTitle,
        predictionDescription: found.predictionDescription,
        predictionCategory: found.predictionCategory,
        odds: String(found.odds),
        confidenceLevel: found.confidenceLevel,
        matchDate: found.matchDate,
        kickoffTime: found.kickoffTime,
        visibility: found.visibility,
        premiumPrice: String(found.premiumPrice || "4.99"),
        detailedAnalysis: found.detailedAnalysis || found.predictionDescription,
        status: found.status,
      };
    }
    return {
      sport: "Football" as SportType,
      competition: "UEFA Champions League",
      homeTeam: "",
      awayTeam: "",
      predictionTitle: "",
      predictionDescription: "",
      predictionCategory: "Match Winner" as TipCategory,
      odds: "1.90",
      confidenceLevel: "High" as ConfidenceLevel,
      matchDate: "",
      kickoffTime: "",
      visibility: "Free" as TipVisibility,
      premiumPrice: "4.99",
      detailedAnalysis: "",
      status: "Published" as TipStatus,
    };
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.homeTeam.trim() || !formData.predictionTitle.trim()) {
      return;
    }

    if (!tip) return;

    setIsSubmitting(true);

    const updated: Tip = {
      ...tip,
      sport: formData.sport,
      competition: formData.competition,
      match: `${formData.homeTeam.trim()} vs ${formData.awayTeam.trim()}`,
      teams: {
        home: formData.homeTeam.trim(),
        away: formData.awayTeam.trim(),
      },
      predictionTitle: formData.predictionTitle.trim(),
      predictionDescription: formData.predictionDescription.trim(),
      detailedAnalysis: formData.detailedAnalysis.trim() || formData.predictionDescription.trim(),
      predictionCategory: formData.predictionCategory,
      odds: Number(formData.odds) || tip.odds,
      confidenceLevel: formData.confidenceLevel,
      matchDate: formData.matchDate,
      kickoffTime: formData.kickoffTime,
      visibility: formData.visibility,
      premiumPrice: formData.visibility === "Premium" ? Number(formData.premiumPrice) : undefined,
      status: formData.status,
    };

    updateExistingTip(updated);

    setTimeout(() => {
      setIsSubmitting(false);
      setSavedSuccess(true);
      setTimeout(() => {
        router.push("/tipster/dashboard");
      }, 1000);
    }, 500);
  };

  if (!mounted) return null;

  if (!tip) {
    return (
      <main className="font-outfit text-white py-5 text-center" style={{ background: "var(--bg-dark, #070b12)" }}>
        <div className="container custom-container py-5">
          <h4 className="fw-bold mb-3">Tip Not Found</h4>
          <Link href="/tipster/dashboard" className="btn btn-success rounded-pill px-4 py-2">
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="font-outfit text-white py-5" style={{ background: "var(--bg-dark, #070b12)" }}>
      <div className="container custom-container" style={{ maxWidth: "920px" }}>
        {/* Navigation & Status Header */}
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
              background: "rgba(245, 158, 11, 0.15)",
              color: "#fbbf24",
              border: "1px solid rgba(245, 158, 11, 0.4)",
            }}
          >
            <i className="bi bi-pencil-square"></i>
            <span>Editing Tip #{tip.id}</span>
          </span>
        </div>

        <h1 className="fw-black text-white font-space-grotesk text-uppercase mb-4" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)" }}>
          Edit Sports Prediction
        </h1>

        {savedSuccess && (
          <div className="alert alert-success bg-success bg-opacity-20 border-success border-opacity-40 text-success rounded-4 p-3 mb-4 text-center">
            <i className="bi bi-check-circle-fill me-2"></i> Changes saved! Redirecting to Dashboard...
          </div>
        )}

        <div
          className="rounded-4 p-4 p-md-5"
          style={{
            background: "var(--bg-card, #0e1520)",
            border: "1px solid var(--border-dark, rgba(255, 255, 255, 0.08))",
          }}
        >
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
            {/* Visibility Mode Toggle (Free vs Premium) */}
            <div>
              <label className="form-label text-secondary small fw-bold mb-3 text-uppercase" style={{ letterSpacing: "0.05em" }}>
                1. Tip Visibility & Access *
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
                    <p className="text-secondary small mb-0 lh-base" style={{ fontSize: "12.5px" }}>
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

            {/* Publication Status */}
            <div>
              <label className="form-label text-secondary small fw-bold mb-1">PUBLICATION STATUS *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-select tipster-select"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Won">Settled: Won</option>
                <option value="Lost">Settled: Lost</option>
              </select>
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
                        border: "1px solid rgba(255, 255, 255, 0.16)",
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
                  </div>

                  <div className="col-lg-7">
                    <div className="mb-2 text-secondary small font-space-grotesk fw-bold" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>
                      QUICK SELECT PRESETS:
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                      {["2.99", "4.99", "9.99", "14.99", "19.99"].map((price) => {
                        const isSelected = String(formData.premiumPrice) === price;
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
                      Users will pay via Stripe to unlock this premium prediction.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sport & Teams */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-secondary small fw-bold mb-1">SPORT</label>
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
                <label className="form-label text-secondary small fw-bold mb-1">COMPETITION</label>
                <input
                  type="text"
                  name="competition"
                  value={formData.competition}
                  onChange={handleInputChange}
                  className="form-control tipster-input"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-secondary small fw-bold mb-1">HOME TEAM</label>
                <input
                  type="text"
                  name="homeTeam"
                  value={formData.homeTeam}
                  onChange={handleInputChange}
                  className="form-control tipster-input"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-secondary small fw-bold mb-1">AWAY TEAM</label>
                <input
                  type="text"
                  name="awayTeam"
                  value={formData.awayTeam}
                  onChange={handleInputChange}
                  className="form-control tipster-input"
                />
              </div>
            </div>

            {/* Prediction */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-secondary small fw-bold mb-1">CATEGORY</label>
                <select
                  name="predictionCategory"
                  value={formData.predictionCategory}
                  onChange={handleInputChange}
                  className="form-select tipster-select"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 col-6">
                <label className="form-label text-secondary small fw-bold mb-1">ODDS</label>
                <input
                  type="number"
                  step="0.01"
                  name="odds"
                  value={formData.odds}
                  onChange={handleInputChange}
                  className="form-control tipster-input"
                />
              </div>

              <div className="col-md-3 col-6">
                <label className="form-label text-secondary small fw-bold mb-1">CONFIDENCE</label>
                <select
                  name="confidenceLevel"
                  value={formData.confidenceLevel}
                  onChange={handleInputChange}
                  className="form-select tipster-select"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label text-secondary small fw-bold mb-1">PREDICTION HEADLINE</label>
                <input
                  type="text"
                  name="predictionTitle"
                  value={formData.predictionTitle}
                  onChange={handleInputChange}
                  className="form-control tipster-input"
                />
              </div>

              <div className="col-12">
                <label className="form-label text-secondary small fw-bold mb-1">PREVIEW SUMMARY</label>
                <textarea
                  rows={2}
                  name="predictionDescription"
                  value={formData.predictionDescription}
                  onChange={handleInputChange}
                  className="form-control tipster-input"
                ></textarea>
              </div>

              <div className="col-12">
                <label className="form-label text-secondary small fw-bold mb-1">DETAILED ANALYSIS</label>
                <textarea
                  rows={4}
                  name="detailedAnalysis"
                  value={formData.detailedAnalysis}
                  onChange={handleInputChange}
                  className="form-control tipster-input"
                ></textarea>
              </div>
            </div>

            <div className="pt-3 border-top border-secondary border-opacity-20 d-flex justify-content-end gap-2">
              <Link href="/tipster/dashboard" className="tipster-btn-outline rounded-pill px-4 py-2">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="tipster-btn-primary rounded-pill px-5 py-2"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
