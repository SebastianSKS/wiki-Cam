import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import {
  getSpeciesBySlug,
  getAllSlugs,
  getSpeciesCatalog,
} from "@/lib/queries";
import { CATEGORY_LABEL, CARE, CONSERVATION, binomial } from "@/lib/format";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { SpeciesScene } from "@/components/illustration/SpeciesIllustration";
import { ExplorerId } from "@/components/species/ExplorerId";
import { CareMeter } from "@/components/species/CareMeter";
import { DistributionMap } from "@/components/species/DistributionMap";
import { BulbIcon, SearchIcon } from "@/components/ui/icons";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getAllSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSpeciesBySlug(slug);
  if (!s) return { title: "No encontramos esta criatura" };
  return {
    title: `${s.commonNameEs} · ${binomial(s.genus, s.speciesEpithet)}`,
    description: (s.kidDescription ?? s.description).slice(0, 155),
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

  const bin = binomial(species.genus, species.speciesEpithet);
  const care = CARE[species.conservationStatus];
  const level = CONSERVATION[species.conservationStatus].level;
  const careTone = level >= 3 ? "coral" : level === 2 ? "sun" : "jungle";
  const activeSlugs = species.regions.map((r) => r.slug);
  const idx = catalog.findIndex((s) => s.slug === slug);
  const prev = idx > 0 ? catalog[idx - 1] : catalog[catalog.length - 1];
  const next = idx < catalog.length - 1 ? catalog[idx + 1] : catalog[0];

  return (
    <article className="mx-auto max-w-[1200px] px-4 pb-10 pt-8 sm:px-8">
      <Link
        href="/especies"
        className="hand inline-block text-lg text-ink-soft transition-transform hover:-translate-x-1 hover:text-rust"
      >
        ← volver al índice
      </Link>

      {/* Héroe */}
      <header className="mt-4 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12">
        <div>
          <span className="hand inline-block -rotate-2 rounded-full border-[3px] border-line bg-sun px-3 py-0.5 text-lg text-sun-ink">
            criatura n.º {idx + 1}
          </span>
          <h1 className="font-display mt-3 text-[clamp(2.6rem,9vw,5.5rem)] leading-[0.95] text-jungle-deep">
            {species.commonNameEs}
          </h1>
          <p className="sci mt-2 text-[clamp(1.15rem,3.2vw,1.8rem)] text-ink-soft">
            {bin}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Tag tone={careTone} seed={species.slug}>
              {care.headline}
            </Tag>
            <Tag tone="sky" seed={species.category}>
              {CATEGORY_LABEL[species.category]}
            </Tag>
            <Tag tone="outline" seed={species.slug + "m"}>
              Vive en {species.regions.length}{" "}
              {species.regions.length === 1 ? "municipio" : "municipios"}
            </Tag>
          </div>
        </div>

        <Reveal y={18}>
          <SpeciesScene slug={species.slug} shared className="mx-auto w-full max-w-md" />
        </Reveal>
      </header>

      {/* Cuerpo + aparato lateral */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_23rem] lg:gap-14">
        <div className="max-w-2xl space-y-10">
          <Reveal>
            <section>
              <h2 className="font-display text-[clamp(1.6rem,4vw,2.25rem)]">
                Su historia
              </h2>
              <p className="mt-3 text-lg leading-relaxed">
                {species.kidDescription ?? species.description}
              </p>
            </section>
          </Reveal>

          {species.funFact && (
            <Reveal>
              <aside className="relative rounded-[26px] border-[3px] border-line bg-sun p-5 text-sun-ink shadow-[var(--card-shadow)]">
                <p className="hand text-2xl">¿Sabías que…?</p>
                <p className="mt-1 text-lg font-bold leading-snug">
                  {species.funFact}
                </p>
                <span
                  aria-hidden
                  className="absolute -right-3 -top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-line bg-paper text-ink"
                >
                  <BulbIcon className="h-6 w-6" />
                </span>
              </aside>
            </Reveal>
          )}

          <Reveal>
            <section>
              <h2 className="font-display text-[clamp(1.6rem,4vw,2.25rem)]">
                ¿Dónde vive?
              </h2>
              <p className="mt-3 text-lg leading-relaxed">{species.habitat}</p>

              <div className="mt-5 grid gap-6 rounded-[26px] border-[3px] border-line bg-paper-2 p-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-center">
                <DistributionMap active={activeSlugs} />
                <div>
                  <p className="text-sm text-ink-soft">
                    En Campeche se le ha visto en estos municipios:
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {species.regions.map((r) => (
                      <li key={r.slug}>
                        <Tag tone="jungle" seed={r.slug} title={`Cabecera: ${r.seat}`}>
                          {r.name}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/mapa"
                    className="hand mt-3 inline-block text-lg text-rust hover:underline"
                  >
                    ver el mapa completo →
                  </Link>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <details className="group rounded-[22px] border-[3px] border-dashed border-line bg-paper p-5">
              <summary className="hand flex cursor-pointer list-none items-center gap-2 text-xl text-ink-soft marker:content-none">
                <SearchIcon className="h-5 w-5 shrink-0" />
                <span className="group-open:hidden">
                  Para quien quiera saber más…
                </span>
                <span className="hidden group-open:inline">
                  Versión para expertos
                </span>
              </summary>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                {species.description}
              </p>
            </details>
          </Reveal>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal y={16}>
            <ExplorerId species={species} />
          </Reveal>
          <Reveal y={16}>
            <CareMeter status={species.conservationStatus} />
          </Reveal>
        </aside>
      </div>

      {/* Otra criatura */}
      <nav className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href={`/especies/${prev.slug}`}
          className="group flex items-center gap-4 rounded-[26px] border-[3px] border-line bg-paper p-4 shadow-[var(--card-shadow)] transition-transform duration-200 ease-[var(--ease-bounce)] hover:-translate-y-1 hover:-rotate-1"
        >
          <SpeciesScene slug={prev.slug} className="h-20 w-20 shrink-0 border-[4px]" />
          <span>
            <span className="hand block text-lg text-ink-faint">
              ← otra criatura
            </span>
            <span className="font-display text-xl leading-tight">
              {prev.commonNameEs}
            </span>
          </span>
        </Link>
        <Link
          href={`/especies/${next.slug}`}
          className="group flex items-center justify-end gap-4 rounded-[26px] border-[3px] border-line bg-paper p-4 text-right shadow-[var(--card-shadow)] transition-transform duration-200 ease-[var(--ease-bounce)] hover:-translate-y-1 hover:rotate-1"
        >
          <span>
            <span className="hand block text-lg text-ink-faint">
              otra criatura →
            </span>
            <span className="font-display text-xl leading-tight">
              {next.commonNameEs}
            </span>
          </span>
          <SpeciesScene slug={next.slug} className="h-20 w-20 shrink-0 border-[4px]" />
        </Link>
      </nav>
    </article>
  );
}
