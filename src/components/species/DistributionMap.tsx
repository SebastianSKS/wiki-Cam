import { cn } from "@/lib/cn";

/**
 * Carta esquemática de la distribución municipal de Campeche.
 * No es un mapa topográfico: es un diagrama de registro. Cada nodo es un
 * municipio en su posición geográfica aproximada; los activos van en óxido.
 */

type Node = { slug: string; name: string; x: number; y: number };

// x: 0 (oeste) → 1 (este) · y: 0 (norte) → 1 (sur)
const NODES: Node[] = [
  { slug: "dzitbalche", name: "Dzitbalché", x: 0.40, y: 0.10 },
  { slug: "calkini", name: "Calkiní", x: 0.34, y: 0.06 },
  { slug: "hecelchakan", name: "Hecelchakán", x: 0.46, y: 0.16 },
  { slug: "tenabo", name: "Tenabo", x: 0.44, y: 0.26 },
  { slug: "campeche", name: "Campeche", x: 0.40, y: 0.37 },
  { slug: "hopelchen", name: "Hopelchén", x: 0.74, y: 0.32 },
  { slug: "seybaplaya", name: "Seybaplaya", x: 0.42, y: 0.46 },
  { slug: "champoton", name: "Champotón", x: 0.46, y: 0.56 },
  { slug: "escarcega", name: "Escárcega", x: 0.54, y: 0.66 },
  { slug: "carmen", name: "Carmen", x: 0.18, y: 0.70 },
  { slug: "palizada", name: "Palizada", x: 0.10, y: 0.80 },
  { slug: "candelaria", name: "Candelaria", x: 0.42, y: 0.84 },
  { slug: "calakmul", name: "Calakmul", x: 0.80, y: 0.82 },
];

// contorno muy aproximado del estado, sólo como marco
const OUTLINE =
  "M28,10 L54,6 L60,20 L92,26 L96,44 L82,58 L72,52 L60,64 L66,86 L96,92 L92,116 L52,124 L38,110 L30,120 L14,104 L20,84 L34,74 L26,56 L34,40 L24,26 Z";

const W = 110;
const H = 132;

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
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full text-ink"
        role="img"
        aria-label={`Vive en ${active.length} de ${NODES.length} municipios de Campeche`}
      >
        <path d={OUTLINE} fill="var(--jungle)" opacity="0.14" />
        <path
          d={OUTLINE}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
          strokeDasharray="2 2.4"
          opacity="0.5"
        />

        {NODES.map((n) => {
          const on = activeSet.has(n.slug);
          const cx = 8 + n.x * (W - 16);
          const cy = 6 + n.y * (H - 14);
          return (
            <g key={n.slug}>
              {on && (
                <circle
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill="none"
                  stroke="var(--rust)"
                  strokeWidth="0.8"
                  opacity="0.5"
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={on ? "2.6" : "1.9"}
                fill={on ? "var(--rust)" : "var(--paper)"}
                stroke="currentColor"
                strokeWidth="0.9"
                opacity={on ? 1 : 0.55}
              />
              {showLabels && (
                <text
                  x={cx + 4}
                  y={cy + 1.2}
                  fontSize="3"
                  fontFamily="var(--font-body)"
                  fontWeight={on ? 800 : 600}
                  fill="currentColor"
                  opacity={on ? 0.95 : 0.42}
                >
                  {n.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export { NODES as DISTRIBUTION_NODES };
