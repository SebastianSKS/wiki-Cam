import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import {
  getSpeciesCatalog,
  applyCatalogFilters,
} from "@/lib/queries";
import {
  CONSERVATION_STATUS,
  SPECIES_CATEGORY,
  type ConservationStatus,
  type SpeciesCategory,
} from "@/db/schema";
import { CATEGORY_LABEL, CONSERVATION } from "@/lib/format";
import { SpecimenCard } from "@/components/ui/SpecimenCard";
import { cn } from "@/lib/cn";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Índice de especies",
  description:
    "Catálogo filtrable de especies endémicas de Campeche por categoría taxonómica y estado de conservación UICN.",
};

type SP = { cat?: string; estado?: string };

function buildHref(current: SP, patch: Partial<SP>): string {
  const merged = { ...current, ...patch };
  const qs = new URLSearchParams();
  if (merged.cat) qs.set("cat", merged.cat);
  if (merged.estado) qs.set("estado", merged.estado);
  const s = qs.toString();
  return s ? `/especies?${s}` : "/especies";
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "catalog border px-2.5 py-1.5 transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line bg-paper text-ink-soft hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}

export default async function IndexPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const catRaw = sp.cat;
  const estadoRaw = sp.estado;
  const cat = (SPECIES_CATEGORY as readonly string[]).includes(catRaw ?? "")
    ? (catRaw as SpeciesCategory)
    : undefined;
  const estado = (CONSERVATION_STATUS as readonly string[]).includes(
    estadoRaw ?? "",
  )
    ? (estadoRaw as ConservationStatus)
    : undefined;

  const all = await getSpeciesCatalog();
  const list = applyCatalogFilters(all, { category: cat, status: estado });
  const current: SP = { cat, estado };

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-8 sm:px-8">
      <header className="border-b-2 border-line pb-4">
        <p className="catalog text-ink-faint">Catálogo 04 · Campeche</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]">
            Índice de especies
          </h1>
          <p className="catalog text-ink-soft">
            {String(list.length).padStart(3, "0")} /{" "}
            {String(all.length).padStart(3, "0")} fichas
          </p>
        </div>
      </header>

      {/* Filtros */}
      <div className="space-y-3 border-b border-line py-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="catalog mr-1 text-ink-faint">Categoría</span>
          <FilterChip
            href={buildHref(current, { cat: undefined })}
            active={!cat}
          >
            Todas
          </FilterChip>
          {SPECIES_CATEGORY.map((c) => (
            <FilterChip
              key={c}
              href={buildHref(current, { cat: cat === c ? undefined : c })}
              active={cat === c}
            >
              {CATEGORY_LABEL[c]}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="catalog mr-1 text-ink-faint">Estado UICN</span>
          <FilterChip
            href={buildHref(current, { estado: undefined })}
            active={!estado}
          >
            Todos
          </FilterChip>
          {CONSERVATION_STATUS.map((s) => (
            <FilterChip
              key={s}
              href={buildHref(current, {
                estado: estado === s ? undefined : s,
              })}
              active={estado === s}
            >
              {s} · {CONSERVATION[s].es}
            </FilterChip>
          ))}
        </div>

        {(cat || estado) && (
          <Link
            href="/especies"
            className="catalog inline-block text-rust hover:underline"
          >
            ✕ Limpiar filtros
          </Link>
        )}
      </div>

      {/* Rejilla */}
      {list.length === 0 ? (
        <p className="py-24 text-center text-ink-soft">
          Ninguna ficha coincide con este filtro.{" "}
          <Link href="/especies" className="text-rust hover:underline">
            Ver todas →
          </Link>
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <li key={s.slug}>
              <SpecimenCard species={s} index={i} priority={i < 3} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
