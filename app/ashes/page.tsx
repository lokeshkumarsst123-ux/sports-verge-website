"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { cricketApi, findCricketCompetition, mapCricketFixture } from "@/lib/cricket-api";

import { USE_STATIC_MOCK, MOCK_ASHES_MATCHES, MOCK_ASHES_BATTING, MOCK_ASHES_BOWLING } from "@/lib/mock-data";

export default function AshesPage() {
  const [activeTab, setActiveTab] = useState<"matches" | "stats" | "history">("matches");
  const [competitionId, setCompetitionId] = useState<string | null>(USE_STATIC_MOCK ? "ashes-series" : null);
  const [schedule, setSchedule] = useState<any[]>(USE_STATIC_MOCK ? MOCK_ASHES_MATCHES : []);
  const [matchPage, setMatchPage] = useState(1);
  const [matchTotalPages, setMatchTotalPages] = useState(USE_STATIC_MOCK ? 1 : 1);
  const [matchTotalItems, setMatchTotalItems] = useState(USE_STATIC_MOCK ? MOCK_ASHES_MATCHES.length : 0);
  const [matchLoading, setMatchLoading] = useState(false);
  const [battingStats, setBattingStats] = useState<any[]>(USE_STATIC_MOCK ? MOCK_ASHES_BATTING : []);
  const [bowlingStats, setBowlingStats] = useState<any[]>(USE_STATIC_MOCK ? MOCK_ASHES_BOWLING : []);
  const [competitionTitle, setCompetitionTitle] = useState("The Ashes");
  const [hasCompetition, setHasCompetition] = useState(USE_STATIC_MOCK);
  const [loading, setLoading] = useState(!USE_STATIC_MOCK);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_STATIC_MOCK) {
      setCompetitionTitle("The Ashes");
      setCompetitionId("ashes-series");
      setHasCompetition(true);
      setBattingStats(MOCK_ASHES_BATTING);
      setBowlingStats(MOCK_ASHES_BOWLING);
      setSchedule(MOCK_ASHES_MATCHES);
      setMatchTotalPages(1);
      setMatchTotalItems(MOCK_ASHES_MATCHES.length);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const loadCompetition = async () => {
      try {
        const competitions = await cricketApi.competitionsAll();
        const competition = findCricketCompetition(competitions, ["the ashes", "ashes"]);
        if (!competition?.cid) {
          if (!cancelled) setError("The Ashes is not available in the current Entity Sports competition feed.");
          return;
        }
        const [info, batting, bowling] = await Promise.all([
          cricketApi.competition(String(competition.cid)),
          cricketApi.competitionStats(String(competition.cid), "batting_most_runs"),
          cricketApi.competitionStats(String(competition.cid), "bowling_top_wicket_takers"),
        ]);
        const toStats = (data: any) => Array.isArray(data?.stats) ? data.stats : [];
        const mapBatting = toStats(batting).map((item: any, index: number) => ({
          rank: index + 1,
          player: item.player?.title || item.player?.short_name || "Unknown player",
          team: item.team?.title || item.team?.name || "Unknown team",
          runs: item.runs ?? "—",
          avg: item.average ?? "—",
          hs: item.highest ?? "—",
        }));
        const mapBowling = toStats(bowling).map((item: any, index: number) => ({
          rank: index + 1,
          player: item.player?.title || item.player?.short_name || "Unknown player",
          team: item.team?.title || item.team?.name || "Unknown team",
          wickets: item.wickets ?? "—",
          avg: item.average ?? "—",
          econ: item.econ ?? "—",
        }));
        if (!cancelled) {
          setCompetitionTitle(competition.title || "The Ashes");
          setCompetitionId(String(competition.cid));
          setHasCompetition(true);
          setBattingStats(mapBatting);
          setBowlingStats(mapBowling);
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Unable to load Ashes data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void loadCompetition();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (USE_STATIC_MOCK) {
      setSchedule(MOCK_ASHES_MATCHES);
      setMatchTotalPages(1);
      setMatchTotalItems(MOCK_ASHES_MATCHES.length);
      setMatchLoading(false);
      return;
    }

    if (!competitionId || activeTab !== "matches") return;
    let cancelled = false;
    const loadMatches = async () => {
      setMatchLoading(true);
      setError(null);
      try {
        const page = await cricketApi.competitionMatchesPage(competitionId, matchPage);
        const mappedSchedule = page.items.map((item: any, index: number) => {
          const fixture = mapCricketFixture(item);
          const teamA = String(item.teama?.name || "").toLowerCase();
          const scoreA = item.teama?.scores_full || item.teama?.scores || "";
          const scoreB = item.teamb?.scores_full || item.teamb?.scores || "";
          return {
            test: item.subtitle || `Test ${(page.page - 1) * 9 + index + 1}`,
            date: fixture.date,
            venue: fixture.venue,
            status: fixture.status === "completed" ? "Completed" : fixture.status === "live" ? "Live" : "Upcoming",
            scoreAus: teamA.includes("australia") ? scoreA : scoreB,
            scoreEng: teamA.includes("england") ? scoreA : scoreB,
            result: item.result || item.status_note,
          };
        });
        if (!cancelled) {
          setSchedule(mappedSchedule);
          setMatchTotalPages(page.totalPages);
          setMatchTotalItems(page.totalItems);
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Unable to load Ashes matches.");
      } finally {
        if (!cancelled) setMatchLoading(false);
      }
    };
    void loadMatches();
    return () => { cancelled = true; };
  }, [activeTab, competitionId, matchPage]);

  useEffect(() => {
    setMatchPage(1);
  }, [activeTab]);

  return (
    <main className="font-outfit">
      <PageHeader
        title={competitionTitle}
        subtitle="Australia vs England Test Series match schedules, stats leaders, results, and team news."
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
          {(["matches", "stats", "history"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="btn text-capitalize fw-bold rounded-pill px-4 py-2 transition-all shadow-none"
                style={{
                  fontSize: "14px",
                  backgroundColor: isActive ? "#FFCC00" : "#FAF6EF",
                  color: isActive ? "#1C1F22" : "#4B5563",
                  borderColor: isActive ? "#FFCC00" : "#EAE5DC",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="container custom-container">
        {activeTab === "matches" && (
          <>
            <div className="d-flex flex-column gap-3">
              {schedule.length ? schedule.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-4 p-4 shadow-sm"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #EAE5DC",
                  }}
                >
                  <div className="row align-items-center">
                    <div className="col-md-3 mb-3 mb-md-0">
                      <span className="fw-bold font-space-grotesk text-warning" style={{ fontSize: "12px", letterSpacing: "0.08em" }}>
                        {m.test.toUpperCase()}
                      </span>
                      <h5 className="fw-bold mb-1 mt-1" style={{ fontSize: "15px", color: "#1C1F22" }}>
                        {m.venue}
                      </h5>
                      <span className="small" style={{ color: "#64748B" }}>{m.date}</span>
                    </div>

                    <div className="col-md-6 my-3 my-md-0 border-start border-end border-secondary border-opacity-10 px-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src="/assets/imgs/teams/australia.webp"
                            alt="Australia"
                            style={{ width: "22px", height: "16px", objectFit: "cover", borderRadius: "3px" }}
                          />
                          <span className="fw-semibold" style={{ color: "#1C1F22" }}>Australia</span>
                        </div>
                        <span className="font-monospace fw-bold" style={{ color: "#1C1F22" }}>{m.scoreAus}</span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src="/assets/imgs/teams/england.webp"
                            alt="England"
                            style={{ width: "22px", height: "16px", objectFit: "cover", borderRadius: "3px" }}
                          />
                          <span className="fw-semibold" style={{ color: "#1C1F22" }}>England</span>
                        </div>
                        <span className="font-monospace fw-bold" style={{ color: "#1C1F22" }}>{m.scoreEng}</span>
                      </div>
                    </div>

                    <div className="col-md-3 text-md-end mt-2 mt-md-0">
                      <div
                        className="d-inline-block rounded-pill px-3 py-1 font-space-grotesk fw-bold mb-2"
                        style={{
                          fontSize: "11px",
                          backgroundColor: m.status === "Completed" ? "rgba(100, 116, 139, 0.12)" : "rgba(22, 163, 74, 0.12)",
                          color: m.status === "Completed" ? "#475569" : "#15803d",
                          border: m.status === "Completed" ? "1px solid rgba(100, 116, 139, 0.25)" : "1px solid rgba(22, 163, 74, 0.3)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {m.status.toUpperCase()}
                      </div>
                      <p className="fw-semibold mb-0" style={{ fontSize: "13px", color: "#1C1F22" }}>
                        {m.result}
                      </p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center text-muted py-5">
                  {loading ? "Loading Ashes data…" : "No Ashes schedule available from Entity Sports."}
                </div>
              )}
            </div>
            {matchTotalPages > 1 && (
              <div className="ranking-pagination mt-4">
                <button type="button" disabled={matchPage <= 1 || matchLoading} onClick={() => setMatchPage((page) => Math.max(1, page - 1))}>Previous</button>
                <span>Page {matchPage} of {matchTotalPages}</span>
                <button type="button" disabled={matchPage >= matchTotalPages || matchLoading} onClick={() => setMatchPage((page) => Math.min(matchTotalPages, page + 1))}>Next</button>
              </div>
            )}
            <div className="ranking-pagination-summary mt-2" style={{ color: "#64748B" }}>
              Showing {matchTotalItems ? ((matchPage - 1) * 9) + 1 : 0}-{Math.min(matchPage * 9, matchTotalItems)} of {matchTotalItems} matches
            </div>
          </>
        )}

        {activeTab === "stats" && hasCompetition && (
          <div className="row g-4">
            <div className="col-lg-6">
              <h5 className="fw-bold mb-3 font-space-grotesk" style={{ color: "#1C1F22" }}>Most Runs</h5>
              <div
                className="rounded-4 overflow-hidden shadow-sm"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #EAE5DC" }}
              >
                <div className="table-responsive">
                  <table className="table mb-0 align-middle">
                    <thead style={{ backgroundColor: "#FAF6EF" }}>
                      <tr>
                        <th className="text-start px-3 py-3" style={{ width: "60px", color: "#64748B", fontSize: "12px" }}>RANK</th>
                        <th className="text-start py-3" style={{ color: "#64748B", fontSize: "12px" }}>PLAYER</th>
                        <th className="text-center py-3" style={{ color: "#64748B", fontSize: "12px" }}>RUNS</th>
                        <th className="text-center py-3" style={{ color: "#64748B", fontSize: "12px" }}>AVG</th>
                        <th className="text-center py-3" style={{ color: "#64748B", fontSize: "12px" }}>HS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {battingStats.length ? battingStats.map((p) => (
                        <tr key={p.rank} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td className="text-start px-3 py-3 fw-bold" style={{ color: "#15803d" }}>#{p.rank}</td>
                          <td className="text-start py-3">
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={p.team === "Australia" ? "/assets/imgs/teams/australia.webp" : "/assets/imgs/teams/england.webp"}
                                alt={p.team}
                                style={{ width: "20px", height: "14px", objectFit: "cover", borderRadius: "2px" }}
                              />
                              <span className="fw-semibold" style={{ color: "#1C1F22" }}>{p.player}</span>
                            </div>
                          </td>
                          <td className="text-center py-3 fw-bold" style={{ color: "#1C1F22" }}>{p.runs}</td>
                          <td className="text-center py-3" style={{ color: "#64748B" }}>{p.avg}</td>
                          <td className="text-center py-3" style={{ color: "#64748B" }}>{p.hs}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4">No batting statistics available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <h5 className="fw-bold mb-3 font-space-grotesk" style={{ color: "#1C1F22" }}>Most Wickets</h5>
              <div
                className="rounded-4 overflow-hidden shadow-sm"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #EAE5DC" }}
              >
                <div className="table-responsive">
                  <table className="table mb-0 align-middle">
                    <thead style={{ backgroundColor: "#FAF6EF" }}>
                      <tr>
                        <th className="text-start px-3 py-3" style={{ width: "60px", color: "#64748B", fontSize: "12px" }}>RANK</th>
                        <th className="text-start py-3" style={{ color: "#64748B", fontSize: "12px" }}>PLAYER</th>
                        <th className="text-center py-3" style={{ color: "#64748B", fontSize: "12px" }}>WKTS</th>
                        <th className="text-center py-3" style={{ color: "#64748B", fontSize: "12px" }}>AVG</th>
                        <th className="text-center py-3" style={{ color: "#64748B", fontSize: "12px" }}>ECON</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bowlingStats.length ? bowlingStats.map((p) => (
                        <tr key={p.rank} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td className="text-start px-3 py-3 fw-bold" style={{ color: "#15803d" }}>#{p.rank}</td>
                          <td className="text-start py-3">
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={p.team === "Australia" ? "/assets/imgs/teams/australia.webp" : "/assets/imgs/teams/england.webp"}
                                alt={p.team}
                                style={{ width: "20px", height: "14px", objectFit: "cover", borderRadius: "2px" }}
                              />
                              <span className="fw-semibold" style={{ color: "#1C1F22" }}>{p.player}</span>
                            </div>
                          </td>
                          <td className="text-center py-3 fw-bold" style={{ color: "#1C1F22" }}>{p.wickets}</td>
                          <td className="text-center py-3" style={{ color: "#64748B" }}>{p.avg}</td>
                          <td className="text-center py-3" style={{ color: "#64748B" }}>{p.econ}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4">No bowling statistics available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && !hasCompetition && (
          <div className="rounded-4 p-5 text-center text-muted shadow-sm" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EAE5DC" }}>
            Ashes statistics are not available from Entity Sports.
          </div>
        )}

        {activeTab === "history" && (
          <div className="rounded-4 p-4 p-md-5 shadow-sm" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EAE5DC" }}>
            <h4 className="fw-bold mb-3 font-space-grotesk" style={{ color: "#1C1F22" }}>The Ashes History &amp; Legacy</h4>
            <p className="lh-lg" style={{ fontSize: "15px", color: "#475569" }}>
              The Ashes is a biennial Test cricket series played between England and Australia. The term originated in a satirical obituary published in a British newspaper, The Sporting Life, immediately after Australia&apos;s 1882 victory at The Oval, its first Test win on English soil. The obituary stated that English cricket had died, and &quot;the body will be cremated and the ashes taken to Australia&quot;.
            </p>
            <p className="lh-lg mb-0" style={{ fontSize: "15px", color: "#475569" }}>
              The English captain Ivo Bligh vowed to &quot;regain those ashes&quot;. During the subsequent tour in Australia, a small terracotta urn, reputedly containing the ashes of a cricket ball, was presented to Bligh by a group of Melbourne women. The series consists of five Test matches, hosted alternately by the two countries.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
