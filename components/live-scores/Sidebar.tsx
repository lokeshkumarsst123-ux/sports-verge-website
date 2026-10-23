"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cricketApi, cricketItems } from "@/lib/cricket-api";
import { nflApi, soccerApi } from "@/lib/sports-api";
import { contentApi } from "@/lib/content-api";
import { useAds } from "@/components/AdContext";

type Competition = { id: string; name: string; sport: string; logo: string; teams: string };
type News = { image: string; title: string; date: string; sport: string };
const logoFallback = "/assets/imgs/teams/team-placeholder.svg";

const formatCompetitionTeams = (item: Record<string, any>) => {
  const count = Number(item.total_teams ?? item.teams_count ?? item.team_count ?? item.teams?.length ?? item.teams ?? item.size ?? item.count);
  if (Number.isFinite(count) && count > 0) return `${count} Teams`;
  if (Array.isArray(item.teams) && item.teams.length > 0) return `${item.teams.length} Teams`;
  if (typeof item.teams === "string" && item.teams.trim() && item.teams !== "Team count unavailable") return item.teams;
  return "Official League";
};

const formatNewsDate = (dateStr: string) => {
  if (!dateStr) return "Just now";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
  } catch {
    // fallback
  }
  return dateStr.split("T")[0] || "Recent";
};

export default function Sidebar() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const { getAdByType } = useAds();
  const sidebarAd = getAdByType("Sidebar Advertisement");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const responses = await Promise.allSettled([cricketApi.competitions(), soccerApi.competitions(), nflApi.competitions()]);
      const mapped = responses.flatMap((response, index) => {
        if (response.status !== "fulfilled") return [];
        const items = index === 0 ? cricketItems(response.value) : Array.isArray(response.value.items) ? response.value.items : [];
        return items.slice(0, 3).map((item, itemIndex) => ({
          id: String(item.cid || item.competition_id || item.id || `${index}-${itemIndex}`),
          name: String(item.cname || item.title || item.name || "Competition"),
          sport: index === 0 ? "Cricket" : index === 1 ? "Football" : "NFL",
          logo: String(item.logo || item.logo_url || item.thumb_url || logoFallback),
          teams: formatCompetitionTeams(item),
        }));
      });
      if (!cancelled) setCompetitions(mapped);
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const responses = await Promise.allSettled(["cricket", "football", "nfl"].map((category) => contentApi.articles({ category, limit: 2 })));
      const mapped = responses.flatMap((response, index) =>
        response.status === "fulfilled"
          ? response.value.data.items.map((article) => ({
              image: article.image || "/assets/imgs/news/419499.6.webp",
              title: article.title,
              date: formatNewsDate(article.publishAt || article.createdAt || ""),
              sport: index === 0 ? "Cricket" : index === 1 ? "Football" : "NFL",
            }))
          : []
      );
      if (!cancelled) setNews(mapped);
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  return (
    <aside className="d-flex flex-column gap-4">
      {/* ── Popular Competitions ── */}
      <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: "#f1ece4" }}>
          <h6 className="fw-bold mb-0 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22", fontSize: "16px" }}>
            <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "16px", backgroundColor: "#ffcc00" }} />
            Popular Competitions
          </h6>
          <Link
            href="/fixtures"
            className="text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1 transition-all"
            style={{ color: "#8a7536", fontSize: "12px" }}
          >
            <span>All Fixtures</span>
            <i className="bi bi-chevron-right" style={{ fontSize: "10px" }} />
          </Link>
        </div>
        <div className="d-flex flex-column">
          {competitions.length ? (
            competitions.map((comp, index) => (
              <Link
                key={`${comp.sport}-${comp.id}-${index}`}
                href="/fixtures"
                className="d-flex align-items-center justify-content-between py-2 px-2 rounded-3 text-decoration-none transition-all sidebar-competition-item"
                style={{
                  borderBottom: index < competitions.length - 1 ? "1px solid #f3eee7" : "none",
                }}
              >
                <div className="d-flex align-items-center gap-2 min-w-0">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{ width: "34px", height: "34px", background: "#f8f6f0", border: "1px solid #eae5dc", padding: "4px" }}
                  >
                    <img
                      src={comp.logo}
                      alt={comp.name}
                      width={20}
                      height={20}
                      className="object-fit-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = logoFallback;
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="fw-semibold small text-truncate sidebar-competition-name" style={{ color: "#1c1f22", fontSize: "13px" }}>
                      {comp.name}
                    </div>
                    <div className="text-muted fw-medium" style={{ fontSize: "11px" }}>{comp.sport}</div>
                  </div>
                </div>
                <span
                  className="badge rounded-pill fw-semibold flex-shrink-0 ms-2"
                  style={{
                    background: "#faf8f5",
                    border: "1px solid #eae5dc",
                    color: "#64748b",
                    fontSize: "10.5px",
                    padding: "3px 8px",
                  }}
                >
                  {comp.teams}
                </span>
              </Link>
            ))
          ) : (
            <div className="text-muted small p-2">No competitions available right now.</div>
          )}
        </div>
      </div>

      {/* ── Sidebar Ad ── */}
      {sidebarAd && (
        <a
          href={sidebarAd.redirectUrl}
          className="position-relative overflow-hidden rounded-4 d-flex align-items-end text-decoration-none shadow-sm"
          style={{ height: "230px", border: "1px solid #eae5dc" }}
          aria-label={sidebarAd.title}
        >
          <Image
            src={sidebarAd.image}
            alt={sidebarAd.title}
            fill
            sizes="(max-width: 991px) 100vw, 360px"
            className="object-fit-cover"
          />
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-4"
            style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)",
            }}
          >
            <span
              className="badge rounded-pill fw-bold align-self-start mb-2 px-2.5 py-1"
              style={{ background: "#ffcc00", color: "#1c1f22", fontSize: "10px", letterSpacing: "0.04em" }}
            >
              SPONSORED
            </span>
            <h6 className="text-white fw-bold mb-0 font-space-grotesk">{sidebarAd.title}</h6>
          </div>
        </a>
      )}

      {/* ── Latest Sports News ── */}
      <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: "#f1ece4" }}>
          <h6 className="fw-bold mb-0 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22", fontSize: "16px" }}>
            <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "16px", backgroundColor: "#ffcc00" }} />
            Latest Sports News
          </h6>
          <Link
            href="/news"
            className="text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1 transition-all"
            style={{ color: "#8a7536", fontSize: "12px" }}
          >
            <span>View All</span>
            <i className="bi bi-chevron-right" style={{ fontSize: "10px" }} />
          </Link>
        </div>
        <div className="d-flex flex-column">
          {news.length ? (
            news.map((item, index) => {
              const sportColor = item.sport === "Cricket"
                ? { text: "#15803d", bg: "rgba(22, 163, 74, 0.08)", border: "rgba(22, 163, 74, 0.2)" }
                : item.sport === "NFL"
                ? { text: "#b45309", bg: "rgba(217, 119, 6, 0.08)", border: "rgba(217, 119, 6, 0.2)" }
                : { text: "#1d4ed8", bg: "rgba(37, 99, 235, 0.08)", border: "rgba(37, 99, 235, 0.2)" };

              return (
                <Link
                  key={`${item.sport}-${index}`}
                  href="/news"
                  className="d-flex gap-3 text-decoration-none align-items-center py-2 px-2 rounded-3 transition-all sidebar-news-item"
                  style={{
                    borderBottom: index < news.length - 1 ? "1px solid #f3eee7" : "none",
                  }}
                >
                  <div
                    className="flex-shrink-0 rounded-3 overflow-hidden position-relative"
                    style={{ width: "76px", height: "58px", background: "#f8f6f0", border: "1px solid #eae5dc" }}
                  >
                    <img
                      src={item.image || "/assets/imgs/news/419499.6.webp"}
                      alt={item.title}
                      className="w-100 h-100 object-fit-cover transition-all"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/assets/imgs/news/419499.6.webp";
                      }}
                    />
                  </div>
                  <div className="d-flex flex-column justify-content-center min-w-0 flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span
                        className="badge rounded-pill fw-bold"
                        style={{
                          fontSize: "9.5px",
                          padding: "2px 7px",
                          letterSpacing: "0.03em",
                          color: sportColor.text,
                          backgroundColor: sportColor.bg,
                          border: `1px solid ${sportColor.border}`,
                        }}
                      >
                        {item.sport}
                      </span>
                      <span className="text-muted d-inline-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                        <i className="bi bi-clock" style={{ fontSize: "10px", color: "#9ca3af" }} />
                        {item.date}
                      </span>
                    </div>
                    <div
                      className="fw-semibold sidebar-news-title"
                      style={{
                        color: "#1c1f22",
                        fontSize: "13px",
                        lineHeight: 1.35,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.title}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-muted small p-2">No news updates available.</div>
          )}
        </div>
      </div>
    </aside>
  );
}
