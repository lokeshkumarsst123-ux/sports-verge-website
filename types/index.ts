export interface SlideItem {
  image: string;
  title: string;
  desc: string;
}

export interface FixtureItem {
  league: string;
  home: string;
  away: string;
  homeLogo: string;
  awayLogo: string;
  day: string;
  time: string;
  venue: string;
  type: "football" | "cricket" | "NFL" | "AFL";
}

export interface ResultItem {
  league: string;
  home: string;
  away: string;
  homeLogo: string;
  awayLogo: string;
  score?: string;
  homeScore?: string;
  awayScore?: string;
  result: string;
  date: string;
  type: "football" | "cricket" | "NFL" | "AFL";
}

export interface NewsItem {
  image: string;
  title: string;
  description: string;
  date: string;
}

export interface PlayerItem {
  image: string;
  name: string;
  team: string;
  sport: "cricket" | "football" | "NFL" | "AFL";
}

export interface LiveScoreMatch {
  league: string;
  time?: string;
  status: "LIVE" | "finished" | string;
  homeTeam: string;
  homeLogo: string;
  homeScore: string;
  homeOvers?: string;
  awayTeam: string;
  awayLogo: string;
  awayScore: string;
  awayOvers?: string;
  note?: string;
  venue?: string;
  sport: "cricket" | "football" | "NFL" | "AFL";
}

export interface StandingFootballRow {
  rank: number;
  team: string;
  logo: string;
  played: number;
  gd: string;
  points: number;
}

export interface StandingCricketRow {
  rank: number;
  team: string;
  logo: string;
  matches: number;
  nrr: string;
  points: number;
}

export interface PopularTeamItem {
  id: string;
  name: string;
  sport: string;
  logo: string;
}

export interface LiveScoreMatchDetail {
  id: string;
  sport: "cricket" | "football" | "NFL" | "AFL";
  competitionName: string;
  matchName: string;
  team1Logo: string;
  team1Name: string;
  team1Score: string;
  team1Overs?: string;
  team2Logo: string;
  team2Name: string;
  team2Score: string;
  team2Overs?: string;
  matchStatus: "LIVE" | "BREAK" | "HALF TIME" | "1ST INNINGS" | "2ND INNINGS" | "FINISHED";
  matchTime: string;
  venue: string;
  lastUpdated: string;
  note?: string;
}

