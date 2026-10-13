import {
  Tip,
  TipsterProfile,
  PurchasedTip,
  SportType,
  SubscriptionPlanType,
  TipVisibility,
} from "@/types/tipster";

export const INITIAL_TIPSTERS: TipsterProfile[] = [
  {
    id: "tipster-1",
    firstName: "Alex",
    lastName: "Vance",
    displayName: "ApexPredictor",
    username: "apex_picks",
    email: "alex.vance@sportsverge.com",
    mobileNumber: "+1 (555) 234-5678",
    country: "United Kingdom",
    preferredSports: ["Football", "Cricket"],
    yearsOfExperience: 7,
    shortBio:
      "Premier League & UEFA Champions League specialist with deep statistical modeling and xG match forecasting. Over 7 years of published winning track record.",
    avatarUrl: "/assets/imgs/players/Erling-Haaland.jpg",
    socialLinks: {
      twitter: "https://twitter.com/apex_picks",
      telegram: "https://t.me/apex_tips",
    },
    subscriptionStatus: "active",
    subscriptionPlan: "annual",
    subscriptionExpiresAt: "2027-04-01T00:00:00Z",
    verificationStatus: "verified",
    stats: {
      totalTips: 184,
      winRate: 78.4,
      roi: 24.8,
      profitUnits: 46.5,
      followersCount: 3420,
      rating: 4.9,
      streak: "5W Streak",
    },
    createdAt: "2025-01-10T12:00:00Z",
  },
  {
    id: "tipster-2",
    firstName: "Rohan",
    lastName: "Sharma",
    displayName: "CricMaster Rohan",
    username: "cricmaster_rohan",
    email: "rohan.sharma@sportsverge.com",
    mobileNumber: "+91 98765 43210",
    country: "India",
    preferredSports: ["Cricket"],
    yearsOfExperience: 9,
    shortBio:
      "IPL, T20 World Cup, and Test cricket pitch analyst. Deep insight into toss factors, player match-ups, and session over/under lines.",
    avatarUrl: "/assets/imgs/players/abhishek-sharma.jpg",
    socialLinks: {
      twitter: "https://twitter.com/cricmaster_rohan",
      youtube: "https://youtube.com/@cricmaster",
    },
    subscriptionStatus: "active",
    subscriptionPlan: "quarterly",
    subscriptionExpiresAt: "2026-08-15T00:00:00Z",
    verificationStatus: "verified",
    stats: {
      totalTips: 215,
      winRate: 82.1,
      roi: 31.2,
      profitUnits: 68.4,
      followersCount: 5120,
      rating: 4.95,
      streak: "8W Streak",
    },
    createdAt: "2024-11-20T10:00:00Z",
  },
  {
    id: "tipster-3",
    firstName: "Marcus",
    lastName: "Brody",
    displayName: "Gridiron Edge",
    username: "gridiron_brody",
    email: "marcus.brody@sportsverge.com",
    mobileNumber: "+1 (312) 890-1234",
    country: "United States",
    preferredSports: ["NFL", "AFL"],
    yearsOfExperience: 5,
    shortBio:
      "NFL spread & total points strategist. Combining injury depth analysis, red zone conversion metrics, and quarterback efficiency indices.",
    avatarUrl: "/assets/imgs/players/Patrick-Mahomes.jpg",
    socialLinks: {
      twitter: "https://twitter.com/gridiron_brody",
    },
    subscriptionStatus: "active",
    subscriptionPlan: "monthly",
    subscriptionExpiresAt: "2026-05-30T00:00:00Z",
    verificationStatus: "verified",
    stats: {
      totalTips: 142,
      winRate: 74.6,
      roi: 19.5,
      profitUnits: 29.8,
      followersCount: 2180,
      rating: 4.8,
      streak: "3W Streak",
    },
    createdAt: "2025-02-05T08:00:00Z",
  },
  {
    id: "tipster-4",
    firstName: "Liam",
    lastName: "O'Connor",
    displayName: "Aussie Footy IQ",
    username: "aussie_footyiq",
    email: "liam.oconnor@sportsverge.com",
    mobileNumber: "+61 412 345 678",
    country: "Australia",
    preferredSports: ["AFL", "Cricket"],
    yearsOfExperience: 6,
    shortBio:
      "AFL Premiership and MCG specialist. Ground dimensions, contested possession rates, and clearance statistics drive every pick.",
    avatarUrl: "/assets/imgs/players/Josh-Dunkley.jpg",
    socialLinks: {
      twitter: "https://twitter.com/aussie_footyiq",
    },
    subscriptionStatus: "active",
    subscriptionPlan: "quarterly",
    subscriptionExpiresAt: "2026-07-20T00:00:00Z",
    verificationStatus: "verified",
    stats: {
      totalTips: 98,
      winRate: 76.0,
      roi: 22.4,
      profitUnits: 21.0,
      followersCount: 1640,
      rating: 4.75,
    },
    createdAt: "2025-03-12T14:00:00Z",
  },
];

export const INITIAL_TIPS: Tip[] = [
  {
    id: "tip-101",
    tipsterId: "tipster-2",
    tipster: {
      id: "tipster-2",
      displayName: "CricMaster Rohan",
      username: "cricmaster_rohan",
      avatarUrl: "/assets/imgs/avatars/avatar-2.png",
      winRate: 82.1,
      rating: 4.95,
      isVerified: true,
    },
    sport: "Cricket",
    competition: "Indian Premier League 2026",
    match: "Chennai Super Kings vs Mumbai Indians",
    teams: {
      home: "Chennai Super Kings",
      away: "Mumbai Indians",
    },
    predictionTitle: "CSK to Win & Match Total 6s Over 14.5",
    predictionDescription:
      "Chepauk pitch report indicates spin assistance in 2nd innings with dry conditions favoring CSK's slow bowling attack.",
    analysisSnippet:
      "Historical data shows home team winning 72% of matches under these specific humidity and surface conditions...",
    detailedAnalysis:
      "Full Analysis: CSK's top 4 have a combined strike rate of 148 against pace in powerplay overs. MI's middle order has struggled against left-arm spin. Recommendation: Stake 3 Units on CSK Match Winner @ 1.85 and 2 Units on Over 14.5 Total Sixes @ 1.90.",
    predictionCategory: "Match Winner",
    odds: 1.85,
    confidenceLevel: "High",
    matchDate: "2026-09-25",
    kickoffTime: "19:30 IST",
    visibility: "Free",
    status: "Published",
    likesCount: 342,
    viewsCount: 1890,
    isTrending: true,
    isFeatured: true,
    publishedAt: "2026-09-22T14:30:00Z",
  },
  {
    id: "tip-102",
    tipsterId: "tipster-1",
    tipster: {
      id: "tipster-1",
      displayName: "ApexPredictor",
      username: "apex_picks",
      avatarUrl: "/assets/imgs/avatars/avatar-1.png",
      winRate: 78.4,
      rating: 4.9,
      isVerified: true,
    },
    sport: "Football",
    competition: "UEFA Champions League",
    match: "Real Madrid vs Manchester City",
    teams: {
      home: "Real Madrid",
      away: "Manchester City",
    },
    predictionTitle: "Both Teams To Score & Over 2.5 Total Goals",
    predictionDescription:
      "High-octane European clash with elite offensive firepower on both flanks and high xG averages across last 5 head-to-head fixtures.",
    analysisSnippet:
      "Both teams have scored in 9 of their last 10 UCL encounters. Defensive injuries on the wing back positions create massive transition value...",
    detailedAnalysis:
      "Detailed Tactical Breakdown: Real Madrid average 2.4 expected goals per 90 at home in UCL knockout ties, while Man City generate 14.2 penalty box touches per match away. With key center back rotation, BTTS + Over 2.5 represents extreme statistical edge. Confirmed Lock Selection.",
    predictionCategory: "Both Teams To Score",
    odds: 2.10,
    confidenceLevel: "High",
    matchDate: "2026-09-26",
    kickoffTime: "20:00 BST",
    visibility: "Premium",
    premiumPrice: 6.99,
    status: "Published",
    likesCount: 520,
    unlockedCount: 84,
    viewsCount: 2450,
    isTrending: true,
    isFeatured: true,
    publishedAt: "2026-09-22T16:00:00Z",
  },
  {
    id: "tip-103",
    tipsterId: "tipster-3",
    tipster: {
      id: "tipster-3",
      displayName: "Gridiron Edge",
      username: "gridiron_brody",
      avatarUrl: "/assets/imgs/avatars/avatar-3.png",
      winRate: 74.6,
      rating: 4.8,
      isVerified: true,
    },
    sport: "NFL",
    competition: "NFL Regular Season",
    match: "Kansas City Chiefs vs Buffalo Bills",
    teams: {
      home: "Kansas City Chiefs",
      away: "Buffalo Bills",
    },
    predictionTitle: "Kansas City Chiefs -3.5 Spread & Over 48.5 Points",
    predictionDescription:
      "Chiefs offense entering red-hot rhythm with top passing yards efficiency against zone defensive schemes.",
    analysisSnippet:
      "Bills have allowed 6.4 yards per carry against shotgun formations. Chiefs offensive line ranks #1 in pass-block win rate...",
    detailedAnalysis:
      "Complete Sharp Pick: The Chiefs pass rush creates quick pressure without blitzing. Expect Kansas City to control tempo and seal cover with late 4th quarter drive. Recommendation: 2.5 units on Spread -3.5 @ 1.95.",
    predictionCategory: "Handicap",
    odds: 1.95,
    confidenceLevel: "High",
    matchDate: "2026-09-27",
    kickoffTime: "16:25 EDT",
    visibility: "Premium",
    premiumPrice: 4.99,
    status: "Published",
    likesCount: 215,
    unlockedCount: 42,
    viewsCount: 1320,
    isTrending: false,
    isFeatured: true,
    publishedAt: "2026-09-23T08:00:00Z",
  },
  {
    id: "tip-104",
    tipsterId: "tipster-4",
    tipster: {
      id: "tipster-4",
      displayName: "Aussie Footy IQ",
      username: "aussie_footyiq",
      avatarUrl: "/assets/imgs/avatars/avatar-4.png",
      winRate: 76.0,
      rating: 4.75,
      isVerified: true,
    },
    sport: "AFL",
    competition: "AFL Premiership",
    match: "Collingwood vs Carlton",
    teams: {
      home: "Collingwood Magpies",
      away: "Carlton Blues",
    },
    predictionTitle: "Collingwood 1-39 Margin Victory",
    predictionDescription:
      "MCG blockbuster where Collingwood's contested ball dominance will prove decisive in a tight 4th quarter tussle.",
    analysisSnippet:
      "Collingwood have won 6 of their last 7 matches decided by under 24 points at the MCG...",
    detailedAnalysis:
      "Full Analysis: Midfield stoppage clearances favour Collingwood by 8.4 per game. Carlton's defensive transition under pressure is vulnerable to rapid rebound 50s. Target Margin: Collingwood by 12-25 points.",
    predictionCategory: "Match Winner",
    odds: 2.25,
    confidenceLevel: "Medium",
    matchDate: "2026-09-26",
    kickoffTime: "19:20 AEST",
    visibility: "Free",
    status: "Published",
    likesCount: 168,
    viewsCount: 940,
    isTrending: false,
    isFeatured: false,
    publishedAt: "2026-09-23T05:30:00Z",
  },
  {
    id: "tip-105",
    tipsterId: "tipster-1",
    tipster: {
      id: "tipster-1",
      displayName: "ApexPredictor",
      username: "apex_picks",
      avatarUrl: "/assets/imgs/avatars/avatar-1.png",
      winRate: 78.4,
      rating: 4.9,
      isVerified: true,
    },
    sport: "Football",
    competition: "English Premier League",
    match: "Liverpool vs Arsenal",
    teams: {
      home: "Liverpool",
      away: "Arsenal",
    },
    predictionTitle: "Arsenal Draw No Bet (DNB) & Under 3.5 Goals",
    predictionDescription:
      "Tactical battle between two title contenders at Anfield with defensive structures prioritizing clean transitions.",
    analysisSnippet:
      "Arsenal's set piece efficiency and league-best defensive record make them extremely resilient on the road...",
    detailedAnalysis:
      "Lock Breakdown: Liverpool's pressing intensity has softened in second halves while Arsenal concede lowest expected goals per shot in Europe. Back Arsenal DNB @ 2.05 as high value security play.",
    predictionCategory: "Handicap",
    odds: 2.05,
    confidenceLevel: "Medium",
    matchDate: "2026-09-27",
    kickoffTime: "16:30 BST",
    visibility: "Free",
    status: "Published",
    likesCount: 289,
    viewsCount: 1720,
    isTrending: true,
    isFeatured: false,
    publishedAt: "2026-09-23T06:45:00Z",
  },
  {
    id: "tip-106",
    tipsterId: "tipster-2",
    tipster: {
      id: "tipster-2",
      displayName: "CricMaster Rohan",
      username: "cricmaster_rohan",
      avatarUrl: "/assets/imgs/avatars/avatar-2.png",
      winRate: 82.1,
      rating: 4.95,
      isVerified: true,
    },
    sport: "Cricket",
    competition: "ICC T20 World Cup Warmup",
    match: "India vs Australia",
    teams: {
      home: "India",
      away: "Australia",
    },
    predictionTitle: "Top Batsman & Match Total Over 340.5 Runs",
    predictionDescription:
      "Flat track with short boundaries and fast outfield guaranteed to deliver high-scoring thriller.",
    analysisSnippet:
      "Average first innings score at this venue across the last 8 T20 games is 184 runs...",
    detailedAnalysis:
      "VIP Pick: Both teams have stacked power hitters through #7. Premium selection includes over total match boundaries with primary focus on top order batting performance. Confirmed 5-Star Selection.",
    predictionCategory: "Over/Under",
    odds: 2.30,
    confidenceLevel: "High",
    matchDate: "2026-09-28",
    kickoffTime: "14:00 IST",
    visibility: "Premium",
    premiumPrice: 7.99,
    status: "Published",
    likesCount: 410,
    unlockedCount: 63,
    viewsCount: 2110,
    isTrending: true,
    isFeatured: true,
    publishedAt: "2026-09-23T07:15:00Z",
  },
];

// Helper functions for storage / hydration
const STORAGE_KEYS = {
  CURRENT_TIPSTER: "sportsverge_current_tipster",
  ALL_TIPS: "sportsverge_all_tips",
  PURCHASED_TIPS: "sportsverge_purchased_tips",
  FOLLOWED_TIPSTERS: "sportsverge_followed_tipsters",
};

export const getStoredTipster = (): TipsterProfile | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_TIPSTER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveStoredTipster = (profile: TipsterProfile) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_TIPSTER, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save tipster", err);
  }
};

export const getStoredTips = (): Tip[] => {
  if (typeof window === "undefined") return INITIAL_TIPS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALL_TIPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ALL_TIPS, JSON.stringify(INITIAL_TIPS));
      return INITIAL_TIPS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TIPS;
  }
};

export const saveStoredTips = (tips: Tip[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.ALL_TIPS, JSON.stringify(tips));
  } catch (err) {
    console.error("Failed to save tips", err);
  }
};

export const getPurchasedTips = (): PurchasedTip[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASED_TIPS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const addPurchasedTip = (purchasedTip: PurchasedTip) => {
  if (typeof window === "undefined") return;
  try {
    const current = getPurchasedTips();
    const updated = [purchasedTip, ...current.filter((p) => p.tipId !== purchasedTip.tipId)];
    localStorage.setItem(STORAGE_KEYS.PURCHASED_TIPS, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save purchased tip", err);
  }
};

export const isTipPurchasedByUser = (tipId: string): boolean => {
  const purchased = getPurchasedTips();
  return purchased.some((p) => p.tipId === tipId);
};

export const createNewTip = (newTip: Tip) => {
  const current = getStoredTips();
  const updated = [newTip, ...current];
  saveStoredTips(updated);
  return updated;
};

export const updateExistingTip = (updatedTip: Tip) => {
  const current = getStoredTips();
  const updated = current.map((t) => (t.id === updatedTip.id ? updatedTip : t));
  saveStoredTips(updated);
  return updated;
};

export const deleteTipById = (tipId: string) => {
  const current = getStoredTips();
  const updated = current.filter((t) => t.id !== tipId);
  saveStoredTips(updated);
  return updated;
};

import { useSyncExternalStore } from "react";

// React 18/19 safe hook to check client hydration without triggering cascading render ESLint warnings
const emptySubscribe = () => () => {};
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

