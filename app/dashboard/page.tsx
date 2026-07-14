"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [newsletterChecked, setNewsletterChecked] = useState(true);
  const [smsAlertsChecked, setSmsAlertsChecked] = useState(false);

  useEffect(() => {
    // Check if session exists, fallback to registered user, otherwise redirect to login
    const session = sessionStorage.getItem("user_session");
    const registered = sessionStorage.getItem("registered_user");

    if (session) {
      setUser(JSON.parse(session));
    } else if (registered) {
      const parsed = JSON.parse(registered);
      if (parsed.verified) {
        setUser(parsed);
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("user_session");
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="min-vh-100 d-flex align-items-center justify-content-center text-white" style={{ background: "var(--bg-dark)" }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-vh-100 py-5" style={{ background: "var(--bg-dark)", color: "var(--text-light)" }}>
      <div className="container custom-container">
        {/* Upper Breadcrumb/Header */}
        <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom border-secondary border-opacity-10">
          <div>
            <span
              className="text-success font-monospace mb-1 text-uppercase fw-semibold fs-11"
            >
              MEMBERS AREA
            </span>
            <h2 className="fw-bold mb-0">
              Welcome back, <span className="text-success">{user.firstName}</span>!
            </h2>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm px-3 py-2 fw-semibold text-uppercase fs-11"
          >
            <i className="bi bi-box-arrow-right me-1"></i> Sign Out
          </button>
        </div>

        <div className="row g-4">
          {/* Card Left: User details */}
          <div className="col-12 col-md-5">
            <div className="card bg-card border border-dark rounded-3 p-4">
              <div className="text-center mb-4 pb-3 border-bottom border-secondary border-opacity-10">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle fw-bold fs-3 mb-3"
                // style={{ width: "80px", height: "80px", border: "2px solid rgba(26, 140, 61, 0.3)" }}
                >
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <h5 className="fw-bold m-0">
                  {user.firstName} {user.lastName}
                </h5>
                <span className="small">{user.email}</span>
              </div>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small fw-medium">ACCOUNT TIER</span>
                  <span className="badge bg-success bg-opacity-10 text-success fw-bold font-monospace px-2 py-1 fs-10">
                    PREMIUM PASS
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small fw-medium">EMAIL STATUS</span>
                  <span className="badge bg-success text-white fw-bold font-monospace px-2 py-1 fs-10">
                    VERIFIED
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small fw-medium">MEMBER SINCE</span>
                  <span className="text-light small font-monospace">JULY 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Right: Preferences and mock analytics */}
          <div className="col-12 col-md-7 d-flex flex-column gap-4">
            {/* Preferences Card */}
            <div className="card bg-card border border-dark rounded-3 p-4">
              <h5 className="text-white fw-bold mb-4 border-start border-success border-3 ps-2">
                Notification Preferences
              </h5>

              <div className="d-flex flex-column gap-3">
                <div className="form-check form-switch d-flex justify-content-between align-items-center p-0">
                  <label className="form-check-label text-muted small fw-medium" htmlFor="newsletterSwitch">
                    WEEKLY NEWSLETTER & ANALYTICS
                  </label>
                  <input
                    className="form-check-input bg-dark border-0 ms-0"
                    type="checkbox"
                    role="switch"
                    id="newsletterSwitch"
                    checked={newsletterChecked}
                    onChange={() => setNewsletterChecked(!newsletterChecked)}

                  />
                </div>

                <div className="form-check form-switch d-flex justify-content-between align-items-center p-0">
                  <label className="form-check-label text-muted small fw-medium" htmlFor="smsSwitch">
                    REAL-TIME SMS MATCH ALERTS
                  </label>
                  <input
                    className="form-check-input bg-dark border-0 ms-0"
                    type="checkbox"
                    role="switch"
                    id="smsSwitch"
                    checked={smsAlertsChecked}
                    onChange={() => setSmsAlertsChecked(!smsAlertsChecked)}

                  />
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="card bg-card border border-dark rounded-3 p-4">
              <h5 className="text-white fw-bold mb-3 border-start border-success border-3 ps-2">
                Quick Shortcuts
              </h5>
              <p className="text-muted small mb-4">
                Jump right back into live match tracking and analytical score boards.
              </p>

              <div className="row g-2">
                <div className="col-6">
                  <Link
                    href="/live-scores"
                    className="btn btn-dark w-100 py-3 rounded border border-secondary border-opacity-10 d-flex flex-column align-items-center gap-2 text-decoration-none"

                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--custom-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)")}
                  >
                    <i className="bi bi-activity text-success fs-3"></i>
                    <span className="text-white small fw-bold">Live Scores</span>
                  </Link>
                </div>
                <div className="col-6">
                  <Link
                    href="#"
                    className="btn btn-dark w-100 py-3 rounded border border-secondary border-opacity-10 d-flex flex-column align-items-center gap-2 text-decoration-none"

                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--custom-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)")}
                  >
                    <i className="bi bi-bookmark-star text-success fs-3"></i>
                    <span className="text-white small fw-bold">My Bookmarks</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
