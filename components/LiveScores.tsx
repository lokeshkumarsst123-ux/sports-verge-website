"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LiveScoreMatch } from "@/types";
import { liveScoresData } from "@/data/mockData";

export default function LiveScores() {
  const [activeTab, setActiveTab] = useState<"all" | "cricket" | "football" | "NFL" | "AFL">("all");

  const filteredMatches = activeTab === "all"
    ? liveScoresData
    : liveScoresData.filter((match) => match.sport === activeTab);

  return (
    <aside className="live-scores-section bg-card rounded-3 py-4 px-3 border border-dark">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="m-0 fw-semibold">Live Scores</h5>
        <Link href="#" className="text-success text-decoration-none small fw-medium">
          View All
        </Link>
      </div>

      <ul className="nav nav-pills custom-tabs mb-3 flex-nowrap gap-2" id="scores-tab" role="tablist">
        {(["all", "cricket", "football", "NFL", "AFL"] as const).map((tab) => (
          <li className="nav-item" role="presentation" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              type="button"
              role="tab"
            >
              {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      <div className="scores-list">
        <div className="tab-content">
          <div className="tab-pane fade show active" role="tabpanel">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match: LiveScoreMatch, idx: number) => (
                <Link
                  key={idx}
                  href="#"
                  className="score-box d-block text-decoration-none rounded-3 p-3 mb-3 border border-dark"
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted">{match.league}</span>
                    {match.status === "LIVE" ? (
                      <span className="badge bg-danger">LIVE</span>
                    ) : (
                      <span className="text-success small">{match.status}</span>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <Image
                        src={match.homeLogo}
                        alt={match.homeTeam}
                        width={20}
                        height={20}
                        className="me-2"
                      />
                      <span className="text-light fw-medium">{match.homeTeam}</span>
                    </div>
                    <span className="text-light fw-bold">
                      {match.homeScore}{" "}
                      {match.homeOvers && (
                        <span className="text-muted fw-normal small">{match.homeOvers}</span>
                      )}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <Image
                        src={match.awayLogo}
                        alt={match.awayTeam}
                        width={20}
                        height={20}
                        className="me-2"
                      />
                      <span className="text-light fw-medium">{match.awayTeam}</span>
                    </div>
                    <span className="text-light fw-bold">
                      {match.awayScore}{" "}
                      {match.awayOvers && (
                        <span className="text-muted fw-normal small">{match.awayOvers}</span>
                      )}
                    </span>
                  </div>

                  {match.note && (
                    <div className="small text-success mt-2">{match.note}</div>
                  )}

                  {match.venue && (
                    <div className="text-muted mt-2" style={{ fontSize: "11px" }}>
                      {match.venue}
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <div className="p-3 text-center text-muted small">No Live Match</div>
            )}

            <Link
              href="#"
              className="btn btn-outline-success w-100 mt-2 p-3 rounded-3 text-uppercase fw-medium"
              style={{ fontSize: "13px" }}
            >
              View All Live Scores
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
