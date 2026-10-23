"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PopularTeamItem } from "@/types";
import { useFavorites } from "@/components/FavoritesContext";
import { cricketApi, cricketItems } from "@/lib/cricket-api";
import { nflApi, soccerApi } from "@/lib/sports-api";

// Set to true for static/mock data to test UI and design without API dependencies.
// Set to false to switch back to dynamic API data anytime.
import { USE_STATIC_MOCK, MOCK_POPULAR_TEAMS } from "@/lib/mock-data";

const text = (value: unknown, fallback = "") =>
  value === undefined || value === null || String(value).trim() === "" ? fallback : String(value);

const sportParam = (sport: string) => {
  const value = sport.toLowerCase();
  return value === "nfl" ? "nfl" : value === "football" || value === "soccer" ? "football" : "cricket";
};

const nflLogoSlug: Record<string, string> = {
  MIA: "mia", HOU: "hou", PIT: "pit", BUF: "buf", JAX: "jax", LA: "lar", TB: "tb", SF: "sf",
  LV: "lv", CHI: "chi", DAL: "dal", ATL: "atl", ARI: "ari", BAL: "bal", CAR: "car", CIN: "cin",
  CLE: "cle", DEN: "den", DET: "det", GB: "gb", IND: "ind", KC: "kc", MIN: "min", NE: "ne",
  NO: "no", NYG: "nyg", NYJ: "nyj", PHI: "phi", LAC: "lac", SEA: "sea", WAS: "wsh", TEN: "ten",
};

const teamLogo = (team: Record<string, unknown>, sportIndex: number) => {
  if (sportIndex === 2) {
    const slug = nflLogoSlug[text(team.abbr || team.short_name).toUpperCase()];
    if (slug) return `https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/${slug}.png`;
  }
  return text(
    team.teamlogo || team.team_logo || team.logo || team.logo_url || team.thumb_url,
    "/assets/imgs/teams/team-placeholder.svg"
  );
};

export default function PopularTeams() {
  const [teams, setTeams] = useState<PopularTeamItem[]>(USE_STATIC_MOCK ? MOCK_POPULAR_TEAMS : []);
  const { isFavoriteTeam, addFavoriteTeam, removeFavoriteTeam } = useFavorites();

  useEffect(() => {
    if (USE_STATIC_MOCK) {
      setTeams(MOCK_POPULAR_TEAMS);
      return;
    }

    let cancelled = false;
    const load = async () => {
      const responses = await Promise.allSettled([
        cricketApi.competitions(),
        soccerApi.competitions(),
        nflApi.competitions(),
      ]);
      const next: PopularTeamItem[] = [];
      for (let index = 0; index < responses.length; index += 1) {
        const response = responses[index];
        if (response.status !== "fulfilled") continue;
        const items = index === 0 ? cricketItems(response.value) : Array.isArray(response.value.items) ? response.value.items : [];
        const preferredCompetition = index === 1 ? "premier league" : index === 2 ? "nfl" : "";
        const competition =
          (preferredCompetition
            ? items.find((item) => text(item.cname || item.name || item.title).toLowerCase().includes(preferredCompetition))
            : undefined) || items.find((item) => item.cid || item.id);
        if (!competition) continue;
        try {
          const data =
            index === 0
              ? await cricketApi.competition(String(competition.cid || competition.id))
              : index === 1
                ? await soccerApi.competition(String(competition.cid || competition.id))
                : await nflApi.competition(String(competition.cid || competition.id));
          const source = Array.isArray(data.items) ? data.items[0] : data.items && typeof data.items === "object" ? data.items : data;
          const list = Array.isArray(source.teams) ? source.teams : [];
          next.push(
            ...list.slice(0, 6).map((team: Record<string, unknown>, teamIndex: number) => ({
              id: `${index}-${text(team.tid || team.team_id || team.id || team.title || team.name, "team")}-${teamIndex}`,
              name: text(team.tname || team.fullname || team.title || team.name, "Unknown team"),
              sport: index === 0 ? "Cricket" : index === 1 ? "Football" : "NFL",
              logo: teamLogo(team, index),
            }))
          );
        } catch {
          // Provider competition may not include teams.
        }
      }
      if (!cancelled) setTeams(next.filter((team) => team.id));
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (name: string) => (isFavoriteTeam(name) ? removeFavoriteTeam(name) : addFavoriteTeam(name));

  return (
    <aside
      className="rounded-4 p-4 mt-4 sticky-top shadow-sm"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE5DC",
        top: "90px",
        zIndex: 10,
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 m-0 fw-bold border-start border-3 ps-2 widget-heading">
          Popular Teams
        </h2>
        <Link href="/teams" className="small widget-view-all">
          View All <i className="bi bi-chevron-right" />
        </Link>
      </div>

      <div
        className="d-flex flex-column gap-1 pe-1 scrollbar-none"
        style={{
          maxHeight: "360px",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {teams.length ? (
          teams.map((team) => {
            const favorite = isFavoriteTeam(team.name);
            return (
              <div
                key={team.id}
                className="d-flex align-items-center justify-content-between p-2 rounded-3 transition-all"
                style={{
                  backgroundColor: "transparent",
                  borderBottom: "1px solid #EAE5DC",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAF6EF")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <Link
                  href={`/fixtures?sport=${sportParam(team.sport)}&search=${encodeURIComponent(team.name)}`}
                  className="d-flex align-items-center text-decoration-none flex-grow-1 min-w-0 me-2"
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 me-2"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#FAF6EF",
                      border: "1px solid #EAE5DC",
                    }}
                  >
                    <img
                      src={team.logo}
                      alt={team.name}
                      style={{
                        width: "20px",
                        height: "20px",
                        objectFit: "contain",
                      }}
                      onError={(event) => {
                        if (!event.currentTarget.src.endsWith("team-placeholder.svg")) {
                          event.currentTarget.src = "/assets/imgs/teams/team-placeholder.svg";
                        }
                      }}
                    />
                  </div>
                  <div className="d-flex flex-column min-w-0">
                    <span
                      className="fw-bold text-truncate"
                      style={{
                        color: "#1C1F22",
                        fontSize: "14px",
                        lineHeight: "1.25",
                        whiteSpace: "nowrap",
                        fontWeight: 700,
                      }}
                      title={team.name}
                    >
                      {team.name}
                    </span>
                    <span
                      style={{
                        color: "#334155",
                        fontSize: "11.5px",
                        fontWeight: "600",
                        marginTop: "1px",
                      }}
                    >
                      {team.sport}
                    </span>
                  </div>
                </Link>

                <button
                  className="btn btn-link p-1 text-decoration-none flex-shrink-0 shadow-none border-0"
                  onClick={() => toggle(team.name)}
                  aria-label="Bookmark team"
                  style={{
                    color: favorite ? "#FFCC00" : "#475569",
                    lineHeight: 1,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <i
                    className={`bi ${favorite ? "bi-star-fill text-warning" : "bi-star"}`}
                    style={{ fontSize: "16px" }}
                  />
                </button>
              </div>
            );
          })
        ) : (
          <div className="small py-3 text-center widget-empty-text">No provider teams available.</div>
        )}
      </div>
    </aside>
  );
}
