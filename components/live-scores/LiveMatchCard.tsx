"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LiveScoreMatchDetail } from "@/types";
import StatusBadge from "./StatusBadge";
import FootballMatchCard from "./FootballMatchCard";

interface LiveMatchCardProps {
  match: LiveScoreMatchDetail;
}

export default function LiveMatchCard({ match }: LiveMatchCardProps) {
  // Delegate to football-specific card when football match has rich data
  if (match.sport === "football" && (match.footballStats || match.footballEventsSummary || match.team1Info)) {
    return <FootballMatchCard match={match} />;
  }

  const getSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
      case "cricket":
        return "bi-activity";
      case "football":
        return "bi-dribbble";
      case "nfl":
        return "bi-trophy-fill";
      case "afl":
        return "bi-shield-fill";
      default:
        return "bi-sport";
    }
  };

  return (
    <div
      className="card bg-card border border-dark rounded-3 mb-4 p-4 position-relative overflow-hidden live-match-card"
    >
      {/* Top Section: Competition & Sport Tag */}
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-10">
        <div className="d-flex align-items-center gap-2">
          <span
            className="d-flex align-items-center justify-content-center text-success bg-success bg-opacity-10 rounded-circle w-24px h-24px"
          >
            <i className={`bi ${getSportIcon(match.sport)} fs-12`}></i>
          </span>
          <span className="fw-semibold text-light small uppercase">{match.competitionName}</span>
        </div>
        <div className="d-flex align-items-center gap-2 text-muted fs-11">
          <i className="bi bi-clock-history"></i>
          <span>Updated {match.lastUpdated}</span>
        </div>
      </div>

      {/* Match Title / Info */}
      <div className="mb-3">
        <div className="text-muted small fw-medium">{match.matchName}</div>
      </div>

      {/* Core Teams Grid */}
      <div className="row align-items-center g-3 mb-3">
        {/* Teams List (Column Left) */}
        <div className="col-12 col-md-8 d-flex flex-column gap-3">
          {/* Team 1 */}
          <div className="d-flex align-items-center justify-content-between gap-2 w-100">
            <div className="d-flex align-items-center gap-2 overflow-hidden min-w-0 flex-grow-1">
              <div
                className="d-flex align-items-center justify-content-center bg-dark rounded p-1 border border-secondary border-opacity-10 flex-shrink-0 w-32px h-32px position-relative"
              >
                <Image
                  src={match.team1Logo}
                  alt={match.team1Name}
                  width={24}
                  height={24} className="object-fit-contain"
                />
              </div>
              <span className="fw-semibold text-white text-truncate flex-grow-1">{match.team1Name}</span>
              {match.team1Overs && (
                <span className="text-muted small text-nowrap flex-shrink-0">({match.team1Overs} ov)</span>
              )}
            </div>
            <div className="fs-5 fw-bold text-success font-monospace flex-shrink-0 ps-2">{match.team1Score}</div>
          </div>

          {/* Team 2 */}
          <div className="d-flex align-items-center justify-content-between gap-2 w-100">
            <div className="d-flex align-items-center gap-2 overflow-hidden min-w-0 flex-grow-1">
              <div
                className="d-flex align-items-center justify-content-center bg-dark rounded p-1 border border-secondary border-opacity-10 flex-shrink-0 w-32px h-32px position-relative"
              >
                <Image
                  src={match.team2Logo}
                  alt={match.team2Name}
                  width={24}
                  height={24} className="object-fit-contain"
                />
              </div>
              <span className="fw-semibold text-white text-truncate flex-grow-1">{match.team2Name}</span>
              {match.team2Overs && (
                <span className="text-muted small text-nowrap flex-shrink-0">({match.team2Overs} ov)</span>
              )}
            </div>
            <div className="fs-5 fw-bold text-success font-monospace flex-shrink-0 ps-2">{match.team2Score}</div>
          </div>
        </div>

        {/* Status Box (Column Right on Desktop, wraps on Mobile) */}
        <div className="col-12 col-md-4 d-flex flex-row flex-md-column align-items-center justify-content-between justify-content-md-center gap-2 border-start-md ps-md-4">
          <div className="d-flex flex-column align-items-md-center">
            <span className="text-muted d-none d-md-block mb-1 fs-11">STATUS</span>
            <StatusBadge status={match.matchStatus} />
          </div>
          <div className="text-start text-md-center mt-2 mt-md-0 d-flex flex-row flex-md-column align-items-center gap-2">
            <span className="text-muted d-none d-md-block mb-0.5 fs-11">TIME</span>
            <div className="small font-monospace text-light">{match.matchTime}</div>
          </div>
        </div>
      </div>

      {/* Sport Match Notes (e.g. target, winner statement) */}
      {match.note && (
        <div className="bg-success bg-opacity-10 border border-success border-opacity-20 rounded p-3 mb-3 text-success small fw-medium">
          <i className="bi bi-info-circle me-2"></i>
          {match.note}
        </div>
      )}

      {/* Bottom Metadata & Button */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 pt-3 border-top border-secondary border-opacity-10">
        <div className="d-flex align-items-center gap-2 text-muted fs-12">
          <i className="bi bi-geo-alt"></i>
          <span className="text-truncate max-w-250px">{match.venue}</span>
        </div>
        <Link
          href={`/live-scores/${match.id}`}
          className="btn btn-outline-success btn-sm w-100 w-sm-auto px-4 py-2 fw-semibold text-uppercase fs-12 ls-05"
        >
          View Match Details
        </Link>
      </div>
    </div>
  );
}
