"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { newsArticles } from "@/data/newsData";
import { useAds } from "@/components/AdContext";

export default function NewsDetailsPage() {
  const { id } = useParams();
  const { getAdByType } = useAds();

  const [copied, setCopied] = useState(false);
  const [articleAd, setArticleAd] = useState<any>(null);

  const article = useMemo(() => {
    if (!id) return null;
    return newsArticles.find((a) => a.id === id) || null;
  }, [id]);

  useEffect(() => {
    if (article && getAdByType) {
      setArticleAd(getAdByType("Article Advertisement"));
    }
  }, [article, getAdByType]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return newsArticles
      .filter((a) => a.category === article.category && a.id !== article.id)
      .slice(0, 3);
  }, [article]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const categories = [
    { name: "Cricket", icon: "bi-trophy-fill", color: "#22c55e" },
    { name: "Football", icon: "bi-dribbble", color: "#3b82f6" },
    { name: "NFL", icon: "bi-shield-fill", color: "#f59e0b" },
    { name: "AFL", icon: "bi-circle-fill", color: "#ec4899" },
    { name: "General Sports", icon: "bi-globe2", color: "#8b5cf6" },
  ];

  if (!article) {
    return (
      <main className="font-outfit text-white">
        <div className="text-center p-5 bg-card border border-dark rounded-4 shadow-lg" style={{ maxWidth: "480px" }}>
          <div className="mb-4" style={{ fontSize: "4rem" }}>📰</div>
          <h2 className="fw-bold mb-2 text-white">Article Not Found</h2>
          <p className="text-muted small mb-4">
            The news article you are looking for does not exist or has been archived.
          </p>
          <Link href="/news" className="btn btn-success fw-bold px-5 py-2 rounded-pill">
            ← Back to News
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="font-outfit text-white">
      <div className="container custom-container">

        {/* ─── Breadcrumb ─── */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0 align-items-center" style={{ background: "none", padding: 0 }}>
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none text-muted hover-text-success d-flex align-items-center gap-1 fs-13">
                <i className="bi bi-house-door-fill"></i> Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/news" className="text-decoration-none text-muted hover-text-success fs-13">
                News
              </Link>
            </li>
            <li className="breadcrumb-item active d-flex align-items-center" aria-current="page">
              <span className="badge bg-success rounded-pill px-3 py-1 fs-11 fw-semibold">
                {article.category}
              </span>
            </li>
          </ol>
        </nav>

        <div className="row g-4 g-lg-5">
          {/* ─── Main Article ─── */}
          <div className="col-lg-8">
            <article>
              {/* Category + Read Time */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="badge bg-success rounded-pill px-3 py-2 fs-11 text-uppercase fw-bold letter-spacing-1">
                  {article.category}
                </span>
                <span className="text-muted fs-12 d-flex align-items-center gap-1">
                  <i className="bi bi-clock text-success"></i>
                  {article.readTime}
                </span>
              </div>

              {/* Title */}
              <h1 className="fw-bold text-white mb-4 lh-sm font-space-grotesk" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
                {article.title}
              </h1>

              {/* Author Bar + Share */}
              <div
                className="d-flex flex-wrap align-items-center justify-content-between gap-3 rounded-3 mb-4 p-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="d-flex align-items-center gap-3">
                  {article.authorImage && (
                    <img
                      src={article.authorImage}
                      alt={article.author}
                      className="rounded-circle"
                      style={{ width: "42px", height: "42px", objectFit: "cover", border: "2px solid rgba(34,197,94,0.4)" }}
                    />
                  )}
                  <div>
                    <span className="text-white fw-semibold d-block" style={{ fontSize: "13px" }}>{article.author}</span>
                    <span className="text-muted" style={{ fontSize: "11px" }}>Published on {article.date}</span>
                  </div>
                </div>

                {/* Share buttons */}
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted fw-semibold d-none d-sm-inline me-1" style={{ fontSize: "11px", letterSpacing: "0.08em" }}>SHARE:</span>
                  {[
                    { href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`, icon: "bi-twitter-x", title: "Share on X" },
                    { href: "https://www.facebook.com/", icon: "bi-facebook", title: "Share on Facebook" },
                    { href: "https://www.linkedin.com/", icon: "bi-linkedin", title: "Share on LinkedIn" },
                  ].map((s) => (
                    <a
                      key={s.icon}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.title}
                      className="d-flex align-items-center justify-content-center text-white transition-all"
                      style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        fontSize: "13px",
                        textDecoration: "none",
                      }}
                    >
                      <i className={`bi ${s.icon}`}></i>
                    </a>
                  ))}
                  <button
                    onClick={handleCopyLink}
                    className="btn btn-sm d-flex align-items-center gap-1 fw-semibold transition-all"
                    style={{
                      background: copied ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.07)",
                      border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.12)"}`,
                      color: copied ? "#22c55e" : "#fff",
                      borderRadius: "20px",
                      fontSize: "11px",
                      padding: "5px 12px",
                    }}
                  >
                    <i className={`bi ${copied ? "bi-check-lg" : "bi-link-45deg"}`}></i>
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              {/* Hero Image */}
              <div className="rounded-4 overflow-hidden mb-5 border border-dark" style={{ height: "420px" }}>
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-100 h-100 object-fit-cover"
                />
              </div>

              {/* Article Body */}
              <div className="mb-5">
                <p
                  className="fw-semibold lh-lg mb-4 ps-3"
                  style={{ fontSize: "15px", color: "#86efac", borderLeft: "3px solid #22c55e", fontStyle: "italic" }}
                >
                  {article.summary}
                </p>
                {article.content.split("\n\n").map((p, idx) => (
                  <p key={idx} className="lh-lg text-light mb-4" style={{ fontSize: "15px", lineHeight: "1.85" }}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Sponsor Ad */}
              {articleAd && (
                <div
                  className="rounded-4 p-4 text-center mb-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <p className="text-muted text-uppercase fw-semibold mb-3" style={{ fontSize: "10px", letterSpacing: "0.12em" }}>
                    Featured Partnership
                  </p>
                  <div className="rounded-3 overflow-hidden position-relative mb-3" style={{ height: "160px" }}>
                    <a href={articleAd.redirectUrl} target="_blank" rel="noopener noreferrer" className="d-block w-100 h-100">
                      <img src={articleAd.image} alt={articleAd.title} className="w-100 h-100 object-fit-cover" />
                    </a>
                    <span
                      className="position-absolute top-0 end-0 m-2 badge font-monospace"
                      style={{ fontSize: "9px", background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
                    >
                      SPONSOR
                    </span>
                  </div>
                  <h6 className="text-white fw-bold mb-1">{articleAd.title}</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "11px" }}>
                    Sponsored content supports high-quality sports journalism on SportsVerge.
                  </p>
                </div>
              )}

              {/* Tags row */}
              <div className="d-flex align-items-center gap-2 flex-wrap border-top pt-4 mt-2" style={{ borderColor: "rgba(255,255,255,0.08) !important" }}>
                <span className="text-muted fw-semibold" style={{ fontSize: "12px" }}>TAGS:</span>
                {[article.category, "Sports", "SportsVerge"].map((tag) => (
                  <span key={tag} className="badge rounded-pill px-3 py-1" style={{ background: "rgba(34,197,94,0.12)", color: "#86efac", fontSize: "11px", border: "1px solid rgba(34,197,94,0.2)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </div>

          {/* ─── Sidebar ─── */}
          <div className="col-lg-4">
            <div className="sticky-lg-top" style={{ top: "90px" }}>

              {/* Related Stories */}
              <div className="rounded-4 p-4 mb-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                <h5 className="fw-bold text-white mb-4 font-space-grotesk d-flex align-items-center gap-2" style={{ fontSize: "15px" }}>
                  <span className="d-inline-block" style={{ width: "3px", height: "18px", background: "var(--accent-green)", borderRadius: "2px" }}></span>
                  Related Stories
                </h5>

                {relatedArticles.length === 0 ? (
                  <p className="text-muted small mb-0">No related articles in this category.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {relatedArticles.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/news/${rel.id}`}
                        className="text-decoration-none d-flex gap-3 align-items-start p-2 rounded-3 transition-all"
                        style={{ background: "rgba(255,255,255,0.03)" }}
                      >
                        <div
                          className="rounded-2 overflow-hidden flex-shrink-0"
                          style={{ width: "72px", height: "72px", border: "1px solid var(--border-dark)" }}
                        >
                          <img src={rel.image} alt={rel.title} className="w-100 h-100 object-fit-cover" />
                        </div>
                        <div className="flex-grow-1 min-w-0">
                          <h6
                            className="text-white fw-semibold mb-1 hover-text-success transition-all"
                            style={{ fontSize: "12px", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                          >
                            {rel.title}
                          </h6>
                          <span className="text-muted" style={{ fontSize: "10px" }}>{rel.author} · {rel.date}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="rounded-4 p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                <h5 className="fw-bold text-white mb-3 font-space-grotesk d-flex align-items-center gap-2" style={{ fontSize: "15px" }}>
                  <span className="d-inline-block" style={{ width: "3px", height: "18px", background: "var(--accent-green)", borderRadius: "2px" }}></span>
                  Browse Categories
                </h5>
                <div className="d-flex flex-column gap-2">
                  {categories.map((cat) => {
                    const isActive = article.category === cat.name;
                    return (
                      <Link
                        key={cat.name}
                        href={`/news?category=${cat.name}`}
                        className="text-decoration-none d-flex align-items-center justify-content-between rounded-3 px-3 py-2 transition-all"
                        style={{
                          background: isActive ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
                          border: isActive ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.07)",
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                            style={{ width: "28px", height: "28px", background: `${cat.color}18` }}
                          >
                            <i className={`bi ${cat.icon}`} style={{ fontSize: "12px", color: cat.color }}></i>
                          </div>
                          <span className="fw-semibold" style={{ fontSize: "13px", color: isActive ? "#86efac" : "#e5e7eb" }}>
                            {cat.name}
                          </span>
                        </div>
                        <i className="bi bi-chevron-right" style={{ fontSize: "11px", color: isActive ? "#22c55e" : "#6b7280" }}></i>
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
