import type { MetadataRoute } from "next";
import { API_BASE_URL } from "@/lib/api-config";
import { sitemapSeoPages } from "@/config/seo-pages";

const fallbackSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const settingsResponse = await fetch(`${API_BASE_URL}/content/settings`, { cache: "no-store" });
    const settingsPayload = await settingsResponse.json();
    const settings = settingsPayload?.data?.settings;
    if (settings?.sitemapEnabled === false) return [];

    const configuredUrl = settings?.ogUrl || settings?.canonicalUrl || fallbackSiteUrl;
    const siteUrl = new URL(configuredUrl).origin.replace(/\/$/, "");
    const firstResponse = await fetch(`${API_BASE_URL}/content/articles?page=1&limit=50`, { cache: "no-store" });
    const firstPayload = await firstResponse.json();
    const firstData = firstPayload?.data || { items: [], totalPages: 1 };
    const pages = Number(firstData.totalPages || 1);
    const remaining = await Promise.all(Array.from({ length: Math.max(0, pages - 1) }, (_, index) => fetch(`${API_BASE_URL}/content/articles?page=${index + 2}&limit=50`, { cache: "no-store" }).then((response) => response.json())));
    const articles = [firstData, ...remaining.map((payload) => payload?.data || { items: [] })].flatMap((data) => data.items || []);
    const publicRoutes = sitemapSeoPages
      .filter((entry) => !entry.path.includes("*"))
      .map((entry) => ({
        url: `${siteUrl}${entry.path}`,
        lastModified: new Date(),
      }));

    return [
      ...publicRoutes,
      ...articles.map((article: { slug?: string; id: string; publishAt?: string; createdAt?: string }) => ({
        url: `${siteUrl}/news/${article.slug || article.id}`,
        lastModified: new Date(article.publishAt || article.createdAt || Date.now()),
      })),
    ];
  } catch {
    return [];
  }
}
