import { sql, relations } from "drizzle-orm";
import {
  sqliteTable,
  integer,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";

/**
 * Estados de conservación según la UICN.
 * LC menor preocupación · NT casi amenazada · VU vulnerable · EN en peligro
 * CR en peligro crítico · EW extinta en estado silvestre · EX extinta
 * DD datos insuficientes · NE todavía sin evaluar
 */
export const CONSERVATION_STATUS = [
  "LC",
  "NT",
  "VU",
  "EN",
  "CR",
  "EW",
  "EX",
  "DD",
  "NE",
] as const;
export type ConservationStatus = (typeof CONSERVATION_STATUS)[number];

/** Categorías taxonómicas de catálogo usadas para filtrar el índice. */
export const SPECIES_CATEGORY = [
  "mamiferos",
  "aves",
  "reptiles",
  "anfibios",
  "insectos",
  "crustaceos",
  "flora",
  "marino",
] as const;
export type SpeciesCategory = (typeof SPECIES_CATEGORY)[number];

/**
 * Relación de la especie con Campeche.
 * endemic → sólo existe en esta región y en ningún otro lugar del mundo.
 * native  → vive en Campeche pero también en otras partes.
 */
export const PRESENCE_TYPE = ["endemic", "native"] as const;
export type PresenceType = (typeof PRESENCE_TYPE)[number];

export const species = sqliteTable("species", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  commonNameEs: text("common_name_es").notNull(),
  genus: text("genus").notNull(),
  speciesEpithet: text("species_epithet").notNull(),
  kingdom: text("kingdom").notNull(),
  phylum: text("phylum").notNull(),
  class: text("class").notNull(),
  order: text("order").notNull(),
  family: text("family").notNull(),
  conservationStatus: text("conservation_status", {
    enum: CONSERVATION_STATUS,
  }).notNull(),
  category: text("category", { enum: SPECIES_CATEGORY }).notNull(),
  presenceType: text("presence_type", { enum: PRESENCE_TYPE })
    .notNull()
    .default("native"),
  description: text("description").notNull(),
  /** Descripción cálida y sencilla para niñas y niños. */
  kidDescription: text("kid_description"),
  /** Dato curioso corto, tono de sobremesa. */
  funFact: text("fun_fact"),
  /** Nombre en lengua maya, cuando hay fuente que lo documente. */
  mayaName: text("maya_name"),
  /**
   * Lengua maya del nombre, sólo cuando NO es el maya yucateco (que es el
   * de la mayor parte de Campeche y el caso por defecto). Ej.: "chontal"
   * para el suroeste del estado. `null` → yucateco, la ficha rotula
   * simplemente "EN MAYA".
   */
  mayaLanguage: text("maya_language"),
  /**
   * Para especies de mar abierto que no encajan en un municipio de tierra
   * (arrecifes, banco de Campeche): el nombre de la zona marina. Si está
   * presente, la ficha muestra "vive mar adentro, en …" y trata los
   * municipios asociados como "frente a estas costas".
   */
  marineZone: text("marine_zone"),
  habitat: text("habitat").notNull(),
  imageUrl: text("image_url"),
  /**
   * Foto real de la especie: un "extra" que se revela desde la ficha, NO
   * reemplaza la ilustración. Se llena con `scripts/fetch-photos.ts` (API de
   * Wikipedia + Wikimedia Commons). Si `photoUrl` es null, la ficha no muestra
   * el botón "Ver foto real".
   */
  photoUrl: text("photo_url"),
  /** Crédito a mostrar bajo la foto, ej. "Foto: Autor · CC BY-SA 4.0". */
  photoCredit: text("photo_credit"),
  /** Página de origen de la foto (normalmente la ficha de Wikimedia Commons). */
  photoSourceUrl: text("photo_source_url"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

/** Los 13 municipios del estado de Campeche. */
export const regions = sqliteTable("regions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  /** Cabecera municipal. */
  seat: text("seat").notNull(),
  /** Clave municipal INEGI de 3 dígitos. */
  inegiKey: text("inegi_key"),
});

/** Relación muchos-a-muchos: qué especie habita en qué municipio. */
export const speciesRegions = sqliteTable(
  "species_regions",
  {
    speciesId: integer("species_id")
      .notNull()
      .references(() => species.id, { onDelete: "cascade" }),
    regionId: integer("region_id")
      .notNull()
      .references(() => regions.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.speciesId, t.regionId] })],
);

export const speciesRelations = relations(species, ({ many }) => ({
  speciesRegions: many(speciesRegions),
}));

export const regionsRelations = relations(regions, ({ many }) => ({
  speciesRegions: many(speciesRegions),
}));

export const speciesRegionsRelations = relations(speciesRegions, ({ one }) => ({
  species: one(species, {
    fields: [speciesRegions.speciesId],
    references: [species.id],
  }),
  region: one(regions, {
    fields: [speciesRegions.regionId],
    references: [regions.id],
  }),
}));

export type Species = typeof species.$inferSelect;
export type Region = typeof regions.$inferSelect;
