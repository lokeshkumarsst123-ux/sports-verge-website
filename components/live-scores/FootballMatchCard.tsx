"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LiveScoreMatchDetail } from "@/types";
import StatusBadge from "./StatusBadge";

interface FootballMatchCardProps {
  match: LiveScoreMatchDetail;
}

function EventIcon({ type }: { type: string }) {
  switch (type) {
    case "goal":
      return <span title="Goal" className="fs-14">⚽</span>;
    case "yellow_card":
      return (
        <span
          title="Yellow Card"
          className="badge-yellow-card"
        />
      );
    case "red_card":
      return (
        <span
          title="Red Card"
          className="badge-red-card"
        />
      );
    case "substitution":
      return <span title="Substitution" className="fs-12 text-22d3ee">🔄</span>;
    case "penalty":
      return <span title="Penalty" className="fs-12">🎯</span>;
    case "var":
      return (
        <span
          title="VAR Decision"
          className="badge-var-decision"
        >
          VAR
        </span>
      );
    case "own_goal":
      return <span title="Own Goal" className="fs-14">⚽</span>;
    default:
      return null;
  }
}

export default function FootballMatchCard({ match }: FootballMatchCardProps) {
  const summary = match.footballEventsSummary;

  const isLiveStatus = ["Kick Off", "First Half", "Second Half", "Extra Time", "Penalty Shootout"].includes(
    match.footballMatchStatus || match.matchStatus
  );

  // Build per-team goal list for the scoreline section
  const team1Goals = summary?.goals.filter((g) => g.team === 1) || [];
  const team2Goals = summary?.goals.filter((g) => g.team === 2) || [];

  return (
    <div
      className="card border border-dark rounded-4 mb-4 position-relative overflow-hidden football-match-card-adv"
    >
      {/* Ambient glow for live matches */}
      {isLiveStatus && (
        <div
          className="position-absolute live-match-ambient-glow"
        />
      )}

      <div className="p-4">
        {/* ── Header Row: League • Matchweek • Status • Time ── */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-3 border-bottom-white-05">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Football icon */}
            <span
              className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle w-22px h-22px flex-shrink-0"
            >
              <span className="fs-11">⚽</span>
            </span>
            <span className="text-light fw-semibold fs-13">
              {match.competitionName}
            </span>
            {match.matchWeek && (
              <>
                <span className="text-secondary fs-11">·</span>
                <span className="text-muted fs-11">{match.matchWeek}</span>
              </>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            <StatusBadge status={match.footballMatchStatus || match.matchStatus} />
            {match.currentMinute && (
              <span
                className={`font-monospace fw-bold fs-13 ${isLiveStatus ? "text-live-red" : "text-muted-gray"}`}
              >
                {match.currentMinute}
              </span>
            )}
          </div>
        </div>

        {/* ── Main Scoreboard ── */}
        <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
          {/* Home Team */}
          <div className="d-flex flex-column align-items-center gap-2 text-center flex-fill">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle border team-logo-container-large"
            >
              <Image
                src={match.team1Logo}
                alt={match.team1Name}
                width={40}
                height={40} className="object-fit-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/assets/imgs/teams/team-placeholder.svg"; }}
              />
            </div>
            <span className="text-white fw-bold fs-13-lh-13">
              {match.team1Name}
            </span>
            {/* Home goals list */}
            {team1Goals.length > 0 && (
              <div className="d-flex flex-column align-items-center gap-1">
                {team1Goals.map((g, i) => (
                  <span key={i} className="text-muted fs-10">
                    ⚽ {g.player} {g.minute}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Score */}
          <div className="d-flex flex-column align-items-center gap-2">
            <div className="d-flex align-items-center gap-3">
              <span
                className="fw-extrabold font-monospace score-text-large"
              >
                {match.team1Score}
              </span>
              <span
                className="fw-bold font-monospace rounded-pill vs-badge-green"
              >
                VS
              </span>
              <span
                className="fw-extrabold font-monospace score-text-large"
              >
                {match.team2Score}
              </span>
            </div>
            {/* Match time */}
            <span className="text-muted fs-11">
              <i className="bi bi-clock me-1" />
              {match.matchTime}
            </span>
          </div>

          {/* Away Team */}
          <div className="d-flex flex-column align-items-center gap-2 text-center flex-fill">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle border team-logo-container-large"
            >
              <Image
                src={match.team2Logo}
                alt={match.team2Name}
                width={40}
                height={40} className="object-fit-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/assets/imgs/teams/team-placeholder.svg"; }}
              />
            </div>
            <span className="text-white fw-bold fs-13-lh-13">
              {match.team2Name}
            </span>
            {/* Away goals list */}
            {team2Goals.length > 0 && (
              <div className="d-flex flex-column align-items-center gap-1">
                {team2Goals.map((g, i) => (
                  <span key={i} className="text-muted fs-10">
                    ⚽ {g.player} {g.minute}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Match Meta: Stadium, Referee, Updated ── */}
        <div
          className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 pt-3 border-top-white-05"
        >
          <div className="d-flex flex-wrap gap-3">
            {/* Stadium / Venue */}
            <div className="d-flex align-items-center gap-1 text-muted fs-11">
              <i className="bi bi-geo-alt fs-10" />
              <span className="text-truncate max-w-160px">{match.stadium || match.venue}</span>
            </div>
            {/* Referee */}
            {match.referee && (
              <div className="d-flex align-items-center gap-1 text-muted fs-11">
                <i className="bi bi-person-badge fs-10" />
                <span>{match.referee}</span>
              </div>
            )}
          </div>
          <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 w-100 w-sm-auto">
            <span className="text-muted text-nowrap flex-shrink-0 fs-10">
              <i className="bi bi-clock-history me-1" />
              {match.lastUpdated}
            </span>
            <Link
              href={`/live-scores/${match.id}`}
              className="btn btn-outline-success btn-sm w-100 w-sm-auto px-3 py-2 fw-semibold text-uppercase fs-11 ls-05px"
            >
              View Match Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
