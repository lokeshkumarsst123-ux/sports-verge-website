"use client";

import React, { useState, useEffect } from "react";
import SportsTabs from "@/components/live-scores/SportsTabs";
import LiveMatchCard from "@/components/live-scores/LiveMatchCard";
import LoadingSkeleton from "@/components/live-scores/LoadingSkeleton";
import EmptyState from "@/components/live-scores/EmptyState";
import Sidebar from "@/components/live-scores/Sidebar";
import { liveScoresDetailData } from "@/data/mockData";
import { LiveScoreMatchDetail } from "@/types";

export default function LiveScoresPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<LiveScoreMatchDetail[]>([]);

  // Initial loading simulation
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setMatches(liveScoresDetailData);
      setLoading(false);
    }, 1200); // realistic load time
  };

  const handleResetFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
  };

  const triggerErrorState = () => {
    setLoading(true);
    setTimeout(() => {
      setError("Failed to sync with live sports database. Please verify your connection.");
      setLoading(false);
    }, 800);
  };

  const triggerEmptyState = () => {
    setLoading(true);
    setTimeout(() => {
      setMatches([]);
      setLoading(false);
    }, 800);
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
              className="fw-bold text-white mb-2"
              style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.5px" }}
            >
              Live <span className="text-success">Scores</span>
            </h1>
            <p className="text-muted mb-0 fs-6">Real-time scores from all supported sports.</p>
          </div>

          {/* Interactive Simulation Controls */}

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
                  className={`input-group rounded-3 overflow-hidden bg-dark border ${
                    isSearchFocused ? "border-success" : "border-secondary border-opacity-25"
                  }`}
                  style={{
                    transition: "all 0.2s ease",
                    boxShadow: isSearchFocused ? "0 0 0 0.25rem rgba(26, 140, 61, 0.15)" : "none",
                  }}
                >
                  <span className="input-group-text bg-transparent border-0 text-muted pe-1">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-transparent border-0 text-light ps-2 py-2"
                    placeholder="Search teams, leagues, venues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    style={{
                      fontSize: "14px",
                      boxShadow: "none",
                      outline: "none",
                    }}
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
              className="card bg-card border border-danger border-opacity-30 rounded-3 p-5 text-center d-flex flex-column align-items-center justify-content-center my-4"
              style={{ minHeight: "320px" }}
            >
              <div
                className="d-flex align-items-center justify-content-center text-danger bg-danger bg-opacity-10 rounded-circle mb-4"
                style={{ width: "64px", height: "64px" }}
              >
                <i className="bi bi-cloud-slash text-danger" style={{ fontSize: "28px" }}></i>
              </div>
              <h5 className="text-white fw-bold mb-2">Sync Error</h5>
              <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "420px", fontSize: "14px", lineHeight: "1.6" }}>
                {error}
              </p>
              <button
                className="btn btn-danger px-4 py-2 fw-semibold text-uppercase"
                onClick={loadData}
                style={{ fontSize: "13px", letterSpacing: "0.5px" }}
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
              {filteredMatches.map((match) => (
                <LiveMatchCard key={match.id} match={match} />
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
