"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { contentApi, type PublicNewsArticle } from "@/lib/content-api";
import { useAds, type Ad } from "@/components/AdContext";
import { hasAuthSession } from "@/lib/auth-api";
import EditorialBlocks from '@/components/EditorialBlocks';

export default function NewsDetailsPage() {
  const { id } = useParams();
  const { getAdByType } = useAds();

  const [copied, setCopied] = useState(false);
  const [article, setArticle] = useState<PublicNewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<PublicNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const viewedArticleRef = useRef<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const authenticated = hasAuthSession();
      setIsAuthenticated(authenticated);
      setAuthChecked(true);
      if (!authenticated) setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!id || !authChecked || !isAuthenticated) return;
    const articleKey = String(id);
    if (viewedArticleRef.current === articleKey) return;
    viewedArticleRef.current = articleKey;
    let active = true;

    const loadArticle = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const result = await contentApi.article(String(id));
        if (!active) return;

        const nextArticle = result.data.article;
        setArticle(nextArticle);

        try {
          const related = await contentApi.articles({ category: nextArticle.categorySlug, limit: 4 });
          if (active) {
            setRelatedArticles(related.data.items.filter((item) => item.id !== nextArticle.id).slice(0, 3));
          }
        } catch {
          if (active) setRelatedArticles([]);
        }
      } catch (error) {
        if (!active) return;
        setArticle(null);
        setRelatedArticles([]);
        setLoadError(error instanceof Error ? error.message : "Article not found.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadArticle();
    return () => { active = false; };
  }, [id, authChecked, isAuthenticated]);

  const articleAd: Ad | null = article ? getAdByType("Article Advertisement") : null;

  useEffect(() => {
    if (!article) return undefined;
    const canonical = article.canonicalUrl || window.location.href;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    document.title = article.title;
    return undefined;
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
    { name: "General Sports", icon: "bi-globe2", color: "#8b5cf6" },
  ];

  if (!authChecked || loading) {
    return (
      <main className="font-outfit" style={{ background: "#FFFDF9", minHeight: "100vh" }}>
        <div className="container custom-container py-5">
          <div className="skeleton-line w-75 h-32px mb-4"></div>
          <div className="skeleton-line w-100 h-420px rounded-4"></div>
        </div>
      </main>
    );
  }

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
            <p className="small mb-4" style={{ color: "#5C646D" }}>Please log in or create an account to read the full news article.</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Link href="/login" className="btn fw-bold px-4 py-2 rounded-pill shadow-sm text-decoration-none" style={{ background: "#FFCC00", color: "#1C1F22", border: "none" }}>
                Log in to continue
              </Link>
              <Link href="/signup" className="btn fw-semibold px-4 py-2 rounded-pill text-decoration-none" style={{ background: "#FAF6EF", border: "1px solid #EAE5DC", color: "#1C1F22" }}>
                Create account
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="font-outfit" style={{ color: "#1C1F22" }}>
        <div className="text-center p-5 rounded-4 shadow-sm" style={{ maxWidth: "480px", background: "#FFFFFF", border: "1px solid #EAE5DC", margin: "40px auto" }}>
          <div className="mb-4" style={{ fontSize: "4rem" }}>📰</div>
          <h2 className="fw-bold mb-2" style={{ color: "#1C1F22" }}>Article Not Found</h2>
          <p className="text-muted small mb-4">
            {loadError || "The news article you are looking for does not exist or has been archived."}
          </p>
          <Link href="/news" className="btn fw-bold px-5 py-2 rounded-pill shadow-sm" style={{ backgroundColor: "#FFCC00", color: "#1C1F22", border: "none" }}>
            ← Back to News
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="font-outfit" style={{ color: "#1C1F22" }}>
      <div className="container custom-container py-4">

        {/* ─── Breadcrumb ─── */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0 align-items-center" style={{ background: "none", padding: 0 }}>
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none text-muted d-flex align-items-center gap-1 fs-13">
                <i className="bi bi-house-door-fill"></i> Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/news" className="text-decoration-none text-muted fs-13">
                News
              </Link>
            </li>
            <li className="breadcrumb-item active d-flex align-items-center" aria-current="page">
              <span className="badge rounded-pill px-3 py-1 fs-11 fw-semibold" style={{ backgroundColor: "#FFCC00", color: "#1C1F22" }}>
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
                <span className="badge rounded-pill px-3 py-2 fs-11 text-uppercase fw-bold letter-spacing-1" style={{ backgroundColor: "#FFCC00", color: "#1C1F22" }}>
                  {article.category}
                </span>
                <span className="fs-12 d-flex align-items-center gap-1" style={{ color: "#5A626A" }}>
                  <i className="bi bi-clock" style={{ color: "#4A90E2" }}></i>
                  {article.readTime}
                </span>
              </div>

              {/* Title */}
              <h1 className="fw-bold mb-4 lh-sm font-space-grotesk" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "#1C1F22" }}>
                {article.title}
              </h1>

              {/* Author Bar + Share */}
              <div
                className="d-flex flex-wrap align-items-center justify-content-between gap-3 rounded-3 mb-4 p-3 shadow-sm"
                style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}
              >
                <div className="d-flex align-items-center gap-3">
                  {article.authorImage && (
                    <img
                      src={article.authorImage}
                      alt={article.author}
                      className="rounded-circle"
                      style={{ width: "42px", height: "42px", objectFit: "cover", border: "2px solid #FFCC00" }}
                    />
                  )}
                  <div>
                    <span className="fw-semibold d-block" style={{ fontSize: "13px", color: "#1C1F22" }}>{article.author}</span>
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
                      className="d-flex align-items-center justify-content-center transition-all"
                      style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: "#FAF6EF",
                        border: "1px solid #EAE5DC",
                        fontSize: "13px",
                        color: "#1C1F22",
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
                      background: copied ? "#FFCC00" : "#FAF6EF",
                      border: "1px solid #EAE5DC",
                      color: "#1C1F22",
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
              <div className="rounded-4 overflow-hidden mb-5 border border-secondary-subtle shadow-sm" style={{ height: "420px" }}>
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
                  style={{ fontSize: "15px", color: "#1C1F22", borderLeft: "3px solid #FFCC00", fontStyle: "italic" }}
                >
                  {article.summary}
                </p>
                {article.content.split("\n\n").map((p, idx) => (
                  <p key={idx} className="lh-lg mb-4" style={{ fontSize: "15px", lineHeight: "1.85", color: "#2B3035" }}>
                    {p}
                  </p>
                ))}
                {article.editorialLayout && <EditorialBlocks articleId={article.id} layout={article.editorialLayout}/>}
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
                  <h6 className="fw-bold mb-1" style={{ color: "#1C1F22" }}>{articleAd.title}</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "11px" }}>
                    Sponsored content supports high-quality sports journalism on SportsVerge.
                  </p>
                </div>
              )}

              {/* Tags row */}
              <div className="d-flex align-items-center gap-2 flex-wrap border-top pt-4 mt-2" style={{ borderColor: "#EAE5DC" }}>
                <span className="fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.06em", color: "#64748B" }}>
                  TAGS:
                </span>
                {(article.tags?.length ? article.tags : [article.category, "Sports", "SportsVerge"]).map((tag) => (
                  <span
                    key={tag}
                    className="badge rounded-pill px-3 py-1.5 fw-semibold transition-all"
                    style={{
                      background: "#FFFFFF",
                      color: "#1C1F22",
                      fontSize: "12px",
                      border: "1px solid #E2DCD2",
                      boxShadow: "0 1px 4px rgba(28, 31, 34, 0.04)",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          </div>

          {/* ─── Sidebar ─── */}
          <div className="col-lg-4">
            <div className="sticky-lg-top" style={{ top: "90px", zIndex: 10 }}>

              {/* Related Stories */}
              <div className="rounded-4 p-4 mb-4 shadow-sm" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                <h5 className="fw-bold mb-4 font-space-grotesk d-flex align-items-center gap-2" style={{ fontSize: "15px", color: "#1C1F22" }}>
                  <span className="d-inline-block" style={{ width: "3px", height: "18px", background: "#FFCC00", borderRadius: "2px" }}></span>
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
                        style={{ background: "#FAF6EF", border: "1px solid #EAE5DC" }}
                      >
                        <div
                          className="rounded-2 overflow-hidden flex-shrink-0"
                          style={{ width: "72px", height: "72px", border: "1px solid var(--border-dark)" }}
                        >
                          <img src={rel.image} alt={rel.title} className="w-100 h-100 object-fit-cover" />
                        </div>
                        <div className="flex-grow-1 min-w-0">
                          <h6
                            className="fw-bold mb-1 transition-all"
                            style={{ fontSize: "12px", lineHeight: "1.4", color: "#1C1F22", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
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
              <div className="rounded-4 p-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: "15px", color: "#1C1F22" }}>
                  <span className="d-inline-block" style={{ width: "3px", height: "18px", background: "#FFCC00", borderRadius: "2px" }}></span>
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
                          background: isActive ? "#FFFDF5" : "#FFFFFF",
                          border: isActive ? "1.5px solid #FFCC00" : "1px solid #EAE5DC",
                          borderLeft: isActive ? "4px solid #FFCC00" : "1px solid #EAE5DC",
                          color: "#1C1F22",
                          boxShadow: isActive ? "0 2px 8px rgba(255, 204, 0, 0.15)" : "0 1px 3px rgba(28, 31, 34, 0.02)",
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                            style={{
                              width: "32px",
                              height: "32px",
                              background: `${cat.color}18`,
                              border: `1px solid ${cat.color}30`,
                            }}
                          >
                            <i
                              className={`bi ${cat.icon}`}
                              style={{
                                fontSize: "13px",
                                color: cat.color,
                              }}
                            ></i>
                          </div>
                          <span
                            className={isActive ? "fw-bold" : "fw-semibold"}
                            style={{ fontSize: "13.5px", color: "#1C1F22" }}
                          >
                            {cat.name}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          {isActive && (
                            <span
                              className="badge rounded-pill fw-bold"
                              style={{
                                fontSize: "10px",
                                background: "#FFCC00",
                                color: "#1C1F22",
                                padding: "3px 8px",
                              }}
                            >
                              Current
                            </span>
                          )}
                          <i
                            className="bi bi-chevron-right"
                            style={{
                              fontSize: "12px",
                              color: isActive ? "#1C1F22" : "#94A3B8",
                            }}
                          ></i>
                        </div>
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
