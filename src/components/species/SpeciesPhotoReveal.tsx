"use client";

/* ============================================================
   VER FOTO REAL · extra que se revela sobre la ilustración hero
   ------------------------------------------------------------
   Envuelve la ilustración (que sigue pintando el servidor) y le
   añade un botón "Ver foto real →". Al pulsarlo, la viñeta se
   voltea (flip 3D, o cambio directo con prefers-reduced-motion)
   y muestra la foto real a todo color. Debajo, el crédito.

   Si `photoUrl` es null, este componente NO añade nada: sólo
   devuelve la ilustración tal cual (nunca un hueco roto).

   Los datos (photo_url / photo_credit / photo_source_url) los
   llena `scripts/fetch-photos.ts` desde Wikipedia + Wikimedia
   Commons. No toca el sistema de temas ni los hotspots.
   ============================================================ */

import { useEffect, useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SpeciesPhotoReveal({
  photoUrl,
  photoCredit,
  photoSourceUrl,
  alt,
  className,
  children,
}: {
  photoUrl: string | null;
  photoCredit: string | null;
  photoSourceUrl: string | null;
  alt: string;
  className?: string;
  children: ReactNode;
}) {
  const [flipped, setFlipped] = useState(false);
  // La foto se monta sólo tras el primer "Ver foto real": carga bajo demanda
  // (nada de ancho de banda si nadie pulsa) y no depende del lazy-load.
  const [revealed, setRevealed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!photoUrl) return <div className={className}>{children}</div>;

  return (
    <div className={className}>
      <div className="[perspective:1600px]">
        <div
          className={cn(
            "relative [transform-style:preserve-3d]",
            !reduce &&
              "transition-transform duration-[700ms] ease-[var(--ease-soft)]",
          )}
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* Frente: la ilustración + sus hotspots */}
          <div
            className="[backface-visibility:hidden]"
            aria-hidden={flipped}
            inert={flipped ? true : undefined}
          >
            {children}
          </div>

          {/* Dorso: foto real con tratamiento a dos tintas */}
          <div
            id={panelId}
            aria-hidden={!flipped}
            className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]"
          >
            <div
              className="relative h-full w-full overflow-hidden border-[5px] border-line bg-paper-2"
              style={{ borderRadius: "var(--radius-blob)" }}
            >
              {revealed && (
                /* `<img>` a secas, no next/image: `photo_url` ya es una
                   miniatura de tamaño sensato (1280px) servida por el CDN de
                   Wikimedia, hecho para entregarla. El optimizador de next/image
                   pedía anchos mayores y recibía HTTP 429 de upload.wikimedia.org
                   (foto en blanco); además metía ~6 kB de runtime en la ruta
                   para una foto que casi nadie abre. La foto va a todo color:
                   es el contraste con el dibujo lo que la hace un "extra". */
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={photoUrl}
                  alt={alt}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Control + crédito */}
      <div className="mt-4 flex flex-col items-center gap-1.5 text-center">
        <button
          type="button"
          onClick={() => {
            setRevealed(true);
            setFlipped((v) => !v);
          }}
          aria-expanded={flipped}
          aria-controls={panelId}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border-[3px] border-line px-6 py-3 text-sm font-extrabold",
            "shadow-[var(--shadow-toy)] transition-transform duration-150 ease-[var(--ease-bounce)]",
            "hover:-translate-y-0.5 active:translate-y-1 active:scale-95 active:shadow-[var(--shadow-toy-press)]",
            flipped ? "bg-paper text-ink" : "bg-sun text-sun-ink",
          )}
        >
          {flipped ? "← Volver al dibujo" : "Ver foto real →"}
        </button>
        {flipped && photoCredit && (
          <p className="max-w-xs text-xs leading-snug text-ink-faint">
            {photoSourceUrl ? (
              <a
                href={photoSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2 hover:text-rust"
              >
                {photoCredit}
              </a>
            ) : (
              photoCredit
            )}
          </p>
        )}
      </div>
    </div>
  );
}
