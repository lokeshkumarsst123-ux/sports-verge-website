"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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

export default function MyTipsPage() {
  const mounted = useIsMounted();
  const [tipster] = useState<TipsterProfile>(() => getStoredTipster() || INITIAL_TIPSTERS[0]);
  const [tips, setTips] = useState<Tip[]>(() => getStoredTips());
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft" | "scheduled" | "free" | "premium">("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const currentTipsterId = tipster?.id || "tipster-1";

  const tipsterTips = tips.filter(
    (t) => t.tipsterId === currentTipsterId || t.tipster?.username === tipster?.username
  );

  const displayedTips = (tipsterTips.length > 0 ? tipsterTips : tips).filter((t) => {
    if (activeTab === "all") return true;
    if (activeTab === "published") return t.status === "Published";
    if (activeTab === "draft") return t.status === "Draft";
    if (activeTab === "scheduled") return t.status === "Scheduled";
    if (activeTab === "free") return t.visibility === "Free";
    if (activeTab === "premium") return t.visibility === "Premium";
    return true;
  });

  const handleDeleteTip = (tipId: string) => {
    const updated = deleteTipById(tipId);
    setTips(updated);
    setDeleteConfirmId(null);
  };

  if (!mounted) return null;

  return (
    <main className="font-outfit text-white py-4 py-lg-5" style={{ background: "var(--bg-dark, #070b12)" }}>
      <div className="container custom-container">
        {/* Breadcrumbs & Actions */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <Link href="/tipster/dashboard" className="text-secondary text-decoration-none small hover-text-success">
                Dashboard
              </Link>
              <span className="text-secondary small">/</span>
              <span className="text-success small fw-semibold">My Tips</span>
            </div>
            <h1 className="fw-black text-white font-space-grotesk text-uppercase mb-0" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)" }}>
              My Predictions
            </h1>
          </div>

          <Link
            href="/tipster/create-tip"
            className="tipster-btn-primary px-4 py-2 rounded-pill text-nowrap"
            style={{ fontSize: "14px" }}
          >
            <i className="bi bi-plus-circle-fill"></i>
            <span>Create New Tip</span>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="d-flex align-items-center gap-2 border-bottom border-secondary border-opacity-20 pb-3 mb-4 overflow-x-auto">
          {(["all", "published", "draft", "scheduled", "free", "premium"] as const).map((tab) => {
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

        {/* Tips Feed */}
        {displayedTips.length === 0 ? (
          <div
            className="rounded-4 p-5 text-center my-4"
            style={{ background: "var(--bg-card, #0e1520)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: "64px", height: "64px", background: "rgba(255,255,255,0.04)", color: "#64748b", fontSize: "28px" }}
            >
              <i className="bi bi-card-checklist"></i>
            </div>
            <h5 className="fw-bold text-white font-space-grotesk mb-1">No tips found</h5>
            <p className="text-secondary small mb-4">You have not published any predictions in this filter yet.</p>
            <Link
              href="/tipster/create-tip"
              className="tipster-btn-primary px-4 py-2 rounded-pill"
            >
              <i className="bi bi-plus-circle-fill"></i>
              <span>Create Free or Paid Tip</span>
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {displayedTips.map((tip) => {
              const sportColor = SPORT_COLORS[tip.sport] || SPORT_COLORS.Football;

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
                          className="mt-3 px-3 py-2 rounded-3 d-inline-flex align-items-center gap-2"
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
                          className="tipster-btn-action-view"
                        >
                          <i className="bi bi-eye text-secondary"></i>
                          <span>View</span>
                        </Link>
                        <Link
                          href={`/tipster/edit-tip/${tip.id}`}
                          className="tipster-btn-action-edit"
                        >
                          <i className="bi bi-pencil-square"></i>
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(tip.id)}
                          className="tipster-btn-action-delete"
                          title="Delete Tip"
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

                  {deleteConfirmId === tip.id && (
                    <div className="mt-3 p-3 rounded-3 bg-danger bg-opacity-10 border border-danger border-opacity-30 d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <span className="text-danger small fw-semibold">
                        Are you sure you want to delete this tip permanently?
                      </span>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteTip(tip.id)}
                          className="btn btn-danger btn-sm rounded-pill px-3 py-1 fw-bold"
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
    </main>
  );
}
