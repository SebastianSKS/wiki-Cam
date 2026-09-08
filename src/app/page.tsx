import { Link } from "next-view-transitions";
import { getSpeciesCatalog, getAllRegions } from "@/lib/queries";
import {
  catalogNumber,
  CATEGORY_LABEL,
  CONSERVATION,
  binomial,
} from "@/lib/format";
import { CatalogCover } from "@/components/home/CatalogCover";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const [catalog, regions] = await Promise.all([
    getSpeciesCatalog(),
    getAllRegions(),
  ]);

  return (
    <>
      <CatalogCover
        speciesCount={catalog.length}
        regionCount={regions.length}
      />

      {/* ── Especímenes en el registro ─────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b-2 border-line pb-3">
            <h2 className="font-display text-[clamp(1.75rem,5vw,3.25rem)]">
              En el registro
            </h2>
            <span className="catalog text-ink-faint">
              {String(catalog.length).padStart(3, "0")} entradas
            </span>
          </div>
        </Reveal>

        <ol>
          {catalog.map((s, i) => {
            const cons = CONSERVATION[s.conservationStatus];
            return (
              <Reveal as="li" key={s.slug} delay={i * 0.04}>
                <Link
                  href={`/especies/${s.slug}`}
                  className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-b border-line py-6 transition-colors duration-200 hover:bg-jungle hover:text-jungle-ink sm:grid-cols-[9rem_1fr_14rem_auto]"
                >
                  <span className="catalog order-1 text-ink-faint group-hover:text-jungle-ink/70">
                    {String(i + 1).padStart(3, "0")}
                    <span className="hidden sm:inline">
                      {" "}
                      · {catalogNumber(s.id, s.category)}
                    </span>
                  </span>

                  <span className="order-3 sm:order-2">
                    <span className="font-display block text-[clamp(1.75rem,4.5vw,3rem)] leading-[0.95]">
                      {s.commonNameEs}
                    </span>
                    <span className="sci text-sm text-ink-soft group-hover:text-jungle-ink/80">
                      {binomial(s.genus, s.speciesEpithet)} ·{" "}
                      {CATEGORY_LABEL[s.category]}
                    </span>
                  </span>

                  <span className="order-4 hidden sm:order-3 sm:flex sm:justify-start">
                    <Tag
                      tone="outline"
                      code={cons.code}
                      className="border-current"
                    >
                      {cons.es}
                    </Tag>
                  </span>

                  <span className="catalog order-2 text-right sm:order-4">
                    {s.regions.length} mun.
                    <span className="ml-3 inline-block transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ol>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/especies">Ver el índice completo</Button>
            <p className="max-w-xs text-xs text-ink-soft">
              El índice permite filtrar por categoría taxonómica y estado de
              conservación.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Cómo leer una ficha ────────────────────────────────── */}
      <section className="border-y border-line bg-paper-2">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8">
          <Reveal>
            <p className="catalog text-ink-faint">Convenciones</p>
            <h2 className="mt-2 max-w-2xl font-display text-[clamp(1.5rem,4vw,2.75rem)] leading-[0.95]">
              Cada ficha se lee como una etiqueta de espécimen
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-px bg-line sm:grid-cols-3">
            {[
              {
                n: "01",
                t: "Número de catálogo",
                d: "Clave CAM · categoría · folio. Identifica el espécimen dentro del archivo estatal.",
              },
              {
                n: "02",
                t: "Nombre científico",
                d: "Género y epíteto siempre en cursiva serif, según la convención binomial de Linneo.",
              },
              {
                n: "03",
                t: "Estado de conservación",
                d: "Escala UICN (LC→EX) más el estatus nacional de la NOM-059-SEMARNAT.",
              },
            ].map((item) => (
              <Reveal key={item.n} className="bg-paper p-6">
                <span className="font-display text-4xl text-rust">
                  {item.n}
                </span>
                <h3 className="mt-3 font-display text-xl">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cierre ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-4 py-24 text-center sm:px-8">
        <Reveal>
          <p className="sci text-lg text-ink-soft">Campeche, México</p>
          <p className="mx-auto mt-4 max-w-3xl font-display text-[clamp(1.75rem,6vw,4.5rem)] leading-[0.92]">
            El territorio recuerda a sus especies. Este archivo también.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/acerca" variant="outline">
              Sobre el proyecto
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
