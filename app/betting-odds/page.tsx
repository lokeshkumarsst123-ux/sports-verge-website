"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { cricketApi, type CricketBettingOddsCard } from "@/lib/cricket-api";

const PAGE_SIZE = 5;

import { USE_STATIC_MOCK, MOCK_ODDS_CARDS } from "@/lib/mock-data";

const localTeamLogos: Record<string, string> = {
  "royal challengers bengaluru": "/assets/imgs/teams/ipl/RCBoutline.png",
  "chennai super kings": "/assets/imgs/teams/ipl/CSKoutline.png",
  "mumbai indians": "/assets/imgs/teams/ipl/MIoutline.png",
  "kolkata knight riders": "/assets/imgs/teams/ipl/KKRoutline.png",
  "rajasthan royals": "/assets/imgs/teams/ipl/RRoutline.png",
  "sunrisers hyderabad": "/assets/imgs/teams/ipl/SRHoutline.png",
  "delhi capitals": "/assets/imgs/teams/ipl/DCoutline.png",
  "gujarat titans": "/assets/imgs/teams/ipl/GToutline.png",
  "lucknow super giants": "/assets/imgs/teams/ipl/LSGoutline.png",
  "punjab kings": "/assets/imgs/teams/ipl/PBKSoutline.png",
  "india": "/assets/imgs/teams/india.webp",
  "australia": "/assets/imgs/teams/australia.webp",
  "england": "/assets/imgs/teams/england.webp",
  "south africa": "/assets/imgs/teams/south-africa.webp",
  "manchester city": "/assets/imgs/teams/Manchester_City_FC_badge.svg",
  "arsenal": "/assets/imgs/teams/Arsenal_FC.svg",
  "real madrid": "/assets/imgs/teams/Liverpool_FC.svg",
  "liverpool fc": "/assets/imgs/teams/Liverpool_FC.svg",
  "liverpool": "/assets/imgs/teams/Liverpool_FC.svg",
  "aston villa": "/assets/imgs/teams/Aston_Villa_FC_new_crest.svg",
  "tottenham hotspur": "/assets/imgs/teams/Tottenham_Hotspur.png",
  "manchester united": "/assets/imgs/teams/Manchester_United_FC_crest.png",
  "newcastle united": "/assets/imgs/teams/Newcastle_United_Logo.svg",
  "kansas city chiefs": "/assets/imgs/teams/Kansas_City_Chiefs_logo.svg",
  "buffalo bills": "/assets/imgs/teams/Buffalo_Bills_logo.svg",
  "baltimore ravens": "/assets/imgs/teams/Ravens_logo.svg",
  "san francisco 49ers": "/assets/imgs/teams/San_Francisco_49ers_logo.svg",
  "dallas cowboys": "/assets/imgs/teams/Dallas_Cowboys.svg",
  "cincinnati bengals": "/assets/imgs/teams/Bengals_logo.svg",
};

const getTeamLogo = (name: string) => {
  const normalized = (name || "").toLowerCase().trim();
  return localTeamLogos[normalized] || "/assets/imgs/teams/team-placeholder.svg";
};

const getTeamShort = (name: string) => {
  const normalized = (name || "").toLowerCase().trim();
  const shortMap: Record<string, string> = {
    "royal challengers bengaluru": "RCB",
    "chennai super kings": "CSK",
    "mumbai indians": "MI",
    "kolkata knight riders": "KKR",
    "rajasthan royals": "RR",
    "sunrisers hyderabad": "SRH",
    "delhi capitals": "DC",
    "gujarat titans": "GT",
    "lucknow super giants": "LSG",
    "punjab kings": "PBKS",
    "india": "IND",
    "australia": "AUS",
    "england": "ENG",
    "south africa": "SA",
    "manchester city": "MCI",
    "arsenal": "ARS",
    "real madrid": "RMA",
    "liverpool fc": "LIV",
    "liverpool": "LIV",
    "kansas city chiefs": "KC",
    "buffalo bills": "BUF",
    "baltimore ravens": "BAL",
    "san francisco 49ers": "SF",
  };
  if (shortMap[normalized]) return shortMap[normalized];
  const words = name.split(" ");
  if (words.length > 1) {
    return words.map((w) => w[0]).join("").toUpperCase().slice(0, 4);
  }
  return name.slice(0, 3).toUpperCase();
};

const getSportInfo = (competition: string) => {
  const lower = (competition || "").toLowerCase();
  if (
    lower.includes("indian premier league") ||
    lower.includes("ipl") ||
    lower.includes("cricket") ||
    lower.includes("t20") ||
    lower.includes("test") ||
    lower.includes("odi") ||
    (lower.includes("world cup") && !lower.includes("fifa"))
  ) {
    return { name: "Cricket", color: "#16a34a", bg: "rgba(22, 163, 74, 0.1)", border: "rgba(22, 163, 74, 0.25)" };
  }
  if (lower.includes("nfl") || lower.includes("super bowl") || lower.includes("afc") || lower.includes("nfc")) {
    return { name: "NFL", color: "#d97706", bg: "rgba(217, 119, 6, 0.1)", border: "rgba(217, 119, 6, 0.25)" };
  }
  if (
    lower.includes("premier league") ||
    lower.includes("champions league") ||
    lower.includes("la liga") ||
    lower.includes("soccer") ||
    lower.includes("football") ||
    lower.includes("fifa")
  ) {
    return { name: "Football", color: "#2563eb", bg: "rgba(37, 99, 235, 0.1)", border: "rgba(37, 99, 235, 0.25)" };
  }
  return { name: "Cricket", color: "#16a34a", bg: "rgba(22, 163, 74, 0.1)", border: "rgba(22, 163, 74, 0.25)" };
};

const getMockTime = (index: number) => {
  const times = [
    "LIVE",
    "Tomorrow, 19:30 IST",
    "Fri, 19:00 IST",
    "Sat, 21:00 GMT",
    "Wed, 00:30 IST",
    "Sun, 23:30 ET",
  ];
  return times[index % times.length];
};

export default function BettingOddsPage() {
  const [cards, setCards] = useState<CricketBettingOddsCard[]>(USE_STATIC_MOCK ? MOCK_ODDS_CARDS : []);
  const [selectedSport, setSelectedSport] = useState<"all" | "cricket" | "football" | "nfl">("all");
  const [loading, setLoading] = useState(!USE_STATIC_MOCK);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Betting Odds & Analytics - The SportsVerge";

    if (USE_STATIC_MOCK) {
      setCards(MOCK_ODDS_CARDS);
      setLoading(false);
      setMessage("");
      return;
    }

    let active = true;

    const loadOdds = async (initialLoad = false) => {
      if (initialLoad) setLoading(true);
      else setRefreshing(true);
      setMessage("");

      try {
        const nextPage = await cricketApi.bettingOddsPage(page, PAGE_SIZE);

        if (!active) return;

        if (!nextPage.items.length && page > 1) {
          setPage((currentPage) => Math.max(1, currentPage - 1));
          return;
        }

        setCards(nextPage.items);
        setHasNextPage(nextPage.hasNextPage);
        if (!nextPage.items.length) setMessage("Live odds are temporarily unavailable. Please check back shortly.");
      } catch {
        if (!active) return;
        setCards([]);
        setHasNextPage(false);
        setMessage("We couldn't load the latest odds right now. Please check back shortly.");
      } finally {
        if (active) {
          if (initialLoad) setLoading(false);
          setRefreshing(false);
        }
      }
    };

    void loadOdds(true);
    const refreshTimer = window.setInterval(() => void loadOdds(false), 30000);

    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, [page]);

  const filteredCards = cards.filter((card) => {
    if (selectedSport === "all") return true;
    const sportName = getSportInfo(card.competition).name.toLowerCase();
    return sportName === selectedSport;
  });

  const getSportCount = (sportKey: "all" | "cricket" | "football" | "nfl") => {
    if (sportKey === "all") return cards.length;
    return cards.filter((c) => getSportInfo(c.competition).name.toLowerCase() === sportKey).length;
  };

  return (
    <main className="font-outfit odds-page">
      <PageHeader
        title="Betting Odds & Analytics"
        subtitle="Live match odds and betting lines, updated automatically when available."
        className="odds-page-header"
      />

      <section className="container custom-container odds-content">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-2 border-bottom" style={{ borderColor: "#EAE5DC" }}>
          <div className="odds-filter-track">
            {[
              { id: "all", label: "All Sports", icon: "bi-grid-fill" },
              { id: "cricket", label: "Cricket", icon: "bi-trophy-fill" },
              { id: "football", label: "Football", icon: "bi-globe2" },
              { id: "nfl", label: "NFL", icon: "bi-shield-fill" },
            ].map((tab) => {
              const isActive = selectedSport === tab.id;
              const count = getSportCount(tab.id as typeof selectedSport);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedSport(tab.id as typeof selectedSport)}
                  className={`odds-filter-btn ${isActive ? "active" : ""}`}
                >
                  <i className={`bi ${tab.icon}`} style={{ fontSize: "12px" }} />
                  {tab.label}
                  <span className="odds-filter-count">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="d-none d-md-flex align-items-center gap-2 small" style={{ color: "#78716C", fontWeight: 500 }}>
            <span className="spinner-grow spinner-grow-sm text-success" style={{ width: "7px", height: "7px" }} role="status" />
            <span>Real-time odds feed from major verified bookmakers</span>
          </div>
        </div>

        {loading ? (
          <div className="odds-state" role="status">Loading the latest odds...</div>
        ) : filteredCards.length ? (
          <>
            <div className="odds-list">
              {filteredCards.map((card, idx) => {
                const sport = getSportInfo(card.competition);
                const isLive = String(card.status || "").toUpperCase() === "LIVE";
                const homeShort = getTeamShort(card.home);
                const awayShort = getTeamShort(card.away);
                const cardTime = getMockTime(idx);

                return (
                  <article className="odds-match-card" key={card.id}>
                    {/* Card Top Header */}
                    <div className="odds-card-header">
                      <div className="odds-card-header-left">
                        <span
                          className="odds-sport-badge"
                          style={{
                            color: sport.color,
                            backgroundColor: sport.bg,
                            border: `1px solid ${sport.border}`,
                          }}
                        >
                          {sport.name}
                        </span>
                        <span className="odds-card-comp-name" title={card.competition}>
                          {card.competition} <span className="odds-card-comp-stage">· {card.label}</span>
                        </span>
                      </div>

                      {isLive ? (
                        <span className="odds-status-pill odds-status-live">
                          <span className="spinner-grow spinner-grow-sm" style={{ width: "6px", height: "6px" }} role="status" aria-hidden="true" />
                          LIVE
                        </span>
                      ) : (
                        <span className="odds-status-pill odds-status-upcoming">
                          <i className="bi bi-clock me-1" style={{ fontSize: "10px" }} />
                          {cardTime}
                        </span>
                      )}
                    </div>

                    {/* Team Matchup Row */}
                    <div className="odds-matchup">
                      {/* Home Team */}
                      <div className="odds-team-side odds-team-home">
                        <div className="odds-team-logo-box">
                          <img
                            src={getTeamLogo(card.home)}
                            alt={card.home}
                            onError={(e) => { e.currentTarget.src = "/assets/imgs/teams/team-placeholder.svg"; }}
                          />
                        </div>
                        <div className="odds-team-details">
                          <span className="odds-team-name" title={card.home}>{card.home}</span>
                          <span className="odds-team-sub">Home</span>
                        </div>
                      </div>

                      {/* VS Center */}
                      <div className="odds-vs-center">
                        <span className="odds-vs-badge">VS</span>
                      </div>

                      {/* Away Team */}
                      <div className="odds-team-side odds-team-away">
                        <div className="odds-team-logo-box">
                          <img
                            src={getTeamLogo(card.away)}
                            alt={card.away}
                            onError={(e) => { e.currentTarget.src = "/assets/imgs/teams/team-placeholder.svg"; }}
                          />
                        </div>
                        <div className="odds-team-details">
                          <span className="odds-team-name" title={card.away}>{card.away}</span>
                          <span className="odds-team-sub">Away</span>
                        </div>
                      </div>
                    </div>

                    {/* Betting Odds Options */}
                    <div className="odds-bet-section">
                      <div className="odds-bet-header">
                        <span>Match Winner (1X2)</span>
                        <span style={{ fontSize: "10px", color: "#16a34a", fontWeight: 700 }}>
                          <i className="bi bi-shield-check me-1" />Best Market Odds
                        </span>
                      </div>

                      <div className="odds-options-grid">
                        <button type="button" className="odds-btn">
                          <span className="odds-btn-label">1 · {homeShort}</span>
                          <span className="odds-btn-value">{card.homeOdds || "—"}</span>
                        </button>
                        <button type="button" className="odds-btn">
                          <span className="odds-btn-label">X · Draw</span>
                          <span className="odds-btn-value">{card.drawOdds || "—"}</span>
                        </button>
                        <button type="button" className="odds-btn">
                          <span className="odds-btn-label">2 · {awayShort}</span>
                          <span className="odds-btn-value">{card.awayOdds || "—"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="odds-card-footer">
                      <span>
                        <i className="bi bi-graph-up me-1" style={{ color: "#d97706" }} /> 12+ Bookmakers
                      </span>
                      <span className="odds-footer-action">
                        More Markets <i className="bi bi-chevron-right" style={{ fontSize: "10px" }} />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {(page > 1 || hasNextPage) && (
              <>
                <div className="ranking-pagination">
                  <button type="button" disabled={page === 1 || refreshing} onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}>Previous</button>
                  <span>Page {page}</span>
                  <button type="button" disabled={!hasNextPage || refreshing} onClick={() => setPage((currentPage) => currentPage + 1)}>Next</button>
                </div>
                <div className="ranking-pagination-summary">
                  Showing {((page - 1) * PAGE_SIZE) + 1}-{((page - 1) * PAGE_SIZE) + filteredCards.length} of live odds
                </div>
              </>
            )}
          </>
        ) : (
          <div className="odds-state odds-empty-state" role="status">
            <strong>No odds available for this category.</strong>
            <span>{message || "Try choosing another sport tab or check back shortly."}</span>
          </div>
        )}
      </section>
    </main>
  );
}
