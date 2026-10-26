import React from "react";
import Link from "next/link";

export default function JoinTipsterBanner() {
  return (
    <section
      className="my-4 rounded-4 position-relative overflow-hidden p-4 p-md-5"
      style={{
        background: "linear-gradient(135deg, #FAF6EE 0%, #FFFFFF 100%)",
        border: "1px solid #EAE5DC",
        boxShadow: "0 10px 30px rgba(28, 31, 34, 0.06)",
      }}
    >
      <div className="row align-items-center g-4 position-relative z-1">
        <div className="col-lg-8">
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
            style={{
              background: "rgba(74, 144, 226, 0.12)",
              border: "1px solid rgba(74, 144, 226, 0.3)",
            }}
          >
            <span className="badge rounded-circle p-1" style={{ backgroundColor: "#4A90E2" }}></span>
            <span
              className="fw-bold text-uppercase"
              style={{ fontSize: "11px", letterSpacing: "0.06em", color: "#4A90E2" }}
            >
              Join SportsVerge Tipster Network
            </span>
          </div>

          <h3
            className="fw-black font-space-grotesk text-uppercase mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.8vw, 1.9rem)", letterSpacing: "-0.01em", color: "#1C1F22" }}
          >
            Are You a Sports Analyst? <span style={{ color: "#4A90E2" }}>Monetize Your Predictions</span>
          </h3>

          <p className="mb-3" style={{ fontSize: "14px", lineHeight: "1.6", maxWidth: "580px", color: "#5A626A" }}>
            Publish free & premium tips for Cricket, Football, NFL, and AFL. Track verified win rates, build a dedicated following, and get paid directly via Stripe.
          </p>

          <div className="d-flex flex-wrap gap-2 align-items-center pt-1">
            <Link
              href="/join-tipster"
              className="btn fw-bold rounded-pill px-4 py-2.5 d-inline-flex align-items-center gap-2 shadow-sm"
              style={{
                backgroundColor: "#FFCC00",
                color: "#1C1F22",
                border: "none",
                fontSize: "14px",
              }}
            >
              <i className="bi bi-person-plus-fill"></i>
              Join as a Tipster
            </Link>

            <Link
              href="/tipster-register"
              className="btn fw-semibold rounded-pill px-4 py-2.5 d-inline-flex align-items-center gap-2"
              style={{
                borderColor: "#1C1F22",
                color: "#1C1F22",
                background: "transparent",
                fontSize: "14px",
              }}
            >
              Register Now
            </Link>
          </div>
        </div>

        <div className="col-lg-4 text-lg-end">
          <div
            className="d-flex flex-column gap-2 text-start p-3 rounded-3"
            style={{
              background: "#FFFFFF",
              border: "1px solid #EAE5DC",
              boxShadow: "0 4px 15px rgba(28, 31, 34, 0.04)",
              maxWidth: "280px",
              marginLeft: "auto",
            }}
          >
            <div className="d-flex align-items-center gap-2 small" style={{ color: "#1C1F22" }}>
              <i className="bi bi-check-circle-fill" style={{ color: "#4A90E2" }}></i>
              <span>Free & Paid Prediction Tiers</span>
            </div>
            <div className="d-flex align-items-center gap-2 small" style={{ color: "#1C1F22" }}>
              <i className="bi bi-shield-check" style={{ color: "#4A90E2" }}></i>
              <span>Automated Win-Rate Tracking</span>
            </div>
            <div className="d-flex align-items-center gap-2 small" style={{ color: "#1C1F22" }}>
              <i className="bi bi-credit-card-fill" style={{ color: "#4A90E2" }}></i>
              <span>Instant Stripe Creator Payouts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
