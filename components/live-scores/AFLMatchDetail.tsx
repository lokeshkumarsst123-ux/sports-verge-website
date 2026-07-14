"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LiveScoreMatchDetail } from "@/types";

interface AFLMatchDetailProps {
  match: LiveScoreMatchDetail;
}

export default function AFLMatchDetail({ match }: AFLMatchDetailProps) {
  const aflData = match.aflData;
  if (!aflData) return null;

  const [activeTab, setActiveTab] = useState<
    "overview" | "stats" | "leaders" | "timeline" | "rosters" | "info"
  >("overview");

  return (
    <div className="afl-match-detail w-100">
      {/* ── Tab Navigation ── */}
      <div className="d-flex border-bottom border-dark overflow-auto mb-4 custom-tabs gap-2 pb-1">
        {[
          { id: "overview", label: "Overview", icon: "bi-info-square" },
          { id: "stats", label: "Team Stats", icon: "bi-bar-chart" },
          { id: "leaders", label: "Player Leaders", icon: "bi-person-badge" },
          { id: "timeline", label: "Scoring & Events", icon: "bi-clock-history" },
          { id: "rosters", label: "Lineups", icon: "bi-people" },
          { id: "info", label: "Match Info", icon: "bi-info-circle" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`btn border-0 rounded-0 px-4 py-3 fw-bold text-uppercase flex-shrink-0 d-flex align-items-center gap-2 afl-tab-btn ${activeTab === tab.id ? "text-success border-bottom border-success border-2" : "text-muted"}`}
            
          >
            <i className={`bi ${tab.icon} fs-14`} ></i>
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
              <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 afl-section-title" >
                Score by Quarter
              </h5>
              {/* Score Table - Div Layout */}
              <div className="d-flex flex-column gap-3 w-100">
                {/* Header Row */}
                <div className="d-flex w-100 text-muted small font-monospace pb-2 border-bottom-white-05" >
                  <div className="w-30pct">Team</div>
                  <div className="text-center w-12pct">Q1</div>
                  <div className="text-center w-12pct">Q2</div>
                  <div className="text-center w-12pct">Q3</div>
                  <div className="text-center w-12pct">Q4</div>
                  <div className="text-center text-success w-22pct">Final</div>
                </div>

                {/* Team 1 Row */}
                <div className="d-flex w-100 align-items-center py-2 border-bottom-white-02" >
                  <div className="d-flex align-items-center gap-2 w-30pct" >
                    <img src={match.team1Logo} width={24} height={24} alt="T1" className="object-fit-contain" />
                    <span className="fw-semibold text-light text-truncate">{match.team1Name}</span>
                  </div>
                  <div className="text-center text-light w-12pct fs-14">{aflData.quarterScores.team1.q1}</div>
                  <div className="text-center text-light w-12pct fs-14">{aflData.quarterScores.team1.q2}</div>
                  <div className="text-center text-light w-12pct fs-14">{aflData.quarterScores.team1.q3}</div>
                  <div className="text-center text-light w-12pct fs-14">{aflData.quarterScores.team1.q4}</div>
                  <div className="text-center fw-bold text-white w-22pct fs-14">{aflData.quarterScores.team1.final}</div>
                </div>

                {/* Team 2 Row */}
                <div className="d-flex w-100 align-items-center py-2 border-bottom-white-02">
                  <div className="d-flex align-items-center gap-2 w-30pct" >
                    <img src={match.team2Logo} width={24} height={24} alt="T2" className="object-fit-contain" />
                    <span className="fw-semibold text-light text-truncate">{match.team2Name}</span>
                  </div>
                  <div className="text-center text-light w-12pct fs-14">{aflData.quarterScores.team2.q1}</div>
                  <div className="text-center text-light w-12pct fs-14">{aflData.quarterScores.team2.q2}</div>
                  <div className="text-center text-light w-12pct fs-14">{aflData.quarterScores.team2.q3}</div>
                  <div className="text-center text-light w-12pct fs-14">{aflData.quarterScores.team2.q4}</div>
                  <div className="text-center fw-bold text-white w-22pct fs-14">{aflData.quarterScores.team2.final}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3 mt-4 pt-4 border-top-white-05" >
                <button className="btn btn-outline-success fw-bold px-4 py-2 rounded-3" >View Team</button>
                <button className="btn btn-outline-secondary text-light fw-bold px-4 py-2 rounded-3" >Standings</button>
                <button className="btn btn-outline-secondary text-light fw-bold px-4 py-2 rounded-3" >Upcoming Matches</button>
                <button className="btn btn-outline-secondary text-light fw-bold px-4 py-2 rounded-3" >Previous Matches</button>
              </div>
            </div>
          </div>
        )}

        {/* TEAM STATS TAB */}
        {activeTab === "stats" && (
          <div className="card bg-card border border-dark rounded-3 p-4">
            <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 afl-section-title" >
              Team Statistics
            </h5>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                <img src={match.team1Logo} width={32} height={32} alt="T1" className="object-fit-contain" />
                <span className="text-muted small text-uppercase letter-spacing-1">Stat</span>
                <img src={match.team2Logo} width={32} height={32} alt="T2" className="object-fit-contain" />
              </div>

              {[
                { label: "Goals", t1: aflData.team1Stats.goals, t2: aflData.team2Stats.goals },
                { label: "Behinds", t1: aflData.team1Stats.behinds, t2: aflData.team2Stats.behinds },
                { label: "Disposals", t1: aflData.team1Stats.disposals, t2: aflData.team2Stats.disposals },
                { label: "Kicks", t1: aflData.team1Stats.kicks, t2: aflData.team2Stats.kicks },
                { label: "Handballs", t1: aflData.team1Stats.handballs, t2: aflData.team2Stats.handballs },
                { label: "Marks", t1: aflData.team1Stats.marks, t2: aflData.team2Stats.marks },
                { label: "Tackles", t1: aflData.team1Stats.tackles, t2: aflData.team2Stats.tackles },
                { label: "Inside 50s", t1: aflData.team1Stats.inside50s, t2: aflData.team2Stats.inside50s },
                { label: "Clearances", t1: aflData.team1Stats.clearances, t2: aflData.team2Stats.clearances },
                { label: "Hit Outs", t1: aflData.team1Stats.hitOuts, t2: aflData.team2Stats.hitOuts },
                { label: "Contested Possessions", t1: aflData.team1Stats.contestedPossessions, t2: aflData.team2Stats.contestedPossessions },
                { label: "Uncontested Possessions", t1: aflData.team1Stats.uncontestedPossessions, t2: aflData.team2Stats.uncontestedPossessions },
                { label: "Turnovers", t1: aflData.team1Stats.turnovers, t2: aflData.team2Stats.turnovers, reverse: true },
                { label: "Interchange Count", t1: aflData.team1Stats.interchangeCount, t2: aflData.team2Stats.interchangeCount },
              ].map((stat, idx) => {
                const total = (stat.t1 + stat.t2) || 1;
                const pct1 = (stat.t1 / total) * 100;
                const pct2 = (stat.t2 / total) * 100;
                const isT1Better = stat.reverse ? stat.t1 < stat.t2 : stat.t1 > stat.t2;
                const isT2Better = stat.reverse ? stat.t2 < stat.t1 : stat.t2 > stat.t1;

                return (
                  <div key={idx} className="position-relative py-2 border-bottom border-secondary border-opacity-10">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className={`font-monospace fw-bold fs-14-w-40px ${isT1Better ? "text-success" : "text-light"}`} >{stat.t1}</span>
                      <span className="text-muted small fw-medium text-center">{stat.label}</span>
                      <span className={`font-monospace fw-bold fs-14-w-40px text-align-right ${isT2Better ? "text-success" : "text-light"}`} >{stat.t2}</span>
                    </div>
                    <div className="d-flex gap-1 h-6px" >
                      <div className="flex-grow-1 d-flex justify-content-end rounded-start overflow-hidden bg-white-06" >
                        <div style={{ width: `${pct1}%` }} className={`progress-bar-transition ${isT1Better ? "progress-bar-better" : "progress-bar-worse"}`} />
                      </div>
                      <div className="flex-grow-1 rounded-end overflow-hidden bg-white-06" >
                        <div style={{ width: `${pct2}%` }} className={`progress-bar-transition ${isT2Better ? "progress-bar-better" : "progress-bar-worse"}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LEADERS TAB */}
        {activeTab === "leaders" && (
          <div className="card bg-card border border-dark rounded-3 p-4">
            <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 afl-section-title" >
              Player Leaders
            </h5>

            <div className="row g-4">
              {[
                { title: "Most Goals", prop: "mostGoals" },
                { title: "Most Disposals", prop: "mostDisposals" },
                { title: "Most Marks", prop: "mostMarks" },
                { title: "Most Tackles", prop: "mostTackles" },
                { title: "Most Clearances", prop: "mostClearances" },
                { title: "Most Hit Outs", prop: "mostHitOuts" },
              ].map((category, idx) => {
                const t1Leader = (aflData.leadersTeam1 as any)[category.prop];
                const t2Leader = (aflData.leadersTeam2 as any)[category.prop];

                return (
                  <div key={idx} className="col-12 col-md-6">
                    <div className="p-3 rounded-3 h-100 bg-white-02-border-04" >
                      <h6 className="text-muted small fw-bold text-uppercase mb-3 text-center letter-spacing-1">{category.title}</h6>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2 w-50 pe-2">
                          <img src={match.team1Logo} width={20} height={20} alt="T1" />
                          <span className="text-light small text-truncate">{t1Leader.name}</span>
                        </div>
                        <div className="font-monospace fw-bold text-success">{t1Leader.value}</div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-10">
                        <div className="d-flex align-items-center gap-2 w-50 pe-2">
                          <img src={match.team2Logo} width={20} height={20} alt="T2" />
                          <span className="text-light small text-truncate">{t2Leader.name}</span>
                        </div>
                        <div className="font-monospace fw-bold text-success">{t2Leader.value}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === "timeline" && (
          <div className="d-flex flex-column gap-4">
            <div className="card bg-card border border-dark rounded-3 p-4">
              <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 afl-section-title" >Scoring Timeline</h5>
              <div className="d-flex flex-column gap-3">
                {aflData.scoringTimeline.map((play, idx) => (
                  <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-white-02-border-04" >
                    <div className="d-flex align-items-center gap-3">
                      <div className="d-flex flex-column align-items-center justify-content-center bg-dark rounded px-2 py-1 border border-secondary border-opacity-25 min-w-50px" >
                        <span className="text-muted fs-10" >{play.quarter}</span>
                        <span className="text-light font-monospace fw-bold fs-12" >{play.time}</span>
                      </div>
                      <img src={play.team === 1 ? match.team1Logo : match.team2Logo} width={28} height={28} alt="Team" className="object-fit-contain" />
                      <div>
                        <span className={`mb-1 ${play.type === "Goal" ? "badge-afl-goal" : "badge-afl-behind"}`} >
                          {play.type}
                        </span>
                        <p className="text-light m-0 small fw-bold">{play.player}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-card border border-dark rounded-3 p-4">
              <h5 className="text-white fw-bold mb-4 border-start border-info border-4 ps-3 afl-section-title" >Match Events</h5>
              <div className="d-flex flex-column gap-2">
                {aflData.events.map((ev, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3 p-2 border-bottom border-secondary border-opacity-10">
                    <div className="font-monospace text-muted small min-w-70px" >{ev.quarter} {ev.time}</div>
                    <div>
                      <span className={`me-2 ${
                        ev.type === "Injury" ? "badge-afl-injury" : 
                        ev.type === "Interchange" ? "badge-afl-interchange" : 
                        "badge-afl-event-default"
                      }`}>
                        {ev.type}
                      </span>
                      <span className="text-light small">{ev.detail}</span>
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
              { team: match.team1Name, logo: match.team1Logo, roster: aflData.team1Roster },
              { team: match.team2Name, logo: match.team2Logo, roster: aflData.team2Roster }
            ].map((teamData, idx) => (
              <div key={idx} className="col-12 col-md-6">
                <div className="card bg-card border border-dark rounded-3 p-4 h-100">
                  <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-10">
                    <img src={teamData.logo} width={40} height={40} alt="Team" className="object-fit-contain" />
                    <h5 className="text-white fw-bold m-0 afl-section-title" >{teamData.team}</h5>
                  </div>

                  <div className="d-flex flex-column gap-4">
                    <div>
                      <h6 className="text-success small fw-bold text-uppercase mb-3">Starting 18</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {teamData.roster.starting18.map((p, i) => (
                          <span key={i} className="badge bg-dark border border-secondary text-light p-2 fw-normal fs-12" >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h6 className="text-info small fw-normal text-uppercase mb-3">Interchange Players</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {teamData.roster.interchange.map((p, i) => (
                          <span key={i} className="badge bg-dark border border-secondary text-light p-2 fw-normal fs-12" >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2 pt-3 border-top border-secondary border-opacity-10">
                      <span className="text-muted small text-uppercase me-2 letter-spacing-1">Coach:</span>
                      <span className="text-white fw-bold">{teamData.roster.coach}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INFO TAB */}
        {activeTab === "info" && (
          <div className="card bg-card border border-dark rounded-3 p-4">
            <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 afl-section-title" >
              Match Information
            </h5>
            <div className="row g-3">
              {[
                { label: "League", val: aflData.league },
                { label: "Season", val: aflData.season },
                { label: "Round", val: aflData.round },
                { label: "Match Date", val: aflData.matchDate },
                { label: "Match Time", val: aflData.matchTime },
                { label: "Venue", val: aflData.stadium },
                { label: "City", val: aflData.city },
                { label: "Umpires", val: aflData.umpires },
                { label: "Attendance", val: aflData.attendance },
                { label: "Weather", val: aflData.weather },
                { label: "Match Status", val: aflData.matchStatus },
              ].map((info, i) => (
                <div key={i} className="col-6 col-md-4">
                  <div className="p-3 rounded-3 h-100 bg-white-02-border-04" >
                    <div className="text-muted text-uppercase mb-1 fs-10 ls-1px" >{info.label}</div>
                    <div className="text-light fw-medium small text-truncate">{info.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
