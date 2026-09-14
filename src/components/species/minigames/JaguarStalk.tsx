"use client";

/* ============================================================
   ACECHO SILENCIOSO · minijuego propio del jaguar
   ------------------------------------------------------------
   Segunda versión: la primera vivía aparte de la ilustración (una
   píldora con un punto deslizante y un ojo en un círculo) y se sentía
   un widget de formulario, no parte del libro. Ahora el escenario ES
   la ilustración real del jaguar (<SpeciesScene>, mismo marco/acuarela
   que la ficha) y quien actúa es el propio dibujo: se reutilizan los
   `[data-tail]`/`[data-eye]` que ya trae el SVG (los mismos que usa el
   guiño en hover) en vez de inventar iconos sueltos sobre una barra.

   Mantén presionado el escenario: el jaguar se acerca (la cola se
   mece) y dos huellas de tinta aparecen bajo el marco por cada mitad
   del camino. Si sus ojos brillan (alerta), suelta o lo escucha: si
   sigues sosteniendo, la cola se sobresalta, el escenario tiembla y
   retrocede un poco. Al llegar, salta con un rebote satisfecho.

   Una sola instrucción (la frase de registry.ts, en el encabezado del
   modal); el texto de aquí abajo sólo reacciona, nunca la repite ni
   la contradice — ver la nota de estilo en types.ts.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { SpeciesScene } from "@/components/illustration/SpeciesIllustration";
import type { MinigameProps } from "./types";
import { PawIcon } from "./icons";

const STEP = 2.6; // % de avance por tick mientras se sostiene sin ser visto
const TICK_MS = 110;
const CATCH_PENALTY = 24; // % que se pierde si te ven avanzando
const SAFE_MS = [1000, 1900] as const; // rango "a salvo" (ojos relajados)
const WATCH_MS = [650, 1050] as const; // rango "alerta" (ojos brillando)
const CREEP_PX = 22; // cuánto se acerca el escenario al llegar al 100%
const MARKS = [25, 50, 75, 100];

function randBetween([a, b]: readonly [number, number]) {
  return a + Math.random() * (b - a);
}

function findSvg(root: HTMLElement | null) {
  return root?.querySelector<SVGSVGElement>('svg[aria-label^="Ilustración"]') ?? null;
}

export function JaguarStalkGame({ reduced }: MinigameProps) {
  const [progress, setProgress] = useState(0);
  const [watching, setWatching] = useState(false);
  const [holding, setHolding] = useState(false);
  const [caughtFlash, setCaughtFlash] = useState(false);
  const caughtThisWatch = useRef(false);
  const won = progress >= 100;
  const hitRef = useRef<HTMLDivElement>(null);

  // Ciclo de vigilancia: los ojos del jaguar alternan solos entre relajados
  // y alerta, sin depender de si el jugador sostiene.
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

  // Avance mientras se sostiene, y captura (con sobresalto real de la cola)
  // si se sigue sosteniendo cuando los ojos brillan.
  useEffect(() => {
    if (won || !holding) return;
    const id = setInterval(() => {
      if (watching) {
        if (!caughtThisWatch.current) {
          caughtThisWatch.current = true;
          setCaughtFlash(true);
          setProgress((p) => Math.max(0, p - CATCH_PENALTY));
          const tail = findSvg(hitRef.current)?.querySelector<SVGElement>("[data-tail]");
          if (tail) {
            tail.style.animation = "none";
            void tail.getBoundingClientRect();
            tail.style.animation = "tail-wag 0.35s ease-in-out 1";
          }
          window.setTimeout(() => setCaughtFlash(false), reduced ? 260 : 480);
        }
        return;
      }
      setProgress((p) => Math.min(100, p + STEP));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [holding, watching, won, reduced]);

  // Ojos: se abren en grande y brillan mientras hay alerta (pista continua,
  // no sólo el instante del sobresalto), sin importar si se sostiene o no.
  useEffect(() => {
    const eyes = findSvg(hitRef.current)?.querySelectorAll<SVGElement>("[data-eye]");
    eyes?.forEach((eye) => {
      eye.style.transition = reduced ? "" : "transform 0.2s var(--ease-bounce), filter 0.2s";
      eye.style.transform = watching ? "scale(1.22)" : "";
      eye.style.filter = watching
        ? "drop-shadow(0 0 7px var(--rust)) drop-shadow(0 0 3px var(--rust))"
        : "";
    });
  }, [watching, reduced]);

  // Cola: se mece despacio mientras avanza a salvo; quieta en cualquier
  // otro momento (congelarse del todo es parte de la actuación).
  useEffect(() => {
    const tail = findSvg(hitRef.current)?.querySelector<SVGElement>("[data-tail]");
    if (!tail || won) return;
    tail.style.animation = holding && !watching ? "sway 1.3s ease-in-out infinite" : "";
  }, [holding, watching, won]);

  // Salto al ganar: un guiño satisfecho + la cola se acomoda.
  useEffect(() => {
    if (!won) return;
    const svg = findSvg(hitRef.current);
    svg?.querySelectorAll<SVGElement>("[data-eye]").forEach((eye) => {
      eye.style.animation = "blink 0.5s var(--ease-soft) 1";
    });
    const tail = svg?.querySelector<SVGElement>("[data-tail]");
    if (tail) tail.style.animation = "tail-wag 0.6s var(--ease-soft) 1";
  }, [won]);

  function press() {
    if (!won) setHolding(true);
  }
  function release() {
    setHolding(false);
  }
  function reset() {
    setProgress(0);
    setHolding(false);
    setCaughtFlash(false);
  }

  const caption = won
    ? "¡Cacería lista, ni lo escuchó!"
    : caughtFlash
      ? "¡Se puso alerta!"
      : holding
        ? "Shhh… se acerca sin hacer ruido."
        : "La selva está en silencio.";

  return (
    <div>
      <div
        ref={hitRef}
        role="button"
        tabIndex={won ? -1 : 0}
        aria-label="Mantén presionado para que el jaguar avance sin ruido; suelta si sus ojos brillan"
        aria-disabled={won}
        onPointerDown={(e) => {
          e.preventDefault();
          press();
        }}
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
          "jg-stage relative mx-auto block w-full max-w-[16rem] select-none rounded-[999px] outline-none",
          !won && "cursor-pointer",
          "focus-visible:ring-4 focus-visible:ring-sun/60",
          caughtFlash && !reduced && "jg-shake",
        )}
      >
        <div
          className={cn(!reduced && "transition-transform duration-500 ease-out")}
          style={{ transform: `translateX(${(progress / 100) * CREEP_PX}px)` }}
        >
          <SpeciesScene slug="jaguar" className="w-full" compact />
        </div>
      </div>

      {/* huellas: rastro de avance, no una barra */}
      <div aria-hidden className="mt-2.5 flex items-center justify-center gap-3">
        {MARKS.map((mark) => {
          const reached = progress >= mark;
          return (
            <PawIcon
              key={mark}
              className={cn(
                "h-4 w-4 text-ink-faint/50",
                !reduced && "transition-all duration-300",
                reached && "scale-125 text-rust",
              )}
            />
          );
        })}
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mt-2 min-h-[1.4em] text-center text-sm font-extrabold text-ink-soft"
      >
        {caption}
      </p>

      {won && (
        <div className="mt-1 space-y-3">
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

      <style>{`
        @keyframes jg-shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2.5deg); }
          75% { transform: rotate(2.5deg); }
        }
        .jg-shake { animation: jg-shake 0.4s ease-in-out 1; }
      `}</style>
    </div>
  );
}
