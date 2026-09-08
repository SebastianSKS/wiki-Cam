import type { SpeciesWithRegions } from "@/lib/queries";
import { binomial } from "@/lib/format";
import { cn } from "@/lib/cn";

export function TaxonomyLadder({
  species,
  className,
}: {
  species: SpeciesWithRegions;
  className?: string;
}) {
  const rungs: { rank: string; value: string; sci?: boolean }[] = [
    { rank: "Reino", value: species.kingdom },
    { rank: "Filo", value: species.phylum },
    { rank: "Clase", value: species.class },
    { rank: "Orden", value: species.order },
    { rank: "Familia", value: species.family },
    { rank: "Género", value: species.genus, sci: true },
    {
      rank: "Especie",
      value: binomial(species.genus, species.speciesEpithet),
      sci: true,
    },
  ];

  return (
    <ol className={cn("border-l border-line", className)}>
      {rungs.map((r, i) => (
        <li
          key={r.rank}
          className="relative border-b border-line last:border-b-0"
          style={{ paddingLeft: `${i * 0.9 + 1}rem` }}
        >
          <span
            aria-hidden
            className="absolute left-0 top-1/2 h-px bg-line"
            style={{ width: `${i * 0.9 + 0.75}rem` }}
          />
          <div className="flex items-baseline justify-between gap-3 py-2.5">
            <span
              className={cn(
                "text-sm",
                r.sci && "sci",
                i === rungs.length - 1 && "text-rust",
              )}
            >
              {r.value}
            </span>
            <span className="catalog shrink-0 text-ink-faint">{r.rank}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
