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
      return <span title="Goal" style={{ fontSize: "14px" }}>⚽</span>;
    case "yellow_card":
      return (
        <span
          title="Yellow Card"
          style={{
            display: "inline-block",
            width: "10px",
            height: "14px",
            backgroundColor: "#facc15",
            borderRadius: "2px",
            boxShadow: "0 1px 4px rgba(250,204,21,0.5)",
          }}
        />
      );
    case "red_card":
      return (
        <span
          title="Red Card"
          style={{
            display: "inline-block",
            width: "10px",
            height: "14px",
            backgroundColor: "#ef4444",
            borderRadius: "2px",
            boxShadow: "0 1px 4px rgba(239,68,68,0.5)",
          }}
        />
      );
    case "substitution":
      return <span title="Substitution" style={{ fontSize: "12px", color: "#22d3ee" }}>🔄</span>;
    case "penalty":
      return <span title="Penalty" style={{ fontSize: "12px" }}>🎯</span>;
    case "var":
      return (
        <span
          title="VAR Decision"
          style={{
            fontSize: "9px",
            fontWeight: 700,
            backgroundColor: "rgba(168,85,247,0.15)",
            color: "#c084fc",
            border: "1px solid rgba(168,85,247,0.3)",
            borderRadius: "3px",
            padding: "1px 4px",
            letterSpacing: "0.3px",
          }}
        >
          VAR
        </span>
      );
    case "own_goal":
      return <span title="Own Goal" style={{ fontSize: "14px" }}>⚽</span>;
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
      className="card border border-dark rounded-4 mb-4 position-relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #0d1520 0%, #0a1018 100%)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(57, 255, 20, 0.25)";
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-dark, #1e2736)";
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Ambient glow for live matches */}
      {isLiveStatus && (
        <div
          className="position-absolute"
          style={{
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, #ef4444, transparent)",
            opacity: 0.6,
          }}
        />
      )}

      <div className="p-4">
        {/* ── Header Row: League • Matchweek • Status • Time ── */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Football icon */}
            <span
              className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle"
              style={{ width: "22px", height: "22px", flexShrink: 0 }}
            >
              <span style={{ fontSize: "11px" }}>⚽</span>
            </span>
            <span className="text-light fw-semibold" style={{ fontSize: "13px" }}>
              {match.competitionName}
            </span>
            {match.matchWeek && (
              <>
                <span className="text-secondary" style={{ fontSize: "11px" }}>·</span>
                <span className="text-muted" style={{ fontSize: "11px" }}>{match.matchWeek}</span>
              </>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            <StatusBadge status={match.footballMatchStatus || match.matchStatus} />
            {match.currentMinute && (
              <span
                className="font-monospace fw-bold"
                style={{
                  fontSize: "13px",
                  color: isLiveStatus ? "#ff5b5b" : "#8a94a6",
                }}
              >
                {match.currentMinute}
              </span>
            )}
          </div>
        </div>

        {/* ── Main Scoreboard ── */}
        <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
          {/* Home Team */}
          <div className="d-flex flex-column align-items-center gap-2 text-center" style={{ flex: 1 }}>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle border"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
                position: "relative",
              }}
            >
              <Image
                src={match.team1Logo}
                alt={match.team1Name}
                width={40}
                height={40}
                style={{ objectFit: "contain" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/assets/imgs/teams/team-placeholder.svg"; }}
              />
            </div>
            <span className="text-white fw-bold" style={{ fontSize: "13px", lineHeight: 1.3 }}>
              {match.team1Name}
            </span>
            {/* Home goals list */}
            {team1Goals.length > 0 && (
              <div className="d-flex flex-column align-items-center gap-1">
                {team1Goals.map((g, i) => (
                  <span key={i} className="text-muted" style={{ fontSize: "10px" }}>
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
                className="fw-extrabold font-monospace"
                style={{ fontSize: "42px", color: "#f1f5f9", letterSpacing: "-2px", lineHeight: 1 }}
              >
                {match.team1Score}
              </span>
              <span
                className="fw-bold font-monospace rounded-pill"
                style={{
                  fontSize: "11px",
                  color: "var(--accent-green, #22c55e)",
                  backgroundColor: "rgba(26,140,61,0.08)",
                  border: "1px solid rgba(26,140,61,0.2)",
                  padding: "4px 10px",
                  letterSpacing: "1px",
                }}
              >
                VS
              </span>
              <span
                className="fw-extrabold font-monospace"
                style={{ fontSize: "42px", color: "#f1f5f9", letterSpacing: "-2px", lineHeight: 1 }}
              >
                {match.team2Score}
              </span>
            </div>
            {/* Match time */}
            <span className="text-muted" style={{ fontSize: "11px" }}>
              <i className="bi bi-clock me-1" />
              {match.matchTime}
            </span>
          </div>

          {/* Away Team */}
          <div className="d-flex flex-column align-items-center gap-2 text-center" style={{ flex: 1 }}>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle border"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <Image
                src={match.team2Logo}
                alt={match.team2Name}
                width={40}
                height={40}
                style={{ objectFit: "contain" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/assets/imgs/teams/team-placeholder.svg"; }}
              />
            </div>
            <span className="text-white fw-bold" style={{ fontSize: "13px", lineHeight: 1.3 }}>
              {match.team2Name}
            </span>
            {/* Away goals list */}
            {team2Goals.length > 0 && (
              <div className="d-flex flex-column align-items-center gap-1">
                {team2Goals.map((g, i) => (
                  <span key={i} className="text-muted" style={{ fontSize: "10px" }}>
                    ⚽ {g.player} {g.minute}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Match Meta: Stadium, Referee, Updated ── */}
        <div
          className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="d-flex flex-wrap gap-3">
            {/* Stadium / Venue */}
            <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: "11px" }}>
              <i className="bi bi-geo-alt" style={{ fontSize: "10px" }} />
              <span className="text-truncate" style={{ maxWidth: "160px" }}>{match.stadium || match.venue}</span>
            </div>
            {/* Referee */}
            {match.referee && (
              <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: "11px" }}>
                <i className="bi bi-person-badge" style={{ fontSize: "10px" }} />
                <span>{match.referee}</span>
              </div>
            )}
          </div>
          <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2 w-100 w-sm-auto">
            <span className="text-muted" style={{ fontSize: "10px" }}>
              <i className="bi bi-clock-history me-1" />
              {match.lastUpdated}
            </span>
            <Link
              href={`/live-scores/${match.id}`}
              className="btn btn-outline-success btn-sm w-100 w-sm-auto px-3 py-2 fw-semibold text-uppercase"
              style={{ fontSize: "11px", letterSpacing: "0.5px" }}
            >
              View Match Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
