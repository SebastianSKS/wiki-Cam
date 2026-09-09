import type { PresenceType } from "@/db/schema";
import { StarIcon, HomeIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/**
 * Dos insignias DISTINTAS (no la misma con otro color):
 *
 * · EndemicBadge — "Sólo existe aquí". Prominente: marco doble punteado,
 *   estrella, fondo cálido, ligera inclinación y sombra. Se nota.
 * · NativeBadge  — "También vive aquí". Discreta: sólo contorno fino, casita,
 *   texto apagado, sin sombra ni inclinación.
 */

export function EndemicBadge({ className }: { className?: string }) {
  return (
    <span
      // Borde explícito: ver nota en NativeBadge (la regla global `*` gana).
      style={{ borderColor: "var(--line)" }}
      className={cn(
        "relative inline-flex -rotate-2 select-none items-center gap-1.5 rounded-full",
        "border-[3px] bg-sun px-3 py-1.5 text-[0.72rem] font-extrabold text-sun-ink",
        "shadow-[var(--shadow-sticker)]",
        className,
      )}
    >
      <span
        aria-hidden
        style={{ borderColor: "color-mix(in srgb, var(--sun-ink) 45%, transparent)" }}
        className="pointer-events-none absolute inset-[3px] rounded-full border-2 border-dashed"
      />
      <StarIcon className="relative h-4 w-4 shrink-0" />
      <span className="relative">Sólo existe aquí</span>
    </span>
  );
}

export function NativeBadge({ className }: { className?: string }) {
  return (
    <span
      // Borde explícito por style: la regla global `* { border-color }` (sin
      // capa) le gana a las utilidades `border-*`, así que aquí lo fijamos a mano
      // para que la línea fina se vea a propósito, no como un hairline accidental.
      style={{ borderColor: "var(--ink-faint)" }}
      className={cn(
        "inline-flex select-none items-center gap-1.5 rounded-[12px] border-2",
        "px-2.5 py-1 text-[0.68rem] font-bold text-ink-faint",
        className,
      )}
    >
      <HomeIcon className="h-[15px] w-[15px] shrink-0" />
      También vive aquí
    </span>
  );
}

export function PresenceBadge({
  type,
  className,
}: {
  type: PresenceType;
  className?: string;
}) {
  return type === "endemic" ? (
    <EndemicBadge className={className} />
  ) : (
    <NativeBadge className={className} />
  );
}
