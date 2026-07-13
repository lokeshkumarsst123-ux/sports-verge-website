"use client";

import React from "react";

interface EmptyStateProps {
  onReset?: () => void;
  message?: string;
}

export default function EmptyState({ onReset, message }: EmptyStateProps) {
  return (
    <div
      className="card bg-card border border-dark rounded-3 p-5 text-center d-flex flex-column align-items-center justify-content-center my-4 min-h-320px"
    >
      <div
        className="d-flex align-items-center justify-content-center text-success bg-success bg-opacity-10 rounded-circle mb-4 animate-bounce w-64px h-64px"
      >
        <i className="bi bi-calendar-x-fill text-success fs-28"></i>
      </div>
      <h5 className="text-white fw-bold mb-2">
        {message || "No Live Matches Available"}
      </h5>
      <p className="text-muted mb-4 mx-auto max-w-420px fs-14 lh-16">
        We couldn't find any ongoing matches matching your current criteria. Please check back later or try clearing your filters.
      </p>
      {onReset && (
        <button
          className="btn btn-outline-success px-4 py-2 fw-semibold text-uppercase fs-13 ls-05px"
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
