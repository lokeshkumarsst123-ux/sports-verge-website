"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, type ContactInquiry } from "@/lib/admin-api";
import { useAdminToast } from "@/components/admin/AdminToast";
import AdminSelect from "@/components/admin/AdminSelect";

const inquiryStatusOptions = [{ value: "all", label: "All messages" }, { value: "new", label: "New" }, { value: "in_progress", label: "In progress" }, { value: "resolved", label: "Resolved" }, { value: "archived", label: "Archived" }];

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<ContactInquiry[]>([]); const [status, setStatus] = useState("all"); const [loading, setLoading] = useState(true);
  const { showToast } = useAdminToast();
  const load = useCallback(() => { setLoading(true); adminApi.inquiries(status).then((result) => setItems(result.data.inquiries)).catch((err) => showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to load inquiries." })).finally(() => setLoading(false)); }, [showToast, status]);
  useEffect(() => { const timer = window.setTimeout(() => load(), 0); return () => window.clearTimeout(timer); }, [load]);
  const update = async (id: string, next: string) => { try { await adminApi.updateInquiryStatus(id, next); showToast({ type: "success", message: "Inquiry status updated successfully." }); load(); } catch (err) { showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to update inquiry." }); } };
  return <div><div className="mb-4"><h1 className="admin-title">Contact inbox</h1><p className="admin-subtitle">Review and resolve messages submitted through Contact Us.</p></div><section className="admin-card"><div className="admin-card-header"><div className="d-flex gap-2"><AdminSelect options={inquiryStatusOptions} value={status} onChange={setStatus} ariaLabel="Filter inquiries" /></div><span className="admin-muted small">{items.length} messages</span></div><div className="table-responsive"><table className="table admin-table"><thead><tr><th>Sr. No.</th><th>Sender</th><th>Subject</th><th>Message</th><th>Received</th><th>Status</th></tr></thead><tbody>{loading ? <tr><td colSpan={6} className="admin-empty"><div className="spinner-border spinner-border-sm text-success" /></td></tr> : items.length ? items.map((item, index) => <tr key={item.id}><td className="admin-muted">{index + 1}</td><td><div className="fw-semibold">{item.fullName}</div><div className="admin-muted" style={{ fontSize: 11 }}>{item.email}</div></td><td>{item.subject}</td><td className="admin-muted" style={{ maxWidth: 360 }}>{item.message}</td><td className="admin-muted">{new Date(item.createdAt).toLocaleDateString()}</td><td><AdminSelect options={inquiryStatusOptions.slice(1)} value={item.status} onChange={(value) => update(item.id, value)} ariaLabel={`Update status for ${item.subject}`} size="small" /></td></tr>) : <tr><td colSpan={6} className="admin-empty">No inquiries found.</td></tr>}</tbody></table></div></section></div>;
}
