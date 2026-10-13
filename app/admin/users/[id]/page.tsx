"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi, type AdminUserDetails } from "@/lib/admin-api";
import { useAdminToast } from "@/components/admin/AdminToast";

const Badge = ({ active }: { active: boolean }) => (
  <span className={`admin-badge ${active ? "admin-badge-success" : "admin-badge-danger"}`}>
    {active ? "Active" : "Blocked"}
  </span>
);

const toDate = (value?: string | null) => (value ? new Date(value).toLocaleString() : "Never");
const formatActivityDate = (value: string) => new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date(value));
const activityIcon = (success: boolean) => success ? "bi-box-arrow-in-right" : "bi-shield-x";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const userId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [detail, setDetail] = useState<AdminUserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityPage, setActivityPage] = useState(1);
  const { showToast } = useAdminToast();
  const activityPageSize = 5;

  useEffect(() => {
    if (!userId) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const result = await adminApi.user(userId);
        if (!active) return;
        setDetail(result.data);
      } catch (err) {
        if (!active) return;
        setDetail(null);
        showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to load user details." });
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [showToast, userId]);

  const activityTotalPages = Math.max(1, Math.ceil((detail?.loginHistory.length || 0) / activityPageSize));
  const visibleActivity = detail?.loginHistory.slice((activityPage - 1) * activityPageSize, activityPage * activityPageSize) || [];

  return (
    <div>
      <div className="admin-detail-head mb-4">
        <div>
          <Link href="/admin/users" className="admin-detail-back">
            <i className="bi bi-arrow-left" />
            Back to users
          </Link>
          <h1 className="admin-title mt-3 mb-0">{detail ? `${detail.user.firstName} ${detail.user.lastName}` : "User details"}</h1>
          <p className="admin-subtitle">Account profile, favorite teams and competitions, and recent activity.</p>
        </div>
        {detail && <Badge active={detail.user.isActive} />}
      </div>

      {loading ? (
        <section className="admin-card">
          <div className="admin-empty"><div className="spinner-border spinner-border-sm text-success" /></div>
        </section>
      ) : !detail ? (
        <section className="admin-card">
          <div className="admin-empty">This user could not be found.</div>
        </section>
      ) : (
        <>
          <div className="row g-4">
            <div className="col-lg-5">
              <section className="admin-card h-100">
                <div className="admin-card-header">
                  <div>
                    <span className="admin-section-kicker">ACCOUNT</span>
                    <strong>Identity and access</strong>
                  </div>
                  <i className="bi bi-person-vcard admin-stat-icon" />
                </div>
                <div className="admin-card-body">
                  <dl className="admin-detail-list">
                    <div><dt>User ID</dt><dd>{detail.user.id}</dd></div>
                    <div><dt>Email</dt><dd>{detail.user.email}</dd></div>
                    <div><dt>Role</dt><dd>{detail.user.role}</dd></div>
                    <div><dt>Registered</dt><dd>{toDate(detail.user.createdAt)}</dd></div>
                    <div><dt>Last login</dt><dd>{toDate(detail.user.lastLoginAt)}</dd></div>
                    <div><dt>Updated</dt><dd>{toDate(detail.user.updatedAt)}</dd></div>
                  </dl>
                </div>
              </section>
            </div>

            <div className="col-lg-7">
              <section className="admin-card h-100">
                <div className="admin-card-header">
                  <div>
                    <span className="admin-section-kicker">PREFERENCES</span>
                    <strong>Favorites</strong>
                  </div>
                  <i className="bi bi-sliders admin-stat-icon" />
                </div>
                <div className="admin-card-body">
                  <div className="admin-detail-favorites mb-4">
                    <div>
                      <span className="admin-form-label d-block mb-2">CURRENT FAVORITE TEAMS</span>
                      <div className="admin-detail-tag-list">
                        {detail.user.favoriteTeams?.length ? detail.user.favoriteTeams.map((team) => (
                          <span className="admin-badge admin-badge-muted" key={team}>{team}</span>
                        )) : <span className="admin-muted small">No favorite teams selected.</span>}
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="admin-form-label d-block mb-2">CURRENT FAVORITE COMPETITIONS</span>
                      <div className="admin-detail-tag-list">
                        {detail.user.favoriteCompetitions?.length ? detail.user.favoriteCompetitions.map((competition) => (
                          <span className="admin-badge admin-badge-muted" key={competition}>{competition}</span>
                        )) : <span className="admin-muted small">No favorite competitions selected.</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <section className="admin-dashboard-panel mt-4">
            <div className="admin-dashboard-panel-head">
              <div>
                <span className="admin-section-kicker">RECENT ACTIVITY</span>
                <h3>Sign-in activity</h3>
                <p>Latest account access events for this user</p>
              </div>
              <span className="admin-activity-count">Page {activityPage} of {activityTotalPages}</span>
            </div>
            <div className="admin-activity-list">
              {visibleActivity.length ? visibleActivity.map((login) => (
                <div className="admin-activity-item" key={login.id}>
                  <span className="admin-activity-icon">
                    <i className={`bi ${activityIcon(login.wasSuccessful)}`} />
                  </span>
                  <div className="admin-activity-copy">
                    <strong>{login.wasSuccessful ? "Successful sign in" : "Failed sign in"}</strong>
                    <span>{login.ipAddress || "Unknown IP"}{login.userAgent ? ` • ${login.userAgent}` : ""}</span>
                  </div>
                  <time>{formatActivityDate(login.createdAt)}</time>
                </div>
              )) : (
                <div className="admin-empty">No activity recorded for this user yet.</div>
              )}
            </div>
            {detail.loginHistory.length > activityPageSize ? (
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 px-3 py-3 border-top border-white-05">
                <span className="admin-muted small">Showing {visibleActivity.length} of {detail.loginHistory.length} sign-ins</span>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-sm admin-btn-ghost" disabled={activityPage <= 1} onClick={() => setActivityPage((current) => Math.max(1, current - 1))}>Previous</button>
                  <button type="button" className="btn btn-sm admin-btn-ghost" disabled={activityPage >= activityTotalPages} onClick={() => setActivityPage((current) => Math.min(activityTotalPages, current + 1))}>Next</button>
                </div>
              </div>
            ) : null}
          </section>
        </>
      )}
    </div>
  );
}
