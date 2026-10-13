"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { cricketApi, mapCricketFixture } from "@/lib/cricket-api";
import { mapNflFixture, mapSoccerFixture, nflApi, soccerApi } from "@/lib/sports-api";
import type { FixtureItem } from "@/types";

const sportConfig: Record<string, { color: string; icon: string }> = {
  All: { color: "#22c55e", icon: "bi-grid-fill" },
  Cricket: { color: "#22c55e", icon: "bi-trophy-fill" },
  Football: { color: "#3b82f6", icon: "bi-dribbble" },
  NFL: { color: "#f59e0b", icon: "bi-shield-fill" },
};
const pageSize = 10;

const mapCricket = (raw: Parameters<typeof mapCricketFixture>[0]): FixtureItem => {
  const fixture = mapCricketFixture(raw);
  return { ...fixture, type: "cricket", date: fixture.date, sport: "Cricket", status: fixture.status };
};

const sportFromFixture = (fixture: FixtureItem) => fixture.sport || (fixture.type === "football" ? "Football" : fixture.type);

const sameCalendarDay = (left: Date, right: Date) => (
  left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate()
);

const fixtureGroupLabel = (key: string) => {
  const date = new Date(key.replace(" ", "T"));
  return !Number.isNaN(date.getTime()) && sameCalendarDay(date, new Date()) ? "Today" : key || "Upcoming";
};

export default function FixturesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [fixtures, setFixtures] = useState<FixtureItem[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedSport = params.get("sport")?.toLowerCase();
    const requestedSearch = params.get("search") || "";
    const isLegacyProviderCode = /^w\d{2,3}$/i.test(requestedSearch.trim());
    if (isLegacyProviderCode) {
      params.delete("search");
      window.history.replaceState(null, "", `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
      setSearch("");
    } else {
      setSearch(requestedSearch);
    }
    if (requestedSport === "nfl") setActiveTab("NFL");
    else if (requestedSport === "football" || requestedSport === "soccer") setActiveTab("Football");
    else if (requestedSport === "cricket") setActiveTab("Cricket");
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const responses = await Promise.allSettled([
        cricketApi.matches("fixture"),
        soccerApi.matches("fixture"),
        nflApi.matches("fixture"),
      ]);
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
    void load();
    const timer = window.setInterval(() => { void load(); }, 60000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return fixtures.filter((fixture) => {
      const sport = sportFromFixture(fixture);
      const searchable = `${fixture.home} ${fixture.away} ${fixture.league} ${fixture.venue}`.toLowerCase();
      return (activeTab === "All" || sport === activeTab) && (!query || searchable.includes(query));
    });
  }, [activeTab, search, fixtures]);

  const liveCount = filtered.filter((fixture) => fixture.status === "live").length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleFixtures = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const groupedFixtures = useMemo(() => {
    const groups = new Map<string, FixtureItem[]>();
    visibleFixtures.forEach((fixture) => {
      const key = fixture.date || fixture.day || "Upcoming";
      groups.set(key, [...(groups.get(key) || []), fixture]);
    });
    return Array.from(groups.entries()).map(([key, items]) => ({ key, label: fixtureGroupLabel(key), items }));
  }, [visibleFixtures]);

  const linkFor = (fixture: FixtureItem) => {
    if (!fixture.id) return "/live-scores";
    const sport = sportFromFixture(fixture).toLowerCase();
    return `/live-scores/${fixture.id}${sport === "football" ? "?sport=football" : sport === "nfl" ? "?sport=nfl" : ""}`;
  };
  const emptyMessage = error || (
    search.trim()
      ? `We couldn't find any ${activeTab === "All" ? "" : `${activeTab.toLowerCase()} `}fixtures for "${search.trim()}". Try another team, league, or venue.`
      : `No ${activeTab === "All" ? "" : `${activeTab.toLowerCase()} `}fixtures are available right now. Please check back soon or try another category.`
  );

  return (
    <main className="font-outfit fixtures-page" style={{ background: "var(--bg-dark)", color: "var(--text-light)" }}>
      <PageHeader title="Fixtures" subtitle="Upcoming matches across Cricket, Football and NFL — never miss a game.">
        <div className="fixtures-header-tools">
          <label className="fixtures-search">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Search teams, leagues, venues..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
          </label>
          <div className="fixtures-counts">
            <span><i className="bi bi-calendar3"></i>{filtered.length} Matches Scheduled</span>
            {liveCount > 0 && <span className="fixtures-live-count"><i className="bi bi-circle-fill"></i>{liveCount} Live Now</span>}
          </div>
        </div>
      </PageHeader>

      <div className="container custom-container">
        <div className="fixtures-filter-bar">
          {Object.entries(sportConfig).map(([sport, config]) => (
            <button key={sport} type="button" className={`fixtures-filter ${activeTab === sport ? "is-active" : ""}`} style={{ "--filter-color": config.color } as React.CSSProperties} onClick={() => { setActiveTab(sport); setPage(1); setSearch(""); }}>
              <i className={`bi ${config.icon}`}></i>{sport}
            </button>
          ))}
        </div>

        <div className="fixtures-list">
          {filtered.length ? groupedFixtures.map((group) => (
            <section className="fixtures-date-group" key={group.key}>
              <div className="fixtures-date-heading">
                <span className="fixtures-date-pill"><i className="bi bi-calendar-event-fill"></i>{group.label}</span>
                <span className="fixtures-date-line"></span>
                <span className="fixtures-date-total">{group.items.length} matches</span>
              </div>

              <div className="fixtures-group-items">
                {group.items.map((fixture, index) => {
                  const sport = sportFromFixture(fixture);
                  const config = sportConfig[sport] || sportConfig.All;
                  const live = fixture.status === "live";
                  return (
                    <article className={`fixture-row-card ${live ? "is-live" : ""}`} key={`${sport}-${fixture.id || "fixture"}-${index}`}>
                      <div className="fixture-row-topline">
                        <div className="fixture-row-league">
                          <span className="fixture-sport-badge" style={{ "--sport-color": config.color } as React.CSSProperties}><i className={`bi ${config.icon}`}></i>{sport}</span>
                          <span>{fixture.league}</span>
                        </div>
                        <div className="fixture-row-time">
                          {live ? <span className="fixture-live-badge"><i className="bi bi-circle-fill"></i>LIVE</span> : <><strong>{fixture.time}</strong><span>{fixture.date || fixture.day}</span></>}
                        </div>
                      </div>

                      <div className="fixture-teams-row">
                        <div className="fixture-team fixture-team-home">
                          <img src={fixture.homeLogo} alt={fixture.home} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/assets/imgs/teams/team-placeholder.svg"; }} />
                          <strong>{fixture.home}</strong>
                        </div>
                        <span className="fixture-versus">VS</span>
                        <div className="fixture-team fixture-team-away">
                          <strong>{fixture.away}</strong>
                          <img src={fixture.awayLogo} alt={fixture.away} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/assets/imgs/teams/team-placeholder.svg"; }} />
                        </div>
                      </div>

                      <div className="fixture-row-footer">
                        <span className="fixture-venue"><i className="bi bi-geo-alt-fill"></i>{fixture.venue || "Venue unavailable"}</span>
                        <Link href={linkFor(fixture)} className="fixture-details-link">Match Details <i className="bi bi-arrow-right"></i></Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )) : <div className="fixture-empty-card">{emptyMessage}</div>}
        </div>

        {filtered.length > 0 && <>
          <div className="ranking-pagination">
            <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button>
          </div>
          <div className="ranking-pagination-summary">Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} fixtures</div>
        </>}
      </div>
    </main>
  );
}
