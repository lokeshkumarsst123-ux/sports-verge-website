"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ResultItem } from "@/types";
import { recentResults } from "@/data/mockData";

export default function RecentResults() {
  const [activeTab, setActiveTab] = useState<"all" | "cricket" | "football" | "NFL" | "AFL">("all");
  const [showArrows, setShowArrows] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredResults = activeTab === "all"
    ? recentResults
    : recentResults.filter((item) => item.type === activeTab);

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
  }, [filteredResults]);

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
    <section className="results-section bg-card rounded-3 p-4 border border-dark mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h5 className="m-0 fw-semibold border-start border-3 border-success ps-2">
          Recent Results
        </h5>
        <Link href="#" className="text-success text-decoration-none small">
          View All
        </Link>
      </div>

      <ul className="nav nav-pills mb-3 custom-tabs">
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
          className="fixtures-scroll-container d-flex gap-3 pb-2"
        >
          {filteredResults.length > 0 ? (
            filteredResults.map((item: ResultItem, index: number) => (
              <Link
                key={index}
                href="#"
                className="fixture-card d-block text-decoration-none flex-shrink-0 rounded-3 p-3 border border-dark"
              >
                <div className="text-center text-muted small mb-3">
                  {item.league}
                </div>

                {item.type === "cricket" ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <Image
                          src={item.homeLogo}
                          alt={item.home}
                          width={22}
                          height={22}
                          className="me-2"
                        />
                        <span className="text-light fw-medium">
                          {item.home}
                        </span>
                      </div>
                      <span className="text-light fw-bold">
                        {item.homeScore}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <Image
                          src={item.awayLogo}
                          alt={item.away}
                          width={22}
                          height={22}
                          className="me-2"
                        />
                        <span className="text-light fw-medium">
                          {item.away}
                        </span>
                      </div>
                      <span className="text-light fw-bold">
                        {item.awayScore}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                    <div className="text-center">
                      <Image
                        src={item.homeLogo}
                        alt={item.home}
                        width={34}
                        height={34}
                      />
                      <div
                        className="small fw-semibold text-light mt-1"
                        style={{ fontSize: 11 }}
                      >
                        {item.home}
                      </div>
                    </div>

                    <div className="fw-bold text-light fs-5">
                      {item.score}
                    </div>

                    <div className="text-center">
                      <Image
                        src={item.awayLogo}
                        alt={item.away}
                        width={34}
                        height={34}
                      />
                      <div
                        className="small fw-semibold text-light mt-1"
                        style={{ fontSize: 11 }}
                      >
                        {item.away}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center mt-auto">
                  <div className="small text-success mb-2">
                    {item.result}
                  </div>
                  <div className="text-muted small">
                    {item.date}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-muted w-100 py-4 small">
              No recent results for this category.
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