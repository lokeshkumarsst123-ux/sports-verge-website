"use client";

import Link from "next/link";
import { type CSSProperties, useCallback, useEffect, useState } from "react";
import { useAdminToast } from "@/components/admin/AdminToast";
import { adminApi, type DashboardData } from "@/lib/admin-api";

const formatNumber = (value: number | string | undefined) => new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(Number(value || 0));
const formatDate = (value: string) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
const activityIcon = (action: string) => action.includes("delete") ? "bi-trash3" : action.includes("create") ? "bi-plus-circle" : action.includes("update") || action.includes("status") ? "bi-pencil-square" : action.includes("login") ? "bi-box-arrow-in-right" : "bi-activity";

type MetricCardProps = { icon: string; label: string; value: number | string; detail: string; tone: "green" | "blue" | "amber" | "violet" };

const MetricCard = ({ icon, label, value, detail, tone }: MetricCardProps) => <article className={`admin-kpi admin-kpi-${tone}`}>
  <div className="admin-kpi-top"><span className="admin-kpi-icon"><i className={`bi ${icon}`} /></span><span className="admin-kpi-label">{label}</span><i className="bi bi-arrow-up-right admin-kpi-arrow" /></div>
  <strong className="admin-kpi-value">{value}</strong>
  <span className="admin-kpi-detail">{detail}</span>
</article>;

const DashboardSkeleton = () => <div className="admin-dashboard-skeleton"><div className="admin-skeleton-hero" /><div className="row g-3 mb-4">{[1, 2, 3, 4].map((item) => <div className="col-6 col-xl-3" key={item}><div className="admin-skeleton-card" /></div>)}</div><div className="row g-4"><div className="col-lg-7"><div className="admin-skeleton-panel" /></div><div className="col-lg-5"><div className="admin-skeleton-panel" /></div></div></div>;

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { showToast } = useAdminToast();

  const load = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const result = await adminApi.dashboard();
      setData(result.data);
      setLastUpdated(new Date());
    } catch (error) {
      setLoadFailed(true);
      showToast({ type: "error", title: "Dashboard unavailable", message: error instanceof Error ? error.message : "Unable to load dashboard." });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    const refreshTimer = window.setInterval(() => { void load(); }, 60000);
    return () => { window.clearTimeout(timer); window.clearInterval(refreshTimer); };
  }, [load]);

  if (loading && !data) return <DashboardSkeleton />;
  if (!data && loadFailed) return <div className="admin-dashboard-empty"><div className="admin-dashboard-empty-icon"><i className="bi bi-cloud-slash" /></div><h1>Dashboard needs a refresh</h1><p>We could not load the latest operational data.</p><button type="button" className="btn admin-btn-primary px-4" onClick={() => void load()}><i className="bi bi-arrow-clockwise me-2" />Try again</button></div>;
  if (!data) return null;

  const users = data.users || {};
  const content = data.content || {};
  const ads = data.advertisements || {};
  const integrations = data.integrations || {};
  const topArticles = data.topArticles.slice(0, 10);
  const recentActivity = data.recentActivity.slice(0, 10);
  const activityTrend = data.activityTrend || [];
  const activityMax = Math.max(...activityTrend.map((point) => Number(point.count || 0)), 1);
  const peakActivity = Math.max(...activityTrend.map((point) => Number(point.count || 0)), 0);
  const maxViews = Math.max(...topArticles.map((article) => Number(article.viewCount ?? article.view_count ?? 0)), 1);
  const systemHealth = integrations.total_integrations ? Math.round((Number(integrations.healthy_integrations || 0) / Number(integrations.total_integrations)) * 100) : 0;
  const refreshedLabel = lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Waiting for update";
  const totalArticles = Number(content.total_articles || 0);
  const expiredCampaigns = Number(ads.expired_campaigns || 0);
  const totalClicks = Number(ads.total_clicks || 0);
  const publishedArticles = Number(content.published_articles || 0);
  const draftArticles = Number(content.draft_articles || 0);
  const scheduledArticles = Number(content.scheduled_articles || 0);
  const publishedShare = totalArticles ? (publishedArticles / totalArticles) * 100 : 0;
  const draftShare = totalArticles ? (draftArticles / totalArticles) * 100 : 0;
  const scheduledShare = totalArticles ? (scheduledArticles / totalArticles) * 100 : 0;
  const donutStyle = { background: `conic-gradient(#51e08a 0 ${publishedShare}%, #74b9ff ${publishedShare}% ${publishedShare + draftShare}%, #f4bd5b ${publishedShare + draftShare}% ${publishedShare + draftShare + scheduledShare}%, #34424c ${publishedShare + draftShare + scheduledShare}% 100%)` };

  return <div className="admin-dashboard">
    <section className="admin-dashboard-hero">
      <div className="admin-dashboard-hero-copy"><span className="admin-dashboard-eyebrow"><i className="bi bi-soundwave me-2" />OPERATIONS / LIVE OVERVIEW</span><h1>Control center</h1><p>Everything important across your Sports Verg platform, in one clear view.</p><div className="admin-dashboard-meta"><span className="admin-live-pill"><i />Systems operational</span><span><i className="bi bi-clock me-1" />{refreshedLabel}</span></div></div>
      <div className="admin-dashboard-hero-art" aria-hidden="true"><span className="admin-orbit admin-orbit-one" /><span className="admin-orbit admin-orbit-two" /><i className="bi bi-grid-1x2-fill" /></div>
      <button type="button" className="admin-dashboard-refresh" onClick={() => void load()} disabled={loading}><i className={`bi bi-arrow-clockwise ${loading ? "admin-spin" : ""}`} /> <span>{loading ? "Refreshing" : "Refresh data"}</span></button>
    </section>

    <div className="row g-3 mb-4">
      <div className="col-6 col-xl-3"><MetricCard icon="bi-people-fill" label="Total users" value={formatNumber(users.total_users)} detail="Registered accounts" tone="green" /></div>
      <div className="col-6 col-xl-3"><MetricCard icon="bi-person-check-fill" label="Active users" value={formatNumber(users.active_users)} detail="Currently enabled" tone="blue" /></div>
      <div className="col-6 col-xl-3"><MetricCard icon="bi-newspaper" label="Published stories" value={formatNumber(content.published_articles)} detail="Live in newsroom" tone="amber" /></div>
      <div className="col-6 col-xl-3"><MetricCard icon="bi-person-plus-fill" label="New this month" value={formatNumber(users.new_users)} detail="Last 30 days" tone="violet" /></div>
    </div>

    <div className="admin-dashboard-section-heading"><div><span className="admin-section-kicker">PERFORMANCE SNAPSHOT</span><h2>Platform pulse</h2></div><span className="admin-dashboard-section-note">A quick read on today&apos;s operation</span></div>
   <div className="row g-3 mb-4">
  {/* Audience */}
  <div className="col-md-6 col-xl-3">
    <article className="admin-pulse-card">
      <div className="admin-pulse-heading">
        <span>Audience</span>
        <i className="bi bi-graph-up-arrow" />
      </div>

      <strong>
        {formatNumber(users.total_users)} <small>users</small>
      </strong>

      <p>
        {formatNumber(users.recent_logins)} recent logins in the last
        24 hours
      </p>

      <div
        className="admin-mini-bars admin-mini-bars-green"
        aria-hidden="true"
      >
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </article>
  </div>

  {/* Content Engine */}
  <div className="col-md-6 col-xl-3">
    <article className="admin-pulse-card">
      <div className="admin-pulse-heading">
        <span>Content engine</span>
        <i className="bi bi-lightning-charge-fill" />
      </div>

      <strong>
        {formatNumber(totalArticles)} <small>articles</small>
      </strong>

      <p>
        {formatNumber(draftArticles)} drafts waiting in your editorial
        pipeline
      </p>

      <div
        className="admin-pulse-progress"
        role="progressbar"
        aria-label="Published content ratio"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(publishedShare)}
      >
        <span
          style={{
            width: `${Math.min(100, publishedShare)}%`,
          }}
        />
      </div>

      <div className="admin-pulse-progress-label">
        <span>Published ratio</span>
        <b>{Math.round(publishedShare)}%</b>
      </div>
    </article>
  </div>

  {/* Recent Logins */}
<div className="col-md-6 col-xl-3">
  <article className="admin-pulse-card admin-pulse-card-logins">
    <div className="admin-pulse-heading">
      <span>Recent logins</span>
      <i className="bi bi-box-arrow-in-right" />
    </div>

    <strong>
      {formatNumber(users.recent_logins)} <small>logins</small>
    </strong>

    <p>Administrator and user sign-ins recorded during the last 24 hours</p>

    <div className="admin-login-status">
      <span className="admin-campaign-status-dot is-success" />
      <span>Activity recorded today</span>
    </div>
  </article>
</div>

  {/* Campaign Performance */}
  <div className="col-md-6 col-xl-3">
    <article className="admin-pulse-card admin-pulse-card-campaign">
      <div className="admin-pulse-heading">
        <span>Campaign activity</span>
        <i className="bi bi-megaphone-fill" />
      </div>

      <strong>
        {formatNumber(totalClicks)} <small>clicks</small>
      </strong>

      <p>
        {expiredCampaigns > 0
          ? `${expiredCampaigns} expired ${
              expiredCampaigns === 1 ? "campaign needs" : "campaigns need"
            } your review`
          : "All advertisement campaigns are within their active windows"}
      </p>

      <div className="admin-campaign-status">
        <span
          className={
            expiredCampaigns > 0
              ? "admin-campaign-status-dot is-warning"
              : "admin-campaign-status-dot is-success"
          }
        />

        <span>
          {expiredCampaigns > 0
            ? `${expiredCampaigns} expired`
            : "Campaigns operational"}
        </span>

        <Link
          href="/admin/advertisements"
          className="admin-campaign-status-link"
        >
          View
          <i className="bi bi-arrow-up-right" />
        </Link>
      </div>
    </article>
  </div>
</div>

    <div className="row g-4 mb-4">
      <div className="col-lg-7"><section className="admin-chart-panel h-100"><div className="admin-chart-head"><div><span className="admin-section-kicker">ADMIN ACTIVITY</span><h3>Weekly pulse</h3><p>Actions recorded across the last seven days</p></div><div className="admin-chart-head-right"><span className="admin-chart-window"><i />LAST 7 DAYS</span><div className="admin-chart-total"><strong>{formatNumber(activityTrend.reduce((sum, point) => sum + Number(point.count || 0), 0))}</strong><span>total actions</span></div></div></div><div className="admin-trend-wrap"><div className="admin-trend-scale" aria-hidden="true"><span>{activityMax}</span><span>{Math.ceil(activityMax / 2)}</span><span>0</span></div><div className="admin-trend-chart" role="img" aria-label="Administrator activity for the last seven days">{activityTrend.length ? activityTrend.map((point) => { const count = Number(point.count || 0); return <div className={`admin-trend-column ${count === peakActivity && peakActivity > 0 ? "is-peak" : ""}`} key={point.date} title={`${point.label}: ${count} admin actions`}><span className="admin-trend-value">{count}</span><div className="admin-trend-track"><span style={{ height: `${Math.max(count ? 8 : 3, (count / activityMax) * 100)}%` }} /></div><small>{point.label}</small></div>; }) : <div className="admin-empty">Activity trend will appear after admin actions.</div>}</div></div></section></div>
      <div className="col-lg-5"><section className="admin-chart-panel admin-mix-panel h-100"><div className="admin-chart-head"><div><span className="admin-section-kicker">EDITORIAL MIX</span><h3>Content status</h3><p>Current newsroom distribution</p></div><i className="bi bi-pie-chart-fill admin-chart-head-icon" /></div><div className="admin-mix-body"><div className="admin-donut" style={donutStyle as CSSProperties}><div className="admin-donut-hole"><strong>{formatNumber(totalArticles)}</strong><span>stories</span></div></div><div className="admin-mix-legend"><div><i className="admin-legend-dot admin-legend-green" /><span>Published</span><strong>{publishedArticles}<small>{Math.round(publishedShare)}%</small></strong></div><div><i className="admin-legend-dot admin-legend-blue" /><span>Drafts</span><strong>{draftArticles}<small>{Math.round(draftShare)}%</small></strong></div><div><i className="admin-legend-dot admin-legend-amber" /><span>Scheduled</span><strong>{scheduledArticles}<small>{Math.round(scheduledShare)}%</small></strong></div></div></div></section></div>
    </div>

    <section className="admin-dashboard-panel mb-4"><div className="admin-dashboard-panel-head"><div><span className="admin-section-kicker">ATTENTION REQUIRED</span><h3>Operational alerts</h3><p>Items that may need an administrator review</p></div><i className="bi bi-bell-fill admin-chart-head-icon" /></div><div className="row g-3"><div className={`col-md-6 ${expiredCampaigns ? "" : "d-none"}`}><div className="admin-alert-card admin-alert-warning"><i className="bi bi-calendar-x" /><div><strong>{expiredCampaigns} expired campaign{expiredCampaigns === 1 ? "" : "s"}</strong><span>Review the advertisement date windows.</span></div><Link href="/admin/advertisements" className="admin-panel-link">Review <i className="bi bi-arrow-up-right" /></Link></div></div><div className={`col-md-6 ${draftArticles ? "" : "d-none"}`}><div className="admin-alert-card admin-alert-info"><i className="bi bi-file-earmark-text" /><div><strong>{draftArticles} draft article{draftArticles === 1 ? "" : "s"}</strong><span>Editorial content is waiting for review.</span></div><Link href="/admin/news" className="admin-panel-link">Open news <i className="bi bi-arrow-up-right" /></Link></div></div><div className={`col-12 ${expiredCampaigns || draftArticles ? "d-none" : ""}`}><div className="admin-alert-card admin-alert-success"><i className="bi bi-check-circle" /><div><strong>No outstanding content or campaign alerts</strong><span>Everything in the current admin workspace looks clear.</span></div></div></div></div></section>

    <div className="admin-dashboard-section-heading"><div><span className="admin-section-kicker">WORKSPACE</span><h2>What needs your attention</h2></div></div>
    <div className="row g-4 mb-4">
      <div className="col-xl-7"><section className="admin-dashboard-panel"><div className="admin-dashboard-panel-head"><div><span className="admin-section-kicker">EDITORIAL PERFORMANCE</span><h3>Top content</h3><p>Top 5 visible · more stories available on scroll</p></div><Link href="/admin/news" className="admin-panel-link">Open newsroom <i className="bi bi-arrow-up-right" /></Link></div><div className="admin-content-rank-list">{topArticles.length ? topArticles.map((article, index) => { const views = Number(article.viewCount ?? article.view_count ?? 0); return <div className="admin-content-rank" key={article.id}><span className="admin-rank-number">{String(index + 1).padStart(2, "0")}</span><div className="admin-content-rank-main"><div className="admin-content-rank-title">{article.headline}</div><div className="admin-content-rank-meta"><span>{article.category}</span><span className={`admin-badge ${article.status === "published" ? "admin-badge-success" : "admin-badge-muted"}`}>{article.status}</span></div><div className="admin-rank-bar"><span style={{ width: `${Math.max(5, (views / maxViews) * 100)}%` }} /></div></div><strong className="admin-rank-views">{formatNumber(views)}<small> views</small></strong></div>; }) : <div className="admin-empty">No articles have been created yet.</div>}</div></section></div>
      <div className="col-xl-5"><section className="admin-dashboard-panel"><div className="admin-dashboard-panel-head"><div><span className="admin-section-kicker">AUDIT TRAIL</span><h3>Recent activity</h3><p>Latest administrator actions</p></div><span className="admin-activity-count">{recentActivity.length} / 10</span></div><div className="admin-activity-list">{recentActivity.length ? recentActivity.map((item) => <div className="admin-activity-item" key={item.id}><span className="admin-activity-icon"><i className={`bi ${activityIcon(String(item.action))}`} /></span><div className="admin-activity-copy"><strong>{String(item.action).replaceAll(".", " ")}</strong><span>{item.actor || "System activity"}</span></div><time>{formatDate(item.createdAt)}</time></div>) : <div className="admin-empty">Activity will appear here after admin actions.</div>}</div></section></div>
    </div>

  </div>;
}
