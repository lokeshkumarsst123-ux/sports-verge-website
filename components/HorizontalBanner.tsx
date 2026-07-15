"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAds, Ad } from "./AdContext";

export default function HorizontalBanner() {
  const { getAdByType } = useAds();
  const [activeAd, setActiveAd] = useState<Ad | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setActiveAd(getAdByType("Homepage Banner"));
    setIsHydrated(true);
  }, [getAdByType]);

  // Render a fallback static mock if no custom active ad exists
  const displayAd = activeAd || {
    title: "Default Sports Gear Ad",
    image: "/assets/imgs/ad-2.webp",
    redirectUrl: "#",
  };

  if (!isHydrated) {
    return (
      <div 
        className="horizontal-ad-section rounded-3 border border-dark mt-4 d-flex align-items-center justify-content-center bg-dark"
        style={{ height: "120px" }}
      >
        <span className="text-muted small">Loading ad slot...</span>
      </div>
    );
  }

  return (
    <section
      className="horizontal-ad-section rounded-3 border border-dark overflow-hidden mt-4 position-relative d-flex align-items-center horizontal-banner-bg"
    >
      <Link href={displayAd.redirectUrl} target="_blank" rel="noopener noreferrer" className="w-100 h-100 d-block">
        <Image
          src={displayAd.image}
          alt={displayAd.title}
          width={1400}
          height={220}
          className="img-fluid w-100 h-auto object-fit-cover"
          priority
          sizes="(max-width: 768px) 100vw, 1400px"
        />
      </Link>
      <span className="position-absolute top-0 end-0 badge bg-dark text-muted font-monospace fs-10 border border-secondary border-opacity-10 m-2">
        SPONSOR
      </span>
    </section>
  );
}