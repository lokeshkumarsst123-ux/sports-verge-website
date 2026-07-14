"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";

const worldCupGroups = [
  {
    group: "Group A",
    teams: [
      { name: "India", logo: "/assets/imgs/teams/india.webp", p: "2", w: "2", l: "0", pts: "4", nrr: "+1.420" },
      { name: "Pakistan", logo: "/assets/imgs/teams/pakistan.webp", p: "2", w: "1", l: "1", pts: "2", nrr: "+0.120" },
      { name: "Ireland", logo: "/assets/imgs/teams/ireland.webp", p: "2", w: "0", l: "2", pts: "0", nrr: "-1.540" },
    ],
  },
  {
    group: "Group B",
    teams: [
      { name: "Australia", logo: "/assets/imgs/teams/australia.webp", p: "2", w: "2", l: "0", pts: "4", nrr: "+2.110" },
      { name: "England", logo: "/assets/imgs/teams/england.webp", p: "2", w: "1", l: "1", pts: "2", nrr: "+0.550" },
      { name: "Afghanistan", logo: "/assets/imgs/teams/afghanistan.webp", p: "2", w: "0", l: "2", pts: "0", nrr: "-2.660" },
    ],
  },
];

const wcSchedule = [
  { match: "Match 1", team1: "India", team1Logo: "/assets/imgs/teams/india.webp", team2: "Pakistan", team2Logo: "/assets/imgs/teams/pakistan.webp", date: "June 9, 2026", time: "8:00 PM IST", venue: "Nassau County International Cricket Stadium, NY", status: "Completed", score1: "119/10 (19)", score2: "113/7 (20)", result: "India won by 6 runs" },
  { match: "Match 2", team1: "Australia", team1Logo: "/assets/imgs/teams/australia.webp", team2: "England", team2Logo: "/assets/imgs/teams/england.webp", date: "June 11, 2026", time: "8:00 PM IST", venue: "Kensington Oval, Barbados", status: "Completed", score1: "201/7 (20)", score2: "165/6 (20)", result: "Australia won by 36 runs" },
  { match: "Match 3", team1: "Sri Lanka", team1Logo: "/assets/imgs/teams/sri-lanka.webp", team2: "South Africa", team2Logo: "/assets/imgs/teams/south-africa.webp", date: "June 14, 2026", time: "8:00 PM IST", venue: "Sir Vivian Richards Stadium, Antigua", status: "Upcoming" },
  { match: "Match 4", team1: "New Zealand", team1Logo: "/assets/imgs/teams/new-zealand.webp", team2: "West Indies", team2Logo: "/assets/imgs/teams/west-indies.webp", date: "June 16, 2026", time: "8:00 PM IST", venue: "Brian Lara Stadium, Trinidad", status: "Upcoming" },
];

export default function T20WorldCupPage() {
  const [activeTab, setActiveTab] = useState<"schedule" | "standings">("schedule");

  return (
    <main className="min-vh-100 font-outfit" style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "40px 0 80px 0" }}>
      <PageHeader
        title="T20 World Cup 2026"
        subtitle="ICC Men's T20 World Cup tournament schedule, group standings, match highlights, and news."
        className="mb-5"
      />

      {/* Tabs */}
      <div className="container custom-container mb-4">
        <div className="d-flex gap-2 border-bottom border-secondary border-opacity-10 pb-3">
          {(["schedule", "standings"] as const).map((tab) => (
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
            {wcSchedule.map((m, idx) => (
              <div key={idx} className="col-md-6 col-lg-4">
                <div className="premium-table-container p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-success fw-bold font-space-grotesk" style={{ fontSize: "11px", letterSpacing: "0.08em" }}>{m.match.toUpperCase()}</span>
                      <span className={`badge rounded-pill ${m.status === "Completed" ? "bg-secondary bg-opacity-20 text-muted" : "bg-success bg-opacity-20 text-success"}`} style={{ fontSize: "10px" }}>{m.status}</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center my-3">
                      <div className="d-flex align-items-center gap-2">
                        <img src={m.team1Logo} alt={m.team1} style={{ width: "24px", height: "18px", objectFit: "cover", borderRadius: "2px" }} />
                        <span className="fw-bold text-white font-space-grotesk" style={{ fontSize: "16px" }}>{m.team1}</span>
                      </div>
                      {m.score1 && <span className="fw-bold text-white font-monospace">{m.score1}</span>}
                    </div>

                    <div className="d-flex justify-content-between align-items-center my-3">
                      <div className="d-flex align-items-center gap-2">
                        <img src={m.team2Logo} alt={m.team2} style={{ width: "24px", height: "18px", objectFit: "cover", borderRadius: "2px" }} />
                        <span className="fw-bold text-white font-space-grotesk" style={{ fontSize: "16px" }}>{m.team2}</span>
                      </div>
                      {m.score2 && <span className="fw-bold text-white font-monospace">{m.score2}</span>}
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
          <div className="d-flex flex-column gap-5">
            {worldCupGroups.map((group, gIdx) => (
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
                          <th className="text-center">L</th>
                          <th className="text-center">PTS</th>
                          <th className="text-center">NRR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.teams.map((row, idx) => (
                          <tr key={idx}>
                            <td className="premium-table-rank text-start text-success">#{idx + 1}</td>
                            <td className="premium-table-team text-start">
                              <div className="d-flex align-items-center gap-2">
                                <img src={row.logo} alt={row.name} style={{ width: "22px", height: "16px", objectFit: "cover", borderRadius: "2px" }} />
                                <span>{row.name}</span>
                              </div>
                            </td>
                            <td className="premium-table-stat text-center">{row.p}</td>
                            <td className="premium-table-stat text-center">{row.w}</td>
                            <td className="premium-table-stat text-center">{row.l}</td>
                            <td className="premium-table-stat-bold text-center">{row.pts}</td>
                            <td className="premium-table-stat text-center" style={{ color: row.nrr.startsWith("+") ? "var(--accent-green)" : "inherit" }}>{row.nrr}</td>
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
      </div>
    </main>
  );
}
