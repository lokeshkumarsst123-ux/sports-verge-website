"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LiveScoreMatch } from "@/types";
import { useFavorites } from "@/components/FavoritesContext";
import { cricketApi, mapCricketMatch } from "@/lib/cricket-api";
import { mapNflMatch, mapSoccerMatch, nflApi, soccerApi } from "@/lib/sports-api";

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
  const [matches, setMatches] = useState<LiveScoreMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isFavoriteTeam, isFavoriteCompetition } = useFavorites();

  useEffect(() => {
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
    <aside className="live-scores-section bg-card rounded-4 py-4 px-3 border">
      <div className="d-flex justify-content-between align-items-center mb-4">
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
            <button className={`nav-link ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)} type="button">
              {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>
      <div className="scores-list">
        {sortedMatches.length > 0 ? sortedMatches.slice(0, 5).map((match, idx) => (
          <Link key={`${match.sport}-${match.id || "live"}-${idx}`} href={getMatchLink(match)} className="score-box fixtures-card-custom d-block text-decoration-none rounded-3 p-3 mb-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-truncate fixture-league-custom">{match.league}</span>
              {match.status === "LIVE" ? <span className="badge rounded-pill fw-bold badge-live">LIVE</span> : <span className="small fw-semibold result-status-custom">{match.status}</span>}
            </div>
            {[{ name: match.homeTeam, logo: match.homeLogo, score: match.homeScore, overs: match.homeOvers }, { name: match.awayTeam, logo: match.awayLogo, score: match.awayScore, overs: match.awayOvers }].map((team, teamIndex) => (
              <div key={`${match.id || idx}-team-${teamIndex}-${team.name}`} className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center"><Image src={team.logo} alt={team.name} width={20} height={20} className="me-2" /><span className="fw-bold fixture-team-name-custom">{team.name}</span></div>
                <span className="fw-bold fixture-time-custom">{team.score} {team.overs && <span className="fw-normal small fixture-venue-custom">{team.overs}</span>}</span>
              </div>
            ))}
            {match.note && <div className="small mt-2 result-status-custom">{match.note}</div>}
            {match.venue && <div className="mt-2 fs-11 fixture-venue-custom">{match.venue}</div>}
          </Link>
        )) : <div className="p-3 text-center small widget-empty-text">{error || "No live match"}</div>}
        <Link href="/live-scores" className="btn w-100 mt-2 p-2.5 rounded-pill text-uppercase widget-btn-cta">View All Live Scores</Link>
      </div>
    </aside>
  );
}
