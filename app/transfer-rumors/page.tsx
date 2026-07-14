"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";

const transferRumors = [
  {
    player: "Kylian Mbappé",
    position: "Forward",
    fromClub: "Paris Saint-Germain",
    toClub: "Real Madrid",
    fee: "Free Transfer (Signing Bonus: €100M)",
    probability: "Very High",
    source: "Fabrizio Romano",
    date: "March 14, 2026",
    summary: "Agreement reached on all terms. Real Madrid is preparing the official presentation for July. Mbappé will sign a 5-year contract.",
  },
  {
    player: "Erling Haaland",
    position: "Striker",
    fromClub: "Manchester City",
    toClub: "Barcelona",
    fee: "€150M",
    probability: "Low",
    source: "Mundo Deportivo",
    date: "March 13, 2026",
    summary: "Barcelona is eyeing a move next summer to replace Lewandowski, but financial constraints make the operation extremely difficult.",
  },
  {
    player: "Victor Osimhen",
    position: "Striker",
    fromClub: "Napoli",
    toClub: "Chelsea",
    fee: "€120M (Release Clause)",
    probability: "High",
    source: "The Athletic",
    date: "March 12, 2026",
    summary: "Chelsea has renewed contacts with Osimhen's camp. The player is keen on a Premier League move, and personal terms won't be an issue.",
  },
  {
    player: "Jamal Musiala",
    position: "Midfielder",
    fromClub: "Bayern Munich",
    toClub: "Manchester City",
    fee: "€110M",
    probability: "Medium",
    source: "Sky Sports Germany",
    date: "March 11, 2026",
    summary: "Pep Guardiola views Musiala as the long-term successor to De Bruyne. Bayern is desperate to tie him down to a new long-term deal.",
  },
];

export default function TransferRumorsPage() {
  const [filterProb, setFilterProb] = useState<string>("All");

  const filteredRumors = filterProb === "All" 
    ? transferRumors 
    : transferRumors.filter(r => r.probability === filterProb);

  return (
    <main className="min-vh-100 font-outfit" style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "40px 0 80px 0" }}>
      <PageHeader
        title="Transfer Rumors"
        subtitle="Up-to-the-minute football transfer rumors, completed deals, contracts, and insider sources."
        className="mb-5"
      />

      {/* Filter Tabs */}
      <div className="container custom-container mb-4">
        <div className="d-flex gap-2 border-bottom border-secondary border-opacity-10 pb-3">
          {["All", "Very High", "High", "Medium", "Low"].map((prob) => (
            <button
              key={prob}
              onClick={() => setFilterProb(prob)}
              className="btn text-capitalize fw-bold rounded-pill px-4 py-2 transition-all"
              style={{
                fontSize: "13px",
                background: filterProb === prob ? "var(--accent-green)" : "transparent",
                color: filterProb === prob ? "#fff" : "var(--text-muted)",
                border: filterProb === prob ? "1px solid var(--accent-green)" : "1px solid transparent",
              }}
            >
              {prob === "All" ? "All Rumors" : `${prob} Probability`}
            </button>
          ))}
        </div>
      </div>

      <div className="container custom-container">
        <div className="row g-4">
          {filteredRumors.map((r, idx) => {
            const probColor = r.probability === "Very High" || r.probability === "High"
              ? "#22c55e"
              : r.probability === "Medium"
              ? "#eab308"
              : "#ef4444";
            
            const probBg = r.probability === "Very High" || r.probability === "High"
              ? "rgba(34, 197, 94, 0.15)"
              : r.probability === "Medium"
              ? "rgba(234, 179, 8, 0.15)"
              : "rgba(239, 68, 68, 0.15)";

            const probBorder = r.probability === "Very High" || r.probability === "High"
              ? "rgba(34, 197, 94, 0.3)"
              : r.probability === "Medium"
              ? "rgba(234, 179, 8, 0.3)"
              : "rgba(239, 68, 68, 0.3)";

            return (
              <div key={idx} className="col-12 col-lg-6">
                <div className="premium-table-container p-4 h-100 d-flex flex-column justify-content-between hover-glow transition-all">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h4 className="fw-bold text-white mb-1 font-space-grotesk">{r.player}</h4>
                        <span className="text-muted small fw-semibold text-uppercase font-space-grotesk" style={{ letterSpacing: "0.08em" }}>{r.position}</span>
                      </div>
                      <span
                        className="rounded-pill px-3 py-1 font-space-grotesk fw-bold"
                        style={{
                          fontSize: "10px",
                          background: probBg,
                          color: probColor,
                          border: `1px solid ${probBorder}`,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {r.probability.toUpperCase()} PROBABILITY
                      </span>
                    </div>

                    <div className="row align-items-center my-4 p-3 rounded-3" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div className="col-5 text-center">
                        <span className="text-muted d-block small mb-1">FROM</span>
                        <span className="fw-bold text-white font-space-grotesk">{r.fromClub}</span>
                      </div>
                      <div className="col-2 text-center text-success">
                        <i className="bi bi-arrow-right-circle-fill" style={{ fontSize: "24px" }}></i>
                      </div>
                      <div className="col-5 text-center">
                        <span className="text-muted d-block small mb-1">TO</span>
                        <span className="fw-bold text-white font-space-grotesk">{r.toClub}</span>
                      </div>
                    </div>

                    <p className="text-muted mb-4" style={{ fontSize: "14px", lineHeight: "1.6" }}>{r.summary}</p>
                  </div>

                  <div>
                    <hr className="border-secondary opacity-10 my-3" />
                    <div className="d-flex justify-content-between align-items-center text-muted" style={{ fontSize: "12px" }}>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-tag-fill text-success"></i>
                        <span>Est. Fee: <strong className="text-white font-monospace">{r.fee}</strong></span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-newspaper"></i>
                        <span>Source: <strong className="text-white">{r.source}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
