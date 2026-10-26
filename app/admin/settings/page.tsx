"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { adminApi, type GeneralSettings } from "@/lib/admin-api";
import { useAdminToast } from "@/components/admin/AdminToast";

type SettingsForm = GeneralSettings & { logoFile: File | null };

const blank: SettingsForm = {
  websiteName: "",
  logoUrl: "",
  contactEmail: "",
  contactNumber: "",
  socialLinks: { facebook: "", linkedin: "", twitter: "" },
  logoFile: null,
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(blank);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useAdminToast();

  useEffect(() => {
    adminApi.settings()
      .then((result) => {
        const settings = result.data.settings;
        const socialLinks = settings.socialLinks || {};
        setForm({
          ...blank,
          ...settings,
          logoUrl: settings.logoUrl || "",
          contactEmail: settings.contactEmail || "",
          contactNumber: settings.contactNumber || "",
          socialLinks: {
            facebook: socialLinks.facebook || "",
            linkedin: socialLinks.linkedin || socialLinks.instagram || "",
            twitter: socialLinks.twitter || "",
          },
          logoFile: null,
        });
        setPreview(settings.logoUrl || "");
      })
      .catch((error) => showToast({ type: "error", message: error instanceof Error ? error.message : "Unable to load settings." }))
      .finally(() => setLoading(false));
  }, [showToast]);

  const set = (field: keyof Omit<SettingsForm, "socialLinks" | "logoFile">, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const setSocial = (field: string, value: string) => {
    setForm((current) => ({ ...current, socialLinks: { ...current.socialLinks, [field]: value } }));
  };

  const chooseLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      showToast({ type: "error", message: "Please choose an image up to 5 MB." });
      event.target.value = "";
      return;
    }
    setForm((current) => ({ ...current, logoFile: file }));
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = new FormData();
    body.append("websiteName", form.websiteName);
    body.append("logoUrl", form.logoUrl || "");
    body.append("contactEmail", form.contactEmail || "");
    body.append("contactNumber", form.contactNumber || "");
    body.append("socialLinks", JSON.stringify(form.socialLinks));
    if (form.logoFile) body.append("logoFile", form.logoFile);

    setSaving(true);
    try {
      const result = await adminApi.updateSettings(body);
      const settings = result.data.settings;
      setForm((current) => ({ ...current, ...settings, logoUrl: settings.logoUrl || "", logoFile: null }));
      setPreview(settings.logoUrl || preview);
      window.dispatchEvent(new CustomEvent("site-settings-updated", { detail: settings }));
      showToast({ type: "success", message: "General settings saved successfully." });
    } catch (error) {
      showToast({ type: "error", message: error instanceof Error ? error.message : "Unable to save settings." });
    } finally {
      setSaving(false);
    }
  };

  return <div>
    <div className="mb-4">
      <h1 className="admin-title">General settings</h1>
      <p className="admin-subtitle">Manage your website identity, contact details, logo, and social profiles.</p>
    </div>

    {loading ? <div className="admin-card admin-empty"><div className="spinner-border spinner-border-sm text-success" /></div> : <form onSubmit={submit} className="d-grid gap-4">
      <section className="admin-card">
        <div className="admin-card-header"><div><strong>Website identity</strong><div className="admin-muted small">These values represent your public platform identity.</div></div><i className="bi bi-globe2 admin-stat-icon" /></div>
        <div className="admin-card-body"><div className="row g-3">
          <div className="col-md-8"><label className="admin-form-label">WEBSITE NAME</label><input required className="form-control admin-form-control" value={form.websiteName} onChange={(event) => set("websiteName", event.target.value)} placeholder="The Sports Verge" /></div>
          <div className="col-md-4"><label className="admin-form-label">LOGO IMAGE</label><input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="form-control admin-form-control" onChange={chooseLogo} /><small className="admin-muted d-block mt-1">JPG, PNG, WEBP, GIF or AVIF · maximum 5 MB.</small></div>
          {preview && <div className="col-12"><div className="admin-image-preview"><img src={preview} alt="Website logo preview" style={{ maxHeight: 70, objectFit: "contain" }} /><div className="admin-image-preview-copy"><strong>{form.logoFile?.name || "Current website logo"}</strong><span>Logo preview</span></div></div></div>}
        </div></div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header"><div><strong>Contact details</strong><div className="admin-muted small">Displayed wherever your public support details are used.</div></div><i className="bi bi-person-lines-fill admin-stat-icon" /></div>
        <div className="admin-card-body"><div className="row g-3">
          <div className="col-md-6"><label className="admin-form-label">CONTACT EMAIL</label><input type="email" className="form-control admin-form-control" value={form.contactEmail || ""} onChange={(event) => set("contactEmail", event.target.value)} placeholder="support@example.com" /></div>
          <div className="col-md-6"><label className="admin-form-label">CONTACT NUMBER</label><input className="form-control admin-form-control" value={form.contactNumber || ""} onChange={(event) => set("contactNumber", event.target.value)} placeholder="+1 800 555 0199" /></div>
        </div></div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header"><div><strong>Social media links</strong><div className="admin-muted small">Add public profile URLs for your social channels.</div></div><i className="bi bi-share-fill admin-stat-icon" /></div>
        <div className="admin-card-body"><div className="row g-3">
          <div className="col-md-4"><label className="admin-form-label">FACEBOOK</label><input type="url" className="form-control admin-form-control" value={form.socialLinks.facebook || ""} onChange={(event) => setSocial("facebook", event.target.value)} placeholder="https://facebook.com/..." /></div>
          <div className="col-md-4"><label className="admin-form-label">LINKEDIN</label><input type="url" className="form-control admin-form-control" value={form.socialLinks.linkedin || ""} onChange={(event) => setSocial("linkedin", event.target.value)} placeholder="https://linkedin.com/..." /></div>
          <div className="col-md-4"><label className="admin-form-label">X / TWITTER</label><input type="url" className="form-control admin-form-control" value={form.socialLinks.twitter || ""} onChange={(event) => setSocial("twitter", event.target.value)} placeholder="https://x.com/..." /></div>
        </div></div>
      </section>

      <button disabled={saving} className="btn admin-btn-primary justify-self-start px-4">{saving ? "Saving..." : "Save general settings"}</button>
    </form>}
  </div>;
}
