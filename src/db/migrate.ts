import { config } from "dotenv";
config({ path: ".env.local" });

import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index";
import { resolveDbCredentials } from "./config";

async function main() {
  const creds = resolveDbCredentials();
  console.log(`→ Aplicando migraciones en ${creds.url}`);
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ Migraciones aplicadas.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
