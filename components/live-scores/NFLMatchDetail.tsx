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
      <div className="d-flex border-bottom border-dark overflow-x-auto scrollbar-none mb-4 custom-tabs gap-2 pb-1">
        {[
          { id: "overview", label: "Overview", icon: "bi-info-square" },
          { id: "stats", label: "Team Stats", icon: "bi-bar-chart" },
          { id: "players", label: "Player Leaders", icon: "bi-person-badge" },
          { id: "plays", label: "Play-by-Play & Drives", icon: "bi-card-list" },
          { id: "rosters", label: "Rosters", icon: "bi-people" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`btn border-0 rounded-0 px-4 py-3 fw-bold text-uppercase flex-shrink-0 d-flex align-items-center gap-2 ${
              activeTab === tab.id
                ? "text-success border-bottom border-success border-2"
                : "text-muted"
            } fs-12 ls-05 transition-02s font-space-grotesk`}
          >
            <i className={`bi ${tab.icon} fs-14`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Contents ── */}
      <div className="tab-content">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="d-flex flex-column gap-4">
            {/* Score by Quarter */}
            <div className="card bg-card border border-dark rounded-3 p-4">
              <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">
                Score by Quarter
              </h5>
              {/* Score Table - Div Layout */}
              <div className="d-flex flex-column gap-3 w-100">
                {/* Header Row */}
                <div className="d-flex w-100 text-muted small font-monospace pb-2 border-b-subtle">
                  <div className="w-35p">Team</div>
                  <div className="text-center flex-1">Q1</div>
                  <div className="text-center flex-1">Q2</div>
                  <div className="text-center flex-1">Q3</div>
                  <div className="text-center flex-1">Q4</div>
                  {nflData.quarterScores.team1.ot !== undefined && <div className="text-center flex-1">OT</div>}
                  <div className="text-center text-success flex-1-5">Total</div>
                </div>

                {/* Team 1 Row */}
                <div className="d-flex w-100 align-items-center py-2 border-b-subtle-light">
                  <div className="d-flex align-items-center gap-2 w-35p">
                    <img src={match.team1Logo} width={24} height={24} alt="T1" className="object-fit-contain" />
                    <span className="fw-semibold text-light text-truncate">{match.team1Name}</span>
                  </div>
                  <div className="text-center text-light flex-1 fs-14">{nflData.quarterScores.team1.q1}</div>
                  <div className="text-center text-light flex-1 fs-14">{nflData.quarterScores.team1.q2}</div>
                  <div className="text-center text-light flex-1 fs-14">{nflData.quarterScores.team1.q3}</div>
                  <div className="text-center text-light flex-1 fs-14">{nflData.quarterScores.team1.q4}</div>
                  {nflData.quarterScores.team1.ot !== undefined && <div className="text-center text-light flex-1 fs-14">{nflData.quarterScores.team1.ot}</div>}
                  <div className="text-center fw-bold text-white flex-1-5 fs-14">{nflData.quarterScores.team1.total}</div>
                </div>

                {/* Team 2 Row */}
                <div className="d-flex w-100 align-items-center py-2">
                  <div className="d-flex align-items-center gap-2 w-35p">
                    <img src={match.team2Logo} width={24} height={24} alt="T2" className="object-fit-contain" />
                    <span className="fw-semibold text-light text-truncate">{match.team2Name}</span>
                  </div>
                  <div className="text-center text-light flex-1 fs-14">{nflData.quarterScores.team2.q1}</div>
                  <div className="text-center text-light flex-1 fs-14">{nflData.quarterScores.team2.q2}</div>
                  <div className="text-center text-light flex-1 fs-14">{nflData.quarterScores.team2.q3}</div>
                  <div className="text-center text-light flex-1 fs-14">{nflData.quarterScores.team2.q4}</div>
                  {nflData.quarterScores.team2.ot !== undefined && <div className="text-center text-light flex-1 fs-14">{nflData.quarterScores.team2.ot}</div>}
                  <div className="text-center fw-bold text-white flex-1-5 fs-14">{nflData.quarterScores.team2.total}</div>
                </div>
              </div>
            </div>

            {/* Scoring Summary */}
            <div className="card bg-card border border-dark rounded-3 p-4">
              <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">
                Scoring Summary
              </h5>
              <div className="d-flex flex-column gap-3">
                {nflData.scoringPlays.map((play, idx) => (
                  <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-subtle-2">
                    <div className="d-flex align-items-center gap-3">
                      <div className="d-flex flex-column align-items-center justify-content-center bg-dark rounded px-2 py-1 border border-secondary border-opacity-25 min-w-50px">
                        <span className="text-muted fs-10">Q{play.quarter}</span>
                        <span className="text-light font-monospace fw-bold fs-12">{play.time}</span>
                      </div>
                      <img src={play.team === 1 ? match.team1Logo : match.team2Logo} width={28} height={28} alt="Team" className="object-fit-contain" />
                      <div>
                        <span className={`mb-1 ${
                          play.type === "TD" ? "badge-nfl-td" : 
                          play.type === "FG" ? "badge-nfl-fg" : 
                          play.type === "XP" ? "badge-nfl-xp" : 
                          "badge-nfl-safety"
                        }`}>
                          {play.type === "TD" ? "Touchdown" : play.type === "FG" ? "Field Goal" : play.type === "XP" ? "Extra Point" : play.type === "2PT" ? "2-Pt Conversion" : "Safety"}
                        </span>
                        <p className="text-light m-0 small">{play.description}</p>
                      </div>
                    </div>
                    <div className="font-monospace fw-bold d-flex align-items-center gap-2 fs-15">
                      <span className={play.team === 1 ? "text-white" : "text-muted"}>{play.score1}</span>
                      <span className="text-secondary fs-12">-</span>
                      <span className={play.team === 2 ? "text-white" : "text-muted"}>{play.score2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Match Information */}
            <div className="card bg-card border border-dark rounded-3 p-4">
              <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">
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
                    <div className="p-3 rounded-3 bg-subtle-1">
                      <div className="text-muted text-uppercase mb-1 fs-10 ls-1">{info.label}</div>
                      <div className="text-light fw-medium small text-truncate">{info.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEAM STATS TAB */}
        {activeTab === "stats" && (
          <div className="card bg-card border border-dark rounded-3 p-4">
            <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">
              Team Comparison
            </h5>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                <img src={match.team1Logo} width={32} height={32} alt="T1" className="object-fit-contain" />
                <span className="text-muted small text-uppercase letter-spacing-1">Stat</span>
                <img src={match.team2Logo} width={32} height={32} alt="T2" className="object-fit-contain" />
              </div>
              
              {[
                { label: "First Downs", t1: nflData.team1Stats.firstDowns, t2: nflData.team2Stats.firstDowns },
                { label: "Total Yards", t1: nflData.team1Stats.totalYards, t2: nflData.team2Stats.totalYards },
                { label: "Passing Yards", t1: nflData.team1Stats.passingYards, t2: nflData.team2Stats.passingYards },
                { label: "Rushing Yards", t1: nflData.team1Stats.rushingYards, t2: nflData.team2Stats.rushingYards },
                { label: "Turnovers", t1: nflData.team1Stats.turnovers, t2: nflData.team2Stats.turnovers, reverse: true },
                { label: "Sacks", t1: nflData.team1Stats.sacks, t2: nflData.team2Stats.sacks },
                { label: "Interceptions", t1: nflData.team1Stats.interceptions, t2: nflData.team2Stats.interceptions, reverse: true },
                { label: "Penalties", t1: nflData.team1Stats.penalties, t2: nflData.team2Stats.penalties, reverse: true },
                { label: "Penalty Yards", t1: nflData.team1Stats.penaltyYards, t2: nflData.team2Stats.penaltyYards, reverse: true },
              ].map((stat, idx) => {
                const total = (stat.t1 + stat.t2) || 1;
                const pct1 = (stat.t1 / total) * 100;
                const pct2 = (stat.t2 / total) * 100;
                const isT1Better = stat.reverse ? stat.t1 < stat.t2 : stat.t1 > stat.t2;
                const isT2Better = stat.reverse ? stat.t2 < stat.t1 : stat.t2 > stat.t1;
                
                return (
                  <div key={idx} className="position-relative py-2 border-bottom border-secondary border-opacity-10">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className={`font-monospace fw-bold ${isT1Better ? "text-success" : "text-light"} fs-14 w-40px`}>{stat.t1}</span>
                      <span className="text-muted small fw-medium text-center">{stat.label}</span>
                      <span className={`font-monospace fw-bold ${isT2Better ? "text-success" : "text-light"} fs-14 w-40px text-end`}>{stat.t2}</span>
                    </div>
                    <div className="d-flex gap-1 h-6px">
                      <div className="flex-grow-1 d-flex justify-content-end rounded-start overflow-hidden bg-subtle-6">
                        <div className={`progress-bar-transition ${isT1Better ? "progress-bar-better" : "progress-bar-worse"}`} style={{ width: `${pct1}%` }} />
                      </div>
                      <div className="flex-grow-1 rounded-end overflow-hidden bg-subtle-6">
                        <div className={`progress-bar-transition ${isT2Better ? "progress-bar-better" : "progress-bar-worse"}`} style={{ width: `${pct2}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-10">
                <span className="font-monospace fw-bold text-light fs-14">{nflData.team1Stats.timeOfPossession}</span>
                <span className="text-muted small fw-medium text-center">Possession Time</span>
                <span className="font-monospace fw-bold text-light fs-14">{nflData.team2Stats.timeOfPossession}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-10">
                <span className="font-monospace fw-bold text-light fs-14">{nflData.team1Stats.thirdDownEff}</span>
                <span className="text-muted small fw-medium text-center">3rd Down Eff</span>
                <span className="font-monospace fw-bold text-light fs-14">{nflData.team2Stats.thirdDownEff}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-10">
                <span className="font-monospace fw-bold text-light fs-14">{nflData.team1Stats.redZoneEff}</span>
                <span className="text-muted small fw-medium text-center">Red Zone Eff</span>
                <span className="font-monospace fw-bold text-light fs-14">{nflData.team2Stats.redZoneEff}</span>
              </div>
            </div>
          </div>
        )}

        {/* PLAYERS TAB */}
        {activeTab === "players" && (
          <div className="d-flex flex-column gap-4">
            {/* Passing Leaders */}
            <div className="card bg-card border border-dark rounded-3 p-4">
              <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">Passing Leaders</h5>
              <div className="row g-4">
                {[nflData.passingLeader1, nflData.passingLeader2].map((player, idx) => (
                  <div key={idx} className="col-12 col-md-6">
                    <div className="d-flex flex-column p-3 rounded-3 bg-subtle-2">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <img src={idx === 0 ? match.team1Logo : match.team2Logo} width={30} height={30} alt="Team" className="object-fit-contain" />
                        <span className="fw-bold text-light fs-5">{player.name}</span>
                      </div>
                      <div className="row g-2 text-center">
                        <div className="col-4">
                          <div className="text-muted small">Cmp/Att</div>
                          <div className="fw-bold text-white">{player.completions}/{player.attempts}</div>
                        </div>
                        <div className="col-4">
                          <div className="text-muted small">Yds</div>
                          <div className="fw-bold text-success">{player.yards}</div>
                        </div>
                        <div className="col-4">
                          <div className="text-muted small">TD/INT</div>
                          <div className="fw-bold text-white">{player.touchdowns}/{player.interceptions}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rushing Leaders */}
            <div className="card bg-card border border-dark rounded-3 p-4">
              <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">Rushing Leaders</h5>
              <div className="row g-4">
                {[nflData.rushingLeader1, nflData.rushingLeader2].map((player, idx) => (
                  <div key={idx} className="col-12 col-md-6">
                    <div className="d-flex flex-column p-3 rounded-3 bg-subtle-2">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <img src={idx === 0 ? match.team1Logo : match.team2Logo} width={30} height={30} alt="Team" className="object-fit-contain" />
                        <span className="fw-bold text-light fs-5">{player.name}</span>
                      </div>
                      <div className="row g-2 text-center">
                        <div className="col-3">
                          <div className="text-muted small">Car</div>
                          <div className="fw-bold text-white">{player.carries}</div>
                        </div>
                        <div className="col-3">
                          <div className="text-muted small">Yds</div>
                          <div className="fw-bold text-success">{player.yards}</div>
                        </div>
                        <div className="col-3">
                          <div className="text-muted small">Avg</div>
                          <div className="fw-bold text-white">{player.avg}</div>
                        </div>
                        <div className="col-3">
                          <div className="text-muted small">TD</div>
                          <div className="fw-bold text-white">{player.touchdowns}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Receiving Leaders */}
            <div className="card bg-card border border-dark rounded-3 p-4">
              <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">Receiving Leaders</h5>
              <div className="row g-4">
                {[nflData.receivingLeader1, nflData.receivingLeader2].map((player, idx) => (
                  <div key={idx} className="col-12 col-md-6">
                    <div className="d-flex flex-column p-3 rounded-3 bg-subtle-2">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <img src={idx === 0 ? match.team1Logo : match.team2Logo} width={30} height={30} alt="Team" className="object-fit-contain" />
                        <span className="fw-bold text-light fs-5">{player.name}</span>
                      </div>
                      <div className="row g-2 text-center">
                        <div className="col-3">
                          <div className="text-muted small">Rec</div>
                          <div className="fw-bold text-white">{player.receptions}</div>
                        </div>
                        <div className="col-3">
                          <div className="text-muted small">Yds</div>
                          <div className="fw-bold text-success">{player.yards}</div>
                        </div>
                        <div className="col-3">
                          <div className="text-muted small">Avg</div>
                          <div className="fw-bold text-white">{player.avg}</div>
                        </div>
                        <div className="col-3">
                          <div className="text-muted small">TD</div>
                          <div className="fw-bold text-white">{player.touchdowns}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PLAYS TAB */}
        {activeTab === "plays" && (
          <div className="d-flex flex-column gap-4">
            {/* Drive Summary */}
            <div className="card bg-card border border-dark rounded-3 p-4">
              <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">Drive Summary</h5>
              {/* Drive Summary - Div Layout */}
              <div className="d-flex flex-column w-100">
                {/* Header Row */}
                <div className="d-flex w-100 text-muted small font-monospace pb-2 mb-2 border-bottom border-light border-opacity-10">
                  <div className="w-10p">Team</div>
                  <div className="text-center w-18p">Start Time</div>
                  <div className="text-center w-15p">Start Pos</div>
                  <div className="text-center w-12p">Plays</div>
                  <div className="text-center w-12p">Yards</div>
                  <div className="text-center w-15p">Time</div>
                  <div className="text-center w-18p">Result</div>
                </div>

                {/* Rows */}
                <div className="d-flex flex-column">
                  {nflData.drives.map((drive, idx) => (
                    <div key={idx} className="d-flex w-100 align-items-center py-3 border-b-subtle-light">
                      <div className="d-flex align-items-center w-10p">
                        <img src={drive.team === 1 ? match.team1Logo : match.team2Logo} width={24} height={24} alt="Team" className="object-fit-contain" />
                      </div>
                      <div className="text-center text-light small w-18p">{drive.startTime}</div>
                      <div className="text-center text-light small w-15p">{drive.startYardLine}</div>
                      <div className="text-center text-light small w-12p">{drive.plays}</div>
                      <div className="text-center text-light small w-12p">{drive.yards}</div>
                      <div className="text-center text-light small w-15p">{drive.duration}</div>
                      <div className="text-center w-18p">
                        <span className={`badge ${drive.result === "TD" ? "bg-success" : drive.result === "FG" ? "bg-warning text-dark" : drive.result.includes("Turnover") ? "bg-danger" : "bg-secondary"}`}>
                          {drive.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Play by Play */}
            <div className="card bg-card border border-dark rounded-3 p-4">
              <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">Play-by-Play</h5>
              <div className="position-relative ps-4 py-2 border-start border-secondary border-opacity-15 border-2 ms-2 d-flex flex-column gap-4">
                {nflData.plays.map((play, i) => (
                  <div key={i} className="position-relative">
                    <span
                      className={`position-absolute d-flex align-items-center justify-content-center rounded-circle animate-pulse-subtle play-dot ${play.isScoring ? "play-dot-scoring" : play.isTurnover ? "play-dot-turnover" : "play-dot-normal"}`}
                    >
                      <i className={`bi ${play.isScoring ? "bi-star-fill text-success" : play.isTurnover ? "bi-exclamation-triangle-fill text-danger" : "bi-play-fill text-muted"} fs-12`}></i>
                    </span>
                    <div className={`d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center rounded-3 p-3 ${play.isScoring ? "play-card-scoring" : play.isTurnover ? "play-card-turnover" : "play-card-normal"}`}>
                      <div>
                        <div className="d-flex align-items-center gap-3 mb-1">
                          <span className="font-monospace text-muted fw-bold fs-11">Q{play.quarter} • {play.clock}</span>
                          <img src={play.team === 1 ? match.team1Logo : match.team2Logo} width={16} height={16} alt="Team" className="object-fit-contain" />
                        </div>
                        <div className={`fw-medium small ${play.isScoring ? "text-success" : play.isTurnover ? "text-danger" : "text-light"}`}>{play.description}</div>
                      </div>
                      <div className="font-monospace text-muted small mt-2 mt-sm-0">
                        {play.yardsGained > 0 ? `+${play.yardsGained} yds` : play.yardsGained < 0 ? `${play.yardsGained} yds` : "No gain"}
                      </div>
                    </div>
                  </div>
                ))}
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
                <div className="card bg-card border border-dark rounded-3 p-4 h-100">
                  <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-10">
                    <img src={teamData.logo} width={40} height={40} alt="Team" className="object-fit-contain" />
                    <h5 className="text-white fw-bold m-0 fs-18 font-space-grotesk">{teamData.team}</h5>
                  </div>
                  
                  <div className="d-flex flex-column gap-4">
                    {/* Offense */}
                    <div>
                      <h6 className="text-success small fw-bold text-uppercase mb-3">Starting Offense</h6>
                      <div className="d-flex flex-column gap-2">
                        {teamData.roster.startingOffense.map((p, i) => (
                          <div key={i} className="d-flex align-items-center justify-content-between p-2 rounded bg-subtle-2 border-0">
                            <div className="d-flex align-items-center gap-2">
                              <span className="font-monospace text-muted w-24px">{p.number}</span>
                              <span className="text-light small">{p.name} {p.isCaptain && <span className="badge bg-success text-dark ms-1 fs-9">C</span>}</span>
                            </div>
                            <span className="badge bg-dark border border-secondary text-muted">{p.position}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Defense */}
                    <div>
                      <h6 className="text-danger small fw-bold text-uppercase mb-3">Starting Defense</h6>
                      <div className="d-flex flex-column gap-2">
                        {teamData.roster.startingDefense.map((p, i) => (
                          <div key={i} className="d-flex align-items-center justify-content-between p-2 rounded bg-subtle-2 border-0">
                            <div className="d-flex align-items-center gap-2">
                              <span className="font-monospace text-muted w-24px">{p.number}</span>
                              <span className="text-light small">{p.name} {p.isCaptain && <span className="badge bg-success text-dark ms-1 fs-9">C</span>}</span>
                            </div>
                            <span className="badge bg-dark border border-secondary text-muted">{p.position}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Teams & Bench */}
                    <div>
                      <h6 className="text-info small fw-bold text-uppercase mb-3">Special Teams</h6>
                      <div className="d-flex flex-column gap-2 mb-3">
                        {teamData.roster.specialTeams.map((p, i) => (
                          <div key={i} className="d-flex align-items-center justify-content-between p-2 rounded bg-subtle-2 border-0">
                            <div className="d-flex align-items-center gap-2">
                              <span className="font-monospace text-muted w-24px">{p.number}</span>
                              <span className="text-light small">{p.name}</span>
                            </div>
                            <span className="badge bg-dark border border-secondary text-muted">{p.position}</span>
                          </div>
                        ))}
                      </div>
                      
                      <h6 className="text-muted small fw-bold text-uppercase mb-3 mt-4">Bench (Selected)</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {teamData.roster.bench.map((p, i) => (
                          <span key={i} className="badge bg-dark border border-secondary text-light p-2">
                            {p.name} <span className="text-muted">({p.position})</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-top border-secondary border-opacity-10">
                      <span className="text-muted small text-uppercase me-2">Head Coach:</span>
                      <span className="text-white fw-bold">{teamData.roster.headCoach}</span>
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
