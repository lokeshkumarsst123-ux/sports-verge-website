"use client";

import type { ReactNode } from "react";
import AdminModal from "@/components/admin/AdminModal";

type AdminActionModalProps = {
  open: boolean;
  title: string;
  heading: string;
  description: ReactNode;
  icon: string;
  confirmLabel: string;
  loadingLabel: string;
  loading?: boolean;
  danger?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function AdminActionModal({ open, title, heading, description, icon, confirmLabel, loadingLabel, loading = false, danger = false, onClose, onConfirm }: AdminActionModalProps) {
  return <AdminModal compact open={open} title={title} onClose={onClose}><div className="admin-action-confirm"><div className={`admin-action-icon ${danger ? "admin-action-icon-danger" : ""}`}><i className={`bi ${icon}`} /></div><h3>{heading}</h3><p>{description}</p><div className="admin-action-buttons"><button type="button" className="btn admin-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button><button type="button" className={`btn ${danger ? "btn-danger" : "admin-btn-primary"}`} onClick={onConfirm} disabled={loading}>{loading ? loadingLabel : confirmLabel}</button></div></div></AdminModal>;
}
