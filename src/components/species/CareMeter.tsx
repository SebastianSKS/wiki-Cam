import type { ConservationStatus } from "@/db/schema";
import { CARE, CONSERVATION, type PlantStage } from "@/lib/format";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

/** Plantita en maceta que va de floreciente (LC) a pelada (EX). */
function CarePlant({ stage }: { stage: PlantStage }) {
  const mouth: Record<PlantStage, string> = {
    bloom: "M66 150q14 14 28 0",
    healthy: "M66 150q14 12 28 0",
    thirsty: "M68 150h24",
    wilting: "M66 152q14 -10 28 0",
    bare: "M66 154q14 -12 28 0",
  };

  return (
    <svg
      viewBox="0 0 160 200"
      role="img"
      aria-hidden
      className="h-32 w-auto shrink-0"
    >
      <g
        filter="url(#wc-paint-soft)"
        stroke="var(--cacao)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* tallo y hojas según el estado */}
        {stage === "bloom" && (
          <>
            <path d="M80 132V54" fill="none" stroke="var(--jungle-deep)" strokeWidth="7" />
            <path d="M80 104c-22 0-34-12-36-30 20-2 34 8 36 30Z" fill="var(--jungle)" />
            <path d="M80 92c22 0 34-12 36-30-20-2-34 8-36 30Z" fill="var(--jungle)" />
            <circle cx="80" cy="44" r="16" fill="var(--sun)" />
            <g fill="var(--coral)" stroke="none">
              <circle cx="80" cy="22" r="9" />
              <circle cx="58" cy="44" r="9" />
              <circle cx="102" cy="44" r="9" />
              <circle cx="80" cy="66" r="9" />
            </g>
            <g stroke="none" fill="var(--sun)">
              <path d="M120 26l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />
            </g>
          </>
        )}
        {stage === "healthy" && (
          <>
            <path d="M80 132V64" fill="none" stroke="var(--jungle-deep)" strokeWidth="7" />
            <path d="M80 108c-20 0-30-10-32-26 18-2 30 6 32 26Z" fill="var(--jungle)" />
            <path d="M80 98c20 0 30-10 32-26-18-2-30 6-32 26Z" fill="var(--jungle)" />
            <circle cx="80" cy="58" r="10" fill="var(--jungle)" />
          </>
        )}
        {stage === "thirsty" && (
          <>
            <path d="M80 132c0-30-6-44-14-54" fill="none" stroke="var(--jungle-deep)" strokeWidth="7" />
            <path d="M74 96c-16-4-24-14-24-30 16 0 26 12 24 30Z" fill="var(--jungle)" />
          </>
        )}
        {stage === "wilting" && (
          <>
            <path d="M80 132c2-24-8-36-22-42" fill="none" stroke="var(--jungle-deep)" strokeWidth="7" />
            <path d="M60 92c-12-6-16-16-14-28 12 2 18 14 14 28Z" fill="var(--jungle-deep)" />
            <path d="M112 70c-6 8-16 10-24 6 4-10 14-14 24-6Z" fill="var(--coral)" />
          </>
        )}
        {stage === "bare" && (
          <path d="M80 132c0-16-2-26-8-34" fill="none" stroke="var(--jungle-deep)" strokeWidth="7" />
        )}

        {/* maceta con carita */}
        <path d="M46 132h68l-8 48H54Z" fill="var(--coral)" />
        <path d="M40 122h80v14H40Z" fill="var(--coral)" />
        <circle cx="66" cy="144" r="4" fill="var(--cacao)" stroke="none" />
        <circle cx="94" cy="144" r="4" fill="var(--cacao)" stroke="none" />
        <path d={mouth[stage]} fill="none" stroke="var(--cacao)" strokeWidth="4" />
      </g>
    </svg>
  );
}

export function CareMeter({
  status,
  className,
}: {
  status: ConservationStatus;
  className?: string;
}) {
  const care = CARE[status];
  const meta = CONSERVATION[status];
  const alarm = meta.level >= 3;

  return (
    <div
      className={cn(
        "rounded-[26px] border-[3px] border-line bg-paper p-5",
        "shadow-[var(--card-shadow)]",
        className,
      )}
    >
      <p className="hand text-lg text-ink-soft">Medidor de cuidado</p>

      <div className="mt-2 flex items-center gap-4">
        <CarePlant stage={care.stage} />
        <div>
          <p
            className={cn(
              "font-display text-2xl leading-tight",
              alarm ? "text-rust" : "text-jungle-deep",
            )}
          >
            {care.headline}
          </p>
          <p className="mt-1 text-sm text-ink-soft">{care.kidLine}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t-[3px] border-dotted border-hairline pt-3">
        <span className="catalog text-ink-faint">Código oficial</span>
        <Tag tone="outline" seed={status}>
          {meta.code} · {meta.es}
        </Tag>
      </div>
    </div>
  );
}
