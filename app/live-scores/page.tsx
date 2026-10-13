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
      <div className="py-4 border-bottom border-secondary border-opacity-10 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h1
              className="fw-bold text-white mb-2 font-space-grotesk ls-minus-05"
            >
              Live <span className="text-success">Scores</span>
            </h1>
            <p className="text-muted mb-0 fs-14">Real-time scores from all supported sports.</p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Last sync: {lastSyncedAt || "Syncing..."}</span>
            <button type="button" className="btn btn-outline-success btn-sm" onClick={() => { void loadData(); }} disabled={loading}>
              <i className={`bi bi-arrow-clockwise me-1 ${loading ? "spin" : ""}`}></i>Refresh
            </button>
          </div>

        </div>
      </div>

      <div className="row g-4">
        {/* Main Content Column */}
        <div className="col-lg-8">
          {/* Search bar & filter tabs */}
          <div className="bg-card border border-dark rounded-3 p-4 mb-4">
            <div className="d-flex flex-column gap-3">
              {/* Search Bar Row */}
              <div className="w-100">
                <div
                  className={`input-group rounded-3 overflow-hidden bg-dark border search-box-wrapper ${
                    isSearchFocused ? "border-success focused" : "border-secondary border-opacity-25"
                  }`}
                >
                  <span className="input-group-text bg-transparent border-0 text-muted pe-1">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-transparent border-0 text-light ps-2 py-2 search-input"
                    placeholder="Search teams, leagues, venues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  {searchQuery !== "" && (
                    <button
                      className="btn bg-transparent border-0 text-muted"
                      onClick={() => setSearchQuery("")}
                      type="button"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>
              </div>
              {/* Sports Filter Tabs Row */}
              <div className="w-100">
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
