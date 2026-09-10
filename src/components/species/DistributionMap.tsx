import { cn } from "@/lib/cn";
import {
  CAMPECHE_MUNI,
  CAMPECHE_STATE_PATH,
  CAMPECHE_VIEWBOX,
  CAMPECHE_W,
} from "./campeche-geo";

/**
 * Mapa de la distribución municipal de Campeche.
 * El contorno del estado y sus 13 municipios son la forma geográfica real
 * (INEGI, Marco Geoestadístico, dic. 2025 · servicio wscatgeo), simplificada
 * y proyectada por scripts/build-campeche-map.mjs. Redibujada con el mismo
 * trazo grueso e imperfecto y el filtro de acuarela del resto del libro.
 * Cada pin va en el centroide real de su municipio; los activos van en óxido.
 */

const ORDER = [
  "calkini", "dzitbalche", "hecelchakan", "tenabo", "campeche",
  "seybaplaya", "hopelchen", "champoton", "escarcega", "carmen",
  "palizada", "candelaria", "calakmul",
] as const;

/**
 * Racimo del centro-norte: Calkiní, Dzitbalché, Hecelchakán, Tenabo, Campeche
 * y Seybaplaya quedan tan juntos que sus nombres se enciman aunque el mapa sea
 * grande. Se aparcan en una columna sobre el Golfo (a la izquierda) y una línea
 * guía fina conecta cada nombre con su punto. `ly` es la línea base del texto.
 */
const LEADER: Record<string, { ly: number }> = {
  calkini: { ly: 25 },
  dzitbalche: { ly: 41 },
  hecelchakan: { ly: 57 },
  tenabo: { ly: 73 },
  campeche: { ly: 89 },
  seybaplaya: { ly: 106 },
};
const LEADER_X = 92; // borde derecho de la columna de nombres aparcados (centro vertical del texto)

/** Ajuste fino de las etiquetas que sí caben junto a su punto. */
const INLINE_TWEAK: Record<string, { side?: "start" | "end"; dy?: number }> = {
  // Hopelchén y Calakmul llegan casi al borde derecho: sus nombres van hacia
  // adentro (oeste), sobre su propio territorio.
  hopelchen: { side: "end" },
  // Champotón va hacia el este (a su territorio) para no chocar con la columna
  // de nombres aparcados del racimo del norte.
  champoton: { side: "start", dy: 1 },
  escarcega: { side: "end" },
  carmen: { side: "end" },
  palizada: { side: "start", dy: 2 },
  candelaria: { side: "start", dy: 2 },
  // Calakmul es el municipio más grande y llega casi al borde: el nombre va
  // hacia adentro (oeste), sobre su propio territorio, para que no lo corte
  // el marco.
  calakmul: { side: "end", dy: 0 },
};

const FONT = 6.2; // tamaño base (unidades de viewBox) para el cálculo de posiciones
const HALO = 2.2;
const GAP = 5.8; // separación etiqueta ↔ punto en las etiquetas en línea

/* La misma etiqueta se ve en un mapa de ~740 px (escritorio) y en uno de
   ~330 px (móvil): sin este ajuste los nombres quedan diminutos en el móvil.
   El font-size en un <style> de SVG está en unidades de viewBox y la media
   query se evalúa contra el viewport, así que sólo crece en pantallas chicas. */
const LABEL_CSS = `
  .mapa-lbl { font-size: ${FONT}px; }
  @media (max-width: 640px) { .mapa-lbl { font-size: 8px; } }
`;

export function DistributionMap({
  active,
  className,
  showLabels = true,
}: {
  active: string[];
  className?: string;
  showLabels?: boolean;
}) {
  const activeSet = new Set(active);

  return (
    <figure
      className={cn(
        "relative overflow-hidden border-[4px] border-line bg-paper p-2",
        className,
      )}
      style={{ borderRadius: "38% 62% 58% 42% / 45% 45% 55% 55%" }}
    >
      <svg
        viewBox={CAMPECHE_VIEWBOX}
        className="h-auto w-full text-ink [&_.pin]:transition-transform [&_.pin:hover]:scale-[1.35]"
        role="img"
        aria-label={`Mapa de Campeche: se ha visto alguna criatura en ${active.length} de ${ORDER.length} municipios`}
      >
        {showLabels && <style>{LABEL_CSS}</style>}

        {/* Silueta real, con el temblor de acuarela del resto de ilustraciones */}
        <g
          filter="url(#wc-paint-soft)"
          stroke="var(--cacao)"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {ORDER.map((slug) => (
            <path
              key={slug}
              d={CAMPECHE_MUNI[slug].d}
              fill="var(--jungle)"
              fillOpacity={activeSet.has(slug) ? 0.24 : 0.1}
              strokeWidth="0.7"
              strokeOpacity="0.55"
            />
          ))}
          <path
            d={CAMPECHE_STATE_PATH}
            fill="none"
            strokeWidth="2.4"
            strokeOpacity="0.9"
          />
        </g>

        {/* Líneas guía del racimo del centro-norte (van bajo las etiquetas) */}
        {showLabels &&
          Object.entries(LEADER).map(([slug, p]) => {
            const m = CAMPECHE_MUNI[slug];
            return (
              <line
                key={slug}
                x1={LEADER_X + 2}
                y1={p.ly}
                x2={m.cx}
                y2={m.cy}
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
                opacity="0.42"
              />
            );
          })}

        {/* Pines: uno por municipio, en su centroide real */}
        {ORDER.map((slug) => {
          const m = CAMPECHE_MUNI[slug];
          const on = activeSet.has(slug);
          return (
            <g
              key={slug}
              className="pin"
              style={{ transformOrigin: `${m.cx}px ${m.cy}px` }}
            >
              <title>
                {`${m.name} · ${on ? "con criaturas del libro" : "todavía sin registrar"}`}
              </title>
              {on && (
                <circle
                  cx={m.cx}
                  cy={m.cy}
                  r="4.6"
                  fill="none"
                  stroke="var(--rust)"
                  strokeWidth="0.8"
                  opacity="0.5"
                />
              )}
              <circle
                cx={m.cx}
                cy={m.cy}
                r={on ? "2.6" : "1.9"}
                fill={on ? "var(--rust)" : "var(--paper)"}
                stroke="currentColor"
                strokeWidth="0.9"
                opacity={on ? 1 : 0.6}
              />
            </g>
          );
        })}

        {/* Etiquetas: en columna con línea guía las del racimo, junto al punto el resto */}
        {showLabels &&
          ORDER.map((slug) => {
            const m = CAMPECHE_MUNI[slug];
            const on = activeSet.has(slug);
            const lead = LEADER[slug];

            let x: number;
            let y: number;
            let anchor: "start" | "end";
            if (lead) {
              x = LEADER_X;
              y = lead.ly;
              anchor = "end";
            } else {
              const side =
                INLINE_TWEAK[slug]?.side ??
                (m.cx > CAMPECHE_W * 0.52 ? "end" : "start");
              anchor = side;
              x = m.cx + (side === "start" ? GAP : -GAP);
              y = m.cy + (INLINE_TWEAK[slug]?.dy ?? 0);
            }

            return (
              <text
                key={slug}
                className="mapa-lbl"
                x={x}
                y={y}
                textAnchor={anchor}
                dominantBaseline="central"
                fontFamily="var(--font-body)"
                fontWeight={on ? 800 : 600}
                fill="currentColor"
                opacity={on ? 0.98 : 0.62}
                paintOrder="stroke"
                stroke="var(--paper)"
                strokeWidth={HALO}
                strokeLinejoin="round"
              >
                {m.name}
              </text>
            );
          })}
      </svg>
    </figure>
  );
}
