"use client";

import { type FormEvent, useEffect, useState } from "react";
import { adminApi, getAdminSession, updateAdminStoredUser, type AdminUser } from "@/lib/admin-api";
import { useAdminToast } from "@/components/admin/AdminToast";

type ProfileForm = { firstName: string; lastName: string; email: string };

export default function AdminProfilePage() {
  const [user, setUser] = useState<AdminUser | null>(() => getAdminSession()?.user || null);
  const [form, setForm] = useState<ProfileForm>(() => {
    const storedUser = getAdminSession()?.user;
    return storedUser ? { firstName: storedUser.firstName, lastName: storedUser.lastName, email: storedUser.email } : { firstName: "", lastName: "", email: "" };
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useAdminToast();

  useEffect(() => {
    adminApi.me().then((result) => {
      setUser(result.data.user);
      setForm({ firstName: result.data.user.firstName, lastName: result.data.user.lastName, email: result.data.user.email });
    }).catch((requestError) => showToast({ type: "error", message: requestError instanceof Error ? requestError.message : "Unable to load profile." })).finally(() => setLoading(false));
  }, [showToast]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      showToast({ type: "error", message: "First name, last name, and email are required." });
      return;
    }
    setSaving(true);
    try {
      const result = await adminApi.updateProfile({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim() });
      setUser(result.data.user);
      setForm({ firstName: result.data.user.firstName, lastName: result.data.user.lastName, email: result.data.user.email });
      updateAdminStoredUser(result.data.user);
      showToast({ type: "success", message: "Profile updated successfully." });
    } catch (requestError) {
      showToast({ type: "error", message: requestError instanceof Error ? requestError.message : "Unable to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "PA" : "PA";

  return <div>
    <div className="mb-4"><h1 className="admin-title">My profile</h1><p className="admin-subtitle">Manage your administrator identity and account details.</p></div>
    {loading ? <div className="admin-card admin-empty"><div className="spinner-border spinner-border-sm text-success" /></div> : <div className="row g-4">
      <div className="col-lg-4">
        <section className="admin-card admin-profile-identity">
          <div className="admin-profile-avatar-large">{initials}</div>
          <h2>{user?.firstName} {user?.lastName}</h2>
          <p>{user?.email}</p>
          <span className="admin-badge admin-badge-success"><i className="bi bi-shield-check me-1" />{user?.role?.replace("_", " ")}</span>
          <div className="admin-profile-meta"><div><span>Account status</span><strong><i className="bi bi-circle-fill me-1" />{user?.isActive ? "Active" : "Inactive"}</strong></div><div><span>Access</span><strong>Administrator console</strong></div></div>
        </section>
      </div>
      <div className="col-lg-8">
        <section className="admin-card">
          <div className="admin-card-header"><div><strong>Account information</strong><div className="admin-muted small">These details are used across the admin console.</div></div><i className="bi bi-person-vcard admin-stat-icon" /></div>
          <div className="admin-card-body">
            <form onSubmit={submit} className="d-grid gap-4">
              <div className="row g-3"><div className="col-md-6"><label className="admin-form-label">FIRST NAME</label><input required className="form-control admin-form-control" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} /></div><div className="col-md-6"><label className="admin-form-label">LAST NAME</label><input required className="form-control admin-form-control" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} /></div><div className="col-12"><label className="admin-form-label">EMAIL ADDRESS</label><input required type="email" className="form-control admin-form-control" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div></div>
              <div className="d-flex justify-content-end"><button type="submit" className="btn admin-btn-primary px-4" disabled={saving}>{saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="bi bi-check2 me-2" />Save changes</>}</button></div>
            </form>
          </div>
        </section>
      </div>
    </div>}
  </div>;
}
