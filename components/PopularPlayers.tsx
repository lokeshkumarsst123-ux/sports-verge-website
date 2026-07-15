"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayerItem } from "@/types";
import { popularPlayers } from "@/data/mockData";

export default function PopularPlayers() {
  const [activeTab, setActiveTab] = useState<"all" | "cricket" | "football" | "NFL" | "AFL">("all");
  const [showArrows, setShowArrows] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredPlayers = activeTab === "all"
    ? popularPlayers
    : popularPlayers.filter((player) => player.sport === activeTab);

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
  }, [filteredPlayers]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200; // width of card + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="popular-players bg-card rounded-3 p-4 border border-dark mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 className="h5 m-0 fw-semibold border-start border-success border-3 ps-2">
          Popular Players
        </h2>
        <Link href="/stats" className="text-success text-decoration-none small fw-medium">
          View All
        </Link>
      </div>

      <ul className="nav nav-pills custom-tabs mb-4 flex-nowrap overflow-x-auto scrollbar-none gap-2">
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
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player: PlayerItem, index: number) => (
              <Link
                key={index}
                href="#"
                className="player-card flex-shrink-0 d-block text-center text-decoration-none rounded-3 border border-dark overflow-hidden"
              >
                <div className="player-img-wrapper">
                  <Image
                    src={player.image}
                    alt={player.name}
                    width={170}
                    height={220}
                    className="w-100 player-thumb"
                  />
                </div>

                <div className="player-info p-2">
                  <div
                    className="fw-semibold text-light text-truncate fs-13"
                  >
                    {player.name}
                  </div>
                  <div
                    className="text-muted text-truncate fs-11"
                  >
                    {player.team}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-muted w-100 py-4 small">
              No popular players found in this category.
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