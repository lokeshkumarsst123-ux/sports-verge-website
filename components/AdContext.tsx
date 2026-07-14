"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface Ad {
  id: string;
  title: string;
  type: "Homepage Banner" | "Sidebar Advertisement" | "Article Advertisement" | "Match Page Advertisement";
  image: string;
  redirectUrl: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Paused" | "Scheduled";
}

type AdContextType = {
  ads: Ad[];
  addAd: (ad: Omit<Ad, "id">) => void;
  updateAdStatus: (id: string, status: Ad["status"]) => void;
  deleteAd: (id: string) => void;
  editAd: (id: string, ad: Omit<Ad, "id">) => void;
  getAdByType: (type: Ad["type"]) => Ad | null;
};

const AdContext = createContext<AdContextType>({
  ads: [],
  addAd: () => {},
  updateAdStatus: () => {},
  deleteAd: () => {},
  editAd: () => {},
  getAdByType: () => null,
});

export const useAds = () => useContext(AdContext);

const defaultAds: Ad[] = [
  {
    id: "AD-1",
    title: "Premium Sports Gear Sale",
    type: "Homepage Banner",
    image: "/assets/imgs/ad-2.webp",
    redirectUrl: "https://example.com/sports-gear",
    startDate: "2026-07-01",
    endDate: "2026-08-31",
    status: "Active",
  },
  {
    id: "AD-2",
    title: "Join The Club Membership",
    type: "Sidebar Advertisement",
    image: "/assets/imgs/ad+1.webp",
    redirectUrl: "https://example.com/membership",
    startDate: "2026-07-01",
    endDate: "2026-08-31",
    status: "Active",
  },
  {
    id: "AD-3",
    title: "Get SportsVerge Premium",
    type: "Article Advertisement",
    image: "/assets/imgs/news/haaland-brazil.webp",
    redirectUrl: "https://example.com/premium",
    startDate: "2026-07-01",
    endDate: "2026-08-31",
    status: "Active",
  },
  {
    id: "AD-4",
    title: "Live Stream Ticket Specials",
    type: "Match Page Advertisement",
    image: "/assets/imgs/news/james-cook-bills.jpg",
    redirectUrl: "https://example.com/tickets",
    startDate: "2026-07-01",
    endDate: "2026-08-31",
    status: "Active",
  },
];

export default function AdProvider({ children }: { children: React.ReactNode }) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sportsverge_advertisements");
      if (stored) {
        const parsed = JSON.parse(stored);
        const hasUnsplash = parsed.some((ad: any) => ad.image && ad.image.includes("unsplash.com"));
        if (hasUnsplash) {
          setAds(defaultAds);
          localStorage.setItem("sportsverge_advertisements", JSON.stringify(defaultAds));
        } else {
          setAds(parsed);
        }
      } else {
        setAds(defaultAds);
        localStorage.setItem("sportsverge_advertisements", JSON.stringify(defaultAds));
      }
    } catch (e) {
      console.error("Error reading ads from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("sportsverge_advertisements", JSON.stringify(ads));
  }, [ads, isHydrated]);

  const addAd = (newAdData: Omit<Ad, "id">) => {
    const id = `AD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newAd: Ad = { ...newAdData, id };
    setAds((prev) => [newAd, ...prev]);
  };

  const updateAdStatus = (id: string, status: Ad["status"]) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, status } : ad))
    );
  };

  const deleteAd = (id: string) => {
    setAds((prev) => prev.filter((ad) => ad.id !== id));
  };

  const editAd = (id: string, updatedData: Omit<Ad, "id">) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, ...updatedData } : ad))
    );
  };

  const getAdByType = (type: Ad["type"]): Ad | null => {
    const today = new Date().toISOString().split("T")[0];
    // Find the first active ad of the matching type within date range
    const activeAds = ads.filter((ad) => {
      if (ad.type !== type || ad.status !== "Active") return false;
      
      // Date verification
      const isAfterStart = !ad.startDate || today >= ad.startDate;
      const isBeforeEnd = !ad.endDate || today <= ad.endDate;
      return isAfterStart && isBeforeEnd;
    });

    return activeAds.length > 0 ? activeAds[0] : null;
  };

  return (
    <AdContext.Provider
      value={{
        ads,
        addAd,
        updateAdStatus,
        deleteAd,
        editAd,
        getAdByType,
      }}
    >
      {children}
    </AdContext.Provider>
  );
}
