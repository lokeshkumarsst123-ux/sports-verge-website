"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { adminApi, type SeoPageRule } from "@/lib/admin-api";
import { useAdminToast } from "@/components/admin/AdminToast";
import AdminModal from "@/components/admin/AdminModal";
import AdminSelect from "@/components/admin/AdminSelect";
import { seoPageCatalog } from "@/config/seo-pages";
import { normalizeSeoPath } from "@/lib/seo";

type SeoRuleForm = {
  pageLabel: string;
  pagePath: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogType: "website" | "article" | "profile";
  ogImageUrl: string;
  structuredData: string;
  isActive: boolean;
};

type PageRow = {
  key: string;
  label: string;
  path: string;
  group: string;
  description: string;
  includeInSitemap: boolean;
  rule: SeoPageRule | null;
  source: "catalog" | "custom";
};

const blankRule: SeoRuleForm = {
  pageLabel: "",
  pagePath: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  ogUrl: "",
  ogType: "website",
  ogImageUrl: "",
  structuredData: "",
  isActive: true,
};

const ogTypeOptions = [
  { value: "website", label: "Website" },
  { value: "article", label: "Article" },
  { value: "profile", label: "Profile" },
];

const seoManagementExcludedPaths = new Set([
  "/search",
  "/dashboard",
  "/login",
  "/register",
  "/forgot-password",
  "/profile",
  "/notifications",
].map(normalizeSeoPath));

const toRuleForm = (rule: SeoPageRule): SeoRuleForm => ({
  pageLabel: rule.pageLabel || "",
  pagePath: rule.pagePath || "",
  seoTitle: rule.seoTitle || "",
  seoDescription: rule.seoDescription || "",
  seoKeywords: rule.seoKeywords || "",
  canonicalUrl: rule.canonicalUrl || "",
  ogTitle: rule.ogTitle || "",
  ogDescription: rule.ogDescription || "",
  ogUrl: rule.ogUrl || "",
  ogType: rule.ogType || "website",
  ogImageUrl: rule.ogImageUrl || "",
  structuredData: rule.structuredData ? JSON.stringify(rule.structuredData, null, 2) : "",
  isActive: rule.isActive,
});

const parseStructuredData = (value: string) => {
  if (!value.trim()) return {};
  const parsed = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Structured data must be a JSON object.");
  return parsed as Record<string, unknown>;
};

export default function AdminSeoSettingsPage() {
  const [pageRules, setPageRules] = useState<SeoPageRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [ruleSaving, setRuleSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SeoPageRule | null>(null);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [ruleForm, setRuleForm] = useState<SeoRuleForm>(blankRule);
  const { showToast } = useAdminToast();

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const result = await adminApi.seoPages();
        if (!active) return;
        setPageRules(result.data.pages);
      } catch (error) {
        if (!active) return;
        showToast({ type: "error", message: error instanceof Error ? error.message : "Unable to load SEO pages." });
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => { active = false; };
  }, [showToast]);

  const dispatchSeoRefresh = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event("site-settings-updated"));
  };

  const setRule = <K extends keyof SeoRuleForm>(field: K, value: SeoRuleForm[K]) => {
    setRuleForm((current) => ({ ...current, [field]: value }));
  };

  const openCreateRule = (prefill?: Partial<SeoRuleForm>) => {
    setEditingRuleId(null);
    setRuleForm({ ...blankRule, ...prefill });
    setRuleModalOpen(true);
  };

  const openEditRule = (rule: SeoPageRule) => {
    setEditingRuleId(rule.id);
    setRuleForm(toRuleForm(rule));
    setRuleModalOpen(true);
  };

  const closeRuleModal = () => {
    if (ruleSaving) return;
    setRuleModalOpen(false);
    setEditingRuleId(null);
    setRuleForm(blankRule);
  };

  const submitRule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let structuredData: Record<string, unknown> | undefined;
    try {
      structuredData = parseStructuredData(ruleForm.structuredData);
    } catch (error) {
      showToast({ type: "error", title: "Invalid structured data", message: error instanceof Error ? error.message : "Enter valid JSON." });
      return;
    }

    const payload = {
      pageLabel: ruleForm.pageLabel.trim(),
      pagePath: ruleForm.pagePath.trim(),
      seoTitle: ruleForm.seoTitle.trim() || null,
      seoDescription: ruleForm.seoDescription.trim() || null,
      seoKeywords: ruleForm.seoKeywords.trim() || null,
      canonicalUrl: ruleForm.canonicalUrl.trim() || null,
      ogTitle: ruleForm.ogTitle.trim() || null,
      ogDescription: ruleForm.ogDescription.trim() || null,
      ogUrl: ruleForm.ogUrl.trim() || null,
      ogType: ruleForm.ogType,
      ogImageUrl: ruleForm.ogImageUrl.trim() || null,
      structuredData: structuredData || {},
      isActive: ruleForm.isActive,
    };

    setRuleSaving(true);
    try {
      const result = editingRuleId
        ? await adminApi.updateSeoPage(editingRuleId, payload)
        : await adminApi.createSeoPage(payload);
      setPageRules((current) => {
        const next = current.filter((rule) => rule.id !== result.data.page.id);
        return [result.data.page, ...next];
      });
      dispatchSeoRefresh();
      showToast({ type: "success", message: editingRuleId ? "SEO rule updated successfully." : "SEO rule created successfully." });
      closeRuleModal();
    } catch (error) {
      showToast({ type: "error", message: error instanceof Error ? error.message : "Unable to save SEO rule." });
    } finally {
      setRuleSaving(false);
    }
  };

  const confirmDeleteRule = async () => {
    if (!deleteTarget) return;
    setRuleSaving(true);
    try {
      await adminApi.deleteSeoPage(deleteTarget.id);
      setPageRules((current) => current.filter((rule) => rule.id !== deleteTarget.id));
      dispatchSeoRefresh();
      showToast({ type: "success", message: "SEO rule deleted successfully." });
      setDeleteTarget(null);
    } catch (error) {
      showToast({ type: "error", message: error instanceof Error ? error.message : "Unable to delete SEO rule." });
    } finally {
      setRuleSaving(false);
    }
  };

  const pageRulesByPath = useMemo(() => {
    const map = new Map<string, SeoPageRule>();
    pageRules.forEach((rule) => map.set(normalizeSeoPath(rule.pagePath), rule));
    return map;
  }, [pageRules]);

  const catalogPaths = useMemo(() => new Set(seoPageCatalog.map((entry) => normalizeSeoPath(entry.path))), []);

  const pageRows = useMemo<PageRow[]>(() => {
    const rows: PageRow[] = seoPageCatalog.filter((entry) => !seoManagementExcludedPaths.has(normalizeSeoPath(entry.path))).map((entry) => ({
      key: entry.path,
      label: entry.label,
      path: entry.path,
      group: entry.group,
      description: entry.description,
      includeInSitemap: entry.includeInSitemap,
      rule: pageRulesByPath.get(normalizeSeoPath(entry.path)) || null,
      source: "catalog",
    }));

    pageRules.forEach((rule) => {
      const normalized = normalizeSeoPath(rule.pagePath);
      if (seoManagementExcludedPaths.has(normalized)) return;
      if (catalogPaths.has(normalized)) return;
      rows.push({
        key: `custom-${rule.id}`,
        label: rule.pageLabel || rule.pagePath,
        path: rule.pagePath,
        group: "Custom",
        description: rule.seoDescription || "Custom SEO rule",
        includeInSitemap: true,
        rule,
        source: "custom",
      });
    });

    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      row.label.toLowerCase().includes(query)
      || row.path.toLowerCase().includes(query)
      || row.group.toLowerCase().includes(query)
      || row.description.toLowerCase().includes(query)
      || (row.rule?.seoTitle || "").toLowerCase().includes(query)
      || (row.rule?.seoKeywords || "").toLowerCase().includes(query),
    );
  }, [catalogPaths, pageRules, pageRulesByPath, search]);

  const activeRuleCount = pageRules.filter((rule) => rule.isActive).length;

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h1 className="admin-title">SEO management</h1>
          <p className="admin-subtitle">Manage SEO for public content and discovery pages. Click a Page for details or use its row actions.</p>
        </div>
        <div className="d-flex flex-column align-items-end gap-2">
          <button type="button" className="btn admin-btn-primary px-4" onClick={() => openCreateRule()}>
            <i className="bi bi-plus-lg me-2" />
            Add new page
          </button>
          <div className="text-end">
            <div className="admin-muted small">{pageRules.length} saved rules</div>
            <div className="admin-muted small">{activeRuleCount} active rules</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="admin-card admin-empty">
          <div className="spinner-border spinner-border-sm text-success" />
        </div>
      ) : (
        <section className="admin-card">
          <div className="admin-card-header flex-wrap gap-3">
            <div>
              <strong>All public pages</strong>
              <div className="admin-muted small">Account utility pages are excluded from this SEO workspace.</div>
            </div>
            <input
              className="form-control admin-form-control"
              style={{ minWidth: 280 }}
              placeholder="Search pages, paths, or groups"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Path</th>
                  <th>SEO title</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length ? pageRows.map((row) => {
                  const existingRule = row.rule;
                  const statusLabel = existingRule ? (existingRule.isActive ? "Active" : "Inactive") : "No rule";
                  const statusClass = existingRule
                    ? existingRule.isActive ? "admin-badge-success" : "admin-badge-danger"
                    : "admin-badge-muted";
                  return (
                    <tr key={row.key}>
                      <td>
                        <button
                          type="button"
                          className="admin-table-link admin-table-link-button border-0 bg-transparent p-0"
                          onClick={() => (existingRule ? openEditRule(existingRule) : openCreateRule({ pageLabel: row.label, pagePath: row.path }))}
                        >
                          <div className="fw-semibold">{row.label}</div>
                          <div className="admin-muted small">{row.group}</div>
                        </button>
                      </td>
                      <td className="text-break">
                        <code>{row.path}</code>
                        <div className="admin-muted small mt-1">{row.includeInSitemap ? "Included in sitemap" : "Not in sitemap"}</div>
                      </td>
                      <td className="text-break admin-muted">
                        {existingRule?.seoTitle || "Using page defaults"}
                      </td>
                      <td>
                        <span className={`admin-badge ${statusClass}`}>{statusLabel}</span>
                      </td>
                      <td className="admin-muted small">
                        {existingRule?.updatedAt ? new Date(existingRule.updatedAt).toLocaleString() : "—"}
                      </td>
                      <td className="text-end">
                        {existingRule ? <div className="d-inline-flex gap-1">
                          <button type="button" className="btn btn-sm admin-btn-ghost" onClick={() => openEditRule(existingRule)} title="Edit SEO rule">
                            <i className="bi bi-pencil" />
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(existingRule)} title="Delete SEO rule">
                            <i className="bi bi-trash" />
                          </button>
                        </div> : <button type="button" className="btn btn-sm admin-btn-ghost" onClick={() => openCreateRule({ pageLabel: row.label, pagePath: row.path })}>
                          <i className="bi bi-plus-lg me-1" />Add
                        </button>}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} className="admin-empty">
                      No matching pages found. Try a different search term.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <AdminModal wide open={ruleModalOpen} title={editingRuleId ? "Edit SEO rule" : "Add SEO rule"} onClose={closeRuleModal}>
        <form onSubmit={submitRule} className="d-grid gap-3">
          <div className="admin-muted small">
            Use exact routes like <code>/news?category=Cricket</code> or wildcard paths like <code>/news/*</code> for dynamic pages.
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="admin-form-label">PAGE LABEL</label>
              <input className="form-control admin-form-control" value={ruleForm.pageLabel} onChange={(event) => setRule("pageLabel", event.target.value)} placeholder="Cricket News" required />
            </div>
            <div className="col-md-6">
              <label className="admin-form-label">PAGE PATH</label>
              <input className="form-control admin-form-control" value={ruleForm.pagePath} onChange={(event) => setRule("pagePath", event.target.value)} placeholder="/news?category=Cricket" required />
            </div>
            <div className="col-12">
              <label className="admin-form-label">SEO TITLE</label>
              <input className="form-control admin-form-control" value={ruleForm.seoTitle} onChange={(event) => setRule("seoTitle", event.target.value)} placeholder="Cricket News | SportsVerge" />
            </div>
            <div className="col-12">
              <label className="admin-form-label">SEO DESCRIPTION</label>
              <textarea rows={3} className="form-control admin-form-control" value={ruleForm.seoDescription} onChange={(event) => setRule("seoDescription", event.target.value)} placeholder="Browse cricket news, stories, and analysis." />
            </div>
            <div className="col-md-6">
              <label className="admin-form-label">SEO KEYWORDS</label>
              <input className="form-control admin-form-control" value={ruleForm.seoKeywords} onChange={(event) => setRule("seoKeywords", event.target.value)} placeholder="cricket, sports news, match updates" />
            </div>
            <div className="col-md-6">
              <label className="admin-form-label">CANONICAL URL</label>
              <input className="form-control admin-form-control" value={ruleForm.canonicalUrl} onChange={(event) => setRule("canonicalUrl", event.target.value)} placeholder="https://example.com/news?category=Cricket" />
            </div>
            <div className="col-md-6">
              <label className="admin-form-label">OG TITLE</label>
              <input className="form-control admin-form-control" value={ruleForm.ogTitle} onChange={(event) => setRule("ogTitle", event.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="admin-form-label">OG TYPE</label>
              <AdminSelect options={ogTypeOptions} value={ruleForm.ogType} onChange={(value) => setRule("ogType", value as SeoRuleForm["ogType"])} ariaLabel="Open Graph type" />
            </div>
            <div className="col-12">
              <label className="admin-form-label">OG DESCRIPTION</label>
              <textarea rows={3} className="form-control admin-form-control" value={ruleForm.ogDescription} onChange={(event) => setRule("ogDescription", event.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="admin-form-label">OG URL</label>
              <input className="form-control admin-form-control" value={ruleForm.ogUrl} onChange={(event) => setRule("ogUrl", event.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="admin-form-label">OG IMAGE URL</label>
              <input className="form-control admin-form-control" value={ruleForm.ogImageUrl} onChange={(event) => setRule("ogImageUrl", event.target.value)} placeholder="https://..." />
            </div>
            <div className="col-12">
              <label className="admin-form-label">JSON-LD STRUCTURED DATA</label>
              <textarea
                rows={8}
                className="form-control admin-form-control font-monospace"
                value={ruleForm.structuredData}
                onChange={(event) => setRule("structuredData", event.target.value)}
                placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "WebPage"\n}'}
              />
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <label className="form-check text-light mb-0">
              <input className="form-check-input me-2" type="checkbox" checked={ruleForm.isActive} onChange={(event) => setRule("isActive", event.target.checked)} />
              Active
            </label>
            <div className="d-flex gap-2">
              <button type="button" className="btn admin-btn-ghost" onClick={closeRuleModal} disabled={ruleSaving}>Cancel</button>
              <button type="submit" className="btn admin-btn-primary" disabled={ruleSaving}>
                {ruleSaving ? "Saving..." : editingRuleId ? "Update rule" : "Create rule"}
              </button>
            </div>
          </div>
        </form>
      </AdminModal>

      <AdminModal compact open={Boolean(deleteTarget)} title="Delete SEO rule" onClose={() => (!ruleSaving ? setDeleteTarget(null) : undefined)}>
        <div className="admin-action-confirm">
          <div className="admin-action-icon admin-action-icon-danger">
            <i className="bi bi-trash3" />
          </div>
          <h3>Delete this SEO rule?</h3>
          <p><strong>{deleteTarget?.pageLabel}</strong> for <code>{deleteTarget?.pagePath}</code> will be removed.</p>
          <div className="admin-action-buttons">
            <button type="button" className="btn admin-btn-ghost" onClick={() => setDeleteTarget(null)} disabled={ruleSaving}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={confirmDeleteRule} disabled={ruleSaving}>
              {ruleSaving ? "Deleting..." : "Delete rule"}
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
