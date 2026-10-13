"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin-api";
import { useAdminToast } from "@/components/admin/AdminToast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useAdminToast();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors: { [key: string]: string } = {};
    if (!formData.email.trim()) nextErrors.email = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = "Please enter a valid email address.";
    if (!formData.password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) { showToast({ type: "error", message: "Please check the highlighted login fields." }); return; }

    setLoading(true);
    try {
      const response = await adminApi.login(formData);
      sessionStorage.removeItem("user_session");
      sessionStorage.setItem("admin_session", JSON.stringify(response.data));
      router.replace("/admin");
    } catch (error) {
      showToast({ type: "error", title: "Sign in failed", message: error instanceof Error ? error.message : "Unable to sign in. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3 position-relative overflow-hidden auth-main-bg admin-auth-main">
      <div className="position-absolute rounded-circle auth-glow-top-left" />
      <div className="position-absolute rounded-circle auth-glow-bottom-right" />

      <div className="w-100 position-relative auth-card-wrapper">
        <div className="text-center mb-4">
          <Link href="/" className="d-inline-block" aria-label="Return to SportsVerge home">
            <Image src="/assets/imgs/logo-white.svg" alt="SportsVerge" width={180} height={45} className="brand-logo" priority />
          </Link>
        </div>

        <div className="card bg-card border border-dark rounded-4 p-4 p-md-5 mb-4 admin-auth-card">
          <div className="admin-auth-kicker mb-3"><span className="admin-auth-kicker-icon"><i className="bi bi-shield-lock-fill" /></span><span>ADMIN CONSOLE</span></div>
          <h3 className="text-white fw-semibold mb-1">Admin Sign In</h3>
          <p className="text-muted small mb-4">Enter your administrator credentials to manage SportsVerge.</p>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label text-muted small fw-medium mb-1">ADMIN EMAIL</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`form-control bg-dark text-white fw-medium border-0 ${errors.email ? "is-invalid" : ""}`} placeholder="admin@example.com" autoComplete="username" />
              {errors.email && <div className="invalid-feedback small mt-1">{errors.email}</div>}
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center mb-1"><label className="form-label text-muted small fw-medium m-0">PASSWORD</label><span className="text-muted fs-12"><i className="bi bi-lock me-1" />Secure access</span></div>
              <div className="position-relative">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} className={`form-control bg-dark text-white fw-medium border-0 pe-5 ${errors.password ? "is-invalid" : ""}`} placeholder="••••••••" autoComplete="current-password" />
                <button type="button" className="btn position-absolute top-50 end-0 translate-middle-y border-0 text-muted px-3" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"}><i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} /></button>
              </div>
              {errors.password && <div className="invalid-feedback d-block small mt-1">{errors.password}</div>}
            </div>

            <button type="submit" className="btn btn-signup w-100 fw-semibold text-uppercase py-2.5 mt-3 ls-05" disabled={loading}>{loading ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Signing In...</> : "Sign In to Admin"}</button>
          </form>

          <div className="text-center mt-4"><Link href="/" className="text-success text-decoration-none small fw-semibold"><i className="bi bi-arrow-left me-1" />Return to public website</Link></div>
        </div>
      </div>
    </main>
  );
}
