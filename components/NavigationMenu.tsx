"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { mainMenuItems, MenuItem } from "@/config/navigation";
import { soccerApi } from "@/lib/sports-api";

export default function NavigationMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mainMenuItems);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadFootballMenu = async () => {
      try {
        const response = await soccerApi.competitions("per_page=50");
        const items = Array.isArray(response.items) ? response.items : [];
        const definitions = [
          { title: "Premier League", href: "/premier-league", matcher: "premier league" },
          { title: "La Liga", href: "/la-liga", matcher: "laliga" },
          { title: "Champions League", href: "/champions-league", matcher: "champions league" },
          { title: "Transfer Rumors", href: "/transfer-rumors", matcher: "" },
        ];
        const competitions = definitions.map((definition) => ({
          title: definition.title,
          href: definition.href,
          supplied: !definition.matcher || items.some((item) => String(item.cname || item.name || "").toLowerCase().includes(definition.matcher)),
        }));

        if (!cancelled && competitions.slice(0, 3).every((item) => item.supplied)) {
          setMenuItems(mainMenuItems.map((item) => item.title === "Football" ? { ...item, children: competitions.map(({ title, href }) => ({ title, href })) } : item));
        }
      } catch {
        // Keep the configured four links when the football provider is unavailable.
      }
    };

    void loadFootballMenu();
    return () => { cancelled = true; };
  }, []);

  const handleSubMenuClick = (title: string, e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.innerWidth < 1200) {
      e.preventDefault();
      e.stopPropagation();
      setOpenSubMenus((prev) => ({
        ...prev,
        [title]: !prev[title],
      }));
    }
  };

  // Helper to render nested items (submenus)
  const renderSubMenu = (child: MenuItem, index: number) => {
    if (child.children && child.children.length > 0) {
      const isOpen = !!openSubMenus[child.title];
      return (
        <li 
          className={`dropdown-submenu ${isOpen ? "show-mobile" : ""}`} 
          key={index}
        >
          <Link
            className="dropdown-item dropdown-toggle d-flex justify-content-between align-items-center"
            href={child.href}
            onClick={(e) => handleSubMenuClick(child.title, e)}
          >
            {child.title}
            <i 
              className="bi bi-chevron-right small transition-smooth"
              style={{ transform: isOpen ? "rotate(90deg)" : "none" }}
            ></i>
          </Link>
          <ul className="dropdown-menu">
            {child.children.map((grandchild, idx) => (
              <li key={idx}>
                <Link className="dropdown-item" href={grandchild.href}>
                  {grandchild.title}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      );
    }

    return (
      <li key={index}>
        <Link className="dropdown-item" href={child.href}>
          {child.title}
        </Link>
      </li>
    );
  };

  return (
    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 main-menu">
      {menuItems.map((item: MenuItem, index: number) => {
        if (item.children && item.children.length > 0) {
          return (
            <li className="nav-item dropdown" key={index}>
              <Link
                className={`nav-link dropdown-toggle ${item.hideArrow ? "hide-arrow" : ""}`}
                href={item.href}
                data-bs-toggle={isMobile ? "dropdown" : undefined}
                data-bs-auto-close={isMobile ? "outside" : undefined}
              >
                {item.title}
                {item.hideArrow ? (
                  item.icon && <i className={item.icon}></i>
                ) : (
                  <i className="bi bi-chevron-down ms-1" style={{ fontSize: "10px" }}></i>
                )}
              </Link>
              <ul className="dropdown-menu">
                {item.children.map((child, idx) => renderSubMenu(child, idx))}
              </ul>
            </li>
          );
        }

        return (
          <li className="nav-item" key={index}>
            <Link href={item.href} className="nav-link">
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
