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

async function wikiSummary(lang: string, title: string): Promise<WikiSummary | null> {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title,
  )}`;
  const data = await getJson<WikiSummary>(url);
  if (!data || data.type === "disambiguation") return null;
  if (!data.originalimage?.source && !data.thumbnail?.source) return null;
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

/**
 * Excepciones revisadas a mano: slugs donde la imagen principal del artículo
 * en español NO sirve (es un dibujo/lámina antigua, la especie equivocada, o
 * sin atribución). Se fuerza otra página de Wikipedia como fuente.
 *   ceiba  → es: encabeza con una lámina botánica de Blanco (1880s), no una
 *            foto. en:Ceiba pentandra trae una foto real del árbol.
 *   tapir  → la foto en es no tiene autor en Commons; la de en (madre + cría
 *            rayada, Featured Picture) sí, y encaja con su dato curioso.
 */
const OVERRIDES: Record<string, { lang: string; title: string }> = {
  ceiba: { lang: "en", title: "Ceiba pentandra" },
  "tapir-centroamericano": { lang: "en", title: "Tapirus bairdii" },
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
  const override = OVERRIDES[slug];

  let summary: WikiSummary | null;
  let lang: string;
  if (override) {
    lang = override.lang;
    summary = await wikiSummary(override.lang, override.title);
    if (summary) console.log(`  (override: ${override.lang}:${override.title})`);
  } else {
    summary = await wikiSummary("es", sci);
    lang = "es";
    if (!summary) {
      summary = await wikiSummary("en", sci);
      lang = "en";
    }
  }
  if (!summary) {
    console.log(`— ${slug} (${sci}): sin artículo con foto en Wikipedia (es/en). No se toca.`);
    return;
  }

  const original = summary.originalimage?.source ?? summary.thumbnail!.source;
  const fileName = commonsFileName(original);
  const photoUrl = displayUrl(original);

  let credit = "Foto: Wikimedia Commons";
  let sourceUrl =
    summary.content_urls?.desktop?.page ??
    `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(override?.title ?? sci)}`;

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
