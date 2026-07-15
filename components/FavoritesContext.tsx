"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const storedTeams = localStorage.getItem("fav_teams");
      const storedComps = localStorage.getItem("fav_competitions");
      
      if (storedTeams) {
        const parsed = JSON.parse(storedTeams);
        // Clear if they contain only the default items to clean up existing storage
        if (
          Array.isArray(parsed) &&
          parsed.length <= 2 &&
          parsed.every(t => t === "CSK" || t === "Man City" || t === "Manchester City")
        ) {
          setFavoriteTeams([]);
          localStorage.setItem("fav_teams", JSON.stringify([]));
        } else {
          setFavoriteTeams(parsed);
        }
      } else {
        setFavoriteTeams([]);
        localStorage.setItem("fav_teams", JSON.stringify([]));
      }

      if (storedComps) {
        const parsed = JSON.parse(storedComps);
        if (
          Array.isArray(parsed) &&
          parsed.length <= 2 &&
          parsed.every(c => c === "IPL 2026" || c === "Premier League")
        ) {
          setFavoriteCompetitions([]);
          localStorage.setItem("fav_competitions", JSON.stringify([]));
        } else {
          setFavoriteCompetitions(parsed);
        }
      } else {
        setFavoriteCompetitions([]);
        localStorage.setItem("fav_competitions", JSON.stringify([]));
      }
    } catch (e) {
      console.error("Error reading favorites from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Update localStorage when favorites change
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("fav_teams", JSON.stringify(favoriteTeams));
  }, [favoriteTeams, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("fav_competitions", JSON.stringify(favoriteCompetitions));
  }, [favoriteCompetitions, isHydrated]);

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
      (cleanA.includes("nfl") && cleanB.includes("nfl")) ||
      (cleanA.includes("afl") && cleanB.includes("afl"))
    );
  };

  const addFavoriteTeam = (team: string) => {
    if (!team || favoriteTeams.some(t => isTeamMatch(t, team))) return;
    setFavoriteTeams(prev => [...prev, team]);
    setToast({
      message: `Added ${team} to favorites!`,
      type: "success"
    });
  };

  const removeFavoriteTeam = (team: string) => {
    setFavoriteTeams(prev => prev.filter(t => !isTeamMatch(t, team)));
    setToast({
      message: `Removed ${team} from favorites!`,
      type: "danger"
    });
  };

  const addFavoriteCompetition = (comp: string) => {
    if (!comp || favoriteCompetitions.some(c => isCompMatch(c, comp))) return;
    setFavoriteCompetitions(prev => [...prev, comp]);
  };

  const removeFavoriteCompetition = (comp: string) => {
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
