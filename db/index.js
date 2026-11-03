// Created on first use. Importing this file does not connect; getDb() does, and it needs
// NETLIFY_DB_URL (set by Netlify Database on deploy).
import { drizzle } from "drizzle-orm/netlify-db";
import * as schema from "./schema.js";

export function getDb() {
  return drizzle({ schema });
}

export { schema };
