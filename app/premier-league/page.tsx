"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";

const plTeams = [
  { name: "Arsenal", logo: "/assets/imgs/teams/Arsenal_FC.svg" },
  { name: "Aston Villa", logo: "/assets/imgs/teams/Aston_Villa_FC_new_crest.svg" },
  { name: "Liverpool", logo: "/assets/imgs/teams/Liverpool_FC.svg" },
  { name: "Manchester City", logo: "/assets/imgs/teams/Manchester_City_FC_badge.svg" },
  { name: "Manchester United", logo: "/assets/imgs/teams/Manchester_United_FC_crest.png" },
  { name: "Newcastle United", logo: "/assets/imgs/teams/Newcastle_United_Logo.svg" },
  { name: "Tottenham Hotspur", logo: "/assets/imgs/teams/Tottenham_Hotspur.png" },
];

const plSchedule = [
  { match: "Matchday 28", team1: "Arsenal", team1Logo: "/assets/imgs/teams/Arsenal_FC.svg", team2: "Manchester City", team2Logo: "/assets/imgs/teams/Manchester_City_FC_badge.svg", date: "March 15, 2026", time: "10:00 PM IST", venue: "Emirates Stadium, London", status: "Completed", score1: "2", score2: "2", result: "Match Drawn" },
  { match: "Matchday 28", team1: "Liverpool", team1Logo: "/assets/imgs/teams/Liverpool_FC.svg", team2: "Manchester United", team2Logo: "/assets/imgs/teams/Manchester_United_FC_crest.png", date: "March 16, 2026", time: "7:30 PM IST", venue: "Anfield, Liverpool", status: "Completed", score1: "3", score2: "1", result: "Liverpool won 3-1" },
  { match: "Matchday 29", team1: "Tottenham Hotspur", team1Logo: "/assets/imgs/teams/Tottenham_Hotspur.png", team2: "Chelsea", team2Logo: "", date: "March 22, 2026", time: "8:30 PM IST", venue: "Tottenham Hotspur Stadium, London", status: "Upcoming" },
  { match: "Matchday 29", team1: "Aston Villa", team1Logo: "/assets/imgs/teams/Aston_Villa_FC_new_crest.svg", team2: "Newcastle United", team2Logo: "/assets/imgs/teams/Newcastle_United_Logo.svg", date: "March 23, 2026", time: "9:00 PM IST", venue: "Villa Park, Birmingham", status: "Upcoming" },
];

const plStandings = [
  { rank: "1", team: "Liverpool", logo: "/assets/imgs/teams/Liverpool_FC.svg", p: "28", w: "20", d: "5", l: "3", pts: "65", gd: "+38" },
  { rank: "2", team: "Manchester City", logo: "/assets/imgs/teams/Manchester_City_FC_badge.svg", p: "28", w: "19", d: "6", l: "3", pts: "63", gd: "+35" },
  { rank: "3", team: "Arsenal", logo: "/assets/imgs/teams/Arsenal_FC.svg", p: "28", w: "18", d: "6", l: "4", pts: "60", gd: "+32" },
  { rank: "4", team: "Aston Villa", logo: "/assets/imgs/teams/Aston_Villa_FC_new_crest.svg", p: "28", w: "16", d: "5", l: "7", pts: "53", gd: "+18" },
  { rank: "5", team: "Tottenham Hotspur", logo: "/assets/imgs/teams/Tottenham_Hotspur.png", p: "28", w: "15", d: "5", l: "8", pts: "50", gd: "+15" },
  { rank: "6", team: "Manchester United", logo: "/assets/imgs/teams/Manchester_United_FC_crest.png", p: "28", w: "14", d: "4", l: "10", pts: "46", gd: "+5" },
];

export default function PremierLeaguePage() {
  const [activeTab, setActiveTab] = useState<"schedule" | "standings" | "teams">("schedule");

  return (
    <main className="font-outfit">
      <PageHeader
        title="Premier League"
        subtitle="Barclays Premier League standings, fixtures, results, live match commentaries, and statistics."
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
            {plSchedule.map((m, idx) => (
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
                          <div className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold" style={{ width: "22px", height: "22px", fontSize: "10px", background: "rgba(255, 255, 255, 0.08)" }}>
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
                          <div className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold" style={{ width: "22px", height: "22px", fontSize: "10px", background: "rgba(255, 255, 255, 0.08)" }}>
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
                  {plStandings.map((row) => (
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
            {plTeams.map((t, idx) => (
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
