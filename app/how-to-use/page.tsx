import React from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "How to Use SportsVerge – The SportsVerge" };

const steps = [
  { num: "01", icon: "bi-house-door-fill", color: "#22c55e", title: "Start on the Homepage", desc: "The homepage gives you a live snapshot — hero news banner, live scores sidebar, upcoming fixtures, and the latest articles from every sport category." },
  { num: "02", icon: "bi-broadcast", color: "#3b82f6", title: "Check Live Scores", desc: "Navigate to Live Scores to see real-time match updates across Cricket, Football, NFL, and AFL. Click any match to open its detailed scorecard or match stats page." },
  { num: "03", icon: "bi-newspaper", color: "#f59e0b", title: "Read the News", desc: "Go to the News section to browse our editorial articles. Use the category tabs (Cricket, Football, NFL, AFL) or the search bar to find exactly what you're looking for." },
  { num: "04", icon: "bi-calendar-event", color: "#ec4899", title: "Plan with Fixtures", desc: "Check the Fixtures page to see upcoming matches across all sports. Filter by date or sport and never miss a game." },
  { num: "05", icon: "bi-bar-chart-line", color: "#8b5cf6", title: "Track Standings", desc: "View team standings and league tables on the Standings page. See where your favorite team sits in the table after each round of games." },
  { num: "06", icon: "bi-search", color: "#06b6d4", title: "Use the Search", desc: "Use the search icon in the navigation bar to quickly find news articles, match results, or teams across the entire SportsVerge platform." },
];

export default function HowToUsePage() {
  return (
    <main className="min-vh-100 font-outfit" style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "40px 0 80px 0" }}>
      <div className="container custom-container" style={{ maxWidth: "860px" }}>
        {/* Header */}
        <PageHeader
          title="How to Use SportsVerge"
          subtitle="New here? This guide walks you through everything SportsVerge has to offer."
          className="mb-5 px-0"
        />

        <div className="d-flex flex-column gap-4">
          {steps.map((step, i) => (
            <div key={i} className="d-flex gap-4 align-items-start rounded-4 p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
              <div className="d-flex align-items-center justify-content-center rounded-3 fw-bold font-space-grotesk flex-shrink-0" style={{ width: "56px", height: "56px", background: `${step.color}15`, color: step.color, fontSize: "18px" }}>
                {step.num}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className={`bi ${step.icon}`} style={{ color: step.color, fontSize: "1rem" }}></i>
                  <h5 className="fw-bold text-white mb-0 font-space-grotesk" style={{ fontSize: "15px" }}>{step.title}</h5>
                </div>
                <p className="text-muted lh-lg mb-0" style={{ fontSize: "13px" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-4 p-5 mt-5 text-center" style={{ background: "linear-gradient(135deg, rgba(26,140,61,0.1), rgba(26,140,61,0.02))", border: "1px solid rgba(26,140,61,0.2)" }}>
          <h4 className="fw-bold text-white mb-3 font-space-grotesk">Ready to Dive In?</h4>
          <p className="text-muted mb-4" style={{ fontSize: "14px" }}>Start exploring live scores, breaking news, and more.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link href="/" className="btn btn-success fw-bold rounded-pill px-5 py-2">Go to Homepage</Link>
            <Link href="/faqs" className="btn btn-outline-light fw-bold rounded-pill px-5 py-2">Read FAQs</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
