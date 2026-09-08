import { Link } from "next-view-transitions";
import type { SpeciesWithRegions } from "@/lib/queries";
import {
  catalogNumber,
  CATEGORY_LABEL,
  CONSERVATION,
  binomial,
} from "@/lib/format";
import { Tag } from "./Tag";
import { PlateImage } from "./PlateImage";
import { cn } from "@/lib/cn";

const TONE_BY_LEVEL = (level: number) =>
  level <= 0 ? "jungle" : level <= 2 ? "index" : "rust";

export function SpecimenCard({
  species,
  index,
  priority = false,
}: {
  species: SpeciesWithRegions;
  index: number;
  priority?: boolean;
}) {
  const cons = CONSERVATION[species.conservationStatus];
  const cat = catalogNumber(species.id, species.category);

  return (
    <Link
      href={`/especies/${species.slug}`}
      className="group relative block border border-line bg-paper focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ viewTransitionName: `card-${species.slug}` }}
    >
      {/* marco de registro que se dibuja al hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 border border-rust opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />

      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="catalog text-ink-soft">
          {String(index + 1).padStart(3, "0")} / {cat}
        </span>
        <span className="catalog text-ink-faint">
          {CATEGORY_LABEL[species.category]}
        </span>
      </div>

      <div
        className="relative aspect-[4/5] overflow-hidden border-b border-line"
        style={{ viewTransitionName: `specimen-hero-${species.slug}` }}
      >
        <div className="h-full w-full transition-transform duration-500 ease-[var(--ease-drawer)] group-hover:scale-[1.03]">
          <PlateImage
            src={species.imageUrl}
            alt={`${species.commonNameEs} — ${binomial(species.genus, species.speciesEpithet)}`}
            glyph={species.genus.charAt(0)}
            priority={priority}
          />
        </div>
        <span className="catalog absolute left-2 top-2 z-10 bg-paper/85 px-1.5 py-0.5 text-ink">
          Lám. {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="space-y-3 p-3">
        <div>
          <h3 className="font-display text-2xl leading-[0.95] text-ink">
            {species.commonNameEs}
          </h3>
          <p className="sci mt-1 text-sm text-ink-soft">
            {binomial(species.genus, species.speciesEpithet)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Tag
            tone={TONE_BY_LEVEL(cons.level) as "jungle" | "index" | "rust"}
            code={cons.code}
            title={`Estado UICN: ${cons.es}`}
          >
            {cons.es}
          </Tag>
          <Tag tone="outline">
            {species.regions.length}{" "}
            {species.regions.length === 1 ? "municipio" : "municipios"}
          </Tag>
        </div>
      </div>

      <span
        aria-hidden
        className={cn(
          "catalog absolute bottom-3 right-3 translate-x-1 text-rust opacity-0",
          "transition-all duration-200 ease-[var(--ease-drawer)] group-hover:translate-x-0 group-hover:opacity-100",
        )}
      >
        Ver ficha →
      </span>
    </Link>
  );
}
