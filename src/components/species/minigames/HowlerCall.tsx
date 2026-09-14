"use client";

/* ============================================================
   COLA DE QUINTA MANO · minijuego propio del mono aullador negro
   ------------------------------------------------------------
   Se evaluó usar el micrófono de verdad (getUserMedia + medir volumen
   con la Web Audio API) para que el niño "aullara" al dispositivo. Se
   descartó a propósito: pedir permiso de micrófono en un sitio
   educativo infantil es una fricción grande (aviso del navegador,
   "no" por defecto en muchos equipos de escuela, sin micrófono en
   varios dispositivos), agrega manejo de errores importante (permiso
   negado, sin hardware, contexto no seguro) y no se puede verificar
   de forma fiable en este entorno de pruebas. El aullido y su alcance
   ya viven en el hotspot "garganta" de la ficha (SpeciesDiscover); acá
   se cuenta OTRO rasgo real y muy concreto: la cola prensil, que el
   saraguato usa como una quinta mano para colgarse y moverse entre
   ramas sin usar las manos.

   Mecánica (distinta a sostener/soltar del jaguar y a tocar-en-tiempo
   de la versión anterior de este mismo juego): ARRASTRAR. El saraguato
   cuelga de una rama; se arrastra su cola hacia la siguiente rama y se
   suelta cuando el estirón llega a la zona marcada (se pone verde).
   Cruza las 5 ramas para llegar al otro lado de la copa.

   Sin temporizadores: es un puzle espacial de precisión, no de tiempo,
   así que no hay reloj que limpiar ni ronda que perder por tardarse.
   Fuente de verdad del arrastre en una ref (no estado funcional
   anidado), igual que en JaguarStalk/el resto de los minijuegos.
   ============================================================ */

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { MinigameProps } from "./types";
import { BranchIcon, TailHookIcon } from "./icons";

const BRANCH_X = [8, 30, 52, 74, 92]; // % a lo largo de la pista
const REQUIRED_DIST = [15, 15, 15, 12]; // % mínimo de arrastre para llegar a la siguiente
const LAST = BRANCH_X.length - 1;

export function HowlerCall({ reduced }: MinigameProps) {
  const [current, setCurrent] = useState(0);
  const [won, setWon] = useState(false);
  const [missed, setMissed] = useState(false);
  const [, bump] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const stretchRef = useRef(0);

  function pctFromClientX(clientX: number) {
    const track = trackRef.current;
    if (!track) return 0;
    const r = track.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * 100;
  }

  function gapWidth(i: number) {
    return BRANCH_X[i + 1] - BRANCH_X[i];
  }

  function advance() {
    const next = current + 1;
    setCurrent(next);
    setMissed(false);
    if (next === LAST) setWon(true);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (won || current >= LAST) return;
    // La captura evita perder el arrastre si el dedo se sale del óvalo; en
    // algún navegador/dispositivo puede fallar, así que no debe frenar el
    // resto del gesto si eso pasa.
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      // sin captura, igual sigue funcionando mientras el puntero no se
      // salga del óvalo
    }
    draggingRef.current = true;
    startXRef.current = pctFromClientX(e.clientX);
    stretchRef.current = 0;
    bump((n) => n + 1);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    const raw = pctFromClientX(e.clientX) - startXRef.current;
    stretchRef.current = Math.max(0, Math.min(raw, gapWidth(current)));
    bump((n) => n + 1);
  }

  function onPointerEnd() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const reached = stretchRef.current >= REQUIRED_DIST[current];
    stretchRef.current = 0;
    bump((n) => n + 1);
    if (reached) {
      advance();
    } else {
      setMissed(true);
      window.setTimeout(() => setMissed(false), reduced ? 300 : 900);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (won || current >= LAST) return;
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
      e.preventDefault();
      advance(); // alternativa accesible: sin arrastre que medir, salta directo
    }
  }

  function reset() {
    setCurrent(0);
    setWon(false);
    setMissed(false);
    stretchRef.current = 0;
  }

  const stretch = stretchRef.current;
  const ready = stretch >= REQUIRED_DIST[current];
  const monkeyLeft = won ? BRANCH_X[LAST] : BRANCH_X[current] + stretch;

  const message = won
    ? "¡Cruzó toda la copa usando la cola!"
    : missed
      ? "Casi… estira un poco más antes de soltar."
      : current === 0
        ? "Arrastra al saraguato y suéltalo cuando se ponga verde."
        : `¡Vas bien! Rama ${current + 1} de ${BRANCH_X.length}.`;

  return (
    <div>
      <div
        ref={trackRef}
        className="relative h-16 overflow-hidden rounded-full border-[3px] border-line bg-paper-2"
      >
        <div
          aria-hidden
          className="absolute left-[4%] right-[4%] top-1/2 h-0 -translate-y-1/2 border-t-2 border-dashed border-ink-faint/50"
        />

        {/* ramas: apoyos fijos del recorrido */}
        {BRANCH_X.map((x, i) => (
          <div
            key={i}
            aria-hidden
            className={cn(
              "absolute top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] bg-paper",
              i < current || won ? "border-jungle-deep text-jungle-deep" : "border-line text-ink-soft",
            )}
            style={{ left: `${x}%` }}
          >
            <BranchIcon className="h-4 w-4" />
          </div>
        ))}

        {/* marca de cuánto hay que estirar para llegar a la siguiente rama */}
        {!won && current < LAST && (
          <div
            aria-hidden
            className="absolute top-1/2 h-9 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun"
            style={{ left: `${BRANCH_X[current] + REQUIRED_DIST[current]}%` }}
          />
        )}

        {/* estirón de la cola, en vivo mientras se arrastra */}
        {stretch > 0 && (
          <div
            aria-hidden
            className={cn(
              "absolute top-1/2 h-3 -translate-y-1/2 rounded-full",
              ready ? "bg-jungle" : "bg-coral/70",
            )}
            style={{
              left: `${BRANCH_X[current]}%`,
              width: `${stretch}%`,
            }}
          />
        )}

        {/* el saraguato: aquí se arrastra */}
        <div
          role="button"
          tabIndex={won || current >= LAST ? -1 : 0}
          aria-label="Estira la cola del saraguato hacia la siguiente rama"
          aria-disabled={won}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onKeyDown={onKeyDown}
          style={{ left: `${monkeyLeft}%`, touchAction: "none" }}
          className={cn(
            "absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 select-none place-items-center rounded-full border-[3px] border-line bg-jungle text-jungle-ink shadow-[var(--shadow-toy)]",
            !draggingRef.current && !reduced && "transition-[left] duration-200 ease-out",
            !won && current < LAST && "cursor-grab active:cursor-grabbing",
          )}
        >
          <TailHookIcon className="h-6 w-6" />
        </div>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mt-3 min-h-[1.4em] text-center text-sm font-extrabold text-ink-soft"
      >
        {message}
      </p>

      {won && (
        <div className="mt-3 space-y-3">
          <p className="rounded-2xl border-[3px] border-line bg-sun px-4 py-3 text-sm font-bold leading-snug text-sun-ink">
            La cola del saraguato es una quinta mano de verdad: en la punta
            tiene un parche de piel sin pelo, con surcos como los de tus
            huellas digitales, que se pega a las ramas. Aguanta todo su peso:
            puede colgarse sólo de la cola mientras usa las manos para comer.
          </p>
          <button
            type="button"
            onClick={reset}
            className="w-full rounded-full border-[3px] border-line bg-paper py-2.5 text-sm font-extrabold transition-transform hover:-translate-y-0.5"
          >
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
