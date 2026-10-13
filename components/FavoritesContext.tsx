"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, hasAuthSession, updateStoredUser } from "@/lib/auth-api";

type FavoritesContextType = {
  favoriteTeams: string[];
  favoriteCompetitions: string[];
  addFavoriteTeam: (team: string) => void;
  removeFavoriteTeam: (team: string) => void;
  addFavoriteCompetition: (comp: string) => void;
  removeFavoriteCompetition: (comp: string) => void;
  isFavoriteTeam: (team: string) => boolean;
  isFavoriteCompetition: (comp: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType>({
  favoriteTeams: [],
  favoriteCompetitions: [],
  addFavoriteTeam: () => {},
  removeFavoriteTeam: () => {},
  addFavoriteCompetition: () => {},
  removeFavoriteCompetition: () => {},
  isFavoriteTeam: () => false,
  isFavoriteCompetition: () => false,
});

export const useFavorites = () => useContext(FavoritesContext);

export default function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>([]);
  const [favoriteCompetitions, setFavoriteCompetitions] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "danger" | null }>({
    message: "",
    type: null
  });

  useEffect(() => {
    if (toast.type) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.type]);

  useEffect(() => {
    if (hasAuthSession()) {
      void authApi.getProfile().then((result) => {
        if (Array.isArray(result.data.user.favoriteTeams)) setFavoriteTeams(result.data.user.favoriteTeams);
        if (Array.isArray(result.data.user.favoriteCompetitions)) setFavoriteCompetitions(result.data.user.favoriteCompetitions);
      }).catch(() => undefined).finally(() => setIsHydrated(true));
    } else {
      localStorage.removeItem("fav_teams");
      localStorage.removeItem("fav_competitions");
      const frame = window.requestAnimationFrame(() => setIsHydrated(true));
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || !hasAuthSession()) return;
    void authApi.updateProfile({ favoriteTeams, favoriteCompetitions })
      .then((result) => updateStoredUser(result.data.user))
      .catch((error) => console.error("Unable to sync favorites to profile.", error));
  }, [favoriteTeams, favoriteCompetitions, isHydrated]);

  const requireAuthForFavorites = () => {
    if (hasAuthSession()) return true;
    if (typeof window !== "undefined") {
      const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const next = returnTo && returnTo !== "/" ? `?next=${encodeURIComponent(returnTo)}` : "";
      window.location.assign(`/login-required${next}`);
    }
    return false;
  };

  const isTeamMatch = (teamA: string, teamB: string) => {
    if (!teamA || !teamB) return false;
    const cleanA = teamA.toLowerCase().trim();
    const cleanB = teamB.toLowerCase().trim();
    return (
      cleanA === cleanB ||
      (cleanA.includes("man city") && cleanB.includes("manchester city")) ||
      (cleanA.includes("manchester city") && cleanB.includes("man city")) ||
      (cleanA.includes("man united") && cleanB.includes("manchester united")) ||
      (cleanA.includes("manchester united") && cleanB.includes("man united")) ||
      (cleanA.includes("chiefs") && cleanB.includes("chiefs")) ||
      (cleanA.includes("bills") && cleanB.includes("bills"))
    );
  };

  const isCompMatch = (compA: string, compB: string) => {
    if (!compA || !compB) return false;
    const cleanA = compA.toLowerCase().trim();
    const cleanB = compB.toLowerCase().trim();
    return (
      cleanA === cleanB ||
      cleanA.includes(cleanB) ||
      cleanB.includes(cleanA) ||
      (cleanA.includes("ipl") && cleanB.includes("ipl")) ||
      (cleanA.includes("nfl") && cleanB.includes("nfl"))
    );
  };

  const addFavoriteTeam = (team: string) => {
    if (!requireAuthForFavorites()) return;
    if (!team || favoriteTeams.some(t => isTeamMatch(t, team))) return;
    setFavoriteTeams(prev => [...prev, team]);
    setToast({
      message: `Added ${team} to favorites!`,
      type: "success"
    });
  };

  const removeFavoriteTeam = (team: string) => {
    if (!requireAuthForFavorites()) return;
    setFavoriteTeams(prev => prev.filter(t => !isTeamMatch(t, team)));
    setToast({
      message: `Removed ${team} from favorites!`,
      type: "danger"
    });
  };

  const addFavoriteCompetition = (comp: string) => {
    if (!requireAuthForFavorites()) return;
    if (!comp || favoriteCompetitions.some(c => isCompMatch(c, comp))) return;
    setFavoriteCompetitions(prev => [...prev, comp]);
  };

  const removeFavoriteCompetition = (comp: string) => {
    if (!requireAuthForFavorites()) return;
    setFavoriteCompetitions(prev => prev.filter(c => !isCompMatch(c, comp)));
  };

  const isFavoriteTeam = (team: string) => {
    if (!team) return false;
    return favoriteTeams.some(t => isTeamMatch(t, team));
  };

  const isFavoriteCompetition = (comp: string) => {
    if (!comp) return false;
    return favoriteCompetitions.some(c => isCompMatch(c, comp));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteTeams,
        favoriteCompetitions,
        addFavoriteTeam,
        removeFavoriteTeam,
        addFavoriteCompetition,
        removeFavoriteCompetition,
        isFavoriteTeam,
        isFavoriteCompetition,
      }}
    >
      {children}

      {toast.type && (
        <div 
          className="position-fixed bottom-4 end-4 z-5 animate-fade-in-up"
          style={{
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
          }}
        >
          <div className="d-flex align-items-center gap-3 px-4 py-3 rounded-3 shadow-lg border border-dark bg-dark" style={{ minWidth: "280px" }}>
            <div className="flex-shrink-0">
              {toast.type === "success" ? (
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", backgroundColor: "rgba(74, 222, 128, 0.2)" }}>
                  <i className="bi bi-star-fill text-success fs-14"></i>
                </div>
              ) : (
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", backgroundColor: "rgba(220, 53, 69, 0.2)" }}>
                  <i className="bi bi-trash-fill text-danger fs-14"></i>
                </div>
              )}
            </div>
            <div className="flex-grow-1">
              <div className="text-white fw-semibold small">{toast.message}</div>
            </div>
            <button 
              onClick={() => setToast({ message: "", type: null })}
              className="btn-close btn-close-white ms-auto p-1 fs-10 opacity-50 hover-opacity-100"
              style={{ filter: "invert(1) grayscale(1) brightness(2)" }}
            ></button>
          </div>
        </div>
      )}
    </FavoritesContext.Provider>
  );
}
