"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";

const ashesSchedule = [
  { test: "1st Test", date: "June 16-20, 2026", venue: "Edgbaston, Birmingham", status: "Completed", scoreAus: "386 & 282/8", scoreEng: "393/8d & 273", result: "Australia won by 2 wickets" },
  { test: "2nd Test", date: "June 28-July 2, 2026", venue: "Lord's, London", status: "Completed", scoreAus: "416 & 279", scoreEng: "325 & 327", result: "Australia won by 43 runs" },
  { test: "3rd Test", date: "July 6-10, 2026", venue: "Headingley, Leeds", status: "Completed", scoreAus: "263 & 224", scoreEng: "237 & 254/7", result: "England won by 3 wickets" },
  { test: "4th Test", date: "July 19-23, 2026", venue: "Old Trafford, Manchester", status: "Completed", scoreAus: "317 & 214/5", scoreEng: "592", result: "Match Drawn" },
  { test: "5th Test", date: "July 27-31, 2026", venue: "The Oval, London", status: "Completed", scoreAus: "295 & 334", scoreEng: "283 & 395", result: "England won by 49 runs" },
];

const ashesStats = {
  batting: [
    { rank: 1, player: "Usman Khawaja", team: "Australia", runs: "496", avg: "49.60", hs: "141" },
    { rank: 2, player: "Zak Crawley", team: "England", runs: "480", avg: "53.33", hs: "189" },
    { rank: 3, player: "Joe Root", team: "England", runs: "412", avg: "51.50", hs: "118*" },
  ],
  bowling: [
    { rank: 1, player: "Stuart Broad", team: "England", wickets: "22", avg: "26.22", econ: "3.39" },
    { rank: 2, player: "Mitchell Starc", team: "Australia", wickets: "23", avg: "27.08", econ: "4.37" },
    { rank: 3, player: "Chris Woakes", team: "England", wickets: "19", avg: "18.14", econ: "3.12" },
  ],
};

export default function AshesPage() {
  const [activeTab, setActiveTab] = useState<"matches" | "stats" | "history">("matches");

  return (
    <main className="min-vh-100 font-outfit" style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "40px 0 80px 0" }}>
      <PageHeader
        title="The Ashes 2026"
        subtitle="Australia vs England Test Series match schedules, stats leaders, results, and team news."
        className="mb-5"
      />

      {/* Tabs */}
      <div className="container custom-container mb-4">
        <div className="d-flex gap-2 border-bottom border-secondary border-opacity-10 pb-3">
          {(["matches", "stats", "history"] as const).map((tab) => (
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
        {activeTab === "matches" && (
          <div className="d-flex flex-column gap-4">
            {ashesSchedule.map((m, idx) => (
              <div key={idx} className="premium-table-container p-4">
                <div className="row align-items-center">
                  <div className="col-md-3 mb-2 mb-md-0">
                    <span className="text-success fw-bold font-space-grotesk" style={{ fontSize: "12px", letterSpacing: "0.08em" }}>{m.test.toUpperCase()}</span>
                    <h5 className="text-white fw-bold mb-0 mt-1" style={{ fontSize: "15px" }}>{m.venue}</h5>
                    <span className="text-muted small">{m.date}</span>
                  </div>

                  <div className="col-md-6 my-3 my-md-0 border-start border-end border-secondary border-opacity-10 px-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src="/assets/imgs/teams/australia.webp" alt="Australia" style={{ width: "20px", height: "15px", objectFit: "cover", borderRadius: "2px" }} />
                        <span className="fw-semibold text-white">Australia</span>
                      </div>
                      <span className="font-monospace text-white fw-semibold">{m.scoreAus}</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <img src="/assets/imgs/teams/england.webp" alt="England" style={{ width: "20px", height: "15px", objectFit: "cover", borderRadius: "2px" }} />
                        <span className="fw-semibold text-white">England</span>
                      </div>
                      <span className="font-monospace text-white fw-semibold">{m.scoreEng}</span>
                    </div>
                  </div>

                  <div className="col-md-3 text-md-end">
                    <div
                      className="d-inline-block rounded-pill px-3 py-1 font-space-grotesk fw-bold mb-2"
                      style={{
                        fontSize: "10px",
                        background: m.status === "Completed" ? "rgba(255, 255, 255, 0.08)" : "rgba(34, 197, 94, 0.15)",
                        color: m.status === "Completed" ? "#a0a5ad" : "#22c55e",
                        border: m.status === "Completed" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(34, 197, 94, 0.3)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {m.status.toUpperCase()}
                    </div>
                    <p className="text-white fw-semibold mb-0" style={{ fontSize: "13px" }}>{m.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="row g-5">
            <div className="col-lg-6">
              <h5 className="fw-bold text-white mb-4 font-space-grotesk">Most Runs</h5>
              <div className="premium-table-container">
                <div className="table-responsive">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th className="text-start" style={{ width: "60px" }}>RANK</th>
                        <th className="text-start">PLAYER</th>
                        <th className="text-center">RUNS</th>
                        <th className="text-center">AVG</th>
                        <th className="text-center">HS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ashesStats.batting.map((p) => (
                        <tr key={p.rank}>
                          <td className="premium-table-rank text-start text-success">#{p.rank}</td>
                          <td className="premium-table-team text-start">
                            <div className="d-flex align-items-center gap-2">
                              <img src={p.team === "Australia" ? "/assets/imgs/teams/australia.webp" : "/assets/imgs/teams/england.webp"} alt={p.team} style={{ width: "16px", height: "12px", objectFit: "cover" }} />
                              <span>{p.player}</span>
                            </div>
                          </td>
                          <td className="premium-table-stat-bold text-center">{p.runs}</td>
                          <td className="premium-table-stat text-center">{p.avg}</td>
                          <td className="premium-table-stat text-center">{p.hs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <h5 className="fw-bold text-white mb-4 font-space-grotesk">Most Wickets</h5>
              <div className="premium-table-container">
                <div className="table-responsive">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th className="text-start" style={{ width: "60px" }}>RANK</th>
                        <th className="text-start">PLAYER</th>
                        <th className="text-center">WKTS</th>
                        <th className="text-center">AVG</th>
                        <th className="text-center">ECON</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ashesStats.bowling.map((p) => (
                        <tr key={p.rank}>
                          <td className="premium-table-rank text-start text-success">#{p.rank}</td>
                          <td className="premium-table-team text-start">
                            <div className="d-flex align-items-center gap-2">
                              <img src={p.team === "Australia" ? "/assets/imgs/teams/australia.webp" : "/assets/imgs/teams/england.webp"} alt={p.team} style={{ width: "16px", height: "12px", objectFit: "cover" }} />
                              <span>{p.player}</span>
                            </div>
                          </td>
                          <td className="premium-table-stat-bold text-center">{p.wickets}</td>
                          <td className="premium-table-stat text-center">{p.avg}</td>
                          <td className="premium-table-stat text-center">{p.econ}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="premium-table-container p-5">
            <h4 className="fw-bold text-white mb-3 font-space-grotesk">The Ashes History & Legacy</h4>
            <p className="text-muted lh-lg" style={{ fontSize: "15px" }}>
              The Ashes is a biennial Test cricket series played between England and Australia. The term originated in a satirical obituary published in a British newspaper, The Sporting Life, immediately after Australia's 1882 victory at The Oval, its first Test win on English soil. The obituary stated that English cricket had died, and "the body will be cremated and the ashes taken to Australia".
            </p>
            <p className="text-muted lh-lg mb-0" style={{ fontSize: "15px" }}>
              The English captain Ivo Bligh vowed to "regain those ashes". During the subsequent tour in Australia, a small terracotta urn, reputedly containing the ashes of a cricket ball, was presented to Bligh by a group of Melbourne women. The series consists of five Test matches, hosted alternately by the two countries.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
