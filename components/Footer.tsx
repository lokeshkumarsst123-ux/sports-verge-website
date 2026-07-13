"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (["/login", "/register", "/forgot-password"].includes(pathname)) {
    return null;
  }

  return (
    <footer className="footer-section mt-5">
      <div className="container py-5">
        <div className="row gy-4 mb-5">
          {/* Logo and Description */}
          <div className="col-lg-3 pe-lg-4">
            <div className="mb-3 footer-logo-wrapper">
              <Image
                src="/assets/imgs/logo-white.svg"
                alt="The SportsVerge"
                fill className="object-fit-contain"
              />
            </div>
            <p className="text-muted small mb-4 lh-lg">
              Your ultimate destination for live scores, news, stats and everything sports.
            </p>
            <h6 className="footer-title text-white fw-semibold small mb-3">FOLLOW US</h6>
            <div className="d-flex gap-2">
              <Link href="#" className="social-icon" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </Link>
              <Link href="#" className="social-icon" aria-label="X (formerly Twitter)">
                <i className="bi bi-twitter-x"></i>
              </Link>
              <Link href="#" className="social-icon" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </Link>
              <Link href="#" className="social-icon" aria-label="YouTube">
                <i className="bi bi-youtube"></i>
              </Link>
              <Link href="#" className="social-icon" aria-label="Discord">
                <i className="bi bi-discord"></i>
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-lg-5">
            <div className="row gy-4">
              <div className="col-6 col-sm-3">
                <h6 className="footer-title text-white fw-semibold small mb-3">EXPLORE</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li>
                    <Link href="#" className="footer-link">
                      Cricket
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="footer-link">
                      Football
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="footer-link">
                      NFL
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="footer-link">
                      AFL
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-6 col-sm-3">
                <h6 className="footer-title text-white fw-semibold small mb-3">Live Stats</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li>
                    <Link href="#" className="footer-link">
                      Live Scores
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="footer-link">
                      Fixtures
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="footer-link">
                      Results
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="footer-link">
                      Standings
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-6 col-sm-3">
                <h6 className="footer-title text-white fw-semibold small mb-3">COMPANY</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li>
                    <Link href="#" className="footer-link">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="footer-link">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="footer-link">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="footer-link">
                      Terms of Use
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-6 col-sm-3">
                <h6 className="footer-title text-white fw-semibold small mb-3">SUPPORT</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li>
                    <Link href="#" className="footer-link">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="footer-link">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="footer-link">
                      Feedback
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="footer-link">
                      How to Use
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="col-lg-4 ps-lg-4">
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
          </div>
        </div>

        {/* Feature Icons Row */}
        <div
          className="row row-cols-1 row-cols-sm-2 row-cols-md-4 gy-4 border-bottom border-secondary-20 pb-4 mb-4"
        >
          <div className="col">
            <div className="d-flex align-items-center gap-3">
              <div className="footer-feature-icon">
                <i className="bi bi-lightning-charge"></i>
              </div>
              <div>
                <div className="text-light fw-semibold small lh-1 mb-1">Real-time Scores</div>
                <div className="text-muted fs-11">
                  Lightning fast updates
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="d-flex align-items-center gap-3">
              <div className="footer-feature-icon">
                <i className="bi bi-bar-chart"></i>
              </div>
              <div>
                <div className="text-light fw-semibold small lh-1 mb-1">Stats & Insights</div>
                <div className="text-muted fs-11">
                  Detailed sports statistics
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="d-flex align-items-center gap-3">
              <div className="footer-feature-icon">
                <i className="bi bi-newspaper"></i>
              </div>
              <div>
                <div className="text-light fw-semibold small lh-1 mb-1">In-depth Coverage</div>
                <div className="text-muted fs-11">
                  News, analysis & more
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="d-flex align-items-center gap-3">
              <div className="footer-feature-icon">
                <i className="bi bi-star"></i>
              </div>
              <div>
                <div className="text-light fw-semibold small lh-1 mb-1">Personalized</div>
                <div className="text-muted fs-11">
                  Tailored to your favorites
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Rights */}
        <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-center gap-3 text-center text-md-start">
          <div className="text-muted small">
            &copy; 2026 <span className="text-muted">The SportsVerge</span>. All rights reserved.
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
