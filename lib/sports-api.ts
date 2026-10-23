/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_BASE_URL } from "@/lib/api-config";
import type { FixtureItem, LiveScoreMatchDetail, NFLMatchStatus, ResultItem } from "@/types";

type EntityRecord = Record<string, any>;
type Sport = "soccer" | "nfl";
type Scope = "live" | "fixture" | "result" | "all";

const PLACEHOLDER = "/assets/imgs/teams/team-placeholder.svg";

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const rawMsg = payload?.error?.message || "Unable to load sports data.";
    const userFriendlyMsg = /Route .* was not found/i.test(rawMsg)
      ? "Player statistics are currently not available for this competition."
      : rawMsg;
    throw new Error(userFriendlyMsg);
  }
  return payload?.data as T;
};

const firstValue = (...values: unknown[]) => values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");
const asText = (value: unknown, fallback = "") => String(firstValue(value, fallback) ?? fallback);
const asNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const entityItems = (data: EntityRecord | EntityRecord[] | undefined, keys = ["items", "matches", "competitions"]) => {
  if (Array.isArray(data)) return data;
  for (const key of keys) if (Array.isArray(data?.[key])) return data[key] as EntityRecord[];
  return [];
};

const detailItem = (data: EntityRecord | undefined) => {
  if (!data || typeof data !== "object") return {};
  if (data.items && !Array.isArray(data.items)) return data.items as EntityRecord;
  if (data.match_info && !Array.isArray(data.match_info)) return data;
  return entityItems(data, ["items"])[0] || data;
};

const matchPayload = (raw: EntityRecord) => {
  const source = raw?.items && !Array.isArray(raw.items) ? raw.items : raw;
  const info = Array.isArray(source?.match_info) ? source.match_info[0] : source?.match_info;
  return info && typeof info === "object" ? { ...source, ...info, match_info: info } : source;
};

const logo = (value: unknown) => asText(value, PLACEHOLDER) || PLACEHOLDER;
const team = (value: EntityRecord | undefined) => ({
  id: asText(firstValue(value?.tid, value?.team_id, value?.id)),
  name: asText(firstValue(value?.tname, value?.fullname, value?.name, value?.short_name), "Unknown team"),
  logo: logo(firstValue(value?.logo, value?.logo_url, value?.thumb_url)),
});

const teamsFrom = (raw: EntityRecord) => {
  const source = raw?.teams || raw?.match_info?.teams || {};
  return { home: team(source.home), away: team(source.away) };
};

const competitionFrom = (raw: EntityRecord) => raw?.competition || raw?.match_info?.competition || {};
const dateValue = (raw: EntityRecord) => firstValue(raw?.datestart, raw?.date_start, raw?.date, raw?.timestampstart);

const dateParts = (value: unknown) => {
  const raw = asText(value);
  const parsed = new Date(raw.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) return { day: "Upcoming", date: raw || "Date unavailable", time: "Time unavailable" };
  return {
    day: parsed.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" }),
    date: parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    time: parsed.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
  };
};

const rawStatus = (raw: EntityRecord) => asText(firstValue(raw?.status_str, raw?.gamestate_str, raw?.match_info?.status_str), "Scheduled");
const rawStatusCode = (raw: EntityRecord) => asNumber(firstValue(raw?.status, raw?.match_info?.status), 0);
const isLive = (raw: EntityRecord) => rawStatusCode(raw) === 3 || /live|ongoing|progress|quarter|half|playing/i.test(rawStatus(raw));
const isFinished = (raw: EntityRecord) => rawStatusCode(raw) === 2 || /finish|result|complete|ended|final/i.test(rawStatus(raw));

const scoreFrom = (raw: EntityRecord, side: "home" | "away") => {
  const result = raw?.result || raw?.match_info?.result || {};
  const periods = raw?.periods || raw?.match_info?.periods || raw?.querter || raw?.match_info?.querter || {};
  const finalPeriod = periods.ft || periods.final || periods.p2 || periods.q4 || {};
  return asText(firstValue(result[side], finalPeriod[side], raw?.teams?.[side]?.score), "—");
};

const statusLabel = (raw: EntityRecord) => {
  if (isLive(raw)) return "LIVE";
  if (isFinished(raw)) return "FINISHED";
  if (rawStatusCode(raw) === 4 || /cancel|postpon/i.test(rawStatus(raw))) return "CANCELLED";
  return rawStatus(raw).toUpperCase();
};

const commonMatch = (raw: EntityRecord, sport: "football" | "NFL"): LiveScoreMatchDetail => {
  const info = matchPayload(raw);
  const pair = teamsFrom(info);
  const competition = competitionFrom(info);
  const parts = dateParts(dateValue(info));
  const status = statusLabel(raw);
  const matchName = asText(firstValue(info?.round, info?.match_number, info?.gamestate_str), `${pair.home.name} vs ${pair.away.name}`);
  const id = asText(firstValue(raw?.mid, info?.mid, raw?.match_id, info?.match_id), "unknown");

  return {
    id,
    sport,
    competitionName: asText(firstValue(competition?.cname, competition?.name, competition?.title), sport === "NFL" ? "NFL" : "Football"),
    matchName,
    team1Logo: pair.home.logo,
    team1Name: pair.home.name,
    team1Score: scoreFrom(info, "home"),
    team2Logo: pair.away.logo,
    team2Name: pair.away.name,
    team2Score: scoreFrom(info, "away"),
    matchStatus: status,
    matchTime: isLive(info) ? asText(firstValue(info?.time, info?.gamestate_str), "Live") : parts.time,
    venue: asText(firstValue(info?.venue?.name, info?.venue?.location, info?.stadium), "Venue unavailable"),
    lastUpdated: "Just now",
    note: asText(firstValue(info?.result?.text, info?.result?.winner ? `Winner: ${info.result.winner}` : "")),
  };
};

const footballEventType = (value: unknown) => {
  const type = asText(value).toLowerCase();
  if (type.includes("yellow")) return "yellow_card";
  if (type.includes("red")) return "red_card";
  if (type.includes("sub")) return "substitution";
  if (type.includes("penalty")) return "penalty";
  if (type.includes("own")) return "own_goal";
  if (type.includes("var")) return "var";
  return "goal";
};

export const mapSoccerMatch = (raw: EntityRecord): LiveScoreMatchDetail => {
  const match = commonMatch(raw, "football");
  const info = matchPayload(raw);
  const events = Array.isArray(raw?.event) ? raw.event : Array.isArray(raw?.items?.event) ? raw.items.event : Array.isArray(info?.event) ? info.event : [];
  const timeline = events.map((event: EntityRecord) => ({
    minute: `${asText(firstValue(event.time, event.minute), "—")}'`,
    type: footballEventType(event.type) as "goal",
    player: asText(firstValue(event.name, event.player), "Unknown"),
    team: String(event.team).toLowerCase() === "away" ? 2 : String(event.team).toLowerCase() === "home" ? 1 : null,
    detail: asText(firstValue(event.assists, event.text, event.type)),
  }));
  const goals = timeline.filter((event: typeof timeline[number]) => event.type === "goal").map((event: typeof timeline[number]) => ({
    minute: event.minute,
    player: event.player || "Unknown",
    team: (event.team || 1) as 1 | 2,
  }));

  return {
    ...match,
    footballMatchStatus: (match.matchStatus === "LIVE" ? "Kick Off" : match.matchStatus === "FINISHED" ? "Finished" : "Scheduled") as LiveScoreMatchDetail["footballMatchStatus"],
    matchWeek: asText(firstValue(info?.round, info?.match_number), ""),
    stadium: asText(firstValue(info?.venue?.name, info?.venue?.location), match.venue),
    referee: asText(firstValue(info?.referee?.name, info?.referee), ""),
    currentMinute: isLive(info) ? asText(firstValue(info?.time, info?.seconds), "Live") : "",
    footballTimeline: timeline,
    footballEventsSummary: events.length ? {
      goals,
      yellowCards: [],
      redCards: [],
      penalties: [],
      ownGoals: [],
      varDecisions: [],
      substitutions: { team1Count: 0, team2Count: 0 },
    } : undefined,
  };
};

const nflTextStatus = (value: string) => {
  if (/final|ended|complete|result/i.test(value)) return "Final";
  if (/half|break/i.test(value)) return "Halftime";
  if (/1st|first/i.test(value)) return "1st Quarter";
  if (/2nd|second/i.test(value)) return "2nd Quarter";
  if (/3rd|third/i.test(value)) return "3rd Quarter";
  if (/4th|fourth/i.test(value)) return "4th Quarter";
  return "Scheduled";
};

const nflTeamStats = (raw: EntityRecord | undefined) => ({
  firstDowns: asNumber(raw?.totalfirst_down),
  totalYards: asNumber(raw?.total_yard_yard),
  passingYards: asNumber(raw?.passes_yard_gross_yard),
  rushingYards: asNumber(raw?.rushing_yard),
  turnovers: asNumber(raw?.passes_interception) + asNumber(raw?.total_interception_return),
  thirdDownEff: `${asNumber(raw?.third_down_efficiency_convert)}/${asNumber(raw?.third_down_efficiency_attempted)}`,
  fourthDownEff: "—",
  redZoneEff: "—",
  timeOfPossession: asText(raw?.possession_time, "—"),
  penalties: asNumber(raw?.penalties),
  penaltyYards: asNumber(raw?.penalty_yards),
  sacks: asNumber(raw?.passes_sack),
  interceptions: asNumber(raw?.passes_interception),
});

export const mapNflMatch = (raw: EntityRecord): LiveScoreMatchDetail => {
  const match = commonMatch(raw, "NFL");
  const info = matchPayload(raw);
  const status = nflTextStatus(rawStatus(info));
  const quarters = info?.querter || {};
  const stats = Array.isArray(raw?.team_stats) ? raw.team_stats : [];
  const nflData: NonNullable<LiveScoreMatchDetail["nflData"]> = {
    nflStatus: status as NFLMatchStatus,
    season: asText(firstValue(info?.season, info?.competition?.season), "—"),
    week: asText(firstValue(info?.week, info?.round), "—"),
    matchDate: asText(dateValue(info), "—"),
    kickoffTime: dateParts(dateValue(info)).time,
    city: asText(firstValue(info?.venue?.location, info?.venue?.city), "—"),
    stadium: asText(firstValue(info?.venue?.name, info?.stadium), match.venue),
    quarter: 0,
    gameClock: asText(firstValue(info?.time, info?.seconds), "—"),
    possession: null,
    downAndDistance: "—",
    ballPosition: "—",
    timeoutsTeam1: 0,
    timeoutsTeam2: 0,
    team1Record: "—",
    team2Record: "—",
    quarterScores: {
      team1: { q1: asNumber(quarters.q1?.home), q2: asNumber(quarters.q2?.home), q3: asNumber(quarters.q3?.home), q4: asNumber(quarters.q4?.home), total: asNumber(match.team1Score) },
      team2: { q1: asNumber(quarters.q1?.away), q2: asNumber(quarters.q2?.away), q3: asNumber(quarters.q3?.away), q4: asNumber(quarters.q4?.away), total: asNumber(match.team2Score) },
    },
    team1Stats: nflTeamStats(stats[0]),
    team2Stats: nflTeamStats(stats[1]),
    passingLeader1: { name: "Not provided", completions: 0, attempts: 0, yards: 0, touchdowns: 0, interceptions: 0, rating: 0 },
    passingLeader2: { name: "Not provided", completions: 0, attempts: 0, yards: 0, touchdowns: 0, interceptions: 0, rating: 0 },
    rushingLeader1: { name: "Not provided", carries: 0, yards: 0, avg: 0, touchdowns: 0, long: 0 },
    rushingLeader2: { name: "Not provided", carries: 0, yards: 0, avg: 0, touchdowns: 0, long: 0 },
    receivingLeader1: { name: "Not provided", receptions: 0, yards: 0, long: 0, touchdowns: 0, avg: 0 },
    receivingLeader2: { name: "Not provided", receptions: 0, yards: 0, long: 0, touchdowns: 0, avg: 0 },
    scoringPlays: [],
    drives: [],
    plays: [],
    team1Roster: { startingOffense: [], startingDefense: [], specialTeams: [], bench: [], headCoach: "Not provided" },
    team2Roster: { startingOffense: [], startingDefense: [], specialTeams: [], bench: [], headCoach: "Not provided" },
  };

  return {
    ...match,
    matchStatus: status.toUpperCase(),
    nflData,
  };
};

const mapMatch = (sport: Sport, raw: EntityRecord) => sport === "soccer" ? mapSoccerMatch(raw) : mapNflMatch(raw);

const mapFixture = (sport: Sport, raw: EntityRecord): FixtureItem => {
  const mapped = mapMatch(sport, raw);
  const parts = dateParts(dateValue(raw));
  return {
    id: mapped.id,
    league: mapped.competitionName,
    home: mapped.team1Name,
    away: mapped.team2Name,
    homeLogo: mapped.team1Logo,
    awayLogo: mapped.team2Logo,
    day: parts.day,
    date: parts.date,
    time: parts.time,
    venue: mapped.venue,
    type: sport === "soccer" ? "football" : "NFL",
    sport: sport === "soccer" ? "Football" : "NFL",
    status: isLive(raw) ? "live" : isFinished(raw) ? "completed" : "upcoming",
  };
};

const mapResult = (sport: Sport, raw: EntityRecord): ResultItem => {
  const mapped = mapMatch(sport, raw);
  const parts = dateParts(dateValue(raw));
  return {
    id: mapped.id,
    league: mapped.competitionName,
    home: mapped.team1Name,
    away: mapped.team2Name,
    homeLogo: mapped.team1Logo,
    awayLogo: mapped.team2Logo,
    homeScore: mapped.team1Score,
    awayScore: mapped.team2Score,
    score: `${mapped.team1Score} - ${mapped.team2Score}`,
    result: mapped.note || mapped.matchStatus,
    date: parts.date,
    type: sport === "soccer" ? "football" : "NFL",
  };
};

export type ProviderStandingRow = {
  teamId?: string;
  rank: string;
  team: string;
  teamLogo: string;
  played: string;
  wins: string;
  draws?: string;
  losses: string;
  points: string;
  goalDifference: string;
  noResults?: string;
  ties?: string;
  percentage?: string;
  pointsFor?: string;
  pointsAgainst?: string;
  change: string;
  trend: "up" | "down" | "flat";
};

const standingMetricKeys = [
  "playedtotal", "played", "matches",
  "wintotal", "wins", "win",
  "losstotal", "losses", "loss",
  "drawtotal", "draws", "draw",
  "pointstotal", "points", "pts",
  "goaldifftotal", "goal_difference", "gd",
  "percentage", "pct", "win_percentage",
  "points_for", "pointsfor", "points_against", "pointsagainst",
];

const hasStandingMetrics = (row: EntityRecord | undefined) =>
  Boolean(row && standingMetricKeys.some((key) => row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== ""));

const standingRows = (data: EntityRecord | undefined): EntityRecord[] => {
  const source = detailItem(data);
  const pointTable = Array.isArray(source?.point_table) ? source.point_table : [];
  const tables = pointTable.flatMap((group: EntityRecord) => Object.values(group?.tables || {}));
  const candidates = [
    ...tables.flatMap((table: unknown) => Array.isArray(table) ? table : []),
    ...(Array.isArray(source?.standings) ? source.standings : []),
    ...(Array.isArray(source?.teams) && source.teams.some((row: EntityRecord) => hasStandingMetrics(row)) ? source.teams : []),
  ];
  return candidates.filter((row): row is EntityRecord => Boolean(row && typeof row === "object"));
};

export const mapProviderStandings = (data: EntityRecord | undefined): ProviderStandingRow[] => standingRows(data).map((row, index) => ({
  teamId: asText(firstValue(row.tid, row.team_id, row.team?.tid, row.team?.id)),
  rank: asText(firstValue(row.position, row.rank, index + 1)),
  team: asText(firstValue(row.tname, row.team_name, row.team?.name, row.name), "Unknown team"),
  teamLogo: logo(firstValue(row.logo, row.logo_url, row.teamlogo, row.team?.logo, row.team?.teamlogo)),
  played: asText(firstValue(row.playedtotal, row.played, row.matches), "0"),
  wins: asText(firstValue(row.wintotal, row.wins, row.win), "0"),
  draws: asText(firstValue(row.drawtotal, row.draws, row.draw), "0"),
  losses: asText(firstValue(row.losstotal, row.losses, row.loss), "0"),
  points: asText(firstValue(row.pointstotal, row.points, row.pts), "0"),
  goalDifference: asText(firstValue(row.goaldifftotal, row.goal_difference, row.gd), "0"),
  noResults: asText(firstValue(row.nr, row.no_result, row.noresults), "0"),
  ties: asText(firstValue(row.ties, row.drawtotal, row.draws, row.draw), "0"),
  percentage: asText(firstValue(row.percentage, row.pct, row.win_percentage), "0"),
  pointsFor: asText(firstValue(row.points_for, row.pointsfor, row.runs_for), "0"),
  pointsAgainst: asText(firstValue(row.points_against, row.pointsagainst, row.runs_against), "0"),
  change: asText(firstValue(row.change, row.change_in_rank, row.difference), "0"),
  trend: Number(row.change) > 0 ? "up" : Number(row.change) < 0 ? "down" : "flat",
}));

export const mapProviderRankingRows = (data: EntityRecord | undefined, matchesData: EntityRecord | undefined, sport: "football" | "NFL"): ProviderStandingRow[] => {
  const rows = mapProviderStandings(data);
  if (rows.length) return rows;

  const source = detailItem(data);
  const matches = entityItems(matchesData, ["items", "matches"]);
  const aggregates = new Map<string, EntityRecord>();

  const ensureTeam = (team: EntityRecord | undefined) => {
    const name = asText(firstValue(team?.name, team?.tname, team?.fullname, team?.short_name));
    if (!name) return null;
    const id = asText(firstValue(team?.id, team?.tid, team?.team_id, name));
    const existing = aggregates.get(id) || {
      id,
      name,
      logo: firstValue(team?.logo, team?.logo_url, team?.teamlogo),
      played: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      points: 0,
      pointsFor: 0,
      pointsAgainst: 0,
    };
    if (!existing.logo) existing.logo = firstValue(team?.logo, team?.logo_url, team?.teamlogo);
    aggregates.set(id, existing);
    return existing;
  };

  const teams: EntityRecord[] = Array.isArray(source?.teams) ? source.teams as EntityRecord[] : [];
  teams.forEach((team: EntityRecord) => { ensureTeam(team); });

  for (const match of matches) {
    const source = match?.teams || match?.match_info?.teams || {};
    const home = ensureTeam(source?.home);
    const away = ensureTeam(source?.away);
    if (!home || !away || !isFinished(match)) continue;

    const homeScore = asNumber(firstValue(match?.result?.home, match?.querter?.ft?.home, match?.scores?.home), Number.NaN);
    const awayScore = asNumber(firstValue(match?.result?.away, match?.querter?.ft?.away, match?.scores?.away), Number.NaN);
    if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore)) continue;

    home.played += 1;
    away.played += 1;
    home.pointsFor += homeScore;
    home.pointsAgainst += awayScore;
    away.pointsFor += awayScore;
    away.pointsAgainst += homeScore;

    if (homeScore > awayScore) {
      home.wins += 1;
      away.losses += 1;
    } else if (awayScore > homeScore) {
      away.wins += 1;
      home.losses += 1;
    } else {
      home.draws += 1;
      away.draws += 1;
    }
  }

  const ranked = Array.from(aggregates.values()).sort((left, right) => {
    const leftPct = left.played ? (left.wins + (left.draws * 0.5)) / left.played : 0;
    const rightPct = right.played ? (right.wins + (right.draws * 0.5)) / right.played : 0;
    const leftDiff = left.pointsFor - left.pointsAgainst;
    const rightDiff = right.pointsFor - right.pointsAgainst;
    return rightPct - leftPct
      || right.wins - left.wins
      || rightDiff - leftDiff
      || right.pointsFor - left.pointsFor
      || left.name.localeCompare(right.name);
  });

  return ranked.map((row, index) => ({
    teamId: asText(row.id),
    rank: String(index + 1),
    team: asText(row.name, "Unknown team"),
    teamLogo: logo(row.logo),
    played: asText(row.played, "0"),
    wins: asText(row.wins, "0"),
    draws: asText(row.draws, "0"),
    losses: asText(row.losses, "0"),
    points: asText(row.points, "0"),
    goalDifference: asText(row.pointsFor - row.pointsAgainst, "0"),
    noResults: "0",
    ties: asText(row.draws, "0"),
    percentage: row.played ? ((row.wins + (row.draws * 0.5)) / row.played).toFixed(3) : "0",
    pointsFor: asText(row.pointsFor, "0"),
    pointsAgainst: asText(row.pointsAgainst, "0"),
    change: "0",
    trend: "flat" as const,
    sport,
  }));
};

const loadAllSportPages = async (sport: Sport, path: "competitions" | "matches", id?: string) => {
  const base = id ? `/${sport}/competitions/${encodeURIComponent(id)}/${path}` : `/${sport}/${path}`;
  const first = await request<EntityRecord>(`${base}?per_page=50&paged=1`);
  const firstItems = entityItems(first, ["items", "matches", "competitions"]);
  const totalPages = Math.min(Number(first?.total_pages || first?.pagination?.total_pages || 1), 20);
  if (totalPages <= 1) return firstItems;
  const rest = await Promise.all(Array.from({ length: totalPages - 1 }, (_, index) => request<EntityRecord>(`${base}?per_page=50&paged=${index + 2}`)));
  return [first, ...rest].flatMap((page) => entityItems(page, ["items", "matches", "competitions"]));
};

const apiFor = (sport: Sport) => ({
  competitions: (query = "") => request<EntityRecord>(`/${sport}/competitions${query ? `?${query}` : ""}`),
  competitionsAll: () => loadAllSportPages(sport, "competitions"),
  competition: (id: string) => request<EntityRecord>(`/${sport}/competitions/${encodeURIComponent(id)}`),
  competitionMatches: (id: string, query = "") => request<EntityRecord>(`/${sport}/competitions/${encodeURIComponent(id)}/matches${query ? `?${query}` : ""}`),
  competitionMatchesAll: (id: string) => loadAllSportPages(sport, "matches", id),
  competitionStats: (id: string, statType?: string) => request<EntityRecord>(`/${sport}/competitions/${encodeURIComponent(id)}/stats${statType ? `/${encodeURIComponent(statType)}` : ""}`),
  matches: async (scope: Scope = "all") => {
    const query = scope === "all" ? "" : `?scope=${scope}`;
    const data = await request<EntityRecord>(`/${sport}/matches${query}`);
    return entityItems(data, ["items", "matches"]);
  },
  match: (id: string) => request<EntityRecord>(`/${sport}/matches/${encodeURIComponent(id)}`),
  streamUrl: () => `${API_BASE_URL}/${sport}/live-stream`,
});

export const soccerApi = apiFor("soccer");
export const nflApi = apiFor("nfl");
export const mapSoccerFixture = (raw: EntityRecord) => mapFixture("soccer", raw);
export const mapNflFixture = (raw: EntityRecord) => mapFixture("nfl", raw);
export const mapSoccerResult = (raw: EntityRecord) => mapResult("soccer", raw);
export const mapNflResult = (raw: EntityRecord) => mapResult("nfl", raw);
export const sportsItems = entityItems;
