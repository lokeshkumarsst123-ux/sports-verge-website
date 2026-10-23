"use client";

import React, { useState } from "react";
import Link from "next/link";

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  time: string;
  sport: string;
  link: string;
  isRead: boolean;
};

const initialNotifications: NotificationItem[] = [
  { id: 1, title: "Match Started: CSK vs RCB", message: "The match has just begun.", time: "2 mins ago", sport: "cricket", link: "/live-scores", isRead: false },
  { id: 2, title: "Goal! Manchester City scored", message: "A new football match update is available.", time: "15 mins ago", sport: "football", link: "/live-scores?sport=football", isRead: false },
  { id: 3, title: "Latest sports updates", message: "Check the latest scores, fixtures and results.", time: "1 hour ago", sport: "sports", link: "/live-scores", isRead: true },
];

const iconFor = (sport: string) => sport === "football" ? "bi-dribbble" : sport === "cricket" ? "bi-activity" : "bi-trophy";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unread = notifications.some((notification) => !notification.isRead);
  const markAsRead = (id: number) => setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, isRead: true } : notification));
  const markAllAsRead = () => setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })));

  return (
    <main className="container custom-container py-5 min-vh-100 font-outfit">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="small text-uppercase fw-bold" style={{ color: "#4A90E2", letterSpacing: "0.08em" }}>Updates</div>
          <h1 className="fw-bold mb-0 font-space-grotesk" style={{ color: "#1C1F22" }}>
            <i className="bi bi-bell-fill me-2" style={{ color: "#FFCC00" }} />
            Notifications
          </h1>
        </div>
        {unread && (
          <button
            type="button"
            className="btn rounded-pill px-3 py-1.5 fw-semibold shadow-sm"
            style={{ background: "#FAF6EF", border: "1px solid #EAE5DC", color: "#1C1F22", fontSize: "13px" }}
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      <section className="d-flex flex-column gap-3">
        {notifications.length === 0 ? (
          <div className="card rounded-4 p-5 text-center shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EAE5DC" }}>
            <i className="bi bi-bell-slash text-muted fs-1 mb-3 d-block" />
            <p className="small mb-0" style={{ color: "#5C646D" }}>You have no notifications at the moment.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <article
              key={notification.id}
              className="card rounded-4 shadow-sm border-0 transition-all"
              style={{
                background: notification.isRead ? "#FFFFFF" : "#FFFDF9",
                border: notification.isRead ? "1px solid #EAE5DC" : "1px solid #FFCC00",
                cursor: "pointer",
              }}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="p-3 p-md-4 d-flex align-items-start gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    background: notification.isRead ? "#FAF6EF" : "#FFCC00",
                    color: notification.isRead ? "#5C646D" : "#1C1F22",
                    border: "1px solid #EAE5DC",
                    fontSize: "18px",
                  }}
                >
                  <i className={`bi ${iconFor(notification.sport)}`} />
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
                    <h2 className="h6 mb-0 fw-bold font-space-grotesk text-truncate" style={{ color: "#1C1F22" }}>
                      {notification.title}
                    </h2>
                    <span className="small text-nowrap" style={{ fontSize: "11px", color: "#76808D" }}>
                      {notification.time}
                    </span>
                  </div>
                  <p className="mb-2 small" style={{ color: "#5C646D" }}>
                    {notification.message}
                  </p>
                  <Link
                    href={notification.link}
                    className="small d-inline-flex align-items-center gap-1 text-decoration-none fw-semibold"
                    style={{ color: "#4A90E2" }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <span>View details</span>
                    <i className="bi bi-arrow-right-short"></i>
                  </Link>
                </div>
                {!notification.isRead && (
                  <span
                    className="rounded-circle flex-shrink-0"
                    style={{ width: "9px", height: "9px", background: "#FFCC00", marginTop: "6px" }}
                  />
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
