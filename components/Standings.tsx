"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { StandingFootballRow, StandingCricketRow } from "@/types";
import { footballPLData, cricketIPLData } from "@/data/mockData";

type SportTab = "cricket" | "football" | "NFL" | "AFL";
type FootballSubtab = "pl" | "laliga" | "bundesliga" | "seriea" | "ligue1";
type CricketSubtab = "ipl" | "psl" | "bbl";

export default function Standings() {
  const [activeSport, setActiveSport] = useState<SportTab>("football");
  const [activeFootballTab, setActiveFootballTab] = useState<FootballSubtab>("pl");
  const [activeCricketTab, setActiveCricketTab] = useState<CricketSubtab>("ipl");

  // Scroll tracking states for Football sub-tabs
  const fbScrollRef = useRef<HTMLUListElement>(null);
  const [fbCanScrollLeft, setFbCanScrollLeft] = useState(false);
  const [fbCanScrollRight, setFbCanScrollRight] = useState(false);

  // Scroll tracking states for Cricket sub-tabs
  const crScrollRef = useRef<HTMLUListElement>(null);
  const [crCanScrollLeft, setCrCanScrollLeft] = useState(false);
  const [crCanScrollRight, setCrCanScrollRight] = useState(false);

  const checkFbScroll = () => {
    if (fbScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = fbScrollRef.current;
      setFbCanScrollLeft(scrollLeft > 1);
      setFbCanScrollRight(scrollWidth - clientWidth - scrollLeft > 1);
    }
  };

  const checkCrScroll = () => {
    if (crScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = crScrollRef.current;
      setCrCanScrollLeft(scrollLeft > 1);
      setCrCanScrollRight(scrollWidth - clientWidth - scrollLeft > 1);
    }
  };

  useEffect(() => {
    if (activeSport === "football") {
      const timer = setTimeout(checkFbScroll, 100);
      window.addEventListener("resize", checkFbScroll);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", checkFbScroll);
      };
    }
  }, [activeSport, activeFootballTab]);

  useEffect(() => {
    if (activeSport === "cricket") {
      const timer = setTimeout(checkCrScroll, 100);
      window.addEventListener("resize", checkCrScroll);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", checkCrScroll);
      };
    }
  }, [activeSport, activeCricketTab]);

  const handleSubtabScroll = (
    ref: React.RefObject<HTMLUListElement | null>,
    direction: "left" | "right"
  ) => {
    if (ref.current) {
      const scrollAmount = 150;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      // Delay check slightly to let smooth scroll update positions
      setTimeout(() => {
        if (ref === fbScrollRef) checkFbScroll();
        if (ref === crScrollRef) checkCrScroll();
      }, 300);
    }
  };

  return (
    <aside className="standings-section bg-card rounded-3 p-4 border border-dark mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="m-0 fw-semibold border-start border-success border-3 ps-2">Standings</h5>
        <Link href="#" className="text-success text-decoration-none small fw-medium">
          View Table
        </Link>
      </div>

      <ul className="nav nav-pills custom-tabs mb-3 flex-wrap gap-2" role="tablist">
        {(["cricket", "football", "NFL", "AFL"] as const).map((sport) => (
          <li className="nav-item" role="presentation" key={sport}>
            <button
              className={`nav-link text-capitalize ${activeSport === sport ? "active" : ""}`}
              onClick={() => setActiveSport(sport)}
              type="button"
              role="tab"
            >
              {sport}
            </button>
          </li>
        ))}
      </ul>
      <hr className="border-secondary my-3 opacity-25" />

      {activeSport === "football" && (
        <div>
          <div className="position-relative league-subtabs-wrapper mb-3">
            {/* Left Scroll Indicator */}
            {fbCanScrollLeft && (
              <div
                className="subtabs-scroll-indicator indicator-left d-flex align-items-center justify-content-center"
                onClick={() => handleSubtabScroll(fbScrollRef, "left")}
              >
                <i className="bi bi-chevron-left small text-white"></i>
              </div>
            )}

            <ul
              ref={fbScrollRef}
              onScroll={checkFbScroll}
              className="nav nav-tabs border-0 flex-nowrap gap-1 overflow-x-auto px-3"
              style={{ scrollbarWidth: "none" }}
            >
              <li className="nav-item">
                <button
                  className={`nav-link subtab-link ${activeFootballTab === "pl" ? "active" : ""}`}
                  onClick={() => setActiveFootballTab("pl")}
                >
                  Premier League
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link subtab-link ${activeFootballTab === "laliga" ? "active" : ""}`}
                  onClick={() => setActiveFootballTab("laliga")}
                >
                  La Liga
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link subtab-link ${activeFootballTab === "bundesliga" ? "active" : ""}`}
                  onClick={() => setActiveFootballTab("bundesliga")}
                >
                  Bundesliga
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link subtab-link ${activeFootballTab === "seriea" ? "active" : ""}`}
                  onClick={() => setActiveFootballTab("seriea")}
                >
                  Serie A
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link subtab-link ${activeFootballTab === "ligue1" ? "active" : ""}`}
                  onClick={() => setActiveFootballTab("ligue1")}
                >
                  Ligue 1
                </button>
              </li>
            </ul>

            {/* Right Scroll Indicator */}
            {fbCanScrollRight && (
              <div
                className="subtabs-scroll-indicator indicator-right d-flex align-items-center justify-content-center"
                onClick={() => handleSubtabScroll(fbScrollRef, "right")}
              >
                <i className="bi bi-chevron-right small text-white"></i>
              </div>
            )}
          </div>

          <div className="tab-content">
            {activeFootballTab === "pl" ? (
              <div className="table-responsive text-light" style={{ scrollbarWidth: "none" }}>
                <table
                  className="table table-dark table-borderless align-middle m-0 standings-table"
                  style={{ "--bs-table-bg": "transparent" } as React.CSSProperties}
                >
                  <thead>
                    <tr
                      className="text-muted border-bottom border-secondary"
                      style={{ fontSize: "11px", borderColor: "rgba(255, 255, 255, 0.15)" }}
                    >
                      <th scope="col" style={{ width: "8%" }}>#</th>
                      <th scope="col" style={{ width: "52%" }}>Team</th>
                      <th scope="col" className="text-center" style={{ width: "13%" }}>P</th>
                      <th scope="col" className="text-center" style={{ width: "14%" }}>GD</th>
                      <th scope="col" className="text-end" style={{ width: "13%" }}>Pts</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "13px" }}>
                    {footballPLData.map((row: StandingFootballRow, idx: number) => (
                      <tr key={idx}>
                        <td className="fw-semibold text-muted">{row.rank}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Image src={row.logo} alt={row.team} width={18} height={18} />
                            <span className="text-truncate">{row.team}</span>
                          </div>
                        </td>
                        <td className="text-center text-muted">{row.played}</td>
                        <td className="text-center text-muted">{row.gd}</td>
                        <td className="text-end fw-bold text-light">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-3 text-center text-muted small">
                {activeFootballTab === "laliga" && "La Liga Table Coming Soon"}
                {activeFootballTab === "bundesliga" && "Bundesliga Table Coming Soon"}
                {activeFootballTab === "seriea" && "Serie A Table Coming Soon"}
                {activeFootballTab === "ligue1" && "Ligue 1 Table Coming Soon"}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSport === "cricket" && (
        <div>
          <div className="position-relative league-subtabs-wrapper mb-3">
            {/* Left Scroll Indicator */}
            {crCanScrollLeft && (
              <div
                className="subtabs-scroll-indicator indicator-left d-flex align-items-center justify-content-center"
                onClick={() => handleSubtabScroll(crScrollRef, "left")}
              >
                <i className="bi bi-chevron-left small text-white"></i>
              </div>
            )}

            <ul
              ref={crScrollRef}
              onScroll={checkCrScroll}
              className="nav nav-tabs border-0 flex-nowrap gap-1 overflow-x-auto px-3"
              style={{ scrollbarWidth: "none" }}
            >
              <li className="nav-item">
                <button
                  className={`nav-link subtab-link ${activeCricketTab === "ipl" ? "active" : ""}`}
                  onClick={() => setActiveCricketTab("ipl")}
                >
                  IPL 2026
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link subtab-link ${activeCricketTab === "psl" ? "active" : ""}`}
                  onClick={() => setActiveCricketTab("psl")}
                >
                  PSL 2026
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link subtab-link ${activeCricketTab === "bbl" ? "active" : ""}`}
                  onClick={() => setActiveCricketTab("bbl")}
                >
                  BBL 2026
                </button>
              </li>
            </ul>

            {/* Right Scroll Indicator */}
            {crCanScrollRight && (
              <div
                className="subtabs-scroll-indicator indicator-right d-flex align-items-center justify-content-center"
                onClick={() => handleSubtabScroll(crScrollRef, "right")}
              >
                <i className="bi bi-chevron-right small text-white"></i>
              </div>
            )}
          </div>

          <div className="tab-content">
            {activeCricketTab === "ipl" ? (
              <div className="table-responsive text-light" style={{ scrollbarWidth: "none" }}>
                <table
                  className="table table-dark table-borderless align-middle m-0 standings-table"
                  style={{ "--bs-table-bg": "transparent" } as React.CSSProperties}
                >
                  <thead>
                    <tr
                      className="text-muted border-bottom border-secondary"
                      style={{ fontSize: "11px", borderColor: "rgba(255, 255, 255, 0.15)" }}
                    >
                      <th scope="col" style={{ width: "8%" }}>#</th>
                      <th scope="col" style={{ width: "52%" }}>Team</th>
                      <th scope="col" className="text-center" style={{ width: "13%" }}>M</th>
                      <th scope="col" className="text-center" style={{ width: "14%" }}>NRR</th>
                      <th scope="col" className="text-end" style={{ width: "13%" }}>Pts</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "13px" }}>
                    {cricketIPLData.map((row: StandingCricketRow, idx: number) => (
                      <tr key={idx}>
                        <td className="fw-semibold text-muted">{row.rank}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Image src={row.logo} alt={row.team} width={18} height={18} />
                            <span className="text-truncate">{row.team}</span>
                          </div>
                        </td>
                        <td className="text-center text-muted">{row.matches}</td>
                        <td className="text-center text-muted">{row.nrr}</td>
                        <td className="text-end fw-bold text-light">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-3 text-center text-muted small">
                {activeCricketTab === "psl" && "PSL Table Coming Soon"}
                {activeCricketTab === "bbl" && "BBL Table Coming Soon"}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSport === "NFL" && (
        <div className="p-3 text-center text-muted small">NFL Data Coming Soon</div>
      )}

      {activeSport === "AFL" && (
        <div className="p-3 text-center text-muted small">AFL Data Coming Soon</div>
      )}

      <Link
        href="#"
        className="btn btn-outline-success w-100 mt-3 p-2 rounded-3 text-capitalize fw-medium"
        style={{ fontSize: "13px" }}
      >
        All Standings
      </Link>
    </aside>
  );
}
