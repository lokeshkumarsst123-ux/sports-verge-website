"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PopularTeamItem } from "@/types";
import { popularTeamsData } from "@/data/mockData";

export default function PopularTeams() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <aside className="popular-teams-section bg-card rounded-3 p-4 border border-dark mt-4 sticky-top" style={{ top: "90px", zIndex: 10 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="m-0 fw-semibold border-start border-success border-3 ps-2">Popular Teams</h5>
        <Link href="#" className="text-success text-decoration-none small fw-medium">
          View All
        </Link>
      </div>

      <div className="popular-teams-list pe-4" style={{ maxHeight: "240px", overflowY: "auto" }}>
        {popularTeamsData.map((team: PopularTeamItem, idx: number) => {
          const isBookmarked = bookmarkedIds.includes(team.id);
          const isLastItem = idx === popularTeamsData.length - 1;

          return (
            <div
              key={team.id}
              className={`d-flex align-items-center justify-content-between ${isLastItem ? "mb-2" : "mb-3"}`}
            >
              <Link href="#" className="d-flex align-items-center text-decoration-none flex-grow-1 team-link">
                <div style={{ position: "relative", width: "24px", height: "24px", marginRight: "1rem" }}>
                  <Image
                    src={team.logo}
                    alt={team.name}
                    fill
                    sizes="24px"
                    style={{ objectFit: team.id === "patriots-nfl" || team.id === "arsenal-football" ? "contain" : "cover" }}
                    className="rounded-circle"
                  />
                </div>
                <span className="text-light fw-medium small">
                  {team.name} <span className="text-muted ms-1" style={{ fontSize: "11px" }}>({team.sport})</span>
                </span>
              </Link>
              <button
                className={`btn btn-link p-0 star-toggle ${isBookmarked ? "active text-warning" : "text-muted"}`}
                onClick={() => toggleBookmark(team.id)}
                aria-label="Bookmark Team"
              >
                <i className={`bi ${isBookmarked ? "bi-star-fill text-warning" : "bi-star"}`}></i>
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
