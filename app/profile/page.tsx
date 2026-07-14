"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/components/FavoritesContext";
import { upcomingFixtures, recentResults } from "@/data/mockData";
import { FixtureItem, ResultItem } from "@/types";

// Predefined lists for autocomplete search and quick-add
const PREDEFINED_TEAMS = [
  { name: "CSK", sport: "Cricket", logo: "/assets/imgs/teams/ipl/CSKoutline.png" },
  { name: "RCB", sport: "Cricket", logo: "/assets/imgs/teams/ipl/RCBoutline.png" },
  { name: "LQ", sport: "Cricket", logo: "/assets/imgs/teams/zalmi.webp" },
  { name: "PZ", sport: "Cricket", logo: "/assets/imgs/teams/qalandar.webp" },
  { name: "Man City", sport: "Football", logo: "/assets/imgs/teams/Manchester_City_FC_badge.svg" },
  { name: "Arsenal", sport: "Football", logo: "/assets/imgs/teams/Arsenal_FC.svg" },
  { name: "Liverpool", sport: "Football", logo: "/assets/imgs/teams/Liverpool_FC.svg" },
  { name: "Aston Villa", sport: "Football", logo: "/assets/imgs/teams/Aston_Villa_FC_new_crest.svg" },
  { name: "Man United", sport: "Football", logo: "/assets/imgs/teams/Manchester_United_FC_crest.png" },
  { name: "Chiefs", sport: "NFL", logo: "/assets/imgs/teams/Kansas_City_Chiefs_logo.svg" },
  { name: "Bills", sport: "NFL", logo: "/assets/imgs/teams/Buffalo_Bills_logo.svg" },
  { name: "Brisbane", sport: "AFL", logo: "/assets/imgs/teams/Brisbane_Lions_logo_2010.svg" },
  { name: "Essendon", sport: "AFL", logo: "/assets/imgs/teams/Essendon_FC_logo.svg" },
  { name: "Collingwood", sport: "AFL", logo: "/assets/imgs/teams/new-zealand.webp" },
  { name: "Australia", sport: "Cricket", logo: "/assets/imgs/teams/australia.webp" },
  { name: "India", sport: "Cricket", logo: "/assets/imgs/teams/india.webp" },
  { name: "England", sport: "Cricket", logo: "/assets/imgs/teams/england.webp" },
  { name: "West Indies", sport: "Cricket", logo: "/assets/imgs/teams/west-indies.webp" }
];

const PREDEFINED_COMPETITIONS = [
  "IPL 2026",
  "IPL 2024",
  "Premier League",
  "NFL • Regular Season",
  "NFL",
  "AFL",
  "Champions League",
  "Test Series",
  "PSL 2026"
];

export default function ProfileDashboard() {
  const {
    favoriteTeams,
    favoriteCompetitions,
    addFavoriteTeam,
    removeFavoriteTeam,
    addFavoriteCompetition,
    removeFavoriteCompetition,
    isFavoriteTeam,
    isFavoriteCompetition
  } = useFavorites();

  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailAlerts: true,
    pushNotifications: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pwdErrors, setPwdErrors] = useState<{ [key: string]: string }>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [pwdSuccessMsg, setPwdSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Favorites input search states
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [teamSuggestions, setTeamSuggestions] = useState<typeof PREDEFINED_TEAMS>([]);
  const [compSearchQuery, setCompSearchQuery] = useState("");
  const [compSuggestions, setCompSuggestions] = useState<string[]>([]);

  // Personalized feed filter
  const [feedTab, setFeedTab] = useState<"fixtures" | "results">("fixtures");

  const savedPreferences = {
    theme: "Dark Mode",
    language: "English"
  };

  // Sync user info from session storage
  useEffect(() => {
    const session = sessionStorage.getItem("user_session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setFormData({
          firstName: parsed.firstName || "John",
          lastName: parsed.lastName || "Doe",
          email: parsed.email || "john.doe@example.com",
        });
      } catch (e) {
        // Handle error
      }
    }
  }, []);

  // Filter team suggestions as user types
  useEffect(() => {
    if (!teamSearchQuery.trim()) {
      setTeamSuggestions([]);
      return;
    }
    const filtered = PREDEFINED_TEAMS.filter(
      team =>
        team.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) &&
        !favoriteTeams.some(t => t.toLowerCase() === team.name.toLowerCase())
    );
    setTeamSuggestions(filtered);
  }, [teamSearchQuery, favoriteTeams]);

  // Filter competition suggestions as user types
  useEffect(() => {
    if (!compSearchQuery.trim()) {
      setCompSuggestions([]);
      return;
    }
    const filtered = PREDEFINED_COMPETITIONS.filter(
      comp =>
        comp.toLowerCase().includes(compSearchQuery.toLowerCase()) &&
        !favoriteCompetitions.some(c => c.toLowerCase() === comp.toLowerCase())
    );
    setCompSuggestions(filtered);
  }, [compSearchQuery, favoriteCompetitions]);

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
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
    let newErrors: { [key: string]: string } = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = "Current Password is required.";
    if (!passwordData.newPassword) newErrors.newPassword = "New Password is required.";
    else if (passwordData.newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters long.";
    if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setPwdErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSuccessMsg("");
    if (validatePasswordForm()) {
      setIsPasswordLoading(true);
      setTimeout(() => {
        setIsPasswordLoading(false);
        setPwdSuccessMsg("Password successfully updated!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setPwdSuccessMsg(""), 3000);
      }, 1000);
    }
  };

  const handleAccountUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    if (validateForm()) {
      if (formData.email === "taken@example.com") {
        setErrors({ email: "This email address is already in use." });
        return;
      }
      setIsAccountLoading(true);
      setTimeout(() => {
        setIsAccountLoading(false);
        setSuccessMsg("Account information successfully updated!");
        const session = sessionStorage.getItem("user_session");
        if (session) {
          const parsed = JSON.parse(session);
          sessionStorage.setItem("user_session", JSON.stringify({ ...parsed, ...formData }));
        }
        setTimeout(() => setSuccessMsg(""), 3000);
      }, 1000);
    }
  };

  const handleNotificationChange = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    setSuccessMsg("Notification preferences saved successfully.");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleAddTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamSearchQuery.trim()) {
      addFavoriteTeam(teamSearchQuery.trim());
      setTeamSearchQuery("");
    }
  };

  const handleAddCompSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (compSearchQuery.trim()) {
      addFavoriteCompetition(compSearchQuery.trim());
      setCompSearchQuery("");
    }
  };

  // Filter fixtures involving favorite teams or competitions
  const userFixtures = upcomingFixtures.filter(
    (fixture) =>
      isFavoriteTeam(fixture.home) ||
      isFavoriteTeam(fixture.away) ||
      isFavoriteCompetition(fixture.league)
  );

  // Filter results involving favorite teams or competitions
  const userResults = recentResults.filter(
    (result) =>
      isFavoriteTeam(result.home) ||
      isFavoriteTeam(result.away) ||
      isFavoriteCompetition(result.league)
  );

  const getMatchLink = (match: any) => {
    if (match.id) return `/live-scores/${match.id}`;
    if (match.type === "football" || match.sport === "football") return "/live-scores/match-2";
    if (match.type === "NFL" || match.sport === "NFL") return "/live-scores/match-3";
    return "/live-scores/match-1";
  };

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
            sessionStorage.removeItem("user_session");
            window.location.href = "/login";
          }}
          className="btn btn-outline-danger px-4 py-2 fw-semibold"
        >
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>

      <div className="row g-4">
        {/* Left Column: Manage Account, Password & Notifications */}
        <div className="col-lg-6">
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
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                    {errors.firstName && <div className="invalid-feedback d-block small mt-1">{errors.firstName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-medium mb-1 text-uppercase">Last Name</label>
                    <input 
                      type="text" 
                      className={`form-control bg-dark text-white fw-medium border-0 custom-input ${errors.lastName ? 'is-invalid' : ''}`} 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="btn position-absolute top-50 end-0 translate-middle-y border-0 text-muted px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                  {pwdErrors.currentPassword && <div className="invalid-feedback d-block small mt-1">{pwdErrors.currentPassword}</div>}
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-medium mb-1 text-uppercase">New Password</label>
                    <input 
                      type="password" 
                      className={`form-control bg-dark text-white fw-medium border-0 custom-input ${pwdErrors.newPassword ? 'is-invalid' : ''}`} 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Enter new password"
                    />
                    {pwdErrors.newPassword && <div className="invalid-feedback d-block small mt-1">{pwdErrors.newPassword}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-medium mb-1 text-uppercase">Confirm Password</label>
                    <input 
                      type="password" 
                      className={`form-control bg-dark text-white fw-medium border-0 custom-input ${pwdErrors.confirmPassword ? 'is-invalid' : ''}`} 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                    />
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

          <div className="card border-0 rounded-3 mb-4 profile-card">
            <div className="card-body p-4">
              <h5 className="text-white fw-semibold mb-4 border-start border-success border-3 ps-2">Manage Notification Preferences</h5>
              
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-white-05">
                <span className="text-muted small fw-medium">Email Alerts</span>
                <div className="form-check form-switch m-0">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    role="switch" 
                    checked={notificationPrefs.emailAlerts}
                    onChange={() => handleNotificationChange("emailAlerts")}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2 mt-2">
                <span className="text-muted small fw-medium">Push Notifications</span>
                <div className="form-check form-switch m-0">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    role="switch" 
                    checked={notificationPrefs.pushNotifications}
                    onChange={() => handleNotificationChange("pushNotifications")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Favorites Manager & Personalized Sports Feed */}
        <div className="col-lg-6">
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

              {/* Add Team Search Form */}
              <form onSubmit={handleAddTeamSubmit} className="position-relative">
                <div className="input-group mb-2">
                  <input 
                    type="text" 
                    className="form-control bg-dark text-white fw-medium border-0 custom-input px-3" 
                    placeholder="Search or type team name..."
                    value={teamSearchQuery}
                    onChange={(e) => setTeamSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn btn-success fw-semibold px-4">Add</button>
                </div>

                {/* Autocomplete dropdown suggestions */}
                {teamSuggestions.length > 0 && (
                  <div className="position-absolute w-100 bg-card border border-dark rounded-3 shadow-lg z-3 mt-1 overflow-auto max-h-200">
                    {teamSuggestions.map((team) => (
                      <button
                        key={team.name}
                        type="button"
                        onClick={() => {
                          addFavoriteTeam(team.name);
                          setTeamSearchQuery("");
                        }}
                        className="w-100 text-start bg-transparent border-0 text-white px-3 py-2 small hover-bg-dark d-flex align-items-center justify-content-between"
                      >
                        <span>{team.name} <span className="text-muted text-xs">({team.sport})</span></span>
                        <i className="bi bi-plus text-success"></i>
                      </button>
                    ))}
                  </div>
                )}
              </form>

              {/* Popular recommendations quick-add */}
              <div className="mt-3">
                <span className="text-muted text-xs text-uppercase d-block mb-2">Suggested Teams:</span>
                <div className="d-flex flex-wrap gap-2">
                  {PREDEFINED_TEAMS.slice(0, 6)
                    .filter(t => !isFavoriteTeam(t.name))
                    .map((team) => (
                      <button
                        key={team.name}
                        type="button"
                        onClick={() => addFavoriteTeam(team.name)}
                        className="btn btn-sm btn-dark text-white border-0 py-1 px-2.5 rounded-pill fs-11"
                        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      >
                        + {team.name}
                      </button>
                    ))}
                </div>
              </div>

            </div>
          </div>

          {/* Favorite Competitions Manager */}
          <div className="card border-0 rounded-3 mb-4 profile-card">
            <div className="card-body p-4">
              <h5 className="text-white fw-semibold mb-3 border-start border-success border-3 ps-2">My Favorite Leagues & Tournaments</h5>
              <p className="text-muted small mb-4">Follow specific leagues to keep up with their matches and standings.</p>
              
              {/* List of active favorite competitions */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {favoriteCompetitions.length === 0 ? (
                  <span className="text-muted small italic">No favorite competitions added yet.</span>
                ) : (
                  favoriteCompetitions.map((comp, idx) => (
                    <span key={idx} className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-20 px-3 py-2 fs-12 rounded-pill d-flex align-items-center gap-2">
                      <i className="bi bi-trophy-fill text-warning"></i> {comp}
                      <button 
                        type="button" 
                        onClick={() => removeFavoriteCompetition(comp)}
                        className="btn-close btn-close-white p-0 fs-10" 
                        style={{ filter: "invert(1) grayscale(1) brightness(2)" }}
                        aria-label="Remove"
                      ></button>
                    </span>
                  ))
                )}
              </div>

              {/* Add Competition Search Form */}
              <form onSubmit={handleAddCompSubmit} className="position-relative">
                <div className="input-group mb-2">
                  <input 
                    type="text" 
                    className="form-control bg-dark text-white fw-medium border-0 custom-input px-3" 
                    placeholder="Search or type competition..."
                    value={compSearchQuery}
                    onChange={(e) => setCompSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn btn-success fw-semibold px-4">Add</button>
                </div>

                {/* Autocomplete dropdown suggestions */}
                {compSuggestions.length > 0 && (
                  <div className="position-absolute w-100 bg-card border border-dark rounded-3 shadow-lg z-3 mt-1 overflow-auto max-h-200">
                    {compSuggestions.map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => {
                          addFavoriteCompetition(comp);
                          setCompSearchQuery("");
                        }}
                        className="w-100 text-start bg-transparent border-0 text-white px-3 py-2 small hover-bg-dark d-flex align-items-center justify-content-between"
                      >
                        <span>{comp}</span>
                        <i className="bi bi-plus text-success"></i>
                      </button>
                    ))}
                  </div>
                )}
              </form>

              {/* Popular recommendations quick-add */}
              <div className="mt-3">
                <span className="text-muted text-xs text-uppercase d-block mb-2">Suggested Leagues:</span>
                <div className="d-flex flex-wrap gap-2">
                  {PREDEFINED_COMPETITIONS.slice(0, 5)
                    .filter(c => !isFavoriteCompetition(c))
                    .map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => addFavoriteCompetition(comp)}
                        className="btn btn-sm btn-dark text-white border-0 py-1 px-2.5 rounded-pill fs-11"
                        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      >
                        + {comp}
                      </button>
                    ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Full-width Row: Personalized Sports Feed */}
        <div className="col-12 mt-4">
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
                          <Link href={getMatchLink(match)} className="text-decoration-none">
                            <div className="fixture-card fixture-card-grid h-100 rounded-3 border border-dark p-3 d-flex flex-column justify-content-between hover-bg-dark transition-all">
                              <div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <span className="badge bg-dark text-muted fs-10 px-2 py-1 text-truncate" style={{ maxWidth: "150px" }}>
                                    {match.league}
                                  </span>
                                  <span className="badge bg-warning text-dark px-1.5 py-0.5 rounded-pill fs-10 fw-bold">
                                    FAV
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
                          <Link href={getMatchLink(item)} className="text-decoration-none">
                            <div className="fixture-card fixture-card-grid h-100 rounded-3 border border-dark p-3 d-flex flex-column justify-content-between hover-bg-dark transition-all">
                              <div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <span className="badge bg-dark text-muted fs-10 px-2 py-1 text-truncate" style={{ maxWidth: "150px" }}>
                                    {item.league}
                                  </span>
                                  <span className="badge bg-warning text-dark px-1.5 py-0.5 rounded-pill fs-10 fw-bold">
                                    FAV
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
