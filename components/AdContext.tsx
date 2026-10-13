"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { API_BASE_URL, API_ORIGIN } from "@/lib/api-config";

export interface Ad {
  id: string;
  sourceId?: string;
  title: string;
  type: "Homepage Banner" | "Sidebar Advertisement" | "Article Advertisement" | "Match Page Advertisement";
  image: string;
  redirectUrl: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Paused" | "Scheduled";
}

type ApiAd = { id: string; title: string; imageUrl: string; destinationUrl: string; placement: string; startDate: string; endDate: string };
type AdContextType = { ads: Ad[]; addAd: (ad: Omit<Ad, "id">) => void; updateAdStatus: (id: string, status: Ad["status"]) => void; deleteAd: (id: string) => void; editAd: (id: string, ad: Omit<Ad, "id">) => void; getAdByType: (type: Ad["type"]) => Ad | null };

const AdContext = createContext<AdContextType>({ ads: [], addAd: () => {}, updateAdStatus: () => {}, deleteAd: () => {}, editAd: () => {}, getAdByType: () => null });
export const useAds = () => useContext(AdContext);

const normalizeAdImage = (value: string) => {
  const source = String(value || "").trim();
  if (!source) return "";
  if (source.startsWith("//")) return `https:${source}`;
  if (source.startsWith("/")) return `${API_ORIGIN}${source}`;
  if (/^https?:\/\/(localhost|127\.0\.0\.1):4000\//i.test(source)) {
    try {
      const parsed = new URL(source);
      return `${API_ORIGIN}${parsed.pathname}${parsed.search}`;
    } catch {
      return source;
    }
  }
  return source;
};
const placementByType: Record<Ad["type"], string> = { "Homepage Banner": "homepage_header", "Sidebar Advertisement": "homepage_sidebar", "Article Advertisement": "news_details", "Match Page Advertisement": "match_details" };
const typeByPlacement: Record<string, Ad["type"]> = { homepage_header: "Homepage Banner", news_listing: "Homepage Banner", homepage_sidebar: "Sidebar Advertisement", news_details: "Article Advertisement", match_details: "Match Page Advertisement" };
const mapAds = (ad: ApiAd): Ad[] => ad.placement.split(",").map((placement) => typeByPlacement[placement]).filter(Boolean).map((type) => ({ id: `${ad.id}-${type}`, sourceId: ad.id, title: ad.title, type, image: normalizeAdImage(ad.imageUrl), redirectUrl: `${API_BASE_URL}/content/advertisements/${ad.id}/click`, startDate: ad.startDate, endDate: ad.endDate, status: "Active" }));

export default function AdProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const [ads, setAds] = useState<Ad[]>([]);
  const trackedImpressions = useRef(new Set<string>());
  const loadAds = async () => { if (isAdminRoute) return; try { const response = await fetch(`${API_BASE_URL}/content/advertisements`, { cache: "no-store" }); if (!response.ok) return; const payload = await response.json(); const nextAds: Ad[] = (payload.data?.advertisements || []).flatMap((ad: ApiAd) => mapAds(ad)); setAds(nextAds); const sourceIds = [...new Set(nextAds.map((ad) => ad.sourceId).filter(Boolean))] as string[]; await Promise.all(sourceIds.filter((id) => !trackedImpressions.current.has(id)).map(async (id) => { trackedImpressions.current.add(id); try { await fetch(`${API_BASE_URL}/content/advertisements/${id}/impression`, { method: "POST", keepalive: true }); } catch { /* Impression tracking must never block the page. */ } })); } catch { /* Ads should never block the page. */ } };
  useEffect(() => { if (isAdminRoute) { setAds([]); return undefined; } void loadAds(); const timer = window.setInterval(() => void loadAds(), 30000); return () => window.clearInterval(timer); }, [isAdminRoute]);
  const getAdByType = (type: Ad["type"]): Ad | null => ads.find((ad) => ad.type === type) || null;
  const value = useMemo(() => ({ ads, addAd: (_ad: Omit<Ad, "id">) => {}, updateAdStatus: (_id: string, _status: Ad["status"]) => {}, deleteAd: (_id: string) => {}, editAd: (_id: string, _ad: Omit<Ad, "id">) => {}, getAdByType }), [ads]);
  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
}
