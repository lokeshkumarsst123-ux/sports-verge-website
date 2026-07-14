"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

// ─── Fixtures Data ───────────────────────────────────────────────────────────
const allFixtures = [
  // TODAY
  {
    id: "f-1", sport: "Cricket", league: "IPL 2026 • Match 46",
    home: "CSK", homeLogo: "/assets/imgs/teams/ipl/CSKoutline.png",
    away: "RCB", awayLogo: "/assets/imgs/teams/ipl/RCBoutline.png",
    day: "Today", date: "14 Jul 2026", time: "7:30 PM",
    venue: "M. A. Chidambaram Stadium, Chennai", status: "upcoming",
  },
  {
    id: "f-2", sport: "Football", league: "Premier League",
    home: "Man City", homeLogo: "/assets/imgs/teams/Manchester_City_FC_badge.svg",
    away: "Arsenal", awayLogo: "/assets/imgs/teams/Arsenal_FC.svg",
    day: "Today", date: "14 Jul 2026", time: "8:30 PM",
    venue: "Etihad Stadium, Manchester", status: "upcoming",
  },
  {
    id: "f-3", sport: "Cricket", league: "Test Series • Day 3",
    home: "England", homeLogo: "/assets/imgs/teams/england.webp",
    away: "West Indies", awayLogo: "/assets/imgs/teams/west-indies.webp",
    day: "Today", date: "14 Jul 2026", time: "3:30 PM",
    venue: "Lord's Cricket Ground, London", status: "live",
  },
  {
    id: "f-4", sport: "AFL", league: "AFL • Round 17",
    home: "Carlton Blues", homeLogo: "/assets/imgs/teams/Brisbane_Lions_logo_2010.svg",
    away: "Richmond Tigers", awayLogo: "/assets/imgs/teams/Essendon_FC_logo.svg",
    day: "Today", date: "14 Jul 2026", time: "6:00 PM",
    venue: "MCG, Melbourne", status: "upcoming",
  },
  // TOMORROW
  {
    id: "f-5", sport: "NFL", league: "NFL • Pre-Season",
    home: "Kansas City Chiefs", homeLogo: "/assets/imgs/teams/Kansas_City_Chiefs_logo.svg",
    away: "Buffalo Bills", awayLogo: "/assets/imgs/teams/Buffalo_Bills_logo.svg",
    day: "Tomorrow", date: "15 Jul 2026", time: "6:00 AM",
    venue: "GEHA Field at Arrowhead Stadium, Kansas City", status: "upcoming",
  },
  {
    id: "f-6", sport: "Cricket", league: "IPL 2026 • Match 47",
    home: "Mumbai Indians", homeLogo: "/assets/imgs/teams/ipl/CSKoutline.png",
    away: "KKR", awayLogo: "/assets/imgs/teams/ipl/RCBoutline.png",
    day: "Tomorrow", date: "15 Jul 2026", time: "7:30 PM",
    venue: "Wankhede Stadium, Mumbai", status: "upcoming",
  },
  {
    id: "f-7", sport: "Football", league: "Champions League • QF",
    home: "Liverpool", homeLogo: "/assets/imgs/teams/Liverpool_FC.svg",
    away: "Aston Villa", awayLogo: "/assets/imgs/teams/Aston_Villa_FC_new_crest.svg",
    day: "Tomorrow", date: "15 Jul 2026", time: "10:30 PM",
    venue: "Anfield, Liverpool", status: "upcoming",
  },
  // IN 2 DAYS
  {
    id: "f-8", sport: "NFL", league: "NFL • Pre-Season",
    home: "Dallas Cowboys", homeLogo: "/assets/imgs/teams/Buffalo_Bills_logo.svg",
    away: "New England Patriots", awayLogo: "/assets/imgs/teams/Kansas_City_Chiefs_logo.svg",
    day: "Wed, 16 Jul", date: "16 Jul 2026", time: "4:00 AM",
    venue: "AT&T Stadium, Dallas", status: "upcoming",
  },
  {
    id: "f-9", sport: "AFL", league: "AFL • Round 17",
    home: "Western Bulldogs", homeLogo: "/assets/imgs/teams/Essendon_FC_logo.svg",
    away: "Gold Coast Suns", awayLogo: "/assets/imgs/teams/Brisbane_Lions_logo_2010.svg",
    day: "Wed, 16 Jul", date: "16 Jul 2026", time: "5:10 PM",
    venue: "Marvel Stadium, Melbourne", status: "upcoming",
  },
  {
    id: "f-10", sport: "Football", league: "World Cup • QF",
    home: "Argentina", homeLogo: "/assets/imgs/teams/Arsenal_FC.svg",
    away: "France", awayLogo: "/assets/imgs/teams/Manchester_City_FC_badge.svg",
    day: "Wed, 16 Jul", date: "16 Jul 2026", time: "9:00 PM",
    venue: "Lusail Stadium, Qatar", status: "upcoming",
  },
  // LATER
  {
    id: "f-11", sport: "Cricket", league: "T20 World Cup • SF",
    home: "India", homeLogo: "/assets/imgs/teams/ipl/CSKoutline.png",
    away: "Australia", awayLogo: "/assets/imgs/teams/australia.webp",
    day: "Thu, 17 Jul", date: "17 Jul 2026", time: "7:00 PM",
    venue: "Eden Gardens, Kolkata", status: "upcoming",
  },
  {
    id: "f-12", sport: "Football", league: "World Cup • SF",
    home: "England", homeLogo: "/assets/imgs/teams/england.webp",
    away: "Norway", awayLogo: "/assets/imgs/teams/west-indies.webp",
    day: "Fri, 18 Jul", date: "18 Jul 2026", time: "9:00 PM",
    venue: "Lusail Stadium, Qatar", status: "upcoming",
  },
];

// ─── Config ──────────────────────────────────────────────────────────────────
const sportConfig: Record<string, { color: string; icon: string }> = {
  "All":      { color: "#22c55e", icon: "bi-grid-fill" },
  "Cricket":  { color: "#22c55e", icon: "bi-trophy-fill" },
  "Football": { color: "#3b82f6", icon: "bi-dribbble" },
  "NFL":      { color: "#f59e0b", icon: "bi-shield-fill" },
  "AFL":      { color: "#ec4899", icon: "bi-circle-fill" },
};

const dayOrder = ["Today", "Tomorrow", "Wed, 16 Jul", "Thu, 17 Jul", "Fri, 18 Jul"];

export default function FixturesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return allFixtures.filter((f) => {
      const matchSport = activeTab === "All" || f.sport === activeTab;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        f.home.toLowerCase().includes(q) ||
        f.away.toLowerCase().includes(q) ||
        f.league.toLowerCase().includes(q) ||
        f.venue.toLowerCase().includes(q);
      return matchSport && matchSearch;
    });
  }, [activeTab, searchQuery]);

  // Group by day
  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    dayOrder.forEach((d) => { map[d] = []; });
    filtered.forEach((f) => {
      if (!map[f.day]) map[f.day] = [];
      map[f.day].push(f);
    });
    return Object.entries(map).filter(([, items]) => items.length > 0);
  }, [filtered]);

  const total = filtered.length;
  const liveCount = filtered.filter((f) => f.status === "live").length;

  return (
    <main
      className="min-vh-100 font-outfit"
      style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "40px 0 80px 0" }}
    >
      {/* ─── Hero Header ─────────────────────────────────────────────── */}
      <PageHeader
        title="Fixtures"
        subtitle="Upcoming matches across Cricket, Football, NFL & AFL — never miss a game."
      >
        <div className="d-flex flex-column gap-3 align-items-md-end w-100" style={{ maxWidth: "450px" }}>
          <div className="position-relative w-100">
            <i
              className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-4 text-muted"
              style={{ fontSize: "15px", pointerEvents: "none" }}
            ></i>
            <input
              type="text"
              placeholder="Search teams, leagues, venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control text-white rounded-pill py-3"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-dark)",
                fontSize: "13px",
                paddingLeft: "48px",
                paddingRight: "20px",
                color: "#fff",
              }}
            />
          </div>
          {/* Quick stats pills */}
          <div className="d-flex gap-2 flex-wrap">
            <span
              className="badge rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)", color: "var(--text-light)", opacity: 0.7, fontSize: "11px" }}
            >
              <i className="bi bi-calendar3 text-success"></i>
              {total} Matches Scheduled
            </span>
            {liveCount > 0 && (
              <span
                className="badge rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1"
                style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.25)", fontSize: "11px" }}
              >
                <span className="d-inline-block rounded-circle me-1" style={{ width: "6px", height: "6px", background: "#ef4444", animation: "pulse 1.5s infinite" }}></span>
                {liveCount} Live Now
              </span>
            )}
          </div>
        </div>
      </PageHeader>

      {/* ─── Sport Filter Tabs ───────────────────────────────────────── */}
      <div
        className="sticky-top"
        style={{ top: "62px", zIndex: 100, background: "var(--bg-dark)", borderBottom: "1px solid var(--border-dark)" }}
      >
        <div className="container custom-container">
          <div className="d-flex gap-2 py-3 overflow-auto" style={{ scrollbarWidth: "none" }}>
            {Object.entries(sportConfig).map(([sport, cfg]) => {
              const isActive = activeTab === sport;
              return (
                <button
                  key={sport}
                  onClick={() => setActiveTab(sport)}
                  className="btn d-flex align-items-center gap-2 fw-semibold flex-shrink-0 transition-all text-white"
                  style={{
                    borderRadius: "999px",
                    fontSize: "13px",
                    padding: "7px 18px",
                    background: isActive ? "var(--accent-green)" : "var(--bg-card)",
                    border: `1px solid ${isActive ? "var(--accent-green)" : "var(--border-dark)"}`,
                    color: isActive ? "#fff !important" : "var(--text-light)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <i className={`bi ${cfg.icon}`} style={{ fontSize: "12px", color: isActive ? "#fff" : cfg.color }}></i>
                  <span style={{ color: isActive ? "#fff" : "inherit" }}>{sport}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Fixtures List ───────────────────────────────────────────── */}
      <section className="py-5">
        <div className="container custom-container">
          {grouped.length === 0 ? (
            <div
              className="text-center py-5 rounded-4"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}
            >
              <i className="bi bi-calendar-x text-muted d-block mb-3" style={{ fontSize: "3rem", opacity: 0.3 }}></i>
              <h5 className="text-white fw-semibold mb-1">No Fixtures Found</h5>
              <p className="text-muted small mb-0">Try adjusting your sport filter or search term.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-5">
              {grouped.map(([day, fixtures]) => (
                <div key={day}>
                  {/* Day Header */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="d-flex align-items-center gap-2 rounded-pill px-3 py-1"
                      style={{ background: "rgba(26,140,61,0.12)", border: "1px solid rgba(26,140,61,0.25)" }}
                    >
                      <i className="bi bi-calendar3-fill text-success" style={{ fontSize: "11px" }}></i>
                      <span className="fw-bold text-white" style={{ fontSize: "13px" }}>
                        {day}
                      </span>
                    </div>
                    <div style={{ flex: 1, height: "1px", background: "var(--border-dark)" }}></div>
                    <span className="text-muted" style={{ fontSize: "12px" }}>{fixtures.length} match{fixtures.length !== 1 ? "es" : ""}</span>
                  </div>

                  {/* Fixture Cards */}
                  <div className="d-flex flex-column gap-3">
                    {fixtures.map((fixture) => {
                      const cfg = sportConfig[fixture.sport] || sportConfig["All"];
                      const isLive = fixture.status === "live";

                      return (
                        <div
                          key={fixture.id}
                          className="rounded-4 overflow-hidden transition-all"
                          style={{
                            background: "var(--bg-card)",
                            border: isLive
                              ? "1px solid rgba(239,68,68,0.3)"
                              : "1px solid var(--border-dark)",
                            boxShadow: isLive ? "0 0 20px rgba(239,68,68,0.08)" : "none",
                          }}
                        >
                          {/* Live indicator bar */}
                          {isLive && (
                            <div style={{ height: "2px", background: "linear-gradient(90deg,#ef4444,#f97316)" }}></div>
                          )}

                          <div className="p-4">
                            {/* Top row: league + sport tag + time */}
                            <div className="d-flex align-items-center justify-content-between gap-2 mb-3 flex-wrap">
                              <div className="d-flex align-items-center gap-2">
                                {/* Sport badge */}
                                <span
                                  className="badge rounded-pill px-2 py-1 fw-semibold"
                                  style={{
                                    fontSize: "10px",
                                    background: `${cfg.color}15`,
                                    color: cfg.color,
                                    border: `1px solid ${cfg.color}30`,
                                  }}
                                >
                                  <i className={`bi ${cfg.icon} me-1`} style={{ fontSize: "9px" }}></i>
                                  {fixture.sport}
                                </span>
                                <span className="text-muted" style={{ fontSize: "12px" }}>
                                  {fixture.league}
                                </span>
                              </div>

                              {/* Status / Time */}
                              {isLive ? (
                                <span
                                  className="badge rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-1"
                                  style={{ fontSize: "11px", background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}
                                >
                                  <span
                                    className="d-inline-block rounded-circle"
                                    style={{ width: "6px", height: "6px", background: "#ef4444" }}
                                  ></span>
                                  LIVE
                                </span>
                              ) : (
                                <div className="text-end">
                                  <div className="fw-bold text-white" style={{ fontSize: "14px" }}>{fixture.time}</div>
                                  <div className="text-muted" style={{ fontSize: "11px" }}>{fixture.date}</div>
                                </div>
                              )}
                            </div>

                            {/* Teams row */}
                            <div className="d-flex align-items-center justify-content-between gap-3">
                              {/* Home team */}
                              <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ minWidth: 0 }}>
                                <div
                                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden"
                                  style={{ width: "48px", height: "48px", background: "var(--bg-dark)", border: "1px solid var(--border-dark)", padding: "6px" }}
                                >
                                  <img
                                    src={fixture.homeLogo}
                                    alt={fixture.home}
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                  />
                                </div>
                                <span
                                  className="fw-bold text-white"
                                  style={{ fontSize: "clamp(13px, 2vw, 15px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                >
                                  {fixture.home}
                                </span>
                              </div>

                              {/* VS badge */}
                              <div className="text-center flex-shrink-0 px-3">
                                <div
                                  className="fw-black font-space-grotesk"
                                  style={{ fontSize: "16px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}
                                >
                                  VS
                                </div>
                              </div>

                              {/* Away team */}
                              <div className="d-flex align-items-center gap-3 flex-grow-1 justify-content-end" style={{ minWidth: 0 }}>
                                <span
                                  className="fw-bold text-white text-end"
                                  style={{ fontSize: "clamp(13px, 2vw, 15px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                >
                                  {fixture.away}
                                </span>
                                <div
                                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden"
                                  style={{ width: "48px", height: "48px", background: "var(--bg-dark)", border: "1px solid var(--border-dark)", padding: "6px" }}
                                >
                                  <img
                                    src={fixture.awayLogo}
                                    alt={fixture.away}
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Venue footer */}
                            <div
                              className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3"
                              style={{ borderTop: "1px solid var(--border-dark)" }}
                            >
                              <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                                <i className="bi bi-geo-alt-fill text-success" style={{ fontSize: "11px" }}></i>
                                {fixture.venue}
                              </span>
                              <Link
                                href="/live-scores"
                                className="text-success fw-semibold text-decoration-none d-flex align-items-center gap-1"
                                style={{ fontSize: "12px", whiteSpace: "nowrap" }}
                              >
                                {isLive ? "Watch Live" : "Match Details"}
                                <i className="bi bi-arrow-right-short"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
