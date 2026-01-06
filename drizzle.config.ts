import { defineConfig } from "drizzle-kit";

const dbCredentials = process.env.DATABASE_URL
  ? { url: process.env.DATABASE_URL }
  : { url: "./dev.db" };

const dialect = process.env.DATABASE_URL ? "postgresql" : "sqlite";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect,
  dbCredentials,
});
