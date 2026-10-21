"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ResultItem } from "@/types";
import { useFavorites } from "@/components/FavoritesContext";
import { cricketApi, mapCricketResult } from "@/lib/cricket-api";
import { mapNflResult, mapSoccerResult, nflApi, soccerApi } from "@/lib/sports-api";

const mapCricket = (raw: Parameters<typeof mapCricketResult>[0]): ResultItem => {
  const result = mapCricketResult(raw);
  return { ...result, type: "cricket", score: `${result.homeScore} - ${result.awayScore}` };
};

export default function RecentResults() {
  const [activeTab, setActiveTab] = useState<"all" | "cricket" | "football" | "NFL">("all");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showArrows, setShowArrows] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isFavoriteTeam, isFavoriteCompetition } = useFavorites();

  useEffect(() => {
    let cancelled = false;
    const loadResults = async () => {
      const responses = await Promise.allSettled([cricketApi.matches("result"), soccerApi.matches("result"), nflApi.matches("result")]);
      const next = responses.flatMap((response, index) => {
        if (response.status !== "fulfilled") return [];
        const mapper = index === 0 ? mapCricket : index === 1 ? mapSoccerResult : mapNflResult;
        return response.value.map(mapper);
      });
      if (!cancelled) {
        setResults(next);
        setError(responses.every((response) => response.status === "rejected") ? "Unable to load results from the sports providers." : null);
      }
    };
    void loadResults();
    return () => { cancelled = true; };
  }, []);

  const filtered = activeTab === "all" ? results : results.filter((result) => result.type === activeTab);
  const sorted = [...filtered].sort((a, b) => {
    const aFav = isFavoriteTeam(a.home) || isFavoriteTeam(a.away) || isFavoriteCompetition(a.league);
    const bFav = isFavoriteTeam(b.home) || isFavoriteTeam(b.away) || isFavoriteCompetition(b.league);
    return aFav === bFav ? 0 : aFav ? -1 : 1;
  });
  const getMatchLink = (result: ResultItem) => {
    if (!result.id) return "/live-scores";
    const sport = String(result.type || "").toLowerCase();
    return `/live-scores/${result.id}${sport === "football" ? "?sport=football" : sport === "nfl" ? "?sport=nfl" : "?sport=cricket"}`;
  };
  const checkForOverflow = () => { if (scrollRef.current) setShowArrows(scrollRef.current.scrollWidth > scrollRef.current.clientWidth); };
  useEffect(() => { const timer = setTimeout(checkForOverflow, 100); window.addEventListener("resize", checkForOverflow); return () => { clearTimeout(timer); window.removeEventListener("resize", checkForOverflow); }; }, [sorted.length]);

  return (
    <section className="results-section bg-card rounded-4 p-4 border mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 className="h5 m-0 fw-bold border-start border-3 ps-2 widget-heading">
          Recent Results
        </h2>
        <Link href="/results" className="small widget-view-all">
          View All <i className="bi bi-chevron-right" />
        </Link>
      </div>
      <ul className="nav nav-pills mb-3 custom-tabs flex-nowrap overflow-x-auto scrollbar-none gap-2">{(["all", "cricket", "football", "NFL"] as const).map((tab) => <li className="nav-item" key={tab}><button className={`nav-link text-capitalize ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button></li>)}</ul>
      <div className="position-relative">
        {showArrows && <button className="slider-arrow arrow-left d-none d-md-flex align-items-center justify-content-center" onClick={() => scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" })} aria-label="Scroll left"><i className="bi bi-chevron-left"></i></button>}
        <div ref={scrollRef} className="fixtures-scroll-container d-flex gap-3 pb-2">
          {sorted.length ? sorted.slice(0, 5).map((item, index) => <Link key={`${item.type}-${item.id || "result"}-${index}`} href={getMatchLink(item)} className="fixture-card fixtures-card-custom d-block text-decoration-none flex-shrink-0 rounded-3 p-3 position-relative shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3"><span className="small text-truncate fw-semibold fixture-league-custom">{item.league}</span></div>
            <div className="d-flex justify-content-between align-items-center mb-3 px-1">{[{ name: item.home, logo: item.homeLogo, score: item.homeScore }, { name: item.away, logo: item.awayLogo, score: item.awayScore }].map((team, teamIndex) => <div key={`${item.id || index}-team-${teamIndex}-${team.name}`} className="text-center"><Image src={team.logo} alt={team.name} width={34} height={34} /><div className="small fw-bold mt-1 fs-11 text-truncate fixture-team-name-custom">{team.name}</div><div className="fw-bold fixture-time-custom">{team.score || "—"}</div></div>)}<span className="fw-bold fixture-vs-custom">VS</span></div>
            <div className="text-center mt-auto"><div className="small mb-1 fw-semibold result-status-custom">{item.result}</div><div className="small result-date-custom">{item.date}</div></div>
          </Link>) : <div className="text-center w-100 py-4 small widget-empty-text">{error || "No recent results for this category."}</div>}
        </div>
        {showArrows && <button className="slider-arrow arrow-right d-none d-md-flex align-items-center justify-content-center" onClick={() => scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" })} aria-label="Scroll right"><i className="bi bi-chevron-right"></i></button>}
      </div>
    </section>
  );
}
