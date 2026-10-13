"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { cricketApi, mapCricketResult } from "@/lib/cricket-api";
import { mapNflResult, mapSoccerResult, nflApi, soccerApi } from "@/lib/sports-api";

type Result = {
  id?: string;
  league: string;
  home: string;
  homeScore?: string;
  away: string;
  awayScore?: string;
  result: string;
  date: string;
  sport: "Cricket" | "Football" | "NFL";
};

const sportColors: Record<string, string> = { Cricket: "#22c55e", Football: "#3b82f6", NFL: "#f59e0b" };

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "cricket" | "football" | "NFL">("all");
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Results – The SportsVerge";
    let cancelled = false;
    const loadResults = async () => {
      const responses = await Promise.allSettled([
        cricketApi.matches("result"),
        soccerApi.matches("result"),
        nflApi.matches("result"),
      ]);
      const mapped = responses.flatMap((response, index) => {
        if (response.status !== "fulfilled") return [];
        const mapper = index === 0 ? mapCricketResult : index === 1 ? mapSoccerResult : mapNflResult;
        return response.value.map((raw) => {
          const result = mapper(raw);
          return { ...result, sport: index === 0 ? "Cricket" : index === 1 ? "Football" : "NFL" } as Result;
        });
      });
      if (!cancelled) {
        setResults(mapped);
        setError(responses.every((response) => response.status === "rejected") ? "Unable to load results from the sports providers." : null);
      }
    };
    void loadResults();
    return () => { cancelled = true; };
  }, []);

  const filteredResults = activeTab === "all" ? results : results.filter((result) => result.sport.toLowerCase() === activeTab.toLowerCase());
  const getMatchLink = (sport: string, id?: string) => {
    if (!id) return "/live-scores";
    const normalizedSport = sport.toLowerCase();
    return `/live-scores/${id}${normalizedSport === "football" ? "?sport=football" : normalizedSport === "nfl" ? "?sport=nfl" : "?sport=cricket"}`;
  };

  return (
    <main className="font-outfit">
      <PageHeader title="Recent Results" subtitle="Latest completed match results across all sports." className="mb-5" />
      <section className="py-2">
        <div className="container custom-container">
          <ul className="nav nav-pills custom-tabs mb-4 flex-nowrap overflow-x-auto scrollbar-none gap-2">
            {(["all", "cricket", "football", "NFL"] as const).map((tab) => (
              <li className="nav-item" key={tab}>
                <button className={`nav-link text-capitalize ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
              </li>
            ))}
          </ul>
          <div className="d-flex flex-column gap-3">
            {filteredResults.length === 0 ? (
              <div className="text-center py-5 rounded-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                <i className="bi bi-calendar2-x text-muted fs-2 mb-3 d-block"></i>
                <h6 className="text-light">{error || `No recent results found for ${activeTab}`}</h6>
              </div>
            ) : filteredResults.map((result, index) => {
              const color = sportColors[result.sport];
              return (
                <Link key={`${result.sport}-${result.id || "result"}-${index}`} href={getMatchLink(result.sport, result.id)} className="rounded-4 p-4 d-block text-decoration-none" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2 gap-sm-3 flex-grow-1 w-100">
                      <span className="badge rounded-pill px-3 py-1 fw-semibold" style={{ fontSize: "10px", background: `${color}15`, color, border: `1px solid ${color}30` }}>{result.sport}</span>
                      <div className="w-100 flex-grow-1">
                        <div className="text-muted mb-1" style={{ fontSize: "11px" }}>{result.league} · {result.date}</div>
                        <div className="d-flex align-items-center gap-3 flex-wrap">
                          <span className="fw-semibold text-white" style={{ fontSize: "14px" }}>{result.home}</span>
                          <span className="fw-bold font-space-grotesk" style={{ fontSize: "16px", color }}>{result.homeScore || "—"}</span>
                          <span className="text-muted fw-bold" style={{ fontSize: "13px" }}>vs</span>
                          <span className="fw-bold font-space-grotesk" style={{ fontSize: "16px", color: "#6b7280" }}>{result.awayScore || "—"}</span>
                          <span className="fw-semibold text-muted" style={{ fontSize: "14px" }}>{result.away}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-start text-sm-end w-100 w-sm-auto flex-shrink-0 mt-2 mt-sm-0"><span className="badge rounded-pill px-3 py-1" style={{ fontSize: "11px", background: "rgba(26,140,61,0.15)", color: "#86efac", border: "1px solid rgba(26,140,61,0.3)" }}>✓ {result.result}</span></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
