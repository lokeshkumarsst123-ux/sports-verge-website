import { API_BASE_URL } from "@/lib/api-config";

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  isActive: boolean;
  lastLoginAt?: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  articleCount: number;
};

export type Article = {
  editorialLayout?: import('./content-api').EditorialLayout;
  id: string;
  headline: string;
  summary: string;
  content: string;
  categoryId: string;
  categoryName: string;
  featuredImage?: string | null;
  slug: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  tags: string[];
  canonicalUrl?: string | null;
  status: "draft" | "published" | "scheduled" | "archived";
  publishAt?: string | null;
  publishTimezone?: string | null;
  viewCount: number;
  author: string;
  createdAt: string;
  updatedAt?: string;
};

export type Advertisement = {
  id: string;
  title: string;
  imageUrl: string;
  destinationUrl: string;
  placement: string;
  status: "active" | "inactive";
  effectiveStatus?: string;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUserRow = AdminUser & { emailAlerts: boolean; pushNotifications: boolean; favoriteTeams?: string[]; favoriteCompetitions?: string[]; createdAt: string; updatedAt: string };
export type AdminUserDetails = { user: AdminUserRow; loginHistory: Array<{ id: string; email: string; wasSuccessful: boolean; ipAddress?: string | null; userAgent?: string | null; createdAt: string }> };
export type AdminActivity = { id: string; action: string; entityType: string; entityId?: string | null; metadata: Record<string, unknown>; createdAt: string; actor?: string };
export type DashboardData = { users: Record<string, number>; content: Record<string, number>; categories: Record<string, number>; advertisements: Record<string, number>; integrations: Record<string, number>; topArticles: Array<{ id: string; headline: string; category: string; status: Article["status"]; viewCount?: number; view_count?: number }>; recentActivity: AdminActivity[]; activityTrend?: Array<{ label: string; date: string; count: number }> };
export type ApiIntegration = { id: string; name: string; provider: string; sport: "cricket" | "football" | "nfl" | "general"; baseUrl?: string | null; isEnabled: boolean; status: "healthy" | "degraded" | "down" | "unknown"; lastSyncAt?: string | null; lastError?: string | null };
export type ContactInquiry = { id: string; fullName: string; email: string; subject: string; message: string; status: "new" | "in_progress" | "resolved" | "archived"; createdAt: string; updatedAt: string };
export type GeneralSettings = { websiteName: string; logoUrl?: string | null; contactEmail?: string | null; contactNumber?: string | null; socialLinks: Record<string, string> };
export type LegalContent = { termsOfService?: string | null; privacyPolicy?: string | null; updatedAt?: string | null };
export type SeoSettings = { seoTitle?: string | null; seoDescription?: string | null; seoKeywords?: string | null; canonicalUrl?: string | null; ogTitle?: string | null; ogDescription?: string | null; ogUrl?: string | null; ogType?: "website" | "article" | "profile"; ogImageUrl?: string | null; structuredData?: Record<string, unknown> | null; sitemapEnabled: boolean };
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
export type PlatformSettings = GeneralSettings & SeoSettings;

export type ApiError = { error?: { message?: string; details?: Array<{ field: string; message: string }> } };

const getSession = () => {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(sessionStorage.getItem("admin_session") || "null"); } catch { return null; }
};

export const getAdminSession = () => getSession() as { accessToken: string; user: AdminUser } | null;

export const updateAdminStoredUser = (user: AdminUser) => {
  if (typeof window === "undefined") return;
  const session = getSession();
  if (session?.accessToken) sessionStorage.setItem("admin_session", JSON.stringify({ ...session, user }));
};

async function request<T>(path: string, options: RequestInit = {}) {
  const session = getSession();
  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (isFormData) headers.delete("Content-Type");
  else headers.set("Content-Type", "application/json");
  if (session?.accessToken) headers.set("Authorization", `Bearer ${session.accessToken}`);
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store", ...options, headers });
  const payload = (await response.json().catch(() => ({}))) as T & ApiError;
  if (!response.ok) {
    const message = payload.error?.message || "The admin request could not be completed.";
    throw new Error(message);
  }
  return payload as T;
}

const json = (body: unknown): RequestInit => ({ method: "POST", body: JSON.stringify(body) });

export const adminApi = {
  login: (body: { email: string; password: string }) => request<{ success: true; data: { accessToken: string; user: AdminUser } }>("/admin/auth/login", json(body)),
  me: () => request<{ success: true; data: { user: AdminUser } }>("/admin/auth/me"),
  logout: () => request("/admin/auth/logout", { method: "POST" }),
  updateProfile: (body: { firstName: string; lastName: string; email: string }) => request<{ success: true; data: { user: AdminUser } }>("/users/profile", { method: "PATCH", body: JSON.stringify(body) }),
  changePassword: (body: { currentPassword: string; newPassword: string; confirmPassword: string }) => request<{ success: true; data: { user: AdminUser } }>("/users/profile/password", { method: "PATCH", body: JSON.stringify(body) }),
  dashboard: () => request<{ success: true; data: DashboardData }>("/admin/dashboard"),
  users: (query = "") => request<{ success: true; data: { items: AdminUserRow[]; total: number; totalPages: number } }>(`/admin/users${query ? `?${query}` : ""}`),
  user: (id: string) => request<{ success: true; data: AdminUserDetails }>(`/admin/users/${id}`),
  setUserStatus: (id: string, isActive: boolean) => request(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ isActive }), headers: { "Content-Type": "application/json" } }),
  resetUserPassword: (id: string, password: string) => request(`/admin/users/${id}/password`, { method: "PATCH", body: JSON.stringify({ password }), headers: { "Content-Type": "application/json" } }),
  updateUserPreferences: (id: string, body: Pick<AdminUserRow, "emailAlerts" | "pushNotifications" | "favoriteTeams" | "favoriteCompetitions">) => request<{ success: true; data: { user: AdminUserRow } }>(`/admin/users/${id}/preferences`, { method: "PATCH", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
  deleteUser: (id: string) => request(`/admin/users/${id}`, { method: "DELETE" }),
  articles: (query = "") => request<{ success: true; data: { items: Article[]; total: number; page: number; limit: number; totalPages: number } }>(`/admin/articles${query ? `?${query}` : ""}`),
  article: (id: string) => request<{ success: true; data: { article: Article } }>(`/admin/articles/${id}`),
  createArticle: (body: FormData) => request<{ success: true; data: { article: Article } }>("/admin/articles", { method: "POST", body }),
  updateArticle: (id: string, body: FormData) => request<{ success: true; data: { article: Article } }>(`/admin/articles/${id}`, { method: "PATCH", body }),
  deleteArticle: (id: string) => request(`/admin/articles/${id}`, { method: "DELETE" }),
  categories: () => request<{ success: true; data: { categories: Category[] } }>("/admin/categories"),
  createCategory: (body: unknown) => request<{ success: true; data: { category: Category } }>("/admin/categories", json(body)),
  updateCategory: (id: string, body: unknown) => request<{ success: true; data: { category: Category } }>(`/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
  advertisements: () => request<{ success: true; data: { advertisements: Advertisement[] } }>("/admin/advertisements"),
  advertisement: (id: string) => request<{ success: true; data: { advertisement: Advertisement } }>(`/admin/advertisements/${id}`),
  createAdvertisement: (body: FormData) => request<{ success: true; data: { advertisement: Advertisement } }>("/admin/advertisements", { method: "POST", body }),
  updateAdvertisement: (id: string, body: FormData) => request<{ success: true; data: { advertisement: Advertisement } }>(`/admin/advertisements/${id}`, { method: "PATCH", body }),
  deleteAdvertisement: (id: string) => request(`/admin/advertisements/${id}`, { method: "DELETE" }),
  settings: () => request<{ success: true; data: { settings: GeneralSettings } }>("/admin/settings"),
  updateSettings: (body: GeneralSettings | FormData) => request<{ success: true; data: { settings: GeneralSettings } }>("/admin/settings", body instanceof FormData ? { method: "PATCH", body } : { method: "PATCH", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
  seoSettings: () => request<{ success: true; data: { settings: SeoSettings } }>("/admin/seo-settings"),
  updateSeoSettings: (body: SeoSettings) => request<{ success: true; data: { settings: SeoSettings } }>("/admin/seo-settings", { method: "PATCH", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
  legalContent: () => request<{ success: true; data: { legal: LegalContent } }>("/admin/legal-content"),
  updateLegalContent: (body: Pick<LegalContent, "termsOfService" | "privacyPolicy">) => request<{ success: true; data: { legal: LegalContent } }>("/admin/legal-content", { method: "PATCH", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
  seoPages: () => request<{ success: true; data: { pages: SeoPageRule[] } }>("/admin/seo-pages"),
  seoPage: (id: string) => request<{ success: true; data: { page: SeoPageRule } }>(`/admin/seo-pages/${id}`),
  createSeoPage: (body: Omit<SeoPageRule, "id" | "normalizedPath" | "createdAt" | "updatedAt">) => request<{ success: true; data: { page: SeoPageRule } }>("/admin/seo-pages", { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
  updateSeoPage: (id: string, body: Partial<Omit<SeoPageRule, "id" | "normalizedPath" | "createdAt" | "updatedAt">>) => request<{ success: true; data: { page: SeoPageRule } }>(`/admin/seo-pages/${id}`, { method: "PATCH", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
  deleteSeoPage: (id: string) => request<{ success: true; data: { deleted: true } }>(`/admin/seo-pages/${id}`, { method: "DELETE" }),
  integrations: () => request<{ success: true; data: { integrations: ApiIntegration[] } }>("/admin/integrations"),
  updateIntegration: (id: string, body: unknown) => request(`/admin/integrations/${id}`, { method: "PATCH", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
  inquiries: (status = "all") => request<{ success: true; data: { inquiries: ContactInquiry[] } }>(`/admin/inquiries?status=${encodeURIComponent(status)}`),
  updateInquiryStatus: (id: string, status: string) => request(`/admin/inquiries/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }), headers: { "Content-Type": "application/json" } }),
};
