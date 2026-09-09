import { getSpeciesCatalog, getAllRegions } from "@/lib/queries";
import { StorybookCover } from "@/components/home/StorybookCover";
import { StorybookCard } from "@/components/ui/StorybookCard";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { BookIcon, CompassIcon, SproutIcon } from "@/components/ui/icons";

const STEPS = [
  {
    Icon: BookIcon,
    tone: "bg-jungle text-jungle-ink",
    t: "Cada animal tiene su cuento",
    d: "Una historia cortita y fácil de leer, y al lado la versión larga para quien quiera saberlo todo.",
  },
  {
    Icon: CompassIcon,
    tone: "bg-sky text-sky-ink",
    t: "Un carnet de explorador",
    d: "Su nombre científico, su familia y de dónde viene, con sellos de la Selva Maya.",
  },
  {
    Icon: SproutIcon,
    tone: "bg-coral text-coral-ink",
    t: "Un medidor de cuidado honesto",
    d: "Una plantita nos dice si al animal le va bien o si necesita nuestra ayuda. Sin esconder la verdad.",
  },
];

export default async function HomePage() {
  const [catalog, regions] = await Promise.all([
    getSpeciesCatalog(),
    getAllRegions(),
  ]);

  return (
    <>
      <StorybookCover
        speciesCount={catalog.length}
        regionCount={regions.length}
      />

      {/* Protagonistas */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-[clamp(1.9rem,5vw,3.25rem)]">
              Conoce a los protagonistas
            </h2>
            <p className="hand text-xl text-ink-soft">
              {catalog.length} por ahora · vienen más
            </p>
          </div>
        </Reveal>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={i * 0.06}>
              <StorybookCard species={s} index={i} />
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Cómo funciona */}
      <section className="border-y-[3px] border-line bg-paper-2">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8">
          <Reveal>
            <p className="hand text-xl text-ink-soft">¿Cómo se lee?</p>
            <h2 className="mt-1 max-w-2xl font-display text-[clamp(1.7rem,4.5vw,2.75rem)]">
              Cada ficha es una página de este libro
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.08}>
                <div className="h-full rounded-[26px] border-[3px] border-line bg-paper p-6 shadow-[var(--card-shadow)]">
                  <span
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-line ${s.tone}`}
                  >
                    <s.Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 font-display text-xl">{s.t}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="mx-auto max-w-[1000px] px-4 py-20 text-center sm:px-8">
        <Reveal>
          <p className="sci text-lg text-ink-soft">Campeche, México</p>
          <p className="mx-auto mt-3 max-w-3xl font-display text-[clamp(1.8rem,6vw,3.75rem)] leading-[1.02]">
            Cuando conocemos a un animal, nos dan ganas de cuidarlo.
          </p>
          <div className="mt-7 flex justify-center">
            <Button href="/acerca" variant="outline" size="lg">
              De qué trata este proyecto
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
