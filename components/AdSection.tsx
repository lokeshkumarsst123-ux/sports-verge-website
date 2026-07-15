"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAds, Ad } from "./AdContext";

export default function AdSection() {
  const { getAdByType } = useAds();
  const [activeAd, setActiveAd] = useState<Ad | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setActiveAd(getAdByType("Sidebar Advertisement"));
    setIsHydrated(true);
  }, [getAdByType]);

  const displayAd = activeAd || {
    title: "Default Sidebar Ad",
    image: "/assets/imgs/ad+1.webp",
    redirectUrl: "#",
  };

  if (!isHydrated) {
    return (
      <aside 
        className="ad-section rounded-3 border border-dark mt-4 d-flex align-items-center justify-content-center bg-dark"
        style={{ height: "300px" }}
      >
        <span className="text-muted small">Loading ad slot...</span>
      </aside>
    );
  }

  return (
    <aside className="ad-section rounded-3 border border-dark overflow-hidden mt-4 position-relative d-flex align-items-end" style={{ minHeight: "340px" }}>
      <Link href={displayAd.redirectUrl} target="_blank" rel="noopener noreferrer" className="w-100 h-100 d-block position-relative">
        <Image
          src={displayAd.image}
          alt={displayAd.title}
          fill
          sizes="(max-width: 991px) 100vw, 320px"
          className="object-fit-cover ad-bg-img"
        />
      </Link>
      <span className="position-absolute top-0 end-0 badge bg-dark text-muted font-monospace fs-10 border border-secondary border-opacity-10 m-2 z-1">
        SPONSOR
      </span>
    </aside>
  );
}
