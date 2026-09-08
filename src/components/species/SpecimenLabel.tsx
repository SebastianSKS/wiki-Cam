import type { SpeciesWithRegions } from "@/lib/queries";
import {
  catalogNumber,
  CATEGORY_LABEL,
  CONSERVATION,
  binomial,
} from "@/lib/format";

function fmtDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return value;
  return d
    .toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

function Row({
  k,
  children,
}: {
  k: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-2 py-1.5">
      <dt className="catalog shrink-0 text-ink-faint">{k}</dt>
      <span
        aria-hidden
        className="min-w-4 flex-1 translate-y-[-2px] border-b border-dotted border-hairline"
      />
      <dd className="shrink-0 text-right text-xs">{children}</dd>
    </div>
  );
}

export function SpecimenLabel({ species }: { species: SpeciesWithRegions }) {
  const cons = CONSERVATION[species.conservationStatus];

  return (
    <div className="border border-line bg-paper">
      <div className="flex items-center justify-between border-b border-line bg-ink px-3 py-2 text-paper">
        <span className="catalog">Ficha de espécimen</span>
        <span className="catalog">{catalogNumber(species.id, species.category)}</span>
      </div>

      <dl className="px-4 py-3">
        <Row k="Nombre común">{species.commonNameEs}</Row>
        <Row k="Binomen">
          <span className="sci">
            {binomial(species.genus, species.speciesEpithet)}
          </span>
        </Row>
        <Row k="Categoría">{CATEGORY_LABEL[species.category]}</Row>

        <div className="my-2 border-t border-line" />

        <Row k="Reino">{species.kingdom}</Row>
        <Row k="Filo">{species.phylum}</Row>
        <Row k="Clase">{species.class}</Row>
        <Row k="Orden">{species.order}</Row>
        <Row k="Familia">{species.family}</Row>
        <Row k="Género">
          <span className="sci">{species.genus}</span>
        </Row>
        <Row k="Epíteto">
          <span className="sci">{species.speciesEpithet}</span>
        </Row>

        <div className="my-2 border-t border-line" />

        <Row k="Estatus UICN">
          {cons.code} · {cons.es}
        </Row>
        <Row k="Distribución">
          {species.regions.length} de 13 municipios
        </Row>
        <Row k="Alta en registro">{fmtDate(species.createdAt)}</Row>
        <Row k="Última revisión">{fmtDate(species.updatedAt)}</Row>
      </dl>

      <p className="border-t border-line px-4 py-2 text-[0.5625rem] leading-relaxed text-ink-faint">
        Registrado en el Catálogo 04 · Campeche. Datos verificados contra GBIF,
        UICN y NOM-059-SEMARNAT-2010.
      </p>
    </div>
  );
}
