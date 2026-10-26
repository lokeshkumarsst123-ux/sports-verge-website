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

  const getSportBadge = (sport: string) => {
    switch (sport.toLowerCase()) {
      case "cricket":
        return { label: "Cricket", icon: "bi-activity", color: "#16a34a", bg: "rgba(22, 163, 74, 0.1)", border: "rgba(22, 163, 74, 0.25)" };
      case "football":
        return { label: "Football", icon: "bi-dribbble", color: "#2563eb", bg: "rgba(37, 99, 235, 0.1)", border: "rgba(37, 99, 235, 0.25)" };
      case "nfl":
        return { label: "NFL", icon: "bi-trophy-fill", color: "#d97706", bg: "rgba(217, 119, 6, 0.1)", border: "rgba(217, 119, 6, 0.25)" };
      default:
        return { label: sport, icon: "bi-trophy", color: "#64748b", bg: "rgba(100, 116, 139, 0.1)", border: "rgba(100, 116, 139, 0.25)" };
    }
  };

  const badge = getSportBadge(match.sport);

  return (
    <div
      className="card rounded-4 mb-4 p-4 position-relative overflow-hidden transition-all"
      style={{
        background: "#ffffff",
        border: "1px solid #eae5dc",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
      }}
    >
      {/* ── Top Header: Sport Badge • Competition • Status • Clock ── */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-3 border-bottom" style={{ borderColor: "#eae5dc" }}>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span
            className="badge rounded-pill px-2 py-1 fw-bold text-uppercase d-flex align-items-center gap-1"
            style={{
              fontSize: "10px",
              letterSpacing: "0.04em",
              backgroundColor: badge.bg,
              color: badge.color,
              border: `1px solid ${badge.border}`,
            }}
          >
            <i className={`bi ${badge.icon}`} style={{ fontSize: "11px" }} />
            {badge.label}
          </span>
          <span className="fw-bold small text-truncate" style={{ color: "#1c1f22" }}>
            {match.competitionName}
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <StatusBadge status={match.matchStatus} />
          {match.matchTime && (
            <span
              className="badge rounded-pill px-2.5 py-1 font-monospace fw-bold"
              style={{
                fontSize: "11px",
                background: "#faf8f5",
                border: "1px solid #eae5dc",
                color: "#4b5563",
              }}
            >
              {match.matchTime}
            </span>
          )}
        </div>
      </div>

      {/* ── Teams & Score Display ── */}
      <div
        className="d-flex flex-column rounded-3 overflow-hidden my-2.5"
        style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}
      >
        {/* Team 1 */}
        <div
          className="d-flex align-items-center justify-content-between p-3"
          style={{ borderBottom: "1px solid #eae5dc" }}
        >
          <div className="d-flex align-items-center gap-3 overflow-hidden min-w-0">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "40px",
                height: "40px",
                background: "#ffffff",
                border: "1px solid #eae5dc",
                padding: "6px",
              }}
            >
              <img
                src={match.team1Logo}
                alt={match.team1Name}
                width={26}
                height={26}
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
              {match.team1Overs && (
                <span className="text-muted small font-monospace">
                  {match.team1Overs} overs
                </span>
              )}
            </div>
          </div>
          <div className="text-end flex-shrink-0 ps-3">
            <span
              className="font-monospace fw-bold"
              style={{
                fontSize: "22px",
                color: "#1c1f22",
                letterSpacing: "-0.02em",
              }}
            >
              {match.team1Score || "—"}
            </span>
          </div>
        </div>

        {/* Team 2 */}
        <div className="d-flex align-items-center justify-content-between p-3">
          <div className="d-flex align-items-center gap-3 overflow-hidden min-w-0">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "40px",
                height: "40px",
                background: "#ffffff",
                border: "1px solid #eae5dc",
                padding: "6px",
              }}
            >
              <img
                src={match.team2Logo}
                alt={match.team2Name}
                width={26}
                height={26}
                className="object-fit-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/assets/imgs/teams/team-placeholder.svg";
                }}
              />
            </div>
            <div className="min-w-0">
              <span className="fw-bold d-block text-truncate" style={{ color: "#1c1f22", fontSize: "15px" }}>
                {match.team2Name}
              </span>
              {match.team2Overs && (
                <span className="text-muted small font-monospace">
                  {match.team2Overs} overs
                </span>
              )}
            </div>
          </div>
          <div className="text-end flex-shrink-0 ps-3">
            <span
              className="font-monospace fw-bold"
              style={{
                fontSize: "22px",
                color: "#1c1f22",
                letterSpacing: "-0.02em",
              }}
            >
              {match.team2Score || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Live Commentary / Note Banner (if present) ── */}
      {match.note && (
        <div
          className="d-flex align-items-center gap-2 p-2.5 my-2 rounded-3"
          style={{
            background: "#fffdf0",
            border: "1px solid #fde68a",
            borderLeft: "4px solid #ffcc00",
          }}
        >
          <i className="bi bi-info-circle-fill flex-shrink-0" style={{ fontSize: "13px", color: "#d97706" }} />
          <span className="small fw-semibold" style={{ color: "#78350f", lineHeight: 1.4, fontSize: "12.5px" }}>
            {match.note}
          </span>
        </div>
      )}

      {/* ── Card Footer: Venue & Action Button ── */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 pt-3 mt-2 border-top" style={{ borderColor: "#eae5dc" }}>
        <div className="d-flex align-items-center gap-2 text-muted small">
          <i className="bi bi-geo-alt" style={{ color: "#94a3b8" }} />
          <span className="text-truncate" style={{ maxWidth: "260px" }}>
            {match.venue || "Stadium Venue"}
          </span>
        </div>

        <Link
          href={`/live-scores/${match.id}?sport=${match.sport.toLowerCase()}`}
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
