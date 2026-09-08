"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Revelado en scroll con transición CSS (no rAF): sigue funcionando aunque la
 * pestaña esté en segundo plano y degrada con gracia. El contenido se sirve
 * visible; sólo se oculta tras montar y sólo si el sistema permite movimiento.
 * Failsafe: si el IntersectionObserver nunca dispara, se muestra igualmente.
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
  const [armed, setArmed] = useState(false); // ¿ocultamos para animar?
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setArmed(true);
    setShown(false);

    const reveal = () => setShown(true);

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

  return (
    <Tag
      ref={ref}
      className={className}
      style={
        armed
          ? {
              opacity: shown ? 1 : 0,
              transform: shown ? "none" : `translateY(${y}px)`,
              transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
              willChange: "opacity, transform",
            }
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
