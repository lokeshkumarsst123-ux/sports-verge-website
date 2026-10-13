import { API_BASE_URL } from "@/lib/api-config";

export type SearchType = "all" | "articles" | "teams" | "competitions" | "matches" | "players" | "categories";
export type SearchSport = "all" | "cricket" | "football" | "nfl";
export type SearchMode = "all" | "exact" | "partial" | "keyword";
export type MatchScope = "all" | "live" | "fixture" | "result";

export type SearchItem = {
  id: string;
  type: "article" | "team" | "competition" | "match" | "player" | "category";
  title: string;
  description?: string;
  sport?: string;
  category?: string;
  competition?: string;
  status?: string;
  date?: string;
  venue?: string;
  image?: string;
  href?: string;
  matchType?: "exact" | "partial" | "keyword";
  homeTeam?: { name: string; logo?: string; sport?: string };
  awayTeam?: { name: string; logo?: string; sport?: string };
};

export type SearchResponse = {
  query: string;
  filters: { type: SearchType; sport: SearchSport; mode: SearchMode; matchScope: MatchScope; category: string | null };
  items: SearchItem[];
  counts: { articles: number; teams: number; competitions: number; matches: number; players: number; categories: number };
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  providers: Array<{ sport: string; dataset: string; status: "available" | "unavailable"; source?: string | null; stale?: boolean }>;
};

export type SearchParams = {
  q: string;
  type?: SearchType;
  sport?: SearchSport;
  mode?: SearchMode;
  matchScope?: MatchScope;
  category?: string;
  page?: number;
  limit?: number;
};

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error?.message || "Unable to search sports content.");
  return payload as T;
};

export const searchApi = {
  search: async (params: SearchParams) => {
    const query = new URLSearchParams();
    query.set("q", params.q);
    if (params.type && params.type !== "all") query.set("type", params.type);
    if (params.sport && params.sport !== "all") query.set("sport", params.sport);
    if (params.mode && params.mode !== "all") query.set("mode", params.mode);
    if (params.matchScope && params.matchScope !== "all") query.set("match_scope", params.matchScope);
    if (params.category) query.set("category", params.category);
    query.set("page", String(params.page || 1));
    query.set("limit", String(params.limit || 10));
    return request<{ success: true; data: SearchResponse }>(`/search?${query.toString()}`);
  },
};
