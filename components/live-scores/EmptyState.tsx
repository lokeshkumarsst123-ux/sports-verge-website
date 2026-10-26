"use client";

import React from "react";

interface EmptyStateProps {
  onReset?: () => void;
  message?: string;
}

export default function EmptyState({ onReset, message }: EmptyStateProps) {
  return (
    <div
      className="rounded-4 p-5 text-center d-flex flex-column align-items-center justify-content-center my-4 shadow-sm"
      style={{ background: "#FFFFFF", border: "1px solid #EAE5DC", minHeight: "340px" }}
    >
      <div
        className="d-flex align-items-center justify-content-center rounded-circle mb-4 animate-bounce shadow-sm"
        style={{ width: "68px", height: "68px", background: "#FAF6EF", border: "2px solid #FFCC00" }}
      >
        <i className="bi bi-calendar2-range-fill" style={{ fontSize: "26px", color: "#1C1F22" }}></i>
      </div>
      <h5 className="fw-bold mb-2 font-space-grotesk" style={{ color: "#1C1F22", fontSize: "1.3rem" }}>
        {message || "No Live Matches Available"}
      </h5>
      <p className="mb-4 mx-auto max-w-420px fs-14 lh-16" style={{ color: "#5C646D" }}>
        We couldn't find any ongoing matches matching your current criteria. Please check back later or try clearing your filters.
      </p>
      {onReset && (
        <button
          className="btn fw-bold text-uppercase px-4 py-2 shadow-sm transition-all"
          style={{ background: "#FFCC00", color: "#1C1F22", border: "none", borderRadius: "30px", fontSize: "12px", letterSpacing: "0.06em" }}
          onClick={onReset}
        >
          View All Live Matches
        </button>
      )}
      <style jsx global>{`
        .animate-bounce {
          animation: bounce-y 2s infinite;
        }
        @keyframes bounce-y {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}
