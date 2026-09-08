import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getRegionsWithSpecies } from "@/lib/queries";
import { DistributionMap } from "@/components/species/DistributionMap";
import { Tag } from "@/components/ui/Tag";
import { CONSERVATION } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Mapa de distribución",
  description:
    "Carta esquemática de los 13 municipios de Campeche y las especies endémicas registradas en cada uno.",
};

export default async function MapaPage() {
  const regions = await getRegionsWithSpecies();
  const withSpecies = regions.filter((r) => r.species.length > 0);
  const activeSlugs = withSpecies.map((r) => r.slug);
  const totalRecords = regions.reduce((n, r) => n + r.species.length, 0);

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-8 sm:px-8">
      <header className="border-b-2 border-line pb-4">
        <p className="catalog text-ink-faint">Carta 04 · Distribución</p>
        <h1 className="mt-2 font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]">
          Mapa municipal
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink-soft">
          Campeche se divide en 13 municipios. Esta carta es esquemática: cada
          nodo ocupa la posición geográfica aproximada de su cabecera.{" "}
          {withSpecies.length} municipios tienen registros · {totalRecords}{" "}
          asociaciones especie–territorio.
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line p-5">
            <DistributionMap active={activeSlugs} />
            <div className="mt-4 flex items-center gap-4 border-t border-line pt-3">
              <span className="catalog flex items-center gap-1.5 text-ink-soft">
                <span className="inline-block h-2.5 w-2.5 bg-rust" /> con
                registros
              </span>
              <span className="catalog flex items-center gap-1.5 text-ink-faint">
                <span className="inline-block h-2.5 w-2.5 border border-current" />{" "}
                sin registros
              </span>
            </div>
          </div>
        </div>

        <ul className="grid gap-px bg-line sm:grid-cols-2">
          {regions.map((r) => (
            <Reveal as="li" key={r.slug} className="bg-paper p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-2xl">{r.name}</h2>
                <span className="catalog text-ink-faint">
                  {r.inegiKey ?? "—"}
                </span>
              </div>
              <p className="catalog mt-1 text-ink-faint">
                Cabecera · {r.seat}
              </p>

              {r.species.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {r.species.map((s) => {
                    const c = CONSERVATION[s.conservationStatus];
                    return (
                      <li key={s.slug}>
                        <Link href={`/especies/${s.slug}`}>
                          <Tag
                            tone="outline"
                            code={c.code}
                            className="transition-colors hover:border-rust hover:text-rust"
                          >
                            {s.commonNameEs}
                          </Tag>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-ink-faint">
                  Sin especies catalogadas todavía.
                </p>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  );
}
