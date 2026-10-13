import { API_BASE_URL, API_ORIGIN } from "@/lib/api-config";
import { formatUserDate } from "@/lib/date-time";

export type PublicNewsArticle = {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  slug: string;
  category: string;
  categorySlug: string;
  author: string;
  authorImage?: string;
  date: string;
  readTime: string;
  publishAt?: string | null;
  createdAt: string;
  viewCount: number;
  relatedIds: string[];
  tags: string[];
  canonicalUrl?: string | null;
};

export type PublicSiteSettings = {
  websiteName: string;
  logoUrl?: string | null;
  contactEmail?: string | null;
  contactNumber?: string | null;
  socialLinks: Record<string, string>;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogUrl?: string | null;
  ogType?: "website" | "article" | "profile" | null;
  ogImageUrl?: string | null;
  structuredData?: Record<string, unknown> | null;
  sitemapEnabled?: boolean;
};

export type SeoPageRule = {
  id: string;
  pageLabel: string;
  pagePath: string;
  normalizedPath?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogUrl?: string | null;
  ogType?: "website" | "article" | "profile";
  ogImageUrl?: string | null;
  structuredData?: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SeoResolution = {
  settings: PublicSiteSettings;
  page: SeoPageRule | null;
  path: string;
};

export type PublicLegalContent = {
  termsOfService?: string | null;
  privacyPolicy?: string | null;
  updatedAt?: string | null;
};

const normalizeMediaUrl = (value: unknown) => {
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

const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  try {
    const session = JSON.parse(sessionStorage.getItem("user_session") || "null");
    return session?.accessToken || null;
  } catch {
    return null;
  }
};

const request = async <T>(path: string): Promise<T> => {
  const headers = new Headers({ Accept: "application/json" });
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}${path}`, { headers, cache: "no-store" });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error?.message || "Unable to load news.");
  return payload as T;
};

const withLocalDate = (article: PublicNewsArticle): PublicNewsArticle => ({
  ...article,
  image: normalizeMediaUrl(article.image),
  authorImage: article.authorImage ? normalizeMediaUrl(article.authorImage) : article.authorImage,
  date: formatUserDate(article.publishAt || article.createdAt, true),
});

export const contentApi = {
  settings: async () => request<{ success: true; data: { settings: PublicSiteSettings } }>("/content/settings"),
  legal: async () => request<{ success: true; data: { legal: PublicLegalContent } }>("/content/legal"),
  seo: async (path = "/") => request<{ success: true; data: SeoResolution }>(`/content/seo?path=${encodeURIComponent(path)}`),
  articles: async (params: { category?: string; search?: string; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    query.set("limit", String(params.limit || 20));
    const result = await request<{ success: true; data: { items: PublicNewsArticle[]; total: number; totalPages: number } }>(`/content/articles?${query.toString()}`);
    return { ...result, data: { ...result.data, items: result.data.items.map(withLocalDate) } };
  },
  article: async (key: string) => {
    const result = await request<{ success: true; data: { article: PublicNewsArticle } }>(`/content/articles/${encodeURIComponent(key)}`);
    return { ...result, data: { article: withLocalDate(result.data.article) } };
  },
};
