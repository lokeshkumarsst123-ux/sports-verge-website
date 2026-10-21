"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cricketApi, cricketItems, mapCompetitionStandings } from "@/lib/cricket-api";
import { mapProviderStandings, nflApi, soccerApi, type ProviderStandingRow } from "@/lib/sports-api";

type Sport = "cricket" | "football" | "NFL" | "AFL";
type Competition = { id: string; name: string };

const tabs: Sport[] = ["cricket", "football", "NFL", "AFL"];
const placeholderLogo = "/assets/imgs/teams/team-placeholder.svg";

const imageUrl = (value: string) => value || placeholderLogo;

export default function Standings() {
  const [sport, setSport] = useState<Sport>("football");
  const [competitions, setCompetitions] = useState<Record<Sport, Competition[]>>({ cricket: [], football: [], NFL: [], AFL: [] });
  const [selected, setSelected] = useState("");
  const [rows, setRows] = useState<ProviderStandingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const competitionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const loadCompetitions = async () => {
      const responses = await Promise.allSettled([cricketApi.competitions(), soccerApi.competitions(), nflApi.competitions()]);
      const next: Record<Sport, Competition[]> = { cricket: [], football: [], NFL: [], AFL: [] };
      responses.forEach((response, index) => {
        if (response.status !== "fulfilled") return;
        const items = index === 0 ? cricketItems(response.value) : Array.isArray(response.value.items) ? response.value.items : [];
        const key: Sport = index === 0 ? "cricket" : index === 1 ? "football" : "NFL";
        next[key] = items
          .map((item) => ({
            id: String(item.cid || item.id || ""),
            name: String(item.title || item.cname || item.name || item.short_name || "Competition").trim(),
          }))
          .filter((item) => item.id && item.name);
      });
      if (!cancelled) setCompetitions(next);
    };
    void loadCompetitions();
    return () => { cancelled = true; };
  }, []);

  const available = competitions[sport];

  useEffect(() => {
    setSelected(available[0]?.id || "");
  }, [available]);

  useEffect(() => {
    let cancelled = false;
    if (!selected) {
      setRows([]);
      setMessage("No standings available");
      setLoading(false);
      return () => { cancelled = true; };
    }

    setLoading(true);
    const loadRows = async () => {
      try {
        const data = sport === "cricket"
          ? await cricketApi.competition(selected)
          : sport === "football"
            ? await soccerApi.competition(selected)
            : await nflApi.competition(selected);
        const next = sport === "cricket"
          ? mapCompetitionStandings(data).map((row) => ({ rank: row.rank, team: row.team, teamLogo: row.teamLogo, played: row.p, wins: row.w, draws: "—", losses: row.l, points: row.pts, goalDifference: row.nrr, change: "0", trend: "flat" as const }))
          : mapProviderStandings(data);
        if (!cancelled) {
          setRows(next);
          setMessage(next.length ? null : "No standings available");
        }
      } catch (error) {
        if (!cancelled) {
          setRows([]);
          setMessage(error instanceof Error ? error.message : "Unable to load standings.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void loadRows();
    return () => { cancelled = true; };
  }, [selected, sport]);

  return (
    <section className="standings-section bg-card rounded-4 border mt-4 p-4 standings-section-wrap">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h5 m-0 fw-bold border-start border-3 ps-2 widget-heading">Standings</h2>
        <Link href="/standings" className="small widget-view-all">View Table <i className="bi bi-chevron-right" /></Link>
      </div>

      <div className="nav nav-pills custom-tabs flex-nowrap overflow-auto scrollbar-none gap-2 mb-3">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            className={`nav-link text-capitalize ${sport === item ? "active" : ""}`}
            onClick={() => setSport(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="position-relative border-top border-bottom py-2 mb-3 standings-divider">
        <div ref={competitionRef} className="d-flex gap-2 overflow-auto scrollbar-none standings-competition-scroll">
          {available.length ? available.slice(0, 10).map((competition) => (
            <button
              type="button"
              key={competition.id}
              className={`btn btn-sm flex-shrink-0 standings-competition-pill ${selected === competition.id ? "active" : ""}`}
              onClick={() => setSelected(competition.id)}
            >
              {competition.name}
            </button>
          )) : <span className="small px-2 py-2 widget-empty-text">Loading competitions…</span>}
        </div>
        {available.length > 4 && <button type="button" className="standings-scroll-arrow" onClick={() => competitionRef.current?.scrollBy({ left: 180, behavior: "smooth" })} aria-label="More competitions"><i className="bi bi-chevron-right" /></button>}
      </div>

      <div className="table-responsive standings-table-wrap">
        <table className="table table-borderless align-middle mb-0 standings-table standings-table-custom">
          <thead className="standings-thead-custom">
            <tr><th>#</th><th>TEAM</th><th>P</th><th>GD</th><th>PTS</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="text-center py-4 widget-empty-text">Loading…</td></tr> : rows.length ? rows.slice(0, 6).map((row, index) => (
              <tr key={`${row.rank}-${row.team}-${index}`} className="standings-row-custom">
                <td className="standings-rank-custom">{row.rank}</td>
                <td><div className="d-flex align-items-center gap-2 fw-bold standings-team-name-custom"><img src={imageUrl(row.teamLogo)} alt="" width={22} height={22} className="standings-team-logo" onError={(event) => { if (!event.currentTarget.src.endsWith(placeholderLogo)) event.currentTarget.src = placeholderLogo; }} /><span className="text-truncate">{row.team}</span></div></td>
                <td className="standings-stat-custom">{row.played}</td>
                <td className="standings-stat-custom">{row.goalDifference}</td>
                <td className="standings-points-custom">{row.points}</td>
              </tr>
            )) : <tr><td colSpan={5} className="text-center py-4 widget-empty-text">{message || "No standings available"}</td></tr>}
          </tbody>
        </table>
      </div>

      <Link href="/standings" className="btn w-100 mt-3 p-2.5 rounded-pill text-uppercase widget-btn-cta">All Standings</Link>
    </section>
  );
}
