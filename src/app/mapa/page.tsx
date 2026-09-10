import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getRegionsWithSpecies } from "@/lib/queries";
import { DistributionMap } from "@/components/species/DistributionMap";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "El mapa de Campeche",
  description:
    "Campeche tiene 13 municipios. Este mapa muestra en cuáles se ha visto a cada criatura del libro.",
};

export default async function MapaPage() {
  const regions = await getRegionsWithSpecies();
  const withSpecies = regions.filter((r) => r.species.length > 0);
  const activeSlugs = withSpecies.map((r) => r.slug);
  const total = regions.reduce((n, r) => n + r.species.length, 0);

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-12 pt-10 sm:px-8">
      <header>
        <p className="hand text-xl text-ink-soft">¿dónde viven?</p>
        <h1 className="mt-1 font-display text-[clamp(2.4rem,8vw,5rem)] leading-[0.98]">
          El mapa de Campeche
        </h1>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">
          Campeche está dividido en <strong>13 municipios</strong>. Cada puntito
          es uno de ellos. Los puntos de color coral son los lugares donde se ha
          visto a alguna criatura del libro: {withSpecies.length} municipios y{" "}
          {total} apariciones en total.
        </p>
      </header>

      {/* El mapa manda: ocupa toda la fila para que los 13 nombres se lean sin
          zoom. La lista de municipios va debajo, nunca apretándolo. */}
      <div className="mt-8">
        <DistributionMap
          active={activeSlugs}
          className="mx-auto w-full max-w-3xl"
        />
        <div className="mx-auto mt-4 flex max-w-3xl flex-wrap gap-4">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft">
            <span className="inline-block h-3 w-3 rounded-full border-[2px] border-line bg-rust" />
            con criaturas
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-ink-faint">
            <span className="inline-block h-3 w-3 rounded-full border-[2px] border-line bg-paper" />
            todavía sin registrar
          </span>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => (
            <Reveal
              as="li"
              key={r.slug}
              className="rounded-[24px] border-[3px] border-line bg-paper p-5 shadow-[var(--card-shadow)]"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-display text-xl">{r.name}</h2>
                <span className="hand text-base text-ink-faint">
                  {r.inegiKey ?? "—"}
                </span>
              </div>
              <p className="text-xs text-ink-faint">Cabecera · {r.seat}</p>

              {r.species.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {r.species.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/especies/${s.slug}`}>
                        <Tag tone="jungle" seed={s.slug + r.slug}>
                          {s.commonNameEs}
                        </Tag>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-ink-faint">
                  Aún no hay ninguna criatura del libro registrada aquí.
                </p>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  );
}
