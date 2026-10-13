"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { adminApi, type Article, type Category } from "@/lib/admin-api";
import AdminModal from "@/components/admin/AdminModal";
import AdminSelect from "@/components/admin/AdminSelect";
import AdminDatePicker from "@/components/admin/AdminDatePicker";
import AdminActionModal from "@/components/admin/AdminActionModal";
import { useAdminToast } from "@/components/admin/AdminToast";
import { formatUserDate, getUserTimeZone, isoToLocalDateTime, localDateTimeToIso } from "@/lib/date-time";

type ArticleForm = {
  headline: string;
  summary: string;
  content: string;
  categoryId: string;
  featuredImage: string;
  featuredImageFile: File | null;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  tags: string;
  canonicalUrl: string;
  status: Article["status"];
  publishAt: string;
  publishTimezone: string;
};

const blank: ArticleForm = {
  headline: "",
  summary: "",
  content: "",
  categoryId: "",
  featuredImage: "",
  featuredImageFile: null,
  slug: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  tags: "",
  canonicalUrl: "",
  status: "draft",
  publishAt: "",
  publishTimezone: "",
};

const articleStatusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
  { value: "archived", label: "Archived" },
];

const commonTimezones = [
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Perth",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "Pacific/Auckland",
  "UTC",
];

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ArticleForm>(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [saving, setSaving] = useState(false);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [userTimeZone, setUserTimeZone] = useState("your local timezone");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useAdminToast();

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "20", page: String(page), status: statusFilter });
      if (categoryFilter !== "all") params.set("categoryId", categoryFilter);
      if (search.trim()) params.set("search", search.trim());
      const [articleResult, categoryResult] = await Promise.all([adminApi.articles(params.toString()), adminApi.categories()]);
      setArticles(articleResult.data.items);
      setTotal(articleResult.data.total);
      setTotalPages(Math.max(1, articleResult.data.totalPages || Math.ceil(articleResult.data.total / 20)));
      setCategories(categoryResult.data.categories);
    } catch (err) {
      if (!silent) showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to load news." });
    } finally {
      if (!silent) setLoading(false);
    }
  }, [categoryFilter, page, search, showToast, statusFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => load(), 0);
    const refreshTimer = window.setInterval(() => load(true), 15000);
    return () => { window.clearTimeout(timer); window.clearInterval(refreshTimer); };
  }, [load]);

  useEffect(() => {
    const timer = window.setTimeout(() => setUserTimeZone(getUserTimeZone()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => () => {
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const defaultTimezone = () => userTimeZone === "your local timezone" ? getUserTimeZone() : userTimeZone;
  const change = (field: Exclude<keyof ArticleForm, "featuredImageFile">, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const changePublishTimezone = (timezone: string) => setForm((current) => {
    const currentTimezone = current.publishTimezone || defaultTimezone();
    const utcValue = current.publishAt ? localDateTimeToIso(current.publishAt, currentTimezone) : "";
    return { ...current, publishTimezone: timezone, publishAt: utcValue ? isoToLocalDateTime(utcValue, timezone) : current.publishAt };
  });
  const closeForm = () => {
    setForm({ ...blank, publishTimezone: defaultTimezone() });
    setImagePreview("");
    setEditing(null);
    setFormOpen(false);
  };
  const edit = (article: Article) => {
    const timezone = article.publishTimezone || defaultTimezone();
    setEditing(article.id);
    setForm({
      headline: article.headline,
      summary: article.summary,
      content: article.content,
      categoryId: article.categoryId,
      featuredImage: article.featuredImage || "",
      featuredImageFile: null,
      slug: article.slug,
      seoTitle: article.seoTitle || "",
      seoDescription: article.seoDescription || "",
      seoKeywords: article.seoKeywords || "",
      tags: (article.tags || []).join(", "),
      canonicalUrl: article.canonicalUrl || "",
      status: article.status,
      publishAt: isoToLocalDateTime(article.publishAt, timezone),
      publishTimezone: timezone,
    });
    setImagePreview(article.featuredImage || "");
    setFormOpen(true);
  };
  const openCreate = () => {
    setForm({ ...blank, publishTimezone: defaultTimezone() });
    setImagePreview("");
    setEditing(null);
    setFormOpen(true);
  };
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!allowedImageTypes.includes(file.type)) {
      showToast({ type: "error", title: "Unsupported image", message: "Please upload a JPG, PNG, WEBP, GIF, or AVIF image." });
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast({ type: "error", title: "Image is too large", message: "Please choose an image of 5 MB or less." });
      event.target.value = "";
      return;
    }
    setForm((current) => ({ ...current, featuredImageFile: file }));
    setImagePreview(URL.createObjectURL(file));
  };
  const removeSelectedImage = () => {
    setForm((current) => ({ ...current, featuredImageFile: null }));
    setImagePreview(editing ? form.featuredImage : "");
    if (imageInputRef.current) imageInputRef.current.value = "";
  };
  const buildPayload = () => {
    const payload = new FormData();
    const timezone = form.publishTimezone || defaultTimezone();
    payload.append("headline", form.headline);
    payload.append("summary", form.summary);
    payload.append("content", form.content);
    payload.append("categoryId", form.categoryId);
    payload.append("slug", form.slug);
    payload.append("status", form.status);
    if (form.publishAt) {
      const publishAt = localDateTimeToIso(form.publishAt, timezone);
      if (publishAt) payload.append("publishAt", publishAt);
      payload.append("publishTimezone", timezone);
    }
    if (form.seoTitle) payload.append("seoTitle", form.seoTitle);
    if (form.seoDescription) payload.append("seoDescription", form.seoDescription);
    if (form.seoKeywords) payload.append("seoKeywords", form.seoKeywords);
    payload.append("tags", form.tags);
    payload.append("canonicalUrl", form.canonicalUrl);
    if (form.featuredImageFile) payload.append("featuredImage", form.featuredImageFile);
    else if (form.featuredImage) payload.append("featuredImage", form.featuredImage);
    return payload;
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.categoryId) {
      showToast({ type: "error", title: "Category required", message: "Please choose a category before saving the article." });
      return;
    }
    if (!editing && !form.featuredImageFile) {
      showToast({ type: "error", title: "Image required", message: "Please upload a featured image before publishing the article." });
      return;
    }
    if (editing && !form.featuredImageFile && !form.featuredImage) {
      showToast({ type: "error", title: "Image required", message: "Please upload a featured image for this article." });
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (editing) await adminApi.updateArticle(editing, payload);
      else await adminApi.createArticle(payload);
      showToast({ type: "success", message: editing ? "Article updated successfully." : "Article created successfully." });
      closeForm();
      await load();
    } catch (err) {
      showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to save article." });
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (!deletingArticle) return;
    setDeleting(true);
    try {
      await adminApi.deleteArticle(deletingArticle.id);
      showToast({ type: "success", message: "Article deleted successfully." });
      setDeletingArticle(null);
      load();
    } catch (err) {
      showToast({ type: "error", message: err instanceof Error ? err.message : "Unable to delete article." });
    } finally {
      setDeleting(false);
    }
  };

  const categoryOptions = categories.map((category) => ({ value: category.id, label: category.name }));
  const timezoneOptions = Array.from(new Set([userTimeZone, form.publishTimezone, ...commonTimezones]))
    .filter((timezone) => timezone && timezone !== "your local timezone")
    .map((timezone) => ({ value: timezone, label: timezone.replace(/_/g, " ") }));

  return <div>
    <div className="mb-4"><h1 className="admin-title">News management</h1><p className="admin-subtitle">Create, schedule, publish, and archive editorial content.</p></div>
    <section className="admin-card admin-news-library"><div className="admin-card-header flex-wrap"><div><span className="admin-section-kicker">STORY INVENTORY</span><strong>Article library</strong><div className="admin-muted small">{total} articles · filtered editorial content</div></div><button className="btn btn-sm admin-btn-primary" onClick={openCreate}><i className="bi bi-plus-lg me-1" />Add article</button></div><div className="d-flex flex-wrap gap-2 px-3 pb-3"><input className="form-control admin-form-control" style={{ maxWidth: 280 }} placeholder="Search headline or summary" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /><AdminSelect options={[{ value: "all", label: "All statuses" }, ...articleStatusOptions]} value={statusFilter} onChange={(value) => { setStatusFilter(value); setPage(1); }} ariaLabel="Filter articles by status" /><AdminSelect options={[{ value: "all", label: "All categories" }, ...categoryOptions]} value={categoryFilter} onChange={(value) => { setCategoryFilter(value); setPage(1); }} ariaLabel="Filter articles by category" /></div><div className="table-responsive"><table className="table admin-table admin-news-table"><thead><tr><th className="admin-news-number-heading">#</th><th>News</th><th>Category</th><th>Status</th><th>Date &amp; time</th><th>Views</th><th className="text-end">Actions</th></tr></thead><tbody>{loading ? <tr><td colSpan={7} className="admin-empty"><div className="spinner-border spinner-border-sm text-success" /></td></tr> : articles.length ? articles.map((article, index) => <tr key={article.id}><td className="admin-news-index">{String((page - 1) * 20 + index + 1).padStart(2, "0")}</td><td><Link className="admin-table-link" href={`/admin/news/${article.id}`} title="Open article detail page"><div className="admin-news-row"><div className="admin-news-thumb"><img src={article.featuredImage || "/assets/imgs/banner/news-banner_1.webp"} alt="" onError={(event) => { event.currentTarget.src = "/assets/imgs/banner/news-banner_1.webp"; }} /></div><div className="admin-news-copy"><div className="fw-semibold">{article.headline}</div><div className="admin-news-meta"><span>{new Date(article.createdAt).toLocaleDateString()}</span><span>•</span><span>{article.slug}</span></div><p>{article.summary}</p></div></div></Link></td><td className="admin-muted">{article.categoryName}</td><td><span className={`admin-badge ${article.status === "published" ? "admin-badge-success" : article.status === "scheduled" ? "admin-badge-warning" : "admin-badge-muted"}`}>{article.status}</span></td><td className="admin-muted admin-news-date">{formatUserDate(article.publishAt || article.createdAt, true)}</td><td>{article.viewCount}</td><td className="text-end"><button className="btn btn-sm admin-btn-ghost me-1" onClick={() => edit(article)} title="Edit article"><i className="bi bi-pencil" /></button><button className="btn btn-sm btn-outline-danger" onClick={() => setDeletingArticle(article)} title="Delete article"><i className="bi bi-trash" /></button></td></tr>) : <tr><td colSpan={7} className="admin-empty">No articles yet.</td></tr>}</tbody></table></div><div className="d-flex flex-wrap justify-content-between align-items-center gap-2 px-3 pb-3"><span className="admin-muted small">Page {page} of {totalPages}</span><div className="d-flex gap-2"><button type="button" className="btn btn-sm admin-btn-ghost" disabled={page <= 1 || loading} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button><button type="button" className="btn btn-sm admin-btn-ghost" disabled={page >= totalPages || loading} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</button></div></div></section>
    <AdminModal open={formOpen} wide title={editing ? "Edit article" : "Create article"} onClose={closeForm}><form onSubmit={submit}><div className="row g-3">
      <div className="col-lg-8"><label className="admin-form-label">HEADLINE</label><input required className="form-control admin-form-control" value={form.headline} onChange={(e) => change("headline", e.target.value)} /></div>
      <div className="col-lg-4"><label className="admin-form-label">CATEGORY</label><AdminSelect options={categoryOptions} value={form.categoryId} onChange={(value) => change("categoryId", value)} placeholder="Choose category" isSearchable ariaLabel="Article category" /></div>
      <div className="col-md-6"><label className="admin-form-label">URL SLUG</label><input required className="form-control admin-form-control" value={form.slug} onChange={(e) => change("slug", e.target.value)} placeholder="article-url-slug" /></div>
      <div className="col-md-3"><label className="admin-form-label">STATUS</label><AdminSelect options={articleStatusOptions} value={form.status} onChange={(value) => change("status", value)} ariaLabel="Article status" /></div>
      <div className="col-md-3"><label className="admin-form-label">PUBLISH AT <span className="admin-timezone-label">({form.publishTimezone || userTimeZone})</span></label><AdminDatePicker value={form.publishAt} onChange={(value) => change("publishAt", value)} showTimeSelect ariaLabel="Publish date and time" /><small className="admin-datepicker-hint">Time is saved globally and displayed in each user&apos;s local timezone.</small></div>
      <div className="col-md-4"><label className="admin-form-label">SCHEDULE TIMEZONE</label><AdminSelect options={timezoneOptions} value={form.publishTimezone || defaultTimezone()} onChange={changePublishTimezone} placeholder="Choose timezone" isSearchable ariaLabel="Schedule timezone" /></div>
      <div className="col-12"><label className="admin-form-label">SUMMARY</label><textarea required rows={2} className="form-control admin-form-control" value={form.summary} onChange={(e) => change("summary", e.target.value)} /></div>
      <div className="col-12"><label className="admin-form-label">FULL CONTENT</label><textarea required rows={7} className="form-control admin-form-control" value={form.content} onChange={(e) => change("content", e.target.value)} /></div>
      <div className="col-12"><label className="admin-form-label">FEATURED IMAGE</label><div className="admin-image-upload"><input ref={imageInputRef} required={!editing && !form.featuredImage} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="form-control admin-form-control" onChange={handleImageChange} /><small className="admin-image-upload-hint">JPG, PNG, WEBP, GIF or AVIF · maximum 5 MB. Uploading a new image replaces the current one.</small>{imagePreview && <div className="admin-image-preview"><img src={imagePreview} alt="Featured image preview" /><div className="admin-image-preview-copy"><strong>{form.featuredImageFile?.name || "Current featured image"}</strong><span>{form.featuredImageFile ? "Ready to upload" : "Saved image"}</span></div>{form.featuredImageFile && <button type="button" className="admin-image-remove" onClick={removeSelectedImage} aria-label="Remove selected image"><i className="bi bi-x-lg" /></button>}</div>}</div></div>
      <div className="col-md-4"><label className="admin-form-label">SEO TITLE</label><input className="form-control admin-form-control" value={form.seoTitle} onChange={(e) => change("seoTitle", e.target.value)} /></div>
      <div className="col-md-4"><label className="admin-form-label">SEO DESCRIPTION</label><input className="form-control admin-form-control" value={form.seoDescription} onChange={(e) => change("seoDescription", e.target.value)} /></div>
      <div className="col-md-4"><label className="admin-form-label">SEO KEYWORDS</label><input className="form-control admin-form-control" value={form.seoKeywords} onChange={(e) => change("seoKeywords", e.target.value)} placeholder="sports, cricket, match" /></div>
      <div className="col-md-6"><label className="admin-form-label">TAGS</label><input className="form-control admin-form-control" value={form.tags} onChange={(e) => change("tags", e.target.value)} placeholder="cricket, final, sports" /><small className="admin-muted">Separate tags with commas.</small></div>
      <div className="col-md-6"><label className="admin-form-label">CANONICAL URL</label><input type="url" className="form-control admin-form-control" value={form.canonicalUrl} onChange={(e) => change("canonicalUrl", e.target.value)} placeholder="https://example.com/news/article" /></div>
      <div className="col-12 d-flex justify-content-end gap-2"><button type="button" className="btn admin-btn-ghost" onClick={closeForm}>Cancel</button><button disabled={saving} className="btn admin-btn-primary px-4">{saving ? "Saving..." : editing ? "Update article" : "Save article"}</button></div>
    </div></form></AdminModal>
    <AdminActionModal open={Boolean(deletingArticle)} title="Delete article" heading="Delete this article?" description={<><strong>{deletingArticle?.headline}</strong> will be permanently removed from the newsroom. This action cannot be undone.</>} icon="bi-trash3" confirmLabel="Yes, delete article" loadingLabel="Deleting..." loading={deleting} danger onClose={() => { if (!deleting) setDeletingArticle(null); }} onConfirm={remove} />
  </div>;
}
