"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { cricketApi, findCricketCompetition, mapCompetitionStandings, mapCricketFixture } from "@/lib/cricket-api";

import { USE_STATIC_MOCK, MOCK_T20_SCHEDULE, MOCK_T20_COMPLETED, MOCK_T20_GROUPS } from "@/lib/mock-data";

export default function T20WorldCupPage() {
  const [activeTab, setActiveTab] = useState<"schedule" | "completed" | "standings">("schedule");
  const [competitionId, setCompetitionId] = useState<string | null>(USE_STATIC_MOCK ? "t20-wc-2026" : null);
  const [competitionStatus, setCompetitionStatus] = useState(USE_STATIC_MOCK ? "live" : "");
  const [schedule, setSchedule] = useState<any[]>(USE_STATIC_MOCK ? MOCK_T20_SCHEDULE.slice(0, 9) : []);
  const [schedulePage, setSchedulePage] = useState(1);
  const [scheduleTotalPages, setScheduleTotalPages] = useState(USE_STATIC_MOCK ? Math.ceil(MOCK_T20_SCHEDULE.length / 9) : 1);
  const [scheduleTotalItems, setScheduleTotalItems] = useState(USE_STATIC_MOCK ? MOCK_T20_SCHEDULE.length : 0);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [groups, setGroups] = useState<any[]>(USE_STATIC_MOCK ? MOCK_T20_GROUPS : []);
  const [competitionTitle, setCompetitionTitle] = useState("T20 World Cup 2026");
  const [loading, setLoading] = useState(!USE_STATIC_MOCK);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_STATIC_MOCK) {
      setCompetitionTitle("T20 World Cup 2026");
      setCompetitionId("t20-wc-2026");
      setCompetitionStatus("live");
      setGroups(MOCK_T20_GROUPS);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const loadCompetition = async () => {
      try {
        const competitions = await cricketApi.competitionsAll();
        const competition = findCricketCompetition(competitions, ["icc men's t20 world cup", "t20 world cup", "world twenty20"], "2026");
        const isRegional = String(competition?.title || competition?.name || "").toLowerCase().includes("regional");
        if (!competition?.cid || isRegional) {
          if (!cancelled) setError("T20 World Cup is not available in the current Entity Sports competition feed.");
          return;
        }
        const info = await cricketApi.competition(String(competition.cid));
        const mappedStandings = mapCompetitionStandings(info);
        if (!cancelled) {
          setCompetitionTitle(competition.title || "T20 World Cup 2026");
          setCompetitionId(String(competition.cid));
          setCompetitionStatus(String(competition.status || "").toLowerCase());
          setGroups(mappedStandings.length ? [{ group: "Competition Standings", teams: mappedStandings.map((row) => ({ name: row.team, logo: row.teamLogo, p: row.p, w: row.w, l: row.l, pts: row.pts, nrr: row.nrr })) }] : []);
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Unable to load T20 World Cup data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void loadCompetition();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (USE_STATIC_MOCK) {
      setScheduleLoading(false);
      setError(null);
      const allItems = activeTab === "completed" ? MOCK_T20_COMPLETED : MOCK_T20_SCHEDULE;
      const pageSize = 9;
      const totalPages = Math.ceil(allItems.length / pageSize) || 1;
      const startIdx = (schedulePage - 1) * pageSize;
      const pageItems = allItems.slice(startIdx, startIdx + pageSize);
      setSchedule(pageItems);
      setScheduleTotalPages(totalPages);
      setScheduleTotalItems(allItems.length);
      return;
    }

    if (!competitionId || !["schedule", "completed"].includes(activeTab)) return;
    if (activeTab === "schedule" && ["result", "completed", "finished"].includes(competitionStatus)) {
      setSchedule([]);
      setScheduleTotalPages(1);
      setScheduleTotalItems(0);
      setScheduleLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    const loadSchedulePage = async () => {
      setScheduleLoading(true);
      setError(null);
      try {
        const page = await cricketApi.competitionMatchesPage(
          competitionId,
          schedulePage,
          activeTab === "completed" ? "2" : "1",
        );
        const mappedSchedule = page.items.map((item: any, index: number) => {
          const fixture = mapCricketFixture(item);
          return {
            match: item.match_number ? `Match ${item.match_number}` : `Match ${(page.page - 1) * 9 + index + 1}`,
            team1: fixture.home,
            team1Logo: fixture.homeLogo,
            team2: fixture.away,
            team2Logo: fixture.awayLogo,
            date: fixture.date,
            time: `${fixture.time} IST`,
            venue: fixture.venue,
            status: fixture.status === "completed" ? "Completed" : fixture.status === "live" ? "Live" : "Upcoming",
            score1: item.teama?.scores_full || item.teama?.scores,
            score2: item.teamb?.scores_full || item.teamb?.scores,
            result: item.result || item.status_note,
          };
        });
        if (!cancelled) {
          setSchedule(mappedSchedule);
          setScheduleTotalPages(page.totalPages);
          setScheduleTotalItems(page.totalItems);
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Unable to load T20 World Cup schedule.");
      } finally {
        if (!cancelled) setScheduleLoading(false);
      }
    };
    void loadSchedulePage();
    return () => { cancelled = true; };
  }, [activeTab, competitionId, competitionStatus, schedulePage]);

  useEffect(() => {
    setSchedulePage(1);
  }, [activeTab]);

  return (
    <main className="font-outfit">
      <PageHeader
        title={competitionTitle}
        subtitle="ICC Men's T20 World Cup tournament schedule, group standings, match highlights, and news."
        className="mb-5"
      />
      {error && !USE_STATIC_MOCK && (
        <div className="container custom-container mb-4">
          <div className="alert alert-warning mb-0">{error}</div>
        </div>
      )}

      {/* Tabs */}
      <div className="container custom-container mb-4">
        <div className="d-flex gap-2 border-bottom border-secondary border-opacity-10 pb-3">
          {([
            { key: "schedule" as const, label: "Schedule" },
            { key: "completed" as const, label: "Completed" },
            { key: "standings" as const, label: "Standings" },
          ]).map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className="btn text-capitalize fw-bold rounded-pill px-4 py-2 transition-all shadow-none"
                style={{
                  fontSize: "14px",
                  backgroundColor: isActive ? "#FFCC00" : "#FAF6EF",
                  color: isActive ? "#1C1F22" : "#4B5563",
                  borderColor: isActive ? "#FFCC00" : "#EAE5DC",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  fontWeight: isActive ? 700 : 600,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="container custom-container">
        {(activeTab === "schedule" || activeTab === "completed") && (
          <>
          <div className="row g-4">
            {schedule.length ? schedule.map((m, idx) => (
              <div key={idx} className="col-md-6 col-lg-4">
                <div
                  className="rounded-4 p-4 h-100 d-flex flex-column justify-content-between"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #EAE5DC",
                    boxShadow: "0 4px 16px rgba(28, 31, 34, 0.04)",
                  }}
                >
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-bold font-space-grotesk text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#15803d" }}>
                        {m.match.toUpperCase()}
                      </span>
                      <span
                        className="rounded-pill px-3 py-1 font-space-grotesk fw-bold"
                        style={{
                          fontSize: "10px",
                          background: m.status === "Completed" ? "#FAF6EF" : "rgba(22, 163, 74, 0.12)",
                          color: m.status === "Completed" ? "#475569" : "#15803d",
                          border: m.status === "Completed" ? "1px solid #EAE5DC" : "1px solid rgba(22, 163, 74, 0.3)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {m.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center my-3">
                      <div className="d-flex align-items-center gap-2">
                        <img src={m.team1Logo} alt={m.team1} style={{ width: "26px", height: "18px", objectFit: "contain", borderRadius: "3px" }} />
                        <span className="fw-bold font-space-grotesk" style={{ fontSize: "15.5px", color: "#1C1F22" }}>{m.team1}</span>
                      </div>
                      {m.score1 && <span className="fw-bold font-monospace fs-6" style={{ color: "#1C1F22" }}>{m.score1}</span>}
                    </div>

                    <div className="d-flex justify-content-between align-items-center my-3">
                      <div className="d-flex align-items-center gap-2">
                        <img src={m.team2Logo} alt={m.team2} style={{ width: "26px", height: "18px", objectFit: "contain", borderRadius: "3px" }} />
                        <span className="fw-bold font-space-grotesk" style={{ fontSize: "15.5px", color: "#1C1F22" }}>{m.team2}</span>
                      </div>
                      {m.score2 && <span className="fw-bold font-monospace fs-6" style={{ color: "#1C1F22" }}>{m.score2}</span>}
                    </div>
                  </div>

                  <hr className="border-secondary opacity-10 my-3" />

                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: "12.5px", color: "#5C646D" }}>
                      <i className="bi bi-calendar-event text-primary"></i>
                      <span>{m.date} · {m.time}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: "12.5px", color: "#5C646D" }}>
                      <i className="bi bi-geo-alt text-danger"></i>
                      <span className="text-truncate">{m.venue}</span>
                    </div>
                    {m.result && (
                      <div className="p-2 rounded-3 text-center fw-semibold font-space-grotesk" style={{ fontSize: "12px", background: "rgba(22, 163, 74, 0.1)", color: "#15803d", border: "1px solid rgba(22, 163, 74, 0.25)" }}>
                        <i className="bi bi-trophy-fill me-1 text-warning"></i>
                        {m.result}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-12 text-center text-muted py-5">
                {loading || scheduleLoading ? "Loading T20 World Cup data…" : activeTab === "completed" ? "No completed T20 World Cup matches available." : "No T20 World Cup schedule available."}
              </div>
            )}
          </div>
          {scheduleTotalPages > 1 && (
            <div className="ranking-pagination mt-4">
              <button type="button" disabled={schedulePage <= 1 || scheduleLoading} onClick={() => setSchedulePage((page) => Math.max(1, page - 1))}>Previous</button>
              <span>Page {schedulePage} of {scheduleTotalPages}</span>
              <button type="button" disabled={schedulePage >= scheduleTotalPages || scheduleLoading} onClick={() => setSchedulePage((page) => Math.min(scheduleTotalPages, page + 1))}>Next</button>
            </div>
          )}
          <div className="ranking-pagination-summary mt-2">
            Showing {scheduleTotalItems ? ((schedulePage - 1) * 9) + 1 : 0}-{Math.min(schedulePage * 9, scheduleTotalItems)} of {scheduleTotalItems} {activeTab === "completed" ? "completed matches" : "matches"}
          </div>
          </>
        )}

        {activeTab === "standings" && (
          <div className="d-flex flex-column gap-5">
            {groups.length ? groups.map((group, gIdx) => (
              <div key={gIdx}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="d-inline-block rounded" style={{ width: "4px", height: "20px", background: "#FFCC00" }}></span>
                  <h5 className="fw-bold mb-0 font-space-grotesk" style={{ fontSize: "17px", color: "#1C1F22" }}>{group.group}</h5>
                </div>

                <div className="rounded-4 p-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
                  <div className="table-responsive">
                    <table className="premium-table w-100">
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
                        {group.teams.map((row: any, idx: number) => (
                          <tr key={idx}>
                            <td className="premium-table-rank text-start fw-bold" style={{ color: idx < 2 ? "#15803d" : "#5C646D" }}>#{idx + 1}</td>
                            <td className="premium-table-team text-start">
                              <div className="d-flex align-items-center gap-2">
                                <img src={row.logo} alt={row.name} style={{ width: "24px", height: "18px", objectFit: "contain", borderRadius: "3px" }} />
                                <span className="fw-semibold" style={{ color: "#1C1F22" }}>{row.name}</span>
                              </div>
                            </td>
                            <td className="premium-table-stat text-center">{row.p}</td>
                            <td className="premium-table-stat text-center text-success fw-bold">{row.w}</td>
                            <td className="premium-table-stat text-center text-danger">{row.l}</td>
                            <td className="premium-table-stat-bold text-center fw-bold" style={{ color: "#1C1F22", fontSize: "15px" }}>{row.pts}</td>
                            <td className="premium-table-stat text-center fw-semibold" style={{ color: row.nrr.startsWith("+") ? "#15803d" : "#DC2626" }}>{row.nrr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )) : <div className="text-center text-muted py-5">No T20 World Cup standings available.</div>}
          </div>
        )}
      </div>
    </main>
  );
}
