"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NavigationMenu from "./NavigationMenu";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSearchOpen]);

  if (["/login", "/register", "/forgot-password"].includes(pathname)) {
    return null;
  }

  return (
    <header className="site-header sticky-top">
      <nav className="navbar navbar-expand-xl navbar-dark">
        <div className="container custom-container">
          {/* Logo */}

          <Link href="/" className="navbar-brand me-auto">
            <Image
              src="/assets/imgs/logo-white.svg"
              alt="SportsVerge"
              width={180}
              height={45}
              className="brand-logo"
              priority
            />
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

            <Link
              href="/notifications"
              className="control-icon text-white position-relative ms-3 ms-xl-4"
            >
              <span className="visually-hidden">Notifications</span>
              <i className="bi bi-bell"></i>

              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success notification-badge">
                3
              </span>
            </Link>

            <div className="d-none d-xl-flex align-items-center">
              {user ? (
                <Link href="/profile" className="d-flex align-items-center text-decoration-none ms-4">
                  <div className="d-flex flex-column text-end me-3">
                    <span className="text-white fw-semibold small lh-1-2">{user.firstName} {user.lastName}</span>
                    <span className="text-success fs-11">{user.email}</span>
                  </div>
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm header-user-avatar"
                  >
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                </Link>
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
            <NavigationMenu />

            <div className="d-xl-none d-flex flex-column mt-3 pb-3 border-top border-secondary pt-3">
              {user ? (
                <Link href="/profile" className="d-flex align-items-center text-decoration-none px-3 py-3 bg-dark rounded-3 border border-secondary border-opacity-25">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center text-white me-3 shadow-sm header-user-avatar-mobile"
                  >
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                  <div className="d-flex flex-column">
                    <span className="text-white fw-bold">{user.firstName} {user.lastName}</span>
                    <span className="text-success small">{user.email}</span>
                  </div>
                </Link>
              ) : (
                <Link href="/login" className="btn btn-signup w-100">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}