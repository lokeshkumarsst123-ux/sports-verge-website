"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { contentApi, type PublicNewsArticle } from "@/lib/content-api";
import { formatUserDate } from "@/lib/date-time";

type CategoryNewsProps = { category: string; title: string };

export default function CategoryNews({ category, title }: CategoryNewsProps) {
  const [articles, setArticles] = useState<PublicNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    contentApi.articles({ category, limit: 3 }).then((result) => {
      if (active) setArticles(result.data.items.slice(0, 3));
    }).catch(() => {
      if (active) setArticles([]);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [category]);

  return (
    <section className="news-section bg-card rounded-4 p-4 mt-4 border">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="m-0 fw-bold border-start border-3 ps-2 widget-heading">
          {title}
        </h5>
        <Link
          href={`/news?category=${encodeURIComponent(category)}`}
          className="small widget-view-all"
        >
          View All <i className="bi bi-chevron-right" />
        </Link>
      </div>

      {loading ? (
        <div className="d-flex flex-column gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="category-news-skeleton" />
          ))}
        </div>
      ) : articles.length ? (
        <div className="d-flex flex-column gap-3">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="news-card d-flex flex-column flex-sm-row gap-3 gap-md-4 text-decoration-none rounded-3 p-3 transition-all shadow-sm cat-news-card-custom"
            >
              <div className="news-img-wrapper flex-shrink-0 rounded-2 overflow-hidden cat-news-img-wrap">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={240}
                  height={150}
                  className="w-100 h-100 object-fit-cover news-thumb"
                  loading={index === 0 ? "eager" : "lazy"}
                  unoptimized
                />
              </div>
              <div className="news-content d-flex flex-column justify-content-center py-1 flex-grow-1">
                <h5 className="fw-bold mb-2 lh-sm transition-all cat-news-title-custom">
                  {article.title}
                </h5>
                <p className="small mb-3 lh-base cat-news-summary-custom">
                  {article.summary}
                </p>
                <div className="mt-auto cat-news-date-custom d-flex align-items-center gap-1">
                  <i className="bi bi-clock"></i>
                  <span>{formatUserDate(article.publishAt || article.createdAt, true)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="category-news-empty text-muted small py-3">No published {title.toLowerCase()} yet.</div>
      )}
    </section>
  );
}
