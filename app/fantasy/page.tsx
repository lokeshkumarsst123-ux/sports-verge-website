import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Fantasy Leagues – The SportsVerge" };

const leagues = [
  {
    title: "IPL Fantasy League 2026",
    sport: "Cricket",
    prizePool: "₹50 Lakhs",
    joined: "128,450 Managers",
    status: "Active",
    deadline: "Starts in 2 hours",
    icon: "bi-trophy",
  },
  {
    title: "Premier League Matchday 38",
    sport: "Football",
    prizePool: "£25,000",
    joined: "340,910 Managers",
    status: "Active",
    deadline: "Sat, 5:30 PM",
    icon: "bi-dribbble",
  },
  {
    title: "Gridiron Grid Power Cup",
    sport: "NFL",
    prizePool: "$10,000",
    joined: "12,890 Managers",
    status: "Upcoming",
    deadline: "Begins Pre-season",
    icon: "bi-shield",
  },
  {
    title: "AFL Finals Showdown",
    sport: "AFL",
    prizePool: "$5,000 AUD",
    joined: "8,920 Managers",
    status: "Completed",
    deadline: "Finished 06 Jul",
    icon: "bi-circle",
  },
];

export default function FantasyLeaguesPage() {
  return (
    <main className="font-outfit">
      <PageHeader
        title="Fantasy Leagues"
        subtitle="Build your dream team, join official public leagues, and win exclusive prizes."
        className="mb-5"
      />

      <div className="container custom-container">
        <div className="row g-4">
          {leagues.map((l, i) => (
            <div key={i} className="col-md-6">
              <div className="rounded-4 p-4 h-100 d-flex flex-column justify-content-between" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge rounded-pill px-3 py-1 fw-semibold" style={{ fontSize: "10px", background: "rgba(26,140,61,0.15)", color: "#86efac", border: "1px solid rgba(26,140,61,0.3)" }}>
                      {l.sport}
                    </span>
                    <span className={`badge rounded-pill px-3 py-1 fw-semibold`} style={{
                      fontSize: "10px",
                      background: l.status === "Active" ? "rgba(34,197,94,0.12)" : l.status === "Upcoming" ? "rgba(245,158,11,0.12)" : "rgba(107,114,128,0.15)",
                      color: l.status === "Active" ? "#22c55e" : l.status === "Upcoming" ? "#f59e0b" : "#9ca3af",
                    }}>
                      {l.status}
                    </span>
                  </div>

                  <h5 className="fw-bold text-white mb-3 font-space-grotesk">{l.title}</h5>

                  <div className="d-flex flex-column gap-2 mb-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted small">Prize Pool</span>
                      <span className="text-white fw-semibold font-monospace">{l.prizePool}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted small">Registered</span>
                      <span className="text-white small fw-medium">{l.joined}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted small">Entry Deadline</span>
                      <span className="text-muted small font-monospace">{l.deadline}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {l.status === "Active" && (
                    <button className="btn btn-success fw-bold rounded-pill w-100 py-2">
                      Join & Draft Team
                    </button>
                  )}
                  {l.status === "Upcoming" && (
                    <button className="btn btn-outline-success fw-bold rounded-pill w-100 py-2">
                      Pre-register
                    </button>
                  )}
                  {l.status === "Completed" && (
                    <button className="btn btn-outline-secondary fw-bold rounded-pill w-100 py-2" disabled>
                      League Finished
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
