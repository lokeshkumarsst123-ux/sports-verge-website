"use client";

import React, { useState } from "react";

export default function ProfileDashboard() {
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

  const favoriteTeams = ["Chennai Super Kings", "Manchester City"];
  const favoriteCompetitions = ["IPL", "Premier League"];
  const savedPreferences = {
    theme: "Dark Mode",
    language: "English"
  };

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
        setTimeout(() => setSuccessMsg(""), 3000);
      }, 1000);
    }
  };

  const handleNotificationChange = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    // Save immediately after successful validation
    setSuccessMsg("Notification preferences saved successfully.");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  return (
    <div className="container py-5 min-h-80vh">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-5 gap-3">
        <div>
          <h2 className="text-white fw-semibold mt-1 mb-0 fs-2">
            Profile Dashboard
          </h2>
          <p className="text-muted mb-0">Manage your account information and preferences.</p>
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
        {/* Left Column: Manage Account Information & Notification Preferences */}
        <div className="col-lg-7">
          <div className="card border-0 rounded-3 mb-4 profile-card" >
            <div className="card-body p-4">
              <h5 className="text-white fw-semibold mb-4">Manage Account Information</h5>
              
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

          <div className="card border-0 rounded-3 mb-4 profile-card" >
            <div className="card-body p-4">
              <h5 className="text-white fw-semibold mb-4">Change Password</h5>
              
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

          <div className="card border-0 rounded-3 profile-card" >
            <div className="card-body p-4">
              <h5 className="text-white fw-semibold mb-4">Manage Notification Preferences</h5>
              
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-white-05" >
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

        {/* Right Column: Displays */}
        <div className="col-lg-5">
          <div className="card border-0 rounded-3 mb-4 profile-card" >
            <div className="card-body p-4">
              <h5 className="text-white fw-semibold mb-4">Account Information</h5>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                  <span className="text-muted small fw-medium">First Name:</span>
                  <span className="text-white small fw-semibold">{formData.firstName}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small fw-medium">Last Name:</span>
                  <span className="text-white small fw-semibold">{formData.lastName}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small fw-medium">Email Address:</span>
                  <span className="text-white small fw-semibold">{formData.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 rounded-3 mb-4 profile-card" >
            <div className="card-body p-4">
              <h5 className="text-white fw-semibold mb-4">Favorite Teams</h5>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                {favoriteTeams.map((team, idx) => (
                  <li key={idx} className="text-white small">
                    • {team}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card border-0 rounded-3 mb-4 profile-card" >
            <div className="card-body p-4">
              <h5 className="text-white fw-semibold mb-4">Favorite Competitions</h5>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                {favoriteCompetitions.map((comp, idx) => (
                  <li key={idx} className="text-white small">
                    • {comp}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card border-0 rounded-3 profile-card" >
            <div className="card-body p-4">
              <h5 className="text-white fw-semibold mb-4">Saved Preferences</h5>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                  <span className="text-muted small fw-medium">Language:</span>
                  <span className="text-white small fw-semibold">{savedPreferences.language}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
