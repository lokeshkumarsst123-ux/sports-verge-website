"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mainMenuItems, MenuItem } from "@/config/navigation";

export default function NavigationMenu() {
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

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
      {mainMenuItems.map((item: MenuItem, index: number) => {
        if (item.children && item.children.length > 0) {
          return (
            <li className="nav-item dropdown" key={index}>
              <Link
                className={`nav-link dropdown-toggle ${item.hideArrow ? "hide-arrow" : ""}`}
                href={item.href}
                data-bs-toggle="dropdown"
              >
                {item.title}
                {item.icon && <i className={item.icon}></i>}
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
