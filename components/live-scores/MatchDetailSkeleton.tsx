"use client";

import React from "react";

export default function MatchDetailSkeleton() {
  return (
    <div className="container custom-container py-5 text-white font-outfit max-w-1000px shimmer-wrapper">
      {/* Breadcrumb Back Button */}
      <div className="mb-4">
        <div className="skeleton-line w-120px h-16px"></div>
      </div>

      {/* Scoreboard Header Card Skeleton */}
      <div className="card bg-card border border-dark rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mb-4 pb-3 border-bottom border-secondary border-opacity-10">
          <div className="skeleton-line w-150px h-12px"></div>
          <div className="d-flex align-items-center gap-3">
            <div className="skeleton-line w-80px h-24px rounded-pill"></div>
            <div className="skeleton-line w-100px h-16px"></div>
          </div>
        </div>

        {/* Scoreboard Row */}
        <div className="row align-items-center g-4 text-center my-2">
          {/* Team 1 */}
          <div className="col-12 col-sm-4 d-flex flex-column align-items-center gap-3">
            <div className="skeleton-circle" style={{ width: "80px", height: "80px" }}></div>
            <div className="skeleton-line w-150px h-20px"></div>
            <div className="skeleton-line w-80px h-14px"></div>
          </div>

          {/* Middle Score Display */}
          <div className="col-12 col-sm-4 d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex align-items-center justify-content-center gap-3">
              <div className="skeleton-line w-50px h-40px"></div>
              <div className="skeleton-line w-40px h-24px rounded-pill"></div>
              <div className="skeleton-line w-50px h-40px"></div>
            </div>
            <div className="skeleton-line w-180px h-16px mt-3"></div>
          </div>

          {/* Team 2 */}
          <div className="col-12 col-sm-4 d-flex flex-column align-items-center gap-3">
            <div className="skeleton-circle" style={{ width: "80px", height: "80px" }}></div>
            <div className="skeleton-line w-150px h-20px"></div>
            <div className="skeleton-line w-80px h-14px"></div>
          </div>
        </div>

        {/* Note banner */}
        <div className="skeleton-line w-100 h-40px rounded-3 mt-4"></div>
      </div>

      {/* Tabs */}
      <div className="d-flex border-bottom border-dark overflow-auto mb-4 gap-3 pb-2">
        <div className="skeleton-line w-100px h-32px"></div>
        <div className="skeleton-line w-100px h-32px"></div>
        <div className="skeleton-line w-100px h-32px"></div>
        <div className="skeleton-line w-100px h-32px"></div>
      </div>

      {/* Content */}
      <div className="row g-4">
        <div className="col-12 col-md-8">
          <div className="card bg-card border border-dark rounded-3 p-4 mb-4">
            <div className="skeleton-line w-200px h-20px mb-4"></div>
            <div className="row g-3">
              {[1, 2, 3, 4].map((i) => (
                <div className="col-6 col-sm-3" key={i}>
                  <div className="bg-dark bg-opacity-40 border border-secondary border-opacity-10 rounded-3 p-3 h-100">
                    <div className="skeleton-line w-60px h-10px mb-2"></div>
                    <div className="skeleton-line w-100px h-16px"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card bg-card border border-dark rounded-3 p-4">
            <div className="skeleton-line w-150px h-20px mb-4"></div>
            <div className="d-flex flex-column gap-3">
              {[1, 2, 3].map((i) => (
                <div className="skeleton-line w-100 h-40px rounded-3" key={i}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
