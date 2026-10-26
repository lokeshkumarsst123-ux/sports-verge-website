"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { logoutUser } from "@/lib/auth-api";

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
    setLoading(true);
    const timer = setTimeout(() => {
      const session = sessionStorage.getItem("user_session");
      if (session) {
        setUser(JSON.parse(session));
      } else {
        router.push("/login");
      }
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [router]);

  const handleLogout = async () => {
    await logoutUser();
    sessionStorage.removeItem("registered_user");
    router.push("/");
  };

  if (loading) {
    return (
      <main className="font-outfit">
        <DashboardSkeleton />
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="font-outfit" style={{ background: "#FFFDF9", minHeight: "100vh", paddingBottom: "60px" }}>
      <div className="container custom-container py-4">
        {/* Upper Breadcrumb/Header */}
        <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom" style={{ borderColor: "#EAE5DC" }}>
          <div>
            <span
              className="font-monospace mb-1 text-uppercase fw-bold fs-11 d-block"
              style={{ color: "#4A90E2", letterSpacing: "0.08em" }}
            >
              MEMBERS AREA
            </span>
            <h2 className="fw-bold mb-0 font-space-grotesk" style={{ color: "#1C1F22" }}>
              Welcome back, <span style={{ color: "#FFCC00" }}>{user.firstName}</span>!
            </h2>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm px-3 py-2 fw-semibold text-uppercase fs-11 rounded-pill"
          >
            <i className="bi bi-box-arrow-right me-1"></i> Sign Out
          </button>
        </div>

        <div className="row g-4">
          {/* Card Left: User details */}
          <div className="col-12 col-md-5">
            <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
              <div className="text-center mb-4 pb-3 border-bottom" style={{ borderColor: "#EAE5DC" }}>
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle fw-bold fs-3 mb-3 shadow-sm"
                  style={{ width: "80px", height: "80px", background: "#FAF6EF", color: "#1C1F22", border: "2px solid #FFCC00" }}
                >
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <h5 className="fw-bold m-0 font-space-grotesk" style={{ color: "#1C1F22" }}>
                  {user.firstName} {user.lastName}
                </h5>
                <span className="small" style={{ color: "#5C646D" }}>{user.email}</span>
              </div>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="small fw-semibold" style={{ color: "#76808D" }}>ACCOUNT TIER</span>
                  <span className="badge rounded-pill fw-bold font-monospace px-3 py-1 fs-11" style={{ background: "rgba(255, 204, 0, 0.15)", color: "#997A00", border: "1px solid rgba(255, 204, 0, 0.3)" }}>
                    PREMIUM PASS
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="small fw-semibold" style={{ color: "#76808D" }}>EMAIL STATUS</span>
                  <span className="badge rounded-pill fw-bold font-monospace px-3 py-1 fs-11" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#16A34A", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                    VERIFIED
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="small fw-semibold" style={{ color: "#76808D" }}>MEMBER SINCE</span>
                  <span className="small font-monospace fw-semibold" style={{ color: "#1C1F22" }}>JULY 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Right: Preferences and mock analytics */}
          <div className="col-12 col-md-7 d-flex flex-column gap-4">
            {/* Preferences Card */}
            <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
              <h5 className="fw-bold mb-4 border-start border-3 ps-2 font-space-grotesk" style={{ borderColor: "#FFCC00", color: "#1C1F22" }}>
                Notification Preferences
              </h5>

              <div className="d-flex flex-column gap-3">
                <div className="form-check form-switch d-flex justify-content-between align-items-center p-0">
                  <label className="form-check-label small fw-medium" htmlFor="newsletterSwitch" style={{ color: "#5C646D" }}>
                    WEEKLY NEWSLETTER & ANALYTICS
                  </label>
                  <input
                    className="form-check-input ms-0"
                    type="checkbox"
                    role="switch"
                    id="newsletterSwitch"
                    checked={newsletterChecked}
                    onChange={() => setNewsletterChecked(!newsletterChecked)}
                    style={{ accentColor: "#FFCC00", cursor: "pointer" }}
                  />
                </div>

                <div className="form-check form-switch d-flex justify-content-between align-items-center p-0">
                  <label className="form-check-label small fw-medium" htmlFor="smsSwitch" style={{ color: "#5C646D" }}>
                    REAL-TIME SMS MATCH ALERTS
                  </label>
                  <input
                    className="form-check-input ms-0"
                    type="checkbox"
                    role="switch"
                    id="smsSwitch"
                    checked={smsAlertsChecked}
                    onChange={() => setSmsAlertsChecked(!smsAlertsChecked)}
                    style={{ accentColor: "#FFCC00", cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
              <h5 className="fw-bold mb-2 border-start border-3 ps-2 font-space-grotesk" style={{ borderColor: "#FFCC00", color: "#1C1F22" }}>
                Quick Shortcuts
              </h5>
              <p className="small mb-4" style={{ color: "#5C646D" }}>
                Jump right back into live match tracking and analytical score boards.
              </p>

              <div className="row g-3">
                <div className="col-6">
                  <Link
                    href="/live-scores"
                    className="btn w-100 py-3 rounded-4 d-flex flex-column align-items-center gap-2 text-decoration-none shadow-sm transition-all hover-translate"
                    style={{ background: "#FAF6EF", border: "1px solid #EAE5DC", color: "#1C1F22" }}
                  >
                    <i className="bi bi-activity fs-3" style={{ color: "#4A90E2" }}></i>
                    <span className="small fw-bold" style={{ color: "#1C1F22" }}>Live Scores</span>
                  </Link>
                </div>
                <div className="col-6">
                  <Link
                    href="/standings"
                    className="btn w-100 py-3 rounded-4 d-flex flex-column align-items-center gap-2 text-decoration-none shadow-sm transition-all hover-translate"
                    style={{ background: "#FAF6EF", border: "1px solid #EAE5DC", color: "#1C1F22" }}
                  >
                    <i className="bi bi-bar-chart-line fs-3" style={{ color: "#FFCC00" }}></i>
                    <span className="small fw-bold" style={{ color: "#1C1F22" }}>Standings</span>
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
