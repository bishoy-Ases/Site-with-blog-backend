import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import pg from "pg";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";

const { Pool } = pg;

let db: any;
let pool: any;

if (process.env.DATABASE_URL) {
  // Use PostgreSQL in production/Lambda
  // Lambda requires connection pooling due to stateless execution
  // RDS Proxy is recommended for Lambda, but free tier alternative is pg-pool with idle timeout
  
  const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    // Lambda settings: low idle timeout to avoid connection exhaustion
    idleTimeoutMillis: process.env.LAMBDA_TASK_ROOT ? 5000 : 30000, // 5s in Lambda, 30s local
    connectionTimeoutMillis: 5000,
    max: process.env.LAMBDA_TASK_ROOT ? 1 : 10, // 1 connection in Lambda (reuse per invocation)
  };
  
  pool = new Pool(poolConfig);

  // Handle Lambda-specific cleanup
  if (process.env.LAMBDA_TASK_ROOT) {
    process.on("exit", () => {
      pool.end();
    });
  }

  db = drizzle(pool, { schema });
} else {
  // Use SQLite for development (file-based)
  const sqlite = new Database("./dev.db");
  db = drizzleSqlite(sqlite, { schema });
}

export { pool, db };
