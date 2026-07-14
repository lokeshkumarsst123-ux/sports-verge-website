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
  { id: "AFL", label: "AFL", icon: "bi-shield-fill" },
];

export default function SportsTabs({ activeTab, onTabChange }: SportsTabsProps) {
  return (
    <div className="sports-tabs-container">
      <ul className="nav nav-pills custom-tabs d-flex flex-nowrap gap-2 pb-2 overflow-x-auto">
        {sports.map((sport) => {
          const isActive = activeTab === sport.id;
          return (
            <li className="nav-item flex-shrink-0" key={sport.id}>
              <button
                className={`nav-link px-4 py-2 d-flex align-items-center gap-2 fw-semibold text-nowrap transition-smooth ${isActive ? "active" : ""}`}
                onClick={() => onTabChange(sport.id)}
                type="button"
              >
                <i className={`bi ${sport.icon} ${isActive ? "text-white" : "text-muted"} fs-14`}></i>
                {sport.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
