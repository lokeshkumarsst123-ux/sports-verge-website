import { API_BASE_URL } from "./api-config";
import { ApiClientError, getStoredUser } from "./auth-api";
import type { Tip, TipsterProfile, PurchasedTip } from "@/types/tipster";
export function isOwnTipsterProfile(tipsterId: string) {
  const userId = getStoredUser()?.id;
  return Boolean(userId && userId.toLowerCase() === tipsterId.toLowerCase());
}
export async function tipsterRequest<T>(
  path: string,
  options: { method?: string; body?: unknown; admin?: boolean } = {},
): Promise<T> {
  let session;
  try {
    session =
      typeof window === "undefined"
        ? null
        : JSON.parse(
            sessionStorage.getItem(
              options.admin ? "admin_session" : "user_session",
            ) || "null",
          );
  } catch {
    session = null;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {}),
    },
    ...(options.body === undefined
      ? {}
      : { body: JSON.stringify(options.body) }),
  });
  const payload = await response.json();
  if (!response.ok) throw new ApiClientError(response.status, payload);
  return payload.data;
}
export type BillingPlan = {
  id: "monthly" | "quarterly" | "annual";
  configured: boolean;
  price?: number;
  currency?: string;
};
export type Subscription = {
  stripe_subscription_id: string;
  status: string;
  plan: string;
  hasAccess: boolean;
  current_period_end: string;
  paid_through: string;
  cancel_at_period_end: boolean;
};
export type ConnectFinancials = {connected:boolean;available:{currency:string;amount:number}[];pending:{currency:string;amount:number}[];payouts:{id:string;amount:number;currency:string;status:string;arrivalDate:string;createdAt:string}[]};
export type ConnectAccountStatus = {
  accountStatus: "not_connected" | "pending" | "ready";
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
};
export const tipsterApi = {
  createProfile: async (profile: unknown, photo: File | null) => {
    if (!photo) return tipsterRequest<{profile:TipsterProfile}>("/tipster/profile", {method:"POST",body:profile});
    const session = JSON.parse(sessionStorage.getItem("user_session") || "null");
    const body = new FormData(); body.append("profile",JSON.stringify(profile)); body.append("photo",photo);
    const response = await fetch(`${API_BASE_URL}/tipster/profile`, {method:"POST", headers:session?.accessToken?{Authorization:`Bearer ${session.accessToken}`}:{},body});
    const payload = await response.json();
    if (!response.ok) throw new ApiClientError(response.status,payload);
    return payload.data as {profile:TipsterProfile};
  },
  uploadPhoto: async (file: File) => {
    const stored = JSON.parse(sessionStorage.getItem("user_session") || "null");
    const body = new FormData(); body.append("photo", file);
    const response = await fetch(`${API_BASE_URL}/tipster/profile/photo`, { method:"POST", headers:stored?.accessToken?{Authorization:`Bearer ${stored.accessToken}`}:{}, body });
    const payload = await response.json();
    if (!response.ok) throw new ApiClientError(response.status,payload);
    return payload.data as {avatarUrl:string};
  },
  publicProfile: (id: string) => tipsterRequest<{profile:TipsterProfile;tips:Tip[]}>(`/tipster/tipsters/${encodeURIComponent(id)}`),
  editorOptions: (sport: string) => tipsterRequest<{competitions:string[];currency:string}>(`/tipster/editor-options?sport=${encodeURIComponent(sport)}`),
  me: () => tipsterRequest<{ profile: TipsterProfile | null }>("/tipster/me"),
  tips: () => tipsterRequest<{ tips: Tip[] }>("/tipster/tips"),
  tip: (id: string) =>
    tipsterRequest<{ tip: Tip }>(`/tipster/tips/${encodeURIComponent(id)}`),
  mine: () => tipsterRequest<{ tips: Tip[] }>("/tipster/my-tips"),
  tipsters: () =>
    tipsterRequest<{ tipsters: TipsterProfile[] }>("/tipster/tipsters"),
  purchases: () =>
    tipsterRequest<{ purchases: PurchasedTip[] }>("/tipster/purchases"),
  create: (body: unknown) =>
    tipsterRequest<{ id: string }>("/tipster/tips", { method: "POST", body }),
  update: (id: string, body: unknown) =>
    tipsterRequest<{ id: string }>(`/tipster/tips/${id}`, {
      method: "PATCH",
      body,
    }),
  remove: (id: string) =>
    tipsterRequest(`/tipster/tips/${id}`, { method: "DELETE" }),
  follows: () => tipsterRequest<{ ids: string[] }>("/tipster/follows"),
  follow: (id: string, follow: boolean) => {
    if (follow && isOwnTipsterProfile(id)) {
      return Promise.reject(new Error("You cannot follow your own Tipster profile."));
    }
    return tipsterRequest(`/tipster/follow/${id}`, {
      method: "POST",
      body: { follow },
    });
  },
};
export const billingApi = {
  plans: () =>
    tipsterRequest<{ plans: BillingPlan[] }>("/billing/plans/tipster"),
  subscriptions: () =>
    tipsterRequest<{ tipster: Subscription | null }>("/billing/subscriptions"),
  connectFinancials: () => tipsterRequest<ConnectFinancials>("/billing/connect-account/financials"),
  connectAccountStatus: () =>
    tipsterRequest<ConnectAccountStatus>("/billing/connect-account"),
  connectAccount: () =>
    tipsterRequest<{ url: string }>("/billing/connect-account/onboarding", {
      method: "POST",
    }),
  connectDashboard: () =>
    tipsterRequest<{ url: string }>("/billing/connect-account/dashboard", {
      method: "POST",
    }),
  setup: (plan: string) =>
    tipsterRequest<PaymentPreparation>("/billing/create-setup-intent", {
      method: "POST",
      body: { plan },
    }),
  tipPayment: (tipId: string) =>
    tipsterRequest<PaymentPreparation>("/billing/one-time-tip-payment", {
      method: "POST",
      body: { tipId },
    }),
  activate: (orderId: string, setupIntentId: string) =>
    tipsterRequest<PaymentPreparation>("/billing/activate-subscription", {
      method: "POST",
      body: { orderId, setupIntentId },
    }),
  paymentStatus: (id: string) =>
    tipsterRequest<{ hasAccess: boolean; status: string; destination: string }>(
      `/billing/payments/${encodeURIComponent(id)}`,
    ),
  cancel: (id: string, atPeriodEnd = true) =>
    tipsterRequest("/billing/cancel-subscription", {
      method: "POST",
      body: { stripe_subscription_id: id, cancel_at_period_end: atPeriodEnd },
    }),
  status: (id: string) =>
    tipsterRequest<{ hasAccess: boolean; status: string; destination: string }>(
      `/billing/checkout/${encodeURIComponent(id)}`,
    ),
  portal: () =>
    tipsterRequest<{ url: string }>("/billing/portal", { method: "POST" }),
};
export type PaymentPreparation = {
  orderId: string;
  mode: "setup" | "payment" | "ready" | "complete";
  client_secret?: string;
  publishable_key: string;
  setup_intent_id?: string;
  payment_method?: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  customer_id: string;
};
export const money = (amount: number, currency = "aud") =>
  new Intl.NumberFormat("en", { style: "currency", currency }).format(amount);
