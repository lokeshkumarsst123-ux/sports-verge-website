"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { newsArticles } from "@/data/newsData";
import PageHeader from "@/components/PageHeader";
import { useAds } from "@/components/AdContext";

const categoryConfig = [
  { name: "All News", icon: "bi-grid-fill", color: "#22c55e" },
  { name: "Cricket", icon: "bi-trophy-fill", color: "#22c55e" },
  { name: "Football", icon: "bi-dribbble", color: "#3b82f6" },
  { name: "NFL", icon: "bi-shield-fill", color: "#f59e0b" },
  { name: "AFL", icon: "bi-circle-fill", color: "#ec4899" },
  { name: "General Sports", icon: "bi-globe2", color: "#8b5cf6" },
];

function NewsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All News";

  const { getAdByType } = useAds();
  const [activeCategory, setActiveCategory] = useState<string>("All News");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newsAd, setNewsAd] = useState<any>(null);

  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (getAdByType) {
      setNewsAd(getAdByType("Homepage Banner") || getAdByType("Sidebar Advertisement"));
    }
  }, [getAdByType]);

  const filteredArticles = useMemo(() => {
    return newsArticles.filter((article) => {
      const matchesCategory =
        activeCategory === "All News" ||
        article.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const { featuredArticle, standardArticles } = useMemo(() => {
    if (filteredArticles.length === 0) return { featuredArticle: null, standardArticles: [] };
    return { featuredArticle: filteredArticles[0], standardArticles: filteredArticles.slice(1) };
  }, [filteredArticles]);

  return (
    <div className="container custom-container py-4">

      {/* ─── Page Header ─── */}
      <PageHeader
        title="News"
        subtitle="Stay ahead with the latest happenings, insights, and match commentaries."
        className="mb-4 px-0"
      >
        <div className="position-relative w-100" style={{ maxWidth: "400px" }}>
          <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ fontSize: "14px", pointerEvents: "none" }}></i>
          <input
            type="text"
            placeholder="Search articles, authors..."
            className="form-control text-white rounded-pill ps-5 pe-4 py-2"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: "13px",
              color: "#fff",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHeader>

      {/* ─── Category Tabs ─── */}
      <div className="d-flex flex-wrap gap-2 mb-5 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {categoryConfig.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => { setActiveCategory(cat.name); setSearchQuery(""); }}
              className="btn d-flex align-items-center gap-2 transition-all fw-semibold"
              style={{
                borderRadius: "999px",
                fontSize: "13px",
                padding: "7px 18px",
                background: isActive ? "#22c55e" : "rgba(255,255,255,0.06)",
                border: isActive ? "1px solid #22c55e" : "1px solid rgba(255,255,255,0.1)",
                color: isActive ? "#000" : "#d1d5db",
              }}
            >
              <i className={`bi ${cat.icon}`} style={{ fontSize: "12px", color: isActive ? "#000" : cat.color }}></i>
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* ─── Featured Article ─── */}
      {featuredArticle && (
        <div className="mb-5">
          <Link href={`/news/${featuredArticle.id}`} className="text-decoration-none">
            <div
              className="rounded-4 overflow-hidden position-relative transition-all hover-glow"
              style={{ minHeight: "400px", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Background image */}
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-100 h-100 object-fit-cover position-absolute"
                style={{ inset: 0 }}
              />
              {/* Gradient overlay */}
              <div
                className="position-absolute w-100 h-100"
                style={{
                  inset: 0,
                  background: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.1) 100%)",
                }}
              ></div>

              {/* Content */}
              <div className="position-relative d-flex align-items-center h-100 p-4 p-lg-5" style={{ minHeight: "400px" }}>
                <div style={{ maxWidth: "520px" }}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-success rounded-pill px-3 py-1 fw-bold" style={{ fontSize: "10px", letterSpacing: "0.08em" }}>
                      ★ FEATURED
                    </span>
                    <span className="badge rounded-pill px-3 py-1 fw-semibold" style={{ fontSize: "10px", background: "rgba(255,255,255,0.12)", color: "#d1d5db" }}>
                      {featuredArticle.category}
                    </span>
                  </div>

                  <h2 className="fw-bold text-white mb-3 font-space-grotesk lh-sm" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
                    {featuredArticle.title}
                  </h2>

                  <p className="text-muted mb-4 lh-lg" style={{ fontSize: "14px" }}>
                    {featuredArticle.summary}
                  </p>

                  <div className="d-flex align-items-center gap-3 mb-4">
                    {featuredArticle.authorImage && (
                      <img
                        src={featuredArticle.authorImage}
                        alt={featuredArticle.author}
                        className="rounded-circle"
                        style={{ width: "28px", height: "28px", objectFit: "cover", border: "2px solid rgba(34,197,94,0.4)" }}
                      />
                    )}
                    <span className="text-success fw-semibold" style={{ fontSize: "12px" }}>{featuredArticle.author}</span>
                    <span className="text-muted" style={{ fontSize: "12px" }}>· {featuredArticle.date} · {featuredArticle.readTime}</span>
                  </div>

                  <span
                    className="btn btn-success fw-bold rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2"
                    style={{ fontSize: "13px" }}
                  >
                    Read Full Article <i className="bi bi-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ─── Main Grid + Sidebar ─── */}
      <div className="row g-4">
        {/* Articles Grid */}
        <div className={newsAd ? "col-lg-8" : "col-12"}>
          {filteredArticles.length === 0 ? (
            <div className="text-center py-5 rounded-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-dark)" }}>
              <i className="bi bi-journal-x text-muted mb-3 d-block" style={{ fontSize: "3.5rem", opacity: 0.3 }}></i>
              <h4 className="text-white fw-semibold mb-2">No Articles Found</h4>
              <p className="text-muted small mb-0">Try a different category or adjust your search.</p>
            </div>
          ) : (
            <div className="row g-4" style={{ gridAutoRows: "1fr" }}>
              {standardArticles.map((article) => (
                <div key={article.id} className="col-md-6">
                  <Link href={`/news/${article.id}`} className="text-decoration-none d-block h-100">
                    <div
                      className="rounded-3 overflow-hidden h-100 d-flex flex-column transition-all hover-translate"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}
                    >
                      {/* Thumbnail */}
                      <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-100 h-100 object-fit-cover transition-all"
                          style={{ transition: "transform 0.4s ease" }}
                        />
                        <span
                          className="position-absolute top-0 end-0 m-2 badge rounded-pill fw-semibold"
                          style={{ fontSize: "10px", background: "rgba(0,0,0,0.75)", color: "#86efac", border: "1px solid rgba(34,197,94,0.3)", backdropFilter: "blur(8px)" }}
                        >
                          {article.category}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-4 d-flex flex-column flex-grow-1">
                        {/* Author */}
                        <div className="d-flex align-items-center gap-2 mb-2">
                          {article.authorImage && (
                            <img src={article.authorImage} alt={article.author} className="rounded-circle" style={{ width: "18px", height: "18px", objectFit: "cover" }} />
                          )}
                          <span className="text-muted" style={{ fontSize: "11px" }}>{article.author}</span>
                          <span className="text-muted" style={{ fontSize: "11px" }}>· {article.date}</span>
                        </div>

                        {/* Title */}
                        <h5 className="text-white fw-semibold mb-2 lh-sm hover-text-success transition-all" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                          {article.title}
                        </h5>

                        {/* Summary */}
                        <p className="text-muted mb-3 flex-grow-1" style={{ fontSize: "12px", lineHeight: "1.7", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {article.summary}
                        </p>

                        {/* Footer */}
                        <div
                          className="d-flex align-items-center justify-content-between pt-3"
                          style={{ borderTop: "1px solid var(--border-dark)" }}
                        >
                          <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                            <i className="bi bi-clock text-success" style={{ fontSize: "11px" }}></i>
                            {article.readTime}
                          </span>
                          <span className="fw-semibold text-success d-flex align-items-center gap-1" style={{ fontSize: "12px" }}>
                            Read More <i className="bi bi-arrow-right-short"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Sidebar Ad ─── */}
        {newsAd && (
          <div className="col-lg-4">
            <div className="sticky-lg-top" style={{ top: "90px" }}>
              <div className="rounded-4 p-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                <p className="text-muted text-uppercase fw-semibold mb-3" style={{ fontSize: "10px", letterSpacing: "0.12em" }}>
                  Sponsor Showcase
                </p>

                <div className="rounded-3 overflow-hidden position-relative mb-4" style={{ height: "120px", border: "1px solid var(--border-dark)" }}>
                  <a href={newsAd.redirectUrl} target="_blank" rel="noopener noreferrer" className="d-block w-100 h-100">
                    <img src={newsAd.image} alt={newsAd.title} className="w-100 h-100 object-fit-cover" />
                  </a>
                  <span
                    className="position-absolute top-0 end-0 m-2 badge font-monospace"
                    style={{ fontSize: "9px", background: "rgba(0,0,0,0.75)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
                  >
                    SPONSOR
                  </span>
                </div>

                <h6 className="text-white fw-bold mb-1">{newsAd.title}</h6>
                <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                  Premium sports coverage and partnerships curated for SportsVerge elite users.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <main className="min-vh-100 font-outfit text-white" style={{ background: "var(--bg-dark)", paddingTop: "8px", paddingBottom: "60px" }}>
      <Suspense
        fallback={
          <div className="container custom-container py-5 text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      >
        <NewsContent />
      </Suspense>
    </main>
  );
}
