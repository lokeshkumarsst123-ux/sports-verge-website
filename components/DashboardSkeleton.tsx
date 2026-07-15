"use client";

import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="container custom-container py-5 text-white font-outfit shimmer-wrapper">
      {/* Breadcrumb/Header */}
      <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom border-secondary border-opacity-10">
        <div>
          <div className="skeleton-line w-80px h-12px mb-2"></div>
          <div className="skeleton-line w-200px h-28px"></div>
        </div>
        <div className="skeleton-line w-100px h-32px rounded-2"></div>
      </div>

      <div className="row g-4">
        {/* Left Column: User details */}
        <div className="col-12 col-md-5">
          <div className="card bg-card border border-dark rounded-3 p-4">
            <div className="text-center mb-4 pb-3 border-bottom border-secondary border-opacity-10 d-flex flex-column align-items-center">
              <div className="skeleton-circle mb-3" style={{ width: "80px", height: "80px" }}></div>
              <div className="skeleton-line w-150px h-20px mb-2"></div>
              <div className="skeleton-line w-120px h-14px"></div>
            </div>

            <div className="d-flex flex-column gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="d-flex justify-content-between align-items-center">
                  <div className="skeleton-line w-80px h-12px"></div>
                  <div className="skeleton-line w-100px h-14px"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Quick actions */}
        <div className="col-12 col-md-7 d-flex flex-column gap-4">
          <div className="card bg-card border border-dark rounded-3 p-4">
            <div className="skeleton-line w-200px h-20px mb-4"></div>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="skeleton-line w-150px h-14px"></div>
                <div className="skeleton-line w-40px h-20px rounded-pill"></div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="skeleton-line w-150px h-14px"></div>
                <div className="skeleton-line w-40px h-20px rounded-pill"></div>
              </div>
            </div>
          </div>

          <div className="card bg-card border border-dark rounded-3 p-4">
            <div className="skeleton-line w-150px h-20px mb-2"></div>
            <div className="skeleton-line w-250px h-14px mb-4"></div>
            <div className="row g-2">
              <div className="col-6">
                <div className="skeleton-square w-100 h-80px rounded-3"></div>
              </div>
              <div className="col-6">
                <div className="skeleton-square w-100 h-80px rounded-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
