"use client";

import React from "react";

export default function LoadingSkeleton() {
  const cards = [1, 2, 3];

  return (
    <div className="d-flex flex-column gap-3 w-100">
      {cards.map((i) => (
        <div
          key={i}
          className="card bg-card border border-dark rounded-3 p-4 position-relative overflow-hidden shimmer-wrapper"
          style={{ height: "260px" }}
        >
          {/* Top Bar Skeleton */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-2">
              <div className="skeleton-circle" style={{ width: "24px", height: "24px" }}></div>
              <div className="skeleton-line" style={{ width: "120px", height: "16px" }}></div>
            </div>
            <div className="skeleton-line" style={{ width: "80px", height: "12px" }}></div>
          </div>

          {/* Title Skeleton */}
          <div className="skeleton-line mb-4" style={{ width: "240px", height: "14px" }}></div>

          {/* Content Row Skeleton */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-8 d-flex flex-column gap-3">
              {/* Team 1 */}
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="skeleton-square" style={{ width: "32px", height: "32px" }}></div>
                  <div className="skeleton-line" style={{ width: "150px", height: "16px" }}></div>
                </div>
                <div className="skeleton-line" style={{ width: "40px", height: "20px" }}></div>
              </div>
              {/* Team 2 */}
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="skeleton-square" style={{ width: "32px", height: "32px" }}></div>
                  <div className="skeleton-line" style={{ width: "150px", height: "16px" }}></div>
                </div>
                <div className="skeleton-line" style={{ width: "40px", height: "20px" }}></div>
              </div>
            </div>
            <div className="col-12 col-md-4 d-flex flex-row flex-md-column align-items-center justify-content-between justify-content-md-center gap-2 border-start-md ps-md-4">
              <div className="skeleton-line" style={{ width: "60px", height: "24px" }}></div>
              <div className="skeleton-line" style={{ width: "80px", height: "16px" }}></div>
            </div>
          </div>

          {/* Footer Skeleton */}
          <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-10 mt-auto">
            <div className="skeleton-line" style={{ width: "180px", height: "14px" }}></div>
            <div className="skeleton-line" style={{ width: "120px", height: "32px" }}></div>
          </div>
        </div>
      ))}

      {/* Styled shimmer animation using CSS embedded inline */}
      <style jsx global>{`
        .shimmer-wrapper {
          position: relative;
          overflow: hidden;
        }
        .skeleton-line,
        .skeleton-circle,
        .skeleton-square {
          background: #1c2735;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        .skeleton-circle {
          border-radius: 50%;
        }
        .skeleton-line::after,
        .skeleton-circle::after,
        .skeleton-square::after,
        .shimmer-wrapper::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.03) 20%,
            rgba(255, 255, 255, 0.08) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer-load 1.6s infinite;
        }
        @keyframes shimmer-load {
          100% {
            transform: translateX(100%);
          }
        }
        @media (min-width: 768px) {
          .border-start-md {
            border-start: 1px solid rgba(255, 255, 255, 0.05);
          }
        }
      `}</style>
    </div>
  );
}
