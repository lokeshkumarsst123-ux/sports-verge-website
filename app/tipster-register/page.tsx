"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SportType, TipsterProfile } from "@/types/tipster";
import { saveStoredTipster, INITIAL_TIPSTERS } from "@/lib/tipster-store";

const SPORTS_OPTIONS: { id: SportType; label: string; icon: string; color: string }[] = [
  { id: "Cricket", label: "Cricket", icon: "bi-trophy", color: "#22c55e" },
  { id: "Football", label: "Football (Soccer)", icon: "bi-dribbble", color: "#3b82f6" },
  { id: "NFL", label: "NFL (American Football)", icon: "bi-shield", color: "#f59e0b" },
  { id: "AFL", label: "AFL (Australian Rules)", icon: "bi-fire", color: "#ec4899" },
];

const PRESET_AVATARS = [
  { id: "avatar-1", url: "/assets/imgs/players/Erling-Haaland.jpg", label: "Football Analyst" },
  { id: "avatar-2", url: "/assets/imgs/players/abhishek-sharma.jpg", label: "Cricket Analyst" },
  { id: "avatar-3", url: "/assets/imgs/players/Patrick-Mahomes.jpg", label: "NFL Analyst" },
  { id: "avatar-4", url: "/assets/imgs/players/Josh-Dunkley.jpg", label: "AFL Specialist" },
  { id: "avatar-5", url: "/assets/imgs/players/Ellyse-Perry.jpg", label: "Multi-Sport Pro" },
];

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "India",
  "Australia",
  "Canada",
  "Germany",
  "South Africa",
  "New Zealand",
  "United Arab Emirates",
  "Nigeria",
  "Ireland",
  "Singapore",
  "Other",
];

export default function TipsterRegisterPage() {
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const plan = params.get("plan");
      if (plan && ["monthly", "quarterly", "annual"].includes(plan.toLowerCase())) {
        return plan.toLowerCase();
      }
    }
    return "monthly";
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    username: "",
    email: "",
    mobileNumber: "",
    country: "United Kingdom",
    password: "",
    confirmPassword: "",
    preferredSports: ["Football"] as SportType[],
    yearsOfExperience: 3,
    shortBio: "",
    avatarUrl: "/assets/imgs/players/Erling-Haaland.jpg",
    twitter: "",
    telegram: "",
    youtube: "",
    instagram: "",
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setGlobalError(null);
  };

  const handleSportToggle = (sport: SportType) => {
    setFormData((prev) => {
      const exists = prev.preferredSports.includes(sport);
      if (exists) {
        if (prev.preferredSports.length === 1) return prev; // Keep at least one
        return { ...prev, preferredSports: prev.preferredSports.filter((s) => s !== sport) };
      } else {
        return { ...prev, preferredSports: [...prev.preferredSports, sport] };
      }
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.displayName.trim()) newErrors.displayName = "Display name is required";

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      newErrors.username = "Username must be 3-20 alphanumeric characters (or _)";
    } else {
      const isTaken = INITIAL_TIPSTERS.some(
        (t) => t.username.toLowerCase() === formData.username.toLowerCase()
      );
      if (isTaken) newErrors.username = "This username is already taken by another tipster";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else {
      const isEmailTaken = INITIAL_TIPSTERS.some(
        (t) => t.email.toLowerCase() === formData.email.toLowerCase()
      );
      if (isEmailTaken) newErrors.email = "An account with this email already exists";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.preferredSports.length === 0) {
      newErrors.preferredSports = "Please select at least one preferred sport";
    }

    if (!formData.shortBio.trim()) {
      newErrors.shortBio = "Short bio/experience summary is required";
    } else if (formData.shortBio.trim().length < 20) {
      newErrors.shortBio = "Bio must be at least 20 characters";
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must agree to the Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setGlobalError(null);

    try {
      const newTipster: TipsterProfile = {
        id: `tipster-${Date.now()}`,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        displayName: formData.displayName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        country: formData.country,
        preferredSports: formData.preferredSports,
        yearsOfExperience: Number(formData.yearsOfExperience) || 1,
        shortBio: formData.shortBio.trim(),
        avatarUrl: formData.avatarUrl,
        socialLinks: {
          twitter: formData.twitter ? `https://twitter.com/${formData.twitter.replace("@", "")}` : undefined,
          telegram: formData.telegram ? `https://t.me/${formData.telegram.replace("@", "")}` : undefined,
          youtube: formData.youtube || undefined,
          instagram: formData.instagram || undefined,
        },
        subscriptionStatus: "pending",
        verificationStatus: "verified",
        stats: {
          totalTips: 0,
          winRate: 0,
          roi: 0,
          profitUnits: 0,
          followersCount: 0,
          rating: 5.0,
        },
        createdAt: new Date().toISOString(),
      };

      saveStoredTipster(newTipster);

      setTimeout(() => {
        router.push(`/tipster-subscription?plan=${selectedPlan}&tipsterId=${newTipster.id}`);
      }, 700);
    } catch {
      setIsSubmitting(false);
      setGlobalError("Failed to register tipster account. Please try again.");
    }
  };

  return (
    <main className="font-outfit text-white py-5" style={{ background: "var(--bg-dark, #070b12)" }}>
      <div className="container custom-container" style={{ maxWidth: "860px" }}>
        {/* Step Flow Header */}
        <div className="text-center mb-4">
        
         

          <h1
            className="fw-black text-white font-space-grotesk text-uppercase mb-2"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}
          >
            Tipster Registration
          </h1>
          <p className="text-secondary mx-auto mb-0" style={{ maxWidth: "560px", fontSize: "14px" }}>
            Create your official sports handicapper profile. Once registered, activate your Stripe subscription to publish live predictions.
          </p>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger rounded-3 p-3 mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {globalError}
          </div>
        )}

        {/* Registration Form Card */}
        <div
          className="rounded-4 p-4 p-md-5"
          style={{
            background: "var(--bg-card, #0e1520)",
            border: "1px solid var(--border-dark, rgba(255, 255, 255, 0.08))",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
          }}
        >
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
            {/* SECTION 1: Personal Information */}
            <div>
              <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom border-secondary border-opacity-20">
                <i className="bi bi-person-badge-fill text-success" style={{ fontSize: "18px" }}></i>
                <h5 className="fw-bold text-white font-space-grotesk mb-0" style={{ fontSize: "16px" }}>
                  1. Personal Information
                </h5>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">FIRST NAME *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="e.g. Alex"
                    className={`form-control tipster-input ${
                      errors.firstName ? "border-danger" : ""
                    }`}
                  />
                  {errors.firstName && <div className="text-danger small mt-1">{errors.firstName}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">LAST NAME *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="e.g. Vance"
                    className={`form-control tipster-input ${
                      errors.lastName ? "border-danger" : ""
                    }`}
                  />
                  {errors.lastName && <div className="text-danger small mt-1">{errors.lastName}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">
                    DISPLAY NAME (PUBLIC BRAND) *
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="e.g. ApexPredictor Pro"
                    className={`form-control tipster-input ${
                      errors.displayName ? "border-danger" : ""
                    }`}
                  />
                  {errors.displayName && <div className="text-danger small mt-1">{errors.displayName}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">USERNAME (HANDLE) *</label>
                  <div
                    className="d-flex align-items-center rounded-3 transition-all"
                    style={{
                      background: "#090e17",
                      border: errors.username
                        ? "1px solid #ef4444"
                        : "1px solid rgba(255, 255, 255, 0.12)",
                      height: "44px",
                    }}
                  >
                    <span
                      className="ps-3 pe-1 text-success fw-bold font-space-grotesk select-none"
                      style={{ userSelect: "none", fontSize: "15px" }}
                    >
                      @
                    </span>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="apex_picks"
                      className="form-control bg-transparent text-white border-0 shadow-none ps-1 pe-3"
                      style={{ height: "100%", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                  {errors.username && <div className="text-danger small mt-1">{errors.username}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="alex.vance@example.com"
                    className={`form-control tipster-input ${
                      errors.email ? "border-danger" : ""
                    }`}
                  />
                  {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">MOBILE NUMBER</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="+44 7123 456789"
                    className="form-control tipster-input"
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label text-secondary small fw-bold mb-1">COUNTRY OF RESIDENCE *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="form-select tipster-select"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">PASSWORD *</label>
                  <div
                    className="d-flex align-items-center rounded-3 transition-all"
                    style={{
                      background: "#090e17",
                      border: errors.password
                        ? "1px solid #ef4444"
                        : "1px solid rgba(255, 255, 255, 0.12)",
                      height: "44px",
                    }}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="form-control bg-transparent text-white border-0 shadow-none px-3"
                      style={{ height: "100%", outline: "none", fontSize: "14px" }}
                    />
                    <button
                      type="button"
                      className="btn bg-transparent border-0 text-secondary pe-3 ps-2 d-flex align-items-center h-100"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ color: "#94a3b8" }}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} style={{ fontSize: "16px" }}></i>
                    </button>
                  </div>
                  {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold mb-1">CONFIRM PASSWORD *</label>
                  <div
                    className="d-flex align-items-center rounded-3 transition-all"
                    style={{
                      background: "#090e17",
                      border: errors.confirmPassword
                        ? "1px solid #ef4444"
                        : "1px solid rgba(255, 255, 255, 0.12)",
                      height: "44px",
                    }}
                  >
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="form-control bg-transparent text-white border-0 shadow-none px-3"
                      style={{ height: "100%", outline: "none", fontSize: "14px" }}
                    />
                    <button
                      type="button"
                      className="btn bg-transparent border-0 text-secondary pe-3 ps-2 d-flex align-items-center h-100"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ color: "#94a3b8" }}
                    >
                      <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`} style={{ fontSize: "16px" }}></i>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="text-danger small mt-1">{errors.confirmPassword}</div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: Professional Information */}
            <div>
              <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom border-secondary border-opacity-20">
                <i className="bi bi-award-fill text-success" style={{ fontSize: "18px" }}></i>
                <h5 className="fw-bold text-white font-space-grotesk mb-0" style={{ fontSize: "16px" }}>
                  2. Professional Sports Expertise
                </h5>
              </div>

              {/* Preferred Sports */}
              <div className="mb-4">
                <label className="form-label text-secondary small fw-bold mb-2">
                  PREFERRED SPORTS COVERAGE *
                </label>
                <div className="row g-2">
                  {SPORTS_OPTIONS.map((sport) => {
                    const isSelected = formData.preferredSports.includes(sport.id);
                    return (
                      <div key={sport.id} className="col-6 col-md-3">
                        <button
                          type="button"
                          onClick={() => handleSportToggle(sport.id)}
                          className="btn w-100 text-start d-flex align-items-center justify-content-between p-3 rounded-3 transition-all"
                          style={{
                            background: isSelected ? "rgba(34, 197, 94, 0.16)" : "rgba(255, 255, 255, 0.03)",
                            border: isSelected ? "2px solid #22c55e" : "1px solid rgba(255, 255, 255, 0.1)",
                            color: isSelected ? "#ffffff" : "#94a3b8",
                            boxShadow: isSelected ? "0 4px 14px rgba(34, 197, 94, 0.2)" : "none",
                          }}
                        >
                          <span className="fw-semibold" style={{ fontSize: "13px" }}>
                            {sport.label}
                          </span>
                          <span
                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                            style={{
                              width: "24px",
                              height: "24px",
                              background: isSelected ? "#22c55e" : "transparent",
                              border: isSelected ? "none" : "2px solid rgba(255, 255, 255, 0.3)",
                              color: "#ffffff",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {isSelected && (
                              <i className="bi bi-check-lg" style={{ fontSize: "14px", fontWeight: "900" }}></i>
                            )}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                {errors.preferredSports && (
                  <div className="text-danger small mt-1">{errors.preferredSports}</div>
                )}
              </div>

              {/* Experience & Avatar */}
              <div className="row g-3 mb-3">
                <div className="col-md-5">
                  <label className="form-label text-secondary small fw-bold mb-1">
                    YEARS OF ANALYTICAL EXPERIENCE *
                  </label>
                  <select
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    className="form-select tipster-select"
                  >
                    <option value={1}>1 Year</option>
                    <option value={2}>2 Years</option>
                    <option value={3}>3 - 4 Years</option>
                    <option value={5}>5 - 7 Years</option>
                    <option value={8}>8 - 10 Years</option>
                    <option value={10}>10+ Years (Master Handicapper)</option>
                  </select>
                </div>

                <div className="col-md-7">
                  <label className="form-label text-secondary small fw-bold mb-1">
                    SELECT PROFILE AVATAR (DUMMY PROFILES)
                  </label>
                  <div className="d-flex align-items-center gap-2 flex-wrap pt-1">
                    {PRESET_AVATARS.map((av) => {
                      const isAvSelected = formData.avatarUrl === av.url;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          title={av.label}
                          onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: av.url }))}
                          className="btn p-0 rounded-circle position-relative transition-all"
                          style={{
                            border: isAvSelected ? "3px solid #22c55e" : "2px solid rgba(255,255,255,0.15)",
                            boxShadow: isAvSelected ? "0 0 16px rgba(34, 197, 94, 0.45)" : "none",
                            transform: isAvSelected ? "scale(1.08)" : "scale(1)",
                          }}
                        >
                          <img
                            src={av.url}
                            alt={av.label}
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "cover",
                              borderRadius: "50%",
                              display: "block",
                            }}
                          />
                          {isAvSelected && (
                            <span
                              className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center bg-success text-white"
                              style={{
                                width: "18px",
                                height: "18px",
                                transform: "translate(20%, 20%)",
                                border: "2px solid #070b12",
                                fontSize: "11px",
                              }}
                            >
                              <i className="bi bi-check"></i>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label text-secondary small fw-bold mb-1">
                    SHORT BIO & SPECIALTY (PUBLIC) *
                  </label>
                  <textarea
                    name="shortBio"
                    rows={3}
                    value={formData.shortBio}
                    onChange={handleInputChange}
                    placeholder="Describe your sports analysis methodology, leagues covered, statistical models used, and betting discipline..."
                    className={`form-control tipster-input ${
                      errors.shortBio ? "border-danger" : ""
                    }`}
                  ></textarea>
                  <div className="d-flex justify-content-between text-secondary small mt-1">
                    <span>{errors.shortBio && <span className="text-danger">{errors.shortBio}</span>}</span>
                    <span>{formData.shortBio.length}/400 chars</span>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <label className="form-label text-secondary small fw-bold mb-2">
                SOCIAL MEDIA & COMMUNITY CHANNELS (OPTIONAL)
              </label>
              <div className="row g-2">
                <div className="col-md-6">
                  <div
                    className="d-flex align-items-center rounded-3 transition-all"
                    style={{
                      background: "#090e17",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      height: "44px",
                    }}
                  >
                    <span className="ps-3 pe-1 text-secondary" style={{ fontSize: "15px" }}>
                      <i className="bi bi-twitter-x"></i>
                    </span>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      placeholder="Twitter / X username"
                      className="form-control bg-transparent text-white border-0 shadow-none ps-2 pe-3"
                      style={{ height: "100%", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="d-flex align-items-center rounded-3 transition-all"
                    style={{
                      background: "#090e17",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      height: "44px",
                    }}
                  >
                    <span className="ps-3 pe-1 text-secondary" style={{ fontSize: "15px" }}>
                      <i className="bi bi-telegram"></i>
                    </span>
                    <input
                      type="text"
                      name="telegram"
                      value={formData.telegram}
                      onChange={handleInputChange}
                      placeholder="Telegram username / channel"
                      className="form-control bg-transparent text-white border-0 shadow-none ps-2 pe-3"
                      style={{ height: "100%", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Submit */}
            <div className="pt-2 border-top border-secondary border-opacity-20">
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  id="termsCheck"
                  className="form-check-input"
                />
                <label className="form-check-label text-secondary small" htmlFor="termsCheck">
                  I confirm that all provided information is accurate and I accept the SportsVerge{" "}
                  <Link href="/terms-of-use" className="text-success text-decoration-none">
                    Tipster Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="text-success text-decoration-none">
                    Privacy Policy
                  </Link>
                  .
                </label>
                {errors.termsAccepted && (
                  <div className="text-danger small mt-1">{errors.termsAccepted}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="tipster-btn-primary w-100 py-3 rounded-pill text-uppercase font-space-grotesk fw-bold d-flex align-items-center justify-content-center gap-2"
                style={{
                  fontSize: "15px",
                  letterSpacing: "0.03em",
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Registering Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register as Tipster</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>

              <div className="text-center mt-3">
                <span className="text-secondary small">Already registered as a Tipster? </span>
                <Link href="/tipster/dashboard" className="text-success text-decoration-none small fw-semibold">
                  Open Tipster Dashboard
                </Link>
                <span className="text-secondary small mx-2">•</span>
                <Link href="/tipster-subscription" className="text-secondary text-decoration-none small hover-text-success">
                  Activate Subscription
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
