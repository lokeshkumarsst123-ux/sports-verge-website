"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NavigationMenu from "./NavigationMenu";
import { logoutUser } from "@/lib/auth-api";
import { useSiteSettings } from "@/components/SiteSettingsContext";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const siteSettings = useSiteSettings();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsProfileDropdownOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    }
    const session = sessionStorage.getItem("user_session");
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        // Handle invalid JSON
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isSearchOpen &&
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        isProfileDropdownOpen &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSearchOpen, isProfileDropdownOpen]);

  if (["/login", "/register", "/forgot-password"].includes(pathname) || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="site-header sticky-top">
      <nav className="navbar navbar-expand-xl navbar-dark">
        <div className="container custom-container">
          {/* Logo */}

          <Link href="/" className="navbar-brand me-auto">
            {siteSettings.logoUrl ? <img src={siteSettings.logoUrl} alt={siteSettings.websiteName} width={180} height={45} className="brand-logo" /> : <Image
              src="/assets/imgs/logo-white.svg"
              alt={siteSettings.websiteName}
              width={180}
              height={45}
              className="brand-logo"
              priority
            />}
          </Link>

          {/* Right Controls */}

          <div className="nav-controls d-flex align-items-center me-3 me-xl-0 order-xl-last">
            <div className="search-wrapper d-inline-block" ref={searchWrapperRef}>
              <Link
                href="#"
                className="control-icon text-white"
                id="searchToggle"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSearchOpen(!isSearchOpen);
                }}
              >
                <span className="visually-hidden">Toggle search</span>
                <i className={`bi ${isSearchOpen ? "bi-x-lg" : "bi-search"}`}></i>
              </Link>

              <div
                className={`search-dropdown ${isSearchOpen ? "d-block" : "d-none"}`}
                id="searchBox"
              >
                <form onSubmit={handleSearchSubmit} className="d-flex">
                  <input
                    ref={searchInputRef}
                    className="form-control search-input"
                    type="text"
                    placeholder="Search news, teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <button className="btn btn-search" type="submit">
                    <span className="visually-hidden">Submit search</span>
                    <i className="bi bi-search"></i>
                  </button>
                </form>
              </div>
            </div>

            {/* Notifications temporarily disabled. Restore this block when notification access is needed. */}

            <div className="d-none d-xl-flex align-items-center position-relative" ref={profileDropdownRef}>
              <Link
                href="/join-tipster"
                className="d-inline-flex align-items-center gap-2 text-nowrap fw-semibold text-decoration-none transition-all ms-3"
                style={{
                  fontSize: "13.5px",
                  padding: "7px 16px",
                  borderRadius: "6px",
                  color: "#ffffff",
                  background: "rgba(34, 197, 94, 0.14)",
                  border: "1px solid rgba(34, 197, 94, 0.45)",
                  lineHeight: "1.4",
                }}
              >
                <i className="bi bi-stars text-success" style={{ fontSize: "13px" }}></i>
                <span>Join as a Tipster</span>
              </Link>
              {user ? (
                <>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="d-flex align-items-center text-decoration-none ms-4 bg-transparent border-0 p-0 text-start"
                    style={{ outline: "none" }}
                  >
                    <div className="d-flex flex-column text-end me-3" style={{ maxWidth: "150px" }}>
                      <span className="text-white fw-semibold small lh-1-2 hover-text-success transition-all text-truncate d-block">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-success fs-11 text-truncate d-block">{user.email}</span>
                    </div>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm header-user-avatar hover-glow"
                    >
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                  </button>
                  {isProfileDropdownOpen && (
                    <div
                      className="position-absolute end-0 mt-2 rounded-3 p-2 shadow-lg dropdown-menu-premium"
                      style={{
                        top: "100%",
                        width: "180px",
                        background: "rgba(18, 18, 18, 0.95)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid var(--border-dark)",
                        zIndex: 1000
                      }}
                    >
                      <Link
                        href="/profile"
                        className="dropdown-item-premium d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded mb-1 fs-14"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <i className="bi bi-person-fill text-success"></i>
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/tipster/dashboard"
                        className="dropdown-item-premium d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded mb-1 fs-14"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <i className="bi bi-speedometer2 text-success"></i>
                        <span>Tipster Studio</span>
                      </Link>
                      <Link
                        href="/my-purchased-tips"
                        className="dropdown-item-premium d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded mb-1 fs-14"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <i className="bi bi-unlock-fill text-success"></i>
                        <span>My Purchased Tips</span>
                      </Link>
                      <button
                        onClick={async () => {
                          setIsProfileDropdownOpen(false);
                          await logoutUser();
                          window.location.href = "/";
                        }}
                        className="dropdown-item-premium w-100 border-0 bg-transparent d-flex align-items-center gap-2 px-3 py-2 text-start text-danger rounded fs-14"
                      >
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/login" className="btn btn-signup ms-4">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}

          <button
            className="navbar-toggler border-0 px-1"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls="mainNav"
            aria-expanded={isMenuOpen}
          >
            <span className="visually-hidden">Toggle navigation</span>
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}

          <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="mainNav">
            {/* Mobile-only Top Profile Section */}
            <div className="d-xl-none mb-3 pb-3 border-bottom border-secondary border-opacity-10 pt-2">
              {user ? (
                <div className="d-flex flex-column gap-3 p-3 bg-dark rounded-3 border border-secondary border-opacity-25">
                  {/* User info row */}
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white me-3 shadow-sm header-user-avatar-mobile"
                    >
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div className="d-flex flex-column min-w-0" style={{ maxWidth: "180px" }}>
                      <span className="text-white fw-bold fs-15 text-truncate d-block">{user.firstName} {user.lastName}</span>
                      <span className="text-success small fs-12 text-truncate d-block">{user.email}</span>
                    </div>
                  </div>
                  {/* Action buttons row */}
                  <div className="row g-2">
                    <div className="col-6">
                      <Link href="/profile" className="btn gap-1 btn-sm btn-outline-success w-100 py-2 rounded-pill font-space-grotesk fw-bold fs-12 d-flex align-items-center justify-content-center gap-1.5">
                        <i className="bi bi-person-fill"></i>
                        <span>Profile</span>
                      </Link>
                    </div>
                    <div className="col-6">
                      <button
                        onClick={async () => {
                          await logoutUser();
                          window.location.href = "/";
                        }}
                        className="btn btn-sm btn-outline-danger gap-1 w-100 py-2 rounded-pill font-space-grotesk fw-bold fs-12 d-flex align-items-center justify-content-center gap-1.5"
                      >
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="btn btn-signup w-100 py-2">
                  Login
                </Link>
              )}
              <div className="mt-2">
                <Link
                  href="/join-tipster"
                  className="w-100 d-flex align-items-center justify-content-center gap-2 text-decoration-none fw-semibold rounded-2 py-2"
                  style={{
                    fontSize: "13.5px",
                    color: "#ffffff",
                    background: "rgba(34, 197, 94, 0.14)",
                    border: "1px solid rgba(34, 197, 94, 0.45)",
                  }}
                >
                  <i className="bi bi-stars text-success" style={{ fontSize: "13px" }}></i>
                  <span>Join as a Tipster</span>
                </Link>
              </div>
            </div>

            <NavigationMenu />
          </div>
        </div>
      </nav>
    </header>
  );
}
