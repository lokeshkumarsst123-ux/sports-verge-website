"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
  const [mounted, setMounted] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setFadeOut(true);
      const timer = setTimeout(() => setMounted(false), 600); // Wait for transition animation
      return () => clearTimeout(timer);
    };

    if (document.readyState === "complete") {
      const timer = setTimeout(handleLoad, 1000); // Simulate premium feel
      return () => clearTimeout(timer);
    } else {
      window.addEventListener("load", handleLoad);
      const fallbackTimer = setTimeout(handleLoad, 2500); // Fallback limit
      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className={`preloader-wrapper ${fadeOut ? "fade-out" : ""}`}>
      <div className="preloader-backdrop-glow"></div>
      <div className="preloader-card">
        <div className="spinner-container">
          <div className="custom-spinner-ring"></div>
          <div className="spinner-inner-circle">
            <Image
              src="/assets/imgs/favicon.svg"
              alt="SportsVerge Logo"
              width={38}
              height={38}
              priority
              className="preloader-logo-img"
            />
          </div>
        </div>

        <h2 className="preloader-brand">
          SPORTS<span className="brand-highlight">VERGE</span>
        </h2>

        <div className="preloader-status-pill">
          <span className="preloader-live-dot"></span>
          <span>LIVE SPORTS & ANALYTICS</span>
        </div>

        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    </div>
  );
}
