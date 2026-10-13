"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PopularTeamItem } from "@/types";
import { useFavorites } from "@/components/FavoritesContext";
import { cricketApi, cricketItems } from "@/lib/cricket-api";
import { nflApi, soccerApi } from "@/lib/sports-api";

const text = (value: unknown, fallback = "") => value === undefined || value === null || String(value).trim() === "" ? fallback : String(value);

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
  return text(team.teamlogo || team.team_logo || team.logo || team.logo_url || team.thumb_url, "/assets/imgs/teams/team-placeholder.svg");
};

export default function PopularTeams() {
  const [teams, setTeams] = useState<PopularTeamItem[]>([]);
  const { isFavoriteTeam, addFavoriteTeam, removeFavoriteTeam } = useFavorites();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const responses = await Promise.allSettled([cricketApi.competitions(), soccerApi.competitions(), nflApi.competitions()]);
      const next: PopularTeamItem[] = [];
      for (let index = 0; index < responses.length; index += 1) {
        const response = responses[index];
        if (response.status !== "fulfilled") continue;
        const items = index === 0 ? cricketItems(response.value) : Array.isArray(response.value.items) ? response.value.items : [];
        const preferredCompetition = index === 1 ? "premier league" : index === 2 ? "nfl" : "";
        const competition = (preferredCompetition ? items.find((item) => text(item.cname || item.name || item.title).toLowerCase().includes(preferredCompetition)) : undefined)
          || items.find((item) => item.cid || item.id);
        if (!competition) continue;
        try {
          const data = index === 0
            ? await cricketApi.competition(String(competition.cid || competition.id))
            : index === 1
              ? await soccerApi.competition(String(competition.cid || competition.id))
              : await nflApi.competition(String(competition.cid || competition.id));
          const source = Array.isArray(data.items) ? data.items[0] : data.items && typeof data.items === "object" ? data.items : data;
          const list = Array.isArray(source.teams) ? source.teams : [];
          next.push(...list.slice(0, 6).map((team: Record<string, unknown>, teamIndex: number) => ({
            id: `${index}-${text(team.tid || team.team_id || team.id || team.title || team.name, "team")}-${teamIndex}`,
            name: text(team.tname || team.fullname || team.title || team.name, "Unknown team"),
            sport: index === 0 ? "Cricket" : index === 1 ? "Football" : "NFL",
            logo: teamLogo(team, index),
          })));
        } catch {
          // Provider competition may not include teams.
        }
      }
      if (!cancelled) setTeams(next.filter((team) => team.id));
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const toggle = (name: string) => isFavoriteTeam(name) ? removeFavoriteTeam(name) : addFavoriteTeam(name);

  return (
    <aside className="popular-teams-section bg-card rounded-3 p-4 border border-dark mt-4 sticky-top popular-teams-aside">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h5 m-0 fw-semibold border-start border-success border-3 ps-2">Popular Teams</h2>
        <Link href="/teams" className="text-success text-decoration-none small fw-medium">View All</Link>
      </div>
      <div className="popular-teams-list pe-4 popular-teams-scroll-list">
        {teams.length ? teams.map((team) => {
          const favorite = isFavoriteTeam(team.name);
          return (
            <div key={team.id} className="d-flex align-items-center justify-content-between mb-3">
              <Link href={`/fixtures?sport=${sportParam(team.sport)}&search=${encodeURIComponent(team.name)}`} className="d-flex align-items-center text-decoration-none flex-grow-1 team-link">
                <div className="popular-team-logo-wrapper"><Image src={team.logo} alt={team.name} fill sizes="24px" className="logo-fit-contain" /></div>
                <span className="text-light fw-medium small">{team.name} <span className="text-muted ms-1 fs-11">({team.sport})</span></span>
              </Link>
              <button className={`btn btn-link p-0 star-toggle ${favorite ? "active text-warning" : "text-muted"}`} onClick={() => toggle(team.name)} aria-label="Bookmark team"><i className={`bi ${favorite ? "bi-star-fill text-warning" : "bi-star"}`}></i></button>
            </div>
          );
        }) : <div className="text-muted small">No provider teams available.</div>}
      </div>
    </aside>
  );
}
