/**
 * Build script for Lambda deployment
 * Bundles the Express app as a Lambda handler
 * Output: dist/ with:
 *   - dist/index.js (Lambda handler + API)
 *   - dist/public/ (static files for S3)
 */

import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

// server deps to bundle for Lambda
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildForLambda() {
  await rm("dist", { recursive: true, force: true });

  console.log("🔨 Building client for S3...");
  await viteBuild();

  console.log("🔨 Building Lambda handler...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  // Build Lambda handler from server/lambda.ts
  await esbuild({
    entryPoints: ["server/lambda.ts"],
    platform: "node",
    bundle: true,
    format: "esm",
    outfile: "dist/index.js", // SAM expects dist/index.js or dist/index.handler
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  console.log("✅ Build complete!");
  console.log("  - dist/public/ → Upload to S3");
  console.log("  - dist/index.js → Lambda handler");
}

buildForLambda().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
