"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { cricketApi, mapCricketResult } from "@/lib/cricket-api";
import { mapNflResult, mapSoccerResult, nflApi, soccerApi } from "@/lib/sports-api";

import { USE_STATIC_MOCK, MOCK_RESULTS } from "@/lib/mock-data";

type SportType = "Cricket" | "Football" | "NFL";

type Result = {
  id?: string;
  league: string;
  home: string;
  homeLogo?: string;
  homeScore?: string;
  away: string;
  awayLogo?: string;
  awayScore?: string;
  result: string;
  date: string;
  venue?: string;
  sport: SportType;
};

const sportBadgeStyle: Record<SportType, { bg: string; color: string; border: string }> = {
  Cricket: { bg: "rgba(22, 163, 74, 0.1)", color: "#15803d", border: "rgba(22, 163, 74, 0.25)" },
  Football: { bg: "rgba(37, 99, 235, 0.1)", color: "#2563eb", border: "rgba(37, 99, 235, 0.25)" },
  NFL: { bg: "rgba(217, 119, 6, 0.1)", color: "#b45309", border: "rgba(217, 119, 6, 0.25)" },
};

const formatResultText = (result: string, home: string, away: string) => {
  const str = String(result || "").trim();
  const lower = str.toLowerCase();
  if (lower === "winner: away" || lower === "winner:away") {
    return `${away} won`;
  }
  if (lower === "winner: home" || lower === "winner:home") {
    return `${home} won`;
  }
  if (lower === "draw" || lower === "tie") {
    return "Match Drawn";
  }
  if (lower.startsWith("winner:")) {
    const winnerName = str.substring(7).trim();
    if (winnerName.toLowerCase() === "away") return `${away} won`;
    if (winnerName.toLowerCase() === "home") return `${home} won`;
    return `${winnerName} won`;
  }
  return str || "Match Finished";
};

const PAGE_SIZE = 8;

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "cricket" | "football" | "NFL">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<Result[]>(USE_STATIC_MOCK ? MOCK_RESULTS : []);
  const [loading, setLoading] = useState(!USE_STATIC_MOCK);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Results – The SportsVerge";
    if (USE_STATIC_MOCK) {
      setResults(MOCK_RESULTS);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const loadResults = async () => {
      setLoading(true);
      try {
        const responses = await Promise.allSettled([
          cricketApi.matches("result"),
          soccerApi.matches("result"),
          nflApi.matches("result"),
        ]);
        const mapped = responses.flatMap((response, index) => {
          if (response.status !== "fulfilled") return [];
          const mapper = index === 0 ? mapCricketResult : index === 1 ? mapSoccerResult : mapNflResult;
          const sportName: SportType = index === 0 ? "Cricket" : index === 1 ? "Football" : "NFL";
          return response.value.map((raw) => {
            const result = mapper(raw);
            return {
              id: result.id,
              league: result.league,
              home: result.home,
              homeLogo: result.homeLogo,
              homeScore: result.homeScore,
              away: result.away,
              awayLogo: result.awayLogo,
              awayScore: result.awayScore,
              result: formatResultText(result.result, result.home, result.away),
              date: result.date,
              sport: sportName,
            } as Result;
          });
        });
        if (!cancelled) {
          setResults(mapped);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load results from API.");
          setResults([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void loadResults();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter by sport & search term
  const filteredResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    return results.filter((item) => {
      const matchTab = activeTab === "all" || item.sport.toLowerCase() === activeTab.toLowerCase();
      const matchSearch =
        !q ||
        item.home.toLowerCase().includes(q) ||
        item.away.toLowerCase().includes(q) ||
        item.league.toLowerCase().includes(q) ||
        (item.venue && item.venue.toLowerCase().includes(q)) ||
        item.result.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [results, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedResults = filteredResults.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getMatchLink = (sport: string, id?: string) => {
    if (!id) return "/live-scores";
    const normalizedSport = sport.toLowerCase();
    return `/live-scores/${id}${normalizedSport === "football" ? "?sport=football" : normalizedSport === "nfl" ? "?sport=nfl" : "?sport=cricket"}`;
  };

  const counts = useMemo(() => {
    return {
      all: results.length,
      cricket: results.filter((r) => r.sport === "Cricket").length,
      football: results.filter((r) => r.sport === "Football").length,
      nfl: results.filter((r) => r.sport === "NFL").length,
    };
  }, [results]);

  return (
    <main className="font-outfit pb-5">
      <PageHeader
        title="Recent Results"
        subtitle="Latest completed match scores, outcomes, and statistics across all sports."
        className="mb-4"
      />

      <div className="container custom-container">
        {/* Filter Bar & Search Row */}
        <div
          className="rounded-4 p-3.5 mb-4 shadow-sm"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EAE5DC",
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
            {/* Sport Tabs */}
            <div className="d-flex flex-wrap gap-2">
              {(
                [
                  { key: "all", label: "All", count: counts.all },
                  { key: "cricket", label: "Cricket", count: counts.cricket },
                  { key: "football", label: "Football", count: counts.football },
                  { key: "NFL", label: "NFL", count: counts.nfl },
                ] as const
              ).map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.key);
                      setPage(1);
                    }}
                    className="btn rounded-pill px-3.5 py-1 fw-bold text-capitalize transition-all shadow-none"
                    style={{
                      fontSize: "13.5px",
                      backgroundColor: isActive ? "#FFCC00" : "#FAF6EF",
                      color: isActive ? "#1C1F22" : "#64748B",
                      border: isActive ? "1px solid #FFCC00" : "1px solid #EAE5DC",
                    }}
                  >
                    {tab.label}
                    <span
                      className="ms-1 px-2 py-0.5 rounded-pill small"
                      style={{
                        fontSize: "11px",
                        backgroundColor: isActive ? "rgba(28, 31, 34, 0.12)" : "rgba(100, 116, 139, 0.12)",
                        color: isActive ? "#1C1F22" : "#64748B",
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div
              className="d-flex align-items-center rounded-pill px-3 py-1 transition-all"
              style={{
                backgroundColor: "#FAF6EF",
                border: "1px solid #EAE5DC",
                minWidth: "260px",
              }}
            >
              <i className="bi bi-search me-2 text-muted" style={{ fontSize: "13px" }} />
              <input
                type="text"
                placeholder="Search team, league..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="border-0 bg-transparent w-100 shadow-none outline-none"
                style={{ fontSize: "13.5px", color: "#1C1F22", outline: "none" }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="btn btn-link p-0 text-muted ms-1 shadow-none"
                >
                  <i className="bi bi-x-circle-fill" style={{ fontSize: "13px" }} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Grid / List */}
        {loading ? (
          <div className="py-5 text-center text-muted">
            <div className="spinner-border text-warning mb-3" role="status" />
            <div>Loading latest results…</div>
          </div>
        ) : paginatedResults.length === 0 ? (
          <div
            className="text-center py-5 rounded-4 shadow-sm"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #EAE5DC" }}
          >
            <i className="bi bi-calendar2-x text-muted fs-1 mb-3 d-block" />
            <h5 className="fw-bold" style={{ color: "#1C1F22" }}>
              No results found
            </h5>
            <p className="text-muted small mb-0">
              {search
                ? `No results matching "${search}". Try searching for another team.`
                : `No completed matches available for ${activeTab}.`}
            </p>
          </div>
        ) : (
          <div className="row g-3">
            {paginatedResults.map((item, idx) => {
              const badge = sportBadgeStyle[item.sport] || sportBadgeStyle.Cricket;
              return (
                <div key={`${item.sport}-${item.id || idx}`} className="col-lg-6">
                  <Link
                    href={getMatchLink(item.sport, item.id)}
                    className="d-block text-decoration-none rounded-4 p-3.5 shadow-sm transition-all h-100"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #EAE5DC",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#FFCC00";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#EAE5DC";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Top Row: Sport Badge, League & Date */}
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-light-subtle">
                      <div className="d-flex align-items-center gap-2 min-w-0 me-2">
                        <span
                          className="badge rounded-pill fw-bold px-2.5 py-1 flex-shrink-0"
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            fontSize: "11px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {item.sport.toUpperCase()}
                        </span>
                        <span
                          className="small fw-semibold text-truncate"
                          style={{ color: "#64748B", fontSize: "12px" }}
                        >
                          {item.league}
                        </span>
                      </div>
                      <span className="small flex-shrink-0 fw-medium" style={{ color: "#94A3B8", fontSize: "11.5px" }}>
                        {item.date}
                      </span>
                    </div>

                    {/* Teams & Scores Comparison */}
                    <div className="d-flex flex-column gap-2 mb-3">
                      {/* Home Team Row */}
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2 min-w-0 me-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                            style={{
                              width: "30px",
                              height: "30px",
                              backgroundColor: "#FAF6EF",
                              border: "1px solid #EAE5DC",
                            }}
                          >
                            <img
                              src={item.homeLogo || "/assets/imgs/teams/team-placeholder.svg"}
                              alt={item.home}
                              style={{ width: "20px", height: "20px", objectFit: "contain" }}
                              onError={(e) => {
                                if (!e.currentTarget.src.endsWith("team-placeholder.svg")) {
                                  e.currentTarget.src = "/assets/imgs/teams/team-placeholder.svg";
                                }
                              }}
                            />
                          </div>
                          <span
                            className="fw-bold text-truncate"
                            style={{ color: "#1C1F22", fontSize: "14px" }}
                            title={item.home}
                          >
                            {item.home}
                          </span>
                        </div>
                        <span
                          className="fw-bold font-monospace flex-shrink-0"
                          style={{ color: "#1C1F22", fontSize: "15px" }}
                        >
                          {item.homeScore || "—"}
                        </span>
                      </div>

                      {/* Away Team Row */}
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2 min-w-0 me-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                            style={{
                              width: "30px",
                              height: "30px",
                              backgroundColor: "#FAF6EF",
                              border: "1px solid #EAE5DC",
                            }}
                          >
                            <img
                              src={item.awayLogo || "/assets/imgs/teams/team-placeholder.svg"}
                              alt={item.away}
                              style={{ width: "20px", height: "20px", objectFit: "contain" }}
                              onError={(e) => {
                                if (!e.currentTarget.src.endsWith("team-placeholder.svg")) {
                                  e.currentTarget.src = "/assets/imgs/teams/team-placeholder.svg";
                                }
                              }}
                            />
                          </div>
                          <span
                            className="fw-bold text-truncate"
                            style={{ color: "#1C1F22", fontSize: "14px" }}
                            title={item.away}
                          >
                            {item.away}
                          </span>
                        </div>
                        <span
                          className="fw-bold font-monospace flex-shrink-0"
                          style={{ color: "#1C1F22", fontSize: "15px" }}
                        >
                          {item.awayScore || "—"}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Status / Result Banner */}
                    <div
                      className="d-flex justify-content-between align-items-center rounded-3 px-3 py-2"
                      style={{
                        backgroundColor: "#FAF6EF",
                        border: "1px solid #EAE5DC",
                      }}
                    >
                      <div className="d-flex align-items-center gap-1 min-w-0 me-2">
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "13px" }} />
                        <span
                          className="fw-bold text-truncate"
                          style={{ color: "#15803d", fontSize: "12.5px" }}
                        >
                          {item.result}
                        </span>
                      </div>
                      <span
                        className="small fw-semibold flex-shrink-0"
                        style={{ color: "#64748B", fontSize: "11.5px" }}
                      >
                        Match Center <i className="bi bi-chevron-right" style={{ fontSize: "10px" }} />
                      </span>
                    </div>

                    {item.venue && (
                      <div className="mt-2 text-truncate" style={{ color: "#222429", fontSize: "11px" }}>
                        <i className="bi bi-geo-alt me-1" />
                        {item.venue}
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Row */}
        {totalPages > 1 && (
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mt-4 pt-3 border-top border-light-subtle">
            <span className="small text-muted">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, filteredResults.length)} of {filteredResults.length} results
            </span>
            <div className="d-flex gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn btn-sm rounded-pill px-3 py-1.5 fw-bold shadow-none"
                style={{
                  backgroundColor: currentPage <= 1 ? "#F1F5F9" : "#FFFFFF",
                  color: currentPage <= 1 ? "#94A3B8" : "#1C1F22",
                  border: "1px solid #EAE5DC",
                }}
              >
                <i className="bi bi-chevron-left me-1" /> Previous
              </button>
              <span
                className="px-3 py-1.5 rounded-pill small fw-bold d-flex align-items-center"
                style={{ backgroundColor: "#FAF6EF", border: "1px solid #EAE5DC", color: "#1C1F22" }}
              >
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn btn-sm rounded-pill px-3 py-1.5 fw-bold shadow-none"
                style={{
                  backgroundColor: currentPage >= totalPages ? "#F1F5F9" : "#FFFFFF",
                  color: currentPage >= totalPages ? "#94A3B8" : "#1C1F22",
                  border: "1px solid #EAE5DC",
                }}
              >
                Next <i className="bi bi-chevron-right ms-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
