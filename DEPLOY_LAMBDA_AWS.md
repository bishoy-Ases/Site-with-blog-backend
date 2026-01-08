# AWS Serverless Deployment (Lambda + API Gateway + S3 + RDS - Free Tier Only)

Deploy to AWS using **ONLY free tier services** (no Render, no Railway).

## Architecture

```
blog.aseskahraba.com (CloudFront CDN)
├─ Static files → S3
└─ API (/api/*) → Lambda + API Gateway
    └─ Database → RDS PostgreSQL (free tier: db.t3.micro, 12 months)
```

## Free Tier Costs

| Service | Monthly Limit | Cost |
|---------|---------------|------|
| **Lambda** | 1M requests | $0 ✓ |
| **API Gateway** | 1M calls | $0 ✓ |
| **RDS PostgreSQL** | 750 hours/month | $0 ✓ (12 months only) |
| **S3** | 5GB storage | $0 ✓ |
| **CloudFront** | 1GB data transfer | $0 ✓ |
| **Total** | — | **$0/month** (12 months) |

**After 12 months:** ~$10–20/month (RDS moves to paid tier)

## Prerequisites

```bash
# Install AWS tools
npm install -g aws-cli aws-sam-cli

# Configure AWS
aws configure
# Enter: AWS Access Key, Secret Key, Region (us-east-1), Output (json)
```

## Step 1: Build for Lambda

```bash
npm ci
npm run build:lambda
```

Creates:
- `dist/index.js` → Lambda handler
- `dist/public/` → Static files for S3

## Step 2: Deploy Infrastructure (SAM)

```bash
sam deploy --guided
```

**Prompts:**
```
Stack Name: ases-kahraba-stack
Region: us-east-1
DBName: aseskahraba
DBMasterUsername: postgres
DBMasterPassword: <16-char-password>
AdminPassword: <your-admin-password>
DomainName: blog.aseskahraba.com (optional)
Confirm changes: Y
SAM CLI can create IAM roles: Y
```

**Outputs saved:**
- `ApiGatewayEndpoint` → Use for API calls
- `CloudFrontDomain` → Use for DNS CNAME
- `S3BucketName` → Upload static files

## Step 3: Upload Static Files to S3

```bash
# Get values from SAM deployment
S3_BUCKET="ases-kahraba-static-123456789012"
DISTRIBUTION_ID="E123ABC"

# Deploy using script
npm run deploy:s3 $S3_BUCKET $DISTRIBUTION_ID
```

Or manually:

```bash
# Upload static files (cache forever)
aws s3 sync dist/public/ s3://$S3_BUCKET/ \
  --exclude "*.html" \
  --cache-control "max-age=31536000,public"

# Upload HTML (cache 1 hour)
aws s3 cp dist/public/index.html s3://$S3_BUCKET/ \
  --cache-control "max-age=3600,public" \
  --content-type "text/html"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

## Step 4: Configure Client

Update client to use API Gateway endpoint:

```bash
# Rebuild with API endpoint
VITE_API_BASE_URL="https://xxx.execute-api.us-east-1.amazonaws.com/prod" \
npm run build:lambda

# Re-upload to S3
npm run deploy:s3
```

## Step 5: Point DNS to CloudFront

**Option A: Registrar (GoDaddy, Namecheap)**

Add CNAME record:
- **Type:** CNAME
- **Name:** blog
- **Value:** d123abc.cloudfront.net

**Option B: Route53 (AWS)**

```bash
HOSTED_ZONE_ID="Z123ABC"

aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "blog.aseskahraba.com",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "d123abc.cloudfront.net"}]
      }
    }]
  }'
```

## Step 6: Test

```bash
# Test API
curl https://ases-kahraba-api.execute-api.us-east-1.amazonaws.com/prod/api/content

# Test frontend
curl https://blog.aseskahraba.com

# Admin login
# Visit: https://blog.aseskahraba.com/admin
# Email: bishoy@aseskahraba.com
# Password: <ADMIN_PASSWORD>
```

## Monitoring

### View Logs

```bash
# Lambda logs
sam logs --stack-name ases-kahraba-stack --tail

# Or via CloudWatch
aws logs tail /aws/lambda/ases-kahraba-api --follow
```

### Metrics

```bash
# Lambda errors
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Errors \
  --dimensions Name=FunctionName,Value=ases-kahraba-api \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

## Troubleshooting

### Cold Start Latency (3–5 seconds)
- **Cause:** Lambda warm-up time
- **Solution:** Use Lambda provisioned concurrency (paid) or accept cold starts

### API 502 Bad Gateway
- **Cause:** Lambda handler crashed
- **Solution:** Check CloudWatch logs
  ```bash
  sam logs -s ases-kahraba-stack --tail
  ```

### RDS Connection Timeout
- **Cause:** VPC/security group misconfiguration
- **Solution:** Verify Lambda VPC config, RDS security group ingress rules

### Static Files Not Updating
- **Cause:** CloudFront caching
- **Solution:** Invalidate cache
  ```bash
  aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
  ```

## Cleanup

```bash
# Delete entire stack
sam delete --stack-name ases-kahraba-stack

# Or via CloudFormation
aws cloudformation delete-stack --stack-name ases-kahraba-stack
```

## After Free Tier (12 months)

When RDS free tier expires:

### Option 1: Upgrade RDS
- **Cost:** ~$20/month (db.t3.small)
- **Effort:** None (auto-renew)

### Option 2: Switch to Aurora Serverless
- **Cost:** ~$1–5/month (pay-per-request)
- **Effort:** Update connection string

### Option 3: Migrate to DynamoDB
- **Cost:** ~$0.25/month
- **Effort:** High (schema refactoring)

## References

- **SAM Docs:** https://aws.amazon.com/serverless/sam/
- **Lambda Quotas:** https://docs.aws.amazon.com/lambda/latest/dg/limits.html
- **RDS Free Tier:** https://aws.amazon.com/rds/free/
- **CloudFront Pricing:** https://aws.amazon.com/cloudfront/pricing/
