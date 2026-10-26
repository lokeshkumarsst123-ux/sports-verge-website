import React from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { contentApi } from "@/lib/content-api";
import { buildSeoMetadata, getSeoDefaultsForPath } from "@/lib/seo";

export async function generateMetadata() {
  const path = "/how-to-use";
  const seo = await contentApi.seo(path).catch(() => null);
  const defaults = getSeoDefaultsForPath(path);
  return buildSeoMetadata(seo?.data, {
    title: defaults.defaultTitle,
    description: defaults.defaultDescription,
  }, path, { preferDefaults: true });
}

const steps = [
  { num: "01", icon: "bi-house-door-fill", color: "#22c55e", title: "Start on the Homepage", desc: "The homepage gives you a live snapshot — hero news banner, live scores sidebar, upcoming fixtures, and the latest articles from every sport category." },
  { num: "02", icon: "bi-broadcast", color: "#3b82f6", title: "Check Live Scores", desc: "Navigate to Live Scores to see real-time match updates across Cricket, Football, and NFL. Click any match to open its detailed scorecard or match stats page." },
  { num: "03", icon: "bi-newspaper", color: "#f59e0b", title: "Read the News", desc: "Go to the News section to browse our editorial articles. Use the category tabs for Cricket, Football, and NFL or the search bar to find exactly what you're looking for." },
  { num: "04", icon: "bi-calendar-event", color: "#ec4899", title: "Plan with Fixtures", desc: "Check the Fixtures page to see upcoming matches across all sports. Filter by date or sport and never miss a game." },
  { num: "05", icon: "bi-bar-chart-line", color: "#8b5cf6", title: "Track Standings", desc: "View team standings and league tables on the Standings page. See where your favorite team sits in the table after each round of games." },
  { num: "06", icon: "bi-search", color: "#06b6d4", title: "Use the Search", desc: "Use the search icon in the navigation bar to quickly find news articles, match results, or teams across the entire SportsVerge platform." },
];

export default function HowToUsePage() {
  return (
    <main className="font-outfit">
      <div className="container custom-container" style={{ maxWidth: "860px" }}>
        {/* Header */}
        <PageHeader
          title="How to Use SportsVerge"
          subtitle="New here? This guide walks you through everything SportsVerge has to offer."
          className="mb-5 px-0"
        />

        <div className="d-flex flex-column gap-4">
          {steps.map((step, i) => (
            <div key={i} className="d-flex gap-4 align-items-start rounded-4 p-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
              <div className="d-flex align-items-center justify-content-center rounded-3 fw-bold font-space-grotesk flex-shrink-0" style={{ width: "56px", height: "56px", background: `${step.color}15`, color: step.color, fontSize: "18px" }}>
                {step.num}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className={`bi ${step.icon}`} style={{ color: step.color, fontSize: "1rem" }}></i>
                  <h5 className="fw-bold mb-0 font-space-grotesk" style={{ color: "#1C1F22", fontSize: "16px" }}>{step.title}</h5>
                </div>
                <p className="lh-lg mb-0" style={{ color: "#5C646D", fontSize: "14px" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-4 p-5 mt-5 text-center shadow-sm" style={{ background: "linear-gradient(135deg, #FAF6EF 0%, #FFFFFF 100%)", border: "1px solid #EAE5DC" }}>
          <h4 className="fw-bold mb-3 font-space-grotesk" style={{ color: "#1C1F22" }}>Ready to Dive In?</h4>
          <p className="mb-4" style={{ color: "#5C646D", fontSize: "14px" }}>Start exploring live scores, breaking news, and more.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link href="/" className="btn fw-bold rounded-pill px-5 py-2 shadow-sm" style={{ background: "#FFCC00", color: "#1C1F22", border: "none" }}>Go to Homepage</Link>
            <Link href="/faqs" className="btn fw-bold rounded-pill px-5 py-2" style={{ background: "#FFFFFF", color: "#1C1F22", border: "1px solid #1C1F22" }}>Read FAQs</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
