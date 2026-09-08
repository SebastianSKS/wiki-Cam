"use client";

import { useState } from "react";
import Image from "next/image";
import { SpecimenPlate } from "./SpecimenPlate";
import { cn } from "@/lib/cn";

/**
 * Imagen de espécimen con tratamiento a dos tintas. Si no hay fuente o falla
 * la carga, cae a la lámina SVG sin romper el maquetado (mismo aspecto).
 */
export function PlateImage({
  src,
  alt,
  glyph,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className,
  duotone = true,
}: {
  src: string | null;
  alt: string;
  glyph: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  duotone?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <SpecimenPlate glyph={glyph} className={className} />;
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-paper-2", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className={cn(
          "object-cover transition-[filter,transform] duration-500 ease-[var(--ease-drawer)]",
          duotone &&
            "[filter:grayscale(1)_contrast(1.08)_sepia(0.28)_brightness(0.97)]",
        )}
      />
      {duotone ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--jungle) 26%, transparent), color-mix(in srgb, var(--rust) 20%, transparent))",
          }}
        />
      ) : null}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(var(--ink) 0.5px, transparent 0.6px)",
          backgroundSize: "4px 4px",
        }}
      />
    </div>
  );
}
