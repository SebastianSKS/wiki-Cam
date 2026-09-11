import { copyFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join } from "node:path";
import { drizzle } from "drizzle-orm/libsql";
import { createClient, type Config } from "@libsql/client";
import { resolveDbCredentials } from "./config";
import * as schema from "./schema";

/**
 * En un host serverless (Vercel) el bundle de la función es de solo lectura,
 * así que un `file:` SQLite no se puede abrir en sitio. Copiamos la base
 * empaquetada a /tmp una vez por arranque en frío y la abrimos desde ahí.
 * En local (o con Turso) se usa la URL tal cual.
 */
function resolveClientConfig(): Config {
  const creds = resolveDbCredentials();

  if (creds.url.startsWith("file:") && process.env.VERCEL) {
    const rel = creds.url.slice("file:".length);
    const src = isAbsolute(rel) ? rel : join(process.cwd(), rel);
    const dst = join(tmpdir(), "wiki-camp.db");
    if (existsSync(src) && !existsSync(dst)) copyFileSync(src, dst);
    return { url: `file:${dst}` };
  }

  return creds;
}

const client = createClient(resolveClientConfig());

export const db = drizzle(client, { schema });

export { schema };
