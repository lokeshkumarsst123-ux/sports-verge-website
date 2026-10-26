"use client";

import React, { useEffect, useState } from "react";
import { cricketApi, cricketItems, mapCricketRankingGroups, type CricketRankingGroup } from "@/lib/cricket-api";
import { mapProviderRankingRows, nflApi, soccerApi, type ProviderStandingRow } from "@/lib/sports-api";

type Sport = "cricket" | "football" | "NFL";
type RankingSport = Sport;
type Competition = { id: string; name: string };
type CricketRankingItem = CricketRankingGroup["list"][number];

const placeholderLogo = "/assets/imgs/teams/team-placeholder.svg";
const sports: Array<{ id: RankingSport; icon: string }> = [
  { id: "cricket", icon: "bi-trophy" },
  { id: "football", icon: "bi-globe2" },
  { id: "NFL", icon: "bi-shield" },
];

const formatNumber = (value: string) => {
  const numeric = Number(String(value).replaceAll(",", ""));
  return Number.isFinite(numeric) ? numeric.toLocaleString("en-US") : value;
};

const trendValue = (change: string) => {
  const value = String(change || "").trim();
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(value) || value === "0") return "0";
  return value.startsWith("-") || value.startsWith("+") ? value : `+${value}`;
};

const applyCricketTrendSnapshot = (groups: ReturnType<typeof mapCricketRankingGroups>) => {
  if (typeof window === "undefined") return groups;

  return groups.map((group) => {
    const storageKey = `sports-verg:ranking-snapshot:${group.category}`;
    let previousRanks: Record<string, number> = {};
    try {
      previousRanks = JSON.parse(window.localStorage.getItem(storageKey) || "{}") as Record<string, number>;
    } catch {
      previousRanks = {};
    }

    const list = group.list.map((item) => {
      // The ICC endpoint currently has no previous-rank field. Use its value when
      // supplied; otherwise compare this response with the last saved snapshot.
      if (/^[+-]?\d+(?:\.\d+)?$/.test(item.change) && item.change !== "0") return item;
      const previousRank = Number(previousRanks[item.name] || item.rank);
      const currentRank = Number(item.rank);
      const change = previousRank - currentRank;
      return {
        ...item,
        change: String(change),
        trend: (change > 0 ? "up" : change < 0 ? "down" : "flat") as CricketRankingItem["trend"],
      };
    });

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(group.list.map((item) => [item.name, item.rank]))));
    } catch {
      // Rankings should remain usable when browser storage is disabled.
    }

    return { ...group, list };
  });
};

function RankingTeamLogo({ src, name }: { src: string; name: string }) {
  return <img src={src || placeholderLogo} alt={`${name} logo`} className="ranking-team-logo" onError={(event) => { event.currentTarget.src = placeholderLogo; }} />;
}

function RankingTrend({ item }: { item: CricketRankingItem }) {
  const value = trendValue(item.change);
  const isUp = item.trend === "up";
  const isDown = item.trend === "down";
  return <span className={`ranking-trend ${isUp ? "is-up" : isDown ? "is-down" : "is-flat"}`}><i className={`bi ${isUp ? "bi-caret-up-fill" : isDown ? "bi-caret-down-fill" : "bi-dot"}`} />{value}</span>;
}

function ProviderTrend({ row }: { row: ProviderStandingRow }) {
  const value = trendValue(row.change);
  const isUp = row.trend === "up";
  const isDown = row.trend === "down";
  return <span className={`ranking-trend ${isUp ? "is-up" : isDown ? "is-down" : "is-flat"}`}><i className={`bi ${isUp ? "bi-caret-up-fill" : isDown ? "bi-caret-down-fill" : "bi-dot"}`} />{value}</span>;
}

function CricketRankingCard({ group }: { group: CricketRankingGroup }) {
  return <article className="ranking-card">
    <h2 className="ranking-card-title">{group.category}</h2>
    <div className="ranking-table-scroll">
      <div className="ranking-table ranking-cricket-table">
        <div className="ranking-row ranking-row-head"><span>RANK</span><span>TEAM</span><span>POINTS</span><span>RATING</span><span>TREND</span></div>
        {group.list.slice(0, 10).map((item) => <div className="ranking-row" key={`${group.category}-${item.rank}-${item.name}`}>
          <span className="ranking-rank">#{item.rank}</span>
          <span className="ranking-team"><RankingTeamLogo src={item.logo} name={item.name} /><strong>{item.name}</strong></span>
          <span className="ranking-points">{formatNumber(item.points)}</span>
          <span className="ranking-rating">{item.rating ? formatNumber(item.rating) : "—"}</span>
          <RankingTrend item={item} />
        </div>)}
      </div>
    </div>
  </article>;
}

function ProviderRankingCard({ sport, rows }: { sport: Sport; rows: ProviderStandingRow[] }) {
  const isNfl = sport === "NFL";
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const [page, setPage] = useState(1);
  const currentPage = Math.min(page, totalPages);
  const visibleRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <article className="ranking-card">
    <h2 className="ranking-card-title">{isNfl ? "NFL Power Rankings" : "FIFA Men's World Rankings"}</h2>
    <div className="ranking-table-scroll">
      <div className={`ranking-table ${isNfl ? "ranking-nfl-table" : "ranking-football-table"}`}>
        <div className="ranking-row ranking-row-head"><span>RANK</span><span>TEAM</span><span>{isNfl ? "RECORD" : "POINTS"}</span><span>TREND</span></div>
        {visibleRows.map((row) => <div className="ranking-row" key={`${row.rank}-${row.team}`}>
          <span className="ranking-rank">#{row.rank}</span>
          <span className="ranking-team"><RankingTeamLogo src={row.teamLogo} name={row.team} /><strong>{row.team}</strong></span>
          {isNfl ? <span className="ranking-record">{row.wins}-{row.losses}</span> : <span className="ranking-points">{formatNumber(row.points)}</span>}
          <ProviderTrend row={row} />
        </div>)}
      </div>
    </div>
    {totalPages > 1 && <div className="ranking-pagination">
      <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button>
    </div>}
    <div className="ranking-pagination-summary">Showing {rows.length ? ((currentPage - 1) * pageSize) + 1 : 0}-{Math.min(currentPage * pageSize, rows.length)} of {rows.length} teams</div>
  </article>;
}

import { USE_STATIC_MOCK, MOCK_RANKING_COMPETITIONS as MOCK_COMPETITIONS, MOCK_CRICKET_RANKINGS, MOCK_FOOTBALL_ROWS, MOCK_NFL_ROWS } from "@/lib/mock-data";

export default function RankingsPage() {
  const [sport, setSport] = useState<RankingSport>("cricket");
  const [competitions, setCompetitions] = useState<Record<Sport, Competition[]>>(
    USE_STATIC_MOCK ? MOCK_COMPETITIONS : { cricket: [], football: [], NFL: [] }
  );
  const [selectedBySport, setSelectedBySport] = useState<Record<Sport, string>>(
    USE_STATIC_MOCK ? { cricket: "icc", football: "fifa-men", NFL: "nfl-power" } : { cricket: "", football: "", NFL: "" }
  );
  const [rows, setRows] = useState<ProviderStandingRow[]>(
    USE_STATIC_MOCK ? MOCK_FOOTBALL_ROWS : []
  );
  const [rowsKey, setRowsKey] = useState("");
  const [cricketRankings, setCricketRankings] = useState<ReturnType<typeof mapCricketRankingGroups>>(
    USE_STATIC_MOCK ? MOCK_CRICKET_RANKINGS : []
  );
  const [loading, setLoading] = useState(!USE_STATIC_MOCK);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (USE_STATIC_MOCK) {
      setCompetitions(MOCK_COMPETITIONS);
      setSelectedBySport({ cricket: "icc", football: "fifa-men", NFL: "nfl-power" });
      setCricketRankings(MOCK_CRICKET_RANKINGS);
      setLoading(false);
      setMessage(null);
      return;
    }

    let cancelled = false;
    const load = async () => {
      const responses = await Promise.allSettled([cricketApi.competitions(), soccerApi.competitions(), nflApi.competitions(), cricketApi.rankings()]);
      const next: Record<Sport, Competition[]> = { cricket: [], football: [], NFL: [] };
      responses.slice(0, 3).forEach((response, index) => {
        if (response.status !== "fulfilled") return;
        const items = index === 0 ? cricketItems(response.value) : Array.isArray(response.value.items) ? response.value.items : [];
        next[index === 0 ? "cricket" : index === 1 ? "football" : "NFL"] = items
          .map((item) => ({ id: String(item.cid || item.id || ""), name: String(item.cname || item.name || item.title || "Competition") }))
          .filter((item) => item.id);
      });
      if (!cancelled) {
        setCompetitions(next);
        setSelectedBySport((current) => {
          const selected = { ...current };
          (Object.keys(next) as Sport[]).forEach((key) => {
            if (!next[key].some((item) => item.id === selected[key])) selected[key] = next[key][0]?.id || "";
          });
          return selected;
        });
        if (responses[3].status === "fulfilled") setCricketRankings(applyCricketTrendSnapshot(mapCricketRankingGroups(responses[3].value)));
        else setMessage("Unable to load cricket rankings from the provider.");
        setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const available = competitions[sport];
  const selected = selectedBySport[sport];

  useEffect(() => {
    if (USE_STATIC_MOCK) {
      if (sport === "football") {
        setRows(MOCK_FOOTBALL_ROWS);
        setRowsKey(`football:${selected || "fifa-men"}`);
      } else if (sport === "NFL") {
        setRows(MOCK_NFL_ROWS);
        setRowsKey(`NFL:${selected || "nfl-power"}`);
      }
      setLoading(false);
      setMessage(null);
      return;
    }

    let cancelled = false;
    if (sport === "cricket") {
      return () => { cancelled = true; };
    }
    if (!selected) {
      return () => { cancelled = true; };
    }
    const load = async () => {
      setLoading(true);
      try {
        const api = sport === "football" ? soccerApi : nflApi;
        const [data, matchesData] = await Promise.all([api.competition(selected), api.competitionMatchesAll(selected)]);
        if (!cancelled) {
          const next = mapProviderRankingRows(data, matchesData, sport);
          setRows(next);
          setRowsKey(`${sport}:${selected}`);
          setMessage(next.length ? null : "No ranking data supplied for this provider.");
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setMessage("Unable to load rankings from the provider.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [selected, sport]);

  const currentRows = USE_STATIC_MOCK
    ? (sport === "football" ? MOCK_FOOTBALL_ROWS : sport === "NFL" ? MOCK_NFL_ROWS : [])
    : (rowsKey === `${sport}:${selected}` ? rows : []);

  return <main className="rankings-page font-outfit">
    <section className="container custom-container rankings-container">
      <div className="rankings-heading-row">
        <div><span className="rankings-eyebrow">SPORTS DATA</span><h1>WORLD RANKINGS</h1><p>Official team rankings and standings across major international sports leagues.</p></div>
        <div className="rankings-sport-tabs">{sports.map((item) => <button type="button" key={item.id} className={sport === item.id ? "active" : ""} onClick={() => { setSport(item.id); setMessage(null); }}><i className={`bi ${item.icon}`} />{item.id}</button>)}</div>
      </div>

      {sport !== "cricket" && <div className="rankings-filter-row"><label htmlFor="ranking-competition">Competition</label><select id="ranking-competition" value={selected} onChange={(event) => { setSelectedBySport((current) => ({ ...current, [sport]: event.target.value })); setMessage(null); }}><option value="">Select competition</option>{available.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></div>}

      {loading ? <div className="ranking-state-card">Loading rankings…</div> : sport === "cricket" ? (
        cricketRankings.length ? <div className="ranking-groups">{cricketRankings.map((group) => <CricketRankingCard group={group} key={group.category} />)}</div> : <div className="ranking-state-card">{message || "No cricket rankings supplied by the provider."}</div>
      ) : sport === "football" || sport === "NFL" ? currentRows.length ? <div className="ranking-groups"><ProviderRankingCard key={`${sport}-${selected}`} sport={sport} rows={currentRows} /></div> : <div className="ranking-state-card">{message || "No ranking data supplied for this provider."}</div> : <div className="ranking-state-card">{message || "No ranking data supplied for this provider."}</div>}
    </section>
  </main>;
}
