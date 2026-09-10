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

/** Ajuste fino de la etiqueta donde el reparto automático se amontona
 *  (norte del estado, sobre todo). `side` fuerza el lado; `dy` la separa. */
const LABEL_TWEAK: Record<string, { side?: "start" | "end"; dy?: number }> = {
  calkini: { side: "end", dy: -2 },
  dzitbalche: { side: "start", dy: -1 },
  hecelchakan: { side: "end" },
  tenabo: { side: "end", dy: 1 },
  campeche: { side: "start" },
  seybaplaya: { side: "end", dy: 4 },
  hopelchen: { side: "start" },
  champoton: { side: "end", dy: -1 },
  escarcega: { side: "end" },
  candelaria: { side: "start", dy: 3 },
  calakmul: { side: "start", dy: 1 },
};

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

        {/* Pines: uno por municipio, en su centroide real */}
        {ORDER.map((slug) => {
          const m = CAMPECHE_MUNI[slug];
          const on = activeSet.has(slug);
          const side =
            LABEL_TWEAK[slug]?.side ??
            (m.cx > CAMPECHE_W * 0.52 ? "end" : "start");
          const lx = m.cx + (side === "start" ? 4 : -4);
          const ly = m.cy + 1.6 + (LABEL_TWEAK[slug]?.dy ?? 0);
          return (
            <g key={slug} className="pin" style={{ transformOrigin: `${m.cx}px ${m.cy}px` }}>
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
              {showLabels && (
                <text
                  x={lx}
                  y={ly}
                  textAnchor={side}
                  fontSize="5.6"
                  fontFamily="var(--font-body)"
                  fontWeight={on ? 800 : 600}
                  fill="currentColor"
                  opacity={on ? 0.95 : 0.5}
                  paintOrder="stroke"
                  stroke="var(--paper)"
                  strokeWidth="1.9"
                  strokeLinejoin="round"
                >
                  {m.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
