import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { resolveDbCredentials } from "./src/db/config";

// drizzle-kit no carga .env.local automáticamente.
config({ path: ".env.local" });

const credentials = resolveDbCredentials();
const isLocalFile = credentials.url.startsWith("file:");

export default isLocalFile
  ? defineConfig({
      schema: "./src/db/schema.ts",
      out: "./drizzle",
      dialect: "sqlite",
      dbCredentials: { url: credentials.url },
      verbose: true,
      strict: true,
    })
  : defineConfig({
      schema: "./src/db/schema.ts",
      out: "./drizzle",
      dialect: "turso",
      dbCredentials: {
        url: credentials.url,
        authToken: credentials.authToken ?? "",
      },
      verbose: true,
      strict: true,
    });
