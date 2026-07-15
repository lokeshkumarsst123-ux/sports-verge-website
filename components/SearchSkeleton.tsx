"use client";

import React from "react";

export default function SearchSkeleton() {
  return (
    <div className="shimmer-wrapper">
      {/* Matches / Cards Grid Skeleton */}
      <div className="row g-4">
        {[1, 2, 3].map((i) => (
          <div className="col-md-6 col-lg-4" key={i}>
            <div className="card bg-card border border-dark rounded-3 h-100 overflow-hidden">
              <div className="card-header border-bottom border-dark bg-dark bg-opacity-30 d-flex justify-content-between align-items-center py-2 px-3">
                <div className="skeleton-line w-80px h-12px"></div>
                <div className="skeleton-line w-40px h-14px rounded-pill"></div>
              </div>
              <div className="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="skeleton-circle w-24px h-24px"></div>
                      <div className="skeleton-line w-120px h-14px"></div>
                    </div>
                    <div className="skeleton-line w-20px h-14px"></div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <div className="skeleton-circle w-24px h-24px"></div>
                      <div className="skeleton-line w-120px h-14px"></div>
                    </div>
                    <div className="skeleton-line w-20px h-14px"></div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-dark mt-auto">
                  <div className="skeleton-line w-60px h-14px"></div>
                  <div className="skeleton-line w-80px h-28px rounded-2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* News items list skeleton */}
      <div className="row g-4 mt-4">
        {[1, 2].map((i) => (
          <div className="col-md-6" key={i}>
            <div className="card bg-card border border-dark rounded-3 h-100 overflow-hidden p-0">
              <div className="row g-0 h-100">
                <div className="col-sm-4 bg-dark">
                  <div className="skeleton-square w-100 h-100" style={{ minHeight: "120px" }}></div>
                </div>
                <div className="col-sm-8">
                  <div className="card-body p-4 d-flex flex-column h-100">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="skeleton-line w-60px h-12px rounded-pill"></div>
                      <div className="skeleton-line w-80px h-12px"></div>
                    </div>
                    <div className="skeleton-line w-100 h-16px mb-2"></div>
                    <div className="skeleton-line w-90 h-16px mb-3"></div>
                    <div className="skeleton-line w-100 h-12px mb-1"></div>
                    <div className="skeleton-line w-100 h-12px"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
