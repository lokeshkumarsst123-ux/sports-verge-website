"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LiveScoreMatchDetail, NFLMatchData } from "@/types";

interface NFLMatchDetailProps {
  match: LiveScoreMatchDetail;
}

export default function NFLMatchDetail({ match }: NFLMatchDetailProps) {
  const nflData = match.nflData;
  if (!nflData) return null;

  const [activeTab, setActiveTab] = useState<
    "overview" | "stats" | "players" | "plays" | "rosters"
  >("overview");

  return (
    <div className="nfl-match-detail w-100">
      {/* ── Tab Navigation ── */}
      <div className="d-flex border-bottom overflow-x-auto scrollbar-none mb-4 gap-2 pb-2" style={{ borderColor: "#eae5dc" }}>
        {[
          { id: "overview", label: "Overview", icon: "bi-info-square" },
          { id: "stats", label: "Team Stats", icon: "bi-bar-chart" },
          { id: "players", label: "Player Leaders", icon: "bi-person-badge" },
          { id: "plays", label: "Play-by-Play & Drives", icon: "bi-card-list" },
          { id: "rosters", label: "Rosters", icon: "bi-people" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="btn border-0 rounded-pill px-4 py-2 fw-bold text-uppercase flex-shrink-0 d-flex align-items-center gap-2 transition-all shadow-none"
              style={{
                fontSize: "12px",
                letterSpacing: "0.04em",
                backgroundColor: isActive ? "#1c1f22" : "#faf8f5",
                color: isActive ? "#ffffff" : "#64748b",
                border: `1px solid ${isActive ? "#1c1f22" : "#eae5dc"}`,
              }}
            >
              <i className={`bi ${tab.icon}`} style={{ fontSize: "13px" }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Contents ── */}
      <div className="tab-content">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="d-flex flex-column gap-4">
            {/* Score by Quarter */}
            <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
              <h5 className="fw-bold mb-4 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
                <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "18px", backgroundColor: "#ffcc00" }} />
                Score by Quarter
              </h5>
              {/* Score Table - Div Layout */}
              <div className="d-flex flex-column gap-3 w-100">
                {/* Header Row */}
                <div className="d-flex w-100 text-muted small font-monospace pb-2 border-bottom" style={{ borderColor: "#eae5dc" }}>
                  <div className="w-35p">Team</div>
                  <div className="text-center flex-1">Q1</div>
                  <div className="text-center flex-1">Q2</div>
                  <div className="text-center flex-1">Q3</div>
                  <div className="text-center flex-1">Q4</div>
                  {nflData.quarterScores.team1.ot !== undefined && <div className="text-center flex-1">OT</div>}
                  <div className="text-center flex-1-5 fw-bold" style={{ color: "#16a34a" }}>Total</div>
                </div>

                {/* Team 1 Row */}
                <div className="d-flex w-100 align-items-center py-2 border-bottom" style={{ borderColor: "#f1ede6" }}>
                  <div className="d-flex align-items-center gap-2 w-35p">
                    <img src={match.team1Logo} width={24} height={24} alt="T1" className="object-fit-contain" />
                    <span className="fw-semibold text-truncate" style={{ color: "#1c1f22" }}>{match.team1Name}</span>
                  </div>
                  <div className="text-center flex-1 fs-14 fw-medium" style={{ color: "#4b5563" }}>{nflData.quarterScores.team1.q1}</div>
                  <div className="text-center flex-1 fs-14 fw-medium" style={{ color: "#4b5563" }}>{nflData.quarterScores.team1.q2}</div>
                  <div className="text-center flex-1 fs-14 fw-medium" style={{ color: "#4b5563" }}>{nflData.quarterScores.team1.q3}</div>
                  <div className="text-center flex-1 fs-14 fw-medium" style={{ color: "#4b5563" }}>{nflData.quarterScores.team1.q4}</div>
                  {nflData.quarterScores.team1.ot !== undefined && <div className="text-center flex-1 fs-14 fw-medium" style={{ color: "#4b5563" }}>{nflData.quarterScores.team1.ot}</div>}
                  <div className="text-center fw-bold flex-1-5 fs-15 font-monospace" style={{ color: "#1c1f22" }}>{nflData.quarterScores.team1.total}</div>
                </div>

                {/* Team 2 Row */}
                <div className="d-flex w-100 align-items-center py-2">
                  <div className="d-flex align-items-center gap-2 w-35p">
                    <img src={match.team2Logo} width={24} height={24} alt="T2" className="object-fit-contain" />
                    <span className="fw-semibold text-truncate" style={{ color: "#1c1f22" }}>{match.team2Name}</span>
                  </div>
                  <div className="text-center flex-1 fs-14 fw-medium" style={{ color: "#4b5563" }}>{nflData.quarterScores.team2.q1}</div>
                  <div className="text-center flex-1 fs-14 fw-medium" style={{ color: "#4b5563" }}>{nflData.quarterScores.team2.q2}</div>
                  <div className="text-center flex-1 fs-14 fw-medium" style={{ color: "#4b5563" }}>{nflData.quarterScores.team2.q3}</div>
                  <div className="text-center flex-1 fs-14 fw-medium" style={{ color: "#4b5563" }}>{nflData.quarterScores.team2.q4}</div>
                  {nflData.quarterScores.team2.ot !== undefined && <div className="text-center flex-1 fs-14 fw-medium" style={{ color: "#4b5563" }}>{nflData.quarterScores.team2.ot}</div>}
                  <div className="text-center fw-bold flex-1-5 fs-15 font-monospace" style={{ color: "#1c1f22" }}>{nflData.quarterScores.team2.total}</div>
                </div>
              </div>
            </div>

            {/* Scoring Summary */}
            <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
              <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom" style={{ borderColor: "#eae5dc" }}>
                <h5 className="fw-bold mb-0 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
                  <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "18px", backgroundColor: "#ffcc00" }} />
                  Scoring Summary
                </h5>
                <span className="badge rounded-pill px-3 py-1 font-monospace" style={{ background: "#faf8f5", color: "#64748b", border: "1px solid #eae5dc", fontSize: "11px" }}>
                  {nflData.scoringPlays.length} Plays
                </span>
              </div>

              <div className="d-flex flex-column gap-3">
                {nflData.scoringPlays.map((play, idx) => (
                  <div
                    key={idx}
                    className="d-flex flex-wrap align-items-center justify-content-between p-3 rounded-3"
                    style={{
                      background: "#faf8f5",
                      border: "1px solid #eae5dc",
                      gap: "12px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* Left: Quarter & Time + Team Logo + Badge + Description */}
                    <div className="d-flex align-items-center gap-3" style={{ minWidth: 0, flex: "1 1 320px" }}>
                      {/* Quarter & Clock Pill */}
                      <div
                        className="d-flex flex-column align-items-center justify-content-center rounded flex-shrink-0"
                        style={{
                          width: "52px",
                          height: "46px",
                          background: "#ffffff",
                          border: "1.5px solid #eae5dc",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        }}
                      >
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "#1c1f22" }}>Q{play.quarter}</span>
                        <span className="font-monospace" style={{ fontSize: "10px", fontWeight: 600, color: "#78716c" }}>{play.time}</span>
                      </div>

                      {/* Team Logo Badge */}
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                        style={{
                          width: "40px",
                          height: "40px",
                          background: "#ffffff",
                          border: "1px solid #eae5dc",
                          padding: "5px",
                        }}
                      >
                        <img
                          src={play.team === 1 ? match.team1Logo : match.team2Logo}
                          alt={play.team === 1 ? match.team1Name : match.team2Name}
                          style={{ width: "26px", height: "26px", objectFit: "contain" }}
                        />
                      </div>

                      {/* Play Description & Type */}
                      <div style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span
                            className="badge rounded-pill px-2 py-1 fw-bold"
                            style={{
                              fontSize: "10px",
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                              backgroundColor: play.type === "TD" ? "rgba(22, 163, 74, 0.12)" : play.type === "FG" ? "rgba(217, 119, 6, 0.12)" : "rgba(37, 99, 235, 0.12)",
                              color: play.type === "TD" ? "#16a34a" : play.type === "FG" ? "#d97706" : "#2563eb",
                              border: `1px solid ${play.type === "TD" ? "rgba(22, 163, 74, 0.25)" : play.type === "FG" ? "rgba(217, 119, 6, 0.25)" : "rgba(37, 99, 235, 0.25)"}`,
                            }}
                          >
                            {play.type === "TD" ? "Touchdown" : play.type === "FG" ? "Field Goal" : play.type === "XP" ? "Extra Point" : play.type === "2PT" ? "2-Pt Conversion" : "Safety"}
                          </span>
                          <span className="small text-muted fw-semibold">
                            {play.team === 1 ? match.team1Name : match.team2Name}
                          </span>
                        </div>
                        <p className="m-0 fw-semibold" style={{ color: "#1c1f22", fontSize: "13px", lineHeight: 1.35 }}>
                          {play.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Progressive Score Display */}
                    <div
                      className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 flex-shrink-0"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #eae5dc",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                      }}
                    >
                      <span className="small fw-bold" style={{ color: play.team === 1 ? "#16a34a" : "#64748b" }}>
                        {match.team1Name.split(" ").pop()}
                      </span>
                      <span className="font-monospace fw-bold" style={{ fontSize: "16px", color: play.team === 1 ? "#16a34a" : "#1c1f22" }}>
                        {play.score1 ?? 0}
                      </span>
                      <span className="text-muted small">-</span>
                      <span className="font-monospace fw-bold" style={{ fontSize: "16px", color: play.team === 2 ? "#16a34a" : "#1c1f22" }}>
                        {play.score2 ?? 0}
                      </span>
                      <span className="small fw-bold" style={{ color: play.team === 2 ? "#16a34a" : "#64748b" }}>
                        {match.team2Name.split(" ").pop()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Match Information */}
            <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
              <h5 className="fw-bold mb-4 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
                <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "18px", backgroundColor: "#ffcc00" }} />
                Match Information
              </h5>
              <div className="row g-3">
                {[
                  { label: "Season", val: nflData.season },
                  { label: "Week", val: nflData.week },
                  { label: "Venue", val: nflData.stadium },
                  { label: "Attendance", val: nflData.attendance?.toLocaleString() || "N/A" },
                  { label: "Weather", val: nflData.weather || "N/A" },
                  { label: "Surface", val: nflData.surfaceType || "N/A" },
                  { label: "Referee", val: nflData.refereeCrewChief || "N/A" }
                ].map((info, i) => (
                  <div key={i} className="col-6 col-md-4">
                    <div className="p-3 rounded-3" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                      <div className="text-muted text-uppercase mb-1 fs-10 ls-1 fw-bold">{info.label}</div>
                      <div className="fw-semibold small text-truncate" style={{ color: "#1c1f22" }}>{info.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEAM STATS TAB */}
        {activeTab === "stats" && (
          <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
            <h5 className="fw-bold mb-4 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
              <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "18px", backgroundColor: "#ffcc00" }} />
              Team Comparison
            </h5>
            <div className="d-flex flex-column gap-3">
              {/* Teams Matchup Header */}
              <div className="d-flex justify-content-between align-items-center mb-2 p-3 rounded-3" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", background: "#ffffff", border: "1px solid #eae5dc", padding: "4px" }}>
                    <img src={match.team1Logo} width={26} height={26} alt={match.team1Name} className="object-fit-contain" />
                  </div>
                  <span className="fw-bold" style={{ color: "#1c1f22" }}>{match.team1Name}</span>
                </div>
                <span className="badge rounded-pill px-3 py-1 font-space-grotesk fw-bold" style={{ background: "#ffffff", border: "1px solid #eae5dc", color: "#64748b", fontSize: "11px" }}>VS</span>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold" style={{ color: "#1c1f22" }}>{match.team2Name}</span>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", background: "#ffffff", border: "1px solid #eae5dc", padding: "4px" }}>
                    <img src={match.team2Logo} width={26} height={26} alt={match.team2Name} className="object-fit-contain" />
                  </div>
                </div>
              </div>
              
              {/* Stat Comparison Bars */}
              {[
                { label: "First Downs", t1: nflData.team1Stats.firstDowns, t2: nflData.team2Stats.firstDowns },
                { label: "Total Yards", t1: nflData.team1Stats.totalYards, t2: nflData.team2Stats.totalYards },
                { label: "Passing Yards", t1: nflData.team1Stats.passingYards, t2: nflData.team2Stats.passingYards },
                { label: "Rushing Yards", t1: nflData.team1Stats.rushingYards, t2: nflData.team2Stats.rushingYards },
                { label: "Turnovers", t1: nflData.team1Stats.turnovers, t2: nflData.team2Stats.turnovers, reverse: true },
                { label: "Sacks", t1: (nflData.team1Stats as any).sacks ?? (nflData.team1Stats as any).sacksAllowed ?? 0, t2: (nflData.team2Stats as any).sacks ?? (nflData.team2Stats as any).sacksAllowed ?? 0 },
                { label: "Interceptions", t1: (nflData.team1Stats as any).interceptions ?? (nflData.team1Stats as any).interceptionsThrown ?? 0, t2: (nflData.team2Stats as any).interceptions ?? (nflData.team2Stats as any).interceptionsThrown ?? 0, reverse: true },
                { label: "Penalties", t1: typeof nflData.team1Stats.penalties === "string" ? nflData.team1Stats.penalties : `${nflData.team1Stats.penalties ?? 0}`, t2: typeof nflData.team2Stats.penalties === "string" ? nflData.team2Stats.penalties : `${nflData.team2Stats.penalties ?? 0}`, reverse: true },
              ].map((stat, idx) => {
                const num1 = Number(String(stat.t1).split("-")[0]) || 0;
                const num2 = Number(String(stat.t2).split("-")[0]) || 0;
                const total = (num1 + num2) || 1;
                const pct1 = Math.min(100, Math.max(12, (num1 / total) * 100));
                const pct2 = Math.min(100, Math.max(12, (num2 / total) * 100));
                const isT1Better = stat.reverse ? num1 < num2 : num1 > num2;
                const isT2Better = stat.reverse ? num2 < num1 : num2 > num1;
                
                return (
                  <div key={idx} className="p-3 rounded-3" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="font-monospace fw-bold fs-14" style={{ color: isT1Better ? "#16a34a" : "#1c1f22", minWidth: "60px" }}>
                        {stat.t1}
                      </span>
                      <span className="text-muted small fw-bold text-uppercase text-center letter-spacing-1">
                        {stat.label}
                      </span>
                      <span className="font-monospace fw-bold fs-14 text-end" style={{ color: isT2Better ? "#16a34a" : "#1c1f22", minWidth: "60px" }}>
                        {stat.t2}
                      </span>
                    </div>
                    {/* Visual Comparison Progress Bars */}
                    <div className="d-flex gap-2" style={{ height: "8px" }}>
                      <div className="flex-grow-1 d-flex justify-content-end rounded-pill overflow-hidden" style={{ background: "#e5dfd3", height: "8px" }}>
                        <div style={{ width: `${pct1}%`, height: "100%", backgroundColor: isT1Better ? "#16a34a" : "#e09f3e", borderRadius: "999px" }} />
                      </div>
                      <div className="flex-grow-1 d-flex justify-content-start rounded-pill overflow-hidden" style={{ background: "#e5dfd3", height: "8px" }}>
                        <div style={{ width: `${pct2}%`, height: "100%", backgroundColor: isT2Better ? "#16a34a" : "#3b82f6", borderRadius: "999px" }} />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Efficiency Cards */}
              <div className="row g-3 mt-1">
                {[
                  { label: "Possession Time", t1: nflData.team1Stats.timeOfPossession, t2: nflData.team2Stats.timeOfPossession },
                  { label: "3rd Down Eff", t1: (nflData.team1Stats as any).thirdDownEff ?? (nflData.team1Stats as any).thirdDownEfficiency ?? "—", t2: (nflData.team2Stats as any).thirdDownEff ?? (nflData.team2Stats as any).thirdDownEfficiency ?? "—" },
                  { label: "Red Zone Eff", t1: (nflData.team1Stats as any).redZoneEff ?? (nflData.team1Stats as any).redZoneScoring ?? "—", t2: (nflData.team2Stats as any).redZoneEff ?? (nflData.team2Stats as any).redZoneScoring ?? "—" },
                ].map((item, idx) => (
                  <div key={idx} className="col-12 col-md-4">
                    <div className="p-3 rounded-3 text-center" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                      <div className="text-muted small text-uppercase fw-bold mb-2">{item.label}</div>
                      <div className="d-flex align-items-center justify-content-center gap-3">
                        <span className="fw-bold font-monospace" style={{ color: "#1c1f22", fontSize: "15px" }}>{item.t1}</span>
                        <span className="text-muted small">vs</span>
                        <span className="fw-bold font-monospace" style={{ color: "#1c1f22", fontSize: "15px" }}>{item.t2}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PLAYERS TAB */}
        {activeTab === "players" && (
          <div className="d-flex flex-column gap-4">
            {/* Passing Leaders */}
            <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold m-0 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
                  <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "18px", backgroundColor: "#ffcc00" }} />
                  Passing Leaders
                </h5>
                <span className="badge rounded-pill px-3 py-1 fw-bold" style={{ background: "#faf8f5", border: "1px solid #eae5dc", color: "#64748b", fontSize: "11px" }}>
                  Quarterbacks
                </span>
              </div>
              <div className="row g-4">
                {[
                  { ...nflData.passingLeader1, teamLogo: match.team1Logo, teamName: match.team1Name },
                  { ...nflData.passingLeader2, teamLogo: match.team2Logo, teamName: match.team2Name },
                ].map((player, idx) => (
                  <div key={idx} className="col-12 col-md-6">
                    <div className="d-flex flex-column p-3 rounded-3 h-100" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "44px", height: "44px", background: "#ffffff", border: "1px solid #eae5dc", padding: "6px" }}>
                            <img src={player.teamLogo} width={28} height={28} alt="Team" className="object-fit-contain" />
                          </div>
                          <div>
                            <div className="fw-bold" style={{ color: "#1c1f22", fontSize: "16px" }}>{(player as any).player || (player as any).name}</div>
                            <div className="text-muted small fw-semibold">{player.teamName} · QB</div>
                          </div>
                        </div>
                        {player.rating && (
                          <div className="badge rounded-pill px-2 py-1 font-monospace fw-bold" style={{ background: "#ffffff", border: "1px solid #eae5dc", color: "#16a34a", fontSize: "11px" }}>
                            {player.rating} QBR
                          </div>
                        )}
                      </div>
                      <div className="row g-2 text-center mt-auto">
                        <div className="col-4">
                          <div className="p-2 rounded" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
                            <div className="text-muted fs-11 fw-semibold text-uppercase">Cmp/Att</div>
                            <div className="fw-bold font-monospace mt-1" style={{ color: "#1c1f22" }}>{player.completions}/{player.attempts}</div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="p-2 rounded" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
                            <div className="text-muted fs-11 fw-semibold text-uppercase">Yards</div>
                            <div className="fw-bold font-monospace mt-1" style={{ color: "#16a34a", fontSize: "15px" }}>{player.yards}</div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="p-2 rounded" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
                            <div className="text-muted fs-11 fw-semibold text-uppercase">TD / INT</div>
                            <div className="fw-bold font-monospace mt-1" style={{ color: "#1c1f22" }}>{player.touchdowns} / {player.interceptions}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rushing Leaders */}
            <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold m-0 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
                  <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "18px", backgroundColor: "#ffcc00" }} />
                  Rushing Leaders
                </h5>
                <span className="badge rounded-pill px-3 py-1 fw-bold" style={{ background: "#faf8f5", border: "1px solid #eae5dc", color: "#64748b", fontSize: "11px" }}>
                  Running Backs
                </span>
              </div>
              <div className="row g-4">
                {[
                  { ...nflData.rushingLeader1, teamLogo: match.team1Logo, teamName: match.team1Name },
                  { ...nflData.rushingLeader2, teamLogo: match.team2Logo, teamName: match.team2Name },
                ].map((player, idx) => (
                  <div key={idx} className="col-12 col-md-6">
                    <div className="d-flex flex-column p-3 rounded-3 h-100" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "44px", height: "44px", background: "#ffffff", border: "1px solid #eae5dc", padding: "6px" }}>
                          <img src={player.teamLogo} width={28} height={28} alt="Team" className="object-fit-contain" />
                        </div>
                        <div>
                          <div className="fw-bold" style={{ color: "#1c1f22", fontSize: "16px" }}>{(player as any).player || (player as any).name}</div>
                          <div className="text-muted small fw-semibold">{player.teamName} · RB</div>
                        </div>
                      </div>
                      <div className="row g-2 text-center mt-auto">
                        <div className="col-3">
                          <div className="p-2 rounded" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
                            <div className="text-muted fs-11 fw-semibold text-uppercase">Carries</div>
                            <div className="fw-bold font-monospace mt-1" style={{ color: "#1c1f22" }}>{player.carries}</div>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="p-2 rounded" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
                            <div className="text-muted fs-11 fw-semibold text-uppercase">Yards</div>
                            <div className="fw-bold font-monospace mt-1" style={{ color: "#16a34a", fontSize: "15px" }}>{player.yards}</div>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="p-2 rounded" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
                            <div className="text-muted fs-11 fw-semibold text-uppercase">Avg</div>
                            <div className="fw-bold font-monospace mt-1" style={{ color: "#1c1f22" }}>{(player as any).avg ?? (player as any).average ?? (player.carries ? (player.yards / player.carries).toFixed(1) : "—")}</div>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="p-2 rounded" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
                            <div className="text-muted fs-11 fw-semibold text-uppercase">TD</div>
                            <div className="fw-bold font-monospace mt-1" style={{ color: player.touchdowns > 0 ? "#16a34a" : "#1c1f22" }}>{player.touchdowns}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Receiving Leaders */}
            <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold m-0 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
                  <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "18px", backgroundColor: "#ffcc00" }} />
                  Receiving Leaders
                </h5>
                <span className="badge rounded-pill px-3 py-1 fw-bold" style={{ background: "#faf8f5", border: "1px solid #eae5dc", color: "#64748b", fontSize: "11px" }}>
                  Pass Catchers
                </span>
              </div>
              <div className="row g-4">
                {[
                  { ...nflData.receivingLeader1, teamLogo: match.team1Logo, teamName: match.team1Name },
                  { ...nflData.receivingLeader2, teamLogo: match.team2Logo, teamName: match.team2Name },
                ].map((player, idx) => (
                  <div key={idx} className="col-12 col-md-6">
                    <div className="d-flex flex-column p-3 rounded-3 h-100" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "44px", height: "44px", background: "#ffffff", border: "1px solid #eae5dc", padding: "6px" }}>
                          <img src={player.teamLogo} width={28} height={28} alt="Team" className="object-fit-contain" />
                        </div>
                        <div>
                          <div className="fw-bold" style={{ color: "#1c1f22", fontSize: "16px" }}>{(player as any).player || (player as any).name}</div>
                          <div className="text-muted small fw-semibold">{player.teamName} · WR/TE</div>
                        </div>
                      </div>
                      <div className="row g-2 text-center mt-auto">
                        <div className="col-3">
                          <div className="p-2 rounded" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
                            <div className="text-muted fs-11 fw-semibold text-uppercase">Rec</div>
                            <div className="fw-bold font-monospace mt-1" style={{ color: "#1c1f22" }}>{player.receptions}</div>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="p-2 rounded" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
                            <div className="text-muted fs-11 fw-semibold text-uppercase">Yards</div>
                            <div className="fw-bold font-monospace mt-1" style={{ color: "#16a34a", fontSize: "15px" }}>{player.yards}</div>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="p-2 rounded" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
                            <div className="text-muted fs-11 fw-semibold text-uppercase">Avg</div>
                            <div className="fw-bold font-monospace mt-1" style={{ color: "#1c1f22" }}>{(player as any).avg ?? (player as any).average ?? (player.receptions ? (player.yards / player.receptions).toFixed(1) : "—")}</div>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="p-2 rounded" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
                            <div className="text-muted fs-11 fw-semibold text-uppercase">TD</div>
                            <div className="fw-bold font-monospace mt-1" style={{ color: player.touchdowns > 0 ? "#16a34a" : "#1c1f22" }}>{player.touchdowns}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PLAYS & DRIVES TAB */}
        {activeTab === "plays" && (
          <div className="d-flex flex-column gap-4">
            {/* Drive Summary */}
            <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold m-0 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
                  <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "18px", backgroundColor: "#ffcc00" }} />
                  Drive Summary
                </h5>
                <span className="badge rounded-pill px-3 py-1 fw-semibold" style={{ background: "#faf8f5", border: "1px solid #eae5dc", color: "#64748b", fontSize: "11px" }}>
                  {nflData.drives.length} Drives Recorded
                </span>
              </div>
              <div className="d-flex flex-column w-100 overflow-x-auto">
                {/* Header Row */}
                <div
                  className="d-flex w-100 text-muted small px-3 py-2 rounded-3 mb-2 fw-bold text-uppercase"
                  style={{ background: "#faf8f5", border: "1px solid #eae5dc", minWidth: "660px", fontSize: "11px", letterSpacing: "0.05em" }}
                >
                  <div style={{ width: "16%" }}>Team</div>
                  <div className="text-center" style={{ width: "14%" }}>Start Time</div>
                  <div className="text-center" style={{ width: "14%" }}>Start Pos</div>
                  <div className="text-center" style={{ width: "14%" }}>Plays</div>
                  <div className="text-center" style={{ width: "14%" }}>Yards</div>
                  <div className="text-center" style={{ width: "14%" }}>Duration</div>
                  <div className="text-center" style={{ width: "14%" }}>Result</div>
                </div>

                {/* Rows */}
                <div className="d-flex flex-column gap-2" style={{ minWidth: "660px" }}>
                  {nflData.drives.map((drive, idx) => {
                    const teamLogo = drive.team === 1 ? match.team1Logo : match.team2Logo;
                    const teamName = drive.team === 1 ? match.team1Name : match.team2Name;
                    const startTime = drive.startTime || (drive as any).timeStarted || "—";
                    const startPos = drive.startYardLine || (drive as any).startPos || (drive.team === 1 ? "KC 25" : "BUF 25");
                    const playsCount = drive.plays ?? (drive as any).playsCount ?? 0;
                    const duration = drive.duration || (drive as any).timeOfPossession || "—";
                    const isTD = drive.result === "TD" || drive.result === "Touchdown";
                    const isFG = drive.result === "FG" || drive.result === "Field Goal";
                    const isTurnover = drive.result?.toLowerCase().includes("turnover");

                    return (
                      <div
                        key={idx}
                        className="d-flex w-100 align-items-center px-3 py-2 rounded-3 transition-all"
                        style={{
                          background: "#ffffff",
                          border: `1px solid ${isTD ? "rgba(22, 163, 74, 0.3)" : "#eae5dc"}`,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                        }}
                      >
                        <div className="d-flex align-items-center gap-2" style={{ width: "16%" }}>
                          <img src={teamLogo} width={24} height={24} alt="Team" className="object-fit-contain" />
                          <span className="small fw-bold text-truncate" style={{ color: "#1c1f22" }}>
                            {teamName.split(" ").pop()}
                          </span>
                        </div>
                        <div className="text-center small fw-semibold" style={{ width: "14%", color: "#1c1f22" }}>
                          {startTime}
                        </div>
                        <div className="text-center small fw-semibold" style={{ width: "14%", color: "#64748b" }}>
                          {startPos}
                        </div>
                        <div className="text-center small fw-semibold" style={{ width: "14%", color: "#1c1f22" }}>
                          {playsCount}
                        </div>
                        <div className="text-center small fw-bold" style={{ width: "14%", color: drive.yards > 0 ? "#16a34a" : "#dc2626" }}>
                          {drive.yards > 0 ? `+${drive.yards}` : drive.yards} yds
                        </div>
                        <div className="text-center small text-muted fw-medium" style={{ width: "14%" }}>
                          {duration}
                        </div>
                        <div className="text-center" style={{ width: "14%" }}>
                          <span
                            className="badge rounded-pill px-2 py-1 fw-bold text-uppercase"
                            style={{
                              fontSize: "10px",
                              backgroundColor: isTD ? "rgba(22, 163, 74, 0.12)" : isFG ? "rgba(217, 119, 6, 0.12)" : isTurnover ? "rgba(220, 38, 38, 0.12)" : "rgba(100, 116, 139, 0.12)",
                              color: isTD ? "#16a34a" : isFG ? "#d97706" : isTurnover ? "#dc2626" : "#64748b",
                              border: `1px solid ${isTD ? "rgba(22, 163, 74, 0.25)" : isFG ? "rgba(217, 119, 6, 0.25)" : isTurnover ? "rgba(220, 38, 38, 0.25)" : "rgba(100, 116, 139, 0.25)"}`,
                            }}
                          >
                            {drive.result}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Play by Play */}
            <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold m-0 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
                  <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "18px", backgroundColor: "#ffcc00" }} />
                  Play-by-Play
                </h5>
                <span className="badge rounded-pill px-3 py-1 fw-semibold" style={{ background: "#faf8f5", border: "1px solid #eae5dc", color: "#64748b", fontSize: "11px" }}>
                  Quarter 4
                </span>
              </div>
              <div className="position-relative ps-4 py-2 ms-2 d-flex flex-column gap-3" style={{ borderLeft: "2px solid #eae5dc" }}>
                {nflData.plays.map((play, i) => {
                  const clock = play.clock || (play as any).time || "00:00";
                  const yardsGained = play.yardsGained ?? (play as any).gain ?? 0;
                  const isScoring = play.isScoring || play.description.toLowerCase().includes("touchdown") || play.description.toLowerCase().includes("field goal is good");
                  const isTurnover = play.isTurnover || play.description.toLowerCase().includes("intercept") || play.description.toLowerCase().includes("fumble");

                  return (
                    <div key={i} className="position-relative">
                      <span
                        className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: "22px",
                          height: "22px",
                          left: "-36px",
                          top: "14px",
                          background: "#ffffff",
                          border: `2px solid ${isScoring ? "#16a34a" : isTurnover ? "#dc2626" : "#eae5dc"}`,
                        }}
                      >
                        <i className={`bi ${isScoring ? "bi-star-fill text-success" : isTurnover ? "bi-exclamation-triangle-fill text-danger" : "bi-circle-fill"}`} style={{ fontSize: "8px", color: isScoring ? "#16a34a" : isTurnover ? "#dc2626" : "#cbd5e1" }} />
                      </span>
                      <div
                        className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center rounded-3 p-3 transition-all"
                        style={{
                          background: isScoring ? "rgba(22, 163, 74, 0.04)" : "#faf8f5",
                          border: `1px solid ${isScoring ? "rgba(22, 163, 74, 0.25)" : "#eae5dc"}`,
                        }}
                      >
                        <div style={{ minWidth: 0, paddingRight: "10px" }}>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="badge rounded-pill px-2 py-1 fw-bold" style={{ fontSize: "10px", background: "#ffffff", border: "1px solid #eae5dc", color: "#1c1f22" }}>
                              Q{play.quarter} • {clock}
                            </span>
                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "22px", height: "22px", background: "#ffffff", border: "1px solid #eae5dc", padding: "3px" }}>
                              <img src={play.team === 1 ? match.team1Logo : match.team2Logo} width={14} height={14} alt="Team" className="object-fit-contain" />
                            </div>
                            <span className="small text-muted fw-bold">
                              {play.team === 1 ? match.team1Name.split(" ").pop() : match.team2Name.split(" ").pop()}
                            </span>
                          </div>
                          <div className="fw-semibold small" style={{ color: isScoring ? "#16a34a" : isTurnover ? "#dc2626" : "#1c1f22", lineHeight: 1.4 }}>
                            {play.description}
                          </div>
                        </div>
                        <div className="mt-2 mt-sm-0 flex-shrink-0">
                          <span
                            className="badge rounded-pill px-2 py-1 fw-bold"
                            style={{
                              fontSize: "11px",
                              backgroundColor: yardsGained > 0 ? "rgba(22, 163, 74, 0.12)" : yardsGained < 0 ? "rgba(220, 38, 38, 0.12)" : "rgba(100, 116, 139, 0.12)",
                              color: yardsGained > 0 ? "#16a34a" : yardsGained < 0 ? "#dc2626" : "#64748b",
                              border: `1px solid ${yardsGained > 0 ? "rgba(22, 163, 74, 0.25)" : yardsGained < 0 ? "rgba(220, 38, 38, 0.25)" : "rgba(100, 116, 139, 0.25)"}`,
                            }}
                          >
                            {yardsGained > 0 ? `+${yardsGained} yds` : yardsGained < 0 ? `${yardsGained} yds` : "No gain"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ROSTERS TAB */}
        {activeTab === "rosters" && (
          <div className="row g-4">
            {[ 
              { team: match.team1Name, logo: match.team1Logo, roster: nflData.team1Roster }, 
              { team: match.team2Name, logo: match.team2Logo, roster: nflData.team2Roster } 
            ].map((teamData, idx) => (
              <div key={idx} className="col-12 col-md-6">
                <div className="card rounded-4 p-4 h-100 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
                  <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom" style={{ borderColor: "#eae5dc" }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "48px", height: "48px", background: "#faf8f5", border: "1px solid #eae5dc", padding: "6px" }}>
                      <img src={teamData.logo} width={34} height={34} alt="Team" className="object-fit-contain" />
                    </div>
                    <div>
                      <h5 className="fw-bold m-0 font-space-grotesk" style={{ color: "#1c1f22", fontSize: "18px" }}>{teamData.team}</h5>
                      <span className="small text-muted fw-semibold">Active Match Roster</span>
                    </div>
                  </div>
                  
                  <div className="d-flex flex-column gap-4">
                    {/* Starting Offense */}
                    <div>
                      <h6 className="small fw-bold text-uppercase mb-3 d-flex align-items-center gap-2" style={{ color: "#16a34a" }}>
                        <span className="d-inline-block rounded-pill" style={{ width: "3px", height: "14px", backgroundColor: "#16a34a" }} />
                        Starting Offense
                      </h6>
                      <div className="d-flex flex-column gap-2">
                        {teamData.roster.startingOffense.map((p, i) => (
                          <div key={i} className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                            <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                              <span
                                className="font-monospace fw-bold text-muted px-2 py-1 rounded flex-shrink-0"
                                style={{
                                  fontSize: "12px",
                                  background: "#ffffff",
                                  border: "1px solid #eae5dc",
                                  minWidth: "42px",
                                  textAlign: "center",
                                  whiteSpace: "nowrap",
                                  display: "inline-block",
                                }}
                              >
                                #{p.number}
                              </span>
                              <span className="fw-semibold small text-truncate" style={{ color: "#1c1f22" }}>
                                {p.name}
                              </span>
                              {p.isCaptain && (
                                <span className="badge rounded-pill fw-bold flex-shrink-0" style={{ background: "#ffcc00", color: "#1c1f22", fontSize: "9px" }}>
                                  C
                                </span>
                              )}
                            </div>
                            <span
                              className="badge rounded-pill fw-bold flex-shrink-0"
                              style={{
                                background: "rgba(22, 163, 74, 0.1)",
                                border: "1px solid rgba(22, 163, 74, 0.25)",
                                color: "#16a34a",
                                fontSize: "11px",
                              }}
                            >
                              {p.position}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Starting Defense */}
                    <div>
                      <h6 className="small fw-bold text-uppercase mb-3 d-flex align-items-center gap-2" style={{ color: "#2563eb" }}>
                        <span className="d-inline-block rounded-pill" style={{ width: "3px", height: "14px", backgroundColor: "#2563eb" }} />
                        Starting Defense
                      </h6>
                      <div className="d-flex flex-column gap-2">
                        {teamData.roster.startingDefense.map((p, i) => (
                          <div key={i} className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                            <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                              <span
                                className="font-monospace fw-bold text-muted px-2 py-1 rounded flex-shrink-0"
                                style={{
                                  fontSize: "12px",
                                  background: "#ffffff",
                                  border: "1px solid #eae5dc",
                                  minWidth: "42px",
                                  textAlign: "center",
                                  whiteSpace: "nowrap",
                                  display: "inline-block",
                                }}
                              >
                                #{p.number}
                              </span>
                              <span className="fw-semibold small text-truncate" style={{ color: "#1c1f22" }}>
                                {p.name}
                              </span>
                              {p.isCaptain && (
                                <span className="badge rounded-pill fw-bold flex-shrink-0" style={{ background: "#ffcc00", color: "#1c1f22", fontSize: "9px" }}>
                                  C
                                </span>
                              )}
                            </div>
                            <span
                              className="badge rounded-pill fw-bold flex-shrink-0"
                              style={{
                                background: "rgba(37, 99, 235, 0.1)",
                                border: "1px solid rgba(37, 99, 235, 0.25)",
                                color: "#2563eb",
                                fontSize: "11px",
                              }}
                            >
                              {p.position}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Teams */}
                    <div>
                      <h6 className="small fw-bold text-uppercase mb-3 d-flex align-items-center gap-2" style={{ color: "#d97706" }}>
                        <span className="d-inline-block rounded-pill" style={{ width: "3px", height: "14px", backgroundColor: "#d97706" }} />
                        Special Teams
                      </h6>
                      <div className="d-flex flex-column gap-2 mb-3">
                        {teamData.roster.specialTeams.map((p, i) => (
                          <div key={i} className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                            <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                              <span
                                className="font-monospace fw-bold text-muted px-2 py-1 rounded flex-shrink-0"
                                style={{
                                  fontSize: "12px",
                                  background: "#ffffff",
                                  border: "1px solid #eae5dc",
                                  minWidth: "42px",
                                  textAlign: "center",
                                  whiteSpace: "nowrap",
                                  display: "inline-block",
                                }}
                              >
                                #{p.number}
                              </span>
                              <span className="fw-semibold small text-truncate" style={{ color: "#1c1f22" }}>
                                {p.name}
                              </span>
                            </div>
                            <span
                              className="badge rounded-pill fw-bold flex-shrink-0"
                              style={{
                                background: "rgba(217, 119, 6, 0.1)",
                                border: "1px solid rgba(217, 119, 6, 0.25)",
                                color: "#d97706",
                                fontSize: "11px",
                              }}
                            >
                              {p.position}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Head Coach */}
                    <div className="mt-3 pt-3 border-top d-flex align-items-center justify-content-between" style={{ borderColor: "#eae5dc" }}>
                      <span className="text-muted small text-uppercase fw-bold">Head Coach:</span>
                      <span className="fw-bold" style={{ color: "#1c1f22" }}>{teamData.roster.headCoach}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
