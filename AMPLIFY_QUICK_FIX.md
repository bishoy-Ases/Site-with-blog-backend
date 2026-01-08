# Quick Fix: Website Not Loading on AWS Amplify

## The Root Cause

Your website (aseskahraba.com) is not loading on AWS Amplify because:

1. **Missing DATABASE_URL** - The app needs a PostgreSQL database connection in production
2. **Falls back to SQLite** - Without DATABASE_URL, app tries to use SQLite (dev.db)
3. **SQLite fails in Amplify** - Amplify is serverless and doesn't support file operations
4. **App crashes** - Missing database tables cause initialization errors

## Quick Fix (5 minutes)

### 1. Set Environment Variable in AWS Amplify Console

1. Log in to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Select **Aseskahraba-commercialwebsite**
3. Go to **Deployment settings** (or **App settings**)
4. Click **Environment variables**
5. Add this variable:
   ```
   Key: DATABASE_URL
   Value: (Your PostgreSQL connection string)
   ```

### 2. Get Your PostgreSQL Connection String

**Option A: Using AWS RDS (Recommended)**
```bash
cd ~/Aseskahraba-commercialwebsite/terraform
# Follow setup in DEPLOYMENT.md to create RDS
# Get connection string from Terraform output
```

**Option B: Using Existing PostgreSQL**
```
postgresql://username:password@hostname:5432/database_name
```

### 3. Trigger Rebuild in Amplify

1. AWS Amplify Console → Deployments → **Redeploy this version**
2. OR push a new commit:
   ```bash
   git commit --allow-empty -m "Trigger rebuild with DATABASE_URL"
   git push
   ```

## What Changed?

The app already supports both databases:
- **Development**: SQLite (dev.db) - automatically used when DATABASE_URL not set
- **Production**: PostgreSQL - used when DATABASE_URL is set

No code changes needed! Just set the environment variable.

## Verify It Works

After rebuild completes:
1. Visit aseskahraba.com
2. Should load homepage without errors
3. Check Amplify logs for any remaining issues

## Need PostgreSQL?

If you don't have a PostgreSQL database yet:

### Option 1: AWS RDS Free Tier (Free for 1 year)
```bash
cd ~/Aseskahraba-commercialwebsite/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars
terraform apply
# Copy DATABASE_URL from output
```

### Option 2: Quick Manual Setup
1. Go to AWS RDS Console
2. Create PostgreSQL database (free tier eligible)
3. Configure security group to allow Amplify access
4. Get connection string

### Option 3: External Provider
- ElephantSQL
- Neon
- Railway
- Any PostgreSQL provider

All of these give you a connection string to use.

## Environment Variables Needed

In AWS Amplify → Environment variables, add:

```
DATABASE_URL=postgresql://user:password@host:5432/db
ADMIN_PASSWORD=your_admin_password
SESSION_SECRET=your_secret_here
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| "SQLITE_ERROR: no such table" | DATABASE_URL not set in Amplify |
| "Connection timeout" | RDS security group not configured |
| Blank page | Check Amplify build logs |
| 502 Bad Gateway | App crashed, check logs |

## Files to Check

- `server/db.ts` - Shows how it chooses SQLite vs PostgreSQL
- `.env` - Add DATABASE_URL here locally to test
- `amplify.yml` - Build configuration (already correct)

---

**Summary**: Add DATABASE_URL environment variable to AWS Amplify, then rebuild. That's it!
