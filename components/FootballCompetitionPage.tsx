"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { mapProviderStandings, mapSoccerFixture, soccerApi, sportsItems, type ProviderStandingRow } from "@/lib/sports-api";
import type { FixtureItem } from "@/types";

type RawRecord = Record<string, unknown>;
type CompetitionPageConfig = {
  competitionName: string;
  displayName: string;
  subtitle: string;
  championsFormat?: boolean;
};

type CompetitionMatch = FixtureItem & {
  label: string;
  homeScore: string;
  awayScore: string;
  resultText: string;
  timestamp: number;
};

const asRecord = (value: unknown): RawRecord => value && typeof value === "object" ? value as RawRecord : {};
const text = (value: unknown, fallback = "") => {
  const result = String(value ?? "").trim();
  return result || fallback;
};
const PLACEHOLDER_LOGO = "/assets/imgs/teams/team-placeholder.svg";
const normalizeTeamName = (value: unknown) => text(value).toLowerCase().replace(/[^a-z0-9]/g, "");

const providerTeamId = (team: RawRecord) => text(team.tid || team.team_id || team.teamid || team.id);
const providerTeamLogo = (team: RawRecord) => text(team.logo || team.teamlogo || team.team_logo || team.logo_url);

const matchTeamLogos = (rawMatches: RawRecord[]) => {
  const byId = new Map<string, string>();
  const byName = new Map<string, string>();
  rawMatches.forEach((raw) => {
    const teams = asRecord(raw.teams);
    [asRecord(teams.home), asRecord(teams.away)].forEach((team) => {
      const teamLogo = providerTeamLogo(team);
      if (!teamLogo) return;
      const teamId = providerTeamId(team);
      const teamName = normalizeTeamName(team.fullname || team.tname || team.team_name || team.name);
      if (teamId) byId.set(teamId, teamLogo);
      if (teamName) byName.set(teamName, teamLogo);
    });
  });
  return { byId, byName };
};

const scoreValue = (raw: RawRecord, side: "home" | "away") => {
  const result = asRecord(raw.result);
  const periods = asRecord(raw.periods || raw.querter);
  const finalScore = asRecord(periods.ft || periods.final);
  return text(result[side] ?? finalScore[side], "");
};

const matchLabel = (raw: RawRecord) => {
  const round = asRecord(raw.round);
  const value = text(round.name || round.round || raw.round || raw.match_number, "Fixture");
  return /^\d+$/.test(value) ? "Matchday " + value : value;
};

const mapCompetitionMatch = (raw: RawRecord): CompetitionMatch => {
  const fixture = mapSoccerFixture(raw);
  const homeScore = scoreValue(raw, "home");
  const awayScore = scoreValue(raw, "away");
  const result = asRecord(raw.result);
  const winner = text(result.winner).toLowerCase();
  const resultText = fixture.status === "completed"
    ? winner === "draw"
      ? "Match Drawn"
      : winner === "home" && homeScore && awayScore
        ? fixture.home + " won " + homeScore + "-" + awayScore
        : winner === "away" && homeScore && awayScore
          ? fixture.away + " won " + awayScore + "-" + homeScore
          : ""
    : "";

  return {
    ...fixture,
    label: matchLabel(raw),
    homeScore,
    awayScore,
    resultText,
    timestamp: Number(raw.timestampstart) || 0,
  };
};

const sortMatches = (left: CompetitionMatch, right: CompetitionMatch) => {
  const statusRank = (status: CompetitionMatch["status"]) => status === "upcoming" ? 0 : status === "live" ? 1 : 2;
  const statusDifference = statusRank(left.status) - statusRank(right.status);
  if (statusDifference) return statusDifference;
  return right.timestamp - left.timestamp;
};

function TeamLogo({ src, name, size = 22 }: { src: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && !failed ? (
    <img src={src} alt={name} style={{ width: size, height: size, objectFit: "contain" }} onError={() => setFailed(true)} />
  ) : (
    <img src={PLACEHOLDER_LOGO} alt={name + " logo unavailable"} style={{ width: size, height: size, objectFit: "contain" }} />
  );
}

function StandingTable({ rows }: { rows: ProviderStandingRow[] }) {
  return <div className="premium-table-container">
    <div className="table-responsive">
      <table className="premium-table">
        <thead><tr>
          <th className="text-start" style={{ width: "80px" }}>RANK</th>
          <th className="text-start">TEAM</th>
          <th className="text-center">P</th>
          <th className="text-center">W</th>
          <th className="text-center">D</th>
          <th className="text-center">L</th>
          <th className="text-center">PTS</th>
          <th className="text-center">GD</th>
        </tr></thead>
        <tbody>{rows.length ? rows.map((row) => <tr key={[row.rank, row.team].join("-")}>
          <td className="premium-table-rank text-start text-success">#{row.rank}</td>
          <td className="premium-table-team text-start"><div className="d-flex align-items-center gap-2"><TeamLogo src={row.teamLogo} name={row.team} size={20} /><span>{row.team}</span></div></td>
          <td className="premium-table-stat text-center">{row.played}</td>
          <td className="premium-table-stat text-center">{row.wins}</td>
          <td className="premium-table-stat text-center">{row.draws}</td>
          <td className="premium-table-stat text-center">{row.losses}</td>
          <td className="premium-table-stat-bold text-center">{row.points}</td>
          <td className="premium-table-stat text-center">{row.goalDifference}</td>
        </tr>) : <tr><td colSpan={8} className="text-center text-muted py-5">No standings data was supplied for this competition.</td></tr>}</tbody>
      </table>
    </div>
  </div>;
}

function PaginationControls({ page, totalPages, totalItems, pageSize, onPageChange }: { page: number; totalPages: number; totalItems: number; pageSize: number; onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  const firstItem = (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalItems);
  return <>
    <div className="ranking-pagination">
      <button type="button" disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))}>Previous</button>
      <span>Page {page} of {totalPages}</span>
      <button type="button" disabled={page === totalPages} onClick={() => onPageChange(Math.min(totalPages, page + 1))}>Next</button>
    </div>
    <div className="ranking-pagination-summary">Showing {firstItem}-{lastItem} of {totalItems}</div>
  </>;
}

function MatchCard({ match }: { match: CompetitionMatch }) {
  return <div className="col-md-6 col-lg-4">
    <div className="premium-table-container p-4 h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-success fw-bold font-space-grotesk" style={{ fontSize: "11px", letterSpacing: "0.08em" }}>{match.label.toUpperCase()}</span>
          <span className="rounded-pill px-3 py-1 font-space-grotesk fw-bold" style={{ fontSize: "10px", background: match.status === "completed" ? "rgba(255, 255, 255, 0.08)" : "rgba(34, 197, 94, 0.15)", color: match.status === "completed" ? "#a0a5ad" : "#22c55e", border: match.status === "completed" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(34, 197, 94, 0.3)", letterSpacing: "0.05em" }}>
            {(match.status || "upcoming").toUpperCase()}
          </span>
        </div>
        <div className="d-flex justify-content-between align-items-center my-3">
          <div className="d-flex align-items-center gap-2"><TeamLogo src={match.homeLogo} name={match.home} /><span className="fw-bold text-white font-space-grotesk" style={{ fontSize: "15px" }}>{match.home}</span></div>
          {match.homeScore && <span className="fw-bold text-white font-monospace" style={{ fontSize: "18px" }}>{match.homeScore}</span>}
        </div>
        <div className="d-flex justify-content-between align-items-center my-3">
          <div className="d-flex align-items-center gap-2"><TeamLogo src={match.awayLogo} name={match.away} /><span className="fw-bold text-white font-space-grotesk" style={{ fontSize: "15px" }}>{match.away}</span></div>
          {match.awayScore && <span className="fw-bold text-white font-monospace" style={{ fontSize: "18px" }}>{match.awayScore}</span>}
        </div>
      </div>
      <hr className="border-secondary opacity-10 my-3" />
      <div>
        <div className="d-flex align-items-center gap-2 text-muted mb-2" style={{ fontSize: "12px" }}><i className="bi bi-calendar-event" /><span>{match.date} · {match.time}</span></div>
        <div className="d-flex align-items-center gap-2 text-muted mb-3" style={{ fontSize: "12px" }}><i className="bi bi-geo-alt" /><span className="text-truncate">{match.venue}</span></div>
        {match.resultText && <div className="p-2 rounded bg-success bg-opacity-10 text-success text-center fw-semibold" style={{ fontSize: "12px" }}>{match.resultText}</div>}
      </div>
    </div>
  </div>;
}

export default function FootballCompetitionPage({ config }: { config: CompetitionPageConfig }) {
  const [activeTab, setActiveTab] = useState(config.championsFormat ? "fixtures" : "schedule");
  const [matches, setMatches] = useState<CompetitionMatch[]>([]);
  const [standings, setStandings] = useState<ProviderStandingRow[]>([]);
  const [metadata, setMetadata] = useState<RawRecord>({});
  const [fixturePage, setFixturePage] = useState(1);
  const [standingPage, setStandingPage] = useState(1);
  const [teamPage, setTeamPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const competitionsResponse = await soccerApi.competitions("per_page=50");
        const competitions = Array.isArray(competitionsResponse.items) ? competitionsResponse.items : [];
        const normalizeCompetitionName = (value: unknown) => text(value).toLowerCase().replace(/[^a-z0-9]/g, "");
        const requestedName = normalizeCompetitionName(config.competitionName);
        const target = competitions.find((item: RawRecord) => normalizeCompetitionName(item.cname || item.name) === requestedName)
          || competitions.find((item: RawRecord) => normalizeCompetitionName(item.cname || item.name).includes(requestedName));
        const competitionId = text(target?.cid || target?.id);
        if (!competitionId) throw new Error("No " + config.displayName + " competition available");

        const [competitionData, matchesData] = await Promise.all([
          soccerApi.competition(competitionId),
          soccerApi.competitionMatchesAll(competitionId),
        ]);
        const item = Array.isArray(competitionData.items) ? competitionData.items[0] : competitionData;
        const rawMatches = sportsItems(matchesData) as RawRecord[];
        const nextMatches = rawMatches.map(mapCompetitionMatch).sort(sortMatches);
        const rawLogos = matchTeamLogos(rawMatches);
        const nextStandings = mapProviderStandings(competitionData).map((row) => ({
          ...row,
          teamLogo: rawLogos.byId.get(row.teamId || "") || rawLogos.byName.get(normalizeTeamName(row.team)) || row.teamLogo || PLACEHOLDER_LOGO,
        }));

        if (!cancelled) {
          setMetadata(item as RawRecord);
          setMatches(nextMatches);
          setStandings(nextStandings);
          setFixturePage(1);
          setStandingPage(1);
          setTeamPage(1);
          setError("");
        }
      } catch (requestError) {
        if (!cancelled) {
          setMatches([]);
          setStandings([]);
          setError(requestError instanceof Error ? requestError.message : "Unable to load football competition data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [config.competitionName, config.displayName]);

  const pageSize = 10;
  const fixturePageSize = 6;
  const teamPageSize = 12;
  const fixtureTotalPages = Math.max(1, Math.ceil(matches.length / fixturePageSize));
  const currentFixturePage = Math.min(fixturePage, fixtureTotalPages);
  const visibleMatches = matches.slice((currentFixturePage - 1) * fixturePageSize, currentFixturePage * fixturePageSize);
  const standingTotalPages = Math.max(1, Math.ceil(standings.length / pageSize));
  const currentStandingPage = Math.min(standingPage, standingTotalPages);
  const visibleStandings = standings.slice((currentStandingPage - 1) * pageSize, currentStandingPage * pageSize);
  const teams = useMemo(() => {
    const seen = new Set<string>();
    return standings.filter((row) => {
      const key = normalizeTeamName(row.team);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map((row) => ({ name: row.team, logo: row.teamLogo }));
  }, [standings]);
  const teamTotalPages = Math.max(1, Math.ceil(teams.length / teamPageSize));
  const currentTeamPage = Math.min(teamPage, teamTotalPages);
  const visibleTeams = teams.slice((currentTeamPage - 1) * teamPageSize, currentTeamPage * teamPageSize);
  const tabs = config.championsFormat ? ["fixtures", "groups", "history"] : ["schedule", "standings", "teams"];
  const historyText = config.displayName + " " + text(metadata.year, "season") + " data is supplied by the connected football provider. The page currently contains " + (teams.length || "available") + " teams, " + matches.length + " fixtures/results, and the latest provider standings.";

  return <main className="font-outfit">
    <PageHeader title={config.displayName} subtitle={config.subtitle} className="mb-5" />
    <div className="container custom-container mb-4">
      <div className="d-flex gap-2 border-bottom border-secondary border-opacity-10 pb-3">
        {tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className="btn text-capitalize fw-bold rounded-pill px-4 py-2 transition-all" style={{ fontSize: "14px", background: activeTab === tab ? "var(--accent-green)" : "transparent", color: activeTab === tab ? "#fff" : "var(--text-muted)", border: activeTab === tab ? "1px solid var(--accent-green)" : "1px solid transparent" }}>{tab}</button>)}
      </div>
    </div>
    <div className="container custom-container">
      {loading ? <div className="premium-table-container p-5 text-center text-muted">Loading {config.displayName} data…</div> : error ? <div className="premium-table-container p-5 text-center text-warning">{error}</div> : <>
        {(activeTab === "schedule" || activeTab === "fixtures") && <><div className="row g-4">{visibleMatches.map((match) => <MatchCard key={match.id || [match.home, match.away, match.timestamp].join("-")} match={match} />)}</div><PaginationControls page={currentFixturePage} totalPages={fixtureTotalPages} totalItems={matches.length} pageSize={fixturePageSize} onPageChange={setFixturePage} /></>}
        {(activeTab === "standings" || activeTab === "groups") && <><StandingTable rows={visibleStandings} /><PaginationControls page={currentStandingPage} totalPages={standingTotalPages} totalItems={standings.length} pageSize={pageSize} onPageChange={setStandingPage} /></>}
        {activeTab === "teams" && <><div className="row g-4">{visibleTeams.map((team) => <div key={team.name} className="col-6 col-md-4 col-lg-3"><div className="premium-table-container p-4 text-center hover-glow transition-all" style={{ cursor: "pointer" }}><div className="d-flex align-items-center justify-content-center mb-3" style={{ height: "80px" }}><TeamLogo src={team.logo} name={team.name} size={70} /></div><h6 className="fw-bold text-white font-space-grotesk text-truncate mb-0">{team.name}</h6></div></div>)}</div><PaginationControls page={currentTeamPage} totalPages={teamTotalPages} totalItems={teams.length} pageSize={teamPageSize} onPageChange={setTeamPage} /></>}
        {activeTab === "history" && <div className="premium-table-container p-5"><h4 className="fw-bold text-white mb-3 font-space-grotesk">{config.displayName} Information</h4><p className="text-muted lh-lg mb-0" style={{ fontSize: "15px" }}>{historyText}</p></div>}
      </>}
    </div>
  </main>;
}
