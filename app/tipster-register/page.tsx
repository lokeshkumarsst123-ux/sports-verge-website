"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SportType } from "@/types/tipster";
import {
  hasAuthSession,
  apiErrorMessage,
  apiFieldErrors,
} from "@/lib/auth-api";
import { tipsterApi } from "@/lib/tipster-api";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [checking, setChecking] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const selectPhoto = (file?: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((prev) => ({ ...prev, photo: "Choose a JPG, PNG or WebP photo up to 2 MB." }));
      return;
    }
    setErrors((prev) => ({ ...prev, photo: "" }));
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    let active = true;
    if (!hasAuthSession()) {
      router.replace("/login?next=" + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }
    tipsterApi
      .me()
      .then(({ profile }) => {
        if (!active) return;
        if (profile) {
          router.replace(
            profile.subscriptionStatus === "active" ? "/tipster/dashboard" : "/tipster-subscription"
          );
        } else {
          setChecking(false);
        }
      })
      .catch((e) => {
        if (active) {
          setGlobalError(apiErrorMessage(e));
          setChecking(false);
        }
      });
    return () => {
      active = false;
    };
  }, [router]);

  const [selectedPlan] = useState<string>(() => {
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
    displayName: "",
    username: "",
    mobileNumber: "",
    country: "United Kingdom",
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.displayName.trim()) newErrors.displayName = "Display name is required";

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      newErrors.username = "Username must be 3-20 alphanumeric characters (or _)";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setGlobalError(null);

    try {
      const body = {
        ...formData,
        acceptTerms: formData.termsAccepted,
        socialLinks: {
          twitter: formData.twitter ? `https://twitter.com/${formData.twitter.replace("@", "")}` : undefined,
          telegram: formData.telegram ? `https://t.me/${formData.telegram.replace("@", "")}` : undefined,
          youtube: formData.youtube || undefined,
          instagram: formData.instagram || undefined,
        },
      };

      await tipsterApi.createProfile(body, photo);
      router.push(`/tipster-subscription?plan=${selectedPlan}`);
    } catch (error) {
      setErrors(apiFieldErrors(error));
      setGlobalError(apiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checking) {
    return (
      <main
        className="font-outfit min-vh-100 d-flex align-items-center justify-content-center py-5"
        style={{ background: "#FFFDF9", color: "#1C1F22" }}
      >
        <div className="text-center p-4">
          <div className="spinner-border text-warning mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="fw-semibold mb-0" style={{ color: "#4B5563" }}>
            Checking your Tipster profile status...
          </p>
          {globalError && (
            <div role="alert" className="alert alert-danger mt-3 mb-0">
              {globalError}
              <button
                type="button"
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  const activeAvatarPreview = photoPreview || formData.avatarUrl || "/assets/imgs/players/Erling-Haaland.jpg";

  return (
    <main className="font-outfit py-5" style={{ background: "#FFFDF9", color: "#1C1F22", minHeight: "100vh" }}>
      <div className="container custom-container" style={{ maxWidth: "860px" }}>
        {/* Step Flow Header */}
        <div className="text-center mb-4">
          <h1
            className="fw-black font-space-grotesk text-uppercase mb-2"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", color: "#1C1F22" }}
          >
            Set Up Your Tipster Profile
          </h1>
          <p className="mx-auto mb-0" style={{ maxWidth: "560px", fontSize: "14px", color: "#4B5563" }}>
            Add your sports handicapper expertise to your account. Once registered, activate your Stripe subscription to publish verified predictions.
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
            background: "#FFFFFF",
            border: "1px solid #EAE5DC",
            boxShadow: "0 10px 40px rgba(28, 31, 34, 0.05)",
            borderRadius: "24px",
          }}
        >
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
            {/* SECTION 1: Personal & Brand Information */}
            <div>
              <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
                <i className="bi bi-person-badge-fill text-warning" style={{ fontSize: "18px" }}></i>
                <h5 className="fw-bold font-space-grotesk mb-0" style={{ fontSize: "16px", color: "#1C1F22" }}>
                  1. Brand & Personal Information
                </h5>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold mb-1" style={{ color: "#374151" }}>
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
                  <label className="form-label small fw-bold mb-1" style={{ color: "#374151" }}>USERNAME (HANDLE) *</label>
                  <div
                    className="d-flex align-items-center rounded-3 transition-all"
                    style={{
                      background: "#fff",
                      border: errors.username ? "1px solid #ef4444" : "1px solid #EAE5DC",
                      height: "44px",
                    }}
                  >
                    <span
                      className="ps-3 pe-1 fw-bold font-space-grotesk select-none"
                      style={{ userSelect: "none", fontSize: "15px", color: "#D97706" }}
                    >
                      @
                    </span>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="apex_picks"
                      className="form-control bg-transparent border-0 shadow-none ps-1 pe-3"
                      style={{ height: "100%", outline: "none", fontSize: "14px", color: "#1C1F22" }}
                    />
                  </div>
                  {errors.username && <div className="text-danger small mt-1">{errors.username}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold mb-1" style={{ color: "#374151" }}>MOBILE NUMBER</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="+44 7123 456789"
                    className="form-control tipster-input"
                  />
                  {errors.mobileNumber && <div className="text-danger small mt-1">{errors.mobileNumber}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold mb-1" style={{ color: "#374151" }}>COUNTRY OF RESIDENCE *</label>
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
                  {errors.country && <div className="text-danger small mt-1">{errors.country}</div>}
                </div>
              </div>
            </div>

            {/* SECTION 2: Professional Information */}
            <div>
              <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
                <i className="bi bi-award-fill text-warning" style={{ fontSize: "18px" }}></i>
                <h5 className="fw-bold font-space-grotesk mb-0" style={{ fontSize: "16px", color: "#1C1F22" }}>
                  2. Professional Sports Expertise & Avatar
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
                          className="btn w-100 text-start d-flex align-items-center justify-content-between p-2 p-sm-3 rounded-3 transition-all"
                          style={{
                            background: isSelected ? "rgba(255, 204, 0, 0.15)" : "#fff",
                            border: isSelected ? "2px solid #FFCC00" : "1px solid #EAE5DC",
                            color: isSelected ? "#1C1F22" : "#374151",
                            boxShadow: isSelected ? "0 4px 14px rgba(255, 204, 0, 0.2)" : "none",
                            minHeight: "56px",
                          }}
                        >
                          <span className="fw-semibold" style={{ fontSize: "12px", lineHeight: "1.3" }}>
                            {sport.label}
                          </span>
                          <span
                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 ms-1"
                            style={{
                              width: "22px",
                              height: "22px",
                              background: isSelected ? "#FFCC00" : "transparent",
                              border: isSelected ? "none" : "2px solid #D1D5DB",
                              color: "#1C1F22",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {isSelected && (
                              <i className="bi bi-check-lg" style={{ fontSize: "13px", fontWeight: "900" }}></i>
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

              {/* Experience & Avatar Upload */}
              <div className="row g-3 mb-3">
                <div className="col-md-5">
                  <label className="form-label small fw-bold mb-1" style={{ color: "#374151" }}>
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
                  <label className="form-label small fw-bold mb-1" style={{ color: "#374151" }}>
                    PROFILE PHOTO / AVATAR
                  </label>
                  <div className="d-flex align-items-center gap-3 flex-wrap pt-1">
                    {/* Live Preview Avatar */}
                    <div className="position-relative">
                      <img
                        src={activeAvatarPreview}
                        alt="Avatar preview"
                        style={{
                          width: "54px",
                          height: "54px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          border: "3px solid #FFCC00",
                          boxShadow: "0 4px 12px rgba(255, 204, 0, 0.3)",
                        }}
                      />
                    </div>

                    {/* Upload Custom Photo Button */}
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/webp"
                        className="d-none"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) selectPhoto(file);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-sm btn-outline-dark rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-2"
                        style={{ fontSize: "13px" }}
                      >
                        <i className="bi bi-cloud-arrow-up"></i>
                        <span>Upload Photo</span>
                      </button>
                      <div className="text-muted small fs-11 mt-1">JPG, PNG or WebP up to 2MB</div>
                    </div>

                    {/* Presets */}
                    <div className="d-flex align-items-center gap-2 flex-wrap ms-md-auto">
                      {PRESET_AVATARS.map((av) => {
                        const isAvSelected = !photo && formData.avatarUrl === av.url;
                        return (
                          <button
                            key={av.id}
                            type="button"
                            title={av.label}
                            onClick={() => {
                              setPhoto(null);
                              setPhotoPreview("");
                              setFormData((prev) => ({ ...prev, avatarUrl: av.url }));
                            }}
                            className="btn p-0 rounded-circle position-relative transition-all"
                            style={{
                              border: isAvSelected ? "2.5px solid #FFCC00" : "1.5px solid #EAE5DC",
                              transform: isAvSelected ? "scale(1.08)" : "scale(1)",
                            }}
                          >
                            <img
                              src={av.url}
                              alt={av.label}
                              style={{
                                width: "36px",
                                height: "36px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                display: "block",
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {errors.photo && <div className="text-danger small mt-1">{errors.photo}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold mb-1" style={{ color: "#374151" }}>
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
                      background: "#fff",
                      border: "1px solid #EAE5DC",
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
                      className="form-control bg-transparent border-0 shadow-none ps-2 pe-3"
                      style={{ height: "100%", outline: "none", fontSize: "14px", color: "#1C1F22" }}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="d-flex align-items-center rounded-3 transition-all"
                    style={{
                      background: "#fff",
                      border: "1px solid #EAE5DC",
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
                      className="form-control bg-transparent border-0 shadow-none ps-2 pe-3"
                      style={{ height: "100%", outline: "none", fontSize: "14px", color: "#1C1F22" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Submit */}
            <div className="pt-3 border-top border-secondary border-opacity-20">
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    id="termsCheck"
                    className="form-check-input m-0 flex-shrink-0"
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      accentColor: "#FFCC00",
                      float: "none",
                      marginLeft: 0,
                    }}
                  />
                  <label
                    className="text-secondary small m-0 user-select-none"
                    htmlFor="termsCheck"
                    style={{ cursor: "pointer", lineHeight: 1.4, fontSize: "13px" }}
                  >
                    I confirm that all provided information is accurate and I accept the SportsVerge{" "}
                    <Link href="/terms-of-use" className="text-decoration-none fw-semibold" style={{ color: "#0284c7" }}>
                      Tipster Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="text-decoration-none fw-semibold" style={{ color: "#0284c7" }}>
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
                {errors.termsAccepted && (
                  <div className="text-danger small mt-1 ms-4 ps-1">{errors.termsAccepted}</div>
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
                <span className="small" style={{ color: "#6B7280" }}>Already registered as a Tipster? </span>
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
