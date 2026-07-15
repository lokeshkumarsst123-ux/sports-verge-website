import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Podcasts & Videos – The SportsVerge" };

const episodes = [
  {
    title: "The SportsVerge Daily - Ashes Series Preview & Team Selection",
    type: "Audio Podcast",
    duration: "45 mins",
    host: "Alex Carter & Priyanka Sharma",
    date: "14 Jul 2026",
    desc: "A deep dive into Australia and England's squad choices ahead of the opening Ashes test at Edgbaston.",
    icon: "bi-mic-fill",
  },
  {
    title: "Vlog: Pitchside Analysis at Manchester Etihad Stadium",
    type: "Video Watch",
    duration: "18 mins",
    host: "Marcus Sterling",
    date: "13 Jul 2026",
    desc: "Behind the scenes access and pre-match press conference highlights ahead of Manchester City vs Arsenal.",
    icon: "bi-play-btn-fill",
  },
  {
    title: "Gridiron Breakdown - NFL Pre-Season Quarterback Battles",
    type: "Audio Podcast",
    duration: "52 mins",
    host: "Dave Miller & guest Shawn Taylor",
    date: "12 Jul 2026",
    desc: "Analysing the starting QB position battles at Buffalo Bills and Dallas Cowboys training camps.",
    icon: "bi-mic-fill",
  },
  {
    title: "AFL Tactics Class: How Carlton Built the Midfield Block",
    type: "Video Watch",
    duration: "25 mins",
    host: "Coach Terry Vance",
    date: "10 Jul 2026",
    desc: "A tactical masterclass showing tactical overhead footage analysis of Blues' defensive setups.",
    icon: "bi-play-btn-fill",
  },
];

export default function PodcastsPage() {
  return (
    <main className="font-outfit">
      <PageHeader
        title="Podcasts & Videos"
        subtitle="Listen to expert analyses and watch match reviews from our team of professional sports journalists."
        className="mb-5"
      />

      <div className="container custom-container">
        <div className="row g-4">
          {episodes.map((ep, i) => (
            <div key={i} className="col-12 col-md-6">
              <div className="rounded-4 p-4 h-100 d-flex flex-column justify-content-between" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1" style={{
                      fontSize: "10px",
                      background: ep.type.includes("Video") ? "rgba(59,130,246,0.12)" : "rgba(34,197,94,0.12)",
                      color: ep.type.includes("Video") ? "#3b82f6" : "#22c55e",
                    }}>
                      <i className={`bi ${ep.icon}`}></i> {ep.type}
                    </span>
                    <span className="text-muted font-monospace" style={{ fontSize: "11px" }}>{ep.duration}</span>
                  </div>

                  <h5 className="fw-bold text-white mb-2 font-space-grotesk lh-sm" style={{ fontSize: "16px" }}>{ep.title}</h5>
                  <p className="text-muted mb-4" style={{ fontSize: "13px", lineHeight: "1.6" }}>{ep.desc}</p>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-10">
                  <div className="text-muted" style={{ fontSize: "11px" }}>
                    Hosted by <span className="text-light fw-medium">{ep.host}</span>
                  </div>
                  <button className="btn btn-sm btn-success rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1" style={{ fontSize: "12px" }}>
                    <i className="bi bi-play-fill"></i> Play
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
