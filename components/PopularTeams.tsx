"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PopularTeamItem } from "@/types";
import { popularTeamsData } from "@/data/mockData";
import { useFavorites } from "@/components/FavoritesContext";

export default function PopularTeams() {
  const { isFavoriteTeam, addFavoriteTeam, removeFavoriteTeam } = useFavorites();

  const toggleBookmark = (name: string) => {
    if (isFavoriteTeam(name)) {
      removeFavoriteTeam(name);
    } else {
      addFavoriteTeam(name);
    }
  };

  return (
    <aside className="popular-teams-section bg-card rounded-3 p-4 border border-dark mt-4 sticky-top popular-teams-aside">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h5 m-0 fw-semibold border-start border-success border-3 ps-2">Popular Teams</h2>
        <Link href="/teams" className="text-success text-decoration-none small fw-medium">
          View All
        </Link>
      </div>

      <div className="popular-teams-list pe-4 popular-teams-scroll-list">
        {popularTeamsData.map((team: PopularTeamItem, idx: number) => {
          const isBookmarked = isFavoriteTeam(team.name);
          const isLastItem = idx === popularTeamsData.length - 1;

          return (
            <div
              key={team.id}
              className={`d-flex align-items-center justify-content-between ${isLastItem ? "mb-2" : "mb-3"}`}
            >
              <Link href="#" className="d-flex align-items-center text-decoration-none flex-grow-1 team-link">
                <div className="popular-team-logo-wrapper">
                  <Image
                    src={team.logo}
                    alt={team.name}
                    fill
                    sizes="24px"
                    className={`rounded-circle ${team.id === "patriots-nfl" || team.id === "arsenal-football" ? "logo-fit-contain" : "logo-fit-cover"}`}
                  />
                </div>
                <span className="text-light fw-medium small">
                  {team.name} <span className="text-muted ms-1 fs-11">({team.sport})</span>
                </span>
              </Link>
              <button
                className={`btn btn-link p-0 star-toggle ${isBookmarked ? "active text-warning" : "text-muted"}`}
                onClick={() => toggleBookmark(team.name)}
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
