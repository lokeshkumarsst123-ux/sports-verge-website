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
      <div className="preloader-content">
        <div className="spinner-container">
          <div className="custom-spinner"></div>
          <div className="spinner-glow"></div>
          <div className="spinner-logo">
            <Image
              src="/assets/imgs/favicon.svg"
              alt="SportsVerge Logo"
              width={34}
              height={34}
              priority
            />
          </div>
        </div>
        <h2 className="preloader-brand">
          SPORTS<span className="text-success">VERGE</span>
        </h2>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
        <p className="preloader-tagline">Real-time Analytics & Live Scores</p>
      </div>
    </div>
  );
}
