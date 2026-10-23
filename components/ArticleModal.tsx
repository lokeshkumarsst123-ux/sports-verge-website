"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAds } from "./AdContext";
import { newsArticles } from "@/data/newsData";

interface ArticleModalProps {
  article: {
    title: string;
    description: string;
    image: string;
    date: string;
  } | null;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  const { getAdByType } = useAds();
  const [articleAd, setArticleAd] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (article && getAdByType) {
      setArticleAd(getAdByType("Article Advertisement"));
    }
  }, [article, getAdByType]);

  if (!article) return null;

  // Find full article by matching title
  const fullArticle = newsArticles.find(
    (a) => a.title.toLowerCase().trim() === article.title.toLowerCase().trim()
  );

  // Split content into paragraphs or fall back to description
  const paragraphs = fullArticle
    ? fullArticle.content.split("\n\n")
    : [article.description];

  const category = fullArticle ? fullArticle.category : "Sports";
  const author = fullArticle ? fullArticle.author : "SportsVerge Reporter";
  const readTime = fullArticle ? fullArticle.readTime : "3 min read";

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const shareUrl = fullArticle
        ? `${window.location.origin}/news/${fullArticle.id}`
        : window.location.href;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(28, 31, 34, 0.65)", backdropFilter: "blur(4px)", zIndex: 1100 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 shadow-lg overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
          {/* Header */}
          <div className="modal-header px-4 py-3 d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #EAE5DC" }}>
            <div className="d-flex align-items-center gap-2">
              <span className="badge rounded-pill px-3 py-1 fs-10 text-uppercase fw-bold" style={{ background: "#FFCC00", color: "#1C1F22" }}>
                {category}
              </span>
              <span className="text-muted fs-11">• {readTime}</span>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4 overflow-auto text-start" style={{ maxHeight: "70vh", background: "#FFFFFF" }}>
            <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ height: "300px", border: "1px solid #EAE5DC" }}>
              <img src={article.image} alt={article.title} className="w-100 h-100 object-fit-cover" />
            </div>
            
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 pb-3 border-bottom" style={{ borderColor: "#EAE5DC" }}>
              <div className="text-muted fs-12">
                <strong>By {author}</strong> <span className="mx-1">•</span> {article.date}
              </div>

              {/* Action buttons */}
              <div className="d-flex align-items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="btn btn-sm rounded-pill px-3 py-1 fs-11 fw-semibold d-flex align-items-center gap-1 transition-all shadow-sm"
                  style={{ background: "#FAF6EF", border: "1px solid #EAE5DC", color: "#1C1F22" }}
                >
                  <i className={`bi ${copied ? "bi-check-lg text-success" : "bi-link-45deg"}`}></i>
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                {fullArticle && (
                  <Link
                    href={`/news/${fullArticle.id}`}
                    onClick={onClose}
                    className="btn btn-sm rounded-pill px-3 py-1 fs-11 fw-bold d-flex align-items-center gap-1 shadow-sm"
                    style={{ background: "#FFCC00", color: "#1C1F22", border: "none" }}
                  >
                    View Page <i className="bi bi-box-arrow-up-right"></i>
                  </Link>
                )}
              </div>
            </div>

            <h3 className="fw-bold mb-3 font-space-grotesk" style={{ color: "#1C1F22" }}>{article.title}</h3>
            
            <div className="fs-14 lh-lg mb-4" style={{ color: "#5C646D" }}>
              {paragraphs.map((p, idx) => (
                <p key={idx} className={idx === 0 ? "fw-semibold mb-3" : "mb-3"} style={{ color: idx === 0 ? "#1C1F22" : "#5C646D" }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Dynamic Article Advertisement Banner */}
            {articleAd && (
              <div className="card border-0 rounded-3 overflow-hidden mt-4 position-relative p-0 bg-transparent">
                <a href={articleAd.redirectUrl} target="_blank" rel="noopener noreferrer" className="d-block w-100 position-relative" style={{ minHeight: "100px" }}>
                  <img src={articleAd.image} alt={articleAd.title} className="w-100 h-100 object-fit-cover" style={{ maxHeight: "140px" }} />
                  <span className="position-absolute top-0 end-0 badge bg-dark text-muted font-monospace fs-10 border border-secondary border-opacity-10 m-2">
                    SPONSOR
                  </span>
                </a>
              </div>
            )}
          </div>

          <div className="modal-footer px-4 py-3" style={{ background: "#FAF6EF", borderTop: "1px solid #EAE5DC" }}>
            <button type="button" className="btn fw-bold px-4 py-2 rounded-pill shadow-sm" style={{ background: "#FFCC00", color: "#1C1F22", border: "none" }} onClick={onClose}>
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
