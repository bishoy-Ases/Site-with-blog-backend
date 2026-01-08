# Fix: Website Not Loading on Amplify

## Problem Analysis

The website is not loading on aseskahraba.com (AWS Amplify) due to the following issues:

1. **No Database Connection**: The app falls back to SQLite when `DATABASE_URL` is not set
2. **SQLite Incompatibility**: AWS Amplify is serverless and doesn't support `better-sqlite3` file operations
3. **Missing Tables**: The database schema hasn't been initialized
4. **Crash on Startup**: The app crashes when trying to seed settings from missing tables

## Solution

You need to configure PostgreSQL as the production database and set the `DATABASE_URL` environment variable in Amplify.

### Option 1: Using AWS RDS (Recommended for Production)

#### Step 1: Set Up RDS PostgreSQL

Use the existing Terraform configuration:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your settings
terraform init
terraform plan
terraform apply
```

The Terraform will output your `DATABASE_URL`.

#### Step 2: Configure Amplify Environment Variable

1. Go to AWS Amplify Console
2. Select your app (Aseskahraba-commercialwebsite)
3. Go to **Deployment settings** → **Environment variables**
4. Add:
   - **Name**: `DATABASE_URL`
   - **Value**: (from Terraform output or your RDS connection string)
   - Example: `postgresql://user:password@rds-instance.aws.amazonaws.com:5432/database`

5. Add other required variables:
   - `ADMIN_PASSWORD`: (from .env)
   - `SESSION_SECRET`: (from .env)
   - `PORT`: `8081` (Amplify default for backend)

#### Step 3: Run Database Migrations

After RDS is created, run migrations:

```bash
DATABASE_URL="your-connection-string" npm run db:push
```

#### Step 4: Trigger Amplify Rebuild

1. Go to AWS Amplify Console
2. Click **Redeploy app** or push a new commit to trigger rebuild

### Option 2: Using AWS Parameter Store + RDS (Free Tier Optimized)

If you want to reduce costs and use AWS Free Tier:

```bash
cd terraform
# Check FREETIER.md for optimized configuration
terraform apply
```

### Option 3: Quick Fix with External PostgreSQL

If you have an existing PostgreSQL database:

1. Get your connection string: `postgresql://user:password@host:5432/dbname`
2. Add to Amplify environment variables (as described above)
3. Run migrations: `npm run db:push`

## Environment Variables Needed in Amplify

Add these in AWS Amplify Console → Environment variables:

```
DATABASE_URL=postgresql://user:password@host:5432/database
ADMIN_PASSWORD=your_admin_password
SESSION_SECRET=your_secret_key_here
PORT=8081
```

## Verification

After setup:

1. Check Amplify build logs - should complete successfully
2. Visit aseskahraba.com - should load the homepage
3. Check Amplify logs for any runtime errors

## Database Migrations

The migrations run automatically during build via:
- `npm run db:push` in the build script (if needed)
- Or manually after deployment

## Troubleshooting

### Build Fails with "SQLITE_ERROR: no such table"
→ DATABASE_URL not set. Add it to Amplify environment variables.

### Website shows blank page
→ Check Amplify build logs for errors
→ Check if database is accessible from Amplify

### Connection timeout
→ Verify RDS security group allows access from Amplify
→ Check DATABASE_URL format is correct

## Files Modified

- `.env` - Add DATABASE_URL
- `amplify.yml` - Already configured correctly
- Amplify Console - Add environment variables

## Next Steps

1. [ ] Set up PostgreSQL (RDS or external)
2. [ ] Get DATABASE_URL connection string
3. [ ] Add DATABASE_URL to Amplify environment variables
4. [ ] Add other required environment variables
5. [ ] Trigger Amplify rebuild
6. [ ] Verify website loads at aseskahraba.com
