"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  cricketNewsData,
  footballNewsData,
  nflNewsData,
  aflNewsData,
} from "@/data/mockData";

export default function Sidebar() {
  // Take the top news item from each sport
  const latestNews = [
    { ...cricketNewsData[0], sport: "Cricket" },
    { ...footballNewsData[0], sport: "Football" },
    { ...nflNewsData[0], sport: "NFL" },
    { ...aflNewsData[0], sport: "AFL" },
  ];

  const popularCompetitions = [
    {
      name: "IPL 2026",
      sport: "Cricket",
      logo: "/assets/imgs/teams/ipl/CSKoutline.png",
      teams: "10 Teams",
    },
    {
      name: "Premier League",
      sport: "Football",
      logo: "/assets/imgs/teams/Manchester_City_FC_badge.svg",
      teams: "20 Teams",
    },
    {
      name: "NFL Regular Season",
      sport: "NFL",
      logo: "/assets/imgs/teams/Kansas_City_Chiefs_logo.svg",
      teams: "32 Teams",
    },
    {
      name: "AFL Premiership",
      sport: "AFL",
      logo: "/assets/imgs/teams/Brisbane_Lions_logo_2010.svg",
      teams: "18 Teams",
    },
  ];

  return (
    <aside className="d-flex flex-column gap-4">
      {/* Popular Competitions */}
      <div className="bg-card border border-dark rounded-3 p-4">
        <h5 className="m-0 fw-bold border-start border-success border-3 ps-2 mb-4">
          Popular Competitions
        </h5>
        <div className="d-flex flex-column gap-3">
          {popularCompetitions.map((comp, idx) => (
            <Link
              key={idx}
              href="#"
              className="d-flex align-items-center justify-content-between p-2 rounded-3 text-decoration-none popular-comp-link"
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center bg-dark rounded p-1 border border-secondary border-opacity-10 w-32 h-32 position-relative"
                >
                  <Image
                    src={comp.logo}
                    alt={comp.name}
                    width={22}
                    height={22} className="object-fit-contain"
                  />
                </div>
                <div>
                  <div className="text-light fw-semibold small">{comp.name}</div>
                  <div className="text-muted fs-11">
                    {comp.sport}
                  </div>
                </div>
              </div>
              <span className="badge bg-secondary bg-opacity-30 text-light font-monospace fs-10">
                {comp.teams}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Advertisements */}
      <div
        className="position-relative overflow-hidden rounded-3 border border-dark d-flex align-items-end h-300"
      >
        <Image
          src="/assets/imgs/ad+1.webp"
          alt="Ad Banner"
          fill
          sizes="(max-width: 991px) 100vw, 320px"
          className="object-fit-cover ad-bg-img"
        />
        <div className="ad-overlay d-flex flex-column justify-content-end p-4 w-100 h-100 position-absolute top-0 start-0 ad-bg-gradient">
          <span className="badge bg-dark bg-opacity-70 text-success align-self-start mb-2 px-2 py-1 fs-9 ls-1">
            ADVERTISEMENT
          </span>
          <h6 className="text-white fw-bold mb-1">Upgrade to Premium Pass</h6>
          <p className="text-muted mb-3 fs-11">
            Get ad-free scores, advanced analytics and live commentary alerts.
          </p>
          <Link href="#" className="btn btn-success btn-sm fw-semibold text-uppercase py-2 fs-11 ls-05">
            Get 50% Off Now
          </Link>
        </div>
      </div>

      {/* Latest Sports News */}
      <div className="bg-card border border-dark rounded-3 p-4">
        <h5 className="m-0 fw-bold border-start border-success border-3 ps-2 mb-4">
          Latest Sports News
        </h5>
        <div className="d-flex flex-column gap-3">
          {latestNews.map((news, idx) => (
            <Link
              key={idx}
              href="#"
              className="d-flex gap-3 text-decoration-none border-bottom border-secondary border-opacity-10 pb-3 news-item-link"
            >
              <div
                className="flex-shrink-0 rounded overflow-hidden position-relative w-80 h-60"
              >
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  sizes="80px" className="object-fit-cover"
                />
              </div>
              <div className="d-flex flex-column justify-content-center">
                <span
                  className="text-success font-monospace mb-0.5 text-uppercase fw-semibold fs-9 ls-05"
                >
                  {news.sport}
                </span>
                <h6
                  className="news-title text-light fw-semibold mb-1 line-clamp-2"
                >
                  {news.title}
                </h6>
                <span className="text-muted fs-10">
                  {news.date.split("•")[1] || news.date}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
