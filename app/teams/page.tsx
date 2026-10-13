"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { useFavorites } from "@/components/FavoritesContext";
import { cricketApi, cricketItems } from "@/lib/cricket-api";
import { nflApi, soccerApi } from "@/lib/sports-api";

type Team = { name: string; code: string; logo: string };
type Group = { sport: string; teams: Team[] };

const sportTabs = [
  { id: "all", label: "All Teams" },
  { id: "cricket", label: "Cricket" },
  { id: "football", label: "Football" },
  { id: "nfl", label: "NFL" },
];
const pageSize = 12;
const localTeamLogos: Record<string, string> = {
  "arsenal": "/assets/imgs/teams/Arsenal_FC.svg",
  "aston villa": "/assets/imgs/teams/Aston_Villa_FC_new_crest.svg",
  "baltimore": "/assets/imgs/teams/Ravens_logo.svg",
  "brighton": "/assets/imgs/teams/team-placeholder.svg",
  "buffalo": "/assets/imgs/teams/Buffalo_Bills_logo.svg",
  "cincinnati": "/assets/imgs/teams/Bengals_logo.svg",
  "dallas": "/assets/imgs/teams/Dallas_Cowboys.svg",
  "fulham": "/assets/imgs/teams/team-placeholder.svg",
  "kansas city": "/assets/imgs/teams/Kansas_City_Chiefs_logo.svg",
  "liverpool fc": "/assets/imgs/teams/Liverpool_FC.svg",
  "manchester city": "/assets/imgs/teams/Manchester_City_FC_badge.svg",
  "manchester united": "/assets/imgs/teams/Manchester_United_FC_crest.png",
  "newcastle united": "/assets/imgs/teams/Newcastle_United_Logo.svg",
  "tottenham hotspur": "/assets/imgs/teams/Tottenham_Hotspur.png",
  "san francisco": "/assets/imgs/teams/San_Francisco_49ers_logo.svg",
  "buffalo bills": "/assets/imgs/teams/Buffalo_Bills_logo.svg",
  "san francisco 49ers": "/assets/imgs/teams/San_Francisco_49ers_logo.svg",
  "dallas cowboys": "/assets/imgs/teams/Dallas_Cowboys.svg",
  "baltimore ravens": "/assets/imgs/teams/Ravens_logo.svg",
  "cincinnati bengals": "/assets/imgs/teams/Bengals_logo.svg",
  "kansas city chiefs": "/assets/imgs/teams/Kansas_City_Chiefs_logo.svg",
};
const text = (value: unknown, fallback = "") => value === undefined || value === null || String(value).trim() === "" ? fallback : String(value);

const nflLogoSlug: Record<string, string> = {
  MIA: "mia", HOU: "hou", PIT: "pit", BUF: "buf", JAX: "jax", LA: "lar", TB: "tb", SF: "sf",
  LV: "lv", CHI: "chi", DAL: "dal", ATL: "atl", ARI: "ari", BAL: "bal", CAR: "car", CIN: "cin",
  CLE: "cle", DEN: "den", DET: "det", GB: "gb", IND: "ind", KC: "kc", MIN: "min", NE: "ne",
  NO: "no", NYG: "nyg", NYJ: "nyj", PHI: "phi", LAC: "lac", SEA: "sea", WAS: "wsh", TEN: "ten",
};

const teamLogo = (team: Record<string, unknown>, sportIndex: number, name: string, fullName: string) => {
  const local = localTeamLogos[name.toLowerCase()] || localTeamLogos[fullName.toLowerCase()];
  if (local && local !== "/assets/imgs/teams/team-placeholder.svg") return local;
  if (sportIndex === 2) {
    const abbreviation = text(team.abbr || team.short_name).toUpperCase();
    const slug = nflLogoSlug[abbreviation];
    if (slug) return `https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/${slug}.png`;
  }
  const providerLogo = text(team.teamlogo || team.team_logo || team.logo || team.logo_url || team.thumb_url);
  if (providerLogo) return providerLogo;
  if (sportIndex === 1) {
    const teamId = text(team.tid || team.team_id || team.id);
    if (teamId) return `https://gcdnimages.entitysport.com/soccer/team/${teamId}.png`;
  }
  return "/assets/imgs/teams/team-placeholder.svg";
};

const fixtureSportForGroup = (groupSport: string) => {
  const sport = groupSport.toLowerCase();
  return sport.startsWith("nfl") ? "nfl" : sport.startsWith("football") ? "football" : "cricket";
};

export default function TeamsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedSport, setSelectedSport] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const { isFavoriteTeam, addFavoriteTeam, removeFavoriteTeam } = useFavorites();

  useEffect(() => {
    const requestedSport = new URLSearchParams(window.location.search).get("sport")?.toLowerCase();
    if (requestedSport === "nfl" || requestedSport === "football" || requestedSport === "soccer" || requestedSport === "cricket") {
      setSelectedSport(requestedSport === "soccer" ? "football" : requestedSport);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const responses = await Promise.allSettled([cricketApi.competitions(), soccerApi.competitions(), nflApi.competitions()]);
      const next: Group[] = [];

      for (let index = 0; index < responses.length; index += 1) {
        const response = responses[index];
        if (response.status !== "fulfilled") continue;
        const items = index === 0 ? cricketItems(response.value) : Array.isArray(response.value.items) ? response.value.items : [];
        const preferredCompetition = index === 1 ? "premier league" : index === 2 ? "nfl" : "";
        const competition = (preferredCompetition ? items.find((item) => text(item.cname || item.name || item.title).toLowerCase().includes(preferredCompetition)) : undefined)
          || items.find((item) => item.cid || item.id);
        if (!competition) continue;

        try {
          const info = index === 0
            ? await cricketApi.competition(String(competition.cid || competition.id))
            : index === 1
              ? await soccerApi.competition(String(competition.cid || competition.id))
              : await nflApi.competition(String(competition.cid || competition.id));
          const source = Array.isArray(info.items) ? info.items[0] : info.items && typeof info.items === "object" ? info.items : info;
          const teams = Array.isArray(source.teams) ? source.teams : [];
          const mapped = teams.map((team: Record<string, unknown>, teamIndex: number) => {
            const name = text(team.tname || team.fullname || team.title || team.name, `Team ${teamIndex + 1}`);
            const fullName = text(team.fullname || name);
            const normalizedName = name.toLowerCase().replace(/\s+/g, " ").trim();
            return {
              name,
              code: text(team.abbr || team.short_name, name.slice(0, 3).toUpperCase()),
              logo: teamLogo(team, index, normalizedName, fullName.toLowerCase().replace(/\s+/g, " ").trim()),
            };
          });
          if (mapped.length) {
            next.push({
              sport: `${index === 0 ? "Cricket" : index === 1 ? "Football" : "NFL"} · ${text(competition.cname || competition.name || competition.title, "Competition")}`,
              teams: mapped,
            });
          }
        } catch {
          // Keep provider groups that are available.
        }
      }

      if (!cancelled) {
        setGroups(next);
        setMessage(next.length ? null : "No teams were supplied by the connected sports providers.");
        setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const visibleGroups = selectedSport === "all" ? groups : groups.filter((group) => group.sport.toLowerCase().startsWith(selectedSport));
  const allVisibleTeams = visibleGroups.flatMap((group) => group.teams.map((team, teamIndex) => ({ groupSport: group.sport, team, teamIndex })));
  const totalPages = Math.max(1, Math.ceil(allVisibleTeams.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageTeams = allVisibleTeams.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const paginatedGroups = visibleGroups.map((group) => ({ ...group, teams: pageTeams.filter((entry) => entry.groupSport === group.sport).map((entry) => entry.team) })).filter((group) => group.teams.length > 0);

  return (
    <main className="font-outfit">
      <PageHeader title="Popular Teams" subtitle="Teams supplied by the connected Cricket, Football and NFL providers." className="mb-5" />
      <div className="container custom-container">
        <div className="d-flex flex-wrap gap-2 border-bottom border-secondary border-opacity-10 pb-3 mb-4">
          {sportTabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => { setSelectedSport(tab.id); setPage(1); }} className="btn fw-bold rounded-pill px-4 py-2 transition-all" style={{ fontSize: "13px", background: selectedSport === tab.id ? "var(--accent-green)" : "transparent", color: selectedSport === tab.id ? "#fff" : "var(--text-muted)", border: selectedSport === tab.id ? "1px solid var(--accent-green)" : "1px solid transparent" }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="d-flex flex-column gap-5">
          {loading ? <div className="text-center text-muted py-5">Loading teams…</div> : paginatedGroups.length ? paginatedGroups.map((group) => (
            <div key={group.sport}>
              <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
                <h5 className="fw-bold text-white mb-0 border-start border-success border-3 ps-2 font-space-grotesk" style={{ fontSize: "16px" }}>{group.sport}</h5>
                <span className="text-muted small">{group.teams.length} teams</span>
              </div>
              <div className="row g-3">
                {group.teams.map((team, teamIndex) => {
                  const favorite = isFavoriteTeam(team.name);
                  const fixtureSport = fixtureSportForGroup(group.sport);
                  return (
                    <div key={`${group.sport}-${team.name}-${teamIndex}`} className="col-12 col-sm-6 col-md-3">
                      <Link href={`/fixtures?sport=${fixtureSport}&search=${encodeURIComponent(team.name)}`} className="text-decoration-none">
                        <div className="rounded-4 p-4 text-center h-100 position-relative" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                          <button className="btn btn-link p-0 position-absolute" style={{ top: "14px", right: "14px", zIndex: 5 }} onClick={(event) => { event.preventDefault(); event.stopPropagation(); favorite ? removeFavoriteTeam(team.name) : addFavoriteTeam(team.name); }} aria-label="Bookmark team">
                            <i className={`bi ${favorite ? "bi-star-fill text-warning" : "bi-star text-muted"}`}></i>
                          </button>
                          <div className="d-flex align-items-center justify-content-center mx-auto mb-3 overflow-hidden rounded-3" style={{ width: "64px", height: "64px", background: "rgba(255,255,255,0.03)" }}>
                            <img src={team.logo} alt={team.name} className="w-75 h-75 object-fit-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/assets/imgs/teams/team-placeholder.svg"; }} />
                          </div>
                          <h6 className="fw-bold text-white mb-1" style={{ fontSize: "14px" }}>{team.name}</h6>
                          <span className="badge rounded-pill fw-semibold font-monospace" style={{ fontSize: "10px", background: "rgba(26,140,61,0.12)", color: "#86efac" }}>{team.code}</span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )) : <div className="text-center text-muted py-5">{selectedSport === "all" ? message : `No ${selectedSport.toUpperCase()} teams were supplied by the connected provider.`}</div>}

          {!loading && allVisibleTeams.length > 0 && <>
            <div className="ranking-pagination">
              <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button>
            </div>
            <div className="ranking-pagination-summary">Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, allVisibleTeams.length)} of {allVisibleTeams.length} teams</div>
          </>}
        </div>
      </div>
    </main>
  );
}
