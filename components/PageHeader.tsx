import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  verticalBarColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  badge,
  verticalBarColor = "var(--accent-green)",
  className = "mb-5",
  children,
}: PageHeaderProps) {
  return (
    <div className={`container custom-container ${className}`}>
      <div className="d-flex flex-column flex-md-row align-md-items-center justify-content-between gap-4">
        <div>
          {badge && (
            <span
              className="badge rounded-pill px-3 py-2 mb-3 fw-semibold text-uppercase"
              style={{
                fontSize: "11px",
                background: "rgba(26,140,61,0.15)",
                color: "#86efac",
                border: "1px solid rgba(26,140,61,0.3)",
                letterSpacing: "0.05em",
              }}
            >
              {badge}
            </span>
          )}
          <div className="d-flex align-items-center gap-3 mb-2">
            <span
              className="d-inline-block rounded"
              style={{ width: "4px", height: "32px", background: verticalBarColor, flexShrink: 0 }}
            ></span>
            <h1
              className="fw-bold text-white mb-0 font-space-grotesk text-uppercase"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "-0.02em" }}
            >
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-muted mb-0 ms-4 ps-1" style={{ fontSize: "14px" }}>
              {subtitle}
            </p>
          )}
        </div>
        {children && <div className="d-flex align-items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}
