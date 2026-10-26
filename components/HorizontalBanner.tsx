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

  if (!isHydrated) return null;

  if (!activeAd?.image || imageError) return null;

  return (
    <section className="horizontal-ad-section rounded-3 border border-dark overflow-hidden mt-4 position-relative d-flex align-items-center horizontal-banner-bg">
      <Link href={activeAd.redirectUrl} target="_blank" rel="noopener noreferrer" className="w-100 h-100 d-block">
        <img src={activeAd.image} alt={activeAd.title} className="img-fluid w-100 h-auto object-fit-cover" onError={() => setImageError(true)} />
      </Link>
      <span className="position-absolute top-0 end-0 badge bg-light text-dark text-muted font-monospace fs-10 border border-secondary border-opacity-10 m-2">SPONSOR</span>
    </section>
  );
}
