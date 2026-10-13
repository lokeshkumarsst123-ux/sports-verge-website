"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FixtureItem } from "@/types";
import { useFavorites } from "@/components/FavoritesContext";
import { cricketApi, mapCricketFixture } from "@/lib/cricket-api";
import { mapNflFixture, mapSoccerFixture, nflApi, soccerApi } from "@/lib/sports-api";

const mapCricket = (raw: Parameters<typeof mapCricketFixture>[0]): FixtureItem => {
  const fixture = mapCricketFixture(raw);
  return { ...fixture, type: "cricket", date: fixture.date, sport: "Cricket", status: fixture.status };
};

export default function UpcomingFixtures() {
  const [activeTab, setActiveTab] = useState<"all" | "cricket" | "football" | "NFL">("all");
  const [fixtures, setFixtures] = useState<FixtureItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showArrows, setShowArrows] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isFavoriteTeam, isFavoriteCompetition } = useFavorites();

  useEffect(() => {
    let cancelled = false;
    const loadFixtures = async () => {
      const responses = await Promise.allSettled([cricketApi.matches("fixture"), soccerApi.matches("fixture"), nflApi.matches("fixture")]);
      const next = responses.flatMap((response, index) => {
        if (response.status !== "fulfilled") return [];
        const mapper = index === 0 ? mapCricket : index === 1 ? mapSoccerFixture : mapNflFixture;
        return response.value.map(mapper);
      });
      if (!cancelled) {
        setFixtures(next);
        setError(responses.every((response) => response.status === "rejected") ? "Unable to load fixtures from the sports providers." : null);
      }
    };
    void loadFixtures();
    const interval = window.setInterval(() => { void loadFixtures(); }, 60000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, []);

  const filtered = activeTab === "all" ? fixtures : fixtures.filter((fixture) => fixture.type === activeTab);
  const sorted = [...filtered].sort((a, b) => {
    const aFav = isFavoriteTeam(a.home) || isFavoriteTeam(a.away) || isFavoriteCompetition(a.league);
    const bFav = isFavoriteTeam(b.home) || isFavoriteTeam(b.away) || isFavoriteCompetition(b.league);
    return aFav === bFav ? 0 : aFav ? -1 : 1;
  });
  const getMatchLink = (fixture: FixtureItem) => {
    if (!fixture.id) return "/live-scores";
    const sport = String(fixture.type || fixture.sport || "").toLowerCase();
    return `/live-scores/${fixture.id}${sport === "football" ? "?sport=football" : sport === "nfl" ? "?sport=nfl" : "?sport=cricket"}`;
  };
  const checkForOverflow = () => {
    if (scrollRef.current) setShowArrows(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      checkForOverflow();
      if (sorted.length > 3) setShowArrows(true);
    }, 100);
    window.addEventListener("resize", checkForOverflow);
    return () => { clearTimeout(timer); window.removeEventListener("resize", checkForOverflow); };
  }, [sorted.length]);

  return (
    <section className="fixtures-section bg-card rounded-3 border border-dark p-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4"><h2 className="h5 m-0 fw-semibold border-start border-success border-3 ps-2">Upcoming Fixtures</h2><Link href="/fixtures" className="text-success text-decoration-none small fw-semibold">View All <i className="bi bi-chevron-right"></i></Link></div>
      <ul className="nav nav-pills custom-tabs mb-4 flex-nowrap overflow-x-auto scrollbar-none gap-2">
        {(["all", "cricket", "football", "NFL"] as const).map((tab) => <li className="nav-item" key={tab}><button className={`nav-link text-capitalize ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button></li>)}
      </ul>
      <div className="position-relative">
        {showArrows && <button className="slider-arrow arrow-left d-none d-md-flex align-items-center justify-content-center" onClick={() => scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" })} aria-label="Scroll left"><i className="bi bi-chevron-left"></i></button>}
        <div ref={scrollRef} className="fixtures-scroll-container d-flex gap-3 overflow-auto">
          {sorted.length ? sorted.map((match, index) => <Link href={getMatchLink(match)} key={`${match.type}-${match.id || "match"}-${index}`} className="fixture-card flex-shrink-0 rounded-3 border border-dark p-3 text-decoration-none">
            <div className="d-flex justify-content-between align-items-center mb-3"><span className="text-muted small text-truncate" style={{ maxWidth: "160px" }}>{match.league}</span></div>
            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
              {[{ name: match.home, logo: match.homeLogo }, { name: match.away, logo: match.awayLogo }].map((team, teamIndex) => <React.Fragment key={`${match.id || index}-team-${teamIndex}-${team.name}`}><div className="text-center" style={{ width: "80px" }}><Image src={team.logo} width={34} height={34} alt={team.name} className="object-fit-contain" /><div className="small fw-semibold text-light mt-2 text-truncate">{team.name}</div></div>{teamIndex === 0 && <div className="small text-muted">VS</div>}</React.Fragment>)}
            </div>
            <div className="text-center"><div className="small text-light">{match.day}</div><div className="fw-bold text-light">{match.time}</div><div className="text-muted fs-11 text-truncate">{match.venue}</div></div>
          </Link>) : <div className="text-center text-muted w-100 py-4 small">{error || "No upcoming fixtures for this category."}</div>}
        </div>
        {showArrows && <button className="slider-arrow arrow-right d-none d-md-flex align-items-center justify-content-center" onClick={() => scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" })} aria-label="Scroll right"><i className="bi bi-chevron-right"></i></button>}
      </div>
    </section>
  );
}
