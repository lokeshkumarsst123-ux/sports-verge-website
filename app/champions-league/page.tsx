"use client";

import FootballCompetitionPage from "@/components/FootballCompetitionPage";

export default function ChampionsLeaguePage() {
  return <FootballCompetitionPage
    config={{
      competitionName: "UEFA Champions League",
      displayName: "Champions League",
      subtitle: "UEFA Champions League fixtures, standings, results, and team information supplied by the football provider.",
      championsFormat: true,
    }}
  />;
}
