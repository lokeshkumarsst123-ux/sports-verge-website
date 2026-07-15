"use client";

import React from "react";

export default function NewsSkeleton() {
  return (
    <div className="shimmer-wrapper">
      {/* Featured Article Skeleton */}
      <div className="mb-5">
        <div 
          className="rounded-4 overflow-hidden position-relative bg-card border border-dark d-flex align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="p-4 p-lg-5 w-100">
            <div style={{ maxWidth: "520px" }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="skeleton-line w-80px h-16px rounded-pill"></div>
                <div className="skeleton-line w-60px h-16px rounded-pill"></div>
              </div>
              <div className="skeleton-line w-100 h-32px mb-3"></div>
              <div className="skeleton-line w-75 h-32px mb-4"></div>
              <div className="skeleton-line w-100 h-16px mb-2"></div>
              <div className="skeleton-line w-100 h-16px mb-2"></div>
              <div className="skeleton-line w-50 h-16px mb-4"></div>
              <div className="d-flex align-items-center gap-3">
                <div className="skeleton-circle w-32px h-32px"></div>
                <div className="skeleton-line w-120px h-14px"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="row g-4">
        {[1, 2, 4, 5].map((i) => (
          <div className="col-md-6" key={i}>
            <div 
              className="rounded-3 overflow-hidden d-flex flex-column h-100 bg-card border border-dark"
              style={{ minHeight: "380px" }}
            >
              {/* Thumbnail */}
              <div className="skeleton-square w-100" style={{ height: "200px" }}></div>
              {/* Body */}
              <div className="p-4 d-flex flex-column flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="skeleton-circle w-18px h-18px"></div>
                  <div className="skeleton-line w-80px h-12px"></div>
                  <div className="skeleton-line w-40px h-12px"></div>
                </div>
                <div className="skeleton-line w-100 h-16px mb-2"></div>
                <div className="skeleton-line w-90 h-16px mb-3"></div>
                <div className="skeleton-line w-100 h-12px mb-2"></div>
                <div className="skeleton-line w-100 h-12px mb-4"></div>
                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-dark mt-auto">
                  <div className="skeleton-line w-80px h-14px"></div>
                  <div className="skeleton-line w-60px h-14px"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
