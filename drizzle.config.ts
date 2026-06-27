import { defineConfig } from "drizzle-kit";
import "dotenv/config";

// Local: a SQLite file (DATABASE_URL=file:./.data/idealailabs.db).
// Production: a libsql:// Turso URL + DATABASE_AUTH_TOKEN. The `turso` dialect
// uses @libsql/client, which handles both file: and libsql: URLs.
export default defineConfig({
  schema: "./lib/server/db/schema.ts",
  out: "./lib/server/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:./.data/idealailabs.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
