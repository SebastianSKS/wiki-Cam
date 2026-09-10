import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { db } from "../src/db/index";
import { species } from "../src/db/schema";

/* ============================================================
   FETCH-PHOTOS · foto real de cada especie (extra que se revela)
   ------------------------------------------------------------
   Dado el nombre científico:
     1. Wikipedia REST summary (es, con fallback a en) → originalimage
     2. Con el nombre del archivo, Wikimedia Commons API
        (prop=imageinfo&iiprop=extmetadata) → autor + licencia reales
     3. Guarda photo_url / photo_credit / photo_source_url en `species`

   Uso:
     npx tsx scripts/fetch-photos.ts jaguar
     npx tsx scripts/fetch-photos.ts            (todas las especies)
   ============================================================ */

const UA =
  "wiki-campeche/1.0 (proyecto educativo sin fines de lucro; fauna de Campeche)";
// upload.wikimedia.org rechaza la generación de miniaturas nuevas a clientes
// "de bot"; con UA de navegador + Referer responde 200 y deja la miniatura
// cacheada en el edge (para que luego el optimizador de next/image la baje bien).
const BROWSER_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

type WikiSummary = {
  type?: string;
  title?: string;
  /** Descripción corta ("insecto", "especie de ave", …). */
  description?: string;
  /** Resumen en texto plano (primer párrafo). */
  extract?: string;
  originalimage?: { source: string; width: number; height: number };
  thumbnail?: { source: string };
  content_urls?: { desktop?: { page?: string } };
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * GET JSON con reintentos. Distingue "no existe" (404 → null definitivo) de
 * "ahora no puedo" (429 / 5xx / red → espera y reintenta). Sin esto, el
 * rate-limit de la API de Wikipedia hacía que especies con artículo y foto
 * se marcaran como "sin artículo".
 */
async function getJson<T>(url: string, tries = 4): Promise<T | null> {
  for (let i = 0; i < tries; i++) {
    let res: Response;
    try {
      res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/json" },
      });
    } catch {
      await sleep(800 * (i + 1));
      continue;
    }
    if (res.ok) return (await res.json()) as T;
    if (res.status === 404) return null; // genuinamente no existe
    if (res.status === 429 || res.status >= 500) {
      const wait = Number(res.headers.get("retry-after")) * 1000 || 1200 * (i + 1);
      await sleep(wait);
      continue;
    }
    return null; // 4xx varios: no reintentar
  }
  return null;
}

/**
 * Descarta imágenes que casi seguro NO son una fotografía: láminas históricas
 * (FMIB = Freshwater and Marine Image Bank), grabados, ilustraciones, mapas de
 * distribución y SVG. Ej.: el artículo de Leptuca thayeri encabeza con una
 * lámina científica ("FMIB_43738_Uca_thayeri…"), no con una foto.
 */
function looksLikeIllustration(imageUrl: string): boolean {
  const f = decodeURIComponent(imageUrl.split("?")[0]).toLowerCase();
  return /\.svg$|fmib_|_plate|plate_|illustration|lithograph|engrav|drawing|\bmap\b|distribution|range_map|\.tif$/.test(
    f,
  );
}

async function wikiSummary(lang: string, title: string): Promise<WikiSummary | null> {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title,
  )}`;
  const data = await getJson<WikiSummary>(url);
  if (!data || data.type === "disambiguation") return null;
  const img = data.originalimage?.source ?? data.thumbnail?.source;
  if (!img) return null;
  if (looksLikeIllustration(img)) return null;
  return data;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Descompone cualquier URL de imagen de Wikimedia (host `upload.` o `thumb.`,
 * original o miniatura, con o sin querystring) en sus partes de Commons.
 */
function parseCommons(imageUrl: string): { a: string; ab: string; file: string } | null {
  const noQuery = imageUrl.split("?")[0];
  // .../wikipedia/commons/a/ab/Archivo.jpg
  // .../wikipedia/commons/thumb/a/ab/Archivo.jpg/800px-Archivo.jpg
  const m = noQuery.match(
    /\/wikipedia\/commons\/(?:thumb\/)?([0-9a-f])\/([0-9a-f]{2})\/([^/]+)/i,
  );
  if (!m) return null;
  return { a: m[1], ab: m[2], file: m[3] };
}

function commonsFileName(imageUrl: string): string | null {
  const p = parseCommons(imageUrl);
  return p ? decodeURIComponent(p.file) : null;
}

/**
 * URL de visualización: siempre `upload.wikimedia.org`, miniatura de ancho
 * acotado y sin querystring (evita servir el original de varios MB y mantiene
 * un único host en `next.config`).
 */
function displayUrl(imageUrl: string, width = 1280): string {
  const p = parseCommons(imageUrl);
  if (!p) return imageUrl.split("?")[0];
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${p.a}/${p.ab}/${p.file}/${width}px-${p.file}`;
}

/** Fuerza la generación de la miniatura y la deja cacheada en el edge. */
async function warmThumbnail(url: string): Promise<number> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": BROWSER_UA, Referer: "https://es.wikipedia.org/" },
    });
    return res.status;
  } catch {
    return 0;
  }
}

type ExtMeta = Record<string, { value: string } | undefined>;

async function commonsCredit(fileName: string): Promise<{
  credit: string;
  sourceUrl: string;
} | null> {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=${encodeURIComponent(
    "File:" + fileName,
  )}`;
  const data = await getJson<{
    query?: { pages?: Record<string, { imageinfo?: { extmetadata?: ExtMeta }[] }> };
  }>(api);
  const pages = data?.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  const meta = page?.imageinfo?.[0]?.extmetadata;
  if (!meta) return null;

  const artist = meta.Artist?.value ? stripHtml(meta.Artist.value) : "";
  const license = meta.LicenseShortName?.value
    ? stripHtml(meta.LicenseShortName.value)
    : "";
  const attribution = meta.Attribution?.value
    ? stripHtml(meta.Attribution.value)
    : "";

  const author = artist || attribution || "autoría no especificada";
  const lic = license || "ver licencia en Wikimedia Commons";
  return {
    credit: `Foto: ${author} · ${lic}`,
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${fileName.replace(/ /g, "_")}`,
  };
}

type Candidate = { lang: string; title: string };

/**
 * Candidatos revisados a mano para slugs donde el nombre científico de la base
 * no sirve para buscar en Wikipedia. Se prueban EN ORDEN; gana el primero con
 * artículo y una foto real. Si ninguno sirve, la especie se queda sin foto.
 *
 *   ceiba   → "Ceiba pentandra" en es encabeza con una lámina botánica de
 *             Blanco (1880s), no una foto → se fuerza en:Ceiba pentandra.
 *   tapir   → la foto de es no tiene autor en Commons → en:Tapirus bairdii
 *             (madre + cría rayada, Featured Picture, con autor y CC BY-SA 4.0).
 *   cangrejo violinista → la base guarda "Uca sp." (especie sin determinar).
 *             Lista de cangrejos violinistas reales del Golfo de México /
 *             Caribe. Verificado a mano que el artículo elegido reporte
 *             distribución en México y que su imagen sea una fotografía:
 *               1. Leptuca panacea — el artículo dice literalmente "along the
 *                  Gulf of Mexico from northwestern Florida to Mexico"; foto
 *                  real de dos machos ondeando la pinza (CC BY 4.0). ✓
 *               2-4. respaldo si (1) cae: Minuca rapax / M. longisignalis /
 *                  Leptuca thayeri (artículos más pobres; thayeri además
 *                  encabeza con lámina científica, que el filtro descarta).
 */
const CANDIDATES: Record<string, Candidate[]> = {
  ceiba: [{ lang: "en", title: "Ceiba pentandra" }],
  "tapir-centroamericano": [{ lang: "en", title: "Tapirus bairdii" }],
  "cangrejo-violinista": [
    { lang: "en", title: "Leptuca panacea" },
    { lang: "en", title: "Minuca rapax" },
    { lang: "en", title: "Minuca longisignalis" },
    { lang: "en", title: "Leptuca thayeri" },
  ],
};

async function fetchForSpecies(slug: string): Promise<void> {
  const row = await db.query.species.findFirst({
    where: eq(species.slug, slug),
    columns: { slug: true, genus: true, speciesEpithet: true, commonNameEs: true },
  });
  if (!row) {
    console.log(`✗ ${slug}: no existe en la base`);
    return;
  }
  const sci = `${row.genus} ${row.speciesEpithet}`;
  const candidates = CANDIDATES[slug];

  let summary: WikiSummary | null = null;
  let lang = "es";
  if (candidates) {
    for (const c of candidates) {
      summary = await wikiSummary(c.lang, c.title);
      if (summary) {
        lang = c.lang;
        console.log(`  (candidato usado: ${c.lang}:${c.title})`);
        break;
      }
      console.log(`  (candidato descartado, sin artículo/foto real: ${c.lang}:${c.title})`);
    }
  } else {
    summary = await wikiSummary("es", sci);
    lang = "es";
    if (!summary) {
      summary = await wikiSummary("en", sci);
      lang = "en";
    }
  }
  if (!summary) {
    console.log(`— ${slug} (${sci}): sin artículo con foto real en Wikipedia. No se toca.`);
    return;
  }

  const original = summary.originalimage?.source ?? summary.thumbnail!.source;
  const fileName = commonsFileName(original);
  const photoUrl = displayUrl(original);

  let credit = "Foto: Wikimedia Commons";
  let sourceUrl =
    summary.content_urls?.desktop?.page ??
    `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(summary.title ?? sci)}`;

  if (fileName) {
    const c = await commonsCredit(fileName);
    if (c) {
      credit = c.credit;
      sourceUrl = c.sourceUrl;
    }
  }

  const warm = await warmThumbnail(photoUrl);

  await db
    .update(species)
    .set({ photoUrl, photoCredit: credit, photoSourceUrl: sourceUrl })
    .where(eq(species.slug, slug));

  console.log(`✓ ${slug} (${sci}) · Wikipedia ${lang.toUpperCase()} · miniatura HTTP ${warm}`);
  console.log(`  página encontrada  "${summary.title ?? "?"}"  —  ${summary.description ?? "sin descripción"}`);
  if (summary.extract) {
    console.log(`  resumen           ${summary.extract.slice(0, 220).replace(/\s+/g, " ")}…`);
  }
  console.log(`  archivo Commons   ${fileName ?? "(no identificado)"}`);
  console.log(`  photo_url         ${photoUrl}`);
  console.log(`  photo_credit      ${credit}`);
  console.log(`  photo_source_url  ${sourceUrl}`);
}

async function main() {
  const args = process.argv.slice(2);
  let slugs = args;
  if (slugs.length === 0) {
    const all = await db.query.species.findMany({ columns: { slug: true } });
    slugs = all.map((s) => s.slug);
  }
  for (const slug of slugs) {
    await fetchForSpecies(slug);
    await sleep(1200); // cortesía con la API (evita el rate-limit)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
