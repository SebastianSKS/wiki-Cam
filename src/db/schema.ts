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
 * CR en peligro crítico · EW extinta en estado silvestre · EX extinta · DD datos insuficientes
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
] as const;
export type ConservationStatus = (typeof CONSERVATION_STATUS)[number];

/** Categorías taxonómicas de catálogo usadas para filtrar el índice. */
export const SPECIES_CATEGORY = [
  "mamiferos",
  "aves",
  "reptiles",
  "flora",
  "marino",
] as const;
export type SpeciesCategory = (typeof SPECIES_CATEGORY)[number];

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
  description: text("description").notNull(),
  /** Descripción cálida y sencilla para niñas y niños. */
  kidDescription: text("kid_description"),
  /** Dato curioso corto, tono de sobremesa. */
  funFact: text("fun_fact"),
  habitat: text("habitat").notNull(),
  imageUrl: text("image_url"),
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
