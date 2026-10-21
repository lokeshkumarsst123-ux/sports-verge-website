"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { contentApi, type PublicNewsArticle } from "@/lib/content-api";

const FALLBACK_IMAGE = "/assets/imgs/banner/news-banner_1.webp";

export default function Hero() {
  const [articles, setArticles] = useState<PublicNewsArticle[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;

    contentApi
      .articles({ limit: 5 })
      .then((result) => {
        if (cancelled) return;
        setArticles(result.data.items);
        setActive(0);
      })
      .catch(() => {
        if (!cancelled) setArticles([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (articles.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % articles.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [articles.length]);

  const article = articles[active];

  if (!article) {
    return (
      <section className="featured-news-section mb-4 rounded-3 border border-dark p-5 text-center text-muted">
        No featured news available.
      </section>
    );
  }

  const previous = () => setActive((index) => (index - 1 + articles.length) % articles.length);
  const next = () => setActive((index) => (index + 1) % articles.length);

  return (
    <section className="featured-news-section mb-4">
      <div className="carousel-inner border border-dark rounded-3 overflow-hidden position-relative">
        <div className="custom-carousel-item active">
          <Link href={`/news/${article.id}`} className="d-block text-decoration-none position-relative">
            <img
              src={article.image || FALLBACK_IMAGE}
              alt={article.title}
              className="featured-img w-100 featured-img-cover d-block"
              loading="eager"
              onError={(event) => {
                if (!event.currentTarget.src.endsWith(FALLBACK_IMAGE)) {
                  event.currentTarget.src = FALLBACK_IMAGE;
                }
              }}
            />
            <div className="featured-overlay" />
            <div className="carousel-caption custom-caption w-75 text-start hero-caption-custom">
              <span className="badge fw-bold mb-3 rounded-pill hero-badge-custom">
                FEATURED NEWS
              </span>
              <h2 className="fw-bold mb-2 hero-title-custom text-white-force">
                {article.title}
              </h2>
              <p className="small mb-3 hero-summary-custom text-white-force">
                {article.summary}
              </p>
              <span className="btn fw-bold px-4 py-2 rounded-pill shadow-sm d-inline-flex align-items-center hero-btn-custom">
                Read Full Story <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>

        {articles.length > 1 && (
          <>
            <div className="carousel-indicators custom-indicators">
              {articles.map((item, index) => (
                <button
                  key={`${item.id}-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  className={index === active ? "active" : ""}
                  aria-label={`Slide ${index + 1}`}
                  aria-current={index === active ? "true" : undefined}
                />
              ))}
            </div>

            <div className="carousel-controls-custom">
              <button type="button" className="btn-dark-control" onClick={previous} aria-label="Previous featured story">
                <i className="bi bi-chevron-left" aria-hidden="true" />
              </button>
              <button type="button" className="btn-dark-control" onClick={next} aria-label="Next featured story">
                <i className="bi bi-chevron-right" aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
