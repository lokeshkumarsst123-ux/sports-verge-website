import React from "react";
import Link from "next/link";

export default function JoinTipsterBanner() {
  return (
    <section
      className="my-4 rounded-4 position-relative overflow-hidden p-4 p-md-5"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 85% 30%, rgba(34, 197, 94, 0.22), rgba(7, 11, 18, 0) 70%), linear-gradient(135deg, #0e1722 0%, #09101a 100%)",
        border: "1px solid rgba(34, 197, 94, 0.35)",
        boxShadow: "0 14px 40px rgba(0, 0, 0, 0.35)",
      }}
    >
      <div className="row align-items-center g-4 position-relative z-1">
        <div className="col-lg-8">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: "rgba(34, 197, 94, 0.14)", border: "1px solid rgba(34, 197, 94, 0.35)" }}>
            <span className="badge rounded-circle p-1 bg-success"></span>
            <span className="text-success fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
              Join SportsVerge Tipster Network
            </span>
          </div>

          <h3 className="fw-black text-white font-space-grotesk text-uppercase mb-2" style={{ fontSize: "clamp(1.4rem, 2.8vw, 1.9rem)", letterSpacing: "-0.01em" }}>
            Are You a Sports Analyst? <span style={{ color: "var(--accent-green, #22c55e)" }}>Monetize Your Predictions</span>
          </h3>

          <p className="text-secondary mb-3" style={{ fontSize: "14px", lineHeight: "1.6", maxWidth: "580px" }}>
            Publish free & premium tips for Cricket, Football, NFL, and AFL. Track verified win rates, build a dedicated following, and get paid directly via Stripe.
          </p>

          <div className="d-flex flex-wrap gap-2 align-items-center pt-1">
            <Link
              href="/join-tipster"
              className="btn btn-success fw-bold rounded-pill px-4 py-2.5 d-inline-flex align-items-center gap-2 shadow"
              style={{
                background: "var(--accent-green, #22c55e)",
                border: "none",
                fontSize: "14px",
              }}
            >
              <i className="bi bi-person-plus-fill"></i>
              Join as a Tipster
            </Link>

            <Link
              href="/tipster-register"
              className="btn btn-outline-light fw-semibold rounded-pill px-4 py-2.5 d-inline-flex align-items-center gap-2"
              style={{
                borderColor: "rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.03)",
                fontSize: "14px",
              }}
            >
              Register Now
            </Link>
          </div>
        </div>

        <div className="col-lg-4 text-lg-end">
          <div className="d-flex flex-column gap-2 text-start p-3 rounded-3" style={{ background: "rgba(7, 11, 18, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", maxWidth: "280px", marginLeft: "auto" }}>
            <div className="d-flex align-items-center gap-2 text-light small">
              <i className="bi bi-check-circle-fill text-success"></i>
              <span>Free & Paid Prediction Tiers</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-light small">
              <i className="bi bi-shield-check text-success"></i>
              <span>Automated Win-Rate Tracking</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-light small">
              <i className="bi bi-credit-card-fill text-success"></i>
              <span>Instant Stripe Creator Payouts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
