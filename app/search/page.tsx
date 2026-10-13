"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SearchSkeleton from "@/components/SearchSkeleton";
import { searchApi, type MatchScope, type SearchItem, type SearchMode, type SearchResponse, type SearchSport, type SearchType } from "@/lib/search-api";

const typeOptions: Array<{ value: SearchType; label: string }> = [
  { value: "all", label: "All content" },
  { value: "articles", label: "Articles" },
  { value: "teams", label: "Teams" },
  { value: "competitions", label: "Competitions" },
  { value: "matches", label: "Matches" },
  { value: "players", label: "Players" },
  { value: "categories", label: "Sports categories" },
];

const sportOptions: Array<{ value: SearchSport; label: string }> = [
  { value: "all", label: "All sports" },
  { value: "cricket", label: "Cricket" },
  { value: "football", label: "Football" },
  { value: "nfl", label: "NFL" },
];

const modeOptions: Array<{ value: SearchMode; label: string }> = [
  { value: "all", label: "All matches" },
  { value: "exact", label: "Exact match" },
  { value: "partial", label: "Partial match" },
  { value: "keyword", label: "Keyword match" },
];

const scopeOptions: Array<{ value: MatchScope; label: string }> = [
  { value: "all", label: "All match statuses" },
  { value: "live", label: "Live matches" },
  { value: "fixture", label: "Upcoming fixtures" },
  { value: "result", label: "Completed results" },
];

const allowed = <T extends string>(value: string | null, options: Array<{ value: T; label: string }>, fallback: T) => {
  return options.some((option) => option.value === value) ? value as T : fallback;
};

const itemLabel = (item: SearchItem) => {
  if (item.type === "article") return item.category || "Article";
  if (item.type === "match") return [item.competition, item.sport].filter(Boolean).join(" · ");
  if (item.type === "team") return `${item.sport || "Sports"} team`;
  if (item.type === "player") return `${item.sport || "Sports"} player`;
  if (item.type === "category") return "Sports category";
  return `${item.sport || "Sports"} competition`;
};

const fallbackHref = (item: SearchItem) => `/search?q=${encodeURIComponent(item.title)}`;

function ResultCard({ item }: { item: SearchItem }) {
  const href = item.href || fallbackHref(item);
  return (
    <Link href={href} className="card bg-card border border-dark rounded-3 p-3 h-100 text-decoration-none search-result-card">
      <div className="d-flex align-items-start gap-3">
        <div className="search-result-icon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0">
          {item.image ? <img src={item.image} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <span>{item.title.slice(0, 1).toUpperCase()}</span>}
        </div>
        <div className="min-w-0 flex-grow-1">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
            <span className="text-success small text-uppercase fw-semibold">{itemLabel(item)}</span>
            {item.matchType && <span className="badge bg-dark text-muted text-uppercase">{item.matchType}</span>}
          </div>
          <h3 className="h6 text-white mb-1 text-truncate">{item.title}</h3>
          {item.description && <p className="text-muted small mb-0 search-result-description">{item.description}</p>}
          {item.type === "match" && <div className="d-flex flex-wrap gap-2 text-light small mt-2"><span>{item.status || "Scheduled"}</span>{item.date && <span>· {item.date}</span>}{item.venue && <span>· {item.venue}</span>}</div>}
        </div>
      </div>
    </Link>
  );
}

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const queryParam = params.get("q")?.trim() || "";
  const type = allowed(params.get("type"), typeOptions, "all");
  const sport = allowed(params.get("sport"), sportOptions, "all");
  const mode = allowed(params.get("mode"), modeOptions, "all");
  const matchScope = allowed(params.get("match_scope"), scopeOptions, "all");
  const page = Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1);
  const [query, setQuery] = useState(queryParam);
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setQuery(queryParam), [queryParam]);

  useEffect(() => {
    if (!queryParam) {
      setResponse(null);
      setError("");
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError("");
    searchApi.search({ q: queryParam, type, sport, mode, matchScope, page, limit: 10 })
      .then((result) => { if (!cancelled) setResponse(result.data); })
      .catch((reason) => { if (!cancelled) { setResponse(null); setError(reason instanceof Error ? reason.message : "Unable to search sports content."); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [queryParam, type, sport, mode, matchScope, page]);

  const updateUrl = (updates: Partial<{ q: string; type: SearchType; sport: SearchSport; mode: SearchMode; matchScope: MatchScope; page: number }>) => {
    const next = {
      q: updates.q ?? queryParam,
      type: updates.type ?? type,
      sport: updates.sport ?? sport,
      mode: updates.mode ?? mode,
      matchScope: updates.matchScope ?? matchScope,
      page: updates.page ?? 1,
    };
    const nextParams = new URLSearchParams();
    if (next.q.trim()) nextParams.set("q", next.q.trim());
    if (next.type !== "all") nextParams.set("type", next.type);
    if (next.sport !== "all") nextParams.set("sport", next.sport);
    if (next.mode !== "all") nextParams.set("mode", next.mode);
    if (next.matchScope !== "all") nextParams.set("match_scope", next.matchScope);
    if (next.page > 1) nextParams.set("page", String(next.page));
    router.push(nextParams.toString() ? `/search?${nextParams.toString()}` : "/search");
  };

  const sections = useMemo(() => {
    if (!response) return [];
    const order: Array<{ type: SearchItem["type"]; title: string }> = [
      { type: "article", title: "Articles" },
      { type: "match", title: "Matches" },
      { type: "team", title: "Teams" },
      { type: "competition", title: "Competitions" },
      { type: "player", title: "Players" },
      { type: "category", title: "Sports Categories" },
    ];
    return order.map((section) => ({ ...section, items: response.items.filter((item) => item.type === section.type) })).filter((section) => section.items.length > 0);
  }, [response]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    updateUrl({ q: query, page: 1 });
  };

  const showingStart = response && response.total > 0 ? (response.page - 1) * response.limit + 1 : 0;
  const showingEnd = response ? Math.min(response.page * response.limit, response.total) : 0;

  return (
    <main className="container custom-container py-5 min-h-80vh">
      <div className="page-header mb-4">
        <div className="page-header-line" />
        <div><h1 className="text-white mb-1">SEARCH SPORTS CONTENT</h1><p className="text-muted mb-0">Find articles, teams, competitions, matches, players, and sports categories.</p></div>
      </div>

      <section className="card bg-card border border-dark rounded-4 p-3 p-md-4 mb-4">
        <form onSubmit={submit} className="d-flex flex-column flex-md-row gap-2 mb-3">
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="form-control bg-dark text-white border-dark py-3" placeholder="Search team, match, competition, player, article..." aria-label="Search sports content" />
          <button className="btn btn-success px-4" type="submit"><i className="bi bi-search me-2" />Search</button>
        </form>
        <div className="row g-2">
          <div className="col-12 col-md-3"><label className="form-label text-muted small">CONTENT TYPE</label><select className="form-select bg-dark text-white border-dark" value={type} onChange={(event) => updateUrl({ type: event.target.value as SearchType })}>{typeOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></div>
          <div className="col-12 col-md-3"><label className="form-label text-muted small">SPORT</label><select className="form-select bg-dark text-white border-dark" value={sport} onChange={(event) => updateUrl({ sport: event.target.value as SearchSport })}>{sportOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></div>
          <div className="col-12 col-md-3"><label className="form-label text-muted small">MATCH LOGIC</label><select className="form-select bg-dark text-white border-dark" value={mode} onChange={(event) => updateUrl({ mode: event.target.value as SearchMode })}>{modeOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></div>
          <div className="col-12 col-md-3"><label className="form-label text-muted small">MATCH STATUS</label><select className="form-select bg-dark text-white border-dark" value={matchScope} onChange={(event) => updateUrl({ matchScope: event.target.value as MatchScope })}>{scopeOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></div>
        </div>
      </section>

      {queryParam && <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4"><div><h2 className="h5 text-white mb-1">Results for “{queryParam}”</h2><p className="text-muted small mb-0">{response ? `${response.total} result${response.total === 1 ? "" : "s"} found` : "Searching connected sports sources..."}</p></div>{response && <div className="text-muted small">Showing {showingStart}-{showingEnd} of {response.total}</div>}</div>}

      {loading ? <SearchSkeleton /> : error ? <div className="card bg-card border border-danger p-5 text-center text-warning">{error}</div> : !queryParam ? <div className="card bg-card border border-dark p-5 text-center text-muted">Type a team, match, competition, player, article, or keyword to search.</div> : response?.items.length ? <div className="d-flex flex-column gap-4">{sections.map((section) => <section key={section.type}><div className="d-flex align-items-center gap-2 mb-3"><div className="section-accent" /><h2 className="h5 text-white mb-0">{section.title}</h2></div><div className="row g-3">{section.items.map((item) => <div className="col-12 col-lg-6" key={`${item.type}-${item.sport}-${item.id}`}><ResultCard item={item} /></div>)}</div></section>)}{response.totalPages > 1 && <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 pt-2"><button className="btn btn-outline-secondary" disabled={response.page <= 1} onClick={() => updateUrl({ page: response.page - 1 })}>Previous</button><span className="text-muted small">Page {response.page} of {response.totalPages}</span><button className="btn btn-outline-secondary" disabled={response.page >= response.totalPages} onClick={() => updateUrl({ page: response.page + 1 })}>Next</button></div>}</div> : <div className="card bg-card border border-dark p-5 text-center text-muted">No matching sports content was found.</div>}
    </main>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<main className="container custom-container py-5"><SearchSkeleton /></main>}><SearchContent /></Suspense>;
}
