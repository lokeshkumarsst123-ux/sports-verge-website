"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAds, Ad } from "./AdContext";

export default function HorizontalBanner() {
  const { getAdByType } = useAds();
  const [activeAd, setActiveAd] = useState<Ad | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setActiveAd(getAdByType("Homepage Banner"));
    setImageError(false);
    setIsHydrated(true);
  }, [getAdByType]);

  if (!isHydrated) {
    return <div className="horizontal-ad-section rounded-3 border border-dark mt-4 d-flex align-items-center justify-content-center bg-dark" style={{ height: "120px" }}><span className="text-muted small">Loading ad slot...</span></div>;
  }

  if (!activeAd?.image || imageError) {
    return <section className="horizontal-ad-section rounded-3 border border-dark mt-4 d-flex align-items-center justify-content-center bg-dark" style={{ height: "120px" }}><span className="text-muted small">No active advertisement</span></section>;
  }

  return (
    <section className="horizontal-ad-section rounded-3 border border-dark overflow-hidden mt-4 position-relative d-flex align-items-center horizontal-banner-bg">
      <Link href={activeAd.redirectUrl} target="_blank" rel="noopener noreferrer" className="w-100 h-100 d-block">
        <img src={activeAd.image} alt={activeAd.title} className="img-fluid w-100 h-auto object-fit-cover" onError={() => setImageError(true)} />
      </Link>
      <span className="position-absolute top-0 end-0 badge bg-dark text-muted font-monospace fs-10 border border-secondary border-opacity-10 m-2">SPONSOR</span>
    </section>
  );
}
