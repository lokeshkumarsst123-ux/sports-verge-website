"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";

const rankingsData: Record<string, { category: string; list: { rank: number; name: string; points: string; rating?: string; change: string; trend: "up" | "down" | "flat" }[] }[]> = {
  Cricket: [
    {
      category: "ICC Men's Test Team Rankings",
      list: [
        { rank: 1, name: "Australia", points: "3,420", rating: "124", change: "+1", trend: "up" },
        { rank: 2, name: "India", points: "3,810", rating: "120", change: "-1", trend: "down" },
        { rank: 3, name: "England", points: "4,100", rating: "115", change: "0", trend: "flat" },
        { rank: 4, name: "South Africa", points: "2,560", rating: "104", change: "0", trend: "flat" },
        { rank: 5, name: "New Zealand", points: "2,840", rating: "99", change: "+1", trend: "up" },
      ],
    },
    {
      category: "ICC Men's ODI Team Rankings",
      list: [
        { rank: 1, name: "India", points: "4,620", rating: "121", change: "0", trend: "flat" },
        { rank: 2, name: "Australia", points: "3,850", rating: "118", change: "0", trend: "flat" },
        { rank: 3, name: "South Africa", points: "3,210", rating: "110", change: "+2", trend: "up" },
        { rank: 4, name: "Pakistan", points: "3,150", rating: "109", change: "-1", trend: "down" },
        { rank: 5, name: "New Zealand", points: "2,980", rating: "102", change: "-1", trend: "down" },
      ],
    },
  ],
  Football: [
    {
      category: "FIFA Men's World Rankings",
      list: [
        { rank: 1, name: "Argentina", points: "1861.29", change: "0", trend: "flat" },
        { rank: 2, name: "France", points: "1853.11", change: "0", trend: "flat" },
        { rank: 3, name: "Belgium", points: "1793.21", change: "+1", trend: "up" },
        { rank: 4, name: "England", points: "1790.55", change: "-1", trend: "down" },
        { rank: 5, name: "Brazil", points: "1785.61", change: "0", trend: "flat" },
      ],
    },
  ],
  NFL: [
    {
      category: "NFL Power Rankings",
      list: [
        { rank: 1, name: "Kansas City Chiefs", points: "15-2", change: "0", trend: "flat" },
        { rank: 2, name: "San Francisco 49ers", points: "14-3", change: "+1", trend: "up" },
        { rank: 3, name: "Baltimore Ravens", points: "13-4", change: "-1", trend: "down" },
        { rank: 4, name: "Detroit Lions", points: "12-5", change: "+2", trend: "up" },
        { rank: 5, name: "Buffalo Bills", points: "11-6", change: "-1", trend: "down" },
      ],
    },
  ],
  AFL: [
    {
      category: "AFL Premiership Ladder Power Rankings",
      list: [
        { rank: 1, name: "Collingwood Magpies", points: "64", change: "0", trend: "flat" },
        { rank: 2, name: "Brisbane Lions", points: "60", change: "+1", trend: "up" },
        { rank: 3, name: "Port Adelaide Power", points: "60", change: "-1", trend: "down" },
        { rank: 4, name: "Carlton Blues", points: "56", change: "+3", trend: "up" },
        { rank: 5, name: "GWS Giants", points: "52", change: "0", trend: "flat" },
      ],
    },
  ],
};

const tabConfig = [
  { name: "Cricket", icon: "bi-trophy" },
  { name: "Football", icon: "bi-dribbble" },
  { name: "NFL", icon: "bi-shield" },
  { name: "AFL", icon: "bi-circle" },
];

const getTeamLogo = (name: string): string => {
  const n = name.toLowerCase();
  
  // IPL / Cricket Teams
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

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState("Cricket");

  return (
    <main className="min-vh-100 font-outfit" style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "40px 0 80px 0" }}>
      <PageHeader
        title="World Rankings"
        subtitle="Official team rankings and standings across major international sports leagues."
        className="mb-5"
      />

      {/* Switcher Tabs */}
      <div className="container custom-container mb-4">
        <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {tabConfig.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className="btn d-flex align-items-center gap-2 fw-semibold rounded-pill px-4 py-2 transition-all text-white"
                style={{
                  fontSize: "13px",
                  background: isActive ? "var(--accent-green)" : "var(--bg-card)",
                  border: `1px solid ${isActive ? "var(--accent-green)" : "var(--border-dark)"}`,
                }}
              >
                <i className={`bi ${tab.icon}`}></i>
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rankings List */}
      <div className="container custom-container">
        <div className="d-flex flex-column gap-4">
          {rankingsData[activeTab]?.map((group, idx) => (
            <div key={idx} className="premium-table-container p-4">
              <h5 className="fw-bold text-white mb-4 font-space-grotesk" style={{ fontSize: "16px" }}>
                {group.category}
              </h5>
              <div className="table-responsive">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th className="text-start" style={{ width: "80px" }}>RANK</th>
                      <th className="text-start">TEAM</th>
                      <th className="text-center">{activeTab === "NFL" || activeTab === "AFL" ? "RECORD" : "POINTS"}</th>
                      {group.list[0].rating && <th className="text-center">RATING</th>}
                      <th className="text-end">TREND</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.list.map((item) => (
                      <tr key={item.rank}>
                        <td className="premium-table-rank text-start text-success">#{item.rank}</td>
                        <td className="premium-table-team text-start">
                          <div className="d-flex align-items-center gap-2">
                            {(() => {
                              const logo = getTeamLogo(item.name);
                              return logo ? (
                                <img src={logo} alt={item.name} style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                              ) : (
                                <div className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold" style={{ width: "20px", height: "20px", fontSize: "10px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                                  {item.name.charAt(0)}
                                </div>
                              );
                            })()}
                            <span className="text-truncate">{item.name}</span>
                          </div>
                        </td>
                        <td className="premium-table-stat-bold text-center">{item.points}</td>
                        {item.rating && <td className="premium-table-stat text-center text-success fw-semibold">{item.rating}</td>}
                        <td className="text-end">
                          <span className={`fw-semibold d-inline-flex align-items-center gap-1 ${
                            item.trend === "up" ? "text-success" : item.trend === "down" ? "text-danger" : "text-muted"
                          }`} style={{ fontSize: "13px" }}>
                            {item.trend === "up" && <i className="bi bi-caret-up-fill"></i>}
                            {item.trend === "down" && <i className="bi bi-caret-down-fill"></i>}
                            {item.trend === "flat" && <span className="d-inline-block rounded-circle bg-secondary" style={{ width: "6px", height: "6px" }}></span>}
                            {item.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
