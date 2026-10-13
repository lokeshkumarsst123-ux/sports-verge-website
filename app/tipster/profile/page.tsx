"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SportType, TipsterProfile } from "@/types/tipster";
import {
  getStoredTipster,
  saveStoredTipster,
  getStoredTips,
  INITIAL_TIPSTERS,
  useIsMounted,
} from "@/lib/tipster-store";

const SPORTS_OPTIONS: SportType[] = ["Cricket", "Football", "NFL", "AFL"];

const SPORT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Cricket: { bg: "rgba(34, 197, 94, 0.15)", text: "#4ade80", border: "rgba(34, 197, 94, 0.35)" },
  Football: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.35)" },
  NFL: { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.35)" },
  AFL: { bg: "rgba(236, 72, 153, 0.15)", text: "#f472b6", border: "rgba(236, 72, 153, 0.35)" },
};

const PRESET_AVATARS = [
  { id: "avatar-1", url: "/assets/imgs/players/Erling-Haaland.jpg", label: "Football Analyst" },
  { id: "avatar-2", url: "/assets/imgs/players/abhishek-sharma.jpg", label: "Cricket Analyst" },
  { id: "avatar-3", url: "/assets/imgs/players/Patrick-Mahomes.jpg", label: "NFL Analyst" },
  { id: "avatar-4", url: "/assets/imgs/players/Josh-Dunkley.jpg", label: "AFL Specialist" },
  { id: "avatar-5", url: "/assets/imgs/players/Ellyse-Perry.jpg", label: "Multi-Sport Pro" },
];

export default function TipsterProfilePage() {
  const mounted = useIsMounted();
  const [tipster, setTipster] = useState<TipsterProfile>(() => {
    return getStoredTipster() || INITIAL_TIPSTERS[0];
  });
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(() => {
    const stored = getStoredTipster() || INITIAL_TIPSTERS[0];
    return {
      firstName: stored.firstName || "",
      lastName: stored.lastName || "",
      displayName: stored.displayName || "",
      username: stored.username || "",
      email: stored.email || "",
      mobileNumber: stored.mobileNumber || "",
      country: stored.country || "United Kingdom",
      preferredSports: stored.preferredSports || ["Football"],
      yearsOfExperience: stored.yearsOfExperience || 5,
      shortBio: stored.shortBio || "",
      avatarUrl: stored.avatarUrl || "/assets/imgs/players/Erling-Haaland.jpg",
      twitter: stored.socialLinks?.twitter || "",
      telegram: stored.socialLinks?.telegram || "",
      youtube: stored.socialLinks?.youtube || "",
      instagram: stored.socialLinks?.instagram || "",
    };
  });

  const [totalTipsCount] = useState<number>(() => {
    const stored = getStoredTipster() || INITIAL_TIPSTERS[0];
    const allTips = getStoredTips();
    const myTips = allTips.filter(
      (t) => t.tipsterId === stored.id || t.tipster?.username === stored.username
    );
    return myTips.length > 0 ? myTips.length : stored.stats?.totalTips || 84;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSportToggle = (sport: SportType) => {
    setFormData((prev) => {
      const exists = prev.preferredSports.includes(sport);
      if (exists) {
        if (prev.preferredSports.length === 1) return prev;
        return { ...prev, preferredSports: prev.preferredSports.filter((s) => s !== sport) };
      } else {
        return { ...prev, preferredSports: [...prev.preferredSports, sport] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipster) return;

    const updated: TipsterProfile = {
      ...tipster,
      firstName: formData.firstName,
      lastName: formData.lastName,
      displayName: formData.displayName,
      username: formData.username,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      country: formData.country,
      preferredSports: formData.preferredSports,
      yearsOfExperience: Number(formData.yearsOfExperience),
      shortBio: formData.shortBio,
      avatarUrl: formData.avatarUrl,
      socialLinks: {
        twitter: formData.twitter || undefined,
        telegram: formData.telegram || undefined,
        youtube: formData.youtube || undefined,
        instagram: formData.instagram || undefined,
      },
    };

    saveStoredTipster(updated);
    setTipster(updated);
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!mounted || !tipster) return null;

  return (
    <main className="font-outfit text-white py-4 py-lg-5" style={{ background: "var(--bg-dark, #070b12)", minHeight: "100vh" }}>
      <div className="container custom-container" style={{ maxWidth: "1000px" }}>
        {/* Navigation & Header Actions */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <Link
            href="/tipster/dashboard"
            className="tipster-btn-outline px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2"
            style={{ fontSize: "12px" }}
          >
            <i className="bi bi-arrow-left"></i>
            <span>Back to Dashboard</span>
          </Link>

          <div className="d-flex align-items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="tipster-btn-primary px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2"
                style={{ fontSize: "13px" }}
              >
                <i className="bi bi-pencil-square"></i>
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="tipster-btn-outline px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2"
                style={{ fontSize: "13px" }}
              >
                <i className="bi bi-eye"></i>
                <span>View Profile Mode</span>
              </button>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="alert alert-success bg-success bg-opacity-20 border-success border-opacity-40 text-success rounded-4 p-3 mb-4 text-center">
            <i className="bi bi-check-circle-fill me-2"></i> Profile updated successfully!
          </div>
        )}

        {!isEditing ? (
          /* ============================================================
             PROFILE VIEW MODE (Default)
             ============================================================ */
          <div className="d-flex flex-column gap-4">
            {/* Hero Profile Overview Card */}
            <div
              className="rounded-4 p-4 p-md-5 position-relative overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse 70% 80% at 85% 15%, rgba(34, 197, 94, 0.16), rgba(7, 11, 18, 0) 70%), linear-gradient(135deg, #0e1722 0%, #070b12 100%)",
                border: "1px solid rgba(34, 197, 94, 0.35)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
              }}
            >
              <div className="d-flex flex-column flex-md-row align-items-start gap-4">
                {/* Avatar Left */}
                <div className="position-relative flex-shrink-0 mx-auto mx-md-0">
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
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                      border: "3px solid #22c55e",
                      boxShadow: "0 0 25px rgba(34, 197, 94, 0.4)",
                    }}
                  />
                  <span
                    className="position-absolute bottom-0 end-0 rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px", border: "2px solid #070b12", fontSize: "11px" }}
                    title="Verified Tipster"
                  >
                    <i className="bi bi-patch-check-fill"></i>
                  </span>
                </div>

                {/* Profile Details Middle */}
                <div className="flex-grow-1 min-w-0 w-100">
                  {/* Top Bar inside Card: Name + Status + Edit Action */}
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2 flex-wrap min-w-0">
                      <h2
                        className="fw-black text-white font-space-grotesk text-uppercase mb-0 text-truncate"
                        style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.85rem)", maxWidth: "380px" }}
                      >
                        {tipster.displayName}
                      </h2>
                      <span className="text-secondary small font-monospace">(@{tipster.username})</span>

                      <span
                        className="badge rounded-pill font-space-grotesk fw-bold d-inline-flex align-items-center gap-1"
                        style={{
                          padding: "4px 10px",
                          fontSize: "11px",
                          background: "rgba(34, 197, 94, 0.16)",
                          color: "#4ade80",
                          border: "1px solid rgba(34, 197, 94, 0.4)",
                        }}
                      >
                        <i className="bi bi-check-circle-fill"></i>
                        <span>ACTIVE TIPSTER</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="tipster-btn-outline px-3 py-1 rounded-pill d-inline-flex align-items-center gap-2 flex-shrink-0 ms-auto"
                      style={{ fontSize: "12px", borderColor: "rgba(34, 197, 94, 0.35)", color: "#4ade80" }}
                    >
                      <i className="bi bi-pencil-square"></i>
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  {/* Bio & Methodology */}
                  <p
                    className="text-secondary small mb-3 lh-base text-break"
                    style={{
                      maxWidth: "650px",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {tipster.shortBio || "Sports handicapper & match analyst specializing in high-value statistical predictive modeling."}
                  </p>

                  {/* Sports Pills & Experience */}
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
                    <span className="text-secondary small ms-2 d-inline-flex align-items-center gap-1">
                      <i className="bi bi-award text-success"></i>
                      <span>{tipster.yearsOfExperience}+ Years Experience</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats Cards Grid */}
            <div className="row g-3">
              <div className="col-sm-6 col-lg-3">
                <div
                  className="rounded-4 p-4 h-100"
                  style={{
                    background: "var(--bg-card, #0e1520)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="text-secondary small text-uppercase fw-bold mb-1" style={{ fontSize: "11px" }}>
                    WIN RATE
                  </div>
                  <div className="display-6 fw-black text-success font-space-grotesk mb-1">
                    {tipster.stats?.winRate || 78.4}%
                  </div>
                  <div className="text-secondary small">Verified accuracy</div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div
                  className="rounded-4 p-4 h-100"
                  style={{
                    background: "var(--bg-card, #0e1520)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="text-secondary small text-uppercase fw-bold mb-1" style={{ fontSize: "11px" }}>
                    TOTAL TIPS
                  </div>
                  <div className="display-6 fw-black text-white font-space-grotesk mb-1">
                    {totalTipsCount}
                  </div>
                  <div className="text-secondary small">Predictions published</div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div
                  className="rounded-4 p-4 h-100"
                  style={{
                    background: "var(--bg-card, #0e1520)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="text-secondary small text-uppercase fw-bold mb-1" style={{ fontSize: "11px" }}>
                    FOLLOWERS
                  </div>
                  <div className="display-6 fw-black text-white font-space-grotesk mb-1">
                    {(tipster.stats?.followersCount || 3420).toLocaleString()}
                  </div>
                  <div className="text-secondary small">Active subscribers</div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div
                  className="rounded-4 p-4 h-100"
                  style={{
                    background: "var(--bg-card, #0e1520)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="text-secondary small text-uppercase fw-bold mb-1" style={{ fontSize: "11px" }}>
                    TIPSTER RATING
                  </div>
                  <div className="display-6 fw-black text-warning font-space-grotesk mb-1">
                    {tipster.stats?.rating || 4.9} <i className="bi bi-star-fill fs-5"></i>
                  </div>
                  <div className="text-secondary small">Community score</div>
                </div>
              </div>
            </div>

            {/* Account Details & Social Media Info */}
            <div className="row g-4">
              <div className="col-lg-6">
                <div
                  className="rounded-4 p-4 h-100"
                  style={{
                    background: "var(--bg-card, #0e1520)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <h5 className="fw-bold text-white font-space-grotesk mb-3 pb-2 border-bottom border-secondary border-opacity-20 d-flex align-items-center gap-2" style={{ fontSize: "16px" }}>
                    <i className="bi bi-person-lines-fill text-success"></i>
                    <span>Profile Details</span>
                  </h5>

                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex justify-content-between align-items-center text-secondary small">
                      <span>Public Display Name:</span>
                      <span className="text-white fw-semibold">{tipster.displayName}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center text-secondary small">
                      <span>Username:</span>
                      <span className="text-white font-monospace">@{tipster.username}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center text-secondary small">
                      <span>Email Address:</span>
                      <span className="text-white">{tipster.email || "tipster@example.com"}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center text-secondary small">
                      <span>Country:</span>
                      <span className="text-white">{tipster.country || "United Kingdom"}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center text-secondary small">
                      <span>Experience:</span>
                      <span className="text-white">{tipster.yearsOfExperience}+ Years</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center text-secondary small">
                      <span>Subscription Plan:</span>
                      <span
                        className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold"
                        style={{
                          fontSize: "11px",
                          background: "rgba(34, 197, 94, 0.16)",
                          color: "#4ade80",
                          border: "1px solid rgba(34, 197, 94, 0.4)",
                        }}
                      >
                        {tipster.subscriptionPlan || "Quarterly"} (Active)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div
                  className="rounded-4 p-4 h-100"
                  style={{
                    background: "var(--bg-card, #0e1520)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <h5 className="fw-bold text-white font-space-grotesk mb-3 pb-2 border-bottom border-secondary border-opacity-20 d-flex align-items-center gap-2" style={{ fontSize: "16px" }}>
                    <i className="bi bi-share text-success"></i>
                    <span>Connected Social Channels</span>
                  </h5>

                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex justify-content-between align-items-center text-secondary small">
                      <span className="d-flex align-items-center gap-2">
                        <i className="bi bi-twitter-x text-light"></i> Twitter / X:
                      </span>
                      <span className="text-light fw-medium text-break" style={{ maxWidth: "240px" }}>
                        {tipster.socialLinks?.twitter ? tipster.socialLinks.twitter : <span className="text-muted">Not linked</span>}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center text-secondary small">
                      <span className="d-flex align-items-center gap-2">
                        <i className="bi bi-telegram text-info"></i> Telegram:
                      </span>
                      <span className="text-light fw-medium text-break" style={{ maxWidth: "240px" }}>
                        {tipster.socialLinks?.telegram ? tipster.socialLinks.telegram : <span className="text-muted">Not linked</span>}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center text-secondary small">
                      <span className="d-flex align-items-center gap-2">
                        <i className="bi bi-youtube text-danger"></i> YouTube:
                      </span>
                      <span className="text-light fw-medium text-break" style={{ maxWidth: "240px" }}>
                        {tipster.socialLinks?.youtube ? tipster.socialLinks.youtube : <span className="text-muted">Not linked</span>}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center text-secondary small">
                      <span className="d-flex align-items-center gap-2">
                        <i className="bi bi-instagram text-warning"></i> Instagram:
                      </span>
                      <span className="text-light fw-medium text-break" style={{ maxWidth: "240px" }}>
                        {tipster.socialLinks?.instagram ? tipster.socialLinks.instagram : <span className="text-muted">Not linked</span>}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="tipster-btn-outline rounded-pill w-100 py-2 text-center"
                      style={{ fontSize: "13px" }}
                    >
                      <i className="bi bi-pencil-square me-2 text-success"></i>
                      Update Social Links & Bio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================
             PROFILE EDIT MODE (Accessible via Edit Profile button)
             ============================================================ */
          <div
            className="rounded-4 p-4 p-md-5"
            style={{
              background: "var(--bg-card, #0e1520)",
              border: "1px solid var(--border-dark, rgba(255, 255, 255, 0.08))",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-secondary border-opacity-20 flex-wrap gap-2">
              <div>
                <h3 className="fw-bold text-white font-space-grotesk text-uppercase mb-1" style={{ fontSize: "20px" }}>
                  Edit Tipster Profile
                </h3>
                <p className="text-secondary small mb-0">
                  Update your display name, bio, sports coverage, and contact details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="tipster-btn-outline rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1"
                style={{ fontSize: "12px" }}
              >
                <i className="bi bi-x-lg"></i>
                <span>Cancel</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
              {/* Avatar Selector */}
              <div>
                <label className="form-label text-secondary small fw-bold mb-2">PROFILE AVATAR</label>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  {PRESET_AVATARS.map((av) => {
                    const isSel = formData.avatarUrl === av.url;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: av.url }))}
                        className="btn p-0 rounded-circle position-relative transition-all"
                        style={{
                          border: isSel ? "3px solid #22c55e" : "2px solid rgba(255,255,255,0.15)",
                          boxShadow: isSel ? "0 0 16px rgba(34, 197, 94, 0.45)" : "none",
                          transform: isSel ? "scale(1.08)" : "scale(1)",
                        }}
                      >
                        <img
                          src={av.url}
                          alt={av.label}
                          style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "50%", display: "block" }}
                        />
                        {isSel && (
                          <span
                            className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center bg-success text-white"
                            style={{ width: "18px", height: "18px", transform: "translate(20%, 20%)", border: "2px solid #070b12", fontSize: "11px" }}
                          >
                            <i className="bi bi-check"></i>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Names */}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">DISPLAY NAME (PUBLIC)</label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="form-control tipster-input"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">USERNAME</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="form-control tipster-input"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control tipster-input"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">MOBILE NUMBER</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="form-control tipster-input"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">YEARS OF EXPERIENCE</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    className="form-control tipster-input"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">COUNTRY</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="form-control tipster-input"
                  />
                </div>
              </div>

              {/* Sports Coverage */}
              <div>
                <label className="form-label text-secondary small fw-bold mb-2">PREFERRED SPORTS</label>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {SPORTS_OPTIONS.map((sp) => {
                    const isSel = formData.preferredSports.includes(sp);
                    return (
                      <button
                        key={sp}
                        type="button"
                        onClick={() => handleSportToggle(sp)}
                        className={`btn rounded-pill px-3 py-1 font-space-grotesk fw-semibold ${
                          isSel ? "bg-success text-white" : "bg-dark text-secondary border border-secondary border-opacity-25"
                        }`}
                        style={{ fontSize: "13px" }}
                      >
                        {sp} {isSel ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="form-label text-secondary small fw-bold mb-1">SHORT BIO & METHODOLOGY</label>
                <textarea
                  rows={3}
                  name="shortBio"
                  value={formData.shortBio}
                  onChange={handleInputChange}
                  className="form-control tipster-input"
                ></textarea>
              </div>

              {/* Social Links */}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">TWITTER / X</label>
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/..."
                    className="form-control tipster-input"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">TELEGRAM CHANNEL</label>
                  <input
                    type="text"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleInputChange}
                    placeholder="https://t.me/..."
                    className="form-control tipster-input"
                  />
                </div>
              </div>

              <div className="pt-3 border-top border-secondary border-opacity-20 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="tipster-btn-outline rounded-pill px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tipster-btn-primary rounded-pill px-5 py-2 font-space-grotesk"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
