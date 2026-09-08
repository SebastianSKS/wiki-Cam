import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  species as speciesTable,
  regions as regionsTable,
  type ConservationStatus,
  type SpeciesCategory,
} from "@/db/schema";

export type SpeciesRow = typeof speciesTable.$inferSelect;
export type RegionRow = typeof regionsTable.$inferSelect;

export type SpeciesWithRegions = SpeciesRow & { regions: RegionRow[] };

/** Catálogo completo, ordenado por número de ficha (id). */
export async function getSpeciesCatalog(): Promise<SpeciesWithRegions[]> {
  const rows = await db.query.species.findMany({
    orderBy: [asc(speciesTable.id)],
    with: {
      speciesRegions: {
        with: { region: true },
      },
    },
  });

  return rows.map(({ speciesRegions, ...s }) => ({
    ...s,
    regions: speciesRegions
      .map((sr) => sr.region)
      .sort((a, b) => a.name.localeCompare(b.name, "es")),
  }));
}

export async function getSpeciesBySlug(
  slug: string,
): Promise<SpeciesWithRegions | null> {
  const row = await db.query.species.findFirst({
    where: eq(speciesTable.slug, slug),
    with: {
      speciesRegions: { with: { region: true } },
    },
  });
  if (!row) return null;
  const { speciesRegions, ...s } = row;
  return {
    ...s,
    regions: speciesRegions
      .map((sr) => sr.region)
      .sort((a, b) => a.name.localeCompare(b.name, "es")),
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: speciesTable.slug })
    .from(speciesTable);
  return rows.map((r) => r.slug);
}

export async function getAllRegions(): Promise<RegionRow[]> {
  return db.select().from(regionsTable).orderBy(asc(regionsTable.inegiKey));
}

/** Municipios con las especies registradas en cada uno (para /mapa). */
export async function getRegionsWithSpecies(): Promise<
  (RegionRow & { species: Pick<SpeciesRow, "slug" | "commonNameEs" | "category" | "conservationStatus">[] })[]
> {
  const rows = await db.query.regions.findMany({
    orderBy: [asc(regionsTable.inegiKey)],
    with: {
      speciesRegions: { with: { species: true } },
    },
  });
  return rows.map(({ speciesRegions, ...r }) => ({
    ...r,
    species: speciesRegions
      .map((sr) => ({
        slug: sr.species.slug,
        commonNameEs: sr.species.commonNameEs,
        category: sr.species.category,
        conservationStatus: sr.species.conservationStatus,
      }))
      .sort((a, b) => a.commonNameEs.localeCompare(b.commonNameEs, "es")),
  }));
}

export type CatalogFilters = {
  category?: SpeciesCategory;
  status?: ConservationStatus;
};

export function applyCatalogFilters(
  list: SpeciesWithRegions[],
  { category, status }: CatalogFilters,
): SpeciesWithRegions[] {
  return list.filter(
    (s) =>
      (!category || s.category === category) &&
      (!status || s.conservationStatus === status),
  );
}
