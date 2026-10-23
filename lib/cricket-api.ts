/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_BASE_URL } from "@/lib/api-config";
import type { LiveScoreMatchDetail } from "@/types";

type EntityRecord = Record<string, any>;

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error?.message || "Unable to load cricket data.");
  }
  return payload?.data as T;
};

const firstValue = (...values: unknown[]) => values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");

const entityItems = (data: EntityRecord | EntityRecord[] | undefined, keys: string[]) => {
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key] as EntityRecord[];
  }
  return [];
};

const asText = (value: unknown, fallback = "") => String(firstValue(value, fallback) ?? fallback);

const teamFrom = (team: EntityRecord | undefined) => ({
  id: asText(team?.team_id),
  name: asText(firstValue(team?.name, team?.short_name), "Unknown team"),
  shortName: asText(firstValue(team?.short_name, team?.name), "Team"),
  logo: asText(firstValue(team?.logo_url, team?.thumb_url), "/assets/imgs/teams/team-placeholder.svg"),
  score: asText(firstValue(team?.scores_full, team?.scores), "—"),
  overs: team?.overs !== undefined && team?.overs !== null ? asText(team.overs) : "",
});

const getMatchInfo = (raw: EntityRecord) => raw?.match_info || raw;

const statusText = (raw: EntityRecord) => asText(firstValue(raw?.status_str, raw?.live?.status_str, raw?.match_info?.status_str), "Scheduled");

const statusCode = (raw: EntityRecord) => Number(firstValue(raw?.status, raw?.match_info?.status));

const isCompletedStatus = (raw: EntityRecord) => {
  const status = statusText(raw).toLowerCase();
  return statusCode(raw) === 2 || status.includes("complete") || status.includes("result") || status.includes("finish");
};

const isLiveStatus = (raw: EntityRecord) => {
  const status = statusText(raw).toLowerCase();
  return Boolean(raw?.live) || status.includes("live") || status.includes("in progress") || status.includes("innings") || status.includes("break") || status.includes("delayed");
};

export const mapCricketMatch = (raw: EntityRecord): LiveScoreMatchDetail => {
  const info = getMatchInfo(raw);
  const team1 = teamFrom(info.teama);
  const team2 = teamFrom(info.teamb);
  const competition = info.competition || raw.competition || {};
  const status = statusText(raw);
  const liveNote = firstValue(raw?.live?.status_note, info?.live, info?.status_note, info?.result);

  return {
    id: asText(firstValue(raw?.match_id, info?.match_id, raw?.mid), "unknown"),
    sport: "cricket",
    competitionName: asText(firstValue(competition.title, competition.name), "Cricket"),
    matchName: asText(firstValue(info.subtitle, info.title, info.short_title), "Cricket match"),
    team1Logo: team1.logo,
    team1Name: team1.name,
    team1Score: team1.score,
    team1Overs: team1.overs,
    team2Logo: team2.logo,
    team2Name: team2.name,
    team2Score: team2.score,
    team2Overs: team2.overs,
    matchStatus: isLiveStatus(raw) ? (status.toUpperCase() || "LIVE") : status.toUpperCase(),
    matchTime: asText(firstValue(info.date_start_ist, info.date_start, info.status_note), "—"),
    venue: asText(firstValue(info.venue?.name, info.venue?.location), "Venue unavailable"),
    lastUpdated: asText(firstValue(raw?.modified, raw?.datetime, raw?.last_updated), "Just now"),
    note: asText(liveNote),
  };
};

const dateParts = (rawDate: unknown) => {
  const value = asText(rawDate);
  const parsed = new Date(value.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) {
    return { day: "Upcoming", date: value || "Date unavailable", time: "Time unavailable" };
  }

  const day = parsed.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" });
  const date = parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const time = parsed.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  return { day, date, time };
};

export type CricketFixtureRecord = {
  id: string;
  sport: "Cricket";
  league: string;
  home: string;
  away: string;
  homeLogo: string;
  awayLogo: string;
  day: string;
  date: string;
  time: string;
  venue: string;
  status: "upcoming" | "live" | "completed";
};

export const mapCricketFixture = (raw: EntityRecord): CricketFixtureRecord => {
  const info = getMatchInfo(raw);
  const team1 = teamFrom(info.teama);
  const team2 = teamFrom(info.teamb);
  const competition = info.competition || {};
  const parts = dateParts(firstValue(info.date_start_ist, info.date_start));

  return {
    id: asText(firstValue(raw?.match_id, info?.match_id), "unknown"),
    sport: "Cricket",
    league: [asText(firstValue(competition.title, "Cricket")), asText(firstValue(info.subtitle, info.format_str))].filter(Boolean).join(" • "),
    home: team1.name,
    away: team2.name,
    homeLogo: team1.logo,
    awayLogo: team2.logo,
    day: parts.day,
    date: parts.date,
    time: parts.time,
    venue: asText(firstValue(info.venue?.name, info.venue?.location), "Venue unavailable"),
    status: isLiveStatus(raw) ? "live" : isCompletedStatus(raw) ? "completed" : "upcoming",
  };
};

export type CricketResultRecord = {
  id: string;
  sport: "Cricket";
  league: string;
  home: string;
  away: string;
  homeLogo: string;
  awayLogo: string;
  homeScore: string;
  awayScore: string;
  result: string;
  date: string;
};

export const mapCricketResult = (raw: EntityRecord): CricketResultRecord => {
  const info = getMatchInfo(raw);
  const team1 = teamFrom(info.teama);
  const team2 = teamFrom(info.teamb);
  const competition = info.competition || {};
  const parts = dateParts(firstValue(info.date_start_ist, info.date_start));

  return {
    id: asText(firstValue(raw?.match_id, info?.match_id), "unknown"),
    sport: "Cricket",
    league: [asText(firstValue(competition.title, competition.name), "Cricket"), asText(firstValue(info.subtitle, info.format_str))].filter(Boolean).join(" • "),
    home: team1.name,
    away: team2.name,
    homeLogo: team1.logo,
    awayLogo: team2.logo,
    homeScore: team1.score,
    awayScore: team2.score,
    result: asText(firstValue(raw?.result, info?.result, raw?.status_note, info?.status_note), statusText(raw)),
    date: parts.date,
  };
};

export type CricketApiMatchInfo = EntityRecord;

export type CricketCompetitionPage = {
  items: EntityRecord[];
  page: number;
  totalPages: number;
  totalItems: number;
};

export type CricketBettingOddsCard = {
  id: string;
  competition: string;
  label: string;
  home: string;
  away: string;
  homeOdds: string;
  drawOdds: string;
  awayOdds: string;
  status: string;
};

export type CricketBettingOddsPage = {
  items: CricketBettingOddsCard[];
  page: number;
  limit: number;
  hasNextPage: boolean;
};

const paginationNumber = (data: EntityRecord | undefined, keys: string[], fallback: number) => {
  for (const key of keys) {
    const value = Number(data?.[key] ?? data?.pagination?.[key] ?? data?.meta?.[key]);
    if (Number.isFinite(value) && value >= 0) return Math.floor(value);
  }
  return fallback;
};

const loadCompetitionPage = async (id: string, page: number, status?: string): Promise<CricketCompetitionPage> => {
  const query = new URLSearchParams({ per_page: "9", paged: String(page) });
  if (status) query.set("status", status);
  const data = await request<EntityRecord>(`/cricket/competitions/${encodeURIComponent(id)}/matches?${query.toString()}`);
  const items = entityItems(data, ["items", "matches"]);
  return {
    items,
    page: paginationNumber(data, ["page", "current_page"], page),
    totalPages: paginationNumber(data, ["total_pages", "pages"], 1),
    totalItems: paginationNumber(data, ["total_items", "total"], items.length),
  };
};

export const cricketApi = {
  competitions: (query = "") => request<EntityRecord>(`/cricket/competitions${query ? `?${query}` : ""}`),
  competitionsAll: async () => {
    const first = await request<EntityRecord>("/cricket/competitions?per_page=50&paged=1");
    const items = cricketItems(first);
    const totalPages = Math.min(paginationNumber(first, ["total_pages", "pages"], 1), 20);
    if (totalPages <= 1) return items;
    const pages = await Promise.all(Array.from({ length: totalPages - 1 }, (_, index) => request<EntityRecord>(`/cricket/competitions?per_page=50&paged=${index + 2}`)));
    return [first, ...pages].flatMap((page) => cricketItems(page));
  },
  competition: (id: string) => request<EntityRecord>(`/cricket/competitions/${encodeURIComponent(id)}`),
  competitionMatches: (id: string, query = "") => request<EntityRecord>(`/cricket/competitions/${encodeURIComponent(id)}/matches${query ? `?${query}` : ""}`),
  competitionMatchesPage: (id: string, page = 1, status?: string) => loadCompetitionPage(id, page, status),
  competitionMatchesAll: async (id: string) => {
    const first = await loadCompetitionPage(id, 1);
    if (first.totalPages <= 1) return first.items;
    const pages = await Promise.all(Array.from({ length: Math.min(first.totalPages, 20) - 1 }, (_, index) => loadCompetitionPage(id, index + 2)));
    return [first, ...pages].flatMap((page) => page.items);
  },
  matches: async (scope: "live" | "fixture" | "result" | "all" = "all") => {
    const query = scope === "all" ? "" : `?scope=${scope}`;
    const data = await request<EntityRecord>(`/cricket/matches${query}`);
    return entityItems(data, ["items", "matches"]);
  },
  bettingOddsPage: (page = 1, limit = 5) => request<CricketBettingOddsPage>(`/cricket/betting-odds?page=${page}&limit=${limit}`),
  match: (id: string) => request<CricketApiMatchInfo>(`/cricket/matches/${encodeURIComponent(id)}`),
  odds: (id: string) => request<EntityRecord>(`/cricket/matches/${encodeURIComponent(id)}/odds`),
  commentary: (id: string, inning = 1) => request<EntityRecord>(`/cricket/matches/${encodeURIComponent(id)}/commentary?inning=${inning}`),
  statistics: (id: string) => request<EntityRecord>(`/cricket/matches/${encodeURIComponent(id)}/statistics`),
  ballEvent: (id: string) => request<EntityRecord>(`/cricket/matches/${encodeURIComponent(id)}/ballevent`),
  rankings: () => request<EntityRecord>("/cricket/rankings"),
  competitionStats: (id: string, statType?: string) => request<EntityRecord>(`/cricket/competitions/${encodeURIComponent(id)}/stats${statType ? `/${encodeURIComponent(statType)}` : ""}`),
  streamUrl: () => `${API_BASE_URL}/cricket/live-stream`,
};

export const cricketItems = (data: EntityRecord | undefined) => entityItems(data, ["items", "matches", "competitions"]);

export type CricketRankingGroup = {
  category: string;
  list: { rank: number | string; name: string; logo: string; points: string; rating?: string; change: string; trend: "up" | "down" | "flat" }[];
};

const rankingList = (value: unknown) => {
  if (Array.isArray(value)) return value as EntityRecord[];
  if (value && typeof value === "object") {
    const record = value as EntityRecord;
    for (const key of ["tests", "odis", "t20s", "test", "odi", "t20"]) {
      if (Array.isArray(record[key])) return record[key] as EntityRecord[];
    }
  }
  return [];
};

const makeRankingGroup = (category: string, source: unknown): CricketRankingGroup | null => {
  const list = rankingList(source).map((item, index) => {
    const rawChange = firstValue(item.change, item.change_in_rank, item.difference, item.trend, "");
    const numericChange = Number(rawChange);
    return {
      rank: Number(firstValue(item.rank, index + 1)),
      name: asText(firstValue(item.team, item.name, item.player), "Unknown"),
      logo: asText(firstValue(item.logo, item.logo_url, item.thumb_url), "/assets/imgs/teams/team-placeholder.svg"),
      points: asText(firstValue(item.points, item.point), "—"),
      rating: asText(firstValue(item.rating), "") || undefined,
      change: rawChange === "" ? "—" : asText(rawChange),
      trend: Number.isFinite(numericChange) && numericChange > 0 ? "up" : Number.isFinite(numericChange) && numericChange < 0 ? "down" : "flat",
    } as const;
  });
  return list.length ? { category, list } : null;
};

export const mapCricketRankingGroups = (data: EntityRecord): CricketRankingGroup[] => {
  const ranks = data?.ranks || data || {};
  const teams = ranks.teams || {};
  return [
    makeRankingGroup("ICC Men's Test Team Rankings", teams.tests || teams.test || ranks.tests),
    makeRankingGroup("ICC Men's ODI Team Rankings", teams.odis || teams.odi || ranks.odis),
    makeRankingGroup("ICC Men's T20 Team Rankings", teams.t20s || teams.t20 || ranks.t20s),
  ].filter((group): group is CricketRankingGroup => Boolean(group));
};

export type CricketStandingRow = {
  rank: string;
  team: string;
  teamLogo: string;
  p: string;
  w: string;
  l: string;
  pts: string;
  nrr: string;
  nr: string;
};

export const findCricketCompetition = (data: EntityRecord, terms: string[], season?: string) => {
  const normalizedTerms = terms.map((term) => term.toLowerCase());
  return cricketItems(data).find((item) => {
    const name = asText(firstValue(item.title, item.name, item.cname)).toLowerCase();
    return normalizedTerms.some((term) => name.includes(term)) && (!season || name.includes(season.toLowerCase()) || asText(item.season).includes(season));
  });
};

export const mapCompetitionStandings = (data: EntityRecord): CricketStandingRow[] => {
  const standing = data?.standing || {};
  const groups = Array.isArray(standing?.standings) ? standing.standings : [];
  const rows = groups.flatMap((group: EntityRecord) => Array.isArray(group?.standings) ? group.standings : []);
  return rows.map((row: EntityRecord, index: number) => ({
    rank: asText(firstValue(row.rank, index + 1)),
    team: asText(firstValue(row.team?.title, row.team?.name, row.team_name), "Unknown team"),
    teamLogo: asText(firstValue(row.team?.logo_url, row.team?.thumb_url), "/assets/imgs/teams/team-placeholder.svg"),
    p: asText(firstValue(row.played, row.matches), "0"),
    w: asText(firstValue(row.win, row.wins), "0"),
    l: asText(firstValue(row.loss, row.losses), "0"),
    pts: asText(firstValue(row.points, row.pts), "0"),
    nrr: asText(firstValue(row.netrr, row.nrr), "0.000"),
    nr: asText(firstValue(row.nr, row.no_result, row.noresults), "0"),
  }));
};
