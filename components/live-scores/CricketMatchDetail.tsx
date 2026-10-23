"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import StatusBadge from "./StatusBadge";
import { useAds } from "@/components/AdContext";
import type { LiveScoreMatchDetail } from "@/types";

type ProviderRecord = Record<string, any>;

type CricketMatchDetailProps = {
  match: LiveScoreMatchDetail;
  providerData: ProviderRecord;
  statistics: ProviderRecord | null;
  commentary: ProviderRecord | null;
  activeTab: "overview" | "scorecard" | "statistics" | "lineups" | "timeline" | "commentary";
  onTabChange: (tab: CricketMatchDetailProps["activeTab"]) => void;
};

const text = (value: unknown, fallback = "—") => {
  if (value === undefined || value === null || String(value).trim() === "") return fallback;
  return String(value);
};

const number = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const record = (value: unknown): ProviderRecord => (value && typeof value === "object" ? value as ProviderRecord : {});

const array = (value: unknown): ProviderRecord[] => Array.isArray(value) ? value as ProviderRecord[] : [];

const historyRows = (...values: unknown[]) => {
  for (const value of values) {
    const directRows = array(value);
    if (directRows.length) return directRows;
    const nested = record(value);
    const nestedRows = array(nested.matches || nested.items || nested.results || nested.history);
    if (nestedRows.length) return nestedRows;
  }
  return [];
};

const recentBallTokens = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (item && typeof item === "object") {
        const row = item as ProviderRecord;
        const isWicket = Boolean(row.wicket || row.is_wicket || row.dismissal || String(row.event || "").toLowerCase().includes("wicket"));
        return [isWicket ? "W" : text(row.runs ?? row.run ?? row.score, "0")];
      }
      return [text(item, "0")];
    });
  }
  if (typeof value !== "string" && typeof value !== "number") return [];
  return String(value)
    .split(/(\|)/)
    .flatMap((part) => part === "|" ? [part] : part.split(/[,;\s]+/))
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(-18);
};

const recentCommentaryTokens = (value: unknown): string[] => {
  const rows = array(value).filter((row) => String(row.event || "ball").toLowerCase() === "ball");
  const recent = rows.slice(-12);
  return recent.flatMap((row, index) => {
    const previous = recent[index - 1];
    const separator = previous && text(previous.over, "") !== text(row.over, "") ? ["|"] : [];
    const commentary = String(row.commentary || row.text || "").toLowerCase();
    const wicket = Boolean(row.wicket || row.is_wicket || row.dismissal || (commentary.includes("wicket") && !commentary.includes("no wicket")) || (commentary.includes(" out") && !commentary.includes("not out")));
    return [...separator, wicket ? "W" : text(row.run ?? row.score, "0")];
  });
};

const formatDate = (value: unknown) => {
  const raw = text(value, "");
  if (!raw) return "—";
  const date = new Date(raw.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const getInfo = (data: ProviderRecord) => record(data.match_info || data);

const getInnings = (data: ProviderRecord) => array(record(data.scorecard).innings);

const getLatestInning = (data: ProviderRecord) => {
  const innings = getInnings(data);
  const info = getInfo(data);
  const latestNumber = number(info.latest_inning_number, 0);
  return innings.find((inning) => number(inning.number) === latestNumber) || innings[innings.length - 1] || {};
};

const getTeam = (info: ProviderRecord, key: "teama" | "teamb") => record(info[key]);

const teamId = (info: ProviderRecord, key: "teama" | "teamb") => text(getTeam(info, key).team_id, "");

const getPlaying11 = (data: ProviderRecord, key: "teama" | "teamb") => array(record(data["match-playing11"])[key]?.squads);

const getCommentaryRows = (data: ProviderRecord | null) => {
  if (!data) return [];
  return array(data.commentaries || data.commentary || data.items || data.data);
};

const teamNameForId = (info: ProviderRecord, id: unknown) => {
  const value = text(id, "");
  if (value && value === teamId(info, "teama")) return text(getTeam(info, "teama").name);
  if (value && value === teamId(info, "teamb")) return text(getTeam(info, "teamb").name);
  return "Team";
};

function TeamLogo({ src, name, size = 64 }: { src: string; name: string; size?: number }) {
  return (
    <div className="cricket-team-logo rounded-circle d-flex align-items-center justify-content-center">
      <Image src={src || "/assets/imgs/teams/team-placeholder.svg"} alt={name} width={size} height={size} className="object-fit-contain" />
    </div>
  );
}

function MatchSponsorBanner() {
  const { getAdByType } = useAds();
  const ad = getAdByType("Match Page Advertisement");
  if (!ad?.image) return null;
  return (
    <a
      href={ad.redirectUrl || "#"}
      target="_blank"
      rel="noreferrer"
      className="position-relative overflow-hidden rounded-4 d-block mb-4 shadow-sm"
      style={{ height: "200px", border: "1px solid #eae5dc", background: "#f8f6f0" }}
      aria-label={ad.title || "Match sponsor"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ad.image} alt={ad.title || "Match sponsor"} className="w-100 h-100 object-fit-cover" />
      <span
        className="badge rounded-pill fw-bold position-absolute top-0 end-0 m-3 px-2.5 py-1"
        style={{ background: "#ffcc00", color: "#1c1f22", fontSize: "10px", letterSpacing: "0.04em" }}
      >
        SPONSOR
      </span>
    </a>
  );
}

function CricketTabs({ activeTab, onTabChange }: Pick<CricketMatchDetailProps, "activeTab" | "onTabChange">) {
  const tabs: Array<{ id: CricketMatchDetailProps["activeTab"]; label: string; icon: string }> = [
    { id: "overview", label: "Overview", icon: "bi-info-square" },
    { id: "scorecard", label: "Scorecard", icon: "bi-clipboard-data" },
    { id: "statistics", label: "Statistics", icon: "bi-bar-chart" },
    { id: "lineups", label: "Lineups", icon: "bi-people" },
    { id: "timeline", label: "Timeline", icon: "bi-calendar-event" },
    { id: "commentary", label: "Commentary", icon: "bi-chat-left-text" },
  ];

  return (
    <div className="d-flex flex-wrap gap-2 mb-4 pb-3 border-bottom" style={{ borderColor: "#eae5dc" }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className="btn rounded-pill px-3.5 py-2 fw-bold text-uppercase d-inline-flex align-items-center gap-2 transition-all shadow-none"
            style={{
              fontSize: "12px",
              letterSpacing: "0.03em",
              backgroundColor: isActive ? "#FFCC00" : "#ffffff",
              color: "#1C1F22",
              border: isActive ? "1px solid #FFCC00" : "1px solid #eae5dc",
              fontWeight: isActive ? 700 : 600,
            }}
            onClick={() => onTabChange(tab.id)}
          >
            <i className={`bi ${tab.icon}`} style={{ fontSize: "12px", color: isActive ? "#1C1F22" : "#64748b" }} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Kept for backwards compatibility with older provider payloads.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ScorecardTable({ inning, info }: { inning: ProviderRecord; info: ProviderRecord }) {
  const batsmen = array(inning.batsmen);
  const bowlers = array(inning.bowlers);
  const partnership = record(inning.current_partnership);
  const lastWicket = record(inning.last_wicket);
  const extras = record(inning.extra_runs);
  const fallOfWickets = array(inning.fows);
  const partnerships = array(inning.partnerships || inning.partnership);

  return (
    <section className="card rounded-4 p-3 p-md-4 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-3 border-bottom" style={{ borderColor: "#EAE5DC" }}>
        <div>
          <div className="small text-uppercase fw-bold" style={{ color: "#4A90E2", letterSpacing: "0.08em" }}>{text(inning.name, "Current innings")}</div>
          <h2 className="h5 fw-bold mb-0 font-space-grotesk" style={{ color: "#1C1F22" }}>{text(inning.scores_full, text(inning.scores))}</h2>
        </div>
        <div className="d-flex gap-2 flex-wrap justify-content-end">
          <span className="badge rounded-pill fw-semibold" style={{ background: "#FAF6EF", border: "1px solid #EAE5DC", color: "#1C1F22" }}>RRR: {text(inning.equations?.runrate, "—")}</span>
          <span className="badge rounded-pill fw-semibold" style={{ background: "#FAF6EF", border: "1px solid #EAE5DC", color: "#1C1F22" }}>{text(inning.equations?.overs, text(inning.overs, "—"))} overs</span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <h3 className="h6 fw-bold mb-3 font-space-grotesk" style={{ color: "#1C1F22" }}>Batter</h3>
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-4 cricket-score-table" style={{ color: "#1C1F22" }}>
              <thead style={{ borderBottom: "1px solid #EAE5DC", color: "#5C646D", fontSize: "11px" }}><tr><th>BATTER</th><th>R</th><th>B</th><th>4S</th><th>6S</th><th>SR</th></tr></thead>
              <tbody>
                {batsmen.map((batsman, index) => <tr key={`${batsman.batsman_id || batsman.name || "batsman"}-${index}`} style={{ borderBottom: "1px solid #F1ECE4" }}>
                  <td className="fw-semibold" style={{ color: "#1C1F22" }}>{text(batsman.name)}{String(batsman.batting).toLowerCase() === "true" && <span className="ms-1" style={{ color: "#FFCC00" }}>*</span>}</td>
                  <td>{text(batsman.runs, "0")}</td><td>{text(batsman.balls_faced, "0")}</td><td>{text(batsman.fours, "0")}</td><td>{text(batsman.sixes, "0")}</td><td>{text(batsman.strike_rate, "0.00")}</td>
                </tr>)}
                {!batsmen.length && <tr><td colSpan={6} className="text-muted">No batting rows supplied by provider.</td></tr>}
              </tbody>
            </table>
          </div>

          <h3 className="h6 fw-bold mb-3 font-space-grotesk" style={{ color: "#1C1F22" }}>Bowler</h3>
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0 cricket-score-table" style={{ color: "#1C1F22" }}>
              <thead style={{ borderBottom: "1px solid #EAE5DC", color: "#5C646D", fontSize: "11px" }}><tr><th>BOWLER</th><th>O</th><th>M</th><th>R</th><th>W</th><th>ECO</th></tr></thead>
              <tbody>
                {bowlers.map((bowler, index) => <tr key={`${bowler.bowler_id || bowler.name || "bowler"}-${index}`} style={{ borderBottom: "1px solid #F1ECE4" }}>
                  <td className="fw-semibold" style={{ color: "#1C1F22" }}>{text(bowler.name)}{String(bowler.bowling).toLowerCase() === "true" && <span className="ms-1" style={{ color: "#FFCC00" }}>*</span>}</td>
                  <td>{text(bowler.overs, "0")}</td><td>{text(bowler.maidens, "0")}</td><td>{text(bowler.runs_conceded, "0")}</td><td className="fw-bold" style={{ color: "#4A90E2" }}>{text(bowler.wickets, "0")}</td><td>{text(bowler.econ, "0.00")}</td>
                </tr>)}
                {!bowlers.length && <tr><td colSpan={6} className="text-muted">No bowling rows supplied by provider.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card rounded-3 p-3 h-100 shadow-sm" style={{ background: "#FAF6EF", border: "1px solid #EAE5DC" }}>
            <h3 className="h6 fw-bold border-start border-3 ps-2 mb-3 font-space-grotesk" style={{ borderColor: "#FFCC00", color: "#1C1F22" }}>Key Stats</h3>
            <div className="cricket-key-stat"><span>Partnership</span><strong style={{ color: "#1C1F22" }}>{text(partnership.runs, "0")} ({text(partnership.balls, "0")})</strong></div>
            <div className="cricket-key-stat"><span>Last wicket</span><strong style={{ color: "#1C1F22" }}>{lastWicket.name ? `${text(lastWicket.name)} · ${text(lastWicket.runs, "0")} (${text(lastWicket.balls, "0")})` : "—"}</strong></div>
            <div className="cricket-key-stat"><span>Extras</span><strong style={{ color: "#1C1F22" }}>{text(extras.total, "0")}</strong></div>
            <div className="cricket-key-stat"><span>Toss</span><strong style={{ color: "#1C1F22" }}>{text(record(info.toss).text)}</strong></div>
            <div className="cricket-key-stat"><span>Batting team</span><strong style={{ color: "#1C1F22" }}>{teamNameForId(info, inning.batting_team_id)}</strong></div>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-2">
        <div className="col-lg-4">
          <div className="cricket-sub-panel h-100"><h3>Extras</h3><div className="d-flex justify-content-between"><span>Wides</span><strong>{text(extras.wides, "0")}</strong></div><div className="d-flex justify-content-between"><span>No balls</span><strong>{text(extras.noballs, "0")}</strong></div><div className="d-flex justify-content-between"><span>Byes / Leg byes</span><strong>{text(extras.byes, "0")} / {text(extras.legbyes, "0")}</strong></div><div className="d-flex justify-content-between text-success"><span>Total extras</span><strong>{text(extras.total, "0")}</strong></div></div>
        </div>
        <div className="col-lg-4">
          <div className="cricket-sub-panel h-100"><h3>Fall of wickets</h3>{fallOfWickets.length ? fallOfWickets.slice(-5).map((wicket, index) => <div className="d-flex justify-content-between" key={`${wicket.batsman_id || wicket.name}-${index}`}><span>{text(wicket.name)}</span><strong>{text(wicket.score_at_dismissal, "—")} ({text(wicket.overs_at_dismissal, "—")})</strong></div>) : <span className="text-muted">No wickets recorded.</span>}</div>
        </div>
        <div className="col-lg-4">
          <div className="cricket-sub-panel h-100"><h3>Partnerships</h3>{partnerships.length ? partnerships.slice(-4).map((partnership, index) => <div className="d-flex justify-content-between" key={index}><span>Partnership {text(partnership.order, String(index + 1))}</span><strong>{text(partnership.runs, "0")} ({text(partnership.balls_faced, "0")})</strong></div>) : <span className="text-muted">No partnerships supplied.</span>}</div>
        </div>
      </div>
    </section>
  );
}

function DetailedScorecard({ inning, info, match }: { inning: ProviderRecord; info: ProviderRecord; match: LiveScoreMatchDetail }) {
  const batsmen = array(inning.batsmen);
  const bowlers = array(inning.bowlers);
  const extras = record(inning.extra_runs);
  const fallOfWickets = array(inning.fows || inning.fall_of_wickets);
  const partnershipSource = inning.partnerships ?? inning.partnership;
  const partnerships = Array.isArray(partnershipSource) ? partnershipSource as ProviderRecord[] : partnershipSource && typeof partnershipSource === "object" ? [partnershipSource as ProviderRecord] : [];
  const powerplaySource = inning.powerplay ?? inning.powerplays;
  const powerplay = Array.isArray(powerplaySource) ? powerplaySource as ProviderRecord[] : powerplaySource && typeof powerplaySource === "object" ? [powerplaySource as ProviderRecord] : [];
  const didNotBat = array(inning.did_not_bat || inning.did_not_bat_players);
  const review = record(inning.review);
  const equation = record(inning.equations);
  const battingTeam = teamNameForId(info, inning.batting_team_id);
  const score = text(inning.scores_full, text(inning.scores, "-")).replace(/\s*\([^)]*\)\s*$/, "");
  const overs = text(equation.overs, text(inning.overs, "-"));
  const valueFrom = (row: ProviderRecord, keys: string[], fallback = "") => {
    for (const key of keys) {
      const value = row[key];
      if (value === undefined || value === null || String(value).trim() === "") continue;
      if (typeof value === "object") {
        const nested = record(value);
        return text(nested.name || nested.player_name || nested.batsman_name || nested.title, fallback);
      }
      return String(value);
    }
    return fallback;
  };
  const extraValue = (keys: string[]) => valueFrom(extras, keys, "0");
  const extraSummary = `b ${extraValue(["byes", "b"])}, lb ${extraValue(["legbyes", "leg_byes", "lb"])}, w ${extraValue(["wides", "wide", "w"])}, nb ${extraValue(["noballs", "no_balls", "nb"])}, p ${extraValue(["penalty", "penalty_runs", "p"])}`;
  const toss = record(info.toss);
  const tossText = valueFrom(toss, ["text", "result", "description", "winner"], valueFrom(info, ["toss_text", "toss"], "-"));
  const matchLabel = `${match.team1Name} vs ${match.team2Name} · ${match.competitionName} · ${match.matchName}`;
  const partnershipPlayers = (partnership: ProviderRecord) => {
    const nestedPlayers = array(partnership.players || partnership.batsmen || partnership.batters).map((player) => valueFrom(player, ["name", "player_name", "batsman_name"], text(player, ""))).filter(Boolean);
    return [
      nestedPlayers[0] || valueFrom(partnership, ["player1", "player_1", "batsman1", "batsman_1", "first_batsman", "name1"], "Batter 1"),
      nestedPlayers[1] || valueFrom(partnership, ["player2", "player_2", "batsman2", "batsman_2", "second_batsman", "name2"], "Batter 2"),
    ];
  };
  const normalizedReviewRows = Object.entries(review).flatMap(([side, value]) => {
    const item = record(value);
    if (!Object.keys(item).length) return [];
    const label = side.toLowerCase() === "batting" ? "Batting team" : side.toLowerCase() === "bowling" ? "Bowling team" : side;
    const total = text(item[`${side}_team_total_review`] ?? item.total_review ?? item.total, "0");
    const successful = text(item[`${side}_team_review_success`] ?? item.success ?? item.successful, "0");
    const failed = text(item[`${side}_team_review_failed`] ?? item.failed, "0");
    return [{ side: `${label} reviews`, value: `${total} total · ${successful} successful · ${failed} failed` }];
  });
  return <section className="scorecard-detail-card">
    <div className="scorecard-detail-header">
      <strong className="scorecard-detail-team">{battingTeam}</strong>
      <div className="scorecard-detail-header-score"><strong className="scorecard-detail-score">{score} <small>({overs} Ov)</small></strong><span>RR: {text(equation.runrate, "-")}</span></div>
    </div>

    <div className="scorecard-detail-section">
      <div className="table-responsive"><table className="scorecard-detail-table scorecard-batting-table"><thead><tr><th>BATTER</th><th aria-label="Dismissal"></th><th>R</th><th>B</th><th>4S</th><th>6S</th><th>SR</th></tr></thead><tbody>{batsmen.map((batsman, index) => { const rawDismissal = valueFrom(batsman, ["how_out", "dismissal", "dismissal_text"], ""); const isNotOut = String(rawDismissal).toLowerCase().includes("not out") || String(batsman.batting).toLowerCase() === "true"; const dismissal = rawDismissal || (isNotOut ? "not out" : "-"); return <tr key={`${batsman.batsman_id || batsman.name || "batter"}-${index}`}><td><strong>{text(batsman.name, "-")}{String(batsman.batting).toLowerCase() === "true" && <em>*</em>}{isNotOut && <span className="scorecard-status-badge">Not Out</span>}</strong></td><td className="scorecard-dismissal">{dismissal}</td><td>{text(batsman.runs, "0")}</td><td>{text(batsman.balls_faced, "0")}</td><td>{text(batsman.fours, "0")}</td><td>{text(batsman.sixes, "0")}</td><td>{text(batsman.strike_rate, "0.00")}</td></tr>; })}{!batsmen.length && <tr><td colSpan={7} className="text-muted">No batting rows supplied by provider.</td></tr>}</tbody></table></div><div className="scorecard-total-row"><span>Extras ({extraSummary})</span><strong>Total: {score} <small>({overs} Overs, RR: {text(equation.runrate, "-")})</small></strong></div>{didNotBat.length > 0 && <div className="scorecard-yet-to-bat"><span>Yet to Bat</span><strong>{didNotBat.map((player) => valueFrom(player, ["name", "player_name"], text(player, "-"))).join(", ")}</strong></div>}
    </div>

    <div className="scorecard-detail-section">
      <div className="table-responsive"><table className="scorecard-detail-table scorecard-bowling-table"><thead><tr><th>BOWLER</th><th>O</th><th>M</th><th>R</th><th>W</th><th>NB</th><th>WD</th><th>ECO</th></tr></thead><tbody>{bowlers.map((bowler, index) => <tr key={`${bowler.bowler_id || bowler.name || "bowler"}-${index}`}><td><strong>{text(bowler.name, "-")}{String(bowler.bowling).toLowerCase() === "true" && <em>*</em>}</strong><small>{text(bowler.position, "")}</small></td><td>{text(bowler.overs, "0")}</td><td>{text(bowler.maidens, "0")}</td><td>{text(bowler.runs_conceded, "0")}</td><td className="scorecard-green-text">{text(bowler.wickets, "0")}</td><td>{valueFrom(bowler, ["noballs", "no_balls", "nb"], "0")}</td><td>{valueFrom(bowler, ["wides", "wide", "wd"], "0")}</td><td>{text(bowler.econ, "0.00")}</td></tr>)}{!bowlers.length && <tr><td colSpan={8} className="text-muted">No bowling rows supplied by provider.</td></tr>}</tbody></table></div>
    </div>

    {fallOfWickets.length > 0 && <div className="scorecard-detail-section scorecard-simple-section"><div className="scorecard-detail-section-head"><h3>Fall of wickets</h3><span>Score</span><span>Over</span></div><div className="table-responsive"><table className="scorecard-detail-table"><tbody>{fallOfWickets.map((wicket, index) => <tr key={`${wicket.batsman_id || wicket.name}-${index}`}><td>{text(wicket.name, "-")}</td><td><strong>{text(wicket.score_at_dismissal, "-")}</strong></td><td>{text(wicket.overs_at_dismissal, "-")}</td></tr>)}</tbody></table></div></div>}

    {powerplay.length > 0 && <div className="scorecard-detail-section scorecard-simple-section"><div className="scorecard-detail-section-head"><h3>Powerplays</h3><span>Overs</span><span>Runs</span></div><div className="table-responsive"><table className="scorecard-detail-table"><tbody>{powerplay.map((item, index) => <tr key={index}><td>{text(item.name || item.type, `Powerplay ${index + 1}`)}</td><td>{text(item.overs, "-")}</td><td><strong>{text(item.runs || item.score, "-")}</strong></td></tr>)}</tbody></table></div></div>}

    {partnerships.length > 0 && <div className="scorecard-detail-section scorecard-partnership-section"><div className="scorecard-detail-section-head"><h3>Partnerships</h3></div><div className="table-responsive"><table className="scorecard-detail-table"><tbody>{partnerships.map((item, index) => { const [playerOne, playerTwo] = partnershipPlayers(item); return <tr key={index}><td>{playerOne}</td><td><strong className="scorecard-partnership-value">{text(item.runs, "0")}({text(item.balls_faced || item.balls, "0")})</strong></td><td>{playerTwo}</td></tr>; })}</tbody></table></div></div>}

    {(normalizedReviewRows.length > 0 || didNotBat.length > 0) && <div className="row g-3 scorecard-detail-panels">
      {normalizedReviewRows.length > 0 && <div className="col-md-6"><div className="scorecard-detail-panel"><h3>Reviews</h3>{normalizedReviewRows.map((item) => <div key={item.side}><span>{item.side}</span><strong>{item.value}</strong></div>)}</div></div>}
      {didNotBat.length > 0 && <div className="col-md-6"><div className="scorecard-detail-panel"><h3>Did not bat</h3>{didNotBat.map((item, index) => <div key={index}><span>{valueFrom(item, ["name", "player_name"], text(item, "-"))}</span></div>)}</div></div>}
    </div>}

    <div className="scorecard-detail-info"><h3>Info</h3><div><span>Match</span><strong>{matchLabel}</strong></div><div><span>Series</span><strong>{text(match.competitionName, "-")}</strong></div><div><span>Date</span><strong>{formatDate(info.date_start_ist || info.date_start || match.matchTime)}</strong></div><div><span>Venue</span><strong>{text(match.venue, "-")}</strong></div><div><span>Toss</span><strong>{tossText}</strong></div></div>
  </section>;
}

function CompactOverviewScorecard({ inning, info, providerData, statistics }: { inning: ProviderRecord; info: ProviderRecord; providerData: ProviderRecord; statistics: ProviderRecord | null }) {
  const batsmen = array(inning.batsmen);
  const bowlers = array(inning.bowlers);
  const activeBatsmen = batsmen.filter((item) => String(item.batting).toLowerCase() === "true");
  const activeBowlers = bowlers.filter((item) => String(item.bowling).toLowerCase() === "true");
  const visibleBatsmen = activeBatsmen.length ? activeBatsmen : batsmen.slice(-2);
  const visibleBowlers = activeBowlers.length ? activeBowlers : bowlers.slice(-2);
  const equation = record(inning.equations);
  const currentStats = array(statistics?.innings).find((item) => number(item.number) === number(inning.number)) || {};
  const recentOvers = array(record(currentStats.statistics).manhattan).slice(-10);
  const recentRuns = recentOvers.reduce((total, item) => total + number(item.runs), 0);
  const recentWickets = array(inning.fows).filter((item) => number(item.overs_at_dismissal) >= Math.max(0, number(equation.overs) - 10)).length;
  const winPercentage = record(providerData.teamwinpercentage);
  const teamAWin = number(winPercentage.team_a_win, 0);
  const teamBWin = number(winPercentage.team_b_win, 0);
  const lastWicket = record(inning.last_wicket);
  const partnership = record(inning.current_partnership);
  const dismissalScore = text(lastWicket.score_at_dismissal, "");
  const dismissalWickets = number(lastWicket.number, 0);
  const dismissalScoreLabel = dismissalScore.includes("/") ? dismissalScore : dismissalScore && dismissalWickets ? `${dismissalScore}/${dismissalWickets}` : dismissalScore;
  const lastWicketLabel = lastWicket.name ? `${text(lastWicket.name)} ${text(lastWicket.how_out, "")} ${text(lastWicket.runs, "0")}(${text(lastWicket.balls, "0")}) - ${text(dismissalScoreLabel)} in ${text(lastWicket.overs_at_dismissal, "—")} ov.` : "—";
  void lastWicketLabel;
  const requiredRuns = number(info.target || info.required_runs || providerData.target, 0);
  const requiredBalls = number(info.required_balls || providerData.required_balls, 0);
  const live = record(providerData.live);
  const liveInning = record(live.live_inning);
  const commentaryRecent = recentCommentaryTokens(live.commentaries);
  const recentForm = [commentaryRecent, providerData.recent_form, providerData.recent, liveInning.recent_scores, inning.recent_scores, live.recent_scores]
    .map(recentBallTokens)
    .find((tokens) => tokens.length > 0)?.slice(-18) || [];

  return (
    <section className="card rounded-4 p-4 shadow-sm mb-4 compact-overview-scorecard" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-3 border-bottom" style={{ borderColor: "#f1ece4" }}>
        <div>
          <h2 className="h5 fw-bold font-monospace mb-0" style={{ color: "#1c1f22" }}>
            {teamNameForId(info, inning.batting_team_id)} {text(inning.scores, text(inning.scores_full))}{" "}
            <span className="text-muted small">({text(equation.overs, "—")} Ov)</span>
          </h2>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <span className="badge rounded-pill fw-bold" style={{ background: "#faf8f5", border: "1px solid #eae5dc", color: "#1c1f22", fontSize: "11px" }}>
            CRR: {text(equation.runrate, "—")}
          </span>
          {requiredRuns > 0 && requiredBalls > 0 && (
            <span className="badge rounded-pill fw-bold" style={{ background: "rgba(220, 38, 38, 0.08)", border: "1px solid rgba(220, 38, 38, 0.25)", color: "#dc2626", fontSize: "11px" }}>
              {text(info.short_name, teamNameForId(info, inning.batting_team_id))} need {requiredRuns} runs from {requiredBalls} balls
            </span>
          )}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <h3 className="compact-section-title">Batter</h3>
          <div className="table-responsive">
            <table className="table table-hover table-borderless align-middle mb-4 cricket-score-table compact-score-table">
              <thead>
                <tr>
                  <th>BATTER</th>
                  <th>R</th>
                  <th>B</th>
                  <th>4S</th>
                  <th>6S</th>
                  <th>SR</th>
                </tr>
              </thead>
              <tbody>
                {visibleBatsmen.map((item, index) => (
                  <tr key={`${item.batsman_id || item.name}-${index}`}>
                    <td className="fw-semibold" style={{ color: "#1c1f22" }}>
                      {text(item.name)}
                      {String(item.batting).toLowerCase() === "true" && <span className="text-success ms-1 fw-bold">*</span>}
                    </td>
                    <td>{text(item.runs, "0")}</td>
                    <td>{text(item.balls_faced, "0")}</td>
                    <td>{text(item.fours, "0")}</td>
                    <td>{text(item.sixes, "0")}</td>
                    <td className="fw-semibold">{text(item.strike_rate, "0.00")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="compact-section-title">Bowler</h3>
          <div className="table-responsive">
            <table className="table table-hover table-borderless align-middle mb-0 cricket-score-table compact-score-table">
              <thead>
                <tr>
                  <th>BOWLER</th>
                  <th>O</th>
                  <th>M</th>
                  <th>R</th>
                  <th>W</th>
                  <th>ECO</th>
                </tr>
              </thead>
              <tbody>
                {visibleBowlers.map((item, index) => (
                  <tr key={`${item.bowler_id || item.name}-${index}`}>
                    <td className="fw-semibold" style={{ color: "#1c1f22" }}>
                      {text(item.name)}
                      {String(item.bowling).toLowerCase() === "true" && <span className="text-success ms-1 fw-bold">*</span>}
                    </td>
                    <td>{text(item.overs, "0")}</td>
                    <td>{text(item.maidens, "0")}</td>
                    <td>{text(item.runs_conceded, "0")}</td>
                    <td className="fw-bold" style={{ color: "#15803d" }}>{text(item.wickets, "0")}</td>
                    <td>{text(item.econ, "0.00")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card rounded-3 p-3 compact-key-stats" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: "#1c1f22", fontSize: "15px" }}>
              <span className="d-inline-block rounded-pill" style={{ width: "3px", height: "14px", backgroundColor: "#ffcc00" }} />
              Key Stats
            </h4>
            <div className="cricket-key-stat">
              <span>Partnership</span>
              <strong style={{ color: "#1c1f22" }}>{text(partnership.runs, "0")} ({text(partnership.balls, "0")})</strong>
            </div>
            <div className="cricket-key-stat">
              <span>Last Wicket</span>
              <strong style={{ color: "#1c1f22" }}>
                {lastWicket.name ? `${text(lastWicket.name)} · ${text(lastWicket.runs, "0")} (${text(lastWicket.balls, "0")})` : "—"}
              </strong>
            </div>
            <div className="cricket-key-stat">
              <span>Last 10 Overs</span>
              <strong style={{ color: "#1c1f22" }}>
                {recentRuns || recentWickets ? `${recentRuns} runs, ${recentWickets} wkts` : "—"}
              </strong>
            </div>
            <div className="cricket-key-stat">
              <span>Toss</span>
              <strong style={{ color: "#1c1f22" }}>{text(record(info.toss).text)}</strong>
            </div>
          </div>
        </div>
      </div>

      {(teamAWin > 0 || teamBWin > 0 || recentForm.length > 0) && (
        <div className="compact-bottom-row pt-3 mt-3 border-top" style={{ borderColor: "#eae5dc" }}>
          {(teamAWin > 0 || teamBWin > 0) && (
            <div className="compact-win-probability">
              <div>
                <strong style={{ color: "#1c1f22" }}>{text(getTeam(info, "teama").name)}</strong>
                <span className="fw-bold" style={{ color: "#1c1f22" }}>{teamAWin}%</span>
              </div>
              <div className="compact-win-bar">
                <span style={{ width: `${teamAWin}%` }} />
              </div>
              <div>
                <span className="fw-bold" style={{ color: "#1c1f22" }}>{teamBWin}%</span>
                <strong style={{ color: "#1c1f22" }}>{text(getTeam(info, "teamb").name)}</strong>
              </div>
            </div>
          )}
          {recentForm.length > 0 && (
            <div className="compact-recent-form">
              <strong style={{ color: "#1c1f22" }}>Recent:</strong>
              {recentForm.map((item, index) =>
                item === "|" ? (
                  <span key={`separator-${index}`} className="recent-form-separator">|</span>
                ) : (
                  <span
                    key={index}
                    className={`recent-form-pill ${String(item).toLowerCase() === "w" ? "win" : String(item).toLowerCase() === "l" ? "loss" : ""}`}
                  >
                    {text(item)}
                  </span>
                )
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function StatisticsPanel({ innings, statistics, info }: { innings: ProviderRecord[]; statistics: ProviderRecord | null; info: ProviderRecord }) {
  const statsInnings = array(statistics?.innings);
  const first = innings[0] || {};
  const second = innings[1] || {};
  const rows = [
    { label: "Runs", value: (inning: ProviderRecord) => text(record(inning.equations).runs, text(inning.scores, "0")), numeric: (inning: ProviderRecord) => number(record(inning.equations).runs) },
    { label: "Wickets", value: (inning: ProviderRecord) => text(record(inning.equations).wickets, "0"), numeric: (inning: ProviderRecord) => number(record(inning.equations).wickets) },
    { label: "Overs", value: (inning: ProviderRecord) => text(record(inning.equations).overs, "0"), numeric: (inning: ProviderRecord) => number(record(inning.equations).overs) },
    { label: "Run rate", value: (inning: ProviderRecord) => text(record(inning.equations).runrate, "0.00"), numeric: (inning: ProviderRecord) => number(record(inning.equations).runrate) },
    { label: "Extras", value: (inning: ProviderRecord) => text(record(inning.extra_runs).total, "0"), numeric: (inning: ProviderRecord) => number(record(inning.extra_runs).total) },
  ];
  const players: ProviderRecord[] = [first, second].flatMap((inning) =>
    array(inning.batsmen)
      .sort((a, b) => number(b.runs) - number(a.runs))
      .slice(0, 3)
      .map((player) => ({ ...player, team: teamNameForId(info, inning.batting_team_id) }))
  );

  return (
    <section className="d-flex flex-column gap-4">
      {/* Team Statistics Comparison */}
      <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom" style={{ borderColor: "#f1ece4" }}>
          <h5 className="fw-bold mb-0 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
            <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "16px", backgroundColor: "#ffcc00" }} />
            Team Statistics Comparison
          </h5>
          <span className="badge rounded-pill fw-semibold" style={{ background: "#faf8f5", border: "1px solid #eae5dc", color: "#64748b", fontSize: "11px" }}>
            Provider Data
          </span>
        </div>
        <div className="d-flex flex-column gap-3">
          {rows.map((row) => {
            const max = Math.max(row.numeric(first), row.numeric(second), 1);
            const val1 = row.numeric(first);
            const val2 = row.numeric(second);
            const pct1 = Math.min(100, (val1 / max) * 100);
            const pct2 = Math.min(100, (val2 / max) * 100);
            return (
              <div key={row.label} className="p-3 rounded-3" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong style={{ color: "#1c1f22", fontSize: "15px" }}>{row.value(first)}</strong>
                  <span className="fw-bold small text-muted text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>{row.label}</span>
                  <strong style={{ color: "#1c1f22", fontSize: "15px" }}>{row.value(second)}</strong>
                </div>
                <div className="d-flex gap-2" style={{ height: "6px" }}>
                  <div className="w-50 rounded-pill overflow-hidden d-flex justify-content-end" style={{ background: "#eae5dc" }}>
                    <div className="h-100 rounded-pill" style={{ width: `${pct1}%`, background: "#ffcc00" }} />
                  </div>
                  <div className="w-50 rounded-pill overflow-hidden" style={{ background: "#eae5dc" }}>
                    <div className="h-100 rounded-pill" style={{ width: `${pct2}%`, background: "#4a90e2" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Player Performance */}
      <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
        <h5 className="fw-bold mb-4 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
          <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "16px", backgroundColor: "#ffcc00" }} />
          Key Player Performance
        </h5>
        <div className="row g-3">
          {players.length ? (
            players.map((player, index) => (
              <div className="col-md-6" key={`${player.batsman_id || player.name}-${index}`}>
                <div className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                  <div className="d-flex align-items-center gap-3 min-w-0">
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "38px", height: "38px", background: "#ffffff", border: "1px solid #eae5dc" }}>
                      <i className="bi bi-person-fill" style={{ color: "#64748b", fontSize: "16px" }} />
                    </div>
                    <div className="min-w-0">
                      <strong className="d-block text-truncate" style={{ color: "#1c1f22", fontSize: "14px" }}>{text(player.name)}</strong>
                      <small className="text-muted">{text(player.team)} · {text(player.runs, "0")} runs ({text(player.balls_faced, "0")} balls)</small>
                    </div>
                  </div>
                  <span className="badge rounded-pill fw-bold" style={{ background: "rgba(22, 163, 74, 0.08)", color: "#15803d", border: "1px solid rgba(22, 163, 74, 0.2)", fontSize: "11px" }}>
                    {text(player.strike_rate, "0.00")} SR
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted mb-0 p-2">No player statistics supplied by provider.</p>
          )}
        </div>
      </div>

      {/* Recent Over Progression */}
      <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
        <h5 className="fw-bold mb-3 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
          <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "16px", backgroundColor: "#ffcc00" }} />
          Recent Over Progression
        </h5>
        {statsInnings.length ? (
          <div className="d-flex flex-wrap gap-2">
            {statsInnings.flatMap((item) =>
              array(record(item.statistics).manhattan).slice(-5).map((over, index) => (
                <span
                  className="badge rounded-pill fw-semibold px-3 py-2"
                  style={{ background: "#faf8f5", border: "1px solid #eae5dc", color: "#1c1f22", fontSize: "12px" }}
                  key={`${item.number}-${over.over || index}`}
                >
                  Over {text(over.over)}: <strong style={{ color: "#d97706" }}>{text(over.runs, "0")} runs</strong>
                </span>
              ))
            )}
          </div>
        ) : (
          <p className="text-muted mb-0">No over progression supplied by provider.</p>
        )}
      </div>
    </section>
  );
}

function LineupsPanel({ providerData, info }: { providerData: ProviderRecord; info: ProviderRecord }) {
  const roleLabel = (player: ProviderRecord) => {
    const raw = String(player.role_str || player.role || "").toLowerCase();
    if (player.captain || player.is_captain || raw.includes("captain")) return "CAPT";
    if (raw === "wk" || raw.includes("wicket")) return "WICKETKEEPER";
    if (raw === "bat" || raw.includes("batter") || raw.includes("bat")) return "BAT";
    if (raw === "bowl" || raw.includes("bowler") || raw.includes("bowl")) return "BOWL";
    if (raw === "all" || raw.includes("all-round")) return "ALL";
    return raw ? raw.toUpperCase() : "";
  };
  const groups = [
    { key: "teama" as const, team: getTeam(info, "teama"), name: text(getTeam(info, "teama").name), players: getPlaying11(providerData, "teama") },
    { key: "teamb" as const, team: getTeam(info, "teamb"), name: text(getTeam(info, "teamb").name), players: getPlaying11(providerData, "teamb") },
  ];
  return (
    <section className="lineups-reference-card">
      <h2>Starting Formations &amp; Squads</h2>
      <div className="lineups-reference-grid">
        {groups.map((group) => (
          <div className="lineups-reference-team" key={group.key}>
            <div className="lineups-reference-team-head">
              <Image src={text(group.team.logo_url || group.team.thumb_url, "/assets/imgs/teams/team-placeholder.svg")} alt={group.name} width={28} height={28} className="lineups-reference-team-logo" />
              <strong>{group.name}</strong>
            </div>
            {group.players.length ? (
              <div className="lineups-reference-players">
                {group.players.map((player, index) => {
                  const role = roleLabel(player);
                  return (
                    <div className="lineups-reference-player" key={`${player.player_id || player.pid || player.name}-${index}`}>
                      <span className="lineups-reference-player-number">{index + 1}</span>
                      <span className="lineups-reference-player-name">{text(player.name)}</span>
                      {role && <span className={`lineups-reference-role ${role === "WICKETKEEPER" ? "keeper" : role === "CAPT" ? "captain" : ""}`}>{role}</span>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted mb-0 p-2">Playing XI was not supplied by provider.</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CommentaryPanel({ commentary, title }: { commentary: ProviderRecord | null; title: string }) {
  const rows = getCommentaryRows(commentary);
  const latest = rows.slice(-15).reverse();
  return (
    <section className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom" style={{ borderColor: "#f1ece4" }}>
        <h5 className="fw-bold mb-0 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
          <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "16px", backgroundColor: "#ffcc00" }} />
          {title}
        </h5>
        <span className="badge rounded-pill fw-bold px-2.5 py-1" style={{ background: "rgba(22, 163, 74, 0.1)", color: "#15803d", border: "1px solid rgba(22, 163, 74, 0.25)", fontSize: "11px" }}>
          LIVE
        </span>
      </div>
      {latest.length ? (
        <div className="d-flex flex-column">
          {latest.map((item, index) => (
            <div
              key={item.id || item.commentary_id || item.event_id || index}
              className="d-flex gap-3 py-3"
              style={{ borderBottom: index < latest.length - 1 ? "1px solid #f1ece4" : "none" }}
            >
              <div
                className="badge rounded-pill fw-bold font-monospace flex-shrink-0 align-self-start"
                style={{ background: "#faf8f5", border: "1px solid #eae5dc", color: "#1c1f22", fontSize: "11px", padding: "4px 8px" }}
              >
                {text(item.over || item.over_no, "—")}.{text(item.ball, "—")}
              </div>
              <div className="flex-grow-1">
                <p className="mb-1 fw-medium" style={{ color: "#1c1f22", fontSize: "13.5px", lineHeight: 1.5 }}>
                  {text(item.commentary || item.sentence || item.text || item.commentary_text, "Provider update")}
                </p>
                <small className="text-muted fw-semibold">
                  {number(item.run) > 0 ? `${text(item.run)} run${number(item.run) > 1 ? "s" : ""}` : "Dot ball"}
                </small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted mb-0 p-2">No commentary available.</p>
      )}
    </section>
  );
}

function TimelinePanel({ providerData, commentary }: { providerData: ProviderRecord; commentary: ProviderRecord | null }) {
  const innings = getInnings(providerData);
  const fallOfWickets: ProviderRecord[] = innings.flatMap((inning) => array(inning.fows).map((wicket) => ({ ...wicket, inning: inning.name })));
  const commentaries = getCommentaryRows(commentary).slice(-5).reverse();
  const events = [
    ...fallOfWickets.map((item) => ({ time: text(item.overs_at_dismissal, "—"), title: `${text(item.name)} dismissed`, detail: `${text(item.how_out || item.dismissal, "Wicket")}`, kind: "wicket" })),
    ...commentaries.map((item) => ({ time: `${text(item.over, "—")}.${text(item.ball, "—")}`, title: "Ball update", detail: text(item.commentary || item.text), kind: number(item.run) > 0 ? "run" : "dot" })),
  ].slice(-10);

  return (
    <section className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
      <h5 className="fw-bold mb-4 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
        <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "16px", backgroundColor: "#ffcc00" }} />
        Match Events Timeline
      </h5>
      {events.length ? (
        <div className="d-flex flex-column gap-3">
          {events.map((event, index) => (
            <div key={`${event.time}-${index}`} className="d-flex gap-3 align-items-start p-3 rounded-3" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
              <span
                className="badge rounded-pill fw-bold font-monospace flex-shrink-0"
                style={{ background: "#ffffff", border: "1px solid #eae5dc", color: "#1c1f22", fontSize: "11px", padding: "4px 8px" }}
              >
                {event.time} ov
              </span>
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                  <strong style={{ color: "#1c1f22", fontSize: "14px" }}>{event.title}</strong>
                  <span
                    className="badge rounded-pill fw-bold text-uppercase"
                    style={{
                      fontSize: "9.5px",
                      background: event.kind === "wicket" ? "rgba(220, 38, 38, 0.1)" : "rgba(22, 163, 74, 0.1)",
                      color: event.kind === "wicket" ? "#dc2626" : "#15803d",
                      border: event.kind === "wicket" ? "1px solid rgba(220, 38, 38, 0.25)" : "1px solid rgba(22, 163, 74, 0.25)",
                    }}
                  >
                    {event.kind}
                  </span>
                </div>
                <p className="text-muted small mb-0">{event.detail}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted mb-0 p-2">No timeline events available.</p>
      )}
    </section>
  );
}

function OverviewPanel({ match, providerData, info, latestInning, statistics }: { match: LiveScoreMatchDetail; providerData: ProviderRecord; info: ProviderRecord; latestInning: ProviderRecord; statistics: ProviderRecord | null }) {
  const history = historyRows(
    providerData.h2h,
    providerData.head_to_head,
    providerData.historical_results,
    providerData.history,
    info.h2h,
    info.head_to_head,
    info.historical_results,
    info.history,
  );
  return (
    <section className="d-flex flex-column gap-4">
      <CompactOverviewScorecard inning={latestInning} info={info} providerData={providerData} statistics={statistics} />
      <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
        <h5 className="fw-bold mb-4 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
          <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "18px", backgroundColor: "#ffcc00" }} />
          Match Overview
        </h5>
        <div className="row g-3">
          {[["Competition", match.competitionName], ["Venue", match.venue], ["Last Updated", match.lastUpdated], ["Sport Type", "CRICKET"]].map(([label, value]) => (
            <div className="col-6 col-lg-3" key={String(label)}>
              <div className="p-3 rounded-3" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                <span className="text-muted fw-bold text-uppercase d-block mb-1" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>{label}</span>
                <strong style={{ color: "#1c1f22", fontSize: "14px" }}>{text(value)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card rounded-4 p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
        <h5 className="fw-bold mb-3 font-space-grotesk d-flex align-items-center gap-2" style={{ color: "#1c1f22" }}>
          <span className="d-inline-block rounded-pill" style={{ width: "4px", height: "18px", backgroundColor: "#ffcc00" }} />
          Historical Results (H2H)
        </h5>
        {history.length ? (
          <div className="d-flex flex-column gap-2">
            {history.map((item, index) => (
              <div key={item.id || index} className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: "#faf8f5", border: "1px solid #eae5dc" }}>
                <span className="text-muted small">{text(item.date)}</span>
                <strong style={{ color: "#1c1f22", fontSize: "13.5px" }}>{text(item.result || item.summary || item.text)}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted mb-0 p-2">No historical H2H results available.</p>
        )}
      </div>
    </section>
  );
}

export default function CricketMatchDetail({ match, providerData, statistics, commentary, activeTab, onTabChange }: CricketMatchDetailProps) {
  const info = getInfo(providerData);
  const latestInning = getLatestInning(providerData);
  const innings = getInnings(providerData);
  const teamA = getTeam(info, "teama");
  const teamB = getTeam(info, "teamb");
  const equation = record(latestInning.equations);
  const scoreA = text(teamA.scores, text(match.team1Score)).replace(/\s*\([^)]*\)$/, "");
  const scoreB = text(teamB.scores, text(match.team2Score)).replace(/\s*\([^)]*\)$/, "");
  const oversA = text(teamA.overs, match.team1Overs || "");
  const oversB = text(teamB.overs, match.team2Overs || "");
  const [selectedInningId, setSelectedInningId] = React.useState(String(latestInning.iid || latestInning.number || ""));
  const selectedInning = innings.find((inning) => String(inning.iid || inning.number || "") === selectedInningId) || latestInning;

  return (
    <div className="cricket-match-detail">
      {/* ── Cricket Hero Scoreboard ── */}
      <section className="card rounded-4 p-4 mb-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #eae5dc" }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 mb-4 border-bottom" style={{ borderColor: "#eae5dc" }}>
          <div>
            <div className="fw-bold small text-uppercase" style={{ color: "#d97706", letterSpacing: "0.04em" }}>
              {text(info.competition?.season, "LIVE")} · {text(info.competition?.title, match.competitionName)} · {text(info.subtitle, match.matchName)}
            </div>
            <div className="text-muted small mt-1">
              <i className="bi bi-geo-alt me-1" />{match.venue} · {formatDate(info.date_start_ist || info.date_start)}
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <StatusBadge status={match.matchStatus} />
            <span
              className="badge rounded-pill px-2.5 py-1 font-monospace fw-bold"
              style={{ background: "#faf8f5", border: "1px solid #eae5dc", color: "#4b5563", fontSize: "11px" }}
            >
              <i className="bi bi-clock me-1" />{text(latestInning.equations?.overs, text(match.team2Overs, "—"))} Overs
            </span>
          </div>
        </div>

        <div className="row align-items-center g-3 my-2">
          {/* Team 1 */}
          <div className="col-4 text-center">
            <div className="d-flex flex-column align-items-center gap-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: "64px", height: "64px", background: "#f8f6f0", border: "1px solid #eae5dc" }}
              >
                <TeamLogo src={match.team1Logo} name={match.team1Name} size={48} />
              </div>
              <strong className="fw-bold" style={{ color: "#1c1f22", fontSize: "16px" }}>
                {text(teamA.name, match.team1Name)}
              </strong>
              <span className="text-muted small font-monospace">
                {oversA && `${oversA} ov`}
              </span>
            </div>
          </div>

          {/* Center Score */}
          <div className="col-4 text-center">
            <div className="d-flex align-items-baseline justify-content-center gap-2">
              <span className="font-monospace fw-bold" style={{ fontSize: "28px", color: "#1c1f22", letterSpacing: "-0.02em" }}>
                {scoreA}
              </span>
              <span className="badge rounded-pill px-2 py-0.5" style={{ background: "#f8f6f0", color: "#64748b", fontSize: "10px", border: "1px solid #eae5dc" }}>
                VS
              </span>
              <span className="font-monospace fw-bold" style={{ fontSize: "28px", color: "#1c1f22", letterSpacing: "-0.02em" }}>
                {scoreB}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-3 mt-2 text-muted small">
              <span>CRR: <strong style={{ color: "#1c1f22" }}>{text(equation.runrate, "—")}</strong></span>
              <span>·</span>
              <span>RRR: <strong style={{ color: "#1c1f22" }}>{text(info.required_run_rate || latestInning.required_run_rate, "—")}</strong></span>
            </div>
          </div>

          {/* Team 2 */}
          <div className="col-4 text-center">
            <div className="d-flex flex-column align-items-center gap-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: "64px", height: "64px", background: "#f8f6f0", border: "1px solid #eae5dc" }}
              >
                <TeamLogo src={match.team2Logo} name={match.team2Name} size={48} />
              </div>
              <strong className="fw-bold" style={{ color: "#1c1f22", fontSize: "16px" }}>
                {text(teamB.name, match.team2Name)}
              </strong>
              <span className="text-muted small font-monospace">
                {oversB && `${oversB} ov`}
              </span>
            </div>
          </div>
        </div>

        {match.note && (
          <div
            className="d-flex align-items-center justify-content-center gap-2 p-2.5 mt-4 rounded-3 text-center"
            style={{ background: "#fffdf0", border: "1px solid #fde68a", borderLeft: "4px solid #ffcc00" }}
          >
            <i className="bi bi-info-circle-fill flex-shrink-0" style={{ fontSize: "13px", color: "#d97706" }} />
            <span className="small fw-semibold" style={{ color: "#78350f" }}>{match.note}</span>
          </div>
        )}
      </section>

      <MatchSponsorBanner />
      <CricketTabs activeTab={activeTab} onTabChange={onTabChange} />

      {activeTab === "overview" && <OverviewPanel match={match} providerData={providerData} info={info} latestInning={latestInning} statistics={statistics} />}
      {activeTab === "scorecard" && (
        <div className="d-flex flex-column gap-4">
          {innings.length > 1 && (
            <div className="scorecard-innings-switcher">
              {innings.map((inning, index) => {
                const inningId = String(inning.iid || inning.number || index);
                return (
                  <button
                    type="button"
                    className={String(selectedInning.iid || selectedInning.number || "") === inningId ? "active" : ""}
                    key={inningId}
                    onClick={() => setSelectedInningId(inningId)}
                  >
                    {text(inning.name, `Innings ${index + 1}`)}
                  </button>
                );
              })}
            </div>
          )}
          <DetailedScorecard inning={selectedInning} info={info} match={match} />
        </div>
      )}
      {activeTab === "statistics" && <StatisticsPanel innings={innings} statistics={statistics} info={info} />}
      {activeTab === "lineups" && <LineupsPanel providerData={providerData} info={info} />}
      {activeTab === "timeline" && <TimelinePanel providerData={providerData} commentary={commentary} />}
      {activeTab === "commentary" && <CommentaryPanel commentary={commentary} title="Commentary" />}
    </div>
  );
}
