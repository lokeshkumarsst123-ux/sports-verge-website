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
    <main className="container custom-container py-5 min-vh-100">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><div className="text-success small text-uppercase fw-semibold">Updates</div><h1 className="text-white fw-bold mb-0"><i className="bi bi-bell-fill me-2 text-success" />Notifications</h1></div>{unread && <button type="button" className="btn btn-outline-success btn-sm" onClick={markAllAsRead}>Mark all as read</button>}</div>
      <section className="d-flex flex-column gap-3">
        {notifications.length === 0 ? <div className="card bg-card border border-dark rounded-3 p-5 text-center"><i className="bi bi-bell-slash text-muted fs-3rem" /><p className="text-muted mt-3 mb-0">You have no notifications at the moment.</p></div> : notifications.map((notification) => <article key={notification.id} className={`card border-0 rounded-3 notification-card ${notification.isRead ? "read" : "unread"}`} onClick={() => markAsRead(notification.id)}><div className="p-3 d-flex align-items-start gap-3"><div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 notification-icon-container ${notification.isRead ? "bg-dark text-muted read" : "bg-success text-white unread"}`}><i className={`bi ${iconFor(notification.sport)} fs-5`} /></div><div className="flex-grow-1"><div className="d-flex justify-content-between gap-3"><h2 className={`h6 mb-1 ${notification.isRead ? "text-white" : "text-success fw-semibold"}`}>{notification.title}</h2><span className="text-muted small text-nowrap">{notification.time}</span></div><p className={`mb-0 small ${notification.isRead ? "text-muted" : "text-light fw-medium"}`}>{notification.message}</p><Link href={notification.link} className="text-success small d-inline-block mt-2" onClick={(event) => event.stopPropagation()}>View details</Link></div>{!notification.isRead && <span className="rounded-circle bg-success unread-dot flex-shrink-0" />}</div></article>)}
      </section>
    </main>
  );
}
