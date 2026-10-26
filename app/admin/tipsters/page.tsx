"use client";
import { useEffect, useState } from "react";
import { tipsterRequest } from "@/lib/tipster-api";
import type { Tip } from "@/types/tipster";
type Profile = {
  user_id: string;
  display_name: string;
  email: string;
  verification_status: string;
  is_suspended: boolean;
};
type Data = {
  reports: Array<{ id: string; title: string; reason: string; status: string }>;
  profiles: Profile[];
  tips: Tip[];
  subscriptions: Array<{
    stripe_subscription_id: string;
    user_id: string;
    kind: string;
    plan: string;
    status: string;
    paid_through: string;
  }>;
};
export default function AdminTipsters() {
  const [data, setData] = useState<Data | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState("");
  const [sport, setSport] = useState("All"),
    [visibility, setVisibility] = useState("All"),
    [tipster, setTipster] = useState("All");
  const load = async () =>
    setData(await tipsterRequest<Data>("/tipster/admin", { admin: true }));
  useEffect(() => {
    let active = true;
    tipsterRequest<Data>("/tipster/admin", { admin: true })
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  const moderate = async (p: Profile, status: string, suspended: boolean) => {
    setBusy(p.user_id);
    try {
      await tipsterRequest(`/tipster/admin/profiles/${p.user_id}`, {
        method: "PATCH",
        admin: true,
        body: { verificationStatus: status, isSuspended: suspended },
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update.");
    } finally {
      setBusy("");
    }
  };
  const tip = async (
    t: Tip,
    hidden: boolean,
    featured = Boolean(t.isFeatured),
    trending = Boolean(t.isTrending),
  ) => {
    setBusy(t.id);
    try {
      await tipsterRequest(`/tipster/admin/tips/${t.id}`, {
        method: "PATCH",
        admin: true,
        body: {
          isHidden: hidden,
          isFeatured: featured,
          isTrending: trending,
        },
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update.");
    } finally {
      setBusy("");
    }
  };
  const settle = async (id: string, result: string) => {
    if (!result) return;
    setBusy(id); setError("");
    try { await tipsterRequest(`/tipster/admin/tips/${id}/result`, {method:"PATCH",admin:true,body:{result}}); await load(); }
    catch(e) {setError(e instanceof Error ? e.message : "Unable to save result.");}
    finally {setBusy("");}
  };
  const resolve = async (id: string) => {
    setBusy(id);
    try {
      await tipsterRequest(`/tipster/admin/reports/${id}`, {
        method: "PATCH",
        admin: true,
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to resolve.");
    } finally {
      setBusy("");
    }
  };
  return (
    <div className="admin-page">
      <h1>Tipsters & memberships</h1>
      {error && (
        <p className="alert alert-danger" role="alert">
          {error}
        </p>
      )}
      {!data ? (
        <p>Loading…</p>
      ) : (
        <>
          <section className="admin-card p-4 mt-4">
            <h2 className="h4">Tipster management</h2>
            <div className="table-responsive">
              <table className="table table-dark">
                <thead>
                  <tr>
                    <th>Tipster</th>
                    <th>Verification</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.profiles.map((p) => (
                    <tr key={p.user_id}>
                      <td>
                        {p.display_name}
                        <br />
                        <small>{p.email}</small>
                      </td>
                      <td>
                        {p.verification_status}
                        {p.is_suspended ? " / suspended" : ""}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-success me-2"
                          disabled={Boolean(busy)}
                          onClick={() => moderate(p, "verified", false)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning me-2"
                          disabled={Boolean(busy)}
                          onClick={() =>
                            moderate(p, p.verification_status, !p.is_suspended)
                          }
                        >
                          {p.is_suspended ? "Unsuspend" : "Suspend"}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={Boolean(busy)}
                          onClick={() =>
                            moderate(p, "rejected", p.is_suspended)
                          }
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="admin-card p-4 mt-4">
            <h2 className="h4">Subscriptions</h2>
            {data.subscriptions.map((s) => (
              <p key={s.stripe_subscription_id}>
                {data.profiles.find((p) => p.user_id === s.user_id)
                  ?.display_name || s.user_id}{" "}
                · {s.plan} · {s.status} ·{" "}
                {s.paid_through
                  ? new Date(s.paid_through).toLocaleDateString()
                  : "No paid period"}
              </p>
            ))}
          </section>
          <section className="admin-card p-4 mt-4">
            <h2 className="h4">Tips management</h2>
            <div className="d-flex flex-wrap gap-3 my-3">
              <label>
                Sport
                <select
                  className="form-select bg-dark text-white"
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                >
                  {["All", "Cricket", "Football", "NFL", "AFL"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                Access
                <select
                  className="form-select bg-dark text-white"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                >
                  {["All", "Free", "Premium"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                Tipster
                <select
                  className="form-select bg-dark text-white"
                  value={tipster}
                  onChange={(e) => setTipster(e.target.value)}
                >
                  <option>All</option>
                  {data.profiles.map((p) => (
                    <option value={p.user_id} key={p.user_id}>
                      {p.display_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {data.tips
              .filter(
                (t) =>
                  (sport === "All" || t.sport === sport) &&
                  (visibility === "All" || t.visibility === visibility) &&
                  (tipster === "All" || t.tipsterId === tipster),
              )
              .map((t) => (
                <div
                  className="d-flex justify-content-between align-items-center gap-3 py-3 border-bottom"
                  key={t.id}
                >
                  <span>
                    {t.predictionTitle} · {t.sport} · {t.visibility} ·{" "}
                    {t.status} {t.isHidden ? " / hidden" : ""}
                  </span>
                  <div>
                    <label className="small me-2">Verified result<select className="form-select form-select-sm bg-dark text-white" aria-label={`Result for ${t.predictionTitle}`} value={t.result === "pending" ? "" : t.result || ""} disabled={Boolean(busy) || t.status === "Draft"} onChange={e=>void settle(t.id,e.target.value)}><option value="">Not settled</option><option value="won">Won</option><option value="lost">Lost</option><option value="void">Void</option></select></label>
                    <button
                      className="btn btn-sm btn-outline-success me-2"
                      disabled={Boolean(busy)}
                      onClick={() => tip(t, Boolean(t.isHidden), !t.isFeatured)}
                    >
                      {t.isFeatured ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      disabled={Boolean(busy)}
                      onClick={() =>
                        tip(
                          t,
                          Boolean(t.isHidden),
                          Boolean(t.isFeatured),
                          !t.isTrending,
                        )
                      }
                    >
                      {t.isTrending ? "Unmark trending" : "Mark trending"}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      disabled={Boolean(busy)}
                      onClick={() => tip(t, true)}
                    >
                      Hide
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success"
                      disabled={Boolean(busy)}
                      onClick={() => tip(t, false)}
                    >
                      Show
                    </button>
                  </div>
                </div>
              ))}
          </section>
          <section className="admin-card p-4 mt-4">
            <h2 className="h4">Reported tips</h2>
            {data.reports.map((r) => (
              <div key={r.id} className="border-bottom py-3">
                <strong>{r.title}</strong>
                <p>{r.reason}</p>
                <button
                  className="btn btn-sm btn-outline-success"
                  disabled={Boolean(busy) || r.status === "resolved"}
                  onClick={() => resolve(r.id)}
                >
                  {r.status === "resolved" ? "Resolved" : "Resolve report"}
                </button>
              </div>
            ))}
            {!data.reports.length && <p>No reported tips.</p>}
          </section>
        </>
      )}
    </div>
  );
}
