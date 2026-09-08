import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone =
  | "default"
  | "jungle"
  | "sky"
  | "coral"
  | "sun"
  | "lavender"
  | "outline";

const TONE: Record<Tone, string> = {
  default: "bg-paper-2 text-ink border-line",
  jungle: "bg-jungle text-jungle-ink border-line",
  sky: "bg-sky text-sky-ink border-line",
  coral: "bg-coral text-coral-ink border-line",
  sun: "bg-sun text-sun-ink border-line",
  lavender: "bg-lavender text-lavender-ink border-line",
  outline: "bg-transparent text-ink border-current",
};

function tiltFrom(seed: string | number | undefined): number {
  if (seed === undefined) return -2;
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  // -3 … +3, evitando 0 para que siempre se note el "pegado a mano"
  const t = (Math.abs(h) % 7) - 3;
  return t === 0 ? 2 : t;
}

/**
 * Sticker de cuaderno: borde grueso, esquinas redondas, sombra suave y una
 * ligera rotación (determinista, para no romper la hidratación). Al hover se
 * endereza y da un saltito.
 */
export function Tag({
  children,
  tone = "default",
  icon,
  seed,
  tilt,
  className,
  title,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  seed?: string | number;
  tilt?: number;
  className?: string;
  title?: string;
}) {
  const rot = tilt ?? tiltFrom(seed ?? (typeof children === "string" ? children : undefined));

  return (
    <span
      title={title}
      style={{ "--tilt": `${rot}deg` } as React.CSSProperties}
      className={cn(
        "inline-flex select-none items-center gap-1.5 rounded-[13px] border-[3px] px-2.5 py-1",
        "text-[0.72rem] font-extrabold leading-tight rotate-[var(--tilt)]",
        "shadow-[var(--shadow-sticker)]",
        "transition-transform duration-200 ease-[var(--ease-bounce)]",
        "hover:rotate-0 hover:-translate-y-0.5",
        TONE[tone],
        className,
      )}
    >
      {icon ? <span aria-hidden className="text-sm leading-none">{icon}</span> : null}
      {children}
    </span>
  );
}

export { Tag as Sticker };
