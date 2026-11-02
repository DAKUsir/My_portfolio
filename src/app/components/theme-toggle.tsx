"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";
const themeEvent = "portfolio-theme-change";

function subscribeToTheme(onChange: () => void) {
  window.addEventListener(themeEvent, onChange);
  return () => window.removeEventListener(themeEvent, onChange);
}

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    window.localStorage.setItem("portfolio-theme", theme);
  } catch {
    // The theme still changes for this visit when storage is unavailable.
  }
  window.dispatchEvent(new Event(themeEvent));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    try {
      if (window.localStorage.getItem("portfolio-theme") === "dark") {
        applyTheme("dark");
      }
    } catch {
      // Keep the light default when storage is unavailable.
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  };

  return (
    <button
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      aria-pressed={theme === "dark"}
      className="theme-toggle"
      onClick={toggleTheme}
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      type="button"
    >
      {theme === "light" ? (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M16.4 12.3A6.8 6.8 0 0 1 7.7 3.6 6.8 6.8 0 1 0 16.4 12.3Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="3.2" />
          <path d="M10 1.8v2M10 16.2v2M18.2 10h-2M3.8 10h-2m14-5.8-1.4 1.4M5.6 14.4l-1.4 1.4m11.6 0-1.4-1.4M5.6 5.6 4.2 4.2" />
        </svg>
      )}
    </button>
  );
}
