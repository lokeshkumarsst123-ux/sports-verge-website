"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import MatchDetailSkeleton from "@/components/live-scores/MatchDetailSkeleton";
import StatusBadge from "@/components/live-scores/StatusBadge";
import CricketMatchDetail from "@/components/live-scores/CricketMatchDetail";
import NFLMatchDetail from "@/components/live-scores/NFLMatchDetail";
import { hasAuthSession } from "@/lib/auth-api";
import { cricketApi, mapCricketMatch } from "@/lib/cricket-api";
import { mapNflMatch, mapSoccerMatch, nflApi, soccerApi } from "@/lib/sports-api";
import type { LiveScoreMatchDetail } from "@/types";

import { USE_STATIC_MOCK, MOCK_NFL_MATCH, MOCK_CRICKET_MATCH, MOCK_CRICKET_PROVIDER_DATA, MOCK_CRICKET_STATISTICS, MOCK_SOCCER_MATCH } from "@/lib/mock-data";

type ProviderRecord = Record<string, any>;
type SportKey = "cricket" | "football" | "nfl";

const rows = (value: ProviderRecord | undefined, keys: string[]) => {
  if (!value) return [] as ProviderRecord[];
  for (const key of keys) if (Array.isArray(value[key])) return value[key] as ProviderRecord[];
  return [] as ProviderRecord[];
};

const rawInfo = (data: ProviderRecord | null) => {
  const source = data?.items && !Array.isArray(data.items) ? data.items : data || {};
  return Array.isArray(source.match_info) ? source.match_info[0] || {} : source.match_info || source;
};

const rawPayload = (data: ProviderRecord | null) => data?.items && !Array.isArray(data.items) ? data.items : data || {};

function MatchDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = String(params.id || "");
  const requestedSport = String(searchParams.get("sport") || "").toLowerCase();
  const sport: SportKey = requestedSport === "football" || requestedSport === "soccer" ? "football" : requestedSport === "nfl" ? "nfl" : "cricket";
  const [match, setMatch] = useState<LiveScoreMatchDetail | null>(null);
  const [providerData, setProviderData] = useState<ProviderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "scorecard" | "statistics" | "lineups" | "timeline" | "commentary">("overview");
  const [cricketStatistics, setCricketStatistics] = useState<ProviderRecord | null>(null);
  const [cricketCommentary, setCricketCommentary] = useState<ProviderRecord | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const authenticated = USE_STATIC_MOCK || hasAuthSession();
      setIsAuthenticated(authenticated);
      setAuthChecked(true);
      if (!authenticated) setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const goToAuth = (path: "/login" | "/register" | "/signup") => {
    if (typeof window === "undefined") return;
    const nextPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const next = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    window.location.assign(`${path}${next}`);
  };

  useEffect(() => {
    if (!id || !authChecked || !isAuthenticated) return;
    let cancelled = false;

    if (USE_STATIC_MOCK) {
      if (sport === "nfl") {
        setMatch(MOCK_NFL_MATCH);
        setProviderData({
          events: [],
          commentaries: [],
          team_stats: [
            { name: "Total Yards", home: "384", away: "362" },
            { name: "Passing Yards", home: "298", away: "264" },
            { name: "Rushing Yards", home: "86", away: "98" },
            { name: "Turnovers", home: "0", away: "1" },
          ],
        });
      } else if (sport === "football") {
        setMatch(MOCK_SOCCER_MATCH);
        setProviderData({
          events: [
            { time: "23'", name: "Goal! Erling Haaland", team: "Manchester City" },
            { time: "44'", name: "Goal! Bukayo Saka", team: "Arsenal" },
            { time: "68'", name: "Goal! Erling Haaland", team: "Manchester City" },
          ],
          commentaries: [],
          team_stats: [
            { name: "Possession", home: "58%", away: "42%" },
            { name: "Shots on Target", home: "7", away: "4" },
          ],
        });
      } else {
        setMatch(MOCK_CRICKET_MATCH);
        setProviderData(MOCK_CRICKET_PROVIDER_DATA);
        setCricketStatistics(MOCK_CRICKET_STATISTICS);
        setCricketCommentary({ commentaries: MOCK_CRICKET_PROVIDER_DATA.commentaries });
      }
      setLoading(false);
      setError(null);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      setActiveTab("overview");
      try {
        let data: ProviderRecord;
        let mapped: LiveScoreMatchDetail;
        let statistics: ProviderRecord | null = null;
        let commentary: ProviderRecord | null = null;
        if (sport === "football") {
          data = await soccerApi.match(id);
          mapped = mapSoccerMatch(data);
        } else if (sport === "nfl") {
          data = await nflApi.match(id);
          mapped = mapNflMatch(data);
        } else {
          data = await cricketApi.match(id);
          mapped = mapCricketMatch(data);
          const latestInning = Number((data.match_info || data).latest_inning_number || 1);
          const [statisticsResult, commentaryResult] = await Promise.allSettled([
            cricketApi.statistics(id),
            cricketApi.commentary(id, latestInning),
          ]);
          if (statisticsResult.status === "fulfilled") statistics = statisticsResult.value;
          if (commentaryResult.status === "fulfilled") commentary = commentaryResult.value;
        }
        if (!cancelled) {
          setProviderData(data);
          setMatch(mapped);
          setCricketStatistics(statistics);
          setCricketCommentary(commentary);
        }
      } catch (requestError) {
        if (!cancelled) {
          setProviderData(null);
          setMatch(null);
          setCricketStatistics(null);
          setCricketCommentary(null);
          setError(requestError instanceof Error ? requestError.message : "Unable to load match details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [authChecked, id, isAuthenticated, sport]);

  useEffect(() => {
    if (!id || !authChecked || !isAuthenticated || typeof window === "undefined" || typeof EventSource === "undefined" || sport === "nfl") return undefined;
    const streamUrl = sport === "football" ? soccerApi.streamUrl() : cricketApi.streamUrl();
    const stream = new EventSource(streamUrl);
    const handleMatchUpdate = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { matchId?: string; match?: ProviderRecord };
        if (payload.matchId !== id || !payload.match) return;
        setProviderData((current) => ({
          ...(current || {}),
          ...payload.match,
          scorecard: payload.match?.scorecard || current?.scorecard,
          "match-playing11": payload.match?.["match-playing11"] || current?.["match-playing11"],
        }));
        setMatch(sport === "football" ? mapSoccerMatch(payload.match) : mapCricketMatch(payload.match));
      } catch {
        // Ignore malformed provider events.
      }
    };
    stream.addEventListener("match-update", handleMatchUpdate as EventListener);
    return () => { stream.removeEventListener("match-update", handleMatchUpdate as EventListener); stream.close(); };
  }, [authChecked, id, isAuthenticated, sport]);

  useEffect(() => {
    if (!authChecked || !isAuthenticated || sport !== "cricket") return undefined;
    const timer = window.setInterval(async () => {
      try {
        const data = await cricketApi.match(id);
        const latestInning = Number((data.match_info || data).latest_inning_number || 1);
        const [statisticsResult, commentaryResult] = await Promise.allSettled([
          cricketApi.statistics(id),
          cricketApi.commentary(id, latestInning),
        ]);
        setProviderData(data);
        setMatch(mapCricketMatch(data));
        if (statisticsResult.status === "fulfilled") setCricketStatistics(statisticsResult.value);
        if (commentaryResult.status === "fulfilled") setCricketCommentary(commentaryResult.value);
      } catch {
        // Keep the most recent provider snapshot visible if a refresh is unavailable.
      }
    }, 30000);
    return () => window.clearInterval(timer);
  }, [authChecked, id, isAuthenticated, sport]);

  useEffect(() => {
    if (!authChecked || !isAuthenticated || sport !== "nfl") return undefined;
    const timer = window.setInterval(async () => {
      try {
        const data = await nflApi.match(id);
        setProviderData(data);
        setMatch(mapNflMatch(data));
      } catch {
        // Keep the last cron-backed snapshot visible if a refresh is unavailable.
      }
    }, 30000);
    return () => window.clearInterval(timer);
  }, [authChecked, id, isAuthenticated, sport]);

  const payload = rawPayload(providerData);
  const info = rawInfo(providerData);
  const eventRows = rows(payload, ["event", "events"]);
  const commentaryRows = rows(payload, ["commentary", "commentaries"]);
  const teamStats = rows(payload, ["team_stats", "teamStats"]);
  const timeline = [...eventRows].reverse();

  if (!authChecked || loading) return <main className="bg-page"><MatchDetailSkeleton /></main>;
  if (!isAuthenticated) {
    return (
      <main className="font-outfit" style={{ background: "#FFFDF9", minHeight: "100vh" }}>
        <div className="container custom-container py-5">
          <div className="mx-auto text-center p-4 p-md-5 rounded-4 shadow-sm" style={{ maxWidth: "520px", background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-circle"
              style={{ width: "68px", height: "68px", color: "#1C1F22", background: "#FFCC00", fontSize: "1.6rem" }}
            >
              <i className="bi bi-lock-fill" />
            </div>
            <h2 className="fw-bold mb-2 font-space-grotesk" style={{ color: "#1C1F22" }}>Login required</h2>
            <p className="small mb-4" style={{ color: "#5C646D" }}>Please log in or create an account to view full match details.</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <button
                type="button"
                onClick={() => goToAuth("/login")}
                className="btn fw-bold px-4 py-2 rounded-pill shadow-sm"
                style={{ background: "#FFCC00", color: "#1C1F22", border: "none" }}
              >
                Log in to continue
              </button>
              <button
                type="button"
                onClick={() => goToAuth("/signup")}
                className="btn fw-semibold px-4 py-2 rounded-pill"
                style={{ background: "#FAF6EF", border: "1px solid #EAE5DC", color: "#1C1F22" }}
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  if (!match) return (
    <main className="d-flex flex-column align-items-center justify-content-center py-5 min-vh-100 font-outfit" style={{ background: "#FFFDF9" }}>
      <div className="text-center p-5 rounded-4 shadow-sm" style={{ maxWidth: "500px", background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
        <i className="bi bi-calendar2-x text-warning fs-1 mb-3 d-block"></i>
        <h3 className="fw-bold mb-2 font-space-grotesk" style={{ color: "#1C1F22" }}>Match Not Found</h3>
        <p className="small mb-4" style={{ color: "#5C646D" }}>{error || "The selected match details are currently unavailable."}</p>
        <Link href="/live-scores" className="btn fw-bold rounded-pill px-4 py-2 shadow-sm text-decoration-none" style={{ background: "#FFCC00", color: "#1C1F22" }}>
          Back to Live Scores
        </Link>
      </div>
    </main>
  );

  if (sport === "cricket") {
    return (
      <main className="container custom-container py-4 mb-5 font-outfit" style={{ background: "#FFFDF9", minHeight: "100vh" }}>
        <Link href="/live-scores" className="text-success text-decoration-none small d-inline-flex align-items-center gap-2 mb-4"><i className="bi bi-arrow-left" /> Back to Live Scores</Link>
        <CricketMatchDetail
          match={match}
          providerData={providerData || {}}
          statistics={cricketStatistics}
          commentary={cricketCommentary}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </main>
    );
  }

  if (sport === "nfl" && match.nflData) {
    return (
      <main className="container custom-container py-4 mb-5 font-outfit" style={{ background: "#FFFDF9", minHeight: "100vh" }}>
        <Link href="/live-scores?sport=nfl" className="text-decoration-none small d-inline-flex align-items-center gap-2 mb-4 fw-semibold" style={{ color: "#4A90E2" }}>
          <i className="bi bi-arrow-left" /> Back to Live Scores
        </Link>
        <section className="card rounded-4 p-4 mb-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div>
              <div className="text-success small fw-semibold text-uppercase">{match.competitionName}</div>
              <h1 className="h4 fw-bold mb-1 font-space-grotesk" style={{ color: "#1C1F22" }}>{match.matchName}</h1>
              <div className="text-muted small">{match.venue} · {match.matchTime}</div>
            </div>
            <StatusBadge status={match.matchStatus} />
          </div>
          <div className="row align-items-center g-3">
            <div className="col-5 text-center">
              <Image src={match.team1Logo} alt={match.team1Name} width={56} height={56} className="object-fit-contain mb-2" />
              <div className="fw-semibold font-space-grotesk" style={{ color: "#1C1F22" }}>{match.team1Name}</div>
              <div className="fw-bold fs-3 font-monospace" style={{ color: "#1C1F22" }}>{match.team1Score}</div>
            </div>
            <div className="col-2 text-center text-muted fw-bold">VS</div>
            <div className="col-5 text-center">
              <Image src={match.team2Logo} alt={match.team2Name} width={56} height={56} className="object-fit-contain mb-2" />
              <div className="fw-semibold font-space-grotesk" style={{ color: "#1C1F22" }}>{match.team2Name}</div>
              <div className="fw-bold fs-3 font-monospace" style={{ color: "#1C1F22" }}>{match.team2Score}</div>
            </div>
          </div>
          {match.note && <div className="mt-4 rounded-3 p-3 text-success bg-success bg-opacity-10 border border-success border-opacity-25">{match.note}</div>}
        </section>

        <NFLMatchDetail match={match} />
      </main>
    );
  }

  const teams = [{ name: match.team1Name, logo: match.team1Logo, score: match.team1Score }, { name: match.team2Name, logo: match.team2Logo, score: match.team2Score }];
  const tabs: Array<"overview" | "timeline" | "commentary"> = ["overview", "timeline", ...(commentaryRows.length ? ["commentary" as const] : [])];

  return (
    <main className="container custom-container py-4 mb-5 bg-page match-detail-page">
      <Link href="/live-scores" className="text-decoration-none small d-inline-flex align-items-center gap-2 mb-4 fw-semibold" style={{ color: "#4A90E2" }}><i className="bi bi-arrow-left"></i> Back to Live Scores</Link>
      <section className="card rounded-4 p-4 mb-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><div className="text-success small fw-semibold text-uppercase">{match.competitionName}</div><h1 className="h4 fw-bold mb-1 font-space-grotesk" style={{ color: "#1C1F22" }}>{match.matchName}</h1><div className="text-muted small">{match.venue} · {match.matchTime}</div></div><StatusBadge status={match.matchStatus} /></div>
        <div className="row align-items-center g-3">
          {teams.map((team, teamIndex) => <div className="col-5 text-center" key={`${match.id}-team-${teamIndex}-${team.name}`}><Image src={team.logo} alt={team.name} width={56} height={56} className="object-fit-contain mb-2" /><div className="fw-semibold font-space-grotesk" style={{ color: "#1C1F22" }}>{team.name}</div><div className="fw-bold fs-3 font-monospace" style={{ color: "#1C1F22" }}>{team.score}</div></div>)}
          <div className="col-2 text-center text-muted fw-bold">VS</div>
        </div>
        {match.note && <div className="mt-4 rounded-3 p-3 text-success bg-success bg-opacity-10 border border-success border-opacity-25">{match.note}</div>}
      </section>

      <div className="nav nav-pills custom-tabs gap-2 mb-4">{tabs.map((tab) => <button key={tab} type="button" className={`nav-link text-capitalize ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>

      {activeTab === "overview" && <section className="d-flex flex-column gap-4">
        <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}><h2 className="h6 fw-bold mb-3 font-space-grotesk" style={{ color: "#1C1F22" }}>Provider match information</h2><div className="row g-3"><div className="col-md-4"><span className="text-muted small d-block">Status</span><span style={{ color: "#1C1F22" }}>{match.matchStatus}</span></div><div className="col-md-4"><span className="text-muted small d-block">Competition</span><span style={{ color: "#1C1F22" }}>{match.competitionName}</span></div><div className="col-md-4"><span className="text-muted small d-block">Venue</span><span style={{ color: "#1C1F22" }}>{match.venue}</span></div></div></div>
        {teamStats.length > 0 && <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}><h2 className="h6 fw-bold mb-3 font-space-grotesk" style={{ color: "#1C1F22" }}>Team statistics</h2><div className="d-flex flex-column gap-2">{teamStats.map((stat, index) => <div key={index} className="d-flex justify-content-between border-bottom border-secondary border-opacity-10 py-2"><span className="text-muted">{stat.team_name || stat.name || stat.stat_name || "Statistic"}</span><span style={{ color: "#1C1F22" }}>{stat.value ?? stat.total ?? stat.home ?? "—"}</span></div>)}</div></div>}
        {sport === "nfl" && match.nflData && <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}><h2 className="h6 fw-bold mb-3 font-space-grotesk" style={{ color: "#1C1F22" }}>NFL game information</h2><div className="row g-3"><div className="col-6 col-md-3"><span className="text-muted small d-block">Quarter</span><span style={{ color: "#1C1F22" }}>{match.nflData.quarter || "—"}</span></div><div className="col-6 col-md-3"><span className="text-muted small d-block">Game clock</span><span style={{ color: "#1C1F22" }}>{match.nflData.gameClock}</span></div><div className="col-6 col-md-3"><span className="text-muted small d-block">Team 1 yards</span><span style={{ color: "#1C1F22" }}>{match.nflData.team1Stats.totalYards}</span></div><div className="col-6 col-md-3"><span className="text-muted small d-block">Team 2 yards</span><span style={{ color: "#1C1F22" }}>{match.nflData.team2Stats.totalYards}</span></div></div></div>}
        <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}><h2 className="h6 fw-bold mb-3 font-space-grotesk" style={{ color: "#1C1F22" }}>Raw provider fields</h2><div className="text-muted small">Live values are refreshed from Entity Sports. Detailed fields supplied by your plan are shown in the timeline and commentary tabs.</div><div className="mt-3 text-muted small">{Object.keys(info).length} provider fields received.</div></div>
      </section>}

      {activeTab === "timeline" && <section className="card rounded-4 p-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}><h2 className="h6 fw-bold mb-4 font-space-grotesk" style={{ color: "#1C1F22" }}>Match timeline</h2>{timeline.length ? <div className="d-flex flex-column gap-3">{timeline.map((event, index) => <div key={event.event_id || event.pid || index} className="border-start border-success border-3 ps-3"><div className="text-success small">{event.time || event.seconds || "Provider event"}</div><div style={{ color: "#1C1F22" }}>{event.text || event.name || event.event_name || event.type || "Match update"}</div>{event.team && <div className="text-muted small">{event.team}</div>}</div>)}</div> : <div className="text-muted">No timeline events were supplied by Entity Sports for this match.</div>}</section>}

      {activeTab === "commentary" && <section className="card rounded-4 p-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}><h2 className="h6 fw-bold mb-4 font-space-grotesk" style={{ color: "#1C1F22" }}>Commentary</h2><div className="d-flex flex-column gap-3">{commentaryRows.map((item, index) => <div key={item.id || index} className="border-bottom border-secondary border-opacity-10 pb-3"><span className="text-success small me-3">{item.time || item.over || "—"}</span><span style={{ color: "#1C1F22" }}>{item.sentence || item.commentary || item.text || "Provider update"}</span></div>)}</div></section>}
    </main>
  );
}

export default function MatchDetailPage() {
  return (
    <Suspense fallback={<main className="bg-page"><MatchDetailSkeleton /></main>}>
      <MatchDetailContent />
    </Suspense>
  );
}
