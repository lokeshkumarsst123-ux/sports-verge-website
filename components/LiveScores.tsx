"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LiveScoreMatch } from "@/types";
import { useFavorites } from "@/components/FavoritesContext";
import { cricketApi, mapCricketMatch } from "@/lib/cricket-api";
import { mapNflMatch, mapSoccerMatch, nflApi, soccerApi } from "@/lib/sports-api";

// Set to true for static/mock data to test UI and design without API dependencies.
// Set to false to switch back to dynamic API data anytime.
import { USE_STATIC_MOCK, MOCK_LIVE_SCORES } from "@/lib/mock-data";

const toCard = (match: ReturnType<typeof mapCricketMatch> | ReturnType<typeof mapSoccerMatch> | ReturnType<typeof mapNflMatch>): LiveScoreMatch => ({
  id: match.id,
  league: `${match.competitionName} • ${match.matchName}`,
  time: match.matchTime,
  status: match.matchStatus,
  homeTeam: match.team1Name,
  homeLogo: match.team1Logo,
  homeScore: match.team1Score,
  homeOvers: match.team1Overs,
  awayTeam: match.team2Name,
  awayLogo: match.team2Logo,
  awayScore: match.team2Score,
  awayOvers: match.team2Overs,
  note: match.note,
  venue: match.venue,
  sport: match.sport,
});

export default function LiveScores() {
  const [activeTab, setActiveTab] = useState<"all" | "cricket" | "football" | "NFL">("all");
  const [matches, setMatches] = useState<LiveScoreMatch[]>(USE_STATIC_MOCK ? MOCK_LIVE_SCORES : []);
  const [error, setError] = useState<string | null>(null);
  const { isFavoriteTeam, isFavoriteCompetition } = useFavorites();

  useEffect(() => {
    if (USE_STATIC_MOCK) {
      return;
    }

    let cancelled = false;
    const loadLiveMatches = async () => {
      const responses = await Promise.allSettled([
        cricketApi.matches("live"),
        soccerApi.matches("live"),
        nflApi.matches("live"),
      ]);
      const mapped = responses.flatMap((result, index) => {
        if (result.status !== "fulfilled") return [];
        const mapper = index === 0 ? mapCricketMatch : index === 1 ? mapSoccerMatch : mapNflMatch;
        return result.value.map((raw) => toCard(mapper(raw)));
      });
      if (cancelled) return;
      setMatches(mapped);
      setError(responses.every((result) => result.status === "rejected") ? "Unable to load live scores from the sports providers." : null);
    };

    void loadLiveMatches();
    const interval = window.setInterval(() => { void loadLiveMatches(); }, 30000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, []);

  const getMatchLink = (match: LiveScoreMatch) => {
    if (!match.id) return "/live-scores";
    const sport = match.sport.toLowerCase() === "football" ? "?sport=football" : match.sport.toLowerCase() === "nfl" ? "?sport=nfl" : "?sport=cricket";
    return `/live-scores/${match.id}${sport}`;
  };

  const filteredMatches = activeTab === "all" ? matches : matches.filter((match) => match.sport === activeTab);
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    const aFav = isFavoriteTeam(a.homeTeam) || isFavoriteTeam(a.awayTeam) || isFavoriteCompetition(a.league);
    const bFav = isFavoriteTeam(b.homeTeam) || isFavoriteTeam(b.awayTeam) || isFavoriteCompetition(b.league);
    return aFav === bFav ? 0 : aFav ? -1 : 1;
  });

  return (
    <aside
      className="rounded-4 py-4 px-3 shadow-sm"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE5DC",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 m-0 fw-bold border-start border-3 ps-2 widget-heading">
          Live Scores
        </h2>
        <Link href="/live-scores" className="small widget-view-all">
          View All <i className="bi bi-chevron-right" />
        </Link>
      </div>

      <ul className="nav nav-pills custom-tabs mb-3 flex-nowrap overflow-x-auto scrollbar-none gap-2">
        {(["all", "cricket", "football", "NFL"] as const).map((tab) => (
          <li className="nav-item" role="presentation" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      <div className="scores-list d-flex flex-column gap-2">
        {sortedMatches.length > 0 ? (
          sortedMatches.slice(0, 5).map((match, idx) => (
            <Link
              key={`${match.sport}-${match.id || "live"}-${idx}`}
              href={getMatchLink(match)}
              className="d-block text-decoration-none rounded-4 p-3 transition-all"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EAE5DC",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#FFCC00";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 204, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#EAE5DC";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.03)";
              }}
            >
              {/* Header: Competition & Live Badge */}
              <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-secondary border-opacity-10">
                <span
                  className="small fw-bold text-truncate me-2"
                  style={{ color: "#222429", fontSize: "12px", letterSpacing: "0.03em" }}
                >
                  {match.league}
                </span>
                {match.status === "LIVE" ? (
                  <span
                    className="badge rounded-pill fw-bold d-inline-flex align-items-center gap-1 px-2 py-1 flex-shrink-0"
                    style={{
                      backgroundColor: "rgba(220, 38, 38, 0.12)",
                      color: "#DC2626",
                      fontSize: "11px",
                      letterSpacing: "0.06em",
                      border: "1px solid rgba(220, 38, 38, 0.35)",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#DC2626",
                        display: "inline-block",
                      }}
                    />
                    LIVE
                  </span>
                ) : (
                  <span
                    className="badge rounded-pill fw-bold flex-shrink-0"
                    style={{ backgroundColor: "#F1F5F9", color: "#222429", fontSize: "11px" }}
                  >
                    {match.status}
                  </span>
                )}
              </div>

              {/* Team 1 & Team 2 Rows */}
              {[
                { name: match.homeTeam, logo: match.homeLogo, score: match.homeScore, overs: match.homeOvers },
                { name: match.awayTeam, logo: match.awayLogo, score: match.awayScore, overs: match.awayOvers },
              ].map((team, teamIndex) => (
                <div
                  key={`${match.id || idx}-team-${teamIndex}-${team.name}`}
                  className={`d-flex justify-content-between align-items-center ${teamIndex === 0 ? "mb-2" : "mb-1"}`}
                >
                  <div className="d-flex align-items-center gap-2 flex-grow-1 me-2 min-w-0">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{
                        width: "28px",
                        height: "28px",
                        backgroundColor: "#FAF6EF",
                        border: "1px solid #EAE5DC",
                      }}
                    >
                      <img
                        src={team.logo || "/assets/imgs/teams/team-placeholder.svg"}
                        alt={team.name}
                        style={{ width: "20px", height: "20px", objectFit: "contain" }}
                        onError={(event) => {
                          if (!event.currentTarget.src.endsWith("team-placeholder.svg")) {
                            event.currentTarget.src = "/assets/imgs/teams/team-placeholder.svg";
                          }
                        }}
                      />
                    </div>
                    <span
                      className="fw-bold text-truncate"
                      style={{ color: "#1C1F22", fontSize: "14px", lineHeight: "1.25" }}
                      title={team.name}
                    >
                      {team.name}
                    </span>
                  </div>

                  <div className="text-end flex-shrink-0">
                    <span className="fw-bold font-monospace" style={{ color: "#1C1F22", fontSize: "15px" }}>
                      {team.score}
                    </span>
                    {team.overs && (
                      <span className="small ms-1 fw-bold" style={{ color: "#222429", fontSize: "11.5px" }}>
                        {team.overs}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Match Situation Note */}
              {match.note && (
                <div
                  className="rounded-3 px-2 py-1 mt-2 small fw-bold"
                  style={{
                    backgroundColor: "rgba(255, 204, 0, 0.2)",
                    color: "#78350F",
                    border: "1px solid rgba(217, 119, 6, 0.4)",
                    fontSize: "12px",
                    lineHeight: "1.35",
                  }}
                >
                  <i className="bi bi-info-circle-fill me-1" style={{ color: "#D97706" }} />
                  {match.note}
                </div>
              )}

              {/* Venue */}
              {match.venue && (
                <div className="mt-2 text-truncate fw-semibold" style={{ color: "#222429", fontSize: "11.5px" }}>
                  <i className="bi bi-geo-alt-fill me-1 text-secondary" />
                  {match.venue}
                </div>
              )}
            </Link>
          ))
        ) : (
          <div className="p-4 text-center small widget-empty-text">{error || "No live match"}</div>
        )}

        <Link
          href="/live-scores"
          className="btn w-100 mt-2 p-2.5 rounded-pill text-uppercase fw-bold shadow-none"
          style={{
            backgroundColor: "#FFCC00",
            color: "#1C1F22",
            border: "none",
            fontSize: "13px",
            letterSpacing: "0.04em",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F5BE00")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFCC00")}
        >
          View All Live Scores
        </Link>
      </div>
    </aside>
  );
}
