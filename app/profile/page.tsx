"use client";

import TipsterProfileEditor from "@/components/TipsterProfileEditor";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/components/FavoritesContext";
import { apiErrorMessage, apiFieldErrors, authApi, clearAuthSession, getStoredUser, logoutUser, updateStoredUser } from "@/lib/auth-api";
import { FixtureItem, ResultItem } from "@/types";
import { cricketApi, mapCricketFixture, mapCricketResult } from "@/lib/cricket-api";
import { mapNflFixture, mapNflResult, mapSoccerFixture, mapSoccerResult, nflApi, soccerApi } from "@/lib/sports-api";

export default function ProfileDashboard() {
  const router = useRouter();
  const {
    favoriteTeams,
    removeFavoriteTeam,
    isFavoriteTeam
  } = useFavorites();

  const [accountEmail, setAccountEmail] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pwdErrors, setPwdErrors] = useState<{ [key: string]: string }>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [pwdSuccessMsg, setPwdSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  // Personalized feed filter
  const [feedTab, setFeedTab] = useState<"fixtures" | "results">("fixtures");
  const [userFixtures, setUserFixtures] = useState<FixtureItem[]>([]);
  const [userResults, setUserResults] = useState<ResultItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const loadFeed = async () => {
      const fixtureResponses = await Promise.allSettled([cricketApi.matches("fixture"), soccerApi.matches("fixture"), nflApi.matches("fixture")]);
      const resultResponses = await Promise.allSettled([cricketApi.matches("result"), soccerApi.matches("result"), nflApi.matches("result")]);
      const fixtures = fixtureResponses.flatMap((response, index) => {
        if (response.status !== "fulfilled") return [];
        if (index === 0) return response.value.map((raw) => { const item = mapCricketFixture(raw); return { ...item, type: "cricket", date: item.date, sport: "Cricket" } as FixtureItem; });
        return response.value.map(index === 1 ? mapSoccerFixture : mapNflFixture);
      });
      const results = resultResponses.flatMap((response, index) => {
        if (response.status !== "fulfilled") return [];
        if (index === 0) return response.value.map((raw) => { const item = mapCricketResult(raw); return { ...item, type: "cricket", score: `${item.homeScore} - ${item.awayScore}` } as ResultItem; });
        return response.value.map(index === 1 ? mapSoccerResult : mapNflResult);
      });
      if (!cancelled) { setUserFixtures(fixtures.filter((fixture) => isFavoriteTeam(fixture.home) || isFavoriteTeam(fixture.away))); setUserResults(results.filter((result) => isFavoriteTeam(result.home) || isFavoriteTeam(result.away))); }
    };
    void loadFeed();
    return () => { cancelled = true; };
  }, [isFavoriteTeam]);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      if (!getStoredUser()) {
        router.replace("/login");
        return;
      }

      try {
        const response = await authApi.getProfile();
        if (cancelled) return;
        const user = response.data.user;
        setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email });
        updateStoredUser(user);
        setAccountEmail(user.email);
      } catch (error) {
        if (!cancelled) {
          if (error instanceof Error && "status" in error && (error as { status?: number }).status === 401) {
            clearAuthSession();
            router.replace("/login");
          } else {
            setProfileError(apiErrorMessage(error));
          }
        }
      } finally {
        if (!cancelled) setIsProfileLoading(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = "Current Password is required.";
    if (!passwordData.newPassword) newErrors.newPassword = "New Password is required.";
    else if (passwordData.newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters long.";
    if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setPwdErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSuccessMsg("");
    if (validatePasswordForm()) {
      setIsPasswordLoading(true);
      try {
        await authApi.changePassword(passwordData);
        setPwdSuccessMsg("Password successfully updated!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setPwdSuccessMsg(""), 3000);
      } catch (error) {
        setPwdErrors(apiFieldErrors(error));
        setPwdSuccessMsg(apiErrorMessage(error));
      } finally {
        setIsPasswordLoading(false);
      }
    }
  };

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    if (validateForm()) {
      setIsAccountLoading(true);
      try {
        const response = await authApi.updateProfile(formData);
        setFormData({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
        });
        updateStoredUser(response.data.user);
        setAccountEmail(response.data.user.email);
        setSuccessMsg("Account information successfully updated!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } catch (error) {
        setErrors(apiFieldErrors(error));
        setSuccessMsg(apiErrorMessage(error));
      } finally {
        setIsAccountLoading(false);
      }
    }
  };


  const getMatchLink = (match: FixtureItem | ResultItem) => {
    if (!match.id) return "/live-scores";
    return `/live-scores/${match.id}${match.type === "football" ? "?sport=football" : match.type === "NFL" ? "?sport=nfl" : ""}`;
  };

  if (isProfileLoading) {
    return (
      <div className="container py-5 min-h-80vh text-center d-flex align-items-center justify-content-center">
        <div className="spinner-border" style={{ color: "#FFCC00", width: "2.5rem", height: "2.5rem" }} role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container py-5 min-h-80vh">
        <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger rounded-4 p-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {profileError}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-lg-5 min-h-80vh font-outfit">
      {/* Top Header Bar */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 pb-2 gap-3">
        <div>
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2 font-space-grotesk fw-bold"
            style={{
              background: "rgba(255, 204, 0, 0.15)",
              border: "1px solid rgba(255, 204, 0, 0.35)",
              fontSize: "11px",
              color: "#1C1F22",
              letterSpacing: "0.5px"
            }}
          >
            <i className="bi bi-person-badge-fill text-warning"></i>
            <span>ACCOUNT SETTINGS</span>
          </div>
          <h1 className="fw-black font-space-grotesk text-uppercase mb-1" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#1C1F22" }}>
            Profile Dashboard
          </h1>
          <p className="mb-0" style={{ color: "#5C646D", fontSize: "14px" }}>
            Manage your account, customize favorites, and view your personalized sports feed.
          </p>
        </div>
        <button
          onClick={() => {
            void logoutUser().then(() => router.push("/"));
          }}
          className="btn px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
          style={{
            background: "#FFFFFF",
            border: "1px solid #FCA5A5",
            color: "#DC2626",
            borderRadius: "10px",
            fontSize: "14px",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 6px rgba(220, 38, 38, 0.08)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#DC2626";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.borderColor = "#DC2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#FFFFFF";
            e.currentTarget.style.color = "#DC2626";
            e.currentTarget.style.borderColor = "#FCA5A5";
          }}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>

      <div className="row g-4">
        {/* Left Column: Manage account information and password */}
        <div className="col-lg-8">
          {/* Account Info Card */}
          <div
            className="card border-0 rounded-4 mb-4 profile-card overflow-hidden"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE5DC",
              boxShadow: "0 4px 20px rgba(28, 31, 34, 0.04)"
            }}
          >
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom" style={{ borderColor: "#EAE5DC" }}>
                <span style={{ width: "4px", height: "20px", background: "#FFCC00", borderRadius: "2px", display: "inline-block" }}></span>
                <h5 className="fw-bold font-space-grotesk mb-0" style={{ color: "#1C1F22", fontSize: "1.15rem" }}>
                  Manage Account Information
                </h5>
              </div>

              {successMsg && (
                <div
                  className="alert border-0 py-2.5 px-3 small rounded-3 mb-4 d-flex align-items-center gap-2"
                  style={{ background: "rgba(34, 197, 94, 0.12)", color: "#166534", border: "1px solid rgba(34, 197, 94, 0.25)" }}
                >
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleAccountUpdate}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label text-uppercase mb-1" style={{ fontSize: "11px", fontWeight: 700, color: "#1C1F22", letterSpacing: "0.5px" }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      style={{
                        backgroundColor: "#FFFFFF",
                        color: "#1C1F22",
                        border: "1px solid #EAE5DC",
                        borderRadius: "10px",
                        padding: "11px 16px",
                        fontSize: "14px",
                        fontWeight: 500
                      }}
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    {errors.firstName && <div className="invalid-feedback d-block small mt-1">{errors.firstName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-uppercase mb-1" style={{ fontSize: "11px", fontWeight: 700, color: "#1C1F22", letterSpacing: "0.5px" }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      style={{
                        backgroundColor: "#FFFFFF",
                        color: "#1C1F22",
                        border: "1px solid #EAE5DC",
                        borderRadius: "10px",
                        padding: "11px 16px",
                        fontSize: "14px",
                        fontWeight: 500
                      }}
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                    {errors.lastName && <div className="invalid-feedback d-block small mt-1">{errors.lastName}</div>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-uppercase mb-1" style={{ fontSize: "11px", fontWeight: 700, color: "#1C1F22", letterSpacing: "0.5px" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    style={{
                      backgroundColor: "#FFFFFF",
                      color: "#1C1F22",
                      border: "1px solid #EAE5DC",
                      borderRadius: "10px",
                      padding: "11px 16px",
                      fontSize: "14px",
                      fontWeight: 500
                    }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <div className="invalid-feedback d-block small mt-1">{errors.email}</div>}
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                  disabled={isAccountLoading}
                  style={{
                    backgroundColor: "#FFCC00",
                    color: "#1C1F22",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 24px",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                    cursor: isAccountLoading ? "not-allowed" : "pointer",
                    boxShadow: "0 2px 8px rgba(255, 204, 0, 0.25)"
                  }}
                  onMouseEnter={(e) => {
                    if (!isAccountLoading) e.currentTarget.style.backgroundColor = "#E6B800";
                  }}
                  onMouseLeave={(e) => {
                    if (!isAccountLoading) e.currentTarget.style.backgroundColor = "#FFCC00";
                  }}
                >
                  {isAccountLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Password Card */}
          <div
            className="card border-0 rounded-4 mb-4 profile-card overflow-hidden"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE5DC",
              boxShadow: "0 4px 20px rgba(28, 31, 34, 0.04)"
            }}
          >
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom" style={{ borderColor: "#EAE5DC" }}>
                <span style={{ width: "4px", height: "20px", background: "#FFCC00", borderRadius: "2px", display: "inline-block" }}></span>
                <h5 className="fw-bold font-space-grotesk mb-0" style={{ color: "#1C1F22", fontSize: "1.15rem" }}>
                  Change Password
                </h5>
              </div>

              {pwdSuccessMsg && (
                <div
                  className="alert border-0 py-2.5 px-3 small rounded-3 mb-4 d-flex align-items-center gap-2"
                  style={{ background: "rgba(34, 197, 94, 0.12)", color: "#166534", border: "1px solid rgba(34, 197, 94, 0.25)" }}
                >
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{pwdSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-3">
                  <label className="form-label text-uppercase mb-1" style={{ fontSize: "11px", fontWeight: 700, color: "#1C1F22", letterSpacing: "0.5px" }}>
                    Current Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control pe-5 ${pwdErrors.currentPassword ? 'is-invalid' : ''}`}
                      style={{
                        backgroundColor: "#FFFFFF",
                        color: "#1C1F22",
                        border: "1px solid #EAE5DC",
                        borderRadius: "10px",
                        padding: "11px 16px",
                        fontSize: "14px",
                        fontWeight: 500
                      }}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="btn position-absolute top-50 end-0 translate-middle-y border-0 px-3"
                      style={{ color: "#76808D" }}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide current password" : "Show current password"}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                  {pwdErrors.currentPassword && <div className="invalid-feedback d-block small mt-1">{pwdErrors.currentPassword}</div>}
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-uppercase mb-1" style={{ fontSize: "11px", fontWeight: 700, color: "#1C1F22", letterSpacing: "0.5px" }}>
                      New Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className={`form-control pe-5 ${pwdErrors.newPassword ? 'is-invalid' : ''}`}
                        style={{
                          backgroundColor: "#FFFFFF",
                          color: "#1C1F22",
                          border: "1px solid #EAE5DC",
                          borderRadius: "10px",
                          padding: "11px 16px",
                          fontSize: "14px",
                          fontWeight: 500
                        }}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y border-0 px-3"
                        style={{ color: "#76808D" }}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                      >
                        <i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                    {pwdErrors.newPassword && <div className="invalid-feedback d-block small mt-1">{pwdErrors.newPassword}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-uppercase mb-1" style={{ fontSize: "11px", fontWeight: 700, color: "#1C1F22", letterSpacing: "0.5px" }}>
                      Confirm Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={`form-control pe-5 ${pwdErrors.confirmPassword ? 'is-invalid' : ''}`}
                        style={{
                          backgroundColor: "#FFFFFF",
                          color: "#1C1F22",
                          border: "1px solid #EAE5DC",
                          borderRadius: "10px",
                          padding: "11px 16px",
                          fontSize: "14px",
                          fontWeight: 500
                        }}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y border-0 px-3"
                        style={{ color: "#76808D" }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
                      >
                        <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                    {pwdErrors.confirmPassword && <div className="invalid-feedback d-block small mt-1">{pwdErrors.confirmPassword}</div>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                  disabled={isPasswordLoading}
                  style={{
                    backgroundColor: "#FFCC00",
                    color: "#1C1F22",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 24px",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                    cursor: isPasswordLoading ? "not-allowed" : "pointer",
                    boxShadow: "0 2px 8px rgba(255, 204, 0, 0.25)"
                  }}
                  onMouseEnter={(e) => {
                    if (!isPasswordLoading) e.currentTarget.style.backgroundColor = "#E6B800";
                  }}
                  onMouseLeave={(e) => {
                    if (!isPasswordLoading) e.currentTarget.style.backgroundColor = "#FFCC00";
                  }}
                >
                  {isPasswordLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <span>Updating...</span>
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Favorites Manager */}
        <div className="col-lg-4">
          <div
            className="card border-0 rounded-4 mb-4 profile-card overflow-hidden"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE5DC",
              boxShadow: "0 4px 20px rgba(28, 31, 34, 0.04)"
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom" style={{ borderColor: "#EAE5DC" }}>
                <span style={{ width: "4px", height: "20px", background: "#FFCC00", borderRadius: "2px", display: "inline-block" }}></span>
                <h5 className="fw-bold font-space-grotesk mb-0" style={{ color: "#1C1F22", fontSize: "1.15rem" }}>
                  My Favorite Teams
                </h5>
              </div>
              <p className="small mb-4" style={{ color: "#5C646D", lineHeight: "1.6" }}>
                Add teams you support. We will prioritize their scores and fixtures for you across the platform.
              </p>

              {/* List of active favorite teams */}
              <div className="d-flex flex-wrap gap-2 mb-2">
                {favoriteTeams.length === 0 ? (
                  <div
                    className="w-100 text-center p-4 rounded-3 d-flex flex-column align-items-center justify-content-center"
                    style={{ background: "#FAF6EF", border: "1px dashed #EAE5DC" }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle mb-2"
                      style={{ width: "42px", height: "42px", background: "#FFFFFF", border: "1px solid #EAE5DC" }}
                    >
                      <i className="bi bi-star text-warning" style={{ fontSize: "18px" }}></i>
                    </div>
                    <span className="fw-semibold" style={{ color: "#1C1F22", fontSize: "13px" }}>No favorite teams added yet</span>
                    <span style={{ color: "#76808D", fontSize: "12px", marginTop: "2px" }}>
                      Star any team in match schedules to follow them here.
                    </span>
                  </div>
                ) : (
                  favoriteTeams.map((team, idx) => (
                    <span
                      key={idx}
                      className="badge px-3 py-2 d-flex align-items-center gap-2"
                      style={{
                        background: "#FAF6EF",
                        color: "#1C1F22",
                        border: "1px solid #EAE5DC",
                        borderRadius: "30px",
                        fontSize: "13px",
                        fontWeight: 600
                      }}
                    >
                      <i className="bi bi-star-fill text-warning"></i>
                      <span>{team}</span>
                      <button
                        type="button"
                        onClick={() => removeFavoriteTeam(team)}
                        className="btn-close p-0 ms-1"
                        style={{ fontSize: "9px" }}
                        aria-label="Remove"
                      ></button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 mt-4"><TipsterProfileEditor embedded accountEmail={accountEmail}/></div>

        {/* Full-width Row: Personalized Sports Feed (kept modular) */}
        <div className="col-12 mt-4 d-none">
          <div
            className="card border-0 rounded-4 profile-card overflow-hidden"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE5DC",
              boxShadow: "0 4px 20px rgba(28, 31, 34, 0.04)"
            }}
          >
            <div className="card-body p-4 p-md-5">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 pb-3 border-bottom gap-3" style={{ borderColor: "#EAE5DC" }}>
                <div>
                  <h5 className="fw-bold font-space-grotesk mb-1 d-flex align-items-center gap-2" style={{ color: "#1C1F22" }}>
                    <i className="bi bi-bookmark-star-fill text-warning fs-5"></i>
                    My Personalized Sports Feed
                  </h5>
                  <p className="small mb-0" style={{ color: "#5C646D" }}>Customized fixtures and results matching your favorite teams and leagues.</p>
                </div>
                <div className="nav nav-pills custom-tabs d-inline-flex gap-2">
                  <button
                    onClick={() => setFeedTab("fixtures")}
                    className={`nav-link px-4 py-1.5 fs-12 fw-bold text-uppercase ${feedTab === "fixtures" ? "active" : ""}`}
                  >
                    Fixtures
                  </button>
                  <button
                    onClick={() => setFeedTab("results")}
                    className={`nav-link px-4 py-1.5 fs-12 fw-bold text-uppercase ${feedTab === "results" ? "active" : ""}`}
                  >
                    Results
                  </button>
                </div>
              </div>

              {/* Feed Content */}
              {feedTab === "fixtures" ? (
                <div>
                  {userFixtures.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-calendar2-x text-muted fs-2 mb-3 d-block"></i>
                      <h6 style={{ color: "#1C1F22" }}>No upcoming matches for your favorites</h6>
                      <p className="small max-w-400 mx-auto mt-2" style={{ color: "#5C646D" }}>
                        Add more teams or leagues to your favorites list to populate this upcoming schedule.
                      </p>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {userFixtures.map((match: FixtureItem, idx: number) => (
                        <div key={idx} className="col-md-6 col-lg-4">
                          <Link href={getMatchLink(match)} className="text-decoration-none d-block w-100">
                            <div
                              className="fixture-card fixture-card-grid h-100 rounded-3 p-3 d-flex flex-column justify-content-between transition-all"
                              style={{ background: "#FAF6EF", border: "1px solid #EAE5DC" }}
                            >
                              <div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <span className="badge bg-white text-dark border fs-10 px-2 py-1 text-truncate" style={{ maxWidth: "150px", borderColor: "#EAE5DC" }}>
                                    {match.league}
                                  </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                                  <div className="d-flex align-items-center gap-2 text-truncate" style={{ maxWidth: "42%" }}>
                                    <div className="flex-shrink-0">
                                      <Image src={match.homeLogo} width={20} height={20} alt={match.home} />
                                    </div>
                                    <span className={`small text-truncate ${isFavoriteTeam(match.home) ? "fw-bold text-warning" : "text-dark"}`}>{match.home}</span>
                                  </div>
                                  <span className="small px-1 flex-shrink-0" style={{ color: "#76808D" }}>vs</span>
                                  <div className="d-flex align-items-center gap-2 text-truncate justify-content-end" style={{ maxWidth: "42%" }}>
                                    <span className={`small text-truncate ${isFavoriteTeam(match.away) ? "fw-bold text-warning" : "text-dark"}`}>{match.away}</span>
                                    <div className="flex-shrink-0">
                                      <Image src={match.awayLogo} width={20} height={20} alt={match.away} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-center border-top pt-2 mt-2" style={{ borderColor: "#EAE5DC" }}>
                                <div className="small fw-semibold" style={{ color: "#1C1F22" }}>{match.day} • {match.time}</div>
                                <div className="text-xs text-truncate mt-0.5" style={{ color: "#76808D" }}>{match.venue}</div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {userResults.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-slash-circle text-muted fs-2 mb-3 d-block"></i>
                      <h6 style={{ color: "#1C1F22" }}>No recent results found for your favorites</h6>
                      <p className="small max-w-400 mx-auto mt-2" style={{ color: "#5C646D" }}>
                        Add more teams or leagues to your favorites list to see their match scores and outcomes.
                      </p>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {userResults.map((item: ResultItem, idx: number) => (
                        <div key={idx} className="col-md-6 col-lg-4">
                          <Link href={getMatchLink(item)} className="text-decoration-none d-block w-100">
                            <div
                              className="fixture-card fixture-card-grid h-100 rounded-3 p-3 d-flex flex-column justify-content-between transition-all"
                              style={{ background: "#FAF6EF", border: "1px solid #EAE5DC" }}
                            >
                              <div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <span className="badge bg-white text-dark border fs-10 px-2 py-1 text-truncate" style={{ maxWidth: "150px", borderColor: "#EAE5DC" }}>
                                    {item.league}
                                  </span>
                                </div>

                                {item.type === "cricket" ? (
                                  <div className="d-flex flex-column gap-2 mb-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div className="d-flex align-items-center gap-2 text-truncate" style={{ maxWidth: "75%" }}>
                                        <div className="flex-shrink-0">
                                          <Image src={item.homeLogo} width={18} height={18} alt={item.home} />
                                        </div>
                                        <span className={`small text-truncate ${isFavoriteTeam(item.home) ? "fw-bold text-warning" : "text-dark"}`}>{item.home}</span>
                                      </div>
                                      <span className="small fw-bold flex-shrink-0" style={{ color: "#1C1F22" }}>{item.homeScore}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div className="d-flex align-items-center gap-2 text-truncate" style={{ maxWidth: "75%" }}>
                                        <div className="flex-shrink-0">
                                          <Image src={item.awayLogo} width={18} height={18} alt={item.away} />
                                        </div>
                                        <span className={`small text-truncate ${isFavoriteTeam(item.away) ? "fw-bold text-warning" : "text-dark"}`}>{item.away}</span>
                                      </div>
                                      <span className="small fw-bold flex-shrink-0" style={{ color: "#1C1F22" }}>{item.awayScore}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                                    <div className="d-flex align-items-center gap-2 text-truncate" style={{ maxWidth: "42%" }}>
                                      <div className="flex-shrink-0">
                                        <Image src={item.homeLogo} width={18} height={18} alt={item.home} />
                                      </div>
                                      <span className={`small text-truncate ${isFavoriteTeam(item.home) ? "fw-bold text-warning" : "text-dark"}`}>{item.home}</span>
                                    </div>
                                    <span className="small fw-bold fs-14 px-1 flex-shrink-0" style={{ color: "#1C1F22" }}>{item.score}</span>
                                    <div className="d-flex align-items-center gap-2 text-truncate justify-content-end" style={{ maxWidth: "42%" }}>
                                      <span className={`small text-truncate ${isFavoriteTeam(item.away) ? "fw-bold text-warning" : "text-dark"}`}>{item.away}</span>
                                      <div className="flex-shrink-0">
                                        <Image src={item.awayLogo} width={18} height={18} alt={item.away} />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="text-center border-top pt-2 mt-2" style={{ borderColor: "#EAE5DC" }}>
                                <div className="small fw-semibold mb-0.5" style={{ color: "#1C1F22" }}>{item.result}</div>
                                <div className="text-xs" style={{ color: "#76808D" }}>{item.date}</div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
