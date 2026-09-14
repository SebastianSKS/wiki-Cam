"use client";

/* ============================================================
   MINIJUEGO DE ESPECIE · icono "jugar" + modal, por especie
   ------------------------------------------------------------
   Igual que SpeciesDiscover: capa hermana de <SpeciesScene>, no la
   envuelve, y no importa ninguna ilustración (alcanza el <svg> por
   selector si algún día un minijuego necesita tocarlo). Se apoya en
   `registry.ts`: si el slug no tiene minijuego, este componente no
   monta nada — ni icono, ni clic, ni modal — así que en las otras
   especies no cambia nada todavía.

   Dos formas de abrirlo, para no depender sólo del mouse:
   1) el icono de la huella (esquina inf-der de la viñeta): un botón
      real, con foco de teclado y aria-label — la vía accesible.
   2) clic en cualquier parte de la ilustración que no sea un punto
      de "toca para descubrir" ni su notita: se engancha con un solo
      listener en el contenedor (el mismo truco que usa SpeciesDiscover
      para alcanzar el <svg>, por parentElement), así que NO se agrega
      ninguna capa con pointer-events encima de la ilustración y el
      guiño en hover (.illo-wink) sigue funcionando igual.

   No toca SpeciesDiscover.tsx ni SpeciesPhotoReveal.tsx.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { MINIGAMES } from "./minigames/registry";
import { PawIcon } from "./minigames/icons";

export function SpeciesMinigame({
  slug,
  speciesName,
}: {
  slug: string;
  speciesName: string;
}) {
  const badgeRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const game = MINIGAMES[slug];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Clic en la ilustración (fuera de los puntos "toca para descubrir").
  useEffect(() => {
    if (!game) return;
    const host = badgeRef.current?.parentElement;
    if (!host) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(".hp-dot") || t.closest('[role="status"]')) return;
      setOpen(true);
    };
    const prevCursor = host.style.cursor;
    host.style.cursor = "pointer";
    host.addEventListener("click", onClick);
    return () => {
      host.style.cursor = prevCursor;
      host.removeEventListener("click", onClick);
    };
  }, [game]);

  // Cerrar con Escape + bloquear el scroll de fondo mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!game) return null;
  const { Component, title, tagline } = game;

  return (
    <>
      <button
        ref={badgeRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        title={`Jugar: ${title}`}
        aria-label={`Jugar «${title}», el minijuego de ${speciesName}`}
        className="sm-badge absolute bottom-2 right-2 z-20 grid h-10 w-10 place-items-center rounded-full border-[3px] border-line bg-sun text-sun-ink shadow-[var(--shadow-toy)] transition-transform duration-150 ease-[var(--ease-bounce)] hover:-translate-y-0.5 hover:scale-105 active:scale-95"
      >
        <PawIcon className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="presentation"
          className="fixed inset-0 z-[60] grid place-items-center bg-ink/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="species-minigame-title"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-sm rounded-[28px] border-[4px] border-line bg-paper p-5 pt-7 shadow-[var(--shadow-toy)]",
              !reduced && "sm-pop",
            )}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar minijuego"
              className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full border-[3px] border-line bg-paper text-lg font-extrabold text-ink shadow-[var(--shadow-toy)] transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              ×
            </button>
            <p className="hand -mt-1 text-base text-ink-faint">minijuego</p>
            <h3
              id="species-minigame-title"
              className="font-display text-2xl leading-tight text-jungle-deep"
            >
              {title}
            </h3>
            <p className="mt-1 text-sm text-ink-soft">{tagline}</p>
            <div className="mt-4">
              <Component reduced={reduced} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sm-badge { position: absolute; }
        .sm-badge::after {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          border: 2px solid var(--sun);
          opacity: 0;
          animation: sm-ping 2.4s ease-out infinite;
        }
        @keyframes sm-ping {
          0% { transform: scale(0.8); opacity: 0.5; }
          70% { opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .sm-pop { animation: sm-pop 0.22s var(--ease-bounce) 1; }
        @keyframes sm-pop {
          from { opacity: 0; transform: scale(0.92) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sm-badge::after { animation: none; opacity: 0.35; inset: -3px; }
          .sm-pop { animation: none; }
        }
      `}</style>
    </>
  );
}
