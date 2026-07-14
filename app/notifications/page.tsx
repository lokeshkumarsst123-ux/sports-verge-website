"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFavorites } from "@/components/FavoritesContext";

const initialNotifications = [
  {
    id: 1,
    title: "Match Started: CSK vs RCB",
    message: "The highly anticipated IPL match has just begun at M. A. Chidambaram Stadium.",
    time: "2 mins ago",
    type: "match",
    sport: "cricket",
    isRead: false,
    link: "/live-scores/match-1"
  },
  {
    id: 2,
    title: "Goal! Manchester City scored",
    message: "Erling Haaland scores a brilliant header against Arsenal in the 55th minute.",
    time: "15 mins ago",
    type: "alert",
    sport: "football",
    isRead: false,
    link: "/live-scores/match-2"
  },
  {
    id: 3,
    title: "News Alert: Australia's Masterclass",
    message: "Australia clinches a nerve-wracking 6-run victory in a high-scoring ICC ODI against India.",
    time: "2 hours ago",
    type: "news",
    sport: "cricket",
    isRead: true,
    link: "#"
  },
  {
    id: 4,
    title: "Profile Updated",
    message: "Your account information was successfully updated.",
    time: "1 day ago",
    type: "system",
    sport: "system",
    isRead: true,
    link: "/profile"
  }
];

export default function NotificationsPage() {
  const { favoriteTeams } = useFavorites();
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    const personalized: typeof initialNotifications = [];
    
    favoriteTeams.forEach((team, index) => {
      const cleanTeam = team.trim();
      const lowerTeam = cleanTeam.toLowerCase();
      
      if (lowerTeam === "csk") {
        personalized.push({
          id: 100 + index,
          title: `🔥 Fan Alert: CSK Match Critical!`,
          message: `Your favorite team CSK is in a thrilling finish. They need 12 runs from 5 balls to win!`,
          time: "Just now",
          type: "match",
          sport: "cricket",
          isRead: false,
          link: "/live-scores/match-1"
        });
      } else if (lowerTeam === "manchester city" || lowerTeam === "man city") {
        personalized.push({
          id: 100 + index,
          title: `⚽ Goal! Manchester City Scored`,
          message: `Erling Haaland scored a clinical goal in the 55' against Arsenal! City leads 2-1.`,
          time: "15 mins ago",
          type: "alert",
          sport: "football",
          isRead: false,
          link: "/live-scores/match-2"
        });
      } else {
        // Generic customized notification for any other favorite team
        personalized.push({
          id: 100 + index,
          title: `⭐ Favorite Team Alert: ${cleanTeam}`,
          message: `Match schedule, player stats, and historical results have been updated for ${cleanTeam}.`,
          time: "5 mins ago",
          type: "alert",
          sport: "general",
          isRead: false,
          link: "/"
        });
      }
    });

    setNotifications([...personalized, ...initialNotifications]);
  }, [favoriteTeams]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (sport: string, type: string) => {
    if (type === "system") return "bi-gear-fill";
    if (type === "news") return "bi-newspaper";
    if (sport === "cricket") return "bi-activity";
    if (sport === "football") return "bi-dribbble";
    if (sport === "nfl") return "bi-trophy-fill";
    if (sport === "afl") return "bi-shield-fill";
    return "bi-bell-fill";
  };

  return (
    <div className="container py-5 min-h-80vh">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-white-10">
            <h2 className="text-white fw-semibold mb-0 fs-3">
              <i className="bi bi-bell-fill me-2 text-success"></i>
              Notifications
            </h2>
            {notifications.some(n => !n.isRead) && (
              <button 
                onClick={markAllAsRead} 
                className="btn btn-sm btn-outline-success px-3 rounded-pill fw-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="d-flex flex-column gap-3">
            {notifications.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-bell-slash text-muted fs-3rem"></i>
                <p className="text-muted mt-3">You have no notifications at the moment.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`card border-0 rounded-3 notification-card ${notification.isRead ? "read" : "unread"}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="card-body p-4 d-flex gap-3 align-items-center">
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 notification-icon-container ${notification.isRead ? 'bg-dark text-muted read' : 'bg-success text-white unread'}`}
                    >
                      <i className={`bi ${getIcon(notification.sport, notification.type)} fs-5`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className={`mb-0 ${notification.isRead ? 'text-white' : 'text-success fw-semibold'}`}>
                          <Link href={notification.link} className="text-decoration-none text-inherit">
                            {notification.title}
                          </Link>
                        </h6>
                        <span className="text-muted small fs-12 text-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className={`mb-0 small ${notification.isRead ? 'text-muted' : 'text-light fw-medium'}`}>
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="d-flex align-items-center ms-2">
                        <div className="rounded-circle bg-success unread-dot"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
