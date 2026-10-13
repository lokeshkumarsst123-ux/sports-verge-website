"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi, type Article } from "@/lib/admin-api";
import { useAdminToast } from "@/components/admin/AdminToast";
import { formatUserDate } from "@/lib/date-time";

const statusClass = (status: Article["status"]) => (
  status === "published" ? "admin-badge-success" : status === "scheduled" ? "admin-badge-warning" : "admin-badge-muted"
);

const text = (value?: string | null) => value?.trim() || "Not provided";

export default function AdminNewsDetailPage() {
  const params = useParams<{ id: string }>();
  const articleId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAdminToast();

  useEffect(() => {
    if (!articleId) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const result = await adminApi.article(articleId);
        if (active) setArticle(result.data.article);
      } catch (err) {
        if (active) {
          setArticle(null);
          showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to load article details." });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [articleId, showToast]);

  return (
    <div>
      <div className="admin-detail-head mb-4">
        <div>
          <Link href="/admin/news" className="admin-detail-back">
            <i className="bi bi-arrow-left" />
            Back to news
          </Link>
          <h1 className="admin-title mt-3 mb-0">{article?.headline || "Article details"}</h1>
          <p className="admin-subtitle">Editorial content, publishing metadata, and SEO fields.</p>
        </div>
        {article && <span className={`admin-badge ${statusClass(article.status)}`}>{article.status}</span>}
      </div>

      {loading ? (
        <section className="admin-card">
          <div className="admin-empty"><div className="spinner-border spinner-border-sm text-success" /></div>
        </section>
      ) : !article ? (
        <section className="admin-card">
          <div className="admin-empty">This article could not be found.</div>
        </section>
      ) : (
        <>
          <div className="row g-4">
            <div className="col-xl-8">
              <section className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <span className="admin-section-kicker">EDITORIAL</span>
                    <strong>Story overview</strong>
                  </div>
                  <i className="bi bi-newspaper admin-stat-icon" />
                </div>
                <div className="admin-card-body">
                  <p className="admin-detail-summary">{article.summary}</p>
                  {article.featuredImage && (
                    <div className="admin-detail-banner mb-4">
                      <img src={article.featuredImage} alt={article.headline} onError={(event) => { event.currentTarget.style.display = "none"; }} />
                    </div>
                  )}
                  <article className="admin-detail-richtext">{article.content}</article>
                </div>
              </section>
            </div>

            <div className="col-xl-4">
              <div className="admin-detail-stack">
                <section className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <span className="admin-section-kicker">PUBLISHING</span>
                      <strong>Story metadata</strong>
                    </div>
                    <i className="bi bi-info-circle admin-stat-icon" />
                  </div>
                  <div className="admin-card-body">
                    <dl className="admin-detail-list">
                      <div><dt>Category</dt><dd>{article.categoryName}</dd></div>
                      <div><dt>Author</dt><dd>{article.author}</dd></div>
                      <div><dt>Slug</dt><dd>{article.slug}</dd></div>
                      <div><dt>Views</dt><dd>{article.viewCount}</dd></div>
                      <div><dt>Publish at</dt><dd>{formatUserDate(article.publishAt || article.createdAt, true)}</dd></div>
                      <div><dt>Timezone</dt><dd>{text(article.publishTimezone)}</dd></div>
                      <div><dt>Created</dt><dd>{formatUserDate(article.createdAt, true)}</dd></div>
                      <div><dt>Updated</dt><dd>{article.updatedAt ? formatUserDate(article.updatedAt, true) : "Not available"}</dd></div>
                    </dl>
                  </div>
                </section>

                <section className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <span className="admin-section-kicker">SEO</span>
                      <strong>Search fields</strong>
                    </div>
                    <i className="bi bi-search admin-stat-icon" />
                  </div>
                  <div className="admin-card-body">
                    <dl className="admin-detail-list">
                      <div><dt>SEO title</dt><dd>{text(article.seoTitle)}</dd></div>
                      <div><dt>SEO description</dt><dd>{text(article.seoDescription)}</dd></div>
                      <div><dt>SEO keywords</dt><dd>{text(article.seoKeywords)}</dd></div>
                      <div><dt>Canonical URL</dt><dd className="text-break">{text(article.canonicalUrl)}</dd></div>
                    </dl>
                    <div className="admin-detail-tag-list mt-3">
                      {article.tags?.length ? article.tags.map((tag) => (
                        <span className="admin-badge admin-badge-muted" key={tag}>{tag}</span>
                      )) : <span className="admin-muted small">No tags added.</span>}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
