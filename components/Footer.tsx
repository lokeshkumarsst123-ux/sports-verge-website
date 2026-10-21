"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSiteSettings } from "@/components/SiteSettingsContext";

export default function Footer() {
  const pathname = usePathname();
  const siteSettings = useSiteSettings();

  if (["/login", "/register", "/forgot-password"].includes(pathname) || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="footer-section mt-5">
      <div className="container py-5">
        <div className="row gy-4 mb-5">
          {/* Logo and Description */}
          <div className="col-lg-3 pe-lg-4">
            <div className="mb-3 footer-logo-wrapper">
              {siteSettings.logoUrl ? <img src={siteSettings.logoUrl} alt={siteSettings.websiteName} className="object-fit-contain" style={{ width: "100%", height: "100%" }} /> : <Image
                src="/assets/imgs/logo.svg"
                alt={siteSettings.websiteName}
                fill className="object-fit-contain"
              />}
            </div>
            <p className="text-muted small mb-4 lh-lg">
              Your ultimate destination for live scores, news, stats and everything sports.
            </p>
            <h6 className="footer-title text-white fw-semibold small mb-3">FOLLOW US</h6>
            <div className="d-flex gap-2">
              {siteSettings.socialLinks.facebook && <a href={siteSettings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>}
              {siteSettings.socialLinks.linkedin && <a href={siteSettings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>}
              {siteSettings.socialLinks.twitter && <a href={siteSettings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X (formerly Twitter)">
                <i className="bi bi-twitter-x"></i>
              </a>}
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-lg-5">
            <div className="row gy-4">
              <div className="col-6 col-sm-3">
                <h6 className="footer-title text-white fw-semibold small mb-3">EXPLORE</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li><Link href="/news?category=Cricket" className="footer-link">Cricket</Link></li>
                  <li><Link href="/news?category=Football" className="footer-link">Football</Link></li>
                  <li><Link href="/news?category=NFL" className="footer-link">NFL</Link></li>
                  <li><Link href="/tips" className="footer-link text-success">Sports Tips</Link></li>
                </ul>
              </div>
              <div className="col-6 col-sm-3">
                <h6 className="footer-title text-white fw-semibold small mb-3">LIVE STATS</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li><Link href="/live-scores" className="footer-link">Live Scores</Link></li>
                  <li><Link href="/fixtures" className="footer-link">Fixtures</Link></li>
                  <li><Link href="/results" className="footer-link">Results</Link></li>
                  <li><Link href="/standings" className="footer-link">Standings</Link></li>
                </ul>
              </div>
              <div className="col-6 col-sm-3">
                <h6 className="footer-title text-white fw-semibold small mb-3">COMPANY</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li><Link href="/about" className="footer-link">About Us</Link></li>
                  <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
                  <li><Link href="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
                  <li><Link href="/terms-of-use" className="footer-link">Terms of Service</Link></li>
                </ul>
              </div>
              <div className="col-6 col-sm-3">
                <h6 className="footer-title text-white fw-semibold small mb-3">SUPPORT</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li><Link href="/help-center" className="footer-link">Help Center</Link></li>
                  <li><Link href="/faqs" className="footer-link">FAQs</Link></li>
                  <li><Link href="/contact#feedback" className="footer-link">Feedback</Link></li>
                  <li><Link href="/how-to-use" className="footer-link">How to Use</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Column */}
          {/* <div className="col-lg-4 ps-lg-4">
            <h6 className="footer-title text-white fw-semibold small mb-3">STAY UPDATED</h6>
            <p className="text-muted small mb-4">Subscribe to get the latest sports news and updates.</p>
            <form action="#" className="mt-2" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group footer-newsletter">
                <span className="input-group-text bg-dark border-secondary text-muted pe-1 border-0">
                  <i className="bi fs-4 bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control bg-dark py-2 border-0 text-light border-start-0 ps-2 fs-13"
                  placeholder="Enter your email address"
                  required
                />
                <button className="btn btn-success fw-medium px-3 fs-13" type="submit">
                  Subscribe
                </button>
              </div>
            </form>
          </div> */}
        </div>

        {/* Feature Icons Row */}
        <div className="row gx-5 gy-4 border-bottom border-secondary-20 pb-4 mb-4">
          <div className="col-12 col-sm-6 col-md-3">
            <div className="d-flex align-items-center gap-3">
              <div className="footer-feature-icon">
                <i className="bi bi-lightning-charge"></i>
              </div>
              <div>
                <div className="fw-semibold small lh-1 mb-1" style={{ color: "#1C1F22" }}>Real-time Scores</div>
                <div className="fs-11" style={{ color: "#5A626A" }}>
                  Lightning fast updates
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div className="d-flex align-items-center gap-3">
              <div className="footer-feature-icon">
                <i className="bi bi-bar-chart"></i>
              </div>
              <div>
                <div className="fw-semibold small lh-1 mb-1" style={{ color: "#1C1F22" }}>Stats & Insights</div>
                <div className="fs-11" style={{ color: "#5A626A" }}>
                  Detailed sports statistics
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div className="d-flex align-items-center gap-3">
              <div className="footer-feature-icon">
                <i className="bi bi-newspaper"></i>
              </div>
              <div>
                <div className="fw-semibold small lh-1 mb-1" style={{ color: "#1C1F22" }}>In-depth Coverage</div>
                <div className="fs-11" style={{ color: "#5A626A" }}>
                  News, analysis & more
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div className="d-flex align-items-center gap-3">
              <div className="footer-feature-icon">
                <i className="bi bi-star"></i>
              </div>
              <div>
                <div className="fw-semibold small lh-1 mb-1" style={{ color: "#1C1F22" }}>Personalized</div>
                <div className="fs-11" style={{ color: "#5A626A" }}>
                  Tailored to your favorites
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Rights */}
        <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-center gap-3 text-center text-md-start">
          <div className="text-muted small">
            &copy; 2026 <span className="text-muted">{siteSettings.websiteName}</span>. All rights reserved.
            <br className="d-md-none" />
            {" Designed by "}
            <a
              href="https://supportsoft.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-success text-decoration-none"
            >
              Supportsoft Technologies
            </a>
          </div>

          <div className="text-muted small d-flex flex-column flex-md-row align-items-center gap-2 gap-md-3">
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-shield-check me-1"></i>Secure & Safe
            </div>
            <span className="d-none d-md-inline opacity-25">|</span>
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-globe me-1"></i>Worldwide Coverage
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
