"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll (Lenis) + coordinación de GSAP ScrollTrigger.
 * - Se desactiva por completo con prefers-reduced-motion.
 * - `lerp` en vez de `duration`: respuesta independiente del framerate y sin
 *   la sensación de rebote pesado.
 * - Sincroniza ScrollTrigger con el scroll suavizado de Lenis y recalcula
 *   posiciones cuando cargan las webfonts (esto evitaba que el título de la
 *   portada quedara bajo la cabecera).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.11,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready?.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);

    return () => {
      cancelAnimationFrame(raf);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      window.removeEventListener("load", refresh);
    };
  }, []);

  return null;
}
