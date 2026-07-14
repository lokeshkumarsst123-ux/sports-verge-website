import React from "react";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Standings – The SportsVerge" };

const standingsTabs = [
  {
    sport: "Cricket – IPL 2026",
    color: "#22c55e",
    headers: ["#", "Team", "P", "W", "L", "NR", "Pts", "NRR"],
    rows: [
      ["1", "Mumbai Indians", "14", "10", "4", "0", "20", "+0.842"],
      ["2", "CSK", "14", "9", "5", "0", "18", "+0.531"],
      ["3", "RCB", "14", "8", "5", "1", "17", "+0.310"],
      ["4", "Delhi Capitals", "14", "7", "6", "1", "15", "+0.122"],
      ["5", "KKR", "14", "6", "8", "0", "12", "-0.244"],
    ],
  },
  {
    sport: "Football – Premier League",
    color: "#3b82f6",
    headers: ["#", "Club", "P", "W", "D", "L", "GD", "Pts"],
    rows: [
      ["1", "Arsenal", "38", "28", "5", "5", "+62", "89"],
      ["2", "Manchester City", "38", "26", "7", "5", "+55", "85"],
      ["3", "Liverpool", "38", "24", "9", "5", "+47", "81"],
      ["4", "Chelsea", "38", "21", "7", "10", "+22", "70"],
      ["5", "Tottenham", "38", "18", "8", "12", "+14", "62"],
    ],
  },
  {
    sport: "NFL – AFC Standings",
    color: "#f59e0b",
    headers: ["#", "Team", "W", "L", "T", "PCT", "PF", "PA"],
    rows: [
      ["1", "Kansas City Chiefs", "13", "4", "0", ".765", "426", "337"],
      ["2", "Buffalo Bills", "11", "6", "0", ".647", "388", "304"],
      ["3", "Miami Dolphins", "11", "6", "0", ".647", "496", "391"],
      ["4", "Baltimore Ravens", "10", "7", "0", ".588", "413", "355"],
      ["5", "Cincinnati Bengals", "9", "8", "0", ".529", "418", "399"],
    ],
  },
  {
    sport: "AFL – 2026 Season",
    color: "#ec4899",
    headers: ["#", "Club", "P", "W", "L", "D", "Pts", "%"],
    rows: [
      ["1", "Carlton Blues", "16", "12", "3", "1", "50", "133.4"],
      ["2", "Geelong Cats", "16", "11", "4", "1", "46", "122.1"],
      ["3", "Gold Coast Suns", "16", "10", "6", "0", "40", "108.7"],
      ["4", "Western Bulldogs", "16", "9", "7", "0", "36", "103.2"],
      ["5", "Sydney Swans", "16", "8", "7", "1", "34", "98.6"],
    ],
  },
];

const getTeamLogo = (name: string): string => {
  const n = name.toLowerCase();
  
  // IPL
  if (n.includes("mumbai") || n === "mi") return "/assets/imgs/teams/ipl/MIoutline.png";
  if (n.includes("csk") || n.includes("chennai")) return "/assets/imgs/teams/ipl/CSKoutline.png";
  if (n.includes("rcb") || n.includes("bengaluru")) return "/assets/imgs/teams/ipl/RCBoutline.png";
  if (n.includes("delhi") || n === "dc") return "/assets/imgs/teams/ipl/DCoutline.png";
  if (n.includes("kolkata") || n === "kkr") return "/assets/imgs/teams/ipl/KKRoutline.png";
  if (n.includes("rajasthan") || n === "rr") return "/assets/imgs/teams/ipl/RRoutline.png";
  if (n.includes("hyderabad") || n === "srh") return "/assets/imgs/teams/ipl/SRHoutline.png";
  if (n.includes("gujarat") || n === "gt") return "/assets/imgs/teams/ipl/GToutline.png";
  if (n.includes("lucknow") || n === "lsg") return "/assets/imgs/teams/ipl/LSGoutline.png";
  if (n.includes("punjab") || n === "pbks") return "/assets/imgs/teams/ipl/PBKSoutline.png";

  // Premier League
  if (n.includes("manchester city") || n.includes("man city") || n === "mci") return "/assets/imgs/teams/Manchester_City_FC_badge.svg";
  if (n.includes("manchester united") || n.includes("man utd") || n === "mun") return "/assets/imgs/teams/Manchester_United_FC_crest.png";
  if (n.includes("arsenal") || n === "ars") return "/assets/imgs/teams/Arsenal_FC.svg";
  if (n.includes("liverpool") || n === "liv") return "/assets/imgs/teams/Liverpool_FC.svg";
  if (n.includes("aston villa") || n === "avl") return "/assets/imgs/teams/Aston_Villa_FC_new_crest.svg";
  if (n.includes("tottenham") || n === "tot") return "/assets/imgs/teams/Tottenham_Hotspur.png";
  if (n.includes("newcastle") || n === "new") return "/assets/imgs/teams/Newcastle_United_Logo.svg";

  // NFL
  if (n.includes("chiefs") || n === "kc") return "/assets/imgs/teams/Kansas_City_Chiefs_logo.svg";
  if (n.includes("bills") || n === "buf") return "/assets/imgs/teams/Buffalo_Bills_logo.svg";
  if (n.includes("dolphins") || n === "mia") return "/assets/imgs/teams/Ravens_logo.svg";
  if (n.includes("ravens") || n === "bal") return "/assets/imgs/teams/Ravens_logo.svg";
  if (n.includes("49ers") || n === "sf") return "/assets/imgs/teams/San_Francisco_49ers_logo.svg";
  if (n.includes("bengals") || n === "cin") return "/assets/imgs/teams/Bengals_logo.svg";
  if (n.includes("cowboys") || n === "dal") return "/assets/imgs/teams/Dallas_Cowboys.svg";

  // AFL
  if (n.includes("lions") || n === "bl") return "/assets/imgs/teams/Brisbane_Lions_logo_2010.svg";
  if (n.includes("bombers") || n === "ess") return "/assets/imgs/teams/Essendon_FC_logo.svg";

  // Countries / International
  if (n === "india") return "/assets/imgs/teams/india.webp";
  if (n === "australia") return "/assets/imgs/teams/australia.webp";
  if (n === "england") return "/assets/imgs/teams/england.webp";
  if (n === "south africa") return "/assets/imgs/teams/south-africa.webp";
  if (n === "new zealand") return "/assets/imgs/teams/new-zealand.webp";
  if (n === "pakistan") return "/assets/imgs/teams/pakistan.webp";
  if (n === "sri lanka") return "/assets/imgs/teams/sri-lanka.webp";
  if (n === "afghanistan") return "/assets/imgs/teams/afghanistan.webp";
  if (n === "ireland") return "/assets/imgs/teams/ireland.webp";

  return "";
};

export default function StandingsPage() {
  return (
    <main className="min-vh-100 font-outfit" style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "40px 0 80px 0" }}>
      <PageHeader
        title="Standings"
        subtitle="Current league tables across all sports."
        className="mb-5"
      />

      <section className="py-2">
        <div className="container custom-container">
          <div className="d-flex flex-column gap-5">
            {standingsTabs.map((table) => (
              <div key={table.sport}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="d-inline-block rounded" style={{ width: "3px", height: "18px", background: table.color }}></span>
                  <h5 className="fw-bold text-white mb-0 font-space-grotesk" style={{ fontSize: "15px" }}>{table.sport}</h5>
                </div>
                <div className="premium-table-container">
                  <div className="table-responsive">
                    <table className="premium-table">
                      <thead>
                        <tr>
                          {table.headers.map((h, index) => (
                            <th key={h} className={index === 1 ? "text-start" : index === 0 ? "text-start" : "text-center"}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => {
                              if (j === 0) {
                                return (
                                  <td key={j} className="premium-table-rank text-start" style={{ color: table.color }}>
                                    #{cell}
                                  </td>
                                );
                              }
                              if (j === 1) {
                                const logo = getTeamLogo(cell);
                                return (
                                  <td key={j} className="premium-table-team text-start">
                                    <div className="d-flex align-items-center gap-2">
                                      {logo ? (
                                        <img src={logo} alt={cell} style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                                      ) : (
                                        <div className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold" style={{ width: "20px", height: "20px", fontSize: "10px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                                          {cell.charAt(0)}
                                        </div>
                                      )}
                                      <span className="text-truncate">{cell}</span>
                                    </div>
                                  </td>
                                );
                              }
                              const headerName = table.headers[j]?.toLowerCase() || "";
                              const isPts = headerName === "pts" || headerName === "points";
                              return (
                                <td key={j} className={isPts ? "premium-table-stat-bold text-center" : "premium-table-stat text-center"}>
                                  {cell}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
