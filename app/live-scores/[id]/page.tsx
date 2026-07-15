"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { liveScoresDetailData } from "@/data/mockData";
import { LiveScoreMatchDetail } from "@/types";
import StatusBadge from "@/components/live-scores/StatusBadge";
import NFLMatchDetail from "@/components/live-scores/NFLMatchDetail";
import AFLMatchDetail from "@/components/live-scores/AFLMatchDetail";
import { useAds } from "@/components/AdContext";
import MatchDetailSkeleton from "@/components/live-scores/MatchDetailSkeleton";

const getWidthStyle = (w: number | string | undefined) => ({ width: `${w}%` });

interface TeamStat {
  label: string;
  team1Val: string | number;
  team2Val: string | number;
}

interface PlayerPerformance {
  name: string;
  role: string;
  metric1: string;
  metric2: string;
}

interface MatchEvent {
  time: string;
  type: "goal" | "wicket" | "card" | "touchdown" | "point" | "info";
  title: string;
  detail: string;
  team: 1 | 2 | null;
}

interface CommentaryItem {
  time: string;
  text: string;
  highlight?: boolean;
}

export default function MatchDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [match, setMatch] = useState<LiveScoreMatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "scorecard" | "stats" | "lineups" | "timeline" | "commentary">("overview");
  const [showAllCommentary, setShowAllCommentary] = useState(false);
  const { getAdByType } = useAds();
  const [matchAd, setMatchAd] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const foundMatch = liveScoresDetailData.find((m) => m.id === id);
      if (foundMatch) {
        setMatch(foundMatch);
      }
      setLoading(false);
    }, 1000);

    if (getAdByType) {
      setMatchAd(getAdByType("Match Page Advertisement"));
    }

    return () => clearTimeout(timer);
  }, [id, getAdByType]);

  if (loading) {
    return (
      <main className="bg-page">
        <MatchDetailSkeleton />
      </main>
    );
  }

  if (!match) {
    return (
      <main className=" d-flex flex-column align-items-center justify-content-center py-5 bg-page text-white">
        <h3 className="fw-bold mb-3">Match Not Found</h3>
        <p className="text-muted mb-4">The selected match details are currently unavailable.</p>
        <Link href="/live-scores" className="btn btn-signup text-uppercase fw-semibold px-4 py-2">
          Back to Live Scores
        </Link>
      </main>
    );
  }

  const getWidthStyle = (w: number | string | undefined) => ({ width: `${w}%` });

  const getSportDetails = () => {
    switch (match.sport) {
      case "cricket":
        return {
          teamStats: [
            { label: "Total Runs", team1Val: "174/5", team2Val: "185" },
            { label: "Run Rate", team1Val: 9.1, team2Val: 9.25 },
            { label: "Boundaries (4s / 6s)", team1Val: 27, team2Val: 28 },
            { label: "Extras", team1Val: 12, team2Val: 8 },
            { label: "Dot Balls", team1Val: 38, team2Val: 42 },
          ] as TeamStat[],
          playersTeam1: [
            { name: "Ruturaj Gaikwad", role: "Batsman", metric1: "62 Runs", metric2: "41 Balls" },
            { name: "Shivam Dube", role: "Batsman", metric1: "45* Runs", metric2: "22 Balls" },
            { name: "Ravindra Jadeja", role: "All-Rounder", metric1: "2/28 Wkts", metric2: "4.0 Overs" },
          ] as PlayerPerformance[],
          playersTeam2: [
            { name: "Virat Kohli", role: "Batsman", metric1: "85 Runs", metric2: "55 Balls" },
            { name: "Faf du Plessis", role: "Batsman", metric1: "48 Runs", metric2: "30 Balls" },
            { name: "Mohammed Siraj", role: "Bowler", metric1: "1/32 Wkts", metric2: "4.0 Overs" },
          ] as PlayerPerformance[],
          lineups1: ["Ruturaj Gaikwad (C)", "Rachin Ravindra", "Ajinkya Rahane", "Shivam Dube", "Ravindra Jadeja", "MS Dhoni (WK)", "Mitchell Santner", "Shardul Thakur", "Tushar Deshpande", "Mustafizur Rahman", "Matheesha Pathirana"],
          lineups2: ["Faf du Plessis (C)", "Virat Kohli", "Rajat Patidar", "Glenn Maxwell", "Cameron Green", "Dinesh Karthik (WK)", "Mahipal Lomror", "Karn Sharma", "Mayank Dagar", "Mohammed Siraj", "Yash Dayal"],
          events: [
            { time: "19.1 Ov", type: "info", title: "Match Situation", detail: match.note || "CSK chasing RCB's target.", team: 1 },
            { time: "18.3 Ov", type: "wicket", title: "Wicket Down", detail: "Mitchell Santner c Kohli b Siraj 14(9)", team: 1 },
            { time: "15.2 Ov", type: "point", title: "Fifty Partnership", detail: "Gaikwad & Dube add 54 runs for 4th wicket.", team: 1 },
            { time: "12.0 Ov", type: "info", title: "Mid-Innings Break", detail: "CSK require 94 runs from 48 balls.", team: null },
            { time: "20.0 Ov", type: "info", title: "First Innings End", detail: "RCB score 185 runs in 20.0 overs.", team: 2 },
          ] as MatchEvent[],
          commentary: [
            { time: "19.1", text: "Siraj to Jadeja, 1 run, driven down to long-on for a single. Crucial strike rotation here.", highlight: false },
            { time: "18.6", text: "Yash Dayal to Shivam Dube, SIX! In the slot and Dube deposits it over wide long-on. Incredible power!", highlight: true },
            { time: "18.5", text: "Yash Dayal to Shivam Dube, no run, dot ball! Yorker length outside off, Dube misses.", highlight: false },
            { time: "18.4", text: "Yash Dayal to Jadeja, 1 run, pushed to deep cover for a quick run.", highlight: false },
            { time: "18.3", text: "Yash Dayal to Santner, OUT! Caught Virat Kohli at deep midwicket! Big wicket for RCB.", highlight: true },
            { time: "18.2", text: "Yash Dayal to Santner, 2 runs, lofted over extra cover, Siraj runs back and saves two runs.", highlight: false },
            { time: "18.1", text: "Yash Dayal to Shivam Dube, 1 run, low full toss on the pads, flicked to deep square leg.", highlight: false },
            { time: "17.6", text: "Siraj to Santner, FOUR! Thumped past bowler's head! Half-volley, Santner plays a gorgeous straight drive.", highlight: true },
            { time: "17.5", text: "Siraj to Shivam Dube, 1 run, short ball outside off, pulled away to deep midwicket.", highlight: false },
            { time: "17.4", text: "Siraj to Santner, 1 run, guides it down to third man to get off the mark.", highlight: false },
            { time: "17.3", text: "Siraj to Moeen Ali, OUT! Cleans him up! A blistering yorker crashing into the leg stump. Moeen departs!", highlight: true },
            { time: "17.2", text: "Siraj to Shivam Dube, 1 run, guided to backward point for a single.", highlight: false },
            { time: "17.1", text: "Siraj to Shivam Dube, no run, beats him with extra bounce! Sharp bouncer, Dube ducks under it.", highlight: false },
          ] as CommentaryItem[],
          historical: {
            summary: "CSK and RCB have faced each other 32 times. CSK leads with 20 wins, RCB has won 11 times, and 1 match ended in No Result.",
            h2h: [
              { date: "18-May-2025", result: "W", detail: "RCB won by 27 runs (Bengaluru)" },
              { date: "22-Mar-2025", result: "L", detail: "CSK won by 6 wickets (Chennai)" },
              { date: "17-Apr-2024", result: "L", detail: "CSK won by 8 runs (Bengaluru)" },
            ]
          },
          batters: [
            { name: "Shivam Dube *", runs: 45, balls: 22, fours: 3, sixes: 3, sr: "204.54" },
            { name: "Ravindra Jadeja *", runs: 12, balls: 8, fours: 1, sixes: 0, sr: "150.00" }
          ],
          bowlers: [
            { name: "Yash Dayal *", overs: "3.0", maidens: "0", runs: 32, wickets: 1, economy: "10.67" },
            { name: "Mohammed Siraj", overs: "4.0", maidens: "0", runs: 32, wickets: 2, economy: "8.00" }
          ],
          keyStats: {
            partnership: "15 (8)",
            lastWkt: "Mitchell Santner c Kohli b Siraj 14(9) - 159/5 in 18.3 ov.",
            last10Overs: "112 runs, 3 wkts",
            toss: "RCB (Batting)"
          },
          winProbability: { team1: 65, team2: 35 }
        };

      case "football":
        return {
          teamStats: [
            { label: "Possession (%)", team1Val: 58, team2Val: 42 },
            { label: "Total Shots (On Target)", team1Val: 14, team2Val: 8 },
            { label: "Corners", team1Val: 7, team2Val: 4 },
            { label: "Fouls Committed", team1Val: 9, team2Val: 12 },
            { label: "Yellow Cards", team1Val: 1, team2Val: 3 },
            { label: "Offsides", team1Val: 2, team2Val: 1 },
          ] as TeamStat[],
          playersTeam1: [
            { name: "Erling Haaland", role: "Forward", metric1: "1 Goal", metric2: "4 Shots" },
            { name: "Kevin De Bruyne", role: "Midfielder", metric1: "1 Assist", metric2: "5 Key Passes" },
            { name: "Ederson", role: "Goalkeeper", metric1: "2 Saves", metric2: "88% Pass Acc" },
          ] as PlayerPerformance[],
          playersTeam2: [
            { name: "Bukayo Saka", role: "Forward", metric1: "1 Goal", metric2: "2 Shots" },
            { name: "Declan Rice", role: "Midfielder", metric1: "4 Tackles", metric2: "91% Pass Acc" },
            { name: "David Raya", role: "Goalkeeper", metric1: "4 Saves", metric2: "2 Claims" },
          ] as PlayerPerformance[],
          lineups1: ["Ederson (GK)", "Kyle Walker (C)", "Manuel Akanji", "Ruben Dias", "Josko Gvardiol", "Rodri", "Mateo Kovacic", "Kevin De Bruyne", "Bernardo Silva", "Phil Foden", "Erling Haaland"],
          lineups2: ["David Raya (GK)", "Ben White", "William Saliba", "Gabriel Magalhaes", "Jurrien Timber", "Declan Rice", "Thomas Partey", "Martin Odegaard (C)", "Bukayo Saka", "Gabriel Martinelli", "Kai Havertz"],
          events: [
            { time: "76'", type: "info", title: "Current Status", detail: "Manchester City leading with 15 minutes left.", team: 1 },
            { time: "62'", type: "card", title: "Yellow Card", detail: "William Saliba (Arsenal) penalised for a tactical foul.", team: 2 },
            { time: "55'", type: "goal", title: "GOAL! 2 - 1", detail: "Erling Haaland scores! Assisted by Kevin De Bruyne.", team: 1 },
            { time: "45+2'", type: "info", title: "Half Time", detail: "Teams return to the dressing rooms tied 1-1.", team: null },
            { time: "24'", type: "goal", title: "GOAL! 0 - 1", detail: "Bukayo Saka scores a stunning curling shot from outside the box.", team: 2 },
          ] as MatchEvent[],
          commentary: [
            { time: "76'", text: "Haaland turns Saliba in the box and shoots, but David Raya claims it with excellent positioning.", highlight: false },
            { time: "72'", text: "Substitution for Arsenal: Martinelli out, Leandro Trossard in.", highlight: false },
            { time: "68'", text: "Dias lets fly from distance! It deflects off Gabriel and goes out for a City corner.", highlight: false },
            { time: "62'", text: "Yellow card! Saliba blocks Haaland on a quick counter. Tactical and necessary.", highlight: true },
            { time: "55'", text: "GOAL! Manchester City 2, Arsenal 1. Haaland finishes coolly after a delicate lofted pass from De Bruyne.", highlight: true },
            { time: "48'", text: "Saka cuts inside from the right and crosses, but Ederson punches it clear.", highlight: false },
            { time: "45+2'", text: "Half Time! An entertaining first half ends with both teams scoring once.", highlight: false },
            { time: "41'", text: "Saka takes a corner. Gabriel rises highest but his header goes over the bar.", highlight: false },
            { time: "35'", text: "De Bruyne takes a free kick from 25 yards out, but it hits the wall and goes out.", highlight: false },
          ] as CommentaryItem[],
          historical: {
            summary: "A rivalry of giants. In the last 15 matchups, Man City has won 8, Arsenal has won 4, and 3 matches have ended in draws.",
            h2h: [
              { date: "22-Sep-2025", result: "D", detail: "Draw 2-2 Premier League" },
              { date: "31-Mar-2025", result: "D", detail: "Draw 0-0 Premier League" },
              { date: "08-Oct-2024", result: "W", detail: "Arsenal won 1-0 Premier League" },
            ]
          }
        };

      case "NFL":
        return {
          teamStats: [
            { label: "First Downs", team1Val: 18, team2Val: 15 },
            { label: "Total Yards", team1Val: 340, team2Val: 295 },
            { label: "Passing Yards", team1Val: 240, team2Val: 210 },
            { label: "Rushing Yards", team1Val: 100, team2Val: 85 },
            { label: "Turnovers", team1Val: 1, team2Val: 2 },
            { label: "Possession Time (Min)", team1Val: 32, team2Val: 27 },
          ] as TeamStat[],
          playersTeam1: [
            { name: "Patrick Mahomes", role: "Quarterback", metric1: "240 Yards", metric2: "2 TDs (1 INT)" },
            { name: "Isiah Pacheco", role: "Running Back", metric1: "75 Yards", metric2: "16 Carries" },
            { name: "Travis Kelce", role: "Tight End", metric1: "7 Rec", metric2: "80 Yds (1 TD)" },
          ] as PlayerPerformance[],
          playersTeam2: [
            { name: "Josh Allen", role: "Quarterback", metric1: "210 Yards", metric2: "1 TD (2 INT)" },
            { name: "James Cook", role: "Running Back", metric1: "68 Yards", metric2: "14 Carries" },
            { name: "Khalil Shakir", role: "Wide Receiver", metric1: "5 Rec", metric2: "72 Yds" },
          ] as PlayerPerformance[],
          lineups1: ["Patrick Mahomes (QB)", "Isiah Pacheco (RB)", "Travis Kelce (TE)", "Rashee Rice (WR)", "Marquise Brown (WR)", "Creed Humphrey (C)", "Joe Thuney (G)", "Trey Smith (G)", "Jawan Taylor (T)", "Wanya Morris (T)"],
          lineups2: ["Josh Allen (QB)", "James Cook (RB)", "Khalil Shakir (WR)", "Dalton Kincaid (TE)", "Curtis Samuel (WR)", "Connor McGovern (C)", "O'Cyrus Torrence (G)", "David Edwards (G)", "Dion Dawkins (T)", "Spencer Brown (T)"],
          events: [
            { time: "Q3 08:24", type: "info", title: "Chiefs Drive", detail: "Chiefs in Bills territory after a 22-yard pass.", team: 1 },
            { time: "Q3 11:15", type: "card", title: "Interception", detail: "Josh Allen pass intercepted by Trent McDuffie.", team: 2 },
            { time: "Q2 00:45", type: "touchdown", title: "Chiefs Touchdown!", detail: "Mahomes pass to Kelce for 12 yards. Extra point is GOOD.", team: 1 },
            { time: "Q2 06:10", type: "touchdown", title: "Bills Touchdown!", detail: "Josh Allen rushing touchdown for 4 yards. Extra point is GOOD.", team: 2 },
            { time: "Q1 12:00", type: "touchdown", title: "Chiefs Touchdown!", detail: "Mahomes pass to Rashee Rice for 25 yards. Extra point is GOOD.", team: 1 },
          ] as MatchEvent[],
          commentary: [
            { time: "08:24", text: "Mahomes screen pass to Pacheco for a 6-yard gain. Tackled by Bernard.", highlight: false },
            { time: "09:05", text: "Mahomes deep pass to Travis Kelce complete for 22 yards down the left seam!", highlight: true },
            { time: "09:55", text: "Pacheco runs up the middle for a 3-yard gain. Second down and 7.", highlight: false },
            { time: "11:15", text: "Josh Allen's pass intended for Knox intercepted by McDuffie at the Chiefs 45-yard line!", highlight: true },
            { time: "12:30", text: "Allen runs left for a first down, gaining 12 yards before sliding safely.", highlight: false },
            { time: "13:45", text: "Pacheco runs off-guard for 8 yards, tackled by Oliver.", highlight: false },
            { time: "14:10", text: "Mahomes pass complete to Rice for 15 yards. First down Chiefs.", highlight: false },
            { time: "15:00", text: "Kickoff! Bills win the toss and defer. Chiefs will start at their 25-yard line.", highlight: false },
          ] as CommentaryItem[],
          historical: {
            summary: "One of the modern NFL's great rivalries. Mahomes and Allen have faced off 8 times in the regular season and playoffs, with Chiefs winning 5 and Bills 3.",
            h2h: [
              { date: "10-Dec-2024", result: "W", detail: "Bills won 20-17 Regular Season" },
              { date: "21-Jan-2024", result: "L", detail: "Chiefs won 27-24 AFC Divisional Round" },
              { date: "16-Oct-2023", result: "W", detail: "Bills won 24-20 Regular Season" },
            ]
          }
        };

      case "AFL":
      default:
        return {
          teamStats: [
            { label: "Inside 50s", team1Val: 52, team2Val: 48 },
            { label: "Clearances", team1Val: 38, team2Val: 32 },
            { label: "Tackles", team1Val: 68, team2Val: 72 },
            { label: "Disposals", team1Val: 345, team2Val: 320 },
            { label: "Marks Inside 50", team1Val: 14, team2Val: 10 },
            { label: "Contested Possessions", team1Val: 128, team2Val: 115 },
          ] as TeamStat[],
          playersTeam1: [
            { name: "Joe Daniher", role: "Key Forward", metric1: "4 Goals", metric2: "2 Behinds" },
            { name: "Lachie Neale", role: "Midfielder", metric1: "32 Disp", metric2: "8 Clearances" },
            { name: "Harris Andrews", role: "Key Defender", metric1: "12 Spoils", metric2: "8 Marks" },
          ] as PlayerPerformance[],
          playersTeam2: [
            { name: "Zach Merrett", role: "Midfielder", metric1: "30 Disp", metric2: "6 Tackles" },
            { name: "Jake Stringer", role: "Forward", metric1: "2 Goals", metric2: "14 Disp" },
            { name: "Ben McKay", role: "Key Defender", metric1: "9 Intercepts", metric2: "7 Marks" },
          ] as PlayerPerformance[],
          lineups1: ["Harris Andrews (C)", "Lachie Neale", "Joe Daniher", "Eric Hipwood", "Charlie Cameron", "Hugh McCluggage", "Josh Dunkley", "Jarrod Berry", "Dayne Zorko", "Cam Rayner", "Darcy Wilmot"],
          lineups2: ["Zach Merrett (C)", "Jake Stringer", "Kyle Langford", "Sam Durham", "Jye Caldwell", "Mason Redman", "Ben McKay", "Dyson Heppell", "Peter Wright", "Nic Martin", "Andrew McGrath"],
          events: [
            { time: "Q3 12:45", type: "info", title: "Suns lead by 5", detail: "Gold Coast Suns fighting to hold their lead.", team: 1 },
            { time: "Q3 14:10", type: "goal", title: "Goal! Suns", detail: "Daniher snaps a brilliant goal from the boundary line.", team: 1 },
            { time: "Q2 22:15", type: "goal", title: "Goal! Essendon", detail: "Jake Stringer soccered it through from close range.", team: 2 },
            { time: "Q2 10:05", type: "point", title: "Behind! Suns", detail: "Hipwood set shot hits the left post.", team: 1 },
          ] as MatchEvent[],
          commentary: [
            { time: "12:45", text: "Neale gets the clearance out of the middle, handballs to Zorko who pumps it inside 50.", highlight: false },
            { time: "14:10", text: "Daniher claims a contested mark, lines up from a tight angle, and drills it home! Fantastic goal!", highlight: true },
            { time: "16:05", text: "Umpire blows whistle for holding the ball against Caldwell. Free kick to Suns.", highlight: false },
          ] as CommentaryItem[],
          historical: {
            summary: "Lions have dominated recent meetings against Essendon, winning 4 of the last 5 encounters at the Gabba and MCG.",
            h2h: [
              { date: "Round 5, 2025", result: "L", detail: "Brisbane Lions 112 vs Essendon 78" },
              { date: "Round 18, 2024", result: "L", detail: "Essendon 64 vs Brisbane Lions 84" },
              { date: "Round 2, 2024", result: "W", detail: "Brisbane Lions 88 vs Essendon 91" },
            ]
          }
        };
    }
  };

  const details = getSportDetails();

  return (
    <main className="py-5 bg-page text-white font-outfit">
      <div className="container custom-container max-w-1000px">

        {/* Breadcrumb Back Button */}
        <div className="mb-4">
          <Link
            href="/live-scores"
            className="text-muted text-decoration-none small fw-semibold hover-success d-inline-flex align-items-center gap-2 fs-13 transition-color"
          >
            <i className="bi bi-chevron-left fs-11"></i>
            Back to Live Scores
          </Link>
        </div>

        {/* Dynamic Match Scoreboard Header Card */}
        <div
          className="card border border-secondary border-opacity-10 rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden shadow-lg bg-match-header"
        >
          {/* Subtle Ambient Glow */}
          <div
            className="position-absolute rounded-circle w-300px h-300px ambient-glow-top"
          ></div>

          <div className="position-relative z-5">
            {/* Header Meta: Competition & Status */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mb-4 pb-3 border-bottom border-secondary border-opacity-10">
              <span className="text-muted small fw-bold font-monospace text-uppercase ls-1 fs-11">
                {match.competitionName}
              </span>
              <div className="d-flex align-items-center gap-3">
                <StatusBadge status={match.matchStatus} />
                <span className="text-secondary border-start border-secondary border-opacity-30 ps-3 small font-monospace text-light fw-bold">
                  <i className="bi bi-clock me-2 text-secondary"></i>
                  {match.matchTime}
                </span>
              </div>
            </div>

            {/* Scoreboard Row */}
            <div className="row align-items-center g-4 text-center my-2">
              {/* Team 1 */}
              <div className="col-12 col-sm-4 d-flex flex-column align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center bg-dark bg-opacity-60 rounded-circle p-3 border border-secondary border-opacity-15 shadow-sm animate-pulse-subtle w-92px h-92px"
                >
                  <img
                    src={match.team1Logo}
                    alt={match.team1Name}
                    width={56}
                    height={56} className="object-fit-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/imgs/teams/team-placeholder.svg";
                    }}
                  />
                </div>
                <h5 className="text-white fw-extrabold m-0 px-2 font-space-grotesk fs-19 ls-minus-03">
                  {match.team1Name}
                </h5>
                {match.team1Overs && (
                  <span className="badge bg-dark bg-opacity-50 border border-secondary border-opacity-10 text-muted font-monospace py-1.5 px-3 fs-11 br-10px">
                    {match.team1Overs} ov
                  </span>
                )}
              </div>

              {/* Middle Score Display */}
              <div className="col-12 col-sm-4 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <span className="display-4 fw-extrabold text-light font-monospace ls-minus-1 fs-46 text-shadow-glow">
                    {match.team1Score}
                  </span>

                  {/* Neon VS Pill - Fixed Solid Green Issue */}
                  <span
                    className="fw-bold font-monospace text-uppercase rounded-pill fs-12 ls-15 text-accent-green bg-rgba2614061008 border-1pxsolidrgba261406102 padding-4px12px"
                  >
                    VS
                  </span>

                  <span className="display-4 fw-extrabold text-light font-monospace ls-minus-1 fs-46 text-shadow-glow">
                    {match.team2Score}
                  </span>
                </div>

                {match.sport === "cricket" && (
                  <div className="d-flex gap-3 text-muted small font-monospace mt-2">
                    <span>CRR: <strong className="text-success">9.08</strong></span>
                    <span className="text-secondary">|</span>
                    <span>RRR: <strong className="text-danger">14.40</strong></span>
                  </div>
                )}

                <div className="d-inline-flex align-items-center gap-2 text-muted small mt-3 bg-dark bg-opacity-40 border border-secondary border-opacity-10 rounded-pill px-3 py-2 fs-12">
                  <i className="bi bi-geo-alt-fill text-success fs-11"></i>
                  <span className="text-truncate max-w-200px">{match.venue}</span>
                </div>
              </div>

              {/* Team 2 */}
              <div className="col-12 col-sm-4 d-flex flex-column align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center bg-dark bg-opacity-60 rounded-circle p-3 border border-secondary border-opacity-15 shadow-sm animate-pulse-subtle w-92px h-92px"
                >
                  <img
                    src={match.team2Logo}
                    alt={match.team2Name}
                    width={56}
                    height={56} className="object-fit-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/imgs/teams/team-placeholder.svg";
                    }}
                  />
                </div>
                <h5 className="text-white fw-extrabold m-0 px-2 font-space-grotesk fs-19 ls-minus-03">
                  {match.team2Name}
                </h5>
                {match.team2Overs && (
                  <span className="badge bg-dark bg-opacity-50 border border-secondary border-opacity-10 text-muted font-monospace py-1.5 px-3 fs-11 br-10px">
                    {match.team2Overs} ov
                  </span>
                )}
              </div>
            </div>

            {/* Note banner - Theme Compliant Green */}
            {match.note && (
              <div
                className="rounded-3 p-3 mt-4 text-center small fw-bold d-flex align-items-center justify-content-center gap-2 text-accent-green bg-rgba2614061006 border-1pxsolidrgba261406102"
              >
                <i className="bi bi-info-circle-fill text-accent-green"></i>
                {match.note}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Match Page Advertisement */}
        {matchAd && (
          <aside className="ad-section rounded-3 border border-dark overflow-hidden mb-4 position-relative d-flex align-items-end" style={{ minHeight: "140px" }}>
            <a href={matchAd.redirectUrl} target="_blank" rel="noopener noreferrer" className="w-100 h-100 d-block position-relative" style={{ minHeight: "140px" }}>
              <img
                src={matchAd.image}
                alt={matchAd.title}
                className="w-100 h-100 object-fit-cover ad-bg-img"
                style={{ position: "absolute", inset: 0 }}
              />
            </a>
            <span className="position-absolute top-0 end-0 badge bg-dark text-muted font-monospace fs-10 border border-secondary border-opacity-10 m-2 z-1">
              SPONSOR
            </span>
          </aside>
        )}

        {match.sport === "NFL" ? (
          <NFLMatchDetail match={match} />
        ) : match.sport === "AFL" ? (
          <AFLMatchDetail match={match} />
        ) : (
          <>
            {/* Tab Navigation Row */}
            <div className="d-flex border-bottom border-dark overflow-auto mb-4 custom-tabs gap-2 pb-1">
              {[
                { id: "overview", label: "Overview", icon: "bi-info-square" },
                { id: "scorecard", label: "Scorecard", icon: "bi-clipboard-data" },
                { id: "stats", label: "Statistics", icon: "bi-bar-chart" },
                { id: "lineups", label: "Lineups", icon: "bi-people" },
                { id: "timeline", label: "Timeline", icon: "bi-calendar-event" },
                { id: "commentary", label: "Commentary", icon: "bi-chat-left-text" },
              ].filter(t => t.id !== "scorecard" || match.sport === "cricket").map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`btn border-0 rounded-0 px-4 py-3 fw-bold text-uppercase flex-shrink-0 d-flex align-items-center gap-2 ${activeSubTab === tab.id
                    ? "text-success border-bottom border-success border-2"
                    : "text-muted"
                    } fs-12 ls-05 transition-fast font-space-grotesk`}
                >
                  <i className={`bi ${tab.icon} fs-14`}></i>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="tab-content">

              {/* OVERVIEW TAB */}
              {activeSubTab === "overview" && (
                <div className="d-flex flex-column gap-4">
                  {match.sport === "cricket" && details && (
                    <CricbuzzLiveDashboard match={match} details={details} />
                  )}
                  {match.sport === "football" && (
                    <FootballLiveDashboard match={match} />
                  )}
                  {/* Match overview details */}
                  <div className="card bg-card border border-dark rounded-3 p-4">
                    <h5
                      className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk ls-minus-02"
                    >
                      Match Overview
                    </h5>
                    <div className="row g-3">
                      {[
                        { label: "COMPETITION", val: match.competitionName },
                        { label: "VENUE", val: match.stadium || match.venue },
                        { label: "LAST UPDATED", val: match.lastUpdated },
                        { label: "SPORT TYPE", val: match.sport.toUpperCase() },
                        ...(match.referee ? [{ label: "REFEREE", val: match.referee }] : []),
                        ...(match.matchWeek ? [{ label: "ROUND", val: match.matchWeek }] : []),
                      ].map((item, idx) => (
                        <div className="col-12 col-sm-6 col-md-3" key={idx}>
                          <div className="bg-dark bg-opacity-40 border border-secondary border-opacity-10 rounded-3 p-3 h-100">
                            <div className="text-muted font-monospace mb-2 text-uppercase fw-semibold fs-10 ls-05">{item.label}</div>
                            <div className="text-light fw-bold fs-13-5">{item.val}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Head-to-Head & Historical */}
                  {details?.historical && (
                    <div className="card bg-card border border-dark rounded-3 p-4">
                      <h5
                        className="text-white fw-bold mb-3 border-start border-success border-4 ps-3 fs-18 font-space-grotesk ls-minus-02"
                      >
                        Historical Results (H2H)
                      </h5>
                      <p className="text-muted mb-4 fs-14">{details.historical.summary}</p>

                      <div className="d-flex flex-column gap-3">
                        {details.historical.h2h.map((h, i) => {
                          const isWin = h.result === "W";
                          const isLoss = h.result === "L";
                          const isDraw = h.result === "D";

                          let badgeBg = "rgba(108, 117, 125, 0.15)";
                          let badgeColor = "#cbd5e1";
                          let badgeText = "D";

                          if (isWin) {
                            badgeBg = "rgba(26, 140, 61, 0.15)";
                            badgeColor = "#4ade80";
                            badgeText = "W";
                          } else if (isLoss) {
                            badgeBg = "rgba(220, 53, 69, 0.15)";
                            badgeColor = "#f87171";
                            badgeText = "L";
                          } else {
                            badgeBg = "rgba(108, 117, 125, 0.15)";
                            badgeColor = "#cbd5e1";
                            badgeText = "D";
                          }

                          return (
                            <div key={i} className="d-flex align-items-center justify-content-between border border-dark rounded-3 p-3 bg-dark bg-opacity-30">
                              <div>
                                <span className="badge bg-dark border border-secondary border-opacity-10 text-muted mb-2 font-monospace px-2 py-1 fs-10">
                                  {h.date}
                                </span>
                                <div className="text-light fw-bold fs-14">{h.detail}</div>
                              </div>

                              <div
                                className={`d-flex align-items-center justify-content-center rounded-circle fw-bold font-monospace shadow-sm ${`w-32px h-32px fs-12 ${h.result === "win" ? "badge-win" : h.result === "loss" ? "badge-loss" : "badge-draw"}`}`}
                              >
                                {badgeText}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SCORECARD TAB */}
              {activeSubTab === "scorecard" && match.sport === "cricket" && (
                <ScorecardTab match={match} />
              )}

              {/* STATISTICS TAB */}
              {activeSubTab === "stats" && (
                <div className="d-flex flex-column gap-4">
                  {/* Team Statistics */}
                  <div className="card bg-card border border-dark rounded-3 p-4">
                    <h5
                      className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk ls-minus-02"
                    >
                      Team Statistics Comparison
                    </h5>
                    <div className="d-flex flex-column gap-4">
                      {details?.teamStats.map((stat, i) => {
                        const val1 = parseFloat(stat.team1Val.toString()) || 0;
                        const val2 = parseFloat(stat.team2Val.toString()) || 0;
                        const total = val1 + val2 || 1;
                        const ratio1 = (val1 / total) * 100;
                        const ratio2 = (val2 / total) * 100;

                        return (
                          <div key={i} className="d-flex flex-column">
                            {/* Improved label positioning with Outfit font */}
                            <div className="d-flex justify-content-between align-items-center mb-2 fw-bold fs-13-5">
                              <span className="text-white font-monospace fs-14">{stat.team1Val}</span>
                              <span className="text-muted text-uppercase font-monospace fs-10-5 ls-1">{stat.label}</span>
                              <span className="text-white font-monospace fs-14">{stat.team2Val}</span>
                            </div>
                            {/* Custom Double-sided Progress Bar */}
                            <div className="d-flex align-items-center gap-2 w-100 h-6px">
                              {/* Team 1 (Left bar, grows right to left) */}
                              <div className="w-50 d-flex justify-content-end bg-dark rounded-start h-6px overflow-hidden">
                                <div
                                  className="bg-success rounded-start progress-bar-base" style={getWidthStyle(ratio1)}
                                ></div>
                              </div>
                              {/* Center Divider dot */}
                              <div className="bg-secondary rounded-circle w-4px h-4px opacity-30"></div>
                              {/* Team 2 (Right bar, grows left to right) */}
                              <div className="w-50 bg-dark rounded-end h-6px overflow-hidden">
                                <div
                                  className="rounded-end progress-bar-base bg-dark-slate" style={getWidthStyle(ratio2)}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Player Performances */}
                  <div className="card bg-card border border-dark rounded-3 p-4">
                    <h5
                      className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk ls-minus-02"
                    >
                      Key Player Performances
                    </h5>

                    <div className="row g-4">
                      {/* Team 1 Performance */}
                      <div className="col-12 col-md-6 border-md-end border-dark pe-md-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <div className="bg-success rounded-circle w-8px h-8px"></div>
                          <h6 className="text-white fw-bold m-0 font-monospace text-uppercase fs-12 ls-05">
                            {match.team1Name}
                          </h6>
                        </div>
                        <div className="d-flex flex-column gap-3">
                          {details?.playersTeam1.map((p, i) => {
                            const firstChar = p.name.charAt(0);
                            return (
                              <div
                                key={i}
                                className="bg-dark bg-opacity-30 border border-secondary border-opacity-10 rounded-3 d-flex justify-content-between align-items-center hover-card-effect p-3 transition-fast"
                              >
                                <div className="d-flex align-items-center gap-3">
                                  <div
                                    className="d-flex align-items-center justify-content-center rounded-circle fw-bold font-monospace w-36px h-36px fs-13 bg-rgba2614061015 text-4ade80 border-1pxsolidrgba261406103"
                                  >
                                    {firstChar}
                                  </div>
                                  <div>
                                    <div className="text-white fw-bold fs-14">{p.name}</div>
                                    <div className="text-muted fs-11">{p.role}</div>
                                  </div>
                                </div>
                                <div className="text-end font-monospace">
                                  <div className="text-success fw-bold fs-13-5">{p.metric1}</div>
                                  <div className="text-muted fs-11">{p.metric2}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Team 2 Performance */}
                      <div className="col-12 col-md-6 ps-md-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <div className="bg-secondary rounded-circle w-8px h-8px bg-3a4356"></div>
                          <h6 className="text-white fw-bold m-0 font-monospace text-uppercase fs-12 ls-05">
                            {match.team2Name}
                          </h6>
                        </div>
                        <div className="d-flex flex-column gap-3">
                          {details?.playersTeam2.map((p, i) => {
                            const firstChar = p.name.charAt(0);
                            return (
                              <div
                                key={i}
                                className="bg-dark bg-opacity-30 border border-secondary border-opacity-10 rounded-3 d-flex justify-content-between align-items-center hover-card-effect p-3 transition-fast"
                              >
                                <div className="d-flex align-items-center gap-3">
                                  <div
                                    className="d-flex align-items-center justify-content-center rounded-circle fw-bold font-monospace w-36px h-36px fs-13 bg-rgba255255255006 text-e2e8f0 border-1pxsolidrgba25525525501"
                                  >
                                    {firstChar}
                                  </div>
                                  <div>
                                    <div className="text-white fw-bold fs-14">{p.name}</div>
                                    <div className="text-muted fs-11">{p.role}</div>
                                  </div>
                                </div>
                                <div className="text-end font-monospace">
                                  <div className="text-light fw-bold fs-13-5">{p.metric1}</div>
                                  <div className="text-muted fs-11">{p.metric2}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LINEUPS TAB */}
              {activeSubTab === "lineups" && (
                match.sport === "football" && match.team1Info && match.team2Info ? (
                  <FootballLineupsTab match={match} />
                ) : (
                  <div className="card bg-card border border-dark rounded-3 p-4">
                    <h5
                      className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk ls-minus-02"
                    >
                      Starting Formations & Squads
                    </h5>

                    <div className="row g-4 align-items-start">
                      {/* Team 1 Squad */}
                      <div className="col-12 col-md-6 border-md-end border-dark pe-md-4">
                        <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom border-dark">
                          <img
                            src={match.team1Logo}
                            alt={match.team1Name}
                            width={32}
                            height={32} className="object-fit-contain"
                          />
                          <h6 className="text-white fw-extrabold m-0 fs-15 font-space-grotesk">{match.team1Name}</h6>
                        </div>

                        <div className="d-flex flex-column">
                          {details?.lineups1.map((player, i) => {
                            const isCaptain = player.includes("(C)");
                            const isWK = player.includes("(WK)");

                            return (
                              <div
                                key={i}
                                className="hover-card-effect display-flex flex-wrap-wrap gap-10px align-items-center justify-content-space-between padding-12px16px bg-rgba255255255001 border-bottom-1pxsolidrgba255255255004 transition-all015s"
                              >
                                <div className="d-flex align-items-center gap-3">
                                  <div
                                    className={`font-monospace fw-bold ${`player-avatar-base ${isCaptain ? "avatar-captain-1" : "avatar-normal-1"}`}`}
                                  >
                                    {i + 1}
                                  </div>
                                  <span className={`small ${isCaptain ? "text-success fw-bold" : "text-light"} fs-13-5`}>
                                    {player}
                                  </span>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                  {isCaptain && (
                                    <span
                                      className="badge px-2 py-1 fs-9 bg-rgba2614061015 text-4ade80 border-1pxsolidrgba261406103"
                                    >
                                      CAPT
                                    </span>
                                  )}
                                  {isWK && (
                                    <span
                                      className="badge px-2 py-1 fs-9 bg-rgba13202240015 text-22d3ee border-1pxsolidrgba1320224003"
                                    >
                                      WICKETKEEPER
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Team 2 Squad */}
                      <div className="col-12 col-md-6 ps-md-4">
                        <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom border-dark">
                          <img
                            src={match.team2Logo}
                            alt={match.team2Name}
                            width={32}
                            height={32} className="object-fit-contain"
                          />
                          <h6 className="text-white fw-extrabold m-0 fs-15 font-space-grotesk">{match.team2Name}</h6>
                        </div>

                        <div className="d-flex flex-column">
                          {details?.lineups2.map((player, i) => {
                            const isCaptain = player.includes("(C)");
                            const isWK = player.includes("(WK)");

                            return (
                              <div
                                key={i}
                                className="hover-card-effect display-flex flex-wrap-wrap gap-10px align-items-center justify-content-space-between padding-12px16px bg-rgba255255255001 border-bottom-1pxsolidrgba255255255004 transition-all015s"
                              >
                                <div className="d-flex align-items-center gap-3">
                                  <div
                                    className={`font-monospace fw-bold ${`player-avatar-base ${isCaptain ? "avatar-captain-2" : "avatar-normal-2"}`}`}
                                  >
                                    {i + 1}
                                  </div>
                                  <span className={`small ${isCaptain ? "text-white fw-bold" : "text-light"} fs-13-5`}>
                                    {player}
                                  </span>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                  {isCaptain && (
                                    <span
                                      className="badge px-2 py-1 fs-9 bg-rgba255255255008 text-ffffff border-1pxsolidrgba255255255015"
                                    >
                                      CAPT
                                    </span>
                                  )}
                                  {isWK && (
                                    <span
                                      className="badge px-2 py-1 fs-9 bg-rgba13202240015 text-22d3ee border-1pxsolidrgba1320224003"
                                    >
                                      WICKETKEEPER
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* TIMELINE/EVENTS TAB */}
              {activeSubTab === "timeline" && (
                <div className="card bg-card border border-dark rounded-3 p-4">
                  <h5
                    className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk ls-minus-02"
                  >
                    Match Events Timeline
                  </h5>

                  {/* Football-specific rich timeline */}
                  {match.sport === "football" && match.footballTimeline ? (
                    <FootballTimeline match={match} />
                  ) : (
                    <div className="position-relative ps-4 py-2 border-start border-secondary border-opacity-15 border-2 ms-2 d-flex flex-column gap-4">
                      {details?.events.map((e, i) => {
                        let iconClass = "bi-info-circle-fill text-muted";
                        let borderClass = "border-event-default";

                        if (e.type === "goal" || e.type === "touchdown") {
                          iconClass = "bi-football text-success";
                          borderClass = "border-event-success";
                        } else if (e.type === "wicket") {
                          iconClass = "bi-x-circle text-danger";
                          borderClass = "border-event-danger";
                        } else if (e.type === "card") {
                          iconClass = "bi-file-fill text-warning";
                          borderClass = "border-event-warning";
                        } else if (e.type === "point") {
                          iconClass = "bi-star-fill text-info";
                        }

                        return (
                          <div key={i} className="position-relative">
                            {/* Timeline Dot Indicator */}
                            <span
                              className={`position-absolute d-flex align-items-center justify-content-center rounded-circle animate-pulse-subtle ${`timeline-dot-v2 ${e.team === 1 ? "timeline-border-1" : e.team === 2 ? "timeline-border-2" : "timeline-border-3"}`}`}
                            >
                              <i className={`bi ${iconClass} fs-12`}></i>
                            </span>

                            {/* Event Details Card - Spacing & Overlaps Fixed */}
                            <div
                              className={`d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center rounded-3 p-3 timeline-card-base-v2 ${borderClass}`}
                            >
                              <div>
                                {/* Explicit Gap & Flex Layout prevents overlaps */}
                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                  <span
                                    className="font-monospace rounded text-success fw-extrabold flex-shrink-0 fs-11 bg-rgba2614061008 border-1pxsolidrgba261406102 padding-3px8px"
                                  >
                                    {e.time}
                                  </span>
                                  <span className="text-white fw-bold fs-14">
                                    {e.title}
                                  </span>
                                </div>
                                <div className="text-muted small mt-2 fs-13 lh-15">
                                  {e.detail}
                                </div>
                              </div>

                              {e.team && (
                                <span className="badge bg-dark bg-opacity-40 border border-secondary border-opacity-10 text-muted mt-2 mt-sm-0 font-monospace px-2 py-1 fs-9">
                                  {e.team === 1 ? match.team1Name : match.team2Name}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* COMMENTARY TAB */}
              {activeSubTab === "commentary" && (
                <div className="card bg-card border border-dark rounded-3 p-4">
                  <h5
                    className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk ls-minus-02"
                  >
                    Live Text Commentary
                  </h5>

                  <div className="d-flex flex-column gap-3">
                    {details?.commentary.slice(0, showAllCommentary ? undefined : 6).map((c, i) => {
                      const isCricketOverEnd = match.sport === "cricket" && c.time.endsWith(".1");
                      const overNum = isCricketOverEnd ? c.time.split(".")[0] : "";

                      return (
                        <React.Fragment key={i}>
                          <div
                            className={`d-flex flex-column flex-sm-row gap-3 align-items-start ${`commentary-card-base ${c.highlight ? "commentary-highlight" : "commentary-normal"}`}`}
                          >
                            {/* Fixed commentary spacing and overflow issues */}
                            <div
                              className="font-monospace text-success fw-bold text-center flex-shrink-0 w-56px fs-12 br-6px bg-rgba261406101 border-1pxsolidrgba2614061025 padding-3px6px"
                            >
                              {c.time}
                            </div>
                            <div
                              className={`small m-0 ${c.highlight ? "text-light fw-bold" : "text-muted"} fs-13-5 lh-15`}
                            >
                              {c.text}
                            </div>
                          </div>

                          {isCricketOverEnd && (
                            <OverSummaryBox overNum={overNum} />
                          )}
                        </React.Fragment>
                      );
                    })}

                    {details?.commentary && details.commentary.length > 6 && (
                      <div className="text-center mt-3 pt-2">
                        <button
                          className="btn btn-outline-success btn-sm px-4 py-2 fw-semibold text-uppercase fs-12 ls-05"
                          onClick={() => setShowAllCommentary(!showAllCommentary)}
                        >
                          {showAllCommentary ? "See Less" : "See More"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </main>
  );
}

function OverSummaryBox({ overNum }: { overNum: string }) {
  let score = "";
  let balls: string[] = [];
  let runsText = "";
  let batsmen: { name: string; runs: number; balls: number }[] = [];
  let bowler: { name: string; figures: string } = { name: "", figures: "" };

  if (overNum === "18") {
    score = "173-5";
    balls = ["1", "1", "W", "2", "1", "6"];
    runsText = "11 runs";
    batsmen = [
      { name: "Shivam Dube", runs: 45, balls: 22 },
      { name: "Mitchell Santner", runs: 14, balls: 9 }
    ];
    bowler = { name: "Yash Dayal", figures: "3.0-0-32-1" };
  } else if (overNum === "17") {
    score = "162-4";
    balls = ["0", "1", "W", "1", "1", "4"];
    runsText = "7 runs";
    batsmen = [
      { name: "Shivam Dube", runs: 38, balls: 18 },
      { name: "Mitchell Santner", runs: 8, balls: 5 }
    ];
    bowler = { name: "Mohammed Siraj", figures: "4.0-0-32-2" };
  } else {
    score = "150-4";
    balls = ["1", "2", "0", "1", "1", "1"];
    runsText = "6 runs";
    batsmen = [
      { name: "Shivam Dube", runs: 30, balls: 15 },
      { name: "Mitchell Santner", runs: 4, balls: 3 }
    ];
    bowler = { name: "Mohammed Siraj", figures: "3.0-0-26-1" };
  }

  return (
    <div
      className="card bg-dark bg-opacity-40 border border-secondary border-opacity-15 rounded-3 p-3 my-3 shadow-sm backdrop-filter-blur8px"
    >
      {/* Header Info */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pb-2 mb-3 border-bottom border-secondary border-opacity-10">
        <div className="d-flex align-items-center gap-2">
          <span className="text-white fw-bold fs-14">Over {overNum}</span>
          <span className="text-muted fs-12">|</span>
          <span className="text-white fw-bold fs-14">{score}</span>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <div className="d-flex gap-1">
            {balls.map((b, idx) => {
              let bg = "rgba(255, 255, 255, 0.05)";
              let color = "#8a94a6";
              let border = "1px solid rgba(255, 255, 255, 0.08)";

              if (b === "W") {
                bg = "rgba(220, 53, 69, 0.15)";
                color = "#ff5b5b";
                border = "1px solid rgba(220, 53, 69, 0.3)";
              } else if (b === "6" || b === "4") {
                bg = "rgba(26, 140, 61, 0.15)";
                color = "#4ade80";
                border = "1px solid rgba(26, 140, 61, 0.3)";
              }

              return (
                <span
                  key={idx}
                  className="d-flex align-items-center justify-content-center rounded-circle font-monospace fw-bold w-20px h-20px fs-10"
                >
                  {b}
                </span>
              );
            })}
          </div>
          <span className="text-muted small">({runsText})</span>
        </div>
      </div>

      {/* Players Stats Grid */}
      <div className="row g-3 mb-3">
        {/* Batsmen Column */}
        <div className="col-12 col-sm-6 border-sm-end border-secondary border-opacity-10">
          <div className="d-flex flex-column gap-2">
            {batsmen.map((bat, idx) => (
              <div key={idx} className="d-flex justify-content-between align-items-center pe-sm-3">
                <span className="text-muted fs-13">{bat.name}</span>
                <span className="text-light fw-semibold font-monospace fs-13">
                  {bat.runs} <span className="text-muted fs-11">({bat.balls})</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bowler Column */}
        <div className="col-12 col-sm-6 ps-sm-3">
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted fs-13">{bowler.name}</span>
            <span className="text-light fw-semibold font-monospace fs-13">
              {bowler.figures}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="d-flex gap-3 justify-content-start">
        <a
          href="#over-summary"
          className="text-success text-decoration-none fw-semibold d-flex align-items-center gap-1 hover-opacity-80 fs-12 text-4ade80"
          onClick={(e) => e.preventDefault()}
        >
          Over Summary <i className="bi bi-chevron-right fs-10"></i>
        </a>
        <a
          href="#all-overs"
          className="text-success text-decoration-none fw-semibold d-flex align-items-center gap-1 hover-opacity-80 fs-12 text-4ade80"
          onClick={(e) => e.preventDefault()}
        >
          View all overs <i className="bi bi-chevron-right fs-10"></i>
        </a>
      </div>
    </div>
  );
}

function CricbuzzLiveDashboard({ match, details }: { match: any; details: any }) {
  const batters = details.batters || [
    { name: "Shivam Dube *", runs: 45, balls: 22, fours: 3, sixes: 3, sr: "204.54" },
    { name: "Ravindra Jadeja *", runs: 12, balls: 8, fours: 1, sixes: 0, sr: "150.00" }
  ];

  const bowlers = details.bowlers || [
    { name: "Yash Dayal *", overs: "3.0", maidens: "0", runs: 32, wickets: 1, economy: "10.67" },
    { name: "Mohammed Siraj", overs: "4.0", maidens: "0", runs: 32, wickets: 2, economy: "8.00" }
  ];

  const keyStats = details.keyStats || {
    partnership: "15 (8)",
    lastWkt: "Mitchell Santner c Kohli b Siraj 14(9) - 159/5 in 18.3 ov.",
    last10Overs: "112 runs, 3 wkts",
    toss: "RCB (Batting)"
  };

  const winProbability = details.winProbability || { team1: 65, team2: 35 };

  const t1Color = match.team1Name.toLowerCase().includes("csk") || match.team1Name.toLowerCase().includes("chennai") ? "#f1c40f" : "#22c55e";
  const t2Color = match.team2Name.toLowerCase().includes("rcb") || match.team2Name.toLowerCase().includes("bangalore") ? "#ef4444" : "#3b82f6";

  return (
    <div className="card bg-card border border-dark rounded-3 p-4">
      {/* Top Header Row */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 mb-4 border-bottom border-secondary border-opacity-10">
        <div className="d-flex align-items-baseline gap-3">
          <h4 className="text-white fw-bold m-0 font-monospace fs-20">
            {match.team1Name} {match.team1Score}
          </h4>
          <span className="text-muted small font-monospace">({match.team1Overs || "19.1"} Ov)</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-dark bg-opacity-40 border border-secondary border-opacity-15 font-monospace text-muted py-2 px-3 fs-12">
            CRR: {match.team1Score ? (parseFloat(match.team1Score.split("/")[0]) / 19.1).toFixed(2) : "9.11"}
          </span>
          <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-20 font-monospace py-2 px-3 fs-12">
            {match.note || "Live"}
          </span>
        </div>
      </div>

      {/* Main Grid: Batters & Bowlers (Left) vs Key Stats (Right) */}
      <div className="row g-4 mb-4">
        {/* Left Side: Tables */}
        <div className="col-12 col-lg-7">
          {/* Batters Table (CSS Grid to avoid Bootstrap white table background overrides) */}
          <div className="mb-4">
            {/* Headers */}
            <div
              className="d-grid text-muted text-uppercase fw-semibold pb-2 mb-2 border-bottom border-secondary border-opacity-10 fs-11 ls-05 grid-template-columns-25fr1fr1fr1fr1fr12fr"
            >
              <div>Batter</div>
              <div className="text-end">R</div>
              <div className="text-end">B</div>
              <div className="text-end">4s</div>
              <div className="text-end">6s</div>
              <div className="text-end">SR</div>
            </div>

            {/* Rows */}
            <div className="d-flex flex-column gap-1">
              {batters.map((bat: any, idx: number) => (
                <div
                  key={idx}
                  className="d-grid align-items-center py-2 border-bottom border-secondary border-opacity-5 fs-13 grid-template-columns-25fr1fr1fr1fr1fr12fr"
                >
                  <div className="fw-semibold text-light">{bat.name}</div>
                  <div className="text-end font-monospace text-white">{bat.runs}</div>
                  <div className="text-end font-monospace text-muted">{bat.balls}</div>
                  <div className="text-end font-monospace text-muted">{bat.fours}</div>
                  <div className="text-end font-monospace text-muted">{bat.sixes}</div>
                  <div className="text-end font-monospace text-muted">{bat.sr}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bowlers Table (CSS Grid to avoid Bootstrap white table background overrides) */}
          <div>
            {/* Headers */}
            <div
              className="d-grid text-muted text-uppercase fw-semibold pb-2 mb-2 border-bottom border-secondary border-opacity-10 fs-11 ls-05 grid-template-columns-25fr1fr1fr1fr1fr12fr"
            >
              <div>Bowler</div>
              <div className="text-end">O</div>
              <div className="text-end">M</div>
              <div className="text-end">R</div>
              <div className="text-end">W</div>
              <div className="text-end">ECO</div>
            </div>

            {/* Rows */}
            <div className="d-flex flex-column gap-1">
              {bowlers.map((bowl: any, idx: number) => (
                <div
                  key={idx}
                  className="d-grid align-items-center py-2 border-bottom border-secondary border-opacity-5 fs-13 grid-template-columns-25fr1fr1fr1fr1fr12fr"
                >
                  <div className="fw-semibold text-light">{bowl.name}</div>
                  <div className="text-end font-monospace text-muted">{bowl.overs}</div>
                  <div className="text-end font-monospace text-muted">{bowl.maidens}</div>
                  <div className="text-end font-monospace text-muted">{bowl.runs}</div>
                  <div className="text-end font-monospace fw-semibold text-success">{bowl.wickets}</div>
                  <div className="text-end font-monospace text-muted">{bowl.economy}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Key Stats Card */}
        <div className="col-12 col-lg-5">
          <div className="h-100 bg-dark bg-opacity-40 border border-secondary border-opacity-10 rounded-3 p-4">
            <h6 className="text-white fw-bold mb-3 border-start border-success px-2 border-3 ps-2.5 fs-14">
              Key Stats
            </h6>

            <div className="d-flex flex-column gap-3 fs-13">
              <div className="d-flex justify-content-between align-items-start gap-2 border-bottom border-secondary border-opacity-5 pb-2">
                <span className="text-muted fw-medium">Partnership</span>
                <span className="text-light fw-bold font-monospace">{keyStats.partnership}</span>
              </div>
              <div className="d-flex flex-column gap-1 border-bottom border-secondary border-opacity-5 pb-2">
                <span className="text-muted fw-medium">Last Wicket</span>
                <span className="text-light small lh-14">{keyStats.lastWkt}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-5 pb-2">
                <span className="text-muted fw-medium">Last 10 Overs</span>
                <span className="text-light font-monospace">{keyStats.last10Overs}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted fw-medium">Toss</span>
                <span className="text-light fw-semibold">{keyStats.toss}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Win Probability & Recent Balls */}
      <div className="pt-3 border-top border-secondary border-opacity-10 d-flex flex-column gap-3">
        {/* Win Probability Bar */}
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-6">
            <div className="d-flex align-items-center gap-2">
              <span className="font-monospace fw-bold fs-12 text-light">{match.team1Name} {winProbability.team1}%</span>
              <div className="flex-grow-1 d-flex rounded-pill overflow-hidden h-8px bg-rgba255255255008">
                <div className="transition-width" style={{ width: `${winProbability.team1}%`, backgroundColor: t1Color }}></div>
                <div className="transition-width" style={{ width: `${winProbability.team2}%`, backgroundColor: t2Color }}></div>
              </div>
              <span className="font-monospace fw-bold fs-12 text-light">{winProbability.team2}% {match.team2Name}</span>
            </div>
          </div>

          {/* Recent Balls */}
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-md-end gap-2 flex-wrap">
            <span className="text-light opacity-75 fw-semibold fs-13">Recent:</span>
            <div className="d-flex align-items-center gap-1.5 flex-wrap">
              {["1", "1", "W", "2", "1", "6", "|", "0", "1", "W", "1", "1", "4"].map((b, idx) => {
                if (b === "|") {
                  return <span key={idx} className="text-secondary mx-1 fw-bold">|</span>;
                }

                let ballClass = "ball-recent-normal";
                if (b === "W") {
                  ballClass = "ball-recent-wicket";
                } else if (b === "6" || b === "4") {
                  ballClass = "ball-recent-boundary";
                }

                return (
                  <span
                    key={idx}
                    className={`d-flex align-items-center justify-content-center rounded-circle font-monospace fw-bold w-22px h-22px fs-11 ${ballClass}`}
                  >
                    {b}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Football Live Dashboard (Overview Tab) ───────────────────────────────────
function FootballLiveDashboard({ match }: { match: any }) {
  const summary = match.footballEventsSummary;
  const stats = match.footballStats;

  const renderCard = (color: string) => (
    <span className="w-10px h-14px br-2px display-inline-block vertical-align-middle" />
  );

  return (
    <div className="d-flex flex-column gap-4">
      {/* Match Events Summary */}
      {summary && (
        <div className="card bg-card border border-dark rounded-3 p-4">
          <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">
            Match Events Summary
          </h5>
          <div className="row g-3">
            {/* Goals */}
            <div className="col-12 col-md-6">
              <div className="bg-dark bg-opacity-40 border border-secondary border-opacity-10 rounded-3 p-3">
                <div className="text-muted fw-semibold text-uppercase mb-3 d-flex align-items-center gap-1.5 fs-10 ls-05">
                  <span className="fs-12 font-family-segoeuiemojiapplecoloremojinotocoloremojisans-serif">⚽</span> Goals
                </div>
                {summary.goals.length === 0 ? (
                  <span className="text-muted small">No goals yet</span>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {summary.goals.map((g: any, i: number) => (
                      <div key={i} className="d-flex justify-content-between align-items-center">
                        <span className="text-light fs-13">
                          {g.player}
                          {g.isOwnGoal && <span className="text-danger ms-1 small">(OG)</span>}
                          {g.isPenalty && <span className="text-warning ms-1 small">(P)</span>}
                        </span>
                        <span className="font-monospace text-success fw-bold fs-12">{g.minute}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Cards */}
            <div className="col-12 col-md-6">
              <div className="bg-dark bg-opacity-40 border border-secondary border-opacity-10 rounded-3 p-3">
                <div className="text-muted fw-semibold text-uppercase mb-3 fs-10 ls-05">Cards</div>
                {(summary.yellowCards.length === 0 && summary.redCards.length === 0) ? (
                  <span className="text-muted small">No cards</span>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {summary.yellowCards.map((c: any, i: number) => (
                      <div key={`y-${i}`} className="d-flex justify-content-between align-items-center gap-2">
                        <div className="d-flex align-items-center gap-2">
                          {renderCard("#facc15")}
                          <span className="text-light fs-13">{c.player}</span>
                        </div>
                        <span className="font-monospace text-muted fs-12">{c.minute}</span>
                      </div>
                    ))}
                    {summary.redCards.map((c: any, i: number) => (
                      <div key={`r-${i}`} className="d-flex justify-content-between align-items-center gap-2">
                        <div className="d-flex align-items-center gap-2">
                          {renderCard("#ef4444")}
                          <span className="text-light fs-13">{c.player}</span>
                        </div>
                        <span className="font-monospace text-muted fs-12">{c.minute}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* VAR */}
            {summary.varDecisions.length > 0 && (
              <div className="col-12">
                <div className="bg-dark bg-opacity-40 border border-secondary border-opacity-10 rounded-3 p-3">
                  <div className="text-muted fw-semibold text-uppercase mb-3 fs-10 ls-05">
                    <span className="text-c084fc">▣ VAR Decisions</span>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {summary.varDecisions.map((v: any, i: number) => (
                      <div key={i} className="d-flex justify-content-between align-items-center">
                        <span className="text-light fs-13">{v.decision}</span>
                        <span className="font-monospace fs-12 text-c084fc">{v.minute}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Substitutions & Injury Time */}
            <div className="col-12 col-md-6">
              <div className="bg-dark bg-opacity-40 border border-secondary border-opacity-10 rounded-3 p-3 h-100">
                <div className="text-muted fw-semibold text-uppercase mb-3 fs-10 ls-05">🔄 Substitutions</div>
                <div className="d-flex justify-content-between">
                  <div className="text-center">
                    <div className="text-white fw-bold fs-22 font-space-grotesk">{summary.substitutions.team1Count}</div>
                    <div className="text-muted fs-11">{match.team1Name}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white fw-bold fs-22 font-space-grotesk">{summary.substitutions.team2Count}</div>
                    <div className="text-muted fs-11">{match.team2Name}</div>
                  </div>
                </div>
              </div>
            </div>
            {summary.injuryTime && (
              <div className="col-12 col-md-6">
                <div className="bg-dark bg-opacity-40 border border-secondary border-opacity-10 rounded-3 p-3 h-100">
                  <div className="text-muted fw-semibold text-uppercase mb-3 fs-10 ls-05">⏱ Injury Time</div>
                  <div className="d-flex justify-content-between">
                    <div className="text-center">
                      <div className="fw-bold text-warning font-monospace fs-20">{summary.injuryTime.firstHalf}</div>
                      <div className="text-muted fs-11">1st Half</div>
                    </div>
                    <div className="text-center">
                      <div className="fw-bold text-warning font-monospace fs-20">{summary.injuryTime.secondHalf}</div>
                      <div className="text-muted fs-11">2nd Half</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Match Statistics */}
      {stats && (
        <div className="card bg-card border border-dark rounded-3 p-4">
          <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">
            Match Statistics
          </h5>
          {/* Team headers */}
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-dark">
            <div className="d-flex align-items-center gap-2">
              <img src={match.team1Logo} alt={match.team1Name} width={20} height={20} className="object-fit-contain" />
              <span className="text-white fw-bold fs-12">{match.team1Name}</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="text-white fw-bold fs-12">{match.team2Name}</span>
              <img src={match.team2Logo} alt={match.team2Name} width={20} height={20} className="object-fit-contain" />
            </div>
          </div>
          <div className="d-flex flex-column gap-4">
            {[
              { label: "Ball Possession", t1: `${stats.possession.team1}%`, t2: `${stats.possession.team2}%`, r1: stats.possession.team1, r2: stats.possession.team2 },
              { label: "Total Shots", t1: stats.totalShots.team1, t2: stats.totalShots.team2, r1: stats.totalShots.team1, r2: stats.totalShots.team2 },
              { label: "Shots on Target", t1: stats.shotsOnTarget.team1, t2: stats.shotsOnTarget.team2, r1: stats.shotsOnTarget.team1, r2: stats.shotsOnTarget.team2 },
              { label: "Corner Kicks", t1: stats.corners.team1, t2: stats.corners.team2, r1: stats.corners.team1, r2: stats.corners.team2 },
              { label: "Fouls", t1: stats.fouls.team1, t2: stats.fouls.team2, r1: stats.fouls.team1, r2: stats.fouls.team2 },
              { label: "Offsides", t1: stats.offsides.team1, t2: stats.offsides.team2, r1: stats.offsides.team1, r2: stats.offsides.team2 },
              { label: "Saves", t1: stats.saves.team1, t2: stats.saves.team2, r1: stats.saves.team1, r2: stats.saves.team2 },
            ].map((s, i) => {
              const total = (Number(s.r1) + Number(s.r2)) || 1;
              const pct1 = (Number(s.r1) / total) * 100;
              const pct2 = (Number(s.r2) / total) * 100;
              return (
                <div key={i}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="font-monospace fw-bold text-white fs-13">{s.t1}</span>
                    <span className="text-muted text-uppercase font-monospace fs-10 ls-1">{s.label}</span>
                    <span className="font-monospace fw-bold text-white fs-13">{s.t2}</span>
                  </div>
                  <div className="d-flex align-items-center gap-1 h-6px">
                    <div className="flex-grow-1 d-flex justify-content-end rounded-start overflow-hidden bg-rgba255255255006">
                      <div className="transition-width bg-accent-green" style={getWidthStyle(pct1)} />
                    </div>
                    <div className="bg-secondary rounded-circle w-4px h-4px opacity-30 flex-shrink-0" />
                    <div className="flex-grow-1 rounded-end overflow-hidden bg-rgba255255255006">
                      <div className="transition-width bg-dark-slate" style={getWidthStyle(pct2)} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Football Lineups Tab ─────────────────────────────────────────────────────
function FootballLineupsTab({ match }: { match: any }) {
  const t1 = match.team1Info;
  const t2 = match.team2Info;

  const renderPlayer = (p: any, teamColor: string) => (
    <div key={p.number}
      className="d-flex align-items-center justify-content-between hover-card-effect padding-10px14px border-bottom-1pxsolidrgba255255255004 transition-background015s">
      <div className="d-flex align-items-center gap-3">
        <div className="font-monospace fw-bold d-flex align-items-center justify-content-center rounded-circle w-28px h-28px fs-11 bg-rgba255255255005 text-8a94a6 flex-shrink-0">
          {p.number}
        </div>
        <span className={`${p.substituted ? "text-muted" : "text-light"} fw-semibold fs-13-5`}>
          {p.name}
        </span>
        <span className="text-muted fs-11">{p.position}</span>
      </div>
      <div className="d-flex align-items-center gap-2">
        {p.goals > 0 && (
          <div className="d-flex align-items-center gap-1" title="Goal">
            <span className="fs-13 font-family-segoeuiemojiapplecoloremojinotocoloremojisans-serif">⚽</span>
            {p.goals > 1 && <span className="fw-bold text-white fs-10">{p.goals}</span>}
          </div>
        )}
        {p.isCaptain && (
          <span className="badge px-1 py-0 d-flex align-items-center justify-content-center fw-bold fs-9 h-16px min-width-16px bg-rgba2614061015 text-4ade80 border-1pxsolidrgba261406103">C</span>
        )}
        {p.yellowCard && (
          <div className="d-flex align-items-center justify-content-center" title="Yellow Card">
            <div className="w-9px h-13px br-1px bg-facc15 border-1pxsolidrgba00002"></div>
          </div>
        )}
        {p.redCard && (
          <div className="d-flex align-items-center justify-content-center" title="Red Card">
            <div className="w-9px h-13px br-1px bg-ef4444 border-1pxsolidrgba00002"></div>
          </div>
        )}
        {p.substituted && (
          <i className="bi bi-arrow-left-right text-info ms-1 fs-12" title="Substituted"></i>
        )}
      </div>
    </div>
  );

  return (
    <div className="d-flex flex-column gap-4">
      {/* Formation Banner */}
      <div className="card bg-card border border-dark rounded-3 p-4">
        <h5 className="text-white fw-bold mb-4 border-start border-success border-4 ps-3 fs-18 font-space-grotesk">
          Team Formations
        </h5>
        <div className="row g-3 text-center">
          <div className="col-6">
            <div className="bg-dark bg-opacity-40 border border-secondary border-opacity-10 rounded-3 p-3">
              <img src={match.team1Logo} alt={match.team1Name} width={36} height={36} className="object-fit-contain mb-2" />
              <div className="text-white fw-bold fs-13">{match.team1Name}</div>
              <div className="text-success fw-bold font-monospace mt-1 fs-20 ls-minus-05">{t1.formation}</div>
              <div className="text-muted mt-1 fs-11">Coach: {t1.coach}</div>
            </div>
          </div>
          <div className="col-6">
            <div className="bg-dark bg-opacity-40 border border-secondary border-opacity-10 rounded-3 p-3">
              <img src={match.team2Logo} alt={match.team2Name} width={36} height={36} className="object-fit-contain mb-2" />
              <div className="text-white fw-bold fs-13">{match.team2Name}</div>
              <div className="text-success fw-bold font-monospace mt-1 fs-20 ls-minus-05">{t2.formation}</div>
              <div className="text-muted mt-1 fs-11">Coach: {t2.coach}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Starting XIs */}
      <div className="row g-4">
        {/* Team 1 XI */}
        <div className="col-12 col-md-6">
          <div className="card bg-card border border-dark rounded-3 overflow-hidden">
            <div className="d-flex align-items-center gap-3 p-3 border-bottom border-dark bg-rgba2614061006">
              <img src={match.team1Logo} alt={match.team1Name} width={24} height={24} className="object-fit-contain" />
              <h6 className="text-white fw-extrabold m-0 fs-14 font-space-grotesk">{match.team1Name}</h6>
              <span className="ms-auto text-success font-monospace fs-12">{t1.formation}</span>
            </div>
            <div className="px-1 py-1">
              <div className="text-muted fw-semibold text-uppercase px-3 py-2 fs-9 ls-05">Starting XI</div>
              {t1.startingXI.map((p: any) => renderPlayer(p, "#22c55e"))}
              <div className="text-muted fw-semibold text-uppercase px-3 pt-3 pb-1 fs-9 ls-05 border-top-1pxsolidrgba255255255005 margin-top-8px">Bench</div>
              {t1.bench.map((p: any) => renderPlayer(p, "#8a94a6"))}
            </div>
          </div>
        </div>
        {/* Team 2 XI */}
        <div className="col-12 col-md-6">
          <div className="card bg-card border border-dark rounded-3 overflow-hidden">
            <div className="d-flex align-items-center gap-3 p-3 border-bottom border-dark bg-rgba255255255002">
              <img src={match.team2Logo} alt={match.team2Name} width={24} height={24} className="object-fit-contain" />
              <h6 className="text-white fw-extrabold m-0 fs-14 font-space-grotesk">{match.team2Name}</h6>
              <span className="ms-auto text-muted font-monospace fs-12">{t2.formation}</span>
            </div>
            <div className="px-1 py-1">
              <div className="text-muted fw-semibold text-uppercase px-3 py-2 fs-9 ls-05">Starting XI</div>
              {t2.startingXI.map((p: any) => renderPlayer(p, "#8a94a6"))}
              <div className="text-muted fw-semibold text-uppercase px-3 pt-3 pb-1 fs-9 ls-05 border-top-1pxsolidrgba255255255005 margin-top-8px">Bench</div>
              {t2.bench.map((p: any) => renderPlayer(p, "#8a94a6"))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Football Timeline ────────────────────────────────────────────────────────
function FootballTimeline({ match }: { match: any }) {
  const timeline: any[] = match.footballTimeline || [];
  const team1Name: string = match.team1Name;
  const team2Name: string = match.team2Name;

  const getEventConfig = (type: string) => {
    switch (type) {
      case "goal": return { icon: <span className="fs-12 font-family-segoeuiemojiapplecoloremojinotocoloremojisans-serif lh-1">⚽</span>, label: "Goal", border: "rgba(26,140,61,0.3)", bg: "rgba(26,140,61,0.06)", dotBg: "#22c55e" };
      case "yellow_card": return { icon: <div className="w-9px h-13px br-1px bg-facc15 border-1pxsolidrgba00002"></div>, label: "Yellow Card", border: "rgba(250,204,21,0.25)", bg: "rgba(250,204,21,0.04)", dotBg: "#facc15" };
      case "red_card": return { icon: <div className="w-9px h-13px br-1px bg-ef4444 border-1pxsolidrgba00002"></div>, label: "Red Card", border: "rgba(239,68,68,0.3)", bg: "rgba(239,68,68,0.06)", dotBg: "#ef4444" };
      case "substitution": return { icon: <i className="bi bi-arrow-left-right text-info fs-11"></i>, label: "Substitution", border: "rgba(34,211,238,0.2)", bg: "rgba(34,211,238,0.03)", dotBg: "#22d3ee" };
      case "penalty": return { icon: <i className="bi bi-bullseye text-warning fs-12"></i>, label: "Penalty", border: "rgba(249,115,22,0.3)", bg: "rgba(249,115,22,0.06)", dotBg: "#fb923c" };
      case "var": return { icon: <i className="bi bi-display fs-11"></i>, label: "VAR", border: "rgba(168,85,247,0.3)", bg: "rgba(168,85,247,0.06)", dotBg: "#c084fc" };
      case "own_goal": return { icon: <span className="fs-12 font-family-segoeuiemojiapplecoloremojinotocoloremojisans-serif lh-1">⚽</span>, label: "Own Goal", border: "rgba(239,68,68,0.25)", bg: "rgba(239,68,68,0.04)", dotBg: "#f87171" };
      case "half_time":
      case "full_time": return { icon: <i className="bi bi-stopwatch text-info fs-12"></i>, label: type === "full_time" ? "Full Time" : "Half Time", border: "rgba(52,152,219,0.25)", bg: "rgba(52,152,219,0.05)", dotBg: "#3498db" };
      case "injury_time": return { icon: <i className="bi bi-plus fs-14"></i>, label: "Injury Time", border: "rgba(255,255,255,0.06)", bg: "transparent", dotBg: "#4b5563" };
      default: return { icon: <i className="bi bi-circle-fill text-muted fs-6"></i>, label: type, border: "rgba(255,255,255,0.06)", bg: "transparent", dotBg: "#4b5563" };
    }
  };

  return (
    <div className="position-relative ps-4 py-2 border-start border-secondary border-opacity-15 border-2 ms-2 d-flex flex-column gap-3">
      {timeline.map((e, i) => {
        const cfg = getEventConfig(e.type);
        const teamName = e.team === 1 ? team1Name : e.team === 2 ? team2Name : null;
        const isHighlight = ["goal", "red_card", "penalty", "var", "full_time"].includes(e.type);

        return (
          <div key={i} className="position-relative">
            {/* Timeline dot */}
            <span className="position-absolute d-flex align-items-center justify-content-center rounded-circle timeline-dot-v2" style={{ border: `2px solid ${cfg.dotBg}` }}>
              {e.type === "var" ? (
                <span className="fs-8 font-weight-700 text-c084fc">VAR</span>
              ) : (
                <span>{cfg.icon}</span>
              )}
            </span>

            {/* Event card */}
            <div className="rounded-3 p-3 timeline-card-base-v2" style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, boxShadow: isHighlight ? `0 4px 15px ${cfg.dotBg}18` : "none" }}>
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="font-monospace fw-bold rounded text-success fs-10 bg-rgba2614061008 border-1pxsolidrgba261406102 padding-2px7px">
                    {e.minute}
                  </span>
                  <span className="text-white fw-bold fs-14">
                    {e.type === "substitution" ? `${e.player} ↑  ${e.playerOut} ↓` : e.player || cfg.label}
                  </span>
                </div>
                {teamName && (
                  <span className="badge bg-dark border border-secondary border-opacity-10 text-muted font-monospace px-2 py-1 fs-9">
                    {teamName}
                  </span>
                )}
              </div>
              {e.detail && (
                <div className="text-muted small fs-12-5 lh-15">{e.detail}</div>
              )}
              {e.varDecision && (
                <div className="mt-1">
                  <span className="fs-11 br-4px font-weight-700 text-c084fc bg-rgba16885247012 border-1pxsolidrgba1688524703 padding-2px8px">
                    ✓ {e.varDecision}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
function ScorecardTab({ match }: { match: any }) {
  const [activeInnings, setActiveInnings] = React.useState<1 | 2>(2);


  const innings1 = {
    team: match.team2Name,
    score: "185/7", overs: "20.0", rr: "9.25",
    batters: [
      { name: "Virat Kohli", dismissed: "c Gaikwad b Jadeja", r: 68, b: 44, f: 6, s: 3, sr: "154.54", out: true },
      { name: "Faf du Plessis", dismissed: "b Pathirana", r: 12, b: 9, f: 1, s: 1, sr: "133.33", out: true },
      { name: "Rajat Patidar", dismissed: "c Dhoni b Dube", r: 34, b: 22, f: 3, s: 2, sr: "154.54", out: true },
      { name: "Glenn Maxwell", dismissed: "c Jadeja b Theekshana", r: 27, b: 18, f: 2, s: 2, sr: "150.00", out: true },
      { name: "D Padikkal", dismissed: "run out (Gaikwad)", r: 8, b: 6, f: 1, s: 0, sr: "133.33", out: true },
      { name: "Shahbaz Ahmed", dismissed: "c MS Dhoni b Santner", r: 11, b: 9, f: 1, s: 0, sr: "122.22", out: true },
      { name: "Dinesh Karthik * ", dismissed: "not out", r: 18, b: 11, f: 2, s: 1, sr: "163.63", out: false },
      { name: "Mohammed Siraj *", dismissed: "not out", r: 5, b: 3, f: 0, s: 0, sr: "166.67", out: false },
    ],
    yetToBat: ["Karn Sharma", "Yash Dayal", "Reece Topley"],
    extras: { total: 2, b: 0, lb: 0, w: 2, nb: 0, p: 0 },
    bowlers: [
      { name: "M Santner", o: "4.0", m: 0, r: 38, w: 1, nb: 0, wd: 0, eco: "9.50" },
      { name: "R Jadeja", o: "4.0", m: 0, r: 28, w: 2, nb: 0, wd: 1, eco: "7.00" },
      { name: "M Pathirana", o: "4.0", m: 0, r: 42, w: 1, nb: 0, wd: 0, eco: "10.50" },
      { name: "S Dube", o: "3.0", m: 0, r: 31, w: 1, nb: 0, wd: 0, eco: "10.33" },
      { name: "M Theekshana", o: "4.0", m: 0, r: 40, w: 1, nb: 0, wd: 1, eco: "10.00" },
      { name: "D Conway", o: "1.0", m: 0, r: 6, w: 0, nb: 0, wd: 0, eco: "6.00" },
    ],
    fow: [
      { batter: "Faf du Plessis", score: "18-1", over: "2.4" },
      { batter: "Rajat Patidar", score: "67-2", over: "8.2" },
      { batter: "Glenn Maxwell", score: "112-3", over: "13.5" },
      { batter: "D Padikkal", score: "126-4", over: "15.1" },
      { batter: "Virat Kohli", score: "145-5", over: "16.3" },
      { batter: "Shahbaz Ahmed", score: "162-6", over: "18.1" },
    ],
    powerplay: { label: "Mandatory", overs: "0.1 “ 10", runs: 47 },
    partnerships: [
      { b1: "Faf du Plessis 12(9)", total: "18(17)", b2: "Virat Kohli 11(8)" },
      { b1: "Rajat Patidar 34(22)", total: "49(26)", b2: "Virat Kohli 33(21)" },
      { b1: "Glenn Maxwell 27(18)", total: "45(27)", b2: "Virat Kohli 24(15)" },
      { b1: "D Padikkal 8(6)", total: "14(9)", b2: "Virat Kohli 8(6)" },
      { b1: "Shahbaz Ahmed 11(9)", total: "19(13)", b2: "Virat Kohli 12(8)" },
      { b1: "Shahbaz Ahmed 0(0)", total: "17(9)", b2: "DK 11(7)" },
      { b1: "Siraj 5(3)", total: "23(11)", b2: "DK 18(11)" },
    ],
  };

  const innings2 = {
    team: match.team1Name,
    score: match.team1Score, overs: match.team1Overs || "19.1", rr: "9.08",
    batters: [
      { name: "Ruturaj Gaikwad (c)", dismissed: "c Maxwell b Siraj", r: 62, b: 41, f: 7, s: 2, sr: "151.21", out: true },
      { name: "Devon Conway", dismissed: "lbw b Siraj", r: 24, b: 18, f: 3, s: 1, sr: "133.33", out: true },
      { name: "Ajinkya Rahane", dismissed: "c Kohli b Maxwell", r: 19, b: 14, f: 2, s: 0, sr: "135.71", out: true },
      { name: "Mitchell Santner", dismissed: "c Kohli b Siraj", r: 14, b: 9, f: 1, s: 1, sr: "155.55", out: true },
      { name: "Daryl Mitchell", dismissed: "b Yash Dayal", r: 8, b: 7, f: 0, s: 1, sr: "114.28", out: true },
      { name: "Shivam Dube *", dismissed: "not out", r: 45, b: 22, f: 3, s: 3, sr: "204.54", out: false },
      { name: "Ravindra Jadeja *", dismissed: "not out", r: 12, b: 8, f: 1, s: 0, sr: "150.00", out: false },
    ],
    yetToBat: ["MS Dhoni ", "M Theekshana", "M Pathirana", "T Natarajan"],
    extras: { total: 5, b: 0, lb: 1, w: 3, nb: 1, p: 0 },
    bowlers: [
      { name: "Mohammed Siraj", o: "4.0", m: 0, r: 32, w: 3, nb: 0, wd: 1, eco: "8.00" },
      { name: "Yash Dayal", o: "4.0", m: 0, r: 42, w: 1, nb: 1, wd: 1, eco: "10.50" },
      { name: "Glenn Maxwell", o: "4.0", m: 0, r: 34, w: 1, nb: 0, wd: 0, eco: "8.50" },
      { name: "Shahbaz Ahmed", o: "4.1", m: 0, r: 38, w: 0, nb: 0, wd: 1, eco: "9.12" },
      { name: "Karn Sharma", o: "3.0", m: 0, r: 23, w: 0, nb: 0, wd: 0, eco: "7.66" },
    ],
    fow: [
      { batter: "Devon Conway", score: "47-1", over: "5.3" },
      { batter: "Ajinkya Rahane", score: "84-2", over: "10.2" },
      { batter: "Ruturaj Gaikwad", score: "108-3", over: "13.1" },
      { batter: "Daryl Mitchell", score: "121-4", over: "15.0" },
      { batter: "Mitchell Santner", score: "159-5", over: "18.3" },
    ],
    powerplay: { label: "Mandatory", overs: "0.1“ 10", runs: 71 },
    partnerships: [
      { b1: "Gaikwad 28(19)", total: "47(26)", b2: "Conway 24(18)" },
      { b1: "Gaikwad 34(22)", total: "37(22)", b2: "Rahane 19(14)" },
      { b1: "Gaikwad 0(0)", total: "24(15)", b2: "Santner 14(9)" },
      { b1: "Dube 13(7)", total: "13(8)", b2: "Mitchell 8(7)" },
      { b1: "Dube 32(15)", total: "38(21)", b2: "Jadeja 12(8)" },
    ],
  };

  const d = activeInnings === 1 ? innings1 : innings2;






  const teal = "#4ade80";
  const mutedGray = "#8a94a6";
  const rowBorder = "1px solid rgba(255,255,255,0.05)";

  return (
    <div className="d-flex flex-column gap-3">


      <div className="d-flex gap-2 flex-wrap">
        {([1, 2] as const).map((inn) => {
          const label = inn === 1
            ? `${innings1.team.split(" ").pop()} (1st Inn)`
            : `${innings2.team.split(" ").pop()} (2nd Inn)`;
          const active = activeInnings === inn;
          return (
            <button
              key={inn}
              onClick={() => setActiveInnings(inn)}
              className={`subtab-base ${active ? "subtab-active" : "subtab-inactive"}`}
            >
              {label}
            </button>
          );
        })}
      </div>


      <div
        className="d-flex align-items-center justify-content-between px-4 py-3 rounded-3 background-linear-gradient135deg1a8c3d015703a100"
      >
        <div className="text-white fw-bold fs-16 font-space-grotesk">
          {d.team}
        </div>
        <div className="text-end">
          <div className="text-white fw-bold font-monospace fs-20 ls-minus-05">
            {d.score} <span className="fs-13 opacity-80">({d.overs} Ov)</span>
          </div>
          <div className="fs-11 text-rgba25525525507">RR: {d.rr}</div>
        </div>
      </div>


      <div className="cricket-score-card-bg">
        {/* Header Row */}
        <div
          className="d-grid fw-semibold text-uppercase custom-section-head grid-26-28"
        >
          <div>Batter</div>
          <div />
          <div className="text-end">R</div>
          <div className="text-end">B</div>
          <div className="text-end">4s</div>
          <div className="text-end">6s</div>
          <div className="text-end">SR</div>
        </div>

        {/* Batter Rows */}
        {d.batters.map((b: any, i: number) => (
          <div
            key={i}
            className="d-grid align-items-start px-3 py-2 fs-13 grid-template-columns-26fr28fr08fr08fr07fr07fr11fr"
          >
            {/* Name */}
            <div>
              <span className={`fw-600 ${b.out ? "text-cbd5e1" : "text-teal"}`}>{b.name}</span>
              {!b.out && (
                <span
                  className="ms-2 fs-9 br-4px ls-03 font-weight-700 padding-2px6px bg-rgba74222128015 border-1pxsolidrgba7422212803"
                >
                  Not Out
                </span>
              )}
            </div>
            {/* Dismissal */}
            <div className="fs-12 lh-14">{b.dismissed}</div>
            {/* Stats */}
            <div className="text-end font-monospace text-f1f5f9 font-weight-700">{b.r}</div>
            <div className="text-end font-monospace text-muted-gray">{b.b}</div>
            <div className="text-end font-monospace text-muted-gray">{b.f}</div>
            <div className="text-end font-monospace text-muted-gray">{b.s}</div>
            <div className="text-end font-monospace text-muted-gray">{b.sr}</div>

          </div>
        ))}

        {/* Extras */}
        <div
          className="d-flex align-items-center justify-content-between px-3 py-2 fs-13"
        >
          <span className="text-94a3b8 font-weight-600">
            Extras&nbsp;
            <span className="fs-11-5 font-weight-400">
              (b {d.extras.b}, lb {d.extras.lb}, w {d.extras.w}, nb {d.extras.nb}, p {d.extras.p})
            </span>
          </span>
          <span className="font-monospace text-f1f5f9 font-weight-700">{d.extras.total}</span>
        </div>

        {/* Total */}
        <div
          className="d-flex align-items-center justify-content-between px-3 py-2 fs-13-5"
        >
          <span className="text-f1f5f9 font-weight-700">Total</span>
          <span className="font-monospace text-f1f5f9 font-weight-700">
            {d.score} ({d.overs} Overs, RR: {d.rr})
          </span>
        </div>

        {/* Yet to Bat */}
        <div className="px-3 py-2 fs-13">
          <span className="text-94a3b8 font-weight-600">Yet to Bat&nbsp;&nbsp;</span>
          <span className="text-teal">
            {d.yetToBat.join(", ")}
          </span>
        </div>
      </div>

      {/* â”€â”€ Bowling Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="cricket-score-card-bg">
        <div
          className="d-grid fw-semibold text-uppercase custom-section-head grid-22-08"
        >
          <div>Bowler</div>
          <div className="text-end">O</div>
          <div className="text-end">M</div>
          <div className="text-end">R</div>
          <div className="text-end">W</div>
          <div className="text-end">NB</div>
          <div className="text-end">WD</div>
          <div className="text-end">ECO</div>
        </div>

        {d.bowlers.map((bw: any, i: number) => (
          <div
            key={i}
            className="d-grid align-items-center px-3 py-2 fs-13 grid-template-columns-22fr08fr07fr08fr07fr08fr08fr1fr"
          >
            <div className="text-teal fw-600">{bw.name}</div>
            <div className="text-end font-monospace text-muted-gray">{bw.o}</div>
            <div className="text-end font-monospace text-muted-gray">{bw.m}</div>
            <div className="text-end font-monospace text-muted-gray">{bw.r}</div>
            <div className={`text-end font-monospace fw-bold ${bw.w > 0 ? "text-teal" : "text-muted-gray"}`}>{bw.w}</div>
            <div className="text-end font-monospace text-muted-gray">{bw.nb}</div>
            <div className="text-end font-monospace text-muted-gray">{bw.wd}</div>
            <div
              className={`text-end font-monospace ${parseFloat(bw.eco) > 10 ? "text-danger" : "text-muted-gray"}`}
            >
              {bw.eco}
            </div>

          </div>
        ))}
      </div>

      {/* â”€â”€ Fall of Wickets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="cricket-score-card-bg">
        <div
          className="d-grid fw-semibold text-uppercase custom-section-head grid-2-1-1"
        >
          <div>Fall of Wickets</div>
          <div className="text-center">Score</div>
          <div className="text-end">Over</div>
        </div>
        {d.fow.map((f: any, i: number) => (
          <div
            key={i}
            className="d-grid align-items-center px-3 py-2 fs-13 grid-template-columns-2fr1fr1fr"
          >
            <div className="text-teal fw-600">{f.batter}</div>
            <div className="text-center font-monospace text-f1f5f9">{f.score}</div>
            <div className="text-end font-monospace text-muted-gray">{f.over}</div>
          </div>
        ))}
      </div>

      {/* â”€â”€ Powerplays â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="cricket-score-card-bg">
        <div
          className="d-grid fw-semibold text-uppercase custom-section-head grid-1-1-1"
        >
          <div>Powerplays</div>
          <div className="text-center">Overs</div>
          <div className="text-end">Runs</div>
        </div>
        <div
          className="d-grid align-items-center px-3 py-2 fs-13 grid-template-columns-1fr1fr1fr"
        >
          <div className="text-cbd5e1">{d.powerplay.label}</div>
          <div className="text-center font-monospace text-muted-gray">{d.powerplay.overs}</div>
          <div className="text-end font-monospace text-f1f5f9 font-weight-700">{d.powerplay.runs}</div>
        </div>
      </div>

      {/* â”€â”€ Partnerships â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="cricket-score-card-bg">
        <div className="cricket-scorecard-section-head">Partnerships</div>
        {d.partnerships.map((p: any, i: number) => (
          <div
            key={i}
            className="d-grid align-items-center px-3 py-2 fs-13 grid-template-columns-1frauto1fr gap-12px"
          >
            <div className="text-teal">{p.b1}</div>
            <div
              className="text-center font-monospace fw-bold br-6px text-f1f5f9 bg-rgba255255255005 border-1pxsolidrgba255255255008 padding-2px10px white-space-nowrap"
            >
              {p.total}
            </div>
            <div className="text-end text-teal">{p.b2}</div>
          </div>
        ))}
      </div>


      <div className="custom-card overflow-hidden">
        <div className="cricket-scorecard-section-head">Info</div>
        {[
          { label: "Match", val: `${match.team2Name.split(" ").pop()} vs ${match.team1Name.split(" ").pop()} “ ${match.competitionName}` },
          { label: "Series", val: match.competitionName },
          { label: "Date", val: "Today" },
          { label: "Venue", val: match.venue },
          { label: "Toss", val: `${match.team2Name} won the toss and opted to bat` },
        ].map((row, i) => (
          <div
            key={i}
            className="d-flex px-3 py-2 fs-13 gap-16px"
          >
            <div className="text-muted-gray fw-600 min-w-80px">{row.label}</div>
            <div className="text-cbd5e1">{row.val}</div>
          </div>
        ))}
      </div>

    </div>
  );
}

