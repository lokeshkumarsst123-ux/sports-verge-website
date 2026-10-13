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
  if (typeof item.teams === "string" && item.teams.trim()) return item.teams;
  return "Team count unavailable";
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
      const mapped = responses.flatMap((response, index) => response.status === "fulfilled" ? response.value.data.items.map((article) => ({ image: article.image || "/assets/imgs/news/419499.6.webp", title: article.title, date: article.publishAt || article.createdAt || "", sport: index === 0 ? "Cricket" : index === 1 ? "Football" : "NFL" })) : []);
      if (!cancelled) setNews(mapped);
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  return <aside className="d-flex flex-column gap-4">
    <div className="bg-card border border-dark rounded-3 p-4"><h5 className="m-0 fw-bold border-start border-success border-3 ps-2 mb-4">Popular Competitions</h5><div className="d-flex flex-column gap-3">{competitions.length ? competitions.map((comp, index) => <Link key={`${comp.sport}-${comp.id}-${index}`} href="/fixtures" className="d-flex align-items-center justify-content-between p-2 rounded-3 text-decoration-none popular-comp-link"><div className="d-flex align-items-center gap-3"><div className="d-flex align-items-center justify-content-center bg-dark rounded p-1 border border-secondary border-opacity-10 w-32 h-32"><Image src={comp.logo} alt={comp.name} width={22} height={22} className="object-fit-contain" /></div><div><div className="text-light fw-semibold small">{comp.name}</div><div className="text-muted fs-11">{comp.sport}</div></div></div><span className="badge bg-secondary bg-opacity-30 text-light font-monospace fs-10">{comp.teams}</span></Link>) : <div className="text-muted small">No competitions returned by the providers.</div>}</div></div>
    {sidebarAd && <a href={sidebarAd.redirectUrl} className="position-relative overflow-hidden rounded-3 border border-dark d-flex align-items-end h-300 text-decoration-none" aria-label={sidebarAd.title}><Image src={sidebarAd.image} alt={sidebarAd.title} fill sizes="(max-width: 991px) 100vw, 320px" className="object-fit-cover ad-bg-img" /><div className="ad-overlay d-flex flex-column justify-content-end p-4 w-100 h-100 position-absolute top-0 start-0 ad-bg-gradient"><span className="badge bg-dark bg-opacity-70 text-success align-self-start mb-2 px-2 py-1 fs-9">ADVERTISEMENT</span><h6 className="text-white fw-bold mb-1">{sidebarAd.title}</h6></div></a>}
    <div className="bg-card border border-dark rounded-3 p-4"><h5 className="m-0 fw-bold border-start border-success border-3 ps-2 mb-4">Latest Sports News</h5><div className="d-flex flex-column gap-3">{news.length ? news.map((item, index) => <Link key={`${item.sport}-${index}`} href="/news" className="d-flex gap-3 text-decoration-none border-bottom border-secondary border-opacity-10 pb-3 news-item-link"><div className="flex-shrink-0 rounded overflow-hidden position-relative w-80 h-60"><img src={item.image || "/assets/imgs/news/419499.6.webp"} alt={item.title} className="w-100 h-100 object-fit-cover" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/assets/imgs/news/419499.6.webp"; }} /></div><div className="d-flex flex-column justify-content-center"><span className="text-success font-monospace mb-0.5 text-uppercase fw-semibold fs-9">{item.sport}</span><h6 className="news-title text-light fw-semibold mb-1 line-clamp-2">{item.title}</h6><span className="text-muted fs-10">{item.date}</span></div></Link>) : <div className="text-muted small">No provider news available.</div>}</div></div>
  </aside>;
}
