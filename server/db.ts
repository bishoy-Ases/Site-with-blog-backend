import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import pg from "pg";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";

const { Pool } = pg;

let db: any;
let pool: any;

if (process.env.DATABASE_URL) {
  // Use PostgreSQL in production
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
} else {
  // Use SQLite for development (file-based)
  const sqlite = new Database("./dev.db");
  db = drizzleSqlite(sqlite, { schema });
}

export { pool, db };
