"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Tip, TipsterProfile } from "@/types/tipster";
import { tipsterApi, billingApi, money, type ConnectAccountStatus, type ConnectFinancials } from "@/lib/tipster-api";
import { hasAuthSession, apiErrorMessage } from "@/lib/auth-api";
import { TipsterShell, Notice, ProfileHero, SportsTags } from "./TipsterUI";
function DashboardIcon({name}:{name:"tips"|"trophy"|"people"|"bolt"|"wallet"|"view"|"edit"|"trash"|"heart"}) {
 const shapes={tips:<><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 8h6m-6 4h6m-6 4h4"/></>,trophy:<><path d="M8 3h8v6a4 4 0 0 1-8 0V3Zm4 10v5m-4 3h8M8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4"/></>,people:<><circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4m2-17a3 3 0 0 1 0 6m2 5a5 5 0 0 1 2 4v2"/></>,bolt:<path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/>,wallet:<><rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18m-6 4h6v4h-6z"/></>,view:<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,edit:<><path d="m15 3 6 6-11 11H4v-6L15 3Zm-3 3 6 6"/></>,trash:<><path d="M3 6h18M9 3h6m-9 3 1 15h10l1-15M10 10v7m4-7v7"/></>,heart:<path d="M20 4a5 5 0 0 0-8 2 5 5 0 0 0-8-2c-5 5 3 11 8 16 5-5 13-11 8-16Z"/>};
 return <svg className="tip-dashboard-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
}
export default function TipDashboard() {
    const [financials,setFinancials] = useState<ConnectFinancials | null>(null), [financialError,setFinancialError] = useState("");
    const [filter, setFilter] = useState("All");
    const [profile, setProfile] = useState<TipsterProfile | null>(null), [tips, setTips] = useState<Tip[]>([]), [error, setError] = useState(""), [loading, setLoading] = useState(true);
    const [payoutStatus, setPayoutStatus] = useState<ConnectAccountStatus | null>(null), [payoutError, setPayoutError] = useState(""), [payoutBusy, setPayoutBusy] = useState(false);
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                if (!hasAuthSession()) {
                    window.location.assign("/login?role=tipster&next=%2Ftipster%2Fdashboard");
                    return;
                }
                const [p, t] = await Promise.all([tipsterApi.me(), tipsterApi.mine()]);
                if (active) {
                    if (p.profile && p.profile.subscriptionStatus !== "active") { window.location.replace("/tipster-subscription"); return; }
                    setProfile(p.profile);
                    setTips(t.tips);
                    void billingApi.connectAccountStatus().then(status => {
                        if (active) setPayoutStatus(status);
                        if(status.accountStatus === "ready") void billingApi.connectFinancials().then(result=>{if(active)setFinancials(result);}).catch(e=>{if(active)setFinancialError(apiErrorMessage(e));});
                    }).catch(e => {
                        if (active) setPayoutError(apiErrorMessage(e));
                    });
                }
            }
            catch (e) {
                if (active)
                    setError(apiErrorMessage(e));
            }
            finally {
                if (active)
                    setLoading(false);
            }
        })();
        return () => { active = false; };
    }, []);
    const manage = async () => { try {
        window.location.assign((await billingApi.portal()).url);
    }
    catch (e) {
        setError(apiErrorMessage(e));
    } };
    const managePayouts = async () => {
        setPayoutBusy(true);
        setPayoutError("");
        try {
            const result = payoutStatus?.accountStatus === "ready"
                ? await billingApi.connectDashboard()
                : await billingApi.connectAccount();
            window.location.assign(result.url);
        } catch (e) {
            setPayoutError(apiErrorMessage(e));
            setPayoutBusy(false);
        }
    };
    const remove = async (id: string) => { if (!window.confirm("Delete this draft?"))
        return; try {
        await tipsterApi.remove(id);
        setTips(t => t.filter(v => v.id !== id));
    }
    catch (e) {
        setError(apiErrorMessage(e));
    } };
    const filtered = tips.filter(t => filter === "All" || t.status === filter || t.visibility === filter);
    return <TipsterShell title="" navigation="none" className="tip-dashboard-page"><Notice error={error}/>{loading ? <p role="status">Loading your dashboard...</p> : !profile ? <div className="tip-panel"><h2>Complete your Tipster profile</h2><Link className="tip-primary" href="/tipster-register">Register as a Tipster</Link></div> : <>
    <ProfileHero profile={profile} owner><Link className="tip-primary" href={profile.canPublish ? (payoutStatus?.accountStatus === "ready" ? "/tipster/create-tip" : "#stripe-payouts") : profile.verificationStatus === "verified" && !profile.isSuspended ? "/tipster-subscription" : "/profile?edit=tipster#tipster-profile"}>{profile.canPublish ? (payoutStatus?.accountStatus === "ready" ? "Create Free or Paid Tip" : "Set Up Stripe to Create Tips") : profile.verificationStatus === "verified" && !profile.isSuspended ? "Subscribe to Publish Tips" : "Complete Profile Verification"}</Link><Link className="tip-pill" href="/profile?edit=tipster#tipster-profile">Edit My Profile</Link></ProfileHero>
    <nav className="tip-tabs" aria-label="Studio navigation"><Link className="tip-pill active" href="/tipster/dashboard">Dashboard Overview</Link><Link className="tip-pill" href="/tipster/my-tips">My Tips ({tips.length})</Link><Link className="tip-pill" href="/tipster/create-tip">Create Tip</Link><Link className="tip-pill" href="/profile#tipster-profile">My Profile</Link><Link className="tip-pill ms-auto" href="/tips">View Public Tips Feed</Link></nav>
    <div className="tip-stat-grid tip-dashboard-summary">
      {[
        { label: "TOTAL TIPS", value: tips.length, detail: `${tips.filter(t => t.visibility === "Free").length} Free / ${tips.filter(t => t.visibility === "Premium").length} Premium`, icon: "bi bi-journal-check", color: "#16A34A", bg: "#ECFDF5", border: "#A7F3D0" },
        { label: "TOTAL PURCHASED TIPS", value: profile.earnings?.unlocksCount ?? 0, detail: "Paid purchases of your tips", icon: "bi bi-wallet2", color: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
        { label: "FOLLOWERS", value: profile.stats.followersCount, detail: "People following your profile", icon: "bi bi-people-fill", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
      ].map(stat => (
        <div className="tip-stat" key={stat.label}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <small className="fw-bold text-muted text-uppercase mb-0" style={{ letterSpacing: "0.04em", fontSize: "12px" }}>{stat.label}</small>
            <span
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: "40px",
                height: "40px",
                background: stat.bg,
                color: stat.color,
                border: `1px solid ${stat.border}`,
                fontSize: "18px",
                flexShrink: 0
              }}
            >
              <i className={stat.icon}></i>
            </span>
          </div>
          <strong className="d-block font-space-grotesk fw-black my-1" style={{ fontSize: "32px", color: "#1C1F22" }}>{stat.value}</strong>
          <span className="text-muted small">{stat.detail}</span>
        </div>
      ))}
    </div>
    <div className="tip-two-col"><section className="tip-panel"><div className="tip-heading"><h2 className="d-flex align-items-center gap-2 mb-0"><i className="bi bi-shield-check text-warning" style={{ fontSize: "20px" }}></i> Subscription Status</h2><span className={`tip-status ${profile.canPublish ? "active" : "pending"}`}>{profile.subscriptionStatus?.toUpperCase()}</span></div><dl className="tip-detail-list"><dt>Current Membership:</dt><dd>{profile.subscriptionPlan ? `${profile.subscriptionPlan.toUpperCase()} PLAN` : "Not selected"}</dd><dt>Payment Gateway:</dt><dd>Stripe Secure Recurring</dd><dt>Access Until:</dt><dd>{profile.subscriptionExpiresAt ? new Date(profile.subscriptionExpiresAt).toLocaleDateString() : "Not active"}</dd></dl><div className="d-flex gap-2 flex-wrap align-items-center mt-3"><Link className="tip-pill flex-grow-1" href="/membership">Manage / Change Subscription Plan</Link><button className="tip-pill" onClick={manage}>Open Billing Portal</button></div></section><section id="stripe-payouts" className="tip-panel tip-dashboard-earnings"><div className="tip-heading"><h2 className="d-flex align-items-center gap-2 mb-0"><i className="bi bi-cash-coin text-success" style={{ fontSize: "20px" }}></i> Tipster Earnings</h2><span className={`tip-status ${payoutStatus?.accountStatus === "ready" ? "active" : "pending"}`}>{payoutStatus?.accountStatus === "ready" ? "STRIPE CONNECTED" : "PAYOUT SETUP"}</span></div><div className="tip-earnings-summary"><div><small className="muted d-block mb-1">Total Net Earnings</small>{profile.earnings?.totals.length ? profile.earnings.totals.map(t=><strong className="tip-earnings-value" key={t.currency}>{money(t.net ?? t.amount,t.currency)}</strong>) : <strong className="tip-earnings-value">{money(0,profile.earnings?.defaultCurrency || "aud")}</strong>}</div><div className="tip-earnings-unlocks"><small className="muted d-block mb-1">Total Paid Purchases</small><strong className="text-success">{profile.earnings?.unlocksCount || 0} purchases</strong><small className="muted d-block mt-1">{profile.earnings?.activeUnlocksCount ?? profile.earnings?.unlocksCount ?? 0} active unlocks</small></div></div>
    <div className="tip-earnings-breakdown">{(profile.earnings?.totals.length ? profile.earnings.totals : [{currency:profile.earnings?.defaultCurrency||"aud",gross:0,refunded:0,disputed:0,net:0,amount:0,connected:0,legacy:0,purchases:0}]).map(t=><div key={t.currency}><span className="badge bg-light text-dark border px-2 py-1 mb-2 fw-bold">{t.currency.toUpperCase()}</span><dl><dt>Gross sales</dt><dd>{money(t.gross ?? t.amount,t.currency)}</dd><dt>Refunds</dt><dd>{money(t.refunded ?? 0,t.currency)}</dd><dt>Disputed / withheld</dt><dd>{money(t.disputed ?? 0,t.currency)}</dd><dt>Platform commission</dt><dd>0%</dd></dl>{t.legacy>0 && <p className="muted small">{money(t.legacy,t.currency)} from earlier platform-only payments requires settlement review.</p>}</div>)}</div>
    <p className="muted small mt-3">Net earnings exclude refunds and disputed amounts. Subscription fees are separate. These sales totals are not your bank payout balance.</p>
    {financialError && <p className="alert alert-danger" role="alert">Stripe balances could not be loaded. {financialError}</p>}
    {financials?.connected && <details className="tip-earnings-stripe"><summary>Stripe balance &amp; recent bank payouts</summary><div className="tip-earnings-balance"><div><small>Available balance</small>{financials.available.length ? financials.available.map(a=><strong key={a.currency}>{money(a.amount,a.currency)}</strong>) : <span>No available balance</span>}</div><div><small>Pending balance</small>{financials.pending.length ? financials.pending.map(a=><strong key={a.currency}>{money(a.amount,a.currency)}</strong>) : <span>No pending balance</span>}</div></div><p className="muted small">Stripe account balances may differ from tip sales due to settlement timing, refunds and currency conversion.</p><h3>Latest bank payouts</h3>{financials.payouts.length ? <ul>{financials.payouts.map(p=><li key={p.id}><strong>{money(p.amount,p.currency)}</strong><span>{p.status.replaceAll("_"," ")} &middot; {new Date(p.arrivalDate).toLocaleDateString()}</span></li>)}</ul> : <p className="muted">No bank payouts yet.</p>}</details>}
    {payoutError && <p className="alert alert-danger" role="alert">{payoutError}</p>}<button className="tip-pill" disabled={payoutBusy} onClick={managePayouts}>{payoutBusy ? "Opening Stripe..." : payoutStatus?.accountStatus === "ready" ? "Manage Stripe Payouts" : payoutStatus?.accountStatus === "pending" ? "Complete Stripe Setup" : "Connect Stripe for Payouts"}</button></section></div>
    <section id="my-tips" className="tip-panel"><div className="tip-heading"><div><h2 className="d-flex align-items-center gap-2"><i className="bi bi-file-earmark-text text-primary"></i> My Published &amp; Draft Predictions</h2><small className="muted">Manage, edit and review your sports tips.</small></div><div className="d-flex gap-2 flex-wrap">{["All", "Published", "Draft", "Scheduled", "Free", "Premium"].map(v => <button key={v} className={`tip-pill ${filter === v ? "active" : ""}`} aria-pressed={filter === v} onClick={() => setFilter(v)}>{v}</button>)}</div></div>{!filtered.length ? <p className="tip-empty">No tips in this view. Create your first prediction to get started.</p> : filtered.map(t => <article className="tip-prediction-row" key={t.id}><div><div className="tip-tags"><SportsTags sports={[t.sport]}/><span className="tip-tag">{t.competition || "Competition pending"}</span><span className={`tip-status ${t.visibility === "Premium" ? "pending" : ""}`}>{t.visibility === "Premium" ? `PREMIUM (${money(t.premiumPrice || 0, t.currency)})` : "FREE TIP"}</span><span className={`tip-status tip-dashboard-status-${t.status.toLowerCase()}`}>{t.status}</span></div><h3>{t.predictionTitle}</h3><p className="small mb-1">{t.teams.home} vs {t.teams.away} <span className="muted">Kickoff: {t.matchDate} ({t.kickoffTime})</span></p><p className="muted small mb-0">{t.analysisSnippet}</p>{t.status === "Scheduled" && t.scheduledPublishAt && <small className="text-info">Auto-publish: {new Date(t.scheduledPublishAt).toLocaleString()}</small>}</div><div className="tip-odds"><small>ODDS</small><strong>{t.odds}</strong><small>{t.predictionCategory}</small></div><div className="tip-dashboard-row-actions"><div className="d-flex align-items-center gap-2 flex-wrap"><Link className="tip-pill" href={`/tips/${t.id}`}><i className="bi bi-eye me-1"></i> View</Link><Link className="tip-pill tip-dashboard-edit" href={`/tipster/edit-tip/${t.id}`}><i className="bi bi-pencil-square me-1"></i> Edit</Link>{t.status === "Draft" && <button className="tip-pill tip-dashboard-delete" title="Delete draft" aria-label={`Delete draft: ${t.predictionTitle}`} onClick={() => remove(t.id)}><i className="bi bi-trash3 me-1"></i> Delete</button>}</div></div></article>)}</section>
    {!profile.canPublish && <p className="text-warning mt-3">{profile.verificationStatus !== "verified" || profile.isSuspended ? "Your dashboard is available. Publishing requires an approved, active Tipster profile." : <>Your dashboard is available. An active Tipster subscription is required to create, edit or publish tips. <Link className="text-success" href="/tipster-subscription">Choose a subscription plan</Link>.</>}</p>}
  </>}</TipsterShell>;
}
