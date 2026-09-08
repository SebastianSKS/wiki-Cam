import type {
  ConservationStatus,
  SpeciesCategory,
} from "@/db/schema";

/** Número de catálogo tipo museo: CAM·MAM·0007 */
export function catalogNumber(id: number, category: SpeciesCategory): string {
  const cat: Record<SpeciesCategory, string> = {
    mamiferos: "MAM",
    aves: "AVE",
    reptiles: "REP",
    flora: "FLO",
    marino: "MAR",
  };
  return `CAM·${cat[category]}·${String(id).padStart(4, "0")}`;
}

export const CATEGORY_LABEL: Record<SpeciesCategory, string> = {
  mamiferos: "Mamíferos",
  aves: "Aves",
  reptiles: "Reptiles",
  flora: "Flora",
  marino: "Marino",
};

type ConservationMeta = {
  code: ConservationStatus;
  es: string;
  /** 0 = sin riesgo … 6 = extinta. DD se trata aparte (−1). */
  level: number;
  tone: "safe" | "watch" | "risk" | "critical" | "gone" | "unknown";
};

export const CONSERVATION: Record<ConservationStatus, ConservationMeta> = {
  LC: { code: "LC", es: "Preocupación menor", level: 0, tone: "safe" },
  NT: { code: "NT", es: "Casi amenazada", level: 1, tone: "watch" },
  VU: { code: "VU", es: "Vulnerable", level: 2, tone: "risk" },
  EN: { code: "EN", es: "En peligro", level: 3, tone: "risk" },
  CR: { code: "CR", es: "En peligro crítico", level: 4, tone: "critical" },
  EW: { code: "EW", es: "Extinta en estado silvestre", level: 5, tone: "gone" },
  EX: { code: "EX", es: "Extinta", level: 6, tone: "gone" },
  DD: { code: "DD", es: "Datos insuficientes", level: -1, tone: "unknown" },
};

/** Escala UICN ordenada para el medidor. */
export const CONSERVATION_SCALE: ConservationStatus[] = [
  "LC",
  "NT",
  "VU",
  "EN",
  "CR",
  "EW",
  "EX",
];

export function binomial(genus: string, epithet: string): string {
  return `${genus} ${epithet}`;
}
