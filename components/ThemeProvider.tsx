"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  primaryColor: "#1a8c3d",
  setPrimaryColor: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default color is the current green (#1a8c3d)
  const [primaryColor, setPrimaryColor] = useState("#1a8c3d");

  useEffect(() => {
    // Reset to default green theme color
    localStorage.setItem("admin_theme_color", "#1a8c3d");
    setPrimaryColor("#1a8c3d");
  }, []);

  useEffect(() => {
    // Function to calculate a darker color for hover states
    const darkenHex = (hex: string, percent: number) => {
      hex = hex.replace(/^\s*#|\s*$/g, '');
      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      const newR = Math.max(0, Math.floor(r * (1 - percent)));
      const newG = Math.max(0, Math.floor(g * (1 - percent)));
      const newB = Math.max(0, Math.floor(b * (1 - percent)));
      
      return '#' + [newR, newG, newB].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    const hoverColor = darkenHex(primaryColor, 0.15);
    const transparentColor = primaryColor + '15'; // ~8% opacity

    // Update CSS variables
    const root = document.documentElement;
    root.style.setProperty('--accent-green', primaryColor);
    root.style.setProperty('--accent-green-hover', hoverColor);
    root.style.setProperty('--custom-primary', primaryColor);
    root.style.setProperty('--bs-success', primaryColor);

    // Create a dynamic style tag to force override bootstrap and custom classes
    let styleEl = document.getElementById('dynamic-theme-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-theme-styles';
      document.head.appendChild(styleEl);
    }
    
    styleEl.innerHTML = `
      .text-success { color: ${primaryColor} !important; }
      .bg-success { background-color: ${primaryColor} !important; }
      .bg-success.bg-opacity-10 { background-color: ${transparentColor} !important; }
      .btn-success, .btn-signup { 
        background-color: ${primaryColor} !important; 
        border-color: ${primaryColor} !important; 
      }
      .btn-success:hover, .btn-signup:hover {
        background-color: ${hoverColor} !important;
        border-color: ${hoverColor} !important;
      }
      .btn-success:disabled, .btn-signup:disabled {
        background-color: ${primaryColor} !important;
        border-color: ${primaryColor} !important;
      }
      .btn-outline-success {
        color: ${primaryColor} !important;
        border-color: ${primaryColor} !important;
      }
      .btn-outline-success:hover {
        background-color: ${primaryColor} !important;
        color: #fff !important;
      }
      .border-success {
        border-color: ${primaryColor} !important;
      }
      .notification-badge {
        background-color: ${primaryColor} !important;
      }
      .custom-tabs .nav-link.active {
        background-color: ${primaryColor} !important;
        border-color: ${primaryColor} !important;
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
        border-color: ${primaryColor} !important;
      }
      .search-input:focus {
        border-color: ${primaryColor} !important;
        box-shadow: 0 0 0 .25rem ${transparentColor} !important;
      }
      .btn-search {
        background-color: ${primaryColor} !important;
      }
      .btn-search:hover {
        background-color: ${hoverColor} !important;
      }
    `;

    // Save to localStorage
    localStorage.setItem("admin_theme_color", primaryColor);
  }, [primaryColor]);

  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
}
