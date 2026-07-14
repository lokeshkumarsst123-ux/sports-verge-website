"use client";

import React from "react";

export default function LoadingSkeleton() {
  const cards = [1, 2, 3];

  return (
    <div className="d-flex flex-column gap-3 w-100">
      {cards.map((i) => (
        <div
          key={i}
          className="card bg-card border border-dark rounded-3 p-4 position-relative overflow-hidden shimmer-wrapper h-260px"
        >
          {/* Top Bar Skeleton */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-2">
              <div className="skeleton-circle w-24px h-24px"></div>
              <div className="skeleton-line w-120px h-16px"></div>
            </div>
            <div className="skeleton-line w-80px h-12px"></div>
          </div>

          {/* Title Skeleton */}
          <div className="skeleton-line mb-4 w-240px h-14px"></div>

          {/* Content Row Skeleton */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-8 d-flex flex-column gap-3">
              {/* Team 1 */}
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="skeleton-square w-32px h-32px"></div>
                  <div className="skeleton-line w-150px h-16px"></div>
                </div>
                <div className="skeleton-line w-40px h-20px"></div>
              </div>
              {/* Team 2 */}
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="skeleton-square w-32px h-32px"></div>
                  <div className="skeleton-line w-150px h-16px"></div>
                </div>
                <div className="skeleton-line w-40px h-20px"></div>
              </div>
            </div>
            <div className="col-12 col-md-4 d-flex flex-row flex-md-column align-items-center justify-content-between justify-content-md-center gap-2 border-start-md ps-md-4">
              <div className="skeleton-line w-60px h-24px"></div>
              <div className="skeleton-line w-80px h-16px"></div>
            </div>
          </div>

          {/* Footer Skeleton */}
          <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-10 mt-auto">
            <div className="skeleton-line w-180px h-14px"></div>
            <div className="skeleton-line w-120px h-32px"></div>
          </div>
        </div>
      ))}

      
    </div>
  );
}
