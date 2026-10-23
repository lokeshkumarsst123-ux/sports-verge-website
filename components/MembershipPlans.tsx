"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { hasAuthSession, apiErrorMessage } from "@/lib/auth-api";
import {
  billingApi,
  tipsterApi,
  money,
  type BillingPlan,
  type Subscription,
} from "@/lib/tipster-api";
import type { TipsterProfile } from "@/types/tipster";
import { TipsterShell, Notice, SportsTags, TipIcon } from "./TipsterUI";
import ProfileAvatar from "./ProfileAvatar";
import PaymentCheckout from "./PaymentCheckout";
const titles = { monthly: "Monthly", quarterly: "Quarterly", annual: "Annual" };
const periods = { monthly: "month", quarterly: "3 months", annual: "year" };
export default function MembershipPlans() {
  const [selected, setSelected] = useState("monthly");
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [profile, setProfile] = useState<TipsterProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const catalog = await billingApi.plans();
        if (!active) return;
        setPlans(catalog.plans);
        const requested = new URLSearchParams(window.location.search).get(
          "plan",
        );
        if (requested && ["monthly", "quarterly", "annual"].includes(requested))
          setSelected(requested);
        const authenticated = hasAuthSession();
        setSignedIn(authenticated);
        if (authenticated) {
          const [p, s] = await Promise.all([
            tipsterApi.me(),
            billingApi.subscriptions(),
          ]);
          if (active) {
            if (
              s.tipster?.hasAccess &&
              window.location.pathname === "/tipster-subscription"
            ) {
              window.location.replace("/tipster/dashboard");
              return;
            }
            setProfile(p.profile);
            setSubscription(s.tipster);
          }
        }
      } catch (e) {
        if (active) setError(apiErrorMessage(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  const manage = async () => {
    setBusy("manage");
    try {
      window.location.assign((await billingApi.portal()).url);
    } catch (e) {
      setError(apiErrorMessage(e));
      setBusy("");
    }
  };
  const cancel = async () => {
    if (
      !subscription ||
      !window.confirm(
        subscription.status === "incomplete"
          ? "Cancel this incomplete subscription?"
          : "Cancel membership renewal at the end of the paid period?",
      )
    )
      return;
    setBusy("cancel");
    setError("");
    try {
      await billingApi.cancel(
        subscription.stripe_subscription_id,
        subscription.status !== "incomplete",
      );
      const [s, p] = await Promise.all([
        billingApi.subscriptions(),
        tipsterApi.me(),
      ]);
      setSubscription(s.tipster);
      setProfile(p.profile);
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setBusy("");
    }
  };
  const chosen = plans.find((p) => p.id === selected);
  const existing = Boolean(
    subscription &&
    !["canceled", "incomplete_expired", "incomplete"].includes(
      subscription.status,
    ),
  );
  const eligible =
    signedIn &&
    profile?.verificationStatus === "verified" &&
    !profile?.isSuspended &&
    !existing;
  return (
    <TipsterShell title="" navigation="none" className="tip-activation-page">
      <div className="tip-plan-hero">
        <Image
          src="/assets/imgs/logo.svg"
          alt="The Sports Verge"
          width={170}
          height={42}
          priority
        />
        <span
          className="tip-status pending d-block mx-auto"
          style={{ width: "fit-content" }}
        >
          TIPSTER PUBLISHING SUBSCRIPTION
        </span>
        <h1>ACTIVATE TIPSTER SUBSCRIPTION</h1>
        <p className="muted">
          Your Tipster dashboard is available without a subscription.
          <br />
          Choose a plan to create, edit and publish sports predictions.
        </p>
      </div>
      <Notice error={error} />
      {loading ? (
        <p role="status">Loading membership plans...</p>
      ) : (
        <>
          {profile && (
            <section
              className={`tip-activation-profile ${profile.canPublish ? "active" : ""}`}
            >
              <div className="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
                <ProfileAvatar
                  name={profile.displayName}
                  url={profile.avatarUrl}
                  size={50}
                />
                <div className="min-w-0 flex-grow-1">
                  <div className="d-flex gap-2 flex-wrap align-items-center">
                    <strong className="fw-bold text-dark">
                      {profile.displayName}
                    </strong>
                    <small className="text-muted">@{profile.username}</small>
                    <span
                      className={`tip-status fs-10 ${profile.canPublish ? "active" : "pending"}`}
                    >
                      {profile.canPublish
                        ? "ACTIVE TIPSTER"
                        : "PUBLISHING NOT ACTIVATED"}
                    </span>
                  </div>
                  <p className="text-secondary small mb-0 mt-1 d-none d-md-block">
                    {profile.canPublish
                      ? "Your membership is active. Open your dashboard to manage and publish predictions."
                      : "Your dashboard is available. Complete profile approval and an active subscription are required before you can publish tips."}
                  </p>
                </div>
              </div>

              <p
                className="text-secondary small mb-0 w-100 d-md-none"
                style={{ lineHeight: "1.5" }}
              >
                {profile.canPublish
                  ? "Your membership is active. Open your dashboard to manage and publish predictions."
                  : "Your dashboard is available. Complete profile approval and an active subscription are required before you can publish tips."}
              </p>

              <div className="tip-activation-footer">
                <SportsTags sports={profile.preferredSports} />
                {profile.canPublish && (
                  <Link href="/tipster/dashboard" className="tip-pill fs-10">
                    Dashboard <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                )}
              </div>
            </section>
          )}

          {subscription && (
            <div className="tip-panel mb-4">
              <div className="tip-heading">
                <h2>Your membership</h2>
                <span className="tip-status">{subscription.status}</span>
              </div>
              <p className="muted">
                {subscription.hasAccess
                  ? "Publishing access is enabled."
                  : "Publishing access is currently inactive."}
                {subscription.cancel_at_period_end
                  ? " Renewal is canceled. Access remains until the end of your paid period."
                  : ""}
              </p>
              <button
                className="tip-pill"
                onClick={manage}
                disabled={Boolean(busy)}
              >
                Manage subscription
              </button>
              {!subscription.cancel_at_period_end &&
                !["canceled", "incomplete_expired"].includes(
                  subscription.status,
                ) && (
                  <button
                    className="tip-pill ms-2"
                    onClick={cancel}
                    disabled={Boolean(busy)}
                  >
                    {subscription.status === "incomplete"
                      ? "Cancel incomplete subscription"
                      : "Cancel renewal"}
                  </button>
                )}
            </div>
          )}
          {profile?.verificationStatus !== "verified" && profile && (
            <p className="alert alert-warning">
              {profile.verificationStatus === "pending"
                ? "Your profile is awaiting approval. Payment will be available after approval."
                : "Please contact support about your profile approval."}
            </p>
          )}
          {profile?.isSuspended && (
            <p className="alert alert-warning">
              Your account is suspended. Please contact support before
              purchasing a membership.
            </p>
          )}
          <div className="tip-plan-layout">
            <section>
              <div className="tip-heading">
                <h2>1. Select Your Subscription Plan</h2>
                <small className="muted">Cancel renewal anytime</small>
              </div>
              {plans.map((plan) => (
                <button
                  type="button"
                  key={plan.id}
                  className={`tip-plan-card ${selected === plan.id ? "selected" : ""}`}
                  disabled={
                    paymentBusy ||
                    existing ||
                    Boolean(
                      subscription &&
                      subscription.status === "incomplete" &&
                      subscription.plan !== plan.id,
                    )
                  }
                  aria-pressed={selected === plan.id}
                  onClick={() => setSelected(plan.id)}
                >
                  <div className="d-flex justify-content-between align-items-center gap-2">
                    <div>
                      <strong>{titles[plan.id]} Plan</strong>{" "}
                      <span className="tip-status">
                        {plan.id === "monthly"
                          ? "Flexible"
                          : plan.id === "quarterly"
                            ? "3 months"
                            : "12 months"}
                      </span>
                      <p className="muted small mb-0">
                        Billed{" "}
                        {plan.id === "monthly"
                          ? "monthly"
                          : plan.id === "quarterly"
                            ? "every 3 months"
                            : "yearly"}
                      </p>
                    </div>
                    <div>
                      <strong className="h4">
                        {plan.price !== undefined
                          ? money(plan.price, plan.currency)
                          : "Unavailable"}
                      </strong>
                      <small className="muted">/{periods[plan.id]}</small>
                    </div>
                  </div>
                  <ul>
                    <li>Publish Unlimited Free &amp; Premium Tips</li>
                    <li>Tipster Dashboard &amp; Prediction Management</li>
                    <li>Public Tipster Profile Page</li>
                  </ul>
                </button>
              ))}
            </section>
            <section className="tip-panel tip-activation-checkout">
              <div className="tip-checkout-title">
                <strong>
                  <TipIcon name="grid" /> 2. Stripe Payment
                </strong>
                <small className="muted">
                  <TipIcon name="lock" /> Secure checkout
                </small>
              </div>
              {chosen && (
                <div className="tip-checkout-summary">
                  <div>
                    <strong>{titles[chosen.id]} Plan</strong>
                    <small>Billed every {periods[chosen.id]}</small>
                  </div>
                  <strong className="text-success">
                    {chosen.price !== undefined
                      ? money(chosen.price, chosen.currency)
                      : "Unavailable"}
                  </strong>
                </div>
              )}
              {eligible && chosen?.configured ? (
                <PaymentCheckout
                  key={selected}
                  kind="tipster"
                  plan={selected}
                  activation
                  onBusyChange={setPaymentBusy}
                />
              ) : existing ? (
                <p className="muted">
                  {subscription?.hasAccess
                    ? "Your membership is active. Use Manage subscription to view your billing options."
                    : "Your existing subscription needs attention. Use Manage subscription to restore payment before starting a new membership."}
                </p>
              ) : !signedIn ? (
                <Link
                  className="tip-primary w-100"
                  href={`/login?role=tipster&next=${encodeURIComponent("/membership?plan=" + selected)}`}
                >
                  Sign in to activate membership
                </Link>
              ) : !profile ? (
                <Link className="tip-primary w-100" href="/tipster-register">
                  Complete your Tipster profile
                </Link>
              ) : (
                <p className="muted">
                  {!chosen?.configured
                    ? "This plan is not available yet."
                    : "Payment is available after your profile is approved."}
                </p>
              )}
              <p className="muted small mt-4 mb-0">
                Premium tip purchases are separate from your publishing
                membership.
              </p>
            </section>
          </div>
        </>
      )}
    </TipsterShell>
  );
}
