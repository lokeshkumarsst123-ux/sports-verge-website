"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "sending" | "verify_sent">("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    
    // Email check
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    } else if (formData.email.toLowerCase() === "admin@sportsverge.com") {
      newErrors.email = "This email address is already registered.";
    }

    // Password security check
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number and one letter.";
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setStep("sending");

    // Simulate calling API & sending verification email
    setTimeout(() => {
      setLoading(false);
      setStep("verify_sent");
      // Store user registration details temporarily
      sessionStorage.setItem(
        "registered_user",
        JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          verified: false,
        })
      );
    }, 2000);
  };

  // Simulates clicking the link in the verification email
  const handleSimulateVerification = () => {
    setLoading(true);
    setTimeout(() => {
      const user = sessionStorage.getItem("registered_user");
      if (user) {
        const parsed = JSON.parse(user);
        parsed.verified = true;
        sessionStorage.setItem("registered_user", JSON.stringify(parsed));
        sessionStorage.setItem("user_session", JSON.stringify(parsed)); // log them in
      }
      setLoading(false);
      router.push("/profile");
    }, 1500);
  };

  return (
    <main
      className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3 position-relative overflow-hidden auth-main-bg"
      
    >
      {/* Background Mesh Glows */}
      <div
        className="position-absolute rounded-circle mesh-glow-1"
      ></div>
      <div
        className="position-absolute rounded-circle mesh-glow-2"
      ></div>

      <div className="w-100 position-relative register-card-wrapper">
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
          {step === "form" && (
            <>
              <h3 className="text-white fw-semibold mb-1">Create Account</h3>
              <p className="text-muted small mb-4">
                Get started today and experience premium sports analytics.
              </p>

              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label text-muted small fw-medium mb-1">FIRST NAME</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`form-control bg-dark text-white fw-medium border-0 ${
                        errors.firstName ? "is-invalid" : ""
                      }`}
                      
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback small mt-1">{errors.firstName}</div>
                    )}
                  </div>
                  <div className="col-6">
                    <label className="form-label text-muted small fw-medium mb-1">LAST NAME</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`form-control bg-dark text-white fw-medium border-0 ${
                        errors.lastName ? "is-invalid" : ""
                      }`}
                      
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback small mt-1">{errors.lastName}</div>
                    )}
                  </div>
                </div>

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
                  <label className="form-label text-muted small fw-medium mb-1">PASSWORD</label>
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

                <div>
                  <label className="form-label text-muted small fw-medium mb-1">CONFIRM PASSWORD</label>
                  <div className="position-relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-control bg-dark text-white fw-medium border-0 pe-5 ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      
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

                <div className="form-check mt-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="termsCheck"
                    required
                  />
                  <label className="form-check-label text-muted small" htmlFor="termsCheck">
                    I agree to the <Link href="#" className="text-success text-decoration-none">Terms of Service</Link> & <Link href="#" className="text-success text-decoration-none">Privacy Policy</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-signup w-100 fw-semibold text-uppercase py-2.5 mt-3 ls-05"
                  
                  disabled={loading}
                >
                  Create Account
                </button>
              </form>

              <div className="text-center mt-4">
                <span className="text-muted small">Already have an account? </span>
                <Link href="/login" className="text-success text-decoration-none small fw-semibold">
                  Sign In
                </Link>
              </div>
            </>
          )}

          {step === "sending" && (
            <div className="text-center py-4">
              <div className="spinner-border text-success mb-3 spinner-large" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4 className="text-white fw-semibold">Creating Account...</h4>
              <p className="text-muted small mt-2">
                We are configuring your profile and preparing secure access.
              </p>
            </div>
          )}

          {step === "verify_sent" && (
            <div className="text-center py-2">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle p-3 mb-4 envelope-icon-wrapper"
              >
                <i className="bi bi-envelope-check-fill fs-28"></i>
              </div>
              <h4 className="text-white fw-semibold">Verify Your Email</h4>
              <p className="text-muted small my-3 lh-16">
                A verification link has been sent to <strong className="text-light">{formData.email}</strong>. 
                Please click the link in the email to activate your profile dashboard.
              </p>

              {/* Simulation Sandbox CTA */}
              <div className="bg-dark bg-opacity-40 border border-secondary border-opacity-10 rounded-3 p-3 my-4">
                <span className="badge bg-secondary bg-opacity-20 text-success mb-2 px-2.5 py-1.5 sandbox-badge">
                  SIMULATION SANDBOX
                </span>
                <p className="text-muted sandbox-text">
                  In production, users would check their email client. Click the trigger below to simulate clicking the email link.
                </p>
                <button
                  onClick={handleSimulateVerification}
                  className="btn btn-login w-100 fw-semibold text-uppercase py-2 fs-11"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Simulate Email Link Click"}
                </button>
              </div>

              <div className="text-center mt-2">
                <span className="text-muted small">Didn't receive the email? </span>
                <button
                  onClick={() => {
                    setStep("sending");
                    setTimeout(() => setStep("verify_sent"), 1500);
                  }}
                  className="btn btn-link text-success text-decoration-none small p-0 fw-semibold align-baseline"
                >
                  Resend Link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
