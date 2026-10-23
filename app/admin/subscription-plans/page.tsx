"use client";
import { useEffect, useState } from "react";
import { tipsterRequest, money } from "@/lib/tipster-api";
import { API_BASE_URL } from "@/lib/api-config";
type Plan = {
  id: string;
  code: string;
  name: string;
  price: string | null;
  currency: string;
  stripe_price_id: string | null;
  stripe_product_id: string | null;
  is_active: boolean;
  interval_count: number;
  interval_unit: string;
};
export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<Plan[]>([]),
    [prices, setPrices] = useState<Record<string, string>>({}),
    [active, setActive] = useState<Record<string, boolean>>({}),
    [base, setBase] = useState(API_BASE_URL),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [saved, setSaved] = useState("");
  const [stripeMode, setStripeMode] = useState<"test" | "live" | null>(null);
  useEffect(() => {
    let mounted = true;
    tipsterRequest<{ plans: Plan[]; apiBaseUrl: string | null; stripeMode: "test" | "live" }>(
      "/billing/admin/plans",
      { admin: true },
    )
      .then((r) => {
        if (mounted) {
          setPlans(r.plans);
          setStripeMode(r.stripeMode);
          setPrices(
            Object.fromEntries(
              r.plans.map((p) => [p.code, p.stripe_price_id || ""]),
            ),
          );
          setActive(
            Object.fromEntries(r.plans.map((p) => [p.code, p.is_active])),
          );
          if (r.apiBaseUrl) setBase(r.apiBaseUrl.replace(/\/$/, ""));
        }
      })
      .catch((e) => {
        if (mounted) setError(e.message);
      });
    return () => {
      mounted = false;
    };
  }, []);
  const save = async (code: string) => {
    setBusy(code);
    setError("");
    setSaved("");
    try {
      const r = await tipsterRequest<{ plan: Plan }>(
        `/billing/admin/plans/${code}`,
        {
          method: "PUT",
          admin: true,
          body: { stripePriceId: prices[code].trim(), isActive: active[code] },
        },
      );
      setPlans((p) => p.map((v) => (v.code === code ? r.plan : v)));
      setSaved(`${r.plan.name} verified and saved. ${r.plan.is_active ? "Members can now choose this plan." : "This plan is currently closed to new members."}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save price.");
    } finally {
      setBusy("");
    }
  };
  return (
    <div className="admin-page">
      <h1>VIP Tipster subscription plans</h1>
      {stripeMode && <p className={`alert ${stripeMode === "live" ? "alert-warning" : "alert-info"}`} role="status">
        <strong>{stripeMode === "live" ? "Live mode is on." : "Test mode is on."}</strong>
        {stripeMode === "live"
          ? " Members will be charged real money when they purchase a plan."
          : " You can try membership payments using test cards. No real money will be charged."}
      </p>}
      <p className="text-secondary">
        Manage monthly, quarterly and yearly membership prices. Verify each
        price with Stripe before making it available to members.
      </p>
      {error && (
        <p className="alert alert-danger" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <p className="alert alert-success" role="status">
          {saved}
        </p>
      )}
      <div className="row g-4">
        {plans.map((p) => (
          <div key={p.code} className="col-lg-4">
            <form
              className="admin-card p-4 h-100"
              onSubmit={(e) => {
                e.preventDefault();
                void save(p.code);
              }}
            >
              <h2 className="h4">{p.name}</h2>
              <p className="text-secondary">
                {p.code === "monthly" ? "Billed monthly" : p.code === "quarterly" ? "Billed every 3 months" : "Billed yearly"}
              </p>
              <p>
                {p.price !== null
                  ? money(Number(p.price), p.currency)
                  : "Price not configured"}
              </p>
              <label className="admin-form-label" htmlFor={p.code}>
                Stripe Price ID
              </label>
              <input
                id={p.code}
                className="form-control admin-form-control"
                required
                placeholder="price_..."
                value={prices[p.code] || ""}
                onChange={(e) =>
                  setPrices((v) => ({ ...v, [p.code]: e.target.value }))
                }
              />
              <label className="d-block my-3">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={Boolean(active[p.code])}
                  onChange={(e) =>
                    setActive((v) => ({ ...v, [p.code]: e.target.checked }))
                  }
                />
                Available to new members
              </label>
              <p className="text-secondary small">
                {p.stripe_product_id ? "Stripe price verified. Save any changes to verify again." : "Verification needed before this plan can be used."}
              </p>
              <button className="btn btn-success" disabled={Boolean(busy)}>
                {busy === p.code
                  ? "Verifying Stripe price…"
                  : "Verify & save price"}
              </button>
            </form>
          </div>
        ))}
      </div>
      <section className="admin-card p-4 mt-4">
        <h2 className="h4">How to set up your plans</h2>
        <p>
          Copy each recurring Price ID from Stripe and paste it into the matching
          plan above. Select &quot;Available to new members&quot; when you want to offer
          the plan, then click &quot;Verify &amp; save price&quot;. The amount and currency
          will be updated automatically after verification.
        </p>
        <p className="text-secondary">
          Testing? Create your prices in Stripe test mode. Live prices only work
          with live keys. The prices and website keys must belong to the same Stripe account.
        </p>
        <details>
        <summary>Developer setup: payment notifications</summary>
        <p>
          Subscription webhook: <code>{base}/billing/subscription-webhook</code>
        </p>
        <p>
          Premium tip webhook: <code>{base}/billing/one-time-tip-webhook</code>
        </p>
        <p className="text-secondary mb-0">
          Each endpoint uses its own signing secret. For localhost, forward
          events with Stripe CLI; deployed webhook URLs must use HTTPS.
        </p>
        </details>
      </section>
    </div>
  );
}
