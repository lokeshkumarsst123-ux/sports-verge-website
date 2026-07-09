"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FixtureItem } from "@/types";
import { upcomingFixtures } from "@/data/mockData";

export default function UpcomingFixtures() {
  const [activeTab, setActiveTab] = useState<"all" | "cricket" | "football" | "NFL" | "AFL">("all");
  const [showArrows, setShowArrows] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredFixtures = activeTab === "all"
    ? upcomingFixtures
    : upcomingFixtures.filter((fixture) => fixture.type === activeTab);

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
  }, [filteredFixtures]);

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
        <h5 className="m-0 fw-semibold border-start border-success border-3 ps-2">
          Upcoming Fixtures
        </h5>
        <Link href="#" className="text-success text-decoration-none small">
          View All
        </Link>
      </div>

      <ul className="nav nav-pills custom-tabs mb-4">
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
          {filteredFixtures.length > 0 ? (
            filteredFixtures.map((match: FixtureItem, index: number) => (
              <Link
                href="#"
                key={index}
                className="fixture-card flex-shrink-0 rounded-3 border border-dark p-3 text-decoration-none"
              >
                <div className="text-center text-muted small mb-3">
                  {match.league}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                  <div className="text-center">
                    <Image
                      src={match.homeLogo}
                      width={34}
                      height={34}
                      alt={match.home}
                    />
                    <div className="small fw-semibold text-light mt-2">
                      {match.home}
                    </div>
                  </div>

                  <div className="small text-muted">VS</div>

                  <div className="text-center">
                    <Image
                      src={match.awayLogo}
                      width={34}
                      height={34}
                      alt={match.away}
                    />
                    <div className="small fw-semibold text-light mt-2">
                      {match.away}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="small text-light">{match.day}</div>
                  <div className="fw-bold text-light">{match.time}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>
                    {match.venue}
                  </div>
                </div>
              </Link>
            ))
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