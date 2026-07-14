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
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(4px)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-card border border-dark rounded-4 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="modal-header border-bottom border-white-05 px-4 py-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success rounded-pill px-2.5 py-1 fs-10 text-uppercase fw-semibold">
                {category}
              </span>
              <span className="text-muted fs-11">• {readTime}</span>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4 bg-dark overflow-auto text-start" style={{ maxHeight: "70vh" }}>
            <div className="position-relative rounded-3 overflow-hidden mb-3 border border-dark" style={{ height: "300px" }}>
              <img src={article.image} alt={article.title} className="w-100 h-100 object-fit-cover" />
            </div>
            
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 pb-3 border-bottom border-white-05">
              <div className="text-muted fs-12">
                <strong>By {author}</strong> <span className="mx-1">•</span> {article.date}
              </div>

              {/* Action buttons */}
              <div className="d-flex align-items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="btn btn-dark btn-sm rounded-pill px-3 py-1 fs-11 fw-semibold text-white border border-secondary border-opacity-25 d-flex align-items-center gap-1 transition-all"
                >
                  <i className={`bi ${copied ? "bi-check-lg text-success" : "bi-link-45deg"}`}></i>
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                {fullArticle && (
                  <Link
                    href={`/news/${fullArticle.id}`}
                    onClick={onClose}
                    className="btn btn-success btn-sm rounded-pill px-3 py-1 fs-11 fw-semibold text-white d-flex align-items-center gap-1"
                  >
                    View Page <i className="bi bi-box-arrow-up-right"></i>
                  </Link>
                )}
              </div>
            </div>

            <h3 className="text-white fw-bold mb-3 font-space-grotesk">{article.title}</h3>
            
            <div className="text-light fs-14 lh-lg mb-4">
              {paragraphs.map((p, idx) => (
                <p key={idx} className={idx === 0 ? "fw-semibold text-success-subtle mb-3" : "mb-3"}>
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

          <div className="modal-footer border-top border-white-05 px-4 py-3 bg-dark-subtle">
            <button type="button" className="btn btn-success fw-semibold px-4 rounded-1" onClick={onClose}>
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
