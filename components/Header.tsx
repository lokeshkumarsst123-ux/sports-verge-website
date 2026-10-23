"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NavigationMenu from "./NavigationMenu";
import { getStoredUser, hasAuthSession, logoutUser } from "@/lib/auth-api";
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
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      setIsMenuOpen(false);
      setIsSearchOpen(false);
      setIsProfileDropdownOpen(false);
      setUser(hasAuthSession() ? getStoredUser() : null);
    });
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    }
    return () => { active = false; };
  }, [pathname]);

  useEffect(() => {
    const syncSession = () => setUser(hasAuthSession() ? getStoredUser() : null);
    window.addEventListener("auth-session-changed", syncSession);
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener("auth-session-changed", syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

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
      <nav className="navbar navbar-expand-xl">
        <div className="container custom-container">
          {/* Logo */}

          <Link href="/" className="navbar-brand me-2 me-xxl-3 flex-shrink-0">
            {siteSettings.logoUrl ? <img src={siteSettings.logoUrl} alt={siteSettings.websiteName} width={160} height={40} className="brand-logo" /> : <Image
              src="/assets/imgs/logo.svg"
              alt={siteSettings.websiteName}
              width={160}
              height={40}
              className="brand-logo"
              priority
              loading="eager"
            />}
          </Link>

          {/* Right Controls */}

          <div className="nav-controls d-flex align-items-center ms-auto ms-xl-0 me-1 me-xl-0 order-xl-last flex-shrink-0">
            <div className="search-wrapper d-inline-block" ref={searchWrapperRef}>
              <Link
                href="#"
                className="control-icon"
                style={{ color: "#1C1F22" }}
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

            {/* Mobile-only avatar / login button in header */}
            <div className="d-flex d-xl-none align-items-center ms-2 flex-shrink-0">
              {user ? (
                <Link
                  href="/profile"
                  className="rounded-circle d-flex align-items-center justify-content-center text-white text-decoration-none shadow-sm"
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "#16A34A",
                    fontSize: "12px",
                    fontWeight: "bold",
                    border: "2px solid #FFFFFF",
                  }}
                  title={`${user.firstName} ${user.lastName}`}
                >
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="btn btn-sm text-decoration-none fw-bold px-2.5 py-1 rounded-pill"
                  style={{
                    fontSize: "12px",
                    background: "#FFCC00",
                    color: "#1C1F22",
                    border: "1px solid #FFCC00",
                  }}
                >
                  Login
                </Link>
              )}
            </div>

            <div className="d-none d-xl-flex align-items-center position-relative flex-shrink-0" ref={profileDropdownRef}>
              <Link
                href="/tipster-register"
                className="d-inline-flex align-items-center gap-1 text-nowrap fw-bold text-decoration-none transition-all ms-2 ms-xxl-3"
                style={{
                  fontSize: "12.5px",
                  padding: "6px 13px",
                  borderRadius: "6px",
                  color: "#1C1F22",
                  background: "#FFCC00",
                  border: "1px solid #FFCC00",
                  lineHeight: "1.4",
                  whiteSpace: "nowrap"
                }}
              >
                <i className="bi bi-stars" style={{ fontSize: "12px", color: "#1C1F22" }}></i>
                <span>Join as a Tipster</span>
              </Link>
              {user ? (
                <>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="d-flex align-items-center text-decoration-none ms-2 ms-xxl-3 bg-transparent border-0 p-0 text-start flex-shrink-0"
                    style={{ outline: "none" }}
                  >
                    <div className="d-flex flex-column text-end me-2" style={{ maxWidth: "125px" }}>
                      <span className="fw-semibold small lh-1-2 transition-all text-truncate d-block" style={{ color: "#1C1F22", fontSize: "13px" }}>
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="fs-11 text-truncate d-block" style={{ color: "#76808D", fontSize: "11px" }}>{user.email}</span>
                    </div>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm header-user-avatar hover-glow"
                      style={{ width: "36px", height: "36px", fontSize: "13px" }}
                    >
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                  </button>
                  {isProfileDropdownOpen && (
                    <div
                      className="position-absolute end-0 mt-2 shadow-lg dropdown-menu-premium d-flex flex-column gap-1"
                      style={{
                        top: "100%",
                        minWidth: "220px",
                        background: "#FFFFFF",
                        border: "1px solid #EAE5DC",
                        boxShadow: "0 10px 30px rgba(28, 31, 34, 0.12)",
                        borderRadius: "12px",
                        padding: "8px",
                        zIndex: 1050
                      }}
                    >
                      <div className="px-3 py-2 mb-1 border-bottom" style={{ borderColor: "#EAE5DC" }}>
                        <div className="fw-bold text-truncate" style={{ color: "#1C1F22", fontSize: "13px" }}>
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-truncate small" style={{ color: "#76808D", fontSize: "11px" }}>
                          {user.email}
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        className="dropdown-item-premium w-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <i className="bi bi-person-circle"></i>
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/tipster/dashboard"
                        className="dropdown-item-premium w-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <i className="bi bi-speedometer2" ></i>
                        <span>Tipster Studio</span>
                      </Link>
                      <Link
                        href="/my-purchased-tips"
                        className="dropdown-item-premium w-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <i className="bi bi-unlock-fill" ></i>
                        <span>My Purchased Tips</span>
                      </Link>
                      <div className="my-1 border-top" style={{ borderColor: "#EAE5DC" }}></div>
                      <button
                        onClick={async () => {
                          setIsProfileDropdownOpen(false);
                          await logoutUser();
                          window.location.href = "/";
                        }}
                        className="dropdown-item-premium text-danger w-100 border-0 bg-transparent text-start"
                      >
                        <i className="bi bi-box-arrow-right" style={{ color: "#DC2626", fontSize: "16px" }}></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/login" className="btn btn-signup ms-3">
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
                <div className="d-flex flex-column gap-3 p-3 bg-white rounded-3 border border-dark">
                  {/* User info row */}
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white me-3 shadow-sm header-user-avatar-mobile"
                    >
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div className="d-flex flex-column min-w-0" style={{ maxWidth: "180px" }}>
                      <span className="fw-bold fs-15 text-truncate d-block" style={{ color: "#1C1F22" }}>{user.firstName} {user.lastName}</span>
                      <span className="small fs-12 text-truncate d-block" style={{ color: "#4A90E2" }}>{user.email}</span>
                    </div>
                  </div>
                  {/* Action buttons row */}
                  <div className="row g-2">
                    <div className="col-6">
                      <Link href="/profile" className="btn btn-sm btn-outline-success w-100 py-2 rounded-pill font-space-grotesk fw-bold fs-12 d-flex align-items-center justify-content-center gap-1">
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
                        className="btn btn-sm btn-outline-danger w-100 py-2 rounded-pill font-space-grotesk fw-bold fs-12 d-flex align-items-center justify-content-center gap-1"
                      >
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2 w-100">
                  <Link
                    href="/tipster-register"
                    className="btn w-100 py-2 d-flex align-items-center justify-content-center gap-2 font-space-grotesk fw-bold"
                    style={{
                      borderRadius: "8px",
                      fontSize: "14px",
                      border: "1px solid #EAE5DC",
                      background: "#FFFFFF",
                      color: "#1C1F22",
                    }}
                  >
                    <i className="bi bi-stars text-warning" aria-hidden="true"></i>
                    <span>Join as a Tipster</span>
                  </Link>
                  <Link
                    href="/login"
                    className="btn btn-success w-100 py-2 d-flex align-items-center justify-content-center font-space-grotesk fw-bold"
                    style={{ borderRadius: "8px", fontSize: "14px" }}
                  >
                    Login
                  </Link>
                </div>
              )}
              {user && <div className="mt-2">
                <Link
                  href="/tipster-register"
                  className="w-100 d-flex align-items-center justify-content-center gap-2 text-decoration-none fw-bold rounded-2 py-2"
                  style={{
                    fontSize: "13.5px",
                    color: "#1C1F22",
                    background: "#FFCC00",
                    border: "1px solid #FFCC00",
                  }}
                >
                  <i className="bi bi-stars" style={{ fontSize: "13px", color: "#1C1F22" }}></i>
                  <span>Join as a Tipster</span>
                </Link>
              </div>}
            </div>

            <NavigationMenu />
          </div>
        </div>
      </nav>
    </header>
  );
}
