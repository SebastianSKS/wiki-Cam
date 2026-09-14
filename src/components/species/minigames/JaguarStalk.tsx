"use client";

/* ============================================================
   ACECHO SILENCIOSO · minijuego propio del jaguar
   ------------------------------------------------------------
   El jaguar caza al acecho: se acerca sin ruido y se congela en
   cuanto la presa mira hacia él (así se mueve de verdad en la Selva
   Maya de Calakmul). Aquí: mantén presionada la huella para avanzar;
   si el ojo se abre mientras te mueves, te descubre y retrocedes un
   poco. Llega hasta el ojo para "cazar" sin que te vean.

   Pointer Events (no mouse/touch por separado) para que funcione
   igual con dedo o cursor; `touch-action: none` evita que el hold
   arrastre la página en móvil.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { MinigameProps } from "./types";
import { EyeIcon, PawIcon } from "./icons";

const STEP = 2.6; // % de avance por tick mientras se sostiene sin ser visto
const TICK_MS = 110;
const CATCH_PENALTY = 24; // % que se pierde si te ven avanzando
const SAFE_MS = [1000, 1900] as const; // rango "a salvo" (ojo cerrado)
const WATCH_MS = [650, 1050] as const; // rango "alerta" (ojo abierto)

function randBetween([a, b]: readonly [number, number]) {
  return a + Math.random() * (b - a);
}

export function JaguarStalkGame({ reduced }: MinigameProps) {
  const [progress, setProgress] = useState(0);
  const [watching, setWatching] = useState(false);
  const [holding, setHolding] = useState(false);
  const [caught, setCaught] = useState(false);
  const caughtThisWatch = useRef(false);
  const won = progress >= 100;

  // Ciclo de vigilancia de la presa: alterna sola, sin depender de si
  // el jugador sostiene el botón.
  useEffect(() => {
    if (won) return;
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;
    const goSafe = () => {
      setWatching(false);
      caughtThisWatch.current = false;
      timer = setTimeout(goWatch, randBetween(SAFE_MS));
    };
    const goWatch = () => {
      if (!alive) return;
      setWatching(true);
      timer = setTimeout(goSafe, randBetween(WATCH_MS));
    };
    goSafe();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [won]);

  // Avance mientras se sostiene, y captura si te ven en el intento.
  useEffect(() => {
    if (won || !holding) return;
    const id = setInterval(() => {
      if (watching) {
        if (!caughtThisWatch.current) {
          caughtThisWatch.current = true;
          setCaught(true);
          setProgress((p) => Math.max(0, p - CATCH_PENALTY));
          window.setTimeout(() => setCaught(false), reduced ? 260 : 480);
        }
        return;
      }
      setProgress((p) => Math.min(100, p + STEP));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [holding, watching, won, reduced]);

  const press = () => {
    if (!won) setHolding(true);
  };
  const release = () => setHolding(false);
  const reset = () => {
    setProgress(0);
    setHolding(false);
    setCaught(false);
  };

  const message = won
    ? "¡Cacería exitosa! Ni un ruido."
    : caught
      ? "¡Te vio! Espera a que se calme."
      : holding
        ? watching
          ? "¡Alerta! Suelta ya…"
          : "Sigue así, con cuidado…"
        : "Sostén la huella para avanzar.";

  return (
    <div>
      <div
        className={cn(
          "relative h-16 overflow-hidden rounded-full border-[3px] bg-paper-2",
          caught ? "border-rust" : "border-line",
        )}
      >
        <div
          aria-hidden
          className="absolute left-[9%] right-[13%] top-1/2 h-0 -translate-y-1/2 border-t-2 border-dashed border-ink-faint/50"
        />
        <div
          aria-hidden
          className={cn(
            "absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-line bg-sun text-sun-ink",
            !reduced && "transition-[left] duration-150 ease-linear",
          )}
          style={{ left: `${9 + progress * 0.66}%` }}
        >
          <PawIcon className="h-6 w-6" />
        </div>
        <div
          aria-hidden
          className="absolute right-[7%] top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-[3px] border-line bg-paper"
        >
          <EyeIcon
            open={watching}
            className={cn("h-7 w-7", watching ? "text-rust" : "text-ink-soft")}
          />
        </div>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mt-3 min-h-[1.4em] text-center text-sm font-extrabold text-ink-soft"
      >
        {message}
      </p>

      {!won ? (
        <button
          type="button"
          onPointerDown={press}
          onPointerUp={release}
          onPointerLeave={release}
          onPointerCancel={release}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              press();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === " " || e.key === "Enter") release();
          }}
          style={{ touchAction: "none" }}
          className={cn(
            "mt-3 w-full select-none rounded-full border-[3px] border-line py-3 text-base font-extrabold shadow-[var(--shadow-toy)]",
            !reduced && "transition-transform duration-100",
            holding
              ? "translate-y-1 bg-rust text-coral-ink shadow-[var(--shadow-toy-press)]"
              : "bg-jungle text-jungle-ink hover:-translate-y-0.5",
          )}
        >
          {holding ? "Avanzando…" : "Sostén para avanzar"}
        </button>
      ) : (
        <div className="mt-3 space-y-3">
          <p className="rounded-2xl border-[3px] border-line bg-sun px-4 py-3 text-sm font-bold leading-snug text-sun-ink">
            En la Selva Maya de Calakmul, el jaguar es el gran depredador del
            corredor biológico: se acerca en silencio y ataca con una sola
            mordida certera, casi sin fallar.
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
