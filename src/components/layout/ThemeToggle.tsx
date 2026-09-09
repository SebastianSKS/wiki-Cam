"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark" | "system";

/** Aplica el tema antes de pintar para evitar parpadeo (se inyecta en <head>). */
export const themeInitScript = `
(function () {
  try {
    var s = localStorage.getItem("wc-theme");
    if (s === "light" || s === "dark") {
      document.documentElement.setAttribute("data-theme", s);
    }
  } catch (e) {}
})();
`;

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    try {
      const s = localStorage.getItem("wc-theme");
      if (s === "light" || s === "dark") setMode(s);
    } catch {}
  }, []);

  function apply(next: Mode) {
    setMode(next);
    const el = document.documentElement;
    try {
      if (next === "system") {
        el.removeAttribute("data-theme");
        localStorage.removeItem("wc-theme");
      } else {
        el.setAttribute("data-theme", next);
        localStorage.setItem("wc-theme", next);
      }
    } catch {}
  }

  function cycle() {
    apply(mode === "light" ? "dark" : mode === "dark" ? "system" : "light");
  }

  const label =
    mode === "light" ? "Día" : mode === "dark" ? "Noche" : "Auto";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Tema: ${
        mode === "system" ? "automático" : label
      }. Pulsa para cambiar.`}
      className="inline-flex h-8 items-center rounded-full border-[3px] border-line bg-lavender px-2 text-xs font-extrabold text-lavender-ink transition-transform duration-150 ease-[var(--ease-bounce)] hover:-translate-y-0.5 active:scale-95 sm:h-11 sm:px-4 sm:text-sm"
    >
      {label}
    </button>
  );
}
