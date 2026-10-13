"use client";

import { createContext, type CSSProperties, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

export type AdminToastType = "success" | "error" | "warning" | "info";
export type AdminToastInput = { type: AdminToastType; message: string; title?: string; duration?: number };
type AdminToast = AdminToastInput & { id: string; duration: number };
type AdminToastContextValue = { showToast: (toast: AdminToastInput) => void; dismissToast: (id: string) => void };

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

const defaultTitles: Record<AdminToastType, string> = { success: "Success", error: "Something went wrong", warning: "Please check", info: "Admin update" };
const icons: Record<AdminToastType, string> = { success: "bi-check-lg", error: "bi-exclamation-lg", warning: "bi-exclamation-triangle", info: "bi-info-lg" };

export function useAdminToast() {
  const context = useContext(AdminToastContext);
  if (!context) throw new Error("useAdminToast must be used inside AdminToastProvider.");
  return context;
}

export default function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const timers = useRef(new Map<string, number>());

  const dismissToast = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((input: AdminToastInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const duration = input.duration ?? 4500;
    setToasts((current) => [...current, { ...input, id, duration }].slice(-4));
    const timer = window.setTimeout(() => dismissToast(id), duration);
    timers.current.set(id, timer);
  }, [dismissToast]);

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
  }, []);

  return <AdminToastContext.Provider value={{ showToast, dismissToast }}>
    {children}
    <div className="admin-toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => <div key={toast.id} className={`admin-toast admin-toast-${toast.type}`} role={toast.type === "error" ? "alert" : "status"} style={{ "--admin-toast-duration": `${toast.duration}ms` } as CSSProperties}>
        <div className="admin-toast-icon"><i className={`bi ${icons[toast.type]}`} /></div>
        <div className="admin-toast-copy"><strong>{toast.title || defaultTitles[toast.type]}</strong><span>{toast.message}</span></div>
        <button type="button" className="admin-toast-close" aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)}><i className="bi bi-x-lg" /></button>
        <span className="admin-toast-progress" />
      </div>)}
    </div>
  </AdminToastContext.Provider>;
}
