import type { ComponentType } from "react";
import { cn } from "@/lib/cn";
import { Jaguar } from "./Jaguar";
import { Howler } from "./Howler";
import { Tapir } from "./Tapir";
import { OcellatedTurkey } from "./OcellatedTurkey";
import { MoreletCrocodile } from "./MoreletCrocodile";
import { Ceiba } from "./Ceiba";
import { AntilleanManatee } from "./AntilleanManatee";
import { MysteryEgg } from "./MysteryEgg";

type IlloProps = { className?: string };
type Habitat = "selva" | "dosel" | "agua";

const REGISTRY: Record<
  string,
  { Illo: ComponentType<IlloProps>; habitat: Habitat; wash: string }
> = {
  jaguar: { Illo: Jaguar, habitat: "selva", wash: "var(--jungle)" },
  "mono-aullador-negro": { Illo: Howler, habitat: "dosel", wash: "var(--sky)" },
  "tapir-centroamericano": { Illo: Tapir, habitat: "agua", wash: "var(--sun)" },
  "pavo-ocelado": {
    Illo: OcellatedTurkey,
    habitat: "selva",
    wash: "var(--lavender)",
  },
  "cocodrilo-de-pantano": {
    Illo: MoreletCrocodile,
    habitat: "agua",
    wash: "var(--sky)",
  },
  ceiba: { Illo: Ceiba, habitat: "dosel", wash: "var(--sun)" },
  "manati-antillano": {
    Illo: AntilleanManatee,
    habitat: "agua",
    wash: "var(--coral)",
  },
};

export function hasIllustration(slug: string): boolean {
  return slug in REGISTRY;
}

/** Fondo de hábitat: hojas, dosel u olas, en trazo simple. */
function HabitatBackdrop({ habitat }: { habitat: Habitat }) {
  if (habitat === "selva") {
    return (
      <g
        stroke="var(--cacao)"
        strokeWidth="4"
        strokeLinejoin="round"
        opacity="0.9"
      >
        <path d="M-6 26c40-30 78-18 92 14-34 20-72 8-92-14Z" fill="var(--jungle-deep)" />
        <path d="M326 40c-40-30-78-18-92 14 34 20 72 8 92-14Z" fill="var(--jungle-deep)" />
        <path d="M18 300c30 24 70 22 92-8-30-22-70-16-92 8Z" fill="var(--jungle-deep)" />
        <path
          d="M262 296c22-6 34-24 30-46-20 6-32 24-30 46Z"
          fill="var(--coral)"
        />
        <circle cx="286" cy="252" r="10" fill="var(--sun)" stroke="none" />
      </g>
    );
  }
  if (habitat === "dosel") {
    return (
      <g stroke="var(--cacao)" strokeWidth="4" strokeLinejoin="round">
        <path d="M-8 18c46-14 92-14 120 8-30 20-92 18-120-8Z" fill="var(--jungle)" />
        <path d="M330 26c-40-16-80-12-104 8 26 18 78 16 104-8Z" fill="var(--jungle)" />
        <path d="M150 -6c14 22 14 40-2 54-16-14-16-34 2-54Z" fill="var(--jungle-deep)" />
        <g fill="#fff" stroke="none" opacity="0.75">
          <ellipse cx="60" cy="70" rx="26" ry="14" />
          <ellipse cx="250" cy="90" rx="30" ry="16" />
        </g>
      </g>
    );
  }
  return (
    <g stroke="var(--cacao)" strokeWidth="4" strokeLinejoin="round">
      <path
        d="M-10 250c40 0 40 20 80 20s40-20 80-20 40 20 80 20 40-20 80-20v90H-10Z"
        fill="var(--sky)"
      />
      <path
        d="M-10 280c40 0 40 16 80 16s40-16 80-16 40 16 80 16 40-16 80-16v70H-10Z"
        fill="var(--sky)"
        opacity="0.7"
      />
      <g fill="none" stroke="var(--jungle-deep)" strokeWidth="7">
        <path d="M30 262c-2-30 2-48 12-64" />
        <path d="M300 258c2-28-2-44-12-58" />
      </g>
      <circle cx="60" cy="60" r="14" fill="var(--sun)" stroke="none" />
    </g>
  );
}

/**
 * Ilustración dentro de una viñeta orgánica con fondo de hábitat.
 * `shared` activa el nombre de View Transition compartido índice ↔ ficha.
 */
export function SpeciesScene({
  slug,
  className,
  shared = false,
  compact = false,
}: {
  slug: string;
  className?: string;
  shared?: boolean;
  compact?: boolean;
}) {
  const entry = REGISTRY[slug];
  const Illo = entry?.Illo ?? MysteryEgg;
  const wash = entry?.wash ?? "var(--lavender)";
  const habitat = entry?.habitat;

  return (
    <div
      className={cn(
        "illo-wink relative aspect-square overflow-hidden border-[5px] border-line",
        className,
      )}
      style={{
        borderRadius: "var(--radius-blob)",
        backgroundColor: wash,
        ...(shared
          ? ({ viewTransitionName: `species-illo-${slug}` } as React.CSSProperties)
          : {}),
      }}
    >
      {/* wash suave encima del color */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.35), transparent 60%)",
        }}
      />
      {habitat ? (
        <svg
          aria-hidden
          viewBox="0 0 320 320"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <HabitatBackdrop habitat={habitat} />
        </svg>
      ) : null}

      <Illo
        className={cn(
          "absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2",
          compact && "h-[92%] w-[92%]",
        )}
      />
    </div>
  );
}
