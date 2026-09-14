"use client";

/* ============================================================
   AULLIDO TERRITORIAL · minijuego propio del mono aullador negro
   ------------------------------------------------------------
   El saraguato no pelea por su territorio: lo aúlla. Su rugido es de
   los sonidos de animal terrestre más fuertes que existen y se oye a
   varios kilómetros dentro de la selva; al amanecer y al atardecer,
   las tropas se contestan a la distancia para marcar límites sin
   llegar a los golpes.

   Aquí: un juego de RITMO, no de sigilo (deliberadamente distinto en
   sensación al "Acecho silencioso" del jaguar, que era sostener/soltar).
   Cinco tiempos marcados; toca «¡Aúlla!» justo cuando cada punto se
   ilumina. Cada acierto alarga el aullido de tu tropa sobre la pista;
   si llega más allá de la marca de la tropa rival, ganas el territorio
   sin pelear — el mismo dato real que cierra el minijuego.

   El reloj usa performance.now() + una ref como fuente de verdad (no
   estado funcional anidado): el tick sólo fuerza un repintado. Un tap
   fuera de ventana no penaliza, para que se sienta justo con niños.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { MinigameProps } from "./types";
import { HowlIcon } from "./icons";

type BeatState = "pending" | "hit" | "miss";

const BEAT_COUNT = 5;
const BEATS = [900, 1650, 2400, 3150, 3900]; // ms desde que arranca la ronda
const BEAT_X = [10, 30, 50, 70, 90]; // % a lo largo de la pista
const HIT_WINDOW = 260; // ms de tolerancia a cada lado del tiempo exacto
const LEAD = 320; // ms antes del tiempo exacto en que el punto empieza a avisar
const WIN_THRESHOLD = 3; // aciertos de 5 para ganar el territorio
const RIVAL_X = 58; // % donde está la marca de la tropa rival
const ROUND_MS = BEATS[BEAT_COUNT - 1] + HIT_WINDOW + 150;

export function HowlerCall({ reduced }: MinigameProps) {
  const [phase, setPhase] = useState<"idle" | "playing" | "won" | "lost">(
    "idle",
  );
  const [pulse, setPulse] = useState(false);
  const statusRef = useRef<BeatState[]>(Array(BEAT_COUNT).fill("pending"));
  const startRef = useRef(0);
  const [, bump] = useState(0);

  // Ronda: arranca el reloj, resuelve tiempos vencidos como "miss" y decide
  // ganar/perder en cuanto los 5 quedan resueltos.
  useEffect(() => {
    if (phase !== "playing") return;
    startRef.current = performance.now();
    statusRef.current = Array(BEAT_COUNT).fill("pending");
    bump((n) => n + 1);

    const id = setInterval(() => {
      const elapsed = performance.now() - startRef.current;
      let changed = false;
      const next = statusRef.current.map((s, i) => {
        if (s === "pending" && elapsed > BEATS[i] + HIT_WINDOW) {
          changed = true;
          return "miss" as const;
        }
        return s;
      });
      if (changed) statusRef.current = next;
      bump((n) => n + 1);

      if (next.every((s) => s !== "pending") || elapsed > ROUND_MS) {
        clearInterval(id);
        const hits = next.filter((s) => s === "hit").length;
        setPhase(hits >= WIN_THRESHOLD ? "won" : "lost");
      }
    }, 50);
    return () => clearInterval(id);
  }, [phase]);

  function start() {
    setPhase("playing");
  }

  function tap() {
    if (phase !== "playing") return;
    const elapsed = performance.now() - startRef.current;
    const idx = statusRef.current.findIndex(
      (s, i) => s === "pending" && Math.abs(elapsed - BEATS[i]) <= HIT_WINDOW,
    );
    if (idx === -1) return; // toque suelto: no penaliza, simplemente no cuenta
    const next = [...statusRef.current];
    next[idx] = "hit";
    statusRef.current = next;
    bump((n) => n + 1);
    setPulse(true);
    window.setTimeout(() => setPulse(false), reduced ? 150 : 320);
  }

  function reset() {
    setPhase("idle");
  }

  const status = statusRef.current;
  const hits = status.filter((s) => s === "hit").length;
  const reachPct = (hits / BEAT_COUNT) * 100;
  const elapsedNow =
    phase === "playing" ? performance.now() - startRef.current : -1;

  const message =
    phase === "won"
      ? "¡Se escuchó hasta el otro lado de la selva!"
      : phase === "lost"
        ? "Casi… no llegó tan lejos como la tropa rival."
        : phase === "playing"
          ? "Sigue el ritmo…"
          : "Toca «¡Aúlla!» y sigue el ritmo.";

  return (
    <div>
      <div className="relative h-16 overflow-hidden rounded-full border-[3px] border-line bg-paper-2">
        {/* pista punteada */}
        <div
          aria-hidden
          className="absolute left-[6%] right-[6%] top-1/2 h-0 -translate-y-1/2 border-t-2 border-dashed border-ink-faint/50"
        />
        {/* territorio ya ganado por tu tropa */}
        <div
          aria-hidden
          className={cn(
            "absolute left-0 top-0 h-full rounded-full bg-jungle/35",
            !reduced && "transition-[width] duration-200 ease-out",
          )}
          style={{ width: `${reachPct}%` }}
        />
        {/* marca de la tropa rival */}
        <div
          aria-hidden
          title="Hasta dónde llega la tropa rival"
          className="absolute top-1/2 h-9 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rust/70"
          style={{ left: `${RIVAL_X}%` }}
        />
        {/* los 5 tiempos del aullido */}
        {BEATS.map((t, i) => {
          const live =
            phase === "playing" &&
            status[i] === "pending" &&
            elapsedNow >= t - LEAD &&
            elapsedNow <= t + HIT_WINDOW;
          return (
            <div
              key={i}
              aria-hidden
              className={cn(
                "absolute top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px]",
                status[i] === "hit" &&
                  "border-jungle-deep bg-jungle text-jungle-ink",
                status[i] === "miss" && "border-ink-faint/60 bg-paper text-ink-faint",
                status[i] === "pending" &&
                  (live
                    ? "border-sun bg-sun text-sun-ink"
                    : "border-line bg-paper text-ink-soft"),
                live && !reduced && "scale-110",
                !reduced && "transition-transform duration-150",
              )}
              style={{ left: `${BEAT_X[i]}%` }}
            >
              <HowlIcon className="h-4 w-4" />
            </div>
          );
        })}
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mt-3 min-h-[1.4em] text-center text-sm font-extrabold text-ink-soft"
      >
        {message}
      </p>

      {phase === "idle" || phase === "playing" ? (
        <button
          type="button"
          onClick={phase === "idle" ? start : tap}
          className={cn(
            "mt-3 w-full select-none rounded-full border-[3px] border-line py-3 text-base font-extrabold shadow-[var(--shadow-toy)]",
            !reduced && "transition-transform duration-100",
            pulse
              ? "translate-y-1 bg-sun text-sun-ink shadow-[var(--shadow-toy-press)]"
              : "bg-jungle text-jungle-ink hover:-translate-y-0.5",
          )}
        >
          {phase === "idle" ? "¡Aúlla! →" : "¡Aúlla!"}
        </button>
      ) : (
        <div className="mt-3 space-y-3">
          {phase === "won" && (
            <p className="rounded-2xl border-[3px] border-line bg-sun px-4 py-3 text-sm font-bold leading-snug text-sun-ink">
              El aullido del mono saraguato es de los sonidos de animal
              terrestre más fuertes que existen: se oye a varios kilómetros
              dentro de la selva. Al amanecer y al atardecer, las tropas
              aúllan para marcar su territorio y evitar peleas — la que se
              escucha más lejos lo gana sin pelear.
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            className="w-full rounded-full border-[3px] border-line bg-paper py-2.5 text-sm font-extrabold transition-transform hover:-translate-y-0.5"
          >
            {phase === "won" ? "Jugar de nuevo" : "Intentar de nuevo"}
          </button>
        </div>
      )}
    </div>
  );
}
