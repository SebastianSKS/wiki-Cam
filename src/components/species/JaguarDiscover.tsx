"use client";

/* ============================================================
   TOCA PARA DESCUBRIR · prototipo (sólo jaguar)
   ------------------------------------------------------------
   Envuelve la ilustración hero del jaguar y le pone 2-3 puntos
   táctiles sobre partes concretas del dibujo. Al activarlos:
   una micro-animación en esa parte del SVG (reusa los keyframes
   del sistema de guiño: `twinkle`, `tail-wag`) y una notita
   adhesiva con un dato de una línea.

   Todo vive en este archivo. Para quitarlo:
     1. borra este archivo
     2. en `src/app/especies/[slug]/page.tsx`, deja el hero como
        estaba: `<SpeciesScene slug={species.slug} shared ... />`
        y quita el import de `JaguarDiscover`.
   No toca `SpeciesScene` ni `Jaguar.tsx`: engancha las partes
   del SVG por selector desde el contenedor.
   ============================================================ */

import { useEffect, useId, useRef, useState } from "react";
import { SpeciesScene } from "@/components/illustration/SpeciesIllustration";
import { cn } from "@/lib/cn";

type Place = "below" | "above" | "left" | "right";

type Spot = {
  id: string;
  label: string;
  /** centro del punto, en % del cuadro de la viñeta */
  x: number;
  y: number;
  place: Place;
  /** parte del SVG del jaguar a animar (selector dentro del contenedor) */
  selector: string;
  anim: { name: string; dur: string; iters: string; origin: string };
  fact: string;
};

const SPOTS: Spot[] = [
  {
    id: "rosetas",
    label: "Un dato sobre las manchas del jaguar",
    x: 50,
    y: 25,
    place: "above",
    selector: 'g[stroke-width="5.5"]',
    anim: { name: "twinkle", dur: "0.9s", iters: "1", origin: "center" },
    fact: "Sus manchas se llaman rosetas y casi todas tienen un puntito adentro.",
  },
  {
    id: "bigotes",
    label: "Un dato sobre los bigotes del jaguar",
    x: 32,
    y: 61,
    place: "right",
    selector: 'g[stroke="var(--ink-soft)"]',
    anim: { name: "jh-quiver", dur: "0.5s", iters: "2", origin: "center" },
    fact: "Con los bigotes siente lo que no alcanza a ver cuando anda de noche.",
  },
  {
    id: "cola",
    label: "Un dato sobre la cola del jaguar",
    x: 80,
    y: 49,
    place: "left",
    selector: "[data-tail]",
    anim: { name: "tail-wag", dur: "0.9s", iters: "2", origin: "top center" },
    fact: "Le sirve de timón cuando cruza un río nadando.",
  },
];

const BUBBLE_POS: Record<Place, string> = {
  below: "left-1/2 top-[calc(100%+10px)] -translate-x-1/2",
  above: "left-1/2 bottom-[calc(100%+10px)] -translate-x-1/2",
  left: "right-[calc(100%+12px)] top-1/2 -translate-y-1/2",
  right: "left-[calc(100%+12px)] top-1/2 -translate-y-1/2",
};

export function JaguarDiscover({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);
  const uid = useId();

  // prefers-reduced-motion (reactivo)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Cerrar al tocar fuera o con Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Micro-animación en la parte del SVG al abrir un punto
  useEffect(() => {
    if (!open || reduced) return;
    const spot = SPOTS.find((s) => s.id === open);
    const svg = rootRef.current?.querySelector<SVGSVGElement>(
      'svg[aria-label^="Ilustración de un jaguar"]',
    );
    const el = spot && svg?.querySelector<SVGElement>(spot.selector);
    if (!spot || !el) return;

    el.style.animation = "none";
    void el.getBoundingClientRect(); // reflow para poder re-disparar
    el.style.transformBox = "fill-box";
    el.style.transformOrigin = spot.anim.origin;
    el.style.animation = `${spot.anim.name} ${spot.anim.dur} var(--ease-soft) ${spot.anim.iters}`;

    const clear = () => {
      el.style.animation = "";
      el.style.transformBox = "";
      el.style.transformOrigin = "";
    };
    el.addEventListener("animationend", clear, { once: true });
    const t = window.setTimeout(clear, 1600);
    return () => {
      window.clearTimeout(t);
      el.removeEventListener("animationend", clear);
      clear();
    };
  }, [open, reduced]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <style>{`
        @keyframes jh-quiver {
          0%,100% { transform: translate(0,0); }
          20% { transform: translate(-1.5px, 1px); }
          40% { transform: translate(1.5px, -1px); }
          60% { transform: translate(-1px, 1px); }
          80% { transform: translate(1px, 0); }
        }
        @keyframes jh-pop {
          from { opacity: 0; transform: var(--jh-tw, translate(0,0)) scale(0.86); }
          to   { opacity: 1; transform: var(--jh-tw, translate(0,0)) scale(1); }
        }
        .jh-dot {
          position: relative; width: 22px; height: 22px; border-radius: 9999px;
          border: 2px solid var(--line);
          background: color-mix(in srgb, var(--paper) 70%, transparent);
          display: grid; place-items: center; cursor: pointer;
          transition: transform .15s var(--ease-bounce), background-color .15s linear;
        }
        .jh-dot::before {
          content: ""; width: 6px; height: 6px; border-radius: 9999px;
          background: var(--rust);
        }
        .jh-dot::after {
          content: ""; position: absolute; inset: -3px; border-radius: 9999px;
          border: 2px solid var(--rust); opacity: 0;
          animation: jh-ping 2.6s ease-out infinite;
        }
        @keyframes jh-ping {
          0% { transform: scale(.72); opacity: .55; }
          70% { opacity: 0; }
          100% { transform: scale(2); opacity: 0; }
        }
        .jh-dot:hover, .jh-dot:focus-visible { transform: scale(1.15); }
        .jh-dot[aria-expanded="true"] { background: var(--rust); }
        .jh-dot[aria-expanded="true"]::before { background: var(--paper); }
        .jh-bubble { animation: jh-pop .16s var(--ease-bounce) 1; }
        @media (prefers-reduced-motion: reduce) {
          .jh-dot::after { animation: none; opacity: .4; inset: -2px; }
          .jh-bubble { animation: none; }
        }
      `}</style>

      <SpeciesScene slug="jaguar" shared className="w-full" />

      {/* Capa de puntos: encima del dibujo, pero sin recortar los globitos */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {SPOTS.map((spot) => {
          const isOpen = open === spot.id;
          const bubbleId = `${uid}-${spot.id}`;
          return (
            <div
              key={spot.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              <button
                type="button"
                className="jh-dot pointer-events-auto"
                aria-label={spot.label}
                aria-expanded={isOpen}
                aria-controls={isOpen ? bubbleId : undefined}
                aria-describedby={isOpen ? bubbleId : undefined}
                onClick={() => setOpen((cur) => (cur === spot.id ? null : spot.id))}
              />
              {isOpen && (
                <span
                  id={bubbleId}
                  role="status"
                  className={cn(
                    "jh-bubble pointer-events-auto absolute z-20 w-max max-w-[190px] -rotate-2",
                    "rounded-2xl border-[3px] border-line bg-sun px-3 py-2",
                    "text-left text-[0.8rem] font-bold leading-snug text-sun-ink",
                    "shadow-[var(--card-shadow)]",
                    BUBBLE_POS[spot.place],
                  )}
                >
                  {spot.fact}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
