import type { SpeciesWithRegions } from "@/lib/queries";
import { CATEGORY_LABEL, binomial } from "@/lib/format";
import { SpeciesScene } from "@/components/illustration/SpeciesIllustration";
import { Tag } from "@/components/ui/Tag";
import { CompassIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

function Stamp({
  top,
  bottom,
  rotate,
  color = "var(--rust)",
}: {
  top: string;
  bottom: string;
  rotate: number;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-20 w-20 shrink-0 opacity-70"
      style={{ rotate: `${rotate}deg`, color }}
      aria-hidden
    >
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="3 3"
      />
      <text
        x="50"
        y="42"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="800"
        fontSize="13"
        fill="currentColor"
      >
        {top}
      </text>
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontFamily="var(--font-body)"
        fontWeight="800"
        fontSize="9"
        letterSpacing="1"
        fill="currentColor"
      >
        {bottom}
      </text>
      <path
        d="M50 66l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DataLine({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2 py-1.5">
      <dt className="catalog shrink-0 text-ink-faint">{k}</dt>
      <span
        aria-hidden
        className="min-w-4 flex-1 translate-y-[-3px] border-b-[3px] border-dotted border-hairline"
      />
      <dd className="shrink-0 text-right text-sm font-bold">{children}</dd>
    </div>
  );
}

/** Carnet de exploración: pasaporte infantil con foto, sellos y taxonomía. */
export function ExplorerId({
  species,
  className,
}: {
  species: SpeciesWithRegions;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] border-[3px] border-line bg-paper-2 shadow-[var(--card-shadow)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b-[3px] border-dashed border-line bg-sky px-4 py-2 text-sky-ink">
        <span className="catalog">Carnet de exploración</span>
        <CompassIcon className="h-5 w-5" />
      </div>

      <div className="p-5">
        <div className="flex gap-4">
          <SpeciesScene
            slug={species.slug}
            compact
            className="h-24 w-24 shrink-0 border-[4px]"
          />
          <div className="min-w-0">
            <p className="catalog text-ink-faint">Nombre</p>
            <p className="font-display text-2xl leading-tight">
              {species.commonNameEs}
            </p>
            <p className="sci text-sm text-ink-soft">
              {binomial(species.genus, species.speciesEpithet)}
            </p>
            <div className="mt-2">
              <Tag tone="sun" seed={species.category}>
                {CATEGORY_LABEL[species.category]}
              </Tag>
            </div>
          </div>
        </div>

        <div className="my-3 flex justify-end gap-1">
          <Stamp top="SELVA" bottom="MAYA" rotate={-8} color="var(--jungle-deep)" />
          <Stamp top="CAMPECHE" bottom="MÉXICO" rotate={6} color="var(--rust)" />
        </div>

        <dl className="rounded-2xl border-[3px] border-line bg-paper p-3">
          <DataLine k="Reino">{species.kingdom}</DataLine>
          <DataLine k="Filo">{species.phylum}</DataLine>
          <DataLine k="Clase">{species.class}</DataLine>
          <DataLine k="Orden">{species.order}</DataLine>
          <DataLine k="Familia">{species.family}</DataLine>
          <div className="mt-1 flex items-baseline gap-2 border-t-[3px] border-dotted border-hairline pt-2">
            <dt className="catalog shrink-0 text-ink-faint">Especie</dt>
            <span
              aria-hidden
              className="min-w-4 flex-1 translate-y-[-3px] border-b-[3px] border-dotted border-hairline"
            />
            <dd className="sci shrink-0 text-right text-sm text-rust">
              {binomial(species.genus, species.speciesEpithet)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
