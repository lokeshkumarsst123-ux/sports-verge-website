import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Betting Odds & Predictions – The SportsVerge" };

const odds = [
  {
    sport: "Football",
    match: "Manchester City vs Arsenal",
    league: "Premier League",
    date: "Today, 8:30 PM",
    homeOdds: "1.85",
    drawOdds: "3.60",
    awayOdds: "4.20",
    prediction: "Man City win",
  },
  {
    sport: "Cricket",
    match: "CSK vs RCB",
    league: "IPL 2026",
    date: "Today, 7:30 PM",
    homeOdds: "1.72",
    drawOdds: "--",
    awayOdds: "2.10",
    prediction: "CSK win",
  },
  {
    sport: "NFL",
    match: "Kansas City Chiefs vs Buffalo Bills",
    league: "NFL Pre-season",
    date: "Tomorrow, 6:00 AM",
    homeOdds: "1.55",
    drawOdds: "12.0",
    awayOdds: "2.55",
    prediction: "Chiefs win",
  },
];

export default function BettingOddsPage() {
  return (
    <main className="font-outfit">
      <PageHeader
        title="Betting Odds & Analytics"
        subtitle="Real-time betting market odds multipliers and match outcome analytical predictions."
        className="mb-5"
      />

      <div className="container custom-container mb-5">
        <div className="rounded-4 p-4 d-flex align-items-center gap-3" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <div className="d-flex align-items-center justify-content-center rounded-3 bg-warning bg-opacity-10 text-warning" style={{ width: "44px", height: "44px", flexShrink: 0 }}>
            <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "1.2rem" }}></i>
          </div>
          <div>
            <h6 className="fw-bold text-white mb-1 font-space-grotesk" style={{ fontSize: "14px" }}>18+ Responsible Gaming Disclaimer</h6>
            <p className="text-muted mb-0 small" style={{ lineHeight: "1.5" }}>
              These statistics are for analytical and news reporting purposes only. SportsVerge does not host gambling or betting. Please play responsibly.
            </p>
          </div>
        </div>
      </div>

      <div className="container custom-container">
        <div className="d-flex flex-column gap-4">
          {odds.map((o, i) => (
            <div key={i} className="rounded-4 p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                <div>
                  <span className="badge rounded-pill px-3 py-1 fw-semibold me-2" style={{ fontSize: "10px", background: "rgba(26,140,61,0.15)", color: "#86efac", border: "1px solid rgba(26,140,61,0.3)" }}>
                    {o.sport}
                  </span>
                  <span className="text-muted small">{o.league} · {o.date}</span>
                </div>
                <div className="text-end">
                  <span className="small text-muted">Model Predicts: <strong className="text-success">{o.prediction}</strong></span>
                </div>
              </div>

              <h5 className="fw-bold text-white mb-4 font-space-grotesk">{o.match}</h5>

              <div className="row g-3 text-center">
                <div className="col-4">
                  <div className="rounded-3 p-3" style={{ background: "var(--bg-dark)", border: "1px solid var(--border-dark)" }}>
                    <div className="text-muted small mb-1">1 (Home)</div>
                    <div className="fw-bold text-success font-monospace" style={{ fontSize: "16px" }}>{o.homeOdds}</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="rounded-3 p-3" style={{ background: "var(--bg-dark)", border: "1px solid var(--border-dark)" }}>
                    <div className="text-muted small mb-1">X (Draw)</div>
                    <div className="fw-bold text-muted font-monospace" style={{ fontSize: "16px" }}>{o.drawOdds}</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="rounded-3 p-3" style={{ background: "var(--bg-dark)", border: "1px solid var(--border-dark)" }}>
                    <div className="text-muted small mb-1">2 (Away)</div>
                    <div className="fw-bold text-success font-monospace" style={{ fontSize: "16px" }}>{o.awayOdds}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
