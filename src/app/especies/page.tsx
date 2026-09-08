import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getSpeciesCatalog } from "@/lib/queries";
import {
  SPECIES_CATEGORY,
  type ConservationStatus,
  type SpeciesCategory,
} from "@/db/schema";
import { CATEGORY_LABEL } from "@/lib/format";
import { StorybookCard } from "@/components/ui/StorybookCard";
import { cn } from "@/lib/cn";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "El índice de criaturas",
  description:
    "Todos los animales del libro, para buscar por tipo (mamíferos, aves…) y por cómo están: si les va bien o si necesitan ayuda.",
};

type SP = { tipo?: string; estado?: string };

const CARE_GROUPS = {
  bien: {
    label: "Les va bien",
    emoji: "🌳",
    tone: "bg-jungle text-jungle-ink",
    set: ["LC", "NT"] as ConservationStatus[],
  },
  ayuda: {
    label: "Necesitan ayuda",
    emoji: "🌤️",
    tone: "bg-sun text-sun-ink",
    set: ["VU", "DD"] as ConservationStatus[],
  },
  peligro: {
    label: "En peligro",
    emoji: "🆘",
    tone: "bg-coral text-coral-ink",
    set: ["EN", "CR", "EW", "EX"] as ConservationStatus[],
  },
} as const;
type CareKey = keyof typeof CARE_GROUPS;

const CAT_TONE: Record<SpeciesCategory, string> = {
  mamiferos: "bg-jungle text-jungle-ink",
  aves: "bg-sky text-sky-ink",
  reptiles: "bg-sun text-sun-ink",
  flora: "bg-coral text-coral-ink",
  marino: "bg-lavender text-lavender-ink",
};

function href(cur: SP, patch: Partial<SP>): string {
  const m = { ...cur, ...patch };
  const qs = new URLSearchParams();
  if (m.tipo) qs.set("tipo", m.tipo);
  if (m.estado) qs.set("estado", m.estado);
  const s = qs.toString();
  return s ? `/especies?${s}` : "/especies";
}

function FilterButton({
  to,
  active,
  tone,
  emoji,
  children,
}: {
  to: string;
  active: boolean;
  tone?: string;
  emoji?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={to}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-[3px] border-line px-4 py-2 text-sm font-extrabold",
        "shadow-[0_4px_0_0_var(--line)] transition-transform duration-150 ease-[var(--ease-bounce)]",
        "hover:-translate-y-0.5 active:translate-y-[4px] active:scale-95 active:shadow-none",
        active ? tone ?? "bg-ink text-paper" : "bg-paper text-ink-soft",
      )}
    >
      {emoji ? <span aria-hidden>{emoji}</span> : null}
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
  const tipo = (SPECIES_CATEGORY as readonly string[]).includes(sp.tipo ?? "")
    ? (sp.tipo as SpeciesCategory)
    : undefined;
  const estado = (
    sp.estado && sp.estado in CARE_GROUPS ? (sp.estado as CareKey) : undefined
  );

  const all = await getSpeciesCatalog();
  const list = all.filter((s) => {
    if (tipo && s.category !== tipo) return false;
    if (estado && !CARE_GROUPS[estado].set.includes(s.conservationStatus))
      return false;
    return true;
  });
  const cur: SP = { tipo, estado };

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-12 pt-10 sm:px-8">
      <header>
        <p className="hand text-xl text-ink-soft">todas las criaturas del libro</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-[clamp(2.4rem,8vw,5rem)] leading-[0.98]">
            El índice de criaturas
          </h1>
          <p className="rounded-full border-[3px] border-line bg-sun px-3 py-1 text-sm font-extrabold text-sun-ink">
            {list.length} de {all.length}
          </p>
        </div>
      </header>

      {/* Filtros */}
      <div className="mt-8 space-y-4 rounded-[26px] border-[3px] border-line bg-paper-2 p-5">
        <div>
          <p className="catalog mb-2 text-ink-faint">¿Qué tipo de animal?</p>
          <div className="flex flex-wrap gap-2">
            <FilterButton to={href(cur, { tipo: undefined })} active={!tipo}>
              Todos
            </FilterButton>
            {SPECIES_CATEGORY.map((c) => (
              <FilterButton
                key={c}
                to={href(cur, { tipo: tipo === c ? undefined : c })}
                active={tipo === c}
                tone={CAT_TONE[c]}
              >
                {CATEGORY_LABEL[c]}
              </FilterButton>
            ))}
          </div>
        </div>

        <div>
          <p className="catalog mb-2 text-ink-faint">¿Cómo están?</p>
          <div className="flex flex-wrap gap-2">
            <FilterButton to={href(cur, { estado: undefined })} active={!estado}>
              Todas
            </FilterButton>
            {(Object.keys(CARE_GROUPS) as CareKey[]).map((k) => (
              <FilterButton
                key={k}
                to={href(cur, { estado: estado === k ? undefined : k })}
                active={estado === k}
                tone={CARE_GROUPS[k].tone}
                emoji={CARE_GROUPS[k].emoji}
              >
                {CARE_GROUPS[k].label}
              </FilterButton>
            ))}
          </div>
        </div>

        {(tipo || estado) && (
          <Link
            href="/especies"
            className="hand inline-block text-lg text-rust hover:underline"
          >
            ✕ quitar filtros
          </Link>
        )}
      </div>

      {/* Rejilla */}
      {list.length === 0 ? (
        <p className="py-20 text-center text-lg text-ink-soft">
          Ninguna criatura coincide con esa búsqueda.{" "}
          <Link href="/especies" className="font-extrabold text-rust hover:underline">
            Ver todas →
          </Link>
        </p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <li key={s.slug}>
              <StorybookCard species={s} index={i} />
            </li>
          ))}
        </ul>
      )}

      {estado === "peligro" && list.length > 0 && (
        <p className="mt-8 rounded-[20px] border-[3px] border-dashed border-rust bg-paper px-4 py-3 text-sm text-ink-soft">
          <strong className="text-rust">Ojo:</strong> estas criaturas están de
          verdad en peligro de desaparecer. Cuidar su selva y sus ríos es la
          mejor forma de ayudarlas.
        </p>
      )}
    </div>
  );
}
