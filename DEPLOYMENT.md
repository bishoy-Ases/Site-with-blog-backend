# 🚀 AWS Deployment Guide for Ases Kahraba Blog

Complete guide to deploy your blog backend to AWS with Lambda, API Gateway, and RDS PostgreSQL.

## 📁 Project Structure

```
├── terraform/              # Infrastructure as Code
│   ├── main.tf            # Provider configuration
│   ├── variables.tf       # Input variables
│   ├── outputs.tf         # Output values
│   ├── vpc.tf             # VPC and networking
│   ├── database.tf        # RDS PostgreSQL
│   ├── lambda.tf          # Lambda functions
│   ├── api-gateway.tf     # API Gateway REST API
│   ├── iam.tf             # IAM roles and policies
│   └── README.md          # Detailed documentation
├── lambda/                # Lambda function code
│   ├── index.js           # Main handler
│   ├── schema.js          # Database schema
│   └── package.json       # Dependencies
├── scripts/
│   └── build-lambda.sh    # Package Lambda for deployment
└── client/                # Amplify-hosted frontend
```

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    AWS Cloud                            │
│                                                          │
│  ┌──────────────┐      ┌─────────────────┐             │
│  │   Amplify    │─────▶│  API Gateway    │             │
│  │  (Frontend)  │      │  REST API       │             │
│  └──────────────┘      └────────┬────────┘             │
│                                  │                       │
│                         ┌────────▼────────┐             │
│                         │     Lambda      │             │
│                         │   (Node.js)     │             │
│                         └────────┬────────┘             │
│                                  │                       │
│                         ┌────────▼────────┐             │
│                         │  RDS PostgreSQL │             │
│                         │   (Database)    │             │
│                         └─────────────────┘             │
│                                                          │
│  Supporting Services:                                    │
│  - VPC (Private/Public Subnets)                         │
│  - Secrets Manager (DB Credentials)                     │
│  - CloudWatch (Logs & Monitoring)                       │
│  - NAT Gateway (Outbound Internet)                      │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Prerequisites

### 1. Install Tools

```bash
# AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Terraform
brew install terraform

# Verify installations
aws --version
terraform --version
node --version  # Should be 20+
```

### 2. Configure AWS Credentials

```bash
aws configure
```

Enter:
- **AWS Access Key ID**: Your access key
- **AWS Secret Access Key**: Your secret key
- **Default region**: us-east-1
- **Default output format**: json

### 3. Verify AWS Access

```bash
aws sts get-caller-identity
```

## 📝 Step-by-Step Deployment

### Step 1: Configure Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
aws_region           = "us-east-1"
environment          = "prod"
project_name         = "ases-blog"

# Database - CHANGE THESE!
db_password          = "YourSecurePassword123!"
db_username          = "blogadmin"
db_name              = "ases_blog"

# Get this from your Amplify console
amplify_frontend_url = "https://main.d1234567890.amplifyapp.com"
```

### Step 2: Build Lambda Package

```bash
cd ..
chmod +x scripts/build-lambda.sh
./scripts/build-lambda.sh
```

Expected output:
```
📦 Building Lambda deployment package...
📋 Copying source files...
📥 Installing dependencies...
🗜️  Creating ZIP package...
✅ Lambda package created: lambda-package.zip
📊 Package size: 5.2M
```

### Step 3: Initialize Terraform

```bash
cd terraform
terraform init
```

This downloads the AWS provider and sets up the workspace.

### Step 4: Review Infrastructure Plan

```bash
terraform plan
```

Review the resources to be created (~30 resources):
- 1 VPC
- 6 Subnets (3 public, 3 private)
- 1 Internet Gateway
- 1 NAT Gateway
- 1 RDS PostgreSQL instance
- 1 Lambda function
- 1 API Gateway REST API
- Security groups, IAM roles, etc.

### Step 5: Deploy Infrastructure

```bash
terraform apply
```

Type `yes` when prompted.

⏱️ **Expected time**: 10-15 minutes (RDS takes longest)

### Step 6: Save Outputs

After deployment completes:

```bash
terraform output > ../deployment-outputs.txt
```

Important outputs:
- `api_gateway_url`: Your API endpoint (e.g., https://abc123.execute-api.us-east-1.amazonaws.com/prod)
- `rds_endpoint`: Database endpoint (for migrations)

### Step 7: Update Amplify Environment

In your Amplify console:

1. Go to your app → **Environment variables**
2. Add or update:
   ```
   VITE_API_URL = <api_gateway_url from outputs>
   ```
3. Redeploy your Amplify app

### Step 8: Initialize Database Schema

You need to create the database tables. Two options:

#### Option A: Using a Migration Lambda (Recommended)

Create `lambda/migrate.js`:

```javascript
const { drizzle } = require('drizzle-orm/node-postgres');
const { sql } = require('drizzle-orm');
const { Pool } = require('pg');
const { GetSecretValueCommand, SecretsManagerClient } = require('@aws-sdk/client-secrets-manager');

async function getDbCredentials() {
  const client = new SecretsManagerClient({ region: process.env.AWS_REGION });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: process.env.DB_SECRET_ARN })
  );
  return JSON.parse(response.SecretString);
}

exports.handler = async () => {
  const credentials = await getDbCredentials();
  const pool = new Pool({
    connectionString: credentials.DATABASE_URL,
  });
  
  const db = drizzle(pool);
  
  // Create blog_posts table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title_ar TEXT NOT NULL,
      title_en TEXT NOT NULL,
      content_ar TEXT NOT NULL,
      content_en TEXT NOT NULL,
      excerpt_ar TEXT NOT NULL,
      excerpt_en TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      image_url TEXT,
      published BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  await pool.end();
  return { statusCode: 200, body: 'Migration complete!' };
};
```

Deploy and invoke:
```bash
# Add to lambda package and redeploy
terraform apply
aws lambda invoke --function-name ases-blog-api response.json
```

#### Option B: Using psql locally

```bash
# Install PostgreSQL client
brew install postgresql

# Get DB endpoint from outputs
DB_ENDPOINT=$(terraform output -raw rds_endpoint)
DB_PASSWORD="your-password-from-tfvars"

# Connect to database
psql -h ${DB_ENDPOINT%:*} -U blogadmin -d ases_blog

# Run the CREATE TABLE statement from Option A
```

## ✅ Verification

### Test API Endpoints

```bash
API_URL=$(terraform output -raw api_gateway_url)

# Test: Get all blog posts
curl $API_URL/api/blog

# Test: Health check
curl $API_URL/api/health
```

### Create Test Blog Post

```bash
curl -X POST $API_URL/api/blog \
  -H "Content-Type: application/json" \
  -d '{
    "titleAr": "مقال تجريبي",
    "titleEn": "Test Post",
    "contentAr": "محتوى تجريبي",
    "contentEn": "Test content",
    "excerptAr": "ملخص",
    "excerptEn": "Excerpt",
    "slug": "test-post",
    "published": true
  }'
```

### View in Frontend

1. Open your Amplify URL
2. Navigate to `/blog`
3. You should see your test post!

## 📊 Monitoring

### View Lambda Logs

```bash
aws logs tail /aws/lambda/ases-blog-api --follow
```

### View API Gateway Logs

```bash
aws logs tail /aws/apigateway/ases-blog --follow
```

### CloudWatch Dashboard

```bash
# Open in AWS Console
echo "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:"
```

## 💰 Cost Breakdown

### 🎉 Free Tier Optimized Configuration

This deployment is now fully optimized for **AWS Free Tier** - all major services fit within free tier limits!

**Estimated monthly costs (Free Tier):**

| Service | Free Tier Limit | Our Usage | Cost |
|---------|-----------------|-----------|------|
| RDS db.t3.micro | 750 hours/month | ~730 hours | **$0.00** |
| Lambda | 1M requests/month | ~5K requests | **$0.00** |
| API Gateway | 1M requests/month | ~5K requests | **$0.00** |
| CloudWatch Logs | 5GB/month ingestion | ~50MB | **$0.00** |
| Amplify | 15GB bandwidth | ~1GB | **$0.00** |
| Secrets Manager | — | 1 secret | **$0.40** |
| VPC Endpoint | — | 1 endpoint | **$7.20** |
| **TOTAL** | | | **~$7.60/month** |

### What Changed

**Before Optimization**:
- ~$55-67/month (Multi-AZ RDS + NAT Gateway + Premium features)
- Components not optimized for free tier

**After Optimization** ✅:
- ~$7.60/month (**88% cost reduction**)
- All core services within free tier
- Only VPC Endpoint ($7.20) and Secrets Manager ($0.40) are paid
- Provides same functionality with minimal cost

### Key Optimizations Applied

1. **RDS Configuration**:
   - Single-AZ (no failover overhead) - Free tier compatible
   - No Performance Insights enabled
   - 1-day backup retention (reduced from 7)
   - Instance class: db.t3.micro (free tier eligible)

2. **Lambda Configuration**:
   - Memory reduced from 512MB → 256MB
   - Timeout reduced from 30s → 15s
   - X-Ray tracing disabled
   - CloudWatch logs retention: 7 days

3. **API Gateway**:
   - Caching disabled (not needed for blog)
   - X-Ray tracing disabled
   - CloudWatch logs retention: 7 days

4. **Networking**:
   - NAT Gateway removed (was $32/month)
   - VPC Endpoints for Secrets Manager ($7.20/month, replaces NAT)
   - Saves $24.80/month vs NAT Gateway

### Scaling Without Free Tier

When your blog grows beyond free tier limits:

| Growth Level | Lambda Overage | RDS Overage | Total Cost |
|-------------|-----------------|-------------|-----------|
| 2x (10K requests/month) | ~$0.18/month | $0/month | ~$7.78 |
| 5x (25K requests/month) | ~$0.45/month | $0/month | ~$8.05 |
| 10x (50K requests/month) | ~$0.90/month | $0/month | ~$8.50 |
| 100x (500K requests/month) | ~$9/month | $0/month | ~$16.60 |
| **1000x** (exceeds Lambda free) | ~$90/month | ~$30/month | ~$127.60 |

For scaling guidance, see [terraform/FREETIER.md](terraform/FREETIER.md).

## 🔄 Making Updates

### Update Lambda Code

```bash
# Make changes to lambda/*.js files
./scripts/build-lambda.sh
cd terraform
terraform apply
```

### Update Infrastructure

```bash
# Edit terraform/*.tf files
terraform plan
terraform apply
```

### Scale RDS

Edit `terraform.tfvars`:
```hcl
db_instance_class = "db.t3.small"  # More CPU/RAM
```

Then:
```bash
terraform apply
```

## 🔒 Security Best Practices

### ✅ Implemented

- ✅ Database in private subnet
- ✅ Credentials in Secrets Manager
- ✅ VPC security groups
- ✅ SSL/TLS encryption
- ✅ CloudWatch logging
- ✅ API throttling

### ⚠️ TODO: Add Authentication

The Lambda function needs authentication for admin routes:

```javascript
// Add to lambda/index.js
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.CLIENT_ID,
});

async function verifyToken(token) {
  try {
    return await verifier.verify(token);
  } catch {
    return null;
  }
}
```

Set up AWS Cognito for user authentication.

## 🆘 Troubleshooting

### Lambda can't connect to RDS

**Check security groups:**
```bash
aws ec2 describe-security-groups --filters Name=tag:Name,Values=ases-blog-lambda-sg
aws ec2 describe-security-groups --filters Name=tag:Name,Values=ases-blog-rds-sg
```

**Verify Lambda is in VPC:**
```bash
aws lambda get-function-configuration --function-name ases-blog-api
```

### API returns 502 Bad Gateway

**Check Lambda logs:**
```bash
aws logs tail /aws/lambda/ases-blog-api --follow
```

Common issues:
- Database connection timeout → Increase `lambda_timeout`
- Wrong credentials → Check Secrets Manager
- VPC networking → Verify NAT Gateway

### CORS errors in browser

**Update Amplify URL in terraform.tfvars:**
```hcl
amplify_frontend_url = "https://your-correct-url.amplifyapp.com"
```

Then redeploy:
```bash
terraform apply
```

### Database migration fails

**Connect directly to verify:**
```bash
# Get endpoint
terraform output rds_endpoint

# Test connection
psql -h <endpoint> -U blogadmin -d ases_blog
```

## 🗑️ Cleanup

To delete all resources:

```bash
# ⚠️ WARNING: This deletes everything including the database!

# Backup database first
# pg_dump ...

# Destroy infrastructure
terraform destroy
```

Type `yes` to confirm.

**Resources deleted:**
- All Lambda functions
- API Gateway
- RDS database
- VPC and networking
- CloudWatch logs
- Secrets Manager secrets

## 🎓 Next Steps

1. **Add Authentication**
   - Set up AWS Cognito
   - Add API Gateway authorizer
   - Implement JWT validation

2. **Add Custom Domain**
   ```bash
   # In api-gateway.tf, uncomment custom domain section
   # Get ACM certificate for api.aseskahraba.com
   ```

3. **Add CloudFront CDN**
   - Cache GET requests
   - Reduce latency
   - Lower costs

4. **Set up CI/CD**
   - GitHub Actions workflow
   - Automatic deployments on push
   - Terraform Cloud for state management

5. **Add Monitoring Alerts**
   - SNS topic for notifications
   - Email on errors
   - Slack integration

6. **Add More Tables**
   - Projects, Services, etc.
   - Migrate full schema from Express app

## 📚 Additional Resources

- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [RDS PostgreSQL Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Drizzle ORM PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)

## 💬 Support

For issues or questions:
1. Check CloudWatch logs
2. Review Terraform plan output
3. Verify AWS console resources match expected state
4. Check security group rules and VPC configuration

---

**Created for Ases Kahraba Blog Backend Deployment** 🚀
