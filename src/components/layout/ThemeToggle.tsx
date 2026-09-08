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
    mode === "light" ? "Luz" : mode === "dark" ? "Oscuro" : "Sistema";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Tema actual: ${label}. Pulsa para cambiar.`}
      title={`Tema: ${label}`}
      className="catalog group inline-flex items-center gap-2 border border-current px-2 py-1.5 text-ink transition-colors hover:bg-ink hover:text-paper"
    >
      <span
        aria-hidden
        className="inline-block h-2.5 w-2.5 border border-current bg-index group-hover:bg-paper"
        style={{
          clipPath:
            mode === "dark"
              ? "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)"
              : mode === "light"
                ? "none"
                : "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
        }}
      />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
