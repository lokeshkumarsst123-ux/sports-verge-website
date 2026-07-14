import React from "react";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Results – The SportsVerge" };

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
  return (
    <main className="min-vh-100 font-outfit" style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "40px 0 80px 0" }}>
      <PageHeader
        title="Recent Results"
        subtitle="Latest completed match results across all sports."
        className="mb-5"
      />

      <section className="py-2">
        <div className="container custom-container">
          <div className="d-flex flex-column gap-3">
            {results.map((r, i) => {
              const color = sportColors[r.sport] || "#22c55e";
              return (
                <div key={i} className="rounded-4 p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3 flex-grow-1">
                      <span className="badge rounded-pill px-3 py-1 fw-semibold flex-shrink-0" style={{ fontSize: "10px", background: `${color}15`, color: color, border: `1px solid ${color}30` }}>
                        {r.sport}
                      </span>
                      <div>
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
                    <div className="text-end flex-shrink-0">
                      <span className="badge rounded-pill px-3 py-1" style={{ fontSize: "11px", background: "rgba(26,140,61,0.15)", color: "#86efac", border: "1px solid rgba(26,140,61,0.3)" }}>
                        ✓ {r.result}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
