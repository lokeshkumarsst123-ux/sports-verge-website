"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";

const uclGroups = [
  {
    group: "Group A",
    teams: [
      { name: "Bayern Munich", p: "6", w: "5", d: "1", l: "0", pts: "16", gd: "+12" },
      { name: "Copenhagen", p: "6", w: "2", d: "2", l: "2", pts: "8", gd: "-1" },
      { name: "Galatasaray", p: "6", w: "1", d: "2", l: "3", pts: "5", gd: "-3" },
      { name: "Manchester United", p: "6", w: "1", d: "1", l: "4", pts: "4", gd: "-8" },
    ],
  },
  {
    group: "Group B",
    teams: [
      { name: "Arsenal", p: "6", w: "4", d: "1", l: "1", pts: "13", gd: "+12" },
      { name: "PSV Eindhoven", p: "6", w: "2", d: "3", l: "1", pts: "9", gd: "-2" },
      { name: "Lens", p: "6", w: "2", d: "2", l: "2", pts: "8", gd: "-5" },
      { name: "Sevilla", p: "6", w: "0", d: "2", l: "4", pts: "2", gd: "-5" },
    ],
  },
];

const uclSchedule = [
  { match: "Quarter-Finals - Leg 1", team1: "Real Madrid", team2: "Manchester City", date: "April 7, 2026", time: "12:30 AM IST", venue: "Santiago Bernabeu, Madrid", status: "Completed", score1: "3", score2: "3", result: "Match Drawn" },
  { match: "Quarter-Finals - Leg 1", team1: "Arsenal", team2: "Bayern Munich", date: "April 8, 2026", time: "12:30 AM IST", venue: "Emirates Stadium, London", status: "Completed", score1: "2", score2: "2", result: "Match Drawn" },
  { match: "Quarter-Finals - Leg 2", team1: "Manchester City", team2: "Real Madrid", date: "April 14, 2026", time: "12:30 AM IST", venue: "Etihad Stadium, Manchester", status: "Upcoming" },
  { match: "Quarter-Finals - Leg 2", team1: "Bayern Munich", team2: "Arsenal", date: "April 15, 2026", time: "12:30 AM IST", venue: "Allianz Arena, Munich", status: "Upcoming" },
];

export default function ChampionsLeaguePage() {
  const [activeTab, setActiveTab] = useState<"fixtures" | "groups" | "history">("fixtures");

  return (
    <main className="font-outfit">
      <PageHeader
        title="Champions League"
        subtitle="UEFA Champions League match fixtures, group stage standings, draws, results, and history."
        className="mb-5"
      />

      {/* Tabs */}
      <div className="container custom-container mb-4">
        <div className="d-flex gap-2 border-bottom border-secondary border-opacity-10 pb-3">
          {(["fixtures", "groups", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="btn text-capitalize fw-bold rounded-pill px-4 py-2 transition-all"
              style={{
                fontSize: "14px",
                background: activeTab === tab ? "var(--accent-green)" : "transparent",
                color: activeTab === tab ? "#fff" : "var(--text-muted)",
                border: activeTab === tab ? "1px solid var(--accent-green)" : "1px solid transparent",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="container custom-container">
        {activeTab === "fixtures" && (
          <div className="row g-4">
            {uclSchedule.map((m, idx) => (
              <div key={idx} className="col-md-6 col-lg-4">
                <div className="premium-table-container p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-success fw-bold font-space-grotesk" style={{ fontSize: "11px", letterSpacing: "0.08em" }}>{m.match.toUpperCase()}</span>
                      <span
                        className="rounded-pill px-3 py-1 font-space-grotesk fw-bold"
                        style={{
                          fontSize: "10px",
                          background: m.status === "Completed" ? "rgba(255, 255, 255, 0.08)" : "rgba(34, 197, 94, 0.15)",
                          color: m.status === "Completed" ? "#a0a5ad" : "#22c55e",
                          border: m.status === "Completed" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(34, 197, 94, 0.3)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {m.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center my-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold" style={{ width: "22px", height: "22px", fontSize: "10px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                          {m.team1.charAt(0)}
                        </div>
                        <span className="fw-bold text-white font-space-grotesk" style={{ fontSize: "15px" }}>{m.team1}</span>
                      </div>
                      {m.score1 && <span className="fw-bold text-white font-monospace" style={{ fontSize: "18px" }}>{m.score1}</span>}
                    </div>

                    <div className="d-flex justify-content-between align-items-center my-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold" style={{ width: "22px", height: "22px", fontSize: "10px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                          {m.team2.charAt(0)}
                        </div>
                        <span className="fw-bold text-white font-space-grotesk" style={{ fontSize: "15px" }}>{m.team2}</span>
                      </div>
                      {m.score2 && <span className="fw-bold text-white font-monospace" style={{ fontSize: "18px" }}>{m.score2}</span>}
                    </div>
                  </div>

                  <hr className="border-secondary opacity-10 my-3" />

                  <div>
                    <div className="d-flex align-items-center gap-2 text-muted mb-2" style={{ fontSize: "12px" }}>
                      <i className="bi bi-calendar-event"></i>
                      <span>{m.date} · {m.time}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted mb-3" style={{ fontSize: "12px" }}>
                      <i className="bi bi-geo-alt"></i>
                      <span className="text-truncate">{m.venue}</span>
                    </div>
                    {m.result && (
                      <div className="p-2 rounded bg-success bg-opacity-10 text-success text-center fw-semibold" style={{ fontSize: "12px" }}>
                        {m.result}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "groups" && (
          <div className="d-flex flex-column gap-5">
            {uclGroups.map((group, gIdx) => (
              <div key={gIdx}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="d-inline-block rounded animate-pulse" style={{ width: "3px", height: "18px", background: "var(--accent-green)" }}></span>
                  <h5 className="fw-bold text-white mb-0 font-space-grotesk" style={{ fontSize: "16px" }}>{group.group}</h5>
                </div>

                <div className="premium-table-container">
                  <div className="table-responsive">
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th className="text-start" style={{ width: "80px" }}>RANK</th>
                          <th className="text-start">TEAM</th>
                          <th className="text-center">P</th>
                          <th className="text-center">W</th>
                          <th className="text-center">D</th>
                          <th className="text-center">L</th>
                          <th className="text-center">PTS</th>
                          <th className="text-center">GD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.teams.map((row, idx) => (
                          <tr key={idx}>
                            <td className="premium-table-rank text-start text-success">#{idx + 1}</td>
                            <td className="premium-table-team text-start">
                              <div className="d-flex align-items-center gap-2">
                                <div className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold" style={{ width: "20px", height: "20px", fontSize: "10px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                                  {row.name.charAt(0)}
                                </div>
                                <span>{row.name}</span>
                              </div>
                            </td>
                            <td className="premium-table-stat text-center">{row.p}</td>
                            <td className="premium-table-stat text-center">{row.w}</td>
                            <td className="premium-table-stat text-center">{row.d}</td>
                            <td className="premium-table-stat text-center">{row.l}</td>
                            <td className="premium-table-stat-bold text-center">{row.pts}</td>
                            <td className="premium-table-stat text-center" style={{ color: row.gd.startsWith("+") ? "var(--accent-green)" : "inherit" }}>{row.gd}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <div className="premium-table-container p-5">
            <h4 className="fw-bold text-white mb-3 font-space-grotesk">UEFA Champions League History</h4>
            <p className="text-muted lh-lg" style={{ fontSize: "15px" }}>
              The UEFA Champions League is an annual club football competition organized by the Union of European Football Associations (UEFA) and contested by top-division European clubs, deciding the competition winners through a round robin group stage to qualify for a double-legged knockout format, and a single leg final.
            </p>
            <p className="text-muted lh-lg mb-0" style={{ fontSize: "15px" }}>
              It is one of the most prestigious football tournaments in the world and the most prestigious club competition in European football, played by the national league champions (and, for some nations, one or more runners-up) of their national associations. Real Madrid is the most successful club in the tournament's history, having won it 15 times.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
