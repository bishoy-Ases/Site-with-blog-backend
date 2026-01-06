import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Handle subdomain routing
  app.use("*", (req, res) => {
    const hostname = req.hostname;

    // Check if this is the shop subdomain
    if (hostname.startsWith('shop.') ||
        hostname === 'shop.aseskahraba.com' ||
        hostname === 'shop.ases') {
      // For shop subdomain, serve the main app but set a flag for client-side routing
      res.sendFile(path.resolve(distPath, "index.html"));
    } else {
      // For main domain, serve the main app
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
