/* ============================================================
   SELLOS DE EXPLORADOR · prototipo del "Quiz del Explorador"
   ------------------------------------------------------------
   Estado ligero en localStorage: qué especies ya tienen su
   sello. Pensado para las 18 especies aunque hoy sólo el
   jaguar pueda dar uno.

   Es parte del prototipo del quiz. Para quitar la función por
   completo: borra este archivo, `ExplorerQuiz.tsx`,
   `StampCounter.tsx` y las dos líneas que los montan
   (ficha de especie y cabecera). Nada más depende de esto.
   ============================================================ */

const KEY = "wiki-campeche:sellos";

/** Total de criaturas del libro (para el marcador "n/18"). */
export const TOTAL_SELLOS = 18;

/** Evento propio para que la cabecera se entere sin recargar. */
export const STAMP_EVENT = "wiki-campeche:sellos-cambio";

/** Slugs de especies con sello conseguido. Nunca lanza. */
export function readStamps(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string");
  } catch {
    return [];
  }
}

export function hasStamp(slug: string): boolean {
  return readStamps().includes(slug);
}

/** Guarda el sello de una especie (idempotente) y avisa a quien escuche. */
export function addStamp(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = readStamps();
    if (current.includes(slug)) return;
    window.localStorage.setItem(KEY, JSON.stringify([...current, slug]));
    window.dispatchEvent(new Event(STAMP_EVENT));
  } catch {
    /* almacenamiento no disponible (modo privado, etc.):
       el quiz sigue jugable, sólo no recuerda el sello. */
  }
}
