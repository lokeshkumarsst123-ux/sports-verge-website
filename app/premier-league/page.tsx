"use client";

import FootballCompetitionPage from "@/components/FootballCompetitionPage";

export default function PremierLeaguePage() {
  return <FootballCompetitionPage
    config={{
      competitionName: "Premier League",
      displayName: "Premier League",
      subtitle: "Premier League standings, fixtures, results, and team information supplied by the football provider.",
    }}
  />;
}
