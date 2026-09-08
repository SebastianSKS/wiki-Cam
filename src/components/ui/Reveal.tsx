"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Revelado en scroll con transición CSS (no rAF): sigue funcionando aunque la
 * pestaña esté en segundo plano y degrada con gracia. El contenido se sirve
 * visible; sólo se oculta tras montar y sólo si el sistema permite movimiento.
 * Failsafe: si el IntersectionObserver nunca dispara, se muestra igualmente.
 * Al terminar, se limpia el style inline: nada de `will-change` ni capas de
 * composición persistentes.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<"idle" | "hidden" | "shown" | "done">(
    "idle",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setPhase("hidden");
    const reveal = () => setPhase("shown");

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    const failsafe = window.setTimeout(reveal, 1600);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  // Una vez visible, esperar a que acabe la transición y soltar el style inline.
  useEffect(() => {
    if (phase !== "shown") return;
    const t = window.setTimeout(
      () => setPhase("done"),
      (delay + 0.75) * 1000,
    );
    return () => window.clearTimeout(t);
  }, [phase, delay]);

  let style: CSSProperties | undefined;
  if (phase === "hidden" || phase === "shown") {
    style = {
      opacity: phase === "shown" ? 1 : 0,
      transform: phase === "shown" ? "none" : `translateY(${y}px)`,
      transition: `opacity 0.6s var(--ease-soft) ${delay}s, transform 0.7s var(--ease-bounce) ${delay}s`,
    };
  }

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
