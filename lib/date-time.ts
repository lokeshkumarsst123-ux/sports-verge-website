const pad = (value: number) => String(value).padStart(2, "0");

export const getUserTimeZone = () => {
  if (typeof Intl === "undefined") return "UTC";
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
};

const getTimeZoneParts = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
};

const getTimeZoneOffset = (date: Date, timeZone: string) => {
  const parts = getTimeZoneParts(date, timeZone);
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second) - date.getTime();
};

/** Converts the date-picker's browser-local value into an unambiguous UTC ISO value. */
export const localDateTimeToIso = (value: string, timeZone = getUserTimeZone()) => {
  if (!value) return "";
  const [datePart, timePart = "00:00"] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  if (![year, month, day, hours, minutes].every(Number.isFinite)) return "";
  let utcMilliseconds = Date.UTC(year, month - 1, day, hours, minutes);
  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      utcMilliseconds = Date.UTC(year, month - 1, day, hours, minutes) - getTimeZoneOffset(new Date(utcMilliseconds), timeZone);
    }
  } catch {
    return "";
  }
  return new Date(utcMilliseconds).toISOString();
};

/** Converts a stored UTC ISO value back into the current browser's local date-picker value. */
export const isoToLocalDateTime = (value?: string | null, timeZone = getUserTimeZone()) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  try {
    const parts = getTimeZoneParts(date, timeZone);
    return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
  } catch {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
};

export const formatUserDate = (value?: string | null, includeTime = false) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(date);
};
