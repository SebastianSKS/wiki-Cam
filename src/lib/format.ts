import type {
  ConservationStatus,
  PresenceType,
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

/** Relación con Campeche: exclusiva vs. compartida con vecinos. */
export const PRESENCE: Record<
  PresenceType,
  { short: string; long: string; blurb: string }
> = {
  endemic: {
    short: "Sólo existe aquí",
    long: "Sólo vive en esta región",
    blurb:
      "No vive en ningún otro lugar del mundo: cuidarla aquí es cuidarla en todas partes.",
  },
  native: {
    short: "También vive aquí",
    long: "Vive aquí y también en otras partes",
    blurb:
      "Es de Campeche, pero comparte su hogar con vecinos de otras regiones de América.",
  },
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

/* ============================================================
   MEDIDOR DE CUIDADO
   Traduce el código UICN a una plantita de 5 estados, sin
   endulzar el fondo: si está en peligro, se dice claramente.
   ============================================================ */

export type PlantStage = "bloom" | "healthy" | "thirsty" | "wilting" | "bare";

type CareMeta = {
  stage: PlantStage;
  /** 1 (marchita) … 5 (floreciente) — cuánta "vida" pintar */
  fill: number;
  headline: string;
  kidLine: string;
};

export const CARE: Record<ConservationStatus, CareMeta> = {
  LC: {
    stage: "bloom",
    fill: 5,
    headline: "Le va bien",
    kidLine: "Todavía hay muchos y su casa está sana. ¡A seguir cuidándola!",
  },
  NT: {
    stage: "healthy",
    fill: 4,
    headline: "Hay que estar pendientes",
    kidLine:
      "Aún no está en peligro, pero podría estarlo pronto si su selva se hace más pequeña.",
  },
  VU: {
    stage: "thirsty",
    fill: 3,
    headline: "Necesita ayuda",
    kidLine: "Quedan menos de los que debería. Es una especie vulnerable.",
  },
  EN: {
    stage: "wilting",
    fill: 2,
    headline: "Está en peligro",
    kidLine:
      "Quedan pocos y podrían desaparecer. Proteger su hogar es urgente.",
  },
  CR: {
    stage: "bare",
    fill: 1,
    headline: "Está en peligro crítico",
    kidLine:
      "Quedan muy, muy pocos. Es de los animales que más nos necesitan ahora.",
  },
  EW: {
    stage: "bare",
    fill: 1,
    headline: "Ya no vive en libertad",
    kidLine: "Sólo quedan algunos al cuidado de personas, ninguno en la naturaleza.",
  },
  EX: {
    stage: "bare",
    fill: 0,
    headline: "Se extinguió",
    kidLine: "Ya no existe en ningún lugar del mundo. Por eso cuidamos a los demás.",
  },
  DD: {
    stage: "thirsty",
    fill: 3,
    headline: "Nos faltan datos",
    kidLine:
      "Todavía no sabemos cuántos quedan; hace falta estudiarlo más.",
  },
};
