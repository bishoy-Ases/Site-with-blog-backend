# AWS Free Tier Build & Deploy Guide

This project builds into `dist/` with:
- Client static assets in `dist/public`
- Server bundle in `dist/index.cjs`

## Free Tier Architecture

### Frontend: AWS Amplify Hosting
**Free tier:** 15 GB data transfer/month, daily builds.

1. In AWS Amplify, connect this GitHub repo and branch.
2. Amplify automatically uses `amplify.yml` for build settings.
3. Runs `npm ci` and `npm run build`, publishes `dist/public` globally.

### Backend: Render or Railway (Recommended)
**AWS-only free tier options are limited** (Lambda refactor required, complex). Instead:

#### Option A: Render.com (Free Tier)
1. Create a free Render account and connect GitHub.
2. Create a new Web Service → select this repo.
3. Environment: `Node`
4. Build command: `npm ci && npm run build`
5. Start command: `npm start`
6. Environment variables:
   - `NODE_ENV=production`
   - `PORT=3000` (Render auto-assigns)
   - `DATABASE_URL=postgres://...`
   - `SESSION_SECRET=<random-string>`
7. Deploy. Free tier includes 1 shared-cpu web service with 0.5 GB RAM.

**Limitation:** Free tier spins down after 15 mins inactivity. Use a cron job to keep awake, or upgrade.

#### Option B: Railway.app (Free Tier + $5/mo credit)
1. Create Railway account and connect GitHub.
2. Create a new service from this repo.
3. Auto-detects Node.js.
4. Set environment variables (same as above).
5. Deploy. Free tier includes $5/month usage credit (covers small server + PostgreSQL).

**Advantage:** Persistent, no spin-down.

## Database: Free PostgreSQL Options

Choose one:

1. **Railway PostgreSQL** (~$0.30/month, paid via credit)
2. **Neon PostgreSQL** (Free tier: 0.5 GB storage, 3 branches) → `DATABASE_URL` provided on signup
3. **Supabase PostgreSQL** (Free tier: 500 MB) → `DATABASE_URL` provided on signup
4. **MongoDB Atlas** (Free tier: 512 MB) → requires schema changes (not recommended)

Set the `DATABASE_URL` env var in your deployment platform.

## Local Build Verification
To verify builds locally (parity with CI):
```bash
npm ci
npm run build
ls -la dist dist/public
npm start
```

## Notes
- Amplify Hosting is AWS free tier (frontend only).
- Express backend requires a compute service; AWS free tier **App Runner** and **ECS** are not free. **Render/Railway are simpler and free-tier friendly.**
- When `DATABASE_URL` is set, app uses PostgreSQL via Drizzle ORM.
- For production uptime, upgrade Render to paid or use Railway's $5/month credit.
- Amplify `amplify.yml` already configured for Node 20 and caching.

## Example: Full Free-Tier Stack
- **Frontend:** Amplify Hosting (15 GB/month free)
- **Backend:** Render free tier (shared CPU)
- **Database:** Neon or Supabase (free tier)
- **Total cost:** $0 (Render will ask to upgrade for persistent uptime after 15 min idle)
