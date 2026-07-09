"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import NavigationMenu from "./NavigationMenu";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

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
                <i className={`bi ${isSearchOpen ? "bi-x-lg" : "bi-search"}`}></i>
              </Link>

              <div
                className="search-dropdown"
                id="searchBox"
                style={{ display: isSearchOpen ? "block" : "none" }}
              >
                <form className="d-flex">
                  <input
                    ref={searchInputRef}
                    className="form-control search-input"
                    type="text"
                    placeholder="Search news, teams..."
                  />

                  <button className="btn btn-search" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </form>
              </div>
            </div>

            <Link
              href="#"
              className="control-icon text-white position-relative ms-3 ms-xl-4"
              onClick={(e) => e.preventDefault()}
            >
              <i className="bi bi-bell"></i>

              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success notification-badge">
                3
              </span>
            </Link>

            <div className="d-none d-xl-flex align-items-center">
              <Link href="/" className="btn btn-signup ms-4">
                Login
              </Link>
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
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}

          <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="mainNav">
            <NavigationMenu />

            <div className="d-xl-none d-flex flex-column mt-3 pb-3 border-top border-secondary pt-3">
              <Link href="/" className="btn btn-signup w-100">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}