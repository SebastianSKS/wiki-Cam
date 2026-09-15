"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

const TITLE = ["Las criaturas", "que sólo viven", "en Campeche"];
const TITLE_COLOR = ["var(--jungle-deep)", "var(--ink)", "var(--rust)"];

/* ----------------------------------------------------------------
   Escenografía de la portada (siempre de día: un solo tema en todo
   el sitio). Ninguna pieza lleva el filtro de acuarela: son
   elementos que se mueven en cada frame y feTurbulence se
   re-rasterizaría siempre (era el lag).
   ---------------------------------------------------------------- */

function DayScene() {
  const reduce = useReducedMotion();
  const flap = reduce
    ? {}
    : {
        animate: { rotate: [-6, 8, -6] },
        transition: {
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    <div className="amb-day pointer-events-none absolute inset-0 overflow-hidden">
      {/* sol (algo más apagado, con contorno) */}
      <svg
        className="amb-float absolute right-[6%] top-[7%] h-16 w-16 md:h-24 md:w-24"
        viewBox="0 0 100 100"
      >
        <g
          stroke="var(--cacao)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        >
          <g stroke="var(--sun)" strokeWidth="7" opacity="0.85">
            <path d="M50 12v-6M50 94v-6M12 50H6M94 50h-6M23 23l-5-5M82 82l-5-5M77 23l5-5M18 82l5-5" />
          </g>
          <circle cx="50" cy="50" r="21" fill="var(--sun)" />
          <circle cx="43" cy="48" r="2.6" fill="var(--cacao)" />
          <circle cx="57" cy="48" r="2.6" fill="var(--cacao)" />
          <path d="M44 57q6 6 12 0" />
        </g>
      </svg>

      {/* nube (blanco cálido, no puro) */}
      <svg
        className="absolute left-[-14%] top-[24%] h-14 w-40 [animation:drift-x_46s_linear_infinite]"
        viewBox="0 0 160 60"
      >
        <g stroke="var(--cacao)" strokeWidth="4">
          <path
            d="M30 46c-16 0-24-10-20-24 4-12 18-14 26-6 4-16 28-18 36-4 14-4 26 6 24 20-2 12-14 14-24 14Z"
            fill="#fdf4e1"
          />
        </g>
      </svg>

      {/* mariposas */}
      {[
        { c: "left-[11%] top-[56%]", d: "9s", fill: "var(--coral)" },
        { c: "right-[15%] top-[62%]", d: "7.5s", fill: "var(--lavender)" },
        { c: "left-[40%] top-[15%]", d: "11s", fill: "var(--sky)" },
      ].map((b, i) => (
        <svg
          key={i}
          className={`amb-float absolute ${b.c} h-9 w-9`}
          style={{ animationDuration: b.d }}
          viewBox="0 0 60 60"
        >
          <motion.g style={{ transformOrigin: "30px 30px" }} {...flap}>
            <g
              stroke="var(--cacao)"
              strokeWidth="4"
              strokeLinejoin="round"
            >
              <path d="M30 30c-4-16-24-20-24-6 0 12 14 16 24 6Z" fill={b.fill} />
              <path d="M30 30c4-16 24-20 24-6 0 12-14 16-24 6Z" fill={b.fill} />
              <path d="M30 30c-3 10-20 12-20 2 0-8 12-10 20-2Z" fill={b.fill} />
              <path d="M30 30c3 10 20 12 20 2 0-8-12-10-20-2Z" fill={b.fill} />
              <path d="M30 20v20" stroke="var(--cacao)" strokeWidth="5" />
            </g>
          </motion.g>
        </svg>
      ))}

      {[
        { c: "left-[70%] top-[9%]", d: "13s" },
        { c: "left-[22%] top-[40%]", d: "16s" },
      ].map((l, i) => (
        <svg
          key={`l${i}`}
          className={`amb-sway absolute ${l.c} h-8 w-8`}
          style={{ animationDuration: l.d }}
          viewBox="0 0 50 50"
        >
          <g stroke="var(--cacao)" strokeWidth="4">
            <path d="M25 6c14 6 18 26 6 38C17 32 13 14 25 6Z" fill="var(--jungle)" />
            <path d="M25 12v28" stroke="var(--jungle-deep)" strokeWidth="3" />
          </g>
        </svg>
      ))}
    </div>
  );
}

export function StorybookCover({
  speciesCount,
  regionCount,
}: {
  speciesCount: number;
  regionCount: number;
}) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (reduce) return;
    setArmed(true);
    setShown(false);
    const raf = requestAnimationFrame(() => setShown(true));
    const failsafe = window.setTimeout(() => setShown(true), 1400);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
    };
  }, [reduce]);

  useEffect(() => {
    if (reduce || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-ambient] .amb-day svg", {
        yPercent: (i: number) => -6 - (i % 4) * 4,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduce]);

  const item = cn(
    "transition-[opacity,transform] duration-700 ease-[var(--ease-bounce)]",
    armed && !shown && "opacity-0 translate-y-8",
    armed && shown && "opacity-100 translate-y-0",
  );
  const delay = (i: number) =>
    armed ? { transitionDelay: `${i * 90}ms` } : undefined;

  return (
    <section
      ref={rootRef}
      className="relative isolate overflow-hidden px-4 pb-14 pt-10 sm:px-8"
      aria-label="Portada"
    >
      <div data-ambient>
        <DayScene />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <p
          className={cn(
            "hand mx-auto w-fit -rotate-2 rounded-full border-[3px] border-line bg-paper px-4 py-1 text-lg text-ink-soft shadow-[var(--shadow-sticker)]",
            item,
          )}
          style={delay(0)}
        >
          un libro de cuentos de la naturaleza
        </p>

        <h1 className="font-display mt-5 text-[clamp(2.5rem,9vw,6rem)]">
          {TITLE.map((t, i) => (
            <span
              key={t}
              className={cn("block", item)}
              style={{ color: TITLE_COLOR[i], ...delay(i + 1) }}
            >
              {t}
            </span>
          ))}
        </h1>

        <p
          className={cn("mx-auto mt-5 max-w-xl text-lg text-ink-soft", item)}
          style={delay(4)}
        >
          Conoce la fauna y la flora de Campeche: algunas sólo viven aquí,
          otras comparten su hogar con vecinos cercanos.{" "}
          {speciesCount} historias ilustradas a mano · {regionCount} municipios
          por explorar.
        </p>

        <div
          className={cn("mt-7 flex flex-wrap justify-center gap-3", item)}
          style={delay(5)}
        >
          <Button href="/especies" size="lg">
            Abrir el libro
          </Button>
          <Button href="/mapa" variant="sky" size="lg">
            Ver el mapa
          </Button>
        </div>
      </div>

      {!reduce && (
        <p className="hand mt-10 text-center text-lg text-ink-faint">
          ↓ baja para pasar la página
        </p>
      )}
    </section>
  );
}
