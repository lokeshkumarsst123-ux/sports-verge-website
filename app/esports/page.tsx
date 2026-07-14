import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Esports – The SportsVerge" };

const tournaments = [
  {
    title: "VCT Champions 2026",
    game: "Valorant",
    prizePool: "$2,250,000",
    teams: "16 Teams",
    date: "Starts Aug 2026",
    status: "Upcoming",
    icon: "bi-controller",
  },
  {
    title: "PGL Major Copenhagen",
    game: "CS2",
    prizePool: "$1,250,000",
    teams: "24 Teams",
    date: "Live Matchday 4",
    status: "Live",
    icon: "bi-controller",
  },
  {
    title: "League of Legends Worlds Play-ins",
    game: "LoL",
    prizePool: "$2,225,000",
    teams: "20 Teams",
    date: "Starts Sep 2026",
    status: "Upcoming",
    icon: "bi-controller",
  },
  {
    title: "Rocket League Championship Series",
    game: "RLCS",
    prizePool: "$1,000,000",
    teams: "16 Teams",
    date: "Completed 05 Jul",
    status: "Completed",
    icon: "bi-controller",
  },
];

export default function EsportsPage() {
  return (
    <main className="min-vh-100 font-outfit" style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "40px 0 80px 0" }}>
      <PageHeader
        title="Esports Arena"
        subtitle="Live scores, schedule updates, and insights on the biggest gaming tournaments in the world."
        className="mb-5"
      />

      <div className="container custom-container">
        <div className="row g-4">
          {tournaments.map((t, i) => (
            <div key={i} className="col-md-6">
              <div className="rounded-4 p-4 h-100 d-flex flex-column justify-content-between" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge rounded-pill px-3 py-1 fw-semibold" style={{ fontSize: "10px", background: "rgba(236,72,153,0.12)", color: "#ec4899", border: "1px solid rgba(236,72,153,0.25)" }}>
                      {t.game}
                    </span>
                    <span className={`badge rounded-pill px-3 py-1 fw-semibold`} style={{
                      fontSize: "10px",
                      background: t.status === "Live" ? "rgba(239,68,68,0.12)" : t.status === "Upcoming" ? "rgba(245,158,11,0.12)" : "rgba(107,114,128,0.15)",
                      color: t.status === "Live" ? "#ef4444" : t.status === "Upcoming" ? "#f59e0b" : "#9ca3af",
                    }}>
                      {t.status}
                    </span>
                  </div>

                  <h5 className="fw-bold text-white mb-3 font-space-grotesk">{t.title}</h5>

                  <div className="d-flex flex-column gap-2 mb-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted small">Prize Pool</span>
                      <span className="text-white fw-semibold font-monospace">{t.prizePool}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted small">Participants</span>
                      <span className="text-white small fw-medium">{t.teams}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted small">Schedule</span>
                      <span className="text-muted small font-monospace">{t.date}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {t.status === "Live" && (
                    <button className="btn btn-danger fw-bold rounded-pill w-100 py-2 d-flex align-items-center justify-content-center gap-1">
                      <span className="d-inline-block rounded-circle me-1 bg-white" style={{ width: "6px", height: "6px", animation: "pulse 1.5s infinite" }}></span>
                      Watch Live Stream
                    </button>
                  )}
                  {t.status === "Upcoming" && (
                    <button className="btn btn-outline-light fw-bold rounded-pill w-100 py-2">
                      Get Match Reminders
                    </button>
                  )}
                  {t.status === "Completed" && (
                    <button className="btn btn-outline-secondary fw-bold rounded-pill w-100 py-2" disabled>
                      Tournament Concluded
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
