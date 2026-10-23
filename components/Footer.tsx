"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
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
          <div className="col-lg-4 pe-lg-4">
            <div className="mb-3 footer-logo-wrapper">
              <Link href="/" className="d-inline-block text-decoration-none">
                {siteSettings.logoUrl ? (
                  <img
                    src={siteSettings.logoUrl}
                    alt={siteSettings.websiteName}
                    width={160}
                    height={40}
                    className="footer-logo-img brand-logo"
                  />
                ) : (
                  <Image
                    src="/assets/imgs/logo.svg"
                    alt={siteSettings.websiteName}
                    width={160}
                    height={40}
                    className="footer-logo-img brand-logo"
                    priority
                  />
                )}
              </Link>
            </div>
            <p className="text-muted small mb-0 lh-lg">
              Your ultimate destination for live scores, news, stats and everything sports.
            </p>
          </div>

          {/* Links Columns */}
          <div className="col-lg-8">
            <div className="row gy-4">
              <div className="col-6 col-sm-3">
                <h6 className="footer-title fw-bold small mb-3">EXPLORE</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li><Link href="/news?category=Cricket" className="footer-link">Cricket</Link></li>
                  <li><Link href="/news?category=Football" className="footer-link">Football</Link></li>
                  <li><Link href="/news?category=NFL" className="footer-link">NFL</Link></li>
                  <li><Link href="/tips" className="footer-link text-success">Sports Tips</Link></li>
                </ul>
              </div>
              <div className="col-6 col-sm-3">
                <h6 className="footer-title fw-bold small mb-3">LIVE STATS</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li><Link href="/live-scores" className="footer-link">Live Scores</Link></li>
                  <li><Link href="/fixtures" className="footer-link">Fixtures</Link></li>
                  <li><Link href="/results" className="footer-link">Results</Link></li>
                  <li><Link href="/standings" className="footer-link">Standings</Link></li>
                </ul>
              </div>
              <div className="col-6 col-sm-3">
                <h6 className="footer-title fw-bold small mb-3">COMPANY</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li><Link href="/about" className="footer-link">About Us</Link></li>
                  <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
                  <li><Link href="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
                  <li><Link href="/terms-of-use" className="footer-link">Terms of Service</Link></li>
                </ul>
              </div>
              <div className="col-6 col-sm-3">
                <h6 className="footer-title fw-bold small mb-3">SUPPORT</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li><Link href="/help-center" className="footer-link">Help Center</Link></li>
                  <li><Link href="/faqs" className="footer-link">FAQs</Link></li>
                  <li><Link href="/contact#feedback" className="footer-link">Feedback</Link></li>
                  <li><Link href="/how-to-use" className="footer-link">How to Use</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Row */}
        <div className="row g-3 py-4 mb-4 border-top border-bottom" style={{ borderColor: "#EAE5DC" }}>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="footer-feature-card">
              <div className="footer-feature-icon">
                <i className="bi bi-lightning-charge-fill"></i>
              </div>
              <div>
                <div className="footer-feature-title">Real-time Scores</div>
                <div className="footer-feature-desc">Lightning fast updates</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="footer-feature-card">
              <div className="footer-feature-icon">
                <i className="bi bi-bar-chart-line-fill"></i>
              </div>
              <div>
                <div className="footer-feature-title">Stats & Insights</div>
                <div className="footer-feature-desc">Detailed sports statistics</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="footer-feature-card">
              <div className="footer-feature-icon">
                <i className="bi bi-newspaper"></i>
              </div>
              <div>
                <div className="footer-feature-title">In-depth Coverage</div>
                <div className="footer-feature-desc">News, analysis & more</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="footer-feature-card">
              <div className="footer-feature-icon">
                <i className="bi bi-star-fill"></i>
              </div>
              <div>
                <div className="footer-feature-title">Personalized</div>
                <div className="footer-feature-desc">Tailored to your favorites</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Rights */}
        <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-center gap-3 text-center text-md-start">
          <div className="text-muted small">
            &copy; 2026 <span className="text-muted fw-semibold">{siteSettings.websiteName}</span>. All rights reserved.
            <br className="d-md-none" />
            {" Designed by "}
            <a
              href="https://supportsoft.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-success text-decoration-none fw-semibold"
            >
              Supportsoft Technologies
            </a>
          </div>

          <div className="text-muted small d-flex flex-column flex-md-row align-items-center gap-2 gap-md-3">
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-shield-check text-success me-1"></i>Secure & Safe
            </div>
            <span className="d-none d-md-inline opacity-25">|</span>
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-globe text-primary me-1"></i>Worldwide Coverage
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
