"use client";

import React from "react";

interface StatusBadgeProps {
  status: "LIVE" | "BREAK" | "HALF TIME" | "1ST INNINGS" | "2ND INNINGS" | "FINISHED" | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normStatus = status.toUpperCase().trim();

  let themeClass = "theme-gray";
  let isLive = false;

  switch (normStatus) {
    case "LIVE":
      themeClass = "theme-red";
      isLive = true;
      break;
    case "BREAK":
      themeClass = "theme-yellow";
      break;
    case "HALF TIME":
    case "HALF-TIME":
    case "HALFTIME":
      themeClass = "theme-blue";
      break;
    case "1ST INNINGS":
    case "1ST-INNINGS":
    case "2ND INNINGS":
    case "2ND-INNINGS":
      themeClass = "theme-green";
      isLive = true;
      break;
    case "FINISHED":
      themeClass = "theme-gray";
      break;
    // Football-specific statuses
    case "SCHEDULED":
      themeClass = "theme-indigo";
      break;
    case "KICK OFF":
      themeClass = "theme-red";
      isLive = true;
      break;
    case "FIRST HALF":
      themeClass = "theme-red";
      isLive = true;
      break;
    case "SECOND HALF":
      themeClass = "theme-red";
      isLive = true;
      break;
    case "EXTRA TIME":
      themeClass = "theme-orange";
      isLive = true;
      break;
    case "PENALTY SHOOTOUT":
      themeClass = "theme-purple";
      isLive = true;
      break;
    case "POSTPONED":
      themeClass = "theme-yellow";
      break;
    case "CANCELLED":
      themeClass = "theme-red-dim";
      break;
    default:
      if (/\b(LIVE|Q\d|\d+('|MIN))\b/i.test(normStatus)) {
        themeClass = "theme-red";
      isLive = true;
      }
      break;
  }

  return (
    <span className={`d-inline-flex align-items-center gap-2 rounded-pill font-monospace fw-bold status-badge ${themeClass}`}>
      {isLive && (
        <span className="rounded-circle animate-pulse-subtle status-dot status-dot-glow" />
      )}
      {status}
    </span>
  );
}
