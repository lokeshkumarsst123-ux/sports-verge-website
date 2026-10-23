"use client";
import ProfileAvatar from "./ProfileAvatar";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Tip, TipsterProfile } from "@/types/tipster";
import { tipsterApi, isOwnTipsterProfile } from "@/lib/tipster-api";
import { hasAuthSession, apiErrorMessage } from "@/lib/auth-api";
import {
  TipsterShell,
  TipCards,
  Notice,
  SportsTags,
  TipIcon,
} from "./TipsterUI";
import TipPurchaseModal from "./TipPurchaseModal";
export default function TipMarketplace() {
  const [checkout, setCheckout] = useState<Tip | null>(null);
  const [tips, setTips] = useState<Tip[]>([]),
    [tipsters, setTipsters] = useState<TipsterProfile[]>([]);
  const [follows, setFollows] = useState<string[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const [followingBusy, setFollowingBusy] = useState<string[]>([]);
  const [sport, setSport] = useState("All"),
    [access, setAccess] = useState("All"),
    [search, setSearch] = useState("");
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const [t, p] = await Promise.all([
          tipsterApi.tips(),
          tipsterApi.tipsters(),
        ]);
        if (!active) return;
        setTips(t.tips);
        setTipsters(p.tipsters);
        if (hasAuthSession()) {
          const f = await tipsterApi.follows();
          if (active) setFollows(f.ids);
        }
      } catch (e) {
        if (active) setError(apiErrorMessage(e));
      } finally {
        if (active) setLoading(false);
      }
    };
    void refresh();
    const onFocus = () => {
      void refresh();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      active = false;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  const follow = async (id: string) => {
    if (isOwnTipsterProfile(id)) return;
    if (!hasAuthSession()) {
      window.location.assign("/login?next=%2Ftips");
      return;
    }
    if (followingBusy.includes(id)) return;
    setFollowingBusy((p) => [...p, id]);
    try {
      const next = !follows.includes(id);
      await tipsterApi.follow(id, next);
      setFollows((p) => (next ? [...p, id] : p.filter((v) => v !== id)));
      setTipsters((p) =>
        p.map((t) =>
          t.id === id
            ? {
                ...t,
                stats: {
                  ...t.stats,
                  followersCount: Math.max(
                    0,
                    t.stats.followersCount + (next ? 1 : -1),
                  ),
                },
              }
            : t,
        ),
      );
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setFollowingBusy((p) => p.filter((v) => v !== id));
    }
  };
  const featuredIds = new Set(
    tips.filter((t) => t.isFeatured).map((t) => t.tipsterId),
  );
  const featuredTipsters = featuredIds.size
    ? tipsters.filter((p) => featuredIds.has(p.id))
    : tipsters;
  const filtered = tips.filter(
    (t) =>
      (sport === "All" || t.sport === sport) &&
      (access === "All" ||
        (access === "Trending" ? t.isTrending : t.visibility === access)) &&
      `${t.predictionTitle} ${t.competition} ${t.teams.home} ${t.teams.away} ${t.tipster.displayName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const unlock = (tip: Tip) => {
    if (!hasAuthSession()) {
      window.location.assign(
        `/login?next=${encodeURIComponent("/tips/" + tip.id + "?checkout=1")}`,
      );
      return;
    }
    setCheckout(tip);
  };
  return (
    <TipsterShell title="" className="tip-marketplace-page">
      <Notice error={error} />
      <section className="tip-hero">
        <div className="tip-hero-copy">
          <span className="tip-status">VERIFIED TIPSTER PREDICTIONS</span>
          <h1>SPORTS PREDICTIONS &amp; TIPS</h1>
          <p>
            Browse sports predictions across Football, Cricket, NFL and AFL.
            Access free analysis or unlock premium tips from our Tipster
            community.
          </p>
          <label className="visually-hidden" htmlFor="tip-search">
            Search team, league or Tipster
          </label>
          <div className="position-relative">
            <i
              className="bi bi-search position-absolute top-50 translate-middle-y text-muted"
              style={{ left: "16px", fontSize: "14px" }}
            ></i>
            <input
              id="tip-search"
              className="tip-search ps-5"
              placeholder="Search team, league, or Tipster..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="tip-panel tip-marketplace-join">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <span className="muted small">BECOME A TIPSTER</span>
            <span className="tip-status fs-10">PRO PROGRAM</span>
          </div>
          <h2 className="h6 mt-2">Monetize Your Sports Predictions</h2>
          <p className="muted small">
            Publish free tips to build your audience and offer premium
            predictions.
          </p>
          <Link className="tip-primary w-100" href="/tipster-register">
            Join as a Tipster
          </Link>
        </div>
      </section>
      {!!tipsters.length && (
        <section
          className="tip-marketplace-creators"
          aria-labelledby="meet-tipsters"
        >
          <h2 id="meet-tipsters" className="d-flex align-items-center">
            <i className="bi bi-stars text-warning me-2"></i>{" "}
            {featuredIds.size ? "FEATURED TIPSTERS" : "MEET THE TIPSTERS"}
          </h2>
          <p className="muted small">
            Discover verified Tipsters and follow their latest predictions.
          </p>
          <div className="tip-creator-grid">
            {featuredTipsters.slice(0, 4).map((p) => (
              <article className="tip-creator-card" key={p.id}>
                <div className="tip-creator-identity">
                  <Link
                    href={`/tipsters/${p.id}`}
                    className="tip-creator-avatar"
                    aria-label={`View ${p.displayName} profile`}
                  >
                    <ProfileAvatar
                      name={p.displayName}
                      url={p.avatarUrl}
                      size={52}
                    />
                    {p.verificationStatus === "verified" && (
                      <span
                        className="tip-avatar-verified"
                        aria-label="Verified Tipster"
                      >
                        <i className="bi bi-check-lg"></i>
                      </span>
                    )}
                  </Link>
                  <div className="tip-creator-name">
                    <Link href={`/tipsters/${p.id}`}>{p.displayName}</Link>
                    <small>@{p.username}</small>
                  </div>
                </div>
                <div className="tip-mini-stats">
                  <div>
                    <small>WIN RATE</small>
                    <span
                      className="tip-unavailable"
                      title="Win rate from verified decided predictions"
                    >
                      {p.stats.winRate == null
                        ? "\u2014"
                        : `${p.stats.winRate}%`}
                    </span>
                  </div>
                  <div>
                    <small>TIPS</small>
                    <strong>
                      {p.stats.publishedTips ??
                        tips.filter((t) => t.tipsterId === p.id).length}
                    </strong>
                  </div>
                </div>
                <SportsTags sports={p.preferredSports} />
                <div className="tip-creator-actions">
                  {!isOwnTipsterProfile(p.id) && (
                    <button
                      className="tip-pill"
                      disabled={followingBusy.includes(p.id)}
                      aria-pressed={follows.includes(p.id)}
                      onClick={() => follow(p.id)}
                    >
                      {followingBusy.includes(p.id) ? (
                        "Saving..."
                      ) : follows.includes(p.id) ? (
                        <>
                          <i className="bi bi-check2 me-1"></i>Following
                        </>
                      ) : (
                        <>
                          <i className="bi bi-plus-lg me-1"></i>Follow
                        </>
                      )}
                    </button>
                  )}
                  <Link
                    className={`tip-pill tip-profile-link ${isOwnTipsterProfile(p.id) ? "w-100 text-center" : ""}`}
                    href={`/tipsters/${p.id}`}
                  >
                    <i className="bi bi-person-circle me-1"></i> Profile
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      <div className="tip-tabs d-flex align-items-center justify-content-between gap-3 flex-wrap">
        <div className="tip-access-tabs d-flex gap-2 flex-wrap">
          {["All", "Free", "Premium", "Trending"].map((v) => (
            <button
              key={v}
              className={`tip-pill ${access === v ? "active" : ""}`}
              aria-pressed={access === v}
              onClick={() => setAccess(v)}
            >
              <TipIcon
                name={
                  v === "All"
                    ? "grid"
                    : v === "Free"
                      ? "unlock"
                      : v === "Premium"
                        ? "lock"
                        : "flame"
                }
              />
              {v === "All"
                ? "All Tips"
                : v === "Trending"
                  ? "Trending Picks"
                  : `${v} Tips`}
            </button>
          ))}
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {["All", "Cricket", "Football", "NFL", "AFL"].map((v) => (
            <button
              key={v}
              className={`tip-pill ${sport === v ? "active" : ""}`}
              aria-pressed={sport === v}
              onClick={() => setSport(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <p className="tip-results-count muted small" aria-live="polite">
        Showing <strong className="text-dark fw-bold">{filtered.length}</strong>{" "}
        active {filtered.length === 1 ? "prediction" : "predictions"}
      </p>
      {loading ? (
        <p role="status">Loading tips...</p>
      ) : (
        <TipCards tips={filtered} onUnlock={unlock} />
      )}
      {checkout && (
        <TipPurchaseModal tip={checkout} onClose={() => setCheckout(null)} />
      )}
    </TipsterShell>
  );
}
