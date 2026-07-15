"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

const results = [
  { league: "IPL 2026", home: "CSK", homeScore: "185/4", away: "RCB", awayScore: "174/9", result: "CSK won by 11 runs", sport: "Cricket", date: "06 Jul 2026", status: "completed" },
  { league: "Premier League", home: "Arsenal", homeScore: "2", away: "Man City", awayScore: "1", result: "Arsenal won", sport: "Football", date: "06 Jul 2026", status: "completed" },
  { league: "NFL Regular Season", home: "Kansas City Chiefs", homeScore: "27", away: "Buffalo Bills", awayScore: "20", result: "Chiefs won", sport: "NFL", date: "05 Jul 2026", status: "completed" },
  { league: "AFL Round 16", home: "Carlton Blues", homeScore: "95", away: "Richmond Tigers", awayScore: "90", result: "Blues won by 5 pts", sport: "AFL", date: "05 Jul 2026", status: "completed" },
  { league: "Test Series", home: "England", homeScore: "320/7", away: "West Indies", awayScore: "278 all out", result: "England won by 42 runs", sport: "Cricket", date: "04 Jul 2026", status: "completed" },
  { league: "Champions League", home: "Liverpool", homeScore: "3", away: "Aston Villa", awayScore: "1", result: "Liverpool won", sport: "Football", date: "04 Jul 2026", status: "completed" },
];

const sportColors: Record<string, string> = { Cricket: "#22c55e", Football: "#3b82f6", NFL: "#f59e0b", AFL: "#ec4899" };

export default function ResultsPage() {
  useEffect(() => {
    document.title = "Results – The SportsVerge";
  }, []);
  const [activeTab, setActiveTab] = useState<"all" | "cricket" | "football" | "NFL" | "AFL">("all");

  const filteredResults = activeTab === "all"
    ? results
    : results.filter(r => r.sport.toLowerCase() === activeTab.toLowerCase());

  const getMatchLink = (sport: string) => {
    const s = sport.toLowerCase();
    if (s === "football") return "/live-scores/match-2";
    if (s === "nfl") return "/live-scores/match-3";
    if (s === "afl") return "/live-scores/match-4";
    return "/live-scores/match-1";
  };

  return (
    <main className="font-outfit">
      <PageHeader
        title="Recent Results"
        subtitle="Latest completed match results across all sports."
        className="mb-5"
      />

      <section className="py-2">
        <div className="container custom-container">
          <ul className="nav nav-pills custom-tabs mb-4 flex-nowrap overflow-x-auto scrollbar-none gap-2">
            {(["all", "cricket", "football", "NFL", "AFL"] as const).map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link text-capitalize ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>

          <div className="d-flex flex-column gap-3">
            {filteredResults.length === 0 ? (
              <div className="text-center py-5 rounded-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                <i className="bi bi-calendar2-x text-muted fs-2 mb-3 d-block"></i>
                <h6 className="text-light">No recent results found for {activeTab}</h6>
              </div>
            ) : (
              filteredResults.map((r, i) => {
                const color = sportColors[r.sport] || "#22c55e";
                return (
                  <Link 
                    key={i} 
                    href={getMatchLink(r.sport)}
                    className="rounded-4 p-4 d-block text-decoration-none" 
                    style={{ 
                      background: "var(--bg-card)", 
                      border: "1px solid var(--border-dark)",
                      transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-success)";
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-dark)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2 gap-sm-3 flex-grow-1 w-100">
                        <span className="badge rounded-pill px-3 py-1 fw-semibold flex-shrink-0 mb-1 mb-sm-0" style={{ fontSize: "10px", background: `${color}15`, color: color, border: `1px solid ${color}30` }}>
                          {r.sport}
                        </span>
                        <div className="w-100 flex-grow-1">
                          <div className="text-muted mb-1" style={{ fontSize: "11px" }}>{r.league} · {r.date}</div>
                          <div className="d-flex align-items-center gap-3 flex-wrap">
                            <span className="fw-semibold text-white" style={{ fontSize: "14px" }}>{r.home}</span>
                            <span className="fw-bold font-space-grotesk" style={{ fontSize: "16px", color }}>{r.homeScore}</span>
                            <span className="text-muted fw-bold" style={{ fontSize: "13px" }}>vs</span>
                            <span className="fw-bold font-space-grotesk" style={{ fontSize: "16px", color: "#6b7280" }}>{r.awayScore}</span>
                            <span className="fw-semibold text-muted" style={{ fontSize: "14px" }}>{r.away}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-start text-sm-end w-100 w-sm-auto flex-shrink-0 mt-2 mt-sm-0">
                        <span className="badge rounded-pill px-3 py-1" style={{ fontSize: "11px", background: "rgba(26,140,61,0.15)", color: "#86efac", border: "1px solid rgba(26,140,61,0.3)" }}>
                          ✓ {r.result}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
