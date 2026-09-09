import { Link } from "next-view-transitions";
import type { SpeciesWithRegions } from "@/lib/queries";
import { CATEGORY_LABEL, CARE, CONSERVATION, binomial } from "@/lib/format";
import { SpeciesScene, hasIllustration } from "@/components/illustration/SpeciesIllustration";
import { Tag } from "@/components/ui/Tag";
import { PresenceBadge } from "@/components/species/PresenceBadge";
import { cn } from "@/lib/cn";

function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

export function StorybookCard({
  species,
  index,
}: {
  species: SpeciesWithRegions;
  index: number;
}) {
  const ready = hasIllustration(species.slug);
  const care = CARE[species.conservationStatus];
  const level = CONSERVATION[species.conservationStatus].level;
  const careTone = level >= 3 ? "coral" : level === 2 ? "sun" : "jungle";
  const teaser = ready
    ? firstSentence(species.kidDescription ?? species.description)
    : "Su ilustración está por salir del cascarón. ¡Vuelve pronto a conocerle!";

  return (
    <Link
      href={`/especies/${species.slug}`}
      className={cn(
        "group relative block rounded-[30px] border-[3px] border-line bg-paper p-4",
        "shadow-[var(--card-shadow)] transition-transform duration-200 ease-[var(--ease-bounce)]",
        "hover:-translate-y-1.5 hover:-rotate-1 focus-visible:-translate-y-1.5",
      )}
    >
      <span
        className="hand absolute -left-2 -top-3 z-10 rotate-[-8deg] rounded-full border-[3px] border-line bg-sun px-2.5 py-0.5 text-sm text-sun-ink shadow-[var(--shadow-sticker)]"
      >
        n.º {index + 1}
      </span>

      {/* Sin `shared`: si cada tarjeta lleva un view-transition-name, el
          navegador fotografía las 12-18 viñetas del índice en CADA salto a una
          ficha, y sólo una llega a emparejar. El nombre compartido vive sólo
          en el hero de la ficha (SpeciesScene `shared`). */}
      <SpeciesScene slug={species.slug} className="w-full" />

      <div className="px-1 pb-1 pt-4">
        <h3 className="font-display text-[1.7rem] leading-[1.05]">
          {species.commonNameEs}
        </h3>
        <p className="sci mt-0.5 text-sm text-ink-soft">
          {binomial(species.genus, species.speciesEpithet)}
        </p>

        <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{teaser}</p>

        <div className="mt-3">
          <PresenceBadge type={species.presenceType} />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {ready ? (
            <Tag tone={careTone} seed={species.slug}>
              {care.headline}
            </Tag>
          ) : (
            <Tag tone="lavender" seed={species.slug}>
              Próximamente
            </Tag>
          )}
          <Tag tone="outline" seed={species.category + species.slug}>
            {CATEGORY_LABEL[species.category]}
          </Tag>
        </div>

        <span
          aria-hidden
          className="mt-3 inline-flex items-center gap-1 font-extrabold text-rust transition-transform duration-200 ease-[var(--ease-bounce)] group-hover:translate-x-1"
        >
          Conócele
          <span>→</span>
        </span>
      </div>
    </Link>
  );
}
