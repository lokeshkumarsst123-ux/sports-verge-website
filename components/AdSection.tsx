"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAds, Ad } from "./AdContext";

export default function AdSection() {
  const { getAdByType } = useAds();
  const [activeAd, setActiveAd] = useState<Ad | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setActiveAd(getAdByType("Sidebar Advertisement"));
    setImageError(false);
    setIsHydrated(true);
  }, [getAdByType]);

  if (!isHydrated) {
    return <aside className="ad-section rounded-3 border border-dark mt-4 d-flex align-items-center justify-content-center bg-dark"><span className="text-muted small">Loading ad slot...</span></aside>;
  }

  if (!activeAd?.image || imageError) {
    return <aside className="ad-section rounded-3 border border-dark mt-4 d-flex align-items-center justify-content-center bg-dark"><span className="text-muted small">No active advertisement</span></aside>;
  }

  return (
    <aside className="ad-section rounded-3 border border-dark overflow-hidden mt-4 position-relative d-flex align-items-end">
      <Link href={activeAd.redirectUrl} target="_blank" rel="noopener noreferrer" className="w-100 h-100 d-block position-relative">
        <img src={activeAd.image} alt={activeAd.title} className="w-100 h-100 object-fit-cover ad-bg-img" onError={() => setImageError(true)} />
      </Link>
      <span className="position-absolute top-0 end-0 badge bg-dark text-muted font-monospace fs-10 border border-secondary border-opacity-10 m-2 z-1">SPONSOR</span>
    </aside>
  );
}
