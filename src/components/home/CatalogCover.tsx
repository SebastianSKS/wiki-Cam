"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

const TITLE = ["ESPECIES", "ENDÉMICAS", "DE CAMPECHE"];

export function CatalogCover({
  speciesCount,
  regionCount,
}: {
  speciesCount: number;
  regionCount: number;
}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || !sectionRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(stageRef.current, {
        scale: 0.86,
        yPercent: -6,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          pin: stageRef.current,
          pinSpacing: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  const panelTop: Variants = {
    hidden: { y: 0 },
    show: {
      y: "-101%",
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
    },
  };
  const panelBottom: Variants = {
    hidden: { y: 0 },
    show: {
      y: "101%",
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
    },
  };
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.55 },
    },
  };
  const line: Variants = {
    hidden: { y: "110%" },
    show: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };
  const fade: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[190vh]"
      aria-label="Portada del catálogo"
    >
      <div
        ref={stageRef}
        className="relative flex h-dvh flex-col justify-between overflow-hidden border-b border-line px-4 py-5 sm:px-8 sm:py-8"
      >
        {/* Paneles de apertura del catálogo */}
        {!reduce && (
          <>
            <motion.div
              variants={panelTop}
              initial="hidden"
              animate="show"
              className="pointer-events-none absolute inset-x-0 top-0 z-40 h-1/2 border-b border-line bg-jungle"
            />
            <motion.div
              variants={panelBottom}
              initial="hidden"
              animate="show"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex h-1/2 items-start justify-center border-t border-line bg-jungle"
            >
              <span className="catalog mt-6 text-jungle-ink/80">
                Abriendo catálogo…
              </span>
            </motion.div>
          </>
        )}

        {/* Cabecera de folio */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex items-start justify-between text-ink"
        >
          <motion.div variants={fade} className="catalog leading-relaxed">
            <div>Catálogo 04 · Campeche</div>
            <div className="text-ink-faint">Edición viva · MMXXV</div>
          </motion.div>
          <motion.div
            variants={fade}
            className="catalog text-right leading-relaxed text-ink-faint"
          >
            <div>18°38′N — 90°50′O</div>
            <div>Folio {String(speciesCount).padStart(3, "0")} / ∞</div>
          </motion.div>
        </motion.div>

        {/* Título */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 font-display text-ink"
        >
          {TITLE.map((t) => (
            <span
              key={t}
              className="block overflow-hidden pt-[0.24em] [&:not(:first-child)]:-mt-[0.16em]"
            >
              <motion.span
                variants={line}
                className="block text-[clamp(2.75rem,11vw,10rem)] leading-[0.82]"
              >
                {t}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Pie de portada */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <motion.p
            variants={fade}
            className="max-w-md text-sm leading-relaxed text-ink-soft"
          >
            Un registro editorial de la fauna y flora que sólo existe aquí.
            {" "}
            {speciesCount} fichas catalogadas · {regionCount} municipios ·
            distribución verificada espécimen por espécimen.
          </motion.p>
          <motion.div variants={fade} className="flex flex-wrap gap-3">
            <Button href="/especies">Abrir el índice</Button>
            <Button href="/mapa" variant="outline">
              Ver el mapa
            </Button>
          </motion.div>
        </motion.div>

        {/* Guía de scroll */}
        {!reduce && (
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className="catalog pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-ink-faint"
          >
            ↓ Desliza para hojear
          </motion.div>
        )}
      </div>
    </section>
  );
}
