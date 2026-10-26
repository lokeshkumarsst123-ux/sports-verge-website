import { API_BASE_URL } from "@/lib/api-config";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  emailAlerts: boolean;
  pushNotifications: boolean;
  favoriteTeams: string[];
  favoriteCompetitions: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type AuthResponse = { accessToken: string; user: AuthUser };

type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
    details?: Array<{ field: string; message: string }>;
  };
};

export class ApiClientError extends Error {
  status: number;
  code?: string;
  fieldErrors: Record<string, string>;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.error?.message || "Request failed. Please try again.");
    this.name = "ApiClientError";
    this.status = status;
    this.code = payload.error?.code;
    this.fieldErrors = Object.fromEntries(
      (payload.error?.details || []).map((detail) => [detail.field, detail.message]),
    );
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  try {
    const session = JSON.parse(sessionStorage.getItem("user_session") || "null");
    return session?.accessToken || null;
  } catch {
    return null;
  }
};

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = (await response.json().catch(() => ({}))) as T & ApiErrorPayload;
  if (!response.ok) throw new ApiClientError(response.status, payload);
  return payload as T;
}

export const saveAuthSession = (auth: AuthResponse) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    "user_session",
    JSON.stringify({ accessToken: auth.accessToken, ...auth.user, user: auth.user }),
  );
  window.dispatchEvent(new Event("auth-session-changed"));
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const session = JSON.parse(sessionStorage.getItem("user_session") || "null");
    return session?.user || (session?.id ? session : null);
  } catch {
    return null;
  }
};

export const hasAuthSession = () => {
  if (typeof window === "undefined") return false;
  try {
    const session = JSON.parse(sessionStorage.getItem("user_session") || "null");
    return Boolean(session?.accessToken && (session?.user || session?.id));
  } catch {
    return false;
  }
};

export const updateStoredUser = (user: AuthUser) => {
  if (typeof window === "undefined") return;
  try {
    const session = JSON.parse(sessionStorage.getItem("user_session") || "null");
    if (session?.accessToken) {
      sessionStorage.setItem("user_session", JSON.stringify({ ...session, ...user, user }));
      window.dispatchEvent(new Event("auth-session-changed"));
    }
  } catch {
    // A later authenticated request will restore the session if storage is malformed.
  }
};

export const clearAuthSession = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("user_session");
    window.dispatchEvent(new Event("auth-session-changed"));
  }
};

export const logoutUser = async () => {
  try {
    await request<{ success: true; data: { message: string } }>("/auth/logout", { method: "POST" });
  } catch {
    // A logout must still clear the local session when the API is unavailable.
  } finally {
    clearAuthSession();
  }
};

export const authApi = {
  submitContact: (body: { fullName: string; email: string; subject: string; message: string }) =>
    request<{ success: true; data: { inquiry: { id: string; createdAt: string; status: string }; emailNotificationsSent: boolean } }>("/contact", { method: "POST", body }),
  register: (body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => request<{ success: true; data: AuthResponse }>("/auth/register", { method: "POST", body }),

  login: (body: { email: string; password: string }) =>
    request<{ success: true; data: AuthResponse }>("/auth/login", { method: "POST", body }),

  forgotPassword: (body: { email: string }) =>
    request<{ success: true; data: { message: string } }>("/auth/forgot-password", { method: "POST", body }),

  resetPassword: (body: { token: string; newPassword: string; confirmPassword: string }) =>
    request<{ success: true; data: { user: AuthUser } }>("/auth/reset-password", { method: "POST", body }),

  getProfile: () => request<{ success: true; data: { user: AuthUser } }>("/users/profile"),

  updateProfile: (body: Partial<Pick<AuthUser, "firstName" | "lastName" | "email" | "emailAlerts" | "pushNotifications" | "favoriteTeams" | "favoriteCompetitions">>) =>
    request<{ success: true; data: { user: AuthUser } }>("/users/profile", { method: "PATCH", body }),

  changePassword: (body: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    request<{ success: true; data: { user: AuthUser } }>("/users/profile/password", { method: "PATCH", body }),
};

export const apiErrorMessage = (error: unknown) =>
  error instanceof ApiClientError ? error.message : "Unable to reach the server. Please try again.";

export const apiFieldErrors = (error: unknown) =>
  error instanceof ApiClientError ? error.fieldErrors : {};
