import React from "react";
import Link from "next/link";
import { contentApi } from "@/lib/content-api";
import { buildSeoMetadata, getSeoDefaultsForPath } from "@/lib/seo";

export async function generateMetadata() {
  const path = "/about";
  const seo = await contentApi.seo(path).catch(() => null);
  const defaults = getSeoDefaultsForPath(path);
  return buildSeoMetadata(seo?.data, {
    title: defaults.defaultTitle,
    description: defaults.defaultDescription,
  }, path, { preferDefaults: true });
}

const stats = [
  { label: "Live Matches", value: "500+", icon: "bi-broadcast" },
  { label: "Sports Covered", value: "10+", icon: "bi-trophy" },
  { label: "Daily Users", value: "50K+", icon: "bi-people" },
  { label: "News Articles", value: "1000+", icon: "bi-newspaper" },
];

const team = [
  { name: "Alex Carter", role: "Founder & CEO", icon: "bi-person-circle" },
  { name: "Priya Sharma", role: "Head of Editorial", icon: "bi-person-circle" },
  { name: "James O'Brien", role: "Lead Developer", icon: "bi-person-circle" },
  { name: "Sofia Müller", role: "Product Designer", icon: "bi-person-circle" },
];

export default function AboutPage() {
  return (
    <main className="min-vh-100 font-outfit" style={{ background: "#FFFDF9", color: "#1C1F22", paddingBottom: "80px" }}>
      {/* Hero */}
      <section className="position-relative overflow-hidden py-5" style={{ borderBottom: "1px solid #EAE5DC" }}>
        <div className="container custom-container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge rounded-pill px-3 py-2 mb-3 fw-bold" style={{ background: "#FFCC00", color: "#1C1F22", fontSize: "11px", letterSpacing: "0.08em" }}>
                🏆 ABOUT SPORTSVERGE
              </span>
              <h1 className="fw-bold mb-4 font-space-grotesk lh-sm" style={{ color: "#1C1F22", fontSize: "clamp(2.2rem, 5vw, 3.2rem)", letterSpacing: "-0.02em" }}>
                The Home of Live Sports Coverage
              </h1>
              <p className="lh-lg mb-4" style={{ color: "#5C646D", fontSize: "16px" }}>
                SportsVerge is your ultimate destination for real-time scores, in-depth editorial news, fixtures, standings, and everything sports — all in one beautifully designed platform.
              </p>
              <Link href="/contact" className="btn fw-bold rounded-pill px-5 py-2 shadow-sm" style={{ background: "#FFCC00", color: "#1C1F22", border: "none" }}>
                Get in Touch
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                {stats.map((s) => (
                  <div key={s.label} className="col-6">
                    <div className="rounded-4 p-4 text-center h-100 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
                      <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: "52px", height: "52px", background: "#FAF6EF", color: "#FFCC00" }}>
                        <i className={`bi ${s.icon}`} style={{ fontSize: "1.5rem" }}></i>
                      </div>
                      <div className="fw-bold font-space-grotesk mb-1" style={{ color: "#1C1F22", fontSize: "2rem" }}>{s.value}</div>
                      <div className="fw-medium" style={{ color: "#5C646D", fontSize: "13px" }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-5">
        <div className="container custom-container py-4">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <div className="rounded-4 p-5 text-center shadow-sm" style={{ background: "linear-gradient(135deg, #FAF6EF 0%, #FFFFFF 100%)", border: "1px solid #EAE5DC" }}>
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: "80px", height: "80px", background: "#FFFDF9", border: "2px solid #FFCC00", color: "#FFCC00" }}>
                  <i className="bi bi-bullseye" style={{ fontSize: "2.5rem" }}></i>
                </div>
                <h3 className="fw-bold mb-2 font-space-grotesk" style={{ color: "#1C1F22" }}>Our Mission</h3>
                <p className="mb-0" style={{ color: "#5C646D", fontSize: "14px", lineHeight: "1.6" }}>
                  To deliver the fastest, most accurate, and most engaging sports experience to fans worldwide.
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <h2 className="fw-bold mb-4 font-space-grotesk" style={{ color: "#1C1F22", fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
                Built by Sports Fans, <span style={{ color: "#4A90E2" }}>For Sports Fans</span>
              </h2>
              <p className="lh-lg mb-3" style={{ color: "#5C646D", fontSize: "15px" }}>
                SportsVerge was founded with a simple vision: every sports fan deserves instant, reliable, and beautifully presented sports information. From live cricket scores to NFL standings and World Cup football coverage — we cover it all.
              </p>
              <p className="lh-lg mb-4" style={{ color: "#5C646D", fontSize: "15px" }}>
                Our editorial team works around the clock to bring you breaking news, expert analysis, and deep-dive features that go beyond the scoreboard. Whether you are a casual viewer or a die-hard fanatic, SportsVerge is built for you.
              </p>
              <div className="d-flex flex-wrap gap-2">
                {["Cricket", "Football", "NFL", "Live Scores", "News"].map((tag) => (
                  <span key={tag} className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: "#FAF6EF", color: "#1C1F22", border: "1px solid #EAE5DC", fontSize: "13px" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-5" style={{ background: "#FAF6EF", borderTop: "1px solid #EAE5DC", borderBottom: "1px solid #EAE5DC" }}>
        <div className="container custom-container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold font-space-grotesk mb-2" style={{ color: "#1C1F22" }}>Meet the Team</h2>
            <p style={{ color: "#5C646D", fontSize: "14px" }}>The passionate people behind SportsVerge</p>
          </div>
          <div className="row g-4 justify-content-center">
            {team.map((m) => (
              <div key={m.name} className="col-sm-6 col-lg-3">
                <div className="rounded-4 p-4 text-center h-100 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: "64px", height: "64px", background: "#FAF6EF", color: "#FFCC00" }}>
                    <i className={`bi ${m.icon}`} style={{ fontSize: "2rem" }}></i>
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: "#1C1F22", fontSize: "16px" }}>{m.name}</h6>
                  <p className="mb-0 fw-medium" style={{ color: "#5C646D", fontSize: "13px" }}>{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container custom-container py-4 text-center">
          <div className="rounded-4 p-5 shadow-sm" style={{ background: "linear-gradient(135deg, #FAF6EF 0%, #FFFFFF 100%)", border: "1px solid #EAE5DC" }}>
            <h2 className="fw-bold mb-3 font-space-grotesk" style={{ color: "#1C1F22" }}>Ready to Follow the Action?</h2>
            <p className="mb-4" style={{ color: "#5C646D", fontSize: "15px" }}>Join thousands of fans who trust SportsVerge for their daily sports fix.</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link href="/news" className="btn fw-bold rounded-pill px-5 py-2 shadow-sm" style={{ background: "#FFCC00", color: "#1C1F22", border: "none" }}>Browse News</Link>
              <Link href="/live-scores" className="btn fw-bold rounded-pill px-5 py-2" style={{ background: "#FFFFFF", color: "#1C1F22", border: "1px solid #1C1F22" }}>Live Scores</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
