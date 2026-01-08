# Testing & Configuration Guide

## Why Your Site Isn't Loading on Amplify

When you run `npm run build` locally, it builds successfully. But when deployed to Amplify:

1. **No DATABASE_URL environment variable** is set
2. App tries to use SQLite (`dev.db`)  
3. SQLite doesn't work in Amplify's serverless environment
4. App crashes during initialization

## Local Testing

### Test Current Configuration (SQLite - Development)

```bash
# Install dependencies (if not done)
npm ci

# Build
npm run build

# Try to start (will fail without a proper database)
PORT=5000 npm run start
# ERROR: "SQLITE_ERROR: no such table: site_settings"
```

### Test with PostgreSQL (Production-like)

```bash
# 1. Get a PostgreSQL connection string
# From AWS RDS, Neon, Railway, etc.

# 2. Set the environment variable
export DATABASE_URL="postgresql://user:password@host:5432/dbname"

# 3. Create database tables (migrations)
npm run db:push

# 4. Build
npm run build

# 5. Test the app
PORT=5000 npm run start
# Should work! Visit http://localhost:5000
```

## Setting Up PostgreSQL

### Quick Option: Neon (Free, Easy)

1. Go to [neon.tech](https://neon.tech)
2. Create free account
3. Create a new project
4. Copy the connection string
5. Use it as `DATABASE_URL`

### AWS RDS (Using Terraform)

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your settings
nano terraform.tfvars

# Deploy infrastructure
terraform init
terraform plan
terraform apply

# Get DATABASE_URL from output
terraform output database_url
```

### Manual RDS Setup

1. AWS Console → RDS
2. Create database:
   - Engine: PostgreSQL
   - Version: 15.3
   - Free tier eligible
3. Set master username/password
4. Security group: Allow inbound PostgreSQL (5432)
5. Get endpoint: `db-instance-name.xxxxx.rds.amazonaws.com`
6. Connection string: `postgresql://username:password@endpoint:5432/dbname`

## Database Migrations

The app uses Drizzle ORM. To run migrations:

```bash
# Push schema to database
npm run db:push

# Check database status
npm run db:studio  # Visual database explorer (optional)
```

## Deploying to Amplify with PostgreSQL

### Step 1: Set Environment Variables

AWS Amplify Console:
1. Your App → **Deployment settings** → **Environment variables**
2. Add each variable:

```
DATABASE_URL = postgresql://user:password@host:5432/dbname
ADMIN_PASSWORD = your_password
SESSION_SECRET = your_secret_key
```

### Step 2: Run Migrations on RDS

Before deploying, ensure database is ready:

```bash
# Locally
DATABASE_URL="your-production-url" npm run db:push
```

### Step 3: Redeploy Amplify

AWS Amplify Console:
1. Deployments → Select latest
2. **Redeploy this version**

Or push a new commit:
```bash
git commit --allow-empty -m "Trigger Amplify rebuild with DATABASE_URL"
git push origin main
```

## Verifying Deployment

### Check Amplify Logs

```bash
# In AWS Amplify Console
# Deployments → Your deployment → Logs

# Should see:
# "serving on port 8081"  (or Amplify's port)
# No database errors
```

### Test the Website

```bash
# Should load successfully
curl https://aseskahraba.com/

# Check specific endpoints
curl https://aseskahraba.com/api/settings
```

## Database Schema

The app automatically creates/updates tables with Drizzle ORM migrations:

- `site_settings` - Site configuration
- `blog_posts` - Blog articles
- `auth_sessions` - Session data
- Other necessary tables

See `shared/schema.ts` for complete schema.

## Rollback/Troubleshooting

### If Deployment Fails

1. Check Amplify logs for specific error
2. Verify DATABASE_URL format is correct
3. Verify RDS security group allows connections
4. Verify database is running and accessible

### If Website Shows 502 Error

1. Check Amplify logs for exceptions
2. Common issues:
   - Database not running
   - Wrong connection string
   - Database doesn't exist
   - Wrong credentials

### If Database Migrations Fail

```bash
# Check if you can connect to database
psql postgresql://user:password@host:5432/dbname

# If yes, run migrations manually
npm run db:push

# Check Drizzle status
npm run db:studio
```

## Database Backup & Safety

When using RDS:
1. Enable automated backups (AWS default)
2. Set retention period (default 7 days)
3. Manual snapshots before major changes

## Cost Considerations

### Free Tier (12 months)
- AWS RDS: 750 hours/month PostgreSQL db.t3.micro
- AWS Amplify: Free tier with generous limits
- Total cost: **$0** for first year

### After Free Tier
- RDS: ~$10-20/month for db.t3.micro
- Amplify: $0.15/build hour, ~$1-5/month for hosting

Use `terraform/FREETIER.md` to optimize costs.

---

**Summary**: Get a PostgreSQL connection string, add it to Amplify environment variables, rebuild. Your site will load!
