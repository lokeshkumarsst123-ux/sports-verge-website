"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  primaryColor: "#FFCC00",
  setPrimaryColor: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Client palette: Gold (#FFCC00) interactive anchor, Charcoal (#1C1F22) typography, Sky Blue (#4A90E2) highlights
  const [primaryColor, setPrimaryColor] = useState("#FFCC00");

  useEffect(() => {
    localStorage.setItem("admin_theme_color", "#FFCC00");
    setPrimaryColor("#FFCC00");
  }, []);

  useEffect(() => {
    const hoverColor = "#E6B800";
    const skyBlueColor = "#4A90E2";
    const skyHoverColor = "#357ABD";
    const transparentGold = "rgba(255, 204, 0, 0.2)";

    // Update CSS variables
    const root = document.documentElement;
    root.style.setProperty('--accent-gold', primaryColor);
    root.style.setProperty('--accent-gold-hover', hoverColor);
    root.style.setProperty('--accent-sky', skyBlueColor);
    root.style.setProperty('--accent-sky-hover', skyHoverColor);
    root.style.setProperty('--custom-primary', primaryColor);
    root.style.setProperty('--accent-green', primaryColor);
    root.style.setProperty('--accent-green-hover', hoverColor);
    root.style.setProperty('--bs-success', primaryColor);

    // Dynamic style tag to enforce client palette
    let styleEl = document.getElementById('dynamic-theme-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-theme-styles';
      document.head.appendChild(styleEl);
    }
    
    styleEl.innerHTML = `
      .text-success { color: ${skyBlueColor} !important; }
      .bg-success { background-color: ${primaryColor} !important; color: #1C1F22 !important; }
      .bg-success.bg-opacity-10 { background-color: ${transparentGold} !important; }
      .btn-success, .btn-signup { 
        background-color: ${primaryColor} !important; 
        border-color: ${primaryColor} !important; 
        color: #1C1F22 !important;
        font-weight: 700 !important;
      }
      .btn-success:hover, .btn-signup:hover {
        background-color: ${hoverColor} !important;
        border-color: ${hoverColor} !important;
        color: #1C1F22 !important;
      }
      .btn-success:disabled, .btn-signup:disabled {
        background-color: ${primaryColor} !important;
        border-color: ${primaryColor} !important;
        color: #1C1F22 !important;
        opacity: 0.65;
      }
      .btn-outline-success {
        color: #1C1F22 !important;
        border-color: #1C1F22 !important;
        background-color: transparent !important;
        font-weight: 600 !important;
      }
      .btn-outline-success:hover {
        background-color: ${primaryColor} !important;
        border-color: ${primaryColor} !important;
        color: #1C1F22 !important;
      }
      .border-success {
        border-color: ${primaryColor} !important;
      }
      .notification-badge {
        background-color: ${primaryColor} !important;
        color: #1C1F22 !important;
      }
      .custom-tabs .nav-link.active {
        background-color: ${primaryColor} !important;
        border-color: ${primaryColor} !important;
        color: #1C1F22 !important;
        font-weight: 700 !important;
      }
      .form-check-input:checked {
        background-color: ${primaryColor} !important;
        border-color: ${primaryColor} !important;
      }
      .form-switch .form-check-input:checked {
        background-color: ${primaryColor} !important;
        border-color: ${primaryColor} !important;
      }
      .footer-title::after {
        background-color: ${primaryColor} !important;
      }
      .score-box:hover, .fixture-card:hover, .news-card:hover, .player-card:hover {
        border-color: ${skyBlueColor} !important;
      }
      .search-input:focus {
        border-color: ${primaryColor} !important;
        box-shadow: 0 0 0 .25rem ${transparentGold} !important;
      }
      .btn-search {
        background-color: ${primaryColor} !important;
        color: #1C1F22 !important;
        font-weight: 700 !important;
      }
      .btn-search:hover {
        background-color: ${hoverColor} !important;
        color: #1C1F22 !important;
      }
      .carousel-caption h1, .carousel-caption h2, .carousel-caption h3,
      .custom-caption h1, .custom-caption h2, .custom-caption h3,
      .text-white-force {
        color: #FFFFFF !important;
      }
      .carousel-caption p, .custom-caption p {
        color: rgba(255, 255, 255, 0.95) !important;
      }
    `;

    localStorage.setItem("admin_theme_color", primaryColor);
  }, [primaryColor]);

  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
}
