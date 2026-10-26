"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { tipsterApi, money } from "@/lib/tipster-api";
import { hasAuthSession, apiErrorMessage } from "@/lib/auth-api";
import type { Tip } from "@/types/tipster";
import { TipsterShell, Notice, SportsTags, TipIcon } from "./TipsterUI";
function ActionIcon({ name }: { name: "view" | "edit" | "trash" }) {
  const shapes = {
    view: (
      <>
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    edit: (
      <>
        <path d="m15 3 6 6-11 11H4v-6L15 3Zm-3 3 6 6" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M9 3h6m-9 3 1 15h10l1-15M10 10v7m4-7v7" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {shapes[name]}
    </svg>
  );
}
export default function MyTips() {
  const [tips, setTips] = useState<Tip[]>([]),
    [filter, setFilter] = useState("All"),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [deleting, setDeleting] = useState("");
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!hasAuthSession()) {
          window.location.replace("/login?next=%2Ftipster%2Fmy-tips");
          return;
        }
        const { profile } = await tipsterApi.me();
        if (!active) return;
        if (!profile) {
          window.location.replace("/tipster-register");
          return;
        }
        const { tips } = await tipsterApi.mine();
        if (active) setTips(tips);
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
  const remove = async (id: string) => {
    if (deleting || !window.confirm("Delete this draft?")) return;
    setDeleting(id);
    setError("");
    try {
      await tipsterApi.remove(id);
      setTips((items) => items.filter((t) => t.id !== id));
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setDeleting("");
    }
  };
  const filtered = tips.filter(
    (t) => filter === "All" || t.status === filter || t.visibility === filter,
  );
  return (
    <TipsterShell
      title=""
      navigation="none"
      className="tip-dashboard-page tip-my-tips-page"
    >
      <Notice error={error} />
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="d-flex align-items-center gap-2 small mb-2"
          >
            <Link
              href="/tipster/dashboard"
              className="text-muted text-decoration-none"
            >
              Dashboard
            </Link>
            <span className="text-muted">/</span>
            <span className="fw-bold text-success text-uppercase">My Tips</span>
          </nav>
          <h1 className="mb-0 fs-2 fw-black font-space-grotesk text-dark">
            MY PREDICTIONS
          </h1>
          <p className="text-muted small mb-0 mt-1">
            Manage, edit, and review your published and draft sports
            predictions.
          </p>
        </div>
        <Link className="tip-primary px-4 py-2" href="/tipster/create-tip">
          <i className="bi bi-plus-lg me-1"></i> Create New Tip
        </Link>
      </div>
      <div
        className="tip-tabs"
        role="group"
        aria-label="Filter your predictions"
      >
        {["All", "Published", "Draft", "Scheduled", "Free", "Premium"].map(
          (v) => (
            <button
              key={v}
              className={`tip-pill ${filter === v ? "active" : ""}`}
              aria-pressed={filter === v}
              onClick={() => setFilter(v)}
            >
              {v}
            </button>
          ),
        )}
      </div>
      {loading ? (
        <p role="status">Loading your predictions...</p>
      ) : !filtered.length ? (
        <div className="tip-panel tip-empty">
          <h2>No predictions in this view</h2>
          <p>Save a draft or publish your first tip to see it here.</p>
          <Link className="tip-primary" href="/tipster/create-tip">
            Create New Tip
          </Link>
        </div>
      ) : (
        <div className="tip-my-tips-list">
          {filtered.map((t) => (
            <article className="tip-prediction-row" key={t.id}>
              <div>
                <div className="tip-tags">
                  <SportsTags sports={[t.sport]} />
                  <span className="tip-tag">
                    {t.competition || "Competition pending"}
                  </span>
                  <span
                    className={`tip-status fs-12 ${t.visibility === "Premium" ? "pending" : ""}`}
                  >
                    {t.visibility === "Premium" ? (
                      <>
                        <TipIcon name="lock" /> PREMIUM (
                        {money(t.premiumPrice || 0, t.currency)})
                      </>
                    ) : (
                      "FREE TIP"
                    )}
                  </span>
                  <span
                    className={`tip-status fs-12 tip-dashboard-status-${t.status.toLowerCase()}`}
                  >
                    {t.status}
                  </span>
                </div>
                <h3>{t.predictionTitle}</h3>
                <p className="small mb-1">
                  <strong>
                    {t.teams.home} vs {t.teams.away}
                  </strong>
                  <span className="muted">
                    {" "}
                    &middot; Kickoff: {t.matchDate} ({t.kickoffTime})
                  </span>
                </p>
                <p className="muted small mb-0">{t.analysisSnippet}</p>
                {t.status === "Scheduled" && t.scheduledPublishAt && (
                  <small className="text-info">
                    Auto-publish:{" "}
                    {new Date(t.scheduledPublishAt).toLocaleString()}
                  </small>
                )}
              </div>
              <div className="tip-odds">
                <small>ODDS</small>
                <strong>{Number(t.odds).toFixed(2)}</strong>
                <small>{t.predictionCategory}</small>
              </div>
              <div className="tip-dashboard-row-actions d-flex align-items-center gap-2 flex-wrap">
                <Link className="tip-pill" href={`/tips/${t.id}`}>
                  <i className="bi bi-eye me-1"></i> View
                </Link>
                <Link
                  className="tip-pill tip-dashboard-edit"
                  href={`/tipster/edit-tip/${t.id}`}
                >
                  <i className="bi bi-pencil-square me-1"></i> Edit
                </Link>
                {t.status === "Draft" && (
                  <button
                    className="tip-pill tip-dashboard-delete"
                    disabled={Boolean(deleting)}
                    title="Delete draft"
                    aria-label={`Delete draft: ${t.predictionTitle}`}
                    onClick={() => void remove(t.id)}
                  >
                    <i className="bi bi-trash3 me-1"></i> Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </TipsterShell>
  );
}
