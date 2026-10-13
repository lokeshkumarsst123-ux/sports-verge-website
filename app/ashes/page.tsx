"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { cricketApi, findCricketCompetition, mapCricketFixture } from "@/lib/cricket-api";

export default function AshesPage() {
  const [activeTab, setActiveTab] = useState<"matches" | "stats" | "history">("matches");
  const [competitionId, setCompetitionId] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [matchPage, setMatchPage] = useState(1);
  const [matchTotalPages, setMatchTotalPages] = useState(1);
  const [matchTotalItems, setMatchTotalItems] = useState(0);
  const [matchLoading, setMatchLoading] = useState(false);
  const [battingStats, setBattingStats] = useState<any[]>([]);
  const [bowlingStats, setBowlingStats] = useState<any[]>([]);
  const [competitionTitle, setCompetitionTitle] = useState("The Ashes");
  const [hasCompetition, setHasCompetition] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      {error && <div className="container custom-container mb-4"><div className="alert alert-warning mb-0">{error}</div></div>}

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
          <>
          <div className="d-flex flex-column gap-4">
            {schedule.length ? schedule.map((m, idx) => (
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
            )) : <div className="text-center text-muted py-5">{loading ? "Loading Ashes data…" : "No Ashes schedule available from Entity Sports."}</div>}
          </div>
          {matchTotalPages > 1 && (
            <div className="ranking-pagination mt-4">
              <button type="button" disabled={matchPage <= 1 || matchLoading} onClick={() => setMatchPage((page) => Math.max(1, page - 1))}>Previous</button>
              <span>Page {matchPage} of {matchTotalPages}</span>
              <button type="button" disabled={matchPage >= matchTotalPages || matchLoading} onClick={() => setMatchPage((page) => Math.min(matchTotalPages, page + 1))}>Next</button>
            </div>
          )}
          <div className="ranking-pagination-summary mt-2">
            Showing {matchTotalItems ? ((matchPage - 1) * 9) + 1 : 0}-{Math.min(matchPage * 9, matchTotalItems)} of {matchTotalItems} matches
          </div>
          </>
        )}

        {activeTab === "stats" && hasCompetition && (
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
                      {battingStats.length ? battingStats.map((p) => (
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
                      )) : <tr><td colSpan={5} className="text-center text-muted py-4">No batting statistics available from Entity Sports.</td></tr>}
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
                      {bowlingStats.length ? bowlingStats.map((p) => (
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
                      )) : <tr><td colSpan={5} className="text-center text-muted py-4">No bowling statistics available from Entity Sports.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && !hasCompetition && (
          <div className="premium-table-container p-5 text-center text-muted">Ashes statistics are not available from Entity Sports.</div>
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
