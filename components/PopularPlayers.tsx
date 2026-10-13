"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PlayerItem } from "@/types";
import { cricketApi } from "@/lib/cricket-api";
import { nflApi, soccerApi } from "@/lib/sports-api";

const PLAYER_PLACEHOLDER = "/assets/imgs/players/player-placeholder.svg";

const playerImage = (player: any) => {
  const value = [player.image, player.image_url, player.photo, player.photo_url, player.profile_image, player.player_image, player.logo_url, player.logo]
    .find((item) => typeof item === "string" && item.trim() && item.trim() !== "null");
  const source = String(value || PLAYER_PLACEHOLDER).trim();
  if (source.startsWith("//")) return `https:${source}`;
  if (source.startsWith("/") || /^https?:\/\//i.test(source)) return source;
  return PLAYER_PLACEHOLDER;
};

export default function PopularPlayers() {
  const [players, setPlayers] = useState<PlayerItem[]>([]);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const responses = await Promise.allSettled([cricketApi.matches("result"), soccerApi.matches("result"), nflApi.matches("result")]);
      const next: PlayerItem[] = [];
      for (let index = 0; index < responses.length; index += 1) {
        const response = responses[index];
        if (response.status !== "fulfilled") continue;
        const raw = response.value[0];
        const id = String(raw?.mid || raw?.match_id || "");
        if (!id) continue;
        try {
          const data: any = index === 0 ? await cricketApi.match(id) : index === 1 ? await soccerApi.match(id) : await nflApi.match(id);
          const source = data?.items && !Array.isArray(data.items) ? data.items : data;
          const lists = index === 2 ? [...(source?.playerstats?.home || []), ...(source?.playerstats?.away || [])] : [...(source?.players || []), ...(source?.player_stats || [])];
          next.push(...lists.slice(0, 4).map((player: any) => ({ name: String(player.name || player.player_name || player.title || "Provider player"), team: String(player.team_name || player.team || "Provider team"), image: playerImage(player), sport: (index === 0 ? "cricket" : index === 1 ? "football" : "NFL") as PlayerItem["sport"] })));
        } catch { /* Player details may be unavailable for this match. */ }
      }
      if (!cancelled) setPlayers(next);
    };
    void load();
    return () => { cancelled = true; };
  }, []);
  return <section className="popular-players bg-card rounded-3 p-4 border border-dark mt-4"><div className="d-flex justify-content-between align-items-center mb-4"><h2 className="h5 m-0 fw-semibold border-start border-success border-3 ps-2">Popular Players</h2><Link href="/stats" className="text-success text-decoration-none small fw-medium">View All</Link></div><div className="fixtures-scroll-container d-flex gap-3 overflow-auto">{players.length ? players.map((player, index) => <Link key={`${player.name}-${index}`} href="/stats" className="player-card flex-shrink-0 d-block text-center text-decoration-none rounded-3 border border-dark overflow-hidden"><div className="player-img-wrapper"><img src={player.image || PLAYER_PLACEHOLDER} alt={player.name} width={160} height={185} className="w-100 player-thumb" onError={(event) => { if (!event.currentTarget.src.endsWith(PLAYER_PLACEHOLDER)) event.currentTarget.src = PLAYER_PLACEHOLDER; }} /></div><div className="player-info p-2"><div className="fw-semibold text-light text-truncate fs-13">{player.name}</div><div className="text-muted text-truncate fs-11">{player.team} · {player.sport}</div></div></Link>) : <div className="text-center text-muted w-100 py-4 small">No provider player statistics available.</div>}</div></section>;
}
