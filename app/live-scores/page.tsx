"use client";

import React, { useState, useEffect, useCallback } from "react";
import SportsTabs from "@/components/live-scores/SportsTabs";
import LiveMatchCard from "@/components/live-scores/LiveMatchCard";
import LoadingSkeleton from "@/components/live-scores/LoadingSkeleton";
import EmptyState from "@/components/live-scores/EmptyState";
import Sidebar from "@/components/live-scores/Sidebar";
import { LiveScoreMatchDetail } from "@/types";
import { cricketApi, mapCricketMatch } from "@/lib/cricket-api";
import { mapNflMatch, mapSoccerMatch, nflApi, soccerApi } from "@/lib/sports-api";

// Set to true for static/mock data to test UI and design without API dependencies.
// Set to false to switch back to dynamic API data anytime.
import { USE_STATIC_MOCK, MOCK_LIVE_MATCHES } from "@/lib/mock-data";

export default function LiveScoresPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<LiveScoreMatchDetail[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState("");

  useEffect(() => {
    const requestedSport = new URLSearchParams(window.location.search).get("sport")?.toLowerCase();
    if (requestedSport === "nfl") setActiveTab("NFL");
    else if (requestedSport === "football" || requestedSport === "soccer") setActiveTab("football");
    else if (requestedSport === "cricket") setActiveTab("cricket");
  }, []);

  const loadData = useCallback(async () => {
    if (USE_STATIC_MOCK) {
      setLoading(false);
      setError(null);
      setMatches(MOCK_LIVE_MATCHES);
      setLastSyncedAt("Just now");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const responses = await Promise.allSettled([
        cricketApi.matches("live"),
        soccerApi.matches("live"),
        nflApi.matches("live"),
      ]);
      const [cricketResult, soccerResult, nflResult] = responses;
      const nextMatches = [
        ...(cricketResult.status === "fulfilled" ? cricketResult.value.map(mapCricketMatch) : []),
        ...(soccerResult.status === "fulfilled" ? soccerResult.value.map(mapSoccerMatch) : []),
        ...(nflResult.status === "fulfilled" ? nflResult.value.map(mapNflMatch) : []),
      ];
      const failures = responses.filter((result) => result.status === "rejected");
      if (failures.length === responses.length) {
        throw new Error("Unable to sync live scores from the sports providers.");
      }
      const fetchedAt = new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", second: "2-digit" });
      setMatches(nextMatches.map((match) => ({ ...match, lastUpdated: match.lastUpdated === "Just now" ? fetchedAt : match.lastUpdated })));
      setLastSyncedAt(fetchedAt);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sync cricket live scores.");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") return undefined;

    const streams = [
      { source: new EventSource(cricketApi.streamUrl()), mapper: mapCricketMatch },
      { source: new EventSource(soccerApi.streamUrl()), mapper: mapSoccerMatch },
    ];
    const handleMatchUpdate = (event: MessageEvent<string>, mapper: typeof mapCricketMatch | typeof mapSoccerMatch) => {
      try {
        const payload = JSON.parse(event.data) as { matchId?: string; match?: Record<string, any> };
        if (!payload.match) return;
        const updated = mapper(payload.match);
        const updatedAt = new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", second: "2-digit" });
        setMatches((current) => {
          const index = current.findIndex((match) => match.id === updated.id);
          if (index < 0) return [...current, { ...updated, lastUpdated: updated.lastUpdated === "Just now" ? updatedAt : updated.lastUpdated }];
          const next = [...current];
          next[index] = { ...updated, lastUpdated: updated.lastUpdated === "Just now" ? updatedAt : updated.lastUpdated };
          return next;
        });
        setLastSyncedAt(updatedAt);
      } catch {
        // A malformed provider push should not interrupt the live page.
      }
    };

    streams.forEach(({ source, mapper }) => source.addEventListener("match-update", ((event: MessageEvent<string>) => handleMatchUpdate(event, mapper)) as EventListener));
    return () => {
      streams.forEach(({ source }) => {
        source.close();
      });
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => { void loadData(); }, 30000);
    return () => window.clearInterval(interval);
  }, [loadData]);

  const handleResetFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
  };

  // Filter logic
  const filteredMatches = matches.filter((match) => {
    const matchesSport = activeTab === "all" ? true : match.sport.toLowerCase() === activeTab.toLowerCase();
    const query = searchQuery.trim().toLowerCase();

    if (!query) return matchesSport;

    const matchesSearch =
      match.matchName.toLowerCase().includes(query) ||
      match.competitionName.toLowerCase().includes(query) ||
      match.team1Name.toLowerCase().includes(query) ||
      match.team2Name.toLowerCase().includes(query) ||
      match.venue.toLowerCase().includes(query);

    return matchesSport && matchesSearch;
  });

  return (
    <main className="container custom-container py-4 mb-5">
      {/* Page Header */}
      <div className="py-4 border-bottom mb-4" style={{ borderColor: "#eae5dc" }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span
                className="badge rounded-pill px-3 py-1.5 fw-bold text-uppercase d-inline-flex align-items-center gap-2"
                style={{
                  background: "#FFCC00",
                  color: "#1C1F22",
                  border: "1px solid #FFCC00",
                  fontSize: "11px",
                  letterSpacing: "0.05em",
                  fontWeight: 700,
                }}
              >
                <span
                  className="rounded-circle d-inline-block"
                  style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: "#1C1F22",
                  }}
                />
                Real-Time Updates
              </span>
            </div>
            <h1
              className="fw-bold mb-1 font-space-grotesk ls-minus-05"
              style={{ color: "#1c1f22", fontSize: "32px" }}
            >
              Live Sports Scores
            </h1>
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
              Real-time scores, play-by-play coverage & live statistics across global leagues.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span
              className="badge rounded-pill px-3 py-2 font-monospace fw-semibold"
              style={{ background: "#ffffff", border: "1px solid #eae5dc", color: "#64748b", fontSize: "12px" }}
            >
              Last sync: <strong style={{ color: "#1c1f22" }}>{lastSyncedAt || "Syncing..."}</strong>
            </span>
            <button
              type="button"
              className="btn rounded-pill px-3.5 py-2 fw-bold text-uppercase d-inline-flex align-items-center gap-2 shadow-none transition-all"
              onClick={() => { void loadData(); }}
              disabled={loading}
              style={{
                fontSize: "12px",
                letterSpacing: "0.04em",
                backgroundColor: "#FFCC00",
                color: "#1C1F22",
                border: "1px solid #FFCC00",
                fontWeight: 700,
              }}
            >
              <i className={`bi bi-arrow-clockwise ${loading ? "spin" : ""}`} style={{ color: "#1C1F22" }} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Content Column */}
        <div className="col-lg-8">
          {/* Search bar & filter tabs */}
          <div className="rounded-4 p-4 mb-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
            <div className="d-flex flex-column gap-3">
              {/* Search Bar Row with Count */}
              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-3">
                <div
                  className="d-flex align-items-center rounded-pill flex-grow-1 transition-all"
                  style={{
                    background: "#fff",
                    border: isSearchFocused ? "1px solid #ffcc00" : "1px solid #eae5dc",
                    boxShadow: isSearchFocused ? "0 0 0 3px rgba(255, 204, 0, 0.2)" : "none",
                    padding: "0 16px",
                    height: "44px",
                  }}
                >
                  <i
                    className="bi bi-search flex-shrink-0 me-2"
                    style={{ color: isSearchFocused ? "#1c1f22" : "#94a3b8", fontSize: "14px" }}
                  />
                  <input
                    type="text"
                    className="border-0 bg-transparent flex-grow-1 shadow-none"
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      color: "#1c1f22",
                      fontSize: "14px",
                      padding: 0,
                    }}
                    placeholder="Search teams, leagues, venues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  {searchQuery !== "" && (
                    <button
                      className="btn border-0 text-muted p-0 ms-2"
                      style={{ background: "transparent" }}
                      onClick={() => setSearchQuery("")}
                      type="button"
                      aria-label="Clear search"
                    >
                      <i className="bi bi-x-circle-fill" style={{ color: "#94a3b8", fontSize: "14px" }} />
                    </button>
                  )}
                </div>

                <div className="d-none d-sm-flex align-items-center">
                  <span
                    className="badge rounded-pill px-3 py-2 font-monospace fw-bold flex-shrink-0"
                    style={{ background: "#faf8f5", border: "1px solid #eae5dc", color: "#64748b", fontSize: "12px" }}
                  >
                    {filteredMatches.length} Live {filteredMatches.length === 1 ? "Match" : "Matches"}
                  </span>
                </div>
              </div>

              {/* Sports Filter Tabs Row */}
              <div className="w-100 pt-1">
                <SportsTabs activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
            </div>
          </div>

          {/* Matches Area */}
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div
              className="card bg-card border border-danger border-opacity-30 rounded-3 p-5 text-center d-flex flex-column align-items-center justify-content-center my-4 min-h-320px"
            >
              <div
                className="d-flex align-items-center justify-content-center text-danger bg-danger bg-opacity-10 rounded-circle mb-4 w-64px h-64px"
              >
                <i className="bi bi-cloud-slash text-danger fs-28"></i>
              </div>
              <h5 className="text-white fw-bold mb-2">Sync Error</h5>
              <p className="text-muted mb-4 mx-auto max-w-420px fs-14 lh-1-6">
                {error}
              </p>
              <button
                className="btn btn-danger px-4 py-2 fw-semibold text-uppercase fs-13 ls-05"
                onClick={loadData}
              >
                Retry Sync
              </button>
            </div>
          ) : filteredMatches.length === 0 ? (
            <EmptyState
              onReset={handleResetFilters}
              message={
                matches.length === 0
                  ? "No live matches available."
                  : "No matches match your filter criteria."
              }
            />
          ) : (
            <div className="d-flex flex-column">
              {filteredMatches.map((match, index) => (
                <LiveMatchCard key={`${match.sport}-${match.id || "live"}-${index}`} match={match} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="col-lg-4">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
