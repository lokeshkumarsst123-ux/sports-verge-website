import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join as a Tipster | SportsVerge Pro Tipster Network",
  description:
    "Monetize your sports expertise. Publish free and premium sports predictions for Cricket, Football, NFL, and AFL on SportsVerge.",
};

const benefits = [
  {
    icon: "bi-cash-coin",
    color: "#22c55e",
    title: "Monetize Your Predictions",
    desc: "Set your own prices for premium tips. Earn directly when users unlock your exclusive match analysis and high-confidence predictions.",
  },
  {
    icon: "bi-shield-check",
    color: "#3b82f6",
    title: "Transparent & Verified Stats",
    desc: "Build instant credibility with automatically tracked win-rates, ROI, profit units, and match settlement history.",
  },
  {
    icon: "bi-people-fill",
    color: "#f59e0b",
    title: "Engaged Sports Community",
    desc: "Access thousands of dedicated sports enthusiasts across Cricket, Football, NFL, and AFL seeking expert guidance.",
  },
  {
    icon: "bi-speedometer2",
    color: "#a855f7",
    title: "Comprehensive Tipster Dashboard",
    desc: "Intuitive tools to create, draft, schedule, and analyze your predictions with real-time performance insights.",
  },
  {
    icon: "bi-credit-card-2-front-fill",
    color: "#06b6d4",
    title: "Seamless Stripe Payments",
    desc: "Global and secure payments powered by Stripe with instant payouts and transparent subscription tracking.",
  },
  {
    icon: "bi-trophy-fill",
    color: "#eab308",
    title: "Leaderboard Recognition",
    desc: "Climb top-tipster rankings, earn verified badges, and get featured on SportsVerge trending feeds.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Register Your Profile",
    desc: "Fill in your background, preferred sports (Cricket, Football, NFL, AFL), experience, and bio.",
    icon: "bi-person-plus-fill",
  },
  {
    step: "02",
    title: "Activate Tipster Subscription",
    desc: "Select a monthly, quarterly, or annual plan powered securely by Stripe Checkout.",
    icon: "bi-credit-card-fill",
  },
  {
    step: "03",
    title: "Access Tipster Dashboard",
    desc: "Unlock your dedicated portal to post Free Tips (to gain followers) and Premium Tips (to earn).",
    icon: "bi-layout-text-window-reverse",
  },
  {
    step: "04",
    title: "Publish & Earn",
    desc: "Users discover your predictions, unlock locked insights, and your earnings grow automatically.",
    icon: "bi-graph-up-arrow",
  },
];

const plans = [
  {
    name: "Monthly Plan",
    price: "$29",
    period: "/month",
    badge: "Flexible",
    description: "Ideal for analysts getting started with publishing tips.",
    features: [
      "Publish Unlimited Free & Premium Tips",
      "Full Access to Tipster Dashboard",
      "Public Tipster Profile Page",
      "Standard Analytics & Win-Rate Tracking",
      "Community Follower System",
    ],
    popular: false,
    buttonText: "Get Started Monthly",
  },
  {
    name: "Quarterly Plan",
    price: "$69",
    period: "/3 months",
    badge: "Most Popular",
    savings: "Save 20%",
    description: "Great value for active sports analysts and community builders.",
    features: [
      "Everything in Monthly Plan",
      "Priority Placement in Tips Directory",
      "Advanced ROI & Yield Analytics",
      "Featured Tipster Badge eligibility",
      "Custom Social Profile links",
      "Dedicated Creator Support",
    ],
    popular: true,
    buttonText: "Choose Quarterly Plan",
  },
  {
    name: "Annual Plan",
    price: "$229",
    period: "/year",
    badge: "Best Value",
    savings: "Save 35%",
    description: "Designed for professional tipsters seeking maximum long-term earnings.",
    features: [
      "Everything in Quarterly Plan",
      "Permanent Verified Tipster Pro Badge",
      "Featured on Homepage & Trending Carousel",
      "Zero Transaction Fee Boosts",
      "Direct Analyst VIP Support",
      "Early Access to Future Monetization Tools",
    ],
    popular: false,
    buttonText: "Get Annual Access",
  },
];

const faqs = [
  {
    q: "What sports can I publish tips for?",
    a: "You can publish predictions for Cricket (IPL, World Cups, Tests, T20s), Football (Premier League, Champions League, La Liga), NFL, and AFL.",
  },
  {
    q: "How does the Free vs Premium tips system work?",
    a: "Free tips are visible to all SportsVerge users and help you build followers, rating, and credibility. Premium tips have locked predictions and in-depth analysis that users unlock via secure payment.",
  },
  {
    q: "When can I start publishing after registration?",
    a: "As soon as you complete your profile registration and activate your Tipster subscription via Stripe, your Tipster Dashboard is instantly enabled.",
  },
  {
    q: "Can I manage and edit my tips before matches start?",
    a: "Yes! You can save drafts, schedule tips for upcoming dates, or edit predictions prior to kick-off. Once a match finishes, predictions are settled transparently.",
  },
];

export default function JoinTipsterPage() {
  return (
    <main className="font-outfit text-white py-0">
      {/* Hero Section */}
      <section
        className="position-relative overflow-hidden py-5 py-lg-6"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(26, 140, 61, 0.28), rgba(7, 11, 18, 0) 70%), linear-gradient(180deg, #0d1520 0%, #070b12 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="container custom-container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                <span className="badge rounded-circle p-1 bg-success"></span>
                <span className="text-success fw-semibold" style={{ fontSize: "13px", letterSpacing: "0.04em" }}>
                  SPORTSVERGE TIPSTER PROGRAM
                </span>
              </div>

              <h1
                className="display-4 fw-black font-space-grotesk text-white text-uppercase lh-sm mb-3"
                style={{ letterSpacing: "-0.02em" }}
              >
                Turn Your Sports Knowledge <br />
                <span style={{ color: "var(--accent-green, #22c55e)" }}>Into Real Earnings</span>
              </h1>

              <p className="lead text-secondary mb-4" style={{ fontSize: "16px", maxWidth: "580px", lineHeight: "1.7" }}>
                Join an elite community of sports analysts. Publish verified predictions for Cricket, Football, NFL, and AFL. Grow your following with free tips and monetize with locked premium picks.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 align-items-stretch align-items-sm-center pt-2">
                <Link
                  href="/tipster-register"
                  className="tipster-btn-primary fw-bold rounded-pill px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2 shadow"
                  style={{
                    fontSize: "15px",
                  }}
                >
                  <i className="bi bi-person-plus-fill"></i>
                  <span>Register as Tipster</span>
                </Link>

                <Link
                  href="/tipster-subscription"
                  className="tipster-btn-outline fw-semibold rounded-pill px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2"
                  style={{
                    fontSize: "15px",
                  }}
                >
                  <i className="bi bi-tag-fill text-success"></i>
                  <span>View Subscription Plans</span>
                </Link>
              </div>

              {/* Quick highlights */}
              <div className="row g-3 mt-4 pt-2">
                <div className="col-auto d-flex align-items-center gap-2 text-secondary" style={{ fontSize: "13px" }}>
                  <i className="bi bi-check-circle-fill text-success"></i> Free & Paid Tips
                </div>
                <div className="col-auto d-flex align-items-center gap-2 text-secondary" style={{ fontSize: "13px" }}>
                  <i className="bi bi-check-circle-fill text-success"></i> Stripe Powered
                </div>
                <div className="col-auto d-flex align-items-center gap-2 text-secondary" style={{ fontSize: "13px" }}>
                  <i className="bi bi-check-circle-fill text-success"></i> Transparent Win Rates
                </div>
              </div>
            </div>

            {/* Visual Card / Live Preview mockup */}
            <div className="col-lg-5">
              <div
                className="rounded-4 p-4 position-relative"
                style={{
                  background: "linear-gradient(145deg, #111b27 0%, #0c131c 100%)",
                  border: "1px solid rgba(34, 197, 94, 0.25)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-secondary border-opacity-25 mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold font-space-grotesk"
                      style={{ width: "46px", height: "46px", background: "linear-gradient(135deg, #22c55e, #15803d)" }}
                    >
                      SV
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-white" style={{ fontSize: "14px" }}>ApexPredictor</span>
                        <i className="bi bi-patch-check-fill text-success" title="Verified Pro Tipster"></i>
                      </div>
                      <span className="text-secondary" style={{ fontSize: "12px" }}>Football & Cricket Analyst</span>
                    </div>
                  </div>
                  <span
                    className="badge rounded-pill px-2.5 py-1 font-space-grotesk fw-bold"
                    style={{
                      fontSize: "10px",
                      background: "rgba(245, 158, 11, 0.16)",
                      color: "#fbbf24",
                      border: "1px solid rgba(245, 158, 11, 0.4)",
                    }}
                  >
                    PRO TIPSTER
                  </span>
                </div>

                {/* Sample stats bar */}
                <div className="row g-2 text-center mb-3">
                  <div className="col-4">
                    <div className="p-2 rounded-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="text-success fw-bold font-space-grotesk" style={{ fontSize: "17px" }}>78.4%</div>
                      <div className="text-secondary text-uppercase" style={{ fontSize: "10px" }}>Win Rate</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 rounded-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="text-white fw-bold font-space-grotesk" style={{ fontSize: "17px" }}>+34.2u</div>
                      <div className="text-secondary text-uppercase" style={{ fontSize: "10px" }}>ROI Profit</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 rounded-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="text-white fw-bold font-space-grotesk" style={{ fontSize: "17px" }}>3.4k</div>
                      <div className="text-secondary text-uppercase" style={{ fontSize: "10px" }}>Followers</div>
                    </div>
                  </div>
                </div>

                {/* Sample Tip Card Preview */}
                <div className="rounded-3 p-3 mb-3" style={{ background: "rgba(7, 11, 18, 0.8)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                      className="badge rounded-pill px-2.5 py-1 font-space-grotesk fw-bold d-inline-flex align-items-center gap-1"
                      style={{
                        fontSize: "10px",
                        background: "rgba(239, 68, 68, 0.18)",
                        color: "#f87171",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                      }}
                    >
                      <i className="bi bi-lock-fill"></i>
                      <span>PREMIUM TIP</span>
                    </span>
                    <span className="text-secondary font-monospace" style={{ fontSize: "12px" }}>Odds: 2.15</span>
                  </div>
                  <h6 className="fw-bold text-white mb-1" style={{ fontSize: "13px" }}>Arsenal vs Chelsea — Over 2.5 Goals & BTTS</h6>
                  <p className="text-secondary mb-2" style={{ fontSize: "11px", lineHeight: "1.5" }}>
                    Tactical matchup review, high xG index, and offensive starters confirmed...
                  </p>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-10">
                    <span className="text-success fw-bold" style={{ fontSize: "13px" }}>Price: $4.99</span>
                    <span className="badge rounded-pill bg-success px-3 py-1 text-white" style={{ fontSize: "11px" }}>
                      Unlock Prediction
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <small className="text-secondary" style={{ fontSize: "11px" }}>
                    <i className="bi bi-shield-lock-fill text-success me-1"></i>
                    Stripe payments with real-time settlement & automated dashboard
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join - Benefits Grid */}
      <section className="py-5" style={{ background: "var(--bg-dark, #070b12)" }}>
        <div className="container custom-container py-3">
          <div className="text-center mb-5">
            <span
              className="badge rounded-pill px-3 py-2 mb-2 fw-semibold text-uppercase"
              style={{
                fontSize: "11px",
                background: "rgba(26,140,61,0.15)",
                color: "#86efac",
                border: "1px solid rgba(26,140,61,0.3)",
                letterSpacing: "0.05em",
              }}
            >
              CREATOR BENEFITS
            </span>
            <h2 className="fw-black text-white font-space-grotesk text-uppercase" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
              Why Become a SportsVerge Tipster?
            </h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: "600px", fontSize: "14px" }}>
              Whether you are an established sports handicapper or a seasoned match analyst, SportsVerge gives you the tools to monetize and scale.
            </p>
          </div>

          <div className="row g-4">
            {benefits.map((item, idx) => (
              <div key={idx} className="col-md-6 col-lg-4">
                <div
                  className="rounded-4 p-4 h-100 d-flex flex-column transition-all"
                  style={{
                    background: "var(--bg-card, #0e1520)",
                    border: "1px solid var(--border-dark, rgba(255,255,255,0.08))",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 mb-3 flex-shrink-0"
                    style={{
                      width: "52px",
                      height: "52px",
                      background: `${item.color}15`,
                      color: item.color,
                      fontSize: "22px",
                      border: `1px solid ${item.color}30`,
                    }}
                  >
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <h5 className="fw-bold text-white mb-2 font-space-grotesk" style={{ fontSize: "16px" }}>
                    {item.title}
                  </h5>
                  <p className="text-secondary mb-0 lh-base" style={{ fontSize: "13px" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step by Step Flow */}
      <section
        className="py-5 position-relative"
        style={{
          background: "linear-gradient(180deg, #090e17 0%, #070b12 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="container custom-container py-3">
          <div className="text-center mb-5">
            <span
              className="badge rounded-pill px-3 py-2 mb-2 fw-semibold text-uppercase"
              style={{
                fontSize: "11px",
                background: "rgba(59,130,246,0.15)",
                color: "#93c5fd",
                border: "1px solid rgba(59,130,246,0.3)",
                letterSpacing: "0.05em",
              }}
            >
              HOW IT WORKS
            </span>
            <h2 className="fw-black text-white font-space-grotesk text-uppercase" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
              Four Simple Steps to Start
            </h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: "560px", fontSize: "14px" }}>
              Quick onboarding from registration to publishing predictions and earning subscribers.
            </p>
          </div>

          <div className="row g-4">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div
                  className="p-4 rounded-4 h-100 position-relative text-center d-flex flex-column align-items-center"
                  style={{
                    background: "rgba(14, 21, 32, 0.7)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                  }}
                >
                  <div
                    className="position-absolute top-0 end-0 pt-3 pe-3 text-secondary fw-black font-space-grotesk opacity-25"
                    style={{ fontSize: "28px" }}
                  >
                    {step.step}
                  </div>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      background: "rgba(34, 197, 94, 0.1)",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                      color: "var(--accent-green, #22c55e)",
                      fontSize: "24px",
                    }}
                  >
                    <i className={`bi ${step.icon}`}></i>
                  </div>
                  <h5 className="fw-bold text-white mb-2 font-space-grotesk" style={{ fontSize: "15px" }}>
                    {step.title}
                  </h5>
                  <p className="text-secondary mb-0" style={{ fontSize: "12px", lineHeight: "1.6" }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-5" style={{ background: "var(--bg-dark, #070b12)" }}>
        <div className="container custom-container py-3">
          <div className="text-center mb-5">
            <span
              className="badge rounded-pill px-3 py-2 mb-2 fw-semibold text-uppercase"
              style={{
                fontSize: "11px",
                background: "rgba(234,179,8,0.15)",
                color: "#fde047",
                border: "1px solid rgba(234,179,8,0.3)",
                letterSpacing: "0.05em",
              }}
            >
              MEMBERSHIP PLANS
            </span>
            <h2 className="fw-black text-white font-space-grotesk text-uppercase" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
              Tipster Subscription Plans
            </h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: "600px", fontSize: "14px" }}>
              Choose the subscription plan that matches your goals. Safe, recurring Stripe checkout with anytime cancellation.
            </p>
          </div>

          <div className="row g-4 align-items-stretch justify-content-center">
            {plans.map((plan, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div
                  className="rounded-4 p-4 p-lg-5 h-100 d-flex flex-column position-relative"
                  style={{
                    background: plan.popular
                      ? "linear-gradient(160deg, #132219 0%, #0e1722 100%)"
                      : "var(--bg-card, #0e1520)",
                    border: plan.popular
                      ? "2px solid rgba(34, 197, 94, 0.6)"
                      : "1px solid var(--border-dark, rgba(255,255,255,0.08))",
                    boxShadow: plan.popular ? "0 10px 40px rgba(34, 197, 94, 0.15)" : "none",
                  }}
                >
                  {plan.badge && (
                    <div className="position-absolute top-0 end-0 mt-3 me-3">
                      <span
                        className={`badge rounded-pill px-3 py-1 ${
                          plan.popular ? "bg-success text-white" : "bg-secondary bg-opacity-25 text-light"
                        }`}
                        style={{ fontSize: "11px" }}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <h4 className="fw-bold text-white mb-2 font-space-grotesk" style={{ fontSize: "18px" }}>
                    {plan.name}
                  </h4>
                  <p className="text-secondary mb-3" style={{ fontSize: "12px", minHeight: "36px" }}>
                    {plan.description}
                  </p>

                  <div className="d-flex align-items-baseline gap-1 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                    <span className="display-5 fw-black text-white font-space-grotesk">{plan.price}</span>
                    <span className="text-secondary" style={{ fontSize: "13px" }}>{plan.period}</span>
                    {plan.savings && (
                      <span
                        className="ms-auto badge rounded-pill px-2 py-1 font-space-grotesk fw-bold"
                        style={{
                          fontSize: "11px",
                          background: "rgba(34, 197, 94, 0.16)",
                          color: "#4ade80",
                          border: "1px solid rgba(34, 197, 94, 0.4)",
                        }}
                      >
                        {plan.savings}
                      </span>
                    )}
                  </div>

                  <div className="flex-grow-1 mb-4">
                    <div className="text-uppercase text-secondary fw-bold mb-3" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                      Included Features:
                    </div>
                    <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="d-flex align-items-start gap-2 text-light" style={{ fontSize: "13px" }}>
                          <i className="bi bi-check2 text-success fw-bold mt-1"></i>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/tipster-register?plan=${plan.name.toLowerCase().split(" ")[0]}`}
                    className={`btn w-100 fw-bold rounded-pill py-3 text-center ${
                      plan.popular ? "btn-success" : "tipster-btn-outline"
                    }`}
                    style={{
                      fontSize: "14px",
                      background: plan.popular ? "var(--accent-green, #22c55e)" : undefined,
                    }}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-5" style={{ background: "linear-gradient(180deg, #070b12 0%, #0d1520 100%)" }}>
        <div className="container custom-container py-3" style={{ maxWidth: "860px" }}>
          <div className="text-center mb-5">
            <span
              className="badge rounded-pill px-3 py-2 mb-2 fw-semibold text-uppercase"
              style={{
                fontSize: "11px",
                background: "rgba(255,255,255,0.1)",
                color: "#f8fafc",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              GOT QUESTIONS?
            </span>
            <h2 className="fw-black text-white font-space-grotesk text-uppercase" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
              Tipster Program FAQs
            </h2>
          </div>

          <div className="d-flex flex-column gap-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-4 p-4"
                style={{
                  background: "var(--bg-card, #0e1520)",
                  border: "1px solid var(--border-dark, rgba(255,255,255,0.08))",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-question-circle-fill text-success" style={{ fontSize: "16px" }}></i>
                  <h5 className="fw-bold text-white mb-0 font-space-grotesk" style={{ fontSize: "15px" }}>
                    {faq.q}
                  </h5>
                </div>
                <p className="text-secondary mb-0 ps-4 lh-base" style={{ fontSize: "13px" }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Callout */}
          <div
            className="rounded-4 p-4 p-md-5 mt-5 text-center position-relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.02) 100%)",
              border: "1px solid rgba(34,197,94,0.3)",
            }}
          >
            <h3 className="fw-black text-white font-space-grotesk mb-2 text-uppercase">
              Ready to Share Your First Winning Tip?
            </h3>
            <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: "540px", fontSize: "14px" }}>
              Join hundreds of sports analysts today and establish your track record with SportsVerge.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-stretch align-items-sm-center">
              <Link
                href="/tipster-register"
                className="tipster-btn-primary fw-bold rounded-pill px-5 py-3 shadow"
                style={{ fontSize: "15px" }}
              >
                Apply as a Tipster
              </Link>
              <Link
                href="/tips"
                className="tipster-btn-outline fw-semibold rounded-pill px-4 py-3"
                style={{ fontSize: "15px" }}
              >
                Explore Active Tips
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
