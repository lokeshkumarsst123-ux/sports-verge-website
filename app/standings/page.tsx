"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";

const sportsData = {
  cricket: [
    {
      league: "IPL 2026",
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
      league: "T20 World Cup",
      color: "#22c55e",
      headers: ["#", "Team", "P", "W", "L", "NR", "Pts", "NRR"],
      rows: [
        ["1", "India", "5", "5", "0", "0", "10", "+1.250"],
        ["2", "Australia", "5", "4", "1", "0", "8", "+0.910"],
        ["3", "South Africa", "5", "3", "2", "0", "6", "+0.320"],
        ["4", "Pakistan", "5", "2", "3", "0", "4", "-0.150"],
        ["5", "England", "5", "1", "4", "0", "2", "-0.450"],
      ],
    },
  ],
  football: [
    {
      league: "Premier League",
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
      league: "La Liga",
      color: "#3b82f6",
      headers: ["#", "Club", "P", "W", "D", "L", "GD", "Pts"],
      rows: [
        ["1", "Real Madrid", "38", "29", "8", "1", "+61", "95"],
        ["2", "Barcelona", "38", "26", "7", "5", "+43", "85"],
        ["3", "Girona", "38", "25", "6", "7", "+39", "81"],
        ["4", "Atletico Madrid", "38", "24", "4", "10", "+27", "76"],
        ["5", "Athletic Club", "38", "19", "11", "8", "+24", "68"],
      ],
    },
  ],
  NFL: [
    {
      league: "AFC Standings",
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
      league: "NFC Standings",
      color: "#f59e0b",
      headers: ["#", "Team", "W", "L", "T", "PCT", "PF", "PA"],
      rows: [
        ["1", "San Francisco 49ers", "12", "5", "0", ".706", "491", "298"],
        ["2", "Dallas Cowboys", "12", "5", "0", ".706", "509", "315"],
        ["3", "Detroit Lions", "12", "5", "0", ".706", "461", "395"],
        ["4", "Tampa Bay Buccaneers", "9", "8", "0", ".529", "348", "325"],
        ["5", "Philadelphia Eagles", "11", "6", "0", ".647", "433", "430"],
      ],
    },
  ],
  AFL: [
    {
      league: "AFL Men's 2026",
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
    {
      league: "AFL Women's 2026",
      color: "#ec4899",
      headers: ["#", "Club", "P", "W", "L", "D", "Pts", "%"],
      rows: [
        ["1", "Adelaide Crows", "10", "9", "1", "0", "36", "182.4"],
        ["2", "Melbourne Demons", "10", "8", "2", "0", "32", "144.2"],
        ["3", "North Melbourne", "10", "7", "3", "0", "28", "129.5"],
        ["4", "Brisbane Lions", "10", "7", "3", "0", "28", "119.8"],
        ["5", "Essendon Bombers", "10", "6", "4", "0", "24", "105.1"],
      ],
    },
  ],
};

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

  // Premier League & La Liga
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

const getTeamCode = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("mumbai")) return "MI";
  if (n.includes("csk") || n.includes("chennai")) return "CSK";
  if (n.includes("rcb") || n.includes("bengaluru")) return "RCB";
  if (n.includes("delhi")) return "DC";
  if (n.includes("kolkata") || n === "kkr") return "KKR";
  
  if (n === "india") return "IND";
  if (n === "australia") return "AUS";
  if (n === "south africa") return "RSA";
  if (n === "pakistan") return "PAK";
  if (n === "england") return "ENG";

  if (n === "arsenal") return "ARS";
  if (n.includes("manchester city") || n.includes("man city")) return "MCI";
  if (n === "liverpool") return "LIV";
  if (n === "chelsea") return "CHE";
  if (n === "tottenham") return "TOT";

  if (n.includes("real madrid")) return "RMA";
  if (n === "barcelona") return "BAR";
  if (n === "girona") return "GIR";
  if (n.includes("atletico")) return "ATM";
  if (n.includes("athletic club")) return "ATH";

  if (n.includes("chiefs")) return "KC";
  if (n.includes("bills")) return "BUF";
  if (n.includes("dolphins")) return "MIA";
  if (n.includes("ravens")) return "BAL";
  if (n.includes("bengals")) return "CIN";
  if (n.includes("49ers")) return "SF";
  if (n.includes("cowboys")) return "DAL";
  if (n.includes("lions")) return "DET";
  if (n.includes("buccaneers")) return "TB";
  if (n.includes("eagles")) return "PHI";

  if (n.includes("carlton") || n.includes("blues")) return "CAR";
  if (n.includes("geelong") || n.includes("cats")) return "GEE";
  if (n.includes("gold coast") || n.includes("suns")) return "GC";
  if (n.includes("bulldogs") || n.includes("western")) return "WB";
  if (n.includes("swans") || n.includes("sydney")) return "SYD";
  if (n.includes("adelaide") || n.includes("crows")) return "ADE";
  if (n.includes("demons") || n.includes("melbourne")) return "MEL";
  if (n.includes("north melbourne")) return "NM";
  if (n.includes("bombers") || n.includes("essendon")) return "ESS";

  return name.slice(0, 3).toUpperCase();
};

export default function StandingsPage() {
  useEffect(() => {
    document.title = "Standings – The SportsVerge";
  }, []);

  const [activeSport, setActiveSport] = useState<"cricket" | "football" | "NFL" | "AFL">("cricket");
  const [activeSubtab, setActiveSubtab] = useState(0);

  const currentSportLeagues = sportsData[activeSport] || [];
  const activeTable = currentSportLeagues[activeSubtab] || currentSportLeagues[0];

  return (
    <main className="font-outfit">
      <PageHeader
        title="Standings"
        subtitle="Current league tables across all sports."
        className="mb-5"
      />

      <section className="py-2">
        <div className="container custom-container">
          {/* Main Sport Tabs */}
          <ul className="nav nav-pills custom-tabs mb-4 flex-nowrap overflow-x-auto scrollbar-none gap-2">
            {(["cricket", "football", "NFL", "AFL"] as const).map((sport) => (
              <li className="nav-item" key={sport}>
                <button
                  className={`nav-link text-capitalize ${activeSport === sport ? "active" : ""}`}
                  onClick={() => {
                    setActiveSport(sport);
                    setActiveSubtab(0);
                  }}
                >
                  {sport}
                </button>
              </li>
            ))}
          </ul>

          {/* League Sub-Tabs */}
          {currentSportLeagues.length > 0 && (
            <div className="d-flex gap-2 mb-4 overflow-auto scrollbar-none pb-2" style={{ borderBottom: "1px solid var(--border-dark)" }}>
              {currentSportLeagues.map((leagueData, index) => {
                const isActive = activeSubtab === index;
                return (
                  <button
                    key={leagueData.league}
                    onClick={() => setActiveSubtab(index)}
                    className="btn d-flex align-items-center gap-2 fw-semibold flex-shrink-0 transition-all"
                    style={{
                      borderRadius: "999px",
                      fontSize: "12px",
                      padding: "6px 14px",
                      background: isActive ? "rgba(255, 255, 255, 0.08)" : "transparent",
                      border: `1px solid ${isActive ? "var(--border-dark)" : "transparent"}`,
                      color: isActive ? "#fff" : "var(--text-light)",
                    }}
                  >
                    {leagueData.league}
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Standings Table */}
          {activeTable ? (
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="d-inline-block rounded" style={{ width: "3px", height: "18px", background: activeTable.color }}></span>
                <h5 className="fw-bold text-white mb-0 font-space-grotesk" style={{ fontSize: "15px" }}>{activeSport.toUpperCase()} – {activeTable.league}</h5>
              </div>
              <div className="premium-table-container">
                <div className="table-responsive">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        {activeTable.headers.map((h, index) => (
                          <th key={h} className={index === 1 ? "text-start" : index === 0 ? "text-start" : "text-center"}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeTable.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => {
                            if (j === 0) {
                              return (
                                <td key={j} className="premium-table-rank text-start" style={{ color: activeTable.color }}>
                                  #{cell}
                                </td>
                              );
                            }
                            if (j === 1) {
                              const logo = getTeamLogo(cell);
                              return (
                                <td key={j} className="premium-table-team text-start">
                                  <div className="d-flex align-items-center gap-1 gap-sm-2">
                                    {logo ? (
                                      <img src={logo} alt={cell} style={{ width: "16px", height: "16px", objectFit: "contain" }} />
                                    ) : (
                                      <div className="d-none d-sm-flex align-items-center justify-content-center rounded-circle text-white fw-bold" style={{ width: "20px", height: "20px", fontSize: "10px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                                        {cell.charAt(0)}
                                      </div>
                                    )}
                                    <span className="text-truncate d-none d-sm-inline">{cell}</span>
                                    <span className="d-inline d-sm-none">{getTeamCode(cell)}</span>
                                  </div>
                                </td>
                              );
                            }
                            const headerName = activeTable.headers[j]?.toLowerCase() || "";
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
          ) : (
            <div className="text-center py-5 text-muted">No standings data available.</div>
          )}
        </div>
      </section>
    </main>
  );
}
