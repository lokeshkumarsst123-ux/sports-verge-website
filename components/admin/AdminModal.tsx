"use client";

import { useEffect } from "react";

type AdminModalProps = { open: boolean; title: string; wide?: boolean; compact?: boolean; onClose: () => void; children: React.ReactNode };

export default function AdminModal({ open, title, wide = false, compact = false, onClose, children }: AdminModalProps) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleKeyDown); };
  }, [open, onClose]);

  if (!open) return null;
  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className={`admin-modal ${wide ? "admin-modal-wide" : ""} ${compact ? "admin-modal-compact" : ""}`} role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" onMouseDown={(event) => event.stopPropagation()}><div className="admin-modal-header"><div><span className="admin-modal-eyebrow">SPORTS VERG ADMIN</span><h2 id="admin-modal-title">{title}</h2></div><button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close form"><i className="bi bi-x-lg" /></button></div><div className="admin-modal-body">{children}</div></section></div>;
}
