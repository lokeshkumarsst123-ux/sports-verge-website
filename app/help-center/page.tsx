import React from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Help Center – The SportsVerge" };

const topics = [
  { icon: "bi-broadcast", color: "#22c55e", title: "Live Scores", desc: "How to read live scores, understand updates, and enable alerts.", href: "/faqs#LiveScores" },
  { icon: "bi-person-circle", color: "#3b82f6", title: "My Account", desc: "Managing your profile, password resets, and notification settings.", href: "/faqs#Account" },
  { icon: "bi-newspaper", color: "#f59e0b", title: "News & Editorial", desc: "Browsing articles, sharing content, and news categories explained.", href: "/news" },
  { icon: "bi-calendar-event", color: "#ec4899", title: "Fixtures & Results", desc: "Understanding fixture schedules, past results, and match detail pages.", href: "/fixtures" },
  { icon: "bi-bar-chart-line", color: "#8b5cf6", title: "Standings & Stats", desc: "How team standings, league tables, and performance stats are calculated.", href: "/standings" },
  { icon: "bi-envelope-fill", color: "#06b6d4", title: "Contact & Feedback", desc: "Reach our support team or leave feedback about your experience.", href: "/contact" },
];

export default function HelpCenterPage() {
  return (
    <main className="min-vh-100 font-outfit" style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "40px 0 80px 0" }}>
      <div className="container custom-container">
        {/* Header */}
        <PageHeader
          title="Help Center"
          subtitle="Browse common topics below or visit our FAQs page for detailed answers."
          className="mb-5 px-0"
        />

        <div className="row g-4">
          {topics.map((t) => (
            <div key={t.title} className="col-sm-6 col-lg-4">
              <Link href={t.href} className="text-decoration-none d-block h-100">
                <div className="rounded-4 p-4 h-100 transition-all hover-translate" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                  <div className="d-flex align-items-center justify-content-center rounded-3 mb-3" style={{ width: "48px", height: "48px", background: `${t.color}15` }}>
                    <i className={`bi ${t.icon}`} style={{ fontSize: "1.4rem", color: t.color }}></i>
                  </div>
                  <h6 className="fw-bold text-white mb-2 font-space-grotesk">{t.title}</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "13px", lineHeight: "1.6" }}>{t.desc}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="rounded-4 p-5 mt-5 text-center" style={{ background: "linear-gradient(135deg, rgba(26,140,61,0.1), rgba(26,140,61,0.02))", border: "1px solid rgba(26,140,61,0.2)" }}>
          <i className="bi bi-headset text-success mb-3 d-block" style={{ fontSize: "2.5rem" }}></i>
          <h4 className="fw-bold text-white mb-2 font-space-grotesk">Still Need Help?</h4>
          <p className="text-muted mb-4" style={{ fontSize: "14px" }}>Our support team is available to assist you with any questions or issues.</p>
          <Link href="/contact" className="btn btn-success fw-bold rounded-pill px-5 py-2">Contact Support</Link>
        </div>
      </div>
    </main>
  );
}
