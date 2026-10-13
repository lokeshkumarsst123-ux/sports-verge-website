"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { DEFAULT_PRIVACY_POLICY, DEFAULT_TERMS_OF_SERVICE } from "@/lib/legal-content";
import { useAdminToast } from "@/components/admin/AdminToast";

type LegalForm = { termsOfService: string; privacyPolicy: string };
type LegalTab = keyof LegalForm;

const blank: LegalForm = {
  termsOfService: DEFAULT_TERMS_OF_SERVICE,
  privacyPolicy: DEFAULT_PRIVACY_POLICY,
};

const legalTabs: Array<{ key: LegalTab; label: string; description: string; icon: string }> = [
  {
    key: "termsOfService",
    label: "Terms of Service",
    description: "Rules and conditions for using the platform",
    icon: "bi-file-earmark-text",
  },
  {
    key: "privacyPolicy",
    label: "Privacy Policy",
    description: "How user data is collected and protected",
    icon: "bi-shield-lock",
  },
];

export default function AdminLegalPagesPage() {
  const [form, setForm] = useState<LegalForm>(blank);
  const [activeTab, setActiveTab] = useState<LegalTab>("termsOfService");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const { showToast } = useAdminToast();

  useEffect(() => {
    adminApi.legalContent()
      .then((result) => {
        const legal = result.data.legal;
        setForm({
          termsOfService: legal.termsOfService?.trim() || DEFAULT_TERMS_OF_SERVICE,
          privacyPolicy: legal.privacyPolicy?.trim() || DEFAULT_PRIVACY_POLICY,
        });
        setUpdatedAt(legal.updatedAt || null);
      })
      .catch((error) => showToast({ type: "error", message: error instanceof Error ? error.message : "Unable to load CMS" }))
      .finally(() => setLoading(false));
  }, [showToast]);

  const set = (field: LegalTab, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const activeTabMeta = legalTabs.find((tab) => tab.key === activeTab) || legalTabs[0];
  const activeContent = form[activeTab];
  const contentStats = useMemo(() => {
    const trimmed = activeContent.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const sections = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
    return { words, sections, characters: activeContent.length };
  }, [activeContent]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const result = await adminApi.updateLegalContent(form);
      setUpdatedAt(result.data.legal.updatedAt || new Date().toISOString());
      showToast({ type: "success", message: "Legal pages saved successfully." });
    } catch (error) {
      showToast({ type: "error", message: error instanceof Error ? error.message : "Unable to save legal pages." });
    } finally {
      setSaving(false);
    }
  };

  const updatedLabel = updatedAt ? `Last saved ${new Date(updatedAt).toLocaleString()}` : "Default platform content is active until you save changes.";

  return <div className="admin-cms-page">
    <section className="admin-cms-hero">
      <div className="admin-cms-hero-icon"><i className="bi bi-file-earmark-lock2" /></div>
      <div className="admin-cms-hero-copy">
        <span className="admin-section-kicker">CONTENT MANAGEMENT</span>
        <h1 className="admin-title">CMS</h1>
        <p className="admin-subtitle">Manage the legal content your users see during registration and across the platform.</p>
      </div>
      <div className={`admin-cms-save-status ${updatedAt ? "is-saved" : ""}`}>
        <i className={`bi ${updatedAt ? "bi-check-circle-fill" : "bi-stars"}`} />
        <span>{updatedAt ? "Content synced" : "Default content"}</span>
      </div>
    </section>

    {loading ? <div className="admin-card admin-empty"><div className="spinner-border spinner-border-sm text-success" /></div> : <form onSubmit={submit}>
      <div className="admin-cms-tabs-wrap">
        <div className="admin-cms-tabs-heading">
          <div>
            <span className="admin-section-kicker">LEGAL DOCUMENTS</span>
            <h2>Choose a document to edit</h2>
          </div>
          <span className="admin-cms-tabs-count">2 documents</span>
        </div>
        <div className="admin-cms-tabs" role="tablist" aria-label="Legal documents">
          {legalTabs.map((tab) => <button
            key={tab.key}
            id={`cms-tab-${tab.key}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            aria-controls={`cms-panel-${tab.key}`}
            className={`admin-cms-tab ${activeTab === tab.key ? "is-active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="admin-cms-tab-icon"><i className={`bi ${tab.icon}`} /></span>
            <span className="admin-cms-tab-copy"><strong>{tab.label}</strong><small>{tab.description}</small></span>
            <i className="bi bi-arrow-up-right admin-cms-tab-arrow" />
          </button>)}
        </div>
      </div>

      <section id={`cms-panel-${activeTab}`} role="tabpanel" aria-labelledby={`cms-tab-${activeTab}`} className="admin-cms-editor admin-card">
        <div className="admin-cms-editor-head">
          <div className="admin-cms-editor-heading">
            <div className="admin-cms-editor-icon"><i className={`bi ${activeTabMeta.icon}`} /></div>
            <div><span className="admin-section-kicker">NOW EDITING</span><h2>{activeTabMeta.label}</h2><p>{activeTabMeta.description}</p></div>
          </div>
          <span className="admin-badge admin-badge-success"><i className="bi bi-pencil me-1" />Editable</span>
        </div>
        <div className="admin-cms-editor-body">
          <div className="admin-cms-editor-label-row"><label className="admin-form-label" htmlFor={`admin-${activeTab}-content`}>DOCUMENT CONTENT</label><span className="admin-cms-editor-hint">Plain text with section breaks</span></div>
          <textarea id={`admin-${activeTab}-content`} required rows={20} className="form-control admin-form-control admin-cms-textarea" value={activeContent} onChange={(event) => set(activeTab, event.target.value)} />
          <div className="admin-cms-editor-help"><i className="bi bi-info-circle" /><span>Use a blank line between sections. The first line of each section is displayed as its heading on the user page.</span></div>
          <div className="admin-cms-editor-stats"><span><strong>{contentStats.sections}</strong> sections</span><span><strong>{contentStats.words}</strong> words</span><span><strong>{contentStats.characters}</strong> characters</span></div>
        </div>
      </section>

      <div className="admin-cms-savebar">
        <div className="admin-cms-savebar-copy"><i className="bi bi-cloud-check" /><span>{updatedLabel}</span></div>
        <button disabled={saving} className="btn admin-btn-primary admin-cms-save-button"><i className={`bi ${saving ? "bi-arrow-repeat admin-spin" : "bi-check2"} me-2`} />{saving ? "Saving changes..." : "Save legal pages"}</button>
      </div>
    </form>}
  </div>;
}
