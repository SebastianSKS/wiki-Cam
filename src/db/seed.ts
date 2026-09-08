import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { species, regions, speciesRegions } from "./schema";
import { resolveDbCredentials } from "./config";

/** Los 13 municipios del estado de Campeche (orden y claves INEGI, entidad 04). */
const MUNICIPIOS = [
  { slug: "calkini", name: "Calkiní", seat: "Calkiní", inegiKey: "001" },
  { slug: "campeche", name: "Campeche", seat: "San Francisco de Campeche", inegiKey: "002" },
  { slug: "carmen", name: "Carmen", seat: "Ciudad del Carmen", inegiKey: "003" },
  { slug: "champoton", name: "Champotón", seat: "Champotón", inegiKey: "004" },
  { slug: "hecelchakan", name: "Hecelchakán", seat: "Hecelchakán", inegiKey: "005" },
  { slug: "hopelchen", name: "Hopelchén", seat: "Hopelchén", inegiKey: "006" },
  { slug: "palizada", name: "Palizada", seat: "Palizada", inegiKey: "007" },
  { slug: "tenabo", name: "Tenabo", seat: "Tenabo", inegiKey: "008" },
  { slug: "escarcega", name: "Escárcega", seat: "Escárcega", inegiKey: "009" },
  { slug: "calakmul", name: "Calakmul", seat: "Xpujil", inegiKey: "010" },
  { slug: "candelaria", name: "Candelaria", seat: "Candelaria", inegiKey: "011" },
  { slug: "seybaplaya", name: "Seybaplaya", seat: "Seybaplaya", inegiKey: "012" },
  { slug: "dzitbalche", name: "Dzitbalché", seat: "Dzitbalché", inegiKey: "013" },
] as const;

type SpeciesSeed = typeof species.$inferInsert & { regionSlugs: string[] };

const SPECIES: SpeciesSeed[] = [
  {
    slug: "jaguar",
    commonNameEs: "Jaguar",
    genus: "Panthera",
    speciesEpithet: "onca",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    conservationStatus: "NT",
    category: "mamiferos",
    description:
      "El felino más grande del continente americano y el tercero del mundo. En la península de Yucatán encuentra en la Selva Maya de Calakmul su último gran refugio: un corredor biológico transfronterizo que conecta Campeche con Guatemala y Belice. Depredador tope, regula las poblaciones de pecarí, venado y tepezcuintle; su presencia es indicador de un ecosistema íntegro. En México está catalogado como En Peligro (En) por la NOM-059-SEMARNAT-2010 y su cacería está prohibida desde 1987. La fragmentación del hábitat por la frontera agrícola, los atropellamientos en la carretera Escárcega–Xpujil y el conflicto con la ganadería son sus principales amenazas.",
    habitat:
      "Selva mediana y alta subperennifolia, selva baja inundable y acahuales maduros, entre el nivel del mar y los 900 m. Requiere cuerpos de agua permanentes y territorios extensos —de 25 a más de 100 km² por individuo—, por lo que depende de macizos forestales continuos como el que forman la Reserva de la Biosfera Calakmul y la región de Balam-Kú.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Standing_jaguar.jpg/1280px-Standing_jaguar.jpg",
    regionSlugs: ["calakmul", "candelaria", "champoton", "hopelchen"],
  },
  {
    slug: "mono-aullador-negro",
    commonNameEs: "Mono aullador negro / saraguato",
    genus: "Alouatta",
    speciesEpithet: "pigra",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Mammalia",
    order: "Primates",
    family: "Atelidae",
    conservationStatus: "EN",
    category: "mamiferos",
    description:
      "Primate endémico de la selva del sureste de México, Guatemala y Belice, y una de las especies de mono más grandes del Nuevo Mundo. Su llamado gutural, audible a más de tres kilómetros, delimita el territorio de la tropa al amanecer y al atardecer. Folívoro casi estricto, actúa como dispersor de semillas de higuerones y otras especies clave de la selva. Está catalogado En Peligro por la UICN y por la NOM-059; la tala selectiva, los incendios y el tráfico de crías para mascota han reducido y aislado sus poblaciones en Campeche.",
    habitat:
      "Dosel de selva alta y mediana perennifolia y subperennifolia, selva de galería y manglar alto en la periferia de la Laguna de Términos. Es arborícola casi exclusivo: rara vez desciende al suelo y necesita continuidad del follaje para desplazarse entre parches.",
    imageUrl: null,
    regionSlugs: ["calakmul", "candelaria", "palizada"],
  },
  {
    slug: "tapir-centroamericano",
    commonNameEs: "Tapir centroamericano / danta",
    genus: "Tapirus",
    speciesEpithet: "bairdii",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Mammalia",
    order: "Perissodactyla",
    family: "Tapiridae",
    conservationStatus: "EN",
    category: "mamiferos",
    description:
      "El mamífero terrestre nativo más grande de Mesoamérica, con hasta 300 kg de peso. Pariente lejano de caballos y rinocerontes, es un linaje que ha cambiado poco en millones de años. Herbívoro ramoneador y nadador consumado, dispersa semillas grandes que ninguna otra especie mueve, por lo que se le llama \"jardinero de la selva\". Está catalogado En Peligro por la UICN y en Peligro de Extinción por la NOM-059. Su baja tasa reproductiva —una cría cada dos años— lo hace muy vulnerable a la cacería y a la pérdida de selva.",
    habitat:
      "Selva alta y mediana perennifolia con cuerpos de agua permanentes, bajos inundables (akalché) y pantanos. Depende de aguadas y lagunas para termorregularse y refugiarse; en Campeche se concentra en el bloque forestal de Calakmul y Balam-Kú.",
    imageUrl: null,
    regionSlugs: ["calakmul", "candelaria", "escarcega"],
  },
];

async function main() {
  const creds = resolveDbCredentials();
  console.log(
    `→ Sembrando en ${creds.url}${
      creds.url.startsWith("file:") ? "  (fallback local; sin Turso)" : "  (Turso)"
    }`,
  );

  // Limpieza en orden de dependencias.
  await db.delete(speciesRegions);
  await db.delete(species);
  await db.delete(regions);

  const insertedRegions = await db
    .insert(regions)
    .values(MUNICIPIOS.map((m) => ({ ...m })))
    .returning();
  const regionIdBySlug = new Map(insertedRegions.map((r) => [r.slug, r.id]));
  console.log(`✓ ${insertedRegions.length} municipios`);

  for (const { regionSlugs, ...row } of SPECIES) {
    const [inserted] = await db.insert(species).values(row).returning();
    const links = regionSlugs
      .map((slug) => regionIdBySlug.get(slug))
      .filter((id): id is number => typeof id === "number")
      .map((regionId) => ({ speciesId: inserted.id, regionId }));
    if (links.length) await db.insert(speciesRegions).values(links);
    console.log(`✓ ${inserted.commonNameEs}  ·  ${links.length} municipios`);
  }

  console.log("Seed completado.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
