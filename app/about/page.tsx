import React from "react";
import Link from "next/link";

export const metadata = { title: "About Us – The SportsVerge" };

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
    <main className="min-vh-100 font-outfit" style={{ background: "var(--bg-dark)", color: "var(--text-light)", paddingBottom: "80px" }}>
      {/* Hero */}
      <section className="position-relative overflow-hidden py-5" style={{ borderBottom: "1px solid var(--border-dark)" }}>
        <div className="container custom-container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-success rounded-pill px-3 py-2 mb-3 fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.08em" }}>
                🏆 ABOUT SPORTSVERGE
              </span>
              <h1 className="fw-bold text-white mb-4 font-space-grotesk lh-sm" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
                The Home of Live Sports Coverage
              </h1>
              <p className="text-muted lh-lg mb-4" style={{ fontSize: "15px" }}>
                SportsVerge is your ultimate destination for real-time scores, in-depth editorial news, fixtures, standings, and everything sports — all in one beautifully designed platform.
              </p>
              <Link href="/contact" className="btn btn-success fw-bold rounded-pill px-5 py-2">
                Get in Touch
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                {stats.map((s) => (
                  <div key={s.label} className="col-6">
                    <div className="rounded-4 p-4 text-center h-100" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                      <i className={`bi ${s.icon} text-success mb-2 d-block`} style={{ fontSize: "1.8rem" }}></i>
                      <div className="fw-bold text-white font-space-grotesk" style={{ fontSize: "1.8rem" }}>{s.value}</div>
                      <div className="text-muted" style={{ fontSize: "12px" }}>{s.label}</div>
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
              <div className="rounded-4 p-5 text-center" style={{ background: "linear-gradient(135deg, rgba(26,140,61,0.12), rgba(26,140,61,0.03))", border: "1px solid rgba(26,140,61,0.25)" }}>
                <i className="bi bi-bullseye text-success mb-3 d-block" style={{ fontSize: "4rem" }}></i>
                <h3 className="fw-bold text-white mb-2 font-space-grotesk">Our Mission</h3>
                <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                  To deliver the fastest, most accurate, and most engaging sports experience to fans worldwide.
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <h2 className="fw-bold text-white mb-4 font-space-grotesk" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
                Built by Sports Fans, <span className="text-success">For Sports Fans</span>
              </h2>
              <p className="text-muted lh-lg mb-3" style={{ fontSize: "15px" }}>
                SportsVerge was founded with a simple vision: every sports fan deserves instant, reliable, and beautifully presented sports information. From live cricket scores to NFL standings, from AFL match reports to World Cup football coverage — we cover it all.
              </p>
              <p className="text-muted lh-lg mb-4" style={{ fontSize: "15px" }}>
                Our editorial team works around the clock to bring you breaking news, expert analysis, and deep-dive features that go beyond the scoreboard. Whether you are a casual viewer or a die-hard fanatic, SportsVerge is built for you.
              </p>
              <div className="d-flex flex-wrap gap-2">
                {["Cricket", "Football", "NFL", "AFL", "Live Scores", "News"].map((tag) => (
                  <span key={tag} className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: "rgba(26,140,61,0.15)", color: "#86efac", border: "1px solid rgba(26,140,61,0.3)", fontSize: "12px" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-5" style={{ background: "var(--header-bg)" }}>
        <div className="container custom-container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-white font-space-grotesk mb-2">Meet the Team</h2>
            <p className="text-muted" style={{ fontSize: "14px" }}>The passionate people behind SportsVerge</p>
          </div>
          <div className="row g-4 justify-content-center">
            {team.map((m) => (
              <div key={m.name} className="col-sm-6 col-lg-3">
                <div className="rounded-4 p-4 text-center h-100 transition-all hover-translate" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                  <i className={`bi ${m.icon} text-success mb-3 d-block`} style={{ fontSize: "3rem" }}></i>
                  <h6 className="fw-bold text-white mb-1">{m.name}</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "12px" }}>{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container custom-container py-4 text-center">
          <div className="rounded-4 p-5" style={{ background: "linear-gradient(135deg, rgba(26,140,61,0.1), rgba(26,140,61,0.02))", border: "1px solid rgba(26,140,61,0.2)" }}>
            <h2 className="fw-bold text-white mb-3 font-space-grotesk">Ready to Follow the Action?</h2>
            <p className="text-muted mb-4" style={{ fontSize: "15px" }}>Join thousands of fans who trust SportsVerge for their daily sports fix.</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link href="/news" className="btn btn-success fw-bold rounded-pill px-5 py-2">Browse News</Link>
              <Link href="/live-scores" className="btn btn-outline-light fw-bold rounded-pill px-5 py-2">Live Scores</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
