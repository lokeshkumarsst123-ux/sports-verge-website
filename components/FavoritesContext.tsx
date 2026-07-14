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

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const storedTeams = localStorage.getItem("fav_teams");
      const storedComps = localStorage.getItem("fav_competitions");
      
      if (storedTeams) {
        setFavoriteTeams(JSON.parse(storedTeams));
      } else {
        // Pre-populate with defaults
        const defaultTeams = ["CSK", "Manchester City"];
        setFavoriteTeams(defaultTeams);
        localStorage.setItem("fav_teams", JSON.stringify(defaultTeams));
      }

      if (storedComps) {
        setFavoriteCompetitions(JSON.parse(storedComps));
      } else {
        // Pre-populate with defaults
        const defaultComps = ["IPL 2026", "Premier League"];
        setFavoriteCompetitions(defaultComps);
        localStorage.setItem("fav_competitions", JSON.stringify(defaultComps));
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

  const addFavoriteTeam = (team: string) => {
    if (!team || favoriteTeams.some(t => t.toLowerCase() === team.toLowerCase())) return;
    setFavoriteTeams(prev => [...prev, team]);
  };

  const removeFavoriteTeam = (team: string) => {
    setFavoriteTeams(prev => prev.filter(t => t.toLowerCase() !== team.toLowerCase()));
  };

  const addFavoriteCompetition = (comp: string) => {
    if (!comp || favoriteCompetitions.some(c => c.toLowerCase() === comp.toLowerCase())) return;
    setFavoriteCompetitions(prev => [...prev, comp]);
  };

  const removeFavoriteCompetition = (comp: string) => {
    setFavoriteCompetitions(prev => prev.filter(c => c.toLowerCase() !== comp.toLowerCase()));
  };

  const isFavoriteTeam = (team: string) => {
    if (!team) return false;
    return favoriteTeams.some(t => {
      // Direct match or partial word match (e.g. "Man City" matching "Manchester City" or vice versa)
      const cleanT = t.toLowerCase().trim();
      const cleanTeam = team.toLowerCase().trim();
      return (
        cleanT === cleanTeam ||
        (cleanT.includes("man city") && cleanTeam.includes("manchester city")) ||
        (cleanT.includes("manchester city") && cleanTeam.includes("man city")) ||
        (cleanT.includes("man united") && cleanTeam.includes("manchester united")) ||
        (cleanT.includes("manchester united") && cleanTeam.includes("man united"))
      );
    });
  };

  const isFavoriteCompetition = (comp: string) => {
    if (!comp) return false;
    return favoriteCompetitions.some(c => {
      const cleanC = c.toLowerCase().trim();
      const cleanComp = comp.toLowerCase().trim();
      return cleanC === cleanComp || cleanComp.includes(cleanC) || cleanC.includes(cleanComp);
    });
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
    </FavoritesContext.Provider>
  );
}
