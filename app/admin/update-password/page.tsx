"use client";

import { type FormEvent, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { useAdminToast } from "@/components/admin/AdminToast";

type PasswordForm = { currentPassword: string; newPassword: string; confirmPassword: string };
const emptyForm: PasswordForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

export default function AdminUpdatePasswordPage() {
  const [form, setForm] = useState<PasswordForm>(emptyForm);
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const { showToast } = useAdminToast();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      showToast({ type: "error", message: "Please complete all password fields." });
      return;
    }
    if (form.newPassword.length < 8 || !/[A-Za-z]/.test(form.newPassword) || !/[0-9]/.test(form.newPassword)) {
      showToast({ type: "error", message: "New password must be at least 8 characters and include letters and numbers." });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      showToast({ type: "error", message: "New password and confirmation do not match." });
      return;
    }
    setSaving(true);
    try {
      await adminApi.changePassword(form);
      setForm(emptyForm);
      showToast({ type: "success", message: "Password updated successfully." });
    } catch (requestError) {
      showToast({ type: "error", message: requestError instanceof Error ? requestError.message : "Unable to update password." });
    } finally {
      setSaving(false);
    }
  };

  return <div>
    <div className="mb-4"><h1 className="admin-title">Update password</h1><p className="admin-subtitle">Keep your administrator account protected with a strong password.</p></div>
    <div className="row g-4">
      <div className="col-lg-8"><section className="admin-card"><div className="admin-card-header"><div><strong>Change your password</strong><div className="admin-muted small">You will continue using the current admin session after the update.</div></div><i className="bi bi-key admin-stat-icon" /></div><div className="admin-card-body"><form onSubmit={submit} className="d-grid gap-4"><div><label className="admin-form-label">CURRENT PASSWORD</label><div className="position-relative"><input required type={visible.current ? "text" : "password"} autoComplete="current-password" className="form-control admin-form-control pe-5" value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} /><button type="button" className="admin-password-toggle" onClick={() => setVisible({ ...visible, current: !visible.current })} aria-label={visible.current ? "Hide current password" : "Show current password"}><i className={`bi ${visible.current ? "bi-eye-slash" : "bi-eye"}`} /></button></div></div><div><label className="admin-form-label">NEW PASSWORD</label><div className="position-relative"><input required type={visible.next ? "text" : "password"} autoComplete="new-password" className="form-control admin-form-control pe-5" value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} /><button type="button" className="admin-password-toggle" onClick={() => setVisible({ ...visible, next: !visible.next })} aria-label={visible.next ? "Hide new password" : "Show new password"}><i className={`bi ${visible.next ? "bi-eye-slash" : "bi-eye"}`} /></button></div><small className="admin-muted d-block mt-2">At least 8 characters, including one letter and one number.</small></div><div><label className="admin-form-label">CONFIRM NEW PASSWORD</label><div className="position-relative"><input required type={visible.confirm ? "text" : "password"} autoComplete="new-password" className="form-control admin-form-control pe-5" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} /><button type="button" className="admin-password-toggle" onClick={() => setVisible({ ...visible, confirm: !visible.confirm })} aria-label={visible.confirm ? "Hide password confirmation" : "Show password confirmation"}><i className={`bi ${visible.confirm ? "bi-eye-slash" : "bi-eye"}`} /></button></div></div><div className="d-flex justify-content-end"><button type="submit" className="btn admin-btn-primary px-4" disabled={saving}>{saving ? <><span className="spinner-border spinner-border-sm me-2" />Updating...</> : <><i className="bi bi-shield-check me-2" />Update password</>}</button></div></form></div></section></div>
      <div className="col-lg-4"><aside className="admin-card admin-security-card"><div className="admin-security-icon"><i className="bi bi-shield-lock" /></div><h2>Security first</h2><p>Use a password that is unique to this administrator account. Avoid sharing it with other team members.</p><div className="admin-security-point"><i className="bi bi-check-circle-fill" /><span>Never reuse an old password</span></div><div className="admin-security-point"><i className="bi bi-check-circle-fill" /><span>Use a mix of letters and numbers</span></div><div className="admin-security-point"><i className="bi bi-check-circle-fill" /><span>Keep your credentials private</span></div></aside></div>
    </div>
  </div>;
}
