"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [resendOption, setResendOption] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (globalError) {
      setGlobalError(null);
      setResendOption(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setGlobalError(null);
    setResendOption(false);

    // Simulate API authorization check
    setTimeout(() => {
      setLoading(false);
      const emailLower = formData.email.toLowerCase().trim();

      if (emailLower === "blocked@sportsverge.com") {
        setGlobalError("Account Blocked: Access to this account has been suspended due to policy violations.");
      } else if (emailLower === "unverified@sportsverge.com") {
        setGlobalError("Account Unverified: Please verify your email before logging in.");
        setResendOption(true);
      } else if (emailLower === "user@sportsverge.com" && formData.password !== "Password123") {
        setErrors({ password: "The password you entered is incorrect." });
      } else {
        // Success case
        const sessionUser = {
          firstName: emailLower === "user@sportsverge.com" ? "Alex" : "Guest",
          lastName: emailLower === "user@sportsverge.com" ? "Turner" : "User",
          email: formData.email,
          verified: true,
        };
        sessionStorage.setItem("user_session", JSON.stringify(sessionUser));
        router.push("/profile");
      }
    }, 1200);
  };

  // Demo credential fills
  const fillCredentials = (email: string) => {
    setFormData({
      email,
      password: "Password123",
    });
    setErrors({});
    setGlobalError(null);
    setResendOption(false);
  };

  return (
    <main
      className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3 position-relative overflow-hidden auth-main-bg"
      
    >
      {/* Background Mesh Glows */}
      <div
        className="position-absolute rounded-circle auth-glow-top-left"
      ></div>
      <div
        className="position-absolute rounded-circle auth-glow-bottom-right"
      ></div>

      <div className="w-100 position-relative auth-card-wrapper">
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
        <div className="card bg-card border border-dark rounded-4 p-4 p-md-5 mb-4">
          <h3 className="text-white fw-semibold mb-1">Sign In</h3>
          <p className="text-muted small mb-4">
            Enter your credentials to access your sports dashboard.
          </p>

          {/* Global Alert Notification */}
          {globalError && (
            <div
              className={`alert d-flex flex-column gap-1.5 align-items-start ${
                resendOption ? "alert-warning bg-warning bg-opacity-10 border-warning border-opacity-20 text-warning" : "alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger"
              } small rounded-3 p-3 mb-4`}
              role="alert"
            >
              <div className="d-flex align-items-center gap-2 fw-semibold">
                <i className={`bi ${resendOption ? "bi-envelope-exclamation" : "bi-shield-slash"}`}></i>
                <span>{resendOption ? "Verification Required" : "Authentication Alert"}</span>
              </div>
              <div className="text-muted text-opacity-80 fs-12 text-inherit">
                {globalError}
              </div>
              {resendOption && (
                <button
                  type="button"
                  onClick={() => alert("Simulated verification link resent to your inbox.")}
                  className="btn btn-link text-warning text-decoration-none small p-0 fw-semibold mt-1 align-baseline"
                >
                  Resend Verification Email
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label text-muted small fw-medium mb-1">EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-control bg-dark text-white fw-medium border-0 ${
                  errors.email ? "is-invalid" : ""
                }`}
                
                placeholder="john@example.com"
              />
              {errors.email && (
                <div className="invalid-feedback small mt-1">{errors.email}</div>
              )}
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label text-muted small fw-medium m-0">PASSWORD</label>
                <Link
                  href="/forgot-password"
                  className="text-success text-decoration-none small fs-12"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-control bg-dark text-white fw-medium border-0 pe-5 ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  
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

            <button
              type="submit"
              className="btn btn-signup w-100 fw-semibold text-uppercase py-2.5 mt-3 ls-05"
              
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted small">New to SportsVerge? </span>
            <Link href="/register" className="text-success text-decoration-none small fw-semibold">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
