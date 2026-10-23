export type SportType = "Cricket" | "Football" | "NFL" | "AFL";

export type TipCategory =
  | "Match Winner"
  | "Over/Under"
  | "Both Teams To Score"
  | "Handicap"
  | "Toss Winner"
  | "First Goal Scorer"
  | "Player Prop"
  | "Outright";

export type ConfidenceLevel = "Low" | "Medium" | "High";

export type TipVisibility = "Free" | "Premium";

export type TipStatus = "Draft" | "Published" | "Scheduled" | "Settled" | "Won" | "Lost";

export type SubscriptionPlanType = "monthly" | "quarterly" | "annual";

export interface TipsterSubscriptionPlan {
  id: SubscriptionPlanType;
  name: string;
  price: number;
  billingPeriod: string;
  intervalText: string;
  badge?: string;
  popular?: boolean;
  savings?: string;
  features: string[];
}

export interface TipsterProfile {
  earnings?: { totals: {currency:string;amount:number;gross:number;refunded:number;disputed:number;net:number;connected:number;legacy:number;purchases:number}[]; unlocksCount:number;activeUnlocksCount:number;platformCommissionPercent:number;defaultCurrency:string };
  canPublish?: boolean;
  isSuspended?: boolean;
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
  email: string;
  mobileNumber?: string;
  country: string;
  preferredSports: SportType[];
  yearsOfExperience: number;
  shortBio: string;
  avatarUrl: string;
  socialLinks?: {
    twitter?: string;
    telegram?: string;
    instagram?: string;
    youtube?: string;
  };
  subscriptionStatus: "pending" | "active" | "inactive" | "expired";
  subscriptionPlan?: SubscriptionPlanType;
  subscriptionExpiresAt?: string;
  verificationStatus: "pending" | "verified" | "rejected";
  stats: {
    totalTips: number;
    publishedTips?: number;
    settledTips?: number;
    winRate: number | null; // percentage
    roi: number | null; // percentage
    profitUnits: number | null;
    followersCount: number;
    rating: number; // 1 to 5
    streak?: string | null;
  };
  createdAt: string;
}

export interface Tip {
  unlocked?: boolean;
  isOwnTip?: boolean;
  currency?: string;
  isHidden?: boolean;
  id: string;
  tipsterId: string;
  tipster: {
    id: string;
    displayName: string;
    username: string;
    avatarUrl: string;
    winRate: number;
    rating: number;
    isVerified: boolean;
  };
  sport: SportType;
  competition: string;
  match: string;
  teams: {
    home: string;
    away: string;
    homeLogo?: string;
    awayLogo?: string;
  };
  predictionTitle: string;
  predictionDescription: string;
  analysisSnippet?: string; // Visible for premium before unlock
  detailedAnalysis?: string; // Visible only when unlocked or free
  predictionCategory: TipCategory;
  odds: number;
  confidenceLevel: ConfidenceLevel;
  matchDate: string;
  kickoffTime: string;
  visibility: TipVisibility;
  premiumPrice?: number; // Amount in this tip's currency, e.g., 9.99
  status: TipStatus;
  result?: "won" | "lost" | "void" | "pending";
  likesCount: number;
  unlockedCount?: number;
  viewsCount: number;
  isTrending?: boolean;
  isFeatured?: boolean;
  publishedAt: string;
  scheduledPublishAt?: string;
}

export interface PurchasedTip {
  id: string;
  tipId: string;
  tip: Tip;
  userId: string;
  purchasePrice: number;
  purchasedAt: string;
  paymentId: string;
  status: "active" | "expired" | "refunded" | "disputed";
  currency?: string;
  contentAvailable?: boolean;
  expiresAt?: string | null;
}
