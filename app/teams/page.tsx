import React from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Popular Teams – The SportsVerge" };

const sportsTeams = [
  {
    sport: "Cricket (IPL)",
    teams: [
      { name: "Chennai Super Kings", code: "CSK", logo: "/assets/imgs/teams/ipl/CSKoutline.png" },
      { name: "Royal Challengers Bengaluru", code: "RCB", logo: "/assets/imgs/teams/ipl/RCBoutline.png" },
      { name: "Mumbai Indians", code: "MI", logo: "/assets/imgs/teams/ipl/CSKoutline.png" },
      { name: "Kolkata Knight Riders", code: "KKR", logo: "/assets/imgs/teams/ipl/RCBoutline.png" },
    ],
  },
  {
    sport: "Football (Premier League)",
    teams: [
      { name: "Manchester City", code: "MCI", logo: "/assets/imgs/teams/Manchester_City_FC_badge.svg" },
      { name: "Arsenal FC", code: "ARS", logo: "/assets/imgs/teams/Arsenal_FC.svg" },
      { name: "Liverpool FC", code: "LIV", logo: "/assets/imgs/teams/Liverpool_FC.svg" },
      { name: "Aston Villa", code: "AVL", logo: "/assets/imgs/teams/Aston_Villa_FC_new_crest.svg" },
    ],
  },
  {
    sport: "NFL",
    teams: [
      { name: "Kansas City Chiefs", code: "KC", logo: "/assets/imgs/teams/Kansas_City_Chiefs_logo.svg" },
      { name: "Buffalo Bills", code: "BUF", logo: "/assets/imgs/teams/Buffalo_Bills_logo.svg" },
    ],
  },
  {
    sport: "AFL",
    teams: [
      { name: "Brisbane Lions", code: "BL", logo: "/assets/imgs/teams/Brisbane_Lions_logo_2010.svg" },
      { name: "Essendon Bombers", code: "ESS", logo: "/assets/imgs/teams/Essendon_FC_logo.svg" },
    ],
  },
];

export default function TeamsPage() {
  return (
    <main className="min-vh-100 font-outfit" style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "40px 0 80px 0" }}>
      <PageHeader
        title="Popular Teams"
        subtitle="Browse major teams across Cricket, Football, NFL & AFL. Click to see their recent fixtures and stats."
        className="mb-5"
      />

      <div className="container custom-container">
        <div className="d-flex flex-column gap-5">
          {sportsTeams.map((group, idx) => (
            <div key={idx}>
              <h5 className="fw-bold text-white mb-4 border-start border-success border-3 ps-2 font-space-grotesk" style={{ fontSize: "16px" }}>
                {group.sport}
              </h5>
              <div className="row g-3">
                {group.teams.map((t, tIdx) => (
                  <div key={tIdx} className="col-12 col-sm-6 col-md-3">
                    <Link href={`/search?q=${t.name}`} className="text-decoration-none">
                      <div className="rounded-4 p-4 text-center h-100 transition-all hover-translate" style={{ background: "var(--bg-card)", border: "1px solid var(--border-dark)" }}>
                        <div className="d-flex align-items-center justify-content-center mx-auto mb-3 overflow-hidden rounded-3" style={{ width: "64px", height: "64px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-dark)" }}>
                          <img src={t.logo} alt={t.name} className="w-75 h-75 object-fit-contain" />
                        </div>
                        <h6 className="fw-bold text-white mb-1" style={{ fontSize: "14px" }}>{t.name}</h6>
                        <span className="badge rounded-pill fw-semibold font-monospace" style={{ fontSize: "10px", background: "rgba(26,140,61,0.12)", color: "#86efac" }}>
                          {t.code}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
