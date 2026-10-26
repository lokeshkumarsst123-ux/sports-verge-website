const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

// When running on HTTPS in the browser and the target API is HTTP,
// use the /api/backend proxy to prevent browsers from blocking Mixed Content.
const isBrowser = typeof window !== "undefined";
const isHttps = isBrowser && window.location.protocol === "https:";
const isHttpApi = Boolean(configuredApiUrl && configuredApiUrl.startsWith("http://"));

export const API_BASE_URL = (
  isHttps && isHttpApi
    ? "/api/backend"
    : (configuredApiUrl || "http://localhost:4000/api/v1")
).replace(/\/+$/, "");

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
