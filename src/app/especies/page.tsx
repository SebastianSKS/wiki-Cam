import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getSpeciesCatalog } from "@/lib/queries";
import {
  SPECIES_CATEGORY,
  PRESENCE_TYPE,
  type ConservationStatus,
  type PresenceType,
  type SpeciesCategory,
} from "@/db/schema";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { CATEGORY_LABEL } from "@/lib/format";
import { StorybookCard } from "@/components/ui/StorybookCard";
import {
  TreeIcon,
  CloudSunIcon,
  LifeRingIcon,
  StarIcon,
  HomeIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "El índice de criaturas",
  description:
    "Toda la fauna y flora del libro, para buscar por tipo, por cómo están y por si sólo viven aquí o comparten hogar con vecinos cercanos.",
};

type SP = { tipo?: string; estado?: string; presencia?: string };

const PRESENCE_GROUPS = {
  endemic: {
    label: "Sólo aquí",
    Icon: StarIcon,
    tone: "bg-sun text-sun-ink",
  },
  native: {
    label: "También en otras partes",
    Icon: HomeIcon,
    tone: "bg-jungle text-jungle-ink",
  },
} as const satisfies Record<
  PresenceType,
  { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; tone: string }
>;

const CARE_GROUPS = {
  bien: {
    label: "Les va bien",
    Icon: TreeIcon,
    tone: "bg-jungle text-jungle-ink",
    set: ["LC", "NT"] as ConservationStatus[],
  },
  ayuda: {
    label: "Necesitan ayuda",
    Icon: CloudSunIcon,
    tone: "bg-sun text-sun-ink",
    set: ["VU", "DD"] as ConservationStatus[],
  },
  peligro: {
    label: "En peligro",
    Icon: LifeRingIcon,
    tone: "bg-coral text-coral-ink",
    set: ["EN", "CR", "EW", "EX"] as ConservationStatus[],
  },
} as const satisfies Record<
  string,
  {
    label: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    tone: string;
    set: ConservationStatus[];
  }
>;
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
  if (m.presencia) qs.set("presencia", m.presencia);
  const s = qs.toString();
  return s ? `/especies?${s}` : "/especies";
}

function FilterButton({
  to,
  active,
  tone,
  icon,
  children,
}: {
  to: string;
  active: boolean;
  tone?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      href={to}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-[3px] border-line px-4 py-2 text-sm font-extrabold",
        "shadow-[var(--shadow-toy)] transition-transform duration-150 ease-[var(--ease-bounce)]",
        "hover:-translate-y-0.5 active:translate-y-1 active:scale-95 active:shadow-[var(--shadow-toy-press)]",
        active ? tone ?? "bg-ink text-paper" : "bg-paper text-ink-soft",
      )}
    >
      {icon ? <span className="-ml-0.5 shrink-0">{icon}</span> : null}
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
  const presencia = (PRESENCE_TYPE as readonly string[]).includes(
    sp.presencia ?? "",
  )
    ? (sp.presencia as PresenceType)
    : undefined;

  const all = await getSpeciesCatalog();
  const list = all.filter((s) => {
    if (tipo && s.category !== tipo) return false;
    if (estado && !CARE_GROUPS[estado].set.includes(s.conservationStatus))
      return false;
    if (presencia && s.presenceType !== presencia) return false;
    return true;
  });
  const cur: SP = { tipo, estado, presencia };

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
            {(Object.keys(CARE_GROUPS) as CareKey[]).map((k) => {
              const Icon = CARE_GROUPS[k].Icon;
              return (
                <FilterButton
                  key={k}
                  to={href(cur, { estado: estado === k ? undefined : k })}
                  active={estado === k}
                  tone={CARE_GROUPS[k].tone}
                  icon={<Icon className="h-[18px] w-[18px]" />}
                >
                  {CARE_GROUPS[k].label}
                </FilterButton>
              );
            })}
          </div>
        </div>

        <div>
          <p className="catalog mb-2 text-ink-faint">¿Sólo vive aquí?</p>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              to={href(cur, { presencia: undefined })}
              active={!presencia}
            >
              Todas
            </FilterButton>
            {(Object.keys(PRESENCE_GROUPS) as PresenceType[]).map((k) => {
              const Icon = PRESENCE_GROUPS[k].Icon;
              return (
                <FilterButton
                  key={k}
                  to={href(cur, { presencia: presencia === k ? undefined : k })}
                  active={presencia === k}
                  tone={PRESENCE_GROUPS[k].tone}
                  icon={<Icon className="h-[18px] w-[18px]" />}
                >
                  {PRESENCE_GROUPS[k].label}
                </FilterButton>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            Algunas criaturas sólo existen en esta región; otras también viven
            en otras partes de América.
          </p>
        </div>

        {(tipo || estado || presencia) && (
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
