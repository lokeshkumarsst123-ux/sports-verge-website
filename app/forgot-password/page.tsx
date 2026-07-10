"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [flowStep, setFlowStep] = useState<"email" | "link_sent" | "reset_form" | "success">("email");
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrors({ email: "Email address is required." });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    setErrors({});

    // Simulate sending reset email
    setTimeout(() => {
      setLoading(false);
      setFlowStep("link_sent");
    }, 1500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!passwords.password) {
      newErrors.password = "New password is required.";
    } else if (passwords.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(passwords.password)) {
      newErrors.password = "Password must contain at least one number and one letter.";
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (passwords.password !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    // Simulate updating credentials in database
    setTimeout(() => {
      setLoading(false);
      setFlowStep("success");
    }, 1500);
  };

  return (
    <main
      className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3 position-relative overflow-hidden"
      style={{
        backgroundColor: "#070b12",
      }}
    >
      {/* Background Mesh Glows */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(57, 255, 20, 0.05) 0%, transparent 70%)",
          top: "-100px",
          right: "-100px",
          zIndex: 1,
        }}
      ></div>
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(26, 140, 61, 0.04) 0%, transparent 70%)",
          bottom: "-150px",
          left: "-150px",
          zIndex: 1,
        }}
      ></div>

      <div className="w-100 position-relative" style={{ maxWidth: "460px", zIndex: 10 }}>
        {/* Logo Header */}
        <div className="text-center mb-4">
          <Link href="/" className="d-inline-block">
            <Image
              src="/assets/imgs/logo-white.svg"
              alt="SportsVerge"
              width={180}
              height={45}
              className="brand-logo"
              priority
            />
          </Link>
        </div>

        {/* Card Body */}
        <div className="card bg-card border border-dark rounded-4 p-4 p-md-5">
          {flowStep === "email" && (
            <>
              <h3 className="text-white fw-bold mb-1">Reset Password</h3>
              <p className="text-muted small mb-4">
                Enter your registered email address below and we'll send you a password reset link.
              </p>

              <form onSubmit={handleSendResetLink} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label text-muted small fw-medium mb-1">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({});
                    }}
                    className={`form-control bg-dark text-white border-0 ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    style={{ padding: "11px 16px", fontSize: "14px" }}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <div className="invalid-feedback small mt-1">{errors.email}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-signup w-100 fw-semibold text-uppercase py-2.5 mt-3"
                  style={{ letterSpacing: "0.5px" }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <Link href="/login" className="text-success text-decoration-none small fw-semibold">
                  <i className="bi bi-arrow-left me-1"></i> Back to Login
                </Link>
              </div>
            </>
          )}

          {flowStep === "link_sent" && (
            <div className="text-center py-2">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle p-3 mb-4"
                style={{ width: "64px", height: "64px" }}
              >
                <i className="bi bi-send-check-fill" style={{ fontSize: "28px" }}></i>
              </div>
              <h4 className="text-white fw-bold">Reset Email Sent</h4>
              <p className="text-muted small my-3" style={{ lineHeight: "1.6" }}>
                A password reset link has been dispatched to <strong className="text-light">{email}</strong>. 
                Check your inbox and follow the instructions to configure your credentials.
              </p>

              {/* Simulation Sandbox CTA */}
              <div className="bg-dark bg-opacity-40 border border-secondary border-opacity-10 rounded-3 p-3 my-4">
                <span className="badge bg-secondary bg-opacity-20 text-success mb-2 px-2.5 py-1.5" style={{ fontSize: "9px", letterSpacing: "0.5px" }}>
                  SIMULATION SANDBOX
                </span>
                <p className="text-muted" style={{ fontSize: "11px", lineHeight: "1.4" }}>
                  In production, users would click the secure token in the email. Click below to simulate that action.
                </p>
                <button
                  onClick={() => setFlowStep("reset_form")}
                  className="btn btn-login w-100 fw-semibold text-uppercase py-2"
                  style={{ fontSize: "11px" }}
                >
                  Simulate Email Token click
                </button>
              </div>

              <div className="text-center mt-2">
                <span className="text-muted small">Didn't get the link? </span>
                <button
                  onClick={() => {
                    setFlowStep("email");
                    setEmail(email);
                  }}
                  className="btn btn-link text-success text-decoration-none small p-0 fw-semibold align-baseline"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {flowStep === "reset_form" && (
            <>
              <h3 className="text-white fw-bold mb-1">New Password</h3>
              <p className="text-muted small mb-4">
                Create a secure password to update your login credentials.
              </p>

              <form onSubmit={handleResetPassword} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label text-muted small fw-medium mb-1">NEW PASSWORD</label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={passwords.password}
                      onChange={handleInputChange}
                      className={`form-control bg-dark text-white border-0 pe-5 ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      style={{ padding: "11px 16px", fontSize: "14px" }}
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
                  {errors.password && (
                    <div className="invalid-feedback d-block small mt-1">{errors.password}</div>
                  )}
                </div>

                <div>
                  <label className="form-label text-muted small fw-medium mb-1">CONFIRM NEW PASSWORD</label>
                  <div className="position-relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-control bg-dark text-white border-0 pe-5 ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      style={{ padding: "11px 16px", fontSize: "14px" }}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="btn position-absolute top-50 end-0 translate-middle-y border-0 text-muted px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback d-block small mt-1">{errors.confirmPassword}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-signup w-100 fw-semibold text-uppercase py-2.5 mt-3"
                  style={{ letterSpacing: "0.5px" }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          )}

          {flowStep === "success" && (
            <div className="text-center py-2">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle p-3 mb-4"
                style={{ width: "64px", height: "64px" }}
              >
                <i className="bi bi-check2-circle" style={{ fontSize: "36px" }}></i>
              </div>
              <h4 className="text-white fw-bold">Password Reset Complete</h4>
              <p className="text-muted small my-3" style={{ lineHeight: "1.6" }}>
                Your account credentials have been successfully updated. You can now login with your new password.
              </p>

              <Link
                href="/login"
                className="btn btn-signup w-100 fw-semibold text-uppercase py-2.5 mt-3"
                style={{ letterSpacing: "0.5px" }}
              >
                Go to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
