"use client";
import ProfileAvatar from "./ProfileAvatar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { tipsterApi, isOwnTipsterProfile } from "@/lib/tipster-api";
import { apiErrorMessage, hasAuthSession } from "@/lib/auth-api";
import type { Tip, TipsterProfile } from "@/types/tipster";
import { TipsterShell, Notice, TipCards, StatsGrid, SportsTags } from "./TipsterUI";
import TipPurchaseModal from "./TipPurchaseModal";
export default function TipsterPublicProfile() {
    const { id } = useParams<{
        id: string;
    }>();
    const [following, setFollowing] = useState(false), [followBusy, setFollowBusy] = useState(false), [filter, setFilter] = useState("All"), [checkout, setCheckout] = useState<Tip | null>(null);
    const [profile, setProfile] = useState<TipsterProfile | null>(null), [tips, setTips] = useState<Tip[]>([]), [error, setError] = useState(""), [loading, setLoading] = useState(true);
    useEffect(() => {
        let active = true;
        const refresh = () => Promise.all([tipsterApi.publicProfile(id), hasAuthSession() ? tipsterApi.follows() : Promise.resolve({ ids: [] as string[] })])
            .then(([p, f]) => {
            if (active) {
                setFollowing(f.ids.includes(id));
                setProfile(p.profile);
                setTips(p.tips);
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
        void refresh();
        const onFocus = () => { void refresh(); };
        window.addEventListener("focus", onFocus);
        return () => { active = false; window.removeEventListener("focus", onFocus); };
    }, [id]);
    const follow = async () => { if (!profile || isOwnTipsterProfile(profile.id)) return; if (!hasAuthSession()) {
        window.location.assign(`/login?next=${encodeURIComponent("/tipsters/" + id)}`);
        return;
    } if (followBusy) return;
    setFollowBusy(true); try {
        await tipsterApi.follow(id, !following);
        setProfile(p => p ? { ...p, stats: { ...p.stats, followersCount: Math.max(0,p.stats.followersCount + (following ? -1 : 1)) } } : p);
        setFollowing(!following);
    }
    catch (e) {
        setError(apiErrorMessage(e));
    }
    finally {
        setFollowBusy(false);
    } };
    const filtered = tips.filter(t => filter === "All" || t.visibility === filter);
    const unlock = (tip: Tip) => { if (!hasAuthSession()) {
        window.location.assign(`/login?next=${encodeURIComponent("/tips/" + tip.id + "?checkout=1")}`);
        return;
    } setCheckout(tip); };
    return <TipsterShell title="" navigation="none" className="tip-public-profile-page">
      <div className="tip-profile-breadcrumb d-flex align-items-center justify-content-between mb-4">
        <nav aria-label="Breadcrumb" className="d-flex align-items-center gap-2 small">
          <Link href="/" className="text-muted text-decoration-none">Home</Link>
          <span className="text-muted">/</span>
          <Link href="/tips" className="text-muted text-decoration-none">Tips Marketplace</Link>
          {profile && <>
            <span className="text-muted">/</span>
            <span className="fw-semibold text-dark">{profile.displayName}</span>
          </>}
        </nav>
        <Link className="tip-pill" href="/tips">
          <span aria-hidden="true">&larr;</span> All Predictions
        </Link>
      </div>
      <Notice error={error}/>
      {loading ? <p role="status">Loading profile...</p> : profile ? <>
        <section className="tip-public-profile-hero">
          <div className="d-flex align-items-start gap-3 flex-grow-1 min-w-0 flex-wrap flex-sm-nowrap">
            <div className="tip-public-avatar">
              <ProfileAvatar name={profile.displayName} url={profile.avatarUrl} size={84}/>
              {profile.verificationStatus === "verified" && <span className="tip-public-verified" aria-label="Verified Tipster"><i className="bi bi-check-lg"></i></span>}
            </div>
            <div className="tip-public-identity flex-grow-1 min-w-0">
              <div className="tip-public-name d-flex align-items-center gap-3 flex-wrap">
                <h1 className="mb-0 fs-2 fw-black font-space-grotesk text-dark">{profile.displayName}</h1>
                {profile.verificationStatus === "verified" && <span className="tip-status fs-10 active"><i className="bi bi-patch-check-fill me-1"></i> VERIFIED TIPSTER</span>}
              </div>
              <div className="tip-public-metadata d-flex align-items-center gap-2 my-2 flex-wrap small">
                <span className="text-muted">@{profile.username}</span>
                <span className="text-muted">&bull;</span>
                <span className="text-dark fw-semibold d-inline-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "24px", height: "24px", background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB" }}>
                    <i className="bi bi-geo-alt-fill" style={{ fontSize: "12px" }}></i>
                  </span>
                  {profile.country}
                </span>
                <span className="text-muted">&bull;</span>
                <span className="text-dark fw-semibold d-inline-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "24px", height: "24px", background: "#FEF3C7", color: "#B45309", border: "1px solid #FCD34D" }}>
                    <i className="bi bi-award-fill" style={{ fontSize: "14px" }}></i>
                  </span>
                  {profile.yearsOfExperience} {profile.yearsOfExperience === 1 ? "Year" : "Years"} Experience
                </span>
              </div>
              {profile.shortBio && <p className="my-2 text-secondary" style={{ fontSize: "14px", lineHeight: "1.6" }}>{profile.shortBio}</p>}
              <div className="tip-public-sports d-flex align-items-center gap-2 mt-3 flex-wrap">
                <span className="fw-bold small text-muted text-uppercase me-1" style={{ letterSpacing: "0.04em", fontSize: "11px" }}>SPORTS COVERAGE:</span>
                <SportsTags sports={profile.preferredSports}/>
              </div>
            </div>
          </div>
          <aside className="tip-public-follow p-4 rounded-4" style={{ background: "#FAF6EF", border: "1px solid #EAE5DC", textAlign: "center" }}>
            <small className="fw-bold text-muted text-uppercase d-block mb-1" style={{ letterSpacing: "0.05em", fontSize: "12px" }}>FOLLOWERS</small>
            <strong className="d-block mb-3 font-space-grotesk" aria-live="polite" style={{ fontSize: "32px", color: "#1C1F22" }}>{profile.stats.followersCount}</strong>
            {isOwnTipsterProfile(profile.id) ? (
              <Link className="tip-primary w-100" href="/profile#tipster-profile">My Profile</Link>
            ) : (
              <button className="tip-primary w-100" disabled={followBusy} aria-pressed={following} onClick={follow}>
                {followBusy ? "Saving..." : following ? "Following" : "+ Follow Tipster"}
              </button>
            )}
          </aside>
        </section>

        <StatsGrid items={[
          { label: "Win Rate", value: profile.stats.winRate == null ? "\u2014" : `${profile.stats.winRate}%`, detail: profile.stats.settledTips ? `${profile.stats.settledTips} decided predictions` : "Awaiting settled predictions", color: "#16A34A", icon: "bi bi-trophy" },
          { label: "ROI %", value: profile.stats.roi == null ? "\u2014" : `${profile.stats.roi}%`, detail: profile.stats.settledTips ? "Flat 1-unit stakes; voids excluded" : "Awaiting settled predictions", color: "#B45309", icon: "bi bi-graph-up-arrow" },
          { label: "Total Published", value: profile.stats.publishedTips ?? tips.length, detail: "Published predictions", color: "#1C1F22", icon: "bi bi-journal-check" },
          { label: "Current Streak", value: profile.stats.streak || "\u2014", detail: profile.stats.streak ? "Consecutive decided predictions" : "Awaiting settled predictions", color: "#2563EB", icon: "bi bi-fire" }
        ]}/>

        <div className="d-flex align-items-center justify-content-between my-4 flex-wrap gap-3">
          <div>
            <h2 className="fs-4 fw-black font-space-grotesk text-dark mb-1">{profile.displayName.toUpperCase()}&apos;S PREDICTIONS FEED</h2>
            <p className="text-muted small mb-0">Browse this Tipster&apos;s active sports predictions.</p>
          </div>
          <div className="d-flex gap-2 flex-wrap" role="group" aria-label="Prediction category">
            {["All", "Free", "Premium"].map(v => (
              <button
                key={v}
                className={`tip-pill ${filter === v ? "active" : ""}`}
                aria-pressed={filter === v}
                onClick={() => setFilter(v)}
              >
                {v} Tips ({tips.filter(t => v === "All" || t.visibility === v).length})
              </button>
            ))}
          </div>
        </div>
        {filtered.length ? (
          <TipCards tips={filtered} onUnlock={unlock}/>
        ) : (
          <section className="tip-public-empty text-center py-5 px-3 rounded-4" style={{ background: "#FAF6EF", border: "1px dashed #D8D1C5" }} aria-live="polite">
            <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "56px", height: "56px", background: "#FFFFFF", border: "1px solid #EAE5DC", color: "#9CA3AF", fontSize: "24px" }}>
              <i className="bi bi-journal-x"></i>
            </div>
            <h3 className="fs-5 fw-bold text-dark mb-2">No Predictions in this Category</h3>
            <p className="text-muted small mb-4" style={{ maxWidth: "420px", margin: "0 auto" }}>This Tipster currently has no active predictions in the selected category.</p>
            <button className="tip-pill px-4 py-2" onClick={() => setFilter("All")}>Show All Tips</button>
          </section>
        )}
        {checkout&&<TipPurchaseModal tip={checkout} onClose={()=>setCheckout(null)}/>}
      </>:<div className="tip-panel tip-empty"><h2>Tipster not found</h2><p>This profile is unavailable.</p><Link href="/tips" className="tip-pill">Browse Tipsters</Link></div>}
    </TipsterShell>;
}
