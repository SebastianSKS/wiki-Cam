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

/* Seres que flotan en el fondo. Los loops son CSS (se apagan con
   reduced-motion); las alas aletean con Framer Motion. */
function Ambient() {
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
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="amb-float absolute right-[6%] top-[7%] h-16 w-16 md:h-24 md:w-24" viewBox="0 0 100 100">
        <g filter="url(#wc-paint-soft)" stroke="var(--cacao)" strokeWidth="4" strokeLinecap="round">
          <g stroke="var(--sun)" strokeWidth="7">
            <path d="M50 10v-6M50 96v-6M10 50H4M96 50h-6M22 22l-5-5M83 83l-5-5M78 22l5-5M17 83l5-5" />
          </g>
          <circle cx="50" cy="50" r="22" fill="var(--sun)" />
        </g>
      </svg>

      <svg
        className="absolute left-[-14%] top-[24%] h-14 w-40 [animation:drift-x_42s_linear_infinite]"
        viewBox="0 0 160 60"
      >
        <g filter="url(#wc-paint-soft)" stroke="var(--cacao)" strokeWidth="4">
          <path d="M30 46c-16 0-24-10-20-24 4-12 18-14 26-6 4-16 28-18 36-4 14-4 26 6 24 20-2 12-14 14-24 14Z" fill="#fff" />
        </g>
      </svg>

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
            <g filter="url(#wc-paint-soft)" stroke="var(--cacao)" strokeWidth="4" strokeLinejoin="round">
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
        <svg key={`l${i}`} className={`amb-sway absolute ${l.c} h-8 w-8`} style={{ animationDuration: l.d }} viewBox="0 0 50 50">
          <g filter="url(#wc-paint-soft)" stroke="var(--cacao)" strokeWidth="4">
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
  // Entrada por CSS: el contenido se sirve visible; sólo se oculta tras montar
  // (y sólo con movimiento permitido). Failsafe si algo falla.
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
      gsap.to("[data-ambient] svg", {
        yPercent: (i: number) => -10 - i * 6,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
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
        <Ambient />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <p
          className={cn(
            "hand mx-auto w-fit -rotate-2 rounded-full border-[3px] border-line bg-paper px-4 py-1 text-lg text-ink-soft shadow-[3px_4px_0_rgba(59,42,32,0.16)]",
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
          Conoce a los animales que no viven en ningún otro lugar del mundo.
          {" "}
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
