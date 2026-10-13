"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TipsterProfile,
  TipsterSubscriptionPlan,
  SubscriptionPlanType,
} from "@/types/tipster";
import {
  getStoredTipster,
  saveStoredTipster,
  INITIAL_TIPSTERS,
  useIsMounted,
} from "@/lib/tipster-store";

const PLANS: TipsterSubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Monthly Plan",
    price: 29,
    billingPeriod: "Billed monthly",
    intervalText: "/month",
    badge: "Flexible",
    features: [
      "Publish Unlimited Free & Premium Tips",
      "Tipster Dashboard & Analytical Tools",
      "Public Tipster Profile Page",
      "Verified Win-Rate & ROI Tracking",
      "Community Follower Notifications",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly Plan",
    price: 69,
    billingPeriod: "Billed every 3 months",
    intervalText: "/3 months",
    badge: "Most Popular",
    popular: true,
    savings: "Save 20%",
    features: [
      "Everything in Monthly Plan",
      "Priority Placement in Tips Directory",
      "Advanced ROI & Yield Distribution Stats",
      "Verified Creator Badge Eligibility",
      "Custom Social Profile & Telegram link",
      "Priority Creator Support",
    ],
  },
  {
    id: "annual",
    name: "Annual Plan",
    price: 229,
    billingPeriod: "Billed annually",
    intervalText: "/year",
    badge: "Best Value",
    savings: "Save 35%",
    features: [
      "Everything in Quarterly Plan",
      "Permanent Pro Tipster Gold Badge",
      "Featured on Homepage & Trending Feeds",
      "Zero Transaction Commission Boost",
      "Dedicated VIP Account Manager",
      "Early Access to High-Roller Syndicate tools",
    ],
  },
];

function TipsterSubscriptionInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useIsMounted();

  const [tipster, setTipster] = useState<TipsterProfile>(() => {
    const stored = getStoredTipster();
    if (stored) return stored;
    const demo = INITIAL_TIPSTERS[0];
    return {
      ...demo,
      id: `tipster-${Date.now()}`,
      displayName: "Alex Vance",
      username: "alex_vance",
      avatarUrl: "/assets/imgs/players/Erling-Haaland.jpg",
      subscriptionStatus: "pending",
    };
  });

  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanType>(() => {
    const requestedPlan = searchParams.get("plan");
    if (requestedPlan && ["monthly", "quarterly", "annual"].includes(requestedPlan.toLowerCase())) {
      return requestedPlan.toLowerCase() as SubscriptionPlanType;
    }
    return "quarterly";
  });

  const [paymentStep, setPaymentStep] = useState<"select_and_pay" | "processing" | "success">("select_and_pay");

  const [cardForm, setCardForm] = useState(() => {
    const stored = getStoredTipster();
    const name = stored ? `${stored.firstName} ${stored.lastName}`.trim() || stored.displayName : "Alex Vance";
    return {
      cardholderName: name,
      cardNumber: "4242 •••• •••• 4242",
      expiry: "12/28",
      cvc: "888",
      postalCode: "SW1A 1AA",
    };
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[1];

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardForm((prev) => ({ ...prev, [name]: value }));
    setErrorMsg(null);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.cardholderName.trim()) {
      setErrorMsg("Please enter the name on the card");
      return;
    }

    setPaymentStep("processing");
    setErrorMsg(null);

    // Simulate Stripe checkout authorization & profile status activation
    setTimeout(() => {
      const currentProfile = tipster || INITIAL_TIPSTERS[0];
      const expires = new Date();
      if (selectedPlanId === "monthly") expires.setMonth(expires.getMonth() + 1);
      else if (selectedPlanId === "quarterly") expires.setMonth(expires.getMonth() + 3);
      else expires.setFullYear(expires.getFullYear() + 1);

      const activatedProfile: TipsterProfile = {
        ...currentProfile,
        subscriptionStatus: "active",
        verificationStatus: "verified",
        subscriptionPlan: selectedPlanId,
        subscriptionExpiresAt: expires.toISOString(),
      };

      saveStoredTipster(activatedProfile);
      setTipster(activatedProfile);
      setPaymentStep("success");

      // Auto-redirect to tipster dashboard
      setTimeout(() => {
        router.push("/tipster/dashboard");
      }, 1800);
    }, 1500);
  };

  if (!mounted) {
    return (
      <main className="font-outfit text-white py-5" style={{ background: "var(--bg-dark, #070b12)" }}>
        <div className="container custom-container text-center py-5" style={{ maxWidth: "860px" }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading checkout...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="font-outfit text-white py-5" style={{ background: "var(--bg-dark, #070b12)" }}>
      <div className="container custom-container" style={{ maxWidth: "1050px" }}>
        {/* Header */}
        <div className="text-center mb-4">
          <Link href="/" className="d-inline-block mb-3">
            <Image
              src="/assets/imgs/logo-white.svg"
              alt="SportsVerge"
              width={170}
              height={42}
              priority
            />
          </Link>

          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <span
              className="badge rounded-pill px-3 py-1 fw-bold font-space-grotesk text-uppercase"
              style={{
                background: "rgba(234, 179, 8, 0.15)",
                color: "#facc15",
                border: "1px solid rgba(234, 179, 8, 0.35)",
                fontSize: "11px",
              }}
            >
              Step 2 of 2: Profile Verification & Subscription
            </span>
          </div>

          <h1
            className="fw-black text-white font-space-grotesk text-uppercase mb-2"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}
          >
            Activate Tipster Subscription
          </h1>
          <p className="text-secondary mx-auto mb-0" style={{ maxWidth: "600px", fontSize: "14px" }}>
            Complete your subscription via secure Stripe checkout to activate your Tipster Dashboard and start publishing sports predictions.
          </p>
        </div>

        {/* Profile Verification Status Alert Banner */}
        {tipster && (
          <div
            className="rounded-4 p-4 mb-4"
            style={{
              background:
                tipster.subscriptionStatus === "active"
                  ? "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(14, 21, 32, 0.8))"
                  : "linear-gradient(135deg, rgba(234, 179, 8, 0.12), rgba(14, 21, 32, 0.8))",
              border:
                tipster.subscriptionStatus === "active"
                  ? "1px solid rgba(34, 197, 94, 0.4)"
                  : "1px solid rgba(234, 179, 8, 0.35)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <div className="row align-items-center g-3">
              <div className="col-auto">
                <img
                  src={
                    tipster.avatarUrl && tipster.avatarUrl.startsWith("/assets")
                      ? tipster.avatarUrl
                      : "/assets/imgs/players/Erling-Haaland.jpg"
                  }
                  onError={(e) => {
                    e.currentTarget.src = "/assets/imgs/players/Erling-Haaland.jpg";
                  }}
                  alt={tipster.displayName}
                  className="rounded-circle d-block"
                  style={{
                    width: "54px",
                    height: "54px",
                    objectFit: "cover",
                    border: "2px solid rgba(234, 179, 8, 0.6)",
                  }}
                />
              </div>

              <div className="col">
                <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                  <h5 className="fw-bold text-white mb-0 font-space-grotesk">{tipster.displayName}</h5>
                  <span className="text-secondary small">(@{tipster.username})</span>
                  <span
                    className="badge rounded-pill px-3 py-1 font-space-grotesk fw-semibold d-inline-flex align-items-center gap-1.5"
                    style={{
                      fontSize: "11px",
                      background:
                        tipster.subscriptionStatus === "active"
                          ? "rgba(34, 197, 94, 0.16)"
                          : "rgba(234, 179, 8, 0.16)",
                      color: tipster.subscriptionStatus === "active" ? "#4ade80" : "#facc15",
                      border:
                        tipster.subscriptionStatus === "active"
                          ? "1px solid rgba(34, 197, 94, 0.4)"
                          : "1px solid rgba(234, 179, 8, 0.4)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    <i
                      className={`bi ${
                        tipster.subscriptionStatus === "active"
                          ? "bi-check-circle-fill text-success"
                          : "bi-hourglass-split text-warning"
                      }`}
                    ></i>
                    {tipster.subscriptionStatus === "active"
                      ? "ACTIVE TIPSTER"
                      : "PENDING TIPSTER (Activation Required)"}
                  </span>
                </div>

                <p className="text-secondary mb-0 small" style={{ lineHeight: "1.5" }}>
                  <i className="bi bi-info-circle-fill text-warning me-1.5"></i>
                  {tipster.subscriptionStatus === "active"
                    ? "Your Tipster profile and subscription are fully active. You can publish Free and Premium tips."
                    : "Account registered successfully in Pending status. Complete the Stripe subscription below to unlock the Tipster Dashboard and start publishing tips."}
                </p>
              </div>

              <div className="col-lg-auto d-flex gap-2 flex-wrap">
                {tipster.preferredSports.map((sport) => (
                  <span
                    key={sport}
                    className="badge bg-dark border border-secondary border-opacity-25 text-light px-2.5 py-1.5"
                    style={{ fontSize: "11px" }}
                  >
                    {sport}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {paymentStep === "success" && (
          <div
            className="rounded-4 p-5 text-center my-4"
            style={{
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), #0e1520)",
              border: "2px solid #22c55e",
              boxShadow: "0 20px 60px rgba(34, 197, 94, 0.25)",
            }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(34, 197, 94, 0.2)",
                color: "#22c55e",
                fontSize: "40px",
                border: "2px solid #22c55e",
              }}
            >
              <i className="bi bi-check-lg"></i>
            </div>
            <h2 className="fw-black text-white font-space-grotesk text-uppercase mb-2">
              Subscription Activated!
            </h2>
            <p className="text-light mb-4" style={{ fontSize: "15px" }}>
              Welcome to the SportsVerge Tipster Network! Your account is now fully authorized to publish Free & Premium predictions.
            </p>
            <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
            <span className="text-secondary small">Redirecting to Tipster Dashboard...</span>
            <div className="mt-4">
              <Link
                href="/tipster/dashboard"
                className="btn btn-success fw-bold rounded-pill px-5 py-2.5 font-space-grotesk"
                style={{ background: "#22c55e", border: "none" }}
              >
                Go to Tipster Dashboard Now
              </Link>
            </div>
          </div>
        )}

        {/* Processing Spinner */}
        {paymentStep === "processing" && (
          <div
            className="rounded-4 p-5 text-center my-4"
            style={{
              background: "var(--bg-card, #0e1520)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="spinner-border text-success mb-3" style={{ width: "3.5rem", height: "3.5rem" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3 className="fw-bold text-white font-space-grotesk mb-2">Processing Stripe Payment...</h3>
            <p className="text-secondary small mb-0">
              Authorizing your {selectedPlan.name} (${selectedPlan.price}) securely via Stripe. Please do not refresh.
            </p>
          </div>
        )}

        {/* Main Selection & Payment Section */}
        {paymentStep === "select_and_pay" && (
          <div className="row g-4">
            {/* Left: Plan Chooser */}
            <div className="col-lg-6">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold text-white font-space-grotesk mb-0" style={{ fontSize: "16px" }}>
                  1. Select Your Subscription Plan
                </h5>
                <span className="text-secondary small">Cancel anytime</span>
              </div>

              <div className="d-flex flex-column gap-3">
                {PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className="rounded-4 p-4 position-relative cursor-pointer transition-all"
                      style={{
                        background: isSelected
                          ? "linear-gradient(145deg, #132219 0%, #0e1722 100%)"
                          : "var(--bg-card, #0e1520)",
                        border: isSelected
                          ? "2px solid #22c55e"
                          : "1px solid var(--border-dark, rgba(255, 255, 255, 0.08))",
                        boxShadow: isSelected ? "0 8px 30px rgba(34, 197, 94, 0.18)" : "none",
                        cursor: "pointer",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <h6 className="fw-bold text-white font-space-grotesk mb-0" style={{ fontSize: "16px" }}>
                              {plan.name}
                            </h6>
                            {plan.badge && (
                              <span
                                className={`badge rounded-pill px-2.5 py-0.5 ${
                                  plan.popular ? "bg-success text-white" : "bg-secondary bg-opacity-25 text-light"
                                }`}
                                style={{ fontSize: "10px" }}
                              >
                                {plan.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-secondary small">{plan.billingPeriod}</span>
                        </div>

                        <div className="text-end">
                          <span className="fs-4 fw-black text-white font-space-grotesk">${plan.price}</span>
                          <span className="text-secondary small">{plan.intervalText}</span>
                        </div>
                      </div>

                      <ul className="list-unstyled d-flex flex-column gap-1.5 mt-3 pt-3 border-top border-secondary border-opacity-15 mb-0">
                        {plan.features.slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="d-flex align-items-center gap-2 text-light small">
                            <i className="bi bi-check2 text-success fw-bold"></i>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Stripe Checkout Form */}
            <div className="col-lg-6">
              <div
                className="rounded-4 p-4 p-md-5 h-100 d-flex flex-column"
                style={{
                  background: "var(--bg-card, #0e1520)",
                  border: "1px solid var(--border-dark, rgba(255, 255, 255, 0.08))",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
                }}
              >
                <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom border-secondary border-opacity-20">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-credit-card-2-front-fill text-success" style={{ fontSize: "20px" }}></i>
                    <h5 className="fw-bold text-white font-space-grotesk mb-0" style={{ fontSize: "16px" }}>
                      2. Stripe Payment
                    </h5>
                  </div>
                  <div className="d-flex align-items-center gap-1 text-secondary small">
                    <i className="bi bi-shield-lock-fill text-success"></i>
                    <span>256-bit Encrypted</span>
                  </div>
                </div>

                {/* Plan Summary Tag */}
                <div className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-4" style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.25)" }}>
                  <div>
                    <div className="fw-bold text-white small">{selectedPlan.name}</div>
                    <div className="text-secondary" style={{ fontSize: "11px" }}>{selectedPlan.billingPeriod}</div>
                  </div>
                  <div className="text-end">
                    <span className="fs-5 fw-black text-success font-space-grotesk">${selectedPlan.price}</span>
                    <span className="text-secondary small"> USD</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger rounded-3 p-2.5 mb-3 small">
                    {errorMsg}
                  </div>
                )}

                {/* Payment Form */}
                <form onSubmit={handlePaymentSubmit} className="d-flex flex-column gap-3 flex-grow-1">
                  <div>
                    <label className="form-label text-secondary small fw-bold mb-1">CARDHOLDER NAME</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={cardForm.cardholderName}
                      onChange={handleCardInputChange}
                      placeholder="e.g. Alex Vance"
                      className="form-control bg-dark text-white border-0 py-2.5"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label text-secondary small fw-bold mb-1">CARD NUMBER</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark text-secondary border-0">
                        <i className="bi bi-credit-card"></i>
                      </span>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardForm.cardNumber}
                        onChange={handleCardInputChange}
                        placeholder="4242 4242 4242 4242"
                        className="form-control bg-dark text-white border-0 py-2.5 font-monospace"
                        required
                      />
                      <span className="input-group-text bg-dark text-secondary border-0 d-flex gap-1">
                        <i className="bi bi-shield-check text-success"></i>
                      </span>
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label text-secondary small fw-bold mb-1">EXPIRY (MM/YY)</label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardForm.expiry}
                        onChange={handleCardInputChange}
                        placeholder="MM/YY"
                        className="form-control bg-dark text-white border-0 py-2.5 text-center font-monospace"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-secondary small fw-bold mb-1">CVC / CVV</label>
                      <input
                        type="password"
                        name="cvc"
                        maxLength={4}
                        value={cardForm.cvc}
                        onChange={handleCardInputChange}
                        placeholder="•••"
                        className="form-control bg-dark text-white border-0 py-2.5 text-center font-monospace"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-secondary small fw-bold mb-1">POSTAL / ZIP CODE</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={cardForm.postalCode}
                      onChange={handleCardInputChange}
                      placeholder="SW1A 1AA / 10001"
                      className="form-control bg-dark text-white border-0 py-2.5"
                    />
                  </div>

                  <div className="mt-auto pt-3">
                    <button
                      type="submit"
                      className="btn btn-success w-100 fw-bold rounded-pill py-3 text-uppercase font-space-grotesk shadow d-flex align-items-center justify-content-center gap-2"
                      style={{
                        background: "var(--accent-green, #22c55e)",
                        border: "none",
                        fontSize: "15px",
                        letterSpacing: "0.03em",
                      }}
                    >
                      <i className="bi bi-lock-fill"></i>
                      Pay ${selectedPlan.price} & Activate Tipster Account
                    </button>

                    <div className="d-flex align-items-center justify-content-center gap-2 text-secondary small mt-3">
                      <i className="bi bi-stripe text-white" style={{ fontSize: "22px" }}></i>
                      <span>Guaranteed secure payment powered by Stripe</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TipsterSubscriptionPage() {
  return (
    <Suspense
      fallback={
        <main className="font-outfit text-white py-5" style={{ background: "var(--bg-dark, #070b12)" }}>
          <div className="container custom-container text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </main>
      }
    >
      <TipsterSubscriptionInner />
    </Suspense>
  );
}
