"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, type ApiIntegration } from "@/lib/admin-api";
import { useAdminToast } from "@/components/admin/AdminToast";
import AdminSelect from "@/components/admin/AdminSelect";

const integrationStatusOptions = [{ value: "unknown", label: "Unknown" }, { value: "healthy", label: "Healthy" }, { value: "degraded", label: "Degraded" }, { value: "down", label: "Down" }];

export default function AdminIntegrationsPage() {
  const [items, setItems] = useState<ApiIntegration[]>([]); const [loading, setLoading] = useState(true);
  const { showToast } = useAdminToast();
  const load = useCallback(() => { setLoading(true); adminApi.integrations().then((result) => setItems(result.data.integrations)).catch((err) => showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to load integrations." })).finally(() => setLoading(false)); }, [showToast]);
  useEffect(() => { const timer = window.setTimeout(() => load(), 0); return () => window.clearTimeout(timer); }, [load]);
  const save = async (item: ApiIntegration, field: string, value: unknown) => { try { await adminApi.updateIntegration(item.id, { [field]: value }); showToast({ type: "success", message: `${item.name} updated successfully.` }); load(); } catch (err) { showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to update integration." }); } };
  return <div><div className="mb-4"><h1 className="admin-title">API integrations</h1><p className="admin-subtitle">Configure approved third-party sports data providers and monitor their health.</p></div><section className="admin-card"><div className="admin-card-header"><strong>Sports data providers</strong><span className="admin-muted small">Scores, fixtures, standings, and statistics remain API-sourced.</span></div><div className="table-responsive"><table className="table admin-table"><thead><tr><th>Integration</th><th>Sport</th><th>Provider URL</th><th>Status</th><th>Enabled</th><th>Last sync</th></tr></thead><tbody>{loading ? <tr><td colSpan={6} className="admin-empty"><div className="spinner-border spinner-border-sm text-success" /></td></tr> : items.map((item) => <tr key={item.id}><td><div className="fw-semibold">{item.name}</div><div className="admin-muted" style={{ fontSize: 11 }}>{item.provider}</div></td><td><span className="admin-badge admin-badge-muted">{item.sport}</span></td><td><input className="form-control form-control-sm admin-form-control" value={item.baseUrl || ""} placeholder="https://provider.example/api" onChange={(e) => setItems(items.map((current) => current.id === item.id ? { ...current, baseUrl: e.target.value } : current))} onBlur={(e) => save(item, "baseUrl", e.target.value)} /></td><td><AdminSelect options={integrationStatusOptions} value={item.status} onChange={(value) => save(item, "status", value)} ariaLabel={`Status for ${item.name}`} size="small" /></td><td><div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={item.isEnabled} onChange={(e) => save(item, "isEnabled", e.target.checked)} /></div></td><td className="admin-muted">{item.lastSyncAt ? new Date(item.lastSyncAt).toLocaleString() : "Not synchronized"}</td></tr>)}</tbody></table></div></section></div>;
}
