"use client";
import ProfileAvatar from "./ProfileAvatar";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Tip, TipsterProfile } from "@/types/tipster";
import { money } from "@/lib/tipster-api";
import "./tipster-reference.css";
export function TipIcon({
  name,
}: {
  name: "grid" | "lock" | "unlock" | "flame" | "calendar" | "arrow";
}) {
  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="6" height="6" />
        <rect x="15" y="3" width="6" height="6" />
        <rect x="3" y="15" width="6" height="6" />
        <rect x="15" y="15" width="6" height="6" />
      </>
    ),
    lock: (
      <>
        <rect x="6" y="10" width="12" height="11" rx="2" />
        <path d="M8 10V6a4 4 0 0 1 8 0v4" />
      </>
    ),
    unlock: (
      <>
        <rect x="6" y="10" width="12" height="11" rx="2" />
        <path d="M8 10V6a4 4 0 0 1 8-1" />
      </>
    ),
    flame: (
      <path d="M12 3c1 6 7 7 7 12a7 7 0 0 1-14 0c0-3 2-5 4-7 0 3 2 4 3 4 2-2 2-6 0-9Z" />
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4m10-4v4M3 11h18" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  };
  return (
    <svg
      className="tip-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
export function TipsterShell({
  title,
  subtitle,
  children,
  navigation = "marketplace",
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  navigation?: "marketplace" | "studio" | "profile" | "none";
  className?: string;
}) {
  return (
    <main className={`tip-module ${className}`}>
      <div className="tip-container">
        {navigation !== "none" && (
          <div className="tip-topline">
            {navigation === "studio" ? (
              <Link href="/tipster/dashboard" className="tip-pill">
                Back to Dashboard
              </Link>
            ) : (
              <Link href="/tips" className="muted small">
                Home / Sports Tips Marketplace
              </Link>
            )}
            {navigation === "studio" ? (
              <span className="tip-status">Tip Creator Studio</span>
            ) : navigation === "profile" ? (
              <Link href="/tips" className="tip-pill">
                All Predictions
              </Link>
            ) : (
              <nav className="d-flex gap-2 flex-wrap" aria-label="Tipster">
                <Link className="tip-pill" href="/my-purchased-tips">
                  My Purchased Tips
                </Link>
                <Link className="tip-pill" href="/tipster-register">
                  Become a Tipster
                </Link>
              </nav>
            )}
          </div>
        )}
        {title && (
          <>
            <h1>{title}</h1>
            {subtitle && <p className="muted mb-4">{subtitle}</p>}
          </>
        )}
        {children}
      </div>
    </main>
  );
}
export function Notice({ error }: { error: string }) {
  return error ? (
    <p className="alert alert-danger" role="alert">
      {error}
    </p>
  ) : null;
}
export function SportsTags({ sports }: { sports: string[] }) {
  return (
    <div className="tip-tags">
      {sports.map((s) => (
        <span key={s} className="tip-tag" data-sport={s}>
          {s}
        </span>
      ))}
    </div>
  );
}
export function ProfileHero({
  profile,
  children,
  owner = false,
}: {
  profile: TipsterProfile;
  children?: ReactNode;
  owner?: boolean;
}) {
  return (
    <section className="tip-hero">
      <ProfileAvatar
        name={profile.displayName}
        url={profile.avatarUrl}
        size={86}
        className="tip-avatar"
      />
      <div className="tip-hero-copy">
        <div className="d-flex align-items-center flex-wrap gap-2">
          <h2>{profile.displayName}</h2>
          <span className="muted small">@{profile.username}</span>
          <span
            className={`tip-status fs-10 ${owner && !profile.canPublish ? "pending" : ""}`}
          >
            {owner
              ? profile.canPublish
                ? "ACTIVE TIPSTER"
                : "ACTIVATION REQUIRED"
              : profile.verificationStatus === "verified"
                ? "VERIFIED TIPSTER"
                : "TIPSTER"}
          </span>
        </div>
        <p>{profile.shortBio}</p>
        <div className="d-flex gap-3 align-items-center flex-wrap">
          <SportsTags sports={profile.preferredSports} />
          <span className="text-dark fw-semibold small d-inline-flex align-items-center gap-2">
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style={{
                width: "22px",
                height: "22px",
                background: "#FEF3C7",
                color: "#B45309",
                border: "1px solid #FCD34D",
              }}
            >
              <i className="bi bi-award-fill" style={{ fontSize: "12px" }}></i>
            </span>
            {profile.yearsOfExperience}{" "}
            {profile.yearsOfExperience === 1 ? "Year" : "Years"} Experience
          </span>
          {!owner && (
            <span className="text-dark fw-semibold small d-inline-flex align-items-center gap-2">
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: "22px",
                  height: "22px",
                  background: "#F3F4F6",
                  color: "#374151",
                  border: "1px solid #E5E7EB",
                }}
              >
                <i
                  className="bi bi-geo-alt-fill"
                  style={{ fontSize: "11px" }}
                ></i>
              </span>
              {profile.country}
            </span>
          )}
        </div>
      </div>
      {children && <div className="tip-hero-actions">{children}</div>}
    </section>
  );
}
export function StatsGrid({
  items,
}: {
  items: {
    label: string;
    value: string | number;
    detail: string;
    color?: string;
    icon?: string;
  }[];
}) {
  return (
    <div className="tip-stat-grid">
      {items.map((i) => (
        <div className="tip-stat" key={i.label}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <small
              className="fw-bold text-muted text-uppercase mb-0"
              style={{ letterSpacing: "0.04em", fontSize: "11px" }}
            >
              {i.label}
            </small>
            {i.icon && (
              <span
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: "36px",
                  height: "36px",
                  background: "#FAF6EF",
                  color: i.color || "#1C1F22",
                  border: "1px solid #EAE5DC",
                  fontSize: "16px",
                  flexShrink: 0,
                }}
              >
                <i className={i.icon}></i>
              </span>
            )}
          </div>
          <strong
            className="d-block font-space-grotesk fw-black my-1"
            style={{ fontSize: "28px", color: i.color || "#1C1F22" }}
          >
            {i.value}
          </strong>
          <span
            className="text-muted small d-block"
            style={{ fontSize: "12px" }}
          >
            {i.detail}
          </span>
        </div>
      ))}
    </div>
  );
}
export function TipCards({
  tips,
  onUnlock,
}: {
  tips: Tip[];
  onUnlock?: (tip: Tip) => void;
}) {
  if (!tips.length)
    return (
      <div className="tip-panel tip-empty text-center py-5">
        <div
          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: "56px",
            height: "56px",
            background: "#FAF6EF",
            border: "1px solid #EAE5DC",
            color: "#9CA3AF",
            fontSize: "24px",
          }}
        >
          <i className="bi bi-inbox"></i>
        </div>
        <h4 className="fs-5 fw-bold text-dark mb-1">No predictions found</h4>
        <p className="text-muted small">
          Published tips will appear here once tipsters create them.
        </p>
      </div>
    );
  return (
    <div className="tip-card-grid">
      {tips.map((t) => (
        <article
          className={`tip-prediction-card ${t.visibility === "Premium" ? "premium" : ""}`}
          key={t.id}
        >
          <div className="tip-card-author">
            <ProfileAvatar
              name={t.tipster.displayName}
              url={t.tipster.avatarUrl}
              size={42}
            />
            <div className="flex-grow-1 min-w-0">
              <Link
                href={`/tipsters/${t.tipsterId}`}
                className="fw-bold text-dark text-truncate d-block text-decoration-none"
              >
                {t.tipster.displayName}
              </Link>
              <small className="text-muted">@{t.tipster.username}</small>
            </div>
            <span
              className={`tip-status ${t.visibility === "Premium" ? "tip-paid-price" : "active"}`}
            >
              {t.visibility === "Premium" ? (
                <>
                  <i className="bi bi-lock-fill me-1"></i>PAID (
                  {money(t.premiumPrice || 0, t.currency)})
                </>
              ) : (
                "FREE TIP"
              )}
            </span>
          </div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <SportsTags sports={[t.sport]} />
            <span className="badge bg-light text-dark border px-2 py-1 fw-semibold small">
              {t.competition}
            </span>
          </div>
          <h3 className="tip-card-match fw-bold text-dark mb-2">
            {t.teams.home} vs {t.teams.away}
          </h3>
          <div
            className="tip-selection p-3 rounded-3 mb-3"
            style={{ background: "#FAF6EF", border: "1px solid #EAE5DC" }}
          >
            <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
              <small
                className="text-muted text-uppercase fw-bold"
                style={{ fontSize: "11px", letterSpacing: "0.04em" }}
              >
                SELECTION
              </small>
              {(() => {
                const isHigh = t.confidenceLevel === "High";
                const isMed = t.confidenceLevel === "Medium";
                const bg = isHigh ? "#ECFDF5" : isMed ? "#FFFBEB" : "#F3F4F6";
                const color = isHigh
                  ? "#15803D"
                  : isMed
                    ? "#B45309"
                    : "#4B5563";
                const border = isHigh
                  ? "#86EFAC"
                  : isMed
                    ? "#FDE68A"
                    : "#D1D5DB";
                const icon = isHigh
                  ? "bi-shield-fill-check"
                  : isMed
                    ? "bi-shield-check"
                    : "bi-shield";
                return (
                  <span
                    className="d-inline-flex align-items-center gap-1 rounded-pill fw-bold"
                    style={{
                      fontSize: "10.5px",
                      padding: "2.5px 8px",
                      background: bg,
                      color: color,
                      border: `1px solid ${border}`,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      lineHeight: "1.2",
                    }}
                  >
                    <i
                      className={`bi ${icon}`}
                      style={{ fontSize: "11px" }}
                    ></i>
                    <span>{t.confidenceLevel} Confidence</span>
                  </span>
                );
              })()}
            </div>
            <strong className="d-block fw-bold text-dark my-1">
              {t.predictionTitle}
            </strong>
            <div
              className="d-flex justify-content-between align-items-center gap-2 mt-2 pt-2"
              style={{ borderTop: "1px dashed #EAE5DC" }}
            >
              <small className="text-muted fw-semibold">
                {t.predictionCategory}
              </small>
              <span
                className="badge bg-warning text-dark fw-bold px-2 py-1"
                style={{ fontSize: "12px" }}
              >
                Odds: {Number(t.odds).toFixed(2)}
              </span>
            </div>
          </div>
          <p
            className="tip-published-date text-muted small mb-2"
            style={{ fontSize: "12px" }}
          >
            Published {new Date(t.publishedAt).toLocaleDateString()}
          </p>
          <p
            className="text-secondary small mb-3 flex-grow-1"
            style={{ fontSize: "13px", lineHeight: "1.5" }}
          >
            {t.analysisSnippet ||
              "Full prediction and analysis available inside."}
          </p>
          <div
            className="tip-card-footer pt-3 mt-auto"
            style={{ borderTop: "1px solid #EAE5DC" }}
          >
            <small className="tip-match-date text-muted d-inline-flex align-items-center gap-1">
              <i className="bi bi-calendar3"></i> {t.matchDate}
            </small>
            {t.visibility === "Premium" && !t.unlocked && onUnlock ? (
              <button
                className="tip-pill tip-unlock-button"
                onClick={() => onUnlock(t)}
              >
                <i className="bi bi-lock-fill me-1"></i> Unlock (
                {money(t.premiumPrice || 0, t.currency)})
              </button>
            ) : (
              <Link
                href={`/tips/${t.id}`}
                className="tip-primary tip-open-button"
              >
                {t.visibility === "Premium"
                  ? t.isOwnTip
                    ? "View Your Tip"
                    : t.unlocked
                      ? "View Unlocked Tip"
                      : "View Tip"
                  : "View Full Tip"}
                <i
                  className={`bi ms-1 ${t.visibility === "Premium" ? (t.unlocked ? "bi-unlock" : "bi-lock") : "bi-arrow-right"}`}
                ></i>
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
