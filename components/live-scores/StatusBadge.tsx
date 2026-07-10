"use client";

import React from "react";

interface StatusBadgeProps {
  status: "LIVE" | "BREAK" | "HALF TIME" | "1ST INNINGS" | "2ND INNINGS" | "FINISHED" | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normStatus = status.toUpperCase().trim();

  let bg = "rgba(255, 255, 255, 0.05)";
  let border = "1px solid rgba(255, 255, 255, 0.1)";
  let color = "#8a94a6";
  let isLive = false;
  let dotColor = "rgba(255, 255, 255, 0.4)";

  switch (normStatus) {
    case "LIVE":
      bg = "rgba(220, 53, 69, 0.12)";
      border = "1px solid rgba(220, 53, 69, 0.25)";
      color = "#ff5b5b";
      dotColor = "#ff5b5b";
      isLive = true;
      break;
    case "BREAK":
      bg = "rgba(241, 196, 15, 0.12)";
      border = "1px solid rgba(241, 196, 15, 0.25)";
      color = "#f1c40f";
      break;
    case "HALF TIME":
    case "HALF-TIME":
    case "HALFTIME":
      bg = "rgba(52, 152, 219, 0.12)";
      border = "1px solid rgba(52, 152, 219, 0.25)";
      color = "#3498db";
      break;
    case "1ST INNINGS":
    case "1ST-INNINGS":
    case "2ND INNINGS":
    case "2ND-INNINGS":
      bg = "rgba(26, 140, 61, 0.15)";
      border = "1px solid rgba(26, 140, 61, 0.3)";
      color = "#4ade80";
      dotColor = "#4ade80";
      isLive = true;
      break;
    case "FINISHED":
      bg = "rgba(255, 255, 255, 0.04)";
      border = "1px solid rgba(255, 255, 255, 0.08)";
      color = "#8a94a6";
      break;
    // Football-specific statuses
    case "SCHEDULED":
      bg = "rgba(99, 102, 241, 0.1)";
      border = "1px solid rgba(99, 102, 241, 0.25)";
      color = "#818cf8";
      break;
    case "KICK OFF":
      bg = "rgba(220, 53, 69, 0.12)";
      border = "1px solid rgba(220, 53, 69, 0.25)";
      color = "#ff5b5b";
      dotColor = "#ff5b5b";
      isLive = true;
      break;
    case "FIRST HALF":
      bg = "rgba(220, 53, 69, 0.12)";
      border = "1px solid rgba(220, 53, 69, 0.25)";
      color = "#ff5b5b";
      dotColor = "#ff5b5b";
      isLive = true;
      break;
    case "SECOND HALF":
      bg = "rgba(220, 53, 69, 0.12)";
      border = "1px solid rgba(220, 53, 69, 0.25)";
      color = "#ff5b5b";
      dotColor = "#ff5b5b";
      isLive = true;
      break;
    case "EXTRA TIME":
      bg = "rgba(249, 115, 22, 0.12)";
      border = "1px solid rgba(249, 115, 22, 0.3)";
      color = "#fb923c";
      dotColor = "#fb923c";
      isLive = true;
      break;
    case "PENALTY SHOOTOUT":
      bg = "rgba(168, 85, 247, 0.12)";
      border = "1px solid rgba(168, 85, 247, 0.3)";
      color = "#c084fc";
      dotColor = "#c084fc";
      isLive = true;
      break;
    case "POSTPONED":
      bg = "rgba(241, 196, 15, 0.12)";
      border = "1px solid rgba(241, 196, 15, 0.25)";
      color = "#f1c40f";
      break;
    case "CANCELLED":
      bg = "rgba(220, 53, 69, 0.08)";
      border = "1px solid rgba(220, 53, 69, 0.2)";
      color = "#ef4444";
      break;
    default:
      if (/\b(LIVE|Q\d|\d+('|MIN))\b/i.test(normStatus)) {
        bg = "rgba(220, 53, 69, 0.12)";
        border = "1px solid rgba(220, 53, 69, 0.25)";
        color = "#ff5b5b";
        dotColor = "#ff5b5b";
        isLive = true;
      }
      break;
  }

  return (
    <span
      className="d-inline-flex align-items-center gap-2 rounded-pill font-monospace fw-bold"
      style={{
        padding: "5px 12px",
        fontSize: "11px",
        letterSpacing: "0.5px",
        backgroundColor: bg,
        border: border,
        color: color
      }}
    >
      {isLive && (
        <span 
          className="rounded-circle animate-pulse-subtle" 
          style={{ 
            width: "6px", 
            height: "6px", 
            backgroundColor: dotColor,
            boxShadow: `0 0 8px ${dotColor}`,
            display: "inline-block"
          }}
        />
      )}
      {status}
    </span>
  );
}
