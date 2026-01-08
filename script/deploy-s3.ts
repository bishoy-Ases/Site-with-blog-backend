#!/bin/bash

# Deploy static files from dist/public to AWS S3 + CloudFront
# Usage: node script/deploy-s3.ts <s3-bucket> <cloudfront-distribution-id>

import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import * as mime from "mime-types";

const args = process.argv.slice(2);
const S3_BUCKET = args[0] || process.env.S3_BUCKET;
const CF_DISTRIBUTION = args[1] || process.env.CF_DISTRIBUTION_ID;

if (!S3_BUCKET) {
  console.error("Error: S3_BUCKET not provided. Usage: node deploy-s3.ts <bucket> <distribution-id>");
  process.exit(1);
}

const s3Client = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
const cfClient = CF_DISTRIBUTION ? new CloudFrontClient({ region: "us-east-1" }) : null;

async function deployToS3() {
  const publicDir = path.resolve("dist/public");

  if (!fs.existsSync(publicDir)) {
    console.error(`Error: ${publicDir} not found. Run 'npm run build' first.`);
    process.exit(1);
  }

  const files: string[] = [];

  function walkDir(dir: string, prefix = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const key = `${prefix}${entry.name}`;

      if (entry.isDirectory()) {
        walkDir(fullPath, `${key}/`);
      } else {
        files.push({ fullPath, key });
      }
    }
  }

  walkDir(publicDir);

  console.log(`Uploading ${files.length} files to S3 bucket: ${S3_BUCKET}`);

  let uploaded = 0;

  for (const file of files) {
    const fileContent = fs.readFileSync(file.fullPath);
    const contentType = mime.lookup(file.fullPath) || "application/octet-stream";

    const params = {
      Bucket: S3_BUCKET,
      Key: file.key,
      Body: fileContent,
      ContentType: contentType,
      // Cache static assets for 1 year, HTML for 1 hour
      CacheControl: file.key.endsWith(".html") ? "max-age=3600, public" : "max-age=31536000, public",
    };

    try {
      await s3Client.send(new PutObjectCommand(params as any));
      uploaded++;
      console.log(`✓ Uploaded ${file.key}`);
    } catch (error: any) {
      console.error(`✗ Failed to upload ${file.key}:`, error.message);
    }
  }

  console.log(`\nUploaded ${uploaded}/${files.length} files`);

  // Invalidate CloudFront cache
  if (cfClient && CF_DISTRIBUTION) {
    try {
      console.log(`\nInvalidating CloudFront distribution: ${CF_DISTRIBUTION}`);
      await cfClient.send(
        new CreateInvalidationCommand({
          DistributionId: CF_DISTRIBUTION,
          InvalidationBatch: {
            Paths: {
              Quantity: 2,
              Items: ["/*", "/index.html"],
            },
            CallerReference: String(Date.now()),
          },
        })
      );
      console.log("✓ CloudFront cache invalidated");
    } catch (error: any) {
      console.error("✗ Failed to invalidate CloudFront:", error.message);
    }
  }
}

deployToS3().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
