import { CONSERVATION, CONSERVATION_SCALE } from "@/lib/format";
import type { ConservationStatus } from "@/db/schema";
import { cn } from "@/lib/cn";

export function ConservationMeter({
  status,
  className,
}: {
  status: ConservationStatus;
  className?: string;
}) {
  const meta = CONSERVATION[status];
  const isDD = status === "DD";

  return (
    <div className={cn("", className)}>
      <div className="flex items-baseline justify-between">
        <span className="catalog text-ink-faint">Estado UICN</span>
        <span className="catalog text-rust">{meta.code}</span>
      </div>

      <div
        className="mt-2 flex gap-px border border-line"
        role="img"
        aria-label={`Escala UICN: ${meta.es}${isDD ? " (fuera de la escala de riesgo)" : ""}`}
      >
        {CONSERVATION_SCALE.map((s) => {
          const on = !isDD && CONSERVATION[s].level <= meta.level;
          const current = !isDD && s === status;
          return (
            <span
              key={s}
              className={cn(
                "flex-1 py-2 text-center text-[0.5625rem] font-medium tracking-[0.15em]",
                on ? "bg-rust text-paper" : "bg-paper text-ink-faint",
                current && "outline outline-2 -outline-offset-2 outline-ink",
              )}
            >
              {s}
            </span>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-ink-soft">
        {meta.es}
        {isDD && " — sin datos suficientes para asignar categoría de riesgo."}
      </p>
    </div>
  );
}
