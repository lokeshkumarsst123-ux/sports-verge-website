"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { cricketApi, type CricketBettingOddsCard } from "@/lib/cricket-api";

const PAGE_SIZE = 5;

export default function BettingOddsPage() {
  const [cards, setCards] = useState<CricketBettingOddsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Betting Odds & Analytics - The SportsVerge";
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

  return (
    <main className="font-outfit odds-page">
      <PageHeader
        title="Betting Odds & Analytics"
        subtitle="Live match odds, updated automatically when available."
        className="odds-page-header"
      />

      <section className="container custom-container odds-content">
        {loading ? (
          <div className="odds-state" role="status">Loading the latest odds...</div>
        ) : cards.length ? (
          <>
            <div className="odds-list">
              {cards.map((card) => (
                <article className="odds-match-card" key={card.id}>
                  <div className="odds-card-meta">
                    <div className="odds-card-label">
                      <span className="odds-sport-badge">Cricket</span>
                      <span>{card.competition} - {card.label}</span>
                    </div>
                    <span className="odds-provider-status">{card.status}</span>
                  </div>
                  <h2>{card.home} <span>vs</span> {card.away}</h2>
                  <div className="odds-options">
                    <div className="odds-option">
                      <span>1 (Home)</span>
                      <strong>{card.homeOdds}</strong>
                    </div>
                    <div className="odds-option">
                      <span>X (Draw)</span>
                      <strong>{card.drawOdds}</strong>
                    </div>
                    <div className="odds-option">
                      <span>2 (Away)</span>
                      <strong>{card.awayOdds}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {(page > 1 || hasNextPage) && (
              <>
                <div className="ranking-pagination">
                  <button type="button" disabled={page === 1 || refreshing} onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}>Previous</button>
                  <span>Page {page}</span>
                  <button type="button" disabled={!hasNextPage || refreshing} onClick={() => setPage((currentPage) => currentPage + 1)}>Next</button>
                </div>
                <div className="ranking-pagination-summary">
                  Showing {((page - 1) * PAGE_SIZE) + 1}-{((page - 1) * PAGE_SIZE) + cards.length} of live odds
                </div>
              </>
            )}
          </>
        ) : (
          <div className="odds-state odds-empty-state" role="status">
            <strong>Live odds are currently unavailable.</strong>
            <span>{message}</span>
          </div>
        )}
      </section>
    </main>
  );
}
