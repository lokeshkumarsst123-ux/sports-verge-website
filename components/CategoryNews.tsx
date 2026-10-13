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

  return <section className="news-section bg-card rounded-3 p-4 border border-dark mt-4 font-outfit"><div className="d-flex justify-content-between align-items-center mb-4"><h5 className="m-0 fw-semibold border-start border-success border-3 ps-2">{title}</h5><Link href={`/news?category=${encodeURIComponent(category)}`} className="text-success text-decoration-none small fw-medium">View All</Link></div>{loading ? <div className="d-flex flex-column gap-3">{[1, 2, 3].map((item) => <div key={item} className="category-news-skeleton" />)}</div> : articles.length ? <div className="d-flex flex-column gap-3">{articles.map((article) => <Link key={article.id} href={`/news/${article.id}`} className="news-card d-flex flex-column flex-sm-row gap-3 gap-md-4 text-decoration-none rounded-3 p-3 border border-dark bg-dark-subtle hover-glow transition-all"><div className="news-img-wrapper flex-shrink-0 rounded-2 overflow-hidden"><Image src={article.image} alt={article.title} width={300} height={190} className="w-100 h-100 news-thumb" unoptimized /></div><div className="news-content d-flex flex-column justify-content-center py-1"><h5 className="text-white fw-bold mb-2 lh-sm hover-text-success transition-all">{article.title}</h5><p className="text-muted small mb-3 lh-sm">{article.summary}</p><div className="text-muted mt-auto fs-11">{formatUserDate(article.publishAt || article.createdAt, true)}</div></div></Link>)}</div> : <div className="category-news-empty">No published {title.toLowerCase()} yet.</div>}</section>;
}
