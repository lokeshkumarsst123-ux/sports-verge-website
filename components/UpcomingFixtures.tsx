"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FixtureItem } from "@/types";
import { upcomingFixtures } from "@/data/mockData";
import { useFavorites } from "@/components/FavoritesContext";

export default function UpcomingFixtures() {
  const [activeTab, setActiveTab] = useState<"all" | "cricket" | "football" | "NFL" | "AFL">("all");
  const [showArrows, setShowArrows] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isFavoriteTeam, isFavoriteCompetition } = useFavorites();

  const getMatchLink = (match: FixtureItem) => {
    if (match.id) return `/live-scores/${match.id}`;
    if (match.type === "football") return "/live-scores/match-2";
    if (match.type === "NFL") return "/live-scores/match-3";
    return "/live-scores/match-1";
  };

  const filteredFixtures = activeTab === "all"
    ? upcomingFixtures
    : upcomingFixtures.filter((fixture) => fixture.type === activeTab);

  // Prioritize fixtures involving favorite teams or competitions
  const sortedFixtures = [...filteredFixtures].sort((a, b) => {
    const aFav = isFavoriteTeam(a.home) || isFavoriteTeam(a.away) || isFavoriteCompetition(a.league);
    const bFav = isFavoriteTeam(b.home) || isFavoriteTeam(b.away) || isFavoriteCompetition(b.league);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  const checkForOverflow = () => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      setShowArrows(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkForOverflow, 100);
    window.addEventListener("resize", checkForOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkForOverflow);
    };
  }, [sortedFixtures]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340; // width of card + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="fixtures-section bg-card rounded-3 border border-dark p-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h5 m-0 fw-semibold border-start border-success border-3 ps-2">
          Upcoming Fixtures
        </h2>
        <Link href="/live-scores" className="text-success text-decoration-none small fw-semibold d-inline-flex align-items-center gap-1 hover-opacity">
          View All <i className="bi bi-chevron-right fs-08em"></i>
        </Link>
      </div>

      <ul className="nav nav-pills custom-tabs mb-4 flex-nowrap gap-2">
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

      <div className="position-relative">
        {/* Left Arrow */}
        {showArrows && (
          <button
            className="slider-arrow arrow-left d-none d-md-flex align-items-center justify-content-center"
            onClick={() => handleScroll("left")}
            aria-label="Scroll Left"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
        )}

        <div
          ref={scrollRef}
          className="fixtures-scroll-container d-flex gap-3 overflow-auto"
        >
          {sortedFixtures.length > 0 ? (
            sortedFixtures.map((match: FixtureItem, index: number) => {
              const isMatchFav = isFavoriteTeam(match.home) || isFavoriteTeam(match.away) || isFavoriteCompetition(match.league);

              return (
                <Link
                  href={getMatchLink(match)}
                  key={index}
                  className={`fixture-card flex-shrink-0 rounded-3 border p-3 text-decoration-none position-relative ${isMatchFav ? "border-warning border-opacity-50" : "border-dark"}`}
                  style={isMatchFav ? { background: "linear-gradient(180deg, rgba(255, 193, 7, 0.05) 0%, rgba(20, 20, 20, 0.4) 100%)" } : {}}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted small text-truncate" style={{ maxWidth: "160px" }}>{match.league}</span>
                    {isMatchFav && (
                      <span className="badge bg-warning text-dark px-2 py-1 rounded-pill fs-10 fw-bold d-flex align-items-center gap-1">
                        <i className="bi bi-star-fill text-dark fs-10"></i> FAV
                      </span>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                    <div className="text-center" style={{ width: "80px" }}>
                      <Image
                        src={match.homeLogo}
                        width={34}
                        height={34}
                        alt={match.home}
                        className="object-fit-contain"
                      />
                      <div className="small fw-semibold text-light mt-2 text-truncate">
                        {match.home}
                      </div>
                    </div>

                    <div className="small text-muted">VS</div>

                    <div className="text-center" style={{ width: "80px" }}>
                      <Image
                        src={match.awayLogo}
                        width={34}
                        height={34}
                        alt={match.away}
                        className="object-fit-contain"
                      />
                      <div className="small fw-semibold text-light mt-2 text-truncate">
                        {match.away}
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="small text-light">{match.day}</div>
                    <div className="fw-bold text-light">{match.time}</div>
                    <div className="text-muted fs-11 text-truncate">
                      {match.venue}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center text-muted w-100 py-4 small">
              No upcoming fixtures for this category.
            </div>
          )}
        </div>

        {/* Right Arrow */}
        {showArrows && (
          <button
            className="slider-arrow arrow-right d-none d-md-flex align-items-center justify-content-center"
            onClick={() => handleScroll("right")}
            aria-label="Scroll Right"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        )}
      </div>
    </section>
  );
}