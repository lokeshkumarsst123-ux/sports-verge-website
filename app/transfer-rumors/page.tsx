"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { contentApi, type PublicNewsArticle } from "@/lib/content-api";

type TransferArticle = PublicNewsArticle & {
  probability: string;
  fromClub: string;
  toClub: string;
  fee: string;
  position: string;
};

const filters = ["All", "Very High", "High", "Medium", "Low"];
const pageSize = 10;

const isTransferArticle = (article: PublicNewsArticle) => {
  const headlineContent = [article.title, article.summary, ...article.tags].join(" ").toLowerCase();
  const hasTransferTag = article.tags.some((tag) => /(^|\b)(transfer|rumou?r|from:|to:|fee:|position:)/i.test(tag));
  const hasRequiredMetadata = ["from:", "to:", "fee:", "position:"].every((prefix) => article.tags.some((tag) => tag.toLowerCase().startsWith(prefix)));
  const hasProbability = filters.slice(1).some((filter) => article.tags.some((tag) => tag.toLowerCase() === filter.toLowerCase()));
  const hasTransferSignal = hasTransferTag || /\b(transfer|signing|signed|deal|loan|contract|move|moved|moves|join|joined|joining|rumour|rumors)\b/i.test(headlineContent);
  return hasRequiredMetadata && hasProbability && hasTransferSignal;
};

const tagValue = (article: PublicNewsArticle, prefix: string, fallback: string) => {
  const tag = article.tags.find((value) => value.toLowerCase().startsWith(prefix));
  return tag ? tag.slice(prefix.length).trim() || fallback : fallback;
};

const mapArticle = (article: PublicNewsArticle): TransferArticle => {
  const probabilityTag = article.tags.find((value) => filters.slice(1).some((filter) => value.toLowerCase() === filter.toLowerCase()));
  return {
    ...article,
    probability: probabilityTag || "Medium",
    fromClub: tagValue(article, "from:", "Not provided"),
    toClub: tagValue(article, "to:", "Not provided"),
    fee: tagValue(article, "fee:", "Not provided"),
    position: tagValue(article, "position:", article.category || "Football"),
  };
};

export default function TransferRumorsPage() {
  const [filterProb, setFilterProb] = useState("All");
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<TransferArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await contentApi.articles({ limit: 50 });
        const transferArticles = response.data.items.filter(isTransferArticle).map(mapArticle);
        if (!cancelled) setArticles(transferArticles);
      } catch (requestError) {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Unable to load transfer rumours.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const filteredRumors = useMemo(
    () => filterProb === "All" ? articles : articles.filter((article) => article.probability === filterProb),
    [articles, filterProb],
  );
  const totalPages = Math.max(1, Math.ceil(filteredRumors.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRumors = filteredRumors.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return <main className="font-outfit">
    <PageHeader title="Transfer Rumors" subtitle="Football transfer rumours supplied by the connected content provider." className="mb-5" />
    <div className="container custom-container mb-4">
      <div className="d-flex gap-2 border-bottom border-secondary border-opacity-10 pb-3">
        {filters.map((probability) => <button key={probability} onClick={() => { setFilterProb(probability); setPage(1); }} className="btn text-capitalize fw-bold rounded-pill px-4 py-2 transition-all" style={{ fontSize: "13px", background: filterProb === probability ? "var(--accent-green)" : "transparent", color: filterProb === probability ? "#fff" : "var(--text-muted)", border: filterProb === probability ? "1px solid var(--accent-green)" : "1px solid transparent" }}>{probability === "All" ? "All Rumors" : probability + " Probability"}</button>)}
      </div>
    </div>
    <div className="container custom-container">
      {loading ? <div className="premium-table-container p-5 text-center text-muted">Loading transfer rumours…</div> : error ? <div className="premium-table-container p-5 text-center text-warning">{error}</div> : filteredRumors.length ? <div className="row g-4">
        {visibleRumors.map((rumor) => {
          const probColor = rumor.probability === "Very High" || rumor.probability === "High" ? "#22c55e" : rumor.probability === "Medium" ? "#eab308" : "#ef4444";
          const probBg = rumor.probability === "Very High" || rumor.probability === "High" ? "rgba(34, 197, 94, 0.15)" : rumor.probability === "Medium" ? "rgba(234, 179, 8, 0.15)" : "rgba(239, 68, 68, 0.15)";
          const probBorder = rumor.probability === "Very High" || rumor.probability === "High" ? "rgba(34, 197, 94, 0.3)" : rumor.probability === "Medium" ? "rgba(234, 179, 8, 0.3)" : "rgba(239, 68, 68, 0.3)";
          return <div key={rumor.id} className="col-12 col-lg-6">
            <Link href={"/news/" + (rumor.slug || rumor.id)} className="text-decoration-none">
              <div className="premium-table-container p-4 h-100 d-flex flex-column justify-content-between hover-glow transition-all">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div><h4 className="fw-bold text-white mb-1 font-space-grotesk">{rumor.title}</h4><span className="text-muted small fw-semibold text-uppercase font-space-grotesk" style={{ letterSpacing: "0.08em" }}>{rumor.position}</span></div>
                    <span className="rounded-pill px-3 py-1 font-space-grotesk fw-bold" style={{ fontSize: "10px", background: probBg, color: probColor, border: "1px solid " + probBorder, letterSpacing: "0.05em" }}>{rumor.probability.toUpperCase()} PROBABILITY</span>
                  </div>
                  <div className="row align-items-center my-4 p-3 rounded-3" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div className="col-5 text-center"><span className="text-muted d-block small mb-1">FROM</span><span className="fw-bold text-white font-space-grotesk">{rumor.fromClub}</span></div>
                    <div className="col-2 text-center text-success"><i className="bi bi-arrow-right-circle-fill" style={{ fontSize: "24px" }} /></div>
                    <div className="col-5 text-center"><span className="text-muted d-block small mb-1">TO</span><span className="fw-bold text-white font-space-grotesk">{rumor.toClub}</span></div>
                  </div>
                  <p className="text-muted mb-4" style={{ fontSize: "14px", lineHeight: "1.6" }}>{rumor.summary}</p>
                </div>
                <div><hr className="border-secondary opacity-10 my-3" /><div className="d-flex justify-content-between align-items-center text-muted" style={{ fontSize: "12px" }}><span><i className="bi bi-tag-fill text-success me-2" />Est. Fee: <strong className="text-white font-monospace">{rumor.fee}</strong></span><span><i className="bi bi-newspaper me-2" />Source: <strong className="text-white">{rumor.author || "SportsVerge"}</strong></span></div></div>
              </div>
            </Link>
          </div>;
        })}
      </div> : <div className="premium-table-container p-5 text-center text-muted">No structured transfer rumours are currently supplied by the connected content provider. Transfer articles must include probability, from:, to:, fee:, and position: tags.</div>}
      {!loading && !error && filteredRumors.length > 0 && totalPages > 1 && <>
        <div className="ranking-pagination">
          <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button>
        </div>
        <div className="ranking-pagination-summary">Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredRumors.length)} of {filteredRumors.length} rumours</div>
      </>}
    </div>
  </main>;
}
