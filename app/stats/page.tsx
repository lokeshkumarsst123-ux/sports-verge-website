"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { cricketApi, cricketItems } from "@/lib/cricket-api";
import { nflApi, soccerApi, sportsItems } from "@/lib/sports-api";

type Sport = "cricket" | "football" | "NFL";
type RecordValue = Record<string, any>;

type LeaderRow = {
  rank: string;
  player: string;
  team: string;
  values: string[];
};

type LeaderTable = {
  title: string;
  columns: string[];
  rows: LeaderRow[];
};

const sportTabs: { id: Sport; label: string; icon: string }[] = [
  { id: "cricket", label: "Cricket", icon: "bi-trophy" },
  { id: "football", label: "Football", icon: "bi-globe2" },
  { id: "NFL", label: "NFL", icon: "bi-shield" },
];

const firstValue = (...values: unknown[]) => values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");
const asText = (value: unknown, fallback = "—") => String(firstValue(value, fallback) ?? fallback);
const asRecord = (value: unknown): RecordValue => value && typeof value === "object" ? value as RecordValue : {};
const asArray = (value: unknown) => Array.isArray(value) ? value.filter(Boolean) as RecordValue[] : [];

const competitionName = (item: RecordValue) => asText(firstValue(item.title, item.cname, item.name, item.abbr), "Competition");
const competitionId = (item: RecordValue) => asText(firstValue(item.cid, item.competition_id, item.id), "");

const statsRows = (data: RecordValue | undefined) => {
  const source = asRecord(data?.items && !Array.isArray(data.items) ? data.items : data);
  const direct = [source.stats, source.players, source.leaders, source.statistics].flatMap(asArray);
  if (direct.length) return direct;
  return Object.values(asRecord(source.playerstats)).flatMap(asArray);
};

const cricketRows = (data: RecordValue | undefined, type: "batting" | "bowling"): LeaderRow[] => statsRows(data).map((item, index) => {
  const player = asRecord(item.player);
  const team = asRecord(item.team);
  return {
    rank: `#${index + 1}`,
    player: asText(firstValue(player.title, player.name, player.short_name, item.player_name), "Provider player"),
    team: asText(firstValue(team.abbr, team.title, team.name, item.team_name), "—"),
    values: type === "batting"
      ? [asText(firstValue(item.matches, item.match), "0"), asText(firstValue(item.runs, item.total_runs), "0"), asText(firstValue(item.average, item.avg), "—")]
      : [asText(firstValue(item.matches, item.match), "0"), asText(firstValue(item.wickets, item.total_wickets), "0"), asText(firstValue(item.econ, item.economy), "—")],
  };
}).filter((row) => row.player !== "Provider player");

const genericRows = (data: RecordValue | undefined, sport: Exclude<Sport, "cricket">): LeaderRow[] => statsRows(data).map((item, index) => {
  const player = asRecord(item.player);
  const team = asRecord(item.team);
  const playerName = asText(firstValue(player.title, player.name, player.fullname, item.player_name, item.name), "Provider player");
  const teamName = asText(firstValue(team.abbr, team.title, team.name, item.team_name), "—");
  const values = sport === "football"
    ? [asText(firstValue(item.goals, item.goal, item.total_goals), "—"), asText(firstValue(item.assists, item.assist), "—"), asText(firstValue(item.matches, item.appearances, item.match), "—")]
    : [asText(firstValue(item.yards, item.passing_yards, item.pass_yards), "—"), asText(firstValue(item.touchdowns, item.td, item.total_touchdowns), "—"), asText(firstValue(item.interceptions, item.int), "—")];
  return { rank: `#${index + 1}`, player: playerName, team: teamName, values };
}).filter((row) => row.player !== "Provider player");

const findCompetition = (items: RecordValue[], preferred: RegExp) => items.find((item) => preferred.test(competitionName(item))) || items[0];

const loadCricketCompetitions = async () => {
  for (const query of ["status=live&per_page=50", "status=fixture&per_page=50", "per_page=50"]) {
    try {
      const items = cricketItems(await cricketApi.competitions(query));
      if (items.length) return items;
    } catch {
      // Try the next provider competition scope.
    }
  }
  return [];
};

const loadSoccerCompetitions = async () => {
  const data = await soccerApi.competitions("per_page=50");
  return sportsItems(data);
};

const loadNflCompetitions = async () => {
  const data = await nflApi.competitions("per_page=50");
  return sportsItems(data);
};

import { USE_STATIC_MOCK, MOCK_TABLES } from "@/lib/mock-data";

export default function StatsPage() {
  const [sport, setSport] = useState<Sport>("cricket");
  const [tables, setTables] = useState<LeaderTable[]>(USE_STATIC_MOCK ? MOCK_TABLES.cricket : []);
  const [loading, setLoading] = useState(!USE_STATIC_MOCK);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (USE_STATIC_MOCK) {
      setTables(MOCK_TABLES[sport] || []);
      setLoading(false);
      setMessage("");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setTables([]);
    setMessage("");

    const load = async () => {
      try {
        if (sport === "cricket") {
          const competitions = await loadCricketCompetitions();
          const selected = findCompetition(competitions, /IPL|Premier League|World Cup/i);
          const id = selected && competitionId(selected);
          if (!id) throw new Error("No Cricket competition was returned by the provider.");

          const [battingResult, bowlingResult] = await Promise.allSettled([
            cricketApi.competitionStats(id, "batting_most_runs"),
            cricketApi.competitionStats(id, "bowling_top_wicket_takers"),
          ]);
          const batting = battingResult.status === "fulfilled" ? cricketRows(battingResult.value, "batting").slice(0, 10) : [];
          const bowling = bowlingResult.status === "fulfilled" ? cricketRows(bowlingResult.value, "bowling").slice(0, 10) : [];
          const name = competitionName(selected);
          const nextTables = [
            batting.length ? { title: `${name} - Most Runs (Orange Cap)`, columns: ["RANK", "PLAYER", "TEAM", "MATCHES", "RUNS", "AVERAGE"], rows: batting } : null,
            bowling.length ? { title: `${name} - Most Wickets (Purple Cap)`, columns: ["RANK", "PLAYER", "TEAM", "MATCHES", "WICKETS", "ECONOMY"], rows: bowling } : null,
          ].filter((table): table is LeaderTable => Boolean(table));
          if (!cancelled) {
            setTables(nextTables);
            if (!nextTables.length) setMessage("No Cricket player leader data was supplied for this competition.");
          }
          return;
        }

        const competitions = sport === "football" ? await loadSoccerCompetitions() : await loadNflCompetitions();
        if (!competitions.length) throw new Error(`No ${sport === "football" ? "Football" : "NFL"} competitions were returned by the provider.`);

        const preferredRegex = sport === "football" ? /Premier League|La Liga|Champions/i : /NFL/i;
        const orderedCompetitions = [
          ...competitions.filter((c) => preferredRegex.test(competitionName(c))),
          ...competitions.filter((c) => !preferredRegex.test(competitionName(c))),
        ];

        let selectedComp = orderedCompetitions[0];
        let foundRows: LeaderRow[] = [];

        // Check top 2 candidate competitions for player stats to keep loading fast
        const candidates = orderedCompetitions.slice(0, 2);
        for (const comp of candidates) {
          const cid = competitionId(comp);
          if (!cid) continue;
          try {
            const data = await (sport === "football" ? soccerApi.competitionStats(cid) : nflApi.competitionStats(cid));
            const rows = genericRows(data, sport).slice(0, 10);
            if (rows.length > 0) {
              selectedComp = comp;
              foundRows = rows;
              break;
            }
          } catch {
            // continue checking candidate competition
          }
        }

        if (!cancelled) {
          if (foundRows.length && selectedComp) {
            setTables([{
              title: `${competitionName(selectedComp)} - Player Leaders`,
              columns: sport === "football" ? ["RANK", "PLAYER", "TEAM", "GOALS", "ASSISTS", "MATCHES"] : ["RANK", "PLAYER", "TEAM", "YARDS", "TOUCHDOWNS", "INT"],
              rows: foundRows,
            }]);
          } else {
            setTables([]);
            setMessage(`Player statistics for ${sport === "football" ? "Football" : "NFL"} are currently not available for this league.`);
          }
        }
      } catch (error) {
        if (!cancelled) {
          const errText = error instanceof Error ? error.message : "Unable to load player statistics.";
          const cleanText = /Route .* was not found/i.test(errText)
            ? "Player statistics are currently not available for this league."
            : errText;
          setMessage(cleanText);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [sport]);

  return (
    <main className="font-outfit stats-leaders-page">
      <PageHeader
        title="Player Stats & Leaders"
        subtitle="Leading player statistics and performance metrics across top global leagues."
        className="stats-leaders-header"
      />

      <section className="container custom-container stats-leaders-content">
        <div className="stats-sport-tabs" role="tablist" aria-label="Select sport">
          {sportTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={sport === tab.id}
              className={sport === tab.id ? "active" : ""}
              onClick={() => setSport(tab.id)}
            >
              <i className={`bi ${tab.icon}`} aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="stats-leaders-state">Loading provider player statistics…</div>
        ) : tables.length ? (
          <div className="stats-leader-tables">
            {tables.map((table) => (
              <article className="stats-leader-card" key={table.title}>
                <h2>{table.title}</h2>
                <div className="table-responsive">
                  <table className="stats-leader-table">
                    <thead>
                      <tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row) => (
                        <tr key={`${table.title}-${row.rank}-${row.player}`}>
                          <td className="stats-rank">{row.rank}</td>
                          <td className="stats-player">{row.player}</td>
                          <td>{row.team}</td>
                          {row.values.map((value, index) => <td className={index < 2 ? "stats-value" : ""} key={`${row.player}-${index}`}>{value}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="stats-leaders-state stats-leaders-empty py-5 text-center my-4">
            <i className="bi bi-info-circle text-muted fs-1 mb-3 d-block" aria-hidden="true" />
            <h3 className="h5 fw-bold mb-2" style={{ color: "#1C1F22" }}>Data Not Available</h3>
            <p className="text-secondary mb-0 small">
              {message || `Player statistics for ${sport === "cricket" ? "Cricket" : sport === "football" ? "Football" : "NFL"} are currently not available.`}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
