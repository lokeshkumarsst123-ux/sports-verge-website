"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { contentApi, type PublicSiteSettings, type SeoPageRule } from "@/lib/content-api";
import { absoluteUrl, routeFromSearch } from "@/lib/seo";

const defaults: PublicSiteSettings = {
  websiteName: "The Sports Verg",
  logoUrl: null,
  contactEmail: "admin@sportsverge.com",
  contactNumber: "+1 (800) 555-0199",
  socialLinks: {},
};

const normalize = (settings: Partial<PublicSiteSettings> | null | undefined): PublicSiteSettings => ({
  ...defaults,
  ...settings,
  websiteName: settings?.websiteName || defaults.websiteName,
  logoUrl: settings?.logoUrl || null,
  contactEmail: settings?.contactEmail || defaults.contactEmail,
  contactNumber: settings?.contactNumber || defaults.contactNumber,
  socialLinks: {
    facebook: settings?.socialLinks?.facebook || "",
    linkedin: settings?.socialLinks?.linkedin || settings?.socialLinks?.instagram || "",
    twitter: settings?.socialLinks?.twitter || "",
  },
});

const SiteSettingsContext = createContext<PublicSiteSettings>(defaults);

export const useSiteSettings = () => useContext(SiteSettingsContext);

export default function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PublicSiteSettings>(defaults);
  const [pageSeo, setPageSeo] = useState<SeoPageRule | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentRoute = useMemo(() => routeFromSearch(pathname || "/", searchParams), [pathname, searchParams]);

  useEffect(() => {
    let active = true;
    const loadSeo = async () => {
      try {
        const result = await contentApi.seo(currentRoute);
        if (!active) return;
        setSettings(normalize(result.data.settings));
        setPageSeo(result.data.page);
      } catch {
        if (active) {
          setSettings(defaults);
          setPageSeo(null);
        }
      }
    };

    void loadSeo();

    const refreshSeo = () => {
      void loadSeo();
    };

    window.addEventListener("site-settings-updated", refreshSeo);
    return () => {
      active = false;
      window.removeEventListener("site-settings-updated", refreshSeo);
    };
  }, [currentRoute]);

  useEffect(() => {
    const setMeta = (name: string, content?: string | null, property = false) => {
      if (!content) return;
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        if (property) element.setAttribute("property", name);
        else element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.content = content;
    };
    const canonical = pageSeo ? (pageSeo.canonicalUrl || absoluteUrl(currentRoute)) : (settings.canonicalUrl || absoluteUrl(currentRoute));
    const ogUrl = pageSeo ? (pageSeo.ogUrl || canonical) : (settings.ogUrl || canonical);

    document.title = settings.seoTitle || (settings.websiteName === defaults.websiteName
      ? "SportsVerge - Premium Sports Data & Live Analytics Platform"
      : settings.websiteName);
    setMeta("description", settings.seoDescription || undefined);
    setMeta("keywords", settings.seoKeywords || undefined);
    setMeta("og:title", settings.ogTitle || settings.seoTitle || settings.websiteName, true);
    setMeta("og:description", settings.ogDescription || settings.seoDescription || undefined, true);
    setMeta("og:url", ogUrl, true);
    setMeta("og:type", settings.ogType || "website", true);
    setMeta("og:image", settings.ogImageUrl || undefined, true);

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;

    const structuredData = settings.structuredData;
    if (structuredData && Object.keys(structuredData).length) {
      let script = document.getElementById("site-structured-data") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "site-structured-data";
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [currentRoute, pageSeo, settings]);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}
