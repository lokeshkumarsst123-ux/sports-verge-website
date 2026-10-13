"use client";

import FootballCompetitionPage from "@/components/FootballCompetitionPage";

export default function LaLigaPage() {
  return <FootballCompetitionPage
    config={{
      competitionName: "LaLiga",
      displayName: "La Liga",
      subtitle: "La Liga standings, fixtures, results, and team information supplied by the football provider.",
    }}
  />;
}
