"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";

const laligaTeams = [
  { name: "Real Madrid", logo: "" },
  { name: "Barcelona", logo: "" },
  { name: "Atletico Madrid", logo: "" },
  { name: "Real Sociedad", logo: "" },
  { name: "Athletic Club", logo: "" },
  { name: "Girona", logo: "" },
];

const laligaSchedule = [
  { match: "Matchday 28", team1: "Real Madrid", team1Logo: "", team2: "Barcelona", team2Logo: "", date: "March 15, 2026", time: "11:30 PM IST", venue: "Santiago Bernabeu, Madrid", status: "Completed", score1: "3", score2: "2", result: "Real Madrid won 3-2" },
  { match: "Matchday 28", team1: "Atletico Madrid", team1Logo: "", team2: "Sevilla", team2Logo: "", date: "March 16, 2026", time: "9:00 PM IST", venue: "Civitas Metropolitano, Madrid", status: "Completed", score1: "2", score2: "0", result: "Atletico won 2-0" },
  { match: "Matchday 29", team1: "Barcelona", team1Logo: "", team2: "Girona", team2Logo: "", date: "March 22, 2026", time: "8:00 PM IST", venue: "Camp Nou, Barcelona", status: "Upcoming" },
  { match: "Matchday 29", team1: "Real Sociedad", team1Logo: "", team2: "Athletic Club", team2Logo: "", date: "March 23, 2026", time: "10:30 PM IST", venue: "Reale Arena, San Sebastian", status: "Upcoming" },
];

const laligaStandings = [
  { rank: "1", team: "Real Madrid", logo: "", p: "28", w: "21", d: "5", l: "2", pts: "68", gd: "+42" },
  { rank: "2", team: "Girona", logo: "", p: "28", w: "19", d: "5", l: "4", pts: "62", gd: "+29" },
  { rank: "3", team: "Barcelona", logo: "", p: "28", w: "18", d: "7", l: "3", pts: "61", gd: "+25" },
  { rank: "4", team: "Atletico Madrid", logo: "", p: "28", w: "17", d: "4", l: "7", pts: "55", gd: "+21" },
  { rank: "5", team: "Athletic Club", logo: "", p: "28", w: "15", d: "8", l: "5", pts: "53", gd: "+17" },
  { rank: "6", team: "Real Sociedad", logo: "", p: "28", w: "12", d: "10", l: "6", pts: "46", gd: "+11" },
];

export default function LaLigaPage() {
  const [activeTab, setActiveTab] = useState<"schedule" | "standings" | "teams">("schedule");

  return (
    <main className="min-vh-100 font-outfit" style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "40px 0 80px 0" }}>
      <PageHeader
        title="La Liga"
        subtitle="Spanish LALIGA EA SPORTS standings, fixtures, scores, team news, and statistics."
        className="mb-5"
      />

      {/* Tabs */}
      <div className="container custom-container mb-4">
        <div className="d-flex gap-2 border-bottom border-secondary border-opacity-10 pb-3">
          {(["schedule", "standings", "teams"] as const).map((tab) => (
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
        {activeTab === "schedule" && (
          <div className="row g-4">
            {laligaSchedule.map((m, idx) => (
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
                        {m.team1Logo ? (
                          <img src={m.team1Logo} alt={m.team1} style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold" style={{ width: "22px", height: "22px", fontSize: "10px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                            {m.team1.charAt(0)}
                          </div>
                        )}
                        <span className="fw-bold text-white font-space-grotesk" style={{ fontSize: "15px" }}>{m.team1}</span>
                      </div>
                      {m.score1 && <span className="fw-bold text-white font-monospace" style={{ fontSize: "18px" }}>{m.score1}</span>}
                    </div>

                    <div className="d-flex justify-content-between align-items-center my-3">
                      <div className="d-flex align-items-center gap-2">
                        {m.team2Logo ? (
                          <img src={m.team2Logo} alt={m.team2} style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold" style={{ width: "22px", height: "22px", fontSize: "10px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                            {m.team2.charAt(0)}
                          </div>
                        )}
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

        {activeTab === "standings" && (
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
                  {laligaStandings.map((row) => (
                    <tr key={row.rank}>
                      <td className="premium-table-rank text-start text-success">#{row.rank}</td>
                      <td className="premium-table-team text-start">
                        <div className="d-flex align-items-center gap-2">
                          {row.logo ? (
                            <img src={row.logo} alt={row.team} style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold" style={{ width: "20px", height: "20px", fontSize: "10px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                              {row.team.charAt(0)}
                            </div>
                          )}
                          <span>{row.team}</span>
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
        )}

        {activeTab === "teams" && (
          <div className="row g-4">
            {laligaTeams.map((t, idx) => (
              <div key={idx} className="col-6 col-md-4 col-lg-3">
                <div className="premium-table-container p-4 text-center hover-glow transition-all" style={{ cursor: "pointer" }}>
                  <div className="d-flex align-items-center justify-content-center mb-3" style={{ height: "80px" }}>
                    {t.logo ? (
                      <img src={t.logo} alt={t.name} style={{ maxHeight: "70px", maxWidth: "70px", objectFit: "contain" }} />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold bg-secondary bg-opacity-20" style={{ width: "70px", height: "70px", fontSize: "28px" }}>
                        {t.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h6 className="fw-bold text-white font-space-grotesk text-truncate mb-0">{t.name}</h6>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
