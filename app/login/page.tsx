"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  apiErrorMessage,
  apiFieldErrors,
  authApi,
  saveAuthSession,
} from "@/lib/auth-api";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="container py-5">
          <p role="status">Loading sign in...</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedNext = searchParams.get("next");
  const nextPath =
    requestedNext &&
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//")
      ? requestedNext
      : null;
  const registerHref = nextPath
    ? `/register?next=${encodeURIComponent(nextPath)}`
    : "/register";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
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

    // Standard Sign In Flow
    try {
      const response = await authApi.login(formData);
      sessionStorage.removeItem("admin_session");
      saveAuthSession(response.data);
      router.push(nextPath || "/profile");
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
          {/* Heading and description */}
          <div className="mb-4">
            <h3 className="auth-title h3 mb-1">Sign In</h3>
            <p className="auth-subtitle mb-0">
              One account for browsing tips and managing your Tipster profile.
            </p>
          </div>
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
              <div className="text-muted text-opacity-80 fs-12 text-inherit">
                {globalError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="auth-label">EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-control auth-input ${
                  errors.email ? "is-invalid" : ""
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <div className="invalid-feedback small mt-1">
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="auth-label mb-0">PASSWORD</label>
                <Link href="/forgot-password" className="auth-link small fs-12">
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
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback d-block small mt-1">
                  {errors.password}
                </div>
              )}
              <small className="password-hint d-block mt-1">
                Enter your registered password.
              </small>
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
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center mt-4 pt-3 auth-footer-divider">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted small">New to SportsVerge?</span>
              <Link href={registerHref} className="auth-link small">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
