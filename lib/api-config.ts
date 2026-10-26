const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

// When running in the browser on HTTPS (like on Vercel deployment),
// always route through /api/backend proxy to completely avoid CORS and Mixed Content issues.
const isBrowser = typeof window !== "undefined";
const isHttps = isBrowser && window.location.protocol === "https:";

export const API_BASE_URL = (
  isHttps
    ? "/api/backend"
    : (configuredApiUrl || "http://localhost:4000/api/v1")
).replace(/\/+$/, "");

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
