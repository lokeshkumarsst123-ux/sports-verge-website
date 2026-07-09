import React from "react";
import Hero from "@/components/Hero";
import UpcomingFixtures from "@/components/UpcomingFixtures";
import RecentResults from "@/components/RecentResults";
import PopularPlayers from "@/components/PopularPlayers";
import HorizontalBanner from "@/components/HorizontalBanner";
import CricketNews from "@/components/CricketNews";
import FootballNews from "@/components/FootballNews";
import NFLNews from "@/components/NFLNews";
import AFLNews from "@/components/AFLNews";

// Sidebar Components
import LiveScores from "@/components/LiveScores";
import AdSection from "@/components/AdSection";
import Standings from "@/components/Standings";
import PopularTeams from "@/components/PopularTeams";

export default function Home() {
  return (
    <main className="container custom-container mt-4 mb-5">
      <div className="row g-4">
        {/* Main Content Column (Left side on desktop, stacked on mobile) */}
        <div className="col-lg-8">
          <Hero />

          {/* Mobile-Only Live Scores Section */}
          <div className="d-block d-lg-none mb-4">
            <LiveScores />
          </div>
          <UpcomingFixtures />
          <RecentResults />
          <PopularPlayers />
          <HorizontalBanner />
          <CricketNews />
          <FootballNews />
          <NFLNews />
          <AFLNews />





        </div>

        {/* Sidebar Column (Right side on desktop, stacked on mobile) */}
        <div className="col-lg-4">
          {/* Desktop-Only Live Scores */}
          <div className="d-none d-lg-block mb-4">
            <LiveScores />
          </div>

          <AdSection />
          <Standings />
          <PopularTeams />
        </div>
      </div>
    </main>
  );
}