"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LiveScoreMatchDetail } from "@/types";
import StatusBadge from "./StatusBadge";

interface FootballMatchCardProps {
  match: LiveScoreMatchDetail;
}

export default function FootballMatchCard({ match }: FootballMatchCardProps) {
  const summary = match.footballEventsSummary;

  const isLiveStatus = ["Kick Off", "First Half", "Second Half", "Extra Time", "Penalty Shootout"].includes(
    match.footballMatchStatus || match.matchStatus
  );

  const team1Goals = summary?.goals.filter((g) => g.team === 1) || [];
  const team2Goals = summary?.goals.filter((g) => g.team === 2) || [];

  return (
    <div
      className="card rounded-4 mb-4 p-4 position-relative overflow-hidden transition-all"
      style={{
        background: "#ffffff",
        border: "1px solid #eae5dc",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
      }}
    >
      {/* ── Header Row: League • Matchweek • Status • Time ── */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-3 border-bottom" style={{ borderColor: "#eae5dc" }}>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span
            className="badge rounded-pill px-2 py-1 fw-bold text-uppercase d-flex align-items-center gap-1"
            style={{
              fontSize: "10px",
              letterSpacing: "0.04em",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              color: "#2563eb",
              border: "1px solid rgba(37, 99, 235, 0.25)",
            }}
          >
            <i className="bi bi-dribbble" style={{ fontSize: "11px" }} />
            Football
          </span>
          <span className="fw-bold small text-truncate" style={{ color: "#1c1f22" }}>
            {match.competitionName}
          </span>
          {match.matchWeek && (
            <>
              <span className="text-muted small">·</span>
              <span className="text-muted small fw-medium">{match.matchWeek}</span>
            </>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          <StatusBadge status={match.footballMatchStatus || match.matchStatus} />
          {match.currentMinute && (
            <span
              className="badge rounded-pill px-2.5 py-1 font-monospace fw-bold"
              style={{
                fontSize: "11px",
                background: isLiveStatus ? "rgba(220, 38, 38, 0.1)" : "#faf8f5",
                color: isLiveStatus ? "#dc2626" : "#4b5563",
                border: `1px solid ${isLiveStatus ? "rgba(220, 38, 38, 0.2)" : "#eae5dc"}`,
              }}
            >
              {match.currentMinute}
            </span>
          )}
        </div>
      </div>

      {/* ── Main Scoreboard ── */}
      <div className="row align-items-center g-3 my-2 p-3 rounded-3" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
        {/* Home Team */}
        <div className="col-5 d-flex align-items-center gap-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "42px",
              height: "42px",
              background: "#ffffff",
              border: "1px solid #eae5dc",
              padding: "6px",
            }}
          >
            <img
              src={match.team1Logo}
              alt={match.team1Name}
              width={28}
              height={28}
              className="object-fit-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/assets/imgs/teams/team-placeholder.svg";
              }}
            />
          </div>
          <div className="min-w-0">
            <span className="fw-bold d-block text-truncate" style={{ color: "#1c1f22", fontSize: "15px" }}>
              {match.team1Name}
            </span>
            {team1Goals.length > 0 && (
              <div className="text-muted fs-11 text-truncate">
                ⚽ {team1Goals.map((g) => `${g.player} ${g.minute}`).join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Center Score */}
        <div className="col-2 text-center">
          <div className="d-flex align-items-center justify-content-center gap-2">
            <span className="font-monospace fw-bold" style={{ fontSize: "24px", color: "#1c1f22" }}>
              {match.team1Score}
            </span>
            <span className="text-muted small">-</span>
            <span className="font-monospace fw-bold" style={{ fontSize: "24px", color: "#1c1f22" }}>
              {match.team2Score}
            </span>
          </div>
          {match.matchTime && (
            <span className="text-muted fs-11 d-block font-monospace">
              {match.matchTime}
            </span>
          )}
        </div>

        {/* Away Team */}
        <div className="col-5 d-flex align-items-center justify-content-end gap-3 text-end">
          <div className="min-w-0">
            <span className="fw-bold d-block text-truncate" style={{ color: "#1c1f22", fontSize: "15px" }}>
              {match.team2Name}
            </span>
            {team2Goals.length > 0 && (
              <div className="text-muted fs-11 text-truncate">
                ⚽ {team2Goals.map((g) => `${g.player} ${g.minute}`).join(", ")}
              </div>
            )}
          </div>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "42px",
              height: "42px",
              background: "#ffffff",
              border: "1px solid #eae5dc",
              padding: "6px",
            }}
          >
            <img
              src={match.team2Logo}
              alt={match.team2Name}
              width={28}
              height={28}
              className="object-fit-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/assets/imgs/teams/team-placeholder.svg";
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Match Meta & Action Button ── */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 pt-3 mt-2 border-top" style={{ borderColor: "#eae5dc" }}>
        <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
          <div className="d-flex align-items-center gap-1">
            <i className="bi bi-geo-alt" style={{ color: "#94a3b8" }} />
            <span className="text-truncate" style={{ maxWidth: "200px" }}>
              {match.stadium || match.venue || "Stadium Venue"}
            </span>
          </div>
          {match.referee && (
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-person-badge" style={{ color: "#94a3b8" }} />
              <span>{match.referee}</span>
            </div>
          )}
        </div>

        <Link
          href={`/live-scores/${match.id}?sport=football`}
          className="btn rounded-pill px-4 py-2 fw-bold text-uppercase d-inline-flex align-items-center gap-2 transition-all w-100 w-sm-auto justify-content-center shadow-none"
          style={{
            fontSize: "12px",
            letterSpacing: "0.04em",
            backgroundColor: "#FFCC00",
            color: "#1C1F22",
            border: "1px solid #FFCC00",
            fontWeight: 700,
          }}
        >
          <span>View Match Details</span>
          <i className="bi bi-arrow-right" style={{ fontSize: "12px", color: "#1C1F22" }} />
        </Link>
      </div>
    </div>
  );
}
