"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiErrorMessage, apiFieldErrors, authApi, saveAuthSession } from "@/lib/auth-api";
import { getStoredTipster, saveStoredTipster, INITIAL_TIPSTERS } from "@/lib/tipster-store";

export default function LoginPage() {
  const router = useRouter();
  const [loginRole, setLoginRole] = useState<"user" | "tipster">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("role") === "tipster") {
        return "tipster";
      }
    }
    return "user";
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleChange = (role: "user" | "tipster") => {
    setLoginRole(role);
    setGlobalError(null);
    setErrors({});
    setFormData({
      email: "",
      password: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (globalError) {
      setGlobalError(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setGlobalError(null);

    // Tipster Studio Sign In Flow
    if (loginRole === "tipster") {
      try {
        // Find existing tipster by email or use matching demo tipster
        const matched = INITIAL_TIPSTERS.find(
          (t) => t.email.toLowerCase() === formData.email.trim().toLowerCase()
        );

        if (matched) {
          saveStoredTipster(matched);
        } else {
          // Check if already in localStorage or create tipster profile
          const existing = getStoredTipster();
          if (existing && existing.email.toLowerCase() === formData.email.trim().toLowerCase()) {
            saveStoredTipster(existing);
          } else {
            const newTipster = {
              ...INITIAL_TIPSTERS[0],
              id: `tipster-${Date.now()}`,
              displayName: formData.email.split("@")[0],
              username: formData.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, ""),
              email: formData.email.trim(),
              subscriptionStatus: "active" as const,
              createdAt: new Date().toISOString(),
            };
            saveStoredTipster(newTipster);
          }
        }

        // Redirect to Tipster Dashboard
        setTimeout(() => {
          setLoading(false);
          router.push("/tipster/dashboard");
        }, 400);
        return;
      } catch (err) {
        setGlobalError("Failed to sign in to Tipster Studio. Please try again.");
        setLoading(false);
        return;
      }
    }

    // Standard User Sign In Flow
    try {
      const response = await authApi.login(formData);
      sessionStorage.removeItem("admin_session");
      saveAuthSession(response.data);
      const requestedNext =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null;
      const nextPath =
        requestedNext && requestedNext.startsWith("/") && !requestedNext.startsWith("//")
          ? requestedNext
          : "/profile";
      router.push(nextPath);
    } catch (error) {
      setGlobalError(apiErrorMessage(error));
      setErrors(apiFieldErrors(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3 position-relative overflow-hidden auth-main-bg">
      {/* Background Ambient Glows */}
      <div className="position-absolute rounded-circle auth-glow-top-left"></div>
      <div className="position-absolute rounded-circle auth-glow-bottom-right"></div>

      <div className="w-100 position-relative auth-card-wrapper">
        {/* Logo Header */}
        <div className="text-center mb-4">
          <Link href="/" className="d-inline-block">
            <Image
              src="/assets/imgs/logo.svg"
              alt="SportsVerge"
              width={180}
              height={45}
              className="brand-logo"
              priority
            />
          </Link>
        </div>

        {/* Card Body */}
        <div className="card auth-card p-4 p-md-5 mb-4">
          {/* Role Selector Tabs (User vs Tipster) */}
          <div className="auth-role-tabs mb-4 d-flex align-items-center">
            <button
              type="button"
              onClick={() => handleRoleChange("user")}
              className={`btn flex-fill auth-role-tab d-inline-flex align-items-center justify-content-center gap-2 ${
                loginRole === "user" ? "active" : ""
              }`}
            >
              <i className="bi bi-person-fill"></i>
              <span>User Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("tipster")}
              className={`btn flex-fill auth-role-tab d-inline-flex align-items-center justify-content-center gap-2 ${
                loginRole === "tipster" ? "active" : ""
              }`}
            >
              <i className="bi bi-speedometer2"></i>
              <span>Tipster Studio</span>
            </button>
          </div>

          {/* Heading and description dynamically keyed to role */}
          {loginRole === "tipster" ? (
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-1 flex-wrap gap-2">
                <h3 className="auth-title h3 mb-0">Tipster Studio</h3>
                <span className="auth-badge-pro">
                  <i className="bi bi-patch-check-fill me-1"></i> PRO CREATOR
                </span>
              </div>
              <p className="auth-subtitle mb-0">
                Sign in to your Tipster Studio to publish tips and track performance.
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <h3 className="auth-title h3 mb-1">Sign In</h3>
              <p className="auth-subtitle mb-0">
                Enter your credentials to access your sports dashboard.
              </p>
            </div>
          )}

          {/* Global Alert Notification */}
          {globalError && (
            <div
              className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger small rounded-3 p-3 mb-4"
              role="alert"
            >
              <div className="d-flex align-items-center gap-2 fw-semibold">
                <i className="bi bi-shield-slash"></i>
                <span>Authentication Alert</span>
              </div>
              <div className="text-muted text-opacity-80 fs-12 text-inherit">{globalError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="auth-label">
                {loginRole === "tipster" ? "TIPSTER EMAIL ADDRESS" : "EMAIL ADDRESS"}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-control auth-input ${
                  errors.email ? "is-invalid" : ""
                }`}
                placeholder={
                  loginRole === "tipster" ? "tipster@sportsverge.com" : "john@example.com"
                }
              />
              {errors.email && <div className="invalid-feedback small mt-1">{errors.email}</div>}
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="auth-label mb-0">PASSWORD</label>
                <Link
                  href="/forgot-password"
                  className="auth-link small fs-12"
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
                  className={`form-control auth-input pe-5 ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="auth-eye-btn position-absolute top-50 end-0 translate-middle-y"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
              className="btn btn-signup w-100 fw-semibold text-uppercase py-2.5 mt-3 ls-05 d-inline-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Signing In...
                </>
              ) : loginRole === "tipster" ? (
                <>
                  <i className="bi bi-speedometer2"></i>
                  <span>Sign In to Tipster Studio</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center mt-4 pt-3 auth-footer-divider">
            {loginRole === "tipster" ? (
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted small">Not a Tipster yet?</span>
                <Link
                  href="/tipster-register"
                  className="auth-link small"
                >
                  Join as Pro Tipster
                </Link>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted small">New to SportsVerge?</span>
                <Link
                  href="/register"
                  className="auth-link small"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


