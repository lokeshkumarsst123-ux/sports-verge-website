"use client";

import React from "react";

interface SportsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sports = [
  { id: "all", label: "All Sports", icon: "bi-grid-fill" },
  { id: "cricket", label: "Cricket", icon: "bi-activity" },
  { id: "football", label: "Football", icon: "bi-dribbble" },
  { id: "NFL", label: "NFL", icon: "bi-trophy-fill" },
];

export default function SportsTabs({ activeTab, onTabChange }: SportsTabsProps) {
  return (
    <div className="sports-tabs-container w-100">
      <div className="d-flex flex-nowrap overflow-x-auto scrollbar-none gap-2 pb-1">
        {sports.map((sport) => {
          const isActive = activeTab === sport.id;
          return (
            <button
              key={sport.id}
              onClick={() => onTabChange(sport.id)}
              type="button"
              className="btn border-0 rounded-pill px-4 py-2 fw-bold text-uppercase flex-shrink-0 d-flex align-items-center gap-2 transition-all shadow-none"
              style={{
                fontSize: "12px",
                letterSpacing: "0.04em",
                backgroundColor: isActive ? "#FFCC00" : "#FAF8F5",
                color: isActive ? "#1C1F22" : "#64748B",
                border: `1px solid ${isActive ? "#FFCC00" : "#EAE5DC"}`,
                fontWeight: 700,
              }}
            >
              <i
                className={`bi ${sport.icon}`}
                style={{
                  fontSize: "13px",
                  color: isActive ? "#1C1F22" : "#94A3B8",
                }}
              />
              {sport.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
