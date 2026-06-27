import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// One libSQL client. Local dev → a SQLite file under .data/. Production → set
// DATABASE_URL=libsql://<db>.turso.io and DATABASE_AUTH_TOKEN (no code change).
const globalForDb = globalThis as unknown as { __idealailabsClient?: Client };

const client =
  globalForDb.__idealailabsClient ??
  createClient({
    url: process.env.DATABASE_URL || "file:./.data/idealailabs.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

if (process.env.NODE_ENV !== "production") globalForDb.__idealailabsClient = client;

export const db = drizzle(client, { schema });
export { schema };
