"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";

const statsCategories: Record<string, { title: string; headers: string[]; rows: string[][] }[]> = {
  Cricket: [
    {
      title: "IPL 2026 - Most Runs (Orange Cap)",
      headers: ["RANK", "PLAYER", "TEAM", "MATCHES", "RUNS", "AVERAGE"],
      rows: [
        ["1", "Virat Kohli", "RCB", "14", "741", "61.75"],
        ["2", "Ruturaj Gaikwad", "CSK", "14", "583", "53.00"],
        ["3", "Travis Head", "SRH", "12", "567", "47.25"],
        ["4", "Riyan Parag", "RR", "14", "531", "48.27"],
      ],
    },
    {
      title: "IPL 2026 - Most Wickets (Purple Cap)",
      headers: ["RANK", "PLAYER", "TEAM", "MATCHES", "WICKETS", "ECONOMY"],
      rows: [
        ["1", "Harshal Patel", "PBKS", "14", "24", "8.65"],
        ["2", "Jasprit Bumrah", "MI", "13", "20", "6.48"],
        ["3", "Varun Chakaravarthy", "KKR", "14", "19", "8.04"],
      ],
    },
  ],
  Football: [
    {
      title: "Premier League 25/26 - Top Scorers",
      headers: ["RANK", "PLAYER", "TEAM", "GOALS", "ASSISTS", "MATCHES"],
      rows: [
        ["1", "Erling Haaland", "Man City", "27", "5", "31"],
        ["2", "Cole Palmer", "Chelsea", "22", "11", "33"],
        ["3", "Alexander Isak", "Newcastle", "21", "2", "29"],
      ],
    },
  ],
  NFL: [
    {
      title: "NFL Regular Season - Passing Yards Leaders",
      headers: ["RANK", "PLAYER", "TEAM", "YARDS", "TOUCHDOWNS", "INT"],
      rows: [
        ["1", "Patrick Mahomes", "KC", "4,820", "38", "12"],
        ["2", "Josh Allen", "BUF", "4,510", "34", "14"],
        ["3", "Tua Tagovailoa", "MIA", "4,450", "30", "11"],
      ],
    },
  ],
  AFL: [
    {
      title: "AFL - Coleman Medal Goal Kickers",
      headers: ["RANK", "PLAYER", "TEAM", "GOALS", "MATCHES", "BEHINDS"],
      rows: [
        ["1", "Charlie Curnow", "Carlton", "78", "23", "34"],
        ["2", "Nick Larkey", "North Melbourne", "71", "22", "20"],
        ["3", "Oscar Allen", "West Coast", "53", "22", "18"],
      ],
    },
  ],
};

const tabConfig = [
  { name: "Cricket", icon: "bi-trophy" },
  { name: "Football", icon: "bi-dribbble" },
  { name: "NFL", icon: "bi-shield" },
  { name: "AFL", icon: "bi-circle" },
];

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState("Cricket");

  return (
    <main className="font-outfit">
      <PageHeader
        title="Player Stats & Leaders"
        subtitle="Leading player statistics and performance metrics across top global leagues."
        className="mb-5"
      />

      <div className="container custom-container mb-4">
        <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {tabConfig.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className="btn d-flex align-items-center gap-2 fw-semibold rounded-pill px-4 py-2 transition-all text-white"
                style={{
                  fontSize: "13px",
                  background: isActive ? "var(--accent-green)" : "var(--bg-card)",
                  border: `1px solid ${isActive ? "var(--accent-green)" : "var(--border-dark)"}`,
                }}
              >
                <i className={`bi ${tab.icon}`}></i>
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="container custom-container">
        <div className="d-flex flex-column gap-5">
          {statsCategories[activeTab]?.map((group, idx) => (
            <div key={idx} className="premium-table-container p-2 p-md-4">
              <h5 className="fw-bold text-white mb-4 font-space-grotesk" style={{ fontSize: "15px" }}>
                {group.title}
              </h5>
              <div className="table-responsive">
                <table className="premium-table">
                  <thead>
                    <tr>
                      {group.headers.map((h, hIdx) => (
                        <th key={hIdx} className={hIdx <= 1 ? "text-start" : "text-center"}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => {
                          if (cIdx === 0) {
                            return (
                              <td key={cIdx} className="premium-table-rank text-start text-success">
                                #{cell}
                              </td>
                            );
                          }
                          if (cIdx === 1) {
                            return (
                              <td key={cIdx} className="premium-table-team text-start">
                                {cell}
                              </td>
                            );
                          }
                          const isPrimaryStat = cIdx === 3 || cIdx === 4;
                          return (
                            <td key={cIdx} className={isPrimaryStat ? "premium-table-stat-bold text-center" : "premium-table-stat text-center"}>
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
