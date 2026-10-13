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
    <section className="results-section bg-card rounded-3 p-4 border border-dark mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"><h2 className="h5 m-0 fw-semibold border-start border-3 border-success ps-2">Recent Results</h2><Link href="/results" className="text-success text-decoration-none small fw-semibold">View All <i className="bi bi-chevron-right"></i></Link></div>
      <ul className="nav nav-pills mb-3 custom-tabs flex-nowrap overflow-x-auto scrollbar-none gap-2">{(["all", "cricket", "football", "NFL"] as const).map((tab) => <li className="nav-item" key={tab}><button className={`nav-link text-capitalize ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button></li>)}</ul>
      <div className="position-relative">
        {showArrows && <button className="slider-arrow arrow-left d-none d-md-flex align-items-center justify-content-center" onClick={() => scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" })} aria-label="Scroll left"><i className="bi bi-chevron-left"></i></button>}
        <div ref={scrollRef} className="fixtures-scroll-container d-flex gap-3 pb-2">
          {sorted.length ? sorted.slice(0, 5).map((item, index) => <Link key={`${item.type}-${item.id || "result"}-${index}`} href={getMatchLink(item)} className="fixture-card d-block text-decoration-none flex-shrink-0 rounded-3 p-3 border border-dark position-relative">
            <div className="d-flex justify-content-between align-items-center mb-3"><span className="text-muted small text-truncate" style={{ maxWidth: "160px" }}>{item.league}</span></div>
            <div className="d-flex justify-content-between align-items-center mb-3 px-1">{[{ name: item.home, logo: item.homeLogo, score: item.homeScore }, { name: item.away, logo: item.awayLogo, score: item.awayScore }].map((team, teamIndex) => <div key={`${item.id || index}-team-${teamIndex}-${team.name}`} className="text-center"><Image src={team.logo} alt={team.name} width={34} height={34} /><div className="small fw-semibold text-light mt-1 fs-11">{team.name}</div><div className="fw-bold text-light">{team.score || "—"}</div></div>)}<span className="text-muted fw-bold">VS</span></div>
            <div className="text-center mt-auto"><div className="small text-success mb-2">{item.result}</div><div className="text-muted small">{item.date}</div></div>
          </Link>) : <div className="text-center text-muted w-100 py-4 small">{error || "No recent results for this category."}</div>}
        </div>
        {showArrows && <button className="slider-arrow arrow-right d-none d-md-flex align-items-center justify-content-center" onClick={() => scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" })} aria-label="Scroll right"><i className="bi bi-chevron-right"></i></button>}
      </div>
    </section>
  );
}
