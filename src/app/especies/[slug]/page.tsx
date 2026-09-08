import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import {
  getSpeciesBySlug,
  getAllSlugs,
  getSpeciesCatalog,
} from "@/lib/queries";
import {
  catalogNumber,
  CATEGORY_LABEL,
  CONSERVATION,
  binomial,
} from "@/lib/format";
import { Tag } from "@/components/ui/Tag";
import { PlateImage } from "@/components/ui/PlateImage";
import { Reveal } from "@/components/ui/Reveal";
import { SpecimenLabel } from "@/components/species/SpecimenLabel";
import { ConservationMeter } from "@/components/species/ConservationMeter";
import {
  DistributionMap,
  DISTRIBUTION_NODES,
} from "@/components/species/DistributionMap";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const species = await getSpeciesBySlug(slug);
  if (!species) return { title: "Ficha no encontrada" };
  const bin = binomial(species.genus, species.speciesEpithet);
  return {
    title: `${species.commonNameEs} · ${bin}`,
    description: species.description.slice(0, 155),
  };
}

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [species, catalog] = await Promise.all([
    getSpeciesBySlug(slug),
    getSpeciesCatalog(),
  ]);

  if (!species) notFound();

  const cons = CONSERVATION[species.conservationStatus];
  const bin = binomial(species.genus, species.speciesEpithet);
  const activeSlugs = species.regions.map((r) => r.slug);
  const idx = catalog.findIndex((s) => s.slug === slug);
  const prev = idx > 0 ? catalog[idx - 1] : catalog[catalog.length - 1];
  const next =
    idx < catalog.length - 1 ? catalog[idx + 1] : catalog[0];
  const orderedNodes = DISTRIBUTION_NODES.filter((n) =>
    activeSlugs.includes(n.slug),
  );

  return (
    <article className="mx-auto max-w-[1400px] px-4 pb-10 pt-8 sm:px-8">
      {/* Migas */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <Link
          href="/especies"
          className="catalog text-ink-soft transition-colors hover:text-rust"
        >
          ← Índice
        </Link>
        <span className="catalog text-ink-faint">
          {catalogNumber(species.id, species.category)}
        </span>
      </div>

      {/* Encabezado / héroe */}
      <header className="grid gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag tone="jungle">{CATEGORY_LABEL[species.category]}</Tag>
              <Tag tone="rust" code={cons.code}>
                {cons.es}
              </Tag>
            </div>
            <h1 className="mt-5 font-display text-[clamp(3rem,10vw,7.5rem)] leading-[0.9]">
              {species.commonNameEs}
            </h1>
            <p className="sci mt-3 text-[clamp(1.25rem,3.5vw,2rem)] text-ink-soft">
              {bin}
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-5 sm:grid-cols-3">
            {[
              ["Clase", species.class],
              ["Orden", species.order],
              ["Familia", species.family],
              ["Municipios", `${species.regions.length} / 13`],
              ["Reino", species.kingdom],
              ["Filo", species.phylum],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="catalog text-ink-faint">{k}</dt>
                <dd className="mt-1 text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Lámina */}
        <Reveal y={16}>
          <figure className="relative">
            {/* marcas de registro */}
            <span aria-hidden className="absolute -left-2 -top-2 h-5 w-5 border-l border-t border-rust" />
            <span aria-hidden className="absolute -right-2 -top-2 h-5 w-5 border-r border-t border-rust" />
            <span aria-hidden className="absolute -bottom-2 -left-2 h-5 w-5 border-b border-l border-rust" />
            <span aria-hidden className="absolute -bottom-2 -right-2 h-5 w-5 border-b border-r border-rust" />

            <div
              className="relative aspect-[4/5] overflow-hidden border border-line"
              style={{ viewTransitionName: `specimen-hero-${species.slug}` }}
            >
              <PlateImage
                src={species.imageUrl}
                alt={`${species.commonNameEs} — ${bin}`}
                glyph={species.genus.charAt(0)}
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <span className="catalog absolute left-2 top-2 bg-paper/85 px-1.5 py-0.5">
                Lám. {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="sci absolute bottom-2 right-2 bg-paper/85 px-1.5 py-0.5 text-xs">
                {bin}
              </span>
            </div>
            <figcaption className="catalog mt-2 flex justify-between text-ink-faint">
              <span>{catalogNumber(species.id, species.category)}</span>
              <span>
                {species.imageUrl ? "Fotografía · dominio público" : "Lámina esquemática"}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </header>

      {/* Cuerpo */}
      <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div className="max-w-2xl space-y-12">
          <Reveal>
            <section>
              <h2 className="catalog text-rust">§ 01 · Descripción</h2>
              <p className="mt-3 text-lg leading-relaxed">
                {species.description}
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="catalog text-rust">§ 02 · Hábitat</h2>
              <p className="mt-3 text-lg leading-relaxed">{species.habitat}</p>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="catalog text-rust">
                § 03 · Distribución municipal
              </h2>
              <div className="mt-4 grid gap-6 border border-line p-4 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8 sm:p-6">
                <DistributionMap active={activeSlugs} />
                <div>
                  <p className="text-sm text-ink-soft">
                    Registrada en <strong>{species.regions.length}</strong> de
                    los 13 municipios del estado. Nodos en óxido: presencia
                    confirmada.
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {species.regions.map((r) => (
                      <li key={r.slug}>
                        <Tag tone="outline" title={`Cabecera: ${r.seat}`}>
                          {r.name}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                  <p className="catalog mt-4 text-ink-faint">
                    {orderedNodes.length} nodos trazados ·{" "}
                    <Link href="/mapa" className="text-rust hover:underline">
                      abrir carta completa →
                    </Link>
                  </p>
                </div>
              </div>
            </section>
          </Reveal>
        </div>

        {/* Aparato lateral */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal y={16}>
            <SpecimenLabel species={species} />
          </Reveal>
          <Reveal y={16}>
            <div className="border border-line bg-paper p-4">
              <ConservationMeter status={species.conservationStatus} />
            </div>
          </Reveal>
        </aside>
      </div>

      {/* Navegación de fichas */}
      <nav className="mt-16 grid grid-cols-2 gap-px border border-line bg-line">
        <Link
          href={`/especies/${prev.slug}`}
          className="group bg-paper p-5 transition-colors hover:bg-jungle hover:text-jungle-ink"
        >
          <span className="catalog text-ink-faint group-hover:text-jungle-ink/70">
            ← Ficha anterior
          </span>
          <span className="mt-1 block font-display text-xl">
            {prev.commonNameEs}
          </span>
        </Link>
        <Link
          href={`/especies/${next.slug}`}
          className="group bg-paper p-5 text-right transition-colors hover:bg-jungle hover:text-jungle-ink"
        >
          <span className="catalog text-ink-faint group-hover:text-jungle-ink/70">
            Ficha siguiente →
          </span>
          <span className="mt-1 block font-display text-xl">
            {next.commonNameEs}
          </span>
        </Link>
      </nav>
    </article>
  );
}
