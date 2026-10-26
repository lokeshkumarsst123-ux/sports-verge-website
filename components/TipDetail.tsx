"use client";
import ProfileAvatar from "./ProfileAvatar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Tip } from "@/types/tipster";
import { tipsterApi, money, tipsterRequest, isOwnTipsterProfile } from "@/lib/tipster-api";
import { hasAuthSession, apiErrorMessage } from "@/lib/auth-api";
import { TipsterShell, Notice, TipIcon } from "./TipsterUI";
import TipPurchaseModal from "./TipPurchaseModal";
export default function TipDetail() {
    const { id } = useParams<{
        id: string;
    }>();
    const [following, setFollowing] = useState(false), [followBusy, setFollowBusy] = useState(false);
    const [winRate, setWinRate] = useState<number | null>(null);
    const [checkout, setCheckout] = useState(false);
    const [tip, setTip] = useState<Tip | null>(null), [error, setError] = useState(""), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true);
    useEffect(() => {
        let active = true;
        tipsterApi
            .tip(id)
            .then((r) => {
            if (active) {
                setTip(r.tip);
                if (hasAuthSession() && r.tip.visibility === "Premium" && !r.tip.unlocked && new URLSearchParams(window.location.search).get("checkout") === "1") {
                    setCheckout(true);
                    const url = new URL(window.location.href);
                    url.searchParams.delete("checkout");
                    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
                }
            }
            tipsterApi.publicProfile(r.tip.tipsterId).then(({profile}) => {if(active)setWinRate(profile.stats.winRate);}).catch(()=>{});
            if (hasAuthSession()) {
                tipsterApi.follows().then(({ids}) => { if (active) setFollowing(ids.includes(r.tip.tipsterId)); }).catch(() => {});
            }
        })
            .catch((e) => {
            if (active)
                setError(apiErrorMessage(e));
        })
            .finally(() => {
            if (active)
                setLoading(false);
        });
        return () => {
            active = false;
        };
    }, [id]);
    const pay = async () => {
        if (!hasAuthSession()) {
            window.location.assign(`/login?next=${encodeURIComponent("/tips/" + id + "?checkout=1")}`);
            return;
        }
        setBusy(true);
        try {
            setCheckout(true);
            setBusy(false);
        }
        catch (e) {
            setError(apiErrorMessage(e));
            setBusy(false);
        }
    };
    const report = async () => {
        if (!hasAuthSession()) {
            window.location.assign(`/login?next=${encodeURIComponent("/tips/" + id)}`);
            return;
        }
        const reason = window.prompt("Why are you reporting this tip?");
        if (!reason)
            return;
        try {
            await tipsterRequest(`/tipster/tips/${id}/report`, {
                method: "POST",
                body: { reason },
            });
            window.alert("Your report has been submitted for review.");
        }
        catch (e) {
            setError(apiErrorMessage(e));
        }
    };
    const follow = async () => {
        if (!tip || followBusy || isOwnTipsterProfile(tip.tipsterId)) return;
        if (!hasAuthSession()) {
            window.location.assign(`/login?next=${encodeURIComponent("/tips/" + id)}`);
            return;
        }
        setFollowBusy(true);
        try {
            await tipsterApi.follow(tip.tipsterId, !following);
            setFollowing(!following);
        } catch (e) { setError(apiErrorMessage(e)); }
        finally { setFollowBusy(false); }
    };
    return <TipsterShell title="" navigation="none" className="tip-detail-page">
        <Notice error={error}/>
        {checkout && tip && <TipPurchaseModal tip={tip} onClose={() => setCheckout(false)}/>}
        {loading ? <p role="status">Loading prediction...</p> : tip && <>
            <div className="tip-detail-topline d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                <nav aria-label="Breadcrumb" className="d-flex align-items-center gap-2 small">
                    <Link href="/" className="text-muted text-decoration-none">Home</Link>
                    <span className="text-muted">/</span>
                    <Link href="/tips" className="text-muted text-decoration-none">Tips</Link>
                    <span className="text-muted">/</span>
                    <span className="fw-bold text-success text-uppercase">{tip.sport}</span>
                </nav>
                <div className="d-flex flex-wrap gap-2">
                    <Link href="/tips" className="tip-pill"><i className="bi bi-arrow-left me-1"></i> All Tips</Link>
                    <Link href="/my-purchased-tips" className="tip-pill"><i className="bi bi-unlock me-1"></i> My Purchased Tips</Link>
                </div>
            </div>

            <article className={`tip-detail-hero ${tip.visibility === "Premium" ? "tip-detail-premium" : ""}`}>
                <div className="tip-detail-badges d-flex align-items-center gap-2 flex-wrap mb-3">
                    <span className="tip-tag" data-sport={tip.sport}>{tip.sport}</span>
                    <span className="badge bg-light text-dark border px-2 py-1 fw-semibold">{tip.competition}</span>
                    <span className={`tip-status fs-10 ${tip.visibility === "Premium" ? "tip-paid-price" : "active"}`}>
                        {tip.visibility === "Premium" ? <><i className="bi bi-lock-fill me-1"></i>PREMIUM ({money(tip.premiumPrice || 0, tip.currency)})</> : "FREE TIP"}
                    </span>
                    <span className="tip-status fs-10">{tip.status}</span>
                </div>

                <h1 className="tip-detail-title">{tip.predictionTitle}</h1>

                <div className="tip-detail-match d-flex align-items-center gap-3 flex-wrap my-3">
                    <strong className="fs-5 text-dark"><i className="bi bi-trophy text-warning me-2"></i>{tip.teams.home} vs {tip.teams.away}</strong>
                    <span className="text-muted small d-inline-flex align-items-center gap-1">
                        <i className="bi bi-calendar3"></i> {tip.matchDate}
                    </span>
                    {tip.kickoffTime && (
                        <span className="text-muted small d-inline-flex align-items-center gap-1">
                            <i className="bi bi-clock"></i> {tip.kickoffTime}
                        </span>
                    )}
                </div>

                <div className="tip-detail-metrics">
                    <div className="tip-metric-card">
                        <small>PREDICTION MARKET</small>
                        <strong>{tip.predictionCategory}</strong>
                    </div>
                    <div className="tip-metric-card">
                        <small>DECIMAL ODDS</small>
                        <strong className="tip-detail-odds">{Number(tip.odds).toFixed(2)}</strong>
                    </div>
                    <div className="tip-metric-card">
                        <small>CONFIDENCE LEVEL</small>
                        <span className={`tip-confidence-badge ${tip.confidenceLevel?.toLowerCase()}`} data-confidence={tip.confidenceLevel}>
                            <i className={`bi ${tip.confidenceLevel === "High" ? "bi-shield-fill-check" : tip.confidenceLevel === "Medium" ? "bi-shield-check" : "bi-shield"}`}></i>
                            {tip.confidenceLevel} Confidence
                        </span>
                    </div>
                </div>
            </article>

            <div className="tip-detail-columns">
                <div className="tip-detail-content">
                    <section className="tip-panel tip-detail-summary mb-4">
                        <div className="tip-heading mb-3">
                            <h2 className="d-flex align-items-center gap-2 mb-0 fs-5">
                                <i className="bi bi-info-circle-fill text-warning"></i> Match Preview &amp; Summary
                            </h2>
                        </div>
                        <p className="editorial-copy">{tip.analysisSnippet || "No public match preview has been added for this prediction."}</p>
                    </section>

                    <section className={`tip-panel tip-detail-analysis ${tip.unlocked ? "is-unlocked" : "is-locked"}`}>
                        <div className="tip-heading d-flex align-items-center justify-content-between mb-3">
                            <h2 className="d-flex align-items-center gap-2 mb-0 fs-5">
                                <i className={`bi ${tip.unlocked ? "bi-unlock-fill text-success" : "bi-lock-fill text-warning"}`}></i>
                                Detailed Prediction &amp; Analysis
                            </h2>
                            {tip.unlocked && <span className="tip-status active">{tip.isOwnTip ? "YOUR TIP" : "FULL ACCESS UNLOCKED"}</span>}
                        </div>
                        {tip.unlocked ? (
                            <div className="tip-unlocked-body">
                                {tip.predictionDescription && (
                                    <div className="tip-content-block mb-3">
                                        <h6 className="fw-bold text-uppercase text-muted small mb-2" style={{ letterSpacing: "0.04em" }}>Prediction Pick Details</h6>
                                        <p className="editorial-copy">{tip.predictionDescription}</p>
                                    </div>
                                )}
                                {tip.detailedAnalysis && (
                                    <div className="tip-content-block">
                                        <h6 className="fw-bold text-uppercase text-muted small mb-2" style={{ letterSpacing: "0.04em" }}>In-Depth Statistical Analysis</h6>
                                        <p className="editorial-copy">{tip.detailedAnalysis}</p>
                                    </div>
                                )}
                                {!tip.predictionDescription && !tip.detailedAnalysis && (
                                    <p className="text-muted">No additional analysis has been added for this prediction.</p>
                                )}
                            </div>
                        ) : (
                            <div className="tip-detail-unlock text-center py-5 px-3 rounded-4" style={{ background: "#FAF6EF", border: "1px dashed #D8D1C5" }}>
                                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "56px", height: "56px", background: "#FFFBEB", border: "1px solid #FDE68A", color: "#B45309", fontSize: "24px" }}>
                                    <i className="bi bi-lock-fill"></i>
                                </div>
                                <h3 className="fs-5 fw-bold mb-2 text-dark">{tip.visibility === "Premium" ? "Unlock This Premium Prediction" : "Sign in to Read this Free Tip"}</h3>
                                <p className="text-muted small mb-4" style={{ maxWidth: "440px", margin: "0 auto" }}>{tip.visibility === "Premium" ? "Get instant access to this Tipster's full prediction, statistical breakdown, and match analysis." : "This prediction is free for all registered Sports Verge members."}</p>
                                {tip.visibility === "Premium" ? (
                                    <button className="tip-primary px-4 py-2" disabled={busy} onClick={pay}>
                                        <i className="bi bi-lock-fill me-1"></i>
                                        {busy ? "Opening checkout..." : `Unlock for ${money(tip.premiumPrice || 0, tip.currency)}`}
                                    </button>
                                ) : (
                                    <Link className="tip-primary px-4 py-2" href={`/login?next=${encodeURIComponent("/tips/" + id)}`}>
                                        Sign in to read
                                    </Link>
                                )}
                                {tip.visibility === "Premium" && (
                                    <p className="text-muted small mt-3 mb-0" style={{ fontSize: "12px" }}>One-time secure purchase with Stripe. Instant access upon confirmation.</p>
                                )}
                            </div>
                        )}
                    </section>
                </div>

                <aside className="tip-panel tip-detail-author">
                    <div className="tip-heading mb-3">
                        <h2 className="d-flex align-items-center gap-2 mb-0 fs-5">
                            <i className="bi bi-person-badge text-warning"></i> Tipster Profile
                        </h2>
                    </div>

                    <div className="tip-detail-author-profile d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: "1px solid #EAE5DC" }}>
                        <ProfileAvatar name={tip.tipster.displayName} url={tip.tipster.avatarUrl} size={54}/>
                        <div>
                            <Link href={`/tipsters/${tip.tipsterId}`} className="fw-bold text-dark text-decoration-none d-block">
                                {tip.tipster.displayName}
                            </Link>
                            <small className="text-muted">@{tip.tipster.username}</small>
                        </div>
                    </div>

                    <div className="tip-detail-author-stats-grid mb-3">
                        <div className="p-3 rounded-3" style={{ background: "#FAF6EF", border: "1px solid #EAE5DC" }}>
                            <small className="d-block text-muted text-uppercase fw-bold" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>WIN RATE</small>
                            <strong className="fs-4 fw-bold font-space-grotesk text-dark d-block mt-1">
                                {winRate == null ? "\u2014" : `${winRate}%`}
                            </strong>
                        </div>
                        <div className="p-3 rounded-3" style={{ background: "#FAF6EF", border: "1px solid #EAE5DC" }}>
                            <small className="d-block text-muted text-uppercase fw-bold" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>STATUS</small>
                            <strong className="fs-6 fw-bold text-success d-block mt-1">
                                {tip.tipster.isVerified ? "Verified Tipster" : "Active Tipster"}
                            </strong>
                        </div>
                    </div>

                    {!isOwnTipsterProfile(tip.tipsterId) && (
                        <button className="tip-primary w-100 mb-2" disabled={followBusy} onClick={follow}>
                            {followBusy ? "Updating..." : following ? "Following" : "+ Follow Tipster"}
                        </button>
                    )}

                    <Link className="tip-pill w-100 text-center d-block mb-3" href={`/tipsters/${tip.tipsterId}`}>
                        View Full Profile <i className="bi bi-arrow-right ms-1"></i>
                    </Link>

                    <div className="text-center pt-2" style={{ borderTop: "1px solid #EAE5DC" }}>
                        <button className="btn btn-link text-muted small p-0 text-decoration-none" style={{ fontSize: "12px" }} type="button" onClick={report}>
                            <i className="bi bi-flag me-1"></i> Report this tip
                        </button>
                    </div>
                </aside>
            </div>
        </>}
    </TipsterShell>;
}
