"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  cricketNewsData,
  footballNewsData,
  nflNewsData,
  aflNewsData,
  popularTeamsData,
  liveScoresDetailData
} from "@/data/mockData";
import { newsArticles } from "@/data/newsData";
import SearchSkeleton from "@/components/SearchSkeleton";

// ─── Data Extraction & Indexing ─────────────────────────────────────────────

// Gather all news articles
const allNews = [
  ...cricketNewsData.map((item) => ({ ...item, category: "Cricket" })),
  ...footballNewsData.map((item) => ({ ...item, category: "Football" })),
  ...nflNewsData.map((item) => ({ ...item, category: "NFL" })),
  ...aflNewsData.map((item) => ({ ...item, category: "AFL" })),
];

// Gather matches
const allMatches = liveScoresDetailData;

// Gather unique competitions
const allCompetitions = Array.from(
  new Set(liveScoresDetailData.map((m) => m.competitionName))
).map((compName) => {
  const match = liveScoresDetailData.find((m) => m.competitionName === compName);
  return {
    name: compName,
    sport: match?.sport || "Other",
  };
});

// Gather unique teams
const allTeams = [
  ...popularTeamsData.map((t) => ({ name: t.name, logo: t.logo, sport: t.sport })),
  ...liveScoresDetailData.map((m) => ({ name: m.team1Name, logo: m.team1Logo, sport: m.sport })),
  ...liveScoresDetailData.map((m) => ({ name: m.team2Name, logo: m.team2Logo, sport: m.sport })),
].reduce((acc: any[], current) => {
  const x = acc.find((item) => item.name === current.name);
  if (!x) {
    acc.push(current);
  }
  return acc;
}, []);

// ─── Search Logic ────────────────────────────────────────────────────────────

const TEAM_ALIASES: { [key: string]: string[] } = {
  "royal challengers bengaluru": ["rcb", "bengaluru", "bangalore"],
  "chennai super kings": ["csk", "chennai"],
  "kansas city chiefs": ["chiefs", "kc"],
  "buffalo bills": ["bills"],
  "brisbane lions": ["lions"],
  "gold coast suns": ["suns"],
  "adelaide crows": ["crows"],
  "manchester city": ["man city", "mancity", "mcfc"],
  "manchester united": ["man utd", "manunited", "mufc"],
  "aston villa": ["villa"],
};

function performSearch(query: string) {
  if (!query.trim()) return { news: [], matches: [], teams: [], competitions: [] };

  const q = query.toLowerCase().trim();
  const qWords = q.split(/\s+/).filter((w) => w.length > 0);

  // Helper to match text using exact, partial, alias, and initials logic
  const matchesText = (text: string = "") => {
    const lowerText = text.toLowerCase();
    // 1. Exact / Substring match
    if (lowerText.includes(q)) return true;
    // 2. Keyword match (all words match in any order)
    if (qWords.every((word) => lowerText.includes(word))) return true;

    // 3. Team Alias Match
    for (const [fullName, aliases] of Object.entries(TEAM_ALIASES)) {
      if (lowerText.includes(fullName) || fullName.includes(lowerText)) {
        if (aliases.some(alias => alias === q || alias.includes(q) || q.includes(alias))) {
          return true;
        }
      }
    }

    // 4. Acronym / Initials Match (e.g. "Royal Challengers Bengaluru" -> "RCB")
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    if (words.length > 1) {
      const initials = words.map((w) => w[0]).join("").toLowerCase();
      if (initials === q || initials.includes(q)) return true;
    }

    return false;
  };

  // Search News Articles
  const newsResults = allNews.filter(
    (art) =>
      matchesText(art.title) ||
      matchesText(art.description) ||
      matchesText(art.category)
  );

  // Search Matches (including player names in rosters)
  const matchResults = allMatches.filter((m) => {
    if (matchesText(m.matchName) || matchesText(m.competitionName) || matchesText(m.sport)) return true;
    if (matchesText(m.team1Name) || matchesText(m.team2Name)) return true;
    if (m.venue && matchesText(m.venue)) return true;

    // Check player names in rosters if available
    // Football
    if (m.team1Info?.startingXI?.some((p) => matchesText(p.name))) return true;
    if (m.team1Info?.bench?.some((p) => matchesText(p.name))) return true;
    if (m.team2Info?.startingXI?.some((p) => matchesText(p.name))) return true;
    if (m.team2Info?.bench?.some((p) => matchesText(p.name))) return true;
    // NFL
    if (m.nflData?.team1Roster?.startingOffense?.some((p: any) => matchesText(p.name))) return true;
    if (m.nflData?.team1Roster?.startingDefense?.some((p: any) => matchesText(p.name))) return true;
    if (m.nflData?.team2Roster?.startingOffense?.some((p: any) => matchesText(p.name))) return true;
    if (m.nflData?.team2Roster?.startingDefense?.some((p: any) => matchesText(p.name))) return true;
    // AFL
    if (m.aflData?.team1Roster?.starting18?.some((name: string) => matchesText(name))) return true;
    if (m.aflData?.team2Roster?.starting18?.some((name: string) => matchesText(name))) return true;

    return false;
  });

  // Search Teams
  const teamResults = allTeams.filter(
    (t) => matchesText(t.name) || matchesText(t.sport)
  );

  // Search Competitions
  const competitionResults = allCompetitions.filter(
    (c) => matchesText(c.name) || matchesText(c.sport)
  );

  return {
    news: newsResults,
    matches: matchResults,
    teams: teamResults,
    competitions: competitionResults,
  };
}

// ─── Component Rendering ───────────────────────────────────────────────────

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<"all" | "news" | "matches" | "teams" | "competitions">("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(queryParam);
    if (queryParam) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [queryParam]);

  const results = performSearch(queryParam);
  const totalResults =
    results.news.length +
    results.matches.length +
    results.teams.length +
    results.competitions.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const popularSearches = ["CSK", "Bellingham", "Premier League", "Chiefs", "Travis Kelce"];
  const sportsCategories = ["Cricket", "Football", "NFL", "AFL"];

  return (
    <div className="container py-5 min-h-80vh">
      {/* Search Bar section */}
      <div className="card bg-card border border-dark rounded-3 p-4 mb-5 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
          <input
            type="text"
            className="form-control bg-dark text-white fw-medium border-0 custom-input py-3 px-4 fs-15 rounded-3 flex-grow-1"
            placeholder="Search news, teams, matches, players..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-success px-4 rounded-3 d-flex align-items-center gap-2" type="submit">
            <i className="bi bi-search"></i>
            <span className="d-none d-sm-inline">Search</span>
          </button>
        </form>

        <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
          <span className="text-muted small">Popular:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => {
                setQuery(term);
                router.push(`/search?q=${encodeURIComponent(term)}`);
              }}
              className="btn btn-sm btn-dark text-muted border border-secondary border-opacity-25 rounded-pill px-3 py-1 fs-12 hover-light"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="text-white fw-semibold mt-1 mb-0 fs-2 font-space-grotesk">
            {queryParam ? `Search Results for "${queryParam}"` : "Search Sports Content"}
          </h2>
          <p className="text-muted mb-0">
            {queryParam
              ? `Found ${totalResults} matching results across all sections.`
              : "Use the input above to search for matches, news, teams, and categories."}
          </p>
        </div>
      </div>

      {queryParam && loading ? (
        <>
          {/* Tab Filters Placeholder */}
          <div className="d-flex border-bottom border-dark overflow-auto mb-4 gap-2 pb-1">
            <div className="skeleton-line w-100px h-32px rounded-pill"></div>
            <div className="skeleton-line w-100px h-32px rounded-pill"></div>
            <div className="skeleton-line w-100px h-32px rounded-pill"></div>
          </div>
          <SearchSkeleton />
        </>
      ) : queryParam && totalResults > 0 ? (
        <>
          {/* Tab Filters */}
          <div className="d-flex border-bottom border-dark overflow-auto mb-4 custom-tabs gap-2 pb-1">
            {[
              { id: "all", label: "All Results", count: totalResults },
              { id: "news", label: "News Articles", count: results.news.length },
              { id: "matches", label: "Matches", count: results.matches.length },
              { id: "teams", label: "Teams", count: results.teams.length },
              { id: "competitions", label: "Competitions", count: results.competitions.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`btn border-0 rounded-0 px-4 py-3 fw-bold text-uppercase flex-shrink-0 d-flex align-items-center gap-2 ${
                  activeTab === tab.id
                    ? "text-success border-bottom border-success border-2"
                    : "text-muted"
                } fs-12 ls-05 transition-02s font-space-grotesk`}
              >
                {tab.label}
                <span
                  className={`badge rounded-pill ${
                    activeTab === tab.id ? "bg-success text-white" : "bg-dark text-muted"
                  } fs-10`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="search-results-content">
            {/* Matches Section */}
            {(activeTab === "all" || activeTab === "matches") && results.matches.length > 0 && (
              <div className="mb-5">
                <h4 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">
                  Matches
                </h4>
                <div className="row g-4">
                  {results.matches.map((match) => (
                    <div key={match.id} className="col-md-6 col-lg-4">
                      <div className="card bg-card border border-dark rounded-3 h-100 overflow-hidden transition-all hover-glow">
                        <div className="card-header border-bottom border-dark bg-dark bg-opacity-30 d-flex justify-content-between align-items-center py-2 px-3">
                          <span className="text-muted fs-11 fw-semibold font-monospace">
                            {match.competitionName}
                          </span>
                          <span className="badge-sport-tag">
                            {match.sport}
                          </span>
                        </div>
                        <div className="card-body p-4 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={match.team1Logo}
                                  width={24}
                                  height={24}
                                  alt=""
                                  className="object-fit-contain"
                                />
                                <span className="text-light fw-medium small text-truncate max-w-160px">
                                  {match.team1Name}
                                </span>
                              </div>
                              <span className="text-light fw-bold fs-14">
                                {match.team1Score || "—"}
                              </span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-4">
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={match.team2Logo}
                                  width={24}
                                  height={24}
                                  alt=""
                                  className="object-fit-contain"
                                />
                                <span className="text-light fw-medium small text-truncate max-w-160px">
                                  {match.team2Name}
                                </span>
                              </div>
                              <span className="text-light fw-bold fs-14">
                                {match.team2Score || "—"}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center pt-3 border-top border-dark mt-auto">
                            <span className="text-success small fw-semibold">
                              {match.matchStatus}
                            </span>
                            <Link href={`/live-scores/${match.id}`} className="btn btn-outline-success btn-sm px-3 rounded-2 fw-semibold">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* News Section */}
            {(activeTab === "all" || activeTab === "news") && results.news.length > 0 && (
              <div className="mb-5">
                <h4 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">
                  News Articles
                </h4>
                <div className="row g-4">
                  {results.news.map((item, idx) => {
                    const matchingArticle = newsArticles.find(
                      (a) => a.title.toLowerCase().trim() === item.title.toLowerCase().trim()
                    );
                    const articleUrl = matchingArticle ? `/news/${matchingArticle.id}` : "/news";

                    return (
                      <div key={idx} className="col-md-6">
                        <Link href={articleUrl} className="text-decoration-none h-100 d-block">
                          <div className="card bg-card border border-dark rounded-3 h-100 overflow-hidden transition-all hover-glow">
                            <div className="row g-0 h-100">
                              {item.image && (
                                <div className="col-sm-4 position-relative min-h-120px bg-dark">
                                  <img
                                    src={item.image}
                                    alt=""
                                    className="w-100 h-100 object-fit-cover position-absolute"
                                  />
                                </div>
                              )}
                              <div className={item.image ? "col-sm-8" : "col-12"}>
                                <div className="card-body p-4 d-flex flex-column h-100">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="badge-sport-tag">
                                      {item.category}
                                    </span>
                                    <span className="text-muted fs-11">{item.date}</span>
                                  </div>
                                  <h5 className="text-white fw-semibold mb-2 fs-15 lh-1-4 hover-text-success transition-all">
                                    {item.title}
                                  </h5>
                                  <p className="text-muted small mb-0 text-truncate-3">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Teams Section */}
            {(activeTab === "all" || activeTab === "teams") && results.teams.length > 0 && (
              <div className="mb-5">
                <h4 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">
                  Teams
                </h4>
                <div className="row g-3">
                  {results.teams.map((team, idx) => (
                    <div key={idx} className="col-6 col-sm-4 col-md-3">
                      <div className="card bg-card border border-dark rounded-3 p-3 text-center transition-all hover-glow h-100 d-flex flex-column align-items-center justify-content-center">
                        <div className="team-logo-wrapper mb-3 bg-dark bg-opacity-40 rounded-circle p-3 d-flex align-items-center justify-content-center border border-secondary border-opacity-10 w-60px h-60px">
                          <img
                            src={team.logo || "/assets/imgs/logo-white.svg"}
                            alt=""
                            width={32}
                            height={32}
                            className="object-fit-contain"
                          />
                        </div>
                        <h6 className="text-white fw-semibold mb-1 fs-14 text-truncate w-100">
                          {team.name}
                        </h6>
                        <span className="text-muted fs-11 uppercase font-monospace">
                          {team.sport}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competitions Section */}
            {(activeTab === "all" || activeTab === "competitions") && results.competitions.length > 0 && (
              <div className="mb-5">
                <h4 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">
                  Competitions
                </h4>
                <div className="row g-3">
                  {results.competitions.map((comp, idx) => (
                    <div key={idx} className="col-md-6 col-lg-4">
                      <div className="card bg-card border border-dark rounded-3 p-3 transition-all hover-glow h-100 d-flex align-items-center justify-content-between flex-row">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-dark rounded-3 p-2 border border-secondary border-opacity-10 d-flex align-items-center justify-content-center w-40px h-40px">
                            <i className="bi bi-trophy text-success fs-18"></i>
                          </div>
                          <div>
                            <h6 className="text-white fw-semibold mb-0 fs-14">
                              {comp.name}
                            </h6>
                            <span className="text-muted fs-11">
                              {comp.sport.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <span className="badge-sport-tag">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : queryParam ? (
        /* Empty Results view */
        <div className="card bg-card border border-dark rounded-3 p-5 text-center shadow-sm">
          <div className="d-flex flex-column align-items-center py-4">
            <div className="bg-dark rounded-circle p-4 border border-secondary border-opacity-10 mb-4 d-flex align-items-center justify-content-center w-80px h-80px">
              <i className="bi bi-search text-muted fs-1"></i>
            </div>
            <h3 className="text-white fw-bold mb-2 fs-20 font-space-grotesk">No Results Found</h3>
            <p className="text-muted max-w-420px mx-auto mb-4 fs-14">
              We couldn't find any matching articles, matches, teams, or competitions for "{queryParam}". Please double-check spelling or try different keywords.
            </p>

            <div className="d-flex flex-column align-items-center gap-3 border-top border-dark pt-4 w-100 max-w-420px">
              <span className="text-muted small fw-medium">Or Browse Sports Categories:</span>
              <div className="d-flex gap-2 flex-wrap justify-content-center">
                {sportsCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setQuery(cat);
                      router.push(`/search?q=${encodeURIComponent(cat)}`);
                    }}
                    className="btn btn-outline-success btn-sm px-4 py-2 rounded-3 fw-semibold"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Default view (No query yet) */
        <div className="card bg-card border border-dark rounded-3 p-5 text-center shadow-sm">
          <div className="d-flex flex-column align-items-center py-4">
            <div className="bg-dark rounded-circle p-4 border border-secondary border-opacity-10 mb-4 d-flex align-items-center justify-content-center w-80px h-80px">
              <i className="bi bi-compass text-success fs-1"></i>
            </div>
            <h3 className="text-white fw-bold mb-2 fs-20 font-space-grotesk">Start Searching</h3>
            <p className="text-muted max-w-420px mx-auto mb-4 fs-14">
              Type team names, player names, articles, or competition details in the search box above to instantly find matching sports content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container py-5 min-h-80vh">
        <div className="skeleton-line w-100 h-60px mb-4 rounded-3"></div>
        <div className="skeleton-line w-300px h-32px mb-2"></div>
        <div className="skeleton-line w-200px h-16px mb-5"></div>
        <SearchSkeleton />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
