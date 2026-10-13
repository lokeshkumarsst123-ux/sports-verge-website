"use client";

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
      <div className="container py-5 min-h-80vh text-center text-muted">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container py-5 min-h-80vh">
        <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger">
          {profileError}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 min-h-80vh">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-5 gap-3">
        <div>
          <h2 className="text-white fw-semibold mt-1 mb-0 fs-2">
            Profile Dashboard
          </h2>
          <p className="text-muted mb-0">Manage your account, customize favorites, and view your personalized sports feed.</p>
        </div>
        <button
          onClick={() => {
            void logoutUser().then(() => router.push("/"));
          }}
          className="btn btn-outline-danger px-4 py-2 fw-semibold"
        >
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>

      <div className="row g-4">
        {/* Left Column: Manage account information and password */}
        <div className="col-lg-8">
          <div className="card border-0 rounded-3 mb-4 profile-card">
            <div className="card-body p-4">
              <h5 className="text-white fw-semibold mb-4 border-start border-success border-3 ps-2">Manage Account Information</h5>

              {successMsg && (
                <div className="alert alert-success bg-success text-white border-0 py-2 small rounded-1 mb-4">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleAccountUpdate}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-medium mb-1 text-uppercase">First Name</label>
                    <input
                      type="text"
                      className={`form-control bg-dark text-white fw-medium border-0 custom-input ${errors.firstName ? 'is-invalid' : ''}`}
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    {errors.firstName && <div className="invalid-feedback d-block small mt-1">{errors.firstName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-medium mb-1 text-uppercase">Last Name</label>
                    <input
                      type="text"
                      className={`form-control bg-dark text-white fw-medium border-0 custom-input ${errors.lastName ? 'is-invalid' : ''}`}
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                    {errors.lastName && <div className="invalid-feedback d-block small mt-1">{errors.lastName}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-medium mb-1 text-uppercase">Email Address</label>
                  <input
                    type="email"
                    className={`form-control bg-dark text-white fw-medium border-0 custom-input ${errors.email ? 'is-invalid' : ''}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <div className="invalid-feedback d-block small mt-1">{errors.email}</div>}
                </div>

                <button type="submit" className="btn btn-success px-4 py-2 rounded-1 fw-semibold w-100 mt-2" disabled={isAccountLoading}>
                  {isAccountLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="card border-0 rounded-3 mb-4 profile-card">
            <div className="card-body p-4">
              <h5 className="text-white fw-semibold mb-4 border-start border-success border-3 ps-2">Change Password</h5>

              {pwdSuccessMsg && (
                <div className="alert alert-success bg-success text-white border-0 py-2 small rounded-1 mb-4">
                  {pwdSuccessMsg}
                </div>
              )}

              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-medium mb-1 text-uppercase">Current Password</label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control bg-dark text-white fw-medium border-0 pe-5 custom-input ${pwdErrors.currentPassword ? 'is-invalid' : ''}`}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="btn position-absolute top-50 end-0 translate-middle-y border-0 text-muted px-3"
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
                    <label className="form-label text-muted small fw-medium mb-1 text-uppercase">New Password</label>
                    <div className="position-relative"><input
                      type={showNewPassword ? "text" : "password"}
                      className={`form-control bg-dark text-white fw-medium border-0 pe-5 custom-input ${pwdErrors.newPassword ? 'is-invalid' : ''}`}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                    /><button type="button" className="btn position-absolute top-50 end-0 translate-middle-y border-0 text-muted px-3" onClick={() => setShowNewPassword(!showNewPassword)} aria-label={showNewPassword ? "Hide new password" : "Show new password"}><i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i></button></div>
                    {pwdErrors.newPassword && <div className="invalid-feedback d-block small mt-1">{pwdErrors.newPassword}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-medium mb-1 text-uppercase">Confirm Password</label>
                    <div className="position-relative"><input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control bg-dark text-white fw-medium border-0 pe-5 custom-input ${pwdErrors.confirmPassword ? 'is-invalid' : ''}`}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                    /><button type="button" className="btn position-absolute top-50 end-0 translate-middle-y border-0 text-muted px-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}><i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i></button></div>
                    {pwdErrors.confirmPassword && <div className="invalid-feedback d-block small mt-1">{pwdErrors.confirmPassword}</div>}
                  </div>
                </div>

                <button type="submit" className="btn btn-success px-4 py-2 rounded-1 fw-semibold w-100" disabled={isPasswordLoading}>
                  {isPasswordLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Right Column: Favorites Manager & Personalized Sports Feed */}
        <div className="col-lg-4">
          {/* Favorite Teams Manager */}
          <div className="card border-0 rounded-3 mb-4 profile-card">
            <div className="card-body p-4">
              <h5 className="text-white fw-semibold mb-3 border-start border-success border-3 ps-2">My Favorite Teams</h5>
              <p className="text-muted small mb-4">Add teams you support. We will prioritize their scores and fixtures for you.</p>

              {/* List of active favorite teams */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {favoriteTeams.length === 0 ? (
                  <span className="text-muted small italic">No favorite teams added yet.</span>
                ) : (
                  favoriteTeams.map((team, idx) => (
                    <span key={idx} className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-20 px-3 py-2 fs-12 rounded-pill d-flex align-items-center gap-2">
                      <i className="bi bi-star-fill text-warning"></i> {team}
                      <button
                        type="button"
                        onClick={() => removeFavoriteTeam(team)}
                        className="btn-close btn-close-white p-0 fs-10"
                        style={{ filter: "invert(1) grayscale(1) brightness(2)" }}
                        aria-label="Remove"
                      ></button>
                    </span>
                  ))
                )}
              </div>



            </div>
          </div>


        </div>

        {/* Full-width Row: Personalized Sports Feed */}
        <div className="col-12 mt-4 d-none">
          <div className="card border-0 rounded-3 profile-card">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 pb-3 border-bottom border-white-05 gap-3">
                <div>
                  <h5 className="text-white fw-bold mb-1 d-flex align-items-center gap-2">
                    <i className="bi bi-bookmark-star-fill text-warning fs-5"></i>
                    My Personalized Sports Feed
                  </h5>
                  <p className="text-muted small mb-0">Customized fixtures and results matching your favorite teams and leagues.</p>
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
                      <h6 className="text-light">No upcoming matches for your favorites</h6>
                      <p className="text-muted small max-w-400 mx-auto mt-2">
                        Add more teams or leagues to your favorites list to populate this upcoming schedule.
                      </p>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {userFixtures.map((match: FixtureItem, idx: number) => (
                        <div key={idx} className="col-md-6 col-lg-4">
                          <Link href={getMatchLink(match)} className="text-decoration-none d-block w-100">
                            <div className="fixture-card fixture-card-grid h-100 rounded-3 border border-dark p-3 d-flex flex-column justify-content-between hover-bg-dark transition-all">
                              <div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <span className="badge bg-dark text-muted fs-10 px-2 py-1 text-truncate" style={{ maxWidth: "150px" }}>
                                    {match.league}
                                  </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                                  <div className="d-flex align-items-center gap-2 text-truncate" style={{ maxWidth: "42%" }}>
                                    <div className="flex-shrink-0">
                                      <Image src={match.homeLogo} width={20} height={20} alt={match.home} />
                                    </div>
                                    <span className={`text-light small text-truncate ${isFavoriteTeam(match.home) ? "fw-bold text-warning" : ""}`}>{match.home}</span>
                                  </div>
                                  <span className="text-muted small px-1 flex-shrink-0">vs</span>
                                  <div className="d-flex align-items-center gap-2 text-truncate justify-content-end" style={{ maxWidth: "42%" }}>
                                    <span className={`text-light small text-truncate ${isFavoriteTeam(match.away) ? "fw-bold text-warning" : ""}`}>{match.away}</span>
                                    <div className="flex-shrink-0">
                                      <Image src={match.awayLogo} width={20} height={20} alt={match.away} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-center border-top border-white-05 pt-2 mt-2">
                                <div className="small text-success fw-semibold">{match.day} • {match.time}</div>
                                <div className="text-muted text-xs text-truncate mt-0.5">{match.venue}</div>
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
                      <h6 className="text-light">No recent results found for your favorites</h6>
                      <p className="text-muted small max-w-400 mx-auto mt-2">
                        Add more teams or leagues to your favorites list to see their match scores and outcomes.
                      </p>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {userResults.map((item: ResultItem, idx: number) => (
                        <div key={idx} className="col-md-6 col-lg-4">
                          <Link href={getMatchLink(item)} className="text-decoration-none d-block w-100">
                            <div className="fixture-card fixture-card-grid h-100 rounded-3 border border-dark p-3 d-flex flex-column justify-content-between hover-bg-dark transition-all">
                              <div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <span className="badge bg-dark text-muted fs-10 px-2 py-1 text-truncate" style={{ maxWidth: "150px" }}>
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
                                        <span className={`text-light small text-truncate ${isFavoriteTeam(item.home) ? "fw-bold text-warning" : ""}`}>{item.home}</span>
                                      </div>
                                      <span className="text-white small fw-bold flex-shrink-0">{item.homeScore}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div className="d-flex align-items-center gap-2 text-truncate" style={{ maxWidth: "75%" }}>
                                        <div className="flex-shrink-0">
                                          <Image src={item.awayLogo} width={18} height={18} alt={item.away} />
                                        </div>
                                        <span className={`text-light small text-truncate ${isFavoriteTeam(item.away) ? "fw-bold text-warning" : ""}`}>{item.away}</span>
                                      </div>
                                      <span className="text-white small fw-bold flex-shrink-0">{item.awayScore}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                                    <div className="d-flex align-items-center gap-2 text-truncate" style={{ maxWidth: "42%" }}>
                                      <div className="flex-shrink-0">
                                        <Image src={item.homeLogo} width={18} height={18} alt={item.home} />
                                      </div>
                                      <span className={`text-light small text-truncate ${isFavoriteTeam(item.home) ? "fw-bold text-warning" : ""}`}>{item.home}</span>
                                    </div>
                                    <span className="text-success small fw-bold fs-14 px-1 flex-shrink-0">{item.score}</span>
                                    <div className="d-flex align-items-center gap-2 text-truncate justify-content-end" style={{ maxWidth: "42%" }}>
                                      <span className={`text-light small text-truncate ${isFavoriteTeam(item.away) ? "fw-bold text-warning" : ""}`}>{item.away}</span>
                                      <div className="flex-shrink-0">
                                        <Image src={item.awayLogo} width={18} height={18} alt={item.away} />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="text-center border-top border-white-05 pt-2 mt-2">
                                <div className="small text-success fw-semibold mb-0.5">{item.result}</div>
                                <div className="text-muted text-xs">{item.date}</div>
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
