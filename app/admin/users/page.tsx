"use client";

import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { adminApi, type AdminUserRow } from "@/lib/admin-api";
import { useAdminToast } from "@/components/admin/AdminToast";
import AdminModal from "@/components/admin/AdminModal";
import AdminSelect from "@/components/admin/AdminSelect";

const Badge = ({ active }: { active: boolean }) => (
  <span className={`admin-badge ${active ? "admin-badge-success" : "admin-badge-danger"}`}>
    {active ? "Active" : "Blocked"}
  </span>
);

const userStatusOptions = [
  { value: "all", label: "All users" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "new", label: "New in 30 days" },
];

type UserAction = { type: "toggle" | "password" | "delete"; user: AdminUserRow } | null;
type UserActionType = Exclude<UserAction, null>["type"];
type PasswordForm = { password: string; confirmPassword: string };
const emptyPassword: PasswordForm = { password: "", confirmPassword: "" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<UserAction>(null);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>(emptyPassword);
  const [passwordVisible, setPasswordVisible] = useState({ password: false, confirm: false });
  const [passwordError, setPasswordError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useAdminToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20", status });
      if (query.trim()) params.set("search", query.trim());
      const result = await adminApi.users(params.toString());
      setUsers(result.data.items);
      setTotal(result.data.total);
      setTotalPages(Math.max(1, result.data.totalPages));
    } catch (err) {
      showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to load users." });
    } finally {
      setLoading(false);
    }
  }, [page, query, showToast, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [load]);

  const openAction = (type: UserActionType, user: AdminUserRow) => {
    setAction({ type, user });
    setPasswordForm(emptyPassword);
    setPasswordError("");
    setPasswordVisible({ password: false, confirm: false });
  };

  const closeAction = () => {
    if (submitting) return;
    setAction(null);
    setPasswordForm(emptyPassword);
    setPasswordError("");
  };

  const saveToggle = async () => {
    if (!action?.user) return;
    setSubmitting(true);
    try {
      await adminApi.setUserStatus(action.user.id, !action.user.isActive);
      showToast({
        type: "success",
        message: `${action.user.email} is now ${action.user.isActive ? "blocked" : "active"}.`,
      });
      setAction(null);
      void load();
    } catch (err) {
      showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to update user." });
    } finally {
      setSubmitting(false);
    }
  };

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!action?.user) return;
    if (passwordForm.password.length < 8 || !/[A-Za-z]/.test(passwordForm.password) || !/[0-9]/.test(passwordForm.password)) {
      setPasswordError("Use at least 8 characters with one letter and one number.");
      return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError("");
    setSubmitting(true);
    try {
      await adminApi.resetUserPassword(action.user.id, passwordForm.password);
      showToast({ type: "success", message: "Password changed successfully." });
      setAction(null);
      setPasswordForm(emptyPassword);
    } catch (err) {
      showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to change password." });
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (!action?.user) return;
    setSubmitting(true);
    try {
      await adminApi.deleteUser(action.user.id);
      showToast({ type: "success", message: "User deleted successfully." });
      setAction(null);
      void load();
    } catch (err) {
      showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to delete user." });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedUser = action?.user;
  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h1 className="admin-title">User management</h1>
          <p className="admin-subtitle">Review accounts, preferences, favorites, and login activity.</p>
        </div>
      </div>

      <section className="admin-card">
        <div className="admin-card-header flex-wrap">
          <div className="d-flex gap-2 flex-wrap">
            <input
              className="form-control admin-form-control"
              style={{ minWidth: 240 }}
              placeholder="Search name or email"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
            <AdminSelect
              options={userStatusOptions}
              value={status}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              ariaLabel="Filter users"
            />
          </div>
          <span className="admin-muted small">{total} results</span>
        </div>

        <div className="table-responsive">
          <table className="table admin-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>User</th>
                <th>Role</th>
                <th>Registered</th>
                <th>Last login</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="admin-empty">
                    <div className="spinner-border spinner-border-sm text-success" />
                  </td>
                </tr>
              ) : users.length ? (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td className="admin-muted">{(page - 1) * 20 + index + 1}</td>
                    <td>
                      <Link className="admin-table-link" title="Open user detail page" href={`/admin/users/${user.id}`}>
                        <div className="fw-semibold">{user.firstName} {user.lastName}</div>
                        <div className="admin-muted" style={{ fontSize: 11 }}>{user.email}</div>
                      </Link>
                    </td>
                    <td><span className="admin-badge admin-badge-muted">{user.role}</span></td>
                    <td className="admin-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="admin-muted">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}</td>
                    <td><Badge active={user.isActive} /></td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button className="btn btn-sm admin-btn-ghost" title={user.isActive ? "Block user" : "Activate user"} onClick={() => openAction("toggle", user)}>
                          <i className={`bi ${user.isActive ? "bi-person-slash" : "bi-person-check"}`} />
                        </button>
                        <button className="btn btn-sm admin-btn-ghost" title="Change password" onClick={() => openAction("password", user)}>
                          <i className="bi bi-key" />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" title="Delete user" onClick={() => openAction("delete", user)}>
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="admin-empty">No users match these filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 px-3 pb-3">
          <span className="admin-muted small">Page {page} of {totalPages}</span>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-sm admin-btn-ghost" disabled={page <= 1 || loading} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button>
            <button type="button" className="btn btn-sm admin-btn-ghost" disabled={page >= totalPages || loading} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</button>
          </div>
        </div>
      </section>

      <AdminModal compact open={action?.type === "toggle"} title={selectedUser?.isActive ? "Block user" : "Activate user"} onClose={closeAction}>
        <div className="admin-action-confirm">
          <div className="admin-action-icon">
            <i className={`bi ${selectedUser?.isActive ? "bi-person-slash" : "bi-person-check"}`} />
          </div>
          <h3>{selectedUser?.isActive ? "Block this account?" : "Activate this account?"}</h3>
          <p><strong>{selectedUser?.email}</strong> will {selectedUser?.isActive ? "lose access to the platform until activated again." : "be able to sign in and use the platform again."}</p>
          <div className="admin-action-buttons">
            <button type="button" className="btn admin-btn-ghost" onClick={closeAction} disabled={submitting}>Cancel</button>
            <button type="button" className={`btn ${selectedUser?.isActive ? "btn-danger" : "admin-btn-primary"}`} onClick={saveToggle} disabled={submitting}>
              {submitting ? "Saving..." : selectedUser?.isActive ? "Block user" : "Activate user"}
            </button>
          </div>
        </div>
      </AdminModal>

      <AdminModal compact open={action?.type === "password"} title="Change user password" onClose={closeAction}>
        <form onSubmit={savePassword}>
          <p className="admin-password-modal-copy">Set a new password for <strong>{selectedUser?.email}</strong>. The user can use it on their next sign in.</p>
          <div className="mb-3">
            <label className="admin-form-label" htmlFor="admin-user-new-password">NEW PASSWORD</label>
            <div className="position-relative">
              <input id="admin-user-new-password" required minLength={8} type={passwordVisible.password ? "text" : "password"} autoComplete="new-password" className="form-control admin-form-control pe-5" value={passwordForm.password} onChange={(event) => { setPasswordForm({ ...passwordForm, password: event.target.value }); setPasswordError(""); }} placeholder="Enter new password" />
              <button type="button" className="admin-password-toggle" onClick={() => setPasswordVisible({ ...passwordVisible, password: !passwordVisible.password })} aria-label={passwordVisible.password ? "Hide new password" : "Show new password"}><i className={`bi ${passwordVisible.password ? "bi-eye-slash" : "bi-eye"}`} /></button>
            </div>
          </div>
          <div className="mb-2">
            <label className="admin-form-label" htmlFor="admin-user-confirm-password">CONFIRM PASSWORD</label>
            <div className="position-relative">
              <input id="admin-user-confirm-password" required minLength={8} type={passwordVisible.confirm ? "text" : "password"} autoComplete="new-password" className="form-control admin-form-control pe-5" value={passwordForm.confirmPassword} onChange={(event) => { setPasswordForm({ ...passwordForm, confirmPassword: event.target.value }); setPasswordError(""); }} placeholder="Confirm new password" />
              <button type="button" className="admin-password-toggle" onClick={() => setPasswordVisible({ ...passwordVisible, confirm: !passwordVisible.confirm })} aria-label={passwordVisible.confirm ? "Hide password confirmation" : "Show password confirmation"}><i className={`bi ${passwordVisible.confirm ? "bi-eye-slash" : "bi-eye"}`} /></button>
            </div>
          </div>
          {passwordError && <span className="admin-password-error">{passwordError}</span>}
          <small className="admin-muted d-block mt-2">At least 8 characters, including one letter and one number.</small>
          <div className="admin-action-buttons mt-4">
            <button type="button" className="btn admin-btn-ghost" onClick={closeAction} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn admin-btn-primary" disabled={submitting}>{submitting ? "Updating..." : "Change password"}</button>
          </div>
        </form>
      </AdminModal>

      <AdminModal compact open={action?.type === "delete"} title="Delete user" onClose={closeAction}>
        <div className="admin-action-confirm">
          <div className="admin-action-icon admin-action-icon-danger">
            <i className="bi bi-trash3" />
          </div>
          <h3>Delete this account?</h3>
          <p><strong>{selectedUser?.email}</strong> and its account access will be permanently removed. This action cannot be undone.</p>
          <div className="admin-action-buttons">
            <button type="button" className="btn admin-btn-ghost" onClick={closeAction} disabled={submitting}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={remove} disabled={submitting}>{submitting ? "Deleting..." : "Yes, delete user"}</button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
