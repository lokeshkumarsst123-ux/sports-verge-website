"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";

const iplTeams = [
  { name: "Mumbai Indians", logo: "/assets/imgs/teams/ipl/MIoutline.png", color: "#004ba0" },
  { name: "Chennai Super Kings", logo: "/assets/imgs/teams/ipl/CSKoutline.png", color: "#fdb913" },
  { name: "Royal Challengers Bengaluru", logo: "/assets/imgs/teams/ipl/RCBoutline.png", color: "#ec1c24" },
  { name: "Kolkata Knight Riders", logo: "/assets/imgs/teams/ipl/KKRoutline.png", color: "#3a225d" },
  { name: "Delhi Capitals", logo: "/assets/imgs/teams/ipl/DCoutline.png", color: "#005ea6" },
  { name: "Rajasthan Royals", logo: "/assets/imgs/teams/ipl/RRoutline.png", color: "#ea1a85" },
  { name: "Sunrisers Hyderabad", logo: "/assets/imgs/teams/ipl/SRHoutline.png", color: "#f26522" },
  { name: "Gujarat Titans", logo: "/assets/imgs/teams/ipl/GToutline.png", color: "#0b2240" },
  { name: "Lucknow Super Giants", logo: "/assets/imgs/teams/ipl/LSGoutline.png", color: "#0057e7" },
  { name: "Punjab Kings", logo: "/assets/imgs/teams/ipl/PBKSoutline.png", color: "#dd1f26" },
];

const iplSchedule = [
  { match: "Match 1", team1: "CSK", team2: "RCB", date: "March 22, 2026", time: "7:30 PM IST", venue: "M. A. Chidambaram Stadium, Chennai", status: "Completed", score1: "173/5 (18.4)", score2: "170/7 (20)", result: "CSK won by 5 wickets" },
  { match: "Match 2", team1: "MI", team2: "GT", date: "March 23, 2026", time: "7:30 PM IST", venue: "Narendra Modi Stadium, Ahmedabad", status: "Completed", score1: "162/8 (20)", score2: "168/6 (20)", result: "GT won by 6 runs" },
  { match: "Match 3", team1: "KKR", team2: "SRH", date: "March 24, 2026", time: "7:30 PM IST", venue: "Eden Gardens, Kolkata", status: "Upcoming", venueShort: "Eden Gardens" },
  { match: "Match 4", team1: "DC", team2: "RR", date: "March 25, 2026", time: "7:30 PM IST", venue: "Sawai Mansingh Stadium, Jaipur", status: "Upcoming", venueShort: "Sawai Mansingh Stadium" },
];

const iplStandings = [
  { rank: "1", team: "Chennai Super Kings", p: "1", w: "1", l: "0", pts: "2", nrr: "+0.320" },
  { rank: "2", team: "Gujarat Titans", p: "1", w: "1", l: "0", pts: "2", nrr: "+0.300" },
  { rank: "3", team: "Kolkata Knight Riders", p: "0", w: "0", l: "0", pts: "0", nrr: "0.000" },
  { rank: "4", team: "Delhi Capitals", p: "0", w: "0", l: "0", pts: "0", nrr: "0.000" },
  { rank: "5", team: "Rajasthan Royals", p: "0", w: "0", l: "0", pts: "0", nrr: "0.000" },
  { rank: "6", team: "Mumbai Indians", p: "1", w: "0", l: "1", pts: "0", nrr: "-0.300" },
  { rank: "7", team: "Royal Challengers Bengaluru", p: "1", w: "0", l: "1", pts: "0", nrr: "-0.320" },
];

export default function IplPage() {
  const [activeTab, setActiveTab] = useState<"schedule" | "standings" | "teams">("schedule");

  return (
    <main className="min-vh-100 font-outfit" style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "40px 0 80px 0" }}>
      <PageHeader
        title="IPL 2026"
        subtitle="Indian Premier League Season 19 schedule, standings, teams, and live score tracking."
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
            {iplSchedule.map((m, idx) => (
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
                        <img src={`/assets/imgs/teams/ipl/${m.team1}outline.png`} alt={m.team1} style={{ width: "24px", height: "24px" }} />
                        <span className="fw-bold text-white font-space-grotesk" style={{ fontSize: "16px" }}>{m.team1}</span>
                      </div>
                      {m.score1 && <span className="fw-bold text-white font-monospace">{m.score1}</span>}
                    </div>

                    <div className="d-flex justify-content-between align-items-center my-3">
                      <div className="d-flex align-items-center gap-2">
                        <img src={`/assets/imgs/teams/ipl/${m.team2}outline.png`} alt={m.team2} style={{ width: "24px", height: "24px" }} />
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
                  {iplStandings.map((row) => {
                    const logoCode = row.team === "Chennai Super Kings" ? "CSK" :
                                     row.team === "Mumbai Indians" ? "MI" :
                                     row.team === "Royal Challengers Bengaluru" ? "RCB" :
                                     row.team === "Kolkata Knight Riders" ? "KKR" :
                                     row.team === "Delhi Capitals" ? "DC" :
                                     row.team === "Rajasthan Royals" ? "RR" : "GT";
                    return (
                      <tr key={row.rank}>
                        <td className="premium-table-rank text-start text-success">#{row.rank}</td>
                        <td className="premium-table-team text-start">
                          <div className="d-flex align-items-center gap-2">
                            <img src={`/assets/imgs/teams/ipl/${logoCode}outline.png`} alt={row.team} style={{ width: "20px", height: "20px" }} />
                            <span>{row.team}</span>
                          </div>
                        </td>
                        <td className="premium-table-stat text-center">{row.p}</td>
                        <td className="premium-table-stat text-center">{row.w}</td>
                        <td className="premium-table-stat text-center">{row.l}</td>
                        <td className="premium-table-stat-bold text-center">{row.pts}</td>
                        <td className="premium-table-stat text-center" style={{ color: row.nrr.startsWith("+") ? "var(--accent-green)" : "inherit" }}>{row.nrr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "teams" && (
          <div className="row g-4">
            {iplTeams.map((t, idx) => (
              <div key={idx} className="col-6 col-md-4 col-lg-3">
                <div className="premium-table-container p-4 text-center hover-glow transition-all" style={{ cursor: "pointer" }}>
                  <div className="d-flex align-items-center justify-content-center mb-3" style={{ height: "80px" }}>
                    <img src={t.logo} alt={t.name} style={{ maxHeight: "70px", maxWidth: "70px", objectFit: "contain" }} />
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
