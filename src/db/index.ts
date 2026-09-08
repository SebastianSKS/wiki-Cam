import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { resolveDbCredentials } from "./config";
import * as schema from "./schema";

const credentials = resolveDbCredentials();

const client = createClient(credentials);

export const db = drizzle(client, { schema });

export { schema };
