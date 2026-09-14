"use client";

/* ============================================================
   COLA DE QUINTA MANO · minijuego propio del mono aullador negro
   ------------------------------------------------------------
   Segunda versión: la primera vivía en una pista con circulitos
   abstractos, separada de la ilustración — se sentía un widget, no
   parte del libro. Ahora el escenario ES la ilustración real del
   saraguato (<SpeciesScene>, mismo marco/acuarela que la ficha) y lo
   que se arrastra es su propia cola (el `[data-tail]` que ya trae el
   SVG, el mismo que usa el guiño en hover), no un token aparte.

   Arrastra en cualquier parte del escenario: la cola gira en vivo
   siguiendo el dedo/cursor (como si se estirara para alcanzar la
   rama) y brilla cuando ya estiró lo suficiente. Suéltala ahí: la
   cola completa el swing con rebote, las hojas del fondo se sacuden
   y el saraguato avanza un poco. Si sueltas antes de tiempo, la cola
   sólo regresa con un rebotito — sin castigo. Al tercer salto, canta
   (la boca y las notas que ya trae el dibujo se animan) y revela el
   dato real.

   Una sola instrucción (la frase de registry.ts, en el encabezado del
   modal); el texto de aquí abajo sólo reacciona, nunca la repite ni
   la contradice — ver la nota de estilo en types.ts.
   ============================================================ */

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { SpeciesScene } from "@/components/illustration/SpeciesIllustration";
import type { MinigameProps } from "./types";
import { BranchIcon } from "./icons";

const SWINGS_NEEDED = 3;
const MAX_DRAG_PX = 85; // arrastre que cuenta como "estiramiento completo"
const REQUIRED_PCT = 55; // % del arrastre máximo que hay que alcanzar para soltar bien
const MAX_ROTATE_DEG = 55;
const CREEP_PX = 18; // cuánto avanza el escenario por cada salto logrado

function findIllustrationSvg(root: HTMLElement | null) {
  return root?.querySelector<SVGSVGElement>('svg[aria-label^="Ilustración"]') ?? null;
}
function findBackdropSvg(root: HTMLElement | null) {
  return root?.querySelector<SVGSVGElement>('svg[aria-hidden="true"]') ?? null;
}

export function HowlerCall({ reduced }: MinigameProps) {
  const [swings, setSwings] = useState(0);
  const [missed, setMissed] = useState(false);
  const [justSwung, setJustSwung] = useState(false);
  const hitRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const dragPxRef = useRef(0);
  const won = swings >= SWINGS_NEEDED;

  function tailEl() {
    return findIllustrationSvg(hitRef.current)?.querySelector<SVGElement>("[data-tail]") ?? null;
  }

  function liveRotate(pct: number) {
    const tail = tailEl();
    if (!tail) return;
    tail.style.transition = "";
    tail.style.transform = `rotate(${pct * MAX_ROTATE_DEG}deg)`;
    tail.style.filter = pct * 100 >= REQUIRED_PCT ? "drop-shadow(0 0 6px var(--sun))" : "";
  }

  function rustleLeaves() {
    const backdrop = findBackdropSvg(hitRef.current);
    const leaves = backdrop?.querySelectorAll<SVGElement>(
      'path[fill="var(--jungle)"], path[fill="var(--jungle-deep)"]',
    );
    leaves?.forEach((leaf, i) => {
      leaf.style.transformBox = "fill-box";
      leaf.style.transformOrigin = "top center";
      leaf.style.animation = "none";
      void leaf.getBoundingClientRect();
      leaf.style.animation = `sway ${0.5 + i * 0.1}s ease-in-out 2`;
    });
  }

  function celebrate() {
    const svg = findIllustrationSvg(hitRef.current);
    const mouth = svg?.querySelector<SVGElement>('ellipse[fill="var(--coral)"]');
    if (mouth) {
      mouth.style.transformBox = "fill-box";
      mouth.style.transformOrigin = "center";
      mouth.style.animation = "none";
      void mouth.getBoundingClientRect();
      mouth.style.animation = "mk-pulse 0.4s var(--ease-bounce) 3";
    }
    const notes = svg?.querySelectorAll<SVGElement>('g[fill="var(--sky)"], path[stroke="var(--sky)"]');
    notes?.forEach((note, i) => {
      note.style.animation = "none";
      void note.getBoundingClientRect();
      note.style.animation = `mk-float-fade 1s ease-out ${i * 0.12}s 1 forwards`;
    });
  }

  function succeedSwing() {
    rustleLeaves();
    setJustSwung(true);
    window.setTimeout(() => setJustSwung(false), reduced ? 260 : 700);
    setSwings((s) => {
      const next = s + 1;
      if (next >= SWINGS_NEEDED) window.setTimeout(celebrate, reduced ? 0 : 180);
      return next;
    });
  }

  function onPointerDown(e: React.PointerEvent) {
    if (won) return;
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      // sin captura, igual sigue funcionando mientras el puntero no se salga
    }
    draggingRef.current = true;
    startXRef.current = e.clientX;
    dragPxRef.current = 0;
    liveRotate(0);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    const raw = e.clientX - startXRef.current;
    dragPxRef.current = Math.max(0, Math.min(raw, MAX_DRAG_PX));
    liveRotate(dragPxRef.current / MAX_DRAG_PX);
  }

  function onPointerEnd() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const pct = (dragPxRef.current / MAX_DRAG_PX) * 100;
    const tail = tailEl();
    const fromDeg = (dragPxRef.current / MAX_DRAG_PX) * MAX_ROTATE_DEG;

    if (tail) {
      tail.style.setProperty("--from", `${fromDeg}deg`);
      tail.style.filter = "";
      tail.style.transform = "";
      tail.style.animation = "none";
      void tail.getBoundingClientRect();
      tail.style.transition = "";
      tail.style.animation = reduced
        ? ""
        : pct >= REQUIRED_PCT
          ? "mk-swing-success 0.55s var(--ease-soft) 1"
          : "mk-swing-fail 0.45s var(--ease-soft) 1";
    }

    if (pct >= REQUIRED_PCT) {
      succeedSwing();
    } else {
      setMissed(true);
      window.setTimeout(() => setMissed(false), reduced ? 260 : 700);
    }
    dragPxRef.current = 0;
  }

  function reset() {
    setSwings(0);
    setMissed(false);
    setJustSwung(false);
    const svg = findIllustrationSvg(hitRef.current);
    const tail = svg?.querySelector<SVGElement>("[data-tail]");
    if (tail) {
      tail.style.animation = "";
      tail.style.transform = "";
      tail.style.filter = "";
    }
    const mouth = svg?.querySelector<SVGElement>('ellipse[fill="var(--coral)"]');
    if (mouth) mouth.style.animation = "";
    svg
      ?.querySelectorAll<SVGElement>('g[fill="var(--sky)"], path[stroke="var(--sky)"]')
      .forEach((note) => {
        note.style.animation = "";
        note.style.opacity = "";
        note.style.transform = "";
      });
  }

  const caption = won
    ? "¡Cruzó toda la copa cantando!"
    : missed
      ? "Casi… otra vez."
      : justSwung
        ? "¡Buen salto!"
        : "La copa de los árboles espera.";

  return (
    <div>
      <div
        ref={hitRef}
        role="button"
        tabIndex={won ? -1 : 0}
        aria-label="Arrastra la cola del saraguato hacia la rama y suéltala cuando brille"
        aria-disabled={won}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={(e) => {
          // alternativa accesible: sin arrastre que medir, cuenta el salto directo
          if ((e.key === "Enter" || e.key === " " || e.key === "ArrowRight") && !won) {
            e.preventDefault();
            succeedSwing();
          }
        }}
        style={{ touchAction: "none" }}
        className={cn(
          "relative mx-auto block w-full max-w-[16rem] select-none rounded-[999px] outline-none",
          !won && "cursor-grab active:cursor-grabbing",
          "focus-visible:ring-4 focus-visible:ring-sun/60",
        )}
      >
        <div
          className={cn(!reduced && "transition-transform duration-500 ease-out")}
          style={{ transform: `translateX(${swings * CREEP_PX}px)` }}
        >
          <SpeciesScene slug="mono-aullador-negro" className="w-full" compact />
        </div>
      </div>

      {/* ramas cruzadas: rastro de avance, no una barra */}
      <div aria-hidden className="mt-2.5 flex items-center justify-center gap-3">
        {Array.from({ length: SWINGS_NEEDED }, (_, i) => i + 1).map((mark) => {
          const reached = swings >= mark;
          return (
            <BranchIcon
              key={mark}
              className={cn(
                "h-4 w-4 text-ink-faint/50",
                !reduced && "transition-all duration-300",
                reached && "scale-125 text-jungle-deep",
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

      <style>{`
        @keyframes mk-swing-success {
          0% { transform: rotate(var(--from, 0deg)); }
          50% { transform: rotate(${MAX_ROTATE_DEG}deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes mk-swing-fail {
          0% { transform: rotate(var(--from, 0deg)); }
          55% { transform: rotate(-4deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes mk-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.35); }
        }
        @keyframes mk-float-fade {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-16px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
