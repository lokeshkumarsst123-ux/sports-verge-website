"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import { useAdminToast } from "@/components/admin/AdminToast";
import { adminApi, getAdminSession, type AdminUser, type GeneralSettings } from "@/lib/admin-api";

const navGroups = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: "bi-grid-1x2-fill" }] },
  { label: "Operations", items: [
    { href: "/admin/users", label: "Users", icon: "bi-people-fill" },
    { href: "/admin/news", label: "News", icon: "bi-newspaper" },
    { href: "/admin/categories", label: "Categories", icon: "bi-collection-fill" },
    { href: "/admin/advertisements", label: "Advertisements", icon: "bi-megaphone-fill" },
    { href: "/admin/inquiries", label: "Contact Inbox", icon: "bi-inbox-fill" },
  ] },
    { label: "Platform", items: [
    { href: "/admin/settings", label: "General Settings", icon: "bi-gear-fill" },
    { href: "/admin/seo-settings", label: "SEO Management", icon: "bi-sliders2" },
    { href: "/admin/legal-pages", label: "CMS", icon: "bi-file-earmark-lock2" },
  ] },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [siteSettings, setSiteSettings] = useState<GeneralSettings | null>(null);
  const [checking, setChecking] = useState(!isLoginPage);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { showToast } = useAdminToast();

  useEffect(() => {
    // Authenticate when entering the admin area, but do not repeat the same
    // session check for every child route navigation.
    if (isLoginPage) return;
    const session = getAdminSession();
    if (!session?.accessToken) { router.replace("/admin/login"); return; }
    const loadSettings = () => adminApi.settings().then((result) => setSiteSettings(result.data.settings)).catch(() => undefined);
    adminApi.me().then((result) => { setUser(result.data.user); setChecking(false); void loadSettings(); }).catch(() => {
      showToast({ type: "error", title: "Session expired", message: "Please sign in again to continue." });
      sessionStorage.removeItem("admin_session");
      router.replace("/admin/login");
    });
    const applyUpdatedSettings = (event: Event) => {
      const customEvent = event as CustomEvent<GeneralSettings>;
      if (customEvent.detail) setSiteSettings(customEvent.detail);
    };
    window.addEventListener("site-settings-updated", applyUpdatedSettings);
    return () => window.removeEventListener("site-settings-updated", applyUpdatedSettings);
  }, [isLoginPage, router, showToast]);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const scrollY = window.scrollY;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyStyles.overflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.width = previousBodyStyles.width;
      window.scrollTo(0, scrollY);
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!accountMenuOpen) return undefined;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) setAccountMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setAccountMenuOpen(false); };
    document.addEventListener("mousedown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountMenuOpen]);

  if (isLoginPage) return <>{children}</>;
  if (checking || !user) return <div className="admin-page d-flex align-items-center justify-content-center"><div className="spinner-border text-success" /></div>;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "PA";

  const confirmLogout = async () => {
    setLoggingOut(true);
    try { await adminApi.logout(); } finally {
      setLoggingOut(false);
      setLogoutConfirmOpen(false);
      showToast({ type: "success", message: "You have been logged out securely." });
      sessionStorage.removeItem("admin_session");
      router.replace("/admin/login");
    }
  };

  return (
    <div className={`admin-page ${mobileNavOpen ? "admin-mobile-nav-open" : ""}`}>
      <div className="admin-shell">
        <aside id="admin-navigation" className={`admin-sidebar ${mobileNavOpen ? "is-open" : ""}`}>
          <div className="admin-sidebar-head"><Link href="/admin" className="admin-brand" aria-label={`${siteSettings?.websiteName || "Sports Verg"} admin dashboard`} onClick={() => setMobileNavOpen(false)}>{siteSettings?.logoUrl ? <img src={siteSettings.logoUrl} alt={siteSettings.websiteName} className="admin-brand-logo" /> : <Image src="/assets/imgs/logo-white.svg" alt={siteSettings?.websiteName || "Sports Verg"} width={725} height={170} className="admin-brand-logo" priority />}</Link><button type="button" className="admin-mobile-sidebar-close" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}><i className="bi bi-x-lg" /></button></div>
          <nav>
            {navGroups.map((group) => (
              <div key={group.label}>
                <div className="admin-nav-label">{group.label}</div>
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href} className={`admin-nav-link ${pathname === item.href ? "active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                    <i className={`bi ${item.icon}`} /><span>{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </aside>
        {mobileNavOpen && <button type="button" className="admin-mobile-nav-backdrop" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
        <div className="admin-main">
          <header className="admin-topbar">
            <button type="button" className="admin-mobile-menu-toggle" aria-label="Open navigation" aria-controls="admin-navigation" aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen((current) => !current)}><i className={`bi ${mobileNavOpen ? "bi-x-lg" : "bi-list"}`} /></button>
            <div className="admin-account-wrap" ref={accountMenuRef}>
              <button type="button" className="admin-avatar-trigger" aria-label="Open account menu" aria-haspopup="menu" aria-expanded={accountMenuOpen} onClick={() => setAccountMenuOpen((current) => !current)}>
                <span className="admin-avatar">{initials}</span>
              </button>
              {accountMenuOpen && (
                <div className="admin-account-menu" role="menu">
                  <div className="admin-account-menu-heading"><span className="admin-account-menu-label">ACCOUNT</span><strong>{user.firstName} {user.lastName}</strong><small>{user.email}</small></div>
                  <Link href="/admin/profile" className="admin-account-menu-item" role="menuitem" onClick={() => setAccountMenuOpen(false)}><i className="bi bi-person-circle" /><span>Profile</span></Link>
                  <Link href="/admin/update-password" className="admin-account-menu-item" role="menuitem" onClick={() => setAccountMenuOpen(false)}><i className="bi bi-shield-lock" /><span>Update password</span></Link>
                  <div className="admin-account-menu-divider" />
                  <button type="button" className="admin-account-menu-item admin-account-menu-danger" role="menuitem" onClick={() => { setAccountMenuOpen(false); setLogoutConfirmOpen(true); }}><i className="bi bi-box-arrow-right" /><span>Logout</span></button>
                </div>
              )}
            </div>
          </header>
          <main className="admin-content">{children}</main>
        </div>
      </div>

      <AdminModal compact open={logoutConfirmOpen} title="Confirm logout" onClose={() => setLogoutConfirmOpen(false)}>
        <div className="admin-confirm-content"><p className="mb-4">Do you want to logout?</p><div className="d-flex justify-content-end gap-2"><button type="button" className="btn admin-btn-ghost" onClick={() => setLogoutConfirmOpen(false)} disabled={loggingOut}>Cancel</button><button type="button" className="btn btn-danger" onClick={confirmLogout} disabled={loggingOut}>{loggingOut ? "Logging out..." : "Yes, logout"}</button></div></div>
      </AdminModal>
    </div>
  );
}
