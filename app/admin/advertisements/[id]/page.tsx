"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { adminApi, type Advertisement } from "@/lib/admin-api";
import { useAdminToast } from "@/components/admin/AdminToast";

const placements = new Map([
  ["homepage_header", "Homepage header"],
  ["homepage_sidebar", "Homepage sidebar"],
  ["news_listing", "News listing"],
  ["news_details", "News details"],
  ["match_details", "Match details"],
  ["footer", "Footer section"],
]);

const placementLabel = (value: string) => placements.get(value) || value;
const dateLabel = (value?: string) => (value ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "Not set");

export default function AdminAdvertisementDetailPage() {
  const params = useParams<{ id: string }>();
  const advertisementId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAdminToast();

  useEffect(() => {
    if (!advertisementId) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const result = await adminApi.advertisement(advertisementId);
        if (active) setAdvertisement(result.data.advertisement);
      } catch (err) {
        if (active) {
          setAdvertisement(null);
          showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to load advertisement details." });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [advertisementId, showToast]);

  const placementList = useMemo(
    () => advertisement?.placement.split(",").map((value) => value.trim()).filter(Boolean) || [],
    [advertisement],
  );

  const ctr = advertisement?.impressions ? ((Number(advertisement.clicks || 0) / Number(advertisement.impressions || 0)) * 100).toFixed(2) : "0.00";
  const effectiveStatus = advertisement?.effectiveStatus === "active"
    ? "active"
    : advertisement?.status === "active"
      ? "expired"
      : "inactive";

  return (
    <div>
      <div className="admin-detail-head mb-4">
        <div>
          <Link href="/admin/advertisements" className="admin-detail-back">
            <i className="bi bi-arrow-left" />
            Back to advertisements
          </Link>
          <h1 className="admin-title mt-3 mb-0">{advertisement?.title || "Campaign details"}</h1>
          <p className="admin-subtitle">Campaign banner, placements, schedule, and delivery performance.</p>
        </div>
        {advertisement && (
          <span className={`admin-badge ${effectiveStatus === "active" ? "admin-badge-success" : effectiveStatus === "expired" ? "admin-badge-warning" : "admin-badge-muted"}`}>
            {effectiveStatus}
          </span>
        )}
      </div>

      {loading ? (
        <section className="admin-card">
          <div className="admin-empty"><div className="spinner-border spinner-border-sm text-success" /></div>
        </section>
      ) : !advertisement ? (
        <section className="admin-card">
          <div className="admin-empty">This campaign could not be found.</div>
        </section>
      ) : (
        <>
          <div className="row g-4">
            <div className="col-xl-8">
              <section className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <span className="admin-section-kicker">CREATIVE</span>
                    <strong>Banner preview</strong>
                  </div>
                  <i className="bi bi-image admin-stat-icon" />
                </div>
                <div className="admin-card-body">
                  <div className="admin-detail-banner">
                    <img src={advertisement.imageUrl} alt={advertisement.title} onError={(event) => { event.currentTarget.style.display = "none"; }} />
                  </div>
                  <div className="admin-detail-link-row mt-3">
                    <span className="admin-muted">Destination URL</span>
                    <a href={advertisement.destinationUrl} target="_blank" rel="noreferrer" className="admin-detail-link">
                      {advertisement.destinationUrl}
                    </a>
                  </div>
                </div>
              </section>
            </div>

            <div className="col-xl-4">
              <div className="admin-detail-stack">
                <section className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <span className="admin-section-kicker">PERFORMANCE</span>
                      <strong>Delivery snapshot</strong>
                    </div>
                    <i className="bi bi-graph-up admin-stat-icon" />
                  </div>
                  <div className="admin-card-body">
                    <div className="admin-detail-stats">
                      <article className="admin-detail-stat">
                        <span>Impressions</span>
                        <strong>{advertisement.impressions}</strong>
                      </article>
                      <article className="admin-detail-stat">
                        <span>Clicks</span>
                        <strong>{advertisement.clicks}</strong>
                      </article>
                      <article className="admin-detail-stat">
                        <span>CTR</span>
                        <strong>{ctr}%</strong>
                      </article>
                    </div>
                  </div>
                </section>

                <section className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <span className="admin-section-kicker">CONFIGURATION</span>
                      <strong>Campaign setup</strong>
                    </div>
                    <i className="bi bi-sliders admin-stat-icon" />
                  </div>
                  <div className="admin-card-body">
                    <dl className="admin-detail-list">
                      <div><dt>Campaign ID</dt><dd>{advertisement.id}</dd></div>
                      <div><dt>Status</dt><dd>{advertisement.status}</dd></div>
                      <div><dt>Start date</dt><dd>{dateLabel(advertisement.startDate)}</dd></div>
                      <div><dt>End date</dt><dd>{dateLabel(advertisement.endDate)}</dd></div>
                      <div><dt>Created</dt><dd>{advertisement.createdAt ? new Date(advertisement.createdAt).toLocaleString() : "Not available"}</dd></div>
                      <div><dt>Updated</dt><dd>{advertisement.updatedAt ? new Date(advertisement.updatedAt).toLocaleString() : "Not available"}</dd></div>
                    </dl>
                    <div className="admin-detail-tag-list mt-3">
                      {placementList.map((placement) => (
                        <span className="admin-badge admin-badge-muted" key={placement}>{placementLabel(placement)}</span>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
