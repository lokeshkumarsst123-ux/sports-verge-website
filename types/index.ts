export interface SlideItem {
  image: string;
  title: string;
  desc: string;
}

export interface FixtureItem {
  id?: string;
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
  id?: string;
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
  id?: string;
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

// ─── Football-Specific Types ──────────────────────────────────────────────────

export type FootballMatchStatus =
  | "Scheduled"
  | "Kick Off"
  | "First Half"
  | "Half Time"
  | "Second Half"
  | "Extra Time"
  | "Penalty Shootout"
  | "Finished"
  | "Postponed"
  | "Cancelled";

export type FootballEventType =
  | "goal"
  | "yellow_card"
  | "red_card"
  | "substitution"
  | "penalty"
  | "var"
  | "own_goal"
  | "half_time"
  | "full_time"
  | "injury_time";

export interface FootballTimelineEvent {
  minute: string;       // e.g. "12'", "45+2'", "67'", "90+4'"
  type: FootballEventType;
  player?: string;
  playerOut?: string;   // for substitutions
  team: 1 | 2 | null;
  detail?: string;
  varDecision?: string; // e.g. "Goal Confirmed", "Red Card Overturned"
}

export interface FootballEventsSummary {
  goals: { minute: string; player: string; team: 1 | 2; isOwnGoal?: boolean; isPenalty?: boolean }[];
  yellowCards: { minute: string; player: string; team: 1 | 2 }[];
  redCards: { minute: string; player: string; team: 1 | 2 }[];
  penalties: { minute: string; player: string; team: 1 | 2; scored: boolean }[];
  ownGoals: { minute: string; player: string; team: 1 | 2 }[];
  varDecisions: { minute: string; decision: string; team: 1 | 2 | null }[];
  substitutions: { team1Count: number; team2Count: number };
  injuryTime?: { firstHalf: string; secondHalf: string };
}

export interface FootballMatchStats {
  possession: { team1: number; team2: number };
  totalShots: { team1: number; team2: number };
  shotsOnTarget: { team1: number; team2: number };
  corners: { team1: number; team2: number };
  fouls: { team1: number; team2: number };
  offsides: { team1: number; team2: number };
  saves: { team1: number; team2: number };
}

export interface FootballPlayer {
  number: number;
  name: string;
  position: string;
  isCaptain?: boolean;
  yellowCard?: boolean;
  redCard?: boolean;
  goals?: number;
  substituted?: boolean;
}

export interface FootballTeamInfo {
  formation: string;       // e.g. "4-3-3", "4-2-3-1"
  startingXI: FootballPlayer[];
  bench: FootballPlayer[];
  coach: string;
}

// ─── NFL-Specific Types ───────────────────────────────────────────────────────

export type NFLMatchStatus =
  | "Scheduled"
  | "Kickoff"
  | "1st Quarter"
  | "2nd Quarter"
  | "Halftime"
  | "3rd Quarter"
  | "4th Quarter"
  | "Overtime"
  | "Final"
  | "Postponed"
  | "Cancelled";

export interface NFLQuarterScore {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  ot?: number;
  total: number;
}

export interface NFLTeamStats {
  firstDowns: number;
  totalYards: number;
  passingYards: number;
  rushingYards: number;
  turnovers: number;
  thirdDownEff: string;    // e.g. "5/12"
  fourthDownEff: string;   // e.g. "1/2"
  redZoneEff: string;      // e.g. "2/3"
  timeOfPossession: string;// e.g. "32:14"
  penalties: number;
  penaltyYards: number;
  sacks: number;
  interceptions: number;
}

export interface NFLPassingLeader {
  name: string;
  completions: number;
  attempts: number;
  yards: number;
  touchdowns: number;
  interceptions: number;
  rating: number;
}

export interface NFLRushingLeader {
  name: string;
  carries: number;
  yards: number;
  avg: number;
  touchdowns: number;
  long: number;
}

export interface NFLReceivingLeader {
  name: string;
  receptions: number;
  yards: number;
  long: number;
  touchdowns: number;
  avg: number;
}

export interface NFLScoringPlay {
  quarter: number;
  time: string;
  team: 1 | 2;
  type: "TD" | "XP" | "2PT" | "FG" | "Safety";
  description: string;
  score1: number;  // team1 score after this play
  score2: number;  // team2 score after this play
}

export interface NFLDrive {
  team: 1 | 2;
  startTime: string;
  startYardLine: string;
  plays: number;
  yards: number;
  duration: string;
  result: "TD" | "FG" | "Punt" | "Turnover" | "Turnover on Downs" | "End of Half" | "End of Game" | "Safety";
}

export interface NFLPlay {
  quarter: number;
  clock: string;
  team: 1 | 2;
  description: string;
  yardsGained: number;
  isScoring?: boolean;
  isTurnover?: boolean;
}

export interface NFLRosterPlayer {
  number: number;
  name: string;
  position: string;
  isCaptain?: boolean;
}

export interface NFLTeamRoster {
  startingOffense: NFLRosterPlayer[];
  startingDefense: NFLRosterPlayer[];
  specialTeams: NFLRosterPlayer[];
  bench: NFLRosterPlayer[];
  headCoach: string;
}

export interface NFLMatchData {
  nflStatus: NFLMatchStatus;
  season: string;
  week: string;
  matchDate: string;
  kickoffTime: string;
  city: string;
  stadium: string;
  attendance?: number;
  weather?: string;
  surfaceType?: string;
  refereeCrewChief?: string;
  quarter: number;
  gameClock: string;
  possession: 1 | 2 | null;
  downAndDistance: string;
  ballPosition: string;
  timeoutsTeam1: number;
  timeoutsTeam2: number;
  team1Record: string;
  team2Record: string;
  quarterScores: {
    team1: NFLQuarterScore;
    team2: NFLQuarterScore;
  };
  team1Stats: NFLTeamStats;
  team2Stats: NFLTeamStats;
  passingLeader1: NFLPassingLeader;
  passingLeader2: NFLPassingLeader;
  rushingLeader1: NFLRushingLeader;
  rushingLeader2: NFLRushingLeader;
  receivingLeader1: NFLReceivingLeader;
  receivingLeader2: NFLReceivingLeader;
  scoringPlays: NFLScoringPlay[];
  drives: NFLDrive[];
  plays: NFLPlay[];
  team1Roster: NFLTeamRoster;
  team2Roster: NFLTeamRoster;
}

// ─── Core Match Detail ────────────────────────────────────────────────────────

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
  matchStatus: "LIVE" | "BREAK" | "HALF TIME" | "1ST INNINGS" | "2ND INNINGS" | "FINISHED" | FootballMatchStatus | NFLMatchStatus;
  matchTime: string;
  venue: string;
  lastUpdated: string;
  note?: string;

  // Football-specific optional fields
  footballMatchStatus?: FootballMatchStatus;
  matchWeek?: string;
  stadium?: string;
  referee?: string;
  currentMinute?: string;
  footballEventsSummary?: FootballEventsSummary;
  footballStats?: FootballMatchStats;
  team1Info?: FootballTeamInfo;
  team2Info?: FootballTeamInfo;
  footballTimeline?: FootballTimelineEvent[];

  // NFL-specific optional fields
  nflData?: NFLMatchData;

  // AFL-specific optional fields
  aflData?: AFLMatchData;
}

export interface AFLQuarterScore {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  final: string;
}

export interface AFLTeamStats {
  goals: number;
  behinds: number;
  disposals: number;
  kicks: number;
  handballs: number;
  marks: number;
  tackles: number;
  inside50s: number;
  clearances: number;
  hitOuts: number;
  contestedPossessions: number;
  uncontestedPossessions: number;
  turnovers: number;
  interchangeCount: number;
}

export interface AFLPlayerLeader {
  name: string;
  value: string | number;
}

export interface AFLScoringTimelineEvent {
  quarter: string;
  time: string;
  player: string;
  type: "Goal" | "Behind";
  team: 1 | 2;
}

export interface AFLMatchEvent {
  quarter: string;
  time: string;
  type: "Goal" | "Behind" | "Interchange" | "Injury";
  detail: string;
  team: 1 | 2;
}

export interface AFLTeamRoster {
  starting18: string[];
  interchange: string[];
  coach: string;
}

export interface AFLMatchData {
  league: string;
  season: string;
  round: string;
  matchDate: string;
  matchTime: string;
  stadium: string;
  city: string;
  umpires: string;
  
  quarter: string;
  gameClock: string;
  matchStatus: string;

  team1Score: { goals: number, behinds: number, total: number };
  team2Score: { goals: number, behinds: number, total: number };
  
  quarterScores: {
    team1: AFLQuarterScore;
    team2: AFLQuarterScore;
  };
  
  team1Stats: AFLTeamStats;
  team2Stats: AFLTeamStats;
  
  leadersTeam1: {
    mostGoals: AFLPlayerLeader;
    mostDisposals: AFLPlayerLeader;
    mostMarks: AFLPlayerLeader;
    mostTackles: AFLPlayerLeader;
    mostClearances: AFLPlayerLeader;
    mostHitOuts: AFLPlayerLeader;
  };
  
  leadersTeam2: {
    mostGoals: AFLPlayerLeader;
    mostDisposals: AFLPlayerLeader;
    mostMarks: AFLPlayerLeader;
    mostTackles: AFLPlayerLeader;
    mostClearances: AFLPlayerLeader;
    mostHitOuts: AFLPlayerLeader;
  };
  
  scoringTimeline: AFLScoringTimelineEvent[];
  events: AFLMatchEvent[];
  
  team1Roster: AFLTeamRoster;
  team2Roster: AFLTeamRoster;
  
  attendance: string;
  weather: string;
}
