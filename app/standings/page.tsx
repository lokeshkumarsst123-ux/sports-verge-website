"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cricketApi, mapCompetitionStandings, type CricketStandingRow } from "@/lib/cricket-api";
import { mapProviderRankingRows, mapProviderStandings, nflApi, soccerApi, type ProviderStandingRow } from "@/lib/sports-api";

type Sport = "cricket" | "football" | "NFL";
type Competition = { id: string; name: string };
type StandingsRow = ProviderStandingRow & {
  noResults?: string;
  ties?: string;
  percentage?: string;
  pointsFor?: string;
  pointsAgainst?: string;
};

const placeholderLogo = "/assets/imgs/teams/team-placeholder.svg";
const pageSize = 10;

const sportConfig: Record<Sport, { label: string; accent: string; competitionHints: RegExp[] }> = {
  cricket: { label: "CRICKET", accent: "#1db653", competitionHints: [/^ipl/i, /world cup/i, /t20/i] },
  football: { label: "FOOTBALL", accent: "#4f8cff", competitionHints: [/premier league/i, /la liga/i, /champions league/i] },
  NFL: { label: "NFL", accent: "#f2a900", competitionHints: [/afc/i, /nfc/i, /playoff/i] },
};

const competitionName = (item: Record<string, unknown>) => String(item.cname || item.name || item.title || item.comp_name || item.competition_name || "Competition");
const competitionId = (item: Record<string, unknown>) => String(item.cid || item.id || item.comp_id || item.competition_id || item.slug || "");

const preferredCompetition = (sport: Sport, items: Competition[]) => {
  if (!items.length) return "";
  const patterns = sportConfig[sport].competitionHints;
  return items.find((item) => patterns.some((pattern) => pattern.test(item.name)))?.id || items[0].id;
};

const formatRate = (value: string) => {
  const text = String(value || "").trim();
  if (!text) return "-";
  if (/^0\.\d+$/.test(text)) return text.replace(/^0/, "");
  return text;
};

const cricketRowsToStandings = (rows: CricketStandingRow[]): StandingsRow[] =>
  rows.map((row) => ({
    rank: row.rank,
    team: row.team,
    teamLogo: row.teamLogo,
    played: row.p,
    wins: row.w,
    draws: "0",
    losses: row.l,
    points: row.pts,
    goalDifference: row.nrr,
    change: "0",
    trend: "flat",
    noResults: row.nr ?? "0",
  }));

export default function StandingsPage() {
  const [sport, setSport] = useState<Sport>("cricket");
  const [competitions, setCompetitions] = useState<Record<Sport, Competition[]>>({ cricket: [], football: [], NFL: [] });
  const [selectedCompetition, setSelectedCompetition] = useState("");
  const [rows, setRows] = useState<StandingsRow[]>([]);
  const [competitionLoading, setCompetitionLoading] = useState(true);
  const [rowsLoading, setRowsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [competitionMenuOpen, setCompetitionMenuOpen] = useState(false);
  const competitionMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCompetitions = async () => {
      setCompetitionLoading(true);
      const responses = await Promise.allSettled([cricketApi.competitionsAll(), soccerApi.competitionsAll(), nflApi.competitionsAll()]);
      const next: Record<Sport, Competition[]> = { cricket: [], football: [], NFL: [] };

      responses.forEach((response, index) => {
        if (response.status !== "fulfilled") return;
        const sportKey = index === 0 ? "cricket" : index === 1 ? "football" : "NFL";
        const items = (response.value as Record<string, unknown>[]).map((item) => ({
          id: competitionId(item),
          name: competitionName(item),
        })).filter((item) => Boolean(item.id));
        next[sportKey] = items;
      });

      if (!cancelled) {
        setCompetitions(next);
        setError(responses.every((response) => response.status === "rejected") ? "Unable to load standings competitions." : null);
        setCompetitionLoading(false);
      }
    };

    void loadCompetitions();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!competitionMenuRef.current) return;
      if (competitionMenuRef.current.contains(event.target as Node)) return;
      setCompetitionMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCompetitionMenuOpen(false);
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const availableCompetitions = competitions[sport];
  const preferredCompetitionId = useMemo(() => preferredCompetition(sport, availableCompetitions), [availableCompetitions, sport]);
  const effectiveCompetitionId = useMemo(
    () => (availableCompetitions.some((competition) => competition.id === selectedCompetition) ? selectedCompetition : preferredCompetitionId || availableCompetitions[0]?.id || ""),
    [availableCompetitions, preferredCompetitionId, selectedCompetition],
  );
  const activeCompetition = useMemo(
    () => availableCompetitions.find((competition) => competition.id === effectiveCompetitionId),
    [availableCompetitions, effectiveCompetitionId],
  );

  useEffect(() => {
    let cancelled = false;

    if (!effectiveCompetitionId) {
      return () => {
        cancelled = true;
      };
    }

    const loadRows = async () => {
      setRowsLoading(true);
      try {
        if (sport === "cricket") {
          const data = await cricketApi.competition(effectiveCompetitionId);
          const mapped = cricketRowsToStandings(mapCompetitionStandings(data));
          if (!cancelled) {
            setRows(mapped);
            setError(null);
          }
        } else {
          const data = sport === "football" ? await soccerApi.competition(effectiveCompetitionId) : await nflApi.competition(effectiveCompetitionId);
          let mapped: StandingsRow[] = mapProviderStandings(data).map((row) => ({
            ...row,
            noResults: row.noResults ?? "0",
            ties: row.ties ?? row.draws ?? "0",
            percentage: row.percentage,
            pointsFor: row.pointsFor,
            pointsAgainst: row.pointsAgainst,
          }));
          if (!mapped.length && sport === "NFL") {
            const matches = await nflApi.competitionMatchesAll(effectiveCompetitionId);
            mapped = mapProviderRankingRows(data, matches, "NFL").map((row) => ({
              ...row,
              noResults: row.noResults ?? "0",
              ties: row.ties ?? row.draws ?? "0",
              percentage: row.percentage,
              pointsFor: row.pointsFor,
              pointsAgainst: row.pointsAgainst,
            }));
          }
          if (!cancelled) {
            setRows(mapped);
            setError(null);
          }
        }
      } catch (requestError) {
        if (!cancelled) {
          setRows([]);
          setError(requestError instanceof Error ? requestError.message : "Unable to load standings.");
        }
      } finally {
        if (!cancelled) setRowsLoading(false);
      }
    };

    void loadRows();
    return () => {
      cancelled = true;
    };
  }, [effectiveCompetitionId, sport]);

  const displayRows = effectiveCompetitionId ? rows : [];
  const totalRows = displayRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = displayRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const loading = competitionLoading || (Boolean(effectiveCompetitionId) && rowsLoading);
  const sectionTitle = `${sportConfig[sport].label} - ${activeCompetition?.name || "Competition"}`;
  const competitionButtonLabel = activeCompetition?.name || (competitionLoading ? "Loading competitions..." : "Select competition");

  const renderCellValue = (value: string) => value || "-";

  return (
    <main
      className="standings-page font-outfit"
      style={{ "--standings-accent": sportConfig[sport].accent } as React.CSSProperties}
    >
      <section className="container custom-container standings-container">
        <div className="standings-heading">
          <span className="standings-eyebrow">SPORTS DATA</span>
          <h1>STANDINGS</h1>
          <p>Current league tables across all sports.</p>
        </div>

        <div className="standings-sport-tabs" role="tablist" aria-label="Standings sports">
          {(["cricket", "football", "NFL"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={sport === item ? "active" : ""}
              onClick={() => {
                setSport(item);
                setSelectedCompetition("");
                setCompetitionMenuOpen(false);
                setPage(1);
              }}
            >
              {item === "NFL" ? "NFL" : item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        <div className="standings-competition-selector" ref={competitionMenuRef}>
          <div className="standings-competition-selector-label">Competition</div>
          <button
            type="button"
            className="standings-competition-trigger"
            aria-haspopup="listbox"
            aria-expanded={competitionMenuOpen}
            aria-label={`Select competition. Current competition ${competitionButtonLabel}`}
            disabled={!availableCompetitions.length || competitionLoading}
            onClick={() => setCompetitionMenuOpen((value) => !value)}
          >
            <span>{competitionButtonLabel}</span>
            <i className={`bi ${competitionMenuOpen ? "bi-chevron-up" : "bi-chevron-down"}`} aria-hidden="true" />
          </button>

          {competitionMenuOpen && availableCompetitions.length > 0 && (
            <div className="standings-competition-menu" role="listbox" aria-label="Standings competitions">
              {availableCompetitions.map((competition) => (
                <button
                  key={competition.id}
                  type="button"
                  role="option"
                  aria-selected={effectiveCompetitionId === competition.id}
                  className={effectiveCompetitionId === competition.id ? "active" : ""}
                  onClick={() => {
                    setSelectedCompetition(competition.id);
                    setCompetitionMenuOpen(false);
                    setPage(1);
                  }}
                >
                  <span>{competition.name}</span>
                  {effectiveCompetitionId === competition.id ? <i className="bi bi-check2" aria-hidden="true" /> : null}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="standings-section">
          <div className="standings-section-title">
            <span className="standings-section-accent" />
            <h2>{sectionTitle}</h2>
          </div>

          {error && <div className="standings-state mb-3">{error}</div>}

          {loading ? (
            <div className="standings-state">Loading standings...</div>
          ) : visibleRows.length ? (
            <>
              <div className="standings-table-shell">
                <div className="standings-table-scroll">
                  <table className="standings-table">
                    <thead>
                      {sport === "cricket" ? (
                        <tr>
                          <th>#</th>
                          <th>TEAM</th>
                          <th>P</th>
                          <th>W</th>
                          <th>L</th>
                          <th>NR</th>
                          <th>PTS</th>
                          <th>NRR</th>
                        </tr>
                      ) : sport === "football" ? (
                        <tr>
                          <th>#</th>
                          <th>CLUB</th>
                          <th>P</th>
                          <th>W</th>
                          <th>D</th>
                          <th>L</th>
                          <th>GD</th>
                          <th>PTS</th>
                        </tr>
                      ) : (
                        <tr>
                          <th>#</th>
                          <th>TEAM</th>
                          <th>W</th>
                          <th>L</th>
                          <th>T</th>
                          <th>PCT</th>
                          <th>PF</th>
                          <th>PA</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {visibleRows.map((row) => (
                        <tr key={`${sport}-${row.rank}-${row.team}`}>
                          <td className="standings-rank">#{row.rank}</td>
                          <td>
                            <div className="standings-team">
                              <img
                                src={row.teamLogo || placeholderLogo}
                                alt=""
                                className="standings-team-logo"
                                onError={(event) => {
                                  event.currentTarget.src = placeholderLogo;
                                }}
                              />
                              <strong>{row.team}</strong>
                            </div>
                          </td>
                          {sport === "cricket" ? (
                            <>
                              <td className="standings-stat-muted">{renderCellValue(row.played)}</td>
                              <td className="standings-stat-muted">{renderCellValue(row.wins)}</td>
                              <td className="standings-stat-muted">{renderCellValue(row.losses)}</td>
                              <td className="standings-stat-muted">{renderCellValue(row.noResults || "0")}</td>
                              <td className="standings-stat">{renderCellValue(row.points)}</td>
                              <td className="standings-stat-muted">{renderCellValue(row.goalDifference)}</td>
                            </>
                          ) : sport === "football" ? (
                            <>
                              <td className="standings-stat-muted">{renderCellValue(row.played)}</td>
                              <td className="standings-stat-muted">{renderCellValue(row.wins)}</td>
                              <td className="standings-stat-muted">{renderCellValue(row.draws)}</td>
                              <td className="standings-stat-muted">{renderCellValue(row.losses)}</td>
                              <td className="standings-stat-muted">{renderCellValue(row.goalDifference)}</td>
                              <td className="standings-stat">{renderCellValue(row.points)}</td>
                            </>
                          ) : (
                            <>
                              <td className="standings-stat-muted">{renderCellValue(row.wins)}</td>
                              <td className="standings-stat-muted">{renderCellValue(row.losses)}</td>
                              <td className="standings-stat-muted">{renderCellValue(row.ties || row.draws || "0")}</td>
                              <td className="standings-stat-muted">{formatRate(row.percentage || "")}</td>
                              <td className="standings-stat-muted">{renderCellValue(row.pointsFor || "")}</td>
                              <td className="standings-stat-muted">{renderCellValue(row.pointsAgainst || "")}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="standings-pagination">
                <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
                  Next
                </button>
              </div>
              <div className="standings-pagination-summary">
                Showing {totalRows ? ((currentPage - 1) * pageSize) + 1 : 0}-{Math.min(currentPage * pageSize, totalRows)} of {totalRows} teams
              </div>
            </>
          ) : (
            <div className="standings-state">No standings table was supplied for this competition.</div>
          )}
        </div>
      </section>
    </main>
  );
}
