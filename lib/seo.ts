import type { Metadata } from "next";
import type { SeoPageRule, SeoResolution, PublicSiteSettings } from "@/lib/content-api";
import { seoPageCatalog, type SeoCatalogEntry } from "@/config/seo-pages";

const fallbackSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const absoluteUrl = (path: string, baseUrl = fallbackSiteUrl) => {
  const source = String(path || "/").trim() || "/";
  try {
    return new URL(source, baseUrl).toString();
  } catch {
    return `${baseUrl.replace(/\/$/, "")}${source.startsWith("/") ? source : `/${source}`}`;
  }
};

export const routeFromSearch = (pathname: string, searchParams?: URLSearchParams | null) => {
  const params = searchParams?.toString();
  return params ? `${pathname}?${params}` : pathname;
};

const resolveMetadataText = (value: unknown): string | undefined => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.absolute === "string") return record.absolute;
    if (typeof record.default === "string") return record.default;
    if (typeof record.template === "string") return record.template;
  }
  return undefined;
};

export const getSeoCatalogEntry = (path: string) => seoPageCatalog.find((entry) => normalizeSeoPath(entry.path) === normalizeSeoPath(path));

export const getSeoDefaultsForPath = (path: string): SeoCatalogEntry => getSeoCatalogEntry(path) || {
  path,
  label: path,
  description: "",
  group: "Content",
  includeInSitemap: false,
  defaultTitle: "SportsVerge",
  defaultDescription: "SportsVerge",
};

export const buildSeoMetadata = (
  resolution: SeoResolution | null | undefined,
  defaults: Pick<Metadata, "title" | "description" | "keywords">,
  currentPath: string,
  options?: { preferDefaults?: boolean },
): Metadata => {
  const settings = resolution?.settings;
  const page = resolution?.page;
  const preferDefaults = options?.preferDefaults || false;
  const siteUrl = absoluteUrl("/");
  const currentUrl = absoluteUrl(currentPath || "/", siteUrl);
  const canonical = page?.canonicalUrl || (page ? currentUrl : settings?.canonicalUrl || currentUrl);
  const defaultTitle = resolveMetadataText(defaults.title);
  const defaultDescription = resolveMetadataText(defaults.description);
  const defaultKeywords = Array.isArray(defaults.keywords) ? defaults.keywords : resolveMetadataText(defaults.keywords);
  const title = page?.seoTitle || (preferDefaults ? defaultTitle : settings?.seoTitle || defaultTitle);
  const description = page?.seoDescription || (preferDefaults ? defaultDescription : settings?.seoDescription || defaultDescription);
  const keywords = page?.seoKeywords || (preferDefaults ? defaults.keywords : settings?.seoKeywords || defaults.keywords);
  const ogTitle = resolveMetadataText(page?.ogTitle) || resolveMetadataText(settings?.ogTitle) || resolveMetadataText(title) || defaultTitle;
  const ogDescription = resolveMetadataText(page?.ogDescription) || resolveMetadataText(settings?.ogDescription) || resolveMetadataText(description) || defaultDescription;
  const ogUrl = page?.ogUrl || (page ? currentUrl : settings?.ogUrl || currentUrl);
  const ogType = page?.ogType || settings?.ogType || "website";
  const ogImage = page?.ogImageUrl || settings?.ogImageUrl || undefined;

  return {
    title: title || defaultTitle,
    description: description || defaultDescription,
    keywords: keywords || defaultKeywords,
    alternates: { canonical },
    openGraph: {
      title: ogTitle || title || defaultTitle,
      description: ogDescription || description || defaultDescription,
      url: ogUrl,
      type: ogType === "article" ? "article" : ogType === "profile" ? "profile" : "website",
      images: ogImage ? [ogImage] : undefined,
    },
  };
};

export const normalizeSeoPath = (value: string) => {
  let input = String(value || "").trim();
  if (!input) return "/";
  if (/^[a-z][a-z\d+\-.]*:\/\//i.test(input)) {
    try {
      const parsed = new URL(input);
      input = `${parsed.pathname}${parsed.search}`;
    } catch {
      input = "/";
    }
  }
  if (!input.startsWith("/")) input = `/${input}`;
  const [rawPath, rawQuery = ""] = input.split("?");
  const path = (rawPath.replace(/\/+$/, "") || "/").toLowerCase();
  const params = new URLSearchParams(rawQuery.replace(/^\?/, ""));
  const query: [string, string][] = Array.from(params.entries())
    .map(([key, val]): [string, string] => [key.trim().toLowerCase(), val.trim().toLowerCase()])
    .sort(([leftKey, leftValue], [rightKey, rightValue]) => leftKey.localeCompare(rightKey) || leftValue.localeCompare(rightValue));
  return query.length ? `${path}?${new URLSearchParams(query).toString()}` : path;
};

export const seoPageKey = (entry: SeoPageRule | SeoCatalogEntry | null | undefined) => entry ? ("pagePath" in entry ? entry.pagePath : entry.path) : "";

export const seoDisplayPath = (path: string) => normalizeSeoPath(path);

export const formatSeoRuleLabel = (rule: SeoPageRule | null | undefined) => rule?.pageLabel || rule?.pagePath || "SEO rule";

export const combineStructuredData = (page: SeoPageRule | null | undefined, settings: PublicSiteSettings | null | undefined) => {
  const pageData = page?.structuredData && typeof page.structuredData === "object" && !Array.isArray(page.structuredData) ? page.structuredData : null;
  const globalData = settings?.structuredData && typeof settings.structuredData === "object" && !Array.isArray(settings.structuredData) ? settings.structuredData : null;
  if (!pageData && !globalData) return null;
  if (!pageData) return globalData;
  if (!globalData) return pageData;
  return { ...globalData, ...pageData };
};
